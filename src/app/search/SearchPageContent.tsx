'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { searchPosts, getCategories } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PostCard from '@/components/PostCard/PostCard';
import AdBanner from '@/components/AdBanner/AdBanner';
import styles from './SearchPage.module.css';
import AdPlaceholder from '@/components/AdPlaceholder/AdPlaceholder';
import adsPlaceholderImg from '../ads_300_250.png';

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allCategories = await getCategories();
        setCategories(allCategories);

        // Get initial search query from URL params
        const query = searchParams?.get('q') || '';
        if (query) {
          setSearchQuery(query);
          // 立即设置加载状态，提供即时反馈
          setLoading(true);
          setHasSearched(true);
          // 使用setTimeout确保UI更新后再执行搜索
          setTimeout(() => {
            performSearch(query);
          }, 0);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadData();
  }, [searchParams]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      // 添加最小延迟，确保用户能看到加载状态
      const startTime = Date.now();
      const results = await searchPosts(query.trim());
      
      const elapsed = Date.now() - startTime;
      const minDelay = 300; // 最小300ms延迟
      
      if (elapsed < minDelay) {
        setTimeout(() => {
          setSearchResults(results);
          setLoading(false);
        }, minDelay - elapsed);
      } else {
        setSearchResults(results);
        setLoading(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
    
    // Update URL with search query
    const url = new URL(window.location.href);
    if (searchQuery.trim()) {
      url.searchParams.set('q', searchQuery.trim());
    } else {
      url.searchParams.delete('q');
    }
    window.history.pushState({}, '', url.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Search Header */}
          <header className={styles.searchHeader}>
            <h1 className={styles.title}>Search Articles</h1>
            <p className={styles.subtitle}>Find the perfect shopping advice for your needs</p>
            
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="Search for articles, tips, deals..."
                  className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                  <svg className={styles.searchIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </form>
            
            {/* 广告位 - 使用组件化设计 */}
            <AdPlaceholder 
              id="seattle-ad-10001"
              imageSrc={adsPlaceholderImg}
              alt="Advertisement"
              width={300}
              height={250}
            />
          </header>

          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Searching for &quot;{searchQuery}&quot;...</p>
              <p className={styles.loadingSubtext}>Finding the best articles for you</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && hasSearched && (
            <section className={styles.resultsSection}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                  {searchResults.length > 0 ? (
                    <>Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;</>
                  ) : (
                    <>No results found for &quot;{searchQuery}&quot;</>
                  )}
                </h2>
                {searchResults.length === 0 && (
                  <p className={styles.noResultsText}>
                    Try adjusting your search terms or browse our categories above.
                  </p>
                )}
              </div>

              {searchResults.length > 0 && (
                <div className={styles.resultsGrid}>
                  {searchResults.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      variant="default"
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Default Search Animation - 当没有搜索时显示 */}
          {!loading && !hasSearched && (
            <section className={styles.defaultSearchSection}>
              <div className={styles.searchAnimation}>
                <div className={styles.searchAnimationIcon}>
                  <svg className={styles.animatedSearchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className={styles.searchAnimationTitle}>Search...</h3>
                <p className={styles.searchAnimationText}>Enter keywords above to find articles, tips, and deals</p>
              </div>
            </section>
          )}

          {/* Popular Categories */}
          {!hasSearched && (
            <section className={styles.categoriesSection}>
              <h2 className={styles.categoriesTitle}>Browse by Category</h2>
              <div className={styles.categoriesGrid}>
                {categories.map((category) => (
                  <a 
                    key={category.id}
                    href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`}
                    className={styles.categoryCard}
                  >
                    <h3>{category.name}</h3>
                    <p>{category.postList.length} article{category.postList.length !== 1 ? 's' : ''}</p>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 