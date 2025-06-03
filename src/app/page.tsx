'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllPosts, getCategories } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Banner from '@/components/Banner/Banner';
import PostCard from '@/components/PostCard/PostCard';
import styles from './Home.module.css';

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allPosts = getAllPosts();
        const allCategories = getCategories();
        
        setPosts(allPosts);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading Smart Buy Radar...</p>
      </div>
    );
  }

  // Get featured posts (first 3 posts)
  const featuredPosts = posts.slice(0, 3);
  
  // Get posts by category for sections
  const getPostsByCategory = (categoryName: string, limit: number = 4) => {
    return posts.filter(post => post.categoryName === categoryName).slice(0, limit);
  };

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        {/* Hero Banner */}
        <Banner featuredPosts={featuredPosts} />

        {/* Featured Articles Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Articles</h2>
            <div className={styles.featuredGrid}>
              {featuredPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Sections */}
        {categories.map((category) => {
          const categoryPosts = getPostsByCategory(category.name);
          if (categoryPosts.length === 0) return null;

          return (
            <section key={category.id} className={styles.section}>
              <div className={styles.container}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>{category.name}</h2>
                  <Link href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`} className={styles.viewAll}>
                    View All →
                  </Link>
                </div>
                <div className={styles.postsGrid}>
                  {categoryPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}

        {/* Newsletter Section */}
        <section className={styles.newsletter}>
          <div className={styles.container}>
            <div className={styles.newsletterContent}>
              <h2>Stay Updated with Smart Buy Radar</h2>
              <p>Get the latest deals, reviews, and shopping tips delivered to your inbox.</p>
              <form className={styles.newsletterForm}>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
