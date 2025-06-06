import { SiteData, Post, Category } from './slices/postsSlice'

// CDN数据源
const SITE_DATA_URL = 'https://cdn-info.broadsolutionsgroup.com/articles/website-16/Smart-Buy-Radar.json'

// 缓存数据
let cachedSiteData: SiteData | null = null

// 获取站点数据
async function fetchSiteData(): Promise<SiteData> {
  if (cachedSiteData) {
    return cachedSiteData
  }

  try {
    const response = await fetch(SITE_DATA_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status}`)
    }
    const data = await response.json()
    cachedSiteData = data as SiteData
    return cachedSiteData
  } catch (error) {
    console.error('Error fetching site data:', error)
    // 返回默认数据结构以防止应用崩溃
    return {
      id: 16,
      name: "Smart Buy Radar",
      keywords: "smart shopping, seasonal deals, budget upgrades, coupon hacks, renter essentials, buying guide",
      description: "",
      categoryList: []
    }
  }
}

// 同步获取缓存的数据（用于服务端渲染）
export const siteData: SiteData = {
  id: 16,
  name: "Smart Buy Radar",
  keywords: "best summer deals 2025, affordable winter must-haves, spring home refresh ideas, fall comfort items on a budget, seasonal sales shopping guide, back-to-school smart buys, holiday prep shopping list, cheap cooling gadgets summer, budget picks for cold weather, how to shop smart each season, multi-tools for apartment living, tiny apartment storage hacks, renter-friendly home upgrades, compact kitchen tools for small spaces, cleaning gear for small apartments, removable wall decor for renters, noise reduction ideas for apartments, cozy renter home ideas, smart security tools for renters, energy saving tips for renters, how to stack coupons online, chrome extensions for coupons, amazon hidden coupon tips, best coupon websites compared, cashback and coupon strategies, store-specific coupon hacks, tiktok coupon hacks tested, stacking gift cards with coupons, track price drops with coupons, coupon tricks before checkout, home upgrades under $20, affordable alternatives to expensive products, luxury-looking budget home upgrades, budget office setup ideas, cheap kitchen tweaks that work, cozy lighting on a budget, budget tech gadgets that work, small apartment storage solutions, premium looking cheap home items, tools to fix home problems on a budget",
  description: "",
  categoryList: []
}

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
function addSlugsToData(data: SiteData): SiteData {
  const dataWithSlugs = { ...data }
  dataWithSlugs.categoryList = dataWithSlugs.categoryList.map(category => ({
    ...category,
    postList: category.postList.map(post => ({
      ...post,
      slug: generatePostSlug(post.title)
    }))
  }))
  return dataWithSlugs
}

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  const data = await fetchSiteData()
  const siteDataWithSlugs = addSlugsToData(data)
  const allPosts: Post[] = []
  siteDataWithSlugs.categoryList.forEach(category => {
    allPosts.push(...category.postList)
  })
  return allPosts.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

// 根据分类获取文章
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const data = await fetchSiteData()
  const siteDataWithSlugs = addSlugsToData(data)
  const category = siteDataWithSlugs.categoryList.find(cat => 
    getCategorySlug(cat.name) === categorySlug.toLowerCase()
  )
  return category ? category.postList.sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
  ) : []
}

// 根据ID获取文章
export async function getPostById(id: number): Promise<Post | undefined> {
  const allPosts = await getAllPosts()
  return allPosts.find(post => post.id === id)
}

// 根据slug获取文章
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const allPosts = await getAllPosts()
  return allPosts.find(post => post.slug === slug)
}

// 搜索文章
export async function searchPosts(query: string): Promise<Post[]> {
  if (!query.trim()) return []
  
  const allPosts = await getAllPosts()
  const searchTerm = query.toLowerCase()
  
  return allPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm) ||
    post.description.toLowerCase().includes(searchTerm) ||
    post.content.toLowerCase().includes(searchTerm) ||
    post.categoryName.toLowerCase().includes(searchTerm)
  )
}

// 获取分类列表
export async function getCategories(): Promise<Category[]> {
  const data = await fetchSiteData()
  const siteDataWithSlugs = addSlugsToData(data)
  return siteDataWithSlugs.categoryList
}

// 获取相关文章
export async function getRelatedPosts(currentPost: Post, limit: number = 3): Promise<Post[]> {
  const categoryPosts = await getPostsByCategory(getCategorySlug(currentPost.categoryName))
  return categoryPosts
    .filter(post => post.id !== currentPost.id)
    .slice(0, limit)
}

// 获取最新文章
export async function getLatestPosts(limit: number = 6): Promise<Post[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}

// 获取热门分类（根据文章数量）
export async function getPopularCategories(): Promise<Category[]> {
  const data = await fetchSiteData()
  const siteDataWithSlugs = addSlugsToData(data)
  return siteDataWithSlugs.categoryList
    .sort((a, b) => b.postList.length - a.postList.length)
}

// 静态路径生成
export async function getAllPostPaths() {
  const allPosts = await getAllPosts()
  return allPosts.map(post => ({
    params: { slug: post.slug }
  }))
}

export async function getAllCategoryPaths() {
  const data = await fetchSiteData()
  const siteDataWithSlugs = addSlugsToData(data)
  return siteDataWithSlugs.categoryList.map(category => ({
    params: { category: getCategorySlug(category.name) }
  }))
} 