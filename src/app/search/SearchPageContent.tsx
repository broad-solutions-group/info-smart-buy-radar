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

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const allCategories = getCategories();
    setCategories(allCategories);

    // Get initial search query from URL params
    const query = searchParams?.get('q') || '';
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams]);

  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);
    
    try {
      const results = searchPosts(query.trim());
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
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
            
            {/* Advertisement Banner */}
            <AdBanner variant="horizontal" className={styles.searchAd} />
          </header>

          {/* Loading State */}
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Searching...</p>
            </div>
          )}

          {/* Search Results */}
          {!loading && hasSearched && (
            <section className={styles.resultsSection}>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`
                  }
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