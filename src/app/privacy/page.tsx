import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Privacy.module.css';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';

export default async function PrivacyPage() {
  // 在服务端获取数据并处理 markdown
  const categories = await getCategories();
  
  let privacyContent = '';
  if (attachmentData.privacy) {
    // Replace {sitename} placeholder with actual site name
    const contentWithSiteName = attachmentData.privacy.replace(/{sitename}/g, 'Smart Buy Radar');
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    privacyContent = await marked(contentWithSiteName);
  } else {
    // 使用默认内容
    const defaultContent = `
# Privacy Policy

We respect your privacy and are committed to protecting your personal information.

## Information We Collect

We may collect information you provide directly to us, such as when you contact us or subscribe to our newsletter.

## How We Use Your Information

We use the information we collect to provide, maintain, and improve our services.

## Information Sharing

We do not sell, trade, or otherwise transfer your personal information to third parties.

## Contact Us

If you have any questions about this Privacy Policy, please contact us.
    `;
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    privacyContent = await marked(defaultContent);
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentMain}>
            <div 
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: privacyContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 