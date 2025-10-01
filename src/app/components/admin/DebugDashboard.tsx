'use client';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DebugDashboard() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();

  const testConnection = async () => {
    setLoading(true);
    try {
      // Test basic connection và tìm dữ liệu ảo
      const { data: allData, error: testError } = await supabase
        .from('profiles')
        .select('*');

      const fakeData = allData?.filter(user => 
        !user.email || 
        user.email.includes('example.com') || 
        user.email.includes('test') ||
        user.email.includes('fake') ||
        !user.full_name ||
        user.full_name.trim() === ''
      ) || [];

      const realData = allData?.filter(user => 
        user.email && 
        !user.email.includes('example.com') && 
        !user.email.includes('test') &&
        !user.email.includes('fake') &&
        user.full_name && 
        user.full_name.trim() !== ''
      ) || [];

      const debugResult = {
        success: !testError,
        error: testError?.message,
        totalCount: allData?.length || 0,
        realDataCount: realData.length,
        fakeDataCount: fakeData.length,
        fakeData: fakeData.slice(0, 5), // Show first 5 fake records
        sampleRealData: realData.slice(0, 3),
        timestamp: new Date().toISOString()
      };

      setDebugInfo(debugResult);
      console.log('Debug result:', debugResult);
    } catch (error) {
      console.error('Connection test failed:', error);
      setDebugInfo({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        totalCount: 0,
        realDataCount: 0,
        fakeDataCount: 0,
        fakeData: [],
        sampleRealData: [],
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const cleanFakeData = async () => {
    if (!debugInfo?.fakeData || debugInfo.fakeData.length === 0) {
      alert('Không có dữ liệu ảo để xóa!');
      return;
    }

    if (!confirm(`Bạn có chắc muốn xóa ${debugInfo.fakeDataCount} records dữ liệu ảo không?`)) {
      return;
    }

    setLoading(true);
    try {
      const fakeIds = debugInfo.fakeData.map((item: any) => item.id);
      
      const { error } = await supabase
        .from('profiles')
        .delete()
        .in('id', fakeIds);

      if (error) throw error;
      
      alert(`Đã xóa thành công ${fakeIds.length} records dữ liệu ảo!`);
      testConnection(); // Refresh data
    } catch (error) {
      console.error('Error cleaning fake data:', error);
      alert('Có lỗi xảy ra khi xóa dữ liệu ảo: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Debug Dashboard</h1>
      
      <div className="space-x-4">
        <button 
          onClick={testConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Database Connection'}
        </button>
        
        {debugInfo?.fakeDataCount > 0 && (
          <button 
            onClick={cleanFakeData}
            disabled={loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Cleaning...' : `Xóa ${debugInfo.fakeDataCount} dữ liệu ảo`}
          </button>
        )}
      </div>

      {debugInfo && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Debug Information:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}