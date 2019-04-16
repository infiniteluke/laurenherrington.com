import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import { withPrefix } from 'gatsby';

import Header from './Header';
import GlobalStyle from '../styles/global';
import theme from '../utils/theme';
import { ThemeProvider } from 'styled-components';

const Main = styled.main`
  max-width: 1000px;
  width: 100%;
  flex-grow: 1;
  padding: 0 30px;
  margin: 30px auto 0 auto;
`;

const PageWrapper = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const Footer = styled.footer`
  padding: 60px;
  text-align: center;
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.bg}, ${theme.bgLight})`};
`;

const FooterItem = styled.li`
  list-style: none;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
`;

class Layout extends React.Component {
  render() {
    const { title, children } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <PageWrapper>
          <Helmet title={title} />
          <GlobalStyle />
          <Header title={title} />
          <Main>{children}</Main>
          <Footer>
            <ul>
              <FooterItem>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://www.instagram.com/lherrington/"
                >
                  <Image
                    src={withPrefix('/img/instagram.svg')}
                    alt="Instagram"
                  />
                </a>
              </FooterItem>
            </ul>
          </Footer>
        </PageWrapper>
      </ThemeProvider>
    );
  }
}

export default Layout;
