import React from 'react';
import { graphql } from 'gatsby';

import Layout from '../components/Layout';
import StoryCircle from '../components/StoryCircle';
import { Stories } from '../styles';

class NotFoundPage extends React.Component {
  render() {
    const { data } = this.props;
    const categories = data.allContentfulCategory.categories;

    return (
      <Layout location={this.props.location} categories={categories} title="❔">
        <h1>Not Found</h1>
        <p>This page could not be found.</p>
      </Layout>
    );
  }
}

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    allContentfulCategory(sort: { fields: weight }) {
      categories: edges {
        category: node {
          id
          slug
          title
          directLink
          image {
            ...squareImageSmall
          }
        }
      }
    }
  }
`;
