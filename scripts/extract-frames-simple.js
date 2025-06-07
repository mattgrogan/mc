#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Check if sharp is available for image processing
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('📦 Sharp not found - install with: npm install sharp');
  console.log('   Background processing will be skipped');
}

const BACKGROUND_COLOR = '#191B1C'; // Dark background color

function padFrameNumber(num, length = 6) {
  return num.toString().padStart(length, '0');
}

// Add background to image and remove transparency
async function addBackground(inputPath, outputPath) {
  if (!sharp) {
    // If sharp is not available, just copy the file
    fs.copyFileSync(inputPath, outputPath);
    return false; // Indicate no processing was done
  }
  
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    // Create a background with the same dimensions
    const background = sharp({
      create: {
        width: metadata.width,
        height: metadata.height,
        channels: 3,
        background: BACKGROUND_COLOR
      }
    })
    .png();
    
    // Composite the original image over the background
    await background
      .composite([{ input: inputPath }])
      .png()
      .toFile(outputPath);
    
    return true; // Indicate processing was successful
  } catch (error) {
    console.log(`   ⚠️  Failed to add background: ${error.message}`);
    // Fallback to copying original file
    fs.copyFileSync(inputPath, outputPath);
    return false;
  }
}

// Extract frame metadata from a scene file
function extractFrameMetadata(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Look for comment-style metadata: // EXTRACT_FRAMES: [123, 456, 789]
  const commentMatch = content.match(/\/\/\s*EXTRACT_FRAMES:\s*\[([^\]]+)\]/i);
  if (commentMatch) {
    const frames = commentMatch[1]
      .split(',')
      .map(f => parseInt(f.trim()))
      .filter(f => !isNaN(f));
    return frames;
  }
  
  // Look for export-style metadata: export const EXTRACT_FRAMES = [123, 456];
  const exportMatch = content.match(/export\s+const\s+EXTRACT_FRAMES\s*=\s*\[([^\]]+)\]/i);
  if (exportMatch) {
    const frames = exportMatch[1]
      .split(',')
      .map(f => parseInt(f.trim()))
      .filter(f => !isNaN(f));
    return frames;
  }
  
  return null; // No metadata found
}

