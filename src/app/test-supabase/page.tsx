'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../lib/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function SupabaseTestPage() {
  const [status, setStatus] = useState('Testing...')
  const [profiles, setProfiles] = useState<Profile[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const testConnection = useCallback(async () => {
    try {
      setStatus('🔄 Testing Supabase connection...')
      setError(null)
      
      console.log('🔄 Testing Supabase connection...')
      console.log('Environment variables:', {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      })

      // Try to fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)

      if (profilesError) {
        console.error('❌ Profiles error:', profilesError)
        setStatus('❌ Error fetching profiles')
        setError(`${profilesError.message} (Code: ${profilesError.code})`)
        return
      }

      console.log('✅ Profiles fetched successfully!', profilesData)
      setStatus(`✅ Success! Found ${profilesData?.length || 0} profiles`)
      setProfiles(profilesData)

    } catch (err) {
      console.error('❌ Unexpected error:', err)
      setStatus('❌ Unexpected error occurred')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }, [supabase])

  useEffect(() => {
    testConnection()
  }, [testConnection])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Supabase Connection Test</h1>
        <p className="text-purple-100 mt-2">Testing connection to profiles table</p>
      </div>
      
      <div className="grid gap-6">
        {/* Status Card */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-3">Connection Status</h2>
          <p className="text-lg">{status}</p>
          
          {error && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}
        </div>

        {/* Profiles Data */}
        {profiles && profiles.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Profiles Data ({profiles.length} found)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Full Name</th>
                    <th className="text-left p-2">Role</th>
                    <th className="text-left p-2">Target Exam</th>
                    <th className="text-left p-2">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((profile) => (
                    <tr key={profile.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-mono text-xs">{profile.id.slice(0, 8)}...</td>
                      <td className="p-2">{profile.email}</td>
                      <td className="p-2">{profile.full_name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          profile.role === 'admin' ? 'bg-red-100 text-red-800' :
                          profile.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {profile.role}
                        </span>
                      </td>
                      <td className="p-2">{profile.target_exam || 'N/A'}</td>
                      <td className="p-2 text-xs">{profile.created_at?.slice(0, 10) || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Raw JSON Data */}
        {profiles && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Raw JSON Data</h2>
            <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto max-h-96 text-black">
              {JSON.stringify(profiles, null, 2)}
            </pre>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <button 
            onClick={testConnection}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium"
          >
            🔄 Test Connection Again
          </button>
        </div>
      </div>
    </div>
  )
}