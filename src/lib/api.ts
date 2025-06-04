import { SiteData, Post, Category } from './slices/postsSlice'
import siteDataRaw from '../data/Smart-Buy-Radar.json'

export const siteData: SiteData = siteDataRaw as SiteData

// 获取所有文章
export function getAllPosts(): Post[] {
  const allPosts: Post[] = []
  siteData.categoryList.forEach(category => {
    allPosts.push(...category.postList)
  })
  return allPosts.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

// 根据分类获取文章
export function getPostsByCategory(categorySlug: string): Post[] {
  const category = siteData.categoryList.find(cat => 
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
  return siteData.categoryList
}

// 获取分类的 slug
export function getCategorySlug(categoryName: string): string {
  return categoryName.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')
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
  return siteData.categoryList
    .sort((a, b) => b.postList.length - a.postList.length)
}

// 静态路径生成
export function getAllPostPaths() {
  const allPosts = getAllPosts()
  return allPosts.map(post => ({
    params: { id: post.id.toString() }
  }))
}

export function getAllCategoryPaths() {
  return siteData.categoryList.map(category => ({
    params: { category: getCategorySlug(category.name) }
  }))
} 