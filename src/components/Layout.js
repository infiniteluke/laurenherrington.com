import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { StaticQuery, graphql } from 'gatsby';
import { withPrefix } from 'gatsby';
import { useSpring, animated } from 'react-spring';

import Header from './Header';
import Swipe from './icons/Swipe';
import CheckCircle from './icons/CheckCircle';
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
  const swipeStates = ['rotate(45deg)', 'rotate(0deg)'];
  const swipeProps = useSpring({
    to: async next => {
      let i = 0;
      while (i < 7) {
        await next({ transform: swipeStates[1] });
        await next({ transform: swipeStates[0], config: { duration: 800 } });
        i++;
      }
    },
    from: { transform: swipeStates[0] },
    config: { duration: 300 },
  });
  React.useEffect(() => {
    if (actionCompleted) {
      const timer = setTimeout(() => {
        dismiss();
      }, 1000);
      return () => clearTimeout(timer);
    }
  });

  return (
    <HelpBox>
      <h3
        style={{
          marginTop: '15px',
          textAlign: 'center',
          margin: 0,
        }}
      >
        {actionCompleted ? 'You did it!' : 'Swipe to see more'}
      </h3>
      <div style={{ margin: '35px' }}>
        {!actionCompleted ? (
          <animated.Swipe style={swipeProps} />
        ) : (
          <CheckCircle />
        )}
      </div>
      {!actionCompleted && (
        <button
          style={{
            border: 'none',
            width: '100%',
            backgroundColor: 'white',
            borderRadius: '3px',
            padding: '8px',
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
          {showStories && categories.length ? (
            typeof window !== 'undefined' ? (
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
                mobileMediaQuery="(max-width: 750px)"
              >
                <Stories categories={categories} />
              </Help>
            ) : (
              <Stories categories={categories} />
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
