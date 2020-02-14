// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const ticketsCollection = db.collection('tickets')

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.userRecord)
  const SENTOPENID = cloud.getWXContext().OPENID
  const RECVOPENID = (event.userRecord._openid1 == SENTOPENID) ? event.userRecord._openid2 : event.userRecord._openid1
  const TYPE = event.name
  const DESC = event.desc
  const COMMENT = event.comment

  var date = new Date()

  return await ticketsCollection.add({
    data:{
      _sentOpenId: SENTOPENID,
      _recvOpenId: RECVOPENID,
      _type: TYPE,
      _date: date,
      _used: false,
      _desc: DESC,
      _comment: COMMENT
    }
  })
}