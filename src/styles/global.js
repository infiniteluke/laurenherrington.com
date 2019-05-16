import theme from '../utils/theme';
import fontFiles from '../fonts';

import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html, body, #___gatsby, #___gatsby > div {
    height: 100%;
    -webkit-tap-highlight-color: rgba(0,0,0,0);
  }

  :root {
    --help: 1;
  }

  body {
    background-color: ${theme.bg};
  }
  p, article {
    line-height: 1.2;
  }
  @font-face {
    font-family: 'Quirk';
    font-style: normal;
    font-weight: normal;
    src: local('Quirk'), url(${fontFiles.Quirk}) format('truetype');
  }

  /* topo map global styles */
  .rsm-geography:focus {
    outline: none;
  }

  /* special styles for articles on a notes page */
  .notes-category article header,
  .notes-category article div {
    text-align: center;
  }

  .story-category--current .story-category-title {
    text-decoration: underline;
  }
`;
