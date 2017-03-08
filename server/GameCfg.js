module.exports = function(app,server,gameid){return {
   info:{   round4:0, round8:0 },
   rooms:
   {
	   symj1:{name:"symj1",scene:"", full:4,type:"symj",removeLess:true,reconnect:true,vip:true},
	   symj2:{name:"symj2",scene:"", full:4,type:"symj",removeLess:true,reconnect:true,vip:false},
	   scmj1:{name:"scmj1",scene:"", full:4,type:"scmj"}
   },
   viptable:
   {
	   round4:{round:4, money:0 },
       round8:{round:8, money:0 }	   
   },
   initData:
   {
	   coin:0,
	   money:9
   }
}}