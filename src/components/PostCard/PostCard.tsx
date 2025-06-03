import Link from 'next/link'
import Image from 'next/image'
import styles from './PostCard.module.css'
import { Post } from '../../lib/slices/postsSlice'

interface PostCardProps {
  post: Post
  variant?: 'default' | 'featured' | 'compact'
}

export default function PostCard({ post, variant = 'default' }: PostCardProps) {
  const getCategorySlug = (categoryName: string) => {
    return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <article className={`${styles.postCard} ${styles[variant]}`}>
      <Link href={`/post/${post.id}`} className={styles.cardLink}>
        <div className={styles.imageContainer}>
          <Image
            src={`https://${post.imageUrl}`}
            alt={post.title}
            fill
            className={styles.postImage}
          />
          <div className={styles.categoryBadge}>
            <Link 
              href={`/category/${getCategorySlug(post.categoryName)}`}
              className={styles.categoryLink}
              onClick={(e) => e.stopPropagation()}
            >
              {post.categoryName}
            </Link>
          </div>
        </div>
        
        <div className={styles.cardContent}>
          <h3 className={styles.postTitle}>{post.title}</h3>
          <p className={styles.postDescription}>{post.description}</p>
          
          <div className={styles.postMeta}>
            <span className={styles.postDate}>{formatDate(post.createTime)}</span>
            <span className={styles.readTime}>{post.duration} read</span>
          </div>
        </div>
      </Link>
    </article>
  )
} 