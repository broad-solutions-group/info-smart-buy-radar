import styles from './AdBanner.module.css'

interface AdBannerProps {
  variant?: 'horizontal' | 'square' | 'vertical'
  className?: string
}

export default function AdBanner({ variant = 'horizontal', className = '' }: AdBannerProps) {
  return (
    <div className={`${styles.adBanner} ${styles[variant]} ${className}`}>
      <div className={styles.adContent}>
        <div className={styles.adPlaceholder}>
          <div className={styles.adIcon}>📢</div>
          <div className={styles.adText}>
            <h3>Advertisement</h3>
            <p>Your ad could be here</p>
          </div>
        </div>
      </div>
    </div>
  )
} 