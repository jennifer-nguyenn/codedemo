const fs = require('fs');
const path = require('path');

/**
 * A more robust token transformation utility that handles
 * mapping between Supernova's output and your design tokens
 */
class TokenTransformer {
  constructor() {
    // Instead of hardcoding the exact path, we'll be more flexible
    this.baseDir = process.cwd();
    this.tokensPath = path.join(this.baseDir, 'src', 'styles', 'tokens.ts');
    this.hasChanges = false;
  }

  async transform() {
    try {
      console.log('Starting token transformation process...');
      console.log('Current working directory:', this.baseDir);
      
      // Find the generated tokens file
      await this.findGeneratedTokensFile();
      
      // Read files
      await this.readFiles();
      
      // Extract tokens from generated file
      this.parseGeneratedTokens();
      
      // Update tokens file
      this.updateTokensFile();
      
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

  async findGeneratedTokensFile() {
    console.log('Looking for generated tokens file...');
    
    // Try several possible locations based on your repository structure
    const possiblePaths = [
      path.join(this.baseDir, 'src', 'generated-tokens.js'),
      path.join(this.baseDir, 'src', 'generated-tokens.js', 'index.js'),
      path.join(this.baseDir, 'src', 'generated-tokens.js', 'index.ts')
    ];
    
    // Log all the paths we're checking
    console.log('Checking the following paths:');
    possiblePaths.forEach(p => console.log(` - ${p}`));
    
    // Try each path
    for (const potentialPath of possiblePaths) {
      try {
        console.log(`Checking if ${potentialPath} exists...`);
        const stats = await fs.promises.stat(potentialPath);
        
        if (stats.isFile()) {
          console.log(`Found generated tokens file at: ${potentialPath}`);
          this.generatedPath = potentialPath;
          return;
        } else {
          console.log(`Path exists but is not a file: ${potentialPath}`);
        }
      } catch (error) {
        console.log(`Path does not exist: ${potentialPath}`);
      }
    }
    
    // If we get here, try to list files in the directory to understand structure
    try {
      const generatedTokensDir = path.join(this.baseDir, 'src', 'generated-tokens.js');
      console.log(`Listing files in ${generatedTokensDir}:`);
      const files = await fs.promises.readdir(generatedTokensDir);
      files.forEach(file => console.log(` - ${file}`));
      
      // If we found any files, use the first one
      if (files.length > 0) {
        this.generatedPath = path.join(generatedTokensDir, files[0]);
        console.log(`Using first found file: ${this.generatedPath}`);
        return;
      }
    } catch (error) {
      console.error(`Error listing directory:`, error.message);
    }
    
    throw new Error('Could not find generated tokens file');
  }

  async readFiles() {
    try {
      console.log(`Reading generated tokens from: ${this.generatedPath}`);
      this.generatedContent = await fs.promises.readFile(this.generatedPath, 'utf8');
      
      console.log(`Reading target tokens from: ${this.tokensPath}`);
      this.tokensContent = await fs.promises.readFile(this.tokensPath, 'utf8');
    } catch (error) {
      console.error('Error reading token files:', error);
      throw error;
    }
  }

  parseGeneratedTokens() {
    console.log('Parsing generated tokens...');
    
    // Initialize extracted tokens object
    this.extractedTokens = {
      spacing: {},
      typography: {},
      colors: {},
      components: {},
      sizes: {}
    };

    // Enhanced debugging - log a sample of the file content
    console.log('Generated tokens content sample (first 150 chars):');
    console.log(this.generatedContent.substring(0, 150));

    // Extract component values - specifically looking for mobileWidth
    const componentMatches = this.generatedContent.match(/components\s*:\s*{([^}]*)}/s);
    if (componentMatches && componentMatches[1]) {
      const mobileWidthMatch = componentMatches[1].match(/mobileWidth\s*:\s*['"]([^'"]+)['"]/);
      if (mobileWidthMatch) {
        this.extractedTokens.components.mobileWidth = mobileWidthMatch[1];
        console.log('Found mobileWidth:', this.extractedTokens.components.mobileWidth);
      } else {
        console.log('Could not find mobileWidth in components section');
      }
    } else {
      console.log('Could not find components section in generated tokens');
    }

    // Extract typography values (similar pattern for other token types)
    // ... rest of the parsing logic ...
  }

  updateTokensFile() {
    console.log('Updating tokens file...');
    let updatedContent = this.tokensContent;
    
    // Update mobileWidth if found
    if (this.extractedTokens.components.mobileWidth) {
      const mobileWidthPattern = /(mobileWidth\s*:\s*['"])([^'"]+)(['"])/;
      const mobileWidthValue = this.extractedTokens.components.mobileWidth;
      
      // Check if the pattern exists in the target file
      if (mobileWidthPattern.test(this.tokensContent)) {
        updatedContent = updatedContent.replace(mobileWidthPattern, (match, p1, p2, p3) => {
          if (p2 !== mobileWidthValue) {
            this.hasChanges = true;
            console.log(`Updating mobileWidth: ${p2} -> ${mobileWidthValue}`);
            return `${p1}${mobileWidthValue}${p3}`;
          }
          console.log(`mobileWidth value already up-to-date: ${p2}`);
          return match;
        });
      } else {
        console.log('Could not find mobileWidth pattern in tokens.ts');
      }
    }
    
    // ... rest of the update logic ...
    
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
    // Always exit with success code, unless there's an exception
    console.log(hasChanges 
      ? "✅ Tokens updated successfully" 
      : "✅ No token updates needed - everything is up to date");
    process.exit(0);  // Always exit with success
  })
  .catch(error => {
    console.error('❌ Fatal error during token transformation:', error);
    process.exit(1);  // Only exit with error code for actual errors
  });
