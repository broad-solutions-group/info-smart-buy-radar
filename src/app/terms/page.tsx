'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { getCategories } from '@/lib/api';
import { Category } from '@/lib/slices/postsSlice';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Terms.module.css';
import attachmentData from '@/data/Smart-Buy-Radar-attachment.json';

// 备用API端点
const ATTACHMENT_DATA_URL = '/api/attachment-data';

export default function TermsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [termsContent, setTermsContent] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        // 获取分类数据
        const allCategories = await getCategories();
        setCategories(allCategories);

        // 优先使用本地attachment数据
        if (attachmentData.agreement) {
          // Replace {sitename} placeholder with actual site name
          const contentWithSiteName = attachmentData.agreement.replace(/{sitename}/g, 'Smart Buy Radar');
          const htmlContent = await marked(contentWithSiteName);
          setTermsContent(htmlContent);
        } else {
          // 如果本地数据中的agreement字段为空，尝试从API获取
          try {
            const response = await fetch(ATTACHMENT_DATA_URL);
            if (!response.ok) {
              throw new Error(`Failed to fetch attachment data: ${response.status}`);
            }
            const apiAttachmentData = await response.json() as { agreement?: string };
            
            if (apiAttachmentData.agreement) {
              // Replace {sitename} placeholder with actual site name
              const contentWithSiteName = apiAttachmentData.agreement.replace(/{sitename}/g, 'Smart Buy Radar');
              const htmlContent = await marked(contentWithSiteName);
              setTermsContent(htmlContent);
            } else {
              throw new Error('No agreement content available');
            }
          } catch (apiError) {
            console.error('Error fetching attachment data from API:', apiError);
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
            const htmlContent = await marked(defaultContent);
            setTermsContent(htmlContent);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
        // 设置默认内容
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
        const htmlContent = await marked(defaultContent);
        setTermsContent(htmlContent);
      }
    };

    loadData();
  }, []);

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