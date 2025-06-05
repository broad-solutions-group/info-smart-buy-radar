'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { marked } from 'marked';
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
  const [processedContent, setProcessedContent] = useState<string>('');

  useEffect(() => {
    // 处理文章内容，使用marked进行markdown解析
    const processContent = async () => {
      if (post.content) {
        // 配置marked选项，启用所有markdown功能
        marked.setOptions({
          breaks: true, // 支持换行符转换为<br>
          gfm: true, // 启用GitHub风格的markdown
        });
        
        const htmlContent = await marked(post.content);
        setProcessedContent(htmlContent);
      }
    };

    processContent();
  }, [post.content]);

  useEffect(() => {
    const handleScroll = () => {
      // 只在PC端处理侧边栏固定逻辑
      if (window.innerWidth <= 1024) {
        setSidebarFixed(true);
        return;
      }

      const footer = document.querySelector('footer');
      const sidebar = document.querySelector('aside');
      const main = document.querySelector('main');
      
      if (!footer || !sidebar || !main) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebar.getBoundingClientRect();
      const mainRect = main.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // 计算各种距离
      const footerTop = footerRect.top;
      const sidebarBottom = sidebarRect.bottom;
      const mainBottom = mainRect.bottom;
      const scrollY = window.scrollY;
      
      // 更精确的判断逻辑：
      // 1. 当footer即将进入视口时（提前100px开始处理）
      // 2. 当main容器底部接近视口底部时
      // 3. 考虑侧边栏的实际高度，确保有足够空间
      const footerApproaching = footerTop < windowHeight + 100;
      const mainNearEnd = mainBottom < windowHeight + 50;
      const sidebarWouldOverlap = sidebarBottom > footerTop - 40;
      
      // 只有当footer真正接近且可能发生重叠时才取消固定
      const shouldUnfix = footerApproaching && (mainNearEnd || sidebarWouldOverlap);
      
      setSidebarFixed(!shouldUnfix);
    };

    // 使用节流来优化性能
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // 初始检查

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
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
      <Header categories={categories} currentCategory={post.categoryName} />
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

                <div 
                  className={styles.content}
                  dangerouslySetInnerHTML={{ __html: processedContent }}
                />
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