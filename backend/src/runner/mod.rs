mod functions;

use std::ffi::c_void;

use functions::init_functions;
use v8::{ContextScope, HandleScope, IsolateHandle, Local, Script, TryCatch, Value};

use crate::{HEAP_LIMITS, POOL_SIZE};

/// Inicializa el entorno de ejecución de V8.
pub fn init_ejecutor() {
  let platform = v8::new_default_platform(POOL_SIZE, false)
    .make_shared();
  v8::V8::initialize_platform(platform);
  v8::V8::initialize();
}

/// Executes a JavaScript function in an isolated V8 environment with the arguments
/// dice and a time limit.
/// 
/// # Arguments
/// * `code` - The JavaScript code to execute as a String.
/// * `args` - The arguments for the JavaScript function as a JSON String.
/// * `timeout_ms` - The execution time limit in milliseconds.
/// 
/// # Returns
/// A Result with the function output as a String on success,
/// or an error message as a String on failure.
/// # Example
/// 
/// ``` rust
/// let code = r#"
///   async function hello(name) {
///     return "Hello " + name;
///   }
///   hello;
/// "#.to_string();
/// 
/// let args = "World!"
/// 
/// match run(code, args, TIMEOUT) {
/// 	Ok(value) => println!("Result: {}", value),
/// 	Err(error) => println!("Error: {}", error)
/// }
/// ```
pub fn run(code: String, args: String, timeout_ms: u64) -> Result<String, String> {
  let duration = std::time::Duration::from_millis(timeout_ms);
	let (send , rcv) = std::sync::mpsc::channel();

	std::thread::spawn(move || {
		send.send(run_function(code.as_str(), args.as_str()))
	});

	match rcv.recv_timeout(duration) {
		Ok(result) => {
      match result {
        Ok(result) => Ok(result),
        Err(e) => Err(e)
      }
    },
		Err(_) => Err("Timeout error".to_string())
	}
}

/// Executes a JavaScript function in an isolated V8 environment.
/// 
/// # Arguments
/// * `code` - The JavaScript code that defines the function to execute.
/// * `args` - The arguments for the JavaScript function as a JSON string.
/// 
/// # Returns
/// A Result with the function output as a String on success,
/// or an error message as a String on failure.
pub fn run_function(code: &str, args: &str) -> Result<String, String> {
  let (init_heap_limit, max_heap_limit) = HEAP_LIMITS;
  let params = v8::CreateParams::default()
    .heap_limits(init_heap_limit, max_heap_limit);

  let isolate = &mut v8::Isolate::new(params);
  let handle = isolate.thread_safe_handle();

  let heap_context = Box::new(HeapContext {
    handle: handle.clone(),
  });
  let heap_ctx_ptr = Box::into_raw(heap_context);

  isolate.add_near_heap_limit_callback(
    near_heap_limit_callback, 
    heap_ctx_ptr as *mut c_void
  );

  let handle_scope = &mut v8::HandleScope::new(isolate);
  let context = v8::Context::new(handle_scope, Default::default());
  let scope = &mut v8::ContextScope::new(handle_scope, context);

  init_functions(scope, context);

  let func = create_function(scope, code)?;
  
  let args = v8::String::new(scope, args).unwrap();
  let args = match v8::json::parse(scope, args) {
    Some(args) => args,
    None => return Err("Parametros incompatibles".to_string())
  };

  execute_function(scope, func, &[args])
}

/// Creates a JavaScript function from the provided code.
/// 
/// # Arguments
/// * `scope` - The V8 context scope.
/// * `code` - The JavaScript code that defines the function.
/// 
/// # Returns
/// A Result with the compiled JavaScript function on success,
/// or an error message as a String on failure.
pub fn create_function<'a>(
  scope: &mut ContextScope<'a, HandleScope>,
  code: &str,
) -> Result<Local<'a, v8::Function>, String> {
  let mut try_catch = TryCatch::new(scope);
  let source = v8::String::new(&mut try_catch, code).unwrap();

  let script = Script::compile(&mut try_catch, source, None)
    .ok_or_else(|| format!("Error compiling script: {:?}", try_catch.exception()))?;

  let result = script.run(&mut try_catch)
    .ok_or_else(|| format!("Error running script: {:?}", try_catch.exception()))?;

  v8::Local::<v8::Function>::try_from(result)
    .map_err(|e| format!("The result is not a function: {:?}", e))
}

/// Executes a JavaScript function and handles its result.
/// 
/// # Arguments
/// * `scope` - The V8 context scope.
/// * `func` - The JavaScript function to execute.
/// * `args` - The arguments for the function.
/// 
/// # Returns
/// A Result with the function output as a String on success,
/// or an error message as a String on failure.
pub fn execute_function<'a>(
  scope: &mut ContextScope<'a, HandleScope>,
  func: Local<'a, v8::Function>,
  args: &[Local<'a, Value>],
) -> Result<String, String> {
  let mut try_catch = TryCatch::new(scope);
  let global = try_catch.get_current_context().global(&mut try_catch);

  let promise = func.call(&mut try_catch, global.into(), args)
    .ok_or_else(|| format!("Error executing function: {:?}", try_catch.exception()))?;

  let promise = v8::Local::<v8::Promise>::try_from(promise)
    .map_err(|e| format!("The result is not a promise: {:?}", e))?;

  while promise.state() == v8::PromiseState::Pending {
    let _ = &mut try_catch.perform_microtask_checkpoint();
  }

  match promise.state() {
    v8::PromiseState::Fulfilled => {
      let result = promise.result(&mut try_catch);

      if result.is_object() {
        let object = v8::json::stringify(&mut try_catch, result).unwrap();
        Ok(object.to_rust_string_lossy(&mut try_catch))
      } else {
        Ok(result.to_rust_string_lossy(&mut try_catch))
      }
    }
    v8::PromiseState::Rejected => Err(format!(
      "Promise rejected: {:?}",
      promise.result(&mut try_catch).to_rust_string_lossy(&mut try_catch)
    )),
    v8::PromiseState::Pending => unreachable!(),
  }
}

/// Structure to handle the V8 heap context.
struct HeapContext {
  handle: IsolateHandle,
}

/// Callback that is called when the V8 heap approaches its limit.
extern "C" fn near_heap_limit_callback(
  data: *mut c_void,
  current_heap_limit: usize,
  _initial_heap_limit: usize,
) -> usize {
  let heap_ctx = unsafe { &mut *(data as *mut HeapContext) };
  let _ = heap_ctx.handle.terminate_execution();

  current_heap_limit * 2
}
