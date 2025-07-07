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
  const [debugInfo, setDebugInfo] = useState({
    loadAllTaskExists: false,
    adDocReady: false,
    lastCheck: new Date().toISOString()
  });

  // 调试函数：检查 loadAllTask 状态
  const checkLoadAllTaskStatus = () => {
    const info = {
      loadAllTaskExists: typeof window !== 'undefined' && typeof window.loadAllTask === 'function',
      adDocReady: typeof window !== 'undefined' && window.adDocReady === true,
      lastCheck: new Date().toISOString()
    };
    setDebugInfo(info);
    console.log('🔍 [HomePage] LoadAllTask Status:', info);
    return info;
  };

  // 手动调用 loadAllTask
  const manuallyCallLoadAllTask = () => {
    if (typeof window !== 'undefined' && typeof window.loadAllTask === 'function') {
      try {
        console.log('🔧 [HomePage] Manually calling loadAllTask');
        window.loadAllTask();
        alert('loadAllTask called successfully!');
      } catch (error) {
        console.error('🔧 [HomePage] Error calling loadAllTask:', error);
        alert('Error calling loadAllTask: ' + error);
      }
    } else {
      alert('loadAllTask function is not available');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const allPosts = await getAllPosts();
        const allCategories = await getCategories();
        
        setPosts(allPosts);
        setCategories(allCategories);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // 定期检查 loadAllTask 状态
    const checkInterval = setInterval(checkLoadAllTaskStatus, 2000);
    
    // 初始检查
    setTimeout(checkLoadAllTaskStatus, 1000);

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading Smart Buy Radar...</p>
      </div>
    );
  }

  // 收集所有已在其他模块中显示的文章ID，避免重复
  const usedPostIds = new Set<number>();
  
  // 先收集分类展示会用到的文章ID
  const categoryDisplayIds = new Set<number>();
  categories.forEach(category => {
    const categoryPosts = posts.filter(post => post.categoryName === category.name);
    categoryPosts.slice(0, 3).forEach(post => categoryDisplayIds.add(post.id));
  });
  
  // Get banner posts - 轮播专用文章（每个分类选1篇，总共4篇）
  const getBannerPosts = () => {
    const bannerPosts: typeof posts = [];
    
    // 首先添加指定的文章到第一个位置
    const targetPost = posts.find(post => post.id === 107);
    if (targetPost) {
      bannerPosts.push(targetPost);
      usedPostIds.add(targetPost.id);
    }
    
    // 从每个分类的第4篇开始选择（避免与分类展示重复和已选择的文章重复）
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      if (categoryPosts.length > 3) {
        // 选择第4篇作为轮播文章，但跳过已经添加的文章
        const bannerPost = categoryPosts[3];
        if (!usedPostIds.has(bannerPost.id)) {
          bannerPosts.push(bannerPost);
          usedPostIds.add(bannerPost.id);
        }
      }
    });
    
    return bannerPosts;
  };
  
  const bannerPosts = getBannerPosts();
  
  // Get featured posts - Featured Articles专用文章（6篇，避免与轮播和分类展示重复）
  const getFeaturedPosts = (count: number) => {
    const featuredPosts: typeof posts = [];
    
    // 从每个分类的第5篇开始选择（避免与轮播和分类展示重复）
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      if (categoryPosts.length > 4 && featuredPosts.length < count) {
        // 从第5篇开始选择
        const availablePosts = categoryPosts.slice(4);
        if (availablePosts.length > 0) {
          featuredPosts.push(availablePosts[0]);
          usedPostIds.add(availablePosts[0].id);
        }
      }
    });
    
    // 如果还需要更多文章，从剩余文章中选择（排除已使用和分类展示的文章）
    if (featuredPosts.length < count) {
      const remainingPosts = posts.filter(post => 
        !usedPostIds.has(post.id) && !categoryDisplayIds.has(post.id)
      );
      const needed = count - featuredPosts.length;
      featuredPosts.push(...remainingPosts.slice(0, needed));
      remainingPosts.slice(0, needed).forEach(post => usedPostIds.add(post.id));
    }
    
    return featuredPosts;
  };
  
  const featuredPosts = getFeaturedPosts(6);
  
  // Get diverse posts for "For You" section (exclude featured posts and category display posts)
  const getDiversePosts = (count: number) => {
    // 排除已使用的文章和分类展示的前3篇
    const categoryDisplayIds = new Set<number>();
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      categoryPosts.slice(0, 3).forEach(post => categoryDisplayIds.add(post.id));
    });
    
    const availablePosts = posts.filter(post => 
      !usedPostIds.has(post.id) && !categoryDisplayIds.has(post.id)
    );
    
    // 使用确定性方法选择多样化的文章
    const diversePosts: typeof posts = [];
    const categoriesUsed = new Set<string>();
    
    // 首先尝试从不同分类中各选一篇
    for (const post of availablePosts) {
      if (!categoriesUsed.has(post.categoryName) && diversePosts.length < count) {
        diversePosts.push(post);
        categoriesUsed.add(post.categoryName);
        usedPostIds.add(post.id);
      }
    }
    
    // 如果还需要更多文章，按顺序添加剩余文章
    if (diversePosts.length < count) {
      const remaining = availablePosts.filter(post => !diversePosts.includes(post));
      const needed = count - diversePosts.length;
      diversePosts.push(...remaining.slice(0, needed));
      remaining.slice(0, needed).forEach(post => usedPostIds.add(post.id));
    }
    
    return diversePosts;
  };
  
  const forYouPosts = getDiversePosts(6);
  
  // Get posts by category for sections (前3篇文章)
  const getPostsByCategory = (categoryName: string, limit: number = 3) => {
    return posts.filter(post => post.categoryName === categoryName).slice(0, limit);
  };

  return (
    <>
      {/* 客户端副作用组件 */}
      <ClientEffects />
      
      {/* 调试面板 - 仅在开发环境显示 */}
      {/*
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: '#333',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          fontFamily: 'monospace'
        }}>
          <h4 style={{ margin: '0 0 5px 0' }}>🐛 LoadAllTask Debug</h4>
          <div>LoadAllTask exists: {debugInfo.loadAllTaskExists ? '✅' : '❌'}</div>
          <div>adDocReady: {debugInfo.adDocReady ? '✅' : '❌'}</div>
          <div>Last check: {new Date(debugInfo.lastCheck).toLocaleTimeString()}</div>
          <button 
            onClick={manuallyCallLoadAllTask}
            style={{
              marginTop: '5px',
              padding: '2px 5px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Manual Call LoadAllTask
          </button>
          <button 
            onClick={checkLoadAllTaskStatus}
            style={{
              marginTop: '2px',
              marginLeft: '5px',
              padding: '2px 5px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Refresh Status
          </button>
        </div>
      )}
      */}
      
      <Header categories={categories} />
      <main className={styles.main}>
        {/* Hero Banner */}
        <Banner featuredPosts={bannerPosts} />

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
