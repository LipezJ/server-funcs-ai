import { FunctionDB } from "@/db/functions"
import { runCode } from "@/lib/ejecutor"

export interface FunctionResult {
  result: string
  type: string
}

export async function runFunction(id: string | undefined, args: string | undefined): Promise<FunctionResult> {
  if (!id) {
    throw new Error ('Function id is required')
  }

  const func = await FunctionDB.getFunction(id)
  if (!func) {
    throw new Error ('Function not found')
  }

  if (func.params > 0 && !args) {
    throw new Error ('Function arguments are required')
  }
  const parsedArgs = args ? JSON.parse(args) : []

  if (parsedArgs.length !== func.params) {
    throw new Error ('Invalid number of arguments')
  }

  try {
    const result = await runCode(func.code, parsedArgs)

    if (func.type === 'html' && typeof result !== 'string') {
      throw new Error ('Invalid html')
    }

    return { result: result as string, type: func.type }
  } catch (e: any) {
    throw new Error (e.message)
  }
}

export async function addFunction(
  id: string, code: string, type: string, params: number = 0
) {
  if (!id || !code || !type) {
    return {
      message: 'Function id, code and type are required'
    }
  }

  if (!(type === 'json' || type === 'html')) {
    return {
      message: 'Invalid function type'
    }
  }

  try {
    const result = await FunctionDB.addFunction({ id, code, type, params })
    if (!result) {
      return {
        message: 'Function already exists'
      }
    }
  } catch {
    return {
      message: 'Error adding function'
    }
  }

  return {
    message: 'Function added'
  }
}
