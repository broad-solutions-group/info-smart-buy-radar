import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Terms.module.css';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';

export default async function TermsPage() {
  // 在服务端获取数据并处理 markdown
  const categories = await getCategories();
  
  let termsContent = '';
  if (attachmentData.agreement) {
    // Replace {sitename} placeholder with actual site name
    const contentWithSiteName = attachmentData.agreement.replace(/{sitename}/g, 'Smart Buy Radar');
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    termsContent = await marked(contentWithSiteName);
  } else {
    // 使用默认内容
    const defaultContent = `
# Terms of Service

Welcome to Smart Buy Radar. By using our website, you agree to these terms.

## Acceptance of Terms

By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.

## Use License

Permission is granted to temporarily download one copy of the materials on Smart Buy Radar's website for personal, non-commercial transitory viewing only.

## Disclaimer

The materials on Smart Buy Radar's website are provided on an 'as is' basis. Smart Buy Radar makes no warranties, expressed or implied.

## Limitations

In no event shall Smart Buy Radar or its suppliers be liable for any damages arising out of the use or inability to use the materials on Smart Buy Radar's website.

## Contact Information

If you have any questions about these Terms of Service, please contact us.
    `;
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
    termsContent = await marked(defaultContent);
  }

  return (
    <>
      <Header categories={categories} />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.contentMain}>
            <div 
              className={styles.contentBody}
              dangerouslySetInnerHTML={{ __html: termsContent }}
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 