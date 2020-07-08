const GIT_URL = process.env.GIT_URL
const git = require('nodegit')
const path = require('path')

function clone (repository) {
  return git.Clone(`${GIT_URL}/${repository}`, path.join(__dirname, 'tmp'), {
    fetchOpts: {
      callbacks: {
        credentials: () => {
          return git.Cred.userpassPlaintextNew(process.env.GIT_USERNAME, process.env.GIT_PASSWORD)
        }
      }
    }
  })
}

async function createBranchAndCommit (files) {
  const repository = await git.Repository.open(path.join(__dirname, 'tmp'))
  const commit = await repository.getHeadCommit()
  await repository.createBranch('automated-sonarqube', commit, 0)
  await repository.checkoutBranch('automated-sonarqube')

  const index = await repository.refreshIndex()
  for (let i = 0; i < files.length; i++) {
    await index.addByPath(files[i])
  }
  await index.write()
  const oid = await index.writeTree()

  const author = git.Signature.now('SonarQube Script', process.env.GIT_EMAIL)
  const committer = git.Signature.now('SonarQube Script', process.env.GIT_EMAIL)

  await repository.createCommit(
    'HEAD',
    author,
    committer,
    'Prepare SonarQube',
    oid,
    [commit]
  )

  const remote = await repository.getRemote('origin')

  return remote.push(
    ['refs/heads/automated-sonarqube:refs/heads/automated-sonarqube'],
    {
      callbacks: {
        credentials: () => {
          return git.Cred.userpassPlaintextNew(process.env.GIT_USERNAME, process.env.GIT_PASSWORD)
        }
      }
    }
  )
}

module.exports = {
  clone,
  createBranchAndCommit
}
