var TableState =
{
	waitJoin:1,
	waitReady:2,
	waitPut:3,
	waitEat:4,
	waitCard:5,
	roundFinish:6,
	isReady:7
};

//图片提示
var ActionType =
{
	CHI:1,
	PENG:2,
	GANG:3,
	LIANG:4,
	HU:5,
	GUO:6
};

function ShowEatActionAnim(node,actType,off)
{
	if(off==0)
        return;

 	var eatNode = node.getChildByName("effectStateAct");
	var childActionNode = null;
	var callback=function ()
    {
		childActionNode.visible=false;
	};

	switch(actType)
	{
		case ActionType.CHI:
			childActionNode=eatNode.getChildByName("ef_chi");
			childActionNode.visible=true;
			childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
			break;
		case ActionType.GANG:
			childActionNode=eatNode.getChildByName("ef_gang");
			childActionNode.visible=true;
			childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
			break;
		case ActionType.PENG:
			childActionNode=eatNode.getChildByName("ef_peng");
			childActionNode.visible=true;
			childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
			break;
		case ActionType.LIANG:
			// childActionNode=eatNode.getChildByName("ef_chi");;
		case ActionType.HU:
			childActionNode=eatNode.getChildByName("ef_hu");
			childActionNode.visible=true;
			childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
			break;
		default:
            break;
	}

}

function SelfUid()
{
    return jsclient.data.pinfo.uid
}

function IsMyTurn()
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	return SelfUid() == tData.uids[tData.curPlayer];
}

function PutAwayCard(cdui,cd)
{
	var children = cdui.parent.children;
	var mjhandNum = 0;
	var standUI = cdui.parent.getChildByName("stand");
	for (var i = 0; i < children.length; i++) 
	{
		if(children[i].name=="mjhand") 
		{
			if(children[i].y > standUI.y + 10)
                children[i].y = standUI.y;
			mjhandNum++;
		}	
    }

	var pl=getUIPlayer(0);
	if(mjhandNum == pl.mjhand.length)
	{
		jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJPut",card:cd});
		jsclient.lastPutPos={x:cdui.x,y:cdui.y};
		//if(newCard) newCard.isnewCard=false;
	    HandleMJPut(cdui.parent,{uid:SelfUid(), card:cd},0);
	}
}


function getEatFlag()
{
	var eat = jsclient.playui.jsBind.eat;
	var eatFlag = 0;

	if (eat.gang0._node.visible)
        eatFlag=eatFlag+4  ;

 	if(eat.hu._node.visible)
        eatFlag=eatFlag+8 ;

	if(eat.chi0._node.visible)
        eatFlag=eatFlag+1;

	if(eat.peng._node.visible)
        eatFlag=eatFlag+2 ;

	return eatFlag;
}

//过胡
jsclient.MJPass2Net = function()
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	if(IsMyTurn()&&tData.tState==TableState.waitPut)
	{
		var eat=jsclient.playui.jsBind.eat;
		var msg="确认过";
		if(eat.gang0._node.visible) msg+=" 杠 ";
		if(eat.hu._node.visible)    msg+=" 胡 ";
		jsclient.showMsg(msg+"吗?",function()
        {
			eat.gang0._node.visible=false;
			eat.hu._node.visible=false;
			eat.guo._node.visible=false;
		},function(){},"1");
	}
	else
	{
		if(jsclient.playui.jsBind.eat.hu._node.visible)
			jsclient.showMsg("确认不胡吗?",ConfirmMJPass,function(){},"1");
		else
            ConfirmMJPass();
	}
}

function MJGang2Net(cd)
{
    jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJGang",card:cd,eatFlag:getEatFlag()});
}

function MJChi2Net(pos)
{
    jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJChi",pos:pos,eatFlag:getEatFlag()});
}

function MJHu2Net()
{
    jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJHu",eatFlag:getEatFlag()});
}

function MJPeng2Net()
{
    jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJPeng",eatFlag:getEatFlag()});
}

function ConfirmMJPass()
{
    var pl=getUIPlayer(0);
    if(jsclient.playui.jsBind.eat.hu._node.visible)
    {
        pl.skipHu=true;
    }
    jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJPass",eatFlag:getEatFlag()});
}

function ShowMjChiCard(node, off)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	    
	if (off == 0) 
	{
		var card1 = node.getChildByName("card1");
		var card2 = node.getChildByName("card2");
		var card3 = node.getChildByName("card3");
		card1.visible = true;
		card2.visible = true;
		card3.visible = true;
		setCardPic(card1,tData.lastPut,0);
		setCardPic(card2,tData.lastPut+1,0);
		setCardPic(card3,tData.lastPut+2,0);

	}
    else if (off == 1)
	{
		var card1 = node.getChildByName("card4");
		var card2 = node.getChildByName("card5");
		var card3 = node.getChildByName("card6");
		card1.visible = true;
		card2.visible = true;
		card3.visible = true;
		setCardPic(card1,tData.lastPut-1,0);
		setCardPic(card2,tData.lastPut,0);
		setCardPic(card3,tData.lastPut+1,0);
	}
    else if (off == 2)
	{
		var card1 = node.getChildByName("card7");
		var card2 = node.getChildByName("card8");
		var card3 = node.getChildByName("card9");
		card1.visible = true;
		card2.visible = true;
		card3.visible = true;
		setCardPic(card1,tData.lastPut-2,0);
		setCardPic(card2,tData.lastPut-1,0);
		setCardPic(card3,tData.lastPut,0);
	}
}

function CheckChangeuiVisible()
{
	jsclient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
}

function ShowSkipHu()
{
	var jsonui = ccs.load("res/SkipHu.json");
	doLayout(jsonui.node.getChildByName("Image_1"),[0.2,0.2],[0.5,0.3],[0,0] );
	jsclient.Scene.addChild(jsonui.node);
	jsonui.node.runAction(cc.sequence(cc.delayTime(2),cc.removeSelf()));
}

