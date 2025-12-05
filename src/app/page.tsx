import { getAllPosts, getCategories } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Banner from '@/components/Banner/Banner';
import PostCard from '@/components/PostCard/PostCard';
import styles from './Home.module.css';
import adsPlaceholderImg from './ads_300_250.png';
import SearchForm from '@/components/SearchForm/SearchForm';
import Image from "next/image";

export default async function HomePage() {
  // 在服务端获取数据，构建时生成静态 HTML
  const posts = await getAllPosts();
  const categories = await getCategories();

  // 收集所有已在其他模块中显示的文章ID，避免重复
  const usedPostIds = new Set<number>();

  // 先收集分类展示会用到的文章ID
  const categoryDisplayIds = new Set<number>();
  categories.forEach(category => {
    const categoryPosts = posts.filter(post => post.categoryName === category.name);
    categoryPosts.slice(0, 3).forEach(post => categoryDisplayIds.add(post.id));
  });

  // Get banner posts - 轮播专用文章（每个分类选1篇，总共4篇）
  const getBannerPosts = () => {
    const bannerPosts: typeof posts = [];

    // 首先添加指定的文章到第一个位置
    const targetPost = posts.find(post => post.id === 107);
    if (targetPost) {
      bannerPosts.push(targetPost);
      usedPostIds.add(targetPost.id);
    }

    // 从每个分类的第4篇开始选择（避免与分类展示重复和已选择的文章重复）
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      if (categoryPosts.length > 3) {
        // 选择第4篇作为轮播文章，但跳过已经添加的文章
        const bannerPost = categoryPosts[3];
        if (!usedPostIds.has(bannerPost.id)) {
          bannerPosts.push(bannerPost);
          usedPostIds.add(bannerPost.id);
        }
      }
    });

    return bannerPosts;
  };

  const bannerPosts = getBannerPosts();

  // Get featured posts - Featured Articles专用文章（6篇，避免与轮播和分类展示重复）
  const getFeaturedPosts = (count: number) => {
    const featuredPosts: typeof posts = [];

    // 从每个分类的第5篇开始选择（避免与轮播和分类展示重复）
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      if (categoryPosts.length > 4 && featuredPosts.length < count) {
        // 从第5篇开始选择
        const availablePosts = categoryPosts.slice(4);
        if (availablePosts.length > 0) {
          featuredPosts.push(availablePosts[0]);
          usedPostIds.add(availablePosts[0].id);
        }
      }
    });

    // 如果还需要更多文章，从剩余文章中选择（排除已使用和分类展示的文章）
    if (featuredPosts.length < count) {
      const remainingPosts = posts.filter(post =>
        !usedPostIds.has(post.id) && !categoryDisplayIds.has(post.id)
      );
      const needed = count - featuredPosts.length;
      featuredPosts.push(...remainingPosts.slice(0, needed));
      remainingPosts.slice(0, needed).forEach(post => usedPostIds.add(post.id));
    }

    return featuredPosts;
  };

  const featuredPosts = getFeaturedPosts(6);

  // Get diverse posts for "For You" section (exclude featured posts and category display posts)
  const getDiversePosts = (count: number) => {
    // 排除已使用的文章和分类展示的前3篇
    const categoryDisplayIds = new Set<number>();
    categories.forEach(category => {
      const categoryPosts = posts.filter(post => post.categoryName === category.name);
      categoryPosts.slice(0, 3).forEach(post => categoryDisplayIds.add(post.id));
    });

    const availablePosts = posts.filter(post =>
      !usedPostIds.has(post.id) && !categoryDisplayIds.has(post.id)
    );

    // 使用确定性方法选择多样化的文章
    const diversePosts: typeof posts = [];
    const categoriesUsed = new Set<string>();

    // 首先尝试从不同分类中各选一篇
    for (const post of availablePosts) {
      if (!categoriesUsed.has(post.categoryName) && diversePosts.length < count) {
        diversePosts.push(post);
        categoriesUsed.add(post.categoryName);
        usedPostIds.add(post.id);
      }
    }

    // 如果还需要更多文章，按顺序添加剩余文章
    if (diversePosts.length < count) {
      const remaining = availablePosts.filter(post => !diversePosts.includes(post));
      const needed = count - diversePosts.length;
      diversePosts.push(...remaining.slice(0, needed));
      remaining.slice(0, needed).forEach(post => usedPostIds.add(post.id));
    }

    return diversePosts;
  };

  const forYouPosts = getDiversePosts(6);

  // Get posts by category for sections (前3篇文章)
  const getPostsByCategory = (categoryName: string, limit: number = 3) => {
    return posts.filter(post => post.categoryName === categoryName).slice(0, limit);
  };

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        {/* Hero Banner */}
        <Banner featuredPosts={bannerPosts} />

        <div id="seattle-ad-10001" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
          <div style={{marginBottom: '0.2rem'}} className="adTip">Advertisement ▼</div>
          <Image src={adsPlaceholderImg} alt="Advertisement" loading="lazy" fetchPriority="low" />
          <div style={{marginTop: '0.2rem'}} className="adTip">Advertisement ▲</div>
        </div>

        {/* Featured Articles Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Featured Articles</h2>
            <div className={styles.featuredGrid}>
              {featuredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </section>

        {/* For You Section */}
        <section className={styles.section}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>For You</h2>
            <div className={styles.featuredGrid}>
              {forYouPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Categories Sections */}
        {(() => {
          const elements: JSX.Element[] = [];
          let renderedCategoryCount = 0;
          let adIdCounter = 4; // 起始广告ID后缀

          categories.forEach((category) => {
            const categoryPosts = getPostsByCategory(category.name);
            if (categoryPosts.length === 0) {
              return; // 如果分类下没有文章，则不渲染该分类，也不计数
            }

            renderedCategoryCount++;

            // 添加分类板块
            elements.push(
              <div key={category.id}>
                <section className={styles.section}>
                  <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>{category.name}</h2>
                      <a href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')}`} className={styles.viewAll}>
                        View All →
                      </a>
                    </div>
                    <div className={styles.postsGrid}>
                      {categoryPosts.map((post) => (
                        <PostCard
                          key={post.id}
                          post={post}
                          variant="default"
                        />
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            );
          });
          return elements;
        })()}


        {/* Search Section */}
        <section className={styles.newsletter}>
          <div className={styles.container}>
            <div className={styles.newsletterContent}>
              <h2>Search Smart Buy Radar</h2>
              <p>Find the product reviews, shopping tips, and deals you need</p>
              <SearchForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
