import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import Layout from '../components/Layout';
import BlogPost from '../components/BlogPost';
import Loading from '../components/Loading';
import MapHelper from '../components/MapHelper';
import StoryCircle from '../components/StoryCircle';

import { Stories } from '../styles';

const Map = React.lazy(() => import('../components/Map'));

const PlaceTemplate = ({ pageContext, location, data }) => {
  const siteTitle = data.site.siteMetadata.title;
  const locationKey = data.placesByCountry.locations.length
    ? 'country'
    : 'name';
  const locations = data.placesByCountry.locations.length
    ? data.placesByCountry.locations
    : data.placesByName.locations.length
    ? data.placesByName.locations
    : [];
  const posts = data.postsByLocationCountry.posts.length
    ? data.postsByLocationCountry.posts
    : data.postsByLocationName.posts.length
    ? data.postsByLocationName.posts
    : [];
  const categories = data.allContentfulCategory.categories;

  return (
    <Layout location={location} {...data.site.siteMetadata}>
      <Stories>
        {categories.map(
          ({ category: { id, title, image, slug, directLink } }) => (
            <StoryCircle
              key={id}
              title={title}
              image={image}
              to={directLink ? slug : `tag/${slug}`}
            />
          )
        )}
      </Stories>
      <section>
        <Helmet title={siteTitle} />
        <h1 style={{ textAlign: 'center' }}>{`Posts at "${
          pageContext.place
        }"`}</h1>
        {locations && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'center',
              width: '100%',
              overflow: 'hidden',
            }}
          >
            <MapHelper />
            {typeof window !== 'undefined' && (
              <React.Suspense
                fallback={
                  <div style={{ margin: '118px 0', textAlign: 'center' }}>
                    <Loading />
                  </div>
                }
              >
                <Map
                  markerSize={20}
                  zoom={locationKey === 'country' ? 11 : 30}
                  showLabelOnHover={locationKey === 'country'}
                  locations={locations.map(l => l.location)}
                />
              </React.Suspense>
            )}
          </div>
        )}
        {posts.length ? (
          <section style={{ marginTop: '45px' }}>
            {posts.map(({ post }) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </section>
        ) : (
          <h2
            style={{ textAlign: 'center', marginTop: '60px' }}
          >{`No posts at "${pageContext.place}".. yet 😉`}</h2>
        )}
      </section>
    </Layout>
  );
};

export default PlaceTemplate;

export const pageQuery = graphql`
  query PlacePostQuery($place: String) {
    site {
      siteMetadata {
        title
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
    placesByName: allContentfulLocation(
      limit: 1000
      filter: { name: { eq: $place } }
    ) {
      locations: edges {
        location: node {
          name
          id
          fields {
            nameSlug
            countrySlug
          }
          coordinates {
            lon
            lat
          }
          country
        }
      }
    }
    placesByCountry: allContentfulLocation(
      limit: 1000
      filter: { country: { eq: $place } }
    ) {
      locations: edges {
        location: node {
          name
          id
          fields {
            nameSlug
            countrySlug
          }
          coordinates {
            lon
            lat
          }
          country
        }
      }
    }
    postsByLocationName: allContentfulPost(
      limit: 1000
      filter: { locations: { elemMatch: { name: { eq: $place } } } }
      sort: { fields: fields___postedAt, order: DESC }
    ) {
      posts: edges {
        post: node {
          slug
          id
          fields {
            postedAt
          }
          title
          body {
            childMarkdownRemark {
              timeToRead
              excerpt(pruneLength: 140)
              html
            }
          }
        }
      }
    }
    postsByLocationCountry: allContentfulPost(
      limit: 1000
      filter: { locations: { elemMatch: { country: { eq: $place } } } }
      sort: { fields: fields___postedAt, order: DESC }
    ) {
      posts: edges {
        post: node {
          slug
          id
          fields {
            postedAt
          }
          title
          body {
            childMarkdownRemark {
              timeToRead
              excerpt(pruneLength: 140)
              html
            }
          }
        }
      }
    }
  }
`;