//
function CheckEatVisible(eat)
{
	CheckChangeuiVisible();
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var leftCard=(tData.withWind?136:108)-tData.cardNext;
	eat.chi0._node.visible=false;
	eat.chi1._node.visible=false;
	eat.chi2._node.visible=false;
	eat.peng._node.visible=false;
	eat.gang0._node.visible=false;
	eat.gang1._node.visible=false;
	eat.gang2._node.visible=false;
	eat.hu._node.visible=false;
	eat.guo._node.visible=false;
	var pl=sData.players[SelfUid()+""];
	if(pl.mjState==TableState.waitEat || pl.mjState==TableState.waitPut&&tData.uids[tData.curPlayer]==SelfUid())
    {

	 }
	 else
        return;

	jsclient.gangCards = [];
	jsclient.eatpos = [];
	var mj=jsclient.majiang;
	var vnode=[];
	//gang hu put
    if(tData.tState==TableState.waitPut&&pl.mjState==TableState.waitPut)
    {
		if(IsMyTurn())
        {
			if(pl.isNew && mj.canHu(!tData.canHu7,pl.mjhand,0,tData.canHuWith258,tData.withZhong)>0)
			 {
				 vnode.push(eat.hu._node);
			 }
			 var rtn=leftCard>0?mj.canGang1(pl.mjpeng,pl.mjhand,pl.mjpeng4):[];
			 if(rtn.length>0)
			 {
			 	jsclient.gangCards=rtn;
			 	if (jsclient.gangCards==1) 
			 	{
			 		eat.gang0.bgground.visible =true;
			 		eat.gang0.card1._node.visible =true;
			 		setCardPic(eat.gang0.card1._node,jsclient.gangCards[0],0);
			 	}else
			 	{
			 		eat.gang0.bgground.visible =false;
			 		eat.gang0.card1._node.visible =false;
			 	}
			 	vnode.push(eat.gang0._node);
			 }

			 if(vnode.length>0)
                 vnode.push(eat.guo._node);
		}
	}
    else if(tData.tState==TableState.waitEat)
    {
		if(!IsMyTurn())
        {
            var huType=mj.canHu(!tData.canHu7,pl.mjhand,tData.lastPut,
				tData.canHuWith258,tData.withZhong);
			if(huType>0)
			{
				var canHu=false;
				if( (tData.putType==0&&tData.canEatHu) || tData.putType==4 )
				{
					canHu=true;
				}
				else if(tData.putType>0&&tData.putType<4)
				{
                    if(tData.canEatHu)
                    {
                        if(tData.putType!=3||huType==13)
                        {
                            canHu=true;
                        }
                    }
                    else
                    {
                        if( tData.putType!=3||huType==13)
                        {
                            canHu=true;
                        }
                    }
				}
				if(canHu) 
				{
					if(pl.skipHu)
                        ShowSkipHu();
					else
                        vnode.push(eat.hu._node);
				}
			}

			if((tData.putType==0||tData.putType==4))
			{

				if(leftCard>0&&mj.canGang0(pl.mjhand,tData.lastPut))
				{
					vnode.push(eat.gang0._node);
					jsclient.gangCards=[tData.lastPut];
					eat.gang0.bgground.visible =true;
			 		eat.gang0.card1._node.visible =true;
			 		setCardPic(eat.gang0.card1._node,jsclient.gangCards[0],0);
				}
				if((leftCard>4||tData.noBigWin)&&mj.canPeng(pl.mjhand,tData.lastPut))
				{
					vnode.push(eat.peng._node);
				}

				if((leftCard>4||tData.noBigWin)&&tData.canEat && tData.uids[(tData.curPlayer+1)%4]==SelfUid())
				{
					var eatpos=mj.canChi(pl.mjhand,tData.lastPut);

					jsclient.eatpos = eatpos;
					
					if(eatpos.length>0)
					{
						 vnode.push(eat.chi0._node);
					}
				}
			}

			if(vnode.length>0)
                vnode.push(eat.guo._node);
			else
                getUIPlayer(0).mjState=TableState.waitCard;
		}
	}
	
	var btnImgs=
    {
		"peng":["res/play-yli/btn_peng_normal.png","res/play-yli/btn_peng_press.png"],
		"gang0":["res/play-yli/btn_gang_normal.png","res/play-yli/btn_gang_press.png"],
		"chi0":["res/play-yli/btn_chi_normal.png","res/png/play-yli/btn_chi_press.png"],
	}
	
    for(var i=0;i<vnode.length;i++) {
    	vnode[i].visible=true;
    	if(vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
    	if(vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
		if(vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
		var btnName=vnode[i].name;
		
		
		if(btnName=="peng"||btnName=="chi0"||btnName=="gang0")
		{
			vnode[i].loadTextureNormal(btnImgs[btnName][0]);
			vnode[i].loadTexturePressed(btnImgs[btnName][1]);
		}
		
    	if (i ==0) 
    	{
	        var cardVal=0;
			
			if(vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;
			
			if(btnName=="peng"||btnName=="chi0"||btnName=="gang0")
			{
				vnode[i].loadTextureNormal(btnImgs[btnName][0]);
				vnode[i].loadTexturePressed(btnImgs[btnName][1]);
			}
			if(btnName=="peng")
			{
				cardVal=tData.lastPut;
			}
	        else if(btnName=="chi0")
			{
				if(jsclient.eatpos.length==1) cardVal=tData.lastPut;
			}
			else if(btnName=="gang0")
			{
				if(jsclient.gangCards.length==1)cardVal=jsclient.gangCards[0];
			}
			else if(btnName=="hu")
			{
				if(IsMyTurn()) cardVal=pl.mjhand[pl.mjhand.length-1];
				else  cardVal=tData.lastPut;
			}
			if(cardVal&&cardVal>0)
			{
				setCardPic(vnode[0].getChildByName("card1"), cardVal,0);
				vnode[0].getChildByName("card1").visible = true;
			}
			vnode[0].getChildByName("bgground").zIndex = -1;
		    vnode[0].getChildByName("bgground").visible = true;
					
    	}
		doLayout(vnode[i],[0,0.12],[0.5,0],[  (1-vnode.length) / 2.0 + i*1.7,2.5],false,false);
    }	
}

function SetPlayerVisible(node,off)
{
	var pl=getUIPlayer(off);
	var head = node.getChildByName("head");
	var name= head.getChildByName("name");
	var moneybk= head.getChildByName("moneybk");
	var offline= head.getChildByName("offline");
	var coin= head.getChildByName("coin");
	var nobody = head.getChildByName("nobody");

	if(pl)
	{
		name.visible =true;
		moneybk.visible =false;
		offline.visible =true;
		coin.visible =true;
		nobody.visible = false;

		jsclient.loadWxHead(pl.info.headimgurl, head, 64,62,0.2,1,"WxHead",1001);

		setOffline(node,off); 
		InitPlayerHandUI(node,off);
	}
	else
	{
		name.visible =false;
		moneybk.visible =false;
		offline.visible =false;
		coin.visible =false;
		nobody.visible = true;

		var WxHead = head.getChildByTag(1001);
		if(WxHead)
		{
			log("删除玩家...");
			WxHead.removeFromParent(true);
		}

	}
}

function CheckInviteVisible()
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	if(TableState.waitJoin==tData.tState)
	{
		return Object.keys(sData.players).length<4;
	}
	else
	{
		return false;
	}
}

function CheckArrowVisible()
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;

	if(TableState.waitPut==tData.tState || TableState.waitEat==tData.tState || TableState.waitCard==tData.tState)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function clearCardUI(node)
{
	mylog("clearCardUI");
	var children=node.children;
	for(var i=0;i<children.length;i++)
	{
		var ni=children[i];
		if(ni.getName()!="effectStateAct"&&ni.name!="head"&&ni.name!="up"&&ni.name!="down"&&ni.name!="stand"&&ni.name!="out0"&&ni.name!="out1"&&ni.getName()!="ready")
		{
			cc.log("delete ------------"+ni.name);
			ni.removeFromParent(true);
		}
	}
}

function HandleNewCard(node,msg,off)
{
	AddNewCard(node,"stand","mjhand",msg,off);
	RestoreCardLayout(node,0);
}

function HandleWaitPut(node,msg,off)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=(uids.indexOf(SelfUid())+off)%4;
	if( tData.curPlayer==selfIndex)
	{
		AddNewCard(node,"stand","standPri",0,off);
		RestoreCardLayout(node,off);
	}
}

function HandleMJChi(node,msg,off)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=(uids.indexOf(SelfUid())+off)%4;
	if( tData.curPlayer==selfIndex)
	{
		var fromOff=[];
		var fromBind=GetUIBind(msg.from,fromOff);
		var fnode=fromBind._node;
		ShowEatActionAnim(node,ActionType.CHI,off);
		RemoveNewOutCard(fnode);
		
		var cds=msg.mjchi;
		for(var i=0;i<cds.length;i++)
		{
			AddNewCard(node,"up","chi",cds[i],off);
			if(off==0 && cds[i]!=tData.lastPut)
                RemoveBackNode(node,"mjhand",1,cds[i]);
		}
		//删掉俩张stand
		if(off==3)
            RemoveBackNode(node,"standPri",2);
		else if(off!=0)
            RemoveFrontNode(node,"standPri",2);

		RestoreCardLayout(node,off);
		RestoreCardLayout(fnode,fromOff[0]);
	}
}

function HandleMJPeng(node,msg,off)
{
	mylog("off:"+off+"---msg:"+msg);
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=(uids.indexOf(SelfUid())+off)%4;
	if( tData.curPlayer==selfIndex)
	{
		var fromOff=[];
		var fromBind=GetUIBind(msg.from,fromOff);
		var fnode=fromBind._node;
		ShowEatActionAnim(node,ActionType.PENG,off);
		RemoveNewOutCard(fnode);
		for(var i=0;i<3;i++)
		{
			AddNewCard(node,"up","peng",tData.lastPut,off);
		}
		//删掉俩张stand
		if(off==0)
            RemoveBackNode(node,"mjhand",2,tData.lastPut);
		else if(off==3)
            RemoveBackNode(node,"standPri",2);
		else
            RemoveFrontNode(node,"standPri",2);

		RestoreCardLayout(node,off);
		RestoreCardLayout(fnode,fromOff[0]);
	}
}
function RemoveFrontNode(node,name,num,tag)
{
	var children=node.children;

	
	for(var i=0;i<children.length&&num>0;i++)
	{
		var ci=children[i];
		
		
		if(ci.name==name&&(!(tag>0)||ci.tag==tag))
		{
			ci.removeFromParent(true);
			num--;
		}
	}
	
	if(num!=0) mylog(node.name+" RemoveFrontNode fail "+name+" "+tag);
}

function RemoveNewOutCard(node)
{
	var children=node.children;
	for (var i = 0; i < children.length; i++)
    {
        var ci=children[i];
        if (ci.name == "newout")
        {
            ci.removeFromParent(true);
        }
	}
}

function RemoveBackNode(node,name,num,tag)
{
	var children =node.children;
	for(var i=children.length-1;i>=0&&num>0;i--)
	{
		var ci=children[i];
		if(ci.name==name&&(!(tag>0)||ci.tag==tag))
		{
			ci.removeFromParent(true);
			num--;
		}
	}
	if(num!=0)
        mylog(node.name+" RemoveBackNode fail "+name+" "+tag);
}

//父节点  需要克隆的子节点  子节点的新名字  值
function AddNewCard(node,copy,name,tag,off,specialTAG)
{
	var cpnode = node.getChildByName(copy);
	var cp = cpnode.clone();
	cp.visible = true;
    cp.name = name;

    if(copy == "stand" && off == 1)
    {
        cp.setFlippedX(true)
    }

    if(specialTAG == "isgang4")
	{
		cp.isgang4 = true;
	}

	node.addChild(cp);
	if(tag > 0)
	{
        //如果牌有值 就赋值 如果是手牌
		setCardPic(cp,tag,name == "mjhand" ? 4 : off);
		if(name == "mjhand")
		{
			SetCardTouchHandler(cpnode,cp);
		}
	}
	return cp;
}

function GetUIBind(uidPos,offStore)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=uids.indexOf(SelfUid());
	var uiOff=(uidPos+4-selfIndex)%4;

	if(offStore)
        offStore.push(uiOff);

	var jsBind=jsclient.playui.jsBind;
	var ui=[jsBind.down,jsBind.right,jsBind.top,jsBind.left];
	return ui[uiOff];
}

function HandleMJGang(node,msg,off)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=(uids.indexOf(SelfUid())+off)%4;
	if( uids[selfIndex]!=msg.uid) return;
	
	if(msg.gang==1)
	{
		var fromOff=[];
		var fromBind=GetUIBind(msg.from,fromOff);
		var fnode=fromBind._node;
		RemoveNewOutCard(fnode);
		if(off==0)
            RemoveBackNode(node,"mjhand",3,msg.card);
		RestoreCardLayout(fnode,fromOff[0]);
	}
	else if(msg.gang==2)
	{
		RemoveBackNode(node,"peng",3,msg.card);
		if(off==0)
            RemoveBackNode(node,"mjhand",1,msg.card);
	}
	else if(msg.gang==3)
	{
		if(off==0)
            RemoveBackNode(node,"mjhand",4,msg.card);
	}
	if(off!=0)
	{
		if(off==3) 
		{
			if (msg.gang == 1)
			{
                var fromOff=[];
                var fromBind=GetUIBind(msg.from,fromOff);
                var fnode=fromBind._node;
                ShowEatActionAnim(node,ActionType.GANG,off);
                RemoveNewOutCard(fnode);
                RemoveBackNode(node,"standPri",3);
			}
            else if (msg.gang == 2)
			{
				RemoveBackNode(node,"peng",3,msg.card);
				RemoveBackNode(node,"standPri",1);
			}
            else if (msg.gang == 3)
			{
				RemoveBackNode(node,"standPri",4);
			}
		}
        else
        {
			if (msg.gang == 1)
			{
                var fromOff=[];
                var fromBind=GetUIBind(msg.from,fromOff);
                var fnode=fromBind._node;
                ShowEatActionAnim(node,ActionType.GANG,off);
                RemoveNewOutCard(fnode);
                RemoveFrontNode(node,"standPri",3);
			}
            else if (msg.gang == 2)
			{
				RemoveFrontNode(node,"peng",3,msg.card);
				RemoveFrontNode(node,"standPri",1);
			}
            else if (msg.gang == 3)
			{
				RemoveFrontNode(node,"standPri",4);
			}
		}       
	}
	for(var i=0;i<4;i++)
	{
		if (msg.gang==3) 
		{
			if (i==3) 
			{
				AddNewCard(node,"down","gang1",0,off,"isgang4").tag = msg.card;
			}
            else
			{
				AddNewCard(node,"up","gang1",msg.card,off);
			}
		}
        else
		{
			if (i==3) 
			{
				AddNewCard(node,"up","gang0",msg.card,off,"isgang4").tag = msg.card;
			}
            else
			{
				AddNewCard(node,"up","gang0",msg.card,off);
			}
		}
	}

    RestoreCardLayout(node,off);

}

function TagOrder(na,nb)
{
    return na.tag-nb.tag;
}

