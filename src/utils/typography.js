import Typography from 'typography';

const typography = new Typography({
  baseFontSize: '20px',
  baseLineHeight: 1,
  bodyFontFamily: ['Roboto', 'san-serif'],
  googleFonts: [
    {
      name: 'Roboto',
      styles: ['400', '700'],
    },
  ],
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== `production`) {
  typography.injectStyles();
}

export default typography;
