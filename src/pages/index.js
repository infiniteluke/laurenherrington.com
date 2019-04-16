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
`;
class RootIndex extends React.Component {
  render() {
    const categories = this.props.data.allContentfulCategory.categories.map(
      p => p.category
    );
    return (
      <Layout
        location={this.props.location}
        {...this.props.data.site.siteMetadata}
      >
        <Nav>
          <CategoryList>
            {categories.map(category => {
              return <CategoryCircle key={category.slug} category={category} />;
            })}
          </CategoryList>
        </Nav>
      </Layout>
    );
  }
}

export default RootIndex;

export const pageQuery = graphql`
  query HomeQuery {
    site {
      siteMetadata {
        title
      }
    }
    allContentfulCategory(limit: 1000) {
      categories: edges {
        category: node {
          id
          slug
          title
          squareImageSmall: image {
            ...squareImageSmall
          }
          squareImageLarge: image {
            ...squareImageLarge
          }
        }
      }
    }
  }

  fragment squareImageSmall on ContentfulAsset {
    title
    fluid {
      ...GatsbyContentfulFluid_withWebp
    }
  }
  fragment squareImageLarge on ContentfulAsset {
    title
    fluid(maxWidth: 600, maxHeight: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
