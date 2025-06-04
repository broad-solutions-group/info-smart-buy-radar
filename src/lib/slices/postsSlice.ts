import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Post {
  id: number
  title: string
  slug: string
  categoryName: string
  createTime: string
  duration: string
  imageUrl: string
  description: string
  content: string
}

export interface Category {
  id: number
  name: string
  postList: Post[]
}

export interface SiteData {
  id: number
  name: string
  keywords: string
  description: string
  categoryList: Category[]
}

interface PostsState {
  siteData: SiteData | null
  currentCategory: string | null
  searchQuery: string
  isLoading: boolean
  error: string | null
}

const initialState: PostsState = {
  siteData: null,
  currentCategory: null,
  searchQuery: '',
  isLoading: false,
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSiteData: (state, action: PayloadAction<SiteData>) => {
      state.siteData = action.payload
    },
    setCurrentCategory: (state, action: PayloadAction<string | null>) => {
      state.currentCategory = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setSiteData,
  setCurrentCategory,
  setSearchQuery,
  setLoading,
  setError,
} = postsSlice.actions

export default postsSlice.reducer 