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
    this.errors = [];

    // Define explicit mappings between Supernova and application tokens
    // Format: 'SupernovaTokenName': { path: 'TokenName in application', regex: RegExp to find it }
    this.tokenMappings = {
      dimensionOrderInfoCardMobileWidth: {
        path: 'mobileWidth',
        regex: /(\bmobileWidth\s*:\s*['"]?)([^'",\s]+)(['"]?)/,
      },
      // Updated token names to match the dimension.ts file
      dimensionOrderInfoCardShowTime: {
        path: 'showTime',
        regex: /(\bshowTime\s*:\s*)(true|false)(\s*,?)/,
        isBoolean: true,
      },
      dimensionOrderInfoCardShowPaymentBadge: {
        path: 'showPaymentBadge',
        regex: /(\bshowPaymentBadge\s*:\s*)(true|false)(\s*,?)/,
        isBoolean: true,
      },
      dimensionOrderInfoCardShowManagePaymentPlan: {
        path: 'showManagePaymentPlan',
        regex: /(\bshowManagePaymentPlan\s*:\s*)(true|false)(\s*,?)/,
        isBoolean: true,
      },
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
        
        // Report any non-fatal errors
        if (this.errors.length > 0) {
          console.log('\n⚠️ Warnings during transformation:');
          this.errors.forEach(error => console.log(`- ${error}`));
        }
        
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
      path.join(this.baseDir, 'src', 'generated-tokens.js', 'dimension.ts'),
      path.join(this.baseDir, 'src', 'tokens', 'dimension.ts'),
      path.join(this.baseDir, 'src', 'styles', 'dimension.ts'),
    ];

    // Try each path
    for (const potentialPath of possiblePaths) {
      try {
        await fs.promises.access(potentialPath);
        console.log(`Found dimension.ts at: ${potentialPath}`);
        this.dimensionPath = potentialPath;
        return;
      } catch (error) {
        // Continue to next path
      }
    }

    // If no file found, try to find it recursively
    const searchDir = path.join(this.baseDir, 'src');
    try {
      const findDimensionFile = async (dir) => {
        const files = await fs.promises.readdir(dir, { withFileTypes: true });
        
        for (const file of files) {
          const fullPath = path.join(dir, file.name);
          
          if (file.isDirectory()) {
            const found = await findDimensionFile(fullPath);
            if (found) return found;
          } else if (file.name === 'dimension.ts') {
            return fullPath;
          }
        }
        return null;
      };

      const foundPath = await findDimensionFile(searchDir);
      if (foundPath) {
        console.log(`Found dimension.ts at: ${foundPath}`);
        this.dimensionPath = foundPath;
        return;
      }
    } catch (error) {
      console.error('Error during recursive search:', error.message);
    }

    throw new Error('Could not find dimension.ts file');
  }

  async readFiles() {
    try {
      console.log(`Reading dimension tokens from: ${this.dimensionPath}`);
      this.dimensionContent = await fs.promises.readFile(this.dimensionPath, 'utf8');

      console.log(`Reading application tokens from: ${this.tokensPath}`);
      this.tokensContent = await fs.promises.readFile(this.tokensPath, 'utf8');

      // Validate file contents
      if (!this.dimensionContent.trim()) {
        throw new Error('Dimension file is empty');
      }
      if (!this.tokensContent.trim()) {
        throw new Error('Tokens file is empty');
      }

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
    // More flexible regex that handles different formats
    const constRegex = /(?:const|let|var)\s+(\w+)\s*=\s*(['"]([^'"]+)['"]|\btrue\b|\bfalse\b)/g;
    let match;

    while ((match = constRegex.exec(this.dimensionContent)) !== null) {
      const [_, tokenName, tokenValue] = match;
      // Clean up the value (remove quotes if present)
      const cleanValue = tokenValue.replace(/^['"]|['"]$/g, '');
      this.extractedTokens[tokenName] = cleanValue;
      console.log(`Found token: ${tokenName} = ${cleanValue}`);
    }

    if (Object.keys(this.extractedTokens).length === 0) {
      this.errors.push('No tokens were extracted from dimension.ts');
    }
  }

  updateApplicationTokens() {
    console.log('Updating application tokens...');
    let updatedContent = this.tokensContent;
    let tokenUpdateCount = 0;

    // Process each mapping
    for (const [supernovaToken, mapping] of Object.entries(this.tokenMappings)) {
      if (this.extractedTokens[supernovaToken]) {
        const newValue = this.extractedTokens[supernovaToken];
        console.log(`Processing: ${supernovaToken} (${newValue}) -> ${mapping.path}`);

        const beforeUpdate = updatedContent;
        updatedContent = updatedContent.replace(mapping.regex, (match, p1, p2, p3) => {
          // Convert string '0'/'1' to boolean 'false'/'true' for boolean fields
          let displayValue = newValue;
          if (mapping.isBoolean) {
            // Convert string values to boolean literals for tokens.ts
            displayValue = newValue === '1' ? 'true' : 'false';
            console.log(`Converting value: ${newValue} -> ${displayValue} (boolean)`);
          }
          
          if (p2 !== displayValue) {
            console.log(`Updating ${mapping.path}: ${p2} -> ${displayValue}`);
            tokenUpdateCount++;
            return `${p1}${displayValue}${p3 || ''}`;
          }
          return match;
        });

        // Check if the replacement actually occurred
        if (beforeUpdate === updatedContent) {
          this.errors.push(`Could not find token ${mapping.path} in application tokens`);
        }
      } else {
        this.errors.push(`Supernova token ${supernovaToken} not found in dimension.ts`);
      }
    }

    if (tokenUpdateCount > 0) {
      this.hasChanges = true;
    }
    this.updatedContent = updatedContent;
  }

  async writeTokensFile() {
    try {
      // Create backup
      const backupPath = `${this.tokensPath}.backup`;
      await fs.promises.writeFile(backupPath, this.tokensContent);
      
      console.log(`Writing updated tokens to: ${this.tokensPath}`);
      await fs.promises.writeFile(this.tokensPath, this.updatedContent);
      console.log('Token file successfully updated');
      
      // Remove backup after successful write
      await fs.promises.unlink(backupPath);
    } catch (error) {
      console.error('Error writing token file:', error);
      // Try to restore from backup if it exists
      try {
        const backupPath = `${this.tokensPath}.backup`;
        await fs.promises.copyFile(backupPath, this.tokensPath);
        console.log('Restored from backup after error');
      } catch (backupError) {
        console.error('Could not restore from backup:', backupError);
      }
      throw error;
    }
  }
}

// Execute the transformation
const transformer = new TokenTransformer();
transformer
  .transform()
  .then(hasChanges => {
    if (transformer.errors.length > 0) {
      console.log('\n⚠️ Completed with warnings:');
      transformer.errors.forEach(error => console.log(`- ${error}`));
    }
    console.log(
      hasChanges
        ? '✅ Tokens updated successfully'
        : '✅ No token updates needed'
    );
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Fatal error during token transformation:', error);
    process.exit(1);
  });
