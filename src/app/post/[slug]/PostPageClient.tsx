'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Post, Category } from '@/lib/slices/postsSlice';
import { getCategorySlug } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import RecommendationSidebar from '@/components/RecommendationSidebar/RecommendationSidebar';
import AdBanner from '@/components/AdBanner/AdBanner';
import styles from './PostPage.module.css';
import AdPlaceholder from '@/components/AdPlaceholder/AdPlaceholder';
import adsPlaceholderImg from '../../ads_300_250.png';

interface PostPageClientProps {
  post: Post;
  relatedPosts: Post[];
  categories: Category[];
}

export default function PostPageClient({ post, relatedPosts, categories }: PostPageClientProps) {
  const [sidebarFixed, setSidebarFixed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // 只在PC端处理侧边栏固定逻辑
      if (window.innerWidth <= 1024) {
        setSidebarFixed(true);
        return;
      }

      const footer = document.querySelector('footer');
      const sidebar = document.querySelector('aside');
      
      if (!footer || !sidebar) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 计算侧边栏底部到页脚顶部的距离
      const sidebarBottom = sidebarRect.bottom;
      const footerTop = footerRect.top;
      
      // 当侧边栏底部距离页脚顶部小于20px时，取消固定定位
      // 这样可以防止侧边栏与页脚重叠，同时保持侧边栏可见
      const shouldUnfix = (sidebarBottom + 20) > footerTop && footerTop < windowHeight;
      
      setSidebarFixed(!shouldUnfix);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Header categories={categories} />
      <main className={`${styles.main} ${!sidebarFixed ? styles.contentWrapperUnfixed : ''}`}>
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <article className={styles.article}>
              <div className={styles.articleContent}>
                <nav className={styles.breadcrumb}>
                  <a href="/">Home</a>
                  <span className={styles.separator}>›</span>
                  <a href={`/category/${getCategorySlug(post.categoryName)}`}>{post.categoryName}</a>
                  <span className={styles.separator}>›</span>
                  <span>{post.title}</span>
                </nav>

                <header className={styles.articleHeader}>
                  <h1 className={styles.title}>{post.title}</h1>
                  
                  <div className={styles.meta}>
                    <div className={styles.metaLeft}>
                      <a 
                        href={`/category/${getCategorySlug(post.categoryName)}`}
                        className={styles.categoryBadge}
                      >
                        {post.categoryName}
                      </a>
                      <span className={styles.publishDate}>{formatDate(post.createTime)}</span>
                      <span className={styles.readTime}>{post.duration} read</span>
                    </div>
                  </div>
                </header>

                {/* 广告位 - 使用组件化设计 */}
                <AdPlaceholder 
                  id="seattle-ad-10001"
                  imageSrc={adsPlaceholderImg}
                  alt="Advertisement"
                  width={300}
                  height={250}
                />

                <div className={styles.description}>
                  <p>{post.description}</p>
                </div>

                {post.imageUrl && (
                  <div className={styles.featuredImage}>
                    <Image
                      src={`https://${post.imageUrl}`}
                      alt={post.title}
                      width={800}
                      height={400}
                      className={styles.image}
                    />
                  </div>
                )}

                <div className={styles.content}>
                  {post.content.split('\n').map((paragraph, index) => {
                    if (paragraph.trim() === '') return null;
                    
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h3 key={index} className={styles.subheading}>
                          {paragraph.replace('### ', '')}
                        </h3>
                      );
                    }
                    
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={index} className={styles.heading}>
                          {paragraph.replace('## ', '')}
                        </h2>
                      );
                    }
                    
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <p key={index} className={styles.boldParagraph}>
                          <strong>{paragraph.replace(/\*\*/g, '')}</strong>
                        </p>
                      );
                    }
                    
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={index} className={styles.list}>
                          <li>{paragraph.replace('- ', '')}</li>
                        </ul>
                      );
                    }
                    
                    return (
                      <p key={index} className={styles.paragraph}>
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
              </div>
            </article>

            <RecommendationSidebar 
              currentPost={post}
              relatedPosts={relatedPosts}
              categories={categories}
              isFixed={sidebarFixed}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 