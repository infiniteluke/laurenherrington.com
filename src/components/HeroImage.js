import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';

const HeroTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 40px;
  text-align: center;
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: ${({ theme }) => theme.bg};

  @media (min-width: 768px) {
    font-size: 3.5rem;
  }
`;

const ImageFilter = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.dark}, ${theme.darkMuted})`};
  opacity: 0.5;
`;

const Hero = styled.div`
  position: relative;
  margin-bottom: 40px;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translate(-50%);
  max-width: 1200px;
`;

export default ({ title, image }) => (
  <Hero>
    <ImageFilter />
    <HeroTitle>{title}</HeroTitle>
    <Img
      style={{
        height: '400px',
      }}
      objectFit="cover"
      objectPosition="50% 50%"
      alt={image.title}
      fluid={image.fluid}
    />
  </Hero>
);