function RestoreCardLayout(node,off,endonepl)
{
	var newC=null;
    var newVal=0;
    var pl ;
    if (endonepl) 
    {
    	pl = endonepl;
    }
    else
    {
    	pl =getUIPlayer(off);
    }
   	var mjhandNum = 0;
   	var children=node.children;
	for (var i = 0; i < children.length; i++)
    {
		var ci = children[i];
		if(ci.name=="mjhand")
		{
            mjhandNum++;
		}
	}
    if(pl.mjhand&&pl.mjhand.length>0)
    {
    	var count  = jsclient.majiang.CardCount(pl);
    	
    	if (count == 14&&mjhandNum ==pl.mjhand.length ) 
    	{
    		if(pl.isNew||endonepl)
    	    	newVal = pl.mjhand[pl.mjhand.length-1];
            else
                newVal=Math.max.apply(null,pl.mjhand);
    	}
    }

	var up=node.getChildByName("up");
	var stand=node.getChildByName("stand");
	var start,offui;
	switch(off)
	{
		case 0: start=up;    offui=stand;    break;
		case 1: start=stand; offui=up;       break;
		case 2: start=stand; offui=up;       break;
		case 3: start=up;    offui=up;       break;
	}
	var upSize=offui.getSize();
	var upS=offui.scale;
	//mjhand standPri out chi peng gang0 gang1
	var uipeng=[]; 
	var uigang0=[];
	var uigang1=[];
	var uichi=[]; 
	var uistand=[];

    for(var i=0;i<children.length;i++)
	{
		var ci=children[i];
		if(ci.name=="mjhand")
		{
			if(newC==null&&newVal==ci.tag)
			{
				newC=ci;
			}
			else
                uistand.push(ci);
		}
		else if(ci.name=="standPri")
		{
			uistand.push(ci);
		}
		else if(ci.name=="gang0")
		{
			uigang0.push(ci);
		}
		else if(ci.name=="gang1")
		{
			uigang1.push(ci);
		}
		else if(ci.name=="chi")
		{
			uichi.push(ci);
		}
		else if(ci.name=="peng")
		{
			uipeng.push(ci);
		}
		/*
		**去掉旧牌的特殊标签
		*/
	}
	uipeng.sort(TagOrder); 
	uigang0.sort(TagOrder); 
	uigang1.sort(TagOrder); 
	uichi.sort(TagOrder);  
	uistand.sort(TagOrder); 
	
	if(newC)
	{ 
       uistand.push(newC);
	 
    }
	var uiOrder=[uigang1,uigang0,uipeng,uichi,uistand];
	if(off==1||off==2) uiOrder.reverse();
	var orders=[];
	for(var j=0;j<uiOrder.length;j++)
	{
		var uis=uiOrder[j];
		for(var i=0;i<uis.length;i++)  orders.push(uis[i]);
	}
	var slotwith=upSize.width*upS*0.3;
	var slotheigt=upSize.height*upS*0.3;
	for(var i=0;i<orders.length;i++)
	{
	  var ci=orders[i];
	  if(off%2==0)
	{
		if (i!=0) 
		{
			if (ci.name == orders[i-1].name) 
			{
				 
				 if(ci.isgang4)
				 {
				 	
				 	ci.x=orders[i-2].x;
				 	ci.y=orders[i-2].y+upSize.height*upS*0.3;
				 }else if(orders[i-1].isgang4)
				 {
				 	ci.x=orders[i-1].x+upSize.width*upS*2;
				 }else
				 {
				 	ci.x=orders[i-1].x+upSize.width*upS;
				 }
			}else if(orders[i-1].name == "gang0" )
			{
				ci.x=orders[i-2].x+upSize.width*upS + slotwith;
			}else if (orders[i-1].name =="gang1")
			{
				ci.x=orders[i-2].x+upSize.width*upS + slotwith;
			}else 
			{
				ci.x=orders[i-1].x+upSize.width*upS + slotwith;
			}
			/*
			判断是不是新抓的牌
			*/
			if (off == 0) 
			{	

				if (i == orders.length-1) {
					

    				if (newC&&endonepl) 
    				{
    				 ci.x = ci.x+slotwith;
    				}else if(newC)
    				{
    					ci.x = ci.x+slotwith;
    					ci.y+=20;
    				}
			}
		}
		}else
		{
			 ci.x=start.x+upSize.width*upS;
		}
	} else {
	  	if (i!=0) 
		{
			if (ci.name == orders[i-1].name) 
			{
				if (ci.isgang4) 
				{
				
					ci.y=orders[i-2].y + slotheigt;
				}else if(orders[i-1].isgang4)
				{
					ci.y=orders[i-2].y-upSize.height*upS*0.7;
				}else
				{
					ci.y=orders[i-1].y-upSize.height*upS*0.7;
				}
				 
			}else if ( orders[i-1].name=="standPri")
			{
				ci.y=orders[i-1].y-upSize.height*upS*2;
			}else if(orders[i-1].name == "gang0" )
			{
				ci.y=orders[i-2].y-upSize.height*upS*0.7-slotheigt;
			}else if (orders[i-1].name =="gang1")
			{
				ci.y=orders[i-2].y-upSize.height*upS*0.7-slotheigt;
			}else
			{
				ci.y=orders[i-1].y-upSize.height*upS*0.7-slotheigt;
			}
				
				
			
		}else
		{
			  ci.y=start.y-upSize.height*upS*0.7;
		}
	 
	 	if(off ==3)
	 	{
	 		if (!ci.isgang4) 
	 		{
	 			ci.zIndex = i;
	 		}else
	 		{
	 			ci.zIndex =200;
	 		}
	 		
	 	}

	 	if(off ==1)
	 	{
	 		if (!ci.isgang4) 
	 		{
	 			ci.zIndex = i;
	 		}else
	 		{
	 			ci.zIndex =200;
	 		}
	 		
	 	}
	}

	}
}

function HandleMJPut(node,msg,off,outNum)
{
	
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids; 
	var selfIndex=(uids.indexOf(SelfUid())+off)%4;
	if(uids[selfIndex]==msg.uid)
	{
		var pl=sData.players[msg.uid];
		var putnum=outNum>=0?outNum:(pl.mjput.length-(off==0?0:1));
		var out0=node.getChildByName("out0");
		var out1=node.getChildByName("out1");
		var oSize=out0.getSize();
		var oSc=out0.scale;
		
		var out;
		if (putnum>11) 
		{
			out=out1.clone(); 
		}
        else
		{
			out=out0.clone();
		}
		if (off==0&&putnum>11) 
		{
			node.addChild(out); 
		}
        else if(off == 1 ||off == 0)
		{
			node.addChild(out,200-putnum); 
		}
        else if(off == 2 ||off == 3)
		{
			node.addChild(out,putnum); 
		}
		else
		{
			node.addChild(out);
		}
		for (var i = 0; i < node.children.length; i++)
        {
			if	(node.children[i].name == "newout") node.children[i].name="out";
		}
        out.visible=true;
		out.name="out";
		setCardPic(out,msg.card,off);
		var endPoint = cc.p(0,0);
		var Midpoint = cc.p(0,0);
		var ws = cc.director.getWinSize();
		if(putnum>11)
		{
			out.x=out1.x; out.y=out1.y;
			putnum-=12;
		}
		if(off==0)
		{
			endPoint.y = out.y;
			endPoint.x=out.x+oSize.width*oSc*putnum;
			Midpoint.x =ws.width / 2;
			Midpoint.y = ws.height /4;
			if(!(outNum>=0))
			{
				RemoveBackNode(node,"mjhand",1,msg.card);
			}
		}
		else if(off==1)
		{	
			if(!(outNum>=0))RemoveFrontNode(node,"standPri",1);
			 endPoint.y = out.y+oSize.height*oSc*putnum*0.7;
			 endPoint.x = out.x;
			 Midpoint.x = ws.width / 4 * 3 ;
			 Midpoint.y = ws.height / 2;
			 out.zIndex=100-putnum;
		}
		else if(off==2)
		{
			if(!(outNum>=0))RemoveFrontNode(node,"standPri",1);
			 endPoint.x = out.x-oSize.width*oSc*putnum;
			 endPoint.y = out.y;
			 Midpoint.x = ws.width / 2;
			 Midpoint.y = ws.height / 4 * 3;
		}
		else if(off==3)
		{
			if(!(outNum>=0))RemoveBackNode(node,"standPri",1);
			endPoint.y = out.y-oSize.height*oSc*putnum*0.7;
			endPoint.x = out.x;
			Midpoint.x = ws.width / 4;
			Midpoint.y = ws.height / 2;
            out.zIndex=putnum;
		}
		
		if(outNum>=0)//重连
		{
			if((outNum==pl.mjput.length-1)&&tData.curPlayer==selfIndex&&tData.tState==TableState.waitEat)
			{
			}
			else
			{
			    out.x=endPoint.x;
				out.y=endPoint.y;
				return;
			}	
		}
		else//打牌
		{
		}
		
		var  zoder= out.zIndex;
		out.zIndex = 200;
		out.visible=false;
		var outAction = node.getParent().getChildByName("top").getChildByName("out0").clone();
		outAction.name="outAction";
		outAction.visible = true;
		node.addChild(outAction);

        out.x = Midpoint.x
		out.y = Midpoint.y
		
		out.scale =2*oSc;
		
		out.name="newout";
		
		setCardPic(outAction,msg.card,2);

		outAction.scale = oSc;
		

		outAction.zIndex = 200
		if(off==0&&jsclient.lastPutPos)
		{
			outAction.x = jsclient.lastPutPos.x;
			outAction.y = jsclient.lastPutPos.y;
		}
		else 
		{
			outAction.x = node.getChildByName("stand").x;
			outAction.y = node.getChildByName("stand").y;
		}

		/**
		设置出牌动画的方向
		*/

		var callbackFUNC= function()
		{
			out.zIndex = zoder;

		};
		var callbackFUNCROTATION = function()
		{
			out.visible = true;
			out.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2,endPoint),cc.scaleTo(0.2,oSc)),cc.callFunc(callbackFUNC)));
		};
		outAction.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2,Midpoint),cc.scaleTo(0.2,2*oSc))
			//cc.DelayTime(0.4),cc.callFunc(callbackFUNCROTATION),cc.removeSelf()
        ));
		
		function RemovePutCard(onlySelf)
		{
			var delayNum=0.4-(Date.now()-putTime)/1000; if(delayNum<0) delayNum=0;

			if(!onlySelf)
                outAction.runAction(cc.sequence(cc.DelayTime(delayNum),cc.callFunc(callbackFUNCROTATION),cc.removeSelf()));
			else
                outAction.runAction(cc.sequence(cc.DelayTime(delayNum),cc.removeSelf()));
		}
		
		var putTime=Date.now();
		var outActionBind=
        {
			_event:
			{
				waitPut:function(){RemovePutCard(false)},
                MJChi:function(){RemovePutCard(true)},
                MJPeng:function(){RemovePutCard(true)},
                MJGang:function(){RemovePutCard(true)},
                roundEnd:function(){RemovePutCard(true)}
			}
		};

		ConnectUI2Logic(outAction,outActionBind);
		
		if(!(outNum>=0))
            RestoreCardLayout(node,off);
	}
}

function setCardPic(node,cd,off)
{
	var imgName="";
    // if(cd<30)
	// {
	// 	imgName=imgOff[off] + imgNames[Math.floor(cd/10)]+cd%10;
	// }
	// else
	// {
	//     imgName=imgOff[off] + imgNames[Math.floor(cd/10)];
	// }
    imgName = "mj_" + cd + ".png";
	node.tag = cd;
	var callback = function()
	{
		// node.loadTexture(imgName+".png",ccui.Widget.PLIST_TEXTURE  );
        var num = node.getChildByName("num");
        if (num != null)
            num.loadTexture(imgName,ccui.Widget.PLIST_TEXTURE);
	};
	node.stopAllActions();
	node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback),cc.delayTime(1))));
	
}

function SetArrowRotation(abk)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids; 
	var selfIndex=uids.indexOf(SelfUid());
	selfIndex= (tData.curPlayer+4-selfIndex)%4;
    abk.getChildByName("arrow").rotation=270-90*selfIndex;	
}

function SetCardTouchHandler(standUI,cardui)
{
	cardui.addTouchEventListener(function(btn,tp)
	{
		if(tp!=2) return;
		var sData=jsclient.data.sData;
	    var tData=sData.tData;
		if(!IsMyTurn() || tData.tState!=TableState.waitPut)
		{
			mylog("not my turn");
			return;
		}
		//mylog(btn.y+" "+standUI.y);
		if(btn.y >=standUI.y+10)
		{
			PutAwayCard(cardui,cardui.tag);
		}
		else 
		{
			var mjhandNum=0;
			var  children= btn.getParent().children;
			for (var i = 0; i <children.length; i++) {
				if(children[i].name == "mjhand")
				{
					mjhandNum++;
					if(children[i].y > standUI.y+10)
					children[i].y = standUI.y ;
				}
			}
			if(mjhandNum==getUIPlayer(0).mjhand.length)
			{
				btn.y =standUI.y+20;
			}
		}
		
	},cardui);
}

function reConectHeadLayout(node)
{
    var sData=jsclient.data.sData;
    var tData=sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    cc.log("reConectHeadLayout");

	if (tData.tState == TableState.waitJoin || tData.tState == TableState.roundFinish)
    {
		doLayout(down, [0.125,0.125],[0.5,0.2],[0,0],false,false);
		doLayout(top,  [0.125,0.125],[0.5,0.8],[0,0],false,false);
		doLayout(left, [0.125,0.125],[0.2,0.5],[0,0],false,false);
		doLayout(right,[0.125,0.125],[0.8,0.5],[0,0],false,false);
	 }
    else
    {
        doLayout(top,  [0.125,0.125],[0.93,0.9],[0,0],false,false);
        doLayout(right,[0.125,0.125],[0.93,0.65],[0,0],false,false);
        doLayout(left, [0.125,0.125],[0.07,0.6],[0,0],false,false);
        doLayout(down, [0.125,0.125],[0.07,0.35],[0,0],false,false);
	 }
}

