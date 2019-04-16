import React from 'react';
import styled from 'styled-components';
import { Link } from 'gatsby';

import BlogPostMeta from '../components/BlogPostMeta';
import { Content } from '../styles';

const PostTitle = styled(Link)`
  color: ${({ theme }) => theme.accent};
`;

const Article = styled.article`
  margin-bottom: 45px;
`;

export default class BlogPost extends React.Component {
  render() {
    const post = this.props.post;
    return (
      <Article>
        <PostTitle to={`/post/${post.slug}`}>
          <h1>{post.title}</h1>
        </PostTitle>
        <BlogPostMeta
          createdAt={post.createdAt}
          timeToRead={post.body.childMarkdownRemark.timeToRead}
        />
        <Content
          dangerouslySetInnerHTML={{
            __html: post.body.childMarkdownRemark.excerpt,
          }}
        />
      </Article>
    );
  }
}
