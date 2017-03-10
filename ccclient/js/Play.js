

var TableState =
{
    waitJoin: 1,
    waitReady: 2,
    waitPut: 3,
    waitEat: 4,
    waitCard: 5,
    roundFinish: 6,
    isReady: 7
};

//图片提示
var ActionType =
{
    CHI: 1,
    PENG: 2,
    GANG: 3,
    LIANG: 4,
    HU: 5,
    GUO: 6,
    FLOWER: 7,
    ZHONG:8,
};

//是否是三人麻将
function IsThreeTable()
{
    var sData=jsclient.data.sData;
    var tData=sData.tData;

    return (tData.maxPlayer==3);
}

//是否轮到当前玩家
function IsCurPlayerTurn(off)
{
    var sData=jsclient.data.sData;
    var tData=sData.tData;
    if(IsThreeTable())
    {
        if(off==2)
            return false;
        else if(off==3)
            off=2;
    }
    var uids=tData.uids;
    var selfIndex=(uids.indexOf(SelfUid())+off)%tData.maxPlayer;

    return (tData.curPlayer==selfIndex);
}

function getUIPlayerUid(off)
{
    var pl = getUIPlayer(off);
    if(pl)
    {
        return pl.info.uid;
    }
    else
    {
        return -1;
    }
}

//防止显示 多牌或者少牌。正常是，1,4,7,10,13
function getNodeNumByName(node,name)
{
    var standNum = 0;
    var children=node.children;
    for (var i = 0; i < children.length; i++) {
        var ci = children[i];
        if(ci.name==name)
        {
            standNum++;
        }
    }
    return standNum;
}

function getUIOffByIndex(index)
{
    var sData=jsclient.data.sData;
    var tData=sData.tData;
    var uids=tData.uids;
    var selfIndex=uids.indexOf(SelfUid());
    var uioff = (index+tData.maxPlayer-selfIndex)%tData.maxPlayer;
    //修正uioff
    if(uioff == 2 && IsThreeTable())
    {
        uioff = 3;
    }

    return uioff;
}

//重置右上角鬼牌效果
function resetEffectFangui(card, cardBk)
{
    if(jsclient.data.sData.tData.fanGui)
    {
        var guiTag = jsclient.data.sData.tData.gui;
        if(guiTag != 0)
        {
            card.visible = true;
            setCardPic(card, guiTag);
            log("任意鬼牌。。。。" + guiTag);
        }
        else
        {
            card.visible = false;
        }
    }

    if(jsclient.data.sData.tData.withZhong)
    {
        card.visible = true;
        log("红中鬼牌。。。。" + 71);
    }

    if(jsclient.data.sData.tData.gameType == 7)
    {
        card.visible = true;
        setCardPic(card, "hua");
        log("花是鬼牌。。。。" + 111);
    }

    cardBk.visible = false;
}

//重置右上角鬼牌效果2
function resetEffectFangui2(card1, card2, cardBk)
{
    var sData = jsclient.data.sData;

    if(sData.tData.fanGui && sData.tData.twogui)
    {
        var guiTag1 = sData.tData.gui;
        var guiTag2 = sData.tData.nextgui;
        if(guiTag1 != 0 && guiTag2 != 0)
        {
            card1.visible = true;
            card2.visible = true;
            setCardPic(card1, guiTag1);
            setCardPic(card2, guiTag2);

            log("任意双鬼牌。。。。" + guiTag1 + "    " + guiTag2);
        }
        else
        {
            card1.visible = false;
            card2.visible = false;
        }

        cardBk.visible = false;
    }
}

//鬼牌特效
function playAnimationByCard(cardNode, off)
{
    var cardGui = cardNode.getChildByName("gui");

    if(!cardGui)
    {
        log("传入的手牌没有鬼牌特效node..." + off);
        return;
    }

    if(cardGui && cardGui.visible)
    {
        log("已经有鬼牌特效...");
        return;
    }

    cardGui.visible = true;

    // if(cardNode.getChildByTag(9104))
    // {
    //     log("已经有鬼牌特效...");
    //     return;
    // }

    log("执行鬼牌特效...");
    // var animSpr = new cc.Sprite("res/MaJiangNew/gui.png");

    // cardNode.stopAllActions();
    // cardNode.addChild(animSpr,999,9104);

    // var animation = new cc.Animation();
    // for(var i = 1;i<=6;i++){
    //     var frame = cc.spriteFrameCache.getSpriteFrame("glint_00" + i + ".png");
    //     animation.addSpriteFrame(frame);
    // }
    //
    // animation.setDelayPerUnit(0.12);
    // animation.setRestoreOriginalFrame(true);
    // // var action = cc.animate(animation).repeatForever();
    // var action = cc.animate(animation);
    // animSpr.runAction(cc.repeatForever(cc.sequence(action, cc.delayTime(1.5))));

}

//播放鬼牌效果
function playEffectFangui(selfCard, selfCardBk, selfArrowbk)
{
    var guiTag = 0,showTag = 0;
    if(jsclient.data.sData.tData.withZhong)
        return;

    //花鬼
    if(jsclient.data.sData.tData.gameType == 7)
    {
        selfCard.visible = true;
        setCardPic(selfCard, "hua");
        return;
    }

    if(jsclient.data.sData.tData.fanGui)
        guiTag = jsclient.data.sData.tData.gui;

    if(guiTag == 0)
        return;

    if(jsclient.sameGeogUI)
        return;

    if(selfCard.visible )
    {
        setCardPic(selfCard, guiTag);
        return;
    }

    //翻鬼特效
    log("播放翻鬼牌特效1。。。。。。");

    if(guiTag < 30)
    {
        //条万筒
        if((guiTag - 1)%10 == 0)
            showTag = guiTag + 8;
        else
            showTag = guiTag - 1;
    }
    else
    {
        //风
        if(guiTag == 31)
            showTag = 91;
        else
            showTag = guiTag - 10;
    }

    setCardPic(selfCard, showTag);

    var startX = selfCardBk.x;
    var startY = selfCardBk.y;

    var onActionEnd = function ()
    {
        selfCard.visible = true;

        selfCardBk.x = startX;
        selfCardBk.y = startY;
        selfCardBk.visible = false;

        var onSetCardGui = function ()
        {
            setCardPic(selfCard, guiTag);
        };

        var onFanGuiEnd = function ()
        {
            selfArrowbk.visible = true;
        };

        selfCard.runAction(
            cc.sequence(
                cc.scaleTo(0.3, 0.8, 0.8),
                cc.delayTime(0.5),
                cc.callFunc(onSetCardGui),
                cc.delayTime(0.5),
                cc.moveTo(0.5, startX,startY),
                cc.callFunc(onFanGuiEnd)));

        selfCard.runAction(
            cc.sequence(
                cc.delayTime(1.3),
                cc.scaleTo(0.5, 0.45, 0.45)));
    };
    var actTime = cc.delayTime(0.5);
    var actScale = cc.scaleTo(0.3, 0, 0.8);
    var actCall = cc.callFunc(onActionEnd);
    var actSeq = cc.sequence(actTime, actScale, actCall);
    var size = jsclient.size;

    var ctnpos = selfCardBk.getParent().convertToNodeSpace(cc.p(size.width / 2, size.height / 2));

    selfCard.x = ctnpos.x;
    selfCard.y = ctnpos.y;
    selfCard.visible = false;
    selfCard.scaleX = 0;
    selfCard.scaleY = 0.8;

    selfCardBk.x = ctnpos.x;
    selfCardBk.y = ctnpos.y;
    selfCardBk.visible = true;
    selfCardBk.scaleX = 0.8;
    selfCardBk.scaleY = 0.8;
    selfCardBk.runAction(actSeq);

    selfArrowbk.visible = false;
}

//播放鬼牌效果2
function playEffectFangui2(selfCard1, selfCard2, selfCardBk1, selfArrowbk)
{
    var guiTag1 = 0, guiTag2 = 0, showTag = 0;
    if(jsclient.data.sData.tData.withZhong)
        return;

    if(jsclient.data.sData.tData.fanGui && jsclient.data.sData.tData.twogui)
    {
        guiTag1 = jsclient.data.sData.tData.gui;
        guiTag2 = jsclient.data.sData.tData.nextgui;
    };

    if(guiTag1 == 0 || guiTag2 == 0)
        return;

    if(jsclient.sameGeogUI)
        return;

    if(selfCard1.visible && selfCard2.visible)
    {
        setCardPic(selfCard1, guiTag1);
        setCardPic(selfCard2, guiTag2);
        return;
    }

    //翻鬼特效
    log("播放翻鬼牌特效2。。。。。。");

    // if(guiTag1 < 30)
    // {
    //     //条万筒
    //     if((guiTag1 - 1)%10 == 0)
    //         showTag = guiTag1 + 8;
    //     else
    //         showTag = guiTag1 - 1;
    // }
    // else
    // {
    //     //风
    //     if(guiTag1 == 31)
    //         showTag = 91;
    //     else
    //         showTag = guiTag1 - 10;
    // }
    //
    // setCardPic(selfCard1, showTag);

    setCardPic(selfCard1, guiTag1);
    setCardPic(selfCard2, guiTag2);

    var startX = selfCardBk1.x;
    var startY = selfCardBk1.y;

    var onActionEnd = function ()
    {
        selfCard1.visible = true;
        selfCardBk1.x = startX;
        selfCardBk1.y = startY;
        selfCardBk1.visible = false;

        var onSetCardGui = function ()
        {
            setCardPic(selfCard1, guiTag1);
            setCardPic(selfCard2, guiTag2);
        };

        var onFanGuiEnd = function ()
        {
            selfCard2.visible = true;
            selfArrowbk.visible = true;
        };

        selfCard1.runAction(
            cc.sequence(
                cc.scaleTo(0.3, 0.8, 0.8),
                cc.delayTime(1.0),
                // cc.callFunc(onSetCardGui),
                // cc.delayTime(0.5),
                cc.moveTo(0.5, startX,startY),
                cc.callFunc(onFanGuiEnd)));

        selfCard1.runAction(
            cc.sequence(
                cc.delayTime(1.3),
                cc.scaleTo(0.5, 0.45, 0.45)));
    };
    var actTime = cc.delayTime(0.5);
    var actScale = cc.scaleTo(0.3, 0, 0.8);
    var actCall = cc.callFunc(onActionEnd);
    var actSeq = cc.sequence(actTime, actScale, actCall);
    var size = jsclient.size;

    var ctnpos = selfCardBk1.getParent().convertToNodeSpace(cc.p(size.width / 2, size.height / 2));

    selfCard1.x = ctnpos.x;
    selfCard1.y = ctnpos.y;
    selfCard1.visible = false;
    selfCard1.scaleX = 0;
    selfCard1.scaleY = 0.8;

    selfCard2.visible = false;

    selfCardBk1.x = ctnpos.x;
    selfCardBk1.y = ctnpos.y;
    selfCardBk1.visible = true;
    selfCardBk1.scaleX = 0.8;
    selfCardBk1.scaleY = 0.8;
    selfCardBk1.runAction(actSeq);

    selfArrowbk.visible = false;
}

function ShowEatActionAnim(node, actType, off) 
{
    // log("播放打牌特效.........................：" + actType + "  off:" + off);

    if (off == 0)
        return;

    var eatNode = node.getChildByName("effectStateAct");
    var childActionNode = null;
    var chuldAnimNode = null;
    var callback = function ()
    {
        // if(chuldAnimNode)
        // {
        //     chuldAnimNode.visible = false;
        //     chuldAnimNode.removeFromParent(true);
        // }

        childActionNode.visible = false;
    };

    switch (actType) 
    {
    case ActionType.CHI:
        childActionNode = eatNode.getChildByName("ef_chi");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = eatNode.getChildByName("anim_chi");
        //有特效正在播放
        // if(chuldAnimNode)
        //     break;
        //
        // chuldAnimNode = playAnimByJson("chi", "chi");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        // chuldAnimNode.name = "anim_chi";

        break;
    case ActionType.GANG:
        childActionNode = eatNode.getChildByName("ef_gang");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = eatNode.getChildByName("anim_gang");
        //有特效正在播放
        // if(chuldAnimNode)
        //     break;
        //
        // chuldAnimNode = playAnimByJson("gang", "gang");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        // chuldAnimNode.name = "anim_gang";

        break;
    case ActionType.PENG:
        childActionNode = eatNode.getChildByName("ef_peng");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = eatNode.getChildByName("anim_peng");
        //有特效正在播放
        // if(chuldAnimNode)
        //     break;

        // chuldAnimNode = playAnimByJson("peng", "peng");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        // chuldAnimNode.name = "anim_peng";

        break;
    case ActionType.LIANG:
    // childActionNode=eatNode.getChildByName("ef_chi");;
    case ActionType.HU:
        childActionNode = eatNode.getChildByName("ef_hu");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = playAnimByJson("zimo", "zimo");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        //
        // chuldAnimNode = playAnimByJson("dianpao", "dianpao");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;

        break;
    case ActionType.FLOWER:
        childActionNode = eatNode.getChildByName("ef_hua");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = eatNode.getChildByName("anim_hua");
        //有特效正在播放
        // if(chuldAnimNode)
        //     break;

        // chuldAnimNode = playAnimByJson("hua", "hua");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        // chuldAnimNode.name = "anim_hua";

        break;
    case ActionType.ZHONG:
        childActionNode = eatNode.getChildByName("ef_zhong");
        childActionNode.visible = true;
        childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));

        // chuldAnimNode = eatNode.getChildByName("anim_zhong");
        //有特效正在播放
        // if(chuldAnimNode)
        //     break;

        // chuldAnimNode = playAnimByJson("zhong", "zhong");
        // eatNode.addChild(chuldAnimNode);
        // chuldAnimNode.x = childActionNode.x;
        // chuldAnimNode.y = childActionNode.y;
        // chuldAnimNode.scale = childActionNode.scale;
        // chuldAnimNode.name = "anim_zhong";

        break;
    default:
        break;
    }

}

//显示将要打出的麻将特效
function showPutCarEffect(node, card)
{
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if (ci.name == "up" || ci.name == "newout" || ci.name == "out" || ci.name == "out0" || ci.name == "out1" || ci.name == "out2"
            || ci.name == "peng" || ci.name == "chi")
        {
            var mask = ci.getChildByName("mask");
            if(mask && ci.tag == card)
                mask.visible = true;
            else if(mask)
                mask.visible = false;
        }
    }
}

//显示打出去的牌默认特效
function showDefCarCardEffect(node)
{
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if (ci.name == "up" || ci.name == "newout"
            || ci.name == "out" || ci.name == "out0"
            || ci.name == "out1" || ci.name == "out2"
            || ci.name == "peng" || ci.name == "chi")
        {
            var mask = ci.getChildByName("mask");
            if(mask && mask.visible)
                mask.visible = false;
        }
    }
}

//显示麻将听牌提示
function showCardTipsEffect(cards, pl)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var gameType = tData.gameType;
    var mjhand = pl.mjhand;

    if(gameType != 1 && gameType != 2 && gameType != 3)
        return;

    if(cards == null || cards.length <= 0)
        return;

    // cardTipsData = {"1":[1,2,3,4,5,6,],"2":[2],"3":[9],"5":[],"6":[],"9":[]};
    cardTipsData = {};
    cardTipsData = jsclient.majiang.canTingHu(mjhand);
    // log("听牌数据1： " + JSON.stringify(cardTipsData));

    if(gameType == 2 && tData.noCanJiHu)
    {
        //如果是鸡平胡 并且选择不可鸡胡
        for(var i = 0; i < pl.mjhand.length; i++)
        {
            var tipsData = cardTipsData[pl.mjhand[i]];
            if(tipsData == null || tipsData.length <= 0)
                continue;

            var tempData = [];
            var temppl = jsclient.majiang.deepCopy(pl);
            temppl.mjhand.splice(i, 1);
            
            for(var j = 0, k = 0; j < tipsData.length; j++)
            {
                var huType = jsclient.majiang.prejudgeHuType(temppl, tipsData[j]);
                var hu7Dui = jsclient.majiang.canHuNoZhong(!tData.canHu7, temppl.mjhand, tipsData[j], false);

                if(huType > 0 || hu7Dui == 7)
                {
                    tempData[k] = tipsData[j];
                    k ++;
                }
            }

            cardTipsData[pl.mjhand[i]] = tempData;
        }
    }

    // log("听牌数据2： " + JSON.stringify(cardTipsData));

    for(var i = 0; i < cards.length; i++)
    {
        var card = cards[i];
        if(card.name != "mjhand")
            continue;

        var tips = card.getChildByName("tips");
        if(cardTipsData[card.tag] && cardTipsData[card.tag].length > 0  && tips)
        {
            tips.visible = true;
        }
        else if(tips)
        {
            tips.visible = false;
        }
    }
}

//关闭麻将听牌提示
function closeCardTipsEffect(node)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var gameType = tData.gameType;

    if(gameType != 1 && gameType != 2 && gameType != 3)
        return;

    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        var tips = ci.getChildByName("tips");
        if(ci.name == "mjhand" && tips)
        {
            tips.visible = false;
        }
    }
}

//显示胡牌提示框
var tipsCards = [];
function showCanHuTipsPanel(node, tag)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var gameType = tData.gameType;

    if(gameType != 1 && gameType != 2 && gameType != 3)
        return;

    if(cardTipsData[tag] && cardTipsData[tag].length > 0)
    {
        node.visible = true;
    }
    else
    {
        node.visible = false;
        return;
    }

    if(cardTipsData[tag].length > 13)
    {
        //超过13张不提示
        node.visible = false;
        return;
    }

    var defW = 125;
    var defH = 125;
    var cardOffx = 30;
    var cardOffy = 20;

    var tipsCount = cardTipsData[tag].length;
    var card = node.getChildByName("card");
    var huImg = node.getChildByName("hu");

    var ws = cc.director.getWinSize();
    var cardSize = card.getContentSize();
    // var cardRow = parseInt(tipsCount % 4) == 0 ? parseInt(tipsCount / 4) : parseInt(tipsCount % 4) + 1;
    // var cardCol = tipsCount;

    card.visible = false;

    backSizeW = defW + tipsCount * (cardSize.width * card.scaleX + cardOffx);
    backSizeH = defH;

    node.setContentSize(cc.size(backSizeW, backSizeH));
    node.x = ws.width / 2;

    //清理以前的提示
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        if(children[i] && children[i].name == "tips")
        {
            children[i].visible = false;
            children[i].removeFromParent();
        }
    }

    //增加现在的
    for(var i = 0; i < tipsCount; i++)
    {
        var cardClone = card.clone();

        cardClone.name = "tips";
        cardClone.visible = true;
        cardClone.x = defW + i * (cardSize.width * card.scaleX + cardOffx);
        cardClone.y = card.y;
        node.addChild(cardClone);

        setCardPic(cardClone, cardTipsData[tag][i]);
    }

    // log("胡牌提示框大小：W " + backSizeW + "  H " + backSizeH + "  R " + cardRow + " C " + cardCol);
}


function SelfUid() {
    return jsclient.data.pinfo.uid
}

function IsMyTurn() {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    return SelfUid() == tData.uids[tData.curPlayer];
}


//打牌
function PutAwayCard(cdui, cd)
{
    var mjhandNum = 0;
    var children = cdui.parent.children;
    var standUI = cdui.parent.getChildByName("stand");
    for (var i = 0; i < children.length; i++)
    {
        if (children[i].name == "mjhand")
        {
            if (children[i].y > standUI.y + 10)
                children[i].y = standUI.y;

            mjhandNum++;
        }
    }

    var pl = getUIPlayer(0);
    if(!pl)
        return;

    if (mjhandNum == pl.mjhand.length)
    {
        jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPut", card: cd});
        jsclient.lastPutPos = {x: cdui.x, y: cdui.y};
        HandleMJPut(cdui.parent, {uid: SelfUid(), card: cd}, 0);
        cdui.stopAllActions();
    }
}


function getEatFlag() {
    var eat = jsclient.playui.jsBind.eat;
    var eatFlag = 0;

    if (eat.gang0._node.visible)
        eatFlag = eatFlag + 4;

    if (eat.hu._node.visible)
        eatFlag = eatFlag + 8;

    if (eat.chi0._node.visible)
        eatFlag = eatFlag + 1;

    if (eat.peng._node.visible)
        eatFlag = eatFlag + 2;

    return eatFlag;
}

//过胡
jsclient.MJPass2Net = function ()
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (IsMyTurn() && tData.tState == TableState.waitPut)
    {
        var eat = jsclient.playui.jsBind.eat;
        var msg = "确认过";
        if (eat.gang0._node.visible) msg += " 杠 ";
        if (eat.hu._node.visible)    msg += " 胡 ";
        jsclient.showMsg(msg + "吗?", function ()
        {
            eat.gang0._node.visible = false;
            eat.hu._node.visible = false;
            eat.guo._node.visible = false;
        }, function () {}, "1");
    }
    else
    {
        if (jsclient.playui.jsBind.eat.hu._node.visible)
            jsclient.showMsg("确认不胡吗?", ConfirmMJPass, function () {}, "1");
        else
            ConfirmMJPass();
    }
};

function MJGang2Net(cd)
{
    log("玩家杠..." + cd);
    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJGang", card: cd, eatFlag: getEatFlag()});
}

function MJChi2Net(pos)
{
    log("玩家吃..." + pos);
    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJChi", pos: pos, eatFlag: getEatFlag()});
}

function MJHu2Net()
{
    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJHu", eatFlag: getEatFlag()});
}

function MJPeng2Net()
{
    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPeng", eatFlag: getEatFlag()});
}

