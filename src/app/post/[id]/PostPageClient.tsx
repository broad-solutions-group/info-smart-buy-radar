'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
import { Post, Category } from '@/lib/slices/postsSlice';
import { getCategorySlug } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import RecommendationSidebar from '@/components/RecommendationSidebar';
import AdBanner from '@/components/AdBanner/AdBanner';
import styles from './PostPage.module.css';

interface PostPageClientProps {
  post: Post | null;
  relatedPosts: Post[];
  categories: Category[];
}

export default function PostPageClient({ 
  post, 
  relatedPosts, 
  categories 
}: PostPageClientProps) {
  const [sidebarFixed, setSidebarFixed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const articleElement = document.querySelector(`.${styles.article}`);
      const footerElement = document.querySelector('footer');
      
      if (articleElement && footerElement) {
        const articleRect = articleElement.getBoundingClientRect();
        const footerRect = footerElement.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // 当文章底部接近视口底部或页脚进入视口时，取消固定定位
        const articleBottom = articleRect.bottom;
        const shouldUnfix = articleBottom <= windowHeight + 100 || footerRect.top <= windowHeight;
        
        setSidebarFixed(!shouldUnfix);
      }
    };

    // 添加滚动监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // 初始检查
    handleScroll();
    
    // 清理监听器
    return () => {
      window.removeEventListener('scroll', handleScroll);
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

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  if (!post) {
    return (
      <>
        <Header categories={categories} />
        <div className={styles.notFound}>
          <h1>Article Not Found</h1>
          <p>Sorry, we couldn&apos;t find the article you&apos;re looking for.</p>
          <a href="/" className={styles.backHome}>← Back to Home</a>
        </div>
        <Footer />
      </>
    );
  }

  // Render markdown content
  const htmlContent = marked.parse(post.content) as string;

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={`${styles.contentWrapper} ${!sidebarFixed ? styles.contentWrapperUnfixed : ''}`}>
            {/* Left Column: Article Content */}
            <article className={styles.article}>
              {/* Article Header */}
              <header className={styles.articleHeader}>
                <nav className={styles.breadcrumb}>
                  <a href="/">Home</a>
                  <span className={styles.separator}>›</span>
                  <a href={`/category/${getCategorySlug(post.categoryName)}`}>{post.categoryName}</a>
                  <span className={styles.separator}>›</span>
                  <span>{post.title}</span>
                </nav>
                
                <h1 className={styles.title}>{post.title}</h1>
                
                <div className={styles.articleMeta}>
                  <div className={styles.metaLeft}>
                    <div className={styles.categoryBadge}>
                      <a href={`/category/${getCategorySlug(post.categoryName)}`}>
                        {post.categoryName}
                      </a>
                    </div>
                    <span className={styles.date}>{formatDate(post.createTime)}</span>
                    <span className={styles.readTime}>{post.duration} read</span>
                  </div>
                </div>
                
                {/* Advertisement Banner */}
                <AdBanner variant="horizontal" className={styles.articleAd} />
                
                <p className={styles.description}>{post.description}</p>
              </header>

              {/* Featured Image */}
              <div className={styles.imageContainer}>
                <Image
                  src={`https://${post.imageUrl}`}
                  alt={post.title}
                  width={800}
                  height={500}
                  className={styles.featuredImage}
                  priority
                />
              </div>

              {/* Article Content */}
              <div className={styles.articleContent}>
                <div 
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            </article>

            {/* Right Column: Recommendation Sidebar */}
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