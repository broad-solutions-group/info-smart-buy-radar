'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';
import styles from './Terms.module.css';

export default function TermsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [termsContent, setTermsContent] = useState<string>('');

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);

    // Process terms content with marked
    const processContent = async () => {
      if (attachmentData.agreement) {
        // Replace {sitename} placeholder with actual site name
        const contentWithSiteName = attachmentData.agreement.replace(/{sitename}/g, 'Smart Buy Radar');
        const htmlContent = await marked(contentWithSiteName);
        setTermsContent(htmlContent);
      }
    };

    processContent();
  }, []);

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            <div className={styles.contentMain}>
              <div 
                className={styles.contentBody}
                dangerouslySetInnerHTML={{ __html: termsContent }}
              />
            </div>
            <div className={styles.contentSidebar}>
              <div className={styles.sidebarCard}>
                <h3>Quick Summary</h3>
                <p>These terms outline your rights and responsibilities when using Smart Buy Radar.</p>
              </div>
              <div className={styles.sidebarCard}>
                <h3>Last Updated</h3>
                <p>Our terms are regularly reviewed and updated to ensure they remain current and fair.</p>
              </div>
              <div className={styles.sidebarCard}>
                <h3>Questions?</h3>
                <p>If you have any questions about these terms, please don&apos;t hesitate to contact us.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 