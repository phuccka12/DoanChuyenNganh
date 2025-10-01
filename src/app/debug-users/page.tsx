// Test script để debug UsersPage
'use client'

import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '../../lib/database.types'

export default function DebugUsersPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    testQuery();
  }, []);

  const testQuery = async () => {
    try {
      setLoading(true);
      
      console.log('🔄 Testing exact same query as UsersPage...');
      
      // Exact same query as UsersPage
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      console.log('📊 Query result:', { 
        success: !usersError, 
        error: usersError, 
        count: usersData?.length,
        data: usersData 
      });

      setResult({
        success: !usersError,
        error: usersError,
        data: usersData,
        count: usersData?.length
      });

    } catch (err) {
      console.error('❌ Error:', err);
      setResult({
        success: false,
        error: err,
        data: null,
        count: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Debug Users Query</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold">Debug Users Query</h1>
        <p className="text-purple-100 mt-2">Testing exact same query as UsersPage</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Query Result</h2>
        
        <div className={`p-4 rounded mb-4 ${result?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className={`font-semibold ${result?.success ? 'text-green-800' : 'text-red-800'}`}>
            Status: {result?.success ? '✅ Success' : '❌ Failed'}
          </p>
          <p className="text-sm mt-1">
            Count: {result?.count || 0} users found
          </p>
        </div>

        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
            <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
            <pre className="text-sm text-red-700 whitespace-pre-wrap">
              {JSON.stringify(result.error, null, 2)}
            </pre>
          </div>
        )}

        {result?.data && result.data.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Users Data:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border p-2 text-left">ID</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Full Name</th>
                    <th className="border p-2 text-left">Role</th>
                    <th className="border p-2 text-left">Target Exam</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((user: any, index: number) => (
                    <tr key={user.id || index} className="hover:bg-gray-50">
                      <td className="border p-2 font-mono text-xs">{user.id?.slice(0,8)}...</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">{user.full_name}</td>
                      <td className="border p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="border p-2">{user.target_exam || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button 
            onClick={testQuery}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded hover:from-purple-700 hover:to-blue-700"
          >
            🔄 Test Again
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h3 className="font-semibold mb-3">Raw JSON Response:</h3>
        <pre className="text-sm bg-gray-50 p-4 rounded overflow-auto max-h-96 text-black">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    </div>
  );
}