import { Context, Isolate, Reference } from 'isolated-vm'

export async function runCode(code: string, args: unknown[] = []) {
	const isolate = new Isolate({ memoryLimit: 10 })
	const context = await isolate.createContext()

	await initFunctions(context)

	const func = await context.eval(code, { reference: true, timeout: 30 })
	return func.apply(undefined, args, {
		result: {
			promise: true,
			timeout: 30,
			copy: true
		}
	})
}

async function initFunctions(context: Context) {
	const jail = context.global

	await jail.set('fetch', new Reference(
		async (url: string) => {
			const res = await fetch(url)
			return await res.text()
		}
	))
}
