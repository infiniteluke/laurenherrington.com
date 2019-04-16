import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

const CategoryContainer = styled(Link)`
  position: relative;
  display: inline-block;
  width: 100%;
  padding: 0 15px;
  @media (min-width: 300px) {
    width: 50%;
  }
  @media (min-width: 550px) {
    width: 33%;
  }
  @media (min-width: 1300px) {
    width: 25%;
  }
`;

const Image = styled(Img)`
  border-radius: 50%;

  img {
    margin: 0;
  }
`;

const CategoryTitle = styled.h2`
  transform: translate(-50%, -50%);
  z-index: 1;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: 0;
  color: white;
`;

const Circle = styled.div`
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

export default ({ category }) => (
  <CategoryContainer to={`tag/${category.slug}`}>
    <Circle>
      {category.squareImageLarge && (
        <Image
          alt={category.squareImageLarge.title}
          fluid={category.squareImageLarge.fluid}
        />
      )}
      <CategoryTitle>{category.title}</CategoryTitle>
    </Circle>
  </CategoryContainer>
);
