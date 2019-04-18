import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

const HeaderTitle = styled.h1`
  text-align: center;
  margin: 0;
  color: ${({ theme }) => theme.dark};
  font-size: 4rem;
  line-height: 2.5rem;
  font-weight: 500;
  letter-spacing: -1px;
  font-family: 'Quirk';

  &:first-child:first-letter {
    letter-spacing: -0.9rem;
  }

  &:hover {
    color: ${({ theme }) => theme.darkMuted};
  }

  @media (min-width: 375px) {
    font-size: 4.25rem;
    line-height: 3rem;
  }

  @media (min-width: 510px) {
    font-size: 6rem;
    line-height: 4.25rem;
  }

  @media (min-width: 1000px) {
    font-size: 7rem;
  }
`;

const HeaderLink = styled(Link)`
  display: block;
  border-bottom: none;
  text-decoration: none;
`;

const Header = styled.header`
  padding: 30px;
  background-color: ${({ theme }) => theme.bg};
  @media (min-width: 768px) {
    padding: 50px;
  }
  @media (min-width: 826px) {
    max-height: 185px;
  }
`;

export default ({ title }) => (
  <Header>
    <HeaderLink to="/">
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderLink>
  </Header>
);
