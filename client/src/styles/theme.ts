export const theme = {
  colors: {
    primary: '#00a884',
    secondary: '#008069',
    background: '#f0f2f5',
    panel: '#ffffff',
    hover: '#f5f6f6',
    border: '#e9edef',
    text: '#111b21',
    textSecondary: '#667781',
    bubble: '#d9fdd3',
    bubbleOut: '#ffffff',
    green: '#00a884',
    error: '#ea4335',
    success: '#00a884',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    round: '50%',
  },
  shadows: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 20px rgba(0, 0, 0, 0.15)',
  },
};

export type Theme = typeof theme;
