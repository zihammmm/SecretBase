// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const ticketsCollection = db.collection('tickets')

// 云函数入口函数
exports.main = async (event, context) => {
  const ID = event.id

  console.log(ID)

  return await ticketsCollection.doc(ID).update({
    data: {
      _use: true
    }
  }).then(res => {
    console.log(res)
  })
}