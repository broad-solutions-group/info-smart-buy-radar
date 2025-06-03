import { getPostById, getRelatedPosts, getCategories, getAllPosts } from '@/lib/api';
import { Post, Category } from '@/lib/slices/postsSlice';
import PostPageClient from './PostPageClient';

// 生成静态参数
export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map((post) => ({
    id: post.id.toString(),
  }));
}

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const postId = parseInt(params.id);
  const post = getPostById(postId) || null;
  const categories = getCategories();
  
  let relatedPosts: Post[] = [];
  if (post) {
    relatedPosts = getRelatedPosts(post, 3);
  }

  return (
    <PostPageClient 
      post={post}
      relatedPosts={relatedPosts}
      categories={categories}
    />
  );
} 