function tableStartHeadPlayAction(node)
{
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    doLayout(down, [0.125,0.125],[0.5,0.2],[0,0],false,false);
    doLayout(top,  [0.125,0.125],[0.5,0.8],[0,0],false,false);
    doLayout(left, [0.125,0.125],[0.25,0.5],[0,0],false,false);
    doLayout(right,[0.125,0.125],[0.75,0.5],[0,0],false,false);

    doLayout(top,  [0.125,0.125],[0.93,0.9],[0,0],false,false);

    doLayout(right,[0.125,0.125],[0.93,0.65],[0,0],false,false);
    doLayout(left, [0.125,0.125],[0.07,0.6],[0,0],false,false);
    doLayout(down, [0.125,0.125],[0.07,0.35],[0,0],false,false);
    var downPoint = cc.p(down.x,down.y);
    var topPoint = cc.p(top.x, top.y);
    var rightPoint = cc.p(right.x,right.y);
    var leftPoint = cc.p(left.x,left.y);
    down.runAction(cc.moveTo(0.5,downPoint));
    top.runAction(cc.moveTo(0.5,topPoint));
    left.runAction(cc.moveTo(0.5,leftPoint));
    right.runAction(cc.moveTo(0.5,rightPoint));
}

function InitPlayerNameAndCoin(node,off)
{
	var pl = getUIPlayer(off);
	if(!pl) return;
	
	var tData=jsclient.data.sData.tData;
	var bind=
    {
		head:
        {
			name:
            {
				_text:function(){ return unescape(pl.info.nickname||pl.info.name);  }
			},
            coin:
            {
				_visible:true,
				_run:function()
                {
                    changeLabelAtals(this,tData.initCoin+pl.winall);
				}
			}
		}
	};
	ConnectUI2Logic(node,bind);
}

function InitPlayerHandUI(node,off)
{
	 var sData=jsclient.data.sData;
	 var tData=sData.tData;
	 var pl=getUIPlayer(off);
	 
     InitPlayerNameAndCoin(node,off);
	 if (tData.tState!=TableState.waitPut &&tData.tState!=TableState.waitEat &&tData.tState!=TableState.waitCard)
         return;
			 
        
			//添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        //AddNewCard(node,copy,name,tag,off)
        for (var j = 0; j < 3; j++) {
            AddNewCard(node,"up","peng",pl.mjpeng[i],off);
        }
    }
    //添加明杠
    for (var i = 0; i < pl.mjgang0.length; i++) {

        for (var j = 0; j <4; j++) {
            if (j==3)
            {
                AddNewCard(node,"up","gang0",pl.mjgang0[i],off,"isgang4").tag = pl.mjgang0[i];
            }else
            {
                AddNewCard(node,"up","gang0",pl.mjgang0[i],off);
            }

        }
    }
    //添加暗杠
    for (var i = 0; i < pl.mjgang1.length; i++) {

        for (var j = 0; j < 4; j++) {

                if (j==3)
                {
                    AddNewCard(node,"down","gang1",0,off,"isgang4").tag = pl.mjgang1[i];
                }else
                {
                    AddNewCard(node,"up","gang1",pl.mjgang1[i],off);
                }
        }

    }
    //添加吃
    for (var i = 0; i < pl.mjchi.length; i++) {

            AddNewCard(node,"up","chi",pl.mjchi[i],off);
        }
    //添加打出的牌
    for (var i = 0; i < pl.mjput.length; i++) {
        var msg = {card:pl.mjput[i],uid:pl.info.uid};
         HandleMJPut(node,msg,off,i);


    }
    //添加手牌
        if (pl.mjhand)
        {
            for (var i = 0; i < pl.mjhand.length; i++)
            {
                AddNewCard(node,"stand","mjhand",pl.mjhand[i],off);
            }
        }else
        {
            var CardCount = 0;
            if (
                  tData.tState==TableState.waitPut&&tData.uids[tData.curPlayer]==pl.info.uid
                //&&pl.mjState==TableState.waitPut
            )
            {
                CardCount = 14;
            }else
            {
                CardCount = 13;
            }
            var upCardCount= CardCount-((pl.mjpeng.length+pl.mjgang0.length+pl.mjgang1.length)*3+pl.mjchi.length);
            for (var i = 0; i <upCardCount ; i++)
            {
                AddNewCard(node,"stand","standPri",0,off);
            }

        }
        RestoreCardLayout(node,off);
}

var playAramTimeID = null;
function updateArrowbkNumber(node)
{
	node.setString("10");
	var number = function(){
	if (node.getString()==0) {
	node.cleanup();
	}else
	{
		var number=node.getString()-1
		if(number>9)
		{
			node.setString(number);
		}else
		{
			node.setString("0"+number);
			var sData=jsclient.data.sData;
			var tData=sData.tData;
			var uids=tData.uids; 
			if(uids[tData.curPlayer]==SelfUid() )
			{
				if (number==3) 
				{

				 playAramTimeID =playEffect("timeup_alarm");

				}else if(number==0)
				{
					jsclient.native.NativeVibrato();
				}
			}
			
		}
	
	}
	};

node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0),cc.callFunc(number,node))));
}

function getUIPlayer(off)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids; 
	var selfIndex=uids.indexOf(SelfUid());
    selfIndex=(selfIndex+off)%4;
    
	if(selfIndex<uids.length)   
        return sData.players[uids[selfIndex]];	
    
	return null;
}

function getIndexPlayer(uid)
{
	var sData=jsclient.data.sData;
	var tData=sData.tData;
	var uids=tData.uids;
	var selfIndex=uids.indexOf(SelfUid());
	var targetIndex=uids.indexOf(uid);

	return (targetIndex - selfIndex + 4) % 4;
}

function getUIHead(off)
{
	var pl=getUIPlayer(off);
	if(!pl) return {};
	return {uid:pl.info.uid,url:pl.info.headimgurl};
}

function setOffline(node,off)
{
	var pl=getUIPlayer(off);
    if(!pl) return;
    node.getChildByName("head").getChildByName("offline").zIndex = 99;
	node.getChildByName("head").getChildByName("offline").visible=!pl.onLine;
}
function showPlayerInfo(off,node)
{
	var tData=jsclient.data.sData.tData;
	var pl=getUIPlayer(off);
	if(pl)
	{ 
         jsclient.showPlayerInfo(pl.info);
    }
	return;
	
	//mylog(pl.mjState+"|"+pl.mjgang1+"|"+pl.mjgang0+"|"+pl.mjpeng+"|"+pl.mjhand);
	//mylog(pl.mjchi+"|"+pl.mjput);
	//mylog(tData.tState+" c "+tData.curPlayer+" e "+tData.canEatHu);
	

	var names=[];
	for (var i = 0; i < node.children.length; i++) {
		names.push(node.children[i].name+"|"+node.children[i].tag);
	}
	cc.log(names);
	
}

function showPlayerZhuangLogo(node,off)
{
	
	var sData = jsclient.data.sData;
	var tData = sData.tData;
	var pl =getUIPlayer(off);
	node.zIndex = 100;
	if (tData) 
	{
		if (tData.uids[tData.zhuang]==pl.info.uid) 
		{
			node.visible = true;
		}else
		{
			node.visible = false;
		}
		
	}
}

function updatePower(node)
{
	var callNative=jsclient.native.NativeBattery;
	node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callNative),cc.DelayTime(30))));
}

function updateWIFI(node)
{


	var callback = function(){
	var ms = jsclient.reqPingPong /1000.0;
	cc.log("ms"+ms);
		if (ms<0.3)
		{
			 node.loadTexture("Z_wifi_1.png",ccui.Widget.PLIST_TEXTURE  );
		}else if(ms<0.6)
		{
			node.loadTexture("Z_wifi_2.png",ccui.Widget.PLIST_TEXTURE  );
		}else if(ms <1)
		{
			 node.loadTexture("Z_wifi_3.png",ccui.Widget.PLIST_TEXTURE  );
		}else
		{
			node.loadTexture("Z_wifi_4.png",ccui.Widget.PLIST_TEXTURE  );
		}
	};
	
	node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback),cc.DelayTime(5))));
}
function CheckDelRoomUI()
{
	var sData=jsclient.data.sData;
	if(sData.tData.delEnd!=0&&!jsclient.delroomui)
	{
		jsclient.Scene.addChild(new DelRoomLayer());
	}
	else if(sData.tData.delEnd==0&&jsclient.delroomui)
	{
		jsclient.delroomui.removeFromParent(true);	delete jsclient.delroomui;
	}
}
function CheckReadyVisible(node,off)
{
	if(off<0)
	{
		node.visible=false;
		return false;
	}
   var p0=getUIPlayer(off); 
   	var sData=jsclient.data.sData;
	var tData=sData.tData;

   if(p0&&p0.mjState==TableState.isReady&&tData.tState!=TableState.waitJoin)
   {
	   node.visible=true;
   }else 
   {
   	node.visible=false;
   } 
	 return node.visible;
}

function MJChichange(tag)
{
//	jsclient.gangCards = [];
//	jsclient.eatpos = [];
    mylog("chi "+jsclient.eatpos.length);
    mylog(jsclient.eatpos);

	var eat = jsclient.playui.jsBind.eat;
	var changeuibg = eat.changeui.changeuibg;
	var card1 = changeuibg.card1._node;
	var card2 = changeuibg.card2._node;
	var card3 = changeuibg.card3._node;
	var card4 = changeuibg.card4._node;
	var card5 = changeuibg.card5._node;
	var card6 = changeuibg.card6._node;
	var card7 = changeuibg.card7._node;
	var card8 = changeuibg.card8._node;
	var card9 = changeuibg.card9._node;
	card1.visible=false;
	card2.visible=false;
	card3.visible=false;
	card4.visible=false;
	card5.visible=false;
	card6.visible=false;
	card7.visible=false;
	card8.visible=false;
	card9.visible=false;
	
	if (jsclient.eatpos.length==1) 
	{
		 MJChi2Net(jsclient.eatpos[0]);

	}else
	{
		eat.chi0._node.visible=false;
		eat.chi1._node.visible=false;
		eat.chi2._node.visible=false;
		eat.peng._node.visible=false;
		eat.gang0._node.visible=false;
		eat.gang1._node.visible=false;
		eat.gang2._node.visible=false;
		eat.hu._node.visible=false;
		eat.guo._node.visible=false;
		changeuibg._node.visible =true;
		for (var i = 0; i < jsclient.eatpos.length; i++)
		{
			ShowMjChiCard(changeuibg._node,jsclient.eatpos[i]);
		}

	}
}

function MJGangchange(tag)
{
	var eat = jsclient.playui.jsBind.eat;
	var changeuibg = eat.changeui.changeuibg;
	var card1 = changeuibg.card1._node;
	var card2 = changeuibg.card2._node;
	var card3 = changeuibg.card3._node;
	var card4 = changeuibg.card4._node;
	var card5 = changeuibg.card5._node;
	var card6 = changeuibg.card6._node;
	var card7 = changeuibg.card7._node;
	var card8 = changeuibg.card8._node;
	var card9 = changeuibg.card9._node;
	card1.visible=false;
	card2.visible=false;
	card3.visible=false;
	card4.visible=false;
	card5.visible=false;
	card6.visible=false;
	card7.visible=false;
	card8.visible=false;
	card9.visible=false;
	cc.log("jsclient.gangCards.length"+jsclient.gangCards.length);
	if (jsclient.gangCards.length==1) 
	{

		 MJGang2Net(jsclient.gangCards[0]);
	}
    else
	{
		eat.chi0._node.visible=false;
		eat.chi1._node.visible=false;
		eat.chi2._node.visible=false;
		eat.peng._node.visible=false;
		eat.gang0._node.visible=false;
		eat.gang1._node.visible=false;
		eat.gang2._node.visible=false;
		eat.hu._node.visible=false;
		eat.guo._node.visible=false;
		changeuibg._node.visible =true;
		
		for (var i = 0; i < jsclient.gangCards.length; i++)
        {
			if (i==0) 
			{
				card9.visible = true;
				setCardPic(card9,jsclient.gangCards[i],4);
			}
            else if(i==1)
			{
				card7.visible = true;
				setCardPic(card7,jsclient.gangCards[i],4);
			}
            else if(i==2)
			{
				card5.visible = true;
				setCardPic(card5,jsclient.gangCards[i],4);
			}
		}
	}
}

