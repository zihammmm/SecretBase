// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const ICCollection = db.collection('invitedCode')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const IC = event._invitedCode

  return await ICCollection.add({
    data: {
      _openid: wxContext.OPENID,
      _invitedCode: IC
    }
  }).then(res =>{
    console.log(res)
  }).catch(console.error)
}