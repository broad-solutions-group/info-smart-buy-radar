'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './Banner.module.css'
import { Post } from '../../lib/slices/postsSlice'

interface BannerProps {
  featuredPosts: Post[]
}

export default function Banner({ featuredPosts }: BannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [featuredPosts.length, isAutoPlaying])

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrevSlide()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goToNextSlide()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    pauseAutoPlay()
  }

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length)
    pauseAutoPlay()
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredPosts.length)
    pauseAutoPlay()
  }

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  // 触摸事件处理
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    setIsAutoPlaying(false) // 触摸时暂停自动播放
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      goToNextSlide()
    } else if (isRightSwipe) {
      goToPrevSlide()
    } else {
      // 如果没有有效滑动，恢复自动播放
      setTimeout(() => setIsAutoPlaying(true), 1000)
    }

    touchStartX.current = 0
    touchEndX.current = 0
  }

  // 鼠标悬停时暂停自动播放
  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  if (!featuredPosts.length) return null

  return (
    <section 
      className={styles.banner}
      ref={bannerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
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
                    <a 
                      href={`/category/${getCategorySlug(post.categoryName)}`}
                      className={styles.categoryTag}
                    >
                      {post.categoryName}
                    </a>
                    <h2 className={styles.slideTitle}>{post.title}</h2>
                    <p className={styles.slideDescription}>{post.description}</p>
                    <div className={styles.slideActions}>
                      <a href={`/post/${post.id}`} className={styles.readMoreBtn}>
                        Read More
                      </a>
                      <span className={styles.duration}>{post.duration} read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* 导航箭头 */}
        <div className={styles.navArrows}>
          <button 
            className={styles.navArrow}
            onClick={goToPrevSlide}
            aria-label="Previous slide"
            type="button"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
            </svg>
          </button>
          <button 
            className={styles.navArrow}
            onClick={goToNextSlide}
            aria-label="Next slide"
            type="button"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
            </svg>
          </button>
        </div>
        
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
                  type="button"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 