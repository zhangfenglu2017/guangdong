
// time1, time2 的差值(单位秒),使用的是格林威治标准
function getTimeOff ( time1, time2, maxOff ) {
    var d1  = Date.parse(time1)/ 1000;
    var d2  = Date.parse(time2)/ 1000;
    var off = d2 - d1;
    return off ;
}

function stopEffect(id) {
    cc.audioEngine.stopEffect(id);
}

function playEffect(sd) {
    mylog(sd);
    return cc.audioEngine.playEffect("res/sound/" + sd + ".mp3", false);
}

function playMusic(sd) {
    cc.audioEngine.stopMusic();
    cc.audioEngine.playMusic("res/sound/" + sd + ".mp3", true);
}

function IsRoomOwner() {
    var sData = jsclient.data.sData;
    if (sData) {
        return sData.tData.uids[0] == SelfUid();
    }
    return false;
}

function GetSelfHead() {
    var pinfo = jsclient.data.pinfo;
    return {uid: pinfo.uid, url: pinfo.headimgurl};
}

function GetUidNames(uids) {
    var sData = jsclient.data.sData;

    var rtn = [];
    for (var i = 0; i < uids.length; i++) {
        var pl = sData.players[uids[i]];
        if (pl) rtn.push(unescape(pl.info.nickname || pl.info.name));
    }
    return rtn + "";
}

function getServersByRandForWeights(servers) {
    var serversSelect = jsclient.remoteCfg.serversSelect;
    if (serversSelect && serversSelect.length == servers.length) {
        var rand = Math.round(Math.random() * 1000);
        var sum = 0;
        for (var i = 0; i < serversSelect.length; i++) {
            sum += serversSelect[i];
            if (rand <= sum) {
                return i;
            }
        }
        return 0;
    }
    else {
        return Math.floor(Math.random() * servers.length);
    }
}

function getServerByRandForPort(parts) {
    if (parts.length > 3) {
        return parseInt(parts[1 + Math.floor(Math.random() * (parts.length - 1))]);
    }
    else {
        var min = parseInt(parts[1]);
        var max = parseInt(parts[2]);
        var offset = max - min + 1;
        var part = Math.floor(Math.random() * offset) + min;
        return parseInt(part);
    }
}

function playAnimByPlist(animNode, resName, animMax)
{


    // var animation = new cc.Animation();
    // for(var i = 1;i<=animMax;i++)
    // {
    //     var frame = cc.spriteFrameCache.getSpriteFrame(resName + i + ".png");
    //     animation.addSpriteFrame(frame);
    // }
    //
    // animation.setDelayPerUnit(0.12);
    // animation.setRestoreOriginalFrame(true);
    // var action = cc.animate(animation);
    // animNode.runAction(cc.repeatForever(cc.sequence(action, cc.delayTime(1.5))));
}

function playAnimByJson(jsonName, animName)
{
    var armature = ccs.Armature.create(jsonName);

    if(armature == null)
        return null;

    var animation = armature.getAnimation();
    animation.play(animName);

    return armature
}

//加载默认头像
function loadDefaultHead(node, posx, posy, scale, zindex, name, tag) {
    url = "res/play-yli/Photo_frame_man.png";
    var sprite = new cc.Sprite(url);
    sprite.x = posx;
    sprite.y = posy;
    sprite.scale = scale;
    sprite.zindex = zindex;
    sprite.name = name;
    sprite.tag = tag;

    node.addChild(sprite);
    log("加载默认头像...");
}

//裁剪头像
function ClipHead(node, url, posx, posy, scale, zindex, name, tag) {
    
    cc.loader.loadImg(url, {isCrossOrigin: true}, function (err, texture) 
    {
        if (!err && texture) 
        {
            var stencil = new cc.Sprite("res/play-yli/Photo_frame_05.png");   //可以是精灵，也可以DrawNode画的各种图形

            //1.创建裁剪节点
            var clipper = new cc.ClippingNode(stencil);   //创建裁剪节点ClippingNode对象  带模板
            clipper.setInverted(false);         //显示被模板裁剪下来的底板内容。默认为false 显示被剪掉部分。
            //alpha阀值：表示像素的透明度值。
            // 只有模板（stencil）中像素的alpha值大于alpha阈值时，内容才会被绘制。
            //alpha阈值（alphaThreshold）：取值范围[0,1]。
            //默认为1，表示alpha测试默认关闭，即全部绘制。
            //若不是1，表示只绘制模板中，alpha像素大于alphaThreshold的内容。
            clipper.setAlphaThreshold(0);    //设置绘制底板的Alpha值为0
            // clipper.setAnchorPoint(0.5,0.5);
            clipper.setPosition(posx, posy);
            clipper.zIndex = zindex;
            clipper.name = name;
            clipper.tag = tag;

            //3.创建底板
            var sprite = new cc.Sprite(texture);
            // sprite.setContentSize(128,124);
            var sprSize = sprite.getContentSize();
            log("微信头像大小：" + sprSize.width + "   " + sprSize.height);
            // sprite.setScale(scale);
            sprite.setScale(128 / sprSize.width, 124 / sprSize.height);
            // sprite.setPosition(0,0);
            // sprite.setAnchorPoint(0,0);

            clipper.addChild(sprite);
            node.addChild(clipper);
            log("加载裁切头像...");
        }
    });
}

