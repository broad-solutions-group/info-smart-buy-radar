'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';
import styles from './About.module.css';

export default function AboutPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [aboutContent, setAboutContent] = useState<string>('');

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);

    // Process about content with marked
    const processContent = async () => {
      if (attachmentData.about) {
        const htmlContent = await marked(attachmentData.about);
        setAboutContent(htmlContent);
      } else {
        // Fallback content if about is empty
        const fallbackContent = `
# About Smart Buy Radar

Your trusted guide to smart shopping decisions.

## Our Mission

At Smart Buy Radar, we believe that every purchase should be an informed decision. 
Our mission is to empower consumers with the knowledge and tools they need to make 
smart shopping choices that save money, time, and avoid buyer's remorse.

## What We Do

We provide comprehensive shopping advice across four key categories:

### Seasonal Picks
Discover the best deals and must-have items for every season, from summer essentials to winter gear.

### Renters' Essentials
Smart solutions for apartment living, including space-saving furniture and renter-friendly upgrades.

### Coupon Hacks
Insider tips and strategies to maximize your savings with coupons, apps, and cashback programs.

### Budget Upgrades
Affordable ways to improve your lifestyle without breaking the bank.

## Our Approach

We combine thorough research, real-world testing, and consumer feedback to bring you 
honest, practical advice. Our team of shopping experts scours the market to find the 
best deals, highest-quality products, and most innovative solutions.

- **Unbiased Reviews:** We provide honest assessments based on actual testing and research
- **Value-Focused:** Every recommendation considers both quality and price
- **Practical Advice:** Our tips are actionable and easy to implement
- **Consumer-First:** Your best interests always come first

## Why Trust Smart Buy Radar?

With years of experience in consumer research and retail analysis, our team understands 
the shopping landscape from every angle. We stay up-to-date with the latest trends, 
deals, and consumer protection information to ensure our advice is always current and relevant.

## Get in Touch

Have a question about a product or need personalized shopping advice? We'd love to hear from you. 
While we can't respond to every inquiry personally, we read all feedback and use it to improve 
our content and coverage.

Follow us on social media for daily deals, quick tips, and breaking shopping news.
        `;
        const htmlContent = await marked(fallbackContent);
        setAboutContent(htmlContent);
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
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 