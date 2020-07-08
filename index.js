if (process.env.NODE_ENVIRONMENT === 'dev') require('dotenv').config()

const bitbucket = require('./bitbucket')
const files = require('./files')
const git = require('./git')
const logger = require('./logger')
const sonarqube = require('./sonarqube')

async function main () {
  logger.info('Script start')
  const repositories = await bitbucket.getRepositories(process.env.ORGANIZATION)

  for (let i = 0; i < repositories.length; i++) {
    files.cleanUp()

    logger.info('Handling repository', { repository: repositories[i].fullName })
    try {
      logger.info('Cloning', { repository: repositories[i].fullName })
      await git.clone(repositories[i].fullName)
    } catch (err) {
      logger.error('Failed to clone: ' + err, { error: err, repository: repositories[i].fullName})
      continue
    }

    let updated = false
    if (!await files.sonarpropertiesExist()) {
      logger.info('No sonar-project.properties found', { repository: repositories[i].fullName })
      try {
        logger.info('Creating SonarQube project', { key: repositories[i].name, repository: repositories[i].fullName })
        await sonarqube.create(repositories[i].name)
      } catch (err) {
        logger.error('Failed to create SonarQube project', { error: err, repository: repositories[i].fullName })
        continue
      }

      updated = await files.createSonarproperties(repositories[i].name, process.env.SONARQUBE_CI_KEY)
    }
    updated = await files.handlePipelines() || updated

    logger.info('Files checked and handled', { updated: updated, repository: repositories[i].fullName })

    if (updated) {
      try {
        logger.info('Creating branch and commit', { repository: repositories[i].fullName })
        await git.createBranchAndCommit(['bitbucket-pipelines.yml', 'sonar-project.properties'])
      } catch (err) {
        logger.error('Failed to create branch or commit', { error: err, repository: repositories[i].fullName })
        continue
      }

      try {
        logger.info('Creating pull request', { repository: repositories[i].fullName })
        await bitbucket.createPullRequest(repositories[i].fullName, repositories[i].name)
      } catch (err) {
        logger.error('Failed to create pull request', { error: err, repository: repositories[i].fullName })
        continue
      }

      logger.info('Repository handled', { repository: repositories[i].fullName })
    }
  }

  logger.info('Script finished')
}

main()
