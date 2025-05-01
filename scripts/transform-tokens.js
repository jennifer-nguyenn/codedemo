const fs = require('fs');
const path = require('path');

/**
 * Token transformer that maps between Supernova tokens and application tokens
 */
class TokenTransformer {
  constructor() {
    this.baseDir = process.cwd();
    this.tokensPath = path.join(this.baseDir, 'src', 'styles', 'tokens.ts');
    this.hasChanges = false;
    
    // Define explicit mappings between Supernova and application tokens
    // Format: 'SupernovaTokenName': { path: 'TokenName in application', regex: RegExp to find it }
    this.tokenMappings = {
      'dimensionOrderInfoCardMobileWidth': { 
        path: 'mobileWidth', 
        regex: /(mobileWidth\s*:\s*['"])([^'"]+)(['"])/
      },
      'orderInfoCardShowTime': {
        path: 'showTime',
        regex: /(showTime\s*:\s*)(true|false)/
      },
      'orderInfoCardShowPaymentBadge': {
        path: 'showPaymentBadge',
        regex: /(showPaymentBadge\s*:\s*)(true|false)/
      },
      'orderInfoCardShowManagePaymentPlan': {
        path: 'showManagePaymentPlan',
        regex: /(showManagePaymentPlan\s*:\s*)(true|false)/
      }
      // Add more mappings as needed for other tokens
    };
  }

  async transform() {
    try {
      console.log('Starting token transformation process...');
      console.log('Current working directory:', this.baseDir);
      
      // Find the dimension.ts file
      await this.findDimensionFile();
      
      // Read the files
      await this.readFiles();
      
      // Extract tokens from dimension.ts
      this.extractTokens();
      
      // Update application tokens
      this.updateApplicationTokens();
      
      // Write updated tokens if changes were made
      if (this.hasChanges) {
        await this.writeTokensFile();
        console.log('✅ Token transformation completed with changes');
        return true;
      } else {
        console.log('ℹ️ No changes detected in tokens');
        return false;
      }
    } catch (error) {
      console.error('❌ Error transforming tokens:', error);
      throw error;
    }
  }

  async findDimensionFile() {
    console.log('Looking for dimension.ts file...');
    
    // Define possible locations for the dimension.ts file
    const possiblePaths = [
      path.join(this.baseDir, 'src', 'generated-tokens.js', 'base', 'dimension.ts'),
      path.join(this.baseDir, 'src', 'generated-tokens.js', 'dimension.ts')
    ];
    
    // Try each path
    for (const potentialPath of possiblePaths) {
      try {
        await fs.promises.access(potentialPath);
        console.log(`Found dimension.ts at: ${potentialPath}`);
        this.dimensionPath = potentialPath;
        return;
      } catch (error) {
        console.log(`No dimension.ts file at: ${potentialPath}`);
      }
    }
    
    // If we get here, try to list files in the directory
    const baseDir = path.join(this.baseDir, 'src', 'generated-tokens.js');
    try {
      console.log(`Listing files in ${baseDir}:`);
      const files = await fs.promises.readdir(baseDir, { withFileTypes: true });
      
      for (const file of files) {
        console.log(` - ${file.name} ${file.isDirectory() ? '(directory)' : '(file)'}`);
        
        if (file.isDirectory() && file.name === 'base') {
          const baseFiles = await fs.promises.readdir(path.join(baseDir, 'base'));
          console.log(`  Files in base directory:`);
          baseFiles.forEach(f => console.log(`   - ${f}`));
        }
      }
    } catch (error) {
      console.error('Error listing directory:', error.message);
    }
    
    throw new Error('Could not find dimension.ts file');
  }

  async readFiles() {
    try {
      console.log(`Reading dimension tokens from: ${this.dimensionPath}`);
      this.dimensionContent = await fs.promises.readFile(this.dimensionPath, 'utf8');
      
      console.log(`Reading application tokens from: ${this.tokensPath}`);
      this.tokensContent = await fs.promises.readFile(this.tokensPath, 'utf8');
      
      // Log a sample of the content for debugging
      console.log('Dimension file sample:');
      console.log(this.dimensionContent.substring(0, 200));
      
      console.log('Application tokens sample:');
      console.log(this.tokensContent.substring(0, 200));
    } catch (error) {
      console.error('Error reading files:', error);
      throw error;
    }
  }

  extractTokens() {
    console.log('Extracting tokens from dimension.ts...');
    
    // Initialize tokens object
    this.extractedTokens = {};
    
    // Extract constant declarations from dimension.ts
    const constRegex = /const\s+(\w+)\s*=\s*['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = constRegex.exec(this.dimensionContent)) !== null) {
      const [_, tokenName, tokenValue] = match;
      this.extractedTokens[tokenName] = tokenValue;
      console.log(`Found token: ${tokenName} = ${tokenValue}`);
    }
  }

  updateApplicationTokens() {
    console.log('Updating application tokens...');
    let updatedContent = this.tokensContent;
    
    // Process each mapping
    for (const [supernovaToken, mapping] of Object.entries(this.tokenMappings)) {
      if (this.extractedTokens[supernovaToken]) {
        const newValue = this.extractedTokens[supernovaToken];
        console.log(`Processing: ${supernovaToken} (${newValue}) -> ${mapping.path}`);
        
        updatedContent = updatedContent.replace(mapping.regex, (match, p1, p2, p3) => {
          if (p2 !== newValue) {
            console.log(`Updating ${mapping.path}: ${p2} -> ${newValue}`);
            this.hasChanges = true;
            return `${p1}${newValue}${p3}`;
          }
          console.log(`${mapping.path} already has correct value: ${p2}`);
          return match;
        });
      } else {
        console.log(`Warning: Supernova token ${supernovaToken} not found`);
      }
    }
    
    this.updatedContent = updatedContent;
  }

  async writeTokensFile() {
    try {
      console.log(`Writing updated tokens to: ${this.tokensPath}`);
      await fs.promises.writeFile(this.tokensPath, this.updatedContent);
      console.log('Token file successfully updated');
    } catch (error) {
      console.error('Error writing token file:', error);
      throw error;
    }
  }
}

// Execute the transformation
const transformer = new TokenTransformer();
transformer.transform()
  .then(hasChanges => {
    // Always exit with success
    console.log(hasChanges 
      ? "✅ Tokens updated successfully" 
      : "✅ No token updates needed");
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error during token transformation:', error);
    process.exit(1);
  });
