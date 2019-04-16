import theme from '../utils/theme';
import fontFiles from '../fonts';

import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  html, body, #___gatsby, #___gatsby > div {
    height: 100%;
  }
  body {
    background-color: ${theme.bg};
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
`;