function emojiPlayAction(node,num)
{
	/*	,happy:{_click:function(){emojiAction(0);}}
				,angry:{_click:function(){emojiAction(1);}}
				,smaile:{_click:function(){emojiAction(2);}}
				,han:{_click:function(){emojiAction(3);}}
				,zhiya:{_click:function(){emojiAction(4);}}
				,shihua:{_click:function(){emojiAction(5);}}
				,jiong:{_click:function(){emojiAction(6);}}
				,sleep:{_click:function(){emojiAction(7);}}
				,fennu:{_click:function(){emojiAction(8);}}
				,yun:{_click:function(){emojiAction(9);}}
				,lihai:{_click:function(){emojiAction(10);}}
				,touxiang:{_click:function(){emojiAction(11);}}
				,se:{_click:function(){emojiAction(12);}}
				,huaxiao:{_click:function(){emojiAction(13);}}
				,shaoxiang:{_click:function(){emojiAction(14);}}*/
		var framename;
		var number = 0;
		var arry = [];
		var delaytime = 0;
		var sumtime =0;
		var playtime = 3;
		var imgSize ;
		switch(num)
			{
				case 0:
				framename = "happy";
				delaytime = 0.1;
				break;
				case 1:
				framename = "angry";
				delaytime = 0.15;
				break;
				case 2:
				framename = "smaile";
				delaytime = 0.2;
				break;
				case 3:
				framename = "han";
				delaytime = 0.2;
				break;
				case 4:
				framename = "zhiya";
				delaytime = 0.2;
				break;
				case 5:
				framename = "shihua";
				delaytime = 0.2;
				break;
				case 6:
				framename = "jiong";
				delaytime = 0.23;
				break;
				case 7:
				framename = "sleep";
				delaytime = 0.2;
				break;
				case 8:
				framename = "fennu";
				delaytime = 0.2;
				break;
				case 9:
				framename = "yun";
				delaytime = 0.2;
				break;
				case 10:
				framename = "lihai";
				delaytime = 0.2;
				break;
				case 11:
				framename = "touxiang";
				delaytime = 0.2;
				break;
				case 12:
				framename = "se";
				delaytime = 0.2;
				break;
				case 13:
				framename = "huaxiao";
				delaytime = 0.2;
				break;
				case 14:
				framename = "shaoxiang";
				delaytime = 0.2;
				break;
				default:
				break;

			}
			for (var i = 0; i <15; i++) {
				var frame = cc.spriteFrameCache.getSpriteFrame(framename+i+".png");
				
				if (frame) 
				{
					imgSize = frame.getOriginalSize();
					arry.push(framename+i);
				}
			}
	//var animation = new cc.Animation(arry,0.3);
	//var animate = cc.animate(animation);
	var callback = function(){

		if(arry.length ==  number)
		{	number = 0;
			
		}
		cc.log("||"+arry[number]+".png");
		node.loadTexture(arry[number]+".png",ccui.Widget.PLIST_TEXTURE  );
		number++;
		sumtime = sumtime+delaytime;
		if (sumtime >playtime) 
		{
			node.cleanup();
			node.visible =false;
		}
	
	};
	node.cleanup();
	node.visible =true;
	node.setSize(imgSize);
	node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback),cc.delayTime(delaytime))));
	
}


createAnimation = function(path, count, rect)
{
	var frames = [];
	var prefix =  path;
	for (var temp_x = 0; temp_x < count; temp_x++)
	{
		var fileName = prefix + temp_x + ".png";
		var frame = new cc.SpriteFrame(fileName, rect);
		frames.push(frame);
	}
	var animation = new cc.Animation(frames, 0.25);
	var action = new cc.Animate(animation);
	return action;
};


function showchat(node,off,msg)
{
	var pl = getUIPlayer(off);
	var uid = msg.uid;
	var type = msg.type;
	var message = msg.msg;
	var num = msg.num;
	//mylog("uid"+uid+" type" +type +"message"+message+"||uid"+pl.info.uid);

	if (pl&&msg.uid == pl.info.uid ) 
	{
		if (type == 0) 
		{
			node.getParent().visible = true;
			node.setString(message);
			var callback = function(){
				node.getParent().visible = false;
			};
			
			node.getParent().width =  node.stringLength * node.fontSize +72; 
			node.runAction(cc.sequence(cc.delayTime(2.5),cc.callFunc(callback)));
		}else if(type == 1)
		{
			node.getParent().visible = true;
			node.setString(message);
			var callback = function(){
				node.getParent().visible = false;
			};
			var musicnum = msg.num+1;
			
			 var one  = node.getCustomSize().width /20.0;
				node.getParent().width =  node.stringLength * node.fontSize +72; 
			playEffect("fix_msg_"+musicnum);
			node.runAction(cc.sequence(cc.delayTime(2.5),cc.callFunc(callback)));
		}else if(type == 2)
		{
			var em_node= node.getParent().getParent().getChildByName("emoji");
			emojiPlayAction(em_node,msg.num);
		}else if (type ==3)
		{
			cc.audioEngine.pauseMusic();
			cc.audioEngine.setEffectsVolume(1);

			cc.audioEngine.unloadEffect(message);
			cc.audioEngine.playEffect(message);

			node.getParent().setVisible(true);
			node.setString(" ");
			node.getParent().width =  node.stringLength * node.fontSize +72;

			var voicebg = node.getParent().getChildByName("voicebg");
			voicebg.setVisible(true);

			var callback = function(){
				node.getParent().setVisible(false);
				voicebg.setVisible(false);
				voicebg.stopAllActions();
				cc.audioEngine.resumeMusic();
			};

			if (!jsclient.data._tempRecordVoiceAnimate)
			{
				jsclient.data._tempRecordVoiceAnimate = createAnimation("res/animate/voice/" , 4, cc.rect(0,0,23,30));
				jsclient.data._tempRecordVoiceAnimate.retain();
			}

			voicebg.runAction(cc.repeatForever(jsclient.data._tempRecordVoiceAnimate));
			node.runAction(cc.sequence(cc.delayTime(Number(num / 1000) < 1 ? 1 : Number(num / 1000)),cc.callFunc(callback)));
		}
	}
}


/**
 * 获取 录音动画
 * */
function getRecordStatusLayer()
{
	if (!jsclient.data._tempRecordStatusLayer)
	{
		var size = cc.winSize;
		jsclient.data._tempRecordStatusLayer = new cc.Layer();
		cc.director.getRunningScene().addChild(jsclient.data._tempRecordStatusLayer);

		var voiceBackGround = new ccui.Scale9Sprite("res/animate/startRecord/voiceBackGround.png");
		var layerSize = voiceBackGround.getContentSize();

		voiceBackGround.setContentSize(cc.size(layerSize.width, layerSize.height * 1.25));
		voiceBackGround.setPosition(size.width * 0.5, size.height * 0.55);
		jsclient.data._tempRecordStatusLayer.addChild(voiceBackGround);
		var height = cc.winSize.height / 3 / voiceBackGround.getContentSize().height;
		voiceBackGround.setScale(height);

		layerSize = voiceBackGround.getContentSize();

		var voiceStatusIcon = new cc.Sprite("res/animate/startRecord/0.png");
		voiceStatusIcon.setPosition(layerSize.width * 0.675, layerSize.height * 0.55);
		voiceBackGround.addChild(voiceStatusIcon);

		var voiceIcon = new cc.Sprite("res/animate/startRecord/recordIcon.png");
		voiceIcon.setPosition(layerSize.width * 0.325, layerSize.height * 0.55);
		voiceBackGround.addChild(voiceIcon);

		var voiceCancel = new cc.Sprite("res/animate/startRecord/cancel.png");
		voiceCancel.setPosition(layerSize.width * 0.5, layerSize.height * 0.55);
		voiceBackGround.addChild(voiceCancel);


		var voiceShort = new cc.Sprite("res/animate/startRecord/timeShort.png");
		voiceShort.setPosition(layerSize.width * 0.5, layerSize.height * 0.55);
		voiceBackGround.addChild(voiceShort);


		var tipsLabel = new cc.LabelTTF("手指上滑 , 取消发送","", 20);
		tipsLabel.setPosition(layerSize.width * 0.5, layerSize.height * 0.15);
		voiceBackGround.addChild(tipsLabel);

		jsclient.data._tempVoiceStatusAnimate = createAnimation("res/animate/startRecord/", 7, cc.rect(0,0,44,82));
		voiceStatusIcon.runAction(cc.repeatForever(jsclient.data._tempVoiceStatusAnimate));

		var callback = function ()
		{
			jsclient.data._tempRecordStatusLayer.setVisible(false);
		};


		jsclient.data._tempRecordStatusLayer.runCancelRecord = function () {
			voiceIcon.setVisible(false);
			voiceStatusIcon.setVisible(false);
			voiceShort.setVisible(false);
			voiceCancel.setVisible(true);
			tipsLabel.setString("取消发送");
			jsclient.data._tempRecordStatusLayer.scheduleOnce(callback, 0.5);
		};

		jsclient.data._tempRecordStatusLayer.runStartRecord = function () {
			voiceIcon.setVisible(true);
			voiceStatusIcon.setVisible(true);
			voiceCancel.setVisible(false);
			voiceShort.setVisible(false);
			tipsLabel.setString("手指上滑 , 取消发送");

			jsclient.data._tempRecordStatusLayer.setVisible(true);
			jsclient.data._tempRecordStatusLayer.unschedule(callback);
		};

		jsclient.data._tempRecordStatusLayer.runToCancelRecord = function () {
			voiceIcon.setVisible(false);
			voiceStatusIcon.setVisible(false);
			voiceCancel.setVisible(true);
			voiceShort.setVisible(false);
			tipsLabel.setString("松开手指 , 取消发送");

			jsclient.data._tempRecordStatusLayer.setVisible(true);
			//jsclient.data._tempRecordStatusLayer.unschedule(callback);
		};

		jsclient.data._tempRecordStatusLayer.runStopRecord = function () {
			voiceIcon.setVisible(true);
			voiceStatusIcon.setVisible(true);
			voiceCancel.setVisible(false);
			voiceShort.setVisible(false);

			//jsclient.data._tempRecordStatusLayer.scheduleOnce(callback, 0.5);
			jsclient.data._tempRecordStatusLayer.unschedule(callback);
			callback();
		};

		jsclient.data._tempRecordStatusLayer.runShortRecord = function () {
			voiceIcon.setVisible(false);
			voiceStatusIcon.setVisible(false);
			voiceCancel.setVisible(false);
			voiceShort.setVisible(true);
			tipsLabel.setString("录音时间太短");

			jsclient.data._tempRecordStatusLayer.scheduleOnce(callback, 0.5);
		};
	}
	return jsclient.data._tempRecordStatusLayer;
}

