const fs = require('fs');
const path = require('path');

/**
 * A robust token transformation utility that handles
 * mapping between Supernova's output and your design tokens
 */
class TokenTransformer {
  constructor() {
    this.generatedPath = path.join(process.cwd(), 'src', 'generated-tokens.js');
    this.tokensPath = path.join(process.cwd(), 'src', 'styles', 'tokens.ts');
    this.hasChanges = false;
    this.generatedTokens = null;
    this.currentTokens = null;
  }

  async transform() {
    try {
      console.log('Starting token transformation process...');
      
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

    // Extract component values - specifically looking for mobileWidth
    const componentMatches = this.generatedContent.match(/components\s*:\s*{([^}]*)}/s);
    if (componentMatches && componentMatches[1]) {
      const mobileWidthMatch = componentMatches[1].match(/mobileWidth\s*:\s*['"]([^'"]+)['"]/);
      if (mobileWidthMatch) {
        this.extractedTokens.components.mobileWidth = mobileWidthMatch[1];
        console.log('Found mobileWidth:', this.extractedTokens.components.mobileWidth);
      }
    }

    // Extract typography values
    const typographyMatches = this.generatedContent.match(/typography\s*:\s*{([^}]*)}/s);
    if (typographyMatches && typographyMatches[1]) {
      // Extract font family
      const fontFamilyMatch = typographyMatches[1].match(/fontFamily\s*:\s*['"]([^'"]+)['"]/);
      if (fontFamilyMatch) {
        this.extractedTokens.typography.fontFamily = fontFamilyMatch[1];
        console.log('Found fontFamily:', this.extractedTokens.typography.fontFamily);
      }
      
      // Extract weights
      const weightsMatch = typographyMatches[1].match(/weights\s*:\s*{([^}]*)}/s);
      if (weightsMatch && weightsMatch[1]) {
        const mediumMatch = weightsMatch[1].match(/medium\s*:\s*([0-9]+)/);
        const boldMatch = weightsMatch[1].match(/bold\s*:\s*([0-9]+)/);
        const extraBoldMatch = weightsMatch[1].match(/extraBold\s*:\s*([0-9]+)/);
        
        if (mediumMatch) this.extractedTokens.typography.weights = { 
          ...(this.extractedTokens.typography.weights || {}),
          medium: mediumMatch[1]
        };
        
        if (boldMatch) this.extractedTokens.typography.weights = { 
          ...(this.extractedTokens.typography.weights || {}),
          bold: boldMatch[1]
        };
        
        if (extraBoldMatch) this.extractedTokens.typography.weights = { 
          ...(this.extractedTokens.typography.weights || {}),
          extraBold: extraBoldMatch[1]
        };
      }
    }

    // Extract sizes values (h1, h2, h3, h4, large, regular, small, tiny)
    const sizesMatches = this.generatedContent.match(/sizes\s*:\s*{([^}]*)}/s);
    if (sizesMatches && sizesMatches[1]) {
      // Process heading sizes (h1-h4)
      for (let i = 1; i <= 4; i++) {
        const headingBlock = sizesMatches[1].match(new RegExp(`h${i}\\s*:\\s*{([^}]*)}`, 's'));
        if (headingBlock && headingBlock[1]) {
          const desktopMatch = headingBlock[1].match(/desktop\s*:\s*['"]([^'"]+)['"]/);
          const mobileMatch = headingBlock[1].match(/mobile\s*:\s*['"]([^'"]+)['"]/);
          
          if (desktopMatch || mobileMatch) {
            this.extractedTokens.sizes[`h${i}`] = {};
            
            if (desktopMatch) {
              this.extractedTokens.sizes[`h${i}`].desktop = desktopMatch[1];
              console.log(`Found h${i} desktop:`, desktopMatch[1]);
            }
            
            if (mobileMatch) {
              this.extractedTokens.sizes[`h${i}`].mobile = mobileMatch[1];
              console.log(`Found h${i} mobile:`, mobileMatch[1]);
            }
          }
        }
      }
      
      // Process text sizes (large, regular, small, tiny)
      const textSizes = ['large', 'regular', 'small', 'tiny'];
      textSizes.forEach(size => {
        const sizeMatch = sizesMatches[1].match(new RegExp(`${size}\\s*:\\s*['"]([^'"]+)['"]`));
        if (sizeMatch) {
          this.extractedTokens.sizes[size] = sizeMatch[1];
          console.log(`Found ${size}:`, sizeMatch[1]);
        }
      });
    }

    // Extract lineHeight values
    const lineHeightMatches = this.generatedContent.match(/lineHeight\s*:\s*{([^}]*)}/s);
    if (lineHeightMatches && lineHeightMatches[1]) {
      // Process h1, h2 lineHeights
      for (let i = 1; i <= 2; i++) {
        const headingBlock = lineHeightMatches[1].match(new RegExp(`h${i}\\s*:\\s*{([^}]*)}`, 's'));
        if (headingBlock && headingBlock[1]) {
          const desktopMatch = headingBlock[1].match(/desktop\s*:\s*['"]([^'"]+)['"]/);
          const mobileMatch = headingBlock[1].match(/mobile\s*:\s*['"]([^'"]+)['"]/);
          
          if (desktopMatch || mobileMatch) {
            this.extractedTokens.lineHeight = this.extractedTokens.lineHeight || {};
            this.extractedTokens.lineHeight[`h${i}`] = {};
            
            if (desktopMatch) {
              this.extractedTokens.lineHeight[`h${i}`].desktop = desktopMatch[1];
              console.log(`Found lineHeight h${i} desktop:`, desktopMatch[1]);
            }
            
            if (mobileMatch) {
              this.extractedTokens.lineHeight[`h${i}`].mobile = mobileMatch[1];
              console.log(`Found lineHeight h${i} mobile:`, mobileMatch[1]);
            }
          }
        }
      }
    }
  }

  updateTokensFile() {
    console.log('Updating tokens file...');
    let updatedContent = this.tokensContent;
    
    // Update mobileWidth if found
    if (this.extractedTokens.components.mobileWidth) {
      const mobileWidthPattern = /(mobileWidth\s*:\s*['"])([^'"]+)(['"])/;
      const mobileWidthValue = this.extractedTokens.components.mobileWidth;
      
      updatedContent = updatedContent.replace(mobileWidthPattern, (match, p1, p2, p3) => {
        if (p2 !== mobileWidthValue) {
          this.hasChanges = true;
          console.log(`Updating mobileWidth: ${p2} -> ${mobileWidthValue}`);
          return `${p1}${mobileWidthValue}${p3}`;
        }
        return match;
      });
    }
    
    // Update fontFamily if found
    if (this.extractedTokens.typography.fontFamily) {
      const fontFamilyPattern = /(fontFamily\s*:\s*['"])([^'"]+)(['"])/;
      const fontFamilyValue = this.extractedTokens.typography.fontFamily;
      
      updatedContent = updatedContent.replace(fontFamilyPattern, (match, p1, p2, p3) => {
        if (p2 !== fontFamilyValue) {
          this.hasChanges = true;
          console.log(`Updating fontFamily: ${p2} -> ${fontFamilyValue}`);
          return `${p1}${fontFamilyValue}${p3}`;
        }
        return match;
      });
    }
    
    // Update font weights if found
    if (this.extractedTokens.typography.weights) {
      const weights = this.extractedTokens.typography.weights;
      
      if (weights.medium) {
        const mediumPattern = /(medium\s*:\s*)([0-9]+)/;
        updatedContent = updatedContent.replace(mediumPattern, (match, p1, p2) => {
          if (p2 !== weights.medium) {
            this.hasChanges = true;
            console.log(`Updating medium weight: ${p2} -> ${weights.medium}`);
            return `${p1}${weights.medium}`;
          }
          return match;
        });
      }
      
      if (weights.bold) {
        const boldPattern = /(bold\s*:\s*)([0-9]+)/;
        updatedContent = updatedContent.replace(boldPattern, (match, p1, p2) => {
          if (p2 !== weights.bold) {
            this.hasChanges = true;
            console.log(`Updating bold weight: ${p2} -> ${weights.bold}`);
            return `${p1}${weights.bold}`;
          }
          return match;
        });
      }
      
      if (weights.extraBold) {
        const extraBoldPattern = /(extraBold\s*:\s*)([0-9]+)/;
        updatedContent = updatedContent.replace(extraBoldPattern, (match, p1, p2) => {
          if (p2 !== weights.extraBold) {
            this.hasChanges = true;
            console.log(`Updating extraBold weight: ${p2} -> ${weights.extraBold}`);
            return `${p1}${weights.extraBold}`;
          }
          return match;
        });
      }
    }
    
    // Update heading sizes
    for (let i = 1; i <= 4; i++) {
      if (this.extractedTokens.sizes[`h${i}`]) {
        const sizes = this.extractedTokens.sizes[`h${i}`];
        
        if (sizes.desktop) {
          const desktopPattern = new RegExp(`(h${i}[^{]*{[^}]*desktop\\s*:\\s*['"])([^'"]+)(['"])`, 's');
          updatedContent = updatedContent.replace(desktopPattern, (match, p1, p2, p3) => {
            if (p2 !== sizes.desktop) {
              this.hasChanges = true;
              console.log(`Updating h${i} desktop: ${p2} -> ${sizes.desktop}`);
              return `${p1}${sizes.desktop}${p3}`;
            }
            return match;
          });
        }
        
        if (sizes.mobile) {
          const mobilePattern = new RegExp(`(h${i}[^{]*{[^}]*mobile\\s*:\\s*['"])([^'"]+)(['"])`, 's');
          updatedContent = updatedContent.replace(mobilePattern, (match, p1, p2, p3) => {
            if (p2 !== sizes.mobile) {
              this.hasChanges = true;
              console.log(`Updating h${i} mobile: ${p2} -> ${sizes.mobile}`);
              return `${p1}${sizes.mobile}${p3}`;
            }
            return match;
          });
        }
      }
    }
    
    // Update text sizes (large, regular, small, tiny)
    const textSizes = ['large', 'regular', 'small', 'tiny'];
    textSizes.forEach(size => {
      if (this.extractedTokens.sizes[size]) {
        const sizeValue = this.extractedTokens.sizes[size];
        const sizePattern = new RegExp(`(${size}\\s*:\\s*['"])([^'"]+)(['"])`, 'g');
        
        updatedContent = updatedContent.replace(sizePattern, (match, p1, p2, p3) => {
          if (p2 !== sizeValue) {
            this.hasChanges = true;
            console.log(`Updating ${size}: ${p2} -> ${sizeValue}`);
            return `${p1}${sizeValue}${p3}`;
          }
          return match;
        });
      }
    });
    
    // Update lineHeight values
    if (this.extractedTokens.lineHeight) {
      for (let i = 1; i <= 2; i++) {
        if (this.extractedTokens.lineHeight[`h${i}`]) {
          const heights = this.extractedTokens.lineHeight[`h${i}`];
          
          if (heights.desktop) {
            const desktopPattern = new RegExp(`(lineHeight[^{]*h${i}[^{]*{[^}]*desktop\\s*:\\s*['"])([^'"]+)(['"])`, 's');
            updatedContent = updatedContent.replace(desktopPattern, (match, p1, p2, p3) => {
              if (p2 !== heights.desktop) {
                this.hasChanges = true;
                console.log(`Updating lineHeight h${i} desktop: ${p2} -> ${heights.desktop}`);
                return `${p1}${heights.desktop}${p3}`;
              }
              return match;
            });
          }
          
          if (heights.mobile) {
            const mobilePattern = new RegExp(`(lineHeight[^{]*h${i}[^{]*{[^}]*mobile\\s*:\\s*['"])([^'"]+)(['"])`, 's');
            updatedContent = updatedContent.replace(mobilePattern, (match, p1, p2, p3) => {
              if (p2 !== heights.mobile) {
                this.hasChanges = true;
                console.log(`Updating lineHeight h${i} mobile: ${p2} -> ${heights.mobile}`);
                return `${p1}${heights.mobile}${p3}`;
              }
              return match;
            });
          }
        }
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
    process.exit(hasChanges ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error during token transformation:', error);
    process.exit(1);
  });
