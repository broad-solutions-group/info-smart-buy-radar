import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Smart Buy Radar</h3>
            <p className={styles.footerDescription}>
              Your guide to smart shopping decisions. Discover seasonal picks, 
              budget upgrades, coupon hacks, and renter essentials.
            </p>
          </div>
          
          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Categories</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/category/seasonal-picks" className={styles.footerLink}>
                  Seasonal Picks
                </Link>
              </li>
              <li>
                <Link href="/category/renters-essentials" className={styles.footerLink}>
                  Renters&apos; Essentials
                </Link>
              </li>
              <li>
                <Link href="/category/coupon-hacks" className={styles.footerLink}>
                  Coupon Hacks
                </Link>
              </li>
              <li>
                <Link href="/category/budget-upgrades" className={styles.footerLink}>
                  Budget Upgrades
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>Copyright © {currentYear} smartshoppingradar.com</p>
          </div>
          <div className={styles.legalLinks}>
            <Link href="/about" className={styles.legalLink}>
              About Us
            </Link>
            <Link href="/terms" className={styles.legalLink}>
              Terms of Service
            </Link>
            <Link href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 