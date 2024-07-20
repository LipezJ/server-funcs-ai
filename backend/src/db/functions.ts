export default interface Function {
  id: string
  code: string
  type: 'json' | 'html'
  params: number
}

export class FunctionDB {

  private static functions: Function[]
  
  static {
    this.functions = []
  }

  static async addFunction(func: Function) {
    if (!FunctionDB.getFunction(func.id)) {
      return false
    }

    FunctionDB.functions.push(func)
    return true
  }

  static async getFunction(id: string) {
    return FunctionDB.functions.find(f => f.id === id)
  }
}
