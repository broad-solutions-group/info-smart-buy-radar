'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Privacy.module.css';

// CDN数据源
const ATTACHMENT_DATA_URL = 'https://cdn-info.broadsolutionsgroup.com/articles/website-16/Smart-Buy-Radar-attachment.json';

export default function PrivacyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [privacyContent, setPrivacyContent] = useState<string>('');

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
        const attachmentData = await response.json() as { privacy?: string };

        // Process privacy content with marked
        if (attachmentData.privacy) {
          // Replace {sitename} placeholder with actual site name
          const contentWithSiteName = attachmentData.privacy.replace(/{sitename}/g, 'Smart Buy Radar');
          const htmlContent = await marked(contentWithSiteName);
          setPrivacyContent(htmlContent);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // 设置默认内容
        const defaultContent = `
# Privacy Policy

We respect your privacy and are committed to protecting your personal information.

## Information We Collect

We may collect information you provide directly to us, such as when you contact us or subscribe to our newsletter.

## How We Use Your Information

We use the information we collect to provide, maintain, and improve our services.

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties.

## Contact Us

If you have any questions about this Privacy Policy, please contact us.
        `;
        const htmlContent = await marked(defaultContent);
        setPrivacyContent(htmlContent);
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
              dangerouslySetInnerHTML={{ __html: privacyContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 