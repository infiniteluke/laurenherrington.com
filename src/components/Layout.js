import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { withPrefix } from 'gatsby';
import VisuallyHidden from '@reach/visually-hidden';

import Header from './Header';
import Swipe from './Swipe';
import StoryCircle from './StoryCircle';
import Help from './Help';
import SEO from './SEO';
import GlobalStyle from '../styles/global';
import { Stories, HelpBox } from '../styles';
import theme from '../utils/theme';

const Main = styled.main`
  max-width: 1000px;
  width: 100%;
  flex-grow: 1;
  padding: 0 30px;
  margin: 15px auto 0 auto;
`;

const PageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Footer = styled.footer`
  padding: 60px;
  background-image: ${({ theme }) => theme.bg};
`;

const FooterList = styled.ul`
  display: flex;
  margin: 0;
  flex-direction: row;
  justify-content: center;
`;

const FooterItem = styled.li`
  list-style: none;
  margin: 0 10px;
`;

const Image = styled.img`
  width: 40px;
  height: 40px;
`;

const StoryHelpContent = ({ dismiss }) => (
  <HelpBox>
    <h3 style={{ marginTop: '15px', textAlign: 'center', margin: 0 }}>
      Swipe to see more
    </h3>
    <Swipe style={{ margin: '35px' }} />
    <button
      style={{
        border: 'none',
        width: '100%',
        borderRadius: '3px',
        padding: '8px',
      }}
      onClick={() => dismiss()}
    >
      Dismiss
    </button>
  </HelpBox>
);

const Layout = ({
  title,
  children,
  showStories = true,
  categories = [],
  category = 'no',
}) => {
  const stories = (
    <Stories>
      {categories.map(
        ({ category: { id, title, image, slug, directLink } }) => (
          <StoryCircle
            key={id}
            title={title}
            image={image}
            to={directLink ? `/${slug}` : `/tag/${slug}`}
          />
        )
      )}
    </Stories>
  );
  return (
    <ThemeProvider theme={theme}>
      <PageWrapper className={`${category}-category`}>
        <SEO
          title={title}
          meta={[
            {
              property: 'og:image',
              content: 'https://laurenherrington.com/lauren-share.png',
            },
          ]}
        />
        <GlobalStyle />
        <StaticQuery
          query={siteDataQuery}
          render={data => <Header title={data.site.siteMetadata.headerTitle} />}
        />
        <Main>
          {showStories && categories.length ? (
            typeof window !== 'undefined' ? (
              <Help
                position={positionHelp}
                style={{
                  zIndex: 1,
                  position: 'absolute',
                  padding: 0,
                  maxWidth: '80%',
                  whiteSpace: 'nowrap',
                  border: 'none',
                }}
                ariaLabel="Help with stories menu"
                mobileMediaQuery="(max-width: 750px)"
                render={StoryHelpContent}
              >
                {stories}
              </Help>
            ) : (
              stories
            )
          ) : null}
          {children}
        </Main>
        <Footer>
          <FooterList>
            <FooterItem>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/lherrington/"
              >
                <Image src={withPrefix('/img/instagram.svg')} alt="Instagram" />
              </a>
            </FooterItem>
            <FooterItem>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://tinyletter.com/laurenherrington/"
              >
                <Image src={withPrefix('/img/envelope.svg')} alt="Newsletter" />
              </a>
            </FooterItem>
          </FooterList>
        </Footer>
      </PageWrapper>
    </ThemeProvider>
  );
};

const siteDataQuery = graphql`
  query LayoutSiteTitle {
    site {
      siteMetadata {
        headerTitle
      }
    }
  }
`;

const OFFSET = 20;

const positionHelp = (triggerRect, tooltipRect) => {
  const collisions = {
    top: triggerRect.top - tooltipRect.height < 0,
    bottom:
      window.innerHeight < triggerRect.bottom + tooltipRect.height + OFFSET,
  };

  const directionUp = collisions.bottom && !collisions.top;

  return {
    left: `50%`,
    transform: 'translateX(-50%)',
    top: directionUp
      ? `${triggerRect.top - OFFSET - tooltipRect.height + window.scrollY}px`
      : `${triggerRect.top + OFFSET + triggerRect.height + window.scrollY}px`,
  };
};

export default Layout;
