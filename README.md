# Smart Buy Radar

一个基于Next.js的智能购物建议网站，提供季节性商品推荐、租房必需品、优惠券技巧和预算升级建议。

## 项目特性

### 技术栈
- **Next.js 14** - 使用App Router架构
- **Redux Toolkit** - 状态管理
- **CSS Modules** - 样式管理
- **TypeScript** - 类型安全
- **静态站点生成 (SSG)** - 优化性能
- **SDK自动加载** - 集成perfect_sdk_info_mixed脚本

### 功能模块

#### 1. 首页 (/)
- 轮播横幅展示精选文章
- 按分类展示文章列表
- 邮件订阅功能
- 响应式设计

#### 2. 分类页面 (/category/[category])
- 四个主要分类：
  - Seasonal Picks (季节性推荐)
  - Renters' Essentials (租房必需品)
  - Coupon Hacks (优惠券技巧)
  - Budget Upgrades (预算升级)
- 面包屑导航
- 文章网格布局

#### 3. 文章详情页 (/post/[id])
- 完整文章内容展示
- 相关文章推荐
- 社交分享功能
- SEO优化

#### 4. 搜索页面 (/search)
- 全文搜索功能
- 搜索结果展示
- 分类浏览选项
- URL参数支持

#### 5. 法律页面
- 关于我们 (/about)
- 服务条款 (/terms)
- 隐私政策 (/privacy)
- 404错误页面

#### 6. SDK集成
- 自动加载perfect_sdk_info_mixed.js脚本
- 应用初始化和状态管理
- 开发环境调试工具
- SDK测试页面 (/test-sdk)

### 响应式设计
- **PC端**: >1200px
- **平板**: 768-1200px
- **手机A**: 480-768px
- **手机B**: <480px

## 安装和运行

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 启动生产服务器
```bash
npm start
```

## 项目结构

```
src/
├── app/                    # Next.js App Router页面
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── category/          # 分类页面
│   ├── post/              # 文章详情页
│   ├── search/            # 搜索页面
│   ├── about/             # 关于页面
│   ├── terms/             # 条款页面
│   ├── privacy/           # 隐私页面
│   └── not-found.tsx      # 404页面
├── components/            # 可复用组件
│   ├── Header/            # 头部导航
│   ├── Footer/            # 页脚
│   ├── Banner/            # 轮播横幅
│   ├── PostCard/          # 文章卡片
│   ├── AppLoader/         # 应用加载器
│   ├── SDKLoader/         # SDK加载器
│   └── ClientEffects/     # 客户端效果
├── lib/                   # 工具库
│   ├── api.ts            # API函数
│   ├── store.ts          # Redux store
│   └── slices/           # Redux slices
└── data/                  # 数据文件
    └── Smart-Buy-Radar.json
```

## 数据源

项目使用 `Smart-Buy-Radar.json` 作为数据源，包含：
- 文章内容和元数据
- 分类信息
- 图片URL
- SEO信息

## 部署

### Cloudflare Pages 部署（推荐）

项目已优化为Cloudflare Pages部署方式：

#### 1. 自动部署
1. 将代码推送到GitHub仓库
2. 在Cloudflare Dashboard中创建新的Pages项目
3. 连接GitHub仓库
4. 配置构建设置：
   - **构建命令**: `npm run build`
   - **构建输出目录**: `out`
   - **Node.js版本**: 18.x

#### 2. 环境变量（可选）
```
NODE_ENV=production
```

#### 3. 自定义域名
在Cloudflare Pages设置中配置自定义域名和SSL证书

#### 4. 性能优化
项目已配置：
- 静态资源缓存策略（`_headers`文件）
- 路由重定向规则（`_redirects`文件）
- 图片优化和CDN加速
- SEO友好的URL结构

### 其他部署方式
项目配置为静态站点生成，也可以部署到：
- Vercel
- Netlify
- GitHub Pages
- 任何静态文件托管服务

## 开发说明

### SDK集成功能
项目已集成perfect_sdk_info_mixed.js脚本的自动加载功能：
- 应用启动时自动加载SDK脚本
- 智能重试机制确保加载成功
- 开发环境提供可视化状态指示器
- 访问 `/test-sdk` 页面进行功能测试

详细文档请参考：[SDK加载功能文档](docs/SDK_LOADING.md)

### 添加新文章
1. 在 `Smart-Buy-Radar.json` 中添加文章数据
2. 重新构建应用以生成静态页面

### 修改样式
- 使用CSS Modules进行组件级样式管理
- 全局样式在 `globals.css` 中定义
- 响应式断点已预设

### 状态管理
- 使用Redux Toolkit管理应用状态
- 主要状态包括文章、分类和搜索结果

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

本项目仅供学习和演示使用。

---

**Smart Buy Radar** - 您的智能购物决策指南
