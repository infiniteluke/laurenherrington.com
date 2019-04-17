import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import Helmet from 'react-helmet';
import { withPrefix } from 'gatsby';

import Header from './Header';
import GlobalStyle from '../styles/global';
import theme from '../utils/theme';

const Main = styled.main`
  max-width: 1000px;
  width: 100%;
  flex-grow: 1;
  padding: 0 30px;
  margin: 30px auto 0 auto;
`;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  padding: 60px;
  text-align: center;
  background-image: ${({ theme }) => theme.bg};
`;

const FooterItem = styled.li`
  list-style: none;
  margin: 0;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
`;

const Layout = ({ title, children }) => (
  <ThemeProvider theme={theme}>
    <PageWrapper>
      <Helmet title={title} />
      <GlobalStyle />
      <Header title={title} />
      <Main>{children}</Main>
      <Footer>
        <ul style={{ margin: 0 }}>
          <FooterItem>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/lherrington/"
            >
              <Image src={withPrefix('/img/instagram.svg')} alt="Instagram" />
            </a>
          </FooterItem>
        </ul>
      </Footer>
    </PageWrapper>
  </ThemeProvider>
);

export default Layout;
