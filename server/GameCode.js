module.exports = function (app, server, gameid, Player, Table, TableGroup, TableManager, Game) {
    var gameLog = [];

    var fs=require('fs');
    var os = require('os');
    var existCheck={};

    var serverID=null;
    var publicIp=null;

    var serverId_index01 = app.serverId.lastIndexOf("pkroom");
    serverID = app.serverId.substring((serverId_index01+6), app.serverId.length);
    if(serverID.length<2) {serverID="00";}
    else  {serverID = serverID.substring(0,2);}
    console.error('-----------------'+serverID);
    publicIp=serverID;

    function getPublicIp()
    {
        return publicIp;
        if(!publicIp)
        {
            var ifaces = os.networkInterfaces();
            for(var iname in ifaces)
            {
                var net=ifaces[iname];
                for(var i=0;i<net.length;i++)
                {
                    var ni=net[i];
                    if(net[i].family=="IPv4")
                    {
                        var ip=net[i].address;
                        if (ip.indexOf('127.') == 0 ||ip.indexOf('10.') == 0 ||    ip.indexOf('172.') == 0 ||   ip.indexOf('192.') == 0)
                        {

                        }
                        else
                        {
                            publicIp=ip;
                            break;
                        }
                    }
                }
                if(publicIp) break;
            }
        }
        if(publicIp==null) publicIp="192.168.1.113";
        return publicIp;
    }

    function GLog(log) {
        // if(getPublicIp() != "114.55.255.22")
        return;
        app.FileWork(gameLog, __dirname + "/log.txt", log)
    }

    var http= require("http");
    var freeGameTypes = [];
    var freeGameHandle = null;
    function getGamefreeData()
    {
        if(!freeGameHandle)
        {
            freeGameHandle = setInterval(function () {
                //if(app.serverId.indexOf("pkroom") != -1)
                //{
                http.get("http://sources4.happyplaygame.net/gdmj/gamefree.json", function(res) {
                    var resData = "";
                    res.on("data",function(data){
                        resData += data;
                    });
                    res.on("end", function() {
                        if(resData != "" && resData.length >= 40)
                        {
                           // GLog("服务器当前时间:" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                            var FreeActivityData = JSON.parse(resData);
                            if(FreeActivityData)
                            {
                                // var length = 0;
                                //freeGameTypes.length = 0;
                                freeGameTypes.splice(0,freeGameTypes.length);

                                // freeGameTypes = [];
                                for(var item in   FreeActivityData)
                                {
                                    var gameStartTime = new Date(FreeActivityData[item + ""].gameStartTime + "").getTime();
                                    var gameEndTime = new Date(FreeActivityData[item + ""].gameEndTime + "").getTime();
                                    var serverNowTime = new Date().getTime();
                                    //GLog("服务器当前时间:" + new Date().Format("yyyy-MM-dd hh:mm:ss"));
                                    if(gameStartTime && gameEndTime && gameStartTime <= serverNowTime  && gameEndTime >= serverNowTime )
                                    {
                                        for(var i=0;i<FreeActivityData[item + ""].gameType.length; i++)
                                        {
                                            freeGameTypes.push(FreeActivityData[item + ""].gameType[i]);
                                        }

                                    }
                                    // length ++;
                                }
                            }
                        }
                        else
                        {
                            GLog("获取不到数据！！！");
                        }
                    });
                })
                //}
            }, 1000 * 60 * 5 );// * 5
        }
    }

    getGamefreeData();



    console.error(app.serverId + " reload game code " + gameid);
    var logid = Date.now();
    delete require.cache[require.resolve("./majiang.js")];
    var majiang = require("./majiang.js");
    var GamesType = {
        GANG_DONG: 1,//广东麻将
        HUI_ZHOU: 2,//惠州麻将
        SHEN_ZHEN: 3,//香港麻将
        JI_PING_HU:4,//（鸡平胡)
        DONG_GUAN:5,//东莞麻将
        YI_BAI_ZHANG:6,//清远100张
        HE_YUAN_BAI_DA:7,//河源百搭
        CHAO_ZHOU:8,//潮州麻将
        XIANG_GANG:9,//深圳麻将
        ZUO_PAI_TUI_DAO_HU:10,//做牌推倒胡
    }

    var TableState = {
        waitJoin: 1,
        waitReady: 2,
        waitPut: 3,
        waitEat: 4,
        waitCard: 5,
        roundFinish: 6,
        isReady: 7
    }
    var WinType =
    {
        eatPut: 1,     //普通出牌点炮 
        eatGangPut: 2, //开杠打牌点炮
        eatGang: 3,    //抢杠
        pickNormal: 4, //普通自摸
        pickGang1: 5,  //吃牌开明杠后补牌自摸(点杠者包3家)
        pickGang23: 6,  //摸牌开杠补牌自摸
    }

    function GetHuType(td, pl, cd) {
        var huType = 0;
        if(td.twogui && td.nextgui != 0) huType = majiang.canHu(!td.canHu7, pl.mjhand, cd, td.canHuWith258, td.withZhong,td.withBai,td.fanGui,td.gui,td.gui4Hu,td.nextgui);
        else huType = majiang.canHu(!td.canHu7, pl.mjhand, cd, td.canHuWith258, td.withZhong,td.withBai,td.fanGui,td.gui,td.gui4Hu);
        pl.huType = huType;
        return huType;
    }

    function GetShenZhenEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) eatFlag += 8;
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui || tData.withBai) horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetXiangGangEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) eatFlag += 8;
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui || tData.withBai) horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetHuiZhouEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        var leftCard = 0, eatFlag = 0, horse = tData.horse;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        leftCard = tData.cardsNum - tData.cardNext;
        leftCard += 8;
        var isJiHu = 0;
        var huType = GetHuType(tData, pl, cd);
        if (huType > 0) isJiHu = majiang.prejudgeHuType(pl, cd);
        if (!pl.skipHu && huType > 0 && (isJiHu > 0 || huType == 7) || (tData.canEatHu || (tData.putType == 4 && (isJiHu > 0 || huType == 7)) ) ) eatFlag += 8;
        if (tData.withZhong || tData.fanGui || tData.withBai) horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd)) eatFlag += 4;
        if ((leftCard >= horse) && majiang.canPeng(pl.mjhand, cd) /*&& (pl.skipPeng.length == 0 || pl.skipPeng.length != 0 && pl.skipPeng.indexOf(cd) == -1)*/) eatFlag += 2;
        if ((leftCard > horse) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetGuangDongEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) eatFlag += 8;
        var horse = tData.horse;
        if ((tData.withZhong || tData.fanGui || tData.withBai) && !tData.baozhama && horse >= 2) horse = horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self && tData.uids[i] >0 && self.players[tData.uids[i]] && self.players[tData.uids[i]].linkHu == 0) continue;
                if(self && tData.uids[i] >0 && self.players[tData.uids[i]] && self.players[tData.uids[i]].linkHu > 0) horse += (self.players[tData.uids[i]].linkHu)*2;
            }

        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetDongGuanEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0)  eatFlag += 8;
        var horse = tData.horse;
        if ((tData.withZhong || tData.fanGui || tData.withBai) && tData.guiJiaMa) horse = horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd) /*&& (pl.skipPeng.length == 0 || pl.skipPeng.length != 0 && pl.skipPeng.indexOf(cd) == -1)*/)       eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetJiPingHuEatFlag(pl,tData,self){
        GLog("GetJiPingHuEatFlag");
        var cd = tData.lastPut;
        var leftCard = 0, eatFlag = 0;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        leftCard = tData.cardsNum - tData.cardNext;

        var canHuForJiPingHu = false;
        var jiPingHuType = -1;
        if(GetHuType(tData, pl, cd) > 0)
        {
            jiPingHuType = majiang.prejudgeHuTypeForJiPingHu(pl, cd);
            switch (tData.fanNum) {
                case 0:
                    canHuForJiPingHu = true;
                    break;
                case 1:
                {
                    // 非鸡胡 或 人胡 或 三元牌大于等于1个刻字 或 风圈局的刻子 或 本盘门风的刻子
                    if (jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU || (tData.cardNext == 53 && tData.curPlayer == tData.zhuang) || majiang.getSanYuanPaiKeZiNum(pl) >= 1 || (majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl))) {
                        GLog("-----------------------非鸡胡 或 人胡 或 三元牌1个刻字 或 风圈局的刻子 或 本盘门风的刻子");
                        canHuForJiPingHu = true;
                    }
                    //鸡胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 )
                    if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 1 || majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl)  )) {
                        GLog("------------鸡胡 且 (三元牌刻字数1 或 本门风位刻字数 或 风圈局的刻子 )");
                        canHuForJiPingHu = true;
                    }
                }
                    break;
                case 3:
                {
                    //人胡 或 三元牌刻字数大于等于3 或 非(鸡胡、平胡、碰碰胡、混一色)
                    if ((tData.cardNext == 53 && tData.curPlayer == tData.zhuang) || majiang.getSanYuanPaiKeZiNum(pl) >= 3 ||
                        (jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.HUNYISE )
                    ) {
                        canHuForJiPingHu = true;
                        if ((tData.cardNext == 53 && tData.curPlayer == tData.zhuang))
                            GLog("1. -----------------------------------人胡");
                        if (majiang.getSanYuanPaiKeZiNum(pl) >= 3)
                            GLog("1. -----------------------------------三元牌刻字数大于等于3");
                        if ((jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.HUNYISE ))
                            GLog("1. -----------------------------------非(鸡胡、平胡、碰碰胡、混一色)");
                    }
                    else {
                        //鸡胡 且 三元牌刻字数大于等于3 或
                        //鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）或
                        //鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）
                        if (
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) >= 3 ||
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) == 2 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) ) ||
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) )
                        ) {
                            canHuForJiPingHu = true;
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) >= 3)
                                GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数大于等于3");
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) == 2 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) ))
                                GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）");
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) ))
                                GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）");
                        }
                        //平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))或
                        //平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）或
                        //平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）
                        if (
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 2 || ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) )) ||
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) ) ||
                            jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl))
                        ) {
                            canHuForJiPingHu = true;
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 2 || ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) )))
                                GLog(" -----------------------------------平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))");
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) ))
                                GLog(" -----------------------------------平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）");
                            if (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl)))
                                GLog(" -----------------------------------平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）");

                        }
                        //（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) ) 或
                        // (碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）
                        if (
                            (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && ( majiang.getSanYuanPaiKeZiNum(pl) >= 1 || ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) )) ||
                            (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl))
                        ) {
                            canHuForJiPingHu = true;
                            if ((jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && ( majiang.getSanYuanPaiKeZiNum(pl) >= 1 || ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl) )))
                                GLog(" -----------------------------------（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) )");
                            if ((jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pl)))
                                GLog(" -----------------------------------(碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）");

                        }

                    }
                }
                    break;
            }
        }

        if (!pl.skipHu && GetHuType(tData, pl, cd) > 0 && canHuForJiPingHu) {
            eatFlag += 8;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可胡");
        }

        if (leftCard > 0 && majiang.canGang0(pl.mjhand, cd)) {
            eatFlag += 4;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可明杠");
        }
        if ((leftCard >= 0) && majiang.canPeng(pl.mjhand, cd)) {
            eatFlag += 2;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可碰");
        }
        if ((leftCard > 0) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) {
            eatFlag += 1;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可吃");
        }
        GLog("总的 eatFlag=====" + eatFlag);
        GLog("");
        GLog("");
        return eatFlag;
    }

    function GetChaoZhouEatFlag(pl,tData,self){
        var cd = tData.lastPut;
        var leftCard = 0, eatFlag = 0;
       // var leftCard = self.tData.cardsNum;
        leftCard = tData.cardsNum - tData.cardNext;
        if(!pl.skipHu)
        {
            var huTypeLevel = GetHuType(tData, pl, cd);
            var tt = 0;
            if(huTypeLevel > 0){
                var orignPl = {};
                orignPl.mjhand = pl.mjhand;
                orignPl.mjpeng = pl.mjpeng;
                orignPl.mjgang0 = pl.mjgang0;
                orignPl.mjgang1 = pl.mjgang1;
                orignPl.mjchi = pl.mjchi;
                orignPl.huType = pl.huType;
                var nowPl = majiang.deepCopy(orignPl);
                nowPl.mjhand.push(cd);
                tt = majiang.getHuTypeForChaoShan(nowPl);
            }
            if(huTypeLevel> 0 && (tData.canDianPao  || tt >= majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN)) eatFlag += 8;
        }
        var horse = tData.horse;
        // if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd)) eatFlag += 4;
        if ((leftCard >= 0) && majiang.canPeng(pl.mjhand, cd))  eatFlag += 2;
        if ((leftCard > 0) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) {
            eatFlag += 1;
        }
        return eatFlag;
    }

    function GetYiBaiZhangEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext - 36;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext - 36;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext -36;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext -36;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext -36;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) {
            eatFlag += 8;
        }
        var horse = tData.horse;
        if ((tData.withZhong || tData.fanGui || tData.withBai) && tData.guiJiaMa) horse = horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetHeYuanBaiDaEatFlag(pl,tData,self)
    {
        var cd = tData.lastPut;
       // var leftCard = self.tData.cardsNum;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        var horse = tData.horse;
        if ((tData.withZhong || tData.fanGui || tData.withBai) && tData.guiJiaMa) horse = horse + 2;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0)  eatFlag += 8;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 0) && majiang.canPeng(pl.mjhand, cd)) eatFlag += 2;
        return eatFlag;
    }

    function GetZuoPaiTuiDaoHuEatFlag(pl, tData,self) {
        var cd = tData.lastPut;
        //var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        //if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        //if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        //if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        var leftCard = tData.cardsNum - tData.cardNext;
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) eatFlag += 8;
        var horse = tData.horse;
        if ((tData.withZhong || tData.fanGui || tData.withBai) && !tData.baozhama && horse >= 2) horse = horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self && tData.uids[i] >0 && self.players[tData.uids[i]] && self.players[tData.uids[i]].linkHu == 0) continue;
                if(self && tData.uids[i] >0 && self.players[tData.uids[i]] && self.players[tData.uids[i]].linkHu > 0) horse += (self.players[tData.uids[i]].linkHu)*2;
            }

        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        return eatFlag;
    }

    function GetEatFlag(pl, tData,self) {
        var eatFlag = 0;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                eatFlag = GetGuangDongEatFlag(pl, tData,self);
                break;
            case GamesType.HUI_ZHOU:
                eatFlag = GetHuiZhouEatFlag(pl, tData,self);
                break;
            case GamesType.SHEN_ZHEN:
                eatFlag = GetShenZhenEatFlag(pl, tData,self);
                break;
            case GamesType.JI_PING_HU:
                eatFlag = GetJiPingHuEatFlag(pl, tData,self);
                break;
            case GamesType.DONG_GUAN:
                eatFlag = GetDongGuanEatFlag(pl,tData,self);
                break;
            case GamesType.YI_BAI_ZHANG:
                eatFlag = GetYiBaiZhangEatFlag(pl,tData,self);
                break;
            case GamesType.CHAO_ZHOU:
                eatFlag = GetChaoZhouEatFlag(pl,tData,self);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                eatFlag = GetHeYuanBaiDaEatFlag(pl,tData,self);
                break;
            case GamesType.XIANG_GANG:
                eatFlag = GetXiangGangEatFlag(pl, tData,self);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                eatFlag = GetZuoPaiTuiDaoHuEatFlag(pl, tData,self);
                break;
        }
        return eatFlag;
    }

    // 接入新的语音代码
    Table.prototype.StartVoice = function(pl,msg,session,next)
    {
        next(null,null);
        this.NotifyAll('MJStartVoice', msg);
    };

    Table.prototype.StopVoice = function(pl,msg,session,next)
    {
        next(null,null);
        this.NotifyAll('MJStopVoice', msg);
    };

    Table.prototype.initTable = function () {
        var table = this;
        var rcfg = this.roomCfg();
        table.uid2did = {};
        //服务器私有
        table.cards = [];
        //回放记录
        table.mjlog = [];
        table.heartbeatTime = {}; // 心跳包计时器
        //公开
        table.tData = {
            canBigWin:false,//能否大胡
            cardsNum :0,//牌总数
            tState: TableState.waitJoin,
            initCoin: 1000,   //积分显示
            fanGui:false,     //翻鬼
            gui:0,            //默认鬼牌为0
            nextgui:0,        //默认第二个鬼0
            roundNum: -1,
            roundAll: 0,
            uids: [],
            owner: -1,         //uid
            cardNext: 0,
            winner: -1,        //0-3
            curPlayer: -1,     //0-3
            zhuang: -1,        //0-3
            lastPutPlayer: -1, //0-3上次出牌玩家
            putType: 0,        //0 普通出牌  1 2 3开杠的牌  4开杠后打出的牌 
            lastPut: -1,       //上次出的牌
            tableid: this.tableid,
            canEatHu: false,
            delEnd: 0,       //
            firstDel: 0,       //
            gameType: GamesType.GANG_DONG,
            jiejieGao: false,
            fanNum:0, //0 翻起胡 1翻起胡 3翻起胡
            jiPingHuCircleWind:{curCircleWind:0, allZhuangPlayer: []},// 0东圈 1南圈 2西圈 3北圈 所有做过庄的玩家
            maxPlayer:4,//默认为4人房
            zhongIsMa:false,//红中算法 （选择红中癞子的时候 这个变量必须为false 它会以花牌的形式打出去）
            canFan7 : false,//7对翻倍 （7对选项若为选中 该选项必为false）
            coinRoomCreate:false,//金币场
            guiJiaBei:false, //有鬼情况下胡牌时 手牌没鬼加倍
            guiJiaMa:false,//有鬼情况下胡牌时 手牌没鬼加马
            gui4Hu:false,//鬼牌模式 下有4鬼即可胡牌
            gui4huBeiNum:1,//有鬼情况下 拿到4鬼胡牌所番的倍数 默认为1
            baozhama:false,//推倒胡 爆炸马
            noCanJiHu:false,//惠州不可鸡胡选项 false:表示可以鸡胡 true:表示不可以鸡胡
            maGenDi:false,//惠州马跟底分
            menQingJiaFen:false,//惠州门清加分
            maGenDiDuiDuiHu:false,//惠州门清对对胡 马跟底的的大选项中，新增小选项 对对胡：即跟底分最多跟到对对胡，如胡牌底分大于对对胡，跟的分数也按照对对胡算
            twogui:false,//双鬼
            baidadahu:false,//百搭大胡
            baidajihu:false,//百搭鸡胡
            canQiangGang:true,//可以抢杠胡
            canJiHu:false,//河源百搭 百搭大胡中的一个选项 是否可鸡胡
            haiDiFanBei:false,//潮汕麻将 海底翻倍
            canDianPao:false,//潮汕麻将 可点炮选项
            checkRoleFlowerType:0,//惠州 0 检测玩家的花牌   检测一个玩家 累加1  到4 检测完毕
            genZhuang:false,//跟庄
            duoHuaHuPai:false,//惠州多花胡牌 7个或8个直接胡
            withBai:false,//白鬼
        };
        majiang.init(this);
    }
    //断线重连
    Table.prototype.Disconnect = function (pl, msg) {
        GLog("Table.prototype.Disconnect");
        this.heartbeatTime[pl.uid] = 0
        pl.onLine = false;
        this.channel.leave(pl.uid, pl.fid);
        pl.fid = null;
        this.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: false, mjState: pl.mjState});
    }
    Table.prototype.Reconnect = function (pl, plData, msg, sinfo) {
        GLog("Table.prototype.Reconnect");
        majiang.init(this);
        this.heartbeatTime[pl.uid] = Date.now();
        pl.onLine = true;
        var tData = this.tData;
        this.channel.leave(pl.uid, pl.fid);
        pl.sid = sinfo.sid;
        pl.fid = sinfo.fid;
        pl.did = sinfo.did;
        if (pl.mjState == TableState.roundFinish) pl.mjState = TableState.isReady;
        this.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
        this.channel.add(pl.uid, pl.fid);
        pl.notify("initSceneData", this.initSceneData(pl));
        this.startGame();
        if(tData.gameType == 2 && tData.checkRoleFlowerType<tData.maxPlayer)
        {
            this.NotifyAll('MJFlower1', {curPlayer: tData.curPlayer, card: -2,checkRoleFlowerType:tData.checkRoleFlowerType});
        }
    }
    Table.prototype.CanAddPlayer = function (pl) {
        var uids = this.tData.uids;
        if (this.tData.roundNum > -2) {
            if (uids.indexOf(pl.uid) < 0) {
                if (uids.length == this.tData.maxPlayer && uids.indexOf(0) < 0) return false;
                return true;
            }
            else return true;
        }
        return false;

    }
    Table.prototype.CanLeaveGame = function (pl) {
        var tData = this.tData;
        if ((tData.tState == TableState.waitJoin && pl.uid != tData.owner) || tData.roundNum == -2) {
            return true;
        }
        return false;
    }
    function isUndefined(obj) {
        return obj === void 0;
    }

    Table.prototype.HeartBeat=function(pl,msg,session,next) {
        var time_delay = {};
        var table = this;
        this.heartbeatTime[pl.uid] = Date.now();
        this.AllPlayerRun(function(p){
            time_delay[p.uid] = ( (table.heartbeatTime[p.uid] <= 0) ? -1 : (Date.now() - table.heartbeatTime[p.uid]) );
        });

        next(null, time_delay);
    }

    function initAddPlayerForShenZhen(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;
        pl.linkZhuang = 1; //连庄次数
        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.baojiu = {num: 0, putCardPlayer: []};
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.jiejieGao = self.createPara.jiejieGao;
            tData.fanGui = self.createPara.fanGui;
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.gui4Hu = true;
            tData.guiJiaMa = true;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.maGenDiDuiDuiHu = isUndefined(self.createPara.maGenDiDuiDuiHu) ? false : self.createPara.maGenDiDuiDuiHu;

            //暂时写死
            //tData.maGenDi = true;
            //规避前端错误
            if(tData.maGenDiDuiDuiHu) tData.maGenDi = true;
            if(!tData.maGenDi) tData.maGenDiDuiDuiHu = false;
            if(!tData.guiJiaMa && !tData.guiJiaBei) tData.guiJiaMa = true;

            //深圳 无双鬼
            tData.twogui = false;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("节节高:" + tData.jiejieGao);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("无鬼加马:" + tData.guiJiaMa);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("马跟底对对胡：" + tData.maGenDiDuiDuiHu);
            GLog("白板癞子:" + tData.withBai);

        }
        if (tData.owner == -1) tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForGuangDong(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.linkZhuang = 1; //连庄次数
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
        pl.haiDiHu = false;//海底胡
        pl.gangBao = false;//杠爆
        pl.mjzhong= []; //获得红中
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            //广州去掉7对加翻
            tData.canFan7 = false;
            if(tData.canFan7) tData.canHu7 = true;
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.jiejieGao = isUndefined(self.createPara.jiejieGao) ? false : self.createPara.jiejieGao;
            tData.gui4Hu = true;
            //有鬼情况下胡牌时 手牌没鬼加马
            tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;
            tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            tData.baozhama = isUndefined(self.createPara.baozhama) ? false : self.createPara.baozhama;
            tData.twogui = isUndefined(self.createPara.twogui) ? false : self.createPara.twogui;
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            if(tData.jiejieGao) tData.baozhama = false;
            if(tData.baozhama) tData.jiejieGao = false;
            //tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.huangZhuangSuanGang = isUndefined(self.createPara.huangZhuangSuanGang) ? false : self.createPara.huangZhuangSuanGang;//荒庄算杠
            tData.genZhuang = isUndefined(self.createPara.genZhuang) ? false : self.createPara.genZhuang;//跟庄
            tData.gangBaoQuanBao = isUndefined(self.createPara.gangBaoQuanBao) ? false : self.createPara.gangBaoQuanBao;//杠爆全包
            tData.gangBaoFanNum = isUndefined(self.createPara.gangBaoFanNum) ? 0 : self.createPara.gangBaoFanNum;//杠爆翻倍
            tData.haiDiHuFanNum = isUndefined(self.createPara.haiDiHuFanNum) ? 0 : self.createPara.haiDiHuFanNum;//海底胡翻倍
            tData.zhongIsMa = isUndefined(self.createPara.zhongIsMa) ? false : self.createPara.zhongIsMa;//红中算马

            if(tData.withZhong) tData.zhongIsMa = false;
            if(tData.zhongIsMa) tData.withZhong = false;
            //广州麻将取消马跟底功能
            tData.maGenDi = false;
            if(tData.jiejieGao && tData.baozhama)
            {
                tData.jiejieGao = true;
                tData.baozhama = false;
            }
            if(tData.baozhama) tData.horse = 1;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }
            //广州的无鬼加倍与加马可以同时选上
           // if(!tData.guiJiaMa && !tData.guiJiaBei) tData.guiJiaMa = true;
           // if(tData.guiJiaMa && tData.guiJiaBei) tData.guiJiaMa = true;

            if(tData.withBai)
            {
                tData.withZhong = false;
                tData.fanGui = false;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("白板癞子:" + tData.withBai);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("节节高:" + tData.jiejieGao);
            GLog("爆炸马:" + tData.baozhama);
            GLog("双鬼:" + tData.twogui);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("荒庄算杠：" + tData.huangZhuangSuanGang);
            GLog("跟庄:" + tData.genZhuang);
            GLog("杠爆全包:" + tData.gangBaoQuanBao);
            GLog("杠爆翻倍:" + tData.gangBaoFanNum);
            GLog("海底胡翻倍:" + tData.haiDiHuFanNum);
            GLog("红中算马：" + tData.zhongIsMa);

            if(tData.withZhong || tData.fanGui || tData.withBai)
            {
                if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
                if(tData.guiJiaBei) GLog("鬼牌模式下，手牌没鬼加倍");
                if(tData.gui4Hu)  {
                    GLog("鬼牌模式下，拿到4鬼可胡牌");
                }
                else GLog("鬼牌模式下，拿到4鬼不可胡牌");
            }

        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForDongGuan(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id

        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            tData.zhongIsMa = isUndefined(self.createPara.zhongIsMa) ? false : self.createPara.zhongIsMa;
            if(tData.withZhong) tData.zhongIsMa = false;
            if(tData.zhongIsMa) tData.withZhong = false;
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.canFan7) tData.canHu7 = true;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            //有鬼情况下胡牌时 手牌没鬼加倍
            tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            //有鬼情况下胡牌时 手牌没鬼加马
            tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;
            //有鬼模式下 拿到4鬼能否胡牌
            tData.gui4Hu = isUndefined(self.createPara.gui4Hu) ? false : self.createPara.gui4Hu;
            //有鬼情况下 拿到4鬼胡牌是否加倍
            tData.gui4huBeiNum = isUndefined(self.createPara.gui4huBeiNum) ? 1 :self.createPara.gui4huBeiNum;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.maGenDiDuiDuiHu = isUndefined(self.createPara.maGenDiDuiDuiHu) ? false : self.createPara.maGenDiDuiDuiHu;

            //暂时写死
            //tData.maGenDi = true;
            //规避前端误传参数带来数据错误的风险
            if(tData.maGenDiDuiDuiHu) tData.maGenDi = true;
            if(!tData.maGenDi) tData.maGenDiDuiDuiHu = false;
            //if(!tData.withZhong && !tData.fanGui) {
            //    tData.guiJiaBei = false;
            //    tData.guiJiaMa = false;
            //    tData.gui4Hu = false;
            //    tData.gui4huBeiNum = 1;
            //}
            //tData.guiJiaMa = true;
            if(tData.guiJiaBei) tData.guiJiaMa = false;
            if(tData.guiJiaMa) tData.guiJiaBei = false;
            if(!tData.gui4Hu) tData.gui4huBeiNum = 1;
            if(tData.guiJiaBei && tData.guiJiaMa)
            {
                tData.guiJiaMa = true;
                tData.guiJiaBei = false;
            }

            //东莞无双鬼
            tData.twogui = false;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("白板癞子:" + tData.withBai);
            GLog("红中算马:" + tData.zhongIsMa);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("马跟底对对胡：" + tData.maGenDiDuiDuiHu);
            if(tData.withZhong || tData.fanGui || tData.withBai)
            {
                if(tData.guiJiaBei)  GLog("鬼牌模式下，手牌没鬼加倍");
                if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
                if(tData.gui4Hu)  {
                    GLog("鬼牌模式下，拿到4鬼可胡牌");
                    GLog("鬼牌模式下，拿到4鬼胡牌时分数X"+tData.gui4huBeiNum);
                }
                else GLog("鬼牌模式下，拿到4鬼不可胡牌");
            }

        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForHuiZhou(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        pl.checkFlowerType = 0; //0 检测花牌  1 没有花牌了
        pl.sendNewCardNumForZhuang = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.mjflower_puting = []; //未正式打牌前 玩家需要打得花牌数组
        pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
        pl.duoHuaHuPai = false; //多花胡牌方式
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;//惠州麻将 2
            tData.horse = self.createPara.horse;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.gui4Hu = true;
            tData.noCanJiHu = isUndefined(self.createPara.noCanJiHu) ? false : self.createPara.noCanJiHu;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.menQingJiaFen = isUndefined(self.createPara.menQingJiaFen) ? false : self.createPara.menQingJiaFen;
            tData.maGenDiDuiDuiHu = isUndefined(self.createPara.maGenDiDuiDuiHu) ? false : self.createPara.maGenDiDuiDuiHu;
            tData.genZhuang = isUndefined(self.createPara.genZhuang) ? false:self.createPara.genZhuang;
            tData.duoHuaHuPai = isUndefined(self.createPara.duoHuaHuPai) ? false:self.createPara.duoHuaHuPai;
            //规避前端错误
            if(tData.maGenDiDuiDuiHu) tData.maGenDi = true;
            if(!tData.maGenDi) tData.maGenDiDuiDuiHu = false;

            //暂时写死 跟庄和多花胡牌
            tData.genZhuang = false;
            tData.duoHuaHuPai = false;

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("几人房：" + tData.maxPlayer);
            if(tData.noCanJiHu) GLog("不可以鸡胡");
            else GLog("可以鸡胡");
            GLog("马跟底分：" + tData.maGenDi);
            GLog("门清加分：" + tData.menQingJiaFen);
            GLog("马跟底对对胡：" + tData.maGenDiDuiDuiHu);
            GLog("跟庄:" + tData.genZhuang);
            GLog("多花胡牌："+tData.duoHuaHuPai);
        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForJiPingHu(pl, self, msg){
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.fengWei = 0;
        pl.baoZiMo = {putCardPlayer:[],isOk:false}; //包自摸 {使其12张落地的人,成立条件(如果这个人也让别的玩家成立12张落地 则此人不包自摸)}
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            //tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.canEatHu = false;
            tData.withWind = self.createPara.withWind; //是否可以带风
            //tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.canEat = true;
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = false;
            tData.withZhong = false;
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = 0;
            tData.fanNum = self.createPara.fanNum;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.gui4Hu = true;
            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("起胡番数："+tData.fanNum + "番起胡");
            GLog("几人房：" + tData.maxPlayer);
        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForYiBaiZhang(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id

        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.canBigWin = isUndefined(self.createPara.canBigWin) ? false : self.createPara.canBigWin;
            tData.canHu7 = false;//二期需求去掉了胡7对
            //有鬼情况下胡牌时 手牌没鬼加倍
            tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            //有鬼情况下胡牌时 手牌没鬼加马
            tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;
            //有鬼模式下 拿到4鬼能否胡牌
            tData.gui4Hu = isUndefined(self.createPara.gui4Hu) ? false : self.createPara.gui4Hu;
            //有鬼情况下 拿到4鬼胡牌是否加倍
            tData.gui4huBeiNum = isUndefined(self.createPara.gui4huBeiNum) ? 1 :self.createPara.gui4huBeiNum;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.maGenDiDuiDuiHu = isUndefined(self.createPara.maGenDiDuiDuiHu) ? false : self.createPara.maGenDiDuiDuiHu;

            //暂时写死
            //tData.maGenDi = true;
            //规避前端误传参数带来数据错误的风险
            if(tData.maGenDiDuiDuiHu) tData.maGenDi = true;
            if(!tData.maGenDi) tData.maGenDiDuiDuiHu = false;
            if(!tData.withZhong && !tData.fanGui) {
                tData.guiJiaBei = false;
                tData.guiJiaMa = false;
                tData.gui4Hu = false;
                tData.gui4huBeiNum = 1;
            }
            if(tData.guiJiaBei) tData.guiJiaMa = false;
            if(tData.guiJiaMa) tData.guiJiaBei = false;
            if(!tData.gui4Hu) tData.gui4huBeiNum = 1;
            if(tData.guiJiaBei && tData.guiJiaMa)
            {
                tData.guiJiaMa = true;
                tData.guiJiaBei = false;
            }
            //100张 无双鬼
            tData.twogui = false;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("能否大胡:" + tData.canBigWin);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("马跟底对对胡：" + tData.maGenDiDuiDuiHu);
            GLog("白板癞子:" + tData.withBai);
            if(tData.withZhong || tData.fanGui || tData.withBai)
            {
                if(tData.guiJiaBei)  GLog("鬼牌模式下，手牌没鬼加倍");
                if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
                if(tData.gui4Hu)  {
                    GLog("鬼牌模式下，拿到4鬼可胡牌");
                    GLog("鬼牌模式下，拿到4鬼胡牌时分数X"+tData.gui4huBeiNum);
                }
                else GLog("鬼牌模式下，拿到4鬼不可胡牌");
            }


        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForChaoZhou(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        pl.picknum = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.gangBao = false; //杠爆
        pl.haiDiHu = false;//海底胡
        pl.collectCanTingTwentyPlayers = []; //胡牌时 收集其他人正听牌20分的人

        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            //tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            //tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            //tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            //tData.fanGui = self.createPara.fanGui;
            //tData.zhongIsMa = isUndefined(self.createPara.zhongIsMa) ? false : self.createPara.zhongIsMa;
            //if(tData.withZhong) tData.zhongIsMa = false;
            //if(tData.zhongIsMa) tData.withZhong = false;
            //tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            //if(tData.canFan7) tData.canHu7 = true;
            //if(tData.withZhong && tData.fanGui) {tData.withZhong = true;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            //有鬼情况下胡牌时 手牌没鬼加倍
            //tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            //有鬼情况下胡牌时 手牌没鬼加马
            //tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;
            //有鬼模式下 拿到4鬼能否胡牌
            //tData.gui4Hu = isUndefined(self.createPara.gui4Hu) ? false : self.createPara.gui4Hu;
            //有鬼情况下 拿到4鬼胡牌是否加倍
            //tData.gui4huBeiNum = isUndefined(self.createPara.gui4huBeiNum) ? 1 :self.createPara.gui4huBeiNum;
            //规避前端误传参数带来数据错误的风险
            //if(!tData.withZhong && !tData.fanGui) {
            //    tData.guiJiaBei = false;
            //    tData.guiJiaMa = false;
            //    tData.gui4Hu = false;
            //    tData.gui4huBeiNum = 1;
            //}
            //if(tData.guiJiaBei) tData.guiJiaMa = false;
            //if(tData.guiJiaMa) tData.guiJiaBei = false;
            //if(!tData.gui4Hu) tData.gui4huBeiNum = 1;
            //if(tData.guiJiaBei && tData.guiJiaMa)
            //{
            //    tData.guiJiaMa = true;
            //    tData.guiJiaBei = false;
            //}

            tData.haiDiFanBei = isUndefined(self.createPara.haiDiFanBei) ? false : self.createPara.haiDiFanBei;
            tData.canDianPao = isUndefined(self.createPara.canDianPao) ? false : self.createPara.canDianPao;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            //某些选项是必须写死的
            tData.withWind = true;
            tData.canHu7 = true;
            tData.fanGui = false;
            tData.twogui = false;

            //暂时写死
            //tData.gameType = 8;
            //tData.canDianPao = true;

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            // GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            // GLog("7对加番：" + tData.canFan7);
            // GLog("红中癞子:" + tData.withZhong);
            // GLog("红中算马:" + tData.zhongIsMa);
            //GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("海底翻倍：" + tData.haiDiFanBei);
            GLog("可点炮：" + tData.canDianPao);
            GLog("马跟底分：" + tData.maGenDi);
            //if(tData.withZhong || tData.fanGui)
            //{
            //    if(tData.guiJiaBei)  GLog("鬼牌模式下，手牌没鬼加倍");
            //    if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
            //    if(tData.gui4Hu)  {
            //        GLog("鬼牌模式下，拿到4鬼可胡牌");
            //        GLog("鬼牌模式下，拿到4鬼胡牌时分数X"+tData.gui4huBeiNum);
            //    }
            //    else GLog("鬼牌模式下，拿到4鬼不可胡牌");
            //}

        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForHeYuanBaiDa(pl,self,msg)
    {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        pl.danDiaoHua = false;
        pl.huaDiaoHua = false;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.type = 0;//单调花1 花调花2 都不是0
        pl.huType = -1;//胡的类型 最后根据这个来判断胡的牌型

        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.baidadahu = isUndefined(self.createPara.baidadahu) ? false : self.createPara.baidadahu; //百搭大胡
            tData.baidajihu = isUndefined(self.createPara.baidajihu) ? false : self.createPara.baidajihu; //百搭鸡胡
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.fanGui = true;
            tData.withWind = true;
            tData.withZhong = false;
            tData.canQiangGang = false;
            tData.canJiHu = isUndefined(self.createPara.canJiHu) ? false : self.createPara.canJiHu;

            //暂时写死
            //tData.canJiHu = true;
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.canFan7) tData.canHu7 = true;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            //有鬼情况下胡牌时 手牌没鬼加倍
            tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            //有鬼情况下胡牌时 手牌没鬼加马
            tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;

            if(tData.baidadahu)
            {
                tData.baidajihu = false;
                tData.canHu7 = false;
                tData.canFan7 = false;
            }
            if(tData.baidajihu)
            {
                tData.baidadahu = false;
                tData.canJiHu = true;
            }

            if(tData.baidadahu && tData.baidajihu)
            {
                tData.baidadahu = false;
                tData.baidajihu = true;
            }

            if(tData.guiJiaBei) tData.guiJiaMa = false;
            if(tData.guiJiaMa) tData.guiJiaBei = false;
            if(tData.guiJiaBei && tData.guiJiaMa)
            {
                tData.guiJiaMa = true;
                tData.guiJiaBei = false;
            }
            if(!tData.guiJiaMa && !tData.guiJiaBei) tData.guiJiaMa = true;

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("百搭鸡胡：" + tData.baidajihu);
            GLog("百搭大胡：" + tData.baidadahu);
            GLog("是否可以抢杠：" + tData.canQiangGang);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("可鸡胡：" + tData.canJiHu);

            if(tData.fanGui)
            {
                if(tData.guiJiaBei)  GLog("鬼牌模式下，手牌没鬼加倍");
                if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
            }

        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForXiangGang(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;
        pl.linkZhuang = 1; //连庄次数
        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.baojiu = {num: 0, putCardPlayer: []};
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.jiejieGao = self.createPara.jiejieGao;
            tData.fanGui = self.createPara.fanGui;
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.gui4Hu = true;
            tData.guiJiaMa = true;
            tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.maGenDiDuiDuiHu = isUndefined(self.createPara.maGenDiDuiDuiHu) ? false : self.createPara.maGenDiDuiDuiHu;

            //暂时写死
            //tData.maGenDi = true;
            //规避前端错误
            if(tData.maGenDiDuiDuiHu) tData.maGenDi = true;
            if(!tData.maGenDi) tData.maGenDiDuiDuiHu = false;
            if(!tData.guiJiaMa && !tData.guiJiaBei) tData.guiJiaMa = true;
            //香港 无双鬼
            tData.twogui = false;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("节节高:" + tData.jiejieGao);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("无鬼加马:" + tData.guiJiaMa);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("马跟底对对胡：" + tData.maGenDiDuiDuiHu);
            GLog("白板癞子:" + tData.withBai);

        }
        if (tData.owner == -1) tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    function initAddPlayerForZuoPaiTuiDaoHu(pl, self, msg) {
        //公开
        pl.winTotalNum = 0;//赢的总次数
        pl.mingGangTotalNum = 0;//明杠总次数
        pl.anGangTotalNum = 0;//暗杠总次数
        pl.zhongMaTotalNum = 0;//中马总个数
        pl.zhongMaNum = 0;//单次中马个数
        pl.winall = 0;   //累计赢
        pl.mjState = TableState.isReady;
        pl.linkZhuang = 1; //连庄次数
        pl.mjpeng = [];  //碰
        pl.mjgang0 = []; //明杠
        pl.mjgang1 = []; //暗杠
        pl.mjchi = [];   //吃
        //私有
        pl.mjhand = [];  //手牌
        pl.eatFlag = 0;  //胡8 杠4 碰2 吃1
        pl.delRoom = 0;
        pl.onLine = true;

        pl.mjMa = [];
        pl.left4Ma = [];
        pl.skipPeng = [];
        pl.skipHu = false;
        pl.baojiu = {num: 0, putCardPlayer: []};
        pl.linkHu = 0;
        self.uid2did[pl.uid] = pl.did;//记录数据服务器id
        pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
        pl.haiDiHu = false;//海底胡
        pl.gangBao = false;//杠爆
        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.startTime = new Date();
            tData.createRoomTime = tData.startTime.Format("yyyy-MM-dd hh:mm");
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            //不能7对加翻
            //tData.canFan7 = false;
            tData.qxdfbNum = isUndefined(self.createPara.qxdfbNum) ? 0 : self.createPara.qxdfbNum; //七小对 番4倍
            if(tData.qxdfbNum > 0)
            {
                tData.canHu7 = true;
                tData.canFan7 = false;
            }
            else
            {
                tData.canHu7 = false;
                tData.canFan7 = false;
            }
            if(tData.canFan7) tData.canHu7 = true;
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.jiejieGao = isUndefined(self.createPara.jiejieGao) ? false : self.createPara.jiejieGao;
            tData.gui4Hu = true;
            //有鬼情况下胡牌时 手牌没鬼加马
            tData.guiJiaMa = isUndefined(self.createPara.guiJiaMa) ? false : self.createPara.guiJiaMa;
            tData.guiJiaBei = isUndefined(self.createPara.guiJiaBei) ? false : self.createPara.guiJiaBei;
            tData.baozhama = isUndefined(self.createPara.baozhama) ? false : self.createPara.baozhama;
            tData.twogui = isUndefined(self.createPara.twogui) ? false : self.createPara.twogui;
            tData.withBai = isUndefined(self.createPara.withBai) ? false : self.createPara.withBai;//白板赖子
            if(tData.withZhong && tData.withBai && tData.fanGui) {tData.withZhong = true;tData.withBai = false;tData.fanGui = false;};
            if(tData.jiejieGao) tData.baozhama = false;
            if(tData.baozhama) tData.jiejieGao = false;
            //tData.maGenDi = isUndefined(self.createPara.maGenDi) ? false : self.createPara.maGenDi;
            tData.huangZhuangSuanGang = isUndefined(self.createPara.huangZhuangSuanGang) ? false : self.createPara.huangZhuangSuanGang;//荒庄算杠
            tData.genZhuang = isUndefined(self.createPara.genZhuang) ? false : self.createPara.genZhuang;//跟庄
            tData.gangBaoQuanBao = isUndefined(self.createPara.gangBaoQuanBao) ? false : self.createPara.gangBaoQuanBao;//杠爆全包
            tData.gangBaoFanNum = isUndefined(self.createPara.gangBaoFanNum) ? 0 : self.createPara.gangBaoFanNum;//杠爆翻倍
            tData.haiDiHuFanNum = isUndefined(self.createPara.haiDiHuFanNum) ? 0 : self.createPara.haiDiHuFanNum;//海底胡翻倍
            tData.yaoJiuFanNum =  isUndefined(self.createPara.yaoJiuFanNum) ? 0 : self.createPara.yaoJiuFanNum;//幺九翻6倍
            tData.ziYiSeFanNum = isUndefined(self.createPara.ziYiSeFanNum) ? 0 : self.createPara.ziYiSeFanNum;//字一色翻8倍
            tData.qingYiSeFanNum = isUndefined(self.createPara.qingYiSeFanNum) ? 0 : self.createPara.qingYiSeFanNum;//清一色翻4倍
            tData.pengPengHuFanNum = isUndefined(self.createPara.pengPengHuFanNum) ? 0 : self.createPara.pengPengHuFanNum;//碰碰胡翻2倍
            tData.shiSanYaoFanNum =  isUndefined(self.createPara.shiSanYaoFanNum) ? 0 : self.createPara.shiSanYaoFanNum;//十三幺翻8倍

            tData.maGenDi = false;
            if(tData.jiejieGao && tData.baozhama)
            {
                tData.jiejieGao = true;
                tData.baozhama = false;
            }
            if(tData.baozhama) tData.horse = 1;
            if(tData.twogui)
            {
                tData.withZhong = false;
                tData.withBai = false;
                tData.fanGui = true;
            }
            //if(!tData.guiJiaMa && !tData.guiJiaBei) tData.guiJiaMa = true;
            //if(tData.guiJiaMa && tData.guiJiaBei) tData.guiJiaMa = true;

            if(tData.withBai)
            {
                tData.withZhong = false;
                tData.fanGui = false;
            }

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("白板癞子:" + tData.withBai);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("节节高:" + tData.jiejieGao);
            GLog("爆炸马:" + tData.baozhama);
            GLog("双鬼:" + tData.twogui);
            GLog("马跟底分：" + tData.maGenDi);
            GLog("荒庄算杠：" + tData.huangZhuangSuanGang);
            GLog("跟庄:" + tData.genZhuang);
            GLog("杠爆全包:" + tData.gangBaoQuanBao);
            GLog("杠爆翻倍:" + tData.gangBaoFanNum);
            GLog("海底胡翻倍:" + tData.haiDiHuFanNum);
            GLog("幺九翻倍:" + tData.yaoJiuFanNum);
            GLog("字一色翻倍:" + tData.ziYiSeFanNum);
            GLog("清一色翻倍:" + tData.qingYiSeFanNum);
            GLog("碰碰胡翻倍:" + tData.pengPengHuFanNum);
            GLog("十三幺翻倍:" + tData.shiSanYaoFanNum);

            if(tData.withZhong || tData.fanGui || tData.withBai)
            {
                if(tData.guiJiaMa)  GLog("鬼牌模式下，手牌没鬼加马");
                if(tData.guiJiaBei) GLog("鬼牌模式下，手牌没鬼加倍");
                if(tData.gui4Hu)  {
                    GLog("鬼牌模式下，拿到4鬼可胡牌");
                }
                else GLog("鬼牌模式下，拿到4鬼不可胡牌");
            }

        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < tData.maxPlayer) uids.push(pl.uid);
            else {
                for (var i = 0; i < uids.length; i++)
                    if (uids[i] == 0) {
                        uids[i] = pl.uid;
                        break;
                    }
            }
        }
        self.NotifyAll('addPlayer', {
            player: {info: pl.info, onLine: true, mjState: pl.mjState, winall: pl.winall},
            tData: tData
        });
    }

    Table.prototype.initAddPlayer = function (pl, msg) {
        var tData = this.tData;
        if (tData.roundNum == -1) tData.gameType = this.createPara.gameType;
        //暂时写死
        // tData.gameType = 8;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                initAddPlayerForGuangDong(pl, this, msg);
                break;
            case GamesType.HUI_ZHOU:
                initAddPlayerForHuiZhou(pl, this, msg);
                break;
            case GamesType.SHEN_ZHEN:
                initAddPlayerForShenZhen(pl, this, msg);
                break;
            case GamesType.JI_PING_HU:
                initAddPlayerForJiPingHu(pl,this,msg);
                break;
            case GamesType.DONG_GUAN:
                initAddPlayerForDongGuan(pl,this,msg);
                break;
            case GamesType.YI_BAI_ZHANG:
                initAddPlayerForYiBaiZhang(pl, this, msg);
                break;
            case GamesType.CHAO_ZHOU:
                initAddPlayerForChaoZhou(pl, this, msg);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                initAddPlayerForHeYuanBaiDa(pl,this,msg);
                break;
            case GamesType.XIANG_GANG:
                initAddPlayerForXiangGang(pl, this, msg);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                initAddPlayerForZuoPaiTuiDaoHu(pl, this, msg);
                break;
        }
    }
    //客户端收到initSceneData  session中的pkroom还没有设定好
    Table.prototype.initSceneData = function (pl) {
        GLog("Table.prototype.initSceneData");
        //公共
        var msg = {
            players: this.collectPlayer(
                'info', 'mjState', 'mjpeng', 'mjgang0', 'mjgang1', 'mjchi', 'mjput', 'onLine', 'delRoom',
                'isNew', 'winall', 'mjMa', 'left4Ma', 'mjflower', 'skipPeng', 'baojiu', 'skipHu', 'linkZhuang','fengWei','mjzhong','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','genZhuang')
            , tData: this.tData
            , serverNow: Date.now()
        };
        //私有
        msg.players[pl.uid].mjhand = pl.mjhand;
        msg.players[pl.uid].mjpeng4 = pl.mjpeng4;
        msg.players[pl.uid].skipHu = pl.skipHu;
        return msg;
    }

    function DestroyTable(tb) {
        if (tb.PlayerCount() == 0 && tb.tData.roundNum == -2) {
            tb.tData.roundNum = -3;
            tb.Destroy();
        }
    }

    Table.prototype.cleanRemovePlayer = function (pl) {
        var tData = this.tData;
        if (tData.tState == TableState.waitJoin) {
            var idx = tData.uids.indexOf(pl.uid);
            if (idx >= 0) {
                tData.uids[idx] = 0;
                this.NotifyAll("removePlayer", {uid: pl.uid, tData: tData});
            }
        }
        DestroyTable(this);
    }

    function startGameForJiPingHu(self){
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                //if(self.tData.withBai)
                //{
                //    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                //}
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            var isLianZhuang = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;

            }
            else if (tData.winner == -1)//荒庄
            {
                //tData.zhuang = tData.curPlayer;
                tData.curPlayer = tData.zhuang;
                isLianZhuang = true;
            }
            else//有赢家
            {
                //tData.zhuang = tData.curPlayer = tData.winner;
                if(tData.winner == tData.zhuang)
                {
                    tData.curPlayer = tData.winner;
                    tData.zhuang = tData.curPlayer;
                    isLianZhuang = true;
                }
                else
                {
                    tData.curPlayer = (tData.zhuang + 1) % tData.maxPlayer;
                    tData.zhuang = tData.curPlayer;
                    isLianZhuang = false;
                }
            }

            if(tData.jiPingHuCircleWind.allZhuangPlayer.indexOf(tData.zhuang) < 0) tData.jiPingHuCircleWind.allZhuangPlayer.push(tData.zhuang);
            else{
                if(tData.jiPingHuCircleWind.allZhuangPlayer.length == tData.maxPlayer && !isLianZhuang)
                {
                    tData.jiPingHuCircleWind.allZhuangPlayer.length = 0;
                    tData.jiPingHuCircleWind.allZhuangPlayer = [];
                    tData.jiPingHuCircleWind.allZhuangPlayer.push(tData.zhuang);
                    tData.jiPingHuCircleWind.curCircleWind = (tData.jiPingHuCircleWind.curCircleWind + 1) % tData.maxPlayer;
                }
            }
            GLog("第"+ (tData.roundAll - tData.roundNum + 1) + "局  圈风为" + tData.jiPingHuCircleWind.curCircleWind );
            GLog("所有做过庄家的玩家个数为:"+tData.jiPingHuCircleWind.allZhuangPlayer.length);
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                if (!isFirst && pl.uid == tData.uids[tData.zhuang]) pl.linkZhuang += 1;
                if (!isFirst && pl.uid != tData.uids[tData.zhuang]) pl.linkZhuang = 1;
                if (isFirst) pl.linkZhuang = 1;
                GLog("查看此人连庄 uid：" + pl.uid + " 连庄次数：" + pl.linkZhuang);
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.fengWei = (tData.jiPingHuCircleWind.curCircleWind + i)%tData.maxPlayer;
                pl.baoZiMo = {putCardPlayer:[],isOk:false};
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                GLog("此人："+pl.uid + "风位是："+pl.fengWei);
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang','fengWei'), tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;

            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }

    }

    function startGameForShenZhen(self) {
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;
                for(var i = 0;i<tData.maxPlayer;i++)
                {
                    self.players[ tData.uids[i]].linkHu =0;
                }
            }
            else if (tData.winner == -1)//荒庄
            {
                if(tData.jiejieGao)
                {
                    if(tData.zhuang == tData.curPlayer)
                        self.players[tData.uids[ tData.zhuang]].linkZhuang ++;
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer;
                    }
                    self.players[ tData.uids[tData.curPlayer]].linkHu ++;
                }else
                {
                    tData.zhuang = tData.curPlayer;
                }
            }
            else//有赢家
            {
                if(tData.jiejieGao){
                    if(tData.zhuang == tData.winner)
                    {
                        self.players[ tData.uids[tData.zhuang]].linkZhuang ++;
                    }
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer = tData.winner;
                    }
                    self.players[ tData.uids[tData.winner]].linkHu ++;
                }else{
                    tData.zhuang = tData.curPlayer = tData.winner;
                }
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang','linkHu'), tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function startGameForDongGuan(self){
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
                if(tData.zhongIsMa && tData.gui == 71) {//翻鬼牌模式下且选中了红中做马 此时不可翻出的鬼牌是红中
                    majiang.gui = 21;
                    tData.gui = majiang.gui ;
                }
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            if (tData.zhuang == -1)//第一局
            {
                tData.zhuang = tData.curPlayer = 0;
            }
            else if (tData.winner == -1)//荒庄
            {
                tData.zhuang = tData.curPlayer;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.mjzhong= []; //获得红中
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer +tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function startGameForYiBaiZhang(self){
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGuiForYiBaiZhang();
                tData.gui = majiang.gui ;
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomYiBaiZhangCards(self.tData.withWind, self.tData.withZhong);
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomYiBaiZhangCardsBaiGui(self.tData.withWind, self.tData.withBai);
                }
                else
                {
                    self.cards = majiang.randomYiBaiZhangCards(self.tData.withWind, self.tData.withZhong);
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            if (tData.zhuang == -1)//第一局
            {
                tData.zhuang = tData.curPlayer = 0;
            }
            else if (tData.winner == -1)//荒庄
            {
                tData.zhuang = tData.curPlayer;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.mjzhong= []; //获得红中
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer +tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function getNextGui(gui,isLianXu)
    {
        var next = 0;
        next = gui + 1;
        if(gui % 10 == 9 && gui < 30 ) next = (gui + 2) - 10 ; //9条 9万 9筒
        if(gui > 30 && gui<100) next =  gui + 10;
        if(gui == 91) next = 31;
        return next;
    }

    function startGameForGuangDong(self)
    {
        var tData = self.tData;
        if (self.tData.roundNum > 0 && self.PlayerCount() == tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
                if(tData.zhongIsMa && tData.gui == 71) {//翻鬼牌模式下且选中了红中做马 此时不可翻出的鬼牌是红中
                    majiang.gui = 21;
                    tData.gui = majiang.gui ;
                }
                GLog("第一个鬼是:" + tData.gui );
                if(tData.twogui)
                {
                    //tData.nextgui = majiang.nextGui(tData.gui,true);
                    tData.nextgui = getNextGui(tData.gui,true);
                    GLog("第二个鬼是:" + tData.nextgui );
                }
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;
                self.players[ tData.uids[tData.zhuang]].linkHu =0;
            }
            else if (tData.winner == -1)//荒庄
            {
                if(tData.jiejieGao)
                {
                    if(tData.zhuang == tData.curPlayer)
                        self.players[tData.uids[ tData.zhuang]].linkZhuang ++;
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer;
                    }
                    self.players[ tData.uids[tData.curPlayer]].linkHu ++;
                }else
                {
                    tData.zhuang = tData.curPlayer;
                }
            }
            else//有赢家
            {
                if(tData.jiejieGao){
                    if(tData.zhuang == tData.winner)
                    {
                        self.players[ tData.uids[tData.zhuang]].linkZhuang ++;
                    }
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        //self.players[ tData.uids[tData.winner]].linkZhuang ++;
                        tData.zhuang = tData.curPlayer = tData.winner;
                    }
                    self.players[ tData.uids[tData.winner]].linkHu ++;
                }else{
                    tData.zhuang = tData.curPlayer = tData.winner;
                }
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
                pl.haiDiHu = false;
                pl.gangBao = false;
                pl.mjzhong= []; //获得红中
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
                //pl.notify("MJGenZhuang", {uid: pl.uid, genZhuang: pl.genZhuang});
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang','linkHu','genZhuang'), tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }

    }

    function startGameForHuiZhou(self){
        var tData = self.tData;
        if (self.tData.roundNum > 0 && self.PlayerCount() == tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            tData.checkRoleFlowerType = 0;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomHuiZhouCards(self.tData.withWind, self.tData.withZhong,self.tData.maxPlayer);
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;
            }
            else if (tData.winner == -1)//荒庄
            {
                tData.zhuang = tData.zhuang;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.sendNewCardNumForZhuang = 0;
                pl.checkFlowerType = 0; //0 检测花牌  1 没有花牌了
                pl.mjflower_puting = []; //玩家当前要打得花牌
                pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
                pl.duoHuaHuPai = false; //多花胡牌方式
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }
                for (var j = 0; j < 13; j++) {
                    var cardsNext = cards[tData.cardNext++];
                    pl.mjhand.push(cardsNext);
                    if(majiang.isFlower8(cardsNext)){
                        pl.mjflower_puting.push(cardsNext);
                    }
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
                //pl.notify("MJGenZhuang", {uid: pl.uid, genZhuang: pl.genZhuang});
            }

           // self.NotifyAll('getLinkZhuang', {tData: app.CopyPtys(tData)});
            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('genZhuang'), tData: app.CopyPtys(tData)});
           // self.NotifyAll('MJGenZhuang', {uid: pl.uid, genZhuang: pl.genZhuang});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
            self.NotifyAll('MJFlower1', {curPlayer: tData.curPlayer, card: -2,checkRoleFlowerType:tData.checkRoleFlowerType});
        }
    }

    function startGameForChaoZhou(self){
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            if (tData.zhuang == -1)//第一局
            {
                tData.zhuang = tData.curPlayer = 0;
            }
            else if (tData.winner == -1)//荒庄
            {
                tData.zhuang = tData.zhuang;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.mjzhong= []; //获得红中
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.gangBao = false;
                pl.haiDiHu = false;
                pl.collectCanTingTwentyPlayers = [];
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer +tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function startGameForHeYuanBaiDa(self)
    {
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                //majiang.gui = majiang.getRandomGuiForYiBaiZhang();
                //tData.gui = majiang.gui ;
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomHeYuanBaiDaCards(self.tData.withWind, self.tData.withZhong);
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            if (tData.zhuang == -1)//第一局
            {
                tData.zhuang = tData.curPlayer = 0;
            }
            else if (tData.winner == -1)//荒庄
            {
                tData.zhuang = tData.zhuang;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.mjzhong= []; //获得红中
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.type = 0;//单调花1 花调花2 都不是0
                pl.huType = -1;//胡的类型 最后根据这个来判断胡的牌型
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer +tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function startGameForXiangGang(self) {
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;
                for(var i = 0;i<tData.maxPlayer;i++)
                {
                    self.players[ tData.uids[i]].linkHu =0;
                }
            }
            else if (tData.winner == -1)//荒庄
            {
                if(tData.jiejieGao)
                {
                    if(tData.zhuang == tData.curPlayer)
                        self.players[tData.uids[ tData.zhuang]].linkZhuang ++;
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer;
                    }
                    self.players[ tData.uids[tData.curPlayer]].linkHu ++;
                }else
                {
                    tData.zhuang = tData.curPlayer;
                }
            }
            else//有赢家
            {
                if(tData.jiejieGao){
                    if(tData.zhuang == tData.winner)
                    {
                        self.players[ tData.uids[tData.zhuang]].linkZhuang ++;
                    }
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer = tData.winner;
                    }
                    self.players[ tData.uids[tData.winner]].linkHu ++;
                }else{
                    tData.zhuang = tData.curPlayer = tData.winner;
                }
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang','linkHu'), tData: app.CopyPtys(tData)});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    function startGameForZuoPaiTuiDaoHu(self)
    {
        var tData = self.tData;
        if (self.tData.roundNum > 0 && self.PlayerCount() == tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
                GLog("第一个鬼是:" + tData.gui );
                if(tData.twogui)
                {
                    //tData.nextgui = majiang.nextGui(tData.gui,true);
                    tData.nextgui = getNextGui(tData.gui,true);
                    GLog("第二个鬼是:" + tData.nextgui );
                }
            }
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                if(self.tData.withZhong)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                if(self.tData.withBai)
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withBai);//无花牌
                }
                else
                {
                    self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                }
                self.tData.cardsNum = self.cards.length;
            }
            var info = "";
            for (var i = 0; i < self.cards.length; i++) {

                info = info + self.cards[i] + ",";
            }
            GLog("cards :" + info);
            var isFirst = false;
            if (tData.zhuang == -1)//第一局
            {
                isFirst = true;
                tData.zhuang = tData.curPlayer = 0;
                self.players[ tData.uids[tData.zhuang]].linkHu =0;
            }
            else if (tData.winner == -1)//荒庄
            {
                if(tData.jiejieGao)
                {
                    if(tData.zhuang == tData.curPlayer)
                        self.players[tData.uids[ tData.zhuang]].linkZhuang ++;
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        tData.zhuang = tData.curPlayer;
                    }
                    self.players[ tData.uids[tData.curPlayer]].linkHu ++;
                }else
                {
                    tData.zhuang = tData.curPlayer;
                }
            }
            else//有赢家
            {
                if(tData.jiejieGao){
                    if(tData.zhuang == tData.winner)
                    {
                        self.players[ tData.uids[tData.zhuang]].linkZhuang ++;
                    }
                    else
                    {
                        self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
                        self.players[ tData.uids[tData.zhuang]].linkHu =0;
                        //self.players[ tData.uids[tData.winner]].linkZhuang ++;
                        tData.zhuang = tData.curPlayer = tData.winner;
                    }
                    self.players[ tData.uids[tData.winner]].linkHu ++;
                }else{
                    tData.zhuang = tData.curPlayer = tData.winner;
                }
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;
                pl.winone = 0;   //当前局赢多少
                pl.baseWin = 0;  //番数
                pl.mjpeng = [];  //碰
                pl.mjgang0 = []; //明杠
                pl.gang0uid = {};
                pl.mjgang1 = []; //暗杠
                pl.mjchi = [];   //吃
                pl.mjput = [];   //打出的牌
                pl.winType = 0;  //胡牌类型
                pl.isNew = false; //是否通过发牌获取的,不是碰 吃
                //私有
                pl.mjhand = [];  //手牌
                pl.mjdesc = [];
                pl.mjpeng4 = []; //碰的时候还有一张牌
                pl.picknum = 0;
                pl.mjflower = []; //获得的花牌
                pl.skipPeng = [];
                pl.mjMa = [];//个人马
                pl.baojiu = {num: 0, putCardPlayer: []};
                pl.skipHu = false;
                pl.genZhuang = {pai:0,paiNum:0,genZhuangNum:0};//记录庄家用来跟庄的牌 其他人跟这张牌的次数 以及跟庄成功的次数
                pl.haiDiHu = false;
                pl.gangBao = false;
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
                //pl.notify("MJGenZhuang", {uid: pl.uid, genZhuang: pl.genZhuang});
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang','linkHu','genZhuang'), tData: app.CopyPtys(tData)});
           // self.NotifyAll('MJGenZhuang', {uid: pl.uid, genZhuang: pl.genZhuang});
            var mjlog = self.mjlog;
            if (mjlog.length == 0) {
                mjlog.push("players", self.PlayerPtys(function (p) {
                    return {
                        info: {
                            uid: p.info.uid,
                            nickname: p.info.nickname,
                            headimgurl: p.info.headimgurl,
                            remoteIP: p.info.remoteIP
                        }
                    }

                }));//玩家
            }
            tData.putType = 0;
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }

    }

    Table.prototype.startGame = function () {
        var tData = this.tData;
        //tData.gameType = 8;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                startGameForGuangDong(this);
                break;
            case GamesType.HUI_ZHOU:
                startGameForHuiZhou(this);
                break;
            case GamesType.SHEN_ZHEN:
                startGameForShenZhen(this);
                break;
            case GamesType.JI_PING_HU:
                startGameForJiPingHu(this);
                break;
            case GamesType.DONG_GUAN:
                startGameForDongGuan(this);
                break;
            case GamesType.YI_BAI_ZHANG:
                startGameForYiBaiZhang(this);
                break;
            case GamesType.CHAO_ZHOU:
                startGameForChaoZhou(this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                startGameForHeYuanBaiDa(this);
                break;
            case GamesType.XIANG_GANG:
                startGameForXiangGang(this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                startGameForZuoPaiTuiDaoHu(this);
                break;
        }
        majiang.init(this);
    }

    function EndGameForShenZhen(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            horse += (pl.linkHu)*2;
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        else if(tData.withBai)
        {
            if(pl)
            {
                if (!majiang.isHuWithBaiBan(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            // pls[z].left4Ma.length = 0;
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;
                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0) {
                    var num2 = 0;
                    if ((tData.withZhong && pi.mjhand.indexOf(71) != -1) || (tData.withBai && pi.mjhand.indexOf(91) != -1) || (tData.fanGui && pi.mjhand.indexOf(tData.gui) != -1))
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var desc = "";
                            var huType = majiang.getHuTypeForShenZhenNew(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.SHEN_ZHEN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    pi.baseWin = 1;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    pi.baseWin = 2;
                                    baseWin = 4;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU:
                                    desc = "对对胡";
                                    pi.baseWin = 3;
                                    baseWin = 6;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.FENGYISE:
                                    desc = "风一色";
                                    pi.baseWin = 9;
                                    baseWin = 18;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    pi.baseWin = 13;
                                    baseWin = 26;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASANYUAN:
                                    desc = "大三元";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN:
                                    desc = "小三元";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASIXI:
                                    desc = "大四喜";
                                    pi.baseWin = 16;
                                    baseWin = 32;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI:
                                    desc = "小四喜";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU:
                                    desc = "混一色 对对胡";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DAGE:
                                    desc = "大哥";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                            }

                            if (num2 == 1 && huType != majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "七小对";
                                pi.baseWin = 4;
                                baseWin = 8;
                            }

                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 七小对";
                                pi.baseWin = 9;
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 七小对";
                                pi.baseWin = 6;
                                baseWin = 12;
                            }

                            if (num2 == 2 && huType !=majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "豪华七小对";
                                pi.baseWin = 8;
                                baseWin = 16;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE ) {
                                desc = "混一色 豪华七小对";
                                pi.baseWin = 10;
                                baseWin = 20;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 豪华七小对";
                                pi.baseWin = 13;
                                baseWin = 26;
                            }

                            pi.mjdesc.push(desc);

                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 6 ){
                                    baseWin = (baseWin )  + (6 ) * zhongMaNum
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    pi.baseWin = 1;
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) {//
                                    //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                                    if(pi.mjdesc.indexOf("杠上花") == -1) pi.mjdesc.push("杠上花");
                                }
                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }else
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var desc = "";
                            var huType = majiang.getHuTypeForShenZhen(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.SHEN_ZHEN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    pi.baseWin = 1;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    pi.baseWin = 2;
                                    baseWin = 4;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU:
                                    desc = "对对胡";
                                    pi.baseWin = 3;
                                    baseWin = 6;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.FENGYISE:
                                    desc = "风一色";
                                    pi.baseWin = 9;
                                    baseWin = 18;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    pi.baseWin = 13;
                                    baseWin = 26;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASANYUAN:
                                    desc = "大三元";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN:
                                    desc = "小三元";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASIXI:
                                    desc = "大四喜";
                                    pi.baseWin = 16;
                                    baseWin = 32;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI:
                                    desc = "小四喜";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU:
                                    desc = "混一色 对对胡";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DAGE:
                                    desc = "大哥";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                            }

                            if (num2 == 1) {
                                desc = "七小对";
                                pi.baseWin = 4;
                                baseWin = 8;
                            }

                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 七小对";
                                pi.baseWin = 9;
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 七小对";
                                pi.baseWin = 6;
                                baseWin = 12;
                            }

                            if (num2 == 2 && huType !=majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "豪华七小对";
                                pi.baseWin = 8;
                                baseWin = 16;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 豪华七小对";
                                pi.baseWin = 10;
                                baseWin = 20;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 豪华七小对";
                                pi.baseWin = 13;
                                baseWin = 26;
                            }

                            pi.mjdesc.push(desc);


                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 6 ){
                                    baseWin = (baseWin )  + (6 ) * zhongMaNum;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    pi.baseWin = 1;
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) {//
                                    //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                                    if(pi.mjdesc.indexOf("杠上花") == -1) pi.mjdesc.push("杠上花");
                                }

                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                }
            }
        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 3)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("深圳 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("深圳 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(3) != -1)//免费
                    //{
                    //    GLog("深圳 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("深圳 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("深圳 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    //function EndGameForHuiZhou(tb, pl, byEndRoom) {
    //    var tData = tb.tData;
    //    var pls = [];
    //    tb.AllPlayerRun(function (p) {
    //        p.mjState = TableState.roundFinish;
    //        pls.push(p);
    //    });
    //
    //    var horse = tData.horse;
    //    //不管胡不胡都给每位玩家 传送left4Ma
    //    for (var z = 0; z < pls.length; z++) {
    //        pls[z].left4Ma=[];
    //        for (var i = 0; i < horse; i++) {
    //            pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
    //        }
    //    }
    //
    //    //计算跟庄的分数 庄家输分 给其他玩家
    //    var zhuangPl = tb.players[tData.uids[tData.zhuang]];
    //    if(zhuangPl.genZhuang.genZhuangNum >= 1)
    //    {
    //        zhuangPl.winone -= (tData.maxPlayer - 1);
    //        for(var i = 0; i < pls.length; i++)
    //        {
    //            var otherPl = pls[i];
    //            if(otherPl.uid == zhuangPl.uid)
    //                continue;
    //            otherPl.winone += 1;
    //        }
    //        //zhuangPl.mjdesc.push("跟庄");
    //    }
    //
    //    //算杠
    //    for (var i = 0; i < pls.length; i++) {
    //        var pi = pls[i];
    //        pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
    //
    //        if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
    //        for (var g = 0; g < pi.mjgang0.length; g++) {
    //            var ganguid = pi.gang0uid[pi.mjgang0[g]];
    //            for (var j = 0; j < pls.length; j++) {
    //                if (j != i) {
    //                    var pj = pls[j];
    //                    if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
    //                    if (ganguid >= 0) {
    //                        pj.winone -= (tData.maxPlayer - 1);
    //                        pj.mjdesc.push("点杠");
    //                    }
    //                    else pj.winone -= 1;
    //
    //                }
    //            }
    //        }
    //        if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
    //        var gangWin = pi.mjgang1.length * 2;
    //        for (var j = 0; j < pls.length; j++) {
    //            if (j != i) {
    //                var pj = pls[j];
    //                pj.winone -= gangWin;
    //            }
    //        }
    //    }
    //    //没人胡 就黄庄
    //    if (!pl) {
    //        for (var i = 0; i < pls.length; i++) {
    //            var pi = pls[i];
    //            pi.winone = 0;
    //        }
    //    }
    //    if (pl) {
    //        tData.winner = tData.uids.indexOf(pl.uid);
    //        //算胡
    //        for (var i = 0; i < pls.length; i++) {
    //            var pi = pls[i];
    //            if (pi.winType > 0 || pi.duoHuaHuPai) {
    //                //0 鸡胡 1清一色 2杂色 3大哥  4杂碰 5十三幺 6碰碰胡 7杂幺九 8清幺九 9字一色 10 全幺九 (不含杠上花和抢杠胡)
    //                var desc = "";
    //                var huType = majiang.getHuType(pi);
    //                GLog("此人胡的类型是:"+huType + " 此人的uid="+pi.uid + "多花胡牌吗？"+ pi.duoHuaHuPai);
    //                var baseWin = 3;
    //                var qiXiaoDui = majiang.can_7_Hu(pi.mjhand, 0, false, false); // 9
    //                if (tData.canHu7 && qiXiaoDui) {
    //                    desc = "七小对";
    //                    baseWin = 9;
    //                }
    //                switch (huType) {
    //                    case majiang.HUI_ZHOU_HTYPE.JIHU:
    //                    {
    //                        //1.有7对 且不是7对 2.不是7对
    //                        if (tData.canHu7 && !qiXiaoDui) {
    //                            desc = "鸡胡";
    //                            baseWin = 3;
    //                        }
    //                        else if (!tData.canHu7) {
    //                            desc = "鸡胡";
    //                            baseWin = 3;
    //                        }
    //                    }
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.QINGYISE:
    //                    {
    //                        if (tData.canHu7 && qiXiaoDui) {
    //                            desc = "清一色,七小对";
    //                            baseWin = 15;
    //                        }
    //                        if (tData.canHu7 && !qiXiaoDui) {
    //                            desc = "清一色";
    //                            baseWin = 15;
    //                        }
    //                        else if (!tData.canHu7) {
    //                            desc = "清一色";
    //                            baseWin = 15;
    //                        }
    //
    //                    }
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.ZASE:
    //                    {
    //                        if (tData.canHu7 && qiXiaoDui) {
    //                            desc = "七小对,杂色";
    //                        }
    //                        if (tData.canHu7 && !qiXiaoDui) {
    //                            baseWin = 6;
    //                            desc = "杂色";
    //                        }
    //                        else if (!tData.canHu7) {
    //                            baseWin = 6;
    //                            desc = "杂色";
    //                        }
    //                    }
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.DAGE:
    //                        desc = "大哥";
    //                        baseWin = 24;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.ZAPENG:
    //                        desc = "杂碰";
    //                        baseWin = 15;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.SHISANYAO:
    //                        desc = "十三幺";
    //                        baseWin = 30;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.PENGPENGHU:
    //                    {
    //                        desc = "碰碰胡";
    //                        baseWin = 9;
    //                    }
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.ZAYAOJIU:
    //                        desc = "杂幺九";
    //                        baseWin = 15;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.QINGYAOJIU:
    //                        desc = "清幺九";
    //                        baseWin = 24;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.ZIYISE:
    //                        desc = "字一色";
    //                        baseWin = 30;
    //                        break;
    //                    case majiang.HUI_ZHOU_HTYPE.QUANYAOJIU:
    //                        desc = "全幺九";
    //                        baseWin = 30;
    //                }
    //
    //                var duoHuaHuPaiType = false;
    //                if (pi.duoHuaHuPai) {
    //                    if (pi.mjflower.length == 7) {
    //                        if (pi.winType <= 0) {
    //                            //GLog("这个人"+pi.uid +"胡的类型："+pi.winType);
    //                            desc = "七花胡牌";
    //                            baseWin = 2;
    //                            duoHuaHuPaiType = true;
    //                        }
    //                        else //鸡胡时 选择了不可鸡胡
    //                        {
    //                            if(huType == majiang.HUI_ZHOU_HTYPE.JIHU && tData.noCanJiHu)
    //                            {
    //                                desc = "七花胡牌";
    //                                baseWin = 2;
    //                                duoHuaHuPaiType = true;
    //                            }
    //                        }
    //                    } else {
    //                        if (huType != majiang.HUI_ZHOU_HTYPE.QINGYISE && huType != majiang.HUI_ZHOU_HTYPE.ZAYAOJIU && huType != majiang.HUI_ZHOU_HTYPE.HUNPENG && huType != majiang.HUI_ZHOU_HTYPE.DAGE && huType != majiang.HUI_ZHOU_HTYPE.QINGYAOJIU && huType != majiang.HUI_ZHOU_HTYPE.SHISANYAO && huType != majiang.HUI_ZHOU_HTYPE.ZIYISE && huType != majiang.HUI_ZHOU_HTYPE.QUANYAOJIU) {
    //                            desc = "八花胡牌";
    //                            baseWin = 15;
    //                            duoHuaHuPaiType = true;
    //                        }
    //                    }
    //                }
    //
    //                pi.mjdesc.push(desc);
    //
    //                //门清 对对胡门清自摸15分，清一色门清自摸24分，大哥门清自摸30分
    //                if (huType == majiang.HUI_ZHOU_HTYPE.PENGPENGHU && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 15;
    //                if (huType == majiang.HUI_ZHOU_HTYPE.QINGYISE && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 24;
    //                if (huType == majiang.HUI_ZHOU_HTYPE.DAGE && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 30;
    //                GLog("门清分数=======" + baseWin + "门清加分了吗:" + tData.menQingJiaFen + "胡的类型是:" + huType + "是否多花胡牌了：" +pi.duoHuaHuPai );
    //                //如果没有多花胡牌 且同时胡其他牌型 其他牌型分数不高于多花胡牌的分数  就提示花
    //                if (!duoHuaHuPaiType) {
    //                    if (huType > 0 || (tData.canHu7 && qiXiaoDui)) {
    //                        if (pi.mjflower.length > 0) pi.mjdesc.push("花X" + pi.mjflower.length);
    //                    }
    //                }
    //                pi.baseWin = 1
    //                var isBaoJiu = false;
    //                var maFan = 0;//算分
    //                var maCount = 0;
    //                var zhongMaNum = majiang.getMaPrice(pi);
    //
    //                if (tData.maGenDi) {
    //                    //鸡胡不算花，大胡算花 公式 分数 = （花数+底分） + （底分+花数）*马数
    //                    if (huType > 0 || (tData.canHu7 && qiXiaoDui) || duoHuaHuPaiType) //非鸡胡
    //                    {
    //                        if (tData.maGenDiDuiDuiHu && baseWin >= 9) {
    //                            if(duoHuaHuPaiType)
    //                            {
    //                                baseWin = (baseWin ) + (9) * zhongMaNum
    //                            }else
    //                            {
    //                                baseWin = (baseWin + pi.mjflower.length) + (9 + pi.mjflower.length ) * zhongMaNum;
    //                            }
    //                        }
    //                        else {
    //                            if(duoHuaHuPaiType)
    //                            {
    //                                baseWin = (baseWin) + (baseWin) * zhongMaNum;
    //                            }else
    //                            {
    //                                baseWin = (baseWin + pi.mjflower.length) + (baseWin + pi.mjflower.length ) * zhongMaNum;
    //                            }
    //                        }
    //
    //                    } else {//鸡胡
    //                        if (tData.maGenDiDuiDuiHu && baseWin >= 9) {
    //                            baseWin = baseWin + (9) * zhongMaNum;
    //                        } else {
    //                            baseWin = baseWin + (baseWin) * zhongMaNum;
    //                        }
    //                    }
    //                }
    //                else {
    //                    maFan = 2 * zhongMaNum;
    //                    maCount = zhongMaNum;
    //                    //鸡胡不算花，大胡算花
    //                    if (!duoHuaHuPaiType) {
    //                        if (huType > 0 || (tData.canHu7 && qiXiaoDui)) {
    //                            baseWin += pi.mjflower.length;
    //                        }
    //                    }
    //                    if (maCount > 0) baseWin = baseWin + maFan;
    //
    //                    for (var j = 0; j < pls.length; j++) {
    //                        var pj = pls[j];
    //                        if (pj.winType > 0) continue;
    //
    //                        //点炮一家输
    //                        if (pi.winType == WinType.eatPut || pi.winType == WinType.eatGangPut) {
    //                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
    //                            if (pi.winType == WinType.eatPut) pj.mjdesc.push("点炮");
    //                            //if(pi.winType == WinType.eatGangPut) pj.mjdesc.push("杠后炮");
    //                            if (pi.winType == WinType.eatGangPut) pj.mjdesc.push("点炮");
    //                            pj.winone -= baseWin;
    //                            pi.winone += baseWin;
    //                        }
    //
    //                        //抢杠胡 杠炮的那个玩家包3家 马钱也包
    //                        if (pi.winType == WinType.eatGang) {
    //                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
    //                            //roundWin*=tData.noBigWin?1:3;
    //                            //pj.mjdesc.push("杠炮");
    //                            baseWin = baseWin * (tData.maxPlayer - 1);
    //                            pi.baseWin = 1;//都让这么写
    //                            if (pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
    //                            if (tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
    //                            if (tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");
    //
    //                        }
    //                        else {
    //                            baseWin = baseWin;
    //                            pi.baseWin = 1;
    //                        }
    //
    //                        if (pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) {//
    //                            //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
    //                            pi.baseWin = 1;
    //                            if (pi.mjdesc.indexOf("杠上花") == -1)pi.mjdesc.push("杠上花");
    //                        }
    //
    //                        //报九张(一定放在最后)
    //                        if ((pi.winType == WinType.pickNormal || pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) && pi.baojiu.num == 4) {
    //                            isBaoJiu = true;
    //                            pi.baseWin = 1;//都改成1了
    //                        }
    //                        //非点炮时 输的玩家 算马与花 该怎么算就怎么算
    //                        if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pi.winone += baseWin;
    //                        //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
    //                        //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
    //                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0) pi.winone += (maFan + pi.mjflower.length);
    //                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0) pi.winone += maFan;
    //                        if ((pi.winType == WinType.pickNormal || pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]) == pj && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
    //                            pj.winone -= baseWin * (tData.maxPlayer - 1);
    //
    //                            if (tData.maxPlayer == 4 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包三家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包三家");
    //                            if (tData.maxPlayer == 3 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包两家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包两家");
    //                        }
    //                        else if (isBaoJiu && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
    //                            pj.winone -= 0;
    //                            pi.huType = huType;
    //                        }
    //                        else {
    //                            if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pj.winone -= baseWin;
    //                            //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
    //                            //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
    //                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0 ) pj.winone -= (maFan + pi.mjflower.length);
    //                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0 ) pj.winone -= maFan;
    //                        }
    //                    }
    //
    //                    if (zhongMaNum > 0) pi.mjdesc.push("买马" + zhongMaNum);
    //                    if (zhongMaNum >= 0) {
    //                        pi.zhongMaNum = zhongMaNum;
    //                    }
    //
    //                }
    //
    //            }
    //        }
    //    }
    //    else {
    //        // tData.winner = -1;
    //        tData.winner = tData.zhuang;
    //    }
    //
    //    tData.tState = TableState.roundFinish;
    //    var owner = tb.players[tData.uids[0]].info;
    //    if (!byEndRoom && !tData.coinRoomCreate) {
    //        if (!owner.$inc) {
    //            if(freeGameTypes.length > 0)
    //            {
    //                var ceshi ="";
    //                for(var i=0;i<freeGameTypes.length;i++)
    //                {
    //                    ceshi += freeGameTypes[i] + ",";
    //                }
    //                GLog("免费玩法："+ ceshi );
    //                var isMianFei = false;
    //                for(var i=0;i<freeGameTypes.length;i++)
    //                {
    //                    if(freeGameTypes[i] == 2)
    //                    {
    //                        isMianFei = true;
    //                        break;
    //                    }
    //                }
    //                if(isMianFei)
    //                {
    //                    GLog("惠州 免费");
    //                    owner.$inc = {money: 0};
    //                }
    //                else
    //                {
    //                    GLog("惠州 扣费");
    //                    owner.$inc = {money: -tb.createPara.money};
    //                }
    //                //if(freeGameTypes.indexOf(2) != -1)//免费
    //                //{
    //                //    GLog("惠州 免费");
    //                //    owner.$inc = {money: 0};
    //                //}else
    //                //{
    //                //    GLog("惠州 扣费");
    //                //    owner.$inc = {money: -tb.createPara.money};
    //                //}
    //            }else
    //            {
    //                GLog("惠州 扣费1");
    //                owner.$inc = {money: -tb.createPara.money};
    //            }
    //        }
    //        //后加的
    //        tb.AllPlayerRun(function(p) {
    //            if(!p.info.$inc) {
    //                p.info.$inc = {playNum:1};
    //            } else if(!p.info.$inc.playNum) {
    //                p.info.$inc.playNum = 1;
    //            } else {
    //                p.info.$inc.playNum += 1;
    //            }
    //        });
    //
    //    }
    //    tb.AllPlayerRun(function (p) {
    //        p.winall += p.winone;
    //        if(p.winType > 0)
    //        {
    //            p.winTotalNum ++;
    //            p.zhongMaTotalNum += p.zhongMaNum;
    //        }
    //        p.mingGangTotalNum += p.mjgang0.length;
    //        p.anGangTotalNum += p.mjgang1.length;
    //
    //    });
    //    tData.roundNum--;
    //
    //    var roundEnd = {
    //        players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','linkHu'),
    //        tData: app.CopyPtys(tData)
    //    };
    //    tb.mjlog.push("roundEnd", roundEnd);//一局结束
    //    var playInfo = null;
    //    if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
    //    if (playInfo) roundEnd.playInfo = playInfo;
    //    tb.NotifyAll("roundEnd", roundEnd);
    //}

    function EndGameForHuiZhou(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if (pi.winType > 0) {
                    //0 鸡胡 1清一色 2杂色 3大哥  4杂碰 5十三幺 6碰碰胡 7杂幺九 8清幺九 9字一色 10 全幺九 (不含杠上花和抢杠胡)
                    var desc = "";
                    var huType = majiang.getHuType(pi);
                    var baseWin = 3;
                    var qiXiaoDui = majiang.can_7_Hu(pi.mjhand,0,false,false); // 9
                    if(tData.canHu7 && qiXiaoDui)
                    {
                        desc = "七小对";
                        baseWin = 9;
                    }
                    switch (huType) {
                        case majiang.HUI_ZHOU_HTYPE.JIHU:
                        {
                            //1.有7对 且不是7对 2.不是7对
                            if(tData.canHu7 && !qiXiaoDui)
                            {
                                desc = "鸡胡";
                                baseWin = 3;
                            }
                            else if(!tData.canHu7){
                                desc = "鸡胡";
                                baseWin = 3;
                            }
                        }
                            break;
                        case majiang.HUI_ZHOU_HTYPE.QINGYISE:
                        {
                            if(tData.canHu7 && qiXiaoDui)
                            {
                                desc = "清一色,七小对";
                                baseWin = 15;
                            }
                            if(tData.canHu7 && !qiXiaoDui)
                            {
                                desc = "清一色";
                                baseWin = 15;
                            }
                            else if(!tData.canHu7)
                            {
                                desc = "清一色";
                                baseWin = 15;
                            }

                        }
                            break;
                        case majiang.HUI_ZHOU_HTYPE.ZASE:
                        {
                            if(tData.canHu7 && qiXiaoDui)
                            {
                                desc = "七小对,杂色";
                            }
                            if(tData.canHu7 && !qiXiaoDui)
                            {
                                baseWin = 6;
                                desc = "杂色";
                            }
                            else if(!tData.canHu7){
                                baseWin = 6;
                                desc = "杂色";
                            }
                        }
                            break;
                        case majiang.HUI_ZHOU_HTYPE.DAGE:
                            desc = "大哥";
                            baseWin = 24;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.ZAPENG:
                            desc = "杂碰";
                            baseWin = 15;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.SHISANYAO:
                            desc = "十三幺";
                            baseWin = 30;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.PENGPENGHU:
                        {
                            desc = "碰碰胡";
                            baseWin = 9;
                        }
                            break;
                        case majiang.HUI_ZHOU_HTYPE.ZAYAOJIU:
                            desc = "杂幺九";
                            baseWin = 15;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.QINGYAOJIU:
                            desc = "清幺九";
                            baseWin = 24;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.ZIYISE:
                            desc = "字一色";
                            baseWin = 30;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.QUANYAOJIU:
                            desc = "全幺九";
                            baseWin = 30;
                    }

                    pi.mjdesc.push(desc);

                    //门清 对对胡门清自摸15分，清一色门清自摸24分，大哥门清自摸30分
                    if(huType == majiang.HUI_ZHOU_HTYPE.PENGPENGHU && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 15;
                    if(huType == majiang.HUI_ZHOU_HTYPE.QINGYISE && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 24;
                    if(huType == majiang.HUI_ZHOU_HTYPE.DAGE && majiang.isMenQing(pi) && tData.menQingJiaFen) baseWin = 30;
                    if (huType > 0 || (tData.canHu7 && qiXiaoDui)) {
                        if (pi.mjflower.length > 0) pi.mjdesc.push("花X" + pi.mjflower.length);
                    }
                    pi.baseWin = 1
                    var isBaoJiu = false;
                    var maFan = 0;//算分
                    var maCount = 0;
                    var zhongMaNum = majiang.getMaPrice(pi);

                    if(tData.maGenDi)
                    {
                        //鸡胡不算花，大胡算花 公式 分数 = （花数+底分） + （底分+花数）*马数
                        if(huType > 0 || (tData.canHu7 && qiXiaoDui)) //非鸡胡
                        {
                            if(tData.maGenDiDuiDuiHu && baseWin >= 9 ){
                                baseWin = (baseWin + pi.mjflower.length)  + (9 + pi.mjflower.length ) * zhongMaNum
                            }
                            else {
                                baseWin = (baseWin + pi.mjflower.length)  + (baseWin + pi.mjflower.length ) * zhongMaNum;
                            }

                        }else{//鸡胡
                            if(tData.maGenDiDuiDuiHu && baseWin >= 9 ){
                                baseWin = baseWin + (9) * zhongMaNum;
                            }else
                            {
                                baseWin = baseWin + (baseWin) * zhongMaNum;
                            }
                        }
                    }
                    else{
                        maFan = 2 * zhongMaNum;
                        maCount = zhongMaNum;
                        //鸡胡不算花，大胡算花
                        if (huType > 0 || (tData.canHu7 && qiXiaoDui)) {
                            baseWin += pi.mjflower.length;
                        }
                        if (maCount > 0) baseWin = baseWin + maFan;
                    }

                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;

                        //点炮一家输
                        if (pi.winType == WinType.eatPut || pi.winType == WinType.eatGangPut) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            if (pi.winType == WinType.eatPut) pj.mjdesc.push("点炮");
                            //if(pi.winType == WinType.eatGangPut) pj.mjdesc.push("杠后炮");
                            if (pi.winType == WinType.eatGangPut) pj.mjdesc.push("点炮");
                            pj.winone -= baseWin;
                            pi.winone += baseWin;
                        }

                        //抢杠胡 杠炮的那个玩家包3家 马钱也包
                        if (pi.winType == WinType.eatGang) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            //roundWin*=tData.noBigWin?1:3;
                            //pj.mjdesc.push("杠炮");
                            baseWin = baseWin * (tData.maxPlayer - 1);
                            pi.baseWin = 1;//都让这么写
                            if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                            if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");

                        }
                        else {
                            baseWin = baseWin;
                            pi.baseWin = 1;
                        }

                        if (pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) {//
                            //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                            pi.baseWin = 1;
                            if(pi.mjdesc.indexOf("杠上花") == -1)pi.mjdesc.push("杠上花");
                        }

                        //报九张(一定放在最后)
                        if ((pi.winType == WinType.pickNormal || pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) && pi.baojiu.num == 4) {
                            isBaoJiu = true;
                            pi.baseWin = 1;//都改成1了
                        }
                        //非点炮时 输的玩家 算马与花 该怎么算就怎么算
                        if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pi.winone += baseWin;
                        //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
                        //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0) pi.winone += (maFan + pi.mjflower.length);
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0) pi.winone += maFan;
                        if ((pi.winType == WinType.pickNormal || pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]) == pj && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
                            pj.winone -= baseWin * (tData.maxPlayer - 1);;
                            if(tData.maxPlayer == 4 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包三家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包两家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包两家");
                        }
                        else if (isBaoJiu && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
                            pj.winone -= 0;
                            pi.huType = huType;
                        }
                        else {
                            if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pj.winone -= baseWin;
                            //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
                            //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0 ) pj.winone -= (maFan + pi.mjflower.length);
                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0 ) pj.winone -= maFan;
                        }
                    }

                    if (zhongMaNum > 0) pi.mjdesc.push("买马" + zhongMaNum);
                    if (zhongMaNum >= 0) {
                        pi.zhongMaNum = zhongMaNum;
                    }

                }

            }
        }
        else {
            // tData.winner = -1;
            tData.winner = tData.zhuang;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 2)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("惠州 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("惠州 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(2) != -1)//免费
                    //{
                    //    GLog("惠州 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("惠州 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("惠州 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','linkHu'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForGangDong(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            horse += (pl.linkHu)*2;
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if ((tData.fanGui || tData.withZhong )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        else if ((tData.fanGui || tData.withBai )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            //pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if(ganguid >= 0)
                        {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;
                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl && !tData.huangZhuangSuanGang) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }
        //计算跟庄的分数 庄家输分 给其他玩家
        var zhuangPl = tb.players[tData.uids[tData.zhuang]];
        if(zhuangPl.genZhuang.genZhuangNum >= 1)
        {
            zhuangPl.winone -= (tData.maxPlayer - 1);
            for(var i = 0; i < pls.length; i++)
            {
                var otherPl = pls[i];
                if(otherPl.uid == zhuangPl.uid)
                    continue;
                otherPl.winone += 1;
            }
            // zhuangPl.mjdesc.push("跟庄");
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0){
                    if((tData.withZhong && pi.mjhand.indexOf(71)!= -1) || (tData.withBai && pi.mjhand.indexOf(91) != -1) || (tData.fanGui &&(pi.mjhand.indexOf(tData.gui)!= -1 || (tData.twogui && pi.mjhand.indexOf(tData.nextgui)!= -1) ) ))
                    {
                        if (pi.winType > 0) {
                            var num2 = 0;
                            if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var num3 = majiang.All3New(pi);//0 1大对碰 2 含风大对碰
                            var sameColor = majiang.SameColorNew(pi);
                            var hunyise = majiang.HunYiSeNew(pi);
                            var baseWin = 2;
                            var judgeType = 0;
                            if (!tData.noBigWin) {
                                var des = "";
                                if (hunyise && num2 != 2 && num2!=1) {
                                    des = "混一色";
                                    judgeType = 1;
                                }
                                if (sameColor && num2 != 2 && num2!=1)
                                {
                                    des = "清一色";
                                    judgeType = 1;
                                }
                                if ((num3 == 1 || num3 == 2) && pi.huType != 8) {
                                    des = "碰碰胡";
                                    if (hunyise) des = "混碰";
                                    if (sameColor) des = "清碰";

                                    judgeType = 1;
                                }
                                if (des != "")    pi.mjdesc.push(des);
                                //判断 7对 普通7对 有杠龙7对
                                if (num2 > 0) {
                                    pi.mjdesc.push(num2 > 1 ? "龙七对" : "七对");
                                    judgeType = 1;
                                }
                                if (judgeType == 0) {
                                    pi.mjdesc.push("平胡");
                                }

                                //天胡
                                if (
                                    (
                                        (tData.cardNext == 53 && tData.maxPlayer == 4) ||
                                        (tData.cardNext == 40 && tData.maxPlayer == 3)
                                    )
                                    && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
                                    pi.mjdesc.push("天胡");
                                    judgeType = 1;
                                }
                                //地胡
                                else if (tb.AllPlayerCheck(function (pl) {
                                        return pl.mjpeng.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang0.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang1.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjchi.length == 0
                                    }) &&
                                    pi.mjhand.length == 14 &&
                                    (pi.picknum == 0 || pi.picknum == 1) &&
                                    pi.mjput.length == 0) {
                                    pi.mjdesc.push("地胡");
                                    judgeType = 1;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1) {
                                    pi.mjdesc.push("杠爆");
                                    judgeType = 1;
                                }


                            }

                            if(num2 > 0 && tData.canFan7){
                                baseWin *= 2;
                            }
                            if(pi.gangBao && tData.gangBaoFanNum > 0)
                            {
                                baseWin *= 2;
                            }
                            if(pi.haiDiHu && tData.haiDiHuFanNum > 0)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }

                            pi.baseWin = 1
                            var maFan = 0;//算分
                            var maCount = 0;
                            var zhongMaNum = 0;
                            if(!tData.baozhama && tData.horse >= 2 ) zhongMaNum = majiang.getMaPrice(pi);
                            else zhongMaNum = majiang.getMaCountsForBaoZhaMa(tb.cards[tData.cardNext]);

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;

                            maCount = zhongMaNum;
                            if (maCount > 0) pi.mjdesc.push("买马" + maCount);
                            //红中 算马
                            if(tData.zhongIsMa && pi.mjzhong && pi.mjzhong.length > 0 ){
                                maCount += pi.mjzhong.length;
                                pi.mjdesc.push("红中X" + pi.mjzhong.length);
                            }
                            maFan = 2 * maCount;
                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                //baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                                baseWin = (baseWin)  + (baseWin) * maCount;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                var roundWin = 1;
                                //抢杠胡 包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);
                                    judgeType = 1;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else if(pi.winType == WinType.pickGang1)
                                {
                                    if(tData.gangBaoQuanBao)
                                    {
                                        if (pj.uid != tData.uids[tData.lastPutPlayer]) continue;
                                        judgeType = 1;
                                        baseWin = baseWin * (tData.maxPlayer - 1);
                                        if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                        if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                    }
                                }
                                else {
                                    baseWin = baseWin
                                    pi.baseWin = 1;
                                }

                                pi.winone += roundWin * baseWin;
                                pj.winone -= roundWin * baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                    else
                    {
                        if (pi.winType > 0) {
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var num3 = majiang.All3(pi);//0 1大对碰 2 含风大对碰
                            var sameColor = majiang.SameColor(pi);
                            var hunyise = majiang.HunYiSe(pi);
                            var baseWin = 2;
                            var judgeType = 0;
                            if (!tData.noBigWin) {
                                var des = "";
                                if (sameColor && num2 != 2 && num2!=1)
                                {
                                    des = "清一色";
                                    judgeType = 1;
                                }
                                if (hunyise && num2 != 2 && num2!=1) {
                                    des = "混一色";
                                    judgeType = 1;
                                }
                                if (num3 == 1 || num3 == 2) {
                                    des = "碰碰胡";
                                    if (sameColor) des = "清碰";

                                    if (hunyise) des = "混碰";
                                    judgeType = 1;
                                }
                                if (des != "")    pi.mjdesc.push(des);
                                //判断 7对 普通7对 有杠龙7对
                                if (num2 > 0) {
                                    pi.mjdesc.push(num2 > 1 ? "龙七对" : "七对");
                                    judgeType = 1;
                                }
                                if (judgeType == 0) {
                                    pi.mjdesc.push("平胡");
                                }

                                //天胡
                                if (
                                    (
                                        (tData.cardNext == 53 && tData.maxPlayer == 4) ||
                                        (tData.cardNext == 40 && tData.maxPlayer == 3)
                                    )
                                    && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
                                    pi.mjdesc.push("天胡");
                                    judgeType = 1;
                                }
                                //地胡
                                else if (tb.AllPlayerCheck(function (pl) {
                                        return pl.mjpeng.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang0.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang1.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjchi.length == 0
                                    }) &&
                                    pi.mjhand.length == 14 &&
                                    (pi.picknum == 0 || pi.picknum == 1) &&
                                    pi.mjput.length == 0) {
                                    pi.mjdesc.push("地胡");
                                    judgeType = 1;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1) {
                                    pi.mjdesc.push("杠爆");
                                    judgeType = 1;
                                }


                            }

                            if(num2 > 0 && tData.canFan7){
                                baseWin *= 2;
                            }

                            if(pi.gangBao && tData.gangBaoFanNum > 0)
                            {
                                baseWin *= 2;
                            }
                            if(pi.haiDiHu && tData.haiDiHuFanNum > 0)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }
                            pi.baseWin = 1
                            var maFan = 0;//算分
                            var maCount = 0;
                            var zhongMaNum = 0;
                            if(!tData.baozhama && tData.horse >= 2 ) zhongMaNum = majiang.getMaPrice(pi);
                            else zhongMaNum = majiang.getMaCountsForBaoZhaMa(tb.cards[tData.cardNext]);

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;
                            maCount = zhongMaNum;
                            if (maCount > 0) pi.mjdesc.push("买马" + maCount);
                            //红中 算马
                            if(tData.zhongIsMa && pi.mjzhong && pi.mjzhong.length > 0 ){
                                maCount += pi.mjzhong.length;
                                pi.mjdesc.push("红中X" + pi.mjzhong.length);
                            }
                            maFan = 2 * maCount;
                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                //baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                                baseWin = (baseWin)  + (baseWin) * maCount;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                var roundWin = 1;
                                //抢杠胡 包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);
                                    judgeType = 1;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else if(pi.winType == WinType.pickGang1)
                                {
                                    if(tData.gangBaoQuanBao)
                                    {
                                        if (pj.uid != tData.uids[tData.lastPutPlayer]) continue;
                                        judgeType = 1;
                                        baseWin = baseWin * (tData.maxPlayer - 1);
                                        if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                        if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                    }
                                }
                                else {
                                    baseWin = baseWin;
                                    pi.baseWin = 1;
                                }
                                pi.winone += roundWin * baseWin;
                                pj.winone -= roundWin * baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                }

            }

        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                GLog("freeGameTypes.length========" + freeGameTypes.length);
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 1)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("广州 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("广州 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(1) != -1)//免费
                    //{
                    //    GLog("广州 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("广州 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }
                else
                {
                    GLog("广州 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','danDiaoHua','huaDiaoHua','genZhuang'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForJiPingHu(tb, pl, byEndRoom){
        GLog("function EndGameForJiPingHu");
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var baoZiMoCunts = 0;
        for(var i=0;i<pls.length;i++){
            if(pls[i].baoZiMo.putCardPlayer.length == 1) baoZiMoCunts++;
        }
        if(baoZiMoCunts > 1){ //排除包自摸条件
            for(var i=0;i<pls.length;i++){
                pls[i].baoZiMo.putCardPlayer = [];
                pls[i].baoZiMo.isOk = false;
            }
        }
        var horse = 0;

        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            //pls[z].left4Ma.length = 0;
            pls[z].left4Ma = [];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");

            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        //赢得玩家个数
        var winPlayerNums = 0;
        for(var i=0;i<pls.length;i++)
        {
            var pi = pls[i];
            if(pi.winType > 0) winPlayerNums ++;
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if (pi.winType > 0) {
                    //0 鸡胡 1平胡 2碰碰胡 3混一色 4清一色 5混碰 6清碰 7混幺九 8清幺九 9大三元 10小三元 11大四喜 12小四喜 13十三幺 14字一色 15九莲宝灯
                    var desc = "";
                    var huType = majiang.getHuTypeForJiPingHu(pi);
                    var fanNum = 0;
                    var baseWin = 1;
                    switch (huType) {
                        case majiang.JI_PING_HU_HUTYPE.JIHU:
                            desc = "鸡胡";
                            fanNum = 0;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.PINGHU:
                            desc = "平胡";
                            fanNum = 1;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.PENGPENGHU:
                            desc = "碰碰胡";
                            fanNum = 2;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.HUNYISE:
                            desc = "混一色";
                            fanNum = 2;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.QINGYISE:
                            desc = "清一色";
                            fanNum = 4;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.HUNPENG:
                            desc = "混碰";
                            fanNum = 4;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.QINGPENG:
                            desc = "清碰";
                            fanNum = 5;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.HUNYAOJIU:
                            desc = "混幺九";
                            fanNum = 5;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.QINGYAOJIU:
                            desc = "清幺九";
                            fanNum = 6;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.DASANYUAN:
                            desc = "大三元";
                            fanNum = 6;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.XIAOSANYUAN:
                            desc = "小三元";
                            fanNum = 5;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.DASIXI:
                            desc = "大四喜";
                            fanNum = 6;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.XIAOSIXI:
                            desc = "小四喜";
                            fanNum = 5;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.SHISANYAO:
                            desc = "十三幺";
                            fanNum = 6;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.ZIYISE:
                            desc = "字一色";
                            fanNum = 6;
                            break;
                        case majiang.JI_PING_HU_HUTYPE.JIUBAOLILANDENG:
                            desc = "九宝莲灯";
                            fanNum = 6;
                            break;
                    }
                    pi.mjdesc.push(desc);

                    //只用作提示
                    if (pi.winType == WinType.pickNormal) {if(pi.mjdesc.indexOf("自摸") == -1) pi.mjdesc.push("自摸");}; //自摸 +1番
                    if (majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind, pi)) if(pi.mjdesc.indexOf("风圈刻") == -1) pi.mjdesc.push("风圈刻");
                    if (majiang.isGetBenMenMenFengKeZi(pi)) {if(pi.mjdesc.indexOf("风位刻") == -1) pi.mjdesc.push("风位刻");}
                    if (majiang.getSanYuanPaiKeZiNum(pi) > 0)  pi.mjdesc.push("三元刻X" + majiang.getSanYuanPaiKeZiNum(pi));
                    if (pi.winType == WinType.pickNormal && pi.baoZiMo.isOk && tb && pi.baoZiMo.putCardPlayer && tData.uids[pi.baoZiMo.putCardPlayer] >0 && tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer])) tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer]).mjdesc.push("包自摸");
                    if (pi.winType == WinType.eatGang) if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                    if (tData.cardNext == 136) pi.mjdesc.push("海底捞月");
                    if (pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) if(pi.mjdesc.indexOf("杠上开花") == -1) pi.mjdesc.push("杠上开花");
                    //爆胡为3番 爆胡内牌型不能冲破爆胡的上限(鸡胡、平胡、碰碰胡、混一色)
                    if(huType == majiang.JI_PING_HU_HUTYPE.JIHU || huType == majiang.JI_PING_HU_HUTYPE.PINGHU || huType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || huType == majiang.JI_PING_HU_HUTYPE.HUNYISE ){
                        if(pi.winType== WinType.pickNormal ) {fanNum++; };//自摸 +1番
                        if(majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pi)) {fanNum++; };
                        if(majiang.isGetBenMenMenFengKeZi(pi)) {fanNum++;};
                        if(majiang.getSanYuanPaiKeZiNum(pi) > 0) {fanNum += majiang.getSanYuanPaiKeZiNum(pi);};
                        if(fanNum >= 3) fanNum = 3;
                        //一炮三响 3番
                        var huCounts = [];
                        tb.AllPlayerRun(function (p) {
                            if ( p.eatFlag >= 8 ) {
                                huCounts.push(p);
                            }
                        });
                        if(huCounts.length == 3) fanNum = 3;
                        //抢杠胡 3番
                        if (pi.winType == WinType.eatGang) fanNum = 3;
                        //海底捞月 3番
                        if(tData.cardNext == 136) fanNum = 3;
                        //杠上开花 3番
                        if(pi.winType ==WinType.pickGang1 || pi.winType == WinType.pickGang23) fanNum = 3;
                        pi.baseWin = fanNum;
                    }else{
                        pi.baseWin = fanNum;
                    }

                    //天胡地胡人乎 忽略起胡番数 直接按6番胡
                    //天胡
                    if (tData.cardNext == 53 && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {fanNum = 6; pi.baseWin =fanNum; pi.mjdesc.push("天胡");}
                    //人胡
                    else if(tData.cardNext == 53 && tData.curPlayer == tData.zhuang) {fanNum = 6; pi.baseWin =fanNum; pi.mjdesc.push("人胡")}
                    //地胡
                    else if (tb.AllPlayerCheck(function (pl) {
                            return pl.mjpeng.length == 0
                        }) &&
                        tb.AllPlayerCheck(function (pl) {
                            return pl.mjgang0.length == 0
                        }) &&
                        tb.AllPlayerCheck(function (pl) {
                            return pl.mjgang1.length == 0
                        }) &&
                        tb.AllPlayerCheck(function (pl) {
                            return pl.mjchi.length == 0
                        }) &&
                        pi.mjhand.length == 14 &&
                        (pi.picknum == 0 || pi.picknum == 1) && pi.mjput.length == 0) {
                        fanNum = 6; pi.baseWin =fanNum; pi.mjdesc.push("地胡");
                    }


                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;
                        //包自摸
                        if (pi.baoZiMo.isOk && pi.winType == WinType.pickNormal ) {
                            GLog("pi.baoZiMo.putCardPlayer ===" + pi.baoZiMo.putCardPlayer);
                            pi.winone += Math.pow(2, pi.baseWin);
                            tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer[0]]).winone -= Math.pow(2, pi.baseWin);
                            if(tData.maxPlayer == 4 && tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer[0]]).mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer[0]]).mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                        }
                        //抢杠胡 包输家
                        else if (pi.winType == WinType.eatGang && pj.uid == tData.uids[tData.curPlayer]){
                            pi.winone += winPlayerNums * Math.pow(2, pi.baseWin) * (tData.maxPlayer - winPlayerNums);
                            if (pj.uid == tData.uids[tData.curPlayer]) pj.winone -= winPlayerNums * Math.pow(2, pi.baseWin)* (tData.maxPlayer - winPlayerNums);
                            if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                            break;
                        }
                        //杠上花（明杠）包输家
                        else if(pi.winType == WinType.pickGang1 && pj.uid == tData.uids[tData.lastPutPlayer]){
                            pi.winone += winPlayerNums *Math.pow(2, pi.baseWin) * (tData.maxPlayer - winPlayerNums);
                            if(pj.uid==tData.uids[tData.lastPutPlayer])
                            {
                                pj.winone -= winPlayerNums * Math.pow(2, pi.baseWin) * (tData.maxPlayer - winPlayerNums);
                                if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                            }
                            break;
                        }
                        //点炮 一家输
                        else if(pi.winType == WinType.eatPut || pi.winType == WinType.eatGangPut)
                        {
                            if(pj.uid == tData.uids[tData.curPlayer]){
                                if(pj.mjdesc.indexOf("点炮") == -1) pj.mjdesc.push("点炮");
                                pi.winone += Math.pow(2, pi.baseWin);
                                pj.winone -= Math.pow(2, pi.baseWin);
                            }
                        }
                        else
                        {
                            if(pi.winType != WinType.pickGang1  && pi.winType != WinType.eatGang)
                            {
                                pi.winone += Math.pow(2, pi.baseWin);
                                pj.winone -= Math.pow(2, pi.baseWin);
                            }

                        }

                    }
                }

            }
            GLog("赢得玩家的分====" + pl.winone);
            GLog("最终     胡家类型：" + pl.winType);
            GLog("pi.desc===="+pl.mjdesc);
        }
        else {
            tData.winner = -1;
        }

        var huMembers = [];
        tb.AllPlayerRun(function (p) {
            if ( p.eatFlag >= 8 ) {
                huMembers.push(p);
            }
        });
        if(huMembers.length >= 2) {
            tData.winner = tData.zhuang; //一炮多响 庄家继续做庄
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 4)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("鸡平胡 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("鸡平胡 免费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(4) != -1)//免费
                    //{
                    //    GLog("鸡平胡 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("鸡平胡 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }
                else
                {
                    GLog("鸡平胡 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','danDiaoHua','huaDiaoHua'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForDongGuan(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        else if(tData.withBai)
        {
            if(pl)
            {
                if (!majiang.isHuWithBaiBan(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            //var gangWin=pi.mjgang1.length*2;
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0) {
                    if ((tData.withZhong && pi.mjhand.indexOf(71) != -1) || (tData.withBai && pi.mjhand.indexOf(91) != -1) || (tData.fanGui && pi.mjhand.indexOf(tData.gui) != -1))
                    {
                        if (pi.winType > 0) {
                            var num2 = 0;
                            pi.baseWin = 1;
                            if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var desc = "";
                            //东莞 0平胡 1混一色 2大对胡 3清一色 4七对 5龙七对 6混七对 7混龙七对 8清七对 9清龙七对 10混大对 11清大对
                            var huType = majiang.getHuTypeForDongGuanNew(pi);
                            var baseWin = 0;
                            switch (huType) {
                                case majiang.DONG_GUAN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    baseWin = 4
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.DADUIHU:
                                    desc = "大对胡";
                                    baseWin = 4;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    baseWin = 6;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.HUN_DADUI:
                                    desc = "混大对";
                                    baseWin = 8;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.QING_DADUI:
                                    desc = "清大对";
                                    baseWin = 12;
                                    break;
                            }

                            if (num2 == 1) {
                                desc = "七对";
                                baseWin = 6;
                            }

                            if (num2 == 1 && huType == majiang.DONG_GUAN_HUTYPE.QINGYISE) {
                                desc = "清七对";
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.DONG_GUAN_HUTYPE.HUNYISE) {
                                desc = "混七对";
                                baseWin = 12;
                            }

                            if (num2 == 2) {
                                desc = "龙七对";
                                baseWin = 12;
                            }
                            if (num2 == 2 && huType == majiang.DONG_GUAN_HUTYPE.QINGYISE) {
                                desc = "清龙七对";
                                baseWin = 36;
                            }
                            if (num2 == 2 && huType == majiang.DONG_GUAN_HUTYPE.HUNYISE) {
                                desc = "混龙七对";
                                baseWin = 24;
                            }

                            pi.mjdesc.push(desc);

                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maCount = zhongMaNum;
                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            //红中 算马
                            if(tData.zhongIsMa && pi.mjzhong && pi.mjzhong.length > 0 ){
                                maCount += pi.mjzhong.length;
                                pi.mjdesc.push("红中X" + pi.mjzhong.length);
                            }
                            maFan = 2 * maCount;

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;

                            //鬼牌模式 摸到4鬼 选择加倍 分翻倍
                            if((tData.withZhong || tData.fanGui) && tData.gui4Hu && majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.fanGui,tData.gui)) baseWin *= tData.gui4huBeiNum;


                            //如果是海底胡 分数番2倍 杠开 番2倍 海底杠开番4倍
                            if((tData.cardNext == tData.cardsNum - horse) && (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) )
                            {
                                baseWin *= 4;
                                pi.mjdesc.push("海底杠开");
                            }
                            else if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("杠上花");
                            }else if(tData.cardNext == tData.cardsNum - horse){
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }
                            //以上马数都没番倍 只是番的基本分
                            if(tData.maGenDi)//没算上 红中算马数 若算上 将zhongMaNum 改成maCount变量名即可
                            {
                                ///公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 4 ){
                                    baseWin = (baseWin )  + (4 ) * maCount;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * maCount;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }
                            //if (maCount > 0) baseWin = baseWin + maFan;
                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                //抢杠胡 被抢杠者包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);//被抢杠的人下局坐庄
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }
                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                    else{
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var desc = "";
                            //东莞 0平胡 1混一色 2大对胡 3清一色 4七对 5龙七对 6混七对 7混龙七对 8清七对 9清龙七对 10混大对 11清大对
                            var huType = majiang.getHuTypeForDongGuan(pi);
                            var baseWin = 0;
                            switch (huType) {
                                case majiang.DONG_GUAN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    baseWin = 4
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.DADUIHU:
                                    desc = "大对胡";
                                    baseWin = 4;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    baseWin = 6;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.HUN_DADUI:
                                    desc = "混大对";
                                    baseWin = 8;
                                    break;
                                case majiang.DONG_GUAN_HUTYPE.QING_DADUI:
                                    desc = "清大对";
                                    baseWin = 12;
                                    break;
                            }

                            if (num2 == 1) {
                                desc = "七对";
                                baseWin = 6;
                            }

                            if (num2 == 1 && huType == majiang.DONG_GUAN_HUTYPE.QINGYISE) {
                                desc = "清七对";
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.DONG_GUAN_HUTYPE.HUNYISE) {
                                desc = "混七对";
                                baseWin = 12;
                            }

                            if (num2 == 2) {
                                desc = "龙七对";
                                baseWin = 12;
                            }
                            if (num2 == 2 && huType == majiang.DONG_GUAN_HUTYPE.QINGYISE) {
                                desc = "清龙七对";
                                baseWin = 36;
                            }
                            if (num2 == 2 && huType == majiang.DONG_GUAN_HUTYPE.HUNYISE) {
                                desc = "混龙七对";
                                baseWin = 24;
                            }

                            pi.mjdesc.push(desc);

                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maCount = zhongMaNum;
                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            //红中 算马
                            if(tData.zhongIsMa && pi.mjzhong && pi.mjzhong.length > 0 ){
                                maCount += pi.mjzhong.length;
                                pi.mjdesc.push("红中X" + pi.mjzhong.length);
                            }
                            maFan = 2 * maCount;
                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;
                            //如果是海底胡 分数番2倍 杠开 番2倍 海底杠开番4倍
                            if((tData.cardNext == tData.cardsNum - horse) && (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) )
                            {
                                baseWin *= 4;
                                pi.mjdesc.push("海底杠开");
                            }
                            else if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("杠上花");
                            }else if(tData.cardNext == tData.cardsNum - horse){
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }

                            //以上马数都没番倍 只是番的基本分
                            if(tData.maGenDi)//没算上 红中算马数 若算上 将zhongMaNum 改成maCount变量名即可
                            {
                                ///公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 4 ){
                                    baseWin = (baseWin )  + (4 ) * maCount;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * maCount;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }
                            //if (maCount > 0) baseWin = baseWin + maFan;
                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                //抢杠胡 被抢杠者包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);//被抢杠的人下局坐庄
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }
                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                }

            }

        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 5)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("东莞 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("东莞 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(5) != -1)//免费
                    //{
                    //    GLog("东莞 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("东莞 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("东莞 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForYiBaiZhuang(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl) && tData.guiJiaMa ) horse = horse + 2;
            }
        }
        else if(tData.withBai)
        {
            if(pl)
            {
                if (!majiang.isHuWithBaiBan(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            //var gangWin=pi.mjgang1.length*2;
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0)
                {
                    if((tData.withZhong && pi.mjhand.indexOf(71)!= -1) || (tData.withBai && pi.mjhand.indexOf(91) != -1) || (tData.fanGui && pi.mjhand.indexOf(tData.gui)!= -1))
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1;

                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var desc = "";
                            //100张 0平胡 1碰碰胡  4混一色 5清一色 6混碰 7清碰 8幺九 9字一色 10十三幺
                            //二期需求 去掉7对胡法 混一色 及 混碰
                            var huType = majiang.getHuTypeForYiBaiZhangNew(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.YI_BAI_ZHANG.PINGHU:
                                    desc = "平胡";
                                    break;
                                case majiang.YI_BAI_ZHANG.PENGPENGHU:
                                    desc = "碰碰胡";
                                    if(tData.canBigWin) baseWin = 4;
                                    break;
                                case majiang.YI_BAI_ZHANG.QINGYISE:
                                    desc = "清一色";
                                    if(tData.canBigWin) baseWin = 8;
                                    break;
                                case majiang.YI_BAI_ZHANG.YAOJIU:
                                    desc = "幺九";
                                    if(tData.canBigWin) baseWin = 12;
                                    break;
                                case majiang.YI_BAI_ZHANG.ZIYISE:
                                    desc = "字一色";
                                    baseWin = 2;
                                    if(tData.canBigWin) baseWin = 16;
                                    break;
                                case majiang.YI_BAI_ZHANG.SHISANYAO:
                                    desc = "十三幺";
                                    baseWin = 2;
                                    if(tData.canBigWin) baseWin = 16;
                                    break;
                            }

                            //鬼牌模式 清碰+鬼 应该算成 字一色
                            if (tData.withZhong)
                            {
                                if(huType == majiang.YI_BAI_ZHANG.QINGYISE && (num2 == 1 || num2 == 2 || majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.fanGui,tData.gui) ) && (pi.mjhand.indexOf(71) != -1 || pi.mjpeng.indexOf(71) != -1 || pi.mjgang0.indexOf(71) != -1 || pi.mjgang1.indexOf(71) != -1) ) {
                                    desc = "字一色";
                                    baseWin = 16;
                                    if(tData.canBigWin) baseWin = 16;
                                }
                            }
                            if (tData.fanGui)
                            {
                                if(huType == majiang.YI_BAI_ZHANG.QINGYISE && (num2 == 1 || num2 == 2 || majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.fanGui,tData.gui)) && (pi.mjhand.indexOf(tData.gui) != -1 || pi.mjpeng.indexOf(tData.gui) != -1 || pi.mjgang0.indexOf(tData.gui) != -1 || pi.mjgang1.indexOf(tData.gui) != -1) ) {
                                    desc = "字一色";
                                    baseWin = 16;
                                    if(tData.canBigWin) baseWin = 16;
                                }
                            }

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (tData.withZhong) {
                                if (!majiang.isHuWithHongZhong(pi) && tData.guiJiaBei ) baseWin *= 2;
                            }
                            if(tData.fanGui){
                                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaBei) baseWin *= 2;
                            }

                            //鬼牌模式 摸到4鬼 选择加倍 分翻倍
                            if((tData.withZhong || tData.fanGui) && tData.gui4Hu && majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.fanGui,tData.gui)) baseWin *= tData.gui4huBeiNum;

                            pi.mjdesc.push(desc);
                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 4 && tData.canBigWin ){
                                    baseWin = (baseWin )  + (4 ) * zhongMaNum;
                                }
                                else if(tData.maGenDiDuiDuiHu && baseWin >= 2 && !tData.canBigWin ){
                                    baseWin = (baseWin )  + (2 ) * zhongMaNum;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);

                            if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                            {
                                pi.mjdesc.push("杠上花");
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                    else
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var desc = "";
                            //100张 0平胡 1碰碰胡 2七对 3龙七对 4混一色 5清一色 6混碰 7清碰 8幺九 9字一色 10十三幺
                            //二期需求 去掉7对胡法 混一色 及 混碰
                            var huType = majiang.getHuTypeForYiBaiZhang(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.YI_BAI_ZHANG.PINGHU:
                                    desc = "平胡";
                                    break;
                                case majiang.YI_BAI_ZHANG.PENGPENGHU:
                                    desc = "碰碰胡";
                                    if(tData.canBigWin) baseWin = 4;
                                    break;
                                case majiang.YI_BAI_ZHANG.QINGYISE:
                                    desc = "清一色";
                                    if(tData.canBigWin) baseWin = 8;
                                    break;
                                case majiang.YI_BAI_ZHANG.YAOJIU:
                                    desc = "幺九";
                                    if(tData.canBigWin) baseWin = 12;
                                    break;
                                case majiang.YI_BAI_ZHANG.ZIYISE:
                                    desc = "字一色";
                                    baseWin = 2;
                                    if(tData.canBigWin) baseWin = 16;
                                    break;
                                case majiang.YI_BAI_ZHANG.SHISANYAO:
                                    desc = "十三幺";
                                    baseWin = 2;
                                    if(tData.canBigWin) baseWin = 16;
                                    break;
                            }

                            //鬼牌模式 清碰+鬼 应该算成 字一色
                            if (tData.withZhong)
                            {
                                if(huType == majiang.YI_BAI_ZHANG.QINGYISE && (num2 == 1 || num2 == 2 || majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.withBai,tData.fanGui,tData.gui) ) && (pi.mjhand.indexOf(71) != -1 || pi.mjpeng.indexOf(71) != -1 || pi.mjgang0.indexOf(71) != -1 || pi.mjgang1.indexOf(71) != -1) ) {
                                    desc = "字一色";
                                    baseWin = 16;
                                    if(tData.canBigWin) baseWin = 16;
                                }
                            }
                            if (tData.fanGui)
                            {
                                if(huType == majiang.YI_BAI_ZHANG.QINGYISE && (num2 == 1 || num2 == 2 || majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.withBai,tData.fanGui,tData.gui)) && (pi.mjhand.indexOf(tData.gui) != -1 || pi.mjpeng.indexOf(tData.gui) != -1 || pi.mjgang0.indexOf(tData.gui) != -1 || pi.mjgang1.indexOf(tData.gui) != -1) ) {
                                    desc = "字一色";
                                    baseWin = 16;
                                    if(tData.canBigWin) baseWin = 16;
                                }
                            }

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (tData.withZhong) {
                                if (!majiang.isHuWithHongZhong(pi) && tData.guiJiaBei ) baseWin *= 2;
                            }
                            else if(tData.withBai)
                            {
                                if (!majiang.isHuWithBaiBan(pi) && tData.guiJiaBei ) baseWin *= 2;
                            }
                            if(tData.fanGui){
                                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaBei) baseWin *= 2;
                            }

                            //鬼牌模式 摸到4鬼 选择加倍 分翻倍
                            if((tData.withZhong || tData.fanGui || tData.withBai) && tData.gui4Hu && majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.withBai,tData.fanGui,tData.gui)) baseWin *= tData.gui4huBeiNum;

                            pi.mjdesc.push(desc);
                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                ///公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 4 && tData.canBigWin ){
                                    baseWin = (baseWin )  + (4 ) * zhongMaNum;
                                }
                                else if(tData.maGenDiDuiDuiHu && baseWin >= 2 && !tData.canBigWin ){
                                    baseWin = (baseWin )  + (2 ) * zhongMaNum;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);

                            if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                            {
                                pi.mjdesc.push("杠上花");
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                }
            }
        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 6)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("一百张 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("一百张 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(6) != -1)//免费
                    //{
                    //    GLog("一百张 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("一百张 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("一百张 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForChaoZhou(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });
        var horse = tData.horse;
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        //if (tData.withZhong) {
        //    if (pl) {
        //        if (!majiang.isHuWithHongZhong(pl) && tData.guiJiaMa) horse = horse + 2;
        //    }
        //}
        //if(tData.fanGui){
        //    if (pl) {
        //        if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
        //    }
        //}
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }


        var noShuFenNum = 0;
        if(!tData.canDianPao && pl && (pl.winType == WinType.pickGang23 || pl.winType == WinType.pickGang1 || pl.winType == WinType.pickNormal))
        {
            noShuFenNum = pl.collectCanTingTwentyPlayers.length;
            GLog("----------------------------------------------------noShuFenNum = " + noShuFenNum);
            if( noShuFenNum > 0)
            {
                for(var i=0;i<pl.collectCanTingTwentyPlayers.length;i++)
                {
                    GLog("------------------------------------听20分牌的人：" + pl.collectCanTingTwentyPlayers[i] );
                }
            }
        }else
        {
            noShuFenNum = 0;
        }


        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            //if(noShuFenNum >0)
            //{
            //    for(var y=0;y<noShuFenNum;y++) {
            //        //if (pl && (pl.winType == WinType.pickGang23 || pl.winType == WinType.pickGang1 || pl.winType == WinType.pickNormal) && pi.uid == pl.collectCanTingTwentyPlayers[y]) {
            //            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            //        //}else{
            //          //  pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1 - noShuFenNum);
            //        //}
            //    }
            //}else
            {
                pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            }

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            if(noShuFenNum > 0)
                            {
                                for(var u=0;u<noShuFenNum;u++){
                                    if( pj.uid == pl.collectCanTingTwentyPlayers[u])
                                    {
                                        pj.winone -= 0;
                                        pi.winone -= 3;
                                    }
                                    else
                                    {
                                        if(pl.collectCanTingTwentyPlayers.length == 1)
                                            pj.winone -= 3;
                                    }
                                }
                                //其他不是听20分的人照样 减分
                                if(noShuFenNum == 2)
                                {
                                    if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1])
                                    {
                                        pj.winone -= 3;
                                    }
                                }
                                if(noShuFenNum == 3)
                                {
                                    if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1] && pj.uid != pl.collectCanTingTwentyPlayers[2])
                                    {
                                        pj.winone -= 3;
                                    }
                                }

                            }else{
                                pj.winone -= 3;
                            }
                            pj.mjdesc.push("点杠");
                        }
                        else
                        {
                            if(noShuFenNum > 0)
                            {
                                //if(pl.collectCanTingTwentyPlayers.length == 1)
                                //{
                                //    pl.collectCanTingTwentyPlayers[q]
                                //}
                                for(var q=0;q<noShuFenNum;q++){
                                    if(pj.uid == pl.collectCanTingTwentyPlayers[q])
                                    {
                                        pj.winone -= 0;
                                        pi.winone -= 1;
                                    }
                                    else
                                    {
                                        if(pl.collectCanTingTwentyPlayers.length == 1)
                                            pj.winone -= 1;
                                    }
                                }
                                //其他不是听20分的人照样 减分
                                if(noShuFenNum == 2)
                                {
                                    if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1])
                                    {
                                        pj.winone -= 1;
                                    }
                                }
                                if(noShuFenNum == 3)
                                {
                                    if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1] && pj.uid != pl.collectCanTingTwentyPlayers[2])
                                    {
                                        pj.winone -= 1;
                                    }
                                }


                            }else{
                                pj.winone -= 1
                            }
                        }

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            //var gangWin=pi.mjgang1.length*2;
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    if(noShuFenNum > 0)
                    {
                        for(var c=0;c<noShuFenNum;c++){
                            if(pj.uid == pl.collectCanTingTwentyPlayers[c])
                            {
                                GLog("暗杠pj====="+  pj.uid);
                                pj.winone -= 0;
                                pi.winone -= gangWin;
                            }
                            else
                            {
                                if(pl.collectCanTingTwentyPlayers.length == 1)
                                    pj.winone -= gangWin;
                            }
                            // pj.winone -= gangWin;
                        }
                        if(noShuFenNum == 2)
                        {
                            if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1])
                            {
                                pj.winone -= gangWin;
                            }
                        }
                        if(noShuFenNum == 3)
                        {
                            if(pj.uid !=  pl.collectCanTingTwentyPlayers[0] && pj.uid != pl.collectCanTingTwentyPlayers[1] && pj.uid != pl.collectCanTingTwentyPlayers[2])
                            {
                                pj.winone -= gangWin;
                            }
                        }
                    }else{
                        pj.winone -= gangWin;
                    }
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0) {
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            var desc = "";
                            //潮汕麻将 0平胡 1碰碰胡 2混一色 3清一色 4七小对 5混碰 6清碰 7混七小对 8豪华七小对 9幺九（别的玩法中的杂幺九）10 清七小对 11幺九七小对 12混豪华七对 13清豪华七对 14混幺九
                            // 15十八罗汉 16双豪华七对 17 纯大字 18 纯幺九 19幺九豪华七小对 20纯大字七小对
                            var huType = majiang.getHuTypeForChaoShan(pi);
                            var baseWin = 0;
                            switch (huType) {
                                case majiang.CHAO_SHAN_HUTYPE.PINGHU://0
                                    desc = "平胡";
                                    baseWin = 2;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.PENGPENGHU://1
                                    desc = "碰碰胡";
                                    baseWin = 4
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HUNYISE://2
                                    desc = "混一色";
                                    baseWin = 4;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.QINGYISE://3
                                    desc = "清一色";
                                    baseWin = 6;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.QIXIAODUI://4
                                    desc = "七小对";
                                    baseWin = 6;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HUNPENG://5
                                    desc = "混碰";
                                    baseWin = 8;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.QINGPENG://6
                                    desc = "清碰";
                                    baseWin = 10;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HUNQIXIAODUI://7
                                    desc = "混七小对";
                                    baseWin = 10;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HAOHUAQIXIAODUI://8
                                    desc = "豪华七小对";
                                    baseWin = 10;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.YAOJIU://9
                                    desc = "幺九";
                                    baseWin = 10;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.QINGQIXIAODUI://10
                                    desc = "清七小对";
                                    baseWin = 12;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.YAOJIUQIXIAODUI://11
                                    desc = "幺九七小对";
                                    baseWin = 14;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HUNHAOHUAQIDUI://12
                                    desc = "混豪华七小对";
                                    baseWin = 14;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.QINGHAOHUAQIDUI://13
                                    desc = "清豪华七小对";
                                    baseWin = 16;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.HUNYAOJIU://14
                                    desc = "混幺九";
                                    baseWin = 16;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN://15
                                    desc = "十八罗汉";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.SHUANGHAOHUAQIDUI://16
                                    desc = "双豪华七小对";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.CHUNDAZI://17
                                    desc = "纯大字";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.CHUNYAOJIU://18
                                    desc = "纯幺九";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.YAOJIUHAOHUAQIXIAODUI://19
                                    desc = "幺九豪华七小对";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.CHUNDAZIQIXIAODUI://20
                                    desc = "纯大字七小对";
                                    baseWin = 20;
                                    break;
                                case majiang.CHAO_SHAN_HUTYPE.SHISANYAO://21
                                    desc = "十三幺";
                                    baseWin = 20;
                                    break;
                            }

                            pi.mjdesc.push(desc);
                            if (tData.cardNext == 53 && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
                                pi.mjdesc.push("天胡");baseWin = 20;
                            }
                            //地胡
                            else if (tb.AllPlayerCheck(function (pl) {
                                    return pl.mjpeng.length == 0
                                }) &&
                                tb.AllPlayerCheck(function (pl) {
                                    return pl.mjgang0.length == 0
                                }) &&
                                tb.AllPlayerCheck(function (pl) {
                                    return pl.mjgang1.length == 0
                                }) &&
                                tb.AllPlayerCheck(function (pl) {
                                    return pl.mjchi.length == 0
                                }) &&
                                pi.mjhand.length == 14 &&
                                (pi.picknum == 0 || pi.picknum == 1) && pi.mjput.length == 0) {
                                pi.mjdesc.push("地胡");baseWin = 20;
                            }

                            if(pi.gangBao)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("杠爆");
                            }

                            if(pi.haiDiHu && tData.haiDiFanBei)
                            {
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }
                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maCount = zhongMaNum;
                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);

                            maFan = 2 * maCount;
                            //鬼牌模式 手牌无鬼 分翻倍
                            // if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;
                            if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                            {
                                pi.mjdesc.push("杠上花");
                            }


                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++)
                            {
                                var pj = pls[j];
                                if (pj.winType > 0)
                                    continue;

                                if (pi.winType == WinType.eatPut || pi.winType == WinType.eatGangPut)
                                {
                                    if (pj.uid != tData.uids[tData.curPlayer])
                                        continue;

                                    pj.mjdesc.push("点炮");
                                    pj.winone -= baseWin;
                                    pi.winone += baseWin;
                                }
                                else
                                {
                                    //抢杠胡 被抢杠者包3家
                                    if (pi.winType == WinType.eatGang)
                                    {
                                        if (pj.uid != tData.uids[tData.curPlayer])
                                            continue;

                                        if(pj.uid == pl.collectCanTingTwentyPlayers[j])
                                            continue;

                                        tData.winner = tData.uids.indexOf(pj.uid);//被抢杠的人下局坐庄
                                        baseWin = baseWin * (tData.maxPlayer - 1);

                                        if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                        if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                        if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");

                                    }
                                    else
                                    {
                                        baseWin = baseWin;
                                    }
                                    pi.winone += baseWin;
                                    pj.winone -= baseWin;
                                }

                            }

                            if(!tData.canDianPao && pi && (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 || pi.winType == WinType.pickNormal))
                            {
                                if(pi.collectCanTingTwentyPlayers.length > 0)
                                {
                                    for(var f=0;f<pi.collectCanTingTwentyPlayers.length;f++)
                                    {
                                        tb.players[pi.collectCanTingTwentyPlayers[f]].winone += baseWin;
                                    }
                                    pi.winone = pi.winone - pi.collectCanTingTwentyPlayers.length * baseWin;
                                }
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                }
            }
        }
        else {
            tData.winner = tData.zhuang;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 8)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("潮汕 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("潮汕 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(8) != -1)//免费
                    //{
                    //    GLog("潮汕 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("潮汕 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("潮汕 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForHeYuanBaiDaXinXuQiu(tb,pl,byEndRoom)
    {
        var tData = tb.tData;
        if(pl) GLog("------------------------------------------------------------"+ pl.mjhand[pl.mjhand.length - 1]);
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });
        var horse = tData.horse;
        //鬼牌模式  判断胡牌是否含花鬼 无花鬼选择花加马 增加2匹马
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isFindGuiForMjhand(pl.mjhand)  && tData.guiJiaMa && !majiang.canFindFlowerForMjhand(pl.mjhand)) horse = horse + 2;
            }
        }
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= 1;
                            pi.winone -= (tData.maxPlayer - 2);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;

                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0) {
                    if (tData.fanGui && tData.baidadahu)
                    {
                        if (pi.winType > 0) {
                            var num2 = 0;
                            pi.baseWin = 1;
                            // if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            // if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var desc = "";
                            //河源百搭 0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺
                            var huType = 0;
                            var baseWin = 0;
                            switch (pi.huType) {
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU:
                                    desc = "鸡胡";
                                    baseWin = 2;
                                    if(tData.canJiHu) baseWin = 1;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU:
                                    desc = "碰碰胡";
                                    baseWin = 3;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    baseWin = 5;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG:
                                    desc = "混碰";
                                    baseWin = 5;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE:
                                    desc = "大哥";
                                    baseWin = 8;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU:
                                    desc = "幺九";
                                    baseWin = 8;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE:
                                    desc = "字一色";
                                    baseWin = 13;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU:
                                    desc = "全幺九";
                                    baseWin = 13;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    baseWin = 13;
                                    break;
                            }
                            GLog("百搭大胡 胡的类型是:"+desc);
                            pi.mjdesc.push(desc);
                            var maFan = 0;//算分
                            var maCount = 0;
                            var isBaoJiu = false;
                            if(pi.type == 2)
                            {
                                pi.mjdesc.push("花调花");
                                baseWin *= 4;
                            }
                            if(pi.type == 1)
                            {
                                pi.mjdesc.push("单调花");
                                baseWin *= 2;
                            }

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maCount = zhongMaNum;
                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            maFan = 2 * maCount;
                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                //抢杠胡 被抢杠者包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);//被抢杠的人下局坐庄
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                //报九张(一定放在最后)
                                if (pi.winType == WinType.pickNormal && pi.baojiu.num == 4) {
                                    isBaoJiu = true;
                                    // pi.baseWin = 1;//都改成1了
                                }

                                if (isBaoJiu  && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]) == pj && (huType == majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE || huType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE || huType == majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU)) {
                                    pj.winone -= baseWin * (tData.maxPlayer - 1);
                                    pi.winone += baseWin * (tData.maxPlayer - 1);
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else if (isBaoJiu && (huType == majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE || huType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE || huType == majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU)) {
                                    pj.winone -= 0;
                                }
                                else
                                {
                                    pi.winone += baseWin;
                                    pj.winone -= baseWin;
                                }

                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                    else if(tData.fanGui && tData.baidajihu)
                    {
                        if (pi.winType > 0) {
                            var num2 = 0;
                            pi.baseWin = 1;
                            var desc = "";
                            //河源百搭 鸡胡  0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺
                            var huType = 0;
                            var baseWin = 0;
                            switch (pi.huType) {
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU:
                                    desc = "鸡胡";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    baseWin = 2
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU:
                                    desc = "碰碰胡";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG:
                                    desc = "混碰";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE:
                                    desc = "大哥";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU:
                                    desc = "幺九";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE:
                                    desc = "字一色";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU:
                                    desc = "全幺九";
                                    baseWin = 2;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    baseWin = 8;
                                    break;
                                case majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI:
                                    desc = "七对";
                                    baseWin = 2;
                                    if(tData.canFan7) baseWin = 4;
                                    break;
                                }


                            GLog("百搭鸡胡 胡的类型是:"+desc);
                            pi.mjdesc.push(desc);

                            var maFan = 0;//算分
                            var maCount = 0;

                            if(pi.type == 2)
                            {
                                pi.mjdesc.push("花调花");
                                baseWin *= 4;
                            }
                            if(pi.type == 1)
                            {
                                pi.mjdesc.push("单调花");
                                baseWin *= 2;
                            }

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maCount = zhongMaNum;
                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            maFan = 2 * maCount;
                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                //抢杠胡 被抢杠者包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);//被抢杠的人下局坐庄
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(pj.uid == tData.uids[tData.curPlayer] && tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }
                }
            }
        }
        else {
            tData.winner = tData.zhuang;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 7)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("河源百搭 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("河源百搭 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(7) != -1)//免费
                    //{
                    //    GLog("河源百搭 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("河源百搭 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }
                else
                {
                    GLog("河源百搭 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForXiangGang(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            horse += (pl.linkHu)*2;
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        else if(tData.withBai)
        {
            if(pl)
            {
                if (!majiang.isHuWithBaiBan(pl) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            // pls[z].left4Ma.length = 0;
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;
                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0) {
                    var num2 = 0;
                    if ((tData.withZhong && pi.mjhand.indexOf(71) != -1) || (tData.withBai && pi.mjhand.indexOf(91) != -1)|| (tData.fanGui && pi.mjhand.indexOf(tData.gui) != -1))
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var desc = "";
                            var huType = majiang.getHuTypeForShenZhenNew(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.SHEN_ZHEN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    pi.baseWin = 1;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    pi.baseWin = 2;
                                    baseWin = 4;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU:
                                    desc = "对对胡";
                                    pi.baseWin = 3;
                                    baseWin = 6;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.FENGYISE:
                                    desc = "风一色";
                                    pi.baseWin = 9;
                                    baseWin = 18;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    pi.baseWin = 13;
                                    baseWin = 26;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASANYUAN:
                                    desc = "大三元";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN:
                                    desc = "小三元";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASIXI:
                                    desc = "大四喜";
                                    pi.baseWin = 16;
                                    baseWin = 32;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI:
                                    desc = "小四喜";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU:
                                    desc = "混一色 对对胡";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DAGE:
                                    desc = "大哥";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                            }

                            if (num2 == 1 && huType != majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "七小对";
                                pi.baseWin = 4;
                                baseWin = 8;
                            }

                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 七小对";
                                pi.baseWin = 9;
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 七小对";
                                pi.baseWin = 6;
                                baseWin = 12;
                            }

                            if (num2 == 2 && huType !=majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "豪华七小对";
                                pi.baseWin = 8;
                                baseWin = 16;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE ) {
                                desc = "混一色 豪华七小对";
                                pi.baseWin = 10;
                                baseWin = 20;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 豪华七小对";
                                pi.baseWin = 13;
                                baseWin = 26;
                            }

                            pi.mjdesc.push(desc);

                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 6 ){
                                    baseWin = (baseWin )  + (6 ) * zhongMaNum
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    pi.baseWin = 1;
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) {//
                                    //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                                    if(pi.mjdesc.indexOf("杠上花") == -1) pi.mjdesc.push("杠上花");
                                }
                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }

                        }
                    }else
                    {
                        if (pi.winType > 0) {
                            pi.baseWin = 1
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var desc = "";
                            var huType = majiang.getHuTypeForShenZhen(pi);
                            var baseWin = 2;
                            switch (huType) {
                                case majiang.SHEN_ZHEN_HUTYPE.PINGHU:
                                    desc = "平胡";
                                    baseWin = 2;
                                    pi.baseWin = 1;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE:
                                    desc = "混一色";
                                    pi.baseWin = 2;
                                    baseWin = 4;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU:
                                    desc = "对对胡";
                                    pi.baseWin = 3;
                                    baseWin = 6;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.QINGYISE:
                                    desc = "清一色";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.FENGYISE:
                                    desc = "风一色";
                                    pi.baseWin = 9;
                                    baseWin = 18;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.SHISANYAO:
                                    desc = "十三幺";
                                    pi.baseWin = 13;
                                    baseWin = 26;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASANYUAN:
                                    desc = "大三元";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN:
                                    desc = "小三元";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DASIXI:
                                    desc = "大四喜";
                                    pi.baseWin = 16;
                                    baseWin = 32;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI:
                                    desc = "小四喜";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU:
                                    desc = "混一色 对对胡";
                                    pi.baseWin = 5;
                                    baseWin = 10;
                                    break;
                                case majiang.SHEN_ZHEN_HUTYPE.DAGE:
                                    desc = "大哥";
                                    pi.baseWin = 8;
                                    baseWin = 16;
                                    break;
                            }

                            if (num2 == 1) {
                                desc = "七小对";
                                pi.baseWin = 4;
                                baseWin = 8;
                            }

                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 七小对";
                                pi.baseWin = 9;
                                baseWin = 18;
                            }
                            if (num2 == 1 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 七小对";
                                pi.baseWin = 6;
                                baseWin = 12;
                            }

                            if (num2 == 2 && huType !=majiang.SHEN_ZHEN_HUTYPE.FENGYISE) {
                                desc = "豪华七小对";
                                pi.baseWin = 8;
                                baseWin = 16;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) {
                                desc = "混一色 豪华七小对";
                                pi.baseWin = 10;
                                baseWin = 20;
                            }
                            if (num2 == 2 && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) {
                                desc = "清一色 豪华七小对";
                                pi.baseWin = 13;
                                baseWin = 26;
                            }

                            pi.mjdesc.push(desc);


                            var maFan = 0;//算分
                            var maCount = 0;

                            var zhongMaNum = majiang.getMaPrice(pi);
                            maFan = 2 * zhongMaNum;
                            maCount = zhongMaNum;

                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                if(tData.maGenDiDuiDuiHu && baseWin >= 6 ){
                                    baseWin = (baseWin )  + (6 ) * zhongMaNum;
                                }
                                else {
                                    baseWin = (baseWin )  + (baseWin  ) * zhongMaNum;
                                }
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;

                                //抢杠胡 杠炮的那个玩家包3家 马钱也包
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    pi.baseWin = 1;
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1 && pj.uid == tData.uids[tData.curPlayer]) pj.mjdesc.push("包两家");
                                }
                                else {
                                    baseWin = baseWin;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1 ) {//
                                    //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                                    if(pi.mjdesc.indexOf("杠上花") == -1) pi.mjdesc.push("杠上花");
                                }

                                pi.winone += baseWin;
                                pj.winone -= baseWin;
                            }

                            if(maCount > 0) pi.mjdesc.push("买马" + maCount);
                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                }
            }
        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 9)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("深圳 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("深圳 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(3) != -1)//免费
                    //{
                    //    GLog("深圳 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("深圳 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }else
                {
                    GLog("深圳 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGameForZuoPaiTuiDaoHu(tb, pl, byEndRoom) {
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            horse += (pl.linkHu)*2;
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if ((tData.fanGui || tData.withZhong )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        else if ((tData.fanGui || tData.withBai )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            //pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);
            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if(ganguid >= 0)
                        {
                            pj.winone -= (tData.maxPlayer - 1);
                            pj.mjdesc.push("点杠");
                        }
                        else pj.winone -= 1;
                    }
                }
            }
            if (pi.mjgang1.length > 0) pi.mjdesc.push(pi.mjgang1.length + "暗杠");
            var gangWin = pi.mjgang1.length * 2;
            for (var j = 0; j < pls.length; j++) {
                if (j != i) {
                    var pj = pls[j];
                    pj.winone -= gangWin;
                }
            }
        }
        //没人胡 就黄庄
        if (!pl && !tData.huangZhuangSuanGang) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.winone = 0;
            }
        }

        //计算跟庄的分数 庄家输分 给其他玩家
        var zhuangPl = tb.players[tData.uids[tData.zhuang]];
        if(zhuangPl.genZhuang.genZhuangNum >= 1)
        {
            zhuangPl.winone -= (tData.maxPlayer - 1);
            for(var i = 0; i < pls.length; i++)
            {
                var otherPl = pls[i];
                if(otherPl.uid == zhuangPl.uid)
                    continue;
                otherPl.winone += 1;
            }
            //zhuangPl.mjdesc.push("跟庄");
        }

        if (pl) {
            tData.winner = tData.uids.indexOf(pl.uid);
            //算胡
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                if(pi.winType > 0){
                    if(
                        (tData.withZhong && pi.mjhand.indexOf(71)!= -1) ||
                        (tData.withBai && pi.mjhand.indexOf(91) != -1) ||
                        (tData.fanGui &&(pi.mjhand.indexOf(tData.gui)!= -1 || (tData.twogui && pi.mjhand.indexOf(tData.nextgui)!= -1) ) )
                    )
                    {
                        if (pi.winType > 0) {
                            var num2 = 0;
                            if(pi.huType == 7 || pi.huType == 8) num2 = 1;
                            if (num2 == 1 && (majiang.canGang1([], pi.mjhand, []).length > 0 || majiang.canPengForQiDui(pi.mjhand).length > 0))num2 = 2;
                            var num3 = majiang.All3New(pi);//0 1大对碰 2 含风大对碰
                            var orignOne = {};
                            orignOne.mjhand = pi.mjhand;
                            orignOne.mjpeng = pi.mjpeng;
                            orignOne.mjgang0 = pi.mjgang0;
                            orignOne.mjgang1 = pi.mjgang1;
                            orignOne.mjchi = pi.mjchi;
                            orignOne.huType = pi.huType;

                            var plOne = majiang.deepCopy(orignOne);
                            Array.prototype.insert = function (index, item) {
                                this.splice(index, 0, item);
                            };
                            var deletPai = 111;
                            for(var l  =0;l<plOne.mjhand.length;l++)
                            {

                                if(majiang.isEqualHunCard(plOne.mjhand[l]))
                                {
                                    deletPai= deletPai + 10;
                                    plOne.mjhand.splice(l,1);
                                    plOne.mjhand.insert(l,deletPai);
                                }
                            }
                            //var shouPai = "";
                            //for(var p =0;p<plOne.mjhand.length;p++)
                            //{
                            //    shouPai = shouPai+plOne.mjhand[p] + ",";
                            //}
                            //GLog("shouPai=============" + shouPai);

                            var sameColor = majiang.SameColorNewForZuoPai(plOne);
                            var hunyise = majiang.HunYiSeNewForZuoPai(plOne);
                            var ziYiSe = majiang.ziYiSeNewForTuiDaoHu(plOne);
                            var zaYaoJiu =  majiang.zaYaoJiu(plOne);
                            var qingYaoJiu = majiang.qingYaoJiu(plOne);
                            var quanYaoJiu = majiang.quanYaoJiu(plOne);
                            var baseWin = 2;
                            var judgeType = 0;
                            var des = "";
                             if (!tData.noBigWin) {

                                 if(pi.huType == 13)
                                 {
                                     des = "十三幺";
                                     judgeType = 1;
                                     if(tData.shiSanYaoFanNum > 0)
                                     {
                                         baseWin = baseWin * 8;
                                     }
                                 }
                                if (sameColor && num2 != 2 && num2!=1 && num3!= 1 && num3 != 2 )
                                {
                                    des = "清一色";
                                    judgeType = 1;
                                    if(tData.qingYiSeFanNum >0)
                                        baseWin = baseWin * 4;
                                }
                                 if (hunyise && num2 != 2 && num2!=1 && num3!= 1 && num3 != 2 && pi.huType != 13) {
                                     des = "混一色";
                                     judgeType = 1;
                                 }
                                if ((num3 == 1 || num3 == 2) && pi.huType != 8) {
                                    des = "碰碰胡";
                                    judgeType = 1;
                                    //只是碰碰胡
                                    if(!hunyise && !sameColor && !ziYiSe && !zaYaoJiu && !qingYaoJiu && !quanYaoJiu)
                                    {
                                        if(tData.pengPengHuFanNum >0)
                                        {
                                            baseWin = baseWin * 2;
                                        }
                                    }
                                    else if(ziYiSe)
                                    {
                                        des = "字一色";
                                        judgeType = 1;
                                        if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum > 0)
                                        {
                                            baseWin = baseWin * 8;
                                            //des = "字一色";
                                        }
                                        else if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum == 0)
                                        {
                                            baseWin = baseWin * 2;
                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "字一色";
                                        }
                                    }
                                    else if(qingYaoJiu || zaYaoJiu || quanYaoJiu)
                                    {
                                        des = "幺九";
                                        if(tData.yaoJiuFanNum > 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            des = "幺九";
                                            baseWin = baseWin * 6;
                                        }
                                        else if(tData.yaoJiuFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            baseWin = baseWin * 2;
                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "幺九";
                                        }
                                    }
                                    else if(hunyise || sameColor)
                                    {
                                        if(sameColor)
                                        {
                                            des = "清碰";
                                            judgeType = 1;
                                            if(tData.qingYiSeFanNum >0 && (tData.pengPengHuFanNum > 0 || tData.pengPengHuFanNum == 0 ))
                                            {
                                                baseWin = baseWin * 4;
                                                //des = "清一色";
                                            }
                                            else if(tData.qingYiSeFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                            {
                                                baseWin = baseWin * 2;
                                                //des = "碰碰胡";
                                            }
                                            else
                                            {
                                                des = "清碰";
                                            }
                                        }
                                        else
                                        {
                                            if(hunyise)
                                            {
                                                judgeType = 1;
                                                des = "混碰";
                                                if(tData.pengPengHuFanNum > 0)
                                                {
                                                    baseWin = baseWin * 2;
                                                    //des = "碰碰胡";
                                                }
                                                else
                                                {
                                                    des = "混碰";
                                                }
                                            }
                                        }

                                    }


                                    judgeType = 1;
                                }
                                else if((num3 == 1 || num3 == 2) && pi.huType == 8)
                                {
                                    des = "碰碰胡";
                                    judgeType = 1;
                                    //只是碰碰胡
                                    if(!hunyise && !sameColor && !ziYiSe && !zaYaoJiu && !qingYaoJiu && !quanYaoJiu)
                                    {
                                        if(num2 > 0  && tData.qxdfbNum > 0)
                                        {
                                            des = ( num2 > 1 ? "龙七对" : "七对");
                                            baseWin *= 4;
                                        }
                                        else
                                        {
                                            if(tData.pengPengHuFanNum >0)
                                            {
                                                baseWin = baseWin * 2;
                                            }
                                        }
                                    }
                                    else if(ziYiSe)
                                    {
                                        des = "字一色";
                                        judgeType = 1;
                                        if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum > 0)
                                        {
                                            baseWin = baseWin * 8;
                                            //des = "字一色";
                                        }
                                        else if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum == 0)
                                        {
                                            if(num2 > 0  && tData.qxdfbNum > 0)
                                            {
                                                des = ( num2 > 1 ? "龙七对" : "七对");
                                                baseWin *= 4;
                                            }
                                            else
                                            {
                                                baseWin = baseWin * 2;
                                            }
                                        }
                                        else
                                        {
                                            if(num2 > 0  && tData.qxdfbNum > 0)
                                            {
                                                des = ( num2 > 1 ? "龙七对" : "七对");
                                                baseWin *= 4;
                                            }
                                        }
                                    }
                                    else if(qingYaoJiu || zaYaoJiu || quanYaoJiu)
                                    {
                                        des = "幺九";
                                        if(tData.yaoJiuFanNum > 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            des = "幺九";
                                            baseWin = baseWin * 6;
                                        }
                                        else if(tData.yaoJiuFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                        {

                                            if(num2 > 0  && tData.qxdfbNum > 0)
                                            {
                                                des = ( num2 > 1 ? "龙七对" : "七对");
                                                baseWin *= 4;
                                            }
                                            else
                                            {
                                                baseWin = baseWin * 2;
                                            }

                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            if(num2 > 0  && tData.qxdfbNum > 0)
                                            {
                                                des = ( num2 > 1 ? "龙七对" : "七对");
                                                baseWin *= 4;
                                            }
                                        }
                                    }
                                    else if(hunyise || sameColor)
                                    {
                                        if(sameColor)
                                        {
                                            des = "清碰";
                                            judgeType = 1;
                                            if(tData.qingYiSeFanNum >0 && (tData.pengPengHuFanNum > 0 || tData.pengPengHuFanNum == 0 ))
                                            {
                                                baseWin = baseWin * 4;
                                                //des = "清一色";
                                            }
                                            else if(tData.qingYiSeFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                            {
                                                baseWin = baseWin * 2;
                                                //des = "碰碰胡";
                                            }
                                            else
                                            {
                                                des = "清碰";
                                            }
                                        }
                                        else
                                        {
                                            if(hunyise)
                                            {
                                                judgeType = 1;
                                                des = "混碰";
                                                if(tData.pengPengHuFanNum > 0)
                                                {
                                                    baseWin = baseWin * 2;
                                                    //des = "碰碰胡";
                                                }
                                                else
                                                {
                                                    des = "混碰";
                                                }
                                            }
                                        }

                                    }


                                    judgeType = 1;
                                }
                                if (des != "")    pi.mjdesc.push(des);
                                //判断 7对 普通7对 有杠龙7对
                                if (pi.huType == 7 && pi.huType != 8) {
                                    pi.mjdesc.push(num2 > 1 ? "龙七对" : "七对");
                                    judgeType = 1;
                                }
                                if (judgeType == 0) {
                                    pi.mjdesc.push("平胡");
                                }

                                //天胡
                                if (
                                    (
                                        (tData.cardNext == 53 && tData.maxPlayer == 4) ||
                                        (tData.cardNext == 40 && tData.maxPlayer == 3)
                                    )
                                    && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
                                    pi.mjdesc.push("天胡");
                                    judgeType = 1;
                                }
                                //地胡
                                else if (tb.AllPlayerCheck(function (pl) {
                                        return pl.mjpeng.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang0.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang1.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjchi.length == 0
                                    }) &&
                                    pi.mjhand.length == 14 &&
                                    (pi.picknum == 0 || pi.picknum == 1) &&
                                    pi.mjput.length == 0) {
                                    pi.mjdesc.push("地胡");
                                    judgeType = 1;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1) {
                                    pi.mjdesc.push("杠爆");
                                    judgeType = 1;
                                }


                            }

                            if(pi.huType == 7 && pi.huType != 8 && tData.qxdfbNum > 0){
                                baseWin *= 4;
                            }
                            if(pi.gangBao && tData.gangBaoFanNum > 0)
                            {
                                baseWin *= 2;
                            }
                            if(pi.haiDiHu && tData.haiDiHuFanNum > 0)
                            {
                                GLog("海底胡 分数翻倍了");
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }

                            pi.baseWin = 1
                            var maFan = 0;//算分
                            var maCount = 0;
                            var zhongMaNum = 0;
                            if(!tData.baozhama && tData.horse >= 2 ) zhongMaNum = majiang.getMaPrice(pi);
                            else zhongMaNum = majiang.getMaCountsForBaoZhaMa(tb.cards[tData.cardNext]);

                            //鬼牌模式 手牌无鬼 分翻倍
                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;

                            maCount = zhongMaNum;
                            if (maCount > 0) pi.mjdesc.push("买马" + maCount);
                            maFan = 2 * maCount;
                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                var roundWin = 1;
                                //抢杠胡 包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);
                                    judgeType = 1;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else if(pi.winType == WinType.pickGang1)
                                {
                                    if(tData.gangBaoQuanBao)
                                    {
                                        if (pj.uid != tData.uids[tData.lastPutPlayer]) continue;
                                        judgeType = 1;
                                        baseWin = baseWin * (tData.maxPlayer - 1);
                                        if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                        if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                    }
                                }
                                else {
                                    baseWin = baseWin
                                    pi.baseWin = 1;
                                }

                                pi.winone += roundWin * baseWin;
                                pj.winone -= roundWin * baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                    else
                    {
                        if (pi.winType > 0) {
                            var num2 = pi.huType == 7 ? 1 : 0;
                            if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                            var num3 = majiang.All3(pi);//0 1大对碰 2 含风大对碰
                            var orignOne = {};
                            orignOne.mjhand = pi.mjhand;
                            orignOne.mjpeng = pi.mjpeng;
                            orignOne.mjgang0 = pi.mjgang0;
                            orignOne.mjgang1 = pi.mjgang1;
                            orignOne.mjchi = pi.mjchi;
                            orignOne.huType = pi.huType;

                            var plOne = majiang.deepCopy(orignOne);

                            var shiSanYao = majiang.shiSanYao(plOne);
                            var sameColor = majiang.SameColor(plOne);
                            var hunyise = majiang.HunYiSe(plOne);
                            var ziYiSe = majiang.ziYiSe(plOne);
                            var zaYaoJiu =  majiang.zaYaoJiu(plOne);
                            var qingYaoJiu = majiang.qingYaoJiu(plOne);
                            var quanYaoJiu = majiang.quanYaoJiu(plOne);
                            var baseWin = 2;
                            var judgeType = 0;
                            if (!tData.noBigWin) {
                                var des = "";
                                if(shiSanYao)
                                {
                                    des = "十三幺";
                                    judgeType = 1;
                                    if(tData.shiSanYaoFanNum > 0)
                                    {
                                        baseWin = baseWin * 8;
                                    }
                                }
                                if (sameColor && num2 != 2 && num2!=1 && num3!= 1 && num3 != 2)
                                {
                                    des = "清一色";
                                    judgeType = 1;
                                    if(tData.qingYiSeFanNum >0)
                                        baseWin = baseWin * 4;
                                }
                                if (hunyise && num2 != 2 && num2!=1 && num3!= 1 && num3 != 2) {
                                    des = "混一色";
                                    judgeType = 1;
                                }
                                if (num3 == 1 || num3 == 2) {
                                    //des = "碰碰胡";
                                    //if (sameColor) des = "清碰";
                                    //
                                    //if (hunyise) des = "混碰";
                                    judgeType = 1;
                                    des = "碰碰胡";
                                    //只是碰碰胡
                                    if(!hunyise && !sameColor && !ziYiSe && !zaYaoJiu && !qingYaoJiu && !quanYaoJiu)
                                    {
                                        if(tData.pengPengHuFanNum >0)
                                        {
                                            baseWin = baseWin * 2;
                                        }
                                    }
                                    else if(ziYiSe)
                                    {
                                        des = "字一色";
                                        if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum > 0)
                                        {
                                            baseWin = baseWin * 8;
                                            des = "字一色";
                                        }
                                        else if(tData.pengPengHuFanNum > 0 && tData.ziYiSeFanNum == 0)
                                        {
                                            baseWin = baseWin * 2;
                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "字一色";
                                        }
                                    }
                                    else if(qingYaoJiu || zaYaoJiu || quanYaoJiu)
                                    {
                                        des = "幺九";
                                        if(tData.yaoJiuFanNum > 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            des = "幺九";
                                            baseWin = baseWin * 6;
                                        }
                                        else if(tData.yaoJiuFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            baseWin = baseWin * 2;
                                           // des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "幺九";
                                        }
                                    }
                                    else if(hunyise)
                                    {
                                        des = "混碰";
                                        if(tData.pengPengHuFanNum > 0)
                                        {
                                            baseWin = baseWin * 2;
                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "混碰";
                                        }
                                    }
                                    else if(sameColor)
                                    {
                                        des = "清碰";
                                        if(tData.qingYiSeFanNum >0 && (tData.pengPengHuFanNum > 0 || tData.pengPengHuFanNum == 0 ))
                                        {
                                            baseWin = baseWin * 4;
                                            //des = "碰碰胡";
                                        }
                                        else if(tData.qingYiSeFanNum == 0 && tData.pengPengHuFanNum > 0 )
                                        {
                                            baseWin = baseWin * 2;
                                            //des = "碰碰胡";
                                        }
                                        else
                                        {
                                            des = "清碰";
                                        }
                                    }


                                }
                                if (des != "")    pi.mjdesc.push(des);
                                //判断 7对 普通7对 有杠龙7对
                                if (num2 > 0) {
                                    pi.mjdesc.push(num2 > 1 ? "龙七对" : "七对");
                                    judgeType = 1;
                                }
                                if (judgeType == 0) {
                                    pi.mjdesc.push("平胡");
                                }

                                //天胡
                                if (
                                    (
                                        (tData.cardNext == 53 && tData.maxPlayer == 4) ||
                                        (tData.cardNext == 40 && tData.maxPlayer == 3)
                                    )
                                    && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
                                    pi.mjdesc.push("天胡");
                                    judgeType = 1;
                                }
                                //地胡
                                else if (tb.AllPlayerCheck(function (pl) {
                                        return pl.mjpeng.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang0.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjgang1.length == 0
                                    }) &&
                                    tb.AllPlayerCheck(function (pl) {
                                        return pl.mjchi.length == 0
                                    }) &&
                                    pi.mjhand.length == 14 &&
                                    (pi.picknum == 0 || pi.picknum == 1) &&
                                    pi.mjput.length == 0) {
                                    pi.mjdesc.push("地胡");
                                    judgeType = 1;
                                }

                                if (pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1) {
                                    pi.mjdesc.push("杠爆");
                                    judgeType = 1;
                                }


                            }

                            if(num2 > 0 && tData.qxdfbNum > 0){
                                baseWin *= 4;
                            }

                            if(pi.gangBao && tData.gangBaoFanNum > 0)
                            {
                                baseWin *= 2;
                            }
                            if(pi.haiDiHu && tData.haiDiHuFanNum > 0)
                            {
                                GLog("海底胡 分数翻倍了");
                                baseWin *= 2;
                                pi.mjdesc.push("海底胡");
                            }
                            pi.baseWin = 1
                            var maFan = 0;//算分
                            var maCount = 0;
                            var zhongMaNum = 0;
                            if(!tData.baozhama && tData.horse >= 2 ) zhongMaNum = majiang.getMaPrice(pi);
                            else zhongMaNum = majiang.getMaCountsForBaoZhaMa(tb.cards[tData.cardNext]);

                            if (!majiang.isFindGuiForMjhand(pi.mjhand) && tData.guiJiaBei) baseWin *= 2;
                            maCount = zhongMaNum;
                            if (maCount > 0) pi.mjdesc.push("买马" + maCount);
                            maFan = 2 * maCount;
                            if(tData.maGenDi)
                            {
                                //公式 分数 = （底分） + （底分）*马数
                                baseWin = (baseWin)  + (baseWin) * zhongMaNum;
                            }
                            else{
                                if (maCount > 0) baseWin = baseWin + maFan;
                            }

                            for (var j = 0; j < pls.length; j++) {
                                var pj = pls[j];
                                if (pj.winType > 0) continue;
                                var roundWin = 1;
                                //抢杠胡 包3家
                                if (pi.winType == WinType.eatGang) {
                                    if (pj.uid != tData.uids[tData.curPlayer]) continue;
                                    tData.winner = tData.uids.indexOf(pj.uid);
                                    judgeType = 1;
                                    baseWin = baseWin * (tData.maxPlayer - 1);
                                    if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                                    if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                    if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                }
                                else if(pi.winType == WinType.pickGang1)
                                {
                                    if(tData.gangBaoQuanBao)
                                    {
                                        if (pj.uid != tData.uids[tData.lastPutPlayer]) continue;
                                        judgeType = 1;
                                        baseWin = baseWin * (tData.maxPlayer - 1);
                                        if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                                        if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                                    }
                                }
                                else {
                                    baseWin = baseWin;
                                    pi.baseWin = 1;
                                }
                                pi.winone += roundWin * baseWin;
                                pj.winone -= roundWin * baseWin;
                            }

                            if (maCount >= 0) {
                                pi.zhongMaNum = maCount;
                            }
                        }
                    }
                }

            }

        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                GLog("freeGameTypes.length========" + freeGameTypes.length);
                if(freeGameTypes.length > 0)
                {
                    var ceshi ="";
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        ceshi += freeGameTypes[i] + ",";
                    }
                    GLog("免费玩法："+ ceshi );
                    var isMianFei = false;
                    for(var i=0;i<freeGameTypes.length;i++)
                    {
                        if(freeGameTypes[i] == 10)
                        {
                            isMianFei = true;
                            break;
                        }
                    }
                    if(isMianFei)
                    {
                        GLog("做牌推到胡 免费");
                        owner.$inc = {money: 0};
                    }
                    else
                    {
                        GLog("做牌推到胡 扣费");
                        owner.$inc = {money: -tb.createPara.money};
                    }
                    //if(freeGameTypes.indexOf(1) != -1)//免费
                    //{
                    //    GLog("广州 免费");
                    //    owner.$inc = {money: 0};
                    //}else
                    //{
                    //    GLog("广州 扣费");
                    //    owner.$inc = {money: -tb.createPara.money};
                    //}
                }
                else
                {
                    GLog("做牌推到胡 扣费1");
                    owner.$inc = {money: -tb.createPara.money};
                }
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                }
            });

        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;
            if(p.winType > 0)
            {
                p.winTotalNum ++;
                p.zhongMaTotalNum += p.zhongMaNum;
            }
            p.mingGangTotalNum += p.mjgang0.length;
            p.anGangTotalNum += p.mjgang1.length;
        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum','danDiaoHua','huaDiaoHua','genZhuang'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
    }

    function EndGame(tb, pl, byEndRoom) {
        switch (tb.tData.gameType) {
            case GamesType.GANG_DONG:
                EndGameForGangDong(tb, pl, byEndRoom);
                break;
            case GamesType.HUI_ZHOU:
                EndGameForHuiZhou(tb, pl, byEndRoom);
                break;
            case GamesType.SHEN_ZHEN:
                EndGameForShenZhen(tb, pl, byEndRoom);
                break;
            case GamesType.JI_PING_HU:
                EndGameForJiPingHu(tb,pl,byEndRoom);
                break;
            case GamesType.DONG_GUAN:
                EndGameForDongGuan(tb,pl,byEndRoom);
                break;
            case GamesType.YI_BAI_ZHANG:
                EndGameForYiBaiZhuang(tb,pl,byEndRoom);
                break;
            case GamesType.CHAO_ZHOU:
                EndGameForChaoZhou(tb, pl, byEndRoom);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                EndGameForHeYuanBaiDaXinXuQiu(tb,pl,byEndRoom);
                break;
            case GamesType.XIANG_GANG:
                EndGameForXiangGang(tb, pl, byEndRoom);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                EndGameForZuoPaiTuiDaoHu(tb,pl,byEndRoom);
                break;
        }
    }

    Table.prototype.MJTick = function (pl, msg, session, next) {
        next(null, null);
        var rtn = {serverNow: Date.now()};
        pl.mjTickAt = rtn.serverNow;
        pl.tickType = msg.tickType;
        rtn.players = this.PlayerPtys(function (p) {
            return {mjTickAt: p.mjTickAt, tickType: p.tickType}
        });
        this.NotifyAll("MJTick", rtn);
    }

    function MJPutForShenZhen(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                pl.mjhand.splice(cdIdx, 1);
                pl.mjput.push(msg.card);
                pl.skipHu = false;
                msg.uid = pl.uid;
                tData.lastPut = msg.card;
                tData.lastPutPlayer = tData.curPlayer;
                tData.tState = TableState.waitEat;
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;//自己不能吃

                if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                self.AllPlayerRun(function (p) {
                    if (p != pl) {
                        p.eatFlag = GetEatFlag(p, tData,self);
                        if (p.eatFlag != 0) {
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            p.mjState = TableState.waitCard;
                        }
                    }
                });
                var cmd = msg.cmd;
                delete msg.cmd;
                msg.putType = tData.putType;
                self.NotifyAll(cmd, msg);
                self.mjlog.push(cmd, msg);//打牌
                SendNewCard(self);//打牌后尝试发牌
            }
        }
    }

    function MJPutForGangDong(pl, msg, self) {
        var tData = self.tData;
        if(tData.genZhuang && msg.card >0 )
        {
            if(tData.uids[tData.zhuang] == pl.uid)//记录庄家 打的牌
            {
                pl.genZhuang.pai = msg.card;
                pl.genZhuang.paiNum = 1;
            }
            else
            {
                var zhuangPl = self.players[tData.uids[tData.zhuang]];
                if(msg.card == zhuangPl.genZhuang.pai)
                {
                    zhuangPl.genZhuang.paiNum ++;
                }
                if(zhuangPl.genZhuang.paiNum >= tData.maxPlayer)
                {
                    zhuangPl.genZhuang.genZhuangNum ++;
                    GLog("跟庄次数:" + zhuangPl.genZhuang.genZhuangNum);
                    self.NotifyAll('MJGenZhuang', {uid: zhuangPl.uid, genZhuang: zhuangPl.genZhuang});
                }
            }
        }
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                if (self.tData.zhongIsMa && msg.card == 71) {
                    pl.mjzhong.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 6;//红中
                    self.NotifyAll('MJZhong', {uid: pl.uid, card: msg.card});
                    self.mjlog.push('MJZhong', {uid:pl.uid, card:msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    SendNewCard(self); //尝试补牌
                }
                else
                {
                    pl.mjhand.splice(cdIdx, 1);
                    pl.mjput.push(msg.card);
                    pl.skipHu = false;
                    msg.uid = pl.uid;
                    tData.lastPut = msg.card;
                    tData.lastPutPlayer = tData.curPlayer;
                    tData.tState = TableState.waitEat;
                    pl.mjState = TableState.waitCard;
                    pl.eatFlag = 0;//自己不能吃

                    if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                    self.AllPlayerRun(function (p) {
                        if (p != pl) {
                            p.eatFlag = GetEatFlag(p, tData,self);
                            if (p.eatFlag != 0) {
                                p.mjState = TableState.waitEat;
                            }
                            else {
                                p.mjState = TableState.waitCard;
                            }
                        }
                    });
                    var cmd = msg.cmd;
                    delete msg.cmd;
                    msg.putType = tData.putType;
                    self.NotifyAll(cmd, msg);
                    self.mjlog.push(cmd, msg);//打牌
                    SendNewCard(self);//打牌后尝试发牌
                }
            }
        }
    }

    function MJPutForDongGuan(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                if (self.tData.zhongIsMa && msg.card == 71) {
                    pl.mjzhong.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 6;//红中
                    self.NotifyAll('MJZhong', {uid: pl.uid, card: msg.card});
                    self.mjlog.push('MJZhong', {uid:pl.uid, card:msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    SendNewCard(self); //尝试补牌
                }else{
                    pl.mjhand.splice(cdIdx, 1);
                    pl.skipPeng = [];
                    pl.mjput.push(msg.card);
                    pl.skipHu = false;
                    msg.uid = pl.uid;
                    tData.lastPut = msg.card;
                    tData.lastPutPlayer = tData.curPlayer;
                    tData.tState = TableState.waitEat;
                    pl.mjState = TableState.waitCard;
                    pl.eatFlag = 0;//自己不能吃

                    if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                    self.AllPlayerRun(function (p) {
                        if (p != pl) {
                            p.eatFlag = GetEatFlag(p, tData,self);
                            if (p.eatFlag == 2 && p.skipPeng.indexOf(msg.card) != -1) //过碰
                                p.eatFlag = 0;

                            if (p.eatFlag != 0) {
                                p.mjState = TableState.waitEat;
                            }
                            else {
                                p.mjState = TableState.waitCard;
                            }
                        }
                    });
                    var cmd = msg.cmd;
                    delete msg.cmd;
                    msg.putType = tData.putType;
                    self.NotifyAll(cmd, msg);
                    self.mjlog.push(cmd, msg);//打牌
                    SendNewCard(self);//打牌后尝试发牌
                }
            }
        }
    }

    function MJPutForHuiZhou(pl, msg, self) {
        var tData = self.tData;
        GLog("MJPutForHuiZhou 现在要打牌的人:" + pl.uid + "打出的牌是:" + msg.card );
        if(tData.genZhuang && msg.card >0 )
        {
            if(tData.uids[tData.zhuang] == pl.uid)//记录庄家 打的牌
            {
                pl.genZhuang.pai = msg.card;
                pl.genZhuang.paiNum = 1;
            }
            else
            {
                var zhuangPl = self.players[tData.uids[tData.zhuang]];
                if(msg.card == zhuangPl.genZhuang.pai)
                {
                    zhuangPl.genZhuang.paiNum ++;
                }
                if(zhuangPl.genZhuang.paiNum >= tData.maxPlayer)
                {
                    zhuangPl.genZhuang.genZhuangNum ++;
                    GLog("跟庄次数:" + zhuangPl.genZhuang.genZhuangNum);
                    self.NotifyAll('MJGenZhuang', {uid: zhuangPl.uid, genZhuang: zhuangPl.genZhuang});
                }
            }
        }
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            if(tData.checkRoleFlowerType >= tData.maxPlayer)
            {
                GLog("开始正常打牌了")
                if( msg.card > 0) {
                    var cdIdx = pl.mjhand.indexOf(msg.card);
                    if (cdIdx >= 0) {
                        if (majiang.isFlower8(msg.card)) {
                            pl.mjflower.push(msg.card);
                            pl.mjhand.splice(cdIdx, 1);
                            tData.putType = 5;//花牌
                            self.NotifyAll('MJFlower', {uid: pl.uid, card: msg.card});
                            self.AllPlayerRun(function (pl) {
                                pl.mjState = TableState.waitCard;
                            });
                            SendNewCard(self); //尝试补牌
                        }
                        else {
                            pl.mjhand.splice(cdIdx, 1);
                            pl.skipPeng = [];
                            pl.mjput.push(msg.card);
                            pl.skipHu = false;
                            msg.uid = pl.uid;
                            tData.lastPut = msg.card;
                            tData.lastPutPlayer = tData.curPlayer;
                            tData.tState = TableState.waitEat;
                            pl.mjState = TableState.waitCard;
                            pl.eatFlag = 0;//自己不能吃

                            if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                            self.AllPlayerRun(function (p) {
                                if (p != pl) {
                                    p.eatFlag = GetEatFlag(p, tData,self);

                                    if (p.eatFlag == 2 && p.skipPeng.indexOf(msg.card) != -1) //过碰
                                        p.eatFlag = 0;
                                    if (p.eatFlag == 8 && p.skipHu)
                                        p.eatFlag = 0;

                                    if (p.eatFlag != 0) p.mjState = TableState.waitEat;
                                    else p.mjState = TableState.waitCard;

                                }
                            });
                            var cmd = msg.cmd;
                            delete msg.cmd;
                            msg.putType = tData.putType;
                            self.NotifyAll(cmd, msg);
                            self.mjlog.push(cmd, msg);//打牌
                            SendNewCard(self);//打牌后尝试发牌
                        }
                    }

                }

            }
            else{
                GLog("正在补花的人:"+pl.uid + "打出的牌:" + msg.card);
                if(pl.mjflower_puting.length > 0 && msg.card > 0) {
                    var cdFlowerIdx=pl.mjflower_puting.indexOf(msg.card);//检测 要打出的花牌数组是否有花牌 有打出 没有的花 进行下家
                    if(cdFlowerIdx>=0)
                    {
                        var cdIdx=pl.mjhand.indexOf(msg.card);
                        if(cdIdx >= 0 ){
                            pl.mjhand.splice(cdIdx, 1);	//删掉手中花牌
                        }

                        pl.mjflower.push(msg.card); //放入花牌数组
                        pl.mjflower_puting.splice(cdFlowerIdx, 1); //删掉等待打出花牌

                        tData.putType = 5;//花牌

                        self.NotifyAll('MJFlower', {uid: pl.uid, card: msg.card});
                        self.mjlog.push('MJFlower', {uid:pl.uid, card:msg.card});

                        self.AllPlayerRun(function (pl) {
                            pl.mjState = TableState.waitCard;
                        });
                        SendNewCard(self); //尝试补牌
                    }
                }
                else{

                    if(pl.mjflower_puting.length == 0 && 1 != pl.checkFlowerType){ //当前玩家没有花牌要补了
                        pl.checkFlowerType = 1;
                        ++tData.checkRoleFlowerType;
                        GLog("此人"+pl.uid + "补花已结束。 tData.checkRoleFlowerType=="+tData.checkRoleFlowerType);
                    }

                    tData.curPlayer=(tData.curPlayer + 1) % tData.maxPlayer;	//还有需要补花的 玩家 进行下家
                    var plTemp = self.players[tData.uids[tData.curPlayer]];
                    if(plTemp.mjflower_puting.length > 0){
                        GLog("下家需要补花 uid = " + plTemp.uid);
                    }
                    //else if(1 != plTemp.checkFlowerType){
                    //    plTemp.checkFlowerType = 1;
                    //    ++tData.checkRoleFlowerType;	//等于四说明没有玩家需要检测花牌了
                    //    if(tData.checkRoleFlowerType == tData.maxPlayer){ //检测其他玩家是否需要再次补花
                    //        tData.curPlayer = tData.zhuang;
                    //        tData.tState = TableState.waitPut;
                    //        plTemp.mjState = TableState.waitCard;
                    //        plTemp.mjState = TableState.waitPut;
                    //        tData.putType = 0;
                    //    }
                    //}

                    GLog(tData.checkRoleFlowerType+" -----------------tData.checkRoleFlowerType");
                    self.NotifyAll('MJFlower1', {curPlayer: tData.curPlayer, card: -2,checkRoleFlowerType:tData.checkRoleFlowerType});
                }
            }
        }
    }

    function MJPutForJiPingHu(pl, msg, self){
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                if (majiang.isFlower8(msg.card)) {
                    pl.mjflower.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 5;//花牌
                    self.NotifyAll('MJFlower', {uid: pl.uid, card: msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    SendNewCard(self); //尝试补牌
                } else {
                    pl.mjhand.splice(cdIdx, 1);
                    pl.skipPeng = [];
                    pl.mjput.push(msg.card);
                    pl.skipHu = false;
                    msg.uid = pl.uid;
                    tData.lastPut = msg.card;
                    tData.lastPutPlayer = tData.curPlayer;
                    tData.tState = TableState.waitEat;
                    pl.mjState = TableState.waitCard;
                    pl.eatFlag = 0;//自己不能吃

                    if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                    self.AllPlayerRun(function (p) {
                        if (p != pl) {
                            p.eatFlag = GetEatFlag(p, tData);

                            if (p.eatFlag == 2 && p.skipPeng.indexOf(msg.card) != -1) //过碰
                                p.eatFlag = 0;
                            if (p.eatFlag == 8 && p.skipHu)
                                p.eatFlag = 0;

                            if (p.eatFlag != 0) p.mjState = TableState.waitEat;
                            else p.mjState = TableState.waitCard;

                        }
                    });
                    var cmd = msg.cmd;
                    delete msg.cmd;
                    msg.putType = tData.putType;
                    self.NotifyAll(cmd, msg);
                    self.mjlog.push(cmd, msg);//打牌
                    SendNewCard(self);//打牌后尝试发牌
                }
            }
        }
    }

    function MJPutForYiBaiZhuang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                {
                    pl.mjhand.splice(cdIdx, 1);
                    pl.mjput.push(msg.card);
                    pl.skipHu = false;
                    msg.uid = pl.uid;
                    tData.lastPut = msg.card;
                    tData.lastPutPlayer = tData.curPlayer;
                    tData.tState = TableState.waitEat;
                    pl.mjState = TableState.waitCard;
                    pl.eatFlag = 0;//自己不能吃

                    if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                    self.AllPlayerRun(function (p) {
                        if (p != pl) {
                            p.eatFlag = GetEatFlag(p, tData,self);
                            if (p.eatFlag != 0) {
                                p.mjState = TableState.waitEat;
                            }
                            else {
                                p.mjState = TableState.waitCard;
                            }
                        }
                    });
                    var cmd = msg.cmd;
                    delete msg.cmd;
                    msg.putType = tData.putType;
                    self.NotifyAll(cmd, msg);
                    self.mjlog.push(cmd, msg);//打牌
                    SendNewCard(self);//打牌后尝试发牌
                }
            }
        }
    }

    function MJPutForChaoZhou(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                pl.mjhand.splice(cdIdx, 1);
                pl.mjput.push(msg.card);
                pl.skipHu = false;
                msg.uid = pl.uid;
                tData.lastPut = msg.card;
                tData.lastPutPlayer = tData.curPlayer;
                tData.tState = TableState.waitEat;
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;//自己不能吃

                if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                self.AllPlayerRun(function (p) {
                    if (p != pl) {
                        p.eatFlag = GetEatFlag(p, tData,self);
                        if (p.eatFlag != 0) {
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            p.mjState = TableState.waitCard;
                        }
                    }
                });
                var cmd = msg.cmd;
                delete msg.cmd;
                msg.putType = tData.putType;
                self.NotifyAll(cmd, msg);
                self.mjlog.push(cmd, msg);//打牌
                SendNewCard(self);//打牌后尝试发牌
            }
        }
    }

    function MJPutForHeYuanBaiDa(pl, msg, self)
    {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                pl.mjhand.splice(cdIdx, 1);
                pl.mjput.push(msg.card);
                pl.skipHu = false;
                msg.uid = pl.uid;
                tData.lastPut = msg.card;
                tData.lastPutPlayer = tData.curPlayer;
                tData.tState = TableState.waitEat;
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;//自己不能吃

                if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                self.AllPlayerRun(function (p) {
                    if (p != pl) {
                        p.eatFlag = GetEatFlag(p, tData,self);
                        if (p.eatFlag != 0) {
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            p.mjState = TableState.waitCard;
                        }
                    }
                });
                var cmd = msg.cmd;
                delete msg.cmd;
                msg.putType = tData.putType;
                self.NotifyAll(cmd, msg);
                self.mjlog.push(cmd, msg);//打牌
                SendNewCard(self);//打牌后尝试发牌
            }
        }
    }

    function MJPutForXiangGang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                pl.mjhand.splice(cdIdx, 1);
                pl.mjput.push(msg.card);
                pl.skipHu = false;
                msg.uid = pl.uid;
                tData.lastPut = msg.card;
                tData.lastPutPlayer = tData.curPlayer;
                tData.tState = TableState.waitEat;
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;//自己不能吃

                if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                self.AllPlayerRun(function (p) {
                    if (p != pl) {
                        p.eatFlag = GetEatFlag(p, tData,self);
                        if (p.eatFlag != 0) {
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            p.mjState = TableState.waitCard;
                        }
                    }
                });
                var cmd = msg.cmd;
                delete msg.cmd;
                msg.putType = tData.putType;
                self.NotifyAll(cmd, msg);
                self.mjlog.push(cmd, msg);//打牌
                SendNewCard(self);//打牌后尝试发牌
            }
        }
    }

    function MJPutForZuoPaiTuiDaoHu(pl, msg, self) {
        var tData = self.tData;
        if(tData.genZhuang && msg.card >0 )
        {
            if(tData.uids[tData.zhuang] == pl.uid)//记录庄家 打的牌
            {
                pl.genZhuang.pai = msg.card;
                pl.genZhuang.paiNum = 1;
            }
            else
            {
                var zhuangPl = self.players[tData.uids[tData.zhuang]];
                if(msg.card == zhuangPl.genZhuang.pai)
                {
                    zhuangPl.genZhuang.paiNum ++;
                }
                if(zhuangPl.genZhuang.paiNum >= tData.maxPlayer)
                {
                    zhuangPl.genZhuang.genZhuangNum ++;
                    GLog("跟庄次数:" + zhuangPl.genZhuang.genZhuangNum);
                    self.NotifyAll('MJGenZhuang', {uid: zhuangPl.uid, genZhuang: zhuangPl.genZhuang});
                }
            }
        }
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                pl.mjhand.splice(cdIdx, 1);
                pl.mjput.push(msg.card);
                pl.skipHu = false;
                msg.uid = pl.uid;
                tData.lastPut = msg.card;
                tData.lastPutPlayer = tData.curPlayer;
                tData.tState = TableState.waitEat;
                pl.mjState = TableState.waitCard;
                pl.eatFlag = 0;//自己不能吃

                if (tData.putType > 0 && tData.putType < 4) tData.putType = 4; else tData.putType = 0;

                self.AllPlayerRun(function (p) {
                    if (p != pl) {
                        p.eatFlag = GetEatFlag(p, tData,self);
                        if (p.eatFlag != 0) {
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            p.mjState = TableState.waitCard;
                        }
                    }
                });
                var cmd = msg.cmd;
                delete msg.cmd;
                msg.putType = tData.putType;
                self.NotifyAll(cmd, msg);
                self.mjlog.push(cmd, msg);//打牌
                SendNewCard(self);//打牌后尝试发牌
            }
        }
    }

    Table.prototype.MJPut = function (pl, msg, session, next) {
        next(null, null);  //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                MJPutForGangDong(pl, msg, this);
                break;
            case GamesType.HUI_ZHOU:
                MJPutForHuiZhou(pl, msg, this);
                break;
            case GamesType.SHEN_ZHEN:
                MJPutForShenZhen(pl, msg, this);
                break;
            case GamesType.JI_PING_HU:
                MJPutForJiPingHu(pl, msg, this);
                break;
            case GamesType.DONG_GUAN:
                MJPutForDongGuan(pl,msg,this);
                break;
            case GamesType.YI_BAI_ZHANG:
                MJPutForYiBaiZhuang(pl, msg, this);
                break;
            case GamesType.CHAO_ZHOU:
                MJPutForChaoZhou(pl, msg, this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                MJPutForHeYuanBaiDa(pl,msg,this);
                break;
            case GamesType.XIANG_GANG:
                MJPutForXiangGang(pl, msg, this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                MJPutForZuoPaiTuiDaoHu(pl, msg,this);
                break;
        }


    }

    function SendNewCardForGuangDong(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && !tData.baozhama && horse >= 2 && tData.guiJiaMa) horse = horse + 2;
            else if ((tData.withBai || tData.fanGui) && !tData.baozhama && horse >= 2 && tData.guiJiaMa) horse = horse + 2;
            if ((tData.gameType == GamesType.SHEN_ZHEN || tData.gameType == GamesType.GANG_DONG)&& tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                }
            }
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                if(pl && pl.mjhand) {pl.mjhand.push(newCard);
                    pl.isNew = true;}
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    function SendNewCardForHuiZhou(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2;
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4) tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];


                pl = tb.getPlayer(uid);
                if(tData.checkRoleFlowerType < tData.curPlayer)
                {
                    if(majiang.isFlower8(newCard))
                    {
                        GLog("未正式发牌前 此人" + uid + "花牌："+ newCard + "放入要打出的花牌数组里");
                        pl.mjflower_puting.push(newCard);
                    }
                }
                if(tData.checkRoleFlowerType >= tData.maxPlayer)
                {
                    //tData.curPlayer = tData.zhuang;
                    tData.putType = 0;
                    GLog("所有人补花结束，返回到庄家正式打牌");
                }

                //pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }
    function SendNewCardForShenZhen(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            if (tData.gameType == GamesType.SHEN_ZHEN && tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                }
            }
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }
    function SendNewCardForJiPingHu(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = 0;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {

            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }
    function SendNewCardForDongGuan(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;

            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }
    function SendNewCardForYiBaiZhang(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    function SendNewCardForChaoZhou(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            // if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;

            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    function SendNewCardForHeYuanBaiDa(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;

            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    function SendNewCardForXiangGang(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
            if (tData.gameType == GamesType.XIANG_GANG && tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                }
            }
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                pl.mjhand.push(newCard);
                pl.isNew = true;
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    function SendNewCardForZuoPaiTuiDaoHu(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.waitCard
            })) {
            if ((tData.withZhong || tData.fanGui) && !tData.baozhama && horse >= 2 && tData.guiJiaMa) horse = horse + 2;
            else if ((tData.withBai || tData.fanGui) && !tData.baozhama && horse >= 2 && tData.guiJiaMa) horse = horse + 2;
            if ((tData.gameType == GamesType.SHEN_ZHEN || tData.gameType == GamesType.ZUO_PAI_TUI_DAO_HU)&& tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                }
            }
            if (tData.cardNext < cards.length - horse) {
                var newCard = cards[tData.cardNext++];
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % tData.maxPlayer;
                var uid = tData.uids[tData.curPlayer];
                pl = tb.getPlayer(uid);
                if(pl && pl.mjhand) {pl.mjhand.push(newCard);
                    pl.isNew = true;}
                tData.tState = TableState.waitPut;
                tb.AllPlayerRun(function (pl) {
                    pl.mjState = TableState.waitPut;
                    pl.eatFlag = 0;
                });
                if (pl.onLine)pl.notify("newCard", newCard);
                tb.NotifyAll("waitPut", tData);
                pl.picknum++;
                tb.mjlog.push("newCard", app.CopyPtys(tData));//发牌
                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
            }
        }
        return false;
    }

    //发牌不要求在线
    function SendNewCard(tb) {
        var tData = tb.tData;
        switch (tData.gameType){
            case GamesType.GANG_DONG:
                return SendNewCardForGuangDong(tb);
            case GamesType.HUI_ZHOU:
                return SendNewCardForHuiZhou(tb);
            case GamesType.SHEN_ZHEN:
                return SendNewCardForShenZhen(tb);
            case GamesType.JI_PING_HU:
                return SendNewCardForJiPingHu(tb);
            case GamesType.DONG_GUAN:
                return SendNewCardForDongGuan(tb);
            case GamesType.YI_BAI_ZHANG:
                return SendNewCardForYiBaiZhang(tb);
            case GamesType.CHAO_ZHOU:
                return SendNewCardForChaoZhou(tb);
            case GamesType.HE_YUAN_BAI_DA:
                return SendNewCardForHeYuanBaiDa(tb);
            case GamesType.XIANG_GANG:
                return SendNewCardForXiangGang(tb);
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                return SendNewCardForZuoPaiTuiDaoHu(tb);
        }
    }
    Table.prototype.TryNewCard = function () {
        SendNewCard(this);
    }

    //战绩日志函数，自动添加index
    var lastLogDay = 0;
    function doGameLog(para) {
        var day = new Date();
        day = (day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate()) + "";
        app.mdb.insert('gameLog' + day, para, function(){
            if(lastLogDay != day) {
                lastLogDay = day;
                app.mdb.db.collection('gameLog' + day).createIndex({"uid1":1},{"background":1});
                app.mdb.db.collection('gameLog' + day).createIndex({"uid2":1},{"background":1});
                app.mdb.db.collection('gameLog' + day).createIndex({"uid3":1},{"background":1});
                app.mdb.db.collection('gameLog' + day).createIndex({"uid4":1},{"background":1});
            }
        });
    }
    //end
    //新版本
    function EndRoom(tb, msg) {
        GLog("function EndRoom");
        var playInfo = null;
        if (tb.tData.roundNum > -2) {
            if (tb.tData.roundNum != tb.createPara.round) {
                logid++;
                var playid = app.serverId + "_" + logid;
                var endTime = new Date();
                var nowStr = endTime.Format("yyyy-MM-dd hh:mm:ss");
                var tableName = endTime.Format("yyyy-MM-dd");
                var tData = tb.tData;
                playInfo = {
                    url:getPublicIp(),
                    owner: tData.owner,
                    money: tb.createPara.money,
                    now: nowStr,
                    tableid: tb.tableid,
                    logid: playid,
                    players: []
                };
                //战绩日志
                var logData = {};
                logData.uid1 = tData.owner;
                logData.time = nowStr;
                logData.money = tb.createPara.money;
                logData.tableid = tb.tableid;
                logData.logid = playid;
                logData.createRound = tb.createPara.round;
                logData.remainRound = tb.tData.roundNum;
                logData.start = tb.tData.startTime.Format("yyyy-MM-dd hh:mm:ss");
                logData.gameid = tb.tData.gameType;
                var logIndex = 1;
                tb.AllPlayerRun(function (p) {
                    var pinfo = {};
                    pinfo.uid = p.uid;
                    pinfo.winall = p.winall;
                    pinfo.nickname = p.info.nickname || p.info.name;
                    pinfo.money = p.info.money;
                    playInfo.players.push(pinfo);

                    //战绩日志
                    if(logData.uid1 == p.uid) {
                        logData['winall1'] = p.winall;
                        logData['money1'] = p.info.money;
                    } else {
                        logIndex++;
                        logData['uid' + logIndex] = p.uid;
                        logData['winall' + logIndex] = p.winall;
                        logData['money' + logIndex] = p.info.money;
                    }
                });

                //战绩日志，如果不足4人添加默认值
                if(logIndex < 4) {
                    for(var logNum = logIndex + 1; logNum <= 4; logNum++) {
                        logData['uid' + logNum] = 0;
                        logData['winall' + logNum] = 0;
                        logData['money' + logNum] = 0;
                    }
                }
                doGameLog(logData);
                //战绩日志END
                //统计场数
                var dayID = parseInt(endTime.Format("yyyyMMdd"));
                tb.AllPlayerRun(function (p) {
                    var table = "majiangLog";
                    app.mdb.db.collection("majiangLog").update({_id:p.uid},
                        {$push:{logs:{$each:[playInfo],$slice: -50}},$set:{lastGameDay:dayID}},{upsert:true}, function(er,doc)
                        {
                        });
                });
                if(!app.playday) app.playday={dayID:dayID,flushAt:Date.now(),inc:{}};
                var playday=app.playday;
                var guiString = "0";
                if(tData.withZhong) guiString = "1";
                if(tData.fanGui) guiString = "2";
                var incKey= "";
                //游戏类型t1 总局数r4 马数h2 红中鬼g1 无鬼g0 翻鬼g2 风牌f1 f0 胡7对 d0 d1  能吃 c1 c0 能吃胡 p0 p1 节节高 j0 j1 爆炸马b1 惠州不可鸡胡 nj1 惠州马跟底 m1 惠州门清 mq1 惠州马跟底对对胡 md1 河源百搭 大胡 bd1 鸡胡bd0
                //潮州 可点炮_p1 海底翻倍_hf1
                //switch (tData.gameType) {
                //    case GamesType.GANG_DONG:
                //    {
                //        incKey = "t1_r" + tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */ + "_b" + (tData.baozhama ? 1 : 0) + "_s" + tData.maxPlayer;
                //    }
                //        break;
                //    case GamesType.HUI_ZHOU:
                //        incKey = "t2_r" + tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */ + "_j" + (tData.jiejieGao ? 1 : 0) + "_s" + tData.maxPlayer + "_nj" + (tData.noCanJiHu ? 1 : 0) + "_m" + (tData.maGenDi ? 1 : 0) + "_md" + (tData.maGenDiDuiDuiHu ? 1 : 0) + "_mq" + (tData.menQingJiaFen ? 1 : 0);
                //        break;
                //    case GamesType.SHEN_ZHEN:
                //    {
                //        incKey = "t3_r" + tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */ + "_s" + tData.maxPlayer;
                //    }
                //        break;
                //    case GamesType.JI_PING_HU:
                //    {
                //        incKey = "t4_r" + tData.roundAll + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p1" */ + "_s" + tData.maxPlayer; //_p1 默认为点炮的意思
                //    }
                //        break;
                //    case GamesType.DONG_GUAN:
                //    {
                //        incKey = "t5_r" + tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p0"*/ + "_s" + tData.maxPlayer + "_m" + (tData.zhongIsMa ? 1 : 0); //_p1 默认为点炮的意思
                //    }
                //        break;
                //    case GamesType.YI_BAI_ZHANG:
                //    {
                //        incKey = "t6_r" + tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p0" */ + "_s" + tData.maxPlayer + "_b" + (tData.canBigWin ? 1 : 0); //_p1 默认为点炮的意思
                //    }
                //        break;
                //    case GamesType.HE_YUAN_BAI_DA:
                //    {
                //        incKey ="t7_r"+tData.roundAll + "_s"+tData.maxPlayer + "_m" + (tData.maGenDi ? 1 : 0) + "_bd" + (tData.baidadahu ? 1 : 0) ; //
                //    }
                //        break;
                //    case GamesType.CHAO_ZHOU:
                //    {
                //        incKey ="t8_r"+tData.roundAll + "_s"+tData.maxPlayer + "_p" + (tData.canDianPao ? 1 : 0) + "_hd" + (tData.haiDiFanBei ? 1 : 0)  + "_m" + (tData.maGenDi ? 1 : 0);
                //    }
                //        break;
                //}
                switch (tData.gameType) {
                    case GamesType.GANG_DONG:
                    {
                        incKey = "t1_r" + tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.HUI_ZHOU:
                    {
                        incKey = "t2_r" + tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.SHEN_ZHEN:
                    {
                        incKey = "t3_r" + tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.JI_PING_HU:
                    {
                        incKey = "t4_r" + tData.roundAll + "_s"+tData.maxPlayer; //_p1 默认为点炮的意思
                    }
                        break;
                    case GamesType.DONG_GUAN:
                    {
                        incKey = "t5_r" + tData.roundAll  + "_s"+tData.maxPlayer; //_p1 默认为点炮的意思
                    }
                        break;
                    case GamesType.YI_BAI_ZHANG:
                    {
                        incKey = "t6_r" + tData.roundAll + "_s"+tData.maxPlayer; //_p1 默认为点炮的意思
                    }
                        break;
                    case GamesType.HE_YUAN_BAI_DA:
                    {
                        incKey ="t7_r"+tData.roundAll + "_s"+tData.maxPlayer ; //
                    }
                        break;
                    case GamesType.CHAO_ZHOU:
                    {
                        incKey ="t8_r"+tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.XIANG_GANG:
                    {
                        incKey ="t9_r"+tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.ZUO_PAI_TUI_DAO_HU:
                    {
                        incKey ="t10_r"+tData.roundAll + "_s"+tData.maxPlayer;
                    }
                        break;
                }

                var flushFlag=0;
                if(dayID==playday.dayID)
                {
                    var oldVal=playday.inc[incKey]; if(!oldVal) oldVal=0;
                    playday.inc[incKey]=oldVal+1;
                    var dayMoney=playday.inc.dayMoney;  if(!dayMoney) dayMoney=0;
                    playday.inc.dayMoney=dayMoney+playInfo.money;
                    if(Date.now()-playday.flushAt>10*60000) flushFlag=1;
                }
                else
                {
                    flushFlag=2;
                }
                if(flushFlag>0)
                {
                    if(Object.keys(playday.inc).length>0)
                        app.mdb.db.collection("dayLog").update({_id:playday.dayID},{$inc:playday.inc},{upsert:true}, function(er,doc)
                        {

                        });
                    app.playday={dayID:dayID,flushAt:Date.now(),inc:{}};
                    if(flushFlag>1){
                        app.playday.inc[incKey]=1;
                        app.playday.inc.dayMoney=playInfo.money;
                    }
                }
                if(!existCheck["/playlog/"+tableName])
                {
                    if(!fs.existsSync("/playlog")) fs.mkdirSync("/playlog");
                    if(!fs.existsSync("/playlog/"+tableName)) fs.mkdirSync("/playlog/"+tableName);
                    existCheck["/playlog/"+tableName]=true;
                }
                if(!app.playlog) app.playlog=[];
                app.FileWork(app.playlog,"/playlog/"+tableName+"/"+tData.owner+"_"+tb.tableid+".json",tb.mjlog);
            }

            if (msg) {
                if (playInfo) msg.playInfo = playInfo;
                msg.showEnd = tb.tData.roundNum != tb.createPara.round;
                tb.NotifyAll("endRoom", msg);
            }

            tb.SetTimer();
            tb.tData.roundNum = -2;

            DestroyTable(tb);
            var uid2did = tb.uid2did;
            var uids = {};
            for (var uid in uid2did) {
                var did = uid2did[uid];
                var ids = uids[did];
                if (!ids)uids[did] = ids = [];
                ids.push(uid);
            }
            for (var did in uids) {
                var ids = uids[did];
                app.rpc.pkplayer.Rpc.endVipTable(did, {uids: ids, tableid: tb.tableid}, function () {
                });
            }
        }
        return playInfo;
    }

    function RoomEnd(tb, msg) {
        GLog("function RoomEnd");
        if (tb.tData.tState == TableState.waitPut
            || tb.tData.tState == TableState.waitEat
            || tb.tData.tState == TableState.waitCard
        ) {
            tb.tData.roundNum = 1;
            EndGame(tb, null, true);
        }
        else EndRoom(tb, msg);
    }

    Table.prototype.EndTable = function () {
        GLog("function EndTable");
        EndRoom(this, {reason: 0});
    }

    function MJPassForGuangDong(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});

            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForHuiZhou(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForShenZhen(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForJiPingHu(pl, msg, self){
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 4 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForDongGuan(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForChaoZhou(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }
                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForYiBaiZhang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForHeYuanBaiDa(pl, msg, self)
    {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForXiangGang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    function MJPassForZuoPaiTuiDaoHu(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});

            }
        }
        else if (tData.tState == TableState.roundFinish && pl.mjState == TableState.roundFinish) {
            pl.mjState = TableState.isReady;
            self.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
            pl.eatFlag = 0;
            self.startGame();
        }
    }

    Table.prototype.MJPass = function (pl, msg, session, next) {
        next(null, null); //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                MJPassForGuangDong(pl, msg, this);
                break;
            case GamesType.HUI_ZHOU:
                MJPassForHuiZhou(pl, msg, this);
                break;
            case GamesType.SHEN_ZHEN:
                MJPassForShenZhen(pl, msg, this);
                break;
            case GamesType.JI_PING_HU:
                MJPassForJiPingHu(pl, msg, this);
                break;
            case GamesType.DONG_GUAN:
                MJPassForDongGuan(pl, msg, this);
                break;
            case GamesType.YI_BAI_ZHANG:
                MJPassForYiBaiZhang(pl, msg, this);
                break;
            case GamesType.CHAO_ZHOU:
                MJPassForChaoZhou(pl, msg, this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                MJPassForHeYuanBaiDa(pl, msg, this);
                break;
            case GamesType.XIANG_GANG:
                MJPassForXiangGang(pl, msg, this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                MJPassForZuoPaiTuiDaoHu(pl, msg, this);
        }
    }

    function MJChiForJiPingHu(pl, msg,self){
        var tData = self.tData;
        if (
            tData.canEat
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid//下家限制
        ) {
            //此处必须保证没有其他玩家想 胡牌 碰牌 杠牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag == 0;
                })) {
                var cd0 = tData.lastPut;
                var cd1 = tData.lastPut;
                if (msg.pos == 0) {
                    cd0 += 1;
                    cd1 += 2;
                }
                else if (msg.pos == 1) {
                    cd0 -= 1;
                    cd1 += 1;
                }
                else {
                    cd0 -= 2;
                    cd1 -= 1;
                }
                var hand = pl.mjhand;
                var idx0 = hand.indexOf(cd0);
                var idx1 = hand.indexOf(cd1);
                if (idx0 >= 0 && idx1 >= 0) {
                    hand.splice(idx0, 1);
                    idx1 = hand.indexOf(cd1);
                    hand.splice(idx1, 1);
                    pl.mjchi.push(cd0);
                    pl.mjchi.push(cd1);
                    pl.mjchi.push(tData.lastPut);
                    pl.isNew = false;
                    var eatCards = [cd0, cd1, tData.lastPut];
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;

                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    tData.tState = TableState.waitPut;

                    if(pl.mjhand.length == 2){
                        pl.baoZiMo.putCardPlayer.push(lastPlayer);
                        pl.baoZiMo.isOk = true;
                        GLog(pl.uid +"吃牌达成包自摸条件、使其成包自摸的那个人是"+ tData.uids[lastPlayer] );
                    }
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });

                    var chiMsg = {
                        mjchi: eatCards,
                        tData: app.CopyPtys(tData),
                        pos: msg.pos,
                        from: lastPlayer,
                        eatFlag: msg.eatFlag
                    };
                    self.NotifyAll('MJChi', chiMsg);
                    self.mjlog.push("MJChi", chiMsg);//吃
                }
                //else console.error("chi num error");
            }
            else {
                //console.error("chi state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    Table.prototype.MJChi = function (pl, msg, session, next) {
        next(null, null); //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;

        switch (tData.gameType) {
            case GamesType.GANG_DONG:
            case GamesType.HUI_ZHOU:
            case GamesType.SHEN_ZHEN:
            {
                if (
                    tData.canEat
                    && tData.tState == TableState.waitEat
                    && pl.mjState == TableState.waitEat
                    && tData.uids[tData.curPlayer] != pl.uid
                    && tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid//下家限制
                ) {
                    //此处必须保证没有其他玩家想 胡牌 碰牌 杠牌
                    if (this.AllPlayerCheck(function (p) {
                            if (p == pl) return true;
                            return p.eatFlag == 0;
                        })) {
                        var cd0 = tData.lastPut;
                        var cd1 = tData.lastPut;
                        if (msg.pos == 0) {
                            cd0 += 1;
                            cd1 += 2;
                        }
                        else if (msg.pos == 1) {
                            cd0 -= 1;
                            cd1 += 1;
                        }
                        else {
                            cd0 -= 2;
                            cd1 -= 1;
                        }
                        var hand = pl.mjhand;
                        var idx0 = hand.indexOf(cd0);
                        var idx1 = hand.indexOf(cd1);
                        if (idx0 >= 0 && idx1 >= 0) {
                            hand.splice(idx0, 1);
                            idx1 = hand.indexOf(cd1);
                            hand.splice(idx1, 1);
                            pl.mjchi.push(cd0);
                            pl.mjchi.push(cd1);
                            pl.mjchi.push(tData.lastPut);
                            pl.isNew = false;
                            var eatCards = [cd0, cd1, tData.lastPut];
                            var lastPlayer = tData.curPlayer;
                            var pPut = this.getPlayer(tData.uids[lastPlayer]);
                            pPut.mjput.length = pPut.mjput.length - 1;

                            tData.curPlayer = tData.uids.indexOf(pl.uid);
                            tData.tState = TableState.waitPut;

                            this.AllPlayerRun(function (p) {
                                p.mjState = TableState.waitPut;
                                p.eatFlag = 0;
                            });

                            var chiMsg = {
                                mjchi: eatCards,
                                tData: app.CopyPtys(tData),
                                pos: msg.pos,
                                from: lastPlayer,
                                eatFlag: msg.eatFlag
                            };
                            this.NotifyAll('MJChi', chiMsg);
                            this.mjlog.push("MJChi", chiMsg);//吃
                        }
                        //else console.error("chi num error");
                    }
                    else {
                        //console.error("chi state error");
                    }
                }
                else {
                    //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
                }
            }
                break;
            case GamesType.JI_PING_HU:
                MJChiForJiPingHu(pl, msg, this);
                break;
        }

    }

    function MJPengForShenZhen(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForHuiZhou(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.skipPeng.indexOf(tData.lastPut) < 0
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;
                    pl.baojiu.num++;
                    if (pl.baojiu.num >= 4) if(pl.baojiu.putCardPlayer.indexOf(lastPlayer) == -1) pl.baojiu.putCardPlayer.push(lastPlayer);
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer, baojiu: pl.baojiu});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForGangDong(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForJiPingHu(pl, msg, self){
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.skipPeng.indexOf(tData.lastPut) < 0
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;
                    pl.baojiu.num++;
                    if (pl.baojiu.num == 4) pl.baojiu.putCardPlayer.push(lastPlayer);
                    if(pl.mjhand.length == 2){
                        pl.baoZiMo.putCardPlayer.push(lastPlayer);
                        pl.baoZiMo.isOk = true;
                        GLog(pl.uid +"碰后达成包自摸条件、使其成包自摸的那个人是"+ tData.uids[lastPlayer] );
                    }
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer, baojiu: pl.baojiu});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForDongGuan(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForYiBaiZhang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForChaoZhou(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForHeYuanBaiDa(pl, msg, self)
    {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.skipPeng.indexOf(tData.lastPut) < 0
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;
                    if(tData.baidadahu)
                    {
                        pl.baojiu.num++;
                        if (pl.baojiu.num == 4) pl.baojiu.putCardPlayer.push(lastPlayer);
                    }
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer, baojiu: pl.baojiu});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForXiangGang(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJPengForZuoPaiTuiDaoHu(pl, msg, self) {
        var tData = self.tData;
        if (tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
        ) {
            //此处必须保证没有其他玩家想胡牌
            if (self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 8;
                })) {
                var hand = pl.mjhand;
                var matchnum = 0;
                for (var i = 0; i < hand.length; i++) {
                    if (hand[i] == tData.lastPut) {
                        matchnum++;
                    }
                }
                if (matchnum >= 2) {
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    hand.splice(hand.indexOf(tData.lastPut), 1);
                    pl.mjpeng.push(tData.lastPut);
                    if (matchnum == 3) pl.mjpeng4.push(tData.lastPut);
                    pl.isNew = false;
                    var lastPlayer = tData.curPlayer;
                    var pPut = self.getPlayer(tData.uids[lastPlayer]);
                    pPut.mjput.length = pPut.mjput.length - 1;
                    tData.curPlayer = tData.uids.indexOf(pl.uid);
                    self.AllPlayerRun(function (p) {
                        p.mjState = TableState.waitPut;
                        p.eatFlag = 0;
                    });
                    tData.tState = TableState.waitPut;

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
                    self.NotifyAll('MJPeng', {tData: tData, from: lastPlayer});
                    self.mjlog.push('MJPeng', {tData: app.CopyPtys(tData), from: lastPlayer, eatFlag: msg.eatFlag});//碰
                }
                else {
                    //console.error("peng num error");
                }
            }
            else {
                //console.error("peng state error");
            }
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    Table.prototype.MJPeng = function (pl, msg, session, next) {
        next(null, null); //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                MJPengForGangDong(pl, msg, this);
                break;
            case GamesType.HUI_ZHOU:
                MJPengForHuiZhou(pl, msg, this);
                break;
            case GamesType.SHEN_ZHEN:
                MJPengForShenZhen(pl, msg, this);
                break;
            case GamesType.JI_PING_HU:
                MJPengForJiPingHu(pl, msg, this);
                break;
            case GamesType.DONG_GUAN:
                MJPengForDongGuan(pl, msg, this);
                break;
            case GamesType.YI_BAI_ZHANG:
                MJPengForYiBaiZhang(pl, msg, this);
                break;
            case GamesType.CHAO_ZHOU:
                MJPengForChaoZhou(pl, msg, this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                MJPengForHeYuanBaiDa(pl, msg, this);
                break;
            case GamesType.XIANG_GANG:
                MJPengForXiangGang(pl, msg, this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                MJPengForZuoPaiTuiDaoHu(pl, msg, this);
                break;
        }
    }

    function MJGangForShenZhen(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) {
                        return true;
                    } else {
                        //if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                        return p.eatFlag < 4;
                    }
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0)//开杠胡
                    {
                        if (tData.canEatHu) {
                            if (msg.gang != 3 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 || hType == 13 || (hType == 7 && msg.gang != 3 ) ) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                    }
                }
                //新增
                if (p != pl && !p.skipHu && GetHuType(tData, p, msg.card) == 13) {
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForGangDong(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && !tData.baozhama && horse >= 2) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && !tData.baozhama && horse >= 2) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马(之前是根据连庄 现在是根据连胡)
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 4;
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;

            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0)//开杠胡
                    {
                        if (tData.canEatHu) {
                            if (msg.gang != 3 || hType == 13  && tData.gameType != 1) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 || (hType == 13 && tData.gameType != 1) || (hType == 7 && msg.gang != 3 )) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }

                    }
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer-1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForDongGuan(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 4;
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;

            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;

            //红中算马时 手牌有红中 抢杠胡 不能胡
            var canHu = true;
            if(tData.zhongIsMa && tData.lastPut == 71) canHu = false;
            var canEatGang = (msg.gang == 2 && canHu);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                var huType = GetHuType(tData, p, msg.card);
                if (canEatGang && p != pl && !p.skipHu && huType > 0 && huType != 13 ) {
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForHuiZhou(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong) horse = horse + 2;
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                        if (p == pl) {
                            return true;
                        } else {
                            //if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                            return p.eatFlag < 4;
                        }
                    }
                )
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
                pl.baojiu.num++;
                if (pl.baojiu.num >= 4) if(pl.baojiu.putCardPlayer.indexOf(tData.curPlayer) == -1) pl.baojiu.putCardPlayer.push(tData.curPlayer);
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
                if(pl.baojiu.num<3) pl.baojiu.num++;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            msg.baojiu = pl.baojiu;

            var canEatGang = msg.gang == 2;//只抢自摸明杠
            var hType = 0;

            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                var isJiHu = 0;
                if ((canEatGang || msg.gang == 3) && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    isJiHu = majiang.prejudgeHuType(p, msg.card);
                    if (hType > 0  || (tData.duoHuaHuPai && p.mjflower.length >= 7 ))//开杠胡
                    {
                        if ((hType == 13 || msg.gang != 3)
                            &&  (isJiHu > 0 || (isJiHu == 0 && !tData.noCanJiHu) || (tData.duoHuaHuPai && p.mjflower.length >= 7 ) )//鸡胡且可以鸡胡 或非鸡胡
                        ) {
                            p.mjState = TableState.waitEat;
                            p.eatFlag = 8;
                        }
                        //if ((hType == 13 || msg.gang != 3) && isJiHu > 0) {
                        //    p.mjState = TableState.waitEat;
                        //    p.eatFlag = 8;
                        //}
                    }
                }

            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if ((msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4)
            ) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }


    }

    function MJGangForJiPingHu(pl, msg, self){
        var tData = self.tData;
        var horse = 0;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid) {
            GLog("满足吃牌杠的条件");
            GLog("房间状态：" + tData.tState + " 应该为等着吃入4");
            GLog("准备杠的人状态：" + pl.mjState + " 应该为等着吃入4");
            GLog("出牌的人的uid：" + tData.uids[tData.curPlayer] + " 应该不等于准备杠的人的uid ：" + pl.uid);
            GLog("");
        } else {
            GLog("不满足吃牌杠的条件");
            GLog("房间状态：" + tData.tState + " 应该为等着吃入4");
            GLog("准备杠的人状态：" + pl.mjState + " 应该为等着吃入4");
            GLog("出牌的人的uid：" + tData.uids[tData.curPlayer] + " 应该不等于准备杠的人的uid ：" + pl.uid);
            GLog("");
        }

        if (tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid) {
            GLog("满足摸牌杠的条件");
            GLog("房间状态：" + tData.tState + " 应该为等着出3");
            GLog("准备杠的人状态：" + pl.mjState + " 应该为等着出3");
            GLog("摸牌的人的uid：" + tData.uids[tData.curPlayer] + " 应该等于准备杠的人的uid ：" + pl.uid);
            GLog("");
        } else {
            GLog("不满足摸牌杠的条件");
            GLog("房间状态：" + tData.tState + " 应该为等着出3");
            GLog("准备杠的人状态：" + pl.mjState + " 应该为等着出3");
            GLog("摸牌的人的uid：" + tData.uids[tData.curPlayer] + " 应该等于准备杠的人的uid ：" + pl.uid);
            GLog("");
        }

        GLog("tData.cardNext == "+tData.cardNext);
        GLog("self.tData.cardsNum = " + self.tData.cardsNum);
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.tData.cardsNum - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                        if (p == pl) {
                            return true;
                        } else {
                            if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                            return p.eatFlag < 4;
                        }
                    }
                )
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            GLog("满足可以杠的条件");
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;

                if(pl.mjhand.length == 1){
                    pl.baoZiMo.putCardPlayer.push(tData.curPlayer);
                    pl.baoZiMo.isOk = true;
                    GLog(pl.uid +"吃明杠达成包自摸条件、使其成包自摸的那个人是"+ tData.uids[tData.curPlayer] );
                }

                GLog("吃来的名杠");
                GLog("");
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
                GLog("本身有4张牌 自动暗杠了");
                GLog("");
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;

                if(pl.mjhand.length == 1){
                    pl.baoZiMo.putCardPlayer.push(tData.curPlayer);
                    pl.baoZiMo.isOk = true;
                    GLog(pl.uid +"自摸明杠达成包自摸条件、使其成包自摸的那个人是"+ tData.uids[tData.curPlayer] );

                }
                GLog("自摸名杠");
                GLog("");
            }
            else return;
            msg.uid = pl.uid;
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = msg.gang == 2;//只抢自摸明杠

            var hType = 0;
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;

                var isCanHu = false;
                var jiPingHuType = -1;
                if(p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);
                    if(hType > 0)
                    {
                        isCanHu = true; // 改成各种杠都可以胡
                        switch(tData.fanNum)
                        {
                            case 0://任何类型都可胡
                                isCanHu = true;
                                break;
                            case 1:
                            {
                                // 非鸡胡 或 三元牌大于等于1个刻字 或 风圈局的刻子 或 本盘门风的刻子
                                if( jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU || majiang.getSanYuanPaiKeZiNum(pl) >= 1 || (majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                {
                                    GLog("------------------------------------------非鸡胡 或 人胡 或 三元牌1个刻字 或 风圈局的刻子 或 本盘门风的刻子");
                                    isCanHu = true;
                                }
                                //鸡胡 且 (三元牌刻字数大于等于1 或 本门风位刻字数 或 风圈局的刻子 )
                                if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 1 || majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)  ) ){
                                    GLog("------------------------------------------鸡胡 且 (三元牌刻字数1 或 本门风位刻字数 或 风圈局的刻子 )");
                                    isCanHu = true;
                                }
                            }
                                break;
                            case 3:
                            {
                                // 三元牌刻字数大于等于3 或 非(鸡胡、平胡、碰碰胡、混一色)
                                if(majiang.getSanYuanPaiKeZiNum(pl) >= 3 ||
                                    (jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.HUNYISE )
                                )
                                {
                                    isCanHu = true;
                                    if(majiang.getSanYuanPaiKeZiNum(pl) >= 3)
                                        GLog("1. -----------------------------------三元牌刻字数大于等于3");
                                    if( (jiPingHuType != majiang.JI_PING_HU_HUTYPE.JIHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PINGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.PENGPENGHU && jiPingHuType != majiang.JI_PING_HU_HUTYPE.HUNYISE ))
                                        GLog("1. -----------------------------------非(鸡胡、平胡、碰碰胡、混一色)");
                                }
                                else{
                                    //鸡胡 且 三元牌刻字数大于等于3 或
                                    //鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）或
                                    //鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）
                                    if(
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) >= 3 ||
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) ==2 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) ==1 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )
                                    ) {
                                        isCanHu = true;
                                        if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) >= 3)
                                            GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数大于等于3");
                                        if( jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) ==2 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                            GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于2 且 （本门风位刻字数 或 风圈局的刻子）");
                                        if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.JIHU && majiang.getSanYuanPaiKeZiNum(pl) ==1 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                            GLog("2.鸡胡 -----------------------------------鸡胡 且 三元牌刻字数等于1 且 （本门风位刻字数 且 风圈局的刻子）");
                                    }
                                    //平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))或
                                    //平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）或
                                    //平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）
                                    if(
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 2 || ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )) ||
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ) ||
                                        jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                    ) {
                                        isCanHu = true;
                                        if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && (majiang.getSanYuanPaiKeZiNum(pl) >= 2 || ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )))
                                            GLog(" -----------------------------------平胡 且 （三元牌刻字数大于等于2 或 （本门风位刻字数 且 风圈局的刻子))");
                                        if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 1 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) ))
                                            GLog(" -----------------------------------平胡 且 三元牌刻字数等于1 且 （本门风位刻字数 或 风圈局的刻子）");
                                        if(jiPingHuType == majiang.JI_PING_HU_HUTYPE.PINGHU && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) && majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                            GLog(" -----------------------------------平胡 且 三元牌刻字数等于0 且 （本门风位刻字数 且 风圈局的刻子）");
                                    }
                                    //（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) ) 或
                                    // (碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）
                                    if(
                                        (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && ( majiang.getSanYuanPaiKeZiNum(pl) >= 1 || ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )) ||
                                        (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl))
                                    ){
                                        isCanHu = true;
                                        if((jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && ( majiang.getSanYuanPaiKeZiNum(pl) >= 1 || ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl) )))
                                            GLog(" -----------------------------------（碰碰胡或混一色) 且 (三元牌刻字数大于等于1 或 （本门风位刻字数 或 风圈局的刻子) )");
                                        if( (jiPingHuType == majiang.JI_PING_HU_HUTYPE.PENGPENGHU || jiPingHuType == majiang.JI_PING_HU_HUTYPE.HUNYISE) && majiang.getSanYuanPaiKeZiNum(pl) == 0 && ( majiang.isGetBenMenMenFengKeZi(pl) || majiang.isGetFengQuanKeZi(tData.jiPingHuCircleWind.curCircleWind,pl)))
                                            GLog(" -----------------------------------(碰碰胡或混一色) 且 三元牌刻字数等于0 且 （本门风位刻字数 或 风圈局的刻子）");
                                    }

                                }
                            }
                                break;
                        }
                    }
                }
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0 && isCanHu)//开杠胡
                    {
                        if (tData.canEatHu) {
                            if (msg.gang != 3 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 && msg.gang != 1 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }

                    }
                }
                if (p != pl && !p.skipHu && GetHuType(tData, p, msg.card) == 13) {
                    hType = 13;
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }


            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                GLog("杠胡")
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠")
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer-1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }

    }

    function MJGangForYiBaiZhang(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 4;
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                var huType = GetHuType(tData, p, msg.card);
                if (canEatGang && p != pl && !p.skipHu && huType > 0  ) {
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForChaoZhou(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        //if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 4;
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            //红中算马时 手牌有红中 抢杠胡 不能胡
            var canHu = true;
            //if(tData.zhongIsMa && tData.lastPut == 71) canHu = false;
            var canEatGang = (msg.gang == 2 && canHu);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                var huType = GetHuType(tData, p, msg.card);
                if (canEatGang && p != pl && !p.skipHu && huType > 0 ) {
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForHeYuanBaiDa(pl, msg, self)
    {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                        if (p == pl) {
                            return true;
                        } else {
                            //if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                            return p.eatFlag < 4;
                        }
                    }
                )
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;

            var canEatGang = msg.gang == 2;//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                if ((canEatGang || msg.gang == 3) && p != pl && !p.skipHu && tData.canQiangGang) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0 )//开杠胡
                    {
                        p.mjState = TableState.waitEat;
                        p.eatFlag = 8;
                    }
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if ((msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4)
            ) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }


    }

    function MJGangForXiangGang(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && tData.guiJiaMa) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) {
                        return true;
                    } else {
                        //if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                        return p.eatFlag < 4;
                    }
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;
            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0)//开杠胡
                    {
                        if (tData.canEatHu) {
                            if (msg.gang != 3 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 || hType == 13 || (hType == 7 && msg.gang != 3 ) ) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                    }
                }
                //新增
                if (p != pl && !p.skipHu && GetHuType(tData, p, msg.card) == 13) {
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer - 1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    function MJGangForZuoPaiTuiDaoHu(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if ((tData.withZhong || tData.fanGui) && !tData.baozhama && horse >= 2) horse = horse + 2;
        else if((tData.withBai || tData.fanGui) && !tData.baozhama && horse >= 2) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马(之前是根据连庄 现在是根据连胡)
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
        }
        if (
            //最后1+horse张不能杠
        tData.cardNext < (self.cards.length - horse)
        &&
        (
            //吃牌杠
            tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid
                //此处必须保证没有其他玩家想胡牌 邵阳麻将 可以抢杠 不需要检查胡
            && (   /*!tData.canEatHu || */
                self.AllPlayerCheck(function (p) {
                    if (p == pl) return true;
                    return p.eatFlag < 4;
                })
            )
                //摸牌杠
            || tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && tData.uids[tData.curPlayer] == pl.uid
        )
        ) {
            var hand = pl.mjhand;
            var handNum = 0;
            for (var i = 0; i < hand.length; i++) {
                if (hand[i] == msg.card) {
                    handNum++;
                }
            }
            if (tData.tState == TableState.waitEat && handNum == 3 && tData.lastPut == msg.card) {

                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var mjput = fp.mjput;
                if (mjput.length > 0 && mjput[mjput.length - 1] == msg.card) {
                    mjput.length = mjput.length - 1;
                }
                else return;

                pl.mjgang0.push(msg.card);//吃明杠
                pl.gang0uid[msg.card] = tData.curPlayer;
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 1;
                msg.from = tData.curPlayer;
                pl.isNew = false;

            }
            else if (tData.tState == TableState.waitPut && handNum == 4) {
                pl.mjgang1.push(msg.card);//暗杠
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                hand.splice(hand.indexOf(msg.card), 1);
                msg.gang = 3;
            }
            else if (tData.tState == TableState.waitPut && handNum == 1 && pl.mjpeng.indexOf(msg.card) >= 0 && pl.mjpeng4.indexOf(msg.card) < 0) {
                pl.mjgang0.push(msg.card);//自摸明杠
                hand.splice(hand.indexOf(msg.card), 1);
                pl.mjpeng.splice(pl.mjpeng.indexOf(msg.card), 1);
                msg.gang = 2;
            }
            else return;
            msg.uid = pl.uid;
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    if (hType > 0)//开杠胡
                    {
                        if (tData.canEatHu) {
                            if (msg.gang != 3 || hType == 13  && tData.gameType != 1) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 || (hType == 13 && tData.gameType != 1) || (hType == 7 && msg.gang != 3 )) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }

                    }
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + tData.maxPlayer-1) % tData.maxPlayer;
            }
            tData.tState = TableState.waitEat;
            SendNewCard(self); //杠后尝试补牌
        }
        else {
            //console.error(tData.tState+" "+pl.mjState+" "+tData.uids[tData.curPlayer]+" "+pl.uid);
        }
    }

    Table.prototype.MJGang = function (pl, msg, session, next) {
        next(null, null); //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                MJGangForGangDong(pl, msg, this);
                break;
            case GamesType.HUI_ZHOU:
                MJGangForHuiZhou(pl, msg, this);
                break;
            case GamesType.SHEN_ZHEN:
                MJGangForShenZhen(pl, msg, this);
                break;
            case GamesType.JI_PING_HU:
                MJGangForJiPingHu(pl, msg, this);
                break;
            case GamesType.DONG_GUAN:
                MJGangForDongGuan(pl, msg, this);
                break;
            case GamesType.YI_BAI_ZHANG:
                MJGangForYiBaiZhang(pl, msg, this);
                break;
            case GamesType.CHAO_ZHOU:
                MJGangForChaoZhou(pl, msg, this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                MJGangForHeYuanBaiDa(pl, msg, this);
                break;
            case GamesType.XIANG_GANG:
                MJGangForXiangGang(pl, msg, this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                MJGangForZuoPaiTuiDaoHu(pl, msg, this);
                break;
        }
    }


    //广州截胡
    function HighPlayerHuForGuangDong(tb, pl){
        var tData=tb.tData;
        var uids=tData.uids;
        for (var i = (tData.curPlayer + 1) % tData.maxPlayer; uids[i] != pl.uid; i = (i + 1) % tData.maxPlayer) {
            if (tb.players[uids[i]].eatFlag >= 8) {
                return true;
            }
        }
        return false;
    }

    //深圳截胡
    function HighPlayerHuForShenZhen(tb, pl){
        var tData=tb.tData;
        var uids=tData.uids;
        for (var i = (tData.curPlayer + 1) % tData.maxPlayer; uids[i] != pl.uid; i = (i + 1) % tData.maxPlayer) {
            if (tb.players[uids[i]].eatFlag >= 8) {
                return true;
            }
        }
        return false;
    }
    function HighPlayerHu(tb, pl)//此处必须保证没有其他玩家想胡牌,
    {
        GLog("function HighPlayerHu");
        var tData = tb.tData;
        var uids = tData.uids;

        GLog("出牌的那个人 uid 是" + uids[tData.curPlayer]);
        var h1Man = tb.players[uids[(tData.curPlayer + 1) % tData.maxPlayer]];
        var h2Man = tb.players[uids[(tData.curPlayer + 2) % tData.maxPlayer]];
        var h3Man = tb.players[uids[(tData.curPlayer + 3) % tData.maxPlayer]];

        var h1ManType = majiang.prejudgeHuType(h1Man, tData.lastPut);
        var h2ManType = majiang.prejudgeHuType(h2Man, tData.lastPut);
        var h3ManType = majiang.prejudgeHuType(h3Man, tData.lastPut);

        GLog("点胡的那个人uid：" + pl.uid);
        GLog("");
        GLog("h1Man" + (tData.curPlayer + 1) % tData.maxPlayer + " uid:" + h1Man.uid + "胡牌类型：" + h1ManType + "是否过胡：" + h1Man.skipHu);
        GLog("h2Man" + (tData.curPlayer + 2) % tData.maxPlayer + " uid:" + h2Man.uid + "胡牌类型：" + h2ManType + "是否过胡：" + h1Man.skipHu);
        GLog("h3Man" + (tData.curPlayer + 3) % tData.maxPlayer + " uid:" + h3Man.uid + "胡牌类型：" + h3ManType + "是否过胡：" + h1Man.skipHu);
        GLog("");

        //检查出所有玩家 的胡 是否有 13幺和字一色 同时出现 按逆时针 符合牌型点炮  没有 按 点炮逆时针 点炮
        if (h1ManType == 5 || h1ManType == 9 || h2ManType == 5 || h2ManType == 9 || h3ManType == 5 || h3ManType == 9) {
            GLog("有人胡的类型 满足 13幺和清一色");
            GLog("点胡的那个人的 胡的type ==== " + majiang.prejudgeHuType(pl, tData.lastPut));
            //if(majiang.prejudgeHuType(pl,tData.lastPut) ==  majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(pl,tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
            //{
            //	GLog("点胡的人是13幺或者字一色");
            //	return false;
            //}
            if (
                (majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                && pl.uid == h1Man.uid
            ) {
                return false;
            }
            else if (
                (majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                && pl.uid == h2Man.uid
                && (
                    majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
                    || (
                        (majiang.prejudgeHuType(h1Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h1Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                        && h1Man.skipHu
                    )
                )
            ) {
                return false;
            }
            else if (
                (majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(pl, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                && pl.uid == h3Man.uid
                && (
                    majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
                    || (
                        (majiang.prejudgeHuType(h1Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h1Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                        && h1Man.skipHu
                    )
                )
                && (
                    majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
                    || (    (majiang.prejudgeHuType(h2Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h2Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                        && h2Man.skipHu
                    )
                )

            ) {
                return false;
            } //后来添加的
            else if (//第一种情况
            majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h1Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
            && pl.uid == h1Man.uid
            && (
                (majiang.prejudgeHuType(h2Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h2Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                && h2Man.skipHu
                || (
                    majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
                )
                && (
                    majiang.prejudgeHuType(h3Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h3Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE
                    && h3Man.skipHu
                )
                || (
                    majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
                )
            )
            ) {
                return false;
            }
            else if (//第二种情况
            (majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h2Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE)
            && pl.uid == h2Man.uid
            && (
                h1Man.skipHu
            )
            && (
                (majiang.prejudgeHuType(h3Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.SHISANYAO || majiang.prejudgeHuType(h3Man, tData.lastPut) == majiang.HUI_ZHOU_HTYPE.ZIYISE)
                && h3Man.skipHu
                || (majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE)
            )
            ) {
                return false;
            }
            else if (//第三种情况
            majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.SHISANYAO && majiang.prejudgeHuType(h3Man, tData.lastPut) != majiang.HUI_ZHOU_HTYPE.ZIYISE
            && pl.uid == h3Man.uid
            && h1Man.skipHu
            && h2Man.skipHu
            ) {
                return false;
            }

            return true;
        }

        else {
            GLog("走了 之前 按顺序的截胡")
            for (var i = (tData.curPlayer + 1) % tData.maxPlayer; uids[i] != pl.uid; i = (i + 1) % tData.maxPlayer) {
                if (tb.players[uids[i]].eatFlag >= 8) {
                    return true;
                }
            }
        }
        GLog("执行了到这里了了=============================");

        return false;
    }

    function MJHuForShenZhen(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /* &&!HighPlayerHuForShenZhen(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    function MJHuForGuangDong(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var horse = tData.horse;
        if ((tData.fanGui || tData.withZhong )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        else if ((tData.fanGui || tData.withBai )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;

        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0 && GetHuType(tData, pl) != 13//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                    pl.gangBao = true;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                    pl.gangBao = true;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            if(tData.cardNext == (tData.cardsNum - horse)) pl.haiDiHu = true;
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    //function MJHuForHuiZhou(pl, msg, self) {
    //
    //    var tData = self.tData;
    //    var uids = self.tData.uids;
    //    var canEnd = false;
    //    var huType = GetHuType(tData, pl);
    //    if(tData.duoHuaHuPai && pl.mjflower.length >= 7)
    //        pl.duoHuaHuPai = true;
    //
    //    GLog("此人："+pl.uid +"多花胡牌吗？"+pl.duoHuaHuPai);
    //    //自摸胡
    //    if (
    //        tData.tState == TableState.waitPut
    //        && pl.mjState == TableState.waitPut
    //        && pl.isNew
    //        && tData.uids[tData.curPlayer] == pl.uid
    //        &&
    //        (
    //            pl.duoHuaHuPai
    //            ||
    //            (huType > 0//自摸测试
    //            &&
    //            (majiang.prejudgeHuType(pl) > 0 || (majiang.prejudgeHuType(pl) == 0 && !tData.noCanJiHu || huType == 7)))
    //        )//鸡胡且可以鸡胡 或非鸡胡
    //    ) {
    //            if(huType > 0)
    //            {
    //                //补摸
    //                if (tData.putType > 0 && tData.putType < 4) {
    //                    if (tData.putType == 1) {
    //                        pl.winType = WinType.pickGang1;
    //                    }
    //                    else//自摸杠在补摸
    //                    {
    //                        pl.winType = WinType.pickGang23;
    //                    }
    //                }
    //                else//自摸
    //                {
    //                    pl.winType = WinType.pickNormal;
    //                }
    //            }
    //
    //        canEnd = true;
    //
    //    }
    //    //点炮胡 抢杠胡
    //    else if (
    //        !pl.skipHu
    //        && tData.tState == TableState.waitEat
    //        && pl.mjState == TableState.waitEat
    //        && tData.uids[tData.curPlayer] != pl.uid
    //        && pl.eatFlag >= 8
    //        && (
    //            (tData.putType != 0 && tData.putType != 4) //可以多家抢杠
    //            ||
    //            !HighPlayerHu(self, pl)// 邵阳麻将可以多家胡 //&&(tData.putType>0||tData.canEatHu)
    //        )
    //
    //    // &&  (majiang.prejudgeHuType(pl,tData.lastPut) > 0 || (majiang.prejudgeHuType(pl,tData.lastPut) == 0 && !tData.noCanJiHu))//鸡胡且可以鸡胡 或非鸡胡
    //    ) {
    //        if (tData.tState == TableState.waitEat) {
    //            var fp = self.getPlayer(tData.uids[tData.curPlayer]);
    //            var winType = null;
    //            var mjput = null;
    //            if (tData.putType == 0) {
    //                winType = WinType.eatPut;
    //                mjput = fp.mjput;
    //            }
    //            else if (tData.putType == 4) {
    //                winType = WinType.eatGangPut;
    //                mjput = fp.mjput;
    //            }
    //            else //抢杠包3家
    //            {
    //                winType = WinType.eatGang;
    //                if (tData.putType == 3) mjput = fp.mjgang1;
    //                else mjput = fp.mjgang0;
    //            }
    //            if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
    //                mjput.length = mjput.length - 1;
    //            }
    //            else return;
    //            //一炮多响
    //            self.AllPlayerRun(function (p) {
    //                if (p.mjState == TableState.waitEat && p.eatFlag >= 8 && (tData.putType != 0 && tData.putType != 4 || ((tData.putType == 0 || tData.putType == 4) && p.uid == pl.uid))) {
    //                    p.mjhand.push(tData.lastPut);
    //                    p.winType = winType;
    //                }
    //            });
    //            canEnd = true;
    //        }
    //    }
    //    if (canEnd) {
    //        self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
    //        EndGame(self, pl);
    //    }
    //    else {
    //        if (!app.huError) app.huError = [];
    //        app.FileWork(app.huError, app.serverId + "huError.txt",
    //            tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
    //        );
    //    }
    //}
    function MJHuForHuiZhou(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        var huType = GetHuType(tData, pl);
        //自摸胡
        if (
            tData.tState == TableState.waitPut
            && pl.mjState == TableState.waitPut
            && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid
            && huType > 0//自摸测试
            &&  (majiang.prejudgeHuType(pl) > 0 || (majiang.prejudgeHuType(pl) == 0 && !tData.noCanJiHu || huType == 7))//鸡胡且可以鸡胡 或非鸡胡
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.eatFlag >= 8
            && !HighPlayerHu(self, pl)// 邵阳麻将可以多家胡 //&&(tData.putType>0||tData.canEatHu)
        // &&  (majiang.prejudgeHuType(pl,tData.lastPut) > 0 || (majiang.prejudgeHuType(pl,tData.lastPut) == 0 && !tData.noCanJiHu))//鸡胡且可以鸡胡 或非鸡胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8 && p.uid == pl.uid) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }
    function MJHuForJiPingHu(pl, msg, self){
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        if (
            tData.tState == TableState.waitPut
            && pl.mjState == TableState.waitPut
            && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid
            && GetHuType(tData, pl) > 0//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.eatFlag >= 8
        //&& !HighPlayerHu(self, pl)// 邵阳麻将可以多家胡 //&&(tData.putType>0||tData.canEatHu)
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                // var huMembers = [];
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8 ) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                        // huMembers.push(p);
                    }
                });
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    function MJHuForDongGuan(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0 && GetHuType(tData, pl) != 13//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;
        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    function MJHuForYiBaiZhang(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0 && GetHuType(tData, pl) != 13//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;
        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    function MJHuForChaoZhou(pl, msg, self) {
        var tData = self.tData;
        var horse = tData.horse;
        var uids = self.tData.uids;
        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                    pl.gangBao = true;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                    pl.gangBao = true;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }

            if(!tData.canDianPao)
            {
                //天胡没除外
                // 地胡及其所有玩家手牌和所剩的所有牌的总和且去重 判断除自摸胡的其他玩家能否听20分的牌
                var otherPlayer = [];//除胡牌的人 其他人输牌人的容器
                //if(tData.cardNext != 53) {
                //胡牌时剩余的总牌数
                var allLastCards = [];
                for (var i = 0; i < tData.cardsNum; i++) {
                    if (i >= tData.cardNext) {
                        allLastCards.push(self.cards[i]);
                    }
                }
                //除胡牌人 其他所有输家的 uid集合
                for (var i = 0; i < tData.maxPlayer; i++) {
                    if (pl.uid != tData.uids[i]) {
                        otherPlayer.push(tData.uids[i]);
                    }
                }
                //GLog("第一个人:" +  otherPlayer[0]);
                //GLog("第二个人:" +  otherPlayer[1]);
                //GLog("第三个人:" +  otherPlayer[2]);
                //每位输家人的数据
                var orignOne = {};
                orignOne.mjhand = self.getPlayer(otherPlayer[0]).mjhand;
                orignOne.mjpeng = self.getPlayer(otherPlayer[0]).mjpeng;
                orignOne.mjgang0 = self.getPlayer(otherPlayer[0]).mjgang0;
                orignOne.mjgang1 = self.getPlayer(otherPlayer[0]).mjgang1;
                orignOne.mjchi = self.getPlayer(otherPlayer[0]).mjchi;
                orignOne.huType = self.getPlayer(otherPlayer[0]).huType;

                var plOne = majiang.deepCopy(orignOne);

                var orignTwo = {};
                orignTwo.mjhand = self.getPlayer(otherPlayer[1]).mjhand;
                orignTwo.mjpeng = self.getPlayer(otherPlayer[1]).mjpeng;
                orignTwo.mjgang0 = self.getPlayer(otherPlayer[1]).mjgang0;
                orignTwo.mjgang1 = self.getPlayer(otherPlayer[1]).mjgang1;
                orignTwo.mjchi = self.getPlayer(otherPlayer[1]).mjchi;
                orignTwo.huType = self.getPlayer(otherPlayer[1]).huType;
                var plTwo = majiang.deepCopy(orignTwo);

                if (tData.maxPlayer == 4) {
                    var orignThree = {};
                    orignThree.mjhand = self.getPlayer(otherPlayer[2]).mjhand;
                    orignThree.mjpeng = self.getPlayer(otherPlayer[2]).mjpeng;
                    orignThree.mjgang0 = self.getPlayer(otherPlayer[2]).mjgang0;
                    orignThree.mjgang1 = self.getPlayer(otherPlayer[2]).mjgang1;
                    orignThree.mjchi = self.getPlayer(otherPlayer[2]).mjchi;
                    orignThree.huType = self.getPlayer(otherPlayer[2]).huType;
                    var plThree = majiang.deepCopy(orignThree);
                }

                //每位输家人的手牌数据
                var onePlayerMjhand = plOne.mjhand;
                var twoPlayerMjhand = plTwo.mjhand;
                if (tData.maxPlayer == 4) var threePlayerMjhand = plThree.mjhand;

                // //对于第一家输得人 其他玩家所有手牌与所剩牌的总和
                var one = [];
                for (var i = 0; i < twoPlayerMjhand.length; i++) {
                    one.push(twoPlayerMjhand[i]);
                }
                if (tData.maxPlayer == 4) {
                    for (var i = 0; i < threePlayerMjhand.length; i++) {
                        one.push(threePlayerMjhand[i]);
                    }
                }
                for (var i = 0; i < pl.mjhand.length; i++) {
                    one.push(pl.mjhand[i]);
                }
                for (var i = 0; i < allLastCards.length; i++) {
                    one.push(allLastCards[i]);
                }
                //去重后的牌
                //第一人 可听去重的所有牌
                var oneQuChong = majiang.getQuChongCards(one);
                //第一个人 可听牌当中能听的牌集合
                var oneCanHuPai = [];
                for (var i = 0; i < oneQuChong.length; i++) {
                    //这些可能 能听的牌 若 不能与第一人手里的牌组成对子 就不用考虑了 因为达不到听20分的条件
                    var huType = 0;
                    if( plOne.mjhand.length == 13)
                    {
                        huType = majiang.canHu(!tData.canHu7, plOne.mjhand, oneQuChong[i], false, false, false, false,0, tData.gui4Hu, 0);
                    }
                    else{
                        if (plOne.mjhand.indexOf(oneQuChong[i]) == -1) continue;
                        huType = majiang.canHu(!tData.canHu7, plOne.mjhand, oneQuChong[i], false, false, false,false, 0, tData.gui4Hu, 0);
                    }
                    if (huType > 0) {
                        //plOne.huType = huType;
                        oneCanHuPai.push(oneQuChong[i]);
                    }
                }

                if (oneCanHuPai.length > 0) {
                    //for(var i=0;i<plOne.mjhand.length;i++)
                    //{
                    //    GLog("----"+plOne.mjhand[i]);
                    //}
                    for (var i = 0; i < oneCanHuPai.length; i++) {
                        GLog(oneCanHuPai[i]);
                        plOne.mjhand.push(oneCanHuPai[i]);
                        plOne.huType = majiang.canHu(!tData.canHu7, plOne.mjhand, 0, false, false, false,false, 0, tData.gui4Hu, 0);
                        var huTypeForPlOne =  majiang.getHuTypeForChaoShan(plOne);
                        if (
                            huTypeForPlOne >= majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN
                        ) {
                            pl.collectCanTingTwentyPlayers.push(otherPlayer[0]);
                            plOne.mjhand.splice(plOne.mjhand.indexOf(oneCanHuPai[i]), 1);
                            break;
                        }
                        else {
                            plOne.mjhand.splice(plOne.mjhand.indexOf(oneCanHuPai[i]), 1);
                            continue;
                        }
                    }
                }
                //////////////////////////////////////////////////////////////////////////
                //对于第二家输得人 其他玩家所有手牌与所剩牌的总和
                var two = [];
                for (var i = 0; i < onePlayerMjhand.length; i++) {
                    two.push(onePlayerMjhand[i]);
                }
                if (tData.maxPlayer == 4) {
                    for (var i = 0; i < threePlayerMjhand.length; i++) {
                        two.push(threePlayerMjhand[i]);
                    }
                }
                for (var i = 0; i < pl.mjhand.length; i++) {
                    two.push(pl.mjhand[i]);
                }
                for (var i = 0; i < allLastCards.length; i++) {
                    two.push(allLastCards[i]);
                }
                //去重后的牌
                //第二人 可听去重的所有牌
                var twoQuChong = majiang.getQuChongCards(two);
                ////第二个人 可听牌当中能听的牌集合
                var twoCanHuPai = [];
                for (var i = 0; i < twoQuChong.length; i++) {
                    //这些可能 能听的牌 若 不能与第一人手里的牌组成对子 就不用考虑了 因为达不到听20分的条件
                    var huType = 0;
                    if( plTwo.mjhand.length == 13)
                    {
                        huType = majiang.canHu(!tData.canHu7, plTwo.mjhand, twoQuChong[i], false, false, false,false, 0, tData.gui4Hu, 0);
                    }
                    else{
                        if (plTwo.mjhand.indexOf(twoQuChong[i]) == -1) continue;
                        huType = majiang.canHu(!tData.canHu7, plTwo.mjhand, twoQuChong[i], false, false, false,false, 0, tData.gui4Hu, 0);
                    }
                    if (huType > 0) {
                        // plTwo.huType = huType;
                        twoCanHuPai.push(twoQuChong[i]);
                    }
                }
                if (twoCanHuPai.length > 0) {
                    for (var i = 0; i < twoCanHuPai.length; i++) {
                        plTwo.mjhand.push(twoCanHuPai[i]);
                        plTwo.huType = majiang.canHu(!tData.canHu7, plTwo.mjhand, 0, false, false, false,false, 0, tData.gui4Hu, 0);
                        var huTypeForPlTwo = majiang.getHuTypeForChaoShan(plTwo);
                        if (
                            huTypeForPlTwo >= majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN
                        ) {
                            pl.collectCanTingTwentyPlayers.push(otherPlayer[1]);
                            plTwo.mjhand.splice(plTwo.mjhand.indexOf(twoCanHuPai[i]), 1);
                            break;
                        } else {
                            plTwo.mjhand.splice(plTwo.mjhand.indexOf(twoCanHuPai[i]), 1);
                            continue;
                        }
                    }

                }
                //
                /////////////////////////////////////////////////////
                if (tData.maxPlayer == 4) {
                    //对于第三家输得人 其他玩家所有手牌与所剩牌的总和
                    var three = [];
                    for (var i = 0; i < onePlayerMjhand.length; i++) {
                        three.push(onePlayerMjhand[i]);
                    }
                    for (var i = 0; i < twoPlayerMjhand.length; i++) {
                        three.push(twoPlayerMjhand[i]);
                    }
                    for (var i = 0; i < pl.mjhand.length; i++) {
                        three.push(pl.mjhand[i]);
                    }
                    for (var i = 0; i < allLastCards.length; i++) {
                        three.push(allLastCards[i]);
                    }
                    //去重后的牌
                    //第三人 可听去重的所有牌
                    var threeQuChong = majiang.getQuChongCards(three);

                    //三个人 可听牌当中能听的牌集合
                    var threeCanHuPai = [];
                    for (var i = 0; i < threeQuChong.length; i++) {
                        //这些可能 能听的牌 若 不能与第三人手里的牌组成对子 就不用考虑了 因为达不到听20分的条件
                        var huType = 0;
                        if( plThree.mjhand.length == 13)
                        {
                            huType = majiang.canHu(!tData.canHu7, plThree.mjhand, threeQuChong[i], false, false, false,false, 0, tData.gui4Hu, 0);
                        }
                        else{
                            if (plThree.mjhand.indexOf(threeQuChong[i]) == -1 ) continue;
                            huType = majiang.canHu(!tData.canHu7, plThree.mjhand, threeQuChong[i], false, false, false,false, 0, tData.gui4Hu, 0);
                        }
                        if (huType > 0) {
                            // plThree.huType = huType;
                            threeCanHuPai.push(threeQuChong[i]);
                        }
                    }
                    if (threeCanHuPai.length > 0) {
                        for (var i = 0; i < threeCanHuPai.length; i++) {
                            plThree.mjhand.push(threeCanHuPai[i]);
                            plThree.huType = majiang.canHu(!tData.canHu7, plThree.mjhand, 0, false, false, false,false, 0, tData.gui4Hu, 0);
                            var huTypeForPlThree = majiang.getHuTypeForChaoShan(plThree);
                            if (
                                huTypeForPlThree >= majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN
                            ) {
                                pl.collectCanTingTwentyPlayers.push(otherPlayer[2]);
                                plThree.mjhand.splice(plThree.mjhand.indexOf(threeCanHuPai[i]), 1);
                                break;
                            } else {
                                plThree.mjhand.splice(plThree.mjhand.indexOf(threeCanHuPai[i]), 1);
                                continue;
                            }
                        }
                    }
                }
                // }
            }

            if(tData.cardNext == (tData.cardsNum - horse)) pl.haiDiHu = true;
            canEnd = true;
        }
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.eatFlag >= 8
        // && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                    if(tData.cardNext == (tData.cardsNum - horse)) pl.haiDiHu = true;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                    if(tData.cardNext == (tData.cardsNum - horse)) pl.haiDiHu = true;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

// 2017 -2-15 单调花与花调花的判断
    function getHuDataForDanDiaoOrHuaDiaoXinXuQiu(td,pl)
    {
        var tData = td.tData;
        var huType = -1;
        var result = {huType:-1,type:0,mjhand:[]};
        if(!majiang.canFindFlowerForMjhand(pl.mjhand)) //无鬼牌
        {
            result.huType =  majiang.getHuTypeForHeYuanBaiDaNoGui(pl,tData.baidadahu,tData.canHu7);
            result.mjhand = pl.mjhand;
            return result;
        }
        var orignHuType = majiang.getHuTypeForHeYuanBaiHaveGui(pl,tData.baidadahu,tData.canHu7);//最初能胡的牌型

        //13幺特殊判断
        if(pl.huType == 13)
        {
            GLog("十三幺特殊判断");

            if(majiang.isHuaDiaoHuaFor13(tData,pl,true))
            {
                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
                result.type = 2;
                result.mjhand = pl.mjhand;
                return result;
            }

            if(majiang.isDanDiaoHuaFor13(tData,pl,true))
            {
                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
                result.type = 1;
                result.mjhand = pl.mjhand;
                return result;
            }

            result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
            result.type = 0;
            result.mjhand = pl.mjhand;
            return result;
        }
        else
        {
            //最后一张鬼 与 摸的那张牌先做将 先看能不能胡了
            var lastPut = pl.mjhand[pl.mjhand.length-1];
            var rtn = []; //去掉 最后摸的一张牌
            var haveTwoOrMoreFlower = false;
            for(var i=0;i<pl.mjhand.length;i++)
            {
                if(i != ( pl.mjhand.length -1))
                {
                    rtn.push(pl.mjhand[i]);
                    if(majiang.canFindFlowerForMjhand(pl.mjhand[i]))
                    {
                        haveTwoOrMoreFlower = true;
                    }
                }
            }
            //先考虑单调花 摸的最后一张牌不能是鬼
            if(lastPut < 111)
            {
                if(rtn.length == 1 && majiang.canFindFlowerForMjhand(rtn))
                {
                    result.huType = orignHuType;
                    result.type = 1;
                    result.mjhand = pl.mjhand;
                    return result;
                }

                ////再去掉一张鬼牌
                //for(var i=0;i<rtn.length;i++)
                //{
                //    if(rtn[i] >= 111) {
                //        rtn.splice(rtn.indexOf(rtn[i]), 1);
                //        break;
                //    }
                //}
                ////让最后一张牌与鬼牌做将（有可能做的不是将） 即 使其鬼牌与最后摸的一张牌一样 放回手牌中
                ////缺2张牌的牌型
                //var que2Pai = [];
                //var cards = [];
                //for(var i=0;i<rtn.length;i++)
                //{
                //    cards.push(rtn[i]);
                //    que2Pai.push(rtn[i]);
                //}
                //cards.push(lastPut);
                //cards.push(lastPut);
                ////判断 现在的牌是否能胡. 能胡 则有可能是 单吊花; 不能胡 肯定不是单吊花
                //var nowHuType1 = majiang.canHu(!tData.canHu7, cards, 0, false, false,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui);
                //if(nowHuType1 > 0)
                //{
                //    var test = [];
                //    test.mjhand = cards;
                //    test.mjpeng = pl.mjpeng;
                //    test.mjgang0 = pl.mjgang0;
                //    test.mjgang1 = pl.mjgang1;
                //    test.winType = pl.winType;
                //    test.mjchi = pl.mjchi;
                //    test.huType = nowHuType1;
                //
                //    //log数据
                //    var xinPaiXing = "";
                //    for(var i=0;i<cards.length;i++)
                //    {
                //        xinPaiXing = xinPaiXing + cards[i] + ","
                //    }
                //    GLog("xinPaiXing =====" + xinPaiXing);
                //
                //    var nowHuType = -1;
                //    if(!majiang.canFindFlowerForMjhand(test.mjhand))
                //    {
                //        nowHuType = majiang.getHuTypeForHeYuanBaiDaNoGui(test,tData.baidadahu,tData.canHu7);
                //    }else
                //    {
                //        nowHuType = majiang.getHuTypeForHeYuanBaiHaveGui(test,tData.baidadahu,tData.canHu7);
                //    }
                //    GLog("将手牌中的一张鬼牌 替换成" + lastPut + "牌后 胡的类型是:" + nowHuType + " 原来胡的牌型是" + orignHuType);
                //
                //    //若目前胡的类型与原始胡的类型一致 则这个类型必定是单吊花
                //    if(nowHuType == orignHuType)
                //    {
                //        //处理2个牌做将 如果手牌中还有 其他的牌使其形成刻字 进行特殊处理
                //        var num = 0;
                //        var isHuForQue2 = false; //缺2牌的情况下能不能胡
                //        var isQue2HuType = -1;
                //
                //        var pai = 0;
                //        if(lastPut <= 9 )
                //        {
                //            pai = 1;
                //            if(pai == lastPut && lastPut!=9 ) pai =  lastPut + 1;
                //            //Math.floor(Math.random() * rtn.length)
                //        }
                //        else if(lastPut <= 19)
                //        {
                //            pai = 11;
                //            if(pai == lastPut && lastPut!=19 ) pai =  lastPut + 1;
                //        }
                //        else if(lastPut <= 29)
                //        {
                //            pai = 21;
                //            if(pai == lastPut && lastPut!=29 ) pai =  lastPut + 1;
                //        }
                //        else if(lastPut <= 91)
                //        {
                //            pai = 31;
                //            if(pai == lastPut && lastPut!=91 ) pai =  lastPut + 10;
                //        }
                //
                //        var xunHuanNum = 0;
                //
                //        var yiTojiu = false;
                //        var shiyiToshijiu =false;
                //        var ershiyiToershijiu = false;
                //        var sanshiyiTojiushiyi = false;
                //        for(var i= 0;i<que2Pai.length;i++)
                //        {
                //            if(que2Pai[i] <= 9) yiTojiu = true;
                //            if(que2Pai[i] >= 11 && que2Pai[i] <= 19) shiyiToshijiu =true;
                //            if(que2Pai[i] >= 21  && que2Pai[i] <= 19) ershiyiToershijiu = true;
                //            if(que2Pai[i] >= 31  && que2Pai[i] <= 91) sanshiyiTojiushiyi = true;
                //        }
                //        //同一花色处理
                //        if(yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 11;
                //        if(!yiTojiu && shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 1;
                //        if(!yiTojiu && !shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 1;
                //        if(!yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 1;
                //        //2种花色处理
                //        if(yiTojiu && shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 21;// 条、万
                //        if(yiTojiu && !shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 11;//条、筒
                //        if(yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 11;//条、风
                //        if(!yiTojiu && shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 31;//万、筒
                //        if(!yiTojiu && shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 1;//万、风
                //        if(!yiTojiu && !shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 1;//筒、风
                //        //3种花色处理
                //        if(yiTojiu && shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 31;//条、万、筒
                //        if(yiTojiu && shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 21;//条、万、风
                //        if(yiTojiu && !shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 11; //条、筒、风
                //        if(!yiTojiu && shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 1;//万、筒、风
                //        //4种花色处理 暂时不需要
                //
                //        while(true)
                //        {
                //            if(que2Pai.indexOf(pai) != -1 && pai != 9 && pai != 19 && pai != 29 && pai != 91)
                //            {
                //                pai = pai + 1;
                //            }
                //            if(que2Pai.indexOf(pai) == -1) break;
                //            xunHuanNum ++ ;
                //            if(xunHuanNum >= 12) break;
                //        }
                //
                //        que2Pai.push(pai);
                //        que2Pai.push(pai);
                //
                //        xinPaiXing = "";
                //        for(var i=0;i<que2Pai.length;i++)
                //        {
                //            xinPaiXing = xinPaiXing + que2Pai[i] + ","
                //        }
                //        GLog("新的手牌 =====" + xinPaiXing + " tData.canHu7===" + tData.canHu7);
                //        isHuForQue2 =  majiang.canHu(!tData.canHu7, que2Pai, 0, false, false,tData.fanGui,tData.gui,tData.gui4Hu,tData.nextgui);
                //        for(var k =0;k<test.mjhand.length;k++)
                //        {
                //            if(test.mjhand[k] == lastPut)
                //            {
                //                num++;
                //            }
                //        }
                //
                //        if(isHuForQue2)
                //        {
                //            if(num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU )
                //            {
                //                GLog("========isHuForQue2====="+isHuForQue2);
                //                if(!tData.canJiHu)//不可鸡胡 及时鸡胡单吊花了 也不能单吊花 按之前牌型算
                //                {
                //                    result.huType = orignHuType;
                //                    result.type = 0;
                //                    result.mjhand = test.mjhand;
                //                    return result;
                //                }
                //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
                //                result.type = 1;
                //                result.mjhand = pl.mjhand;
                //                return result;
                //            }
                //            else if(num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG)
                //            {
                //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
                //                result.type = 1;
                //                result.mjhand = pl.mjhand;
                //                return result;
                //            }
                //            else if(num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE)
                //            {
                //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
                //                result.type = 1;
                //                result.mjhand = pl.mjhand;
                //                return result;
                //
                //            }
                //
                //        }
                //        else //不能是单吊花
                //        {
                //            GLog("不能是单吊花");
                //            result.huType = nowHuType;
                //            result.type = 0;
                //            result.mjhand = pl.mjhand;
                //            return result;
                //        }
                //
                //
                //        result.huType = orignHuType;
                //        result.type = 1;
                //        result.mjhand = pl.mjhand;
                //        return result;
                //    }
                //    else
                //    {
                //        GLog("原来胡成的牌型:" + orignHuType + " 目前牌型是：" + nowHuType);
                //        if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU)
                //        {
                //            if(!tData.canJiHu)//不可鸡胡 及时鸡胡单吊花了 也不能单吊花 按之前牌型算
                //            {
                //                result.huType = orignHuType;
                //                result.type = 0;
                //                result.mjhand = test.mjhand;
                //                return result;
                //            }
                //            if(orignHuType ==  majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI)
                //            {
                //                GLog("不能是单吊花");
                //                result.huType = orignHuType;
                //                result.type = 0;
                //                result.mjhand = test.mjhand;
                //                return result;
                //            }
                //            GLog("鸡胡单吊花" );
                //            result.huType = nowHuType;
                //            result.type = 1;
                //            result.mjhand = test.mjhand;
                //            return result;
                //        }
                //        else
                //        {
                //            GLog("无法形成单吊花" );
                //            result.huType = orignHuType;
                //            result.type = 0;
                //            result.mjhand = pl.mjhand;
                //            return result;
                //        }
                //    }
                //}
                //else
                //{
                //    result.huType =  orignHuType;
                //    result.type = 0;
                //    result.mjhand = pl.mjhand;
                //    return result;
                //}

                return majiang.getHuDataForDanDiaoXinXuQiu(tData,pl);
            }
            else //判断是否花调花
            {
                //必须有2个鬼以上
                if(haveTwoOrMoreFlower) {
                    GLog("花调花");
                    //{
                    //    //再去掉一张鬼牌
                    //    for (var i = 0; i < rtn.length; i++) {
                    //        if (rtn[i] >= 111) {
                    //            rtn.splice(rtn.indexOf(rtn[i]), 1);
                    //            break;
                    //        }
                    //    }
                    //    var cards = []; //去掉2个鬼的手牌
                    //    for (var i = 0; i < rtn.length; i++) {
                    //        cards.push(rtn[i]);
                    //    }
                    //
                    //    var pai = 1;
                    //    var yiTojiu = false;
                    //    var shiyiToshijiu = false;
                    //    var ershiyiToershijiu = false;
                    //    var sanshiyiTojiushiyi = false;
                    //    var xunHuanNum = 0;
                    //    for (var i = 0; i < cards.length; i++) {
                    //        if (cards[i] <= 9) yiTojiu = true;
                    //        if (cards[i] >= 11 && cards[i] <= 19) shiyiToshijiu = true;
                    //        if (cards[i] >= 21 && cards[i] <= 19) ershiyiToershijiu = true;
                    //        if (cards[i] >= 31 && cards[i] <= 91) sanshiyiTojiushiyi = true;
                    //    }
                    //    //同一花色处理
                    //    if (yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) {
                    //        pai = 11;
                    //        if (orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI) {
                    //            pai = 1;
                    //        }
                    //    }
                    //    if (!yiTojiu && shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) {
                    //        pai = 1;
                    //        if (orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI) {
                    //            pai = 11;
                    //        }
                    //    }
                    //    if (!yiTojiu && !shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) {
                    //        pai = 1;
                    //        if (orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE || orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI) {
                    //            pai = 21;
                    //        }
                    //    }
                    //    if (!yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) {
                    //        pai = 1;
                    //        if (orignHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE) {
                    //            pai = 31;
                    //        }
                    //    }
                    //    //2种花色处理
                    //    if (yiTojiu && shiyiToshijiu && !ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 21;// 条、万
                    //    if (yiTojiu && !shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 11;//条、筒
                    //    if (yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31;//条、风
                    //    if (!yiTojiu && shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 31;//万、筒
                    //    if (!yiTojiu && shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31;//万、风
                    //    if (!yiTojiu && !shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31;//筒、风
                    //    //3种花色处理
                    //    if (yiTojiu && shiyiToshijiu && ershiyiToershijiu && !sanshiyiTojiushiyi) pai = 31;//条、万、筒
                    //    if (yiTojiu && shiyiToshijiu && !ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31;//条、万、风
                    //    if (yiTojiu && !shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31; //条、筒、风
                    //    if (!yiTojiu && shiyiToshijiu && ershiyiToershijiu && sanshiyiTojiushiyi) pai = 31;//万、筒、风
                    //    //4种花色处理 暂时不需要
                    //
                    //    if (orignHuType != majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE) {
                    //        while (true) {
                    //            if (cards.indexOf(pai) != -1 && pai != 9 && pai != 19 && pai != 29 && pai != 91) {
                    //                pai = pai + 1;
                    //            }
                    //            if (cards.indexOf(pai) == -1) break;
                    //            xunHuanNum++;
                    //            if (xunHuanNum >= 12) break;
                    //        }
                    //    }
                    //    cards.push(pai);
                    //    cards.push(pai);
                    //
                    //    var xinPaiXing = "";
                    //    for (var i = 0; i < cards.length; i++) {
                    //        xinPaiXing = xinPaiXing + cards[i] + ","
                    //    }
                    //    GLog("xinPaiXing =====" + xinPaiXing);
                    //
                    //    //新牌型要保证能胡
                    //    var nowHuType1 = majiang.canHu(!tData.canHu7, cards, 0, false, false, tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui);
                    //    if (nowHuType1 > 0) {
                    //        var nowHuType = -1;
                    //        var test = [];
                    //        test.mjhand = cards;
                    //        test.mjpeng = pl.mjpeng;
                    //        test.mjgang0 = pl.mjgang0;
                    //        test.mjgang1 = pl.mjgang1;
                    //        test.winType = pl.winType;
                    //        test.mjchi = pl.mjchi;
                    //        test.huType = nowHuType1;
                    //
                    //        if (!majiang.canFindFlowerForMjhand(cards)) {
                    //            nowHuType = majiang.getHuTypeForHeYuanBaiDaNoGui(test, tData.baidadahu, tData.canHu7);
                    //        } else {
                    //            nowHuType = majiang.getHuTypeForHeYuanBaiHaveGui(test, tData.baidadahu, tData.canHu7);
                    //        }
                    //        GLog("新牌型 胡的游戏类型：" + nowHuType);
                    //        if (nowHuType == orignHuType) {
                    //            var num = 0;
                    //            for (var k = 0; k < test.mjhand.length; k++) {
                    //                if (test.mjhand[k] == pai) {
                    //                    num++;
                    //                }
                    //            }
                    //            if (num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU) {
                    //                GLog("========isHuForQue2=====" + isHuForQue2);
                    //                if (!tData.canJiHu)//不可鸡胡 及时鸡胡单吊花了 也不能单吊花 按之前牌型算
                    //                {
                    //                    result.huType = orignHuType;
                    //                    result.type = 0;
                    //                    result.mjhand = test.mjhand;
                    //                    return result;
                    //                }
                    //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
                    //                result.type = 2;
                    //                result.mjhand = pl.mjhand;
                    //                return result;
                    //            }
                    //            else if (num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG) {
                    //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
                    //                result.type = 2;
                    //                result.mjhand = pl.mjhand;
                    //                return result;
                    //            }
                    //            else if (num == 3 && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE) {
                    //                result.huType = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
                    //                result.type = 2;
                    //                result.mjhand = pl.mjhand;
                    //                return result;
                    //
                    //            }
                    //
                    //            //去掉2张加的pai牌 再加2个不是同一花色的牌 看看能胡不 不能胡 就不是花吊花
                    //            cards.splice(cards.indexOf(pai), 1);
                    //            cards.splice(cards.indexOf(pai), 1);
                    //            cards.push(31);
                    //            cards.push(31);
                    //            if (majiang.canHu(!tData.canHu7, cards, 0, false, false, tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui) <= 0) {
                    //                result.huType = orignHuType;
                    //                result.type = 0;
                    //                result.mjhand = pl.mjhand;
                    //                return result;
                    //            }
                    //
                    //        }
                    //        else {
                    //            GLog("原来胡成的牌型:" + orignHuType + " 目前牌型是：" + nowHuType + "tData.canJiHu==" + tData.canJiHu);
                    //            if (nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU) {
                    //                if (!tData.canJiHu)//不可鸡胡 及时鸡胡单吊花了 也不能单吊花 按之前牌型算
                    //                {
                    //                    result.huType = orignHuType;
                    //                    result.type = 0;
                    //                    result.mjhand = test.mjhand;
                    //                    return result;
                    //                }
                    //                GLog("鸡胡花吊花");
                    //                result.huType = nowHuType;
                    //                result.type = 2;
                    //                result.mjhand = test.mjhand;
                    //                return result;
                    //            }
                    //            else if (nowHuType > 0) {
                    //                //去掉2张加的pai牌 再加2个不是同一花色的牌 看看能胡不 不能胡 就不是花吊花
                    //                cards.splice(cards.indexOf(pai), 1);
                    //                cards.splice(cards.indexOf(pai), 1);
                    //                cards.push(31);
                    //                cards.push(31);
                    //                if (majiang.canHu(!tData.canHu7, cards, 0, false, false, tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui) <= 0) {
                    //                    result.huType = orignHuType;
                    //                    result.type = 0;
                    //                    result.mjhand = pl.mjhand;
                    //                    return result;
                    //                }
                    //
                    //                result.huType = nowHuType;
                    //                result.type = 2;
                    //                result.mjhand = test.mjhand;
                    //                return result;
                    //            }
                    //            else {
                    //                GLog("无法形成花吊花");
                    //                result.huType = orignHuType;
                    //                result.type = 0;
                    //                result.mjhand = pl.mjhand;
                    //                return result;
                    //            }
                    //        }
                    //    }
                    //    else {
                    //        GLog("重新组成的新牌型胡不了")
                    //        result.huType = orignHuType;
                    //        result.type = 0;
                    //        result.mjhand = pl.mjhand;
                    //        return result;
                    //    }
                    //    result.huType = orignHuType;
                    //    result.type = 2;
                    //    result.mjhand = pl.mjhand;
                    //    return result;
                    //}
                   return majiang.getHuDataForDanDiaoOrHuaDiaoXinXuQiu(tData,pl);
                }
                else
                {
                    result.huType =  orignHuType;
                    result.type = 0;
                    result.mjhand = pl.mjhand;
                    return result;
                }

            }
        }
    }


    function MJHuForHeYuanBaiDaXinXuQiu(pl,msg,self)
    {
        GLog("MJHuForHeYuanBaiDa");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        var huType = 0;
        huType = GetHuType(tData, pl);
        //自摸胡
        if (
            tData.tState == TableState.waitPut
            && pl.mjState == TableState.waitPut
            && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid
            &&  huType > 0//自摸测试
            &&
            (
                (
                    //大胡时 不能为鸡胡 （手牌有鬼 和 无鬼2种判断方式）
                    tData.baidadahu &&
                    (
                        (
                            (!tData.canJiHu && majiang.getHuTypeForHeYuanBaiDaNew(pl) > 0 && majiang.canFindFlowerForMjhand(pl.mjhand))
                            ||
                            tData.canJiHu
                        )
                        ||
                        (
                            majiang.getHuTypeForHeYuanBaiDa(pl) > 0 && !majiang.canFindFlowerForMjhand(pl.mjhand)
                        )
                    )
                )
                ||
                tData.baidajihu
            )
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            if(pl.winType == WinType.pickNormal || pl.winType == WinType.pickGang1 || pl.winType == WinType.pickGang23 )
            {
                var result = getHuDataForDanDiaoOrHuaDiaoXinXuQiu(self,pl);
                pl.huType = result.huType;
                pl.type = result.type;
            }
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && pl.eatFlag >= 8
            && !HighPlayerHu(self, pl)// 邵阳麻将可以多家胡 //&&(tData.putType>0||tData.canEatHu)
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8 && p.uid == pl.uid) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }


    function MJHuForXiangGang(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0//自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            canEnd = true;

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /* &&!HighPlayerHuForShenZhen(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    function MJHuForZuoPaiTuiDaoHu(pl, msg, self) {
        var tData = self.tData;
        var uids = self.tData.uids;
        var horse = tData.horse;
        if ((tData.fanGui || tData.withZhong )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;
        else if ((tData.fanGui || tData.withBai )&&pl && !majiang.isFindGuiForMjhand(pl.mjhand) && !tData.baozhama && horse >= 2  && tData.guiJiaMa) horse = horse + 2;

        var canEnd = false;
        //自摸胡
        if (
            tData.tState == TableState.waitPut && pl.mjState == TableState.waitPut && pl.isNew
            && tData.uids[tData.curPlayer] == pl.uid && GetHuType(tData, pl) > 0 //自摸测试
        ) {
            //补摸
            if (tData.putType > 0 && tData.putType < 4) {
                if (tData.putType == 1) {
                    pl.winType = WinType.pickGang1;
                    pl.gangBao = true;
                }
                else//自摸杠在补摸
                {
                    pl.winType = WinType.pickGang23;
                    pl.gangBao = true;
                }
            }
            else//自摸
            {
                pl.winType = WinType.pickNormal;
            }
            if(tData.cardNext == (tData.cardsNum - horse)) pl.haiDiHu = true;
            canEnd = true;
            GLog("tData.cardNext ==" + tData.cardNext + " tData.cardsNum - horse =" +tData.cardsNum - horse + " tData.cardsNum=" + tData.cardsNum + " horse=" + horse);

        }
        //点炮胡 抢杠胡
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            if (tData.tState == TableState.waitEat) {
                var fp = self.getPlayer(tData.uids[tData.curPlayer]);
                var winType = null;
                var mjput = null;
                if (tData.putType == 0) {
                    winType = WinType.eatPut;
                    mjput = fp.mjput;
                }
                else if (tData.putType == 4) {
                    winType = WinType.eatGangPut;
                    mjput = fp.mjput;
                }
                else //抢杠包3家
                {
                    winType = WinType.eatGang;
                    if (tData.putType == 3) mjput = fp.mjgang1;
                    else mjput = fp.mjgang0;
                }
                if (mjput.length > 0 && mjput[mjput.length - 1] == tData.lastPut) {
                    mjput.length = mjput.length - 1;
                }
                else return;
                //一炮多响
                self.AllPlayerRun(function (p) {
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                    }
                });
                //if (pl.mjState == TableState.waitEat && pl.eatFlag >= 8) {
                //    pl.mjhand.push(tData.lastPut);
                //    pl.winType = winType;
                //}
                canEnd = true;
            }
        }
        if (canEnd) {
            self.mjlog.push("MJHu", {uid: pl.uid, eatFlag: msg.eatFlag});
            EndGame(self, pl);
        }
        else {
            if (!app.huError) app.huError = [];
            app.FileWork(app.huError, app.serverId + "huError.txt",
                tData.tState + " " + pl.mjState + " " + pl.isNew + " " + tData.uids[tData.curPlayer] + " " + pl.uid + " " + pl.huType
            );
        }
    }

    Table.prototype.MJHu = function (pl, msg, session, next) {
        //此处必须保证胡牌顺序
        next(null, null); //if(this.GamePause()) return;
        majiang.init(this);
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
                MJHuForGuangDong(pl, msg, this);
                break;
            case GamesType.HUI_ZHOU:
                MJHuForHuiZhou(pl, msg, this);
                break;
            case GamesType.SHEN_ZHEN:
                MJHuForShenZhen(pl, msg, this);
                break;
            case GamesType.JI_PING_HU:
                MJHuForJiPingHu(pl, msg, this);
                break;
            case GamesType.DONG_GUAN:
                MJHuForDongGuan(pl,msg,this);
                break;
            case GamesType.YI_BAI_ZHANG:
                MJHuForYiBaiZhang(pl, msg, this);
                break;
            case GamesType.CHAO_ZHOU:
                MJHuForChaoZhou(pl, msg, this);
                break;
            case GamesType.HE_YUAN_BAI_DA:
                MJHuForHeYuanBaiDaXinXuQiu(pl,msg,this);
                break;
            case GamesType.XIANG_GANG:
                MJHuForXiangGang(pl, msg, this);
                break;
            case GamesType.ZUO_PAI_TUI_DAO_HU:
                MJHuForZuoPaiTuiDaoHu(pl, msg, this);
                break;
        }
    }
    Table.prototype.DelRoom = function (pl, msg, session, next) {
        GLog("Table.prototype.DelRoom");
        next(null, null);
        majiang.init(this);
        var table = this;
        var tData = this.tData;
        if (pl.delRoom == 0) {
            var yesuid = [];
            var nouid = [];
            if (msg.yes) {
                if (this.PlayerCount() < tData.maxPlayer) {
                    RoomEnd(this, {reason: 0});
                    return;//人数不足
                }
                pl.delRoom = 1;
                if (tData.delEnd == 0) {
                    tData.delEnd = Date.now() + 5 * 60000;
                    tData.firstDel = pl.uid;
                    this.SetTimer
                    (
                        5 * 60000, function () {
                            if (tData.delEnd != 0) RoomEnd(table, {reason: 1});//超时
                        }
                    );
                }
                //包括发起人3个以上同意结束房间
                else if (this.CheckPlayerCount(function (p) {
                        if (p.delRoom > 0) {
                            yesuid.push(p.uid);
                            return true;
                        }
                        return false;
                    }) >= (tData.maxPlayer - 1)) {
                    RoomEnd(this, {reason: 2, yesuid: yesuid});
                    return; //同意
                }
            }
            else {
                pl.delRoom = -1;
                //2个以上不同意结束房间
                if (this.CheckPlayerCount(function (p) {
                        if (p.delRoom < 0) {
                            nouid.push(p.uid);
                            return true;
                        }
                        return false;
                    }) >= 1) {
                    tData.delEnd = 0;
                    tData.firstDel = -1;
                    this.SetTimer();
                    this.AllPlayerRun(function (p) {
                        p.delRoom = 0;
                    });
                }
            }
            this.NotifyAll("DelRoom", {players: this.collectPlayer("delRoom"), tData: tData, nouid: nouid});
        }
    }
}