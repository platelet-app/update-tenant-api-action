import * as core from '@actions/core'
import {
  getTenantByBranchQuery,
  createTenantQuery,
  updateTenantQuery
} from './appsyncQuery'

const awsExports = require('./aws-exports').default

async function run(): Promise<void> {
  try {
    const branchName: string = core.getInput('branch')
    const tenantData = await getTenantByBranchQuery({branch: branchName})
    const awsExportsFile = JSON.stringify(awsExports)
    if (tenantData) {
      await updateTenantQuery({
        id: tenantData.id,
        config: awsExportsFile,
        version: tenantData.version + 1
      })
    } else {
      await createTenantQuery({
        branch: branchName,
        config: awsExportsFile,
        name: branchName,
        version: 1
      })
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
