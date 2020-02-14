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
  const _ = db.command

  console.log(wxContext.OPENID)

  return await usersCollection.where(_.or([
    {
      _openid1: _.eq(wxContext.OPENID)
    },
    {
      _openid2: _.eq(wxContext.OPENID)
    }
  ])).get()
}