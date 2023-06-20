import * as core from '@actions/core'
import {
  createTenantQuery,
  updateTenantQuery,
  getTenantByEnvQuery
} from './appsyncQuery'

async function run(): Promise<void> {
  try {
    const awsExportsFilepath = core.getInput('awsExportsFilepath')
    const envName = core.getInput('awsEnvName')
    const {default: awsExports} = await import(awsExportsFilepath)
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
