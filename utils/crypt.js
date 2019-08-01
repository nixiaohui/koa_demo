const bcrypt = require('bcrypt')
const saltRounds = 10

const encrypt = async (password) => {
  try {
    return await bcrypt.hash(password, saltRounds)
  } catch (error) {
    console.log('密码加密出错：' + error.message)
  }
}

const decrypt = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

module.exports = {
  encrypt,
  decrypt
}
