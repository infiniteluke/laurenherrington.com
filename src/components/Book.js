import React from 'react';
import styled from 'styled-components';
import Img from 'gatsby-image';

import { Content } from '../styles';

const BookImage = styled(Img)`
  width: 100px;
`;

const BookDetails = styled.div`
  display: flex;
  flex-direction: row;
`;

const ReadMoreLink = styled.a`
  padding-top: 10px;
  display: block;
  color: ${({ theme }) => theme.dark};
  &:hover {
    color: ${({ theme }) => theme.darkMuted};
  }
`;

export default ({ className, book }) => {
  const Image = <BookImage alt={book.image.title} fluid={book.image.fluid} />;
  return (
    <article className={className}>
      <h2>{book.title}</h2>
      <BookDetails>
        {book.affliateLink ? (
          <a href={book.affliateLink} target="_blank" rel="noopener noreferrer">
            {Image}
          </a>
        ) : (
          Image
        )}
        <div style={{ marginLeft: '30px' }}>
          {' '}
          <Content
            dangerouslySetInnerHTML={{
              __html: book.body.childMarkdownRemark.html,
            }}
          />
          {book.affliateLink ? (
            <ReadMoreLink
              href={book.affliateLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              More about this book
            </ReadMoreLink>
          ) : null}
        </div>
      </BookDetails>
    </article>
  );
};
