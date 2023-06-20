// amplify/backend/function/appsyncOperations/opt/appSyncRequest.js
import * as core from '@actions/core'
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

const request = async (queryDetails: {variables: any; query: string}) => {
  const apiURL = core.getInput('apiURL')
  const region = core.getInput('awsRegion')
  const accessKeyId = core.getInput('awsAccessKeyId')
  const secretAccessKey = core.getInput('awsSecretAccessKey')

  const endpoint = new URL(apiURL)
  const credentials = {
    accessKeyId,
    secretAccessKey
  }
  const signer = new SignatureV4({
    credentials,
    region,
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
  return body?.data?.getTenantByEnvName?.items[0] || null
}
