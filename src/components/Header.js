import React from 'react';
import styled from 'styled-components';
import Link from './Link';

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

  @media (min-width: 375px) {
    font-size: 4.75rem;
    line-height: 3rem;
  }

  @media (min-width: 550px) {
    font-size: 6.5rem;
    line-height: 4.25rem;
  }

  @media (min-width: 768px) {
    line-height: 4.75rem;
    font-size: 8rem;
  }

  @media (min-width: 1000px) {
    order: 2;
    font-size: 6.5rem;
  }
`;

const HeaderLink = styled(Link)`
  border-bottom: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
  }
`;

const Header = styled('header')`
  padding: 30px;
  display: flex;
  flex-direction: column;
  background-image: ${({ theme }) =>
    `linear-gradient(${theme.bgLight}, ${theme.bg})`};

  @media (min-width: 768px) {
    padding: 50px;
  }
`;

export default ({ title }) => (
  <Header>
    <HeaderLink to="/">
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderLink>
  </Header>
);
