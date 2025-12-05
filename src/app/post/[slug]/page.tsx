import { notFound } from 'next/navigation';
import { marked } from 'marked';
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

  // 在服务端处理 markdown 内容，生成 HTML
  let processedContent = '';
  if (post.content) {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    processedContent = await marked(post.content);
  }

  return (
    <PostPageClient 
      post={post} 
      relatedPosts={relatedPosts} 
      categories={categories}
      processedContent={processedContent}
    />
  );
} 