const logger = require('./logger')

function pullrequestSummary (key) {
  return `# SonarQube Preparation

This pull request has been created by an automated script.


## SonarQube Project

A SonarQube project has been created and can be found [here](${process.env.SONARQUBE_URL}/dashboard?id=${key}). No special configuration has been made and no blockers have been added. This will only report on what SonarQube can automatically detect while scanning. More info on what you can change  [here](https://docs.sonarqube.org/latest/analysis/overview/)


## CI Setup

This pull request will have created a \`sonar-project.properties\` and or a \`bitbucket-pipelines.yml\` file. The \`sonar-project.properties\` will have the \`node_modules\` folders excluded by default and if a \`bitbucket-pipelines.yml\` has been added, it will include a pipeline that runs the SonarQube scanner on commit. If it's not included, the step can be found here and added as you please:


\`\`\`
    - step:
        script:
            - sonar-scanner
        image: newtmitch/sonar-scanner:alpine
\`\`\`
`
}

function filterRepositories (repositories) {
  return repositories.filter(repository => {
    if (/\s/.test(repository.name)) {
      logger.warn('Ignoring repository as the name includes one or more spaces', { name: repository.name, repository: repository.fullName })
      return false
    }

    return true
  })
}

function transformRepositories (repositories) {
  return repositories.map(repository => {
    return {
      fullName: repository.full_name,
      name: repository.name
    }
  })
}

module.exports = {
  filterRepositories,
  pullrequestSummary,
  transformRepositories
}
