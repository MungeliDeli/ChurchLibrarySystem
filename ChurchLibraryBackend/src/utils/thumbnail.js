const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs').promises;
const EPub = require('node-epub').EPub;

async function generateThumbnailFromPdf(pdfPath, outputDir) {
  const opts = {
    format: 'jpeg',
    out_dir: outputDir,
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: 1,
    scale_to: 1024
  };

  try {
    await pdf.convert(pdfPath, opts);
    const thumbnailPath = path.join(outputDir, `${path.basename(pdfPath, path.extname(pdfPath))}-1.jpg`);
    
    // Check if the file exists, pdf-poppler might name it differently
    try {
      await fs.access(thumbnailPath);
      return thumbnailPath;
    } catch {
      // Fallback for different naming conventions
      const files = await fs.readdir(outputDir);
      const generatedThumbnail = files.find(file => file.startsWith(path.basename(pdfPath, path.extname(pdfPath))) && file.endsWith('.jpg'));
      
      if (generatedThumbnail) {
        return path.join(outputDir, generatedThumbnail);
      }
    }

    throw new Error('Thumbnail generation failed: output file not found.');

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

async function generateThumbnailFromEpub(epubPath, outputDir) {
    return new Promise((resolve, reject) => {
        const epub = new EPub(epubPath);

        epub.on('end', async () => {
            try {
                let coverImageId = epub.cover;

                // If no cover is explicitly defined, find the first image in the manifest
                if (!coverImageId) {
                    console.warn(`No cover found for ${path.basename(epubPath)}. Searching for first image in manifest...`);
                    for (const key in epub.manifest) {
                        const item = epub.manifest[key];
                        if (item['media-type'] && (item['media-type'] === 'image/jpeg' || item['media-type'] === 'image/png' || item['media-type'] === 'image/gif')) {
                            coverImageId = item.id;
                            console.log(`Found fallback image: ${item.href}`);
                            break;
                        }
                    }
                }

                if (!coverImageId) {
                    return reject(new Error('No cover or fallback image found in EPUB.'));
                }
                
                epub.getImage(coverImageId, async (error, img, mimeType) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!img) {
                        return reject(new Error('Failed to extract image from EPUB.'));
                    }

                    const extension = mimeType.split('/')[1] || 'jpg';
                    const thumbnailFilename = `${path.basename(epubPath, path.extname(epubPath))}.${extension}`;
                    const thumbnailPath = path.join(outputDir, thumbnailFilename);

                    await fs.writeFile(thumbnailPath, img);
                    resolve(thumbnailPath);
                });
            } catch (err) {
                reject(err);
            }
        });

        epub.on('error', (err) => {
            reject(new Error(`Error parsing EPUB file: ${err.message}`));
        });

        epub.parse();
    });
}

module.exports = { generateThumbnailFromPdf, generateThumbnailFromEpub };
