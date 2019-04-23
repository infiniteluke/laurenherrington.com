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
    // Special "Categories" need these fields
    const globe = {
      squareImageLarge: this.props.data.globeImage,
      title: 'Globe',
    };
    return (
      <Layout
        location={this.props.location}
        {...this.props.data.site.siteMetadata}
      >
        <Nav>
          <CategoryList>
            <React.Fragment>
              <CategoryCircle to="globe" category={globe} />
              {categories.map(category => {
                return (
                  <CategoryCircle
                    key={category.slug}
                    category={category}
                    to={`tag/${category.slug}`}
                  />
                );
              })}
            </React.Fragment>
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
    globeImage: contentfulAsset(
      id: { eq: "20caf6fa-18f2-59e8-a742-385190338ec5" }
    ) {
      ...squareImageLarge
    }
    allContentfulCategory(limit: 1000) {
      categories: edges {
        category: node {
          id
          slug
          title
          squareImageLarge: image {
            ...squareImageLarge
          }
        }
      }
    }
  }

  fragment squareImageLarge on ContentfulAsset {
    title
    fluid(maxWidth: 600, maxHeight: 600) {
      ...GatsbyContentfulFluid_withWebp
    }
  }
`;
