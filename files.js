const fs = require('fs')
const path = require ('path')
const rimraf = require('rimraf')

function cleanUp () {
  rimraf.sync(path.join(__dirname, 'tmp'))
}

async function handlePipelines () {
  try {
    await fs.promises.access(path.join(__dirname, 'tmp', 'bitbucket-pipelines.yml'))
    return false
  } catch (err) {
    try {
      await create(path.join(__dirname, 'tmp', 'bitbucket-pipelines.yml'), bitbucketPipelinesContent())
      return true
    } catch (e) {
      return false
    }
  }
}

async function sonarpropertiesExist () {
  try {
    await fs.promises.access(path.join(__dirname, 'tmp', 'sonar-project.properties'))
    return true
  } catch (err) {
    return false
  }
}

async function createSonarproperties (name, token) {
  try {
    await create(path.join(__dirname, 'tmp', 'sonar-project.properties'), sonarpropertiesContent(name, token))
    return true
  } catch (err) {
    return false
  }
}

function create (destination, content) {
  return fs.promises.writeFile(destination, content)
}

function bitbucketPipelinesContent () {
  return `pipelines:
  default:
    - step:
        script:
            - sonar-scanner
        image: newtmitch/sonar-scanner:alpine`
}

function sonarpropertiesContent (name, token) {
  return `sonar.projectKey=${name}
sonar.projectName=${name}
sonar.exclusions=**/node_modules/**
sonar.host.url=${process.env.SONARQUBE_URL}
sonar.projectBaseDir=.
sonar.login=${token}`
}

module.exports = {
  cleanUp,
  handlePipelines,
  createSonarproperties,
  sonarpropertiesExist
}
