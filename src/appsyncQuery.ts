// amplify/backend/function/appsyncOperations/opt/appSyncRequest.js
import {Sha256} from '@aws-crypto/sha256-js'
import {SignatureV4} from '@aws-sdk/signature-v4'
import {HttpRequest} from '@aws-sdk/protocol-http'
import fetch, {Request} from 'node-fetch'
import {
  UpdateTenantInput,
  GetTenantByEnvNameQueryVariables,
  CreateTenantInput
} from './API'
import {createTenant, updateTenant} from './graphql/mutations'
import {getTenantByEnvName} from './graphql/queries'

const AWS_REGION = process.env.AWS_REGION
const API_URL = process.env.API_URL
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY

if (!AWS_REGION || !API_URL || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error('Missing environment variables')
}

const request = async (queryDetails: {variables: any; query: string}) => {
  const endpoint = new URL(API_URL)
  const credentials = {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
  }
  const signer = new SignatureV4({
    credentials,
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  })

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify(queryDetails),
    path: endpoint.pathname
  })

  const signed = await signer.sign(requestToBeSigned)
  const request = new Request(endpoint, signed)
  return await fetch(request)
}

const errorCheck = (body: any) => {
  if (body?.errors) {
    console.error(body?.errors)
    throw new Error(body?.errors[0].message)
  }
}

export const updateTenantQuery = async (input: UpdateTenantInput) => {
  const response = await request({
    variables: {input},
    query: updateTenant
  })
  const body = await response.json()
  errorCheck(body)
  return body?.data?.updateTenant
}

export const createTenantQuery = async (input: CreateTenantInput) => {
  const response = await request({
    variables: {input},
    query: createTenant
  })
  const body = await response.json()
  errorCheck(body)
  return body?.data?.createTenant
}

export const getTenantByEnvQuery = async (
  variables: GetTenantByEnvNameQueryVariables
) => {
  const response = await request({
    variables,
    query: getTenantByEnvName
  })
  const body = await response.json()
  errorCheck(body)
  return body.data.getTenantByEnvName[0] || null
}
