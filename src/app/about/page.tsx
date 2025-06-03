'use client';

import { useEffect, useState } from 'react';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './About.module.css';

export default function AboutPage() {
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
              <h1 className={styles.title}>About Smart Buy Radar</h1>
              <p className={styles.subtitle}>Your trusted guide to smart shopping decisions</p>
            </header>

            <div className={styles.content}>
              <section className={styles.section}>
                <h2>Our Mission</h2>
                <p>
                  At Smart Buy Radar, we believe that every purchase should be an informed decision. 
                  Our mission is to empower consumers with the knowledge and tools they need to make 
                  smart shopping choices that save money, time, and avoid buyer&apos;s remorse.
                </p>
              </section>

              <section className={styles.section}>
                <h2>What We Do</h2>
                <p>
                  We provide comprehensive shopping advice across four key categories:
                </p>
                <div className={styles.categoryGrid}>
                  <div className={styles.categoryCard}>
                    <h3>Seasonal Picks</h3>
                    <p>Discover the best deals and must-have items for every season, from summer essentials to winter gear.</p>
                  </div>
                  <div className={styles.categoryCard}>
                    <h3>Renters&apos; Essentials</h3>
                    <p>Smart solutions for apartment living, including space-saving furniture and renter-friendly upgrades.</p>
                  </div>
                  <div className={styles.categoryCard}>
                    <h3>Coupon Hacks</h3>
                    <p>Insider tips and strategies to maximize your savings with coupons, apps, and cashback programs.</p>
                  </div>
                  <div className={styles.categoryCard}>
                    <h3>Budget Upgrades</h3>
                    <p>Affordable ways to improve your lifestyle without breaking the bank.</p>
                  </div>
                </div>
              </section>

              <section className={styles.section}>
                <h2>Our Approach</h2>
                <p>
                  We combine thorough research, real-world testing, and consumer feedback to bring you 
                  honest, practical advice. Our team of shopping experts scours the market to find the 
                  best deals, highest-quality products, and most innovative solutions.
                </p>
                <ul className={styles.principles}>
                  <li><strong>Unbiased Reviews:</strong> We provide honest assessments based on actual testing and research</li>
                  <li><strong>Value-Focused:</strong> Every recommendation considers both quality and price</li>
                  <li><strong>Practical Advice:</strong> Our tips are actionable and easy to implement</li>
                  <li><strong>Consumer-First:</strong> Your best interests always come first</li>
                </ul>
              </section>

              <section className={styles.section}>
                <h2>Why Trust Smart Buy Radar?</h2>
                <p>
                  With years of experience in consumer research and retail analysis, our team understands 
                  the shopping landscape from every angle. We stay up-to-date with the latest trends, 
                  deals, and consumer protection information to ensure our advice is always current and relevant.
                </p>
              </section>

              <section className={styles.section}>
                <h2>Get in Touch</h2>
                <p>
                  Have a question about a product or need personalized shopping advice? We&apos;d love to hear from you. 
                  While we can&apos;t respond to every inquiry personally, we read all feedback and use it to improve 
                  our content and coverage.
                </p>
                <p>
                  Follow us on social media for daily deals, quick tips, and breaking shopping news.
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