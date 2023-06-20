import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'
import fs from 'fs'

const awsExports = require('../src/aws-exports').default
async function run(): Promise<void> {
  fs.readdir('./src', (err, files) => {
    files.forEach(file => {
      console.log(file)
    })
  })
  fs.readFile('../src/aws-exports.js', 'utf8', function (err, contents) {
    console.log(contents)
  })
  try {
    const envName: string = process.env.AMPLIFY_ENV_NAME || ''
    const awsExportsFile = JSON.stringify(awsExports)
    console.log('sfadsdfa', envName, awsExportsFile)
    const tenantData = await getTenantByEnvQuery({awsEnvName: envName})
    if (tenantData) {
      await updateTenantQuery({
        id: tenantData.id,
        config: awsExportsFile,
        version: tenantData.version + 1
      })
    } else {
      await createTenantQuery({
        awsEnvName: envName,
        config: awsExportsFile,
        name: envName,
        version: 1
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
