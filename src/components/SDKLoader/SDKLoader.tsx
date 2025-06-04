'use client';

import { useEffect, useState } from 'react';

// 扩展 Window 接口
declare global {
  interface Window {
    loadAllTask?: () => void;
    adDocReady?: boolean;
  }
}

interface SDKLoaderProps {
  onSDKLoaded?: () => void;
}

export default function SDKLoader({ onSDKLoaded }: SDKLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查是否已经加载
    if (isLoaded || isLoading) {
      return;
    }

    // 检查脚本是否已经存在
    const existingScript = document.querySelector('script[src*="perfect_sdk_info_mixed"]');
    if (existingScript) {
      console.log('🚀 [SDKLoader] SDK脚本已存在');
      setIsLoaded(true);
      onSDKLoaded?.();
      return;
    }

    console.log('🚀 [SDKLoader] 开始加载SDK脚本');
    setIsLoading(true);
    setError(null);

    // 创建script标签
    const script = document.createElement('script');
    script.src = '/perfect_sdk_info_mixed.js';
    script.async = true;
    script.defer = true;

    // 成功加载处理
    script.onload = () => {
      console.log('🚀 [SDKLoader] SDK脚本加载成功');
      setIsLoaded(true);
      setIsLoading(false);
      
      // 设置全局标志
      if (typeof window !== 'undefined') {
        window.adDocReady = true;
      }
      
      onSDKLoaded?.();
    };

    // 错误处理
    script.onerror = (event) => {
      console.error('🚀 [SDKLoader] SDK脚本加载失败:', event);
      setError('Failed to load SDK script');
      setIsLoading(false);
    };

    // 添加到head
    document.head.appendChild(script);

    // 清理函数
    return () => {
      // 如果组件卸载且脚本还在加载中，移除脚本
      if (script.parentNode && isLoading) {
        script.parentNode.removeChild(script);
      }
    };
  }, [isLoaded, isLoading, onSDKLoaded]);

  // 开发环境下显示加载状态
  if (process.env.NODE_ENV === 'development') {
    if (error) {
      return (
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: '#ff4444', 
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          SDK Error: {error}
        </div>
      );
    }
    
    if (isLoading) {
      return (
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: '#4444ff', 
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          Loading SDK...
        </div>
      );
    }
    
    if (isLoaded) {
      return (
        <div style={{ 
          position: 'fixed', 
          top: 10, 
          right: 10, 
          background: '#44ff44', 
          color: 'white', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 9999
        }}>
          SDK Loaded ✓
        </div>
      );
    }
  }

  // 生产环境下不渲染任何内容
  return null;
} 