// Extract frames for a specific scene
async function extractSceneFrames(videoName, sceneName, frames, outputDir) {
  const sourcePath = path.join(__dirname, '../output', videoName, sceneName);
  const targetPath = path.join(outputDir, videoName);
  const origPath = path.join(targetPath, 'orig');
  
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  Scene output not found: ${sourcePath}`);
    return { extracted: 0, errors: [`Scene not rendered: ${sceneName}`] };
  }
  
  // Create target directories (flattened - no scene subdirectories)
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }
  if (!fs.existsSync(origPath)) {
    fs.mkdirSync(origPath, { recursive: true });
  }
  
  let extractedCount = 0;
  const errors = [];
  
  // Get available frames for fallback
  const availableFrames = fs.readdirSync(sourcePath)
    .filter(file => file.endsWith('.png'))
    .map(file => parseInt(file.replace('.png', '')))
    .filter(num => !isNaN(num))
    .sort((a, b) => a - b);
  
  for (const frameNum of frames) {
    const sourceFile = path.join(sourcePath, `${padFrameNumber(frameNum)}.png`);
    const baseFileName = `${sceneName}_frame_${padFrameNumber(frameNum)}.png`;
    const origFile = path.join(origPath, baseFileName);
    const targetFile = path.join(targetPath, baseFileName);
    
    if (fs.existsSync(sourceFile)) {
      try {
        // Copy original to orig subfolder
        fs.copyFileSync(sourceFile, origFile);
        
        // Process with background
        const processed = await addBackground(sourceFile, targetFile);
        
        console.log(`   ✅ Extracted frame ${frameNum}${processed ? ' (with background)' : ''}`);
        extractedCount++;
      } catch (error) {
        errors.push(`Failed to process frame ${frameNum}: ${error.message}`);
      }
    } else {
      // Find closest available frame
      if (availableFrames.length > 0) {
        const closest = availableFrames.reduce((prev, curr) => 
          Math.abs(curr - frameNum) < Math.abs(prev - frameNum) ? curr : prev
        );
        
        const closestFile = path.join(sourcePath, `${padFrameNumber(closest)}.png`);
        const baseFileName = `${sceneName}_frame_${padFrameNumber(frameNum)}_closest_${padFrameNumber(closest)}.png`;
        const origFile = path.join(origPath, baseFileName);
        const targetFile = path.join(targetPath, baseFileName);
        
        try {
          // Copy original to orig subfolder
          fs.copyFileSync(closestFile, origFile);
          
          // Process with background
          const processed = await addBackground(closestFile, targetFile);
          
          console.log(`   📐 Extracted closest frame ${closest} (wanted ${frameNum})${processed ? ' (with background)' : ''}`);
          extractedCount++;
        } catch (error) {
          errors.push(`Failed to process closest frame ${closest} for ${frameNum}: ${error.message}`);
        }
      } else {
        errors.push(`Frame ${frameNum} not found and no alternatives available`);
      }
    }
  }
  
  return { extracted: extractedCount, errors };
}

// Process all scenes in a video
async function extractFramesFromVideo(videoName, outputDir) {
  const scenesPath = path.join(__dirname, '../src/scenes', videoName);
  
  if (!fs.existsSync(scenesPath)) {
    console.log(`❌ Video scenes not found: ${videoName}`);
    return;
  }
  
  // Find all .tsx scene files
  const sceneFiles = fs.readdirSync(scenesPath)
    .filter(file => file.endsWith('.tsx') && file.startsWith('DD_'))
    .sort();
  
  if (sceneFiles.length === 0) {
    console.log(`⚠️  No scene files found in: ${scenesPath}`);
    return;
  }
  
  console.log(`\n🎬 Processing video: ${videoName}`);
  console.log(`Found ${sceneFiles.length} scene files`);
  
  let totalExtracted = 0;
  let totalScenes = 0;
  const allErrors = [];
  
  for (const sceneFile of sceneFiles) {
    const sceneName = sceneFile.replace('.tsx', '');
    const sceneFilePath = path.join(scenesPath, sceneFile);
    
    // Extract frame metadata from the scene file
    const frames = extractFrameMetadata(sceneFilePath);
    
    if (frames && frames.length > 0) {
      console.log(`\n📋 ${sceneName}: extracting frames [${frames.join(', ')}]`);
      const result = await extractSceneFrames(videoName, sceneName, frames, outputDir);
      totalExtracted += result.extracted;
      totalScenes++;
      
      if (result.errors.length > 0) {
        allErrors.push(...result.errors.map(err => `${sceneName}: ${err}`));
      }
    } else {
      console.log(`\n⚪ ${sceneName}: no EXTRACT_FRAMES metadata found`);
    }
  }
  
  console.log(`\n📊 Video ${videoName} summary:`);
  console.log(`   📋 Scenes processed: ${totalScenes}`);
  console.log(`   ✅ Frames extracted: ${totalExtracted}`);
  console.log(`   ❌ Errors: ${allErrors.length}`);
  
  if (allErrors.length > 0) {
    console.log('\n❌ Errors:');
    allErrors.forEach(error => console.log(`   ${error}`));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Simple Frame Extractor');
    console.log('');
    console.log('Usage: node extract-frames-simple.js <video-name> [output-directory]');
    console.log('');
    console.log('Add frame metadata to your scene files using either:');
    console.log('  // EXTRACT_FRAMES: [120, 240, 360]');
    console.log('  export const EXTRACT_FRAMES = [120, 240, 360];');
    console.log('');
    console.log('Examples:');
    console.log('  node extract-frames-simple.js ken_440_regression');
    console.log('  node extract-frames-simple.js ken_440_regression ./my-archive');
    console.log('');
    
    // List available videos
    const scenesDir = path.join(__dirname, '../src/scenes');
    if (fs.existsSync(scenesDir)) {
      const videos = fs.readdirSync(scenesDir)
        .filter(item => {
          const itemPath = path.join(scenesDir, item);
          return fs.statSync(itemPath).isDirectory();
        });
      
      console.log('Available videos:');
      videos.forEach(video => console.log(`  - ${video}`));
    }
    return;
  }
  
  const videoName = args[0];
  const outputDir = args[1] || './archived-frames';
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`📁 Created output directory: ${outputDir}`);
  }
  
  await extractFramesFromVideo(videoName, outputDir);
  console.log('\n🎉 Frame extraction complete!');
}

if (require.main === module) {
  main().catch(error => {
    console.error('❌ Error during extraction:', error);
    process.exit(1);
  });
}