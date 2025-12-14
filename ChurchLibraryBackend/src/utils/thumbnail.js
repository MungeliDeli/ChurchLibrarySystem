const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs').promises;
const EPub = require('epub');

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
                
                console.log(`Processing EPUB: ${path.basename(epubPath)}`);
                console.log(`Cover ID from metadata: ${coverImageId}`);

                // If no cover is explicitly defined, find the first image in the manifest
                if (!coverImageId) {
                    console.warn(`No cover found for ${path.basename(epubPath)}. Searching for first image in manifest...`);
                    
                    // Log all manifest items for debugging
                    console.log('Manifest items:');
                    for (const key in epub.manifest) {
                        const item = epub.manifest[key];
                        console.log(`  - ${key}: ${item['media-type']} (${item.href})`);
                    }

                    // Search for any image type (more flexible matching)
                    for (const key in epub.manifest) {
                        const item = epub.manifest[key];
                        const mediaType = item['media-type'] || '';
                        
                        // Check if media-type starts with 'image/'
                        if (mediaType.startsWith('image/')) {
                            coverImageId = key; // Use the key (id), not item.id
                            console.log(`Found fallback image: ${item.href} (${mediaType})`);
                            break;
                        }
                    }
                }

                if (!coverImageId) {
                    console.error('No cover or fallback image found in EPUB.');
                    console.log('Available manifest keys:', Object.keys(epub.manifest));
                    return reject(new Error('No cover or fallback image found in EPUB.'));
                }
                
                console.log(`Attempting to extract image with ID: ${coverImageId}`);
                
                epub.getImage(coverImageId, async (error, img, mimeType) => {
                    if (error) {
                        console.error('Error extracting image from EPUB:', error);
                        return reject(error);
                    }

                    if (!img || img.length === 0) {
                        console.error('Failed to extract image: empty buffer received');
                        return reject(new Error('Failed to extract image from EPUB.'));
                    }

                    console.log(`Image extracted successfully. Size: ${img.length} bytes, MIME type: ${mimeType}`);

                    // Determine extension from mimeType
                    let extension = 'jpg'; // default
                    if (mimeType) {
                        const parts = mimeType.split('/');
                        if (parts.length === 2) {
                            extension = parts[1].replace('jpeg', 'jpg');
                        }
                    }
                    
                    const thumbnailFilename = `${path.basename(epubPath, path.extname(epubPath))}.${extension}`;
                    const thumbnailPath = path.join(outputDir, thumbnailFilename);

                    console.log(`Writing thumbnail to: ${thumbnailPath}`);

                    try {
                        await fs.writeFile(thumbnailPath, img);
                        console.log(`Thumbnail written successfully: ${thumbnailPath}`);
                        resolve(thumbnailPath);
                    } catch (writeError) {
                        console.error('Error writing thumbnail file:', writeError);
                        reject(writeError);
                    }
                });
            } catch (err) {
                console.error('Error in EPUB processing:', err);
                reject(err);
            }
        });

        epub.on('error', (err) => {
            console.error('Error parsing EPUB file:', err);
            reject(new Error(`Error parsing EPUB file: ${err.message}`));
        });

        console.log(`Starting to parse EPUB: ${epubPath}`);
        epub.parse();
    });
}

module.exports = { generateThumbnailFromPdf, generateThumbnailFromEpub };