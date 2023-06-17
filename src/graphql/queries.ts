/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTenant = /* GraphQL */ `
  query GetTenant($id: ID!) {
    getTenant(id: $id) {
      id
      branch
      name
      config
      version
      createdAt
      updatedAt
    }
  }
`;
export const listTenants = /* GraphQL */ `
  query ListTenants(
    $filter: ModelTenantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTenants(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        branch
        name
        config
        version
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTenantByBranch = /* GraphQL */ `
  query GetTenantByBranch(
    $branch: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTenantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTenantByBranch(
      branch: $branch
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        branch
        name
        config
        version
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
