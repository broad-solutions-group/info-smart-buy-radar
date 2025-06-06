import { getPostsByCategory, getCategorySlug, getCategories } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import CategoryPageClient from './CategoryPageClient';

// 生成静态参数
export async function generateStaticParams() {
  const categories = await getCategories();
  
  return categories.map((category) => ({
    category: category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, ''),
  }));
}

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const categorySlug = params.category;
  const posts = await getPostsByCategory(categorySlug);
  const categories = await getCategories();
  
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