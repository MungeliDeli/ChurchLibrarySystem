const pdf = require('pdf-poppler');
const path = require('path');
const fs = require('fs');

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
    if (fs.existsSync(thumbnailPath)) {
      return thumbnailPath;
    }
    
    // Fallback for different naming conventions
    const files = fs.readdirSync(outputDir);
    const generatedThumbnail = files.find(file => file.startsWith(path.basename(pdfPath, path.extname(pdfPath))) && file.endsWith('.jpg'));
    
    if (generatedThumbnail) {
      return path.join(outputDir, generatedThumbnail);
    }

    throw new Error('Thumbnail generation failed: output file not found.');

  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
}

module.exports = { generateThumbnailFromPdf };
