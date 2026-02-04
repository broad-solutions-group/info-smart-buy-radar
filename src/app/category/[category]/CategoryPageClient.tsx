'use client';

import { Post, Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PostCard from '@/components/PostCard/PostCard';
import styles from './CategoryPage.module.css';
import adsPlaceholderImg from '../../ads_300_250.png';
import Image from 'next/image';

interface CategoryPageClientProps {
  posts: Post[];
  categories: Category[];
  categoryName: string;
  categorySlug: string;
}

export default function CategoryPageClient({
  posts,
  categories,
  categoryName,
  categorySlug
}: CategoryPageClientProps) {
  if (posts.length === 0) {
    return (
      <>
        <Header categories={categories} />
        <div className={styles.notFound}>
          <h1>Category Not Found</h1>
          <p>Sorry, we couldn&apos;t find any articles in this category.</p>
          <a href="/" className={styles.backHome}>← Back to Home</a>
        </div>
          <div className="ad-container">
              <div id="seattle-ad-10004" style={{textAlign: 'center', height: '250px'}}>
                  <div id="seattle-ad-10004-placeholder" style={{
                      display: 'flex',
                      width: '300px',
                      height: '250px',
                      margin: '0 auto',
                      border: '1px solid #ccc',
                      backgroundColor: '#f0f0f0',
                      boxSizing: 'border-box',
                      position: 'relative',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      color: '#999',
                  }}>Advertisement
                  </div>
                  <div id="seattle-ad-10004-content" style={{
                      width: '300px',
                      height: '250px',
                      margin: '0 auto',
                      position: 'relative',
                      top: '-250px',
                      zIndex: 10,
                      visibility: 'hidden',
                  }}></div>
              </div>
          </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Category Header */}
          <header className={styles.header}>
            <nav className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span className={styles.separator}>›</span>
              <span>{categoryName}</span>
            </nav>
            <h1 className={styles.title}>{categoryName}</h1>
            <p className={styles.subtitle}>
              {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
            </p>
          </header>

            <div id="seattle-ad-10001" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                <div style={{marginBottom: '0.2rem'}} className="adTip">Advertisement ▼</div>
                <Image src={adsPlaceholderImg} alt="Advertisement" />
                <div style={{marginTop: '0.2rem'}} className="adTip">Advertisement ▲</div>
            </div>

          {/* Articles Grid */}
          <section className={styles.articlesSection}>
            <div className={styles.articlesGrid}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="default"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
