#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Usage: node add-to-vite.js <video-name>');
  console.log('Example: node add-to-vite.js my_strategy');
  process.exit(1);
}

const [videoName] = args;
const scenesDir = path.join(__dirname, '../src/scenes');
const videoPath = path.join(scenesDir, videoName);

// Check if video folder exists
if (!fs.existsSync(videoPath)) {
  console.error(`Video folder ${videoName} does not exist in src/scenes/`);
  process.exit(1);
}

// Function to add project to vite.config.ts
function addToViteConfig(videoName) {
  const viteConfigPath = path.join(__dirname, '../vite.config.ts');
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  
  // Check if already exists
  if (content.includes(`./src/scenes/${videoName}/${videoName}.ts`)) {
    console.log(`${videoName} is already in vite.config.ts`);
    return false;
  }
  
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

console.log(`Adding ${videoName} to vite.config.ts...`);
const success = addToViteConfig(videoName);

if (success) {
  console.log(`✅ Added ${videoName} to vite.config.ts`);
  console.log('Restart your dev server to see the new project in Motion Canvas');
} else {
  console.log('⚠️  Could not add to vite.config.ts - it may already exist or there was an error');
}