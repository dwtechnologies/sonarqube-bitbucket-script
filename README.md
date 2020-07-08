# SonarQube Script
Script for creating and preparing SonarQube projects for use in all repositories.

Loops over all repositories in one account and clones repositories one by one. It then tries to create a SonarQube project for each of then if not a `sonar-project.properties` file exists. If a properties file was creates it is committed and a pull request is created.

## Usage
You can either run it locally, through Docker or as a fargate task.

### Locally
Start of with installing the dependencies
```
yarn
```
Copy the .env.example and fill it out like so
```
cp .env.example .env
```
Then just run
```
yarn dev
```

### Docker
Start of with building the Docker image
```
docker build -t sonarqube-script .
```

Then just run it
```
docker run \
  --env GIT_URL=GIT_URL \
  --env GIT_EMAIL=GIT_EMAIL \
  --env GIT_USERNAME=GIT_USERNAME \
  --env GIT_PASSWORD=GIT_PASSWORD \
  --env SONARQUBE_API_KEY=SONARQUBE_API_KEY \
  --env SONARQUBE_CI_KEY=SONARQUBE_CI_KEY \
  --env SONARQUBE_URL=SONARQUBE_URL \
  --env ORGANIZATION=ORGANIZATION \
  sonarqube-bitbucket
```


### Environment Variables
```
GIT_URL=# No trailing slash, e.g. https://bitbucket.com
GIT_EMAIL= # The email the commit will be signed with
GIT_USERNAME=# The username of the account that will access the git providers API
GIT_PASSWORD=# The password of the account that will access the git providers API
SONARQUBE_API_KEY=# The key that will be used to create SonarQube projects
SONARQUBE_CI_KEY=# The key that the CI will use when scanning
SONARQUBE_URL=# No trailing slash, point to the instance of SonarQube that you're using
ORGANIZATION=# Organization that should be inported to SonarQube i.e. https://bitbucket.org/<ORGANIZATION>
```

### Fargate
Two loudformation files are included in the `cloudformation` folder, one for the repository and one for the task. Create the repository first, build and push the Docker image and lastly create the task. After that you can run any way you'd like.

#### Task parameters
```
EcsCluster=# Name of the ECS cluster that will run the task 
GitURL=# URL to git provider, no trailing / e.g. https://bitbucket.com 
GitEmail=# The email the commit will be signed with
GitUserName=# The username of the account that will access the git providers API
GitPassword=# The password of the account that will access the git providers API, KMS encrypted
KMSKey=# KMS keys used to encrypt secrets
SonarQubeAPIKey=# The key that will be used to create SonarQube projects, KMS encrypted
SonarQubeCIKey=# The key that the CI will use when scanning, KMS encrypted
SonarQubeURL=# No trailing slash, point to the instance of SonarQube that you're using
Subnet=# Subnet to run the task in
ORGANIZATION=# Organization that should be inported to SonarQube i.e. https://bitbucket.org/<ORGANIZATION>
```

#### Secrets 
The run.sh script uses [kmsdecryptenv](https://github.com/dwtechnologies/kmsdecryptenv) to decrypt secrets in the container.

## Development
### TODO
#### Important


#### Nice to have

- [ ] GitHub API integration
- [ ] PR Code Reviewers

### Git Providers
Git actions and git provider actions are separated. To use a different provider just create a new file and export the same functionality as `bitbucket.js` making sure the return values are equal and then just replace `bitbucket` in `index.js`.
