'use client';

import { useEffect, useState } from 'react';
import { getAllPosts, getCategories } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Banner from '@/components/Banner/Banner';
import AdBanner from '@/components/AdBanner/AdBanner';
import PostCard from '@/components/PostCard/PostCard';
import styles from './Home.module.css';
import ClientEffects from '@/components/ClientEffects/ClientEffects';
import AdPlaceholder from '@/components/AdPlaceholder/AdPlaceholder';
import adsPlaceholderImg from './ads_300_250.png';

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

  // Get featured posts (first 6 posts)
  const featuredPosts = posts.slice(0, 6);
  
  // Get random posts for "For You" section (exclude featured posts)
  const getRandomPosts = (count: number) => {
    const availablePosts = posts.slice(6); // Exclude featured posts
    const shuffled = [...availablePosts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };
  
  const forYouPosts = getRandomPosts(6);
  
  // Get posts by category for sections
  const getPostsByCategory = (categoryName: string, limit: number = 3) => {
    return posts.filter(post => post.categoryName === categoryName).slice(0, limit);
  };

  return (
    <>
      {/* 客户端副作用组件 */}
      <ClientEffects />
      <Header categories={categories} />
      <main className={styles.main}>
        {/* Hero Banner */}
        <Banner featuredPosts={featuredPosts} />

        {/* 广告位 - 使用组件化设计 */}
        <AdPlaceholder 
          id="seattle-ad-10001"
          imageSrc={adsPlaceholderImg}
          alt="Advertisement"
          width={300}
          height={250}
        />

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

        {/* 广告位 - 使用组件化设计 */}
        <AdPlaceholder 
          id="seattle-ad-10002"
          imageSrc={adsPlaceholderImg}
          alt="Advertisement"
          width={300}
          height={250}
        />

        {/* For You Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>For You</h2>
            <div className={styles.featuredGrid}>
              {forYouPosts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </section>

        {/* 广告位 - 使用组件化设计 */}
        <AdPlaceholder 
          id="seattle-ad-10003"
          imageSrc={adsPlaceholderImg}
          alt="Advertisement"
          width={300}
          height={250}
        />

        {/* Categories Sections */}
        {(() => {
          const elements: JSX.Element[] = [];
          let renderedCategoryCount = 0;
          let adIdCounter = 4; // 起始广告ID后缀

          categories.forEach((category) => {
            const categoryPosts = getPostsByCategory(category.name);
            if (categoryPosts.length === 0) {
              return; // 如果分类下没有文章，则不渲染该分类，也不计数
            }

            renderedCategoryCount++;

            // 添加分类板块
            elements.push(
              <div key={category.id}>
                <section className={styles.section}>
                  <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>{category.name}</h2>
                      <a href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`} className={styles.viewAll}>
                        View All →
                      </a>
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
              </div>
            );

            // 如果渲染的分类板块数量是2的倍数，则插入广告
            if (renderedCategoryCount % 2 === 0) {
              elements.push(
                <AdPlaceholder
                  key={`ad-${adIdCounter}`}
                  id={`seattle-ad-1000${adIdCounter}`}
                  imageSrc={adsPlaceholderImg}
                  alt="Advertisement"
                  width={300}
                  height={250}
                />
              );
              adIdCounter++; // 递增广告ID后缀
            }
          });
          return elements;
        })()}


        {/* Search Section */}
        <section className={styles.newsletter}>
          <div className={styles.container}>
            <div className={styles.newsletterContent}>
              <h2>Search Smart Buy Radar</h2>
              <p>Find the product reviews, shopping tips, and deals you need</p>
              <form className={styles.newsletterForm} onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                const query = formData.get('search') as string
                if (query.trim()) {
                  window.location.href = `/search?q=${encodeURIComponent(query.trim())}`
                }
              }}>
                <input 
                  type="text" 
                  name="search"
                  placeholder="Enter search keywords"
                  className={styles.emailInput}
                />
                <button type="submit" className={styles.subscribeBtn}>
                  Search
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
