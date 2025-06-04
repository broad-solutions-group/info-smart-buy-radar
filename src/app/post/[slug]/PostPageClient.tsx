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

interface PostPageClientProps {
  post: Post;
  relatedPosts: Post[];
  categories: Category[];
}

export default function PostPageClient({ post, relatedPosts, categories }: PostPageClientProps) {
  const [sidebarFixed, setSidebarFixed] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      const article = document.querySelector('article');
      
      if (!footer || !article) return;

      const footerRect = footer.getBoundingClientRect();
      const articleRect = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 当文章底部距离视口底部小于100px，或者页脚进入视口时，取消固定
      const shouldUnfix = (articleRect.bottom - windowHeight < 100) || (footerRect.top < windowHeight);
      
      setSidebarFixed(!shouldUnfix);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初始检查

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

                {/* Advertisement Banner */}
                <div className={styles.adContainer}>
                  <AdBanner variant="horizontal" />
                </div>

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