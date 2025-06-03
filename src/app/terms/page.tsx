'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Terms.module.css';

export default function TermsPage() {
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
              <h1 className={styles.title}>Terms of Service</h1>
              <p className={styles.lastUpdated}>Last updated: January 2025</p>
            </header>

            <div className={styles.content}>
              <section className={styles.section}>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Smart Buy Radar (&quot;smartshoppingradar.com&quot;), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
              </section>

              <section className={styles.section}>
                <h2>2. Use License</h2>
                <p>
                  Permission is granted to temporarily download one copy of the materials on Smart Buy Radar for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul>
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>3. Disclaimer</h2>
                <p>
                  The materials on Smart Buy Radar are provided on an &apos;as is&apos; basis. Smart Buy Radar makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section className={styles.section}>
                <h2>4. Limitations</h2>
                <p>
                  In no event shall Smart Buy Radar or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Smart Buy Radar, even if Smart Buy Radar or an authorized representative has been notified orally or in writing of the possibility of such damage.
                </p>
              </section>

              <section className={styles.section}>
                <h2>5. Privacy Policy</h2>
                <p>
                  Your personal information is governed by our Privacy Policy. Please review our Privacy Policy, which also governs your use of the website, to understand our practices.
                </p>
              </section>

              <section className={styles.section}>
                <h2>6. Governing Law</h2>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
                </p>
              </section>

              <section className={styles.section}>
                <h2>7. Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us through our website.
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