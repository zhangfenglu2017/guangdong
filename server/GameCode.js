module.exports = function(app,server,gameid,Player,Table,TableGroup,TableManager,Game) 
{
	var gameLog=[];function GLog(log){ return;	app.FileWork(gameLog,__dirname+"/log.txt",log)}
	console.error(app.serverId+" reload game code "+gameid);
	var logid=Date.now();
	delete require.cache[require.resolve("./majiang.js")];
	var majiang=require("./majiang.js");
	var TableState={
		waitJoin:1,
		waitReady:2,
		waitPut:3,
		waitEat:4,
		waitCard:5,
		roundFinish:6,
		isReady:7
	}
	var WinType=
	{
	  eatPut:1,     //普通出牌点炮 
	  eatGangPut:2, //开杠打牌点炮
	  eatGang:3,    //抢杠
      pickNormal:4, //普通自摸
	  pickGang1:5,  //吃牌开明杠后补牌自摸(点杠者包3家)
	  pickGang23:6  //摸牌开杠补牌自摸
	}  
	function GetHuType(td,pl,cd) {
		var huType=majiang.canHu(!td.canHu7,pl.mjhand,cd,td.canHuWith258,td.withZhong);
		pl.huType=huType;
		return huType;
	}
	function GetEatFlag(pl,tData)
	{
		var cd=tData.lastPut;
		
		var leftCard=(tData.withWind?136:108)-tData.cardNext;
		
		var eatFlag=0;
		if(!pl.skipHu && (tData.canEatHu||tData.putType==4)&& GetHuType(tData,pl,cd)>0)  eatFlag+=8;
		if(leftCard>0&&majiang.canGang0(pl.mjhand,cd))        eatFlag+=4;
		if((leftCard>4||tData.noBigWin)&&majiang.canPeng(pl.mjhand,cd))         eatFlag+=2;
		if((leftCard>4||tData.noBigWin)&&tData.canEat&&
		    tData.uids[(tData.curPlayer+1)%4]==pl.uid && //下家限制
		    majiang.canChi(pl.mjhand,cd).length>0
		 ) eatFlag+=1;
		
		return eatFlag;
	}
	
	Table.prototype.initTable=function()
	{
		var table=this;
		var rcfg=this.roomCfg();
		table.uid2did={};
		//服务器私有
		table.cards=[];
		//回放记录
		table.mjlog=[];
		//公开
		table.tData={
			tState:TableState.waitJoin,
			initCoin:1000,   //积分显示
			roundNum:-1,  
			roundAll:0,
			uids:[],
			owner:-1,         //uid
			cardNext:0,
			winner:-1,        //0-3
			curPlayer:-1,     //0-3
			zhuang:-1,        //0-3
			lastPutPlayer:-1, //0-3上次出牌玩家
			putType:0,        //0 普通出牌  1 2 3开杠的牌  4开杠后打出的牌 
			lastPut:-1,       //上次出的牌
			tableid:this.tableid,
			canEatHu:false,
			delEnd:0,       //
			firstDel:0,       //
		};
	}
	//断线重连
	Table.prototype.Disconnect=function(pl,msg)
	{
		GLog("Table.prototype.Disconnect");
		pl.onLine=false;
		this.channel.leave(pl.uid,pl.fid);	pl.fid=null;
		this.NotifyAll('onlinePlayer',{uid:pl.uid,onLine:false,mjState:pl.mjState});
		//console.info("Disconnect "+pl.uid+" "+pl.fid+" "+pl.sid);
	}
	Table.prototype.Reconnect=function(pl,plData,msg,sinfo)
	{
		GLog("Table.prototype.Reconnect");
		pl.onLine=true;
		var tData=this.tData;
		//if(isUndefined(tData.canHu7)||isUndefined(tData.canHuWith258))
		//{
		//	if(tData.noBigWin)
		//	{
		//		tData.canHu7=false;
		//		tData.canHuWith258=false;
		//	}
		//	else
		//	{
		//		tData.canHu7=true;
		//		tData.canHuWith258=false;
		//	}
		//}
		
		//console.info("Reconnect "+pl.uid+" "+pl.fid+" "+pl.sid);
		this.channel.leave(pl.uid,pl.fid);
		pl.sid=sinfo.sid; pl.fid=sinfo.fid; pl.did=sinfo.did;
		if(pl.mjState==TableState.roundFinish) pl.mjState=TableState.isReady;
		this.NotifyAll('onlinePlayer',{uid:pl.uid,onLine:true,mjState:pl.mjState});
		this.channel.add(pl.uid,pl.fid);
		pl.notify("initSceneData",this.initSceneData(pl));
		
		
		//console.info("initSceneData "+pl.uid+" "+pl.fid+" "+pl.sid);
		this.startGame();
	}
	Table.prototype.CanAddPlayer=function(pl)
	{
		GLog("Table.prototype.CanAddPlayer");
		var uids=this.tData.uids;
		if(this.tData.roundNum>-2)
		{
		   if(uids.indexOf(pl.uid)<0)
		   {
			  if(uids.length==4&&uids.indexOf(0)<0) return false;
			  return true;
		   }
           else return true;			   
		}
		return false;
		
	}
	Table.prototype.CanLeaveGame=function(pl)
	{
		GLog("Table.prototype.CanLeaveGame");
		var tData=this.tData;
		if( (tData.tState==TableState.waitJoin&&pl.uid!=tData.owner)||tData.roundNum==-2)
		{
			return true;
		}
		return false;
	}
	function isUndefined(obj) {
		return obj === void 0;
	}
	Table.prototype.initAddPlayer=function(pl,msg)
	{
		GLog("Table.prototype.initAddPlayer");
		//公开
		pl.winall=0;   //累计赢 
		pl.mjState=TableState.isReady;
		pl.mjpeng=[];  //碰
		pl.mjgang0=[]; //明杠
		pl.mjgang1=[]; //暗杠
		pl.mjchi=[];   //吃
		//私有
		pl.mjhand=[];  //手牌
		pl.eatFlag=0;  //胡8 杠4 碰2 吃1
		pl.delRoom=0;
		pl.onLine=true;

		pl.mjMa=[];
		pl.left4Ma = [];
		this.uid2did[pl.uid]=pl.did;//记录数据服务器id
		
		var tData=this.tData;
		if(tData.roundNum==-1)
		{
			tData.roundAll=this.createPara.round;    //总
			tData.roundNum=this.createPara.round;    //剩余
			tData.canEatHu=this.createPara.canEatHu; //是否可以吃胡
			tData.withWind=this.createPara.withWind; //是否可以带风
			tData.canEat=this.createPara.canEat;     //是否可以吃
			tData.noBigWin=false;//this.createPara.noBigWin; //是否邵阳玩法
			//tData.canHu7=isUndefined(this.createPara.canHu7) ? false:this.createPara.canHu7; //是否可以七对
			//tData.canHuWith258=isUndefined(this.createPara.canHuWith258) ? false:this.createPara.canHuWith258; //只能258做将
			tData.withZhong=isUndefined(this.createPara.withZhong) ? false:this.createPara.withZhong; //红中赖子
			tData.canHuWith258=false;
			tData.canHu7=false;

			//init data 
			//if(tData.noBigWin) {
			//	tData.withWind=false;
			//    tData.canEat=false;
			//}
			//else {
			//	tData.canEatHu=false;
			//	tData.canHu7 = true;
			//	tData.canHuWith258 = false;
			//	tData.withZhong = false;
			//}
			// GLog("tData.canHu7 : " + tData.canHu7);
			// GLog("tData.canHuWith258 : " + tData.canHuWith258);
	    }
		if(tData.owner==-1)	tData.owner=pl.uid;
		var uids=tData.uids;
		if(uids.indexOf(pl.uid)<0)
		{
			if(uids.length<4) uids.push(pl.uid);
			else
			{
				for(var i=0;i<uids.length;i++)
					if(uids[i]==0) { uids[i]=pl.uid; break; }
			}
		}
		this.NotifyAll('addPlayer',{player:{info:pl.info,onLine:true,mjState:pl.mjState,winall:pl.winall},tData:tData});		

	}
	//客户端收到initSceneData  session中的pkroom还没有设定好
	Table.prototype.initSceneData=function(pl)
	{
		GLog("Table.prototype.initSceneData");
		//公共
		var msg= {   players:this.collectPlayer( 'info','mjState','mjpeng','mjgang0','mjgang1','mjchi','mjput','onLine','delRoom','isNew','winall','mjMa','left4Ma')
				    ,tData:this.tData
					,serverNow:Date.now()
			   };
	    //私有
		msg.players[pl.uid].mjhand=pl.mjhand;
		msg.players[pl.uid].mjpeng4=pl.mjpeng4;
		msg.players[pl.uid].skipHu=pl.skipHu;
		
		
		return msg;	   
	}
	
    function DestroyTable(tb)
    {
		GLog("function DestroyTable");
		if(tb.PlayerCount()==0 && tb.tData.roundNum==-2 )
		{
			tb.tData.roundNum=-3;
			tb.Destroy();
		}
    }

	Table.prototype.cleanRemovePlayer=function(pl)
	{
		GLog("Table.prototype.cleanRemovePlayer");
		//console.info("cleanRemovePlayer "+pl.uid+" "+this.tData.roundNum);
		var tData=this.tData;
		if(tData.tState==TableState.waitJoin)
		{
			var idx=tData.uids.indexOf(pl.uid);
			if(idx>=0)
			{
				tData.uids[idx]=0;
				this.NotifyAll("removePlayer",{uid:pl.uid,tData:tData});
			} 
		}
		DestroyTable(this);
		
	}
	Table.prototype.startGame=function()
	{
		GLog("Table.prototype.startGame");
		if( this.tData.roundNum>0&&this.PlayerCount()==4
		  &&this.AllPlayerCheck(function(pl){ return pl.mjState==TableState.isReady }))
		{
			var tData=this.tData;
			if(app.testCards&&app.testCards[tData.owner])
			{
				this.cards=app.testCards[tData.owner];
			}
		    else this.cards=majiang.randomCards(this.tData.withWind,this.tData.withZhong);

			var isFirst = false;
			if(tData.zhuang==-1)//第一局
			{
				isFirst = true;
			   tData.zhuang=tData.curPlayer=0;	
			}
			else if(tData.winner==-1)//荒庄
			{
				tData.zhuang=tData.curPlayer;	
			}
			else//有赢家
			{
				tData.zhuang=tData.curPlayer=tData.winner;	
			}
			tData.cardNext=0;
			tData.tState=TableState.waitCard;
			tData.winner=-1;
			
			var cards=this.cards;
			for(var i=0;i<4;i++)
		    {
				var pl=this.players[tData.uids[ (i+tData.zhuang)%4 ]];
				pl.mjState=TableState.waitCard; 
				pl.eatFlag=0;
				pl.winone=0;   //当前局赢多少
				pl.baseWin=0;  //番数
				pl.mjpeng=[];  //碰
				pl.mjgang0=[]; //明杠
				pl.gang0uid={}; 
				pl.mjgang1=[]; //暗杠
				pl.mjchi=[];   //吃
				pl.mjput=[];   //打出的牌
				pl.winType=0;  //胡牌类型
				pl.isNew=false; //是否通过发牌获取的,不是碰 吃
				//私有
				pl.mjhand=[];  //手牌
				pl.mjdesc=[];
				pl.mjpeng4=[]; //碰的时候还有一张牌
				pl.picknum=0;

				//pl.mjMa=[];//个人马
				//pl.left4Ma=[];//剩余麻将中的前4个 作为马
				if(isFirst)
				{
					var maCards = majiang.initMa(i);
					for(var j=0;j<maCards.length; j++){
						pl.mjMa.push(maCards[j]);
					}
				}

				for(var j=0;j<13;j++)
				{
					pl.mjhand.push(cards[tData.cardNext++]);
				}
				if(pl.onLine)pl.notify("mjhand",{mjhand:pl.mjhand,tData:tData});
			}
			
			var mjlog=this.mjlog;
			if(mjlog.length==0)
			{
				mjlog.push("players",this.PlayerPtys(function(p)
				{ 
				   return {
					 info:{uid:p.info.uid,nickname:p.info.nickname,headimgurl:p.info.headimgurl,remoteIP:p.info.remoteIP }
				   }   
				
				}));//玩家
			}
			tData.putType=0;tData.curPlayer=(tData.curPlayer+3)%4;
			mjlog.push("mjhand",this.cards,app.CopyPtys(tData));//开始
			SendNewCard(this);//开始后第一张发牌
		}
	}
	function EndGame(tb,pl,byEndRoom)
	{
		GLog("function EndGame");
		var tData=tb.tData;
		//if(pl)
		//{
		//	pl.left4Ma.length = 0;
		//	for(var i=0;i<4;i++){
		//		pl.left4Ma.push(tb.cards[tData.cardNext+i]);
		//	}
		//}

		var pls=[];
		tb.AllPlayerRun(function(p)
		{
			p.mjState=TableState.roundFinish;
			pls.push(p);
		});

		//不管胡不胡都给每位玩家 传送left4Ma
		for(var z=0;z<pls.length;z++)
		{
			pls[z].left4Ma.length = 0;
			for(var i=0;i<4;i++){
				pls[z].left4Ma.push(tb.cards[tData.cardNext+i]);
			}
		}
		
		//算杠
		for(var i=0;i<pls.length;i++)
		{
		    var pi=pls[i];
			//pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
			pi.winone+=(pi.mjgang1.length+pi.mjgang0.length)*3;
			
			if(pi.mjgang0.length>0) pi.mjdesc.push(pi.mjgang0.length+"明杠");
			for(var g=0;g<pi.mjgang0.length;g++)
			{
				var ganguid=pi.gang0uid[pi.mjgang0[g]];
				for(var j=0;j<pls.length;j++)
				{
					if(j!=i)
					{
						var pj=pls[j];
						if(ganguid>=0&&pj.uid!=tData.uids[ganguid]) continue;
						if(ganguid>=0)
						{
						    pj.winone-=3;	
							pj.mjdesc.push("点杠");
						}
						else pj.winone-=1;
						
					}
				}	
			}
			if(pi.mjgang1.length>0) pi.mjdesc.push(pi.mjgang1.length+"暗杠");
			//var gangWin=pi.mjgang1.length*2;
			var gangWin=pi.mjgang1.length;
            for(var j=0;j<pls.length;j++)
			{
				if(j!=i)
				{
					var pj=pls[j];
			        pj.winone-=gangWin;
				}
			}				
		}
		
		
	    if(pl)
		{
			tData.winner=tData.uids.indexOf(pl.uid);
			//算胡
			for(var i=0;i<pls.length;i++)
			{
				var pi=pls[i];
				if(pi.winType>0)
				{
					
					//var is13=pi.huType==13;
					//var allHand=pi.winType>=WinType.eatGangPut&&majiang.OnlyHand(pi);
					//var num2=pi.huType==7?1:0;	if(num2==1&&majiang.canGang1([],pi.mjhand,[]).length>0) num2=2;
					//var num3=(num2>0||is13)?0:majiang.All3(pi);
					//var sameColor=is13?false:majiang.SameColor(pi);
					//var baseWin=1;
					var num3 = majiang.All3(pi);//0 1大对碰 2 含风大对碰

					var sameColor=majiang.SameColor(pi);
					var hunyise = majiang.HunYiSe(pi);

					var baseWin=1;
					var judgeType = 0;
					if(!tData.noBigWin){
						var des = "";
						if(sameColor)//清一色
						{
							des = "清一色";
						}
						//混一色
						if(hunyise){
							des = "混一色";
						}
						if(num3 == 1)
						{
							des = "碰碰胡";
							//清一色
							if(sameColor)//清一色
							{
								des = "清碰";
							}
							//混一色
							if(hunyise){
								des = "混碰";
							}
							judgeType = 1;

						}
						if(des != "")	pi.mjdesc.push(des);

						//天胡
						if (tData.cardNext == 53 &&tData.curPlayer ==tData.zhuang&&pi.winType>= WinType.pickNormal)
						{
							pi.mjdesc.push("天胡");
							judgeType = 1;
						}
						//地胡
						else if (tb.AllPlayerCheck(function(pl){ return pl.mjpeng.length==0})&&
							tb.AllPlayerCheck(function(pl){ return pl.mjgang0.length==0})&&
							tb.AllPlayerCheck(function(pl){ return pl.mjgang1.length==0})&&
							tb.AllPlayerCheck(function(pl){ return pl.mjchi.length==0})&&
							pi.mjhand.length==14&&
							(pi.picknum==0||pi.picknum==1) &&
							pi.mjput.length == 0)
						{
							pi.mjdesc.push("地胡");
							judgeType = 1;
						}

						//杠上花
						if(pi.winType == WinType.pickGang23){
							pi.mjdesc.push("杠上花");
							judgeType = 1;
						}

					}


					//if(!tData.noBigWin)
					//{
					//	if(allHand) //门清
					//	{
					//		baseWin*=4;	pi.mjdesc.push("门清");
					//	}
					//	if(sameColor)//清一色
					//	{
					//	   baseWin*=8;  pi.mjdesc.push("清一色");
					//	}
					//	if(is13)
					//	{
					//	   baseWin*=24; pi.mjdesc.push("十三幺");
					//	}
					//	if(num2>0)
					//	{
					//		baseWin*=num2>1?16:8;  pi.mjdesc.push(num2>1?"龙七对":"七巧对");
					//	}
					//	if(num3>0)
					//	{
					//		baseWin*=num3>1?24:8;  pi.mjdesc.push(num3>1?"风一色":"大对碰");
					//	}
					//}
					

					
					
					//if(baseWin==1) pi.mjdesc.push("平胡");
					
					//if(!tData.noBigWin)
					//{
					//	if(allHand)//门清
					//	{
					//		if(sameColor)//清一色
					//		{
					//			//if(is13)       else         //不存在
					//			if(num2>1)      baseWin=16;
					//			else if(num2>0) baseWin=8;   //7对
					//			else if(num3>0)	baseWin=8;   //大对碰
					//			else            baseWin=8;   //门清清一色
					//		}
					//		else
					//		{
					//			if(is13)         baseWin=24;  //门清13幺
					//			else if(num2>1)  baseWin=16;  //
					//			else if(num2>0)  baseWin=8;  //
					//			else if(num3>1)	 baseWin=24;  //门清风一色
					//			else if(num3>0)  baseWin=8;
					//		}
					//	}
					//	else
					//	{
					//		if(sameColor)
					//		{
					//			//if(is13)               else (不存在)
					//			if(num2>1)  baseWin=16;
					//			else if(num2>0)  baseWin=8;
					//			else if(num3>0)	baseWin=8;  //
					//		}
					//		else
					//		{
					//			//if(is13)       else    不需要处理
					//			//if(num2>0)     else    不需要处理
					//			//if(num3>0)	         不需要处理
					//		}
					//	}
					//}
					//switch(pi.winType)
					//{
					//	case WinType.eatPut:     pi.mjdesc.push("吃胡"); break;
					//	case WinType.eatGangPut: pi.mjdesc.push(tData.noBigWin?"吃胡":"吃杠"); break;
					//	case WinType.eatGang:    pi.mjdesc.push("抢杠"); break;
					//	case WinType.pickNormal: pi.mjdesc.push("自摸"); break;
					//	case WinType.pickGang1:
					//	case WinType.pickGang23: pi.mjdesc.push(tData.noBigWin?"自摸":"杠上花"); break;
					//}

					
					//自摸
					//if(baseWin==1)
					//{
					//	if(tData.noBigWin)//转转
					//	{
					//		if(pi.winType>=WinType.pickNormal) baseWin*=2;
					//	}
					//	else//邵阳
					//	{
					//		if(pi.winType>=WinType.eatGangPut) baseWin*=2;
					//	}
					//}
					
					pi.baseWin=baseWin;
					var isGangShangHua = false;

					var maFan = 1;
					var maCount = 0;

					switch(majiang.getMaPrice(pi))
					{
						case 0:
							maCount = 0;
							maFan =1;
							break;
						case 1:
							maFan *=2;
							maCount = 1;
							break;
						case 2:
							maFan *=4;
							maCount = 2;
							break;
						case 3:
							maFan *=8;
							maCount = 3;
							break;
					}



					for(var j=0;j<pls.length;j++)
					{
						var pj=pls[j];
						if(pj.winType>0) continue;
						
						var roundWin=1;
						//点炮一家输
						//if(pi.winType<=WinType.eatGangPut)
						//{
						//	if(pj.uid!=tData.uids[tData.curPlayer]) continue;
						//	roundWin*=(!tData.noBigWin&&pi.winType==WinType.eatGangPut)?3:1;
						//	pj.mjdesc.push( (tData.noBigWin||pi.winType<WinType.eatGangPut)?"点炮":"杠炮");
						//}
						//抢杠   邵阳包三家  转转不包
						if(pi.winType==WinType.eatGang)
						{
							if(pj.uid!=tData.uids[tData.curPlayer]) continue;
							//roundWin*=tData.noBigWin?1:3;
							//pj.mjdesc.push("杠炮");
							judgeType = 1;
							pi.mjdesc.push("抢杠胡");
						}

						//点杠者包3家  if(pi.winType==WinType.pickGang1){if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;roundWin*=3;}

						//var maFan = 1;
						//var maCount = 0;
						if(pi.winType==WinType.pickGang1){//点杠
							if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
							//switch(majiang.getMaPrice(pi))//上一个点杠的玩家
							//{
							//	case 0:
							//		maCount = 0;
							//		maFan =1;
							//		break;
							//	case 1:
							//		maCount = 1;
							//		maFan *=2;
							//		break;
							//	case 2:
							//		maCount = 2;
							//		maFan *=4;
							//		break;
							//	case 3:
							//		maCount = 3;
							//		maFan *=8;
							//		break;
							//}
							baseWin = maFan * 3 ;
							judgeType = 1;
							isGangShangHua = true;
						}
						else
						{
							//switch(majiang.getMaPrice(pi))
							//{
							//	case 0:
							//		maCount = 0;
							//		maFan =1;
							//		break;
							//	case 1:
							//		maFan *=2;
							//		maCount = 1;
							//		break;
							//	case 2:
							//		maFan *=4;
							//		maCount = 2;
							//		break;
							//	case 3:
							//		maFan *=8;
							//		maCount = 3;
							//		break;
							//}
							baseWin = maFan;
						}

						pi.winone+=roundWin*baseWin;
						pj.winone-=roundWin*baseWin;
					}
					if(isGangShangHua){
						pi.mjdesc.push("杠上花");
					}

					pi.baseWin=baseWin;
					if(maFan != 1) pi.mjdesc.push("买马X"+ maCount);
					if(judgeType == 0)
					{
						pi.mjdesc.push("平胡");
					}
				}
			}
		}			
		else
		{	
	        tData.winner=-1;
	    }
		
		tData.tState=TableState.roundFinish;
		var owner=tb.players[tData.uids[0]].info;
		if(!byEndRoom)
		{
			if(!owner.$inc)
			{
				owner.$inc={money:-tb.createPara.money};
			}
		}
		tb.AllPlayerRun(function(p)
		{
			p.winall+=p.winone;
			
		});
		tData.roundNum--;
		
		var roundEnd={players:tb.collectPlayer('mjhand','mjdesc','winone','winall','winType','baseWin','mjMa','left4Ma'),tData:app.CopyPtys(tData)};
        tb.mjlog.push("roundEnd",roundEnd);//一局结束
		var playInfo=null;
	    if(tData.roundNum==0) playInfo=EndRoom(tb);//结束
		if(playInfo) roundEnd.playInfo=playInfo;
		tb.NotifyAll("roundEnd",roundEnd);
		
	}
	
	//Table.prototype.GamePause=function(){return  this.PlayerCount()!=4 || this.tData.delEnd!=0 || !this.AllPlayerCheck(function(pl){ return pl.onLine; });}
	Table.prototype.MJTick=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJTick");
		next(null,null);
		var rtn={serverNow:Date.now()};
		pl.mjTickAt=rtn.serverNow;	pl.tickType=msg.tickType;
		rtn.players=this.PlayerPtys( function(p){ return {mjTickAt:p.mjTickAt,tickType:p.tickType}  });
		this.NotifyAll("MJTick",rtn);
	}
	Table.prototype.MJPut=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJPut");
		next(null,null);  //if(this.GamePause()) return;
		var tData=this.tData;
		if(tData.tState==TableState.waitPut&&pl.uid==tData.uids[tData.curPlayer])
		{
			var cdIdx=pl.mjhand.indexOf(msg.card);
			if(cdIdx>=0)
			{
				pl.mjhand.splice(cdIdx,1);
				pl.mjput.push(msg.card);
				pl.skipHu=false;
				msg.uid=pl.uid;
				tData.lastPut=msg.card;
				tData.lastPutPlayer=tData.curPlayer;
				tData.tState=TableState.waitEat;
				pl.mjState=TableState.waitCard;
				pl.eatFlag=0;//自己不能吃
                
				if(tData.putType>0&&tData.putType<4) tData.putType=4;	else tData.putType=0;
				
				this.AllPlayerRun(function(p)
				{ 
				    if(p!=pl)
					{	
				       p.eatFlag=GetEatFlag(p,tData);
				       if(p.eatFlag!=0) p.mjState=TableState.waitEat;
					   else p.mjState=TableState.waitCard;
				    }
				});
				var cmd=msg.cmd; delete msg.cmd;
				msg.putType=tData.putType;
				this.NotifyAll(cmd,msg);
				this.mjlog.push(cmd,msg);//打牌
				SendNewCard(this);//打牌后尝试发牌
			}
		}
		
	}
	//发牌不要求在线
	function SendNewCard(tb)
	{
		GLog("function SendNewCard");
		var tData=tb.tData;
		var cards=tb.cards;
		var callNum = 0;
		if(tb.AllPlayerCheck(function(pl){ return pl.mjState==TableState.waitCard}))
		{
			if(tData.cardNext<cards.length-4)
			{
				var newCard=cards[tData.cardNext++];
				if(tData.putType==0||tData.putType==4)tData.curPlayer=(tData.curPlayer+1)%4;
				var uid=tData.uids[tData.curPlayer];
				pl=tb.getPlayer(uid);
				pl.mjhand.push(newCard);
				pl.isNew=true;
				tData.tState=TableState.waitPut;
				tb.AllPlayerRun(function(pl){ pl.mjState=TableState.waitPut; pl.eatFlag=0; });
				if(pl.onLine)pl.notify("newCard",newCard);
				tb.NotifyAll("waitPut",tData);
				pl.picknum++;
				tb.mjlog.push("newCard",app.CopyPtys(tData));//发牌

				return true;
			}
			else//没有牌了 
			{
				callNum++;
				if(callNum == 1){
					//for(var i=0;i<4;i++){
					//	pl.left4Ma.push(cards[tData.cardNext+i]);
					//}
				}
				EndGame(tb,null);
			}
		}
		return false;
	}
	
	Table.prototype.TryNewCard=function(){
		GLog("function TryNewCard");
		SendNewCard(this);
	}
	
	function EndRoom(tb,msg)
	{
		GLog("function EndRoom");
		var playInfo=null;
		if(tb.tData.roundNum>-2)
		{
			if(tb.tData.roundNum!=tb.createPara.round)
			{
				logid++;
				var playid=app.serverId+"_"+logid;
				var endTime=new Date();
				var nowStr=endTime.Format("yyyy-MM-dd hh:mm:ss");
				var tableName=endTime.Format("yyyy-MM-dd");
				var tData=tb.tData;
				playInfo={owner:tData.owner,money:tb.createPara.money,now:nowStr,tableid:tb.tableid,logid:playid,players:[]};
				tb.AllPlayerRun(function(p)
				{
					var pinfo={};
					pinfo.uid=p.uid;
					pinfo.winall=p.winall;
					pinfo.nickname=p.info.nickname||p.info.name;
					pinfo.money=p.info.money;
					playInfo.players.push(pinfo);
				});
				tb.AllPlayerRun(function(p)
				{
					var table="majiangLog";
					app.mdb.db.collection("majiangLog").update({_id:p.uid},
					{$push:{logs:{$each:[playInfo],$slice: -50}}},{upsert:true}, function(er,doc)
					{
					});
					
					/*
					app.mdb.findOne(table,{_id:p.uid},function(er,doc){
						
						if(doc)
						{
							app.mdb.update(table,{_id:p.uid},{logs:{
								$each:[playInfo],$slice: -50
							}},"$push");
						}
						else
						{
							app.mdb.insert(table,{_id:p.uid,uid:p.uid,logs:[playInfo]},function(){});
						}
					});
					*/
					
					
				});
				
				//统计场数
				var dayID=parseInt(endTime.Format("yyyyMMdd"));
			    var inc={};	inc[tData.roundAll+"_"+(tData.noBigWin?"z":"s")+"_c"+(tData.canEat?1:0)+"_f"+(tData.withWind?1:0)+"_p"+(tData.canEatHu?1:0)]=1;
				app.mdb.db.collection("dayLog").update({_id:dayID},{$inc:inc},{upsert:true}, function(er,doc)
				{
					
				});
				//合并回放
				if(!app.mjlogs) app.mjlogs={array:[],tableName:tableName};
				if(app.mjlogs.tableName!=tableName||app.mjlogs.array.length>=10)
				{
					app.mdb.db.collection(app.mjlogs.tableName).insertMany(app.mjlogs.array,function(er,doc){});
					app.mjlogs.array=[]; app.mjlogs.tableName=tableName;
				}
				app.mjlogs.array.push({logid:playid, endTime:endTime,mjlog:tb.mjlog});
			}
			
			if(msg)
			{	
		       if(playInfo) msg.playInfo=playInfo;
			   msg.showEnd=tb.tData.roundNum!=tb.createPara.round;
		       tb.NotifyAll("endRoom",msg);	
		    }
			
			
			tb.SetTimer();
			tb.tData.roundNum=-2;

			DestroyTable(tb);
			var uid2did=tb.uid2did;
			var uids={};
			for(var uid in uid2did)
			{
				var did=uid2did[uid];
				var ids=uids[did];
                if(!ids)uids[did]=ids=[];
                ids.push(uid);				
			}
			for(var did in uids)
			{
				var ids=uids[did];
				app.rpc.pkplayer.Rpc.endVipTable(did,{uids:ids,tableid:tb.tableid},function(){});
			}		
			
			
			

			
			
		}
		return playInfo;
	}
	function RoomEnd(tb,msg)
	{
		GLog("function RoomEnd");
		if(    tb.tData.tState==TableState.waitPut
		     ||tb.tData.tState==TableState.waitEat
		     ||tb.tData.tState==TableState.waitCard
		){
			tb.tData.roundNum=1;
			EndGame(tb,null,true);
		}
		else EndRoom(tb,msg);
	}
	
    Table.prototype.EndTable=function()
	{
		GLog("function EndTable");
		EndRoom(this,{reason:0});
	}
	Table.prototype.MJPass=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJPass");
		next(null,null); //if(this.GamePause()) return;
		var tData=this.tData;
		if(tData.tState==TableState.waitEat&&pl.mjState==TableState.waitEat)
		{
			if( pl.eatFlag==msg.eatFlag && this.CheckPlayerCount(function(p){ return p!=pl&&p.eatFlag>msg.eatFlag })==0)
			{
				this.mjlog.push("MJPass",{uid:pl.uid,eatFlag:msg.eatFlag});//发牌
				pl.mjState=TableState.waitCard;
				if(pl.eatFlag>=8) pl.skipHu=true;
				pl.eatFlag=0;
				if(!SendNewCard(this)) //过后尝试发牌
				pl.notify("MJPass",{mjState:pl.mjState});
			}
		}
		else if(tData.tState==TableState.roundFinish&&pl.mjState==TableState.roundFinish)
		{
			pl.mjState=TableState.isReady;
			this.NotifyAll('onlinePlayer',{uid:pl.uid,onLine:true,mjState:pl.mjState});
			pl.eatFlag=0;
			this.startGame();
	    }
		
	}
	
	
	
	Table.prototype.MJChi=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJChi");
		next(null,null); //if(this.GamePause()) return;
		var tData=this.tData;
		if(  
		     tData.canEat
		   &&tData.tState==TableState.waitEat
		   &&pl.mjState==TableState.waitEat
		   &&tData.uids[tData.curPlayer]!=pl.uid
		   &&tData.uids[(tData.curPlayer+1)%4]==pl.uid//下家限制
		)
		{
			//此处必须保证没有其他玩家想 胡牌 碰牌 杠牌
			if(this.AllPlayerCheck(function(p){ if(p==pl) return true; return p.eatFlag==0; }))
			{
				var cd0=tData.lastPut;	var cd1=tData.lastPut;
				if(msg.pos==0)      {cd0+=1; cd1+=2;}
				else if(msg.pos==1) {cd0-=1; cd1+=1;}
				else {cd0-=2; cd1-=1;}
				var hand=pl.mjhand;
                var idx0=hand.indexOf(cd0);
                var idx1=hand.indexOf(cd1);
				if(idx0>=0&&idx1>=0)
				{
					hand.splice(idx0,1);
					idx1=hand.indexOf(cd1);
					hand.splice(idx1,1);
					pl.mjchi.push(cd0);
					pl.mjchi.push(cd1);
					pl.mjchi.push(tData.lastPut);
					pl.isNew=false;
					var eatCards=[cd0,cd1,tData.lastPut];
					var lastPlayer=tData.curPlayer;
					var pPut=this.getPlayer(tData.uids[lastPlayer]);
					pPut.mjput.length=pPut.mjput.length-1;
					
					tData.curPlayer=tData.uids.indexOf(pl.uid);
					tData.tState=TableState.waitPut;
					
					this.AllPlayerRun(function(p){ p.mjState=TableState.waitPut; p.eatFlag=0; });
					
					var chiMsg={mjchi:eatCards,tData:app.CopyPtys(tData),pos:msg.pos,from:lastPlayer,eatFlag:msg.eatFlag};
					this.NotifyAll('MJChi',chiMsg);
					this.mjlog.push("MJChi",chiMsg);//吃
				}
				//else console.error("chi num error");
			}
			else
			{
				//console.error("chi state error");
			}
		}
		else 
		{
			//console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
		}
		
	}
	Table.prototype.MJPeng=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJPeng");
		next(null,null); //if(this.GamePause()) return;
		var tData=this.tData;
		if(  tData.tState==TableState.waitEat
		   &&pl.mjState==TableState.waitEat
		   &&tData.uids[tData.curPlayer]!=pl.uid
		)
		{
			//此处必须保证没有其他玩家想胡牌
			if(this.AllPlayerCheck(function(p){ if(p==pl) return true; return p.eatFlag<8; }))
			{
				var hand=pl.mjhand;
				var matchnum=0;
				for(var i=0;i<hand.length;i++)
				{
					if(hand[i]==tData.lastPut)
					{
						matchnum++;
					}
			    }
				if(matchnum>=2)
				{
					hand.splice(hand.indexOf(tData.lastPut),1);
					hand.splice(hand.indexOf(tData.lastPut),1);
					pl.mjpeng.push(tData.lastPut);
					if(matchnum==3) pl.mjpeng4.push(tData.lastPut);
					pl.isNew=false;
					var lastPlayer=tData.curPlayer;
					var pPut=this.getPlayer(tData.uids[lastPlayer]);
					pPut.mjput.length=pPut.mjput.length-1;
					tData.curPlayer=tData.uids.indexOf(pl.uid);
					this.AllPlayerRun(function(p)
					{ 
					    p.mjState=TableState.waitPut; p.eatFlag=0;
					});
					tData.tState=TableState.waitPut;
					this.NotifyAll('MJPeng',{tData:tData,from:lastPlayer});
					this.mjlog.push('MJPeng',{tData:app.CopyPtys(tData),from:lastPlayer,eatFlag:msg.eatFlag});//碰
				}
				else
				{
					//console.error("peng num error");
				}
			}
			else
			{
				//console.error("peng state error");
			}
		}
		else 
		{
			//console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
		}
		
	}
	Table.prototype.MJGang=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJGang");
		next(null,null); //if(this.GamePause()) return;
		var tData=this.tData;
		if(	
            //最后五张不能杠
		    tData.cardNext<(this.cards.length - 4)
		    &&
			(
			  //吃牌杠
				tData.tState==TableState.waitEat&&pl.mjState==TableState.waitEat&&tData.uids[tData.curPlayer]!=pl.uid
			  //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
			  &&(   /*!tData.canEatHu || */
			      this.AllPlayerCheck(function(p){ if(p==pl) return true; return p.eatFlag<4; }) 
				 )
			  //摸牌杠
			  ||tData.tState==TableState.waitPut&&pl.mjState==TableState.waitPut&&tData.uids[tData.curPlayer]==pl.uid
			)
		)
		{	
		    var hand=pl.mjhand;
			var handNum=0;
		    for(var i=0;i<hand.length;i++)
			{
				if(hand[i]==msg.card)
				{
					handNum++;
				}
			}	
			if(tData.tState==TableState.waitEat&&handNum==3&&tData.lastPut==msg.card)
			{    
		
				var fp=this.getPlayer(tData.uids[tData.curPlayer]);
				var mjput=fp.mjput;
				if(mjput.length>0&&mjput[mjput.length-1]==msg.card)
				{
					mjput.length=mjput.length-1;
				}
				else return;
				
		        pl.mjgang0.push(msg.card);//吃明杠
				pl.gang0uid[msg.card]=tData.curPlayer;
			    hand.splice(hand.indexOf(msg.card),1);
			    hand.splice(hand.indexOf(msg.card),1);
			    hand.splice(hand.indexOf(msg.card),1);
				msg.gang=1;
				msg.from=tData.curPlayer;
                pl.isNew=false;
				
			}
			else if(tData.tState==TableState.waitPut&&handNum==4)
			{
		        pl.mjgang1.push(msg.card);//暗杠
			    hand.splice(hand.indexOf(msg.card),1);
			    hand.splice(hand.indexOf(msg.card),1);
			    hand.splice(hand.indexOf(msg.card),1);
			    hand.splice(hand.indexOf(msg.card),1);
				msg.gang=3;
			}
			else if(tData.tState==TableState.waitPut&&handNum==1&&pl.mjpeng.indexOf(msg.card)>=0&&pl.mjpeng4.indexOf(msg.card)<0)
			{
		        pl.mjgang0.push(msg.card);//自摸明杠
			    hand.splice(hand.indexOf(msg.card),1);
				pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card),1);
				msg.gang=2;
			}
			else return;
			msg.uid=pl.uid;	
			//var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
			var canEatGang=(msg.gang==2);//只抢自摸明杠
			GLog("canEatGang " + canEatGang);
			this.AllPlayerRun(function(p){ 
			    p.mjState=TableState.waitCard; p.eatFlag=0;
				GLog("p!=pl " + (p!=pl) +  "  !p.skipHu" + (!p.skipHu));
				if( canEatGang   && p!=pl && !p.skipHu )
				{
					var hType=GetHuType(tData,p,msg.card);//开杠测试
					GLog("hType" + hType);
                    if(hType>0)//开杠胡
					{
						GLog("tData.canEatHu" + tData.canEatHu + "  msg.gang = " + msg.gang + "   hType = " + hType);
						if(tData.canEatHu)
						{
							if(msg.gang!=3||hType==13)
							{
								p.mjState=TableState.waitEat;p.eatFlag=8;
							}
						}
						else
						{
							if(msg.gang!=3||hType==13)
							{
						        p.mjState=TableState.waitEat;p.eatFlag=8;	   	
							}
						}
					   
					}				
				}	
			});
			this.NotifyAll('MJGang',msg);	
			this.mjlog.push('MJGang',msg);//杠
			if(canEatGang)	
			{
				tData.putType=msg.gang; 
				tData.curPlayer=tData.uids.indexOf(pl.uid);
				tData.lastPut=msg.card;
			}
			else
			{
				tData.putType=0;
				tData.curPlayer=(tData.uids.indexOf(pl.uid)+3)%4;
			}
			tData.tState=TableState.waitEat;
			SendNewCard(this); //杠后尝试补牌
		}
		else 
		{
			//console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
		}
	}
	
	function HighPlayerHu(tb,pl)//此处必须保证没有其他玩家想胡牌,
	{
		GLog("function HighPlayerHu");
		var tData=tb.tData;
		var uids=tData.uids;
		for(var i=(tData.curPlayer+1)%4; uids[i]!=pl.uid; i=(i+1)%4)
		{
			if(tb.players[uids[i]].eatFlag>=8) return true;
		}
		return false;
	}
	
	Table.prototype.MJHu=function(pl,msg,session,next)
	{
		GLog("Table.prototype.MJHu");
		//此处必须保证胡牌顺序
		next(null,null); //if(this.GamePause()) return;	
		var tData=this.tData;
		var uids=this.tData.uids;
		var canEnd=false;
		//自摸胡
		if(  
 		      tData.tState==TableState.waitPut&&pl.mjState==TableState.waitPut&&pl.isNew
			  &&tData.uids[tData.curPlayer]==pl.uid&& GetHuType(tData,pl)>0//自摸测试
		)
		{	
		      //补摸
		      if(tData.putType>0&&tData.putType<4)
			  {
				  if(tData.putType==1)
				  {
					  pl.winType=WinType.pickGang1;
				  }
				  else//自摸杠在补摸
				  {
					  pl.winType=WinType.pickGang23;
				  }
			  }
			  else//自摸
			  {
				  pl.winType=WinType.pickNormal;
			  }
			  canEnd=true;

		}
		//点炮胡 抢杠胡 
		else if(
		           !pl.skipHu
		        && tData.tState==TableState.waitEat&&pl.mjState==TableState.waitEat&&tData.uids[tData.curPlayer]!=pl.uid&& pl.eatFlag>=8
		        &&(tData.putType>0||tData.canEatHu)
				//&&!HighPlayerHu(this,pl) 邵阳麻将可以多家胡
			)
	    {
			 if(tData.tState==TableState.waitEat) 
			 { 
		        var fp=this.getPlayer(tData.uids[tData.curPlayer]);
				var winType=null;
				var mjput=null;
				if(tData.putType==0)
				{
					winType=WinType.eatPut;
					mjput=fp.mjput;
				}
				else if(tData.putType==4)
				{
					winType=WinType.eatGangPut;
					mjput=fp.mjput;
				}
				else //抢杠包3家
				{
					winType=WinType.eatGang;
					if(tData.putType==3) mjput=fp.mjgang1;
					else mjput=fp.mjgang0;
				}
				if(mjput.length>0&&mjput[mjput.length-1]==tData.lastPut)
				{
					mjput.length=mjput.length-1;
				}
				else return;
                //一炮多响
				this.AllPlayerRun(function(p){ 
				    if(p.mjState==TableState.waitEat&&p.eatFlag>=8)
					{
						p.mjhand.push(tData.lastPut);
						p.winType=winType;
					}
				});
				canEnd=true;
		     }
		}
		if(canEnd){
			this.mjlog.push("MJHu",{uid:pl.uid,eatFlag:msg.eatFlag});
			EndGame(this,pl);
		}
		else 
		{
			if(!app.huError) app.huError=[];
			app.FileWork(app.huError,app.serverId+"huError.txt",
		     tData.tState+" "+pl.mjState+" "+pl.isNew  +" "+tData.uids[tData.curPlayer]+" "+pl.uid+" "+pl.huType
			);
		}
		
	}
	Table.prototype.DelRoom=function(pl,msg,session,next)
	{
		GLog("Table.prototype.DelRoom");
		next(null,null);
		var table=this;
		var tData=this.tData;
		if(pl.delRoom==0)
		{
			var yesuid=[];
			var nouid=[];
			if(msg.yes)
			{
				if(this.PlayerCount()<4)
				{
					RoomEnd(this,{reason:0});return;//人数不足
				}
				pl.delRoom=1;
				if(tData.delEnd==0)
				{
					tData.delEnd=Date.now()+5*60000;
					tData.firstDel=pl.uid;
					this.SetTimer
					( 
					   5*60000,function()	
					   {
						   if(tData.delEnd!=0) RoomEnd(table,{reason:1});//超时
					   }
					);   
				}
				//包括发起人3个以上同意结束房间
				else if(this.CheckPlayerCount(function(p){ if(p.delRoom>0){ yesuid.push(p.uid);   return true;} return false; })>=3)
				{
					RoomEnd(this,{reason:2,yesuid:yesuid});return; //同意
				}
			}
			else 
			{
				pl.delRoom=-1;
				//2个以上不同意结束房间
				if(this.CheckPlayerCount(function(p){ if(p.delRoom<0){ nouid.push(p.uid); return true;} return false;  })>=1)
				{
					tData.delEnd=0;
					tData.firstDel=-1;
					this.SetTimer();   
					this.AllPlayerRun(function(p){p.delRoom=0;});
				}
			}
			this.NotifyAll("DelRoom",{players:this.collectPlayer("delRoom"),tData:tData,nouid:nouid});
			
		}
	}
	
	
}