import { gql } from "@apollo/client";



export const USER_QUERY = gql`
query UserQuery($userId: Int!) {
    users(accountId: $userId) {
        edges {
            node {
                id
                nickname
                privileges {
                    name
                    expired_at
                }
            }
        }
    }
}
`