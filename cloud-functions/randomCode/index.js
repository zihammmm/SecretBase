// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const usersCollection = db.collection('users')
// 云函数入口函数
/*
生成随机邀请码并保存到数据库中
*/
exports.main = async (event, context) => {
  let code = Math.random().toString(36).substr(2,15)
  
  //let { OPENID, APPID, UNIONID } = cloud.getWXContext()

  //let flag=false;
  //先检查是否有该数据
  /*usersCollection.where({
    _openid1: OPENID
  }).get().then(res =>{
    if(res.data.length!=0){
      flag=true;
    }
  })
  console.log(OPENID)

  if(flag){
    usersCollection.update({
      data:{
        _openid1: OPENID,
        _code: code
      }
    }).then(res =>{
      console.log(res)
    }).catch(console.error)

  }else{
    usersCollection.add({
      data: {
        _openid1: OPENID,
        _code: code,
        _openid2: "",
        _isSignUp: false
      }
    }).then(res =>{
      console.log(res)
    }).catch(console.error)
  }
  console.log(flag)*/

  return await code
}