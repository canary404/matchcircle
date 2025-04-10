import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  async function handleLogin() {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log('Login result:', data, error)

    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }

    setLoading(false)
  }

  async function handleSignup() {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      alert('Signup successful! You can now log in.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl font-bold">MatchCircle Login</h1>

      <input
        className="border p-2 rounded w-64"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 rounded w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <div className="flex gap-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Logging in…' : 'Log In'}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? 'Signing up…' : 'Sign Up'}
        </button>
      </div>
    </div>
  )
}
