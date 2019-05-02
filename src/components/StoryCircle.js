import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';
import { CircleImage } from '../styles';

const StoryContainer = styled.div`
  text-align: center;
  padding: 3px;
`;

const StoryTitle = styled.div`
  margin-top: 12px;
  color: ${({ theme }) => theme.dark};
`;

const StoryImage = styled.div`
  position: relative;
  width: 65px;
  border: 2px solid ${({ theme }) => theme.bg};
  border-radius: 50%;
  margin: 0 5px;
  box-shadow: 0 0 0 2px #cec9c6;

  .story-category--current & {
    box-shadow: none;
    border: none;
  }

  @media (min-width: 600px) {
    margin: 0 22px;
    width: 85px;
  }

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

export default ({ to, image, title }) => (
  <Link
    to={to}
    activeClassName="story-category--current"
    partiallyActive={true}
    style={{
      textDecoration: 'none',
    }}
  >
    <StoryContainer>
      <StoryImage>
        {image && <CircleImage alt={image.title} fluid={image.fluid} />}
      </StoryImage>
      <StoryTitle className="story-category-title">{title}</StoryTitle>
    </StoryContainer>
  </Link>
);
