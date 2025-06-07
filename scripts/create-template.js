#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create a template from an existing strategy
const args = process.argv.slice(2);
if (args.length !== 1) {
  console.log('Usage: node create-template.js <source-folder>');
  console.log('Example: node create-template.js ken_440_regression');
  process.exit(1);
}

const [sourceFolder] = args;
const scenesDir = path.join(__dirname, '../src/scenes');
const sourcePath = path.join(scenesDir, sourceFolder);
const templatePath = path.join(__dirname, '../templates/standard-strategy');

// Check if source exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Source folder ${sourceFolder} does not exist`);
  process.exit(1);
}

// Create templates directory
if (!fs.existsSync(path.join(__dirname, '../templates'))) {
  fs.mkdirSync(path.join(__dirname, '../templates'), { recursive: true });
}

// Copy and templatize
function copyAndTemplatize(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    if (fs.statSync(srcFile).isDirectory()) {
      copyAndTemplatize(srcFile, destFile);
    } else {
      let content = fs.readFileSync(srcFile, 'utf8');
      
      // Replace specific strategy names with template variables
      content = content.replace(new RegExp(sourceFolder, 'g'), '{{STRATEGY_NAME}}');
      content = content.replace(/dicedata\/output\/[^\/]+/g, 'dicedata/output/{{STRATEGY_NAME}}-100k-newreport');
      
      // Rename files with template variables
      const templateFileName = file.replace(sourceFolder, '{{STRATEGY_NAME}}');
      const templateFilePath = path.join(dest, templateFileName);
      
      fs.writeFileSync(templateFilePath, content);
    }
  }
}

console.log(`Creating template from ${sourceFolder}...`);
copyAndTemplatize(sourcePath, templatePath);

console.log(`✅ Template created at templates/standard-strategy`);
console.log('This template can now be used to create new videos more efficiently.');