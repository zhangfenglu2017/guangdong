module.exports = function(app,server,gameid){return {
   info:{   round4:2, round8:3 },
   rooms:
   {
	   symj1:{name:"symj1",scene:"", full:4,type:"symj",removeLess:true,reconnect:true,vip:true},
	   symj2:{name:"symj2",scene:"", full:4,type:"symj",removeLess:true,reconnect:true,vip:false},
	   scmj1:{name:"scmj1",scene:"", full:4,type:"scmj"}
   },
   viptable:
   {
	   round4:{round:4, money:2 },
       round8:{round:8, money:3 }
   },
   initData:
   {
	   coin:5000,
	   money:9
   },
   full4create:function(para)// para 是创建房间的参数,比如phz可能返回3或者4
   {
      return 4;
   }
}}