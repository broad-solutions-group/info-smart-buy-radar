'use client';

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Header.module.css'

interface HeaderProps {
  categories: Array<{
    id: number
    name: string
  }>
}

export default function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getCategorySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/">
              <svg className={styles.logoIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" fill="none"/>
              </svg>
            </Link>
            <Link href="/">
              <h1 className={styles.logoText}>SmartBuyRadar</h1>
            </Link>
          </div>

          {/* Search Bar */}
          <div className={styles.searchContainer}>
            <form className={styles.searchForm} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
              <button type="submit" className={styles.searchButton}>
                <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}>
                <Link href="/" className={styles.navLink}>
                  Home
                </Link>
              </li>
              {categories.map((category) => (
                <li key={category.id} className={styles.navItem}>
                  <Link 
                    href={`/category/${getCategorySlug(category.name)}`}
                    className={styles.navLink}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

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
              <Link 
                href="/" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id} className={styles.mobileNavItem}>
                <Link 
                  href={`/category/${getCategorySlug(category.name)}`}
                  className={styles.mobileNavLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
} 