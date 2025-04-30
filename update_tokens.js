const fs = require('fs');
const path = require('path');

// Find all dimension.css files
const findFiles = (dir, pattern) => {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    
    if (stat && stat.isDirectory()) { 
      results = results.concat(findFiles(file, pattern));
    } else if (file.includes(pattern)) {
      results.push(file);
    }
  });
  
  return results;
};

// Find all dimension.css files
console.log('Searching for dimension.css files...');
const dimensionFiles = findFiles('.', 'dimension.css');
console.log('Found files:', dimensionFiles);

// Path to tokens.ts
let tokensJsPath = path.join(process.cwd(), 'src', 'tokens.ts');
if (!fs.existsSync(tokensJsPath)) {
  console.log('tokens.ts not found at:', tokensJsPath);
  const srcDir = path.join(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    console.log('src directory exists, listing contents:');
    console.log(fs.readdirSync(srcDir));
  } else {
    console.log('src directory does not exist');
  }
  // Find tokens.ts anywhere in the repo
  console.log('Searching for tokens.ts elsewhere...');
  const tokensFiles = findFiles('.', 'tokens.ts');
  console.log('Found potential tokens.ts files:', tokensFiles);
  
  if (tokensFiles.length > 0) {
    tokensJsPath = tokensFiles[0];
    console.log('Using tokens.ts at:', tokensJsPath);
  } else {
    console.error('Could not find tokens.ts anywhere');
    process.exit(1);
  }
}

// Read tokens.ts
const tokensContent = fs.readFileSync(tokensJsPath, 'utf8');
console.log('Read tokens.ts successfully');

let newValue = null;

// Check each dimension.css file for the mobile width
for (const file of dimensionFiles) {
  console.log('Checking file:', file);
  const cssContent = fs.readFileSync(file, 'utf8');
  
  // Look for the specific dimension we're interested in
  const mobileWidthMatch = cssContent.match(/--dimension-order-info-card-mobile-width:\s*(\d+)px/);
  if (mobileWidthMatch) {
    newValue = mobileWidthMatch[1];
    console.log('Found mobile width value:', newValue);
    break;
  }
  
  // Alternative pattern in case of different formatting
  const alternativeMatch = cssContent.match(/order-info-card-mobile-width:\s*(\d+)px/);
  if (alternativeMatch) {
    newValue = alternativeMatch[1];
    console.log('Found mobile width value (alternative format):', newValue);
    break;
  }
}

if (!newValue) {
  console.log('Could not find mobile width value in any dimension.css file');
  process.exit(0);
}

// Update tokens.ts
const updatedContent = tokensContent.replace(
  /(orderInfoCard\s*:\s*{\s*mobileWidth\s*:\s*['"])(\d+)(px['"])/,
  `$1${newValue}$3`
);

if (updatedContent !== tokensContent) {
  fs.writeFileSync(tokensJsPath, updatedContent);
  console.log('Updated tokens.ts with new mobile width value:', newValue);
} else {
  console.log('No changes made to tokens.ts');
}
