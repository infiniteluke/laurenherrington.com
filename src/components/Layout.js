import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { withPrefix } from 'gatsby';
import { useSpring, animated } from 'react-spring';
import MediaQuery from 'react-responsive';

import Header from './Header';
import Swipe from './icons/Swipe';
import Happy from './icons/Happy';
import StoryCircle from './StoryCircle';
import Help from './Help';
import SEO from './SEO';
import GlobalStyle from '../styles/global';
import { StoriesWrapper, HelpBox } from '../styles';
import theme from '../utils/theme';

animated.Swipe = animated(Swipe);

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

const StoryHelpContent = ({ dismiss, actionCompleted, helping }) => {
  const SWIPE_STATES = ['rotate(45deg)', 'rotate(0deg)'];
  const swipeProps = useSpring({
    to: async next => {
      let i = 0;
      // Do 7 "swipes"
      while (i < 7) {
        await next({ transform: SWIPE_STATES[1], config: { duration: 300 } });
        await next({ transform: SWIPE_STATES[0], config: { duration: 800 } });
        i++;
      }
    },
    from: { transform: SWIPE_STATES[0] },
  });

  return (
    <HelpBox>
      <h3
        style={{
          marginTop: '15px',
          textAlign: 'center',
          margin: 0,
          fontSize: '.9rem',
        }}
      >
        {actionCompleted ? 'You did it!' : 'Swipe to see more'}
      </h3>
      {!actionCompleted ? (
        <div style={{ margin: '25px 15px' }}>
          <animated.Swipe style={swipeProps} />
        </div>
      ) : (
        <div style={{ marginTop: '25px' }}>
          <Happy />
        </div>
      )}
      {!actionCompleted && (
        <button
          style={{
            border: 'none',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '3px',
            padding: '5px',
          }}
          onClick={() => dismiss()}
        >
          Dismiss
        </button>
      )}
    </HelpBox>
  );
};

const Stories = React.forwardRef(
  ({ completeAction = () => {}, categories }, ref) => {
    const scrolled = React.useRef(false);
    return (
      <StoriesWrapper
        ref={ref}
        onScroll={() => {
          if (!scrolled.current) {
            completeAction();
          }
          scrolled.current = true;
        }}
      >
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
      </StoriesWrapper>
    );
  }
);

const Layout = ({
  title,
  children,
  showStories = true,
  categories = [],
  category = 'no',
}) => {
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
          <MediaQuery maxWidth={800}>
            {matches => {
              // Help is only relevant at small viewport widths
              // Help can only be rendered on client side
              if (
                typeof window !== 'undefined' &&
                matches &&
                showStories &&
                categories.length
              ) {
                return (
                  <Help
                    render={StoryHelpContent}
                    helpName="stories"
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
                  >
                    <Stories categories={categories} />
                  </Help>
                );
              } else if (showStories && categories.length) {
                return <Stories categories={categories} />;
              }
              return null;
            }}
          </MediaQuery>
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