jsclient.loadWxHead = function (url, node, posx, posy, scale, zindex, name, tag) {
    // url = "res/gameEndNew/Photo_frame_man.png";

    if (node == null)
        return;

    if (scale == null)
        scale = 1;

    if (zindex == null)
        zindex = 0;

    if (name == null)
        name = "";

    if (tag == null)
        tag = 0;

    if (!url)
        loadDefaultHead(node, posx, posy, 1.1, zindex, name, tag);
    else
        ClipHead(node, url, posx, posy, 0.2, zindex, name, tag);
};

jsclient.showPlayerInfo = function (info) {
    if(jsclient.userInfoLayerUi) return;//暂时解决多点触摸问题
    jsclient.uiPara = info;
    jsclient.Scene.addChild(new UserInfoLayer());
};

jsclient.restartGame = function ()
{
    if (jsclient.gamenet)
        jsclient.gamenet.disconnect();

    sendEvent("restartGame");
};

jsclient.changeIdLayer = function () {
    
    if (!ChangeIDLayer)
        return;

    if (!jsclient.changeidui) {
        jsclient.Scene.addChild(new ChangeIDLayer());
    }
};

jsclient.exportDataLayer = function () {
    
    if (!ExportDataLayer)
        return;

    if (!jsclient.exportdataui) {
        jsclient.Scene.addChild(new ExportDataLayer());
    }
};

jsclient.leaveGame = function () {
    
    jsclient.block();
    jsclient.gamenet.request("pkplayer.handler.LeaveGame", {}, function (rtn) {
        cc.log("leaveGame------callback,result:" + rtn.result);
        if (rtn.result == 0) {
            delete jsclient.data.sData;
            sendEvent("LeaveGame");
        }
        jsclient.unblock();
    });
};

//jsclient.getPlayLogOne = function (now, logid) {
//
//    jsclient.block();
//    jsclient.gamenet.request("pkplayer.handler.getSymjLog", {now: now, logid: logid}, function (rtn) {
//        cc.log("getPlayLogOne------callback");
//        jsclient.unblock();
//        if (rtn.result == 0) {
//            sendEvent("playLogOne", rtn.data["mjlog"]);
//        }
//    });
//};

jsclient.getPlayLogOne = function (item) {

    console.log("ip===========" + item.ip);
    if(item.ip)
    {
        console.log("ip===========" + item.ip);
        jsclient.block();
        var xhr = cc.loader.getXMLHttpRequest();
        var playUrl="http://"+item.ip+":800/playlog/"+item.now.substr(0,10)+"/"+item.owner+"_"+item.tableid+".json";
        xhr.open("GET", playUrl);
        xhr.onreadystatechange = function () {
            jsclient.unblock();
            if (xhr.readyState == 4 && xhr.status == 200) {
                sendEvent("playLogOne",JSON.parse(xhr.responseText));
            }
        }
        xhr.onerror = function (event) {jsclient.unblock(); }
        xhr.send();
    }
    else
    {
        var now=item.now; var logid=item.logid;
        jsclient.block();
        jsclient.gamenet.request("pkcon.handler.getSymjLog",{now:now,logid:logid},function(rtn){
            jsclient.unblock();
            if(rtn.result==0)
            {
                sendEvent("playLogOne",rtn.data["mjlog"]);
            }
        });
    }
};

jsclient.getPlayLog = function () {
    jsclient.block();
    jsclient.gamenet.request("pkplayer.handler.getSymjLog", {uid: SelfUid()}, function (rtn) {
        cc.log("getPlayLog------callback,result:" + rtn.result);
        jsclient.unblock();
        if (rtn.result == 0) {
            jsclient.data.playLog = rtn.playLog;
            sendEvent("playLog");
        }

    });

};

jsclient.logout = function () {
    jsclient.block();
    jsclient.gamenet.request("pkcon.handler.logout", {}, function () {
        sys.localStorage.removeItem("WX_USER_LOGIN");
        sys.localStorage.removeItem("loginData");

        sendEvent("logout");
        jsclient.unblock();
    });
};

jsclient.joinGame = function (tableid) {
    jsclient.block();

    var joinPara = {roomid: "symj1"};
    if (tableid)
        joinPara.tableid = tableid;
    else
        joinPara.roomid = "symj2";

    jsclient.gamenet.request("pkplayer.handler.JoinGame", joinPara,
        function (rtn) {
            mylog("joinGame " + rtn.result);
            if (rtn.result != 0) {
                jsclient.unblock();

                if (rtn.result == ZJHCode.roomFull)
                    jsclient.showMsg("房间已经满");

                if (rtn.result == ZJHCode.roomNotFound)
                    jsclient.showMsg("房间不存在");
            }
        });
};

