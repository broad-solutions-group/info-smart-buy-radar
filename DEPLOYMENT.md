# Cloudflare Pages 部署指南

## 概述

本项目已优化为Cloudflare Pages部署方式，提供最佳的静态网站性能和全球CDN加速。

## 部署步骤

### 1. 准备工作

确保您的项目满足以下要求：
- Node.js 18+ 环境
- 所有依赖已正确安装
- 代码已推送到GitHub仓库

### 2. Cloudflare Pages 配置

#### 2.1 创建Pages项目
1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Pages** 部分
3. 点击 **Create a project**
4. 选择 **Connect to Git**

#### 2.2 连接GitHub仓库
1. 选择 **GitHub** 作为Git提供商
2. 授权Cloudflare访问您的GitHub账户
3. 选择包含本项目的仓库
4. 点击 **Begin setup**

#### 2.3 配置构建设置
在 **Build and deploy** 页面配置：

```
项目名称: info-smart-buy-radar
生产分支: main (或您的主分支名)
框架预设: None
构建命令: npm run build
构建输出目录: out
根目录: / (留空)
```

#### 2.4 环境变量（可选）
在 **Environment variables** 部分添加：
```
NODE_ENV = production
```

### 3. 部署配置

项目已包含以下配置文件：

#### 3.1 `_headers` 文件
配置缓存策略和安全头：
- 静态资源长期缓存（1年）
- HTML页面短期缓存（1小时）
- 安全头保护

#### 3.2 `_redirects` 文件
处理Next.js客户端路由：
- 所有未找到的路径重定向到index.html
- 支持SPA路由

#### 3.3 `next.config.mjs`
Next.js配置：
- 静态导出模式 (`output: 'export'`)
- 图片优化配置
- 禁用服务端功能

### 4. 自定义域名

#### 4.1 添加自定义域名
1. 在Pages项目设置中点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（如：smartshoppingradar.com）
4. 按照提示配置DNS记录

#### 4.2 DNS配置
Cloudflare会自动配置以下DNS记录：
```
CNAME: www -> your-project.pages.dev
CNAME: @ -> your-project.pages.dev
```

### 5. 性能优化

#### 5.1 缓存策略
- **静态资源**: 1年缓存，带immutable标记
- **HTML页面**: 1小时缓存
- **静态页面**: 24小时缓存
- **sitemap**: 24小时缓存

#### 5.2 CDN加速
- 全球200+边缘节点
- 自动图片优化
- Brotli压缩
- HTTP/3支持

### 6. 监控和分析

#### 6.1 访问分析
在Cloudflare Dashboard中查看：
- 访问量统计
- 性能指标
- 错误日志
- 地理位置分布

#### 6.2 性能监控
- Core Web Vitals
- 页面加载时间
- 缓存命中率

### 7. 故障排除

#### 7.1 构建失败
常见原因和解决方案：

1. **Node.js版本问题**
   ```
   确保使用Node.js 18+
   在环境变量中设置 NODE_VERSION=18
   ```

2. **依赖安装失败**
   ```
   检查package.json中的依赖版本
   确保所有依赖兼容
   ```

3. **构建输出目录错误**
   ```
   确保构建输出目录设置为 out
   检查next.config.mjs中的output配置
   ```

#### 7.2 路由问题
如果页面路由不工作：

1. 检查`_redirects`文件配置
2. 确保Next.js配置正确
3. 验证静态生成是否成功

#### 7.3 缓存问题
如果内容更新不及时：

1. 检查缓存头配置
2. 使用Cloudflare的缓存清除功能
3. 验证构建输出

### 8. 持续部署

#### 8.1 自动部署
- 每次推送到主分支时自动触发部署
- 支持预览部署（PR时）
- 自动回滚功能

#### 8.2 部署钩子
可以配置部署后的操作：
- 发送通知
- 触发其他服务
- 更新外部系统

### 9. 安全配置

#### 9.1 安全头
已配置的安全头：
- `X-Frame-Options: DENY` - 防止点击劫持
- `X-Content-Type-Options: nosniff` - 防止MIME类型嗅探
- `Referrer-Policy: strict-origin-when-cross-origin` - 控制referrer信息
- `Permissions-Policy` - 限制浏览器功能

#### 9.2 SSL/TLS
- 自动SSL证书
- 强制HTTPS重定向
- 现代TLS配置

### 10. 成本优化

#### 10.1 免费计划限制
- 每月500次构建
- 每月100,000次请求
- 500MB存储空间

#### 10.2 升级建议
如果超出免费限制：
- 考虑升级到付费计划
- 优化构建频率
- 实施更激进的缓存策略

## 总结

Cloudflare Pages为您的Next.js项目提供了：
- 全球CDN加速
- 自动SSL证书
- 智能缓存策略
- 简单的部署流程
- 强大的监控工具

通过以上配置，您的网站将获得最佳的性能和用户体验。 