'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Privacy.module.css';

export default function PrivacyPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);
  }, []);

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <article className={styles.article}>
            <header className={styles.header}>
              <h1 className={styles.title}>Privacy Policy</h1>
              <p className={styles.lastUpdated}>Last updated: January 2025</p>
            </header>

            <div className={styles.content}>
              <section className={styles.section}>
                <h2>1. Information We Collect</h2>
                <p>
                  Smart Buy Radar collects information you provide directly to us, such as when you subscribe to our newsletter, contact us, or interact with our content.
                </p>
              </section>

              <section className={styles.section}>
                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Send you newsletters and promotional materials (with your consent)</li>
                  <li>Respond to your comments and questions</li>
                  <li>Analyze how our website is used</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this privacy policy.
                </p>
              </section>

              <section className={styles.section}>
                <h2>4. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. You can control cookie settings through your browser.
                </p>
              </section>

              <section className={styles.section}>
                <h2>5. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section className={styles.section}>
                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt out of marketing communications</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>7. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us through our website.
                </p>
              </section>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
} 