jsclient.createRoom = function (gameType, round, canEatHu, withWind, canEat, noBigWin, canHu7,canFan7,
                                canHuWith258, withZhong, zhongIsMa, horse, baoZhaMa, jjg, fanGui, twogui, fanNum, maxPlayer,
                                canBigWin, guiJiaMa, guiJiaBei, gui4Hu, gui4huBeiNum, noCanJiHu, maGenDi,maGenDiDuiDuiHu,
                                menQingJiaFen)
{
    jsclient.block();
    jsclient.gamenet.request("pkplayer.handler.CreateVipTable", {
            gameType: gameType,
            round: round,
            canEatHu: canEatHu,
            withWind: withWind,
            canEat: canEat,
            noBigWin: noBigWin,
            canHu7: canHu7,
            canFan7:canFan7,
            canHuWith258: canHuWith258,
            withZhong: withZhong,
            zhongIsMa:zhongIsMa,
            horse: horse,
            baozhama:baoZhaMa,
            jiejieGao: jjg,
            fanGui:fanGui,
            twogui:twogui,
            fanNum:fanNum,
            maxPlayer:maxPlayer,
            canBigWin:canBigWin,
            guiJiaMa:guiJiaMa,
            guiJiaBei:guiJiaBei,
            gui4Hu:gui4Hu,
            gui4huBeiNum:gui4huBeiNum,
            noCanJiHu:noCanJiHu,
            maGenDi:maGenDi,
            maGenDiDuiDuiHu:maGenDiDuiDuiHu,
            menQingJiaFen:menQingJiaFen,
        },
        function (rtn) {
            jsclient.unblock();
            if (rtn.result == 0) {
                jsclient.data.vipTable = rtn.vipTable;
                jsclient.joinGame(rtn.vipTable);
            }
        });
};

jsclient.tickGame = function (tickType) {
    return;
    if (jsclient.lastMJTick > 0) {
        if (jsclient.lastMJTick < Date.now() - 15000) {
            jsclient.lastMJTick = -1;
            jsclient.showMsg("网络连接断开(" + 20 + ")，请检查网络设置，重新连接", function () {
                jsclient.restartGame();
            })
        }
        else {
            jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "MJTick", tickType: tickType});
        }
    }
};

jsclient.tickServer = function () {
    if (jsclient.gamenet)
        jsclient.gamenet.request("pkcon.handler.tickServer", {}, function (rtn) {
            mylog("tick");
        });
};

jsclient.openWeb = function (para) {
    sendEvent("openWeb", para);
};

jsclient.showMsg = function (msg, yesfunc, nofunc, style) {
    sendEvent("popUpMsg", {msg: msg, yes: yesfunc, no: nofunc, style: (style || "")});
};

jsclient.delRoom = function (yes)
{
    var sData = jsclient.data.sData;
    if (sData.tData.tState == TableState.waitJoin && sData.tData.uids[0] != SelfUid())
        jsclient.leaveGame();
    else
        jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "DelRoom", yes: yes});
};

//获取邀请奖励
jsclient.getInviteReward = function (rewIndex) {

    jsclient.block();

    var data = jsclient.getInviteData();
    cc.log("获取邀请奖励： " + JSON.stringify(data));

    jsclient.gamenet.request("pkplayer.handler.doActivity", {actId : data._id, actType : data.actType, rewIndex : rewIndex}, function (rtn)
    {
        jsclient.unblock();
        if (rtn.result == 0) {

            sendEvent("actData", {index:rewIndex, num:rtn.reward[1]});

        }
    });
};

//获取新手奖励
jsclient.getNewPlayerReward = function ( data ) {

    jsclient.block();
    jsclient.gamenet.request("pkplayer.handler.doActivity", data, function (rtn) {

        jsclient.unblock();
        if (rtn.result == 0) {
            var diamondNum  = rtn.reward;
            jsclient.Scene.addChild( new AwardPrompt( diamondNum[1] ) );
            if( newPlayerAwardBtn  ){
                newPlayerAwardBtn.removeFromParent( true );
            }
            if( jsclient.activationCodeLayer ){
                jsclient.activationCodeLayer.removeFromParent( true );
            }
        }else{
            jsclient.Scene.addChild( new ErroPrompt("领取失败") );
        }
    });
};

//获取邀请数据
jsclient.getInviteData = function () {

    for(var index in jsclient.actionCfg)
    {
        var data = jsclient.actionCfg[index];
        if(data.actType == ActivityType.invite)
            return data
    }
};

//获取礼包数据
jsclient.getGiftData = function () {

    for(var index in jsclient.actionCfg)
    {
        var data = jsclient.actionCfg[index];
        if(data.actType == ActivityType.newPlayer)
            return data
    }
};

//地理位置
jsclient.geographicalPos = function (latitude, longitude) {
    if (jsclient.gamenet)
        jsclient.gamenet.request("pkcon.handler.geographicalPos", {
            latitude: latitude,
            longitude: longitude
        }, function (rtn) {
        });
};


jsclient.deepClone = function (sObj) {
    if (typeof(sObj) !== "object") {
        return sObj;
    }

    var s = {};
    if (sObj.constructor == Array) {
        s = [];
    }

    for (var i in sObj) {
        s[i] = jsclient.deepClone(sObj[i]);//Object.clone(sObj[i]);
    }
    return s;
};

jsclient.getCurrentTime = function () {
    var now = new Date();
    var year = now.getFullYear();       //年
    var month = now.getMonth() + 1;     //月
    var day = now.getDate();            //日

    var hh = now.getHours();            //时
    var mm = now.getMinutes();          //分
    var ss = now.getSeconds();          //秒

    return [year, month, day, hh, mm, ss];
};

