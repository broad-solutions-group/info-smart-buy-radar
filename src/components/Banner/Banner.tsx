'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './Banner.module.css'
import { Post } from '../../lib/slices/postsSlice'

interface BannerProps {
  featuredPosts: Post[]
}

export default function Banner({ featuredPosts }: BannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [featuredPosts.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  if (!featuredPosts.length) return null

  return (
    <section className={styles.banner}>
      <div className={styles.bannerContainer}>
        {featuredPosts.map((post, index) => (
          <div
            key={post.id}
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          >
            <div className={styles.slideContent}>
              <div className={styles.imageContainer}>
                <Image
                  src={`https://${post.imageUrl}`}
                  alt={post.title}
                  fill
                  className={styles.slideImage}
                  priority={index === 0}
                />
                <div className={styles.overlay} />
              </div>
              <div className={styles.textContent}>
                <div className={styles.container}>
                  <div className={styles.slideInfo}>
                    <Link 
                      href={`/category/${getCategorySlug(post.categoryName)}`}
                      className={styles.categoryTag}
                    >
                      {post.categoryName}
                    </Link>
                    <h2 className={styles.slideTitle}>{post.title}</h2>
                    <p className={styles.slideDescription}>{post.description}</p>
                    <div className={styles.slideActions}>
                      <Link href={`/post/${post.id}`} className={styles.readMoreBtn}>
                        Read More
                      </Link>
                      <span className={styles.duration}>{post.duration} read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation dots */}
        <div className={styles.navigation}>
          <div className={styles.container}>
            <div className={styles.dots}>
              {featuredPosts.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 