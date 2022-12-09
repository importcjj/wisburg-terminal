import { gql } from "@apollo/client";

export const CONTENTS_QUERY = gql`
  query GetContnets(
    $first: Int = 20
    $offset: Int = 0
    $after: String
    $sortBy: String
    $track: String
    $startTime: Timestamp
    $endTime: Timestamp
    $kinds: [Int]
  ) {
    contents(
      first: $first
      offset: $offset
      after: $after
      sort_by: $sortBy
      track: $track
      start_time: $startTime
      end_time: $endTime
      kinds: $kinds
    ) {
      total_count
      items {
        title
        description
        kind
        raw_id
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
      page_info {
        end_cursor
        has_next_page
      }
    }
  }
`;