function ConfirmMJPass()
{
    var pl = getUIPlayer(0);

    if(!pl)
        return;

    switch (jsclient.data.sData.tData.gameType)
    {
        case 1:
            break;
        case 2:
        {
            if (jsclient.playui.jsBind.eat.hu._node.visible) {
                console.log("没点pass 缺点了================");
                pl.skipHu = true;
                pl.mjState = 4;
            }

            if (jsclient.playui.jsBind.eat.peng._node.visible) {
                var sData = jsclient.data.sData;
                var tData = sData.tData;
                var card = tData.lastPut;
                pl.skipPeng.push(card);
            }
        }
            break;
        case 4:
        {
            if (jsclient.playui.jsBind.eat.hu._node.visible) {
                console.log("没点pass 缺点了================");
                pl.skipHu = true;
                pl.mjState = 4;
            }
        }
            break;
        case 5:
        {
            if (jsclient.playui.jsBind.eat.peng._node.visible) {
                var sData = jsclient.data.sData;
                var tData = sData.tData;
                var card = tData.lastPut;
                pl.skipPeng.push(card);
            }
        }
            break;
        case 8:
        {
            if (jsclient.playui.jsBind.eat.hu._node.visible) {
                pl.skipHu = true;
                pl.mjState = 4;
            }
        }
            break;
        default:
            break;
    }

    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPass", eatFlag: getEatFlag()});
}

function ShowMjChiCard(node, off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;

    if (off == 0)
    {
        var card1 = node.getChildByName("card1");
        var card2 = node.getChildByName("card2");
        var card3 = node.getChildByName("card3");
        card1.visible = true;
        card2.visible = true;
        card3.visible = true;
        setCardPic(card1, tData.lastPut);
        setCardPic(card2, tData.lastPut + 1);
        setCardPic(card3, tData.lastPut + 2);

    }
    else if (off == 1)
    {
        var card1 = node.getChildByName("card4");
        var card2 = node.getChildByName("card5");
        var card3 = node.getChildByName("card6");

        card1.visible = true;
        card2.visible = true;
        card3.visible = true;
        setCardPic(card1, tData.lastPut - 1);
        setCardPic(card2, tData.lastPut);
        setCardPic(card3, tData.lastPut + 1);
    }
    else if (off == 2)
    {
        var card1 = node.getChildByName("card7");
        var card2 = node.getChildByName("card8");
        var card3 = node.getChildByName("card9");

        card1.visible = true;
        card2.visible = true;
        card3.visible = true;
        setCardPic(card1, tData.lastPut - 2);
        setCardPic(card2, tData.lastPut - 1);
        setCardPic(card3, tData.lastPut);
    }
}

function CheckChangeuiVisible()
{
    if(jsclient.playui)
        jsclient.playui.jsBind.eat.changeui.changeuibg._node.visible = false;
    else if(jsclient.replayui)
        jsclient.replayui.jsBind.eat.changeui.changeuibg._node.visible = false;
}

function ShowSkipHu()
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var jsonui = ccs.load("res/SkipHu.json");

    //潮汕叫逼胡 鸡平胡叫
    if(tData.gameType == 8)
        jsonui.node.getChildByName("Image_1").getChildByName("Text_1").setString("逼胡");
    else if(tData.gameType == 4)
        jsonui.node.getChildByName("Image_1").getChildByName("Text_1").setString("漏胡");
    else
        jsonui.node.getChildByName("Image_1").getChildByName("Text_1").setString("过胡");

    doLayout(jsonui.node.getChildByName("Image_1"), [0.2, 0.2], [0.5, 0.3], [0, 0]);
    jsclient.Scene.addChild(jsonui.node);
    jsonui.node.runAction(cc.sequence(cc.delayTime(1.5), cc.removeSelf()));
}

function ShowSkipPeng()
{
    var jsonui = ccs.load("res/SkipHu.json");
    jsonui.node.getChildByName("Image_1").getChildByName("Text_1").setString("过碰");
    doLayout(jsonui.node.getChildByName("Image_1"), [0.2, 0.2], [0.5, 0.3], [0, 0]);
    jsclient.Scene.addChild(jsonui.node);
    jsonui.node.runAction(cc.sequence(cc.delayTime(1.5), cc.removeSelf()));
}

function RequestFlower()
{
    var pl = getUIPlayer(0);
    if (pl)
    {
        function canFlower(hand)
        {
            for (var i = 0; i < hand.length; i++)
            {
                if (jsclient.majiang.isFlower8(hand[i]))
                {
                    return hand[i];
                }
            }
            return -1;
        }

        return canFlower(pl.mjhand);
    }
    return -1;
}

function RequestZhong()
{
    var pl = getUIPlayer(0);
    if (pl)
    {
        function canZhong(hand)
        {
            for (var i = 0; i < hand.length; i++)
            {
                if (hand[i] == 71)
                {
                    return hand[i];
                }
            }
            return -1;
        }

        return canZhong(pl.mjhand);
    }
    return -1;
}

