import { gql } from '@apollo/client';

export const CONTENTS_QUERY = gql`
  query GetContnets($first: Int = 20) {
    contents(first: $first) {
      total_count
      items {
        title
        description
        kind
        datetime
        detail {
          ... on Article {
            source_url
            attachments {
              file_extension
              file_url
              id
              title
            }
          }

          ... on Report {
            extension
            url
            title
          }

          ... on Link {
            to
          }
        }
        counter {
          viewed
        }
      }
    }
  }
`;
