import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './About.module.css';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';

export default async function AboutPage() {
  // 在服务端获取数据并处理 markdown
  const categories = await getCategories();
  
  let aboutContent = '';
  if (attachmentData.about && attachmentData.about.trim()) {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    aboutContent = await marked(attachmentData.about);
  } else {
    // 如果本地数据为空，使用默认内容
    const defaultContent = `
# About Smart Buy Radar

Content is being updated. Please check back later.
    `;
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    aboutContent = await marked(defaultContent);
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentMain}>
            <div 
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: aboutContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 