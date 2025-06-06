import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getCategories, getAllPostPaths } from '@/lib/api';
import PostPageClient from './PostPageClient';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = await getAllPostPaths();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post, 5);
  const categories = await getCategories();

  return (
    <PostPageClient 
      post={post} 
      relatedPosts={relatedPosts} 
      categories={categories} 
    />
  );
} 