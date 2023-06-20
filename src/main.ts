import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'

const awsExports = require('../src/aws-exports').default

async function run(): Promise<void> {
  try {
    const envName: string = process.env.AWS_ENV_NAME || ''
    const tenantData = await getTenantByEnvQuery({awsEnvName: envName})
    const awsExportsFile = JSON.stringify(awsExports)
    if (tenantData) {
      await updateTenantQuery({
        id: tenantData.id,
        config: awsExportsFile,
        version: tenantData.version + 1
      })
    } else {
      console.log('sfadsdfa', envName, awsExportsFile)
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
