import Image from 'next/image';
import { Post, Category } from '@/lib/slices/postsSlice';
import { getCategorySlug, getAllPosts } from '@/lib/api';
import styles from './RecommendationSidebar.module.css';

interface RecommendationSidebarProps {
  currentPost: Post;
  relatedPosts: Post[];
  categories: Category[];
  isFixed?: boolean;
}

export default function RecommendationSidebar({ 
  currentPost, 
  relatedPosts, 
  categories,
  isFixed = true
}: RecommendationSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Get popular posts (based on creation time desc, excluding current post)
  const allPosts = getAllPosts();
  const popularPosts = allPosts
    .filter(post => post.id !== currentPost.id)
    .slice(0, 5);

  return (
    <aside className={`${styles.sidebar} ${!isFixed ? styles.sidebarUnfixed : ''}`}>
      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Related Articles</h3>
          <div className={styles.postList}>
            {relatedPosts.map((post) => (
              <a key={post.id} href={`/post/${post.id}`} className={styles.postItem}>
                <div className={styles.postImage}>
                  <Image
                    src={`https://${post.imageUrl}`}
                    alt={post.title}
                    width={80}
                    height={80}
                    className={styles.thumbnail}
                  />
                </div>
                <div className={styles.postContent}>
                  <h4 className={styles.postTitle}>{post.title}</h4>
                  <div className={styles.postMeta}>
                    <span className={styles.category}>{post.categoryName}</span>
                    <span className={styles.date}>{formatDate(post.createTime)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Popular Articles */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Popular Articles</h3>
        <div className={styles.postList}>
          {popularPosts.map((post, index) => (
            <a key={post.id} href={`/post/${post.id}`} className={styles.postItem}>
              <div className={styles.postRank}>
                <span className={styles.rankNumber}>{index + 1}</span>
              </div>
              <div className={styles.postContent}>
                <h4 className={styles.postTitle}>{post.title}</h4>
                <div className={styles.postMeta}>
                  <span className={styles.category}>{post.categoryName}</span>
                  <span className={styles.date}>{formatDate(post.createTime)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Category Navigation */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Popular Categories</h3>
        <div className={styles.categoryList}>
          {categories.map((category) => (
            <a 
              key={category.id} 
              href={`/category/${getCategorySlug(category.name)}`}
              className={styles.categoryItem}
            >
              {category.name}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
} 