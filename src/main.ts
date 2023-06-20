import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'
const fs = require('fs').promises

async function run(): Promise<void> {
  const awsContent = await fs.readFile('./aws-exports.js', 'utf8')
  const awsExports = JSON.parse(
    await awsContent.replace('export default ', '').replace(';', '')
  )
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
