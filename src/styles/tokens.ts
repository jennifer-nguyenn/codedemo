import { css } from 'styled-components';

export const tokens = {
  colors: {
    background: '#111111',
    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    darkTextPrimary: '#111111',
    darkTextSecondary: 'rgba(17, 17, 17, 0.7)',
    darkTextSecondary80: 'rgba(17, 17, 17, 0.8)',
    cardBackground: 'rgba(255, 255, 255, 0.05)',
    orderCard: '#FFFFFF',
    orderCountBg: '#F2F4FA',
    gradient: {
      start: '#8F06D1',
      middle: '#CC18A6',
      end: '#FC1470',
    },
  },
  spacing: {
    space0: '0px',
    space1: '8px',
    space2: '16px',
    space3: '24px',
    space4: '32px',
    space5: '40px',
  },
  borderRadius: {
    none: '0px',
    medium: '8px', // Used for action buttons in rewards section
    large: '16px', // Used for cards and containers
    pill: '1000px', // Used for tags and pills
  },
  components: {
    orderInfoCard: {
      mobileWidth: '167.5px',
    },
  },
  typography: {
    fontFamily: "'Greycliff CF', sans-serif",
    weights: {
      medium: 500,
      bold: 700,
      extraBold: 800,
    },
    sizes: {
      h1: {
        desktop: '45px',
        mobile: '64px',
      },
      h2: {
        desktop: '36px',
        mobile: '40px',
      },
      h3: '28px',
      h4: '18px',
      large: '18px',
      regular: '16px',
      small: '14px',
      tiny: '12px',
    },
    lineHeight: {
      h1: {
        desktop: '50px',
        mobile: '70px',
      },
      h2: {
        desktop: '40px',
        mobile: '48px',
      },
      h3: '32px',
      h4: '24px',
      large: '24px',
      regular: '24px',
      small: '20px',
      tiny: '16px',
    },
  },
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1440px',
  },
} as const;

export const globalStyles = css`
  :root {
    /* Colors */
    --color-background: ${tokens.colors.background};
    --color-text-primary: ${tokens.colors.textPrimary};
    --color-text-secondary: ${tokens.colors.textSecondary};
    --color-card-bg: ${tokens.colors.cardBackground};
    --color-order-card: ${tokens.colors.orderCard};
    --color-dark-text-primary: ${tokens.colors.darkTextPrimary};
    --color-dark-text-secondary: ${tokens.colors.darkTextSecondary};

    /* Gradients */
    --gradient-rewards: linear-gradient(
      90deg,
      ${tokens.colors.gradient.start} 0%,
      ${tokens.colors.gradient.middle} 50%,
      ${tokens.colors.gradient.end} 100%
    );

    /* Typography */
    --font-family: ${tokens.typography.fontFamily};

    /* Font Sizes */
    --font-size-h1: ${tokens.typography.sizes.h1.desktop};
    --font-size-h1-mobile: ${tokens.typography.sizes.h1.mobile};
    --font-size-h2: ${tokens.typography.sizes.h2.desktop};
    --font-size-h2-mobile: ${tokens.typography.sizes.h2.mobile};
    --font-size-h3: ${tokens.typography.sizes.h3};
    --font-size-h4: ${tokens.typography.sizes.h4};
    --font-size-large: ${tokens.typography.sizes.large};
    --font-size-regular: ${tokens.typography.sizes.regular};
    --font-size-small: ${tokens.typography.sizes.small};
    --font-size-tiny: ${tokens.typography.sizes.tiny};

    /* Line Heights */
    --line-height-h1: ${tokens.typography.lineHeight.h1.desktop};
    --line-height-h1-mobile: ${tokens.typography.lineHeight.h1.mobile};
    --line-height-h2: ${tokens.typography.lineHeight.h2.desktop};
    --line-height-h2-mobile: ${tokens.typography.lineHeight.h2.mobile};
    --line-height-h3: ${tokens.typography.lineHeight.h3};
    --line-height-h4: ${tokens.typography.lineHeight.h4};
    --line-height-large: ${tokens.typography.lineHeight.large};
    --line-height-regular: ${tokens.typography.lineHeight.regular};
    --line-height-small: ${tokens.typography.lineHeight.small};
    --line-height-tiny: ${tokens.typography.lineHeight.tiny};

    /* Font Weights */
    --font-weight-medium: ${tokens.typography.weights.medium};
    --font-weight-bold: ${tokens.typography.weights.bold};
    --font-weight-extra-bold: ${tokens.typography.weights.extraBold};

    /* Spacing */
    --space-0: ${tokens.spacing.space0};
    --space-1: ${tokens.spacing.space1};
    --space-2: ${tokens.spacing.space2};
    --space-3: ${tokens.spacing.space3};
    --space-4: ${tokens.spacing.space4};
    --space-5: ${tokens.spacing.space5};

    /* Border Radius */
    --radius-none: ${tokens.borderRadius.none};
    --radius-medium: ${tokens.borderRadius.medium};
    --radius-large: ${tokens.borderRadius.large};
    --radius-pill: ${tokens.borderRadius.pill};
  }
`;

export type Tokens = typeof tokens;
