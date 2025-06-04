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
                <a href="/category/seasonal-picks" className={styles.footerLink}>
                  Seasonal Picks
                </a>
              </li>
              <li>
                <a href="/category/renters-essentials" className={styles.footerLink}>
                  Renters&apos; Essentials
                </a>
              </li>
              <li>
                <a href="/category/coupon-hacks" className={styles.footerLink}>
                  Coupon Hacks
                </a>
              </li>
              <li>
                <a href="/category/budget-upgrades" className={styles.footerLink}>
                  Budget Upgrades
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <div className={styles.copyright}>
            <p>Copyright © {currentYear} smartshoppingradar.com</p>
          </div>
          <div className={styles.legalLinks}>
            <a href="/about" className={styles.legalLink}>
              About Us
            </a>
            <a href="/terms" className={styles.legalLink}>
              Terms of Service
            </a>
            <a href="/privacy" className={styles.legalLink}>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 