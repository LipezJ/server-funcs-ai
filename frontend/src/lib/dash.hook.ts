import { createContext, useEffect, useState } from "react"

interface FunctionData {
  func_id: string
  code: string
  type: string
}

interface FunctionContextProps {
  func: FunctionData,
  upgradable: boolean
  setCode: (code: string) => void
  setType: (type: string) => void
  deploy: () => void
  isDeploying: boolean
}

const Context = createContext<FunctionContextProps>({
  func: {
    func_id: '',
    code: '',
    type: ''
  },
  upgradable: false,
  setCode: () => { },
  setType: () => { },
  deploy: () => { },
  isDeploying: false
})

const getFunction = async (id: string) => {
  const params = new URLSearchParams({ id })
  const res = await fetch(`/api/functions?${params}`)
  const data = await res.json()

  return data
}

export default function useDashboard(id: string) {
  const [func, setFunc] = useState<FunctionData>({
    func_id: '',
    code: '',
    type: ''
  })
  const [ isDeploying, setIsDeploying ] = useState(false)
  const [ upgradable, setUpgradable ] = useState(false)

  useEffect(() => {
    getFunction(id)
      .then(data => setFunc(data))
  }, [id])

  const deploy = () => {
    if (isDeploying) return
    if (!upgradable) return

    setIsDeploying(true)

    fetch('/api/functions/', {
      method: 'PATCH',
      body: JSON.stringify(func),
    }).then(res => {
      if (res.ok) {
        alert('Deployed!')
      } else {
        alert('Failed to deploy')
      }
    }).catch(err => {
      // TODO: handle error
    }).finally(() => {
      setIsDeploying(false)
    })
  }

  const setCode = (code: string) => {
    setUpgradable(code !== func.code)
    setFunc(prev => ({ ...prev, code }))
  }

  const setType = (type: string) => {
    setUpgradable(type !== func.type)
    setFunc(prev => ({ ...prev, type }))
  }

  return { 
    state: {
      func, setCode, setType, upgradable, deploy, isDeploying: isDeploying
    }, 
    Context 
  }
}

export { Context as FunctionContext }
