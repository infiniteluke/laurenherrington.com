import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';

import Layout from '../components/Layout';
import HeroImage from '../components/HeroImage';
import Book from '../components/Book';

const BookGrid = styled.section`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const BookItem = styled(Book)`
  padding: 30px 0;
  width: 100%;
`;

class Books extends React.Component {
  render() {
    const { data } = this.props;
    const { categories } = data.allContentfulCategory;
    const { books } = data.allContentfulBook;
    const category = data.contentfulCategory;
    return (
      <Layout location={this.props.location} categories={categories} title="📖">
        <HeroImage title="Books" image={category.hero} />
        {books.length ? (
          <BookGrid>
            {books.map(({ book }) => (
              <BookItem key={book.id} book={book} />
            ))}
          </BookGrid>
        ) : (
          <h2
            style={{ textAlign: 'center', paddingTop: '40px' }}
          >{`No book posts... yet 😉`}</h2>
        )}
      </Layout>
    );
  }
}

export default Books;

export const pageQuery = graphql`
  query {
    contentfulCategory(id: { eq: "9236b5f7-28fe-5fd5-9d1c-f235f8bb852f" }) {
      title
      hero: image {
        ...squareImageLarge
      }
    }
    allContentfulBook(limit: 1000, sort: { fields: createdAt, order: DESC }) {
      books: edges {
        book: node {
          id
          title
          createdAt
          image {
            title
            fluid(maxWidth: 350) {
              ...GatsbyContentfulFluid
            }
          }
          body {
            childMarkdownRemark {
              html
            }
          }
          affliateLink
        }
      }
    }
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