jsclient.dateInRectDate = function (myTime, startTime, endTime) {
    if (!myTime || !startTime || !endTime) return;
    var makeNum = function (array) {
        var num = 0;
        for (var i = 0; i < array.length; i++) {
            num += array[i] * Math.pow(10, (10 - i * 2));
        }
        return num;
    };

    var myTime_Num = makeNum(myTime);
    var startTime_Num = makeNum(startTime);
    var endTime_Num = makeNum(endTime);
    return (myTime_Num >= startTime_Num && myTime_Num <= endTime_Num);
};


jsclient.heartbeatGame = function() {
    // 初始化心跳计数
    if(typeof(jsclient.heartbeatCount) == "undefined"){
        jsclient.heartbeatCount = 0;
    }
    jsclient.heartbeatCount ++;
    if( jsclient.heartbeatCount > 3 ){
        jsclient.showMsg("连接已断开，请重新登陆", function(){jsclient.restartGame()} );
    }

    jsclient.gamenet.request("pkroom.handler.tableMsg", {cmd: "HeartBeat"}, function (ed) {
        if( !jsclient || !jsclient.data || !jsclient.data.sData ){
            return;
        }
        jsclient.heartbeatCount = 0;

        for (var idx in jsclient.data.sData.players){
            var pl = jsclient.data.sData.players[idx];
            var uid = pl.info.uid;
            if( uid == SelfUid() ){
                continue;
            }

            if(ed[uid] < 0 || ed[uid] >= 10000){
                if( jsclient.data.sData.players[uid].onLine ) {
                    jsclient.data.sData.players[uid].onLine = false;
                    sendEvent("onlinePlayer", {uid: uid, onLine: false, mjState: pl.mjState});
                }
            }
            else{
                if( !jsclient.data.sData.players[uid].onLine ) {
                    jsclient.data.sData.players[uid].onLine = true;
                    sendEvent("onlinePlayer", {uid: uid, onLine: true, mjState: pl.mjState});
                }
            }
        }
    });
};

