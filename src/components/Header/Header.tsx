import Link from 'next/link'
import { useState } from 'react'
import styles from './Header.module.css'

interface HeaderProps {
  categories: Array<{
    id: number
    name: string
  }>
}

export default function Header({ categories }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getCategorySlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          {/* Logo */}
          <div className={styles.logo}>
            <Link href="/">
              <h1 className={styles.logoText}>SmartBuyRadar</h1>
            </Link>
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
              <li className={styles.navItem}>
                <Link href="/search" className={styles.navLink}>
                  Search
                </Link>
              </li>
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
            <li className={styles.mobileNavItem}>
              <Link 
                href="/search" 
                className={styles.mobileNavLink}
                onClick={() => setIsMenuOpen(false)}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
} 