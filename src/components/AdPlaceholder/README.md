# AdPlaceholder 组件文档

## 问题背景

### 修复的问题
在原始实现中，广告占位图片出现了 `http://localhost:3000/[object%20Object]` 错误。这是因为：

1. **错误的图片导入使用**: 直接将导入的图片对象作为字符串URL使用
2. **Next.js静态资源处理**: Next.js导入的图片是 `StaticImageData` 对象，不是字符串
3. **内联样式**: 使用内联样式违反了组件化和可维护性原则

### 解决方案

1. **使用Next.js Image组件**: 正确处理静态图片资源
2. **组件化设计**: 创建专门的AdPlaceholder组件
3. **CSS模块**: 使用CSS模块替代内联样式
4. **类型安全**: 提供完整的TypeScript类型定义

## 架构设计

### 设计原则
- **单一职责原则**: 组件专门处理广告展示逻辑
- **DRY原则**: 可复用的广告组件，避免重复代码
- **KISS原则**: 简单直接的API设计
- **组件化**: 将广告逻辑封装在独立组件中

### 组件结构
```
src/app/components/AdPlaceholder/
├── AdPlaceholder.tsx           # 主组件
├── AdPlaceholder.module.css    # 样式文件
└── README.md                   # 文档
```

## 使用方法

### 基本用法
```tsx
import AdPlaceholder from './components/AdPlaceholder/AdPlaceholder';
import adImage from './path/to/ad-image.png';

// 带图片的广告
<AdPlaceholder 
  id="my-ad"
  imageSrc={adImage}
  alt="My Advertisement"
  width={300}
  height={250}
/>

// 占位符广告
<AdPlaceholder 
  id="placeholder-ad"
  width={300}
  height={250}
/>
```

### 高级配置
```tsx
<AdPlaceholder 
  id="custom-ad"
  imageSrc={adImage}
  alt="Custom Advertisement"
  width={728}
  height={90}
  className="custom-ad-style"
/>
```

## API参考

### Props

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| id | string | 'ad-placeholder' | 广告容器的ID |
| width | number | 300 | 广告宽度（像素） |
| height | number | 250 | 广告高度（像素） |
| imageSrc | StaticImageData \| string | undefined | 图片资源 |
| alt | string | 'Advertisement' | 图片alt文本 |
| className | string | '' | 自定义CSS类名 |

### 样式类

| 类名 | 描述 |
|------|------|
| .adContainer | 广告容器样式 |
| .adTip | 广告提示文字样式 |
| .adImage | 广告图片样式 |
| .adPlaceholder | 占位符样式 |
| .placeholderText | 占位符文字样式 |

## 技术细节

### Next.js Image优化
- 自动图片优化和懒加载
- 响应式图片处理
- WebP格式支持
- 性能优化

### 响应式设计
- 移动端适配
- 灵活的尺寸调整
- 触摸友好的交互

### 无障碍支持
- 语义化HTML结构
- 适当的alt文本
- 键盘导航支持

## 最佳实践

1. **图片优化**
   - 使用适当的图片格式
   - 提供合适的尺寸
   - 设置正确的alt文本

2. **性能考虑**
   - 避免在首屏加载大量广告
   - 使用懒加载策略
   - 优化图片大小

3. **用户体验**
   - 提供清晰的广告标识
   - 避免过于突兀的动画
   - 确保移动端友好

## 故障排除

### 常见问题

1. **图片不显示**
   - 检查图片路径是否正确
   - 确认图片文件存在
   - 验证导入语法

2. **样式问题**
   - 检查CSS模块导入
   - 验证类名是否正确
   - 确认响应式样式

3. **TypeScript错误**
   - 确认props类型正确
   - 检查图片类型定义
   - 验证导入语句

### 调试技巧

1. 使用浏览器开发者工具检查元素
2. 查看Network面板确认图片加载
3. 检查Console中的错误信息
4. 验证CSS样式是否正确应用

## 更新日志

### v1.0.0
- 初始版本
- 修复图片加载问题
- 实现组件化设计
- 添加响应式支持 