'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './About.module.css';

// CDN数据源
const ATTACHMENT_DATA_URL = 'https://cdn-info.broadsolutionsgroup.com/articles/website-16/Smart-Buy-Radar-attachment.json';

export default function AboutPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [aboutContent, setAboutContent] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取分类数据
        const allCategories = await getCategories();
        setCategories(allCategories);

        // 获取attachment数据
        const response = await fetch(ATTACHMENT_DATA_URL);
        if (!response.ok) {
          throw new Error(`Failed to fetch attachment data: ${response.status}`);
        }
        const attachmentData = await response.json() as { about?: string };

        // Process about content with marked - 严格使用CDN数据
        if (attachmentData.about && attachmentData.about.trim()) {
          const htmlContent = await marked(attachmentData.about);
          setAboutContent(htmlContent);
        } else {
          // 如果CDN中的about字段为空，显示简单消息
          const emptyContent = `
# About Smart Buy Radar

Content is being updated. Please check back later.
          `;
          const htmlContent = await marked(emptyContent);
          setAboutContent(htmlContent);
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