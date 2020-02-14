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

  /*return await ICCollection.get().then(res =>{
    console.log(res)
    }
  )*/
  if(event.type==0){
    return await ICCollection.where({
      _openid: wxContext.OPENID
    }).get()
  }else {
    return await ICCollection.where({
      _invitedCode: event.code
    }).get()
  }
  
}