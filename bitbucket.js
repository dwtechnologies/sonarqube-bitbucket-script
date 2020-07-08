const API_URL = 'https://api.bitbucket.org/2.0'
const axios = require('axios')
const logger = require('./logger')
const utils = require('./utils')

function request (config) {
  return axios({...config, auth: {
    username: process.env.GIT_USERNAME,
    password: process.env.GIT_PASSWORD
  }})
}

function createPullRequest (repository, key) {
  return request({
    method: 'post',
    url: `${API_URL}/repositories/${repository}/pullrequests`,
    data: {
      title: 'SonarQube Preparation',
      source: {
        branch: {
          name: 'automated-sonarqube'
        }
      },
      summary: {
        raw: utils.pullrequestSummary(key)
      }
    }
  })
}

async function getRepositories (organization) {
  let repositories = []
  let page = 1
  let notLastPage = true

  logger.error('Retrieving repositories')
  while (notLastPage) {
    try {
      const response = await request({
        method: 'get',
        url: `${API_URL}/repositories/${organization}?page=${page}`
      })
      repositories = [...repositories, ...utils.transformRepositories(response.data.values)]
      page += 1
      if (response.data.values.length < 10) notLastPage = false
    } catch (err) {
      logger.error('Retrieving repositories failed', { error: err })
      process.exit(1)
    }
  }

  logger.error('Retrieving repositories done')

  return utils.filterRepositories(repositories)
}

module.exports = {
  createPullRequest,
  getRepositories
}
