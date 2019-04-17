import React from 'react';
import {
  CategoryContainer,
  Circle,
  CircleImage,
  CategoryTitle,
} from '../styles';

export default ({ to, category }) => (
  <CategoryContainer to={to}>
    <Circle>
      {category.squareImageLarge && (
        <CircleImage
          alt={category.squareImageLarge.title}
          fluid={category.squareImageLarge.fluid}
        />
      )}
      <CategoryTitle>{category.title}</CategoryTitle>
    </Circle>
  </CategoryContainer>
);
