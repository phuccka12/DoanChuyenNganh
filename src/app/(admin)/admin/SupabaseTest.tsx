'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../../lib/database.types'

export default function SupabaseTest() {
  const [status, setStatus] = useState('Testing...')
  const [data, setData] = useState<any>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      console.log('🔄 Testing Supabase connection...')
      
      // Test basic connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (testError) {
        console.error('❌ Connection error:', testError)
        setStatus(`Connection Error: ${testError.message}`)
        return
      }

      console.log('✅ Basic connection successful!')

      // Try to fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(10)

      if (profilesError) {
        console.error('❌ Profiles error:', profilesError)
        setStatus(`Profiles Error: ${profilesError.message}`)
        setData({ error: profilesError })
        return
      }

      console.log('✅ Profiles fetched successfully!', profiles)
      setStatus(`Success! Found ${profiles?.length || 0} profiles`)
      setData(profiles)

    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setStatus(`Unexpected Error: ${error}`)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <p className="font-semibold">Status: {status}</p>
      </div>

      {data && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2">Data from Supabase:</h3>
          <pre className="text-sm bg-gray-50 p-3 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-4">
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Test Again
        </button>
      </div>
    </div>
  )
}