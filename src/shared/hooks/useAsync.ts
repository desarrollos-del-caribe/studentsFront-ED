import { useState, useEffect } from 'react'
import type { LoadingState } from '../types'

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<LoadingState>('idle')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = async () => {
    setState('loading')
    setError(null)
    
    try {
      const result = await asyncFunction()
      setData(result)
      setState('success')
      return result
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error desconocido'))
      setState('error')
      throw err
    }
  }

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [immediate])

  return {
    state,
    data,
    error,
    execute,
    isLoading: state === 'loading',
    isSuccess: state === 'success',
    isError: state === 'error',
  }
}
