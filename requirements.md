这是一个全英资讯网站SmartBuyRadar，不要出现中文，并基于 Next.js + Redux + CSS Modules + SSG 的技术栈进行设计规划。以下是分析和规划细节：

---

## 🧭 网站定位分析：Smart Buy Radar

### 🎯 网站主题

**Smart Buy Radar** 是一个聚焦于“精明消费”的资讯类站点，致力于帮助用户根据季节、预算和生活场景做出实用、节省的购物决策。内容强调“实用、性价比高、应季且具有生活改善作用”的产品推荐和购物策略。

---

## 🗂 网站信息结构（内容分类）

从 `categoryList` 和文章关键词来看，网站主要有四个核心分类：

1. **Seasonal Picks**

数据使用Smart-Buy-Radar.json中的Seasonal Picks

   * 各季节推荐清单：夏日好物、冬季必备、春季焕新、秋季舒适好物等
   * 节日/返校/打折季购物指南：如黑五、返校季、圣诞节准备等

2. **Renters' Essentials**

数据使用Smart-Buy-Radar.json中的Renters' Essentials

   * 适用于小空间、租房者的高性价比生活工具、装饰、节能、安全建议等

3. **Coupon Hacks**

数据使用Smart-Buy-Radar.json中的Coupon Hacks

4. **Budget Upgrades**

数据使用Smart-Buy-Radar.json中的Budget Upgrades

---

## ✨ 网站风格建议（内容与设计统一）

采用全屏排版，首页banner采用全屏个性化轮播

### 内容风格：

* 英文语调自然、实用、有生活共鸣，风格介于 BuzzFeed 与 Wirecutter 之间。
* 使用标题+子标题、段落短、列表多、强调 why it’s worth it。

### 视觉风格：

* **现代简洁，略带温暖生活气息**
* 用色：白底 + 主题色点缀（推荐明亮蓝或绿色，强化“雷达”感）
* 字体建议：`Inter`, `Roboto`, `Georgia`（主文本用无衬线，强调部分可用衬线体）

---

## 💡 网站功能模块设计

页面文件结构参考首页 src/app/home

| 模块            | 功能说明                                        |
| ------------- | ------------------------------------------- |
| 首页            | 最新推荐、热榜精选、分类导航、搜索入口                         |
| 分类页（Category） | 展示该分类下的文章列表                                 |
| 文章页（Post）     | 展示内容正文、标题图、标签、推荐阅读                          |
| 搜索页（Search）   | 支持按关键词快速查找相关内容                              |
| 404 页面        | 风格一致，保持友好文案与导航入口                            |
| SEO 支持        | 每篇文章含有 `<meta>` 标签生成，使用 `next-seo` 配置       |
| SSG 渲染        | 所有内容通过 `getStaticPaths + getStaticProps` 渲染 |

---

页脚footer信息：

Copyright © 2025 smartshoppingradar.com
About Us
Terms of Service
Privacy Policy

## ⚙ 技术架构与开发规范

### 技术栈

* **框架**：Next.js（13+，支持 App Router 和 SSG）
* **状态管理**：Redux Toolkit（如有跨页面购物记录、收藏、偏好可使用）
* **样式系统**：CSS Modules（每个组件一个独立的 `.module.css` 文件）
* **渲染方式**：SSG（所有页面通过静态生成）

### 响应式断点（兼容设备）

| 设备类型 | 断点范围（px） |
| ---- | -------- |
| PC   | > 1200   |
| 平板   | 768–1200 |
| 移动端A | 480–768  |
| 移动端B | < 480    |


## 📘 接下来可执行的步骤

1. 根据 JSON 建立 mock 数据读取 API（或本地 JSON 导入 `lib/api.ts`）
2. 按照分类 slug 和文章 ID 建立静态路径（`getStaticPaths`）
3. 设计全站的 CSS Module 文件规范和样式命名（BEM + `CamelCase` 推荐）
4. 开发首页、分类页、文章页组件结构
5. 加入 SEO 元信息 + SSG 渲染优化

---
