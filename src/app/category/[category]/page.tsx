import { getPostsByCategory, getCategorySlug, getCategories } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import CategoryPageClient from './CategoryPageClient';

// 生成静态参数
export async function generateStaticParams() {
  const categories = getCategories();
  
  return categories.map((category) => ({
    category: category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
  }));
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category;
  const posts = getPostsByCategory(categorySlug);
  const categories = getCategories();
  
  let categoryName = '';
  if (posts.length > 0) {
    categoryName = posts[0].categoryName;
  }

  return (
    <CategoryPageClient 
      posts={posts}
      categories={categories}
      categoryName={categoryName}
      categorySlug={categorySlug}
    />
  );
} 