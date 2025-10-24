import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import CategoryCircle from '../components/CategoryCircle';

import styled from 'styled-components';

const CategoryList = styled.ul`
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const Nav = styled.nav`
  width: 100%;
  margin-top: 15px;
`;

class RootIndex extends React.Component {
  render() {
    const categories = this.props.data.allContentfulCategory.categories.map(
      p => p.category
    );
    return (
      <h1>Under construction</h1>
    );
  }
}

export default RootIndex;

