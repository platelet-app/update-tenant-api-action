import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'
import fs from 'fs'

async function run(): Promise<void> {
  //const {default: awsExports} = await import('../src/aws-exports')
  //
  fs.readdir('.', (err, files) => {
    files.forEach(file => {
      console.log(file)
    })
  })
  try {
    const envName: string = process.env.AMPLIFY_ENV_NAME || ''
    const awsExportsFile = JSON.stringify({})
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