jsclient.netCallBack =
{
    loadWxHead: [0.01, function (d) {
    }],

    MJChat: [0, function (d) {
    }],

    downAndPlayVoice: [0, function (d) {
    }],

    initSceneData: [0, function (d) {
        mylog("initSceneData");
        if (d.tData.roundNum <= -2) {
            jsclient.leaveGame();
            return -1;
        } else {
            jsclient.data.sData = d;
            d.serverNow -= Date.now();
            if (!jsclient.playui)  jsclient.Scene.addChild(new PlayLayer());
            sendEvent("clearCardUI");
        }
    }],

    reinitSceneData: [0, function (d) {
        mylog("reinitSceneData");
        jsclient.data.sData = d;
        d.serverNow -= Date.now();
        if (!jsclient.replayui)  jsclient.Scene.addChild(newReplayLayer());
        sendEvent("clearCardUI");
    }],

    removePlayer: [0, function (d) {
        var sData = jsclient.data.sData;
        cc.log("delete player " + d.uid);
        delete sData.players[d.uid];
        sData.tData = d.tData;
        mylog(JSON.stringify(Object.keys(sData.players)));
    }],

    addPlayer: [0, function (d) {
        var sData = jsclient.data.sData;
        sData.players[d.player.info.uid] = d.player;
        sData.tData = d.tData;
        cc.log(JSON.stringify(sData.tData));
    }],

    updateInfo: [0, function (info) {

        var pinfo = jsclient.data.pinfo;
        for (var pty in info)
            pinfo[pty] = info[pty];

        // sendEvent("UpdateGiftFlag");
        // sendEvent("updateArrowRotate");
    }],

    moveHead: [1, function () {
    }],

    mjhand: [0, function (d) {
        sendEvent("clearCardUI");
        var sData = jsclient.data.sData;
        sData.tData = d.tData;
        for (var uid in sData.players) {
            var pl = sData.players[uid];
            pl.mjpeng = [];
            pl.mjgang0 = [];
            pl.mjgang1 = [];
            pl.mjchi = [];
            pl.mjput = [];
            pl.mjflower = [];
            pl.mjzhong = [];
            pl.skipPeng = [];
            pl.baojiu = {num: 0, putCardPlayer: []};
            pl.skipHu = false;
            delete pl.mjhand;
            pl.mjState = TableState.waitPut;

            if (uid == SelfUid()) {
                pl.mjhand = d.mjhand;
                pl.mjpeng4 = [];
            }
        }
        playEffect("shuffle");
    }],
    MJFlower: [0, function (d) {
        playEffect("nv/flower");
        var sData = jsclient.data.sData;
        var pl = sData.players[d.uid];
        if (d.uid == SelfUid()) {
            var idx = pl.mjhand.indexOf(d.card);
            if (idx >= 0) {
                pl.mjhand.splice(idx, 1);
            }
        }
        pl.mjflower.push(d.card);
        cc.log("HuiZhou：　MJFlower: pl.mjflower.length = " + pl.mjflower.length);
    }],
    MJZhong: [0, function (d) {
        playEffect("nv/71");
        var sData = jsclient.data.sData;
        var pl = sData.players[d.uid];
        if (d.uid == SelfUid()) {
            var idx = pl.mjhand.indexOf(d.card);
            if (idx >= 0) {
                pl.mjhand.splice(idx, 1);
            }
        }
        pl.mjzhong.push(d.card);
        cc.log("东莞麻将：　红中算马个数: pl.mjzhong.length = " + pl.mjzhong.length);
    }],
    MJPass: [0, function (d) {
        console.log("------------------------------MJPass");
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var pl = sData.players[SelfUid()];
        pl.mjState = d.mjState;
        if (tData.gameType == 3)  pl.linkZhuang = d.linkZhuang;
        pl.skipPeng = d.skipPeng;
        pl.skipHu = d.skipHu;
        mylog("MJPass");
    }],

    MJPut: [0.8, function (d) {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        tData.lastPut = d.card;
        tData.tState = TableState.waitEat;
        tData.putType = d.putType;
        var pl = sData.players[d.uid];
        pl.mjput.push(d.card);
        pl.skipPeng = [];
        pl.skipHu = false;
        playEffect("nv/" + d.card);

        if (d.uid == SelfUid()) {
            pl.mjhand.splice(pl.mjhand.indexOf(d.card), 1);
            pl.mjState = TableState.waitPut;
            pl.skipHu = false;
        }
        else {
            sData.players[SelfUid() + ""].mjState = TableState.waitEat;
        }
        mylog("myput " + d.card);
    }],

    newCard: [0, function (d) {
        var sData = jsclient.data.sData;
        var pl = sData.players[SelfUid() + ""];
        var hands = pl.mjhand;
        pl.isNew = true;
        hands.push(d);
    }],

    waitPut: [0, function (d) {
        var sData = jsclient.data.sData;
        sData.tData = d;
        sData.players[SelfUid() + ""].mjState = TableState.waitPut;
        playEffect("give");
    }],

    getLinkZhuang: [0, function (d) {
        var sData = jsclient.data.sData;
        sData.tData = d.tData;

        if(sData.tData.gameType == 3 || sData.tData.gameType == 1 ){
            for (var uid in d.players) {
                var pl = d.players[uid];
                sData.players[uid].linkZhuang = pl.linkZhuang;
                sData.players[uid].linkHu = pl.linkHu;
                // cc.log("getLinkZhuang===============================================linkZhuang="+ pl.linkZhuang);
            }
        }
        if(d.tData.fanGui) {

            sData.tData.fanGui = d.tData.fanGui;
            sData.tData.gui = d.tData.gui;
            jsclient.majiang.gui = sData.tData.gui;

            // console.log("翻出的鬼牌是===============================" + d.tData.gui);
            // console.log("翻出的鬼牌是===============================" + d.tData.nextgui);
        }
        for (var uid in d.players) {
            var pl = d.players[uid];
            sData.players[uid].linkZhuang = pl.linkZhuang;
            // cc.log("getLinkZhuang===============================================linkZhuang="+ pl.linkZhuang);
            if(sData.tData.gameType == 4)
            {
                sData.players[uid].fengWei = pl.fengWei;
                cc.log("此人===============================================uid="+ uid + "风位是：" + pl.fengWei);
            }
        }
        if(sData.tData.gameType == 4)
        {
            sData.tData.jiPingHuCircleWind.curCircleWind = d.tData.jiPingHuCircleWind.curCircleWind;

        }

    }],
    MJChi: [0, function (d) {
        var sData = jsclient.data.sData;
        sData.tData = d.tData;

        var tData = sData.tData;
        var uids = tData.uids;
        var cds = d.mjchi;
        cds.sort(function (a, b) {
            return a - b
        });

        //mylog("MJChi "+d.mjchi+" "+d.from+" "+tData.curPlayer);

        playEffect("nv/chi");
        var pl = sData.players[uids[tData.curPlayer]];
        var lp = sData.players[uids[d.from]];
        for (var i = 0; i < cds.length; i++) {
            pl.mjchi.push(cds[i]);
            pl.isNew = false;
            if (i == d.pos) {
                var mjput = lp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == cds[i]) {
                    mjput.length = mjput.length - 1;
                }
                else  mylog("eat error from");
            }
            else if (uids[tData.curPlayer] == SelfUid()) {
                pl.mjState = TableState.waitPut;
                var mjhand = pl.mjhand;
                var idx = mjhand.indexOf(cds[i]);
                if (idx >= 0) {
                    mjhand.splice(idx, 1);
                }
                else mylog("eat error to");
            }
        }
    }],

    MJPeng: [0, function (d) {
        var sData = jsclient.data.sData;
        sData.tData = d.tData;
        var tData = sData.tData;
        var uids = tData.uids;
        var cd = tData.lastPut;

        mylog("MJPeng " + cd + " " + d.from + " " + tData.curPlayer);

        playEffect("nv/peng");
        var pl = sData.players[uids[tData.curPlayer]];

        switch (jsclient.data.sData.tData.gameType) {
            case 1:
                break;
            case 2:
            {
                pl.baojiu = d.baojiu;
                if (pl.baojiu && pl.baojiu.num == 3) {
                    console.log(pl.info.name + "报九");
                }
                if (pl.baojiu && pl.baojiu.num == 4) {
                    console.log("被" + pl.baojiu.putCardPlayer[0] + "报九");
                }
            }
                break;
            default :
                break;
        }


        var lp = sData.players[uids[d.from]];
        pl.mjpeng.push(cd);
        var mjput = lp.mjput;
        if (mjput.length > 0 && mjput[mjput.length - 1] == cd) {
            mjput.length = mjput.length - 1;
        }
        else  mylog("peng error from");
        if (uids[tData.curPlayer] == SelfUid()) {
            pl.mjState = TableState.waitPut;
            pl.isNew = false;
            var mjhand = pl.mjhand;
            var idx = mjhand.indexOf(cd);
            if (idx >= 0) {
                mjhand.splice(idx, 1);
            }
            else mylog("eat error to");
            idx = mjhand.indexOf(cd);
            if (idx >= 0) {
                mjhand.splice(idx, 1);
            }
            else mylog("eat error to");
            if (mjhand.indexOf(cd) >= 0)  pl.mjpeng4.push(cd);
        }
    }],

    MJGang: [0, function (d) {
        playEffect("nv/gang");
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var uids = tData.uids;
        var cd = d.card;
        var pl = sData.players[d.uid];
        if (d.gang == 1) {
            pl.mjgang0.push(cd);
            if (d.uid == SelfUid()) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
            }

            var lp = sData.players[uids[d.from]];
            var mjput = lp.mjput;
            if (mjput.length > 0 && mjput[mjput.length - 1] == cd) {
                mjput.length = mjput.length - 1;
            }
            else  mylog("gang error from");
            pl.isNew = false;
        }
        else if (d.gang == 2) {
            pl.mjgang0.push(cd);
            pl.mjpeng.splice(pl.mjpeng.indexOf(cd), 1);
            if (d.uid == SelfUid()) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
            }
        }
        else if (d.gang == 3) {
            pl.mjgang1.push(cd);
            if (d.uid == SelfUid()) {
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
                pl.mjhand.splice(pl.mjhand.indexOf(cd), 1);
            }
        }
        tData.curPlayer = tData.uids.indexOf(d.uid);
        tData.lastPut = cd;
        if (!tData.noBigWin || (d.gang == 2 && tData.canEatHu)) tData.putType = d.gang;

        tData.tState = TableState.waitEat;

        if (d.uid == SelfUid()) {
            pl.mjState = TableState.waitCard;
        }
        else {
            sData.players[SelfUid() + ""].mjState = TableState.waitEat;
        }
    }],

    roundEnd: [0, function (d)//数据
    {
        var sData = jsclient.data.sData;
        sData.tData = d.tData;

        var winone = false;

        for (var uid in d.players)
        {
            var pl = d.players[uid];
            var plLocal = sData.players[uid];
            for (var pty in pl)
                plLocal[pty] = pl[pty];

            if(pl.winone != 0)
                winone = true;
        }

        if (sData.tData.winner >= 0 && winone)
            playEffect("nv/hu");

        if (d.playInfo && jsclient.data.playLog)
        {
            jsclient.data.playLog.logs.push(d.playInfo);
        }
    }],

    endRoom: [0, function (d) {
        jsclient.endRoomMsg = d;
        if (d.playInfo && jsclient.data.playLog) {
            jsclient.data.playLog.logs.push(d.playInfo);
        }
    }],

    onlinePlayer: [0, function (d) {
        var sData = jsclient.data.sData;
        if (sData) {
            sData.players[d.uid].onLine = d.onLine;
            sData.players[d.uid].mjState = d.mjState;
        }
    }],

    MJTick: [0, function (msg) {
        var sData = jsclient.data.sData;
        jsclient.lastMJTick = Date.now();
        if (sData) {
            var tickStr = "";
            for (var uid in msg.players) {
                var pl = msg.players[uid];
                tickStr += pl.tickType + "|";
                var PL = sData.players[uid];
                if (PL) {

                    if (pl.tickType < 0 || pl.mjTickAt + 10000 < msg.serverNow) {
                        PL.onLine = false;
                    }
                    else {
                        PL.onLine = true;
                    }
                }
            }
            mylog("mjtick " + tickStr);
        }
    }],

    DelRoom: [0, function (dr) {
        var sData = jsclient.data.sData;
        sData.tData = dr.tData;
        for (var uid in dr.players) {
            var pl = dr.players[uid];
            sData.players[uid].delRoom = pl.delRoom;
        }
        if (dr.nouid.length >= 1) {
            jsclient.showMsg("玩家 " + GetUidNames(dr.nouid) + " 不同意解散房间");
        }
    }]
};

