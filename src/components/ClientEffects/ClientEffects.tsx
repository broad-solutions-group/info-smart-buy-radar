'use client';

import { useEffect } from 'react';

// 扩展 Window 接口
declare global {
  interface Window {
    loadAllTask?: () => void;
    adDocReady?: boolean;
  }
}

export default function ClientEffects() {
  useEffect(() => {
    console.log('🎨 [ClientEffects] 组件已挂载');
    
    // 监听应用初始化状态
    const checkAppStatus = () => {
      if (typeof window !== 'undefined') {
        console.log('🎨 [ClientEffects] 检查应用状态:', {
          adDocReady: window.adDocReady,
          loadAllTask: typeof window.loadAllTask
        });
      }
    };

    // 立即检查一次
    checkAppStatus();

    // 设置定期检查（仅在开发环境）
    let statusInterval: NodeJS.Timeout | null = null;
    if (process.env.NODE_ENV === 'development') {
      statusInterval = setInterval(checkAppStatus, 5000);
    }

    // 清理函数
    return () => {
      console.log('🎨 [ClientEffects] 组件即将卸载');
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, []);

  // 这个组件不渲染任何UI
  return null;
} 