function initVData()
{
	console.log("jsclient.remoteCfg" + jsclient.remoteCfg.voiceUrl);
	jsclient.data._tempRecordStatusLayer = null;
	jsclient.data._tempMessage = null;
	jsclient.data._tempRecordVoiceAnimate = null;
	jsclient.data._JiaheTempTime = null;
}

/**
 * 运行录音动画
 * */
function runRecordAction()
{
	var animateLayer = getRecordStatusLayer();
	animateLayer.runStartRecord();
}

/**
 * 停止录音动画
 * */
function stopRecordAction()
{
	var animateLayer = getRecordStatusLayer();
	animateLayer.runStopRecord();
}

/**
 * 取消录音动画
 * */
function cancelRecordAction()
{
	var animateLayer = getRecordStatusLayer();
	animateLayer.runCancelRecord();
}

function shortRecordAction()
{
	var animateLayer = getRecordStatusLayer();
	animateLayer.runShortRecord();
}

function getTouchListener()
{
	return {
		event: cc.EventListener.TOUCH_ONE_BY_ONE,
		swallowTouches: false,
		status:null,
		onTouchBegan: function(touch, event)
		{
			console.log("在触摸东西");
			var target = event.getCurrentTarget();
			var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
			// 如果触碰起始地点在本区域中
			if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
			{
				return false;
			}
			console.log("好吧");
			return true;
		},onTouchMoved: function(touch, event)
		{
			console.log("子啊华东呢");
			var target = event.getCurrentTarget();
			var pos = target.getParent().convertTouchToNodeSpace(touch);   // 世界坐标转换 (子节点相对于父节点的位置)
			// 如果触碰起始地点在本区域中
			if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
			{
				if (this.status == 0)
				{
					return false;
				}
				this.status = 0;
				console.log("松开手指取消发送");
				getRecordStatusLayer().runToCancelRecord();

				return true;
			}

			if (this.status == 1)
			{
				return false;
			}
			console.log("上滑取消发送");

			this.status = 1;
			getRecordStatusLayer().runStartRecord();

			return true;
		},
		onTouchEnded: function(touch, event)
		{

			return true;
		},  onTouchCancelled: function(touch, event)
		{

			return true;
		}
	};
}

/**
 * 开始录音
 * */
function startRecord()
{
	jsclient.data._JiaheTempTime = new Date();
	cc.audioEngine.pauseMusic();
	jsclient.native.StartRecord(jsb.fileUtils.getWritablePath(), "recordFile" + SelfUid());
	runRecordAction();
}

/**
 * 结束录音
 * */
function endRecord()
{
	jsclient.data._JiaheTempTime = new Date().getTime() - jsclient.data._JiaheTempTime.getTime();
	jsclient.native.HelloOC(jsclient.data._JiaheTempTime);
	cc.audioEngine.resumeMusic();

	if (jsclient.data._JiaheTempTime > 1000)
	{
		jsclient.native.EndRecord("uploadRecord");
		stopRecordAction();
	}else
	{
		jsclient.data._JiaheTempTime = 0;
		jsclient.native.EndRecord("cancelRecord");
		shortRecordAction();
	}

}

/**
 * 取消录音
 * */
function cancelRecord()
{
	jsclient.data._JiaheTempTime = 0;
	cc.audioEngine.resumeMusic();
	jsclient.native.EndRecord("cancelRecord");
	cancelRecordAction();
}


/**
 * 下载录音, 调用 播放函数
 * */
function downAndPlayVoice(uid, filePath)
{
	var index = getIndexPlayer(uid);
	console.log("index is downAndPlayVoice" + index);
	jsclient.native.DownLoadFile(jsb.fileUtils.getWritablePath(), index + ".mp3", jsclient.remoteCfg.voiceUrl + filePath,"playVoice");
}


