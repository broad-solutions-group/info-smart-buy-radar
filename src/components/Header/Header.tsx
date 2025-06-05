'use client';

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './Header.module.css'

interface HeaderProps {
  categories: Array<{
    id: number
    name: string
  }>
  currentCategory?: string // 新增：当前文章的分类名称，用于文章详情页的菜单高亮
}

export default function Header({ categories, currentCategory }: HeaderProps) {
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

  // 检查当前路径是否匹配菜单项
  const isCurrentPath = (path: string) => {
    // 如果pathname为null，返回false
    if (!pathname) return false
    
    // 首页精确匹配
    if (path === '/' && pathname === '/') {
      return true
    }
    
    // 分类页面匹配（处理可能的尾部斜杠）
    if (path.startsWith('/category/')) {
      const normalizedPathname = pathname.replace(/\/$/, '') // 移除尾部斜杠
      const normalizedPath = path.replace(/\/$/, '') // 移除尾部斜杠
      
      // 直接路径匹配
      if (normalizedPathname === normalizedPath) {
        return true
      }
      
      // 文章详情页的分类高亮：如果当前在文章详情页，且文章属于该分类
      if (pathname.startsWith('/post/') && currentCategory) {
        const categorySlug = getCategorySlug(currentCategory)
        const expectedCategoryPath = `/category/${categorySlug}`
        return normalizedPath === expectedCategoryPath
      }
    }
    
    return false
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
              <Image 
                src="/logo.svg" 
                alt="SmartBuyRadar Logo" 
                width={38}
                height={38}
                className={styles.logoIcon}
              />
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
                  className={`${styles.navLink} ${isCurrentPath('/') ? styles.active : ''}`}>
                  Home
                </a>
              </li>
              {categories.map((category) => {
                const categoryPath = `/category/${getCategorySlug(category.name)}`;
                return (
                  <li key={category.id} className={styles.navItem}>
                    <a 
                      href={categoryPath}
                      className={`${styles.navLink} ${isCurrentPath(categoryPath) ? styles.active : ''}`}
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
                className={`${styles.mobileNavLink} ${isCurrentPath('/') ? styles.active : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </li>
            {categories.map((category) => {
              const categoryPath = `/category/${getCategorySlug(category.name)}`;
              return (
                <li key={category.id} className={styles.mobileNavItem}>
                  <a 
                    href={categoryPath}
                    className={`${styles.mobileNavLink} ${isCurrentPath(categoryPath) ? styles.active : ''}`}
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