//
function CheckEatVisible(eat)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    jsclient.majiang.isClient = true;
    CheckChangeuiVisible();
    
    switch (tData.gameType)
    {
    case 1:
    case 2:
    case 3:
        break;
    case 4:
        CheckEatVisibleForJiPingHu(eat);
        return;
    case 5:
        CheckEatVisibleForDongGuan(eat);
        return;
    case 6:
        CheckEatVisibleFoYiBaiZhang(eat);
        return;
    case 7:
        CheckEatVisibleForHeYuanBaiDa(eat);
        return;
    case 8:
        CheckEatVisibleForChaoShan(eat);
        return;
    }

    var leftCard = tData.cardsNum - tData.cardNext;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;

    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    var vnode = [];

    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            if (jsclient.data.sData.tData.gameType == 2 )
            {
                var flowerCard = RequestFlower();
                if (flowerCard > 0)
                {
                    var cduis = jsclient.playui.jsBind.down._node.children;
                    var cardIndex = null;
                    for (var i = cduis.length - 1; i >= 0; i--)
                    {
                        if (cduis[i].name == "mjhand" && cduis[i].tag == flowerCard)
                        {
                            cardIndex = i;
                            break;
                        }
                    }
                    if (cardIndex)
                    {
                        var callback = function ()
                        {
                            PutAwayCard(cduis[cardIndex], flowerCard);
                        };
                        cduis[cardIndex].runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(callback)));
                        return;
                    }
                }
            }

            if(jsclient.data.sData.tData.gameType == 1)
            {
                if (
                    pl.isNew &&
                    mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui) > 0 &&
                    mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui) != 13
                )
                {
                    vnode.push(eat.hu._node);
                }
            }
            else
            {
                if(jsclient.data.sData.tData.gameType == 2)
                {
                    var huhu = mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);
                    if (pl.isNew && huhu > 0
                        &&  (mj.prejudgeHuType(pl) > 0 || (mj.prejudgeHuType(pl) == 0 && !tData.noCanJiHu) || huhu == 7)//鸡胡且可以鸡胡 或非鸡胡
                    )
                    {
                        vnode.push(eat.hu._node);
                    }
                }
                else
                {
                    if (pl.isNew && mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu) > 0)
                    {
                        vnode.push(eat.hu._node);
                    }
                }
            }

            //判断红中癞子
            var horse = 0;
            var rtn;
            if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && !jsclient.data.sData.tData.baozhama && jsclient.data.sData.tData.horse >= 2 && jsclient.data.sData.tData.guiJiaMa)
                horse = jsclient.data.sData.tData.horse + 2;
            else
                horse = jsclient.data.sData.tData.horse;

            if ((jsclient.data.sData.tData.gameType == 3 || jsclient.data.sData.tData.gameType == 1) && jsclient.data.sData.tData.jiejieGao)
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(sData.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (sData.players[tData.uids[i]].linkHu)*2;
                }
            }
            if (horse > 0)
                rtn = leftCard > (horse) ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else
                rtn = leftCard > (0) ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0)
            {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1)
                {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                }
                else
                {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat)
    {
        if (!IsMyTurn()) 
        {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui);

            if ((tData.gameType == 1 || tData.gameType == 3 ) && tData.putType == 4 )
                huType = 0;

            if (tData.gameType == 1 || tData.gameType == 3 )
            {
                if (huType > 0)
                {
                    var canHu = false;
                    if ((tData.putType == 0 && tData.canEatHu) || tData.putType == 4)
                    {
                        canHu = true;
                    }
                    else if (tData.putType > 0 && tData.putType < 4)
                    {
                        if (tData.canEatHu)
                        {
                            if (tData.putType != 3 && tData.putType != 1 || (huType == 13 && jsclient.data.sData.tData.gameType != 1))
                            {
                                canHu = true;
                            }
                        }
                        else
                        {
                            if (tData.putType != 3 && tData.putType != 1 || (huType == 13 && jsclient.data.sData.tData.gameType != 1))
                            {
                                canHu = true;
                            }
                        }
                    }
                    if (canHu)
                    {
                        if (pl.skipHu)
                            ShowSkipHu();
                        else
                            vnode.push(eat.hu._node);
                    }
                }
            } 
            else if (tData.gameType == 2) //惠州庄
            {
                var huizhouhuType = mj.HUI_ZHOU_HTYPE.ERROR;
                if (huType > 0)
                {
                    huizhouhuType = mj.prejudgeHuType(pl, tData.lastPut);
                }
                if (huType > 0)
                {
                    var canHu = false;
                    if ((tData.putType == 0 || tData.putType == 4) && (huizhouhuType > 0 || huType == 7))
                    {
                        canHu = true;
                    }
                    else if (tData.putType > 0 && tData.putType < 4)
                    {
                        if (tData.canEatHu)
                        {
                            if (tData.putType != 3 || huType == 13)
                            {
                                canHu = true;
                            }
                        }
                        else
                        {
                            if (tData.putType != 3 && tData.putType!= 1 && (huizhouhuType > 0 || (huizhouhuType == 0 && !tData.noCanJiHu)) || huType == 13 )
                            {
                                canHu = true;
                            }
                        }
                    }
                    if (canHu)
                    {
                        if (pl.skipHu)
                        {
                            ShowSkipHu();
                        }
                        else
                            vnode.push(eat.hu._node);
                    }
                }
            }

            if ((tData.putType == 0 || tData.putType == 4))
            {
                var horse = 0;
                var rtn;
                if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && !jsclient.data.sData.tData.baozhama && jsclient.data.sData.tData.horse >= 2 && jsclient.data.sData.tData.guiJiaMa)
                    horse = jsclient.data.sData.tData.horse + 2;
                else
                    horse = jsclient.data.sData.tData.horse;

                if ((tData.gameType == 3 || tData.gameType == 1)&& jsclient.data.sData.tData.jiejieGao)
                {
                    //所有玩家中 连胡数不为0的数
                    for(var i=0;i<tData.maxPlayer;i++)
                    {
                        if(sData.players[tData.uids[i]].linkHu == 0)
                            continue;

                        horse += (sData.players[tData.uids[i]].linkHu)*2;
                    }
                }
                if (horse > 0)
                {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut))
                    {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }
                else
                {
                    if (leftCard > 0 && mj.canGang0(pl.mjhand, tData.lastPut))
                    {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse > 0)
                {
                    if ((leftCard >= horse || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut))
                    {
                        var skipPeng = sData.players[SelfUid() + ""].skipPeng;
                        var skipPengLength = skipPeng.length;
                        //var skipPeng = sData.players[pl.info.uid].skipPeng;
                        if (skipPengLength > 0 && skipPeng.indexOf(tData.lastPut) != -1)
                            ShowSkipPeng();
                        else
                            vnode.push(eat.peng._node);
                    }
                }
                else
                {
                    //if ((leftCard > 4 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                    //    vnode.push(eat.peng._node);
                    //}
                    if ((leftCard > 0 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut))
                    {
                        vnode.push(eat.peng._node);
                    }
                }


                if ((leftCard > 4 || tData.noBigWin) && tData.canEat && tData.uids[(tData.curPlayer + 1) % 4] == SelfUid())
                {
                    var eatpos = mj.canChi(pl.mjhand, tData.lastPut);

                    jsclient.eatpos = eatpos;

                    if (eatpos.length > 0) {
                        vnode.push(eat.chi0._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++)
    {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0")
        {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0)
        {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))
                vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") 
            {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") 
            {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") 
            {
                if (jsclient.eatpos.length == 1) 
                    cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") 
            {
                if (jsclient.gangCards.length == 1)
                    cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") 
            {
                if (IsMyTurn()) 
                    cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  
                    cardVal = tData.lastPut;

                //出现胡牌按钮，则不显示听、胡提示
                // sendEvent("closeCardTipsEff");
            }

            if (cardVal && cardVal > 0) 
            {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;
        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}

function CheckEatVisibleForChaoShan(eat)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    CheckChangeuiVisible();

    var leftCard = tData.cardsNum - tData.cardNext;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;


    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    jsclient.majiang.isClient = true;
    var vnode = [];

    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            var isCanHu = mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui);
            if(isCanHu > 0  && pl.isNew
            )   vnode.push(eat.hu._node);

            //判断红中癞子
            var horse = 0;
            var rtn;
            //if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
            //    horse = jsclient.data.sData.tData.horse + 2;
            //else
            horse = jsclient.data.sData.tData.horse;

            if (horse > 0)
                rtn = leftCard > horse ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else
                rtn = leftCard > 0 ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0)
            {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1)
                {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                } else {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat)
    {

        if (!IsMyTurn()) {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);
            console.log("---------------------------"+huType);

            var orignPl = {};
            orignPl.mjhand = pl.mjhand;
            orignPl.mjpeng = pl.mjpeng;
            orignPl.mjgang0 = pl.mjgang0;
            orignPl.mjgang1 = pl.mjgang1;
            orignPl.mjchi = pl.mjchi;
            orignPl.huType = huType;

            var nowPl = mj.deepCopy(orignPl);
            nowPl.mjhand.push(tData.lastPut);
            var huTypeLevel = mj.getHuTypeForChaoShan(nowPl);
            if (!tData.canDianPao && tData.putType == 4 && huTypeLevel < mj.CHAO_SHAN_HUTYPE.SHIBALUOHAN)
                huType = 0;

            if (huType > 0)
            {
                var canHu = false;
                if(tData.putType == 0 && (tData.canDianPao || huTypeLevel >= mj.CHAO_SHAN_HUTYPE.SHIBALUOHAN ))
                {
                    canHu = true;
                }
                if(tData.putType == 4 && (!tData.canDianPao && huTypeLevel >= mj.CHAO_SHAN_HUTYPE.SHIBALUOHAN ))
                {
                    canHu = true;
                }
                if(tData.canDianPao)
                {
                    canHu = true;
                }
                if (tData.putType > 0 && tData.putType < 4)
                {
                        if (tData.putType == 2 )
                        {
                            canHu = true;
                        }
                }
                if (canHu)
                {
                    if (pl.skipHu)
                        ShowSkipHu();
                    else
                        vnode.push(eat.hu._node);
                }
            }

            if ((tData.putType == 0 || tData.putType == 4))
            {
                var horse = 0;
                var rtn;
                //if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                //    horse = jsclient.data.sData.tData.horse + 2;
                //else
                    horse = jsclient.data.sData.tData.horse;

                if (horse > 0) {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }
                else {
                    if (leftCard > 0 && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse > 0) {
                    if ((leftCard >= horse || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        console.log("tData.lastPut==============================" + tData.lastPut);
                        var skipPeng = sData.players[SelfUid() + ""].skipPeng;
                        var skipPengLength = skipPeng.length;
                        if (skipPengLength > 0 && skipPeng.indexOf(tData.lastPut) != -1) {
                            //ShowSkipPeng();
                        }
                        else vnode.push(eat.peng._node);
                    }
                } else {
                    if ((leftCard > 0 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.peng._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++)
    {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0")
        {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0)
        {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") {
                if (jsclient.eatpos.length == 1) cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") {
                if (jsclient.gangCards.length == 1)cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") {
                if (IsMyTurn()) cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  cardVal = tData.lastPut;
            }

            if (cardVal && cardVal > 0) {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;

        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}

function CheckEatVisibleForHeYuanBaiDa(eat)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    CheckChangeuiVisible();

    var leftCard = tData.cardsNum - tData.cardNext;
    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;


    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    jsclient.majiang.isClient = true;
    var vnode = [];

    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            var isCanHu = mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui);
            if(isCanHu > 0  && pl.isNew
                &&
                (
                    (
                        //大胡时 不能为鸡胡 （手牌有鬼 和 无鬼2种判断方式）
                        tData.baidadahu &&
                        (
                            (
                                (!tData.canJiHu && mj.getHuTypeForHeYuanBaiDaNew(pl) > 0 &&  mj.canFindFlowerForMjhand(pl.mjhand))
                                ||
                                tData.canJiHu
                            )
                            ||
                            (
                               mj.getHuTypeForHeYuanBaiDa(pl) > 0 && !mj.canFindFlowerForMjhand(pl.mjhand)
                            )
                        )
                    )
                    ||
                    tData.baidajihu
                )
            )   vnode.push(eat.hu._node);

            //判断红中癞子
            var horse = 0;
            var rtn;
            if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                horse = jsclient.data.sData.tData.horse + 2;
            else
                horse = jsclient.data.sData.tData.horse;


            if (horse > 0)
                rtn = leftCard > horse ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else
                rtn = leftCard > 0 ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0)
            {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1)
                {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                } else {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat)
    {

        if (!IsMyTurn()) {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);

            if (tData.putType == 4 )
                huType = 0;

            if (huType > 0)
            {
                var canHu = false;
                if (tData.putType > 0 && tData.putType < 4)
                {
                    {
                        if (tData.putType != 3 && tData.putType != 1 && tData.canQiangGang)
                        {
                            canHu = true;
                        }
                    }
                }
                if (canHu)
                {
                    if (pl.skipHu)
                        ShowSkipHu();
                    else
                        vnode.push(eat.hu._node);
                }
            }

            if ((tData.putType == 0 || tData.putType == 4))
            {
                var horse = 0;
                var rtn;
                if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                    horse = jsclient.data.sData.tData.horse + 2;
                else
                    horse = jsclient.data.sData.tData.horse;

                if (horse > 0) {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }
                else {
                    if (leftCard > 0 && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse > 0) {
                    if ((leftCard >= horse || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        console.log("tData.lastPut==============================" + tData.lastPut);
                        var skipPeng = sData.players[SelfUid() + ""].skipPeng;
                        var skipPengLength = skipPeng.length;
                        if (skipPengLength > 0 && skipPeng.indexOf(tData.lastPut) != -1) {
                            //ShowSkipPeng();
                        }
                        else vnode.push(eat.peng._node);
                    }
                } else {
                    if ((leftCard > 0 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.peng._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++)
    {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0")
        {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0)
        {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") {
                if (jsclient.eatpos.length == 1) cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") {
                if (jsclient.gangCards.length == 1)cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") {
                if (IsMyTurn()) cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  cardVal = tData.lastPut;
            }

            if (cardVal && cardVal > 0) {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;

        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}

function CheckEatVisibleForDongGuan(eat)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    CheckChangeuiVisible();

    var leftCard = tData.cardsNum - tData.cardNext;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;


    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    var vnode = [];

    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            var zhongCard = RequestZhong();
            if (tData.zhongIsMa && zhongCard > 0) {
                var cduis = jsclient.playui.jsBind.down._node.children;
                var cardIndex = null;
                for (var i = cduis.length - 1; i >= 0; i--) {
                    if (cduis[i].name == "mjhand" && cduis[i].tag == zhongCard)
                    {
                        cardIndex = i;
                        // PutAwayCard(cduis[i],lastCard);
                        break;
                    }
                }
                if (cardIndex)
                {
                    var callback = function ()
                    {
                        PutAwayCard(cduis[cardIndex], zhongCard);
                    };
                    cduis[cardIndex].runAction(cc.sequence(cc.delayTime(0.4), cc.callFunc(callback)));
                    return;
                }
            }

            var isCanHu = mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);
            if(isCanHu > 0 && isCanHu != 13 && pl.isNew)   vnode.push(eat.hu._node);

            //判断红中癞子
            var horse = 0;
            var rtn;
            if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                horse = jsclient.data.sData.tData.horse + 2;
            else
                horse = jsclient.data.sData.tData.horse;


            if (horse > 0)
                rtn = leftCard > horse ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else
                rtn = leftCard > 0 ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0)
            {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1)
                {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                } else {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat)
    {

        if (!IsMyTurn()) {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);


            if (tData.putType == 4 )
                huType = 0;

            if (huType > 0 && huType != 13)
            {
                var canHu = false;
                if (tData.putType > 0 && tData.putType < 4)
                {
                    {
                        //红中算马时 手牌有红中 抢杠胡 不能胡
                        var isCanHu = true;
                        if(tData.zhongIsMa && tData.lastPut == 71) isCanHu = false;
                        if (tData.putType != 3 && tData.putType != 1 && isCanHu )
                        {
                            canHu = true;
                        }
                    }
                }
                if (canHu)
                {
                    if (pl.skipHu)
                        ShowSkipHu();
                    else
                        vnode.push(eat.hu._node);
                }
            }

            if ((tData.putType == 0 || tData.putType == 4))
            {
                var horse = 0;
                var rtn;
                if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                    horse = jsclient.data.sData.tData.horse + 2;
                else
                    horse = jsclient.data.sData.tData.horse;

                if (horse > 0) {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }
                else {
                    if (leftCard > 0 && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse > 0) {
                    if ((leftCard >= horse || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        console.log("tData.lastPut==============================" + tData.lastPut);
                        var skipPeng = sData.players[SelfUid() + ""].skipPeng;
                        var skipPengLength = skipPeng.length;
                        //var skipPeng = sData.players[pl.info.uid].skipPeng;
                        if (skipPengLength > 0 && skipPeng.indexOf(tData.lastPut) != -1) {
                            ShowSkipPeng();
                        }
                        else vnode.push(eat.peng._node);
                    }
                } else {
                    if ((leftCard > 0 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.peng._node);
                    }
                }


                if ((leftCard > 4 || tData.noBigWin) && tData.canEat && tData.uids[(tData.curPlayer + 1) % 4] == SelfUid()) {
                    var eatpos = mj.canChi(pl.mjhand, tData.lastPut);

                    jsclient.eatpos = eatpos;

                    if (eatpos.length > 0) {
                        vnode.push(eat.chi0._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++)
    {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0")
        {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0)
        {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") {
                if (jsclient.eatpos.length == 1) cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") {
                if (jsclient.gangCards.length == 1)cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") {
                if (IsMyTurn()) cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  cardVal = tData.lastPut;
            }

            if (cardVal && cardVal > 0) {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;

        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}

function CheckEatVisibleFoYiBaiZhang(eat)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;

    var leftCard = tData.cardsNum - tData.cardNext;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;


    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    var vnode = [];

    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            var isCanHu = mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);
            if(isCanHu > 0 && isCanHu != 13 && pl.isNew)   vnode.push(eat.hu._node);

            //判断红中癞子
            var horse = 0;
            var rtn;
            if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                horse = jsclient.data.sData.tData.horse + 2;
            else
                horse = jsclient.data.sData.tData.horse;


            if (horse > 0)
                rtn = leftCard > horse ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else
                rtn = leftCard > 0 ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0)
            {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1)
                {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                } else {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat)
    {

        if (!IsMyTurn()) {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);

            if (tData.putType == 4 )
                huType = 0;

            if (huType > 0)
            {
                var canHu = false;
                //不能点炮
                //if (tData.putType == 0 && tData.putType != 4)
                //{
                //    canHu = true;
                //}
                if (tData.putType > 0 && tData.putType < 4)
                {
                    {
                        if (tData.putType != 3 && tData.putType != 1)
                        {
                            canHu = true;
                        }
                    }
                }
                if (canHu)
                {
                    if (pl.skipHu)
                        ShowSkipHu();
                    else
                        vnode.push(eat.hu._node);
                }
            }

            if ((tData.putType == 0 || tData.putType == 4))
            {
                var horse = 0;
                var rtn;
                if ((jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && jsclient.data.sData.tData.guiJiaMa )
                    horse = jsclient.data.sData.tData.horse + 2;
                else
                    horse = jsclient.data.sData.tData.horse;

                if (horse > 0) {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }
                else {
                    if (leftCard > 0 && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse > 0) {
                    if ((leftCard >= horse || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        console.log("tData.lastPut==============================" + tData.lastPut);
                        var skipPeng = sData.players[SelfUid() + ""].skipPeng;
                        var skipPengLength = skipPeng.length;
                        //var skipPeng = sData.players[pl.info.uid].skipPeng;
                        if (skipPengLength > 0 && skipPeng.indexOf(tData.lastPut) != -1) {
                            ShowSkipPeng();
                        }
                        else vnode.push(eat.peng._node);
                    }
                } else {
                    if ((leftCard > 0 || tData.noBigWin) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.peng._node);
                    }
                }


                if ((leftCard > 4 || tData.noBigWin) && tData.canEat && tData.uids[(tData.curPlayer + 1) % 4] == SelfUid()) {
                    var eatpos = mj.canChi(pl.mjhand, tData.lastPut);

                    jsclient.eatpos = eatpos;

                    if (eatpos.length > 0) {
                        vnode.push(eat.chi0._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++)
    {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0")
        {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0)
        {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") {
                if (jsclient.eatpos.length == 1) cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") {
                if (jsclient.gangCards.length == 1)cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") {
                if (IsMyTurn()) cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  cardVal = tData.lastPut;
            }

            if (cardVal && cardVal > 0) {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;

        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}


//检测能否地胡
function checkCanDiHu(sData)
{
    var tData = sData.tData;
    for(var i=0;i<tData.maxPlayer;i++)
    {
        if(tData.uids[tData.curPlayer] != tData.uids[i])
        {
            if(sData.players[tData.uids[i]].mjgang0.length != 0 || sData.players[tData.uids[i]].mjgang1.length != 0
                || sData.players[tData.uids[i]].mjchi.length != 0 || sData.players[tData.uids[i]].mjpeng.length != 0
            )return false;
        }
    }

    cc.log("---------------------------------------------------能地胡");
    return true;
}

//检测一炮三响
function checkYiPaoSanXiang(sData)
{
    var tData = sData.tData;
    for(var i=0;i<tData.maxPlayer;i++)
    {
        if(tData.uids[tData.curPlayer] != tData.uids[i]){
            if(sData.players[tData.uids[i]].mjgang0.length != 0 || sData.players[tData.uids[i]].mjgang1.length != 0
                || sData.players[tData.uids[i]].mjchi.length != 0 || sData.players[tData.uids[i]].mjpeng.length != 0
            ) return false;
        }
    }
    return true;
}

function CheckEatVisibleForJiPingHu(eat)
{
    //CheckChangeuiVisible();
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var leftCard = tData.cardsNum - tData.cardNext;

    eat.chi0._node.visible = false;
    eat.chi1._node.visible = false;
    eat.chi2._node.visible = false;
    eat.peng._node.visible = false;
    eat.gang0._node.visible = false;
    eat.gang1._node.visible = false;
    eat.gang2._node.visible = false;
    eat.hu._node.visible = false;
    eat.guo._node.visible = false;

    var pl = sData.players[SelfUid() + ""];
    if (pl.mjState == TableState.waitEat || pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == SelfUid())
    {

    }
    else
        return;

    jsclient.gangCards = [];
    jsclient.eatpos = [];
    var mj = jsclient.majiang;
    var vnode = [];
    //gang hu put
    if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut)
    {
        if (IsMyTurn())
        {
            if (pl.isNew && mj.canHu(!tData.canHu7, pl.mjhand, 0, tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu) > 0)
            {
                var jiPingHu_Type = mj.prejudgeHuTypeForJiPingHu(pl,0);
                //杠上花 直接胡
                if (tData.putType > 0 && tData.putType < 4) {
                    if (tData.putType == 1) {
                        vnode.push(eat.hu._node);
                    }
                    else//自摸杠在补摸
                    {
                        vnode.push(eat.hu._node);
                    }
                }
                else if(tData.cardNext == 136) //海底捞月
                {
                    vnode.push(eat.hu._node);
                }
                else{
                    switch(tData.fanNum)
                    {
                        case 0://任何类型都可胡
                        case 1: //在爆胡以内自摸 + 1番 任何类型都可胡
                            vnode.push(eat.hu._node);
                            break;
                        case 3:
                        {
                            console.log("tData.cardNext="+tData.cardNext + "  tData.curPlayer="+tData.curPlayer + "  checkCanDiHu(sData)="+checkCanDiHu(sData) + "  jiPingHu_Type:" + jiPingHu_Type);
                            if(
                                //天胡 或 地胡 或 非（鸡胡、平胡) 或 三元牌刻字数大于等于2
                            (mj.getSanYuanPaiKeZiNum(pl) >= 2) ||
                            (jiPingHu_Type != mj.JI_PING_HU_HUTYPE.JIHU && jiPingHu_Type != mj.JI_PING_HU_HUTYPE.PINGHU) ||
                            (tData.curPlayer == tData.zhuang && tData.cardNext == 53) || //天胡
                            (tData.cardNext == 54 && tData.curPlayer == (tData.zhuang + 1) && checkCanDiHu(sData)) || //第一家地胡
                            (tData.cardNext == 55 && tData.curPlayer == (tData.zhuang + 2) && checkCanDiHu(sData)) || //第二家地胡
                            (tData.cardNext == 56 && tData.curPlayer == (tData.zhuang + 3) && checkCanDiHu(sData))    //第三家地胡
                            ) {
                                if(tData.curPlayer == tData.zhuang && tData.cardNext == 53) console.log("天和======================================");
                                if((tData.cardNext == 54 && tData.curPlayer == (tData.zhuang + 1)) && checkCanDiHu(sData) )  console.log("第一家地和======================================");
                                if((tData.cardNext == 55 && tData.curPlayer == (tData.zhuang + 2)) && checkCanDiHu(sData))  console.log("第二家地和======================================");
                                if((tData.cardNext == 56 && tData.curPlayer == (tData.zhuang + 3)) && checkCanDiHu(sData))  console.log("第三家地和======================================");
                                if((mj.getSanYuanPaiKeZiNum(pl) >= 2)) console.log("三元牌刻字数大于等于2======================================");
                                if((jiPingHu_Type != mj.JI_PING_HU_HUTYPE.JIHU && jiPingHu_Type != mj.JI_PING_HU_HUTYPE.PINGHU)) console.log("非（鸡胡、平胡)======================================");
                                vnode.push(eat.hu._node);
                            }
                            else{
                                //平胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 ) 或
                                //平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）
                                if(
                                    jiPingHu_Type == mj.JI_PING_HU_HUTYPE.PINGHU &&  (mj.getSanYuanPaiKeZiNum(pl) >= 1 || mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                    jiPingHu_Type == mj.JI_PING_HU_HUTYPE.PINGHU &&  mj.getSanYuanPaiKeZiNum(pl) == 0 && (mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                ) {
                                    if(jiPingHu_Type == mj.JI_PING_HU_HUTYPE.PINGHU &&  (mj.getSanYuanPaiKeZiNum(pl) >= 1 || mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) )
                                        console.log("平胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 )======================================");
                                    if(jiPingHu_Type == mj.JI_PING_HU_HUTYPE.PINGHU &&  mj.getSanYuanPaiKeZiNum(pl) == 0 && (mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                        console.log("平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）======================================");
                                    vnode.push(eat.hu._node);
                                }
                                //鸡胡 且 (三元牌刻字数大于等于2 或 (本门风位刻字数 且 风圈局的刻子) ) 或
                                //鸡胡 且 三元牌刻字数等于1 且 (本门风位刻字数 或 风圈局的刻子) 或
                                //鸡胡 且 三元牌刻字数等于0 且 (本门风位刻字数 且 风圈局的刻子)
                                if(
                                    jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU && ( mj.getSanYuanPaiKeZiNum(pl) >= 2 || (mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ) ||
                                    jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) == 1 && (mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                    jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU &&  mj.getSanYuanPaiKeZiNum(pl) == 0 &&  (mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                ) {
                                    if(jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU && ( mj.getSanYuanPaiKeZiNum(pl) >= 2 || (mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ))
                                        console.log("平胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 )======================================");
                                    if(jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) == 1 && (mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                        console.log("鸡胡 且 三元牌刻字数等于1 且 (本门风位刻字数 或 风圈局的刻子)======================================");
                                    if(jiPingHu_Type == mj.JI_PING_HU_HUTYPE.JIHU &&  mj.getSanYuanPaiKeZiNum(pl) == 0 &&  (mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                        console.log("鸡胡 且 三元牌刻字数等于0 且 (本门风位刻字数 且 风圈局的刻子)======================================");
                                    vnode.push(eat.hu._node);
                                }
                            }
                        }
                            break;
                    }
                }

               // vnode.push(eat.hu._node);
            }
            console.log("最后打出的牌：" + tData.lastPut);

            //判断红中癞子
            var horse = 0;
            var rtn;

            if (horse >= 0)  rtn = leftCard > horse ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];
            else  rtn = leftCard > 0 ? mj.canGang1(pl.mjpeng, pl.mjhand, pl.mjpeng4) : [];

            if (rtn.length > 0) {
                jsclient.gangCards = rtn;
                if (jsclient.gangCards == 1) {
                    eat.gang0.bgground.visible = true;
                    eat.gang0.card1._node.visible = true;
                    setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                } else {
                    eat.gang0.bgground.visible = false;
                    eat.gang0.card1._node.visible = false;
                }
                vnode.push(eat.gang0._node);
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
        }
    }
    else if (tData.tState == TableState.waitEat) {

        if (!IsMyTurn()) {
            var huType = mj.canHu(!tData.canHu7, pl.mjhand, tData.lastPut,
                tData.canHuWith258, tData.withZhong,tData.fanGui,tData.gui,tData.gui4Hu);
            console.log("uid:" + pl.info.uid + "  huType ====== " + huType);
            if (tData.gameType == 4)
            {
                if(huType >0) console.log("走了============================ ！IsMyTurn()");

                var jiPingHuType = -1;
                if (huType > 0) {
                    jiPingHuType = mj.prejudgeHuTypeForJiPingHu(pl, tData.lastPut);
                    console.log("huType=====" + huType + "   ======jiPingHuType:" + jiPingHuType);
                }
                if (huType > 0) {
                    var isCanHu = false;
                    switch(tData.fanNum)
                    {
                        case 0://任何类型都可胡
                            //vnode.push(eat.hu._node);
                            isCanHu = true;
                            break;
                        case 1:
                        {

                            console.log("tData.cardNext=============================="+tData.cardNext + " ------tData.curPlayer===="+tData.curPlayer + "   tData.zhuang====="+tData.zhuang);
                            // 非鸡胡 或 人胡 或 三元牌大于等于1个刻字 或 风圈局的刻子 或 本盘门风的刻子
                            if( jiPingHuType != mj.JI_PING_HU_HUTYPE.JIHU || (tData.cardNext == 53 && tData.curPlayer == tData.zhuang) || mj.getSanYuanPaiKeZiNum(pl) >= 1 || (mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                            {
                                console.log("------------------------------------------非鸡胡 或 人胡 或 三元牌1个刻字 或 风圈局的刻子 或 本盘门风的刻子");
                                isCanHu = true;
                            }
                            //鸡胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 )
                            if(jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && (mj.getSanYuanPaiKeZiNum(pl) >= 1 || mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)  ) ){
                                console.log("------------------------------------------鸡胡 且 (三元牌刻字数1 或 本门风位刻字数 或 风圈局的刻子 )");
                                isCanHu = true;
                            }
                        }
                            break;
                        case 3:
                        {
                            console.log("tData.cardNext="+tData.cardNext + "  tData.curPlayer="+tData.curPlayer + "  tData.zhuang="+tData.zhuang);
                            //人胡 或 三元牌刻字数大于等于3 或 非(鸡胡、平胡、碰碰胡、混一色)
                            if((tData.cardNext == 53 && tData.curPlayer == tData.zhuang) || mj.getSanYuanPaiKeZiNum(pl) >= 3 ||
                                (jiPingHuType != mj.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.HUNYISE )
                            )
                            {
                                isCanHu = true;
                                if((tData.cardNext == 53 && tData.curPlayer == tData.zhuang))
                                    console.log("1. -----------------------------------人胡");
                                if(mj.getSanYuanPaiKeZiNum(pl) >= 3)
                                    console.log("1. -----------------------------------三元牌刻字数大于等于3");
                                if( (jiPingHuType != mj.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != mj.JI_PING_HU_HUTYPE.HUNYISE ))
                                    console.log("1. -----------------------------------非(鸡胡、平胡、碰碰胡、混一色)");
                            }
                            else{
                                //鸡胡 且 三元牌刻字数大于等于3 或
                                //鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）或
                                //鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）
                                if(
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) >= 3 ||
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) ==2 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) ==1 && ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )
                                ) {
                                    isCanHu = true;
                                    if(jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) >= 3)
                                        console.log("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数大于等于3");
                                    if( jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) ==2 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                        console.log("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）");
                                    if(jiPingHuType == mj.JI_PING_HU_HUTYPE.JIHU && mj.getSanYuanPaiKeZiNum(pl) ==1 && ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                        console.log("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）");
                                    //vnode.push(eat.hu._node);
                                }
                                //平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))或
                                //平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）或
                                //平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）
                                if(
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && (mj.getSanYuanPaiKeZiNum(pl) >= 2 || ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )) ||
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && mj.getSanYuanPaiKeZiNum(pl) == 1 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                    jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && mj.getSanYuanPaiKeZiNum(pl) == 0 && ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                ) {
                                    isCanHu = true;
                                    if(jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && (mj.getSanYuanPaiKeZiNum(pl) >= 2 || ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )))
                                        console.log(" -----------------------------------平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))");
                                    if(jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && mj.getSanYuanPaiKeZiNum(pl) == 1 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                        console.log(" -----------------------------------平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）");
                                    if(jiPingHuType == mj.JI_PING_HU_HUTYPE.PINGHU && mj.getSanYuanPaiKeZiNum(pl) == 0 && ( mj.isGetBenMenMenFengKeZi(pl) && mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                        console.log(" -----------------------------------平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）");
                                   // vnode.push(eat.hu._node);
                                }
                                //（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) ) 或
                                // (碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）
                                if(
                                    (jiPingHuType == mj.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == mj.JI_PING_HU_HUTYPE.HUNYISE) && ( mj.getSanYuanPaiKeZiNum(pl) >= 1 || ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )) ||
                                     (jiPingHuType == mj.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == mj.JI_PING_HU_HUTYPE.HUNYISE) && mj.getSanYuanPaiKeZiNum(pl) == 0 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                ){
                                    isCanHu = true;
                                    if((jiPingHuType == mj.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == mj.JI_PING_HU_HUTYPE.HUNYISE) && ( mj.getSanYuanPaiKeZiNum(pl) >= 1 || ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )))
                                        console.log(" -----------------------------------（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) )");
                                    if( (jiPingHuType == mj.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == mj.JI_PING_HU_HUTYPE.HUNYISE) && mj.getSanYuanPaiKeZiNum(pl) == 0 && ( mj.isGetBenMenMenFengKeZi(pl) || mj.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                        console.log(" -----------------------------------(碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）");
                                    //vnode.push(eat.hu._node);
                                }

                            }
                        }
                        break;
                    }
                    var canHu = false;
                    if ((tData.putType == 0 || tData.putType == 4) && isCanHu) {
                        canHu = true;
                    }
                    else if (tData.putType > 0 && tData.putType < 4 )  {
                        if (tData.canEatHu) {
                            if (tData.putType != 3 || huType == 13) {
                                canHu = true;
                            }
                        }
                        else {
                            if (tData.putType != 3 && tData.putType != 1 || huType == 13) {
                                canHu = true; isCanHu = true;
                            }
                        }
                    }
                    if (canHu && isCanHu) {
                        if (pl.skipHu) {
                            console.log(" uid:" + pl.info.uid + "  过胡");
                            ShowSkipHu();
                        }
                        else
                            vnode.push(eat.hu._node);
                    }
                }
            }

            if ((tData.putType == 0 || tData.putType == 4)) {

                var horse = 0;
                var rtn;

                if (horse >= 0) {
                    if (leftCard > horse && mj.canGang0(pl.mjhand, tData.lastPut)) {
                        vnode.push(eat.gang0._node);
                        jsclient.gangCards = [tData.lastPut];
                        eat.gang0.bgground.visible = true;
                        eat.gang0.card1._node.visible = true;
                        setCardPic(eat.gang0.card1._node, jsclient.gangCards[0], 0);
                    }
                }

                if (horse >= 0) {
                    if ((leftCard >= horse ) && mj.canPeng(pl.mjhand, tData.lastPut)) {
                        console.log("tData.lastPut==============================" + tData.lastPut);
                        vnode.push(eat.peng._node);
                    }
                }

                if ((leftCard > 0 ) && tData.canEat && tData.uids[(tData.curPlayer + 1) % 4] == SelfUid()) {
                    var eatpos = mj.canChi(pl.mjhand, tData.lastPut);

                    jsclient.eatpos = eatpos;

                    if (eatpos.length > 0) {
                        vnode.push(eat.chi0._node);
                    }
                }
            }

            if (vnode.length > 0)
                vnode.push(eat.guo._node);
            else
                getUIPlayer(0).mjState = TableState.waitCard;
        }
    }

    var btnImgs =
    {
        "peng": ["res/play-yli/btn_peng_normal.png", "res/play-yli/btn_peng_press.png"],
        "gang0": ["res/play-yli/btn_gang_normal.png", "res/play-yli/btn_gang_press.png"],
        "chi0": ["res/play-yli/btn_chi_normal.png", "res/play-yli/btn_chi_press.png"],
    }


    for (var i = 0; i < vnode.length; i++) {
        vnode[i].visible = true;

        if (vnode[i].getChildByName("card1"))    vnode[i].getChildByName("card1").visible = false;
        if (vnode[i].getChildByName("bgground")) vnode[i].getChildByName("bgground").visible = false;
        if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = true;
        var btnName = vnode[i].name;

        if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
            vnode[i].loadTextureNormal(btnImgs[btnName][0]);
            vnode[i].loadTexturePressed(btnImgs[btnName][1]);
        }

        if (i == 0) {
            var cardVal = 0;

            if (vnode[i].getChildByName("bgimg"))    vnode[i].getChildByName("bgimg").visible = false;

            if (btnName == "peng" || btnName == "chi0" || btnName == "gang0") {
                vnode[i].loadTextureNormal(btnImgs[btnName][0]);
                vnode[i].loadTexturePressed(btnImgs[btnName][1]);
            }
            if (btnName == "peng") {
                cardVal = tData.lastPut;
            }
            else if (btnName == "chi0") {
                if (jsclient.eatpos.length == 1) cardVal = tData.lastPut;
            }
            else if (btnName == "gang0") {
                if (jsclient.gangCards.length == 1)cardVal = jsclient.gangCards[0];
            }
            else if (btnName == "hu") {
                if (IsMyTurn()) cardVal = pl.mjhand[pl.mjhand.length - 1];
                else  cardVal = tData.lastPut;
            }

            if (cardVal && cardVal > 0) {
                setCardPic(vnode[0].getChildByName("card1"), cardVal, 0);
                vnode[0].getChildByName("card1").visible = true;
            }
            vnode[0].getChildByName("bgground").zIndex = -1;
            vnode[0].getChildByName("bgground").visible = true;

        }
        doLayout(vnode[i], [0, 0.12], [0.5, 0], [(1 - vnode.length) / 2.0 + i * 1.7, 2.5], false, false);
    }
}

function SetPlayerVisible(node, off)
{
    var pl = getUIPlayer(off);

    var head = node.getChildByName("head");
    var name = head.getChildByName("name");
    var offline = head.getChildByName("offline");
    var coin = head.getChildByName("coin");
    var nobody = head.getChildByName("nobody");

    if (pl)
    {
        name.visible = true;
        offline.visible = true;
        coin.visible = true;
        nobody.visible = false;

        jsclient.loadWxHead(pl.info.headimgurl, head, 64, 62, 0.2, 1, "WxHead", 1001);

        setOffline(node, off);
        InitPlayerHandUI(node, off);
    }
    else
    {
        name.visible = false;
        offline.visible = false;
        coin.visible = false;
        nobody.visible = true;

        var WxHead = head.getChildByTag(1001);
        if (WxHead)
        {
            log("删除玩家...");
            WxHead.removeFromParent(true);
        }
    }
}

function CheckInviteVisible()
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (TableState.waitJoin == tData.tState)
    {
        return Object.keys(sData.players).length < tData.maxPlayer;
    }
    else {
        return false;
    }
}

function CheckArrowVisible()
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;

    if (TableState.waitPut == tData.tState || TableState.waitEat == tData.tState || TableState.waitCard == tData.tState)
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
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ni = children[i];
        if (ni.getName() != "effectStateAct" && ni.name != "head" && ni.name != "up" && ni.name != "down" && ni.name != "stand" && ni.name != "out0" && ni.name != "out1" && ni.name != "out2" && ni.getName() != "ready")
        {
            ni.removeFromParent(true);
        }
    }
}

function setFlowerText(node, pl) {
    var text = "";
    switch (jsclient.data.sData.tData.gameType) {
        case 1:
            text = "";
            break;
        case 2:
            if (pl.mjflower && pl.mjflower.length > 0) text = "" + pl.mjflower.length;
            else text = "";
            break;
        default :
            text = "";
            break;
    }
    node.getChildByName("head").getChildByName("hua").getChildByName("hua_num").setString(text);
}

function setZhongText(node,pl){
    if(jsclient.data.sData.tData.zhongIsMa){
        var text = "";
        switch (jsclient.data.sData.tData.gameType) {
            case 1:
            case 2:
            case 3:
            case 4:
                text = "";
                break;
            case 5:
                if (pl.mjzhong && pl.mjzhong.length > 0) text = "" + pl.mjzhong.length;
                else text = "";
                break;
            default :
                text = "";
                break;
        }
        node.getChildByName("head").getChildByName("zhong").getChildByName("zhong_num").setString(text);
    }
}

function resetFlowerForPlayer(node, off)
{
    if(node == null)
        return;

    var pl = getUIPlayer(off);
    if (pl)
        pl.mjflower.length = 0;

    node.getChildByName("head").getChildByName("hua").setVisible(false);
    node.getChildByName("head").getChildByName("hua").getChildByName("hua_num").setString("0");
    node.getChildByName("head").getChildByName("baojiuzhang").setVisible(false);
}

function resetZhongForPlayer(node, off)
{
    if(node == null)
        return;

    if(jsclient.data.sData.tData.zhongIsMa) {
        var pl = getUIPlayer(off);
        if (pl)
            pl.mjzhong.length = 0;

        node.getChildByName("head").getChildByName("zhong").setVisible(false);
        node.getChildByName("head").getChildByName("zhong").getChildByName("zhong_num").setString("0");
    }
}

function HandleMJFlower(node, msg, off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var selfIndex = (tData.uids.indexOf(SelfUid()) + off) % 4;
    if (tData.uids[selfIndex] != msg.uid)
        return;

    var pl = getUIPlayer(off);
    if (pl)
    {
        if (off == 0) {
            RemoveBackNode(node, "mjhand", 1, msg.card);
        }
        else if (off == 1) {
            RemoveBackNode(node, "standPri", 1);
        }
        else if (off == 2 || off == 3) {
            RemoveFrontNode(node, "standPri", 1);
        }
        //不显示花牌
        // if(flowerShowTag != 2)
        // {
        // 	AddNewCard(node,"up","flower",msg.card,off);
        // }
        RestoreCardLayout(node, off);
        setFlowerText(node, pl);
        ShowEatActionAnim(node, ActionType.FLOWER, off);//将来显示花用
    }
}

function HandleMJZhong(node, msg, off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var selfIndex = (tData.uids.indexOf(SelfUid()) + off) % 4;
    if (tData.uids[selfIndex] != msg.uid)
        return;

    if(tData.zhongIsMa){
        var pl = getUIPlayer(off);
        if (pl)
        {
            if (off == 0) {
                //RemoveBackNode(node, "mjhand", 1, msg.card);
            }
            else if (off == 1) {
                RemoveBackNode(node, "standPri", 1);
            }
            else if (off == 2 || off == 3) {
                RemoveFrontNode(node, "standPri", 1);
            }
            //不显示花牌
            // if(flowerShowTag != 2)
            // {
            // 	AddNewCard(node,"up","flower",msg.card,off);
            // }
            RestoreCardLayout(node, off);
            setZhongText(node, pl);
            ShowEatActionAnim(node, ActionType.ZHONG, off);//将来显示花用
        }
    }
}

function HandleNewCard(node, msg, off)
{
    AddNewCard(node, "stand", "mjhand", msg, off);
    RestoreCardLayout(node, 0);
}

function HandleWaitPut(node, msg, off) {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;

    if(IsCurPlayerTurn(off))
    {
        AddNewCard(node,"stand","standPri", off);
        RestoreCardLayout(node,off);
    }
}

function HandleMJChi(node, msg, off) {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;

    if (IsCurPlayerTurn(off))
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        ShowEatActionAnim(node, ActionType.CHI, off);
        RemoveNewOutCard(fnode);

        var cds = msg.mjchi;
        for (var i = 0; i < cds.length; i++)
        {
            AddNewCard(node, "up", "chi", cds[i], off);
            if (off == 0 && cds[i] != tData.lastPut)
                RemoveBackNode(node, "mjhand", 1, cds[i]);
        }
        //删掉俩张stand
        if (off == 3)
            RemoveBackNode(node, "standPri", 2);
        else if (off != 0)
            RemoveFrontNode(node, "standPri", 2);

        RestoreCardLayout(node, off);
        RestoreCardLayout(fnode, fromOff[0]);
    }
}

function HandleMJPeng(node, msg, off) {

    var sData = jsclient.data.sData;
    var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;

    if (IsCurPlayerTurn(off))
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;
        ShowEatActionAnim(node, ActionType.PENG, off);
        RemoveNewOutCard(fnode);
        for (var i = 0; i < 3; i++) {
            AddNewCard(node, "up", "peng", tData.lastPut, off);
        }
        //删掉俩张stand
        if (off == 0)
            RemoveBackNode(node, "mjhand", 2, tData.lastPut);
        else if (off == 3)
            RemoveBackNode(node, "standPri", 2);
        else
            RemoveFrontNode(node, "standPri", 2);

        RestoreCardLayout(node, off);
        RestoreCardLayout(fnode, fromOff[0]);
    }
}

function RemoveFrontNode(node, name, num, tag)
{
    var children = node.children;

    for (var i = 0; i < children.length && num > 0; i++)
    {
        var ci = children[i];

        if (ci.name == name && (!(tag > 0) || ci.tag == tag))
        {
            ci.removeFromParent(true);
            num--;
        }
    }

    if (num != 0)
        mylog(node.name + " RemoveFrontNode fail " + name + " " + tag);
}

function RemoveNewOutCard(node)
{
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if (ci.name == "newout") 
        {
            ci.removeFromParent(true);
        }
    }
}

function RemoveBackNode(node, name, num, tag) 
{
    var children = node.children;
    for (var i = children.length - 1; i >= 0 && num > 0; i--)
    {
        var ci = children[i];
        if (ci.name == name && (!(tag > 0) || ci.tag == tag))
        {
            ci.removeFromParent(true);
            num--;
        }
    }
    if (num != 0)
        mylog(node.name + " RemoveBackNode fail " + name + " " + tag);
}

//父节点  需要克隆的子节点  子节点的新名字  值
function AddNewCard(node, copy, name, tag, off, specialTAG) 
{
    var cpnode = node.getChildByName(copy);
    var cp = cpnode.clone();
    cp.visible = true;
    cp.name = name;

    var mask = cp.getChildByName("mask");
    if(mask)
        mask.visible = false;

    if(name == "gang0"  || name == "gang1")
        cp.zIndex = 600;

    if (specialTAG == "isgang4")
    {
        cp.isgang4 = true;
    }

    node.addChild(cp);
    if (tag > 0) 
    {
        //如果牌有值 就赋值 如果是手牌
        setCardPic(cp, tag, name == "mjhand" ? 4 : off);
        if (name == "mjhand")
        {
            SetCardTouchHandler(cpnode, cp);
        }
    }
    return cp;
}

function GetUIBind(uidPos, offStore) 
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    var uiOff = (uidPos + tData.maxPlayer - selfIndex) % tData.maxPlayer;
    //三人麻将需要修正
    if(IsThreeTable() && uiOff == 2)
    {
        uiOff = 3;
    }

    if (offStore)
        offStore.push(uiOff);

    var jsBind = jsclient.playui.jsBind;
    var ui = [jsBind.down, jsBind.right, jsBind.top, jsBind.left];

    return ui[uiOff];
}

function HandleMJGang(node, msg, off)
{
    // var sData = jsclient.data.sData;
    // var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
    // if (uids[selfIndex] != msg.uid) return;
    if(getUIPlayerUid(off) != msg.uid) 
        return;

    if (msg.gang == 1)
    {
        var fromOff = [];
        var fromBind = GetUIBind(msg.from, fromOff);
        var fnode = fromBind._node;

        RemoveNewOutCard(fnode);
        if (off == 0)
            RemoveBackNode(node, "mjhand", 3, msg.card);

        RestoreCardLayout(fnode, fromOff[0]);
    }
    else if (msg.gang == 2)
    {
        RemoveBackNode(node, "peng", 3, msg.card);
        if (off == 0)
            RemoveBackNode(node, "mjhand", 1, msg.card);
    }
    else if (msg.gang == 3)
    {
        if (off == 0)
            RemoveBackNode(node, "mjhand", 4, msg.card);
    }
    if (off != 0)
    {
        if (off == 3)
        {
            // log("玩家3杠。。。。。。|" + off + "|。。。。。。。。。。。。。。。" + msg.gang);

            if (msg.gang == 1)
            {
                var fromOff = [];
                var fromBind = GetUIBind(msg.from, fromOff);
                var fnode = fromBind._node;
                ShowEatActionAnim(node, ActionType.GANG, off);
                RemoveNewOutCard(fnode);
                RemoveBackNode(node, "standPri", 3);
            }
            else if (msg.gang == 2)
            {
                // ShowEatActionAnim(node, ActionType.GANG, off);
                RemoveBackNode(node, "peng", 3, msg.card);
                RemoveBackNode(node, "standPri", 1);
            }
            else if (msg.gang == 3)
            {
                RemoveBackNode(node, "standPri", 4);
            }
        }
        else
        {
            // log("玩家X杠。。。。。。|" + off + "|。。。。。。。。。。。。。。。" + msg.gang);

            if (msg.gang == 1)
            {
                var fromOff = [];
                var fromBind = GetUIBind(msg.from, fromOff);
                var fnode = fromBind._node;
                ShowEatActionAnim(node, ActionType.GANG, off);
                RemoveNewOutCard(fnode);
                RemoveFrontNode(node, "standPri", 3);
            }
            else if (msg.gang == 2)
            {
                // ShowEatActionAnim(node, ActionType.GANG, off);
                RemoveFrontNode(node, "peng", 3, msg.card);
                RemoveFrontNode(node, "standPri", 1);
            }
            else if (msg.gang == 3)
            {
                RemoveFrontNode(node, "standPri", 4);
            }
        }
    }
    for (var i = 0; i < 4; i++)
    {
        if (msg.gang == 3)
        {
            if (i == 3)
            {
                AddNewCard(node, "down", "gang1", 0, off, "isgang4").tag = msg.card;
            }
            else
            {
                AddNewCard(node, "up", "gang1", msg.card, off);
            }
        }
        else
        {
            if (i == 3)
            {
                AddNewCard(node, "up", "gang0", msg.card, off, "isgang4").tag = msg.card;
            }
            else
            {
                AddNewCard(node, "up", "gang0", msg.card, off);
            }
        }
    }

    RestoreCardLayout(node, off);

}

function TagOrder(na, nb)
{
    return na.tag - nb.tag;
}

function RestoreCardLayout(node, off, endonepl)
{
    var newC = null;
    var newVal = 0;
    var pl;

    if (endonepl)
    {
        pl = endonepl;
    }
    else
    {
        pl = getUIPlayer(off);
    }

    if(pl == null)
        return;

    var mjhandNum = 0;
    var children = node.children;
    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if (ci.name == "mjhand")
        {
            mjhandNum++;

            // if(off == 0)
            // {
            //     if ((typeof jsclient.standInit_y) == 'undefined')
            //     {
            //         jsclient.standInit_y = ci.y;
            //     }
            //
            //     ci.y = jsclient.standInit_y;
            // }
        }
    }

    if (pl.mjhand && pl.mjhand.length > 0)
    {
        var count = jsclient.majiang.CardCount(pl);

        if (count == 14 && mjhandNum == pl.mjhand.length)
        {
            if (pl.isNew || endonepl)
                newVal = pl.mjhand[pl.mjhand.length - 1];
            else
            {
                var tempHand = [];
                for (var i = 0; i < pl.mjhand.length; i++)
                {
                    tempHand.push(pl.mjhand[i]);
                }

                tempHand.sort(function(a,b){

                    return a - b;
                });

                tempHand.sort(function(a,b){

                    if(jsclient.data.sData.tData.withZhong)
                    {
                        return b == 71;
                    }

                    if(jsclient.data.sData.tData.fanGui)
                    {
                        return (b == jsclient.data.sData.tData.gui) || (b >= 111 && b <= 181);
                    }
                });

                newVal = tempHand[tempHand.length - 1];
                // newVal = Math.max.apply(null, pl.mjhand);
            }
        }
    }

    var up = node.getChildByName("up");
    var stand = node.getChildByName("stand");
    var start, offui;
    switch (off)
    {
        case 0:
            start = up;
            offui = stand;
            break;
        case 1:
            start = stand;
            offui = up;
            break;
        case 2:
            start = stand;
            offui = up;
            break;
        case 3:
            start = up;
            offui = up;
            break;
    }
    var upSize = offui.getSize();
    var upS = offui.scale;
    //mjhand standPri out chi peng gang0 gang1
    var uipeng = [];
    var uigang0 = [];
    var uigang1 = [];
    var uichi = [];
    var uistand = [];

    for (var i = 0; i < children.length; i++)
    {
        var ci = children[i];
        if (ci.name == "mjhand")
        {
            if (newC == null && newVal == ci.tag)
            {
                newC = ci;
            }
            else
                uistand.push(ci);
        }
        else if (ci.name == "standPri")
        {
            uistand.push(ci);
        }
        else if (ci.name == "gang0")
        {
            uigang0.push(ci);
        }
        else if (ci.name == "gang1")
        {
            uigang1.push(ci);
        }
        else if (ci.name == "chi")
        {
            uichi.push(ci);
        }
        else if (ci.name == "peng")
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
    // uichi.sort(TagOrder);
    uistand.sort(TagOrder);

    var guiTag1 = 0, guiTag2 = 0;
    if(jsclient.data.sData.tData.withZhong)
        guiTag1 = 71;

    if(jsclient.data.sData.tData.fanGui)
        guiTag1 = jsclient.data.sData.tData.gui;

    if(jsclient.data.sData.tData.twogui)
        guiTag2 = jsclient.data.sData.tData.nextgui;

    jsclient.majiang.toFontGuiPai(uistand);

    if (newC)
    {
        uistand.push(newC);
    }

    //给鬼牌加特效
    if(jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui)
    {
        for(var z = 0; z< uistand.length; z++)
        {
            var guiCard = uistand[z];

            if(guiCard.tag == guiTag1 || guiCard.tag == guiTag2)
            {
                playAnimationByCard(guiCard, off);
            }

            if(jsclient.data.sData.tData.gameType == 7 && (guiCard.tag >= 111 && guiCard.tag <= 181))
            {
                playAnimationByCard(guiCard, off);
            }
        }
    }

    //给麻将加提示
    if(off == 0 && newC)
    {
        showCardTipsEffect(uistand, pl);
    }

    var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    if (off == 1 || off == 2)
        uiOrder.reverse();

    var orders = [];
    for (var j = 0; j < uiOrder.length; j++)
    {
        var uis = uiOrder[j];
        for (var i = 0; i < uis.length; i++)
            orders.push(uis[i]);
    }
    var slotwith = upSize.width * upS * 0.3;
    var slotheigt = upSize.height * upS * 0.3;

    for (var i = 0; i < orders.length; i++) {
        var ci = orders[i];

        if (off % 2 == 0)
        {
            if (i != 0)
            {
                if (ci.name == orders[i - 1].name)
                {

                    if (ci.isgang4)
                    {
                        ci.x = orders[i - 2].x;
                        ci.y = orders[i - 2].y + upSize.height * upS * 0.2;

                    } else if (orders[i - 1].isgang4)
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS * 2;

                    } else
                    {
                        ci.x = orders[i - 1].x + upSize.width * upS;

                    }
                }
                else if (orders[i - 1].name == "gang0")
                {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;

                }
                else if (orders[i - 1].name == "gang1")
                {
                    ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
                }
                else
                {
                    ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
                }
                /*
                 判断是不是新抓的牌
                 */
                if (off == 0)
                {

                    if (i == orders.length - 1)
                    {
                        if (newC && endonepl)
                        {
                            ci.x = ci.x + slotwith;
                        }
                        else if (newC)
                        {
                            ci.x = ci.x + slotwith;
                            ci.y += 20;
                        }
                    }
                }
            }
            else
            {
                ci.x = start.x + upSize.width * upS;
            }
        }
        else
        {
            if (i != 0)
            {
                if (ci.name == orders[i - 1].name)
                {
                    if (ci.isgang4)
                    {
                        ci.y = orders[i - 2].y + slotheigt;
                    }
                    else if (orders[i - 1].isgang4)
                    {
                        ci.y = orders[i - 2].y - upSize.height * upS * 0.7;
                    }
                    else
                    {
                        ci.y = orders[i - 1].y - upSize.height * upS * 0.7;
                    }

                }
                else if (orders[i - 1].name == "standPri")
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 1.5;
                }
                else if (orders[i - 1].name == "gang0")
                {
                    ci.y = orders[i - 2].y - upSize.height * upS * 0.7 - slotheigt;
                }
                else if (orders[i - 1].name == "gang1")
                {
                    ci.y = orders[i - 2].y - upSize.height * upS * 0.7 - slotheigt;
                }
                else
                {
                    ci.y = orders[i - 1].y - upSize.height * upS * 0.7 - slotheigt;
                }

            }
            else
            {
                ci.y = start.y - upSize.height * upS * 0.7;

                if(off == 1)
                    ci.y = ci.y + 40;
            }

            if (off == 3)
            {
                if (!ci.isgang4)
                {
                    ci.zIndex = i;
                }
                else
                {
                    ci.zIndex = 200;
                }

                ci.x = start.x - 10;
            }

            if (off == 1)
            {
                if (!ci.isgang4)
                {
                    ci.zIndex = i;
                }
                else
                {
                    ci.zIndex = 200;
                }

                ci.x = start.x + 20;
            }
        }

    }
}

function HandleMJPut(node, msg, off, outNum) {

    var sData = jsclient.data.sData;
    var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
    // if (uids[selfIndex] == msg.uid)

    if(getUIPlayerUid(off) == msg.uid)
    {
        var pl = sData.players[msg.uid];
        var putnum = outNum >= 0 ? outNum : (pl.mjput.length - (off == 0 ? 0 : 1));
        var out0 = node.getChildByName("out0");
        var out1 = node.getChildByName("out1");
        var out2 = node.getChildByName("out2");
        var oSize = out0.getSize();
        var oSc = out0.scale;

        var out;
        if (putnum > 23)
        {
            out = out2.clone();
        }
        else if(putnum > 11)
        {
            out = out1.clone();
        }
        else
        {
            out = out0.clone();
        }

        if(off == 0 && putnum > 23)
        {
            node.addChild(out);
        }
        else if (off == 0 && putnum > 11)
        {
            node.addChild(out, 100 - putnum);
        }
        else if (off == 1 || off == 0)
        {
            node.addChild(out, 200 - putnum);
        }
        else if (off == 2 || off == 3)
        {
            node.addChild(out, putnum);
        }
        else
        {
            node.addChild(out);
        }

        for (var i = 0; i < node.children.length; i++)
        {
            if (node.children[i].name == "newout")
                node.children[i].name = "out";
        }

        out.visible = true;
        out.name = "out";
        setCardPic(out, msg.card, off);
        var endPoint = cc.p(0, 0);
        var Midpoint = cc.p(0, 0);
        var ws = cc.director.getWinSize();

        if (putnum > 23)
        {
            out.x = out2.x;
            out.y = out2.y;
            putnum -= 24;
        }
        else if (putnum > 11)
        {
            out.x = out1.x;
            out.y = out1.y;
            putnum -= 12;
        }

        if (off == 0)
        {
            endPoint.y = out.y;
            endPoint.x = out.x + oSize.width * oSc * putnum;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height / 4;
            if (!(outNum >= 0))
            {
                RemoveBackNode(node, "mjhand", 1, msg.card);
            }
        }
        else if (off == 1)
        {
            if (!(outNum >= 0))
                RemoveFrontNode(node, "standPri", 1);

            endPoint.y = out.y + oSize.height * oSc * putnum * 0.7;
            endPoint.x = out.x - 10;
            Midpoint.x = ws.width / 4 * 3;
            Midpoint.y = ws.height / 2;
            out.zIndex = 100 - putnum;
        }
        else if (off == 2)
        {
            if (!(outNum >= 0))
                RemoveFrontNode(node, "standPri", 1);

            endPoint.x = out.x - oSize.width * oSc * putnum;
            endPoint.y = out.y;
            Midpoint.x = ws.width / 2;
            Midpoint.y = ws.height / 4 * 3;
        }
        else if (off == 3)
        {
            if (!(outNum >= 0))
                RemoveBackNode(node, "standPri", 1);

            endPoint.y = out.y - oSize.height * oSc * putnum * 0.7;
            endPoint.x = out.x;
            Midpoint.x = ws.width / 4;
            Midpoint.y = ws.height / 2;
            out.zIndex = putnum;
        }

        if (outNum >= 0)//重连
        {
            // if ((outNum == pl.mjput.length - 1) && tData.curPlayer == selfIndex && tData.tState == TableState.waitEat)
            if ((outNum == pl.mjput.length - 1) && IsCurPlayerTurn(off) && tData.tState == TableState.waitEat)
            {
            }
            else
            {
                out.x = endPoint.x;
                out.y = endPoint.y;
                return;
            }
        }
        else//打牌
        {
        }

        var zoder = out.zIndex;
        out.zIndex = 200;
        out.visible = false;
        var outAction = node.getParent().getChildByName("top").getChildByName("out0").clone();
        outAction.name = "outAction";
        outAction.visible = true;
        node.addChild(outAction);

        out.x = Midpoint.x;
        out.y = Midpoint.y;

        out.scale = 2 * oSc;

        out.name = "newout";

        setCardPic(outAction, msg.card, 2);

        outAction.scale = oSc;

        outAction.zIndex = 3000;
        if (off == 0 && jsclient.lastPutPos)
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

        //屏蔽
        var shield = node.getParent().getChildByName("shield");
        if(shield)
        {
            shield.setVisible(true);
            // shield.setTouchEnabled(true);
            shield.runAction(cc.sequence(cc.DelayTime(0.5), cc.callFunc(function(){shield.setVisible(false);})));
        }

        var callbackFUNC = function ()
        {
            out.zIndex = zoder;
        };
        var callbackFUNCROTATION = function ()
        {
            out.visible = true;
            // out.zIndex = zoder;
            // out.x = endPoint.x;
            // out.y = endPoint.y;
            // out.scale = oSc;
            // outAction.removeFromParent();
            out.runAction(cc.sequence(cc.spawn(cc.moveTo(0.1, endPoint), cc.scaleTo(0.1, oSc)), cc.callFunc(callbackFUNC)));
        };
        outAction.runAction(cc.sequence(cc.spawn(cc.moveTo(0.1, Midpoint), cc.scaleTo(0.1, 2 * oSc))
        // outAction.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2, endPoint), cc.scaleTo(0.2, oSc)),cc.callFunc(callbackFUNCROTATION)
            //cc.DelayTime(0.4),cc.callFunc(callbackFUNCROTATION),cc.removeSelf()
        ));

        // outAction.x = Midpoint.x;
        // outAction.y = Midpoint.y;
        // outAction.scale = 2*oSc;

        function RemovePutCard(onlySelf)
        {
            var delayNum = 0.4 - (Date.now() - putTime) / 1000;
            if (delayNum < 0) delayNum = 0;

            if (!onlySelf)
                outAction.runAction(cc.sequence(cc.DelayTime(delayNum), cc.callFunc(callbackFUNCROTATION), cc.removeSelf()));
            else
                outAction.runAction(cc.sequence(cc.DelayTime(delayNum), cc.removeSelf()));
        };

        var putTime = Date.now();
        var outActionBind =
        {
            _event:
            {
                waitPut: function () {
                    RemovePutCard(false)
                },
                MJChi: function () {
                    RemovePutCard(true)
                },
                MJPeng: function () {
                    RemovePutCard(true)
                },
                MJGang: function () {
                    RemovePutCard(true)
                },
                roundEnd: function () {
                    RemovePutCard(true)
                }
            }
        };

        if (jsclient.majiang.isFlower8(msg.card) && jsclient.data.sData.tData.gameType != 7)
        {
            RemovePutCard(true); //MJFlower
        }
        else if(tData.zhongIsMa && tData.gameType == 5 && msg.card == 71)
        {
            RemovePutCard(true); //MJZhong
        }
        else
        {
            ConnectUI2Logic(outAction, outActionBind);
        }
        if (!(outNum >= 0))
            RestoreCardLayout(node, off);
    }
}

//设置卡牌
function setCardPic(node, cd)
{
    var imgName = "res/MaJiangNew/mj_" + cd + ".png";
    // var callback = function ()
    // {
        var num = node.getChildByName("num");
        // if (num != null)
            // num.loadTexture(imgName, ccui.Widget.PLIST_TEXTURE);
        if (num != null)
            num.loadTexture(imgName);
    // };
    if(!isNaN(cd))
        node.tag = cd;
    // node.stopAllActions();
    // node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(1))));
}

function SetArrowRotation(abk)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    // var uids = tData.uids;
    // var selfIndex = uids.indexOf(SelfUid());
    // selfIndex = (tData.curPlayer + 4 - selfIndex) % 4;
    // abk.getChildByName("arrow").rotation = 270 - 90 * selfIndex;
    abk.getChildByName("arrow").rotation = 270 - 90 * getUIOffByIndex(tData.curPlayer);
}

//打牌
function SetCardTouchHandler(standUI, cardui)
{
    cardui.addTouchEventListener(function (btn, tp)
    {
        if (tp != 2)
            return;

        var sData = jsclient.data.sData;
        var tData = sData.tData;
        if (!IsMyTurn() || tData.tState != TableState.waitPut)
        {
            return;
        }

        if (btn.y >= standUI.y + 10)
        {
            PutAwayCard(cardui, cardui.tag);
            sendEvent("showDefCardEff");
            sendEvent("closeCardTipsEff");
        }
        else
        {
            var mjhandNum = 0;
            var children = btn.getParent().children;
            for (var i = 0; i < children.length; i++)
            {
                if (children[i].name == "mjhand")
                {
                    mjhandNum++;
                    if (children[i].y > standUI.y + 10)
                        children[i].y = standUI.y;
                }
            }
            if (mjhandNum == getUIPlayer(0).mjhand.length)
            {
                btn.y = standUI.y + 20;
            }

            sendEvent("showCardTipsEff", cardui.tag);
            sendEvent("showPutCardEff", cardui.tag);
        }

    }, cardui);
}

function reConectHeadLayout(node) 
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");
    
    if (tData.tState == TableState.waitJoin || tData.tState == TableState.roundFinish) {
        doLayout(down, [0.125, 0.125], [0.5, 0.2], [0, 0], false, false);
        doLayout(top, [0.125, 0.125], [0.5, 0.8], [0, 0], false, false);
        doLayout(left, [0.125, 0.125], [0.2, 0.5], [0, 0], false, false);
        doLayout(right, [0.125, 0.125], [0.8, 0.5], [0, 0], false, false);
    }
    else
    {
        doLayout(top, [0.125, 0.125], [0.93, 0.9], [0, 0], false, false);
        doLayout(right, [0.125, 0.125], [0.93, 0.65], [0, 0], false, false);
        doLayout(left, [0.125, 0.125], [0.07, 0.6], [0, 0], false, false);
        doLayout(down, [0.125, 0.125], [0.07, 0.35], [0, 0], false, false);
    }
}

function tableStartHeadPlayAction(node) 
{
    var down = node.getChildByName("down").getChildByName("head");
    var top = node.getChildByName("top").getChildByName("head");
    var left = node.getChildByName("left").getChildByName("head");
    var right = node.getChildByName("right").getChildByName("head");

    // doLayout(down, [0.125, 0.125], [0.5, 0.2], [0, 0], false, false);
    // doLayout(top, [0.125, 0.125], [0.5, 0.8], [0, 0], false, false);
    // doLayout(left, [0.125, 0.125], [0.25, 0.5], [0, 0], false, false);
    // doLayout(right, [0.125, 0.125], [0.75, 0.5], [0, 0], false, false);

    doLayout(top, [0.125, 0.125], [0.93, 0.9], [0, 0], false, false);
    doLayout(right, [0.125, 0.125], [0.93, 0.65], [0, 0], false, false);
    doLayout(left, [0.125, 0.125], [0.07, 0.6], [0, 0], false, false);
    doLayout(down, [0.125, 0.125], [0.07, 0.35], [0, 0], false, false);
    var downPoint = cc.p(down.x, down.y);
    var topPoint = cc.p(top.x, top.y);
    var rightPoint = cc.p(right.x, right.y);
    var leftPoint = cc.p(left.x, left.y);
    down.runAction(cc.moveTo(0.5, downPoint));
    top.runAction(cc.moveTo(0.5, topPoint));
    left.runAction(cc.moveTo(0.5, leftPoint));
    right.runAction(cc.moveTo(0.5, rightPoint));
}

function InitPlayerNameAndCoin(node, off)
{
    var pl = getUIPlayer(off);

    if (!pl)
        return;

    var tData = jsclient.data.sData.tData;
    var bind =
    {
        head:
        {
            name:
            {
                _text: function ()
                {
                    // return unescape(pl.info.nickname || pl.info.name);
                    return unescape(pl.info.nickname || pl.info.name || "玩家");
                }
            },
            coin:
            {
                _visible: true,
                _run: function ()
                {
                    if(tData.initCoin == null || pl.winall == null)
                        this.visible = false;
                    else
                       changeLabelAtals(this, tData.initCoin + pl.winall);
                }
            }
        }
    };
    ConnectUI2Logic(node, bind);
}

//风圈
function getIndexRingWind(tData, uid)
{
    var inputUid = uid;
    var uids = tData.uids;
    var zhuangUid = tData.uids[tData.zhuang];
    var dirValue = [0,1,2,3];
    var tmpValue = [];
    var resultUIds = [];
    for(var i = 0; i < 4; i++)
    {
        tmpValue[i] = (dirValue[tData.zhuang] + i) % 4;
        resultUIds.push(uids[tmpValue[i]]);
    }

    var resultIdx = resultUIds.indexOf(inputUid);
    // console.log("before: " + uids);
    // console.log("after: " + resultUIds);
    // console.log("zhuangId = " + zhuangUid + ", inputUid = " + inputUid + ", resultIdx = " + resultIdx);
    return resultIdx;
}


function getWindDir2(pIdx, windIdx)
{
    var dirArr = ["东", "南", "西", "北"];
    //var dirValue = [0,3,2,1]; //改这个可以变成 东 北 西 南
    var dirValue = [0,1,2,3];
    var tmp = [];
    var tmpValue = [];
    for(var i = 0; i < 4; i++)
    {
        tmpValue[i] = (dirValue[windIdx] + i) % 4;
        tmp.push(dirArr[tmpValue[i]]);
    }
    // console.log("当前圈风windIdx = " + windIdx + ", tmp = " + tmp + ", tmpValue = " + tmpValue);
    // console.log("befor:　"　+ dirArr);
    // console.log("after:　"　+ tmp);
    // console.log("dir = " + dirArr[tmpValue[pIdx]] + ", resultDir = " + tmpValue[pIdx]);
    return tmpValue[pIdx];
}

function getCirclWindDir(tData, pl)
{
    var pIdx = getIndexRingWind(tData, pl.uid);
    cc.log("getCirclWindDir  tData.jiPingHuCircleWind.curCircleWind ================"+ tData.jiPingHuCircleWind.curCircleWind);
    return getWindDir2(pIdx, tData.jiPingHuCircleWind.curCircleWind);//风圈 0 1 2 3 4
}

function showCirclWindAndFengWei(off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if(tData.gameType == 4)
    {
        var pl = getUIPlayer(off);

        if(pl == null)
            return;

        var circleWind = getCirclWindDir(tData,pl.info);
        var node = jsclient.playui.jsBind.arrowbk._node;
        var fengquan = node.getChildByName("circleWind");
        fengquan.setVisible(true);
        fengquan.loadTexture("res/play-yli/circleWind" + tData.jiPingHuCircleWind.curCircleWind + ".png")
        var child = ["dir_down", "dir_right", "dir_up", "dir_left"];
        var dir = node.getChildByName(child[off]);
        if (dir) {
            dir.setVisible(true);
            var isZhuang = tData.uids[tData.zhuang] == pl.info.uid;
            if(isZhuang)  dir.loadTexture("res/play-yli/dir_press_" + circleWind + ".png");
            else dir.loadTexture("res/play-yli/dir_normal_" + circleWind + ".png");
        }
    }
}

function InitPlayerHandUI(node, off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if(pl == null)
        return;

    InitPlayerNameAndCoin(node, off);
    showCirclWindAndFengWei(off);
    if (tData.tState != TableState.waitPut && tData.tState != TableState.waitEat && tData.tState != TableState.waitCard)
        return;
    
    //添加碰
    for (var i = 0; i < pl.mjpeng.length; i++) {
        //AddNewCard(node,copy,name,tag,off)
        for (var j = 0; j < 3; j++) {
            AddNewCard(node, "up", "peng", pl.mjpeng[i], off);
        }
    }
    //添加明杠
    for (var i = 0; i < pl.mjgang0.length; i++) {

        for (var j = 0; j < 4; j++) {
            if (j == 3) {
                AddNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4").tag = pl.mjgang0[i];
            } else {
                AddNewCard(node, "up", "gang0", pl.mjgang0[i], off);
            }

        }
    }
    //添加暗杠
    for (var i = 0; i < pl.mjgang1.length; i++) 
    {
        for (var j = 0; j < 4; j++) 
        {

            if (j == 3) 
            {
                AddNewCard(node, "down", "gang1", 0, off, "isgang4").tag = pl.mjgang1[i];
            } 
            else 
            {
                AddNewCard(node, "up", "gang1", pl.mjgang1[i], off);
            }
        }

    }
    //添加吃
    for (var i = 0; i < pl.mjchi.length; i++) 
    {
        AddNewCard(node, "up", "chi", pl.mjchi[i], off);
    }
    //添加打出的牌
    for (var i = 0; i < pl.mjput.length; i++) 
    {
        var msg = {card: pl.mjput[i], uid: pl.info.uid};
        HandleMJPut(node, msg, off, i);
    }
    //添加手牌
    if (pl.mjhand)
    {
        for (var i = 0; i < pl.mjhand.length; i++)
        {
            AddNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
        }
    } 
    else
    {
        var CardCount = 0;
        if (tData.tState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.info.uid)
        {
            CardCount = 14;
        }
        else
        {
            CardCount = 13;
        }
        var upCardCount = CardCount - ((pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length);
        for (var i = 0; i < upCardCount; i++)
        {
            AddNewCard(node, "stand", "standPri", 0, off);
        }

    }
    RestoreCardLayout(node, off);
}

var playAramTimeID = null;
function updateArrowbkNumber(node)
{
    node.setString("10");
    var number = function ()
    {
        if (node.getString() == 0)
        {
            node.cleanup();
        }
        else
        {
            var number = node.getString() - 1;
            if (number > 9)
            {
                node.setString(number);
            }
            else
            {
                node.setString("0" + number);
                var sData = jsclient.data.sData;
                var tData = sData.tData;
                var uids = tData.uids;
                if (uids[tData.curPlayer] == SelfUid())
                {
                    if (number == 3)
                    {
                        playAramTimeID = playEffect("timeup_alarm");
                    }
                    else if (number == 0)
                    {
                        jsclient.native.NativeVibrato();
                    }
                }
            }
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(number, node))));
}

//三人麻将，uioff依然采用0,1,3位置。将数据层进行修正
function getUIPlayer(off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());

    if(IsThreeTable()){
        if(off==3){
            off = 2;
        }else if(off==2){
            return null;
        }
    }

    if (!tData.maxPlayer)
        tData.maxPlayer = 4;

    selfIndex = (selfIndex + off) % tData.maxPlayer;

    if (selfIndex < uids.length)
        return sData.players[uids[selfIndex]];

    return null;
}

function getIndexPlayer(uid) {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var uids = tData.uids;
    var selfIndex = uids.indexOf(SelfUid());
    var targetIndex = uids.indexOf(uid);

    if (!tData.maxPlayer)
        tData.maxPlayer = 4;

    var uioff = (targetIndex - selfIndex + tData.maxPlayer) % tData.maxPlayer;

    //修正uioff
    if(uioff==2 && IsThreeTable())
    {
        uioff = 3;
    }

    return uioff;
}

function setOffline(node, off) {
    var pl = getUIPlayer(off);
    if (!pl) return;
    node.getChildByName("head").getChildByName("offline").zIndex = 99;
    node.getChildByName("head").getChildByName("offline").visible = !pl.onLine;
}
function showPlayerInfo(off, node) {
    var pl = getUIPlayer(off);
    if (pl)
    {
        jsclient.showPlayerInfo(pl.info);
    }
    return;

    //mylog(pl.mjState+"|"+pl.mjgang1+"|"+pl.mjgang0+"|"+pl.mjpeng+"|"+pl.mjhand);
    //mylog(pl.mjchi+"|"+pl.mjput);
    //mylog(tData.tState+" c "+tData.curPlayer+" e "+tData.canEatHu);

    var names = [];
    for (var i = 0; i < node.children.length; i++) {
        names.push(node.children[i].name + "|" + node.children[i].tag);
    }
    cc.log("玩家的子节点：" + names);

}

function checkBaoJiuZhuangLogo(node, off) {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl){
        return;
    }

    if (pl.baojiu) {
        cc.log("测试 报九张数据=============================" + pl.baojiu.num);
        if (pl.baojiu.num == 4) cc.log("使此人报九的人是=============================" + pl.baojiu.putCardPlayer[0]);
    }

    if (pl && pl.baojiu.num >= 3 && (tData.gameType == 2 || (tData.gameType == 7 && tData.baidadahu ))) {
        node.visible = true;
        node.zIndex = 80;
    } else node.visible = false;

}

function showPlayerLinkZhuangLogo(node, off) {

    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);
    if(!pl){
        return;
    }

    node.zIndex = 100;
    if (tData) {
        if ((tData.gameType == 3 || tData.gameType == 1) && tData.jiejieGao && tData.uids[tData.zhuang] == pl.info.uid) {
            node.visible = true;
            //var linkZhuang = node.getChildByName("linkZhuang");
            var path = "res/play-yli/zhuang_" + pl.linkZhuang + ".png";
            cc.log("path = " + path);
            node.loadTexture(path);
            node.setVisible(true);
        } else {
            node.visible = false;
        }

    }
}

function showPlayerZhuangLogo(node, off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var pl = getUIPlayer(off);

    if(pl == null)
        return;

    node.zIndex = 100;
    if (tData)
    {
        if (tData.uids[tData.zhuang] == pl.info.uid)
        {
            if (node.getName() == "zhuang")
                node.visible = true;
        }
        else
        {
            if (node.getName() == "zhuang")
                node.visible = false;
        }

    }
    if ((tData.gameType == 2 ) && node.getName() == "hua")
    {
        node.setVisible(true);
        node.getChildByName("hua_num").setString("" + pl.mjflower.length);
    }
    if(tData.gameType == 5 && node.getName() == "zhong" && tData.zhongIsMa)
    {
        node.setVisible(true);
        node.getChildByName("zhong_num").setString("" + pl.mjzhong.length ); /* pl.mjzhong.length */
    }
    if ((tData.gameType == 2 || (tData.gameType == 7 && tData.baidadahu ) )&& node.getName() == "baojiuzhang")
    {
        if (tData)
        {
            if (pl.baojiu)
                cc.log("initSceneData ===== pl.baojiu===" + pl.baojiu.num);
            else
                cc.log("没有报九！！！");
            if (pl.baojiu && pl.baojiu.num >= 3)
            {
                node.visible = true;
                node.zIndex = 80;
            }
            else
                node.visible = false;
        }
    }

    if ((tData.gameType == 3 || tData.gameType == 1)&& tData.jiejieGao)
    {
        if (tData)
        {
            if (node.getName() == "zhuang")
                node.visible = false;
        }
    }
}

function updatePower(node) {
    var callNative = jsclient.native.NativeBattery;
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callNative), cc.DelayTime(30))));
}

function updateWIFI(node) {


    var callback = function () {
        var ms = jsclient.reqPingPong / 1000.0;
        //cc.log("ms"+ms);
        if (ms < 0.3) {
            node.loadTexture("Z_wifi_1.png", ccui.Widget.PLIST_TEXTURE);
        } else if (ms < 0.6) {
            node.loadTexture("Z_wifi_2.png", ccui.Widget.PLIST_TEXTURE);
        } else if (ms < 1) {
            node.loadTexture("Z_wifi_3.png", ccui.Widget.PLIST_TEXTURE);
        } else {
            node.loadTexture("Z_wifi_4.png", ccui.Widget.PLIST_TEXTURE);
        }
    };

    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.DelayTime(5))));
}

function CheckDelRoomUI()
{
    var sData = jsclient.data.sData;
    if (sData.tData.delEnd != 0 && !jsclient.delroomui)
    {
        jsclient.Scene.addChild(new DelRoomLayer());
    }
    else if (sData.tData.delEnd == 0 && jsclient.delroomui) 
    {
        jsclient.delroomui.removeFromParent(true);
        delete jsclient.delroomui;
    }
}
//判断准备
function CheckReadyVisible(node, off) {
    if (off < 0) {
        node.visible = false;
        return;
    }
    var p0 = getUIPlayer(off);

    if(!p0){
        node.visible = false;
        return;
    }

    var sData = jsclient.data.sData;
    var tData = sData.tData;

    if (p0.mjState == TableState.isReady && tData.tState != TableState.waitJoin) {
        node.visible = true;
    } else {
        node.visible = false;
    }
    return node.visible;
}

function MJChichange(tag)
{
//	jsclient.gangCards = [];
//	jsclient.eatpos = [];
    mylog("chi " + jsclient.eatpos.length);
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
    card1.visible = false;
    card2.visible = false;
    card3.visible = false;
    card4.visible = false;
    card5.visible = false;
    card6.visible = false;
    card7.visible = false;
    card8.visible = false;
    card9.visible = false;

    if (jsclient.eatpos.length == 1)
    {
        MJChi2Net(jsclient.eatpos[0]);
    }
    else
    {
        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        changeuibg._node.visible = true;
        for (var i = 0; i < jsclient.eatpos.length; i++)
        {
            ShowMjChiCard(changeuibg._node, jsclient.eatpos[i]);
        }

    }
}

function MJGangchange(tag)
{
    if(jsclient.gangCards.length == 0) return;
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
    card1.visible = false;
    card2.visible = false;
    card3.visible = false;
    card4.visible = false;
    card5.visible = false;
    card6.visible = false;
    card7.visible = false;
    card8.visible = false;
    card9.visible = false;
    cc.log("jsclient.gangCards.length" + jsclient.gangCards.length);
    if (jsclient.gangCards.length == 1)
    {
        MJGang2Net(jsclient.gangCards[0]);
    }
    else
    {
        eat.chi0._node.visible = false;
        eat.chi1._node.visible = false;
        eat.chi2._node.visible = false;
        eat.peng._node.visible = false;
        eat.gang0._node.visible = false;
        eat.gang1._node.visible = false;
        eat.gang2._node.visible = false;
        eat.hu._node.visible = false;
        eat.guo._node.visible = false;
        changeuibg._node.visible = true;

        for (var i = 0; i < jsclient.gangCards.length; i++)
        {
            if (i == 0)
            {
                card2.visible = true;
                setCardPic(card2, jsclient.gangCards[i]);
            }
            else if (i == 1)
            {
                card5.visible = true;
                setCardPic(card5, jsclient.gangCards[i]);
            }
            else if (i == 2)
            {
                card8.visible = true;
                setCardPic(card8, jsclient.gangCards[i]);
            }
        }
    }
}

function emojiPlayAction(node, num) {
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
    var sumtime = 0;
    var playtime = 3;
    var imgSize;
    switch (num) {
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
    for (var i = 0; i < 15; i++) {
        var frame = cc.spriteFrameCache.getSpriteFrame(framename + i + ".png");
        if (frame) {
            imgSize = frame.getOriginalSize();
            arry.push(framename + i);
        }
    }
    //var animation = new cc.Animation(arry,0.3);
    //var animate = cc.animate(animation);
    var callback = function () {

        if (arry.length == number) {
            number = 0;

        }
        cc.log("||" + arry[number] + ".png");
        node.loadTexture(arry[number] + ".png", ccui.Widget.PLIST_TEXTURE);
        number++;
        sumtime = sumtime + delaytime;
        if (sumtime > playtime) {
            node.cleanup();
            node.visible = false;
        }

    };
    node.cleanup();
    node.visible = true;
    node.setSize(imgSize);
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(delaytime))));

}


function playResidueCardCount(node)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    var leftCard = tData.cardsNum - tData.cardNext;
    node.setString(leftCard);
}


createAnimation = function (path, count, rect) {
    var frames = [];
    var prefix = path;
    for (var temp_x = 0; temp_x < count; temp_x++) {
        var fileName = prefix + temp_x + ".png";
        var frame = new cc.SpriteFrame(fileName, rect);
        frames.push(frame);
    }
    var animation = new cc.Animation(frames, 0.25);
    var action = new cc.Animate(animation);
    return action;
};


function showchat(node, off, msg)
{
    var pl = getUIPlayer(off);
    var uid = msg.uid;
    var type = msg.type;
    var message = msg.msg;
    var num = msg.num;
    //mylog("uid"+uid+" type" +type +"message"+message+"||uid"+pl.info.uid);

    if (pl && msg.uid == pl.info.uid)
    {
        if (type == 0)
        {
            node.getParent().visible = true;
            node.setString(message);
            var callback = function ()
            {
                node.getParent().visible = false;
            };

            node.getParent().width = node.stringLength * node.fontSize + 72;
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        }
        else if (type == 1)
        {
            node.getParent().visible = true;
            node.setString(message);
            var callback = function ()
            {
                node.getParent().visible = false;
            };
            var musicnum = msg.num + 1;

            var one = node.getCustomSize().width / 20.0;
            node.getParent().width = node.stringLength * node.fontSize + 72;
            playEffect("fix_msg_" + musicnum);
            node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
        }
        else if (type == 2)
        {
            var em_node = node.getParent().getParent().getChildByName("emoji");
            emojiPlayAction(em_node, msg.num);
        }
        else if (type == 3)
        {
            cc.audioEngine.pauseMusic();
            cc.audioEngine.setEffectsVolume(1);

            cc.audioEngine.unloadEffect(message);
            cc.audioEngine.playEffect(message);

            node.getParent().setVisible(true);
            node.setString(" ");
            node.getParent().width = node.stringLength * node.fontSize + 72;

            var voicebg = node.getParent().getChildByName("voicebg");
            voicebg.setVisible(true);

            var callback = function ()
            {
                node.getParent().setVisible(false);
                voicebg.setVisible(false);
                voicebg.stopAllActions();
                cc.audioEngine.resumeMusic();
            };

            if (!jsclient.data._tempRecordVoiceAnimate)
            {
                jsclient.data._tempRecordVoiceAnimate = createAnimation("res/animate/voice/", 4, cc.rect(0, 0, 23, 30));
                jsclient.data._tempRecordVoiceAnimate.retain();
            }

            voicebg.runAction(cc.repeatForever(jsclient.data._tempRecordVoiceAnimate));
            node.runAction(cc.sequence(cc.delayTime(Number(num / 1000) < 1 ? 1 : Number(num / 1000)), cc.callFunc(callback)));
        }
    }
}


/**
 * 获取 录音动画
 * */
function getRecordStatusLayer() {
    if (!jsclient.data._tempRecordStatusLayer) {
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


        var tipsLabel = new cc.LabelTTF("手指上滑 , 取消发送", "", 20);
        tipsLabel.setPosition(layerSize.width * 0.5, layerSize.height * 0.15);
        voiceBackGround.addChild(tipsLabel);

        jsclient.data._tempVoiceStatusAnimate = createAnimation("res/animate/startRecord/", 7, cc.rect(0, 0, 44, 82));
        voiceStatusIcon.runAction(cc.repeatForever(jsclient.data._tempVoiceStatusAnimate));

        var callback = function () {
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

function initVData() {
    console.log("jsclient.remoteCfg" + jsclient.remoteCfg.voiceUrl);
    jsclient.data._tempRecordStatusLayer = null;
    jsclient.data._tempMessage = null;
    jsclient.data._tempRecordVoiceAnimate = null;
    jsclient.data._JiaheTempTime = null;
}

/**
 * 运行录音动画
 * */
function runRecordAction() {
    var animateLayer = getRecordStatusLayer();
    animateLayer.runStartRecord();
}

/**
 * 停止录音动画
 * */
function stopRecordAction() {
    var animateLayer = getRecordStatusLayer();
    animateLayer.runStopRecord();
}

/**
 * 取消录音动画
 * */
function cancelRecordAction() {
    var animateLayer = getRecordStatusLayer();
    animateLayer.runCancelRecord();
}

function shortRecordAction() {
    var animateLayer = getRecordStatusLayer();
    animateLayer.runShortRecord();
}

function getTouchListener()
{
    return{
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: false,
        status: null,
        onTouchBegan: function (touch, event)
        {
            console.log("在触摸东西");
            var target = event.getCurrentTarget();
            // 世界坐标转换 (子节点相对于父节点的位置)
            var pos = target.getParent().convertTouchToNodeSpace(touch);
            // 如果触碰起始地点在本区域中
            if (!cc.rectContainsPoint(target.getBoundingBox(), pos))
            {
                return false;
            }
            console.log("好吧");
            return true;
        },
        onTouchMoved: function (touch, event)
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
        onTouchEnded: function (touch, event)
        {
            return true;
        },
        onTouchCancelled: function (touch, event)
        {
            return true;
        }
    };
}

/**
 * 开始录音
 * */
function startRecord() {
    jsclient.data._JiaheTempTime = new Date();
    cc.audioEngine.pauseMusic();
    jsclient.native.StartRecord(jsb.fileUtils.getWritablePath(), "recordFile" + SelfUid());
    runRecordAction();
}

/**
 * 结束录音
 * */
function endRecord() {
    jsclient.data._JiaheTempTime = new Date().getTime() - jsclient.data._JiaheTempTime.getTime();
    jsclient.native.HelloOC(jsclient.data._JiaheTempTime);
    cc.audioEngine.resumeMusic();

    if (jsclient.data._JiaheTempTime > 1000) {
        jsclient.native.EndRecord("uploadRecord");
        stopRecordAction();
    } else {
        jsclient.data._JiaheTempTime = 0;
        jsclient.native.EndRecord("cancelRecord");
        shortRecordAction();
    }

}

/**
 * 取消录音
 * */
function cancelRecord() {
    jsclient.data._JiaheTempTime = 0;
    cc.audioEngine.resumeMusic();
    jsclient.native.EndRecord("cancelRecord");
    cancelRecordAction();
}


/**
 * 下载录音, 调用 播放函数
 * */
function downAndPlayVoice(uid, filePath) {
    var index = getIndexPlayer(uid);
    console.log("index is downAndPlayVoice" + index);
    jsclient.native.DownLoadFile(jsb.fileUtils.getWritablePath(), index + ".mp3", jsclient.remoteCfg.voiceUrl + filePath, "playVoice");
}


var selfArrowbk, playTips, selfCardBk, selfCard, selfCardBk1, selfCard1, selfCard2;
//听 胡 提示数据
var cardTipsData = {};

var PlayLayer = cc.Layer.extend(
    {
        jsBind:
        {
            _event:
            {
                initSceneData: function ()
                {
                    reConectHeadLayout(this);
                    CheckDelRoomUI();
                },

                mjhand: function ()
                {
                    // var sData = jsclient.data.sData;
                    // var tData = sData.tData;
                    // if (tData.roundNum != tData.roundAll)
                    //     return;
                    //
                    // var pls = sData.players;
                    // var ip2pl = {};
                    // for (var uid in pls)
                    // {
                    //     var pi = pls[uid];
                    //     var ip = pi.info.remoteIP;
                    //
                    //     if (ip) {
                    //         if (!ip2pl[ip])
                    //             ip2pl[ip] = [];
                    //
                    //         ip2pl[ip].push(unescape(pi.info.nickname || pi.info.name));
                    //     }
                    // }
                    // var ipmsg = [];
                    // for (var ip in ip2pl)
                    // {
                    //     var ips = ip2pl[ip];
                    //     if (ips.length > 1)
                    //     {
                    //         ipmsg.push("玩家:" + ips + "\n为同一IP地址\n")
                    //     }
                    // }
                    // if (ipmsg.length > 0)
                    // {
                    //     ShowSameIP(ipmsg.join(""));
                    // }
                    // else
                    // {
                    //     sendEvent("mjgeog");
                    // }


                    var sData = jsclient.data.sData;
                    var tData = sData.tData;
                    if (tData.roundNum != tData.roundAll)
                        return;

                    var pls = sData.players;
                    var plays = [];
                    var ipmsg = [];
                    var index = 0;
                    for (var uid  in pls)
                    {
                        var pl = pls[uid];
                        var geogData = pl.info.geogData;
                        if (geogData.latitude <= 0 || geogData.longitude <= 0)
                        {
                            ipmsg.push("未获取" + unescape(pl.info.nickname || pl.info.name) + "的地理位置.\n");

                            continue;
                        }

                        plays[index] = pl;
                        index++;
                    }


                    for (var i = 0; i < plays.length; i++)
                    {
                        var pi1 = plays[i];
                        var geogData1 = pi1.info.geogData;

                        for (var j = i + 1; j < plays.length; j++)
                        {
                            var pi2 = plays[j];
                            var geogData2 = pi2.info.geogData;
                            var distance = jsclient.native.CalculateLineDistance(
                                geogData1.latitude, geogData1.longitude, geogData2.latitude, geogData2.longitude);

                            if (distance < 100 && distance > 0)
                            {
                                ipmsg.push(unescape(pi1.info.nickname || pi1.info.name) + "和"
                                    + unescape(pi2.info.nickname || pi2.info.name) + "相距小于" + distance + "米\n");
                            }
                        }
                    }

                    if (ipmsg.length > 0)
                    {
                        ShowSameGeog(ipmsg.join(""));
                    }
                    else
                    {
                        sendEvent("playEffectFangui");
                    }
                },

                onlinePlayer: function ()
                {
                    reConectHeadLayout(this);
                },

                //麻将地理
                mjgeog: function () {
                    // var sData = jsclient.data.sData;
                    // var tData = sData.tData;
                    // if (tData.roundNum != tData.roundAll)
                    //     return;
                    //
                    // var pls = sData.players;
                    // var plays = [];
                    // var ipmsg = [];
                    // var index = 0;
                    // for (var uid  in pls)
                    // {
                    //     var pl = pls[uid];
                    //     var geogData = pl.info.geogData;
                    //     if (geogData.latitude <= 0 || geogData.longitude <= 0)
                    //     {
                    //         ipmsg.push("未获取" + unescape(pl.info.nickname || pl.info.name) + "的地理位置.\n");
                    //
                    //         continue;
                    //     }
                    //
                    //     plays[index] = pl;
                    //     index++;
                    // }
                    //
                    //
                    // for (var i = 0; i < plays.length; i++)
                    // {
                    //     var pi1 = plays[i];
                    //     var geogData1 = pi1.info.geogData;
                    //
                    //     for (var j = i + 1; j < plays.length; j++)
                    //     {
                    //         var pi2 = plays[j];
                    //         var geogData2 = pi2.info.geogData;
                    //         var distance = jsclient.native.CalculateLineDistance(
                    //             geogData1.latitude, geogData1.longitude, geogData2.latitude, geogData2.longitude);
                    //
                    //         if (distance < 100 && distance > 0)
                    //         {
                    //             ipmsg.push(unescape(pi1.info.nickname || pi1.info.name) + "和"
                    //                 + unescape(pi2.info.nickname || pi2.info.name) + "相距小于" + distance + "米\n");
                    //         }
                    //     }
                    // }
                    //
                    // if (ipmsg.length > 0)
                    // {
                    //     ShowSameGeog(ipmsg.join(""));
                    // }
                    // else
                    // {
                    //     sendEvent("playEffectFangui");
                    // }
                },

                game_on_hide: function () {
                    jsclient.tickGame(-1);
                },

                game_on_show: function () {
                    jsclient.tickGame(1);
                },

                LeaveGame: function () {
                    jsclient.runningHeartbeat = false;
                    jsclient.playui.removeFromParent(true);
                    delete jsclient.playui;
                    playMusic("bgMain");
                },

                //申请解散房间
                endRoom: function (msg) {

                    if (msg.showEnd)
                        this.addChild(new EndAllLayer());
                    else
                        jsclient.Scene.addChild(new EndRoomLayer());
                },

                //单局结束
                roundEnd:function () {
                    var sData = jsclient.data.sData;
                    if (sData.tData.roundNum <= 0)
                        this.addChild(new EndAllLayer());

                    this.addChild(new EndOneLayer());

                    //如果赢了显示买马
                    if (checkShowMa())
                        this.addChild(new ShowMaPanel());
                },

                moveHead:function () {
                    tableStartHeadPlayAction(this);
                },

                logout: function () {
                    if (jsclient.playui)
                    {
                        jsclient.runningHeartbeat = false;
                        jsclient.playui.removeFromParent(true);
                        delete jsclient.playui;
                    }
                },

                DelRoom: CheckDelRoomUI
            },

            backimg:{
                _layout: [[1.02, 1.02], [0.5, 0.5], [0, 0], true]
            },

            roundnumImg: {
                _layout: [[0.1, 0.1], [0.52, 0.5], [1, 0]]
                , _event: {
                    initSceneData: function (eD) {
                        this.visible = CheckArrowVisible();
                    }
                    , mjhand: function (eD) {
                        this.visible = CheckArrowVisible();
                    }
                    , onlinePlayer: function (eD) {
                        this.visible = CheckArrowVisible();
                    }
                }
                , roundnumAtlas: {
                    _text: function () {
                        var sData = jsclient.data.sData;
                        var tData = sData.tData;
                        if (tData) return tData.roundNum - 1;
                    }, _event: {
                        mjhand: function () {
                            var sData = jsclient.data.sData;
                            var tData = sData.tData;
                            if (tData) return this.setString(tData.roundNum - 1);
                        }
                    }
                }
            },

            cardNumImg:
            {
                _layout: [[0.1, 0.1], [0.485, 0.5], [-1.1, 0]],
                _event:
                {
                    initSceneData: function (eD)
                    {
                        this.visible = CheckArrowVisible();
                    },

                    mjhand: function (eD)
                    {
                        this.visible = CheckArrowVisible();
                    },

                    onlinePlayer: function (eD)
                    {
                        this.visible = CheckArrowVisible();
                    }
                },

                cardnumAtlas:
                {
                    _text: function ()
                    {
                        var sData = jsclient.data.sData;
                        var tData = sData.tData;
                        var leftCard = tData.cardsNum - tData.cardNext;
                        return leftCard;
                    },

                    _event:
                    {
                        waitPut: function ()
                        {
                            playResidueCardCount(this);
                        },
                        MJPut: function ()
                        {
                            playResidueCardCount(this);
                        },
                        MJGang: function ()
                        {
                            playResidueCardCount(this);
                        },
                        MJHu: function ()
                        {
                            playResidueCardCount(this);
                        },
                        newCard: function ()
                        {
                            playResidueCardCount(this);
                        }
                    }
                }
            },

            back: {
                // back: {_layout: [[1.02, 1.02], [0.5, 0.5], [0, 0], true]},
                clt: {
                    _layout: [[0.15, 0.15], [0, 1], [0.5, -0.5]],

                    canHu_hongzhong:
                    {
                        // _layout: [[0.15, 0.15], [0, 1], [0.5, -0.5]],

                        _event:
                        {
                            playEffectFangui:function ()
                            {
                                //判断首局执行
                                var sData = jsclient.data.sData;
                                if ((sData.tData.roundNum == sData.tData.roundAll) &&
                                    (sData.tData.withZhong || sData.tData.fanGui) &&
                                    (!sData.tData.twogui) && (sData.gameType != 7))
                                {
                                    playEffectFangui(selfCard, selfCardBk, selfArrowbk);
                                }
                                // else if((sData.tData.roundNum == sData.tData.roundAll) &&
                                //     (sData.tData.withZhong || sData.tData.fanGui) &&
                                //     (!sData.tData.twogui) && (sData.gameType == 7))
                                // {
                                //     playEffectFangui(selfCard, selfCardBk, selfArrowbk);
                                // }
                            },

                            initSceneData: function (eD)
                            {
                                var sData = jsclient.data.sData;
                                if ((sData.tData.withZhong || sData.tData.fanGui) && (!sData.tData.twogui))
                                {
                                    this.visible = true;
                                    resetEffectFangui(selfCard, selfCardBk);
                                }
                                else
                                    this.visible = false;
                            },

                            mjhand: function (eD)
                            {
                                //判断不是首局执行
                                var sData = jsclient.data.sData;
                                if ((sData.tData.roundNum != sData.tData.roundAll) && (sData.tData.withZhong || sData.tData.fanGui) && (!sData.tData.twogui))
                                    playEffectFangui(selfCard, selfCardBk, selfArrowbk);
                            },

                            roundEnd:function ()
                            {
                                //鬼牌重置为不显示，则会继续播放翻牌特效
                                selfCard.stopAllActions();
                                selfCard.visible = false;
                                selfCardBk.visible = false;

                                var sData = jsclient.data.sData;
                                if(sData.tData.withZhong)
                                    selfCard.visible = true;

                                if(sData.tData.fanGui && sData.tData.gameType == 7)
                                {
                                    selfCard.visible = true;
                                    setCardPic(selfCard, "hua");
                                }
                            },

                        },

                        _visible: function ()
                        {
                            return (jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui) && (!jsclient.data.sData.tData.twogui);
                        },

                        cardBk:
                        {
                            _run:function()
                            {
                                this.visible = false;
                                selfCardBk = this;
                            }
                        },

                        card:
                        {
                            _run:function ()
                            {
                                this.visible = false;
                                selfCard = this;
                            }
                        }
                    },

                    canHu_fangui:
                    {
                        _event:
                        {
                            playEffectFangui:function ()
                            {
                                //判断首局执行
                                var sData = jsclient.data.sData;
                                if (sData.tData.roundNum ==  sData.tData.roundAll && sData.tData.fanGui && sData.tData.twogui)
                                {
                                    playEffectFangui2(selfCard1, selfCard2, selfCardBk1, selfArrowbk);
                                }
                            },

                            initSceneData: function (eD)
                            {
                                var sData = jsclient.data.sData;
                                if (sData.tData.fanGui && sData.tData.twogui)
                                {
                                    this.visible = true;
                                    resetEffectFangui2(selfCard1, selfCard2, selfCardBk1);
                                }
                                else
                                    this.visible = false;
                            },

                            mjhand: function (eD)
                            {
                                //判断不是首局执行
                                var sData = jsclient.data.sData;
                                if (sData.tData.roundNum != sData.tData.roundAll && sData.tData.fanGui && sData.tData.twogui)
                                    playEffectFangui2(selfCard1, selfCard2, selfCardBk1, selfArrowbk);
                            },

                            roundEnd:function ()
                            {
                                //鬼牌重置为不显示，则会继续播放翻牌特效
                                selfCard1.stopAllActions();
                                selfCard2.stopAllActions();
                                selfCard1.visible = false;
                                selfCard2.visible = false;
                                selfCardBk.visible = false;
                            },
                        },

                        _visible: function ()
                        {
                            return (jsclient.data.sData.tData.fanGui && jsclient.data.sData.tData.twogui);
                        },

                        cardBk1:
                        {
                            _run:function()
                            {
                                this.visible = false;
                                selfCardBk1 = this;
                            }
                        },

                        card1:
                        {
                            _run:function ()
                            {
                                this.visible = false;
                                selfCard1 = this;
                            }
                        },

                        card2:
                        {
                            _run:function ()
                            {
                                this.visible = false;
                                selfCard2 = this;
                            }
                        }
                    }
                },
                clb: {_layout: [[0.15, 0.15], [0, 0], [0.5, 0.5]]},
                crt: {_layout: [[0.15, 0.15], [1, 1], [-0.5, -0.5]]},
                crb: {_layout: [[0.15, 0.15], [1, 0], [-0.5, 0.5]]},
                barl: {
                    _layout: [[0.01, 0.7], [0.005, 0.5], [0, 0], true],

                    playTips:
                    {
                        // _layout: [[0.25, 0.25], [0.065, 0.8], [0, 0]],

                        _event:
                        {
                            initSceneData: function (eD)
                            {
                                if (jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui)
                                    this.y = 450;
                                else
                                    this.y = 550;

                                var height = 50;
                                var count = 0;
                                var tipsImg = [];
                                tipsImg[count] = this.getChildByName("tableImage");

                                if(jsclient.data.sData.tData.withWind
                                    && jsclient.data.sData.tData.gameType != 4
                                    && jsclient.data.sData.tData.gameType != 6
                                    && jsclient.data.sData.tData.gameType != 7)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("withWind");
                                }
                                if (jsclient.data.sData.tData.canBigWin && jsclient.data.sData.tData.gameType == 6)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("dahu");
                                }
                                if (!jsclient.data.sData.tData.canBigWin && jsclient.data.sData.tData.gameType == 6)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("nodahu");
                                }
                                if (jsclient.data.sData.tData.canHu7
                                    && jsclient.data.sData.tData.gameType != 3
                                    && jsclient.data.sData.tData.gameType != 5
                                    && jsclient.data.sData.tData.gameType != 6
                                    && jsclient.data.sData.tData.gameType != 8)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("canHu7");
                                }
                                if (jsclient.data.sData.tData.canFan7)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("canFan7");
                                }
                                if (jsclient.data.sData.tData.jiejieGao)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("jjg");
                                }
                                if (jsclient.data.sData.tData.fanNum == 0 && jsclient.data.sData.tData.gameType == 4)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("fan0");
                                }
                                if (jsclient.data.sData.tData.fanNum == 1 && jsclient.data.sData.tData.gameType == 4)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("fan1");
                                }
                                if (jsclient.data.sData.tData.fanNum == 3 && jsclient.data.sData.tData.gameType == 4)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("fan3");
                                }
                                if (jsclient.data.sData.tData.zhongIsMa)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("zhongisma");
                                }
                                if(jsclient.data.sData.tData.maGenDi)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("magendi");
                                }
                                if(jsclient.data.sData.tData.maGenDiDuiDuiHu)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("genduiduihu");
                                }
                                if(jsclient.data.sData.tData.noCanJiHu)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("bukejihu");
                                }
                                if(jsclient.data.sData.tData.menQingJiaFen)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("menqingjiafen");
                                }
                                if(jsclient.data.sData.tData.gameType == 7 && jsclient.data.sData.tData.canJiHu )
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("canJiHu");
                                }
                                if(jsclient.data.sData.tData.guiJiaBei)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("guiJiaBei");
                                }
                                if(jsclient.data.sData.tData.guiJiaMa
                                    &&  jsclient.data.sData.tData.gameType != 1
                                    && jsclient.data.sData.tData.gameType != 3)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("guiJiaMa");
                                }
                                if((jsclient.data.sData.tData.gameType == 5 || jsclient.data.sData.tData.gameType == 6) && (jsclient.data.sData.tData.gui4Hu))
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("gui4Hu");
                                }
                                if(jsclient.data.sData.tData.gui4huBeiNum != 1)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("gui4huBeiNum");
                                }
                                if(jsclient.data.sData.tData.haiDiFanBei)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("haidibei");
                                }
                                if(jsclient.data.sData.tData.canDianPao)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("candianpao");
                                }


                                if (jsclient.data.sData.tData.baozhama)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("mabaozha");
                                }
                                if (jsclient.data.sData.tData.horse == 2)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("maima2");
                                }
                                if (jsclient.data.sData.tData.horse == 4)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("maima4");
                                }
                                if (jsclient.data.sData.tData.horse == 6)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("maima6");
                                }
                                if (jsclient.data.sData.tData.horse == 8)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("maima8");
                                }
                                if (jsclient.data.sData.tData.horse == 10)
                                {
                                    count++;
                                    tipsImg[count] = this.getChildByName("maima10");
                                }

                                var tipsNodeArr = this.getChildren();
                                for(var sprImg in tipsNodeArr)
                                {
                                    tipsNodeArr[sprImg].visible = false;
                                }

                                height = height + count * 40;
                                this.setContentSize(cc.size(this.getContentSize().width, height));
                                // log("玩法提示框大小：" + height + "  玩法提示个数：" + count);

                                for(var i = 0; i < tipsImg.length; i++)
                                {
                                    var nodeImg = tipsImg[i];
                                    nodeImg.visible = true;
                                    nodeImg.setPositionY(height - 35 * (i + 1));
                                }

                                var buttonOut = this.getChildByName("button_out");
                                buttonOut.visible = false;
                                buttonOut.y = height - height / 3;

                                var buttonIn = this.getChildByName("button_in");
                                buttonIn.visible = true;
                                buttonIn.y = height - height / 3;
                            },

                            mjhand:function ()
                            {
                                //鬼牌重置为不显示，则会继续播放翻牌特效
                                if (jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui)
                                    this.y = 450;
                                else
                                    this.y = 550;
                                
                            },
                        },

                        _run:function()
                        {
                            playTips = this;
                        },

                        button_in:
                        {
                            _click: function ()
                            {
                                var button_in = playTips.getChildByName("button_in");
                                var button_out = playTips.getChildByName("button_out");

                                var onActionEnd = function()
                                {
                                    button_in.setVisible(false);
                                    button_in.setTouchEnabled(true);

                                    button_out.visible = true;
                                };

                                button_in.setTouchEnabled(false);
                                var action = cc.sequence(cc.moveTo(0.2, cc.p(90, playTips.y)), cc.callFunc(onActionEnd));
                                playTips.runAction(action);
                            }
                        },

                        button_out:
                        {
                            _click: function ()
                            {
                                var button_in = playTips.getChildByName("button_in");
                                var button_out = playTips.getChildByName("button_out");

                                var onActionEnd = function()
                                {
                                    button_out.setVisible(false);
                                    button_out.setTouchEnabled(true);

                                    button_in.visible = true;
                                };

                                button_out.setTouchEnabled(false);
                                var action = cc.sequence(cc.moveTo(0.2, cc.p(-55, playTips.y)), cc.callFunc(onActionEnd));
                                playTips.runAction(action);
                            }
                        }
                    },
                },
                barl_0:{_layout: [[0.01, 0.7], [0.005, 0.5], [0, 0], true]},
                barr: {_layout: [[0.01, 0.7], [0.995, 0.5], [0, 0], true]},
                bart: {_layout: [[0.9, 0], [0.5, 0.99], [0, 0], true]},
                barb: {_layout: [[0.9, 0], [0.5, 0.01], [0, 0], true]},

                gdmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 1)
                            return true;
                        else
                            return false;
                    }
                },
                hzmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 2)
                            return true;
                        else
                            return false;
                    }
                },
                shzhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 3)
                            return true;
                        else
                            return false;
                    }
                },
                jipinghu: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 4)
                            return true;
                        else
                            return false;
                    }
                },
                dgmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 5)
                            return true;
                        else
                            return false;
                    }
                },
                ybzhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 6)
                            return true;
                        else
                            return false;
                    }
                },
                bddhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function ()
                    {
                        if (jsclient.data.sData.tData.gameType == 7 && jsclient.data.sData.tData.baidadahu)
                            return true;
                        else
                            return false;
                    }
                },
                bdjhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function ()
                    {
                        if (jsclient.data.sData.tData.gameType == 7 && jsclient.data.sData.tData.baidajihu)
                            return true;
                        else
                            return false;
                    }
                },

                chshmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function ()
                    {
                        if (jsclient.data.sData.tData.gameType == 8)
                            return true;
                        else
                            return false;
                    }
                },

            },

            banner: {
                _layout: [[0.878, 1], [0.5, 0.945], [0, 0]],
                wifi: {
                    _run: function () {
                        updateWIFI(this);
                    }
                },

                powerBar: {
                    _run: function () {
                        cc.log("powerBar_run");
                        updatePower(this);
                    },
                    _event: {
                        nativePower: function (d) {

                            this.setPercent(Number(d));
                        }
                    }
                },

                tableid: {
                    _text: function () {
                        return jsclient.data.sData.tData.tableid;
                    },

                    _event: {
                        initSceneData: function () {
                            this.setString(jsclient.data.sData.tData.tableid);
                        }
                    }
                },
                setting: {
                    _click: function () {
                        var settringLayer = new SettingLayer();
                        settringLayer.setName("PlayLayerClick");
                        jsclient.Scene.addChild(settringLayer);
                    }
                },

                Button_1: {
                    _click: function () {
                        jsclient.openWeb(2);
                    }
                }
            },

            arrowbk: {
                _layout: [[0.15, 0.15], [0.5, 0.5], [0, 0]],
                _event: {
                    initSceneData: function (eD)
                    {
                        this.visible = CheckArrowVisible();
                        SetArrowRotation(this)
                    },
                    mjhand: function (eD) {
                        this.visible = CheckArrowVisible();
                        SetArrowRotation(this);
                    },
                    onlinePlayer: function (eD) {
                        this.visible = CheckArrowVisible();
                    },
                    waitPut: function (eD) {
                        SetArrowRotation(this)
                    },
                    MJPeng: function (eD) {
                        SetArrowRotation(this)
                    },
                    MJChi: function (eD) {
                        SetArrowRotation(this)
                    },
                    MJGang: function (eD) {
                        SetArrowRotation(this)
                    },

                    MJFlower: function (eD) {
                        SetArrowRotation(this);
                    },
                    MJZhong: function (eD) {
                        SetArrowRotation(this);
                    },
                },
                _run:function()
                {
                    selfArrowbk = this;
                },
                number:
                {
                    _run: function ()
                    {
                        updateArrowbkNumber(this);
                    },
                    _event:
                    {
                        MJPeng: function ()
                        {
                            this.cleanup();
                            stopEffect(playAramTimeID);
                            updateArrowbkNumber(this);
                        },

                        MJChi: function ()
                        {
                            this.cleanup();
                            stopEffect(playAramTimeID);
                            updateArrowbkNumber(this);
                        },

                        waitPut: function ()
                        {
                            this.cleanup();
                            stopEffect(playAramTimeID);
                            updateArrowbkNumber(this);
                        },

                        MJPut: function (msg)
                        {
                            if (msg.uid == SelfUid())
                                this.cleanup();
                        },

                        roundEnd: function ()
                        {
                            this.cleanup();
                            stopEffect(playAramTimeID)
                        }
                    }
                },
                dir_down:{
                    _run: function () {
                        this.setVisible(false);
                    }
                },
                dir_right:{
                    _run: function () {
                        this.setVisible(false);
                    }
                },
                dir_left:{
                    _run: function () {
                        this.setVisible(false);
                    }
                },
                dir_up:{
                    _run: function () {
                        this.setVisible(false);
                    }
                },
                circleWind:{
                    _run: function () {
                        this.setVisible(false);
                    }
                }

            },

            wait: {
                backHomebtn: {
                    _layout: [[0.13, 0.13], [0.35, 0.5], [0, 0]],
                    _click: function (btn) {
                        var sData = jsclient.data.sData;
                        if (sData) {
                            if (IsRoomOwner()) {
                                jsclient.showMsg("返回大厅房间仍然保留\n赶快去邀请好友吧",
                                    function () {
                                        jsclient.playui.visible = false;
                                        sendEvent("returnHome");
                                    }, function () {
                                    });
                            }
                            else {
                                jsclient.showMsg("返回大厅房间将退出游戏\n确定退出房间吗",
                                    function () {
                                        jsclient.leaveGame();
                                    }, function () {
                                    });
                            }
                        }
                    }
                },

                //微信分享
                wxinvite:
                {
                    _layout: [[0.13, 0.13], [0.5, 0.5], [0, 0]],
                    _click: function ()
                    {
                        var tData = jsclient.data.sData.tData;
                        var gameType = tData.gameType;
                        var tableid = tData.tableid;
                        var withZhong = tData.withZhong;
                        var zhongIsMa = tData.zhongIsMa;
                        var canHu7 = tData.canHu7;
                        var canFan7 = tData.canFan7;
                        var feng = tData.withWind;
                        var horse = tData.horse;
                        var maBoom = tData.baozhama;
                        var roundNum = tData.roundNum;
                        var fanGui = tData.fanGui;
                        var twogui = tData.twogui;
                        var jiejieGao = tData.jiejieGao;
                        var fanNum = tData.fanNum;
                        var maxPlayer = tData.maxPlayer;
                        var bigWin = tData.canBigWin;
                        var baidajihu = tData.baidajihu;
                        var baidadahu = tData.baidadahu;
                        var haiDiFanBei = tData.haiDiFanBei;
                        var canDianPao = tData.canDianPao;
                        // var gui4huBeiNum = tData.gui4huBeiNum;
                        // var guiJiaMa = tData.guiJiaMa;
                        // var guiJiaBei = tData.guiJiaBei;
                        var noCanJiHu = tData.noCanJiHu;
                        var maGenDi = tData.maGenDi;
                        var maGenDiDuiDuiHu = tData.maGenDiDuiDuiHu;
                        var menQingJiaFen = tData.menQingJiaFen;

                        var gameTypeTips = "";
                        var withZhongTips = withZhong ? "红中鬼牌、" : "";
                        var zhongIsMaTips = zhongIsMa ? "红中算马、" : "";
                        var canHu7Tips = canHu7 ? "胡7对、" : "";
                        var canFan7Tips = canFan7 ? "7对加番、" : "";
                        var fengTisp = feng ? "带风牌、" : "不带风";
                        var jiejieGaoTips = jiejieGao ? "节节高、":"";
                        var fanGuiTips = fanGui ? "翻鬼牌、": "";
                        var fanNumTips = gameType == 4 ? fanNum + "番起胡、" : "";
                        var haiDiFanBeiTips = haiDiFanBei ? "海底翻倍、" : "";
                        var canDianPaoTips = canDianPao ? "可点炮、" : "";
                        var bigWinTips = "";
                        // var gui4huBeiNumTips = gui4huBeiNum == 1 ? "" : "4鬼牌翻倍";
                        // var guiJiaMaTips = guiJiaMa ? "有鬼牌玩法时,胡牌时牌型中无鬼加2马" : "";
                        // var guiJiaBeiTips = guiJiaBei ? "有鬼牌玩法时,胡牌时牌型中无鬼翻1倍" : "";
                        var noCanJiHuTips = noCanJiHu ? "不可鸡胡、" : "";
                        var maGenDiTips = maGenDi ? "马跟底分、" : "";
                        var maGenDiDuiDuiHuTips = maGenDiDuiDuiHu ? "对对胡、" : "";
                        var menQingJiaFenTips = menQingJiaFen ? "门清加分、" : "";

                        var horseTips = horse + "马、";
                        var roundNumTips = roundNum + "局,";

                        if(maBoom)
                        {
                            horseTips = "爆炸马、";
                        }

                        if(twogui)
                        {
                            fanGuiTips = "翻双鬼、";
                        }

                        if (gameType == 1)
                            gameTypeTips = maxPlayer == 4 ? "【广州麻将】": "【三人推倒胡】";
                        else if (gameType == 2)
                            gameTypeTips = "【惠州庄麻将】";
                        else if (gameType == 3)
                            gameTypeTips = "【香港麻将】";
                        else if (gameType == 4)
                        {
                            gameTypeTips = "【鸡平胡麻将】";
                            horseTips = "";
                        }
                        else if (gameType == 5)
                            gameTypeTips = "【东莞麻将】";
                        else if(gameType == 6)
                        {
                            gameTypeTips = "【一百张麻将】";
                            bigWinTips = bigWin ? "有大胡" : "无大胡";
                        }
                        else if(gameType == 7)
                        {
                            gameTypeTips = baidajihu ? "【百搭鸡胡】" : "【百搭大胡】";
                        }
                        else if(gameType == 8)
                        {
                            gameTypeTips = "【潮汕麻将】";
                        }

                        jsclient.native.wxShareUrl(
                            jsclient.remoteCfg.wxShareUrl,
                            gameTypeTips,
                            "房间号:" + tableid + ","
                            + withZhongTips + zhongIsMaTips + canHu7Tips + canFan7Tips
                            + bigWinTips + fengTisp + horseTips + fanGuiTips
                            + noCanJiHuTips + maGenDiTips + maGenDiDuiDuiHuTips
                            + menQingJiaFenTips + haiDiFanBeiTips + canDianPaoTips
                            + jiejieGaoTips + fanNumTips + roundNumTips
                            + "速度加入，只等你来【星悦麻将】");
                    }
                },

                delroom: {
                    _layout: [[0.13, 0.13], [0.65, 0.5], [0, 0]],
                    _click: function () {
                        jsclient.delRoom(true);
                    }
                },

                _event:
                {
                    returnPlayerLayer: function () {
                        jsclient.playui.visible = true;
                    },

                    initSceneData: function (eD) {
                        this.visible = CheckInviteVisible();
                    },

                    addPlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    },

                    removePlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    }
                }
            },

            down:
            {
                head:
                {
                    kuang:
                    {
                        _run: function ()
                        {
                            this.zIndex = 2;
                        }
                    },

                    zhuang:
                    {
                        _run: function ()
                        {
                            this.visible = false;
                        },
                        _event:
                        {
                            waitPut: function ()
                            {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function ()
                            {
                                if (CheckArrowVisible())
                                    showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },

                    linkZhuang:
                    {
                        _run: function ()
                        {
                            this.visible = false;
                        },
                        _event:
                        {
                            waitPut: function ()
                            {
                                showPlayerLinkZhuangLogo(this, 0);
                            },
                            initSceneData: function ()
                            {
                                if (CheckArrowVisible())
                                    showPlayerLinkZhuangLogo(this, 0);
                            },
                        }
                    },

                    hua:
                    {
                        _run: function ()
                        {
                            this.visible = false;
                        },
                        _event:
                        {
                            waitPut: function ()
                            {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function ()
                            {
                                if (CheckArrowVisible())
                                    showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },

                    zhong:
                    {
                        _run: function ()
                        {
                            this.visible = false;
                        },
                        _event:
                        {
                            waitPut: function ()
                            {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function ()
                            {
                                if (CheckArrowVisible())
                                    showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },

                    baojiuzhang:
                    {
                        _run: function ()
                        {
                            this.visible = false;
                        },
                        _event:
                        {
                            waitPut: function ()
                            {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function ()
                            {
                                if (CheckArrowVisible())
                                    showPlayerZhuangLogo(this, 0);
                            },
                            MJPeng: function ()
                            {
                                checkBaoJiuZhuangLogo(this, 0)
                            }
                        }
                    },

                    chatbg:
                    {
                        _run: function ()
                        {
                            this.getParent().zIndex = 600;
                        },
                        chattext:
                        {
                            _event:
                            {
                                MJChat: function (msg)
                                {
                                    showchat(this, 0, msg);
                                },

                                playVoice: function (voicePath)
                                {
                                    jsclient.data._tempMessage.msg = voicePath;
                                    showchat(this, 0, jsclient.data._tempMessage);
                                }
                            }
                        }
                    },

                    _click: function (btn)
                    {
                        showPlayerInfo(0, btn);
                    },

                },

                ready:
                {
                    _layout: [[0.07, 0.07], [0.5, 0.5], [0, -1.5]],
                    _run: function ()
                    {
                        CheckReadyVisible(this, 0);
                    },
                    _event:
                    {
                        moveHead: function ()
                        {
                            CheckReadyVisible(this, -1);
                        },

                        addPlayer: function ()
                        {
                            CheckReadyVisible(this, 0);
                        },

                        removePlayer: function ()
                        {
                            CheckReadyVisible(this, 0);
                        },

                        onlinePlayer: function ()
                        {
                            CheckReadyVisible(this, 0);
                        }
                    }
                },

                stand:
                {
                    _layout: [[0.055, 0], [0.5, 0], [7, 0.7]],
                    _visible: false,

                    _run:function()
                    {
                        this.zIndex = 500;
                    },

                    gui:
                    {
                        _visible : false
                    },

                    tips:
                    {
                        _visible : false
                    }
                },

                up: {_layout: [[0.055, 0], [0, 0], [0.8, 0.7]], _visible: false},
                down: {_layout: [[0.055, 0], [0, 0], [3, 1]], _visible: false},

                out0: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 2.8]], _visible: false},
                out1: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 3.7]], _visible: false},
                out2: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 4.6]], _visible: false},

                effectStateAct:
                {
                    _run: function ()
                    {
                        this.zIndex = 100;
                    },
                    ef_gang:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_peng:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_chi:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_guo:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_hua:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_hu:
                    {
                        _layout: [[0.2, 0.2], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                    ef_zhong:
                    {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function ()
                        {
                            this.visible = false;
                        }
                    },
                },

                _event:
                {
                    getLinkZhuang:function()
                    {
                        showCirclWindAndFengWei(0);
                    },
                    clearCardUI: function ()
                    {
                        clearCardUI(this, 0);
                    },
                    initSceneData: function (eD)
                    {
                        SetPlayerVisible(this, 0);
                    },
                    addPlayer: function (eD) {
                        SetPlayerVisible(this, 0);
                    },
                    removePlayer: function (eD)
                    {
                        SetPlayerVisible(this, 0);
                    },
                    mjhand: function (eD)
                    {
                        InitPlayerHandUI(this, 0);

                        var shield = this.getParent().getChildByName("shield");
                        if(shield)
                        {
                            shield.setVisible(true);
                            // shield.setTouchEnabled(true);
                            shield.runAction(cc.sequence(cc.DelayTime(1), cc.callFunc(function(){shield.setVisible(false);})));
                        }
                    },
                    roundEnd: function ()
                    {
                        InitPlayerNameAndCoin(this, 0);
                        resetFlowerForPlayer(this, 0);
                        resetZhongForPlayer(this,0);
                    },
                    newCard: function (eD)
                    {
                        HandleNewCard(this, eD, 0);
                    },
                    MJPut: function (eD)
                    {  //HandleMJPut(this,eD,0);
                    },
                    MJChi: function (eD)
                    {
                        HandleMJChi(this, eD, 0);
                    },
                    MJGang: function (eD)
                    {
                        HandleMJGang(this, eD, 0);
                    },
                    MJPeng: function (eD)
                    {
                        HandleMJPeng(this, eD, 0);
                    },
                    onlinePlayer: function (eD)
                    {
                        setOffline(this, 0);
                    },
                    MJTick: function (eD)
                    {
                        setOffline(this, 0);
                    },
                    MJFlower: function (eD)
                    {
                        HandleMJFlower(this, eD, 0);
                    },
                    MJZhong: function (eD)
                    {
                        HandleMJZhong(this, eD, 0);
                    },

                    showPutCardEff:function(tag)
                    {
                        //播放麻将的效果
                        showPutCarEffect(this, tag);
                    },

                    showDefCardEff:function()
                    {
                        //恢复麻将的效果
                        showDefCarCardEffect(this);
                    },

                    closeCardTipsEff:function()
                    {
                        //关闭听牌提示
                        closeCardTipsEffect(this);
                    },
                }
            },

            right:
            {
                head: {
                    kuang: {
                        _run: function () {
                            this.zIndex = 2;
                        }
                    },
                    zhuang: {
                        _run: function () {
                            this.visible = false;
                        }
                        , _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                            }
                        }
                    },
                    linkZhuang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerLinkZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerLinkZhuangLogo(this, 1);
                            },
                        }
                    },
                    hua: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                            }
                        }
                    },
                    zhong:{
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                            }
                        }
                    },
                    baojiuzhang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                            },
                            MJPeng: function () {
                                checkBaoJiuZhuangLogo(this, 1)
                            }
                        }
                    },
                    chatbg: {
                        _run: function () {
                            this.getParent().zIndex = 500;
                        }, chattext: {
                            _event: {

                                MJChat: function (msg) {

                                    showchat(this, 1, msg);
                                }, playVoice: function (voicePath) {
                                    jsclient.data._tempMessage.msg = voicePath;
                                    showchat(this, 1, jsclient.data._tempMessage);
                                }
                            }
                        }
                    },
                    _click: function (btn) {
                        showPlayerInfo(1, btn);
                    },

                },

                ready: {
                    _layout: [[0.07, 0.07], [0.5, 0.5], [2, 0]],
                    _run: function () {
                        CheckReadyVisible(this, 1);
                    },
                    _event: {
                        moveHead: function () {
                            CheckReadyVisible(this, -1);
                        }
                        , addPlayer: function () {
                            CheckReadyVisible(this, 1);
                        }, removePlayer: function () {
                            CheckReadyVisible(this, 1);
                        }
                        , onlinePlayer: function () {
                            CheckReadyVisible(this, 1);
                        }
                    }
                },

                stand: {_layout: [[0, 0.08], [1, 1], [-7, -2.5]], _visible: false},

                up: {_layout: [[0, 0.06], [1, 0], [-4, 6]], _visible: false},
                down: {_layout: [[0, 0.06], [1, 0], [-4, 6.3]], _visible: false},

                out0: {_layout: [[0, 0.06], [1, 0.5], [-4.1, -3.8]], _visible: false},
                out1: {_layout: [[0, 0.06], [1, 0.5], [-5.1, -3.8]], _visible: false},
                out2: {_layout: [[0, 0.06], [1, 0.5], [-6.1, -3.8]], _visible: false},
                effectStateAct: {
                    //_layout:[[0.1,0.1],[0.1,0.5],[0,0],true],
                    _run: function () {
                        this.zIndex = 100;
                    },
                    ef_gang: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                    ef_peng: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_chi: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_zhong: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                },
                _event: {
                    getLinkZhuang:function(){
                        showCirclWindAndFengWei(1);
                    },
                    clearCardUI: function () {
                        clearCardUI(this, 1);
                    },
                    initSceneData: function (eD) {
                        SetPlayerVisible(this, 1);
                    },
                    addPlayer: function (eD) {
                        SetPlayerVisible(this, 1);
                    },
                    removePlayer: function (eD) {
                        SetPlayerVisible(this, 1);
                    },
                    mjhand: function (eD) {
                        InitPlayerHandUI(this, 1);
                    },
                    roundEnd: function () {
                        InitPlayerNameAndCoin(this, 1);
                        resetFlowerForPlayer(this, 1);
                        resetZhongForPlayer(this,1);
                    },
                    waitPut: function (eD) {
                        HandleWaitPut(this, eD, 1);
                    },
                    MJPut: function (eD) {
                        HandleMJPut(this, eD, 1);
                    },
                    MJChi: function (eD) {
                        HandleMJChi(this, eD, 1);
                    },
                    MJGang: function (eD) {
                        HandleMJGang(this, eD, 1);
                    },
                    MJPeng: function (eD) {
                        HandleMJPeng(this, eD, 1);
                    },
                    onlinePlayer: function (eD) {
                        setOffline(this, 1);
                    },
                    MJTick: function (eD) {
                        setOffline(this, 1);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 1);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 1);
                    },

                    showPutCardEff:function(tag){
                        //播放麻将的效果
                        showPutCarEffect(this, tag);
                    },

                    showDefCardEff:function(){
                        //恢复麻将的效果
                        showDefCarCardEffect(this);
                    }
                }
            },

            top:
            {
                head: {
                    kuang: {
                        _run: function () {
                            this.zIndex = 2;
                        }
                    },
                    zhuang: {
                        _run: function () {
                            this.visible = false;
                        }, _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 2);
                            }
                            , initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                            }
                        }

                    },
                    linkZhuang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerLinkZhuangLogo(this, 2);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerLinkZhuangLogo(this, 2);
                            }
                        }
                    },
                    hua: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 2);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                            }
                        }
                    },
                    zhong:{
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 2);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                            }
                        }
                    },
                    baojiuzhang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 2);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                            },
                            MJPeng: function () {
                                checkBaoJiuZhuangLogo(this, 2)
                            }
                        }
                    },
                    chatbg: {
                        _run: function () {
                            this.getParent().zIndex = 10000;
                        }, chattext: {
                            _event: {

                                MJChat: function (msg) {

                                    showchat(this, 2, msg);
                                }, playVoice: function (voicePath) {
                                    jsclient.data._tempMessage.msg = voicePath;
                                    showchat(this, 2, jsclient.data._tempMessage);
                                }
                            }
                        }
                    }
                    , _click: function (btn) {
                        showPlayerInfo(2, btn);
                    },

                },
                ready: {
                    _layout: [[0.07, 0.07], [0.5, 0.5], [0, 1.5]],
                    _run: function () {
                        CheckReadyVisible(this, 2);
                    },
                    _event: {
                        moveHead: function () {
                            CheckReadyVisible(this, -1);
                        }
                        , addPlayer: function () {
                            CheckReadyVisible(this, 2);
                        }, removePlayer: function () {
                            CheckReadyVisible(this, 2);
                        }
                        , onlinePlayer: function () {
                            CheckReadyVisible(this, 2);
                        }
                    }
                },

                stand: {_layout: [[0, 0.07], [0.5, 1], [-6, -2.5]], _visible: false},

                up: {_layout: [[0, 0.07], [0.5, 1], [6, -2.5]], _visible: false},
                down: {_layout: [[0, 0.07], [0.5, 1], [6, -2.2]], _visible: false},

                out0: {_layout: [[0, 0.08], [0.5, 1], [5.5, -3.5]], _visible: false},
                out1: {_layout: [[0, 0.08], [0.5, 1], [5.5, -4.4]], _visible: false},
                out2: {_layout: [[0, 0.08], [0.5, 1], [5.5, -5.4]], _visible: false},

                effectStateAct: {
                    _run: function () {
                        this.zIndex = 100;
                    },
                    ef_gang: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_peng: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_chi: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_zhong: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                },

                _run:function()
                {
                    if (IsThreeTable())
                        this.visible = false;
                },

                _event: {
                    getLinkZhuang:function(){
                        showCirclWindAndFengWei(2);
                    },
                    clearCardUI: function () {
                        clearCardUI(this, 2);
                    },
                    initSceneData: function (eD) {
                        SetPlayerVisible(this, 2);
                    },
                    addPlayer: function (eD) {
                        SetPlayerVisible(this, 2);
                    },
                    removePlayer: function (eD) {
                        SetPlayerVisible(this, 2);
                    },
                    mjhand: function (eD) {
                        InitPlayerHandUI(this, 2);
                    },
                    roundEnd: function () {
                        InitPlayerNameAndCoin(this, 2);
                        resetFlowerForPlayer(this, 2);
                        resetZhongForPlayer(this,2);
                    },
                    waitPut: function (eD) {
                        HandleWaitPut(this, eD, 2);
                    },
                    MJPut: function (eD) {
                        HandleMJPut(this, eD, 2);
                    },
                    MJChi: function (eD) {
                        HandleMJChi(this, eD, 2);
                    },
                    MJGang: function (eD) {
                        HandleMJGang(this, eD, 2);
                    },
                    MJPeng: function (eD) {
                        HandleMJPeng(this, eD, 2);
                    },
                    onlinePlayer: function (eD) {
                        setOffline(this, 2);
                    },
                    MJTick: function (eD) {
                        setOffline(this, 2);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 2);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 2);
                    },

                    showPutCardEff:function(tag){
                        //播放麻将的效果
                        showPutCarEffect(this, tag);
                    },

                    showDefCardEff:function(){
                        //恢复麻将的效果
                        showDefCarCardEffect(this);
                    }
                }
            },

            left:
            {
                head: {
                    kuang: {
                        _run: function () {
                            this.zIndex = 2;
                        }
                    },
                    zhuang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 3);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 3);
                            }
                        }
                    },
                    linkZhuang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerLinkZhuangLogo(this, 3);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerLinkZhuangLogo(this, 3);
                            },
                        }
                    },
                    hua: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 3);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 3);
                            }
                        }
                    },
                    zhong:{
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 3);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 3);
                            }
                        }
                    },
                    baojiuzhang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 3);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 3);
                            },
                            MJPeng: function () {
                                checkBaoJiuZhuangLogo(this, 3)
                            }
                        }
                    },
                    chatbg: {
                        _run: function () {
                            this.getParent().zIndex = 500;
                        },
                        chattext: {
                            _event: {

                                MJChat: function (msg) {
                                    showchat(this, 3, msg);
                                },
                                playVoice: function (voicePath) {
                                    jsclient.data._tempMessage.msg = voicePath;
                                    showchat(this, 3, jsclient.data._tempMessage);
                                }
                            }
                        }
                    },
                    _click: function (btn) {
                        showPlayerInfo(3, btn);
                    }
                },
                ready: {
                    _layout: [[0.07, 0.07], [0.5, 0.5], [-2, 0]],
                    _run: function () {
                        CheckReadyVisible(this, 3);
                    },
                    _event: {
                        moveHead: function () {
                            CheckReadyVisible(this, -1);
                        }
                        , addPlayer: function () {
                            CheckReadyVisible(this, 3);
                        }, removePlayer: function () {
                            CheckReadyVisible(this, 3);
                        }
                        , onlinePlayer: function () {
                            CheckReadyVisible(this, 3);
                        }
                    }
                },

                up: {_layout: [[0, 0.05], [0, 1], [3.6, -3.3]], _visible: false},
                down: {_layout: [[0, 0.05], [0, 1], [3.6, -3]], _visible: false},
                stand: {_layout: [[0, 0.08], [0, 0], [6.5, 3]], _visible: false},

                out0: {_layout: [[0, 0.06], [0, 0.5], [4, 3.8]], _visible: false},
                out1: {_layout: [[0, 0.06], [0, 0.5], [5, 3.8]], _visible: false},
                out2: {_layout: [[0, 0.06], [0, 0.5], [6, 3.8]], _visible: false},
                effectStateAct: {
                    _run: function () {
                        this.zIndex = 100;
                    },
                    ef_gang: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_peng: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_chi: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_zhong: {
                        _layout: [[0.1, 0.1], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                },
                _event: {
                    getLinkZhuang:function(){
                        showCirclWindAndFengWei(3);
                    },
                    clearCardUI: function () {
                        clearCardUI(this, 3);
                    },
                    initSceneData: function (eD) {
                        SetPlayerVisible(this, 3);
                    },
                    addPlayer: function (eD) {
                        SetPlayerVisible(this, 3);
                    },
                    removePlayer: function (eD) {
                        SetPlayerVisible(this, 3);
                    },
                    mjhand: function (eD) {
                        InitPlayerHandUI(this, 3);
                    },
                    roundEnd: function () {
                        InitPlayerNameAndCoin(this, 3);
                        resetFlowerForPlayer(this, 3);
                        resetZhongForPlayer(this,3);
                    },
                    waitPut: function (eD) {
                        HandleWaitPut(this, eD, 3);
                    },
                    MJPut: function (eD) {
                        HandleMJPut(this, eD, 3);
                    },
                    MJChi: function (eD) {
                        HandleMJChi(this, eD, 3);
                    },
                    MJGang: function (eD) {
                        HandleMJGang(this, eD, 3);
                    },
                    MJPeng: function (eD) {
                        HandleMJPeng(this, eD, 3);
                    },
                    onlinePlayer: function (eD) {
                        setOffline(this, 3);
                    },
                    MJTick: function (eD) {
                        setOffline(this, 3);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 3);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 3);
                    },

                    showPutCardEff:function(tag){
                        //播放麻将的效果
                        showPutCarEffect(this, tag);
                    },

                    showDefCardEff:function(){
                        //恢复麻将的效果
                        showDefCarCardEffect(this);
                    }
                }
            },

            eat:
            {
                chi0: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [1.3, 2.5]],
                    _touch: function (btn, eT)
                    {
                        if (eT == 2)
                            MJChichange(btn.tag);
                    },
                    bgimg:
                    {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    },
                    bgground:
                    {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    },
                    card1: {},
                    card2: {},
                    card3: {}
                },

                chi1: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [1.3, 3.8]],
                    _touch: function (btn, eT) {
                        if (eT == 2) MJChichange(btn.tag);
                    }
                },

                chi2: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [1.3, 5.1]],
                    _touch: function (btn, eT)
                    {
                        if (eT == 2) MJChichange(btn.tag);
                    }

                },

                peng: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [0, 2.5]],
                    _touch: function (btn, eT) {
                        if (eT == 2) MJPeng2Net();
                    },
                    bgimg: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },

                gang0: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-1.7, 2.5]],
                    card1: {},
                    _touch: function (btn, eT) {
                        if (eT == 2) MJGangchange(btn.tag);
                    },
                    bgimg: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    },
                    bgground: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },

                gang1: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-1.7, 3.8]],
                    card: {},
                    _touch: function (btn, eT) {
                        if (eT == 2) MJGangchange(btn.tag);
                    }
                },

                gang2: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-1.7, 5.1]],
                    card: {},
                    _touch: function (btn, eT) {
                        if (eT == 2) MJGangchange(btn.tag);
                    }
                },

                guo: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [4.6, 2.5]],
                    _touch: function (btn, eT) {
                        if (eT == 2)
                            jsclient.MJPass2Net();
                    },
                    bgimg: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },

                hu: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-3, 2.5]],
                    _touch: function (btn, eT) 
                    {
                        if (eT == 2) 
                            MJHu2Net();
                    },

                    bgimg: 
                    {
                        _run: function () 
                        {
                            this.zIndex = -1;
                        }
                    }
                },

                changeui: {
                    changeuibg:
                    {
                        _layout: [[0.6, 0.6], [0.5, 0], [0, 0]],
                        _run: function ()
                        {
                            this.y = this.getParent().getParent().getChildByName("chi0").y;
                            this.visible = false;
                        },
                        card1:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(0);
                                }
                            }
                        },
                        card2: {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    if (btn.getParent().getChildByName("card1").visible)
                                    {
                                        MJChi2Net(0);
                                    }
                                    else
                                    {
                                        MJGang2Net(btn.tag);
                                    }
                                }
                            }
                        },
                        card3:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(0)
                                }
                            }
                        },

                        card4: {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(1);
                                }
                            }
                        },
                        card5:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    if (btn.getParent().getChildByName("card4").visible)
                                    {
                                        MJChi2Net(1);
                                    }
                                    else
                                    {
                                        MJGang2Net(btn.tag);
                                    }
                                }
                            }
                        },
                        card6:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(1);
                                }
                            }
                        },


                        card7:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(2);
                                }
                            }
                        },
                        card8:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    if (btn.getParent().getChildByName("card7").visible)
                                    {
                                        MJChi2Net(2);
                                    }
                                    else
                                    {
                                        MJGang2Net(btn.tag);
                                    }
                                }
                            }
                        },
                        card9:
                        {
                            _touch: function (btn, et)
                            {
                                if (et == 2)
                                {
                                    MJChi2Net(2);
                                }
                            }
                        },
                        
                        guobg:
                        {
                            guo:
                            {
                                _touch: function (btn, eT)
                                {
                                    if (eT == 2) 
                                        jsclient.MJPass2Net();
                                }
                            },
                            fanhui:
                            {
                                _touch: function (btn, et)
                                {
                                    if (et == 2)
                                    {
                                        btn.getParent().getParent().visible = false;
                                        CheckEatVisible(jsclient.playui.jsBind.eat);
                                    }
                                }
                            }
                        }

                    }
                },

                _event: {
                    MJPass: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    mjhand: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    waitPut: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    MJPut: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    MJPeng: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    MJChi: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    MJGang: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    roundEnd: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    initSceneData: function (eD) {
                        //CheckEatVisible(jsclient.playui.jsBind.eat);
                        //reconnect时，比 mjhand delay 执行
                        function delayExe() 
                        {
                            CheckEatVisible(jsclient.playui.jsBind.eat);
                        }

                        this.runAction(cc.sequence(cc.DelayTime(0.1), cc.callFunc(delayExe)));
                    },
                    MJFlower: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                    MJZhong: function (eD) {
                        CheckEatVisible(jsclient.playui.jsBind.eat);
                    },
                }
            },

            cardHuTips:
            {
                _layout: [[0.4, 0.4], [0.3, 0.25], [0, 0]],
                _visible:false,
                _event:
                {
                    showCardTipsEff:function(tag)
                    {
                        //提示胡牌
                        showCanHuTipsPanel(this, tag);
                    },

                    closeCardTipsEff:function()
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },

                    roundEnd:function()
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },

                    MJChi:function (eD)
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },
                    MJGang:function (eD)
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },
                    MJPeng:function (eD)
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },

                    MJHu:function ()
                    {
                        //关闭听牌提示
                        this.visible = false;
                    },

                },
            },

            chat_btn:
            {
                _layout: [[0.12, 0.12], [0.933, 0.4], [0, 0]],
                _click: function () {
                    var chatlayer = new ChatLayer();
                    jsclient.Scene.addChild(chatlayer);
                }
            },

            voice_btn:
            {
                _layout: [[0.12, 0.12], [0.933, 0.25], [0, 0]],
                _run: function ()
                {
                    initVData();
                    cc.eventManager.addListener(getTouchListener(), this);
                    //ios隐藏
                    //if(cc.sys.OS_IOS==cc.sys.os) this.visible=false;
                },
                _touch: function (btn, eT)
                {
                    // 点击开始录音 松开结束录音,并且上传至服务器, 然后通知其他客户端去接受录音消息, 播放
                    if (eT == 0)
                    {
                        startRecord();
                    }
                    else if (eT == 2)
                    {
                        endRecord();
                    }
                    else if (eT == 3)
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

                    uploadRecord: function (filePath)
                    {
                        if (filePath)
                        {
                            jsclient.native.HelloOC("upload voice file");
                            jsclient.native.UploadFile(filePath, jsclient.remoteCfg.voiceUrl, "sendVoice");
                        }
                        else
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

                        var getFileName = /[^\/]+$/;
                        var extensionName = getFileName.exec(fullFilePath);
                        var fileName = extensionName[extensionName.length - 1];
                        console.log("sfileName is:" + fileName);

                        jsclient.gamenet.request("pkroom.handler.tableMsg",
                            {
                            cmd: "downAndPlayVoice",
                            uid: SelfUid(),
                            type: 3,
                            msg: fileName,
                            num: jsclient.data._JiaheTempTime
                        });
                        jsclient.native.HelloOC("download file");
                    },

                    downAndPlayVoice: function (msg)
                    {
                        jsclient.native.HelloOC("downloadPlayVoice ok");
                        jsclient.data._tempMessage = msg;
                        jsclient.native.HelloOC("mas is" + JSON.stringify(msg));
                        downAndPlayVoice(msg.uid, msg.msg);
                    }
                }
            },

            shield:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],

                _visible:function ()
                {
                    return false;
                },
            }
        },

        ctor: function ()
        {
            this._super();
            var playui = ccs.load(res.Play_json);
            playMusic("bgFight");
            ConnectUI2Logic(playui.node, this.jsBind);
            this.addChild(playui.node);
            jsclient.lastMJTick = Date.now();
            this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function ()
            {
                if (jsclient.game_on_show) jsclient.tickGame(0);
            }), cc.delayTime(7))));
            jsclient.playui = this;

            if( !jsclient.runningHeartbeat )
            {
                this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(jsclient.heartbeatGame), cc.DelayTime(5))));
                jsclient.runningHeartbeat = true;
            }

            return true;
        },
    });