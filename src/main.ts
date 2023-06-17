import * as core from '@actions/core'
import * as fs from 'fs'
import {
  getTenantByBranchQuery,
  createTenantQuery,
  updateTenantQuery
} from './appsyncQuery'

async function run(): Promise<void> {
  try {
    const awsExportsFilepath: string = core.getInput('awsExportsFilepath')
    // read the contents of the file
    const awsExportsFile = fs.readFileSync(awsExportsFilepath, 'utf8')
    const branchName: string = core.getInput('branch')
    const tenantData = await getTenantByBranchQuery({branch: branchName})
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
