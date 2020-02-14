// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const ticketsCollection = db.collection('tickets')

// 云函数入口函数
exports.main = async (event, context) => {
  const OPENID = cloud.getWXContext().OPENID
  const TYPE = event.type

  const _=db.command

  console.log(OPENID, TYPE)

  if(TYPE==0){
    return await ticketsCollection.where(
      {
        _recvOpenId: _.eq(OPENID),
        _used: false
      }
    ).get()/*.then(res =>{
      console.log(res)
    })*/
  }else if(TYPE==1){
    return await ticketsCollection.where({
      _sentOpenId: OPENID
    }).get()/*.then(res => {
      console.log(res)
    })*/
  }else if(TYPE==2){
    return await ticketsCollection.where({
      _recvOpenId: OPENID,
      _used: true
    }).get()/*.then(res => {
      console.log(res)
    })*/
  }else{
    console.error('type error')
  }
}