import styled from 'styled-components';

export const Content = styled.div`
  a {
    color: ${({ theme }) => theme.accent};
    &:visited {
      color: ${({ theme }) => theme.accentMuted};
    }
  }

  blockquote {
    max-width: 800px;
    padding: 20px;
    font-weight: 400;
    font-style: italic;

    p {
      margin: 0;
      line-height: 1.4em;
      display: inline;
      quotes: '“' '”' '‘' '’';
    }

    p:before {
      font-size: 4rem;
      font-family: Georgia, serif;
      color: ${({ theme }) => theme.darkMuted};
      content: open-quote;
      line-height: 0;
      margin-right: 0.15em;
      vertical-align: -0.4em;
    }

    p:after {
      content: close-quote;
      visibility: hidden;
    }
  }
`;
