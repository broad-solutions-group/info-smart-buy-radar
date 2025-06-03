'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Post, Category } from '@/lib/slices/postsSlice';
import { getCategorySlug } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PostCard from '@/components/PostCard/PostCard';
import styles from './PostPage.module.css';

interface PostPageClientProps {
  post: Post | null;
  relatedPosts: Post[];
  categories: Category[];
}

export default function PostPageClient({ 
  post, 
  relatedPosts, 
  categories 
}: PostPageClientProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!post) {
    return (
      <>
        <Header categories={categories} />
        <div className={styles.notFound}>
          <h1>Article Not Found</h1>
          <p>Sorry, we couldn&apos;t find the article you&apos;re looking for.</p>
          <Link href="/" className={styles.backHome}>← Back to Home</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <article className={styles.article}>
          <div className={styles.container}>
            {/* Article Header */}
            <header className={styles.articleHeader}>
              <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span className={styles.separator}>›</span>
                <Link href={`/category/${getCategorySlug(post.categoryName)}`}>{post.categoryName}</Link>
                <span className={styles.separator}>›</span>
                <span>{post.title}</span>
              </nav>
              
              <div className={styles.categoryBadge}>
                <Link href={`/category/${getCategorySlug(post.categoryName)}`}>
                  {post.categoryName}
                </Link>
              </div>
              
              <h1 className={styles.title}>{post.title}</h1>
              
              <div className={styles.articleMeta}>
                <span className={styles.date}>{formatDate(post.createTime)}</span>
                <span className={styles.readTime}>{post.duration} read</span>
              </div>
              
              <p className={styles.description}>{post.description}</p>
            </header>

            {/* Featured Image */}
            <div className={styles.imageContainer}>
              <Image
                src={`https://${post.imageUrl}`}
                alt={post.title}
                width={800}
                height={400}
                className={styles.featuredImage}
                priority
              />
            </div>

            {/* Article Content */}
            <div className={styles.articleContent}>
              <div 
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.container}>
              <h2 className={styles.relatedTitle}>Related Articles</h2>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((relatedPost) => (
                  <PostCard 
                    key={relatedPost.id} 
                    post={relatedPost} 
                    variant="compact"
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
} 