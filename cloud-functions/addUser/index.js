// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const usersCollection = db.collection('users')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const OPENID1 = event.openid
  const OPENID2 = wxContext.OPENID
  const CODE = event.code
  var date = new Date()

  return await usersCollection.add({
    data: {
      _openid1: OPENID1,
      _openid2: OPENID2,
      _invitedCode: CODE,
      _date: date
    }
  })
}