jsclient.NetMsgQueue = [];

jsclient.native =
{
    wxLogin: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                //Native发送_event:WX_USER_LOGIN  返回信息为json通过json中是否有nickName判断登录是否成功
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "StartWxLogin", "()V");
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                //Native发送_event:WX_USER_LOGIN  返回信息为json通过json中是否有nickName判断登录是否成功
                jsb.reflection.callStaticMethod("AppController", "sendAuthRequest");
            }
        }
        catch (e) {
            jsclient.native.HelloOC("wxLogin throw: " + JSON.stringify(e));
        }

    },

    wxShareUrl: function (url, title, description) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "StartShareWebViewWxSceneSession", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", url, title, description);
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "wxShareUrl:AndText:AndUrl:", title, description, url);
            }
        }
        catch (e) {
            jsclient.native.HelloOC("wxShareUrl throw: " + JSON.stringify(e));
        }

    },

    wxShareImage: function () {
        try {
            var writePath = jsb.fileUtils.getWritablePath();
            var textrueName = "wxcapture_screen.png";
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                //脚本通知c++截屏 event:capture_screen c++收到后返回截屏结果信息captureScreen_OK captureScreen_False成功本函数响应
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "StartShareTextureWxSceneSession", "(Ljava/lang/String;)V", writePath + textrueName);
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                //脚本通知c++截屏 event:capture_screen c++收到后返回截屏结果信息captureScreen_OK captureScreen_False成功本函数响应
                jsb.reflection.callStaticMethod("AppController", "wxShareTexture:", writePath + textrueName);
            }
        }
        catch (e) {
            jsclient.native.HelloOC("wxShareImage throw: " + JSON.stringify(e));
        }

    },

    wxShareText: function (text) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "StartShareTextWxSceneSession", "(Ljava/lang/String;)V", text);
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {

            }
        }
        catch (e) {
            jsclient.native.HelloOC("wxShareText throw: " + JSON.stringify(e));
        }
    },

    NativeBattery: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "NativeBattery", "()V");
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "NativeBattery");
            }
        }
        catch (e) {
            jsclient.native.HelloOC("NativeBattery throw: " + JSON.stringify(e));
        }
    },

    NativeVibrato: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "NativeVibrato", "(Ljava/lang/String;Ljava/lang/String;)V", "100,300,100,300", "false");
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "NativeVibrato");
            }
        }
        catch (e) {
            jsclient.native.HelloOC("NativeVibrato throw: " + JSON.stringify(e));
        }
    },

    StartRecord: function (filePath, fileName) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "startRecord", "(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;", String(filePath), String(fileName));
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "startRecord:lajioc:", String(filePath), String(fileName));
            }
        }
        catch (e) {
            jsclient.native.HelloOC("StartRecord throw: " + JSON.stringify(e));
        }
    },

    EndRecord: function (eventName) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "endRecord", "(Ljava/lang/String;)V", String(eventName));
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "endRecord:", String(eventName));
            }
        } catch (e) {
            jsclient.native.HelloOC("EndRecord throw: " + JSON.stringify(e));
        }
    },

    UploadFile: function (fullFileName, url, eventName) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "uploadFile", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", String(fullFileName), String(url), String(eventName));
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "uploadFile:url:eventName:", String(fullFileName), String(url), String(eventName));
            }
        }
        catch (e) {
            jsclient.native.HelloOC("UploadFile throw: " + JSON.stringify(e));
        }
    },

    DownLoadFile: function (filePath, fileName, url, eventName) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "downLoadFile", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V", String(filePath), String(fileName), String(url), String(eventName));
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod("AppController", "downloadFile:fileName:url:eventName:", String(filePath), String(fileName), String(url), String(eventName));
            }
        }
        catch (e) {
            jsclient.native.HelloOC("DownLoadFile throw: " + JSON.stringify(e));
        }
    },

    HelloOC: function (message) {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                console.log(String(message));
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                console.log(String(message));
                jsb.reflection.callStaticMethod("AppController", "HelloOC:", String(message));
            }
        } catch (e) {
            console.log("虽然我挂掉了,但是我还是坚持打印了了log: " + String(message));
        }
    },

    //计算两个玩家之间的距离
    CalculateLineDistance: function (latitude1, longitude1, latitude2, longitude2) {
        if (latitude1 == 0 || longitude1 == 0 || latitude2 == 0 || longitude2 == 0)
            return 0;

        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                var dis = jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "CalculateDistance",
                    "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;",
                    String(latitude1), String(longitude1), String(latitude2), String(longitude2));

                return dis * 1;
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                var dis = jsb.reflection.callStaticMethod("AppController", "calculateDistance:lon1:lat2:lon2:",
                    String(latitude1), String(longitude1), String(latitude2), String(longitude2));

                var disVar = parseFloat(dis).toFixed(1);

                return disVar;
            }
            else {
                return 0;
            }

        }
        catch (e) {
            jsclient.native.HelloOC("CalculateLineDistance throw: " + JSON.stringify(e));
            return 0;
        }

    },

    //获取玩家纬度
    GetLatitudePos: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                return jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "getLatitudePos", "()Ljava/lang/String;");
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                return String(jsb.reflection.callStaticMethod("AppController", "getLatitudePos"));
            }
            else {
                return 0;
            }
        }
        catch (e) {
            jsclient.native.HelloOC("getLatitudePos throw: " + JSON.stringify(e));
            return 0;
        }
    },

    //获取玩家经度
    GetLongitudePos: function () {
        try {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                return jsb.reflection.callStaticMethod("org.cocos2dx.javascript.AppActivity", "getLongitudePos", "()Ljava/lang/String;");
            }
            else if (cc.sys.OS_IOS == cc.sys.os) {
                return jsb.reflection.callStaticMethod("AppController", "getLongitudePos");
            }
            else {
                return 0;
            }
        }
        catch (e) {
            jsclient.native.HelloOC("getLongitudePos throw: " + JSON.stringify(e));
            return 0;
        }
    },
};


