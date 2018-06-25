const tokenService = require('../../service/node_token')

const regex = /\/nodes\/(\d+)(\/|$)/

let getNodeId = (path) => {
  let res = path.match(regex)
  if (!res) {
    return null
  }
  return res[1]
}

module.exports = async (ctx) => {
  let nodeId = getNodeId(ctx.request.path)
  let token = ctx.request.headers['node-token']
  if (!nodeId || !token) {
    return false
  }

  return tokenService.isValidAsync(nodeId, token)
}
