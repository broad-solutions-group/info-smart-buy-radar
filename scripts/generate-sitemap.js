const fs = require('fs');
const path = require('path');

// 1. 读取数据
const dataPath = path.join(__dirname, '../src/data/Smart-Buy-Radar.json');
// 修改输出路径为 public/sitemap.xml
const outputPath = path.join(__dirname, '../public/sitemap.xml');
const siteUrl = 'https://smartshoppingradar.com';

function getToday() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function getCategorySlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
}

function getPostSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function escapeXml(str) {
  return str.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','\'':'&apos;','"':'&quot;'}[c]));
}

function main() {
  const today = getToday();
  const raw = fs.readFileSync(dataPath, 'utf-8');
  const data = JSON.parse(raw);
  const categories = data.categoryList || [];

  let urls = [];
  // 首页
  urls.push({ loc: `${siteUrl}/`, changefreq: 'daily', priority: '1.0', lastmod: today });
  // 静态页
  [
    { path: '/search', p: '0.5' },
    { path: '/about', p: '0.5' },
    { path: '/terms', p: '0.5' },
    { path: '/privacy', p: '0.5' },
  ].forEach(({ path, p }) => {
    urls.push({ loc: `${siteUrl}${path}`, changefreq: 'daily', priority: p, lastmod: today });
  });
  // 分类页
  categories.forEach(cat => {
    urls.push({
      loc: `${siteUrl}/category/${getCategorySlug(cat.name)}`,
      changefreq: 'daily',
      priority: '0.8',
      lastmod: today
    });
  });
  // 文章页
  categories.forEach(cat => {
    (cat.postList || []).forEach(post => {
      urls.push({
        loc: `${siteUrl}/post/${getPostSlug(post.title)}`,
        changefreq: 'daily',
        priority: '0.6',
        lastmod: today
      });
    });
  });

  // 生成xml
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u =>
      `  <url>\n` +
      `    <loc>${escapeXml(u.loc)}</loc>\n` +
      `    <lastmod>${u.lastmod}</lastmod>\n` +
      `    <changefreq>${u.changefreq}</changefreq>\n` +
      `    <priority>${u.priority}</priority>\n` +
      `  </url>`
    ),
    '</urlset>'
  ].join('\n');

  fs.writeFileSync(outputPath, xml, 'utf-8');
  console.log('sitemap.xml generated:', outputPath);
}

main(); 