var JSScene = cc.Scene.extend({
    jsBind:
    {
        _event:
        {
            openWeb: function (type) {
                // jsclient.uiPara = para;

                if (type == 0) {
                    //消息、联系方式
                    this.addChild(new WebViewLayer());
                }
                else if (type == 1) {
                    //用户协议
                    this.addChild(new WebViewLayer1());
                }
                else if (type == 2) {
                    //游戏玩法
                    this.addChild(new WebViewLayer2());
                }
            },

            popUpMsg: function (pmsg) {
                this.addChild(NewPopMsgLayer(pmsg));
            },

            updateFinish: function () {
                if (!jsclient.gamenet)
                    jsclient.gamenet = new GameNet();

                var servers = jsclient.remoteCfg.servers.split(',');
                var server = servers[getServersByRandForWeights(servers)];
                var parts = server.split(':');
                var host = parts[0];
                var port = getServerByRandForPort(parts);

                jsclient.gamenet.disconnect();
                jsclient.gamenet.connect(host, port,
                    function () {
                        sendEvent("connect");
                    },
                    function () {
                        sendEvent("disconnect", 1);
                    }
                );
            },

            connect: function () {
                jsclient.game_on_show = false;
                if (!jsclient.homeui) {
                    mylog("loginui");
                    this.addChild(new LoginLayer());
                    jsclient.unblock();
                }
                else {
                    mylog("auto login");
                    jsclient.autoLogin();
                }
            },

            game_on_hide: function () {
                jsclient.game_on_show = false;
            },

            game_on_show: function () {
                jsclient.game_on_show = true;
            },

            disconnect: function (code) {
                if (!jsclient.remoteCfg || (cc.sys.OS_WINDOWS != cc.sys.os) && ( code != 6 || jsclient.game_on_show)) {
                    jsclient.unblock();
                    jsclient.showMsg("网络连接断开(" + code + ")，请检查网络设置，重新连接", function () {
                        jsclient.restartGame();
                    })
                }
                else {
                    jsclient.block();
                    jsclient.game_on_show = true;
                    mylog("reconnect");
                    jsclient.Scene.runAction(cc.sequence(cc.delayTime(0.1), cc.callFunc(
                        function () {
                            sendEvent("updateFinish");
                        }
                    )));

                }
            },

            loginOK: function (rtn) {
                
                jsclient.data = rtn;
                for (var netEvt in jsclient.netCallBack) 
                {
                    jsclient.gamenet.QueueNetMsgCallback(netEvt);
                }
                
                jsclient.gamenet.SetCallBack("disconnect", function () 
                {
                    sendEvent("disconnect", 6);
                });
                
                if (!jsclient.homeui)
                    this.addChild(new HomeLayer());
                
                if (rtn.vipTable > 0)
                    jsclient.joinGame(rtn.vipTable);
                else 
                    sendEvent("LeaveGame");
            },

            logout: function () {
                this.addChild(new LoginLayer());
            },

            createRoom: function () {
                this.addChild(new CreateLayer());
            },

            joinRoom: function () {
                this.addChild(new EnterLayer());
            },

            initSceneData: function (data) {
                jsclient.unblock();
            },

            QueueNetMsg: function (ed) {
                var oldLen = jsclient.NetMsgQueue.length;
                if (ed[0] == "mjhand" && ed.length == 2) {
                    jsclient.NetMsgQueue.push(["moveHead", {}]);
                }
                jsclient.NetMsgQueue.push(ed);
                if (oldLen == 0)    this.startQueueNetMsg();
            },

            cfgUpdate:function (changeValue)
            {
                if(changeValue && !changeValue.isShowed)
                    this.addChild(new TipsPanel(), 9);
            },
        },

        _keyboard:
        {
            onKeyPressed: function (key, event)
            {

            },

            onKeyReleased: function (key, event)
            {
                if (cc.sys.OS_WINDOWS != cc.sys.os)
                    return;

                if (key == 82)
                    jsclient.restartGame();
                if (key == 73 && jsclient.homeui)
                    jsclient.changeIdLayer();
                if (key == 86 && jsclient.homeui)
                    jsclient.exportDataLayer();

                cc.log("Key with keycode %d released", key);
            }
        },

    },

    startQueueNetMsg: function ()
    {
        var sce = this;
        if (jsclient.NetMsgQueue.length > 0)
        {
            var ed = jsclient.NetMsgQueue[0];
            var dh = jsclient.netCallBack[ed[0]];

            cc.log("handle " + ed[0]);
            var handleData = dh[1](ed[1]);
            sce.runAction(cc.sequence(
                cc.delayTime(0.0001),
                cc.callFunc(function ()
                {
                    cc.log("uievent " + ed[0]);
                    if (handleData != -1)
                        sendEvent(ed[0], ed[1]);
                    cc.log("netdelay " + dh[0]);
                }),
                cc.delayTime(dh[0]),
                cc.callFunc(function ()
                {
                    jsclient.NetMsgQueue.splice(0, 1);
                    if (jsclient.NetMsgQueue.length > 0)
                        sce.startQueueNetMsg();
                })));
        }
    },

    onEnter: function () {
        this._super();
        setEffectsVolume(-1);
        setMusicVolume(-1);
        ConnectUI2Logic(this, this.jsBind);
        this.addChild(new UpdateLayer());
        this.addChild(new BlockLayer());

        // this.addChild(new EndAllLayer());

        //确保这张图不会被释放掉
        var majiang = new cc.Sprite("res/MaJiangNew/z_mj.png");
        majiang.retain();

    }
});