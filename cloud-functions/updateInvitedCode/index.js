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
  const ID = event._id
  console.log(ID)
  console.log(IC)

  return await ICCollection.doc(ID).update({
    data:{
      _invitedCode: IC
    }
  }).then(res=> {
    console.log(res)
  })
}