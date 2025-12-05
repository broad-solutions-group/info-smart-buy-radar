import {getCategories, getPostsByCategory} from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PostCard from '@/components/PostCard/PostCard';
import styles from './CategoryPage.module.css';
import adsPlaceholderImg from '../../ads_300_250.png';
import Image from 'next/image';

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

  if (posts.length === 0) {
    return (
      <>
        <Header categories={categories} />
        <div className={styles.notFound}>
          <h1>Category Not Found</h1>
          <p>Sorry, we couldn&apos;t find any articles in this category.</p>
          <a href="/" className={styles.backHome}>← Back to Home</a>
        </div>
        <div id="seattle-ad-10001" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div style={{marginBottom: '0.2rem'}} className="adTip">Advertisement ▼</div>
          <Image src={adsPlaceholderImg} alt="Advertisement" />
          <div style={{marginTop: '0.2rem'}} className="adTip">Advertisement ▲</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Category Header */}
          <header className={styles.header}>
            <nav className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span className={styles.separator}>›</span>
              <span>{categoryName}</span>
            </nav>
            <h1 className={styles.title}>{categoryName}</h1>
            <p className={styles.subtitle}>
              {posts.length} article{posts.length !== 1 ? 's' : ''} in this category
            </p>
          </header>

          <div id="seattle-ad-10001" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
            <div style={{marginBottom: '0.2rem'}} className="adTip">Advertisement ▼</div>
            <Image src={adsPlaceholderImg} alt="Advertisement" />
            <div style={{marginTop: '0.2rem'}} className="adTip">Advertisement ▲</div>
          </div>

          {/* Articles Grid */}
          <section className={styles.articlesSection}>
            <div className={styles.articlesGrid}>
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="default"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
