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
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>Terms of Service</h1>
              <p className={styles.subtitle}>Please read these terms carefully before using our services</p>
            </header>

            <div 
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: termsContent }}
            />
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
} 