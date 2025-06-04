'use client';

import { useEffect, useState } from 'react';

// 扩展 Window 接口
declare global {
  interface Window {
    loadAllTask?: () => void;
    adDocReady?: boolean;
  }
}

export default function TestSDKPage() {
  const [sdkStatus, setSdkStatus] = useState({
    adDocReady: false,
    loadAllTaskExists: false,
    lastCheck: new Date().toLocaleTimeString()
  });

  const checkSDKStatus = () => {
    if (typeof window !== 'undefined') {
      setSdkStatus({
        adDocReady: !!window.adDocReady,
        loadAllTaskExists: typeof window.loadAllTask === 'function',
        lastCheck: new Date().toLocaleTimeString()
      });
    }
  };

  useEffect(() => {
    // 立即检查一次
    checkSDKStatus();

    // 每秒检查一次
    const interval = setInterval(checkSDKStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleManualCall = () => {
    if (typeof window !== 'undefined' && window.loadAllTask) {
      try {
        console.log('🧪 [TestSDK] 手动调用 window.loadAllTask()');
        window.loadAllTask();
        alert('loadAllTask() 调用成功！');
      } catch (error) {
        console.error('🧪 [TestSDK] loadAllTask() 调用失败:', error);
        alert('loadAllTask() 调用失败: ' + error);
      }
    } else {
      alert('loadAllTask 函数不可用');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>SDK 加载测试页面</h1>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h2>SDK 状态</h2>
        <p><strong>adDocReady:</strong> {sdkStatus.adDocReady ? '✅ true' : '❌ false'}</p>
        <p><strong>loadAllTask 存在:</strong> {sdkStatus.loadAllTaskExists ? '✅ true' : '❌ false'}</p>
        <p><strong>最后检查时间:</strong> {sdkStatus.lastCheck}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkSDKStatus}
          style={{
            padding: '10px 20px',
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          刷新状态
        </button>
        
        <button 
          onClick={handleManualCall}
          disabled={!sdkStatus.loadAllTaskExists}
          style={{
            padding: '10px 20px',
            backgroundColor: sdkStatus.loadAllTaskExists ? '#28a745' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: sdkStatus.loadAllTaskExists ? 'pointer' : 'not-allowed'
          }}
        >
          手动调用 loadAllTask()
        </button>
      </div>

      <div style={{ 
        background: '#e9ecef', 
        padding: '15px', 
        borderRadius: '8px',
        fontSize: '12px'
      }}>
        <h3>说明</h3>
        <ul>
          <li>此页面用于测试 perfect_sdk_info_mixed.js 的加载状态</li>
          <li>SDK 应该在应用启动时自动加载</li>
          <li>加载成功后，adDocReady 应该为 true，loadAllTask 函数应该可用</li>
          <li>可以手动调用 loadAllTask() 来测试功能</li>
        </ul>
      </div>
    </div>
  );
} 