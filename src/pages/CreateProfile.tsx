import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function CreateProfile() {
  const [name, setName] = useState('')
  const [age, setAge] = useState<number | ''>('')
  const [bio, setBio] = useState('')
  const [values, setValues] = useState<string[]>([])
  const [isForSomeoneElse, setIsForSomeoneElse] = useState(false)
  const [role, setRole] = useState<'single' | 'matchmaker' | 'both'>('single')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const allValues = ['kind', 'funny', 'ambitious', 'calm', 'adventurous']

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const { data: userData } = await supabase.auth.getUser()
    const user = userData?.user

    if (!user) {
      setError('You must be logged in to create a profile.')
      return
    }

    const { error } = await supabase.from('profiles').insert({
      user_id: user.id,
      name,
      age,
      bio,
      values,
      is_for_someone_else: isForSomeoneElse,
      role,
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  function toggleValue(val: string) {
    setValues((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    )
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create a Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 border rounded"
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(Number(e.target.value))}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div>
          <p className="font-semibold mb-1">Core Values</p>
          <div className="flex flex-wrap gap-2 mt-1">
            {allValues.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => toggleValue(val)}
                className={`px-3 py-1 rounded border transition ${
                  values.includes(val)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {values.includes(val) ? '✅ ' : ''}{val}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="forSomeoneElse"
            checked={isForSomeoneElse}
            onChange={(e) => setIsForSomeoneElse(e.target.checked)}
          />
          <label htmlFor="forSomeoneElse">This profile is for someone else</label>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Role</label>
          <select
            className="w-full p-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value as any)}
          >
            <option value="single">Single</option>
            <option value="matchmaker">Matchmaker</option>
            <option value="both">Both</option>
          </select>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
          type="submit"
        >
          Save Profile
        </button>
      </form>
    </div>
  )
}
