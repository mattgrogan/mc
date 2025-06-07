#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 2) {
  console.log('Usage: node create-new-video.js <new-video-name> <source-folder>');
  console.log('Example: node create-new-video.js my_new_strategy ken_440_regression');
  console.log('Example: node create-new-video.js video_3 my_new_strategy');
  console.log('');
  console.log('Available source folders:');
  
  // List available video folders
  const scenesDir = path.join(__dirname, '../src/scenes');
  const folders = fs.readdirSync(scenesDir)
    .filter(folder => {
      const folderPath = path.join(scenesDir, folder);
      const mainTsFile = path.join(folderPath, `${folder}.ts`);
      return fs.statSync(folderPath).isDirectory() && fs.existsSync(mainTsFile);
    })
    .sort();
  
  folders.forEach(folder => console.log(`  - ${folder}`));
  process.exit(1);
}

const newVideoName = args[0];
const sourceFolder = args[1];
const scenesDir = path.join(__dirname, '../src/scenes');
const sourcePath = path.join(scenesDir, sourceFolder);
const targetPath = path.join(scenesDir, newVideoName);

// Check if source exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Source folder ${sourceFolder} does not exist`);
  process.exit(1);
}

// Check if target already exists
if (fs.existsSync(targetPath)) {
  console.error(`Target folder ${newVideoName} already exists`);
  process.exit(1);
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

// Function to update import paths in files
function updateImportPaths(filePath, oldName, newName) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Special handling for DD_00_Params.ts
  if (filePath.includes('DD_00_Params.ts')) {
    // Update the SIM_NAME constant
    content = content.replace(
      /export const SIM_NAME = "[^"]*";/,
      `export const SIM_NAME = "${newName}";`
    );
    
    // Update all the literal import paths
    const jsonImportRegex = new RegExp(`dicedata/output/${oldName}[^/]*`, 'g');
    content = content.replace(jsonImportRegex, `dicedata/output/${newName}-100k-newreport`);
  } else {
    // For other files, just update any remaining old name references
    const oldNameRegex = new RegExp(oldName, 'g');
    content = content.replace(oldNameRegex, newName);
  }
  
  fs.writeFileSync(filePath, content);
}

// Function to rename files
function renameFiles(dir, oldName, newName) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    
    if (fs.statSync(fullPath).isDirectory()) {
      renameFiles(fullPath, oldName, newName);
    } else {
      // Rename .ts files
      if (file.includes(oldName) && file.endsWith('.ts')) {
        const newFileName = file.replace(oldName, newName);
        const newFilePath = path.join(dir, newFileName);
        fs.renameSync(fullPath, newFilePath);
        
        // Update content of renamed file
        updateImportPaths(newFilePath, oldName, newName);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        // Update imports in other files
        updateImportPaths(fullPath, oldName, newName);
      }
    }
  }
}

console.log(`Copying ${sourceFolder} to ${newVideoName}...`);
copyDir(sourcePath, targetPath);

console.log('Renaming files and updating imports...');
renameFiles(targetPath, sourceFolder, newVideoName);

// Function to add project to vite.config.ts
function addToViteConfig(videoName) {
  const viteConfigPath = path.join(__dirname, '../vite.config.ts');
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Find the project array and add new entries before the closing bracket
  const projectArrayRegex = /project:\s*\[([\s\S]*?)\]/;
  const match = content.match(projectArrayRegex);
  
  if (match) {
    const projectArray = match[1];
    const lastActiveProject = projectArray.split('\n').filter(line => 
      line.trim() && !line.trim().startsWith('//')
    ).pop();
    
    if (lastActiveProject) {
      const indent = lastActiveProject.match(/^(\s*)/)[1];
      const newEntries = `${indent}"./src/scenes/${videoName}/${videoName}.ts",\n${indent}"./src/scenes/${videoName}/${videoName}_demo.ts",`;
      
      // Insert new entries after the last active project
      const insertPoint = content.indexOf(lastActiveProject) + lastActiveProject.length;
      content = content.slice(0, insertPoint) + '\n' + newEntries + content.slice(insertPoint);
      
      fs.writeFileSync(viteConfigPath, content);
      return true;
    }
  }
  return false;
}

console.log('Adding to vite.config.ts...');
const viteConfigUpdated = addToViteConfig(newVideoName);

console.log(`✅ New video folder created: ${newVideoName}`);
if (viteConfigUpdated) {
  console.log('✅ Added to vite.config.ts');
} else {
  console.log('⚠️  Could not automatically add to vite.config.ts - please add manually');
}

console.log('\nNext steps:');
console.log('1. Update DD_00_Params.ts with your strategy parameters');
console.log('2. Verify JSON data paths are correct for your new strategy');
console.log('3. Start development server with: npm start');