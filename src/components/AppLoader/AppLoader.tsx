'use client';

import { useEffect, useState, useCallback } from 'react';
import SDKLoader from '../SDKLoader/SDKLoader';

// 扩展 Window 接口
declare global {
  interface Window {
    loadAllTask?: () => void;
    adDocReady?: boolean;
  }
}

interface AppLoaderProps {
  children: React.ReactNode;
}

export default function AppLoader({ children }: AppLoaderProps) {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [appInitialized, setAppInitialized] = useState(false);

  // SDK加载完成回调
  const handleSDKLoaded = useCallback(() => {
    console.log('🎯 [AppLoader] SDK加载完成');
    setSdkLoaded(true);
  }, []);

  // 尝试初始化应用
  const tryInitializeApp = useCallback(() => {
    if (!sdkLoaded) {
      console.log('🎯 [AppLoader] SDK未加载，等待中...');
      return false;
    }

    console.log('🎯 [AppLoader] 尝试初始化应用');
    
    if (typeof window !== 'undefined') {
      // 设置adDocReady标志
      window.adDocReady = true;
      
      // 尝试调用loadAllTask
      if (typeof window.loadAllTask === 'function') {
        try {
          console.log('🎯 [AppLoader] 调用 window.loadAllTask()');
          window.loadAllTask();
          console.log('🎯 [AppLoader] 应用初始化成功');
          setAppInitialized(true);
          return true;
        } catch (error) {
          console.error('🎯 [AppLoader] 应用初始化失败:', error);
          return false;
        }
      } else {
        console.log('🎯 [AppLoader] window.loadAllTask 不可用，延迟初始化');
        return false;
      }
    }
    
    return false;
  }, [sdkLoaded]);

  // 监听SDK加载状态变化
  useEffect(() => {
    if (!sdkLoaded) {
      return;
    }

    // SDK加载完成后，尝试初始化应用
    if (tryInitializeApp()) {
      return; // 初始化成功，直接返回
    }

    // 如果初始化失败，设置重试机制
    console.log('🎯 [AppLoader] 设置应用初始化重试机制');
    let retryCount = 0;
    const maxRetries = 20; // 最多重试20次
    const retryInterval = 200; // 每200ms重试一次

    const retryTimer = setInterval(() => {
      retryCount++;
      console.log(`🎯 [AppLoader] 应用初始化重试第 ${retryCount} 次`);
      
      if (tryInitializeApp()) {
        console.log('🎯 [AppLoader] 应用初始化重试成功');
        clearInterval(retryTimer);
      } else if (retryCount >= maxRetries) {
        console.log('🎯 [AppLoader] 达到最大重试次数，停止重试');
        clearInterval(retryTimer);
        // 即使初始化失败，也允许应用继续运行
        setAppInitialized(true);
      }
    }, retryInterval);

    return () => {
      clearInterval(retryTimer);
    };
  }, [sdkLoaded, tryInitializeApp]);

  return (
    <>
      {/* SDK加载器 */}
      <SDKLoader onSDKLoaded={handleSDKLoaded} />
      
      {/* 开发环境下显示加载状态 */}
      {process.env.NODE_ENV === 'development' && !appInitialized && (
        <div style={{ 
          position: 'fixed', 
          top: 50, 
          right: 10, 
          background: '#ff8800', 
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          App Initializing...
        </div>
      )}
      
      {/* 应用内容 */}
      {children}
    </>
  );
} 