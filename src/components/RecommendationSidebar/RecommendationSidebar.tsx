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

// 工具函数：使用确定性方法获取来自不同分类的文章
function getDiversifiedPosts(allPosts: Post[], currentPost: Post, limit: number): Post[] {
  // 过滤掉当前文章
  const availablePosts = allPosts.filter(post => post.id !== currentPost.id);
  
  // 按分类分组
  const postsByCategory = availablePosts.reduce((acc, post) => {
    if (!acc[post.categoryName]) {
      acc[post.categoryName] = [];
    }
    acc[post.categoryName].push(post);
    return acc;
  }, {} as Record<string, Post[]>);
  
  // 获取所有分类名称并按字母顺序排序（确定性）
  const categoryNames = Object.keys(postsByCategory).sort();
  
  const result: Post[] = [];
  let categoryIndex = 0;
  
  // 轮流从不同分类中选择文章
  while (result.length < limit && categoryIndex < categoryNames.length * 3) {
    const currentCategory = categoryNames[categoryIndex % categoryNames.length];
    const categoryPosts = postsByCategory[currentCategory];
    
    if (categoryPosts && categoryPosts.length > 0) {
      // 使用确定性方法选择文章（基于当前文章ID和索引）
      const selectIndex = (currentPost.id + categoryIndex) % categoryPosts.length;
      const selectedPost = categoryPosts.splice(selectIndex, 1)[0];
      result.push(selectedPost);
    }
    
    categoryIndex++;
  }
  
  return result;
}

// 工具函数：获取混合的相关文章（包含当前分类和其他分类）
function getMixedRelatedPosts(allPosts: Post[], currentPost: Post, originalRelated: Post[], limit: number): Post[] {
  // 先取一部分原始相关文章（同分类）
  const sameCategory = originalRelated.slice(0, Math.ceil(limit / 2));
  
  // 再从其他分类中获取文章
  const otherCategoryPosts = allPosts.filter(post => 
    post.id !== currentPost.id && 
    post.categoryName !== currentPost.categoryName &&
    !sameCategory.some(related => related.id === post.id)
  );
  
  // 使用确定性方法选择其他分类的文章
  const otherCategory = otherCategoryPosts
    .sort((a, b) => a.id - b.id) // 按ID排序确保一致性
    .slice(0, limit - sameCategory.length);
  
  // 合并结果，不再随机打乱
  return [...sameCategory, ...otherCategory];
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

  // 获取所有文章
  const allPosts = getAllPosts();
  
  // 获取混合的相关文章（包含当前分类和其他分类）
  const mixedRelatedPosts = getMixedRelatedPosts(allPosts, currentPost, relatedPosts, 4);
  
  // 获取来自不同分类的热门文章
  const diversifiedPopularPosts = getDiversifiedPosts(allPosts, currentPost, 5);

  return (
    <aside className={`${styles.sidebar} ${!isFixed ? styles.sidebarUnfixed : ''}`}>
      {/* Related Articles */}
      {mixedRelatedPosts.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Related Articles</h3>
          <div className={styles.postList}>
            {mixedRelatedPosts.map((post) => (
              <a key={post.id} href={`/post/${post.slug}`} className={styles.postItem}>
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
          {diversifiedPopularPosts.map((post, index) => (
            <a key={post.id} href={`/post/${post.slug}`} className={styles.postItem}>
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