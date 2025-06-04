const fs = require('fs');
const path = require('path');

/**
 * 复制ads.txt文件到生产目录
 * 遵循KISS原则，保持脚本简单明了
 */
function copyAdsFile() {
  const sourceFile = path.join(__dirname, '..', 'src', 'data', 'ads.txt');
  const targetDir = path.join(__dirname, '..', '.open-next', 'assets');
  const targetFile = path.join(targetDir, 'ads.txt');

  try {
    // 检查源文件是否存在
    if (!fs.existsSync(sourceFile)) {
      console.error('❌ 源文件不存在:', sourceFile);
      process.exit(1);
    }

    // 确保目标目录存在
    if (!fs.existsSync(targetDir)) {
      console.error('❌ 目标目录不存在:', targetDir);
      console.log('请先运行构建命令生成生产目录');
      process.exit(1);
    }

    // 复制文件
    fs.copyFileSync(sourceFile, targetFile);
    console.log('✅ ads.txt 文件已成功复制到生产目录');
    console.log(`   源文件: ${sourceFile}`);
    console.log(`   目标文件: ${targetFile}`);

  } catch (error) {
    console.error('❌ 复制ads.txt文件时发生错误:', error.message);
    process.exit(1);
  }
}

// 执行复制操作
copyAdsFile(); 