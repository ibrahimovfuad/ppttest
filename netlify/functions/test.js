const { client, q } = require('../../db/index');

function checkAuth(context) {
  return new Promise((resolve, reject) => {
    const user = context.clientContext && context.clientContext.user

    if (!user) {
      return reject(new Error('No user claims'))
    }

    return resolve(user)
  })
}

exports.handler = (event, context, callback) => {
  checkAuth(context).then(async (user) => {
    const response = await client.query(q.Create('users', { data: { email: user.email, id: user.sub } }));

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        data: response
      })
    })
  }).catch((error) => {
    return callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        error: error.message,
      })
    })
  })
}
