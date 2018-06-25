const errors = require('../../../lib/errors')
const tokenService = require('../../../service/node_token')

module.exports = async (ctx) => {
  let { tokenId } = ctx.params
  let nodeToken = await tokenService.getAsync(tokenId)
  if (!nodeToken) {
    throw new errors.NotFound('未找到相关 Token')
  }

  ctx.body = nodeToken
}
