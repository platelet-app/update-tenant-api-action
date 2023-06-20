import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'
const fs = require('fs').promises

async function run(): Promise<void> {
  const awsContent = await fs.readFile('./aws-exports.js', 'utf8')
  const stripped = await awsContent
    .replace('export default awsmobile;', '')
    .replace('const awsmobile = ', '')
    .replace(';', '')
    .trim()
  const awsExports = JSON.parse(stripped)
  try {
    const envName: string = process.env.AMPLIFY_ENV_NAME || ''
    const awsExportsFile = JSON.stringify(awsExports)
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
