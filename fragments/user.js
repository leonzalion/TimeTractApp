import gql from 'graphql-tag'

export const SITE_FRAGMENT = gql`
  fragment site on Site {
    name
    timeSpent
    category
    productivity
  }
`;

export const USER_FRAGMENT = gql `
  fragment user on User {
    username
    accessToken
    rescueTimeData {
      productiveTime
      distractingTime
      topSites {
        ...site
      }
    }
    groups {
      id
      name
      description
    }
    avatarUrl
  }
  
  ${SITE_FRAGMENT}
`;