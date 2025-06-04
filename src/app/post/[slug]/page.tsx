import { notFound } from 'next/navigation';
import { getPostBySlug, getRelatedPosts, getCategories, getAllPostPaths } from '@/lib/api';
import PostPageClient from './PostPageClient';

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const paths = getAllPostPaths();
  return paths.map((path) => ({
    slug: path.params.slug,
  }));
}

export default function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getRelatedPosts(post, 5);
  const categories = getCategories();

  return (
    <PostPageClient 
      post={post} 
      relatedPosts={relatedPosts} 
      categories={categories} 
    />
  );
} 