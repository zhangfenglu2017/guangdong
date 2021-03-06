module.exports = function(app,server,gameid){return {
   info:{   round4:2, round8:3,round16:5 },
   rooms:
   {
      symj1:{name:"symj1",scene:"", full:3,type:"symj",removeLess:true,reconnect:true,vip:true},
      symj2:{name:"symj2",scene:"", full:3,type:"symj",removeLess:true,reconnect:true,vip:false},
      scmj1:{name:"scmj1",scene:"", full:3,type:"scmj"}
   },
   viptable:
   {
      round4:{round:4, money:2 },
      round8:{round:8, money:3 },
      round16:{round:16, money:5 },
   },

   initData:
   {
      coin:5000,
      money:9
   },
   full4create:function(para)// para 是创建房间的参数,比如phz可能返回3或者4
   {
      return 4;
   },
   minVersion:"1.0.077"    //(热更的版本)低于这个版本，不能创建房间和加入房间
}}