import { SiteData, Post, Category } from './slices/postsSlice'
import siteDataRaw from '../data/Smart-Buy-Radar.json'

export const siteData: SiteData = siteDataRaw as SiteData

// 获取分类的 slug
export function getCategorySlug(categoryName: string): string {
  return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
}

// 生成文章的 slug
export function generatePostSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // 移除特殊字符，保留字母、数字、空格和连字符
    .replace(/\s+/g, '-') // 将空格替换为连字符
    .replace(/-+/g, '-') // 将多个连字符合并为一个
    .replace(/^-|-$/g, '') // 移除开头和结尾的连字符
    .substring(0, 60) // 限制长度为60个字符
}

// 为所有文章添加slug字段
function addSlugsToData(): SiteData {
  const dataWithSlugs = { ...siteData }
  dataWithSlugs.categoryList = dataWithSlugs.categoryList.map(category => ({
    ...category,
    postList: category.postList.map(post => ({
      ...post,
      slug: generatePostSlug(post.title)
    }))
  }))
  return dataWithSlugs
}

// 使用带slug的数据
const siteDataWithSlugs = addSlugsToData()

// 获取所有文章
export function getAllPosts(): Post[] {
  const allPosts: Post[] = []
  siteDataWithSlugs.categoryList.forEach(category => {
    allPosts.push(...category.postList)
  })
  return allPosts.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

// 根据分类获取文章
export function getPostsByCategory(categorySlug: string): Post[] {
  const category = siteDataWithSlugs.categoryList.find(cat => 
    getCategorySlug(cat.name) === categorySlug.toLowerCase()
  )
  return category ? category.postList.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  ) : []
}

// 根据ID获取文章
export function getPostById(id: number): Post | undefined {
  const allPosts = getAllPosts()
  return allPosts.find(post => post.id === id)
}

// 根据slug获取文章
export function getPostBySlug(slug: string): Post | undefined {
  const allPosts = getAllPosts()
  return allPosts.find(post => post.slug === slug)
}

// 搜索文章
export function searchPosts(query: string): Post[] {
  if (!query.trim()) return []
  
  const allPosts = getAllPosts()
  const searchTerm = query.toLowerCase()
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.categoryName.toLowerCase().includes(searchTerm)
  )
}

// 获取分类列表
export function getCategories(): Category[] {
  return siteDataWithSlugs.categoryList
}

// 获取相关文章
export function getRelatedPosts(currentPost: Post, limit: number = 3): Post[] {
  const categoryPosts = getPostsByCategory(getCategorySlug(currentPost.categoryName))
  return categoryPosts
    .filter(post => post.id !== currentPost.id)
    .slice(0, limit)
}

// 获取最新文章
export function getLatestPosts(limit: number = 6): Post[] {
  return getAllPosts().slice(0, limit)
}

// 获取热门分类（根据文章数量）
export function getPopularCategories(): Category[] {
  return siteDataWithSlugs.categoryList
    .sort((a, b) => b.postList.length - a.postList.length)
}

// 静态路径生成
export function getAllPostPaths() {
  const allPosts = getAllPosts()
  return allPosts.map(post => ({
    params: { slug: post.slug }
  }))
}

export function getAllCategoryPaths() {
  return siteDataWithSlugs.categoryList.map(category => ({
    params: { category: getCategorySlug(category.name) }
  }))
} 