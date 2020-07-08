const API_URL = `${process.env.SONARQUBE_URL}/api`
const axios = require('axios')

function request (config) {
  return axios({...config, auth: {
    username: process.env.SONARQUBE_API_KEY
  }})
}

function create (name) {
  return request({
    method: 'post',
    url: `${API_URL}/projects/create`,
    params: {
      name: name,
      project: name
    }
  })
}

module.exports = {
  create
}
