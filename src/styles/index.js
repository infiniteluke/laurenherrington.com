import styled from 'styled-components';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

export const Content = styled.div`
  white-space: pre-line;

  a {
    color: ${({ theme }) => theme.accent};
    &:visited {
      color: ${({ theme }) => theme.accentMuted};
    }
  }

  blockquote {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px 10px;
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

export const CategoryContainer = styled(Link)`
  position: relative;
  border-radius: 50%;
  display: inline-block;
  width: 100%;
  padding: 0 30px 30px 30px;

  @media (min-width: 380px) {
    padding: 0 5px 5px 5px;
    width: 50%;
  }
  @media (min-width: 550px) {
    width: 33%;
    padding: 0 15px 15px 15px;
  }
  @media (min-width: 1300px) {
    width: 25%;
  }
`;

export const Stories = styled.nav`
  width: 100vw;
  position: relative;
  left: 50%;
  margin-left: -50vw;
  margin-bottom: 45px;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  display: flex;
  flex-direction: row;

  @media (min-width: 769px) {
    justify-content: center;
  }
`;

export const CircleImage = styled(Img)`
  border-radius: 50%;
  img {
    border-radius: 50%;
    margin: 0;
  }
  picture {
    border-radius: 50%;
  }
`;

export const CategoryTitle = styled.h2`
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  color: ${({ theme }) => theme.bg};
`;

export const Circle = styled.div`
  position: relative;
  &:after {
    content: '';
    border-radius: 50%;
    position: absolute;
    display: block;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }
  &:hover:after {
    background-image: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4));
    opacity: 1;
  }
`;

export const MarkerCircle = styled.circle`
  fill: ${({ theme }) => theme.compAccent};
  transition: all 0.2s ease;
  r: ${({ r }) => r * 1.6};
  &:hover {
    fill: ${({ theme }) => theme.compAccentMuted};
    cursor: pointer;
    r: ${({ r }) => r * 2};
  }
  &:active {
    cursor: pointer;
    r: ${({ r }) => r * 2.2};
  }

  @media (min-width: 768px) {
    r: ${({ r }) => r};
    &:hover {
      r: ${({ r }) => r * 1.5};
    }
    &:active {
      r: ${({ r }) => r * 1.8};
    }
  }
`;

export const MarkerText = styled.text`
  fill: ${({ theme }) => theme.compAccent};
  font-size: 2.4rem;
  &:hover {
    fill: ${({ theme }) => theme.compAccentMuted};
    cursor: pointer;
  }
  &:active {
    cursor: pointer;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }
`;

export const MapLabel = styled.label`
  color: ${({ theme }) => theme.compAccent};
  font-size: 0.8rem;
  padding-right: 10px;
`;
