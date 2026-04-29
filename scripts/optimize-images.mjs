import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const sourceDirectories = [
  path.join(projectRoot, 'public'),
  path.join(projectRoot, 'server', 'uploads'),
];

const sourceExtensions = new Set(['.png', '.jpg', '.jpeg']);

async function collectImageFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...await collectImageFiles(entryPath));
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(entryPath);
    }
  }

  return files;
}

async function convertImage(filePath) {
  const outputPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp');

  await sharp(filePath)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true, fit: 'inside' })
    .webp({ quality: 82 })
    .toFile(outputPath);

  // Delete original file after successful conversion
  await fs.unlink(filePath);

  return outputPath;
}

async function main() {
  const files = [];

  for (const directory of sourceDirectories) {
    try {
      files.push(...await collectImageFiles(directory));
    } catch (error) {
      if (error && error.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  files.sort();

  let convertedCount = 0;
  for (const filePath of files) {
    await convertImage(filePath);
    convertedCount += 1;
    console.log(`Converted ${path.relative(projectRoot, filePath)}`);
  }

  console.log(`Done. Converted ${convertedCount} image(s) to WebP.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});