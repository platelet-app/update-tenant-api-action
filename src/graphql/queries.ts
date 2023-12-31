/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTenant = /* GraphQL */ `
  query GetTenant($id: ID!) {
    getTenant(id: $id) {
      id
      awsEnvName
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
        awsEnvName
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
export const getTenantByEnvName = /* GraphQL */ `
  query GetTenantByEnvName(
    $awsEnvName: String!
    $sortDirection: ModelSortDirection
    $filter: ModelTenantFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getTenantByEnvName(
      awsEnvName: $awsEnvName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        awsEnvName
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
