'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';
import styles from './Privacy.module.css';

export default function PrivacyPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [privacyContent, setPrivacyContent] = useState<string>('');

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);

    // Process privacy content with marked
    const processContent = async () => {
      if (attachmentData.privacy) {
        // Replace {sitename} placeholder with actual site name
        const contentWithSiteName = attachmentData.privacy.replace(/{sitename}/g, 'Smart Buy Radar');
        const htmlContent = await marked(contentWithSiteName);
        setPrivacyContent(htmlContent);
      }
    };

    processContent();
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