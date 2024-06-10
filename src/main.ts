import * as core from '@actions/core'
import * as github from '@actions/github'
import * as shell from 'shelljs'
import * as fs from 'fs'
import * as path from 'path'

export async function run(): Promise<void> {
  try {
    const { owner, repo } = github.context.repo

    // Clone the repo
    core.info(`Cloning repository: https://github.com/${owner}/${repo}.git`)
    shell.exec(`git clone https://github.com/${owner}/${repo}.git repo`)
    shell.cd('repo')

    // Install dependencies
    core.info('Installing dependencies...')
    shell.exec('forge install --no-commit')
    shell.exec('forge install foundry-rs/forge-std --no-commit')
    shell.exec('forge install a16z/halmos-cheatcodes --no-commit')

    // Run Halmos verification
    core.info('Running Halmos verification...')
    const halmosOutput = shell.exec('halmos --function check', {
      silent: true
    }).stdout

    // Check for errors
    if (shell.error()) {
      throw new Error('Halmos verification failed.')
    }

    // Save verification result to a file
    const resultFilePath = path.join(process.cwd(), 'halmos_output.txt')
    fs.writeFileSync(resultFilePath, halmosOutput, 'utf-8')

    // Set output for verification result
    core.setOutput('verification_result', halmosOutput)
    core.info('Halmos verification completed successfully.')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
