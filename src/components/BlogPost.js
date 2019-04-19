import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import BlogPostMeta from './BlogPostMeta';
import { Content } from '../styles';

const PostTitle = styled(Link)`
  color: ${({ theme }) => theme.dark};
  &:hover {
    color: ${({ theme }) => theme.darkMuted};
  }
`;

const ReadMoreLink = styled(Link)`
  padding-top: 10px;
  display: block;
  color: ${({ theme }) => theme.dark};
  &:hover {
    color: ${({ theme }) => theme.darkMuted};
  }
`;

const Article = styled.article`
  margin-bottom: 45px;
`;

const FadeTeaser = styled.div`
  position: relative;
  height: 3.6em;

  &:after {
    content: '';
    text-align: right;
    position: absolute;
    bottom: 0;
    right: 0;
    width: 70%;
    height: 1.2em;
    background: linear-gradient(
      to right,
      rgba(244, 245, 240, 0),
      rgba(244, 245, 240, 1) 50%
    );
  }
`;

export default class BlogPost extends React.Component {
  render() {
    const post = this.props.post;
    return (
      <Article>
        <PostTitle to={`/post/${post.slug}`}>
          <h2>{post.title}</h2>
        </PostTitle>
        <BlogPostMeta
          createdAt={post.createdAt}
          timeToRead={post.body.childMarkdownRemark.timeToRead}
        />
        <FadeTeaser>
          <Content
            dangerouslySetInnerHTML={{
              __html: post.body.childMarkdownRemark.excerpt,
            }}
          />
        </FadeTeaser>
        <ReadMoreLink to={`/post/${post.slug}`}>Read more</ReadMoreLink>
      </Article>
    );
  }
}