var play_canHuWith258;
var play_canHu7;
var PlayLayer=cc.Layer.extend({
	jsBind:{
		_event:{
				mjhand:function(){
					var sData=jsclient.data.sData;
					var tData=sData.tData;
					if(tData.roundNum!=tData.roundAll) return;
					var pls=sData.players;
					var ip2pl={};
					for(var uid in pls)
					{
						var pi=pls[uid];
						var ip=pi.info.remoteIP;
						if(ip)
						{
							if(!ip2pl[ip]) ip2pl[ip]=[];
							ip2pl[ip].push(unescape(pi.info.nickname||pi.info.name));
						}
					}
					var ipmsg=[];
					for(var ip in ip2pl)
					{
						var ips=ip2pl[ip];
						if(ips.length>1)
						{
							ipmsg.push("玩家:"+ips+"\n为同一IP地址\n")
						}
					}
					if(ipmsg.length>0)
					{
						ShowSameIP(ipmsg.join(""));
					}
					mylog("ipmsg "+ipmsg.length);

				},
			 game_on_hide:function(){jsclient.tickGame(-1);}
			,game_on_show:function(){jsclient.tickGame(1);}
			,LeaveGame:function()
			{
				jsclient.playui.removeFromParent(true);	delete jsclient.playui;
				playMusic("bgMain");
			},
			endRoom:function(msg)
			{
				mylog(JSON.stringify(msg));
				if(msg.showEnd) this.addChild(new EndAllLayer());
				else jsclient.Scene.addChild(new EndRoomLayer());
			},
			roundEnd:function()
			{
				var sData=jsclient.data.sData;
				if(sData.tData.roundNum<=0)	this.addChild(new EndAllLayer());
				this.addChild(new EndOneLayer());
			},moveHead:function()
			{
				tableStartHeadPlayAction(this);
			},initSceneData:function()
			{
				reConectHeadLayout(this);	
				CheckDelRoomUI();			
			},onlinePlayer:function()
			{
				reConectHeadLayout(this);	
			},logout:function () {
				if(jsclient.playui){
					jsclient.playui.removeFromParent(true);
					delete jsclient.playui;
				}
			},
			DelRoom:CheckDelRoomUI
		},

        roundnumImg:
		{
			_layout:[[0.1,0.1],[0.5,0.5],[1,0]]
			,_event:{
				initSceneData:function(eD){ this.visible=CheckArrowVisible();}
				,mjhand:function(eD){this.visible=CheckArrowVisible();}
				,onlinePlayer:function(eD){this.visible=CheckArrowVisible();}
			}
			,roundnumAtlas:{
				_text:function()
				{
					var sData = jsclient.data.sData;
					var tData = sData.tData;
					if(tData) return tData.roundNum-1;
				},_event:{
					mjhand:function()
					{
					var sData = jsclient.data.sData;
					var tData = sData.tData;
					if(tData) return this.setString(tData.roundNum);	
					}
				}
			}
		},

        cardNumImg:
        {
			_layout:[[0.1,0.1],[0.5,0.5],[-1.1,0]],
            _event:
            {
				initSceneData:function(eD)
                {
                    this.visible=CheckArrowVisible();
                },

                mjhand:function(eD)
                {
                    this.visible=CheckArrowVisible();
                },

                onlinePlayer:function(eD)
                {
                    this.visible=CheckArrowVisible();
                }
			},

            cardnumAtlas:
            {
				_text:function()
				{
					var sData = jsclient.data.sData;
					var tData = sData.tData;
					if(tData) return  (tData.withWind?136:108) - tData.cardNext;
				},

                _event:
                {
					waitPut:function()
					{
                        var sData = jsclient.data.sData;
                        var tData = sData.tData;

                        if(tData)
                            this.setString((tData.withWind?136:108) - tData.cardNext);
					}
				}
			}
		},

        back:{
			back:{_layout:[[1.02,1.02],[0.5,0.5],[0,0],true]},
			clt: 
			{
				 _layout:[[0.15,0.15],[0,1],[0.5,-0.5]]
				 ,play:{
					 
					 canEat:{
						 _visible:function(){
						 return false;//jsclient.data.sData.tData.canEat;
					 }},
					 zzmj:{_visible:function(){   return false;/*jsclient.data.sData.tData.noBigWin; */   }},
					 symj:{_visible:function(){   return  false;/*!jsclient.data.sData.tData.noBigWin;   */  }},
					 canEatHu:{_visible:function(){ return  false;/*jsclient.data.sData.tData.canEatHu;  */  }},
					 withWind:{_visible:function(){ return  false;/*jsclient.data.sData.tData.withWind;  */  }},
					 canHu7:{
						 _run:function(){ play_canHu7=this; },
						 _visible:function(){
							 return false;//(jsclient.data.sData.tData.noBigWin&&jsclient.data.sData.tData.canHu7);
						 }
					 },
					 canHuWith258:{
						 _run:function(){ play_canHuWith258=this; },
						 _visible:function(){ return  false;/*jsclient.data.sData.tData.canHuWith258;*/  }
					 },
				 	 canHu_hongzhong:{
						 _run:function(){
							 // if((!play_canHuWith258.visible)&&(!play_canHu7.visible)){
							 // this.y = play_canHuWith258.y;
							 // }else if((play_canHuWith258.visible)&&(play_canHu7.visible)){
                             //
							 // }else{
								//  this.y = play_canHu7.y;
							 // }
						 },
						 _visible:function()
                         {
							 return jsclient.data.sData.tData.withZhong;
						 }
					 },
                    _event:
                    {
                        initSceneData:function(eD)
                        {
                            this.visible=true;
                            if(!jsclient.data.sData.tData.canHuWith258)
                            {
                                play_canHu7.y = play_canHuWith258.y;
                            }

                        },
                        mjhand:function(eD){this.visible=CheckArrowVisible();},
                        onlinePlayer:function(eD){this.visible=CheckArrowVisible();}
					}
				}				 
			},

			clb: {_layout:[[0.15,0.15],[0,0],[0.5,0.5]]},
			crt: {_layout:[[0.15,0.15],[1,1],[-0.5,-0.5]]},
			crb: {_layout:[[0.15,0.15],[1,0],[-0.5,0.5]]},
			barl:{_layout:[[0.01,0.7],[0.005,0.5],[0,0],true]},
			barr:{_layout:[[0.01,0.7],[0.995,0.5],[0,0],true]},
			bart:{_layout:[[0.9,0],[0.5,0.99],[0,0],true]},
			barb:{_layout:[[0.9,0],[0.5,0.01],[0,0],true]},

			gdmj: {_layout:[[0.2,0.2],[0.5,0.5],[0,1.2]]}
		},

		banner:
		{
			_layout:[[0.878,1],[0.5,0.945],[0,0]],
            wifi:
            {
				_run:function()
				{
					updateWIFI(this);
				}
			},

            powerBar:
            {
				_run:function()
				{
					cc.log("powerBar_run");
					updatePower(this);
				},
                _event:
				{
					nativePower:function(d)
					{

						this.setPercent(Number(d));
					}
				}
			},

            tableid:
            {
				_event:
                {
					initSceneData:function()
					{
						this.setString(jsclient.data.sData.tData.tableid);
					}
				}
			},
			setting:
            {
				_click:function()
                {
					var settringLayer = new  SettingLayer();
					settringLayer.setName("PlayLayerClick");
					jsclient.Scene.addChild(settringLayer); 
				}
			},

			Button_1:
			{
				_click:function(){
					jsclient.openWeb({url:jsclient.remoteCfg.helpUrl, help:true,noticeSwitch:0});
				}
			}
		},

		arrowbk:
		{	
			_layout:[[0.15,0.15],[0.5,0.5],[0,0]],
			_event:{
				initSceneData:function(eD){ this.visible=CheckArrowVisible();SetArrowRotation(this)  }
				,mjhand:function(eD){this.visible=CheckArrowVisible();SetArrowRotation(this);}
				,onlinePlayer:function(eD){this.visible=CheckArrowVisible();}
				,waitPut:function(eD){ SetArrowRotation(this)  }
				,MJPeng:function(eD) { SetArrowRotation(this)  }
				,MJChi:function(eD)  { SetArrowRotation(this)  }
				,MJGang:function(eD) { SetArrowRotation(this)  }
			},
            number:{
				_run:function()
				{
			
					updateArrowbkNumber(this);
				},
				_event:{
					MJPeng:function()
					{
						this.cleanup();
						stopEffect(playAramTimeID)
						updateArrowbkNumber(this);
					}
					,MJChi:function()
					{
						this.cleanup();
						stopEffect(playAramTimeID)
						updateArrowbkNumber(this);
					 }
					,waitPut:function()
					{
						this.cleanup();
						stopEffect(playAramTimeID)
						updateArrowbkNumber(this);
					},
					MJPut:function(msg)
					{
						if(msg.uid==SelfUid())
						this.cleanup();
					
						
					},roundEnd:function()
					{
						this.cleanup();
						stopEffect(playAramTimeID)
					}

				}
			}
		},

		wait:
        {
            backHomebtn:
            {
                _layout:[[0.13,0.13],[0.35,0.5],[0,0]],
                _click:function(btn)
                {
                    var sData=jsclient.data.sData;
                    if(sData)
                    {
                        if(IsRoomOwner())
                        {
                            jsclient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                function()
                                {
                                    jsclient.playui.visible =false;
                                    sendEvent("returnHome");
                                },function(){});
                        }
                        else
                        {
                            jsclient.showMsg("返回大厅房间将退出游戏\n确定退出房间吗",
                                function()
                                {
                                    jsclient.leaveGame();
                                },function(){});
                        }
                    }
                }
            },

			wxinvite:
			{
				_layout:[[0.13,0.13],[0.5,0.5],[0,0]],
				_click:function()
				{
					var tData=jsclient.data.sData.tData;
                    var tableid = tData.tableid;
                    var withZhong = tData.withZhong;
                    var canHu7 = tData.canHu7;
                    var horse = tData.horse;
                    var roundNum = tData.roundNum;

                    var withZhongTips = withZhong ? "红中鬼牌、" : "";
                    var canHu7Tips = canHu7 ? "胡7对、" : "";
                    var horseTips = horse + "马、";
                    var roundNumTips = roundNum + "局,";

                    log(horseTips);

                    jsclient.native.wxShareUrl(
                        jsclient.remoteCfg.wxShareUrl,
                        "【广东麻将】", "房间号:"+tableid+","
                        +withZhongTips+canHu7Tips+horseTips +roundNumTips
                        +"速度加入，只等你来【星悦麻将】");

                    //"【广东麻将】房间号:123456, 红中鬼牌、胡7对、6马，4局，速度加入，只等你来【星悦麻将】
				}
			},

			delroom:
			{
				_layout:[[0.13,0.13],[0.65,0.5],[0,0]],
				_click:function()
                {
					jsclient.delRoom(true);
				}
			},

            _event:
            {
                returnPlayerLayer:function()
                {
                    jsclient.playui.visible =true;
                },

				initSceneData:function(eD)
                {
                    this.visible = CheckInviteVisible();
                },

				addPlayer:function(eD)
                {
                    this.visible=CheckInviteVisible();
                },

                removePlayer:function(eD)
                {
                    this.visible=CheckInviteVisible();
                }
			}
		},

		down:
        {
			head:
			{
				kuang:
				{
                    _run:function ()
                    {
                        this.zIndex = 2;
                    }
				},

                zhuang:
                {
                    _run:function()
                    {
                        this.visible =false;
                    },
                    _event:
                    {
                        waitPut:function(){showPlayerZhuangLogo(this,0);},
                        initSceneData:function(){if(CheckArrowVisible()) showPlayerZhuangLogo(this,0);}
                    }
                 },
                chatbg:
                {
                    _run:function(){this.getParent().zIndex = 600;},
                    chattext:
                    {
						_event:{

							MJChat:function(msg){
							
								showchat(this,0,msg);
							},playVoice:function (voicePath)
							{
								jsclient.data._tempMessage.msg = voicePath;
								showchat(this,0, jsclient.data._tempMessage);
							}
					}
                    }
                },
                _click:function(btn){ showPlayerInfo(0,btn); 	 },
			  
			},
			ready:{ _layout:[[0.07,0.07],[0.5,0.5],[0,-1.5]], 
			        _run:function(){  CheckReadyVisible(this,0); },
                    _event:{
						moveHead:function()  { CheckReadyVisible(this,-1);}
						,addPlayer:function(){ CheckReadyVisible(this,0); },
						removePlayer:function(){ CheckReadyVisible(this,0); }
						,onlinePlayer:function(){CheckReadyVisible(this,0); }
					} 					
				},
			stand:{_layout:[[0.057,0],[0.5,0],[7,0.7]],_visible:false},
			
			up:{  _layout:[[0.057,0],[0,0],[0.8,0.7]],_visible:false},
			down:{_layout:[[0.057,0],[0,0],[3,1]],_visible:false},
			
			out1:{_layout:[[0,0.07],[0.5,0],[-6,5.2]],_visible:false},
			out0:{_layout:[[0,0.07],[0.5,0],[-6,4.5]],_visible:false},
			effectStateAct:{
				_run:function () {
					this.zIndex=100;
				},
				ef_gang:{
					_layout:[[0.1,0.1],[0.5,0.25],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				},
				ef_peng:{
					_layout:[[0.1,0.1],[0.5,0.25],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				},
				ef_chi:{
					_layout:[[0.1,0.1],[0.5,0.25],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				},
				ef_guo:{
					_layout:[[0.1,0.1],[0.5,0.25],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				},
				ef_hu:
				{
					_layout:[[0.2,0.2],[0.5,0.25],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				}
			},
			_event:{
				clearCardUI:function(){ clearCardUI(this,0); },
				initSceneData:function(eD){ SetPlayerVisible(this,0);},
				addPlayer:function(eD){ SetPlayerVisible(this,0);},
				removePlayer:function(eD){ SetPlayerVisible(this,0);},
				mjhand:function(eD){ InitPlayerHandUI(this,0); },
				roundEnd:function(){ InitPlayerNameAndCoin(this,0); },
				newCard:function(eD){HandleNewCard(this,eD,0);},
				MJPut:function(eD){  //HandleMJPut(this,eD,0); 
				},
				MJChi:function(eD){ HandleMJChi(this,eD,0); },
				MJGang:function(eD){ HandleMJGang(this,eD,0); },
				MJPeng:function(eD){ HandleMJPeng(this,eD,0); },
				onlinePlayer:function(eD){ setOffline(this,0); },
				MJTick:function(eD){ setOffline(this,0); }
			}
		},

		right:
        {
			head:
            {
                kuang:
                {
                    _run:function ()
                    {
                        this.zIndex = 2;
                    }
                },
                zhuang:{
                    _run:function()
                    {
                        this.visible =false;
                    }
                    ,_event:
                    {
                        waitPut:function(){showPlayerZhuangLogo(this,1);},
                        initSceneData:function(){if(CheckArrowVisible()) showPlayerZhuangLogo(this,1);}
                    }
                },
                chatbg:{_run:function(){this.getParent().zIndex = 500;},chattext:{_event:{

                        MJChat:function(msg){

                            showchat(this,1,msg);
                        },playVoice:function (voicePath)
                        {
                            jsclient.data._tempMessage.msg = voicePath;
                            showchat(this,1, jsclient.data._tempMessage);
                        }
                }}},
                _click:function(btn){ showPlayerInfo(1,btn);
                },

			},
			
			ready:{ _layout:[[0.07,0.07],[0.5,0.5],[2,0]], 
			        _run:function(){  CheckReadyVisible(this,1); },
                    _event:{
						moveHead:function()  { CheckReadyVisible(this,-1);}
						,addPlayer:function(){ CheckReadyVisible(this,1); },removePlayer:function(){ CheckReadyVisible(this,1); }
						,onlinePlayer:function(){  CheckReadyVisible(this,1); }
					} 					
				},


			stand:{_layout:[[0,0.08],[1,1],[-7,-2.5]],_visible:false},
			
			up:{_layout:  [[0,0.05],[1,0],[-4,6]],_visible:false},
			down:{_layout:[[0,0.05],[1,0],[-4,6.3]],_visible:false},

			out0:{_layout:[[0,0.05],[1,0.5],[-6,-3.8]],_visible:false},
			out1:{_layout:[[0,0.05],[1,0.5],[-7,-3.8]],_visible:false},
			effectStateAct:{
				//_layout:[[0.1,0.1],[0.1,0.5],[0,0],true],
				_run:function(){
					this.zIndex=100;
				},
				ef_gang:{
					_layout:[[0.1,0.1],[0.7,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}

				},
				ef_peng:{
					_layout:[[0.1,0.1],[0.7,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}},
				ef_chi:{
					_layout:[[0.1,0.1],[0.7,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_guo:{
					_layout:[[0.1,0.1],[0.7,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_hu:
				{
					_layout:[[0.2,0.2],[0.7,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				}
			},
			_event:{
				clearCardUI:function(){ clearCardUI(this,1); },
				initSceneData:function(eD){ SetPlayerVisible(this,1);},
				addPlayer:function(eD){ SetPlayerVisible(this,1);},removePlayer:function(eD){ SetPlayerVisible(this,1);},
				mjhand:function(eD){ InitPlayerHandUI(this,1); },
				roundEnd:function(){ InitPlayerNameAndCoin(this,1); },
				waitPut:function(eD){HandleWaitPut(this,eD,1);},
				MJPut:function(eD){ HandleMJPut(this,eD,1); },
				MJChi:function(eD){ HandleMJChi(this,eD,1); },
				MJGang:function(eD){ HandleMJGang(this,eD,1); },
				MJPeng:function(eD){ HandleMJPeng(this,eD,1); },
				onlinePlayer:function(eD){ setOffline(this,1); },
				MJTick:function(eD){ setOffline(this,1); }
			}
		},
		
		top:{
			head:{
                kuang:
                {
                    _run:function ()
                    {
                        this.zIndex = 2;
                    }
                },
				zhuang:{
						_run:function()
						{
							this.visible =false;
						},_event:{
							waitPut:function(){showPlayerZhuangLogo(this,2);}
							,initSceneData:function(){if(CheckArrowVisible()) showPlayerZhuangLogo(this,2);}
						}
						
					},chatbg:{_run:function(){this.getParent().zIndex = 10000;},chattext:{_event:{

							MJChat:function(msg){
								
								showchat(this,2,msg);
							},playVoice:function (voicePath)
							{
								jsclient.data._tempMessage.msg = voicePath;
								showchat(this,2, jsclient.data._tempMessage);
							}
					}}}
			,_click:function(btn){ showPlayerInfo(2,btn);	 },
			
			},
			ready:{ _layout:[[0.07,0.07],[0.5,0.5],[0,1.5]], 
			        _run:function(){  CheckReadyVisible(this,2); },
                    _event:{
						moveHead:function()  { CheckReadyVisible(this,-1);}
						,addPlayer:function(){ CheckReadyVisible(this,2); },removePlayer:function(){ CheckReadyVisible(this,2); }
						,onlinePlayer:function(){  CheckReadyVisible(this,2); }
					} 					
				},

			stand:{_layout:[[0,0.07],[0.5,1],[-6,-2.5]],_visible:false},
			
			up:{  _layout:[[0,0.07],[0.5,1],[6,-2.5]],_visible:false},
			down:{_layout:[[0,0.07],[0.5,1],[6,-2.2]],_visible:false},
			
			out0:{_layout:[[0,0.07],[0.5,1],[5,-4.6]],_visible:false},
			out1:{_layout:[[0,0.07],[0.5,1],[5,-5.3]],_visible:false},
			effectStateAct:{
				_run:function(){
					this.zIndex=100;
				},
				ef_gang:{
					_layout:[[0.1,0.1],[0.5,0.7],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_peng:{
					_layout:[[0.1,0.1],[0.5,0.7],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_chi:{
					_layout:[[0.1,0.1],[0.5,0.7],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_guo:{
					_layout:[[0.1,0.1],[0.5,0.7],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_hu:
				{
					_layout:[[0.2,0.2],[0.5,0.7],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				}
			},
			_event:{
				clearCardUI:function(){ clearCardUI(this,2); },
				initSceneData:function(eD){ SetPlayerVisible(this,2);},
				addPlayer:function(eD){ SetPlayerVisible(this,2);},removePlayer:function(eD){ SetPlayerVisible(this,2);},
				mjhand:function(eD){ InitPlayerHandUI(this,2); },
				roundEnd:function(){ InitPlayerNameAndCoin(this,2); },
				waitPut:function(eD){HandleWaitPut(this,eD,2);},
				MJPut:function(eD){ HandleMJPut(this,eD,2); },
				MJChi:function(eD){ HandleMJChi(this,eD,2); },
				MJGang:function(eD){ HandleMJGang(this,eD,2); },
				MJPeng:function(eD){ HandleMJPeng(this,eD,2); },
				onlinePlayer:function(eD){ setOffline(this,2); },
				MJTick:function(eD){ setOffline(this,2); }
			}
		},

		left:{
			head:{
                kuang:
                {
                    _run:function ()
                    {
                        this.zIndex = 2;
                    }
                },
			zhuang:{
						_run:function()
						{
							this.visible =false;
						},_event:{
							waitPut:function(){showPlayerZhuangLogo(this,3);}
							,initSceneData:function(){if(CheckArrowVisible()) showPlayerZhuangLogo(this,3);}
						}
					},chatbg:{_run:function(){this.getParent().zIndex = 500;},chattext:{_event:{

							MJChat:function(msg){
								
								showchat(this,3,msg);
							},playVoice:function (voicePath)
							{
								jsclient.data._tempMessage.msg = voicePath;
								showchat(this,3, jsclient.data._tempMessage);
							}
					}}}
			,_click:function(btn){ showPlayerInfo(3,btn);	 },
			},
			ready:{ _layout:[[0.07,0.07],[0.5,0.5],[-2,0]], 
			        _run:function(){  CheckReadyVisible(this,3); },
                    _event:{
						moveHead:function()  { CheckReadyVisible(this,-1);}
						,addPlayer:function(){ CheckReadyVisible(this,3); },removePlayer:function(){ CheckReadyVisible(this,3); }
						,onlinePlayer:function(){  CheckReadyVisible(this,3); }
					} 					
				},

			up:{_layout:  [[0,0.05],[0,1],[3.6,-3.3]],_visible:false},
			down:{_layout:[[0,0.05],[0,1],[3.6,-3]],_visible:false},
			stand:{_layout:[[0,0.08],[0,0],[6.5,3]],_visible:false},
			
			out0:{_layout:[[0,0.05],[0,0.5],[5.5,3.7]],_visible:false},
			out1:{_layout:[[0,0.05],[0,0.5],[6.5,3.7]],_visible:false},
			effectStateAct:{
				_run:function () {
					this.zIndex=100;
				},
				ef_gang:{
					_layout:[[0.1,0.1],[0.5,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_peng:{
					_layout:[[0.1,0.1],[0.5,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_chi:{
					_layout:[[0.1,0.1],[0.5,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_guo:{
					_layout:[[0.1,0.1],[0.5,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				},
				ef_hu:
				{
					_layout:[[0.2,0.2],[0.5,0.5],[0,0],true],
					_run:function(){
						this.visible=false;
					}
				}
			},
			_event:{
				clearCardUI:function(){ clearCardUI(this,3); },
				initSceneData:function(eD){ SetPlayerVisible(this,3);},
				addPlayer:function(eD){ SetPlayerVisible(this,3);},removePlayer:function(eD){ SetPlayerVisible(this,3);},
				mjhand:function(eD){ InitPlayerHandUI(this,3); },
				roundEnd:function(){ InitPlayerNameAndCoin(this,3); },
				waitPut:function(eD){HandleWaitPut(this,eD,3);},
				MJPut:function(eD){ HandleMJPut(this,eD,3); },
				MJChi:function(eD){ HandleMJChi(this,eD,3); },
				MJGang:function(eD){ HandleMJGang(this,eD,3); },
				MJPeng:function(eD){ HandleMJPeng(this,eD,3); },
				onlinePlayer:function(eD){ setOffline(this,3); },
				MJTick:function(eD){ setOffline(this,3); }
			}
		},

        eat:{
			
			chi0:{_visible:false,_layout:[[0,0.1],[0.5,0],[1.3,2.5]]
				,_touch:function(btn,eT){ if(eT==2) MJChichange(btn.tag); }
					,bgimg:{_run:function(){ this.zIndex = -1;}}
					,bgground:{_run:function(){ this.zIndex = -1;}}
					,card1:{}
					,card2:{}
					,card3:{}
				},chi1:
			{_visible:false,_layout:[[0,0.1],[0.5,0],[1.3,3.8]]
				,_touch:function(btn,eT){ if(eT==2) MJChichange(btn.tag); }
			},chi2:
			{_visible:false,_layout:[[0,0.1],[0.5,0],[1.3,5.1]]
				,_touch:function(btn,eT){ if(eT==2) MJChichange(btn.tag); }
					
			},peng:{_visible:false,_layout:[[0,0.1],[0.5,0],[0,2.5]],_touch:function(btn,eT){ if(eT==2) MJPeng2Net(); }	,bgimg:{_run:function(){ this.zIndex = -1;}}},
			gang0:{_visible:false,_layout:[[0,0.1],[0.5,0],[-1.7,2.5]],card1:{},_touch:function(btn,eT){ if(eT==2) MJGangchange(btn.tag); },bgimg:{_run:function(){ this.zIndex = -1;}}
			,bgground:{_run:function(){ this.zIndex = -1;}}},
			gang1:{_visible:false,_layout:[[0,0.1],[0.5,0],[-1.7,3.8]],card:{},_touch:function(btn,eT){ if(eT==2) MJGangchange(btn.tag); }},
			gang2:{_visible:false,_layout:[[0,0.1],[0.5,0],[-1.7,5.1]],card:{},_touch:function(btn,eT){ if(eT==2) MJGangchange(btn.tag); }},
			guo:{_visible:false,_layout:[[0,0.1],[0.5,0],[4.6,2.5]],_touch:function(btn,eT){ if(eT==2) jsclient.MJPass2Net(); }	,bgimg:{_run:function(){ this.zIndex = -1;}}},
			hu:{_visible:false,_layout:[[0,0.1],[0.5,0],[-3,2.5]],_touch:function(btn,eT){ if(eT==2) MJHu2Net(); }	,bgimg:{_run:function(){ this.zIndex = -1;}}},
			changeui:{
				changeuibg:{
					_layout:[[0.2,0.2],[0.5,0],[0,0]]
					,_run:function(){
						this.y = this.getParent().getParent().getChildByName("chi0").y;
					}
					,card1:{
						_touch:function(btn,et){if(et==2){MJChi2Net(0);}}
					}
					,card2:{
						_touch:function(btn,et){if(et==2){MJChi2Net(0)}}
					}
					,card3:{
						_touch:function(btn,et){if(et==2){MJChi2Net(0)}}
					}
					,card4:{
						_touch:function(btn,et){if(et==2){MJChi2Net(1)}}
					}
					,card5:{
						_touch:function(btn,et){
						if(et==2)
						{
							if (btn.getParent().getChildByName("card4").visible) 
							{
								MJChi2Net(1);	
							}else
							{
								 MJGang2Net(btn.tag);	
							}
						}
						}
					}
					,card6:{
						_touch:function(btn,et){if(et==2){MJChi2Net(1)}}
					}
					,card7:{
						_touch:function(btn,et){if(et==2)
						{
							if (btn.getParent().getChildByName("card8").visible) 
							{
								MJChi2Net(2);	
							}else
							{
								 MJGang2Net(btn.tag);	
							}
						}
						}
					}
					,card8:{
						_touch:function(btn,et){if(et==2){MJChi2Net(2)}}
					}
					,card9:{
						_touch:function(btn,et){if(et==2){
							if (btn.getParent().getChildByName("card8").visible) 
							{
								MJChi2Net(2);	
							}else
							{
								 MJGang2Net(btn.tag);	
							}
							
						}}
					}
					,guobg:{
						guo:{
							_touch:function(btn,eT){ if(eT==2) jsclient.MJPass2Net();}
						}
						,fanhui:{
						_touch:function(btn,et){
							if(et==2)
							{
								btn.getParent().getParent().visible =false;
								CheckEatVisible(jsclient.playui.jsBind.eat);
							}
							}
						}
					}

				}
			}
			,_event:{
				MJPass:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				mjhand:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				waitPut:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				MJPut:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				MJPeng:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				MJChi:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				MJGang:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				roundEnd:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat);   },
				initSceneData:function(eD){ CheckEatVisible(jsclient.playui.jsBind.eat); }
				
			}
		},

        chat_btn:
		{
			_layout:[[0.12,0.12],[0.933,0.4],[0,0]]
			,_click:function()
			{
					var chatlayer= new ChatLayer();
					jsclient.Scene.addChild(chatlayer); 	
			}
		},

        voice_btn:
		{
			_layout:[[0.12,0.12],[0.933,0.25],[0,0]],
			_run:function ()
            {
				initVData();
				cc.eventManager.addListener(getTouchListener(), this);
				//ios隐藏
				//if(cc.sys.OS_IOS==cc.sys.os) this.visible=false;
			},
            _touch:function(btn,eT)
			{
				// 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
				if(eT == 0)
				{
					startRecord();
				}
				else if(eT==2)
				{
					endRecord();
				}else if(eT == 3)
				{
					cancelRecord();
				}
			},
            _event:
			{
				cancelRecord: function ()
				{
					jsclient.native.HelloOC("cancelRecord !!!");
				},

				uploadRecord: function(filePath)
				{
					if (filePath)
					{
						jsclient.native.HelloOC("upload voice file");
						jsclient.native.UploadFile(filePath, jsclient.remoteCfg.voiceUrl, "sendVoice");
					}else
					{
						jsclient.native.HelloOC("No voice file update");
					}
				},

                sendVoice: function (fullFilePath)
				{
					if (!fullFilePath)
					{
						console.log("sendVoice No fileName");
						return;
					}

					var getFileName =  /[^\/]+$/ ;
					var extensionName = getFileName.exec(fullFilePath);
					var fileName = extensionName[extensionName.length - 1];
					console.log("sfileName is:" + fileName);

					jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"downAndPlayVoice",uid:SelfUid() ,type:3, msg:fileName ,num:jsclient.data._JiaheTempTime});
					jsclient.native.HelloOC("download file");
				},

                downAndPlayVoice:function (msg)
				{
					jsclient.native.HelloOC("downloadPlayVoice ok");
					jsclient.data._tempMessage = msg;
					jsclient.native.HelloOC("mas is" + JSON.stringify(msg));
					downAndPlayVoice(msg.uid, msg.msg);
				}
			}
		},
	},

	ctor:function ()
    {
	    this._super();
	    var playui = ccs.load(res.Play_json);
        playMusic("bgFight");
		ConnectUI2Logic(playui.node,this.jsBind);
        this.addChild(playui.node);
		jsclient.lastMJTick=Date.now();
		this.runAction( cc.repeatForever( cc.sequence(cc.callFunc(function(){ if(jsclient.game_on_show) jsclient.tickGame(0); }),cc.delayTime(7)) ) );
		jsclient.playui=this;
        return true;
	},
});