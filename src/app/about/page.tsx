'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './About.module.css';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';

// 备用API端点
const ATTACHMENT_DATA_URL = '/api/attachment-data';

export default function AboutPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [aboutContent, setAboutContent] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取分类数据
        const allCategories = await getCategories();
        setCategories(allCategories);

        // 优先使用本地attachment数据
        if (attachmentData.about && attachmentData.about.trim()) {
          const htmlContent = await marked(attachmentData.about);
          setAboutContent(htmlContent);
        } else {
          // 如果本地数据中的about字段为空，尝试从API获取
          try {
            const response = await fetch(ATTACHMENT_DATA_URL);
            if (!response.ok) {
              throw new Error(`Failed to fetch attachment data: ${response.status}`);
            }
            const apiAttachmentData = await response.json() as { about?: string };
            
            if (apiAttachmentData.about && apiAttachmentData.about.trim()) {
              const htmlContent = await marked(apiAttachmentData.about);
              setAboutContent(htmlContent);
            } else {
              throw new Error('No about content available');
            }
          } catch (apiError) {
            console.error('Error fetching attachment data from API:', apiError);
            // 显示默认内容
            const emptyContent = `
# About Smart Buy Radar

Content is being updated. Please check back later.
            `;
            const htmlContent = await marked(emptyContent);
            setAboutContent(htmlContent);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // 错误时显示简单消息
        const errorContent = `
# About Smart Buy Radar

Sorry, we're having trouble loading the content. Please try again later.
        `;
        const htmlContent = await marked(errorContent);
        setAboutContent(htmlContent);
      }
    };

    loadData();
  }, []);

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentMain}>
            <div 
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 