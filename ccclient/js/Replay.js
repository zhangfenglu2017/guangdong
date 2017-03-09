

function newReplayLayer()
{
    // var TableState =
    // {
    //     waitJoin: 1,
    //     waitReady: 2,
    //     waitPut: 3,
    //     waitEat: 4,
    //     waitCard: 5,
    //     roundFinish: 6,
    //     isReady: 7
    // };

    //图片提示
    // var ActionType =
    // {
    //     CHI: 1,
    //     PENG: 2,
    //     GANG: 3,
    //     LIANG: 4,
    //     HU: 5,
    //     GUO: 6,
    //     FLOWER: 7
    // };

    // function ShowEatActionAnim(node, actType, off)
    // {
    //     if (off == 0)
    //         return;
    //
    //     var eatNode = node.getChildByName("effectStateAct");
    //     var childActionNode = null;
    //     var callback = function ()
    //     {
    //         childActionNode.visible = false;
    //     };
    //
    //     switch (actType) {
    //         case ActionType.CHI:
    //             childActionNode = eatNode.getChildByName("ef_chi");
    //             childActionNode.visible = true;
    //             childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
    //             break;
    //         case ActionType.GANG:
    //             childActionNode = eatNode.getChildByName("ef_gang");
    //             childActionNode.visible = true;
    //             childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
    //             break;
    //         case ActionType.PENG:
    //             childActionNode = eatNode.getChildByName("ef_peng");
    //             childActionNode.visible = true;
    //             childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
    //             break;
    //         case ActionType.LIANG:
    //         // 	childActionNode=eatNode.getChildByName("ef_chi");
    //         case ActionType.HU:
    //             childActionNode = eatNode.getChildByName("ef_hu");
    //             childActionNode.visible = true;
    //             childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
    //             break;
    //         case ActionType.FLOWER:
    //             childActionNode = eatNode.getChildByName("ef_hua");
    //             childActionNode.visible = true;
    //             childActionNode.runAction(cc.sequence(cc.delayTime(1.5), cc.callFunc(callback)));
    //             break;
    //         default:
    //             break;
    //     }
    //
    // }

    // function SelfUid() {
    //     return jsclient.data.pinfo.uid
    // }

    // function IsMyTurn() {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     return SelfUid() == tData.uids[tData.curPlayer];
    // }

    // function PutAwayCard(cdui, cd) {
    //     var children = cdui.parent.children;
    //     var mjhandNum = 0;
    //     var standUI = cdui.parent.getChildByName("stand");
    //     for (var i = 0; i < children.length; i++)
    //     {
    //         if (children[i].name == "mjhand")
    //         {
    //             if (children[i].y > standUI.y + 10)
    //                 children[i].y = standUI.y;
    //             mjhandNum++;
    //         }
    //     }
    //
    //     var pl = getUIPlayer(0);
    //     if(!pl)
    //         return;
    //
    //     if (mjhandNum == pl.mjhand.length)
    //     {
    //         jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPut", card: cd});
    //         jsclient.lastPutPos = {x: cdui.x, y: cdui.y};
    //         HandleMJPut(cdui.parent, {uid: SelfUid(), card: cd}, 0);
    //     }
    // }

    // jsclient.MJPass2Net = function ()
    // {
    //     log("调用 replay 中的 MJPass2Net 方法...");
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     if (IsMyTurn() && tData.tState == TableState.waitPut)
    //     {
    //         var cduis = jsclient.replayui.jsBind.down._node.children;
    //         var pl = jsclient.data.sData.players[SelfUid()];
    //         var lastCard = pl.mjhand[pl.mjhand.length - 1];
    //         for (var i = cduis.length - 1; i >= 0; i--)
    //         {
    //             if (cduis[i].tag == lastCard)
    //             {
    //                 PutAwayCard(cduis[i], lastCard);
    //                 break;
    //             }
    //         }
    //     }
    //     else
    //     {
    //         var pl = getUIPlayer(0);
    //
    //         if(pl == null)
    //             return;
    //
    //         if (jsclient.replayui.jsBind.eat.hu._node.visible)
    //         {
    //             pl.skipHu = true;
    //         }
    //         jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPass"});
    //
    //         pl.mjState = TableState.waitCard;
    //         // CheckEatVisible(jsclient.replayui.jsBind.eat);
    //     }
    // }

    // function MJGang2Net(cd) {
    //     jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJGang", card: cd});
    // }

    // function MJChi2Net(pos) {
    //     jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJChi", pos: pos});
    // }

    // function MJHu2Net() {
    //     jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJHu"});
    // }

    // function MJPeng2Net() {
    //     jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJPeng"});
    // }

    // function ShowMjChiCard(node, off)
    // {
    // }
    //
    // function CheckChangeuiVisible()
    // {
    //     jsclient.replayui.jsBind.eat.changeui.changeuibg._node.visible = false;
    // }
    //
    // function ShowSkipHu()
    // {
    //     var jsonui = ccs.load("res/SkipHu.json");
    //     doLayout(jsonui.node.getChildByName("Image_1"), [0.2, 0.2], [0.5, 0.3], [0, 0]);
    //     jsclient.Scene.addChild(jsonui.node);
    //     jsonui.node.runAction(cc.sequence(cc.delayTime(2), cc.removeSelf()));
    // }

    // function CheckEatVisible(eat)
    // {
    //
    // }

    function SetPlayerVisible(node, off)
    {
        var pl = getUIPlayer(off);

        var head = node.getChildByName("head");
        var name = head.getChildByName("name");
        var offline = head.getChildByName("offline");
        var coin = head.getChildByName("coin");

        if (pl)
        {
            name.visible = true;
            coin.visible = false;
            offline.visible = false;
            
            jsclient.loadWxHead(pl.info.headimgurl, head, 64, 62, 0.2, 1, "WxHead");
            // setOffline(node, off);
        }
        else
        {
            name.visible = false;
            offline.visible = false;
            coin.visible = false;
            
            var WxHead = head.getChildByName("WxHead");
            if (WxHead) 
                WxHead.removeFromParent(true);
        }
    }

    // function CheckInviteVisible() {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     if (TableState.waitJoin == tData.tState) {
    //         return Object.keys(sData.players).length < 4;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // function CheckArrowVisible() {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //
    //     //mylog("CheckArrowVisible "+tData.tState);
    //
    //     if (TableState.waitPut == tData.tState
    //         || TableState.waitEat == tData.tState
    //         || TableState.waitCard == tData.tState
    //     ) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    // function clearCardUI(node) {
    //     mylog("clearCardUI");
    //     var children = node.children;
    //     for (var i = 0; i < children.length; i++) {
    //         var ni = children[i];
    //         if (ni.getName() != "effectStateAct" &&
    //             ni.name != "head" && ni.name != "up" &&
    //             ni.name != "down" && ni.name != "stand" &&
    //             ni.name != "out0" && ni.name != "out1" &&
    //             ni.getName() != "ready")
    //         {
    //             ni.removeFromParent(true);
    //         }
    //     }
    // }

    function HandleMJFlower(node, msg, off)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
        var pl = getUIPlayer(off);
        if(pl == null)
            return;

        RemoveBackNode(node, "mjhand", 1, msg.card);
        // RestoreCardLayout(node, off);
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
                RemoveBackNode(node, "mjhand", 1, msg.card);
                //if (off == 0) {
                //    RemoveBackNode(node, "mjhand", 1, msg.card);
                //}
                //else if (off == 1) {
                //    RemoveBackNode(node, "standPri", 1);
                //}
                //else if (off == 2 || off == 3) {
                //    RemoveFrontNode(node, "standPri", 1);
                //}
                //不显示花牌
                // if(flowerShowTag != 2)
                // {
                // 	AddNewCard(node,"up","flower",msg.card,off);
                // }
                //RestoreCardLayout(node, off);
                //setZhongText(node, pl);
                //ShowEatActionAnim(node, ActionType.ZHONG, off);//将来显示花用
            }
        }
    }

    function HandleNewCard(node, msg, off)
    {
        /*
         *去除过期的newcard 标签
         *
         for (var i = 0; i < node.children.length; i++) {
         if (node.children[i].isnewCard)
         {
         node.children[i].isnewCard = false;
         }

         }*/
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        /*var selfIndex=uids.indexOf(SelfUid());
         selfIndex= (tData.curPlayer+4-selfIndex)%4;
         */
        var pl = getUIPlayer(off);

        if(pl == null)
            return;

        var curIndex = tData.curPlayer;
        if(curIndex >= uids.length)
            curIndex = 2;

        if (uids[curIndex] == pl.info.uid)
        {
            if (off == 0)
            {
                AddNewCard(node, "stand", "mjhand", msg, off);
            }
            else if (pl.mjhand)
            {
                AddNewCard(node, "up", "mjhand", msg, off);
            }
            RestoreCardLayout(node, off);
        }
    }

    function HandleWaitPut(node, msg, off)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
        var pl = getUIPlayer(off);

        if(pl == null)
            return;

        if (tData.curPlayer == selfIndex && !pl.mjhand)
        {
            AddNewCard(node, "stand", "standPri");
            RestoreCardLayout(node, off);
        }
        else
        {
            RestoreCardLayout(node, off);
        }
    }

    function HandleMJChi(node, msg, off)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var pl = getUIPlayer(off);
        if(pl == null)
            return;

        var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
        if (tData.curPlayer == selfIndex)
        {
            var fromOff = [];
            var fromBind = GetUIBind(msg.from, fromOff);
            var fnode = fromBind._node;
            RemoveNewOutCard(fnode);

            var cds = msg.mjchi;
            for (var i = 0; i < cds.length; i++)
            {
                AddNewCard(node, "up", "chi", cds[i], off);
                if (pl.mjhand && cds[i] != tData.lastPut)
                    RemoveBackNode(node, "mjhand", 1, cds[i]);
            }
            //删掉俩张stand&&
            if (off == 3 && !pl.mjhand)
                RemoveBackNode(node, "standPri", 2);
            else if (off != 0 && !pl.mjhand)
                RemoveFrontNode(node, "standPri", 2);

            RestoreCardLayout(node, off);
            RestoreCardLayout(fnode, fromOff[0]);
        }
    }

    function HandleMJPeng(node, msg, off)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var pl = getUIPlayer(off);

        if (pl == null)
            return;

        // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
        if (IsCurPlayerTurn(off))
        {
            var fromOff = [];
            var fromBind = GetUIBind(msg.from, fromOff);
            var fnode = fromBind._node;
            ShowEatActionAnim(node, ActionType.PENG, off);
            RemoveNewOutCard(fnode);
            for (var i = 0; i < 3; i++)
            {
                AddNewCard(node, "up", "peng", tData.lastPut, off);
            }
            //删掉俩张stand
            if (pl.mjhand)
                RemoveBackNode(node, "mjhand", 2, tData.lastPut);
            else if (off == 3)
                RemoveBackNode(node, "standPri", 2);
            else
                RemoveFrontNode(node, "standPri", 2);

            RestoreCardLayout(node, off);
            // RestoreCardLayout(fnode, fromOff[0]);

        }
    }

    // function RemoveFrontNode(node, name, num, tag) {
    //     var children = node.children;
    //
    //     for (var i = 0; i < children.length && num > 0; i++) {
    //         var ci = children[i];
    //
    //         if (ci.name == name && (!(tag > 0) || ci.tag == tag)) {
    //             ci.removeFromParent(true);
    //             num--;
    //         }
    //     }
    //
    //     if (num != 0) mylog(node.name + " RemoveFrontNode fail " + name + " " + tag);
    // }
    
    // function RemoveNewOutCard(node) {
    //     var children = node.children;
    //     for (var i = 0; i < children.length; i++) {
    //         var ci = children[i];
    //         if (ci.name == "newout") {
    //             ci.removeFromParent(true);
    //         }
    //     }
    // }

    // function RemoveBackNode(node, name, num, tag) {
    //
    //     var children = node.children;
    //     for (var i = children.length - 1; i >= 0 && num > 0; i--) {
    //         var ci = children[i];
    //         if (ci.name == name && (!(tag > 0) || ci.tag == tag)) {
    //             ci.removeFromParent(true);
    //             num--;
    //         }
    //     }
    //     if (num != 0) mylog(node.name + " RemoveBackNode fail " + name + " " + tag);
    // }

    // function AddNewCard(node, copy, name, tag, off, specialTAG) {
    //     var cpnode = node.getChildByName(copy);
    //     var cp = cpnode.clone();
    //     cp.visible = true;
    //     cp.name = name;
    //     if (specialTAG == "isgang4") {
    //
    //         cp.isgang4 = true;
    //     }
    //     /*else if(specialTAG == "newCard")
    //      {
    //      cp.isnewCard = true;
    //      }*/
    //     node.addChild(cp);
    //     if (tag > 0) {
    //         var count;
    //         if (name == "mjhand" && off == 0) {
    //             count = 4;
    //         } else {
    //             count = off;
    //         }
    //         setCardPic(cp, tag, count);
    //         if (name == "mjhand") {
    //             SetCardTouchHandler(cpnode, cp);
    //         }
    //     }
    //     return cp;
    // }

    function GetUIBind(uidPos, offStore) {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var selfIndex = uids.indexOf(SelfUid());
        // var uiOff = (uidPos + 4 - selfIndex) % 4;
        var uiOff = (uidPos + tData.maxPlayer - selfIndex) % tData.maxPlayer;

        //三人麻将需要修正
        if(IsThreeTable() && uiOff==2){
            uiOff = 3;
        }

        if (offStore)
            offStore.push(uiOff);

        var jsBind = jsclient.replayui.jsBind;
        var ui = [jsBind.down, jsBind.right, jsBind.top, jsBind.left];
        return ui[uiOff];
    }

    function HandleMJGang(node, msg, off)
    {

        // var sData = jsclient.data.sData;
        // var tData = sData.tData;
        // var uids = tData.uids;
        // if(!tData.maxPlayer)
        //     tData.maxPlayer = 4;
        // var tag = off;
        // if (IsThreeTable())
        // {
        //     if(off == 3)
        //         tag = 2;
        // }
        // var selfIndex=(uids.indexOf(SelfUid())+tag)%tData.maxPlayer;
        //
        // if (uids[selfIndex] != msg.uid) return;

        if(getUIPlayerUid(off) != msg.uid)
            return;

        var pl = getUIPlayer(off);
        if(pl == null)
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
            if (off == 0) RemoveBackNode(node, "mjhand", 4, msg.card);
        }

        if (off != 0)
        {
            if (off == 3)
            {
                if (msg.gang == 1)
                {
                    var fromOff = [];
                    var fromBind = GetUIBind(msg.from, fromOff);
                    var fnode = fromBind._node;
                    RemoveNewOutCard(fnode);
                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 3, msg.card);
                    } else {
                        RemoveBackNode(node, "standPri", 3);
                    }


                } else if (msg.gang == 2) {
                    RemoveBackNode(node, "peng", 3, msg.card);

                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 1, msg.card);
                    } else {
                        RemoveBackNode(node, "standPri", 1);
                    }
                } else if (msg.gang == 3) {

                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 4, msg.card);
                    } else {
                        RemoveBackNode(node, "standPri", 4);
                    }
                }

            } else {

                if (msg.gang == 1) {
                    var fromOff = [];
                    var fromBind = GetUIBind(msg.from, fromOff);
                    var fnode = fromBind._node;
                    RemoveNewOutCard(fnode);
                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 3, msg.card);
                    } else {
                        RemoveFrontNode(node, "standPri", 3);
                    }

                } else if (msg.gang == 2) {
                    RemoveFrontNode(node, "peng", 3, msg.card);
                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 1, msg.card);
                    } else {
                        RemoveFrontNode(node, "standPri", 1);
                    }

                } else if (msg.gang == 3) {
                    if (pl.mjhand) {
                        RemoveBackNode(node, "mjhand", 4, msg.card);
                    } else {
                        RemoveFrontNode(node, "standPri", 4);
                    }

                }

            }
        }
        for (var i = 0; i < 4; i++)
        {
            if (msg.gang == 3) {
                if (i == 3) {
                    AddNewCard(node, "down", "gang1", 0, off, "isgang4").tag = msg.card;
                } else {
                    AddNewCard(node, "up", "gang1", msg.card, off);
                }

            } else {
                if (i == 3) {
                    AddNewCard(node, "up", "gang0", msg.card, off, "isgang4").tag = msg.card;
                } else {
                    AddNewCard(node, "up", "gang0", msg.card, off);
                }

            }

        }


        RestoreCardLayout(node, off);
    }

    // function TagOrder(na, nb)
    // {
    //     return na.tag - nb.tag
    // }

    // function RestoreCardLayout(node, off, endonepl)
    // {
    //     var newC = null;
    //     var newVal = 0;
    //     var pl;
    //
    //     if (endonepl)
    //     {
    //         pl = endonepl;
    //     }
    //     else
    //     {
    //         pl = getUIPlayer(off);
    //     }
    //     var mjhandNum = 0;
    //     var children = node.children;
    //     for (var i = 0; i < children.length; i++)
    //     {
    //         var ci = children[i];
    //         if (ci.name == "mjhand")
    //         {
    //             mjhandNum++;
    //         }
    //     }
    //
    //     if (pl.mjhand && pl.mjhand.length > 0)
    //     {
    //         var count = jsclient.majiang.CardCount(pl);
    //
    //         if (count == 14 && mjhandNum == pl.mjhand.length)
    //         {
    //             if (pl.isNew || endonepl)
    //                 newVal = pl.mjhand[pl.mjhand.length - 1];
    //             else
    //             {
    //                 var tempHand = [];
    //                 for (var i = 0; i < pl.mjhand.length; i++)
    //                 {
    //                     tempHand.push(pl.mjhand[i]);
    //                 }
    //
    //
    //                 tempHand.sort(function(a,b){
    //
    //                     return a - b;
    //                 });
    //
    //                 tempHand.sort(function(a,b){
    //                     if(jsclient.data.sData.tData.withZhong)
    //                     {
    //                         return b == 71;
    //                     }
    //                     if(jsclient.data.sData.tData.fanGui)
    //                     {
    //                         return b == jsclient.data.sData.tData.gui;
    //                     }
    //                 });
    //
    //                 newVal = tempHand[tempHand.length - 1];
    //                 // newVal = Math.max.apply(null, pl.mjhand);
    //             }
    //         }
    //     }
    //
    //     var up = node.getChildByName("up");
    //     var stand = node.getChildByName("stand");
    //     var start, offui;
    //     switch (off) {
    //         case 0:
    //             start = up;
    //             offui = stand;
    //             break;
    //         case 1:
    //             start = stand;
    //             offui = up;
    //             break;
    //         case 2:
    //             start = stand;
    //             offui = up;
    //             break;
    //         case 3:
    //             start = up;
    //             offui = up;
    //             break;
    //     }
    //     var upSize = offui.getSize();
    //     var upS = offui.scale;
    //     //mjhand standPri out chi peng gang0 gang1
    //     var uipeng = [];
    //     var uigang0 = [];
    //     var uigang1 = [];
    //     var uichi = [];
    //     var uistand = [];
    //
    //     for (var i = 0; i < children.length; i++)
    //     {
    //         var ci = children[i];
    //         if (ci.name == "mjhand")
    //         {
    //             if (newC == null && newVal == ci.tag)
    //             {
    //                 newC = ci;
    //             }
    //             else
    //                 uistand.push(ci);
    //         }
    //         else if (ci.name == "standPri")
    //         {
    //             uistand.push(ci);
    //         }
    //         else if (ci.name == "gang0")
    //         {
    //             uigang0.push(ci);
    //         }
    //         else if (ci.name == "gang1")
    //         {
    //             uigang1.push(ci);
    //         }
    //         else if (ci.name == "chi")
    //         {
    //             uichi.push(ci);
    //         }
    //         else if (ci.name == "peng")
    //         {
    //             uipeng.push(ci);
    //         }
    //         /*
    //          **去掉旧牌的特殊标签
    //          */
    //     }
    //     uipeng.sort(TagOrder);
    //     uigang0.sort(TagOrder);
    //     uigang1.sort(TagOrder);
    //     uichi.sort(TagOrder);
    //     uistand.sort(TagOrder);
    //
    //     var guiTag = 0;
    //     if(jsclient.data.sData.tData.withZhong)
    //         guiTag = 71;
    //
    //     if(jsclient.data.sData.tData.fanGui)
    //         guiTag = jsclient.data.sData.tData.gui;
    //
    //     jsclient.majiang.toFontGuiPai(uistand, jsclient.data.sData.tData.withZhong, jsclient.data.sData.tData.fanGui, guiTag);
    //
    //     if (newC)
    //     {
    //         uistand.push(newC);
    //     }
    //
    //     //给鬼牌加特效
    //     if(jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui)
    //     {
    //         for(var z = 0; z< uistand.length; z++)
    //         {
    //             var guiCard = uistand[z];
    //
    //             if(guiCard.tag == guiTag)
    //             {
    //                 if(off == 0)
    //                     playAnimationByCard(guiCard);
    //             }
    //         }
    //     }
    //
    //     var uiOrder = [uigang1, uigang0, uipeng, uichi, uistand];
    //     if (off == 1 || off == 2)
    //         uiOrder.reverse();
    //
    //     var orders = [];
    //     for (var j = 0; j < uiOrder.length; j++)
    //     {
    //         var uis = uiOrder[j];
    //         for (var i = 0; i < uis.length; i++)
    //             orders.push(uis[i]);
    //     }
    //     var slotwith = upSize.width * upS * 0.3;
    //     var slotheigt = upSize.height * upS * 0.3;
    //
    //     for (var i = 0; i < orders.length; i++) {
    //         var ci = orders[i];
    //
    //         if (off % 2 == 0)
    //         {
    //             if (i != 0) {
    //                 if (ci.name == orders[i - 1].name)
    //                 {
    //
    //                     if (ci.isgang4)
    //                     {
    //                         ci.x = orders[i - 2].x;
    //                         ci.y = orders[i - 2].y + upSize.height * upS * 0.2;
    //
    //                     } else if (orders[i - 1].isgang4)
    //                     {
    //                         ci.x = orders[i - 1].x + upSize.width * upS * 2;
    //
    //                     } else
    //                     {
    //                         ci.x = orders[i - 1].x + upSize.width * upS;
    //
    //                     }
    //                 }
    //                 else if (orders[i - 1].name == "gang0")
    //                 {
    //                     ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
    //
    //                 }
    //                 else if (orders[i - 1].name == "gang1")
    //                 {
    //                     ci.x = orders[i - 2].x + upSize.width * upS + slotwith;
    //                 }
    //                 else
    //                 {
    //                     ci.x = orders[i - 1].x + upSize.width * upS + slotwith;
    //                 }
    //                 /*
    //                  判断是不是新抓的牌
    //                  */
    //                 if (off == 0)
    //                 {
    //
    //                     if (i == orders.length - 1)
    //                     {
    //                         if (newC && endonepl)
    //                         {
    //                             ci.x = ci.x + slotwith;
    //                         }
    //                         else if (newC)
    //                         {
    //                             ci.x = ci.x + slotwith;
    //                             ci.y += 20;
    //                         }
    //                     }
    //                 }
    //             }
    //             else
    //             {
    //                 ci.x = start.x + upSize.width * upS;
    //             }
    //         }
    //         else
    //         {
    //             if (i != 0)
    //             {
    //                 if (ci.name == orders[i - 1].name)
    //                 {
    //                     if (ci.isgang4)
    //                     {
    //                         ci.y = orders[i - 2].y + slotheigt;
    //                     }
    //                     else if (orders[i - 1].isgang4)
    //                     {
    //                         ci.y = orders[i - 2].y - upSize.height * upS * 0.7;
    //                     }
    //                     else
    //                     {
    //                         ci.y = orders[i - 1].y - upSize.height * upS * 0.7;
    //                     }
    //
    //                 }
    //                 else if (orders[i - 1].name == "standPri")
    //                 {
    //                     ci.y = orders[i - 1].y - upSize.height * upS * 1.5;
    //                 }
    //                 else if (orders[i - 1].name == "gang0")
    //                 {
    //                     ci.y = orders[i - 2].y - upSize.height * upS * 0.7 - slotheigt;
    //                 }
    //                 else if (orders[i - 1].name == "gang1")
    //                 {
    //                     ci.y = orders[i - 2].y - upSize.height * upS * 0.7 - slotheigt;
    //                 }
    //                 else
    //                 {
    //                     ci.y = orders[i - 1].y - upSize.height * upS * 0.7 - slotheigt;
    //                 }
    //
    //             }
    //             else
    //             {
    //                 ci.y = start.y - upSize.height * upS * 0.7;
    //
    //                 if(off == 1)
    //                     ci.y = ci.y + 40;
    //             }
    //
    //             if (off == 3)
    //             {
    //                 if (!ci.isgang4)
    //                 {
    //                     ci.zIndex = i;
    //                 }
    //                 else
    //                 {
    //                     ci.zIndex = 200;
    //                 }
    //
    //                 ci.x = start.x - 10;
    //             }
    //
    //             if (off == 1)
    //             {
    //                 if (!ci.isgang4)
    //                 {
    //                     ci.zIndex = i;
    //                 }
    //                 else
    //                 {
    //                     ci.zIndex = 200;
    //                 }
    //
    //                 ci.x = start.x + 20;
    //             }
    //         }
    //
    //     }
    // }

    function HandleMJPut(node, msg, off, outNum)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        // var uids = tData.uids;
        // var selfIndex = (uids.indexOf(SelfUid()) + off) % 4;
        // if (uids[selfIndex] == msg.uid)

        if(getUIPlayerUid(off) == msg.uid)
        {
            var pl = sData.players[msg.uid];
            var putnum = outNum >= 0 ? outNum : (pl.mjput.length - (off == 0 ? 1 : 1));
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

            var player = getUIPlayer(off);
            if(!player)
                return;

            var mjhand = player.mjhand;
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
                {
                    if (mjhand)
                    {
                        RemoveBackNode(node, "mjhand", 1, msg.card);
                    }
                    else
                    {
                        RemoveFrontNode(node, "standPri", 1);
                    }
                }

                endPoint.y = out.y + oSize.height * oSc * putnum * 0.7;
                endPoint.x = out.x;
                Midpoint.x = ws.width / 4 * 3;
                Midpoint.y = ws.height / 2;
                out.zIndex = 100 - putnum;
            }
            else if (off == 2)
            {
                if (!(outNum >= 0))
                {
                    if (mjhand)
                    {
                        RemoveBackNode(node, "mjhand", 1, msg.card);
                    }
                    else
                    {
                        RemoveFrontNode(node, "standPri", 1);
                    }
                }
                endPoint.x = out.x - oSize.width * oSc * putnum;
                endPoint.y = out.y;
                Midpoint.x = ws.width / 2;
                Midpoint.y = ws.height / 4 * 3;
            }
            else if (off == 3)
            {
                if (!(outNum >= 0))
                {
                    if (mjhand)
                    {
                        RemoveBackNode(node, "mjhand", 1, msg.card);
                    }
                    else
                    {
                        RemoveFrontNode(node, "standPri", 1);
                    }
                }
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

            outAction.zIndex = 200;
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

            var callbackFUNC = function ()
            {
                out.zIndex = zoder;

            };
            var callbackFUNCROTATION = function ()
            {
                out.visible = true;
                out.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2, endPoint), cc.scaleTo(0.2, oSc)), cc.callFunc(callbackFUNC)));

            };
            outAction.runAction(cc.sequence(cc.spawn(cc.moveTo(0.2, Midpoint), cc.scaleTo(0.2, 2 * oSc))
                //cc.DelayTime(0.4),cc.callFunc(callbackFUNCROTATION),cc.removeSelf()
                )
            );

            function RemovePutCard(onlySelf)
            {
                var delayNum = 0.4 - (Date.now() - putTime) / 1000;
                if (delayNum < 0)
                    delayNum = 0;

                if (!onlySelf)
                    outAction.runAction(cc.sequence(cc.DelayTime(delayNum), cc.callFunc(callbackFUNCROTATION), cc.removeSelf()));
                else
                    outAction.runAction(cc.sequence(cc.DelayTime(delayNum), cc.removeSelf()));
            }

            var putTime = Date.now();
            var outActionBind =
            {
                _event:
                {
                    waitPut: function ()
                    {
                        RemovePutCard(false)
                    },
                    MJChi: function ()
                    {
                        RemovePutCard(true)
                    },
                    MJPeng: function ()
                    {
                        RemovePutCard(true)
                    },
                    MJGang: function ()
                    {
                        RemovePutCard(true)
                    },
                    roundEnd: function ()
                    {
                        RemovePutCard(true)
                    }
                }
            };

            if (jsclient.majiang.isFlower8(msg.card))
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

    // var imgNames = ["_bamboo_", "_character_", "_dot_", "_wind_east", "_wind_west", "_wind_south", "_wind_north", "_red", "_green", "_white"];
    // var imgOff = ["B", "R", "B", "L", "M"];

    // function setCardPic(node, cd, off)
    // {
    //     // var imgName = "";
    //     // if(cd<30)
    //     // {
    //     // 	imgName=imgOff[off] + imgNames[Math.floor(cd/10)]+cd%10;
    //     // }
    //     // else
    //     // {
    //     //     imgName=imgOff[off] + imgNames[Math.floor(cd/10)];
    //     // }
    //     var imgName = "mj_" + cd + ".png";
    //     node.tag = cd;
    //     // var callback = function () {
    //     // node.loadTexture(imgName+".png",ccui.Widget.PLIST_TEXTURE  );
    //     var num = node.getChildByName("num");
    //     if (num != null)
    //         num.loadTexture(imgName, ccui.Widget.PLIST_TEXTURE);
    //     // };
    //     // node.stopAllActions();
    //     // node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(1))));
    // }

    // function SetArrowRotation(abk)
    // {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     var uids = tData.uids;
    //     var selfIndex = uids.indexOf(SelfUid());
    //     selfIndex = (tData.curPlayer + 4 - selfIndex) % 4;
    //     abk.getChildByName("arrow").rotation = 270 - 90 * selfIndex;
    // }

    // function SetCardTouchHandler(standUI, cardui)
    // {
    //     cardui.addTouchEventListener(function (btn, tp)
    //     {
    //         if (tp != 2)
    //             return;
    //
    //         var sData = jsclient.data.sData;
    //         var tData = sData.tData;
    //         if (!IsMyTurn() || tData.tState != TableState.waitPut)
    //         {
    //             mylog("not my turn");
    //             return;
    //         }
    //
    //         if (btn.y >= standUI.y + 10)
    //         {
    //             PutAwayCard(cardui, cardui.tag);
    //         }
    //         else
    //         {
    //             var mjhandNum = 0;
    //             var children = btn.getParent().children;
    //             for (var i = 0; i < children.length; i++)
    //             {
    //                 if (children[i].name == "mjhand")
    //                 {
    //                     mjhandNum++;
    //                     if (children[i].y > standUI.y + 10)
    //                         children[i].y = standUI.y;
    //                 }
    //             }
    //             if (mjhandNum == getUIPlayer(0).mjhand.length)
    //             {
    //                 btn.y = standUI.y + 20;
    //             }
    //         }
    //
    //     }, cardui);
    // }

    // function reConectHeadLayout(node)
    // {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     var down = node.getChildByName("down").getChildByName("head");
    //     var top = node.getChildByName("top").getChildByName("head");
    //     var left = node.getChildByName("left").getChildByName("head");
    //     var right = node.getChildByName("right").getChildByName("head");
    //     cc.log("reConectHeadLayout");
    //     var pl = getUIPlayer(0);
    //
    //     if (tData.tState == TableState.waitJoin || tData.tState == TableState.roundFinish)
    //     {
    //         doLayout(down, [0.13, 0.13], [0.5, 0.2], [0, 0], false, false);
    //         doLayout(top, [0.13, 0.13], [0.5, 0.8], [0, 0], false, false);
    //         doLayout(left, [0.13, 0.13], [0.25, 0.5], [0, 0], false, false);
    //         doLayout(right, [0.13, 0.13], [0.75, 0.5], [0, 0], false, false);
    //     }
    //     else
    //     {
    //         doLayout(top, [0.125, 0.125], [0.93, 0.9], [0, 0], false, false);
    //         doLayout(right, [0.125, 0.125], [0.93, 0.65], [0, 0], false, false);
    //         doLayout(left, [0.125, 0.125], [0.07, 0.6], [0, 0], false, false);
    //         doLayout(down, [0.125, 0.125], [0.07, 0.35], [0, 0], false, false);
    //     }
    // }

    // function tableStartHeadPlayAction(node)
    // {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     cc.log("tableStartHeadPlayAction");
    //     var pl = getUIPlayer(0);
    //     //if (CheckArrowVisible())
    //     {
    //         var down = node.getChildByName("down").getChildByName("head");
    //         var top = node.getChildByName("top").getChildByName("head");
    //         var left = node.getChildByName("left").getChildByName("head");
    //         var right = node.getChildByName("right").getChildByName("head");
    //         doLayout(down, [0.13, 0.13], [0.5, 0.2], [0, 0], false, false);
    //         doLayout(top, [0.13, 0.13], [0.5, 0.8], [0, 0], false, false);
    //         doLayout(left, [0.13, 0.13], [0.25, 0.5], [0, 0], false, false);
    //         doLayout(right, [0.13, 0.13], [0.75, 0.5], [0, 0], false, false);
    //
    //         doLayout(top, [0.125, 0.125], [0.93, 0.9], [0, 0], false, false);
    //
    //         doLayout(right, [0.125, 0.125], [0.93, 0.65], [0, 0], false, false);
    //         doLayout(left, [0.125, 0.125], [0.07, 0.6], [0, 0], false, false);
    //         doLayout(down, [0.125, 0.125], [0.07, 0.35], [0, 0], false, false);
    //         var downPoint = cc.p(down.x, down.y);
    //         var topPoint = cc.p(top.x, top.y);
    //         var rightPoint = cc.p(right.x, right.y);
    //         var leftPoint = cc.p(left.x, left.y);
    //         down.runAction(cc.moveTo(0.5, downPoint));
    //         top.runAction(cc.moveTo(0.5, topPoint));
    //         left.runAction(cc.moveTo(0.5, leftPoint));
    //         right.runAction(cc.moveTo(0.5, rightPoint));
    //     }
    // }
    
    // function InitPlayerNameAndCoin(node, off)
    // {
    //     var pl = getUIPlayer(off);
    //     if (!pl)
    //         return;
    //
    //     var tData = jsclient.data.sData.tData;
    //     var bind =
    //     {
    //         head:
    //         {
    //             name:
    //             {
    //                 _text: function ()
    //                 {
    //                     return unescape(pl.info.nickname || pl.info.name || "玩家");
    //                 }
    //             }
    //         },
    //         coin:
    //         {
    //             _visible: true
    //         }
    //
    //     };
    //     ConnectUI2Logic(node, bind);
    // }

    function InitPlayerHandUI(node, off)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var pl = getUIPlayer(off);

        if(pl == null)
            return;

        InitPlayerNameAndCoin(node, off);

        if (tData.tState != TableState.waitPut
            && tData.tState != TableState.waitEat
            && tData.tState != TableState.waitCard)return;

        //添加碰
        for (var i = 0; i < pl.mjpeng.length; i++)
        {
            for (var j = 0; j < 3; j++)
            {
                AddNewCard(node, "up", "peng", pl.mjpeng[i], off);
            }
        }
        //添加明杠
        for (var i = 0; i < pl.mjgang0.length; i++)
        {
            for (var j = 0; j < 4; j++)
            {
                if (j == 3)
                {
                    AddNewCard(node, "up", "gang0", pl.mjgang0[i], off, "isgang4").tag = pl.mjgang0[i];
                }
                else
                {
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

        if (off == 0)
        {
            for (var i = 0; i < pl.mjhand.length; i++)
            {
                if (off == 0)
                {
                    AddNewCard(node, "stand", "mjhand", pl.mjhand[i], off);
                }
                else
                {

                }
            }
        }
        else if (plmjhand1 || plmjhand2 || plmjhand3)
        {

            if (off == 1)
            {
                pl.mjhand = plmjhand1;

            }
            else if (off == 2)
            {
                pl.mjhand = plmjhand2;
            }
            else if (off == 3)
            {
                pl.mjhand = plmjhand3;
                if(IsThreeTable())
                {
                    pl.mjhand = plmjhand2;
                }
            }
            for (var i = 0; i < pl.mjhand.length; i++)
            {
                AddNewCard(node, "up", "mjhand", pl.mjhand[i], off);
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
                AddNewCard(node, "stand", "standPri");
            }
        }
        RestoreCardLayout(node, off);
    }

    // var playAramTimeID = null;
    // function updateArrowbkNumber(node)
    // {
    //     node.setString("10");
    //     var number = function ()
    //     {
    //         if (node.getString() == 0)
    //         {
    //             node.cleanup();
    //         }
    //         else
    //         {
    //             var number = node.getString() - 1;
    //             if (number > 9)
    //             {
    //                 node.setString(number);
    //             }
    //             else
    //             {
    //                 node.setString("0" + number);
    //                 var sData = jsclient.data.sData;
    //                 var tData = sData.tData;
    //                 var uids = tData.uids;
    //                 if (uids[tData.curPlayer] == SelfUid())
    //                 {
    //                     if (number == 3)
    //                     {
    //                         playAramTimeID = playEffect("timeup_alarm");
    //                     }
    //                     else if (number == 0)
    //                     {
    //                         jsclient.native.NativeVibrato();
    //                     }
    //                 }
    //             }
    //         }
    //     };
    //
    //     node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1.0), cc.callFunc(number, node))));
    // }

    // function getUIPlayer(off)
    // {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     var uids = tData.uids;
    //     var selfIndex = uids.indexOf(SelfUid());
    //     if(IsThreeTable()){
    //         if(off==3){
    //             off = 2;
    //         }else if(off==2){
    //             return null;
    //         }
    //     }
    //
    //     if (!tData.maxPlayer)
    //         tData.maxPlayer = 4;
    //
    //     selfIndex = (selfIndex + off) % tData.maxPlayer;
    //
    //     if (selfIndex < uids.length)
    //         return sData.players[uids[selfIndex]];
    //
    //     return null;
    // }

    // function setOffline(node, off)
    // {
    //
    // }

    // function showPlayerInfo(off, node)
    // {
    //     var tData = jsclient.data.sData.tData;
    //     var pl = getUIPlayer(off);
    //     if (pl)
    //     {
    //         jsclient.showPlayerInfo(pl.info);
    //     }
    //     return;
    //
    //     var names = [];
    //     for (var i = 0; i < node.children.length; i++)
    //     {
    //         names.push(node.children[i].name + "|" + node.children[i].tag);
    //     }
    //     cc.log(names);
    //
    // }

    // function checkBaoJiuZhuangLogo(node, off) {
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     var pl = getUIPlayer(off);
    //     if (pl.baojiu) {
    //         cc.log("测试 报九张数据=============================" + pl.baojiu.num);
    //         if (pl.baojiu.num == 4) cc.log("使此人报九的人是=============================" + pl.baojiu.putCardPlayer[0]);
    //     }
    //
    //     if (pl && pl.baojiu.num >= 3 && tData.gameType == 2) {
    //         node.visible = true;
    //         node.zIndex = 80;
    //     } else node.visible = false;
    //
    // }

    // function showPlayerLinkZhuangLogo(node, off) {
    //
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //     var pl = getUIPlayer(off);
    //     node.zIndex = 100;
    //     if (tData) {
    //         if (tData.gameType == 3 && tData.jiejieGao && tData.uids[tData.zhuang] == pl.info.uid) {
    //             node.visible = true;
    //             //var linkZhuang = node.getChildByName("linkZhuang");
    //             var path = "res/play-yli/zhuang_" + pl.linkZhuang + ".png";
    //             cc.log("path = " + path);
    //             node.loadTexture(path);
    //             node.setVisible(true);
    //         } else {
    //             node.visible = false;
    //         }
    //
    //     }
    // }

    // function showPlayerZhuangLogo(node, off)
    // {
    //
        // var sData = jsclient.data.sData;
        // var tData = sData.tData;
        // var pl = getUIPlayer(off);
        //
        // if(pl == null)
        //     return;
        //
        // node.zIndex = 100;
        // if (tData)
        // {
        //     if (tData.uids[tData.zhuang] == pl.info.uid)
        //     {
        //         if (node.getName() == "zhuang")
        //             node.visible = true;
        //     }
        //     else
        //     {
        //         if (node.getName() == "zhuang")
        //             node.visible = false;
        //     }
        //
        // }
        // if (tData.gameType == 2 && node.getName() == "hua")
        // {
        //     node.setVisible(true);
        //     node.getChildByName("hua_num").setString("" + pl.mjflower.length);
        // }
        // if (tData.gameType == 2 && node.getName() == "baojiuzhang") {
        //     if (tData) {
        //         if (pl.baojiu) cc.log("initSceneData ===== pl.baojiu===" + pl.baojiu.num);
        //         else cc.log("没有报九！！！")
        //         if (pl.baojiu && pl.baojiu.num >= 3) {
        //             node.visible = true;
        //             node.zIndex = 80;
        //         } else node.visible = false;
        //     }
        // }
        //
        // if (tData.gameType == 3 && tData.jiejieGao)
        // {
        //     if (tData)
        //     {
        //         if (node.getName() == "zhuang")
        //             node.visible = false;
        //     }
        // }
    // }
    //
    // function CheckDelRoomUI()
    // {
    //     var sData = jsclient.data.sData;
    //     if (sData.tData.delEnd != 0 && !jsclient.delroomui)
    //     {
    //         jsclient.Scene.addChild(new DelRoomLayer());
    //     }
    //     else if (sData.tData.delEnd == 0 && jsclient.delroomui)
    //     {
    //         jsclient.delroomui.removeFromParent(true);
    //         delete jsclient.delroomui;
    //     }
    // }
    //
    // function CheckReadyVisible(node, off)
    // {
    //     if (off < 0)
    //     {
    //         node.visible = false;
    //         return false;
    //     }
    //     var p0 = getUIPlayer(off);
    //     var sData = jsclient.data.sData;
    //     var tData = sData.tData;
    //
    //     if (p0 && p0.mjState == TableState.isReady && tData.tState != TableState.waitJoin)
    //     {
    //         node.visible = true;
    //     } else {
    //         node.visible = false;
    //     }
    //     return node.visible;
    // }

    // function MJChichange(tag)
    // {
    //
    // }

    // function MJGangchange(tag)
    // {
    //
    // }

    // function emojiPlayAction(node, num)
    // {
    //
    //     var framename;
    //     var number = 0;
    //     var arry = [];
    //     var delaytime = 0;
    //     var sumtime = 0;
    //     var playtime = 3;
    //     var imgSize;
    //     switch (num) {
    //         case 0:
    //             framename = "happy";
    //             delaytime = 0.1;
    //             break;
    //         case 1:
    //             framename = "angry";
    //             delaytime = 0.15;
    //             break;
    //         case 2:
    //             framename = "smaile";
    //             delaytime = 0.2;
    //             break;
    //         case 3:
    //             framename = "han";
    //             delaytime = 0.2;
    //             break;
    //         case 4:
    //             framename = "zhiya";
    //             delaytime = 0.2;
    //             break;
    //         case 5:
    //             framename = "shihua";
    //             delaytime = 0.2;
    //             break;
    //         case 6:
    //             framename = "jiong";
    //             delaytime = 0.23;
    //             break;
    //         case 7:
    //             framename = "sleep";
    //             delaytime = 0.2;
    //             break;
    //         case 8:
    //             framename = "fennu";
    //             delaytime = 0.2;
    //             break;
    //         case 9:
    //             framename = "yun";
    //             delaytime = 0.2;
    //             break;
    //         case 10:
    //             framename = "lihai";
    //             delaytime = 0.2;
    //             break;
    //         case 11:
    //             framename = "touxiang";
    //             delaytime = 0.2;
    //             break;
    //         case 12:
    //             framename = "se";
    //             delaytime = 0.2;
    //             break;
    //         case 13:
    //             framename = "huaixiao";
    //             delaytime = 0.2;
    //             break;
    //         case 14:
    //             framename = "shaoxiang";
    //             delaytime = 0.2;
    //             break;
    //         default:
    //             break;
    //
    //     }
    //     for (var i = 0; i < 15; i++) {
    //         var frame = cc.spriteFrameCache.getSpriteFrame(framename + i + ".png");
    //
    //         if (frame) {
    //             imgSize = frame.getOriginalSize();
    //             arry.push(framename + i);
    //         }
    //     }
    //     //var animation = new cc.Animation(arry,0.3);
    //     //var animate = cc.animate(animation);
    //     var callback = function () {
    //
    //         if (arry.length == number) {
    //             number = 0;
    //
    //         }
    //         cc.log("||" + arry[number] + ".png");
    //         node.loadTexture(arry[number] + ".png", ccui.Widget.PLIST_TEXTURE);
    //         number++;
    //         sumtime = sumtime + delaytime;
    //         if (sumtime > playtime) {
    //             node.cleanup();
    //             node.visible = false;
    //         }
    //
    //     };
    //     node.cleanup();
    //     node.visible = true;
    //     node.setSize(imgSize);
    //     node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.delayTime(delaytime))));
    //
    // }

    function showReplaycaneat(ed)
    {
        var eatlogo = jsclient.replayui.jsBind.eat[ed.eatWhat]._node;

        var off = ed.off;
        if (off == 0)
        {
            doLayout(eatlogo, [0.1, 0.1], [0.5, 0.2], [0, 0], false, false);

        }
        else if (off == 2)
        {
            doLayout(eatlogo, [0.1, 0.1], [0.5, 0.8], [0, 0], false, false);

        }
        else if (off == 1)
        {
            doLayout(eatlogo, [0.1, 0.1], [0.8, 0.5], [0, 0], false, false);
        }
        else if (off == 3)
        {
            doLayout(eatlogo, [0.1, 0.1], [0.2, 0.5], [0, 0], false, false);
        }
        eatlogo.visible = true;
        var osc = eatlogo.scale;
        eatlogo.scale = 0.01;

        var imgName = "mj_" + ed.lastput + ".png";
        var num = eatlogo.getChildByName("card1").getChildByName("num");
        if (num != null) {
            num.loadTexture(imgName, ccui.Widget.PLIST_TEXTURE);
        }
        var callback = function ()
        {
            if (ed.eatWhat != "hu")
            {
                eatlogo.visible = false;
            }
        };
        eatlogo.runAction(cc.sequence(cc.scaleTo(0.3, osc), cc.delayTime(0.3), cc.callFunc(callback)));
    }

    // function showchat(node, off, msg)
    // {
    //     var pl = getUIPlayer(off);
    //     var uid = msg.uid;
    //     var type = msg.type;
    //     var message = msg.msg;
    //
    //     if (pl && msg.uid == pl.info.uid) {
    //         if (type == 0) {
    //             node.getParent().visible = true;
    //             node.setString(message);
    //             var callback = function () {
    //                 node.getParent().visible = false;
    //             };
    //
    //             node.getParent().width = node.stringLength * node.fontSize + 72;
    //             node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
    //         } else if (type == 1) {
    //             node.getParent().visible = true;
    //             node.setString(message);
    //             var callback = function () {
    //                 node.getParent().visible = false;
    //             };
    //             var musicnum = msg.num + 1;
    //
    //             var one = node.getCustomSize().width / 20.0;
    //             node.getParent().width = node.stringLength * node.fontSize + 72;
    //             playEffect("fix_msg_" + musicnum);
    //             node.runAction(cc.sequence(cc.delayTime(2.5), cc.callFunc(callback)));
    //         } else if (type == 2) {
    //             var em_node = node.getParent().getParent().getChildByName("emoji");
    //             emojiPlayAction(em_node, msg.num);
    //         }
    //     }
    // }
    
    function rePlayCardNext(node)
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;

        if (tData)
        {
            var leftCard = 0;
            if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
            //if(tData.withWind && !tData.withZhong) leftCard = 136 - 4 - tData.cardNext;
            if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
            if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
            if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
            switch (jsclient.data.sData.tData.gameType) {
                case 1:
                    leftCard = leftCard;
                    break;
                case 2:
                    leftCard = leftCard + 8;
                    break;
                default :
                    leftCard = leftCard;
                    break;
            }
            node.setString(leftCard);
        }
    }

    var rePlayLayer = cc.Layer.extend({
        jsBind: 
        {
            _event: {
                mjhand: function () {
                    // var sData=jsclient.data.sData;
                    // var tData=sData.tData;
                    // if(tData.roundNum!=tData.roundAll) return;
                    // var pls=sData.players;
                    // var ip2pl={};
                    // for(var uid in pls)
                    // {
                    //   var pi=pls[uid];
                    //   var ip=pi.info.remoteIP;
                    //   if(ip)
                    //   {
                    // 	  if(!ip2pl[ip]) ip2pl[ip]=[];
                    // 	  ip2pl[ip].push(unescape(pi.info.nickname||pi.info.name));
                    //   }
                    // }
                    // var ipmsg=[];
                    // for(var ip in ip2pl)
                    // {
                    //   var ips=ip2pl[ip];
                    //   if(ips.length>1)
                    //   {
                    // 	  ipmsg.push("玩家:"+ips+"\n为同一IP地址,存在作弊可能\n")
                    //   }
                    // }
                    // if(ipmsg.length>0)
                    // {
                    //   ShowSameIP(ipmsg.join(""));
                    // }
                    // mylog("ipmsg "+ipmsg.length);

                },

                game_on_hide: function () {
                    // jsclient.tickGame(-1);
                },
                game_on_show: function () {
                    // jsclient.tickGame(1);
                },

                LeaveGame: function () {
                    jsclient.playui.removeFromParent(true);
                    delete jsclient.playui;
                    playMusic("bgMain");
                },
                endRoom: function (msg) {
                    mylog(JSON.stringify(msg));
                    if (msg.showEnd)
                        this.addChild(new EndAllLayer());
                    else
                        jsclient.Scene.addChild(new EndRoomLayer());
                },
                roundEnd: function () {
                    var sData = jsclient.data.sData;
                    if (sData.tData.roundNum <= 0)
                        this.addChild(new EndAllLayer());

                    this.addChild(new EndOneLayer());
                },
                moveHead: function () {
                    tableStartHeadPlayAction(this);
                },
                reinitSceneData: function () {
                    reConectHeadLayout(this);
                    // CheckDelRoomUI();
                },
                onlinePlayer: function () {
                    reConectHeadLayout(this);
                },
                // DelRoom: CheckDelRoomUI
            },
            roundnumImg: {
                _layout: [[0.1, 0.1], [0.5, 0.5], [1, 0]]
                , _event: {
                    reinitSceneData: function (eD) {
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
            cardNumImg: {
                _layout: [[0.1, 0.1], [0.5, 0.5], [-1.1, 0]],
                _event: {
                    reinitSceneData: function (eD) {
                        this.visible = CheckArrowVisible();
                    },
                    mjhand: function (eD) {
                        this.visible = CheckArrowVisible();
                    },
                    onlinePlayer: function (eD) {
                        this.visible = CheckArrowVisible();
                    }
                },
                cardnumAtlas: {
                    _text: function () {
                        var sData = jsclient.data.sData;
                        var tData = sData.tData;
                        if (tData) {
                            var leftCard = 0;
                            if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
                            //if(tData.withWind && !tData.withZhong) leftCard = 136 - 4 - tData.cardNext;
                            if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
                            if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
                            if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
                            switch (jsclient.data.sData.tData.gameType) {
                                case 1:
                                    leftCard = leftCard;
                                    break;
                                case 2:
                                    leftCard = leftCard + 8;
                                    break;
                                default :
                                    leftCard = leftCard;
                                    break;
                            }
                            return leftCard;
                        }
                    }, _event: {
                        waitPut: function () {
                            rePlayCardNext(this);
                        }
                        , MJPut: function () {
                            rePlayCardNext(this);
                        }, MJGang: function () {
                            rePlayCardNext(this);
                        }, MJHu: function () {
                            rePlayCardNext(this);
                        }, newCard: function () {
                            rePlayCardNext(this);
                        }
                    }
                }
            },

            back: {
                back: {_layout: [[0, 1], [0.5, 0.5], [0, 0], true]},
                clt: {
                    _layout: [[0.15, 0.15], [0, 1], [0.5, -0.5]],
                    play: {
                        _visible: function ()
                        {
                            return (jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui);
                        },

                        canHu_hongzhong:
                        {

                            _visible: function ()
                            {
                                return (jsclient.data.sData.tData.withZhong || jsclient.data.sData.tData.fanGui);
                            },
                            
                            card:
                            {
                                _run:function ()
                                {
                                    if(jsclient.data.sData.tData.withZhong)
                                    {
                                        log("红中鬼牌。。。。");
                                        this.visible = true;
                                    }

                                    if(jsclient.data.sData.tData.fanGui)
                                    {
                                        var guiTag = jsclient.data.sData.tData.gui;
                                        if(guiTag != 0)
                                        {
                                            this.visible = true;
                                            setCardPic(this, guiTag);
                                        }
                                        else
                                            this.visible = false;

                                        log("任意鬼牌。。。。" + guiTag);
                                    }

                                },
                            }
                        },

                    },
                    _event: {
                        initSceneData: function (eD) {
                            this.visible = true;
                        },
                        mjhand: function (eD) {
                            this.visible = CheckArrowVisible();
                        },
                        onlinePlayer: function (eD) {
                            this.visible = CheckArrowVisible();
                        }
                    }

                },

                gdmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function ()
                    {
                        if (jsclient.data.sData.tData.gameType == 1 && !IsThreeTable())
                            return true;
                        else
                            return false;
                    }
                },

                hzmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 2)
                            return true;
                        else
                            return false;
                    }
                },

                shzhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 3)
                            return true;
                        else
                            return false;
                    }
                },

                jphmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 4)
                            return true;
                        else
                            return false;
                    }
                },

                dgmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 5)
                            return true;
                        else
                            return false;
                    }
                },

                ybzhmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 6)
                            return true;
                        else
                            return false;
                    }
                },

                srfmj: {
                    _layout: [[0.2, 0.2], [0.5, 0.55], [0, 1.2]],
                    _visible: function ()
                    {
                        if (jsclient.data.sData.tData.gameType == 1 && IsThreeTable())
                            return true;
                        else
                            return false;
                    }
                },


                sy_name_back: {
                    _layout: [[0.2, 0.2], [0.5, 0.5], [0, 1.2]],
                    _visible: function () {
                        if (jsclient.data.sData.tData.gameType == 1)
                            return true;
                        else
                            return false;
                    }
                },
                clb: {_layout: [[0.15, 0.15], [0, 0], [0.5, 0.5]]},
                crt: {_layout: [[0.15, 0.15], [1, 1], [-0.5, -0.5]]},
                crb: {_layout: [[0.15, 0.15], [1, 0], [-0.5, 0.5]]},
                barl: {_layout: [[0.01, 0.7], [0.01, 0.5], [0, 0], true]},
                barr: {_layout: [[0.01, 0.7], [0.99, 0.5], [0, 0], true]},
                bart: {_layout: [[0.9, 0], [0.5, 0.99], [0, 0], true]},
                barb: {_layout: [[0.9, 0], [0.5, 0.01], [0, 0], true]},
            },
            
            banner: {
                _layout: [[0.878, 1], [0.5, 0.945], [0, 0]],

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
            },

            arrowbk: {
                _layout: [[0.15, 0.15], [0.5, 0.5], [0, 0]],
                _event: {
                    reinitSceneData: function (eD) {
                        this.visible = CheckArrowVisible();
                        SetArrowRotation(this)
                    }
                    , mjhand: function (eD) {
                        this.visible = CheckArrowVisible();
                        SetArrowRotation(this);
                    }
                    , onlinePlayer: function (eD) {
                        this.visible = CheckArrowVisible();
                    }
                    , waitPut: function (eD) {
                        SetArrowRotation(this)
                    }
                    , MJPeng: function (eD) {
                        SetArrowRotation(this)
                    }
                    , MJChi: function (eD) {
                        SetArrowRotation(this)
                    }
                    , MJGang: function (eD) {
                        SetArrowRotation(this)
                    }
                }, number: {
                    _run: function () {

                        updateArrowbkNumber(this);
                    },
                    _event: {
                        MJPeng: function () {
                            this.cleanup();
                            stopEffect(playAramTimeID)
                            updateArrowbkNumber(this);
                        }
                        , MJChi: function () {
                            this.cleanup();
                            stopEffect(playAramTimeID)
                            updateArrowbkNumber(this);
                        }
                        , waitPut: function () {
                            this.cleanup();
                            stopEffect(playAramTimeID)
                            updateArrowbkNumber(this);
                        },
                        MJPut: function (msg) {
                            if (msg.uid == SelfUid())
                                this.cleanup();


                        }, roundEnd: function () {
                            this.cleanup();
                            stopEffect(playAramTimeID)
                        }

                    }
                }
            },
            
            wait: {
                wxinvite: {
                    _layout: [[0.15, 0.15], [0.51, 0.51], [-0.68, 0]],
                    _click: function () {
                        var tData = jsclient.data.sData.tData;

                        //if(tData.noBigWin)
                        //	jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,"招脚打麻将",
                        //	   "房间号:"+tData.tableid+",转转麻将,"+tData.roundNum+"局,"
                        //      +(tData.canEatHu?"点炮胡,":"自摸胡,")
                        //	  +"速度加入【皮皮麻将】"
                        //	);
                        //else jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,"招脚打麻将",
                        //    "房间号:"+tData.tableid+",邵阳麻将,"+tData.roundNum+"局,"
                        //  +(tData.canEat?"可以吃,":"不能吃,")
                        //  +(tData.withWind?"带风,":"不带风,")
                        //  +"速度加入【皮皮麻将】"
                        //);
                        jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl, "【广东麻将】",
                            "房间号:" + tData.tableid + ",广东麻将," + tData.roundNum + "局," +
                            "速度加入，只等你来【星悦麻将】"
                        );
                    }
                },
                delroom: {
                    _layout: [[0.15, 0.15], [0.51, 0.51], [0.62, 0]],
                    _click: function () {
                        jsclient.delRoom(true);
                    }
                },
                _event: {
                    reinitSceneData: function (eD) {
                        this.visible = CheckInviteVisible();
                    },
                    addPlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    }, removePlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    }
                }
            },

            down: {

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
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 0);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },
                    linkZhuang: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerLinkZhuangLogo(this, 0);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerLinkZhuangLogo(this, 0);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },
                    hua: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 0);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },
                    zhong: {
                        _run: function () {
                            this.visible = false;
                        },
                        _event: {
                            waitPut: function () {
                                showPlayerZhuangLogo(this, 0);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 0);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 0);
                            }
                        }
                    },
                    // baojiuzhang: {
                    //     _run: function () {
                    //         this.visible = false;
                    //     },
                    //     _event: {
                    //         waitPut: function () {
                    //             showPlayerZhuangLogo(this, 0);
                    //         },
                    //         initSceneData: function () {
                    //             if (CheckArrowVisible()) showPlayerZhuangLogo(this, 0);
                    //         },
                    //         MJPeng: function () {
                    //             checkBaoJiuZhuangLogo(this, 0)
                    //         }
                    //     }
                    // },
                    chatbg: {
                        _run: function () {
                            this.getParent().zIndex = 600;
                        },
                        chattext: {
                            _event: {

                                MJChat: function (msg) {

                                    showchat(this, 0, msg);
                                }, playVoice: function (voicePath) {
                                    jsclient.data._tempMessage.msg = voicePath;
                                    showchat(this, 0, jsclient.data._tempMessage);
                                }
                            }
                        }
                    },

                },
                ready: {
                    _layout: [[0.07, 0.07], [0.5, 0.5], [0, -1.5]],
                    _run: function () {
                        CheckReadyVisible(this, 0);
                    },
                    _event: {
                        moveHead: function () {
                            CheckReadyVisible(this, -1);
                        },
                        addPlayer: function () {
                            CheckReadyVisible(this, 0);
                        },
                        removePlayer: function () {
                            CheckReadyVisible(this, 0);
                        },
                        onlinePlayer: function () {
                            CheckReadyVisible(this, 0);
                        }
                    }
                },
                stand: {
                    _layout: [[0.057, 0], [0.5, 0], [7, 0.7]],
                    _visible: false,

                    gui:
                    {
                        _visible : false
                    }
                },
                up: {_layout: [[0.055, 0], [0, 0], [0.8, 0.7]], _visible: false},
                down: {_layout: [[0.055, 0], [0, 0], [3, 1]], _visible: false},

                out0: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 3.5]], _visible: false},
                out1: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 4.4]], _visible: false},
                out2: {_layout: [[0, 0.08], [0.5, 0], [-5.5, 5.3]], _visible: false},
                effectStateAct: {
                    _run: function () {
                        this.zIndex = 100;
                    },
                    ef_gang: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                    ef_peng: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                    ef_chi: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }

                    }
                },
                _event: {
                    clearCardUI: function () {
                        clearCardUI(this, 0);
                    },
                    reinitSceneData: function (eD) {
                        SetPlayerVisible(this, 0);
                    },
                    addPlayer: function (eD) {
                        SetPlayerVisible(this, 0);
                    },
                    removePlayer: function (eD) {
                        SetPlayerVisible(this, 0);
                    },
                    mjhand: function (eD) {
                        InitPlayerHandUI(this, 0);
                    },
                    roundEnd: function () {
                        InitPlayerNameAndCoin(this, 0);
                    },
                    newCard: function (eD) {
                        HandleNewCard(this, eD, 0);
                    },
                    MJPut: function (eD) {  //HandleMJPut(this,eD,0);
                    },
                    MJChi: function (eD) {
                        HandleMJChi(this, eD, 0);
                    },
                    MJGang: function (eD) {
                        HandleMJGang(this, eD, 0);
                    },
                    MJPeng: function (eD) {
                        HandleMJPeng(this, eD, 0);
                    },
                    onlinePlayer: function (eD) {
                        // setOffline(this, 0);
                    },
                    MJTick: function (eD) {
                        // setOffline(this, 0);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 0);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 0);
                    },
                }
            },

            right: {

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
                                showPlayerZhuangLogo(this, 1);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 1);
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
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 1);
                            }
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
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 1);
                            }
                        }
                    },
                    zhong: {
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
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 1);
                            }
                        }
                    },
                    // baojiuzhang: {
                    //     _run: function () {
                    //         this.visible = false;
                    //     },
                    //     _event: {
                    //         waitPut: function () {
                    //             showPlayerZhuangLogo(this, 1);
                    //         },
                    //         initSceneData: function () {
                    //             if (CheckArrowVisible()) showPlayerZhuangLogo(this, 1);
                    //         },
                    //         MJPeng: function () {
                    //             checkBaoJiuZhuangLogo(this, 1)
                    //         }
                    //     }
                    // },
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

                out0: {_layout: [[0, 0.06], [1, 0.5], [-4.3, -3.8]], _visible: false},
                out1: {_layout: [[0, 0.06], [1, 0.5], [-5.3, -3.8]], _visible: false},
                out2: {_layout: [[0, 0.06], [1, 0.5], [-6.3, -3.8]], _visible: false},
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
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.7, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    clearCardUI: function () {
                        clearCardUI(this, 1);
                    },
                    reinitSceneData: function (eD) {
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
                    },
                    newCard: function (eD) {
                        HandleNewCard(this, eD, 1);
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
                        // setOffline(this, 1);
                    },
                    MJTick: function (eD) {
                        // setOffline(this, 1);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 1);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 1);
                    },
                }
            },

            top: {
                _run:function()
                {
                    if (IsThreeTable())
                        this.visible = false;
                },

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
                                showPlayerZhuangLogo(this, 2);
                            },
                            initSceneData: function () {
                                if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 2);
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
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 2);
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
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 2);
                            }
                        }
                    },
                    zhong: {
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
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 2);
                            }
                        }
                    },
                    // baojiuzhang: {
                    //     _run: function () {
                    //         this.visible = false;
                    //     },
                    //     _event: {
                    //         waitPut: function () {
                    //             showPlayerZhuangLogo(this, 2);
                    //         },
                    //         initSceneData: function () {
                    //             if (CheckArrowVisible()) showPlayerZhuangLogo(this, 2);
                    //         },
                    //         MJPeng: function () {
                    //             checkBaoJiuZhuangLogo(this, 2)
                    //         }
                    //     }
                    // },
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
                out2: {_layout: [[0, 0.08], [0.5, 1], [5.5, -5.3]], _visible: false},
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
                    ef_guo: {
                        _layout: [[0.1, 0.1], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hua: {
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.5, 0.7], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    clearCardUI: function () {
                        clearCardUI(this, 2);
                    },
                    reinitSceneData: function (eD) {
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
                    },
                    newCard: function (eD) {
                        HandleNewCard(this, eD, 2);
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
                        // setOffline(this, 2);
                    },
                    MJTick: function (eD) {
                        // setOffline(this, 2);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 2);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 2);
                    },
                }
            },
            
            left: {
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
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 3);
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
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 3);
                            }
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
                            },
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 3);
                            }
                        }
                    },
                    zhong: {
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
                            mjhand:function () {
                                showPlayerZhuangLogo(this, 3);
                            }
                        }
                    },
                    // baojiuzhang: {
                    //     _run: function () {
                    //         this.visible = false;
                    //     },
                    //     _event: {
                    //         waitPut: function () {
                    //             showPlayerZhuangLogo(this, 3);
                    //         },
                    //         initSceneData: function () {
                    //             if (CheckArrowVisible()) showPlayerZhuangLogo(this, 3);
                    //         },
                    //         MJPeng: function () {
                    //             checkBaoJiuZhuangLogo(this, 3)
                    //         }
                    //     }
                    // },
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
                        _layout: [[0.1, 0.1], [0.5, 0.25], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    },
                    ef_hu: {
                        _layout: [[0.2, 0.2], [0.5, 0.5], [0, 0], true],
                        _run: function () {
                            this.visible = false;
                        }
                    }
                },
                _event: {
                    clearCardUI: function () {
                        clearCardUI(this, 3);
                    },
                    reinitSceneData: function (eD) {
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
                    },
                    newCard: function (eD) {
                        HandleNewCard(this, eD, 3);
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
                        // setOffline(this, 3);
                    },
                    MJTick: function (eD) {
                        // setOffline(this, 3);
                    },
                    MJFlower: function (eD) {
                        HandleMJFlower(this, eD, 3);
                    },
                    MJZhong: function (eD) {
                        HandleMJZhong(this, eD, 3);
                    },
                }
            },

            eat: {

                chi0: 
                {
                    _visible: false, 
                    _layout: [[0, 0.1], [0.5, 0], [1.3, 2.5]],
                    // _touch: function (btn, eT)
                    // {
                    //     if (eT == 2) MJChichange(btn.tag);
                    // },
                    bgimg: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    },
                    bgground: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    },
                    card1: {},
                    card2: {},
                    card3: {}
                },
                chi1: {
                    _visible: false, _layout: [[0, 0.1], [0.5, 0], [1.3, 3.8]],
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJChichange(btn.tag);
                    // }
                },
                chi2: {
                    _visible: false, _layout: [[0, 0.1], [0.5, 0], [1.3, 5.1]],
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJChichange(btn.tag);
                    // }

                },
                peng: {
                    _visible: false, _layout: [[0, 0.1], [0.5, 0], [0, 2.5]],
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJPeng2Net();
                    // },
                    bgimg: {
                        _run: function ()
                        {
                            this.zIndex = -1;
                        },
                    },
                    bgground: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },
                gang0: {
                    _visible: false, _layout: [[0, 0.1], [0.5, 0], [-1.7, 2.5]], card1: {},
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJGangchange(btn.tag);
                    // },
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
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJGangchange(btn.tag);
                    // }
                },
                gang2: {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-1.7, 5.1]],
                    card: {},
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJGangchange(btn.tag);
                    // }
                },
                guo:
                {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [4.6, 2.5]],

                    // _touch: function (btn, eT) {
                    //     if (eT == 2) jsclient.MJPass2Net();
                    // },
                    bgimg: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },
                hu:
                {
                    _visible: false,
                    _layout: [[0, 0.1], [0.5, 0], [-3, 2.5]],
                    // _touch: function (btn, eT) {
                    //     if (eT == 2) MJHu2Net();
                    // },
                    bgimg: {
                        _run: function () {
                            this.zIndex = 0;
                        }
                    },
                    bgground: {
                        _run: function () {
                            this.zIndex = -1;
                        }
                    }
                },
                changeui:
                {
                    changeuibg:
                    {
                        _layout: [[0.2, 0.2], [0.5, 0], [0, 0]],
                        _run: function ()
                        {
                            this.y = this.getParent().getParent().getChildByName("chi0").y;
                            this.visible = false;
                        }

                    }
                },

                _event:
                {
                    showcaneat: function (ed)
                    {
                        showReplaycaneat(ed)
                    },

                    // MJFlower: function (eD) {
                    //     CheckEatVisible(jsclient.replayui.jsBind.eat);
                    // },
                    // MJZhong: function (eD) {
                    //     CheckEatVisible(jsclient.replayui.jsBind.eat);
                    // },

                }
            },
            controllerBg: {
                _layout: [[0.5, 0.5], [0.5, 0.5], [0, 0]]
                , play_btn: {
                    _click: function () {
                        updatelayer_itme_node.resume();
                    }
                }
                , pause_btn: {
                    _click: function () {
                        updatelayer_itme_node.pause();
                    }
                }
                , kuaijin_btn: {
                    _click: function () {

                    }
                }
                , return_btn: {
                    _click: function () {
                        updatelayer_itme_node.unscheduleAllCallbacks();
                        jsclient.replayui.removeFromParent(true);
                        jsclient.replayui = null;
                    }
                }
                , kuaitui_btn: {
                    _click: function () {

                    }
                }
            },
            
            chat_btn: {
                _layout: [[0.1, 0.1], [1, 0], [-1, 3.2]]
            },
            
            voice_btn: {
                _layout: [[0.1, 0.1], [1, 0], [-1, 2]]
            },
            
            backHomebtn: {
                _layout: [[0.09, 0.09], [0, 1], [1.8, -1.3]]
                , _click: function (btn) {
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

                }, _event: {
                    returnPlayerLayer: function () {
                        jsclient.playui.visible = true;
                    }, reinitSceneData: function (eD) {
                        this.visible = CheckInviteVisible();
                    }
                    , addPlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    }
                    , removePlayer: function (eD) {
                        this.visible = CheckInviteVisible();
                    }
                }
            }

        },
        ctor: function () {
            this._super();
            var playui = ccs.load("res/Replay.json");
            playMusic("bgFight");
            ConnectUI2Logic(playui.node, this.jsBind);
            this.addChild(playui.node);
            jsclient.lastMJTick = Date.now();
            this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(function () {
                if (jsclient.game_on_show) jsclient.tickGame(0);
            }), cc.delayTime(7))));
            jsclient.replayui = this;
            return true;
        },
    });
    var rePlayLayer = new rePlayLayer();
    return rePlayLayer;
}