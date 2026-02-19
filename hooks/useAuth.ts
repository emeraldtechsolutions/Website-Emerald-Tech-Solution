import { useState } from 'react'

// Mock hook untuk authentication
// Akan diintegrasikan dengan Supabase di kemudian hari
export function useAuth() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Integrate dengan Supabase Auth
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password,
      // })
      setIsLoading(false)
    } catch (err) {
      setError('Login gagal')
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      // TODO: Integrate dengan Supabase Auth
      setUser(null)
      setIsLoading(false)
    } catch (err) {
      setError('Logout gagal')
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Integrate dengan Supabase Auth
      setIsLoading(false)
    } catch (err) {
      setError('Signup gagal')
      setIsLoading(false)
    }
  }

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    signup,
  }
}
