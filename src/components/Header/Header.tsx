'use client';

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import styles from './Header.module.css'

interface HeaderProps {
  categories: Array<{
    id: number
    name: string
  }>
}

export default function Header({ categories }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // 滚动监听逻辑
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded)
    if (!isSearchExpanded) {
      // Focus on the input when expanded
      setTimeout(() => {
        const input = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement
        if (input) input.focus()
      }, 300)
    }
  }

  const closeSearch = () => {
    setIsSearchExpanded(false)
  }

  // Click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch()
      }
    }

    if (isSearchExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSearchExpanded])

  // Close search on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSearch()
      }
    }

    if (isSearchExpanded) {
      document.addEventListener('keydown', handleEscapeKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [isSearchExpanded])

  const getCategorySlug = (name: string) => {
    return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() && !isSearching) {
      setIsSearching(true)
      // 立即跳转，不等待任何延迟
      const searchUrl = `/search?q=${encodeURIComponent(searchQuery.trim())}`
      window.location.href = searchUrl
    }
  }

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <a href="/">
              <svg className={styles.logoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </a>
            <a href="/">
              <h1 className={styles.logoText}>SmartBuyRadar</h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <a 
                  href="/" 
                  className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}>
                  Home
                </a>
              </li>
              {categories.map((category) => {
                const categoryPath = `/category/${getCategorySlug(category.name)}`;
                console.log("[Desktop Nav] Pathname:", pathname, "CategoryPath:", categoryPath);
                return (
                  <li key={category.id} className={styles.navItem}>
                    <a 
                      href={categoryPath}
                      className={`${styles.navLink} ${pathname === categoryPath ? styles.active : ''}`}
                    >
                      {category.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Search Bar with Animation */}
          <div className={styles.searchContainer} ref={searchRef}>
            <div className={`${styles.searchWrapper} ${isSearchExpanded ? styles.searchExpanded : ''}`}>
              <form className={styles.searchForm} onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
                <button 
                  type="submit" 
                  className={`${styles.searchToggle} ${isSearching ? styles.searching : ''}`}
                  onClick={toggleSearch}
                  aria-label="Toggle search"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <div className={styles.searchSpinner}></div>
                  ) : (
                    <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <span className={`${styles.hamburger} ${isMenuOpen ? styles.open : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
          <ul className={styles.mobileNavList}>
            <li className={styles.mobileNavItem}>
              <a 
                href="/" 
                className={`${styles.mobileNavLink} ${pathname === '/' ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </li>
            {categories.map((category) => {
              const categoryPath = `/category/${getCategorySlug(category.name)}`;
              console.log("[Mobile Nav] Pathname:", pathname, "CategoryPath:", categoryPath);
              return (
                <li key={category.id} className={styles.mobileNavItem}>
                  <a 
                    href={categoryPath}
                    className={`${styles.mobileNavLink} ${pathname === categoryPath ? styles.active : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </a>
                </li>
              );
            })}
            <li className={styles.mobileNavItem}>
              <form className={styles.mobileSearchForm} onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.mobileSearchInput}
                  disabled={isSearching}
                />
                <button 
                  type="submit" 
                  className={`${styles.mobileSearchButton} ${isSearching ? styles.searching : ''}`}
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </form>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
} 