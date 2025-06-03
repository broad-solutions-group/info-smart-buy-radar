'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './NotFound.module.css';

export default function NotFound() {
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
          <div className={styles.content}>
            <div className={styles.illustration}>
              <div className={styles.number}>404</div>
              <div className={styles.icon}>🔍</div>
            </div>
            
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.description}>
              Sorry, we couldn&apos;t find the page you&apos;re looking for. 
              It might have been moved, deleted, or the URL might be incorrect.
            </p>
            
            <div className={styles.actions}>
              <Link href="/" className={styles.homeButton}>
                ← Back to Home
              </Link>
              <Link href="/search" className={styles.searchButton}>
                Search Articles
              </Link>
            </div>
            
            <div className={styles.suggestions}>
              <h2 className={styles.suggestionsTitle}>You might want to try:</h2>
              <ul className={styles.suggestionsList}>
                <li>
                  <Link href="/">Browse our latest articles</Link>
                </li>
                <li>
                  <Link href="/search">Search for specific topics</Link>
                </li>
                <li>Check the URL for typos</li>
                <li>Use the navigation menu above</li>
              </ul>
            </div>
            
            {categories.length > 0 && (
              <div className={styles.categories}>
                <h3 className={styles.categoriesTitle}>Browse by Category</h3>
                <div className={styles.categoriesGrid}>
                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                      className={styles.categoryLink}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 