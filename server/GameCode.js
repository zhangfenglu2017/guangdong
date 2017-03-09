module.exports = function (app, server, gameid, Player, Table, TableGroup, TableManager, Game) {
    var gameLog = [];

    var fs=require('fs');
    var os = require('os');
    var existCheck={};

    var publicIp=null;
    function getPublicIp()
    {
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
        if(getPublicIp() != "114.55.255.22") return; 
        app.FileWork(gameLog, __dirname + "/log.txt", log)
    }

    console.error(app.serverId + " reload game code " + gameid);
    var logid = Date.now();
    delete require.cache[require.resolve("./majiang.js")];
    var majiang = require("./majiang.js");
    var GamesType = {
        GANG_DONG: 1,//广东麻将
        HUI_ZHOU: 2,//惠州麻将
        SHEN_ZHEN: 3,//深圳麻将
        JI_PING_HU:4,//（鸡平胡)
        DONG_GUAN:5,//东莞麻将
        YI_BAI_ZHANG:6,//清远100张
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
        pickGang23: 6  //摸牌开杠补牌自摸
    }

    function GetHuType(td, pl, cd) {
        //for(var i=0;i<pl.mjhand.length;i++){
        //	GLog("pl.mjhand["+i+"]===="+pl.mjhand[i]);
        //}
        var huType = majiang.canHu(!td.canHu7, pl.mjhand, cd, td.canHuWith258, td.withZhong,td.fanGui,td.gui,td.gui4Hu);
        pl.huType = huType;
        return huType;
    }

    function GetShenZhenEatFlag(pl, tData,self) {
        GLog("GetShenZhenEatFlag");
        var cd = tData.lastPut;
        var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if(tData.withWind && !tData.withZhong) leftCard = 136 - 4 - tData.cardNext;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        GLog("GetShenZhenEatFlag leftCard----" + leftCard);
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) {
            eatFlag += 8;
            GLog("eatFlag=====" + eatFlag);
        }
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui) horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
            //switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
            //    case 1:
            //        //horse = horse + 2;
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}

        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        GLog("GetShenZhenEatFlag eatFlag=-------------" + eatFlag);
        return eatFlag;
    }

    function GetHuiZhouEatFlag(pl, tData) {
        GLog("GetHuiZhouEatFlag");
        var cd = tData.lastPut;
        var leftCard = 0, eatFlag = 0, horse = tData.horse;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        leftCard += 8;
        GLog("leftCard---》" + leftCard);
        //if(!pl.skipHu && (tData.canEatHu||tData.putType==4) && GetHuType(tData,pl,cd)>0) { eatFlag+=8; GLog("eatFlag="+eatFlag +" " + pl.info.name + " 第"+ tData.uids.indexOf(pl.uid)+"个人可胡");}
        var isJiHu = 0;
        if (GetHuType(tData, pl, cd) > 0) {
            GLog("前是否能胡GetHuType====" + GetHuType(tData, pl, cd));
            isJiHu = majiang.prejudgeHuType(pl, cd);
            GLog("后是否能胡GetHuType====" + GetHuType(tData, pl, cd));
        }
        GLog("是否是鸡胡=====" + isJiHu);

        //if(!pl.skipHu  && GetHuType(tData,pl,cd)>0 && (tData.canEatHu||tData.putType==4 || !isJiHu)) { eatFlag+=8; GLog("eatFlag="+eatFlag +" " + pl.info.name + " 第"+ tData.uids.indexOf(pl.uid)+"个人可胡");}
        if (!pl.skipHu && GetHuType(tData, pl, cd) > 0 && isJiHu > 0 || (tData.canEatHu || (tData.putType == 4 && isJiHu > 0) ) ) {
            eatFlag += 8;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可胡");
        }
        if (tData.withZhong || tData.fanGui) horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd)) {
            eatFlag += 4;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可明杠");
        }
        if ((leftCard >= horse) && majiang.canPeng(pl.mjhand, cd) /*&& (pl.skipPeng.length == 0 || pl.skipPeng.length != 0 && pl.skipPeng.indexOf(cd) == -1)*/) {
            eatFlag += 2;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可碰");
        }
        if ((leftCard > horse) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) {
            eatFlag += 1;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可吃");
        }
        GLog("总的 eatFlag=====" + eatFlag);
        return eatFlag;
    }

    function GetGuangDongEatFlag(pl, tData,self) {
        GLog("GetGuangDongEatFlag");
        var cd = tData.lastPut;
        var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        //if(tData.withWind && !tData.withZhong) leftCard = 136 - 4 - tData.cardNext;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        GLog("GetGuangDongEatFlag leftCard----" + leftCard);
        var eatFlag = 0;
        //if(!pl.skipHu && (tData.canEatHu||tData.putType==4)&& GetHuType(tData,pl,cd)>0)  eatFlag+=8;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) {
            eatFlag += 8;
            GLog("eatFlag=====" + eatFlag);
        }
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui) horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
            //switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
            //    case 1:
            //        //horse = horse + 2;
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}

        }
        //if(leftCard>0&&majiang.canGang0(pl.mjhand,cd))        eatFlag+=4;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        //if((leftCard>4||tData.noBigWin)&&majiang.canPeng(pl.mjhand,cd))         eatFlag+=2;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        //if((leftCard>4||tData.noBigWin)&&tData.canEat&&
        //    tData.uids[(tData.curPlayer+1)%4]==pl.uid && //下家限制
        //    majiang.canChi(pl.mjhand,cd).length>0
        // ) eatFlag+=1;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        GLog("GetGuangDongEatFlag eatFlag=-------------" + eatFlag);
        return eatFlag;
    }

    function GetDongGuanEatFlag(pl, tData) {
        GLog("GetDongGuanEatFlag");
        var cd = tData.lastPut;
        var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;
        GLog("GetDongGuanEatFlag leftCard----" + leftCard);
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) {
            eatFlag += 8;
        }
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui) horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd) /*&& (pl.skipPeng.length == 0 || pl.skipPeng.length != 0 && pl.skipPeng.indexOf(cd) == -1)*/)       eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        GLog("GetDongGuanEatFlag=-------------" + eatFlag);
        return eatFlag;
    }

    function GetJiPingHuEatFlag(pl,tData){
        GLog("");
        GLog("GetJiPingHuEatFlag");
        var cd = tData.lastPut;
        var leftCard = 0, eatFlag = 0;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext;

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

    function GetYiBaiZhangEatFlag(pl, tData) {
        GLog("GetYiBaiZhangEatFlag");
        var cd = tData.lastPut;
        var leftCard = (tData.withWind ? 136 : 108) - tData.cardNext - 36;
        if (tData.withWind && tData.withZhong) leftCard = 136 - tData.cardNext - 36;
        if (tData.withWind && !tData.withZhong) leftCard = 136 - tData.cardNext -36;
        if (!tData.withWind && tData.withZhong) leftCard = 108 + 4 - tData.cardNext -36;
        if (!tData.withWind && !tData.withZhong) leftCard = 108 - tData.cardNext -36;
        GLog("GetYiBaiZhangEatFlag leftCard----" + leftCard);
        var eatFlag = 0;
        if (!pl.skipHu && tData.canEatHu && GetHuType(tData, pl, cd) > 0) {
            eatFlag += 8;
        }
        var horse = tData.horse;
        if (tData.withZhong || tData.fanGui) horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % tData.maxPlayer] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        GLog("GetYiBaiZhangEatFlag=-------------" + eatFlag);
        return eatFlag;
    }

    function GetEatFlag(pl, tData,self) {
        GLog("GetEatFlag");
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
        }
        return eatFlag;
    }

    Table.prototype.initTable = function () {
        var table = this;
        var rcfg = this.roomCfg();
        table.uid2did = {};
        //服务器私有
        table.cards = [];
        //回放记录
        table.mjlog = [];
        //公开
        table.tData = {
            canBigWin:false,//能否大胡
            cardsNum :0,//牌总数
            tState: TableState.waitJoin,
            initCoin: 1000,   //积分显示
            fanGui:false,     //翻鬼
            gui:0,            //默认鬼牌为0
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
        };
        majiang.init(this);
    }
    //断线重连
    Table.prototype.Disconnect = function (pl, msg) {
        GLog("Table.prototype.Disconnect");
        pl.onLine = false;
        this.channel.leave(pl.uid, pl.fid);
        pl.fid = null;
        this.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: false, mjState: pl.mjState});
        //console.info("Disconnect "+pl.uid+" "+pl.fid+" "+pl.sid);
    }
    Table.prototype.Reconnect = function (pl, plData, msg, sinfo) {
        GLog("Table.prototype.Reconnect");
        majiang.init(this);
        pl.onLine = true;
        var tData = this.tData;
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
        this.channel.leave(pl.uid, pl.fid);
        pl.sid = sinfo.sid;
        pl.fid = sinfo.fid;
        pl.did = sinfo.did;
        if (pl.mjState == TableState.roundFinish) pl.mjState = TableState.isReady;
        this.NotifyAll('onlinePlayer', {uid: pl.uid, onLine: true, mjState: pl.mjState});
        this.channel.add(pl.uid, pl.fid);
        pl.notify("initSceneData", this.initSceneData(pl));


        //console.info("initSceneData "+pl.uid+" "+pl.fid+" "+pl.sid);
        this.startGame();
    }
    Table.prototype.CanAddPlayer = function (pl) {
        GLog("Table.prototype.CanAddPlayer");
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
        GLog("Table.prototype.CanLeaveGame");
        var tData = this.tData;
        if ((tData.tState == TableState.waitJoin && pl.uid != tData.owner) || tData.roundNum == -2) {
            return true;
        }
        return false;
    }
    function isUndefined(obj) {
        return obj === void 0;
    }

    function initAddPlayerForShenZhen(pl, self, msg) {
        GLog("Table.prototype.initAddPlayerForShenZhen");
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
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            //tData.canHuWith258=isUndefined(this.createPara.canHuWith258) ? false:this.createPara.canHuWith258; //只能258做将
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.jiejieGao = self.createPara.jiejieGao;
            tData.fanGui = self.createPara.fanGui;
            if(tData.withZhong && tData.fanGui) {tData.withZhong = true;tData.fanGui = false;};
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
            GLog("节节高:" + tData.jiejieGao);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
        }
        if (tData.owner == -1) {
            tData.owner = pl.uid;
            // pl.linkZhuang = 0;
        }
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
        GLog("Table.prototype.initAddPlayerForGuangDong");
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

        var tData = self.tData;
        if (tData.roundNum == -1) {
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            //tData.canHuWith258=isUndefined(this.createPara.canHuWith258) ? false:this.createPara.canHuWith258; //只能258做将
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.canFan7) tData.canHu7 = true;
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            if(tData.withZhong && tData.fanGui) {tData.withZhong = true;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.jiejieGao = isUndefined(self.createPara.jiejieGao) ? false : self.createPara.jiejieGao;
            tData.gui4Hu = true;

            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
            GLog("几人房：" + tData.maxPlayer);
            GLog("节节高:" + tData.jiejieGao);
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
        GLog("Table.prototype.initAddPlayerForDongGuan");
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
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.zhongIsMa = isUndefined(self.createPara.zhongIsMa) ? false : self.createPara.zhongIsMa;
            if(tData.withZhong) tData.zhongIsMa = false;
            if(tData.zhongIsMa) tData.withZhong = false;
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.canFan7) tData.canHu7 = true;
            if(tData.withZhong && tData.fanGui) {tData.withZhong = true;tData.fanGui = false;};
            tData.maxPlayer = isUndefined(self.createPara.maxPlayer) ? 4 :self.createPara.maxPlayer;//几人房
            tData.gui4Hu = true;

            //暂时写死
            //tData.gameType = 5;
            //tData.withWind = true;
            //tData.canEat = false;
            //tData.canHu7 = true;
            //tData.withZhong = false;
            //tData.zhongIsMa = true;
            //tData.canEatHu = false;
            //tData.roundAll = 8;
            //tData.horse = 2;
            //tData.fanGui = false;
            //tData.maxPlayer = 4;


            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("7对加番：" + tData.canFan7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("红中算马:" + tData.zhongIsMa);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("翻鬼：" + tData.fanGui);
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

    function initAddPlayerForHuiZhou(pl, self, msg) {
        GLog("Table.prototype.initAddPlayerForHuiZhou");
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
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            //tData.canHuWith258=isUndefined(this.createPara.canHuWith258) ? false:this.createPara.canHuWith258; //只能258做将
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;//惠州麻将 2
            tData.horse = self.createPara.horse;
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

    function initAddPlayerForJiPingHu(pl, self, msg){
        GLog("Table.prototype.initAddPlayerForJiPingHu");
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
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            //tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.canEatHu = false;
            tData.withWind = self.createPara.withWind; //是否可以带风
            //tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.canEat = true;
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            //tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.canHu7 = false;
            //tData.canHuWith258=isUndefined(this.createPara.canHuWith258) ? false:this.createPara.canHuWith258; //只能258做将
            //tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.withZhong = false;
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            //tData.horse = self.createPara.horse;
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
        GLog("Table.prototype.initAddPlayerForYiBaiZhang");
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
            tData.roundAll = self.createPara.round;    //总
            tData.roundNum = self.createPara.round;    //剩余
            tData.canEatHu = self.createPara.canEatHu; //是否可以吃胡
            tData.withWind = self.createPara.withWind; //是否可以带风
            tData.canEat = self.createPara.canEat;     //是否可以吃
            tData.noBigWin = false;//this.createPara.noBigWin; //是否邵阳玩法
            tData.canHu7 = isUndefined(self.createPara.canHu7) ? false : self.createPara.canHu7; //是否可以七对
            tData.withZhong = isUndefined(self.createPara.withZhong) ? false : self.createPara.withZhong; //红中赖子
            tData.canHuWith258 = false;
            tData.gameType = self.createPara.gameType;
            tData.horse = self.createPara.horse;
            tData.fanGui = self.createPara.fanGui;
            tData.canFan7 = isUndefined(self.createPara.canFan7) ? false : self.createPara.canFan7; //是否可以七对
            if(tData.withZhong && tData.fanGui) {tData.withZhong = true;tData.fanGui = false;};
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
            //规避前端误传参数带来数据错误的风险
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
            if(tData.withZhong || tData.fanGui)
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

    Table.prototype.initAddPlayer = function (pl, msg) {
        GLog("Table.prototype.initAddPlayer");
        var tData = this.tData;

        if (tData.roundNum == -1) tData.gameType = this.createPara.gameType;
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
        }
    }
    //客户端收到initSceneData  session中的pkroom还没有设定好
    Table.prototype.initSceneData = function (pl) {
        GLog("Table.prototype.initSceneData");
        //公共
        var msg = {
            players: this.collectPlayer(
                'info', 'mjState', 'mjpeng', 'mjgang0', 'mjgang1', 'mjchi', 'mjput', 'onLine', 'delRoom',
                'isNew', 'winall', 'mjMa', 'left4Ma', 'mjflower', 'skipPeng', 'baojiu', 'skipHu', 'linkZhuang','fengWei','mjzhong','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum')
            , tData: this.tData
            , serverNow: Date.now()
        };
        //私有
        msg.players[pl.uid].mjhand = pl.mjhand;
        msg.players[pl.uid].mjpeng4 = pl.mjpeng4;
        msg.players[pl.uid].skipHu = pl.skipHu;
        GLog("======重连 uid=" + pl.uid + " skipHu === " + pl.skipHu);

        return msg;
    }

    function DestroyTable(tb) {
        GLog("function DestroyTable");
        if (tb.PlayerCount() == 0 && tb.tData.roundNum == -2) {
            tb.tData.roundNum = -3;
            tb.Destroy();
        }
    }

    Table.prototype.cleanRemovePlayer = function (pl) {
        GLog("Table.prototype.cleanRemovePlayer");
        //console.info("cleanRemovePlayer "+pl.uid+" "+this.tData.roundNum);
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
        GLog("Table.prototype.startGameForJiPingHu");
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
                self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//无花牌
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
            GLog("startGame  horse===" + tData.horse);
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
        GLog("Table.prototype.startGameForShenZhen");
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
            }
            GLog("鬼牌：" + tData.gui);
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//这里需要改成深圳的
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
                //self.players[tData.uids[tData.zhuang]].linkZhuang = 1;
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
            GLog("startGame  horse===" + tData.horse);
            var cards = self.cards;
            for (var i = 0; i < tData.maxPlayer; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % tData.maxPlayer]];
                // if (!isFirst && pl.uid != tData.uids[tData.zhuang]) pl.linkZhuang = 0;
                // if (!isFirst && pl.uid == tData.uids[tData.zhuang]) pl.linkZhuang += 1;

                //if (!isFirst && pl.uid != tData.uids[tData.zhuang]) pl.linkZhuang = 1;
                // if (isFirst) pl.linkZhuang = 0;
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
        GLog("Table.prototype.startGameForDongGuan");
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
            GLog("鬼牌：" + tData.gui);
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
            GLog("startGame  horse===" + tData.horse);
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
        GLog("Table.prototype.startGameForYiBaiZhang");
        if (self.tData.roundNum > 0 && self.PlayerCount() == self.tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                // majiang.gui = majiang.getRandomGui(tData.withWind);
                majiang.gui = majiang.getRandomGuiForYiBaiZhang();
                tData.gui = majiang.gui ;
            }
            GLog("鬼牌：" + tData.gui);
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomYiBaiZhangCards(self.tData.withWind, self.tData.withZhong);
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
            GLog("startGame  horse===" + tData.horse);
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
            }
            GLog("鬼牌：" + tData.gui);
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
            GLog("startGame  horse===" + tData.horse);
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

    function startGameForHuiZhou(self){
        var tData = self.tData;
        if (self.tData.roundNum > 0 && self.PlayerCount() == tData.maxPlayer
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if(tData.fanGui) {
                majiang.gui = majiang.getRandomGui(tData.withWind);
                tData.gui = majiang.gui ;
            }
            GLog("鬼牌：" + tData.gui);
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
                self.tData.cardsNum = self.cards.length;
            }
            else {
                self.cards = majiang.randomHuiZhouCards(self.tData.withWind, self.tData.withZhong);
                self.tData.cardsNum = self.cards.length;
            }
            GLog("Table.prototype.startGame  withWind:" + self.tData.withWind + "    withZhong:" + self.tData.withZhong);
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
                tData.zhuang = tData.curPlayer;
            }
            else//有赢家
            {
                tData.zhuang = tData.curPlayer = tData.winner;
            }
            tData.cardNext = 0;
            tData.tState = TableState.waitCard;
            tData.winner = -1;
            GLog("startGame  horse===" + tData.horse);
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
                //pl.left4Ma=[];//剩余麻将中的前4个 作为马
                //if(isFirst)
                //{
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }
                //}

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
            tData.curPlayer = (tData.curPlayer + tData.maxPlayer - 1) % tData.maxPlayer;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    Table.prototype.startGame = function () {
        GLog("Table.prototype.startGame");
        var tData = this.tData;
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
        }
        majiang.init(this);
    }

    function EndGameForShenZhen(tb, pl, byEndRoom) {
        GLog("function EndGameForShenZhen");
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            GLog("EndGameForShenZhen===========linkZhuang=================================" + pl.linkZhuang);
            horse += (pl.linkHu)*2;
            //switch (pl.linkZhuang) {
            //    case 1:
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui)) horse = horse + 2;
            }
        }
        GLog("EndGameForShenZhen  horse==========================================" + horse);
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
            //pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * (tData.maxPlayer - 1);

            if (pi.mjgang0.length > 0) pi.mjdesc.push(pi.mjgang0.length + "明杠");
            for (var g = 0; g < pi.mjgang0.length; g++) {
                var ganguid = pi.gang0uid[pi.mjgang0[g]];
                for (var j = 0; j < pls.length; j++) {
                    if (j != i) {
                        var pj = pls[j];
                        if (ganguid >= 0 && pj.uid != tData.uids[ganguid]) continue;
                        if (ganguid >= 0) {
                            pj.winone -= 3;
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

                    if (num2 == 2) {
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

                    if (maCount > 0) baseWin = baseWin + maFan;
                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;

                        //抢杠胡 杠炮的那个玩家包3家 马钱也包
                        if (pi.winType == WinType.eatGang) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            if(pi.mjdesc.indexOf("抢杠胡") == -1) pi.mjdesc.push("抢杠胡");
                            baseWin = baseWin * 3;
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
                            GLog("胡家类型：" + pi.winType);
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
            GLog("赢得玩家的分====" + pl.winone);
            GLog("最终     胡家类型：" + huType + desc);
        }
        else {
            tData.winner = -1;
            GLog("黄庄");
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
    }

    function EndGameForHuiZhou(tb, pl, byEndRoom) {
        GLog("function EndGameForHuiZhou");
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
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        GLog("endGame  horse===" + horse);
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            // pls[z].left4Ma.length = 0;
            pls[z].left4Ma=[];
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //查看  每人的花牌数量
        for (var i = 0; i < pls.length; i++) {
            var count = pls[i].mjflower.length;
            GLog("---------" + i + "人花数量----------" + count);
        }

        //查看 胡牌人的花牌数量
        if (pl) {
            var count = pl.mjflower.length;
            GLog("---------胡牌花数量----------" + count);
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
                if (pi.winType > 0) {
                    //0 鸡胡 1清一色 2杂色 3大哥  4杂碰 5十三幺 6碰碰胡 7杂幺九 8清幺九 9字一色 10 全幺九 (不含杠上花和抢杠胡)
                    var desc = "";
                    var huType = majiang.getHuType(pi);
                    var baseWin = 3;
                    switch (huType) {
                        case majiang.HUI_ZHOU_HTYPE.JIHU:
                            desc = "鸡胡";
                            baseWin = 3;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.QINGYISE:
                            desc = "清一色";
                            baseWin = 15;
                            break;
                        case majiang.HUI_ZHOU_HTYPE.ZASE:
                            desc = "杂色";
                            baseWin = 6;
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
                            desc = "碰碰胡";
                            baseWin = 9;
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

                    //鸡胡不算花，大胡算花
                    if (huType > 0) {
                        if (pi.mjflower.length > 0) pi.mjdesc.push("花X" + pi.mjflower.length);
                        baseWin += pi.mjflower.length;
                    }


                    pi.baseWin = 1


                    var isBaoJiu = false;

                    var maFan = 0;//算分
                    var maCount = 0;

                    var zhongMaNum = majiang.getMaPrice(pi);
                    maFan = 2 * zhongMaNum;
                    maCount = zhongMaNum;

                    if (maCount > 0) baseWin = baseWin + maFan;
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
                            baseWin = baseWin * 3;
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
                            GLog("胡家类型：" + pi.winType);
                            pi.baseWin = 1;
                            if(pi.mjdesc.indexOf("杠上花") == -1)pi.mjdesc.push("杠上花");
                        }

                        //报九张(一定放在最后)
                        if (pi.winType == WinType.pickNormal && pi.baojiu.num == 4) {
                            isBaoJiu = true;
                            pi.baseWin = 1;//都改成1了
                        }
                        //非点炮时 输的玩家 算马与花 该怎么算就怎么算
                        if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pi.winone += baseWin;
                        //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
                        //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0) pi.winone += (maFan + pi.mjflower.length);
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0) pi.winone += maFan;
                        if (pi.winType == WinType.pickNormal && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]) == pj && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
                            pj.winone -= baseWin * 3;
                            if(tData.maxPlayer == 4 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包三家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.indexOf("包两家") == -1) tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]).mjdesc.push("包两家");
                        }
                        else if (isBaoJiu && (huType == majiang.HUI_ZHOU_HTYPE.ZIYISE || huType == majiang.HUI_ZHOU_HTYPE.DAGE || huType == majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)) {
                            pj.winone -= 0;
                        }
                        else {
                            GLog("else 里面的 pi.winType === " + pi.winType);
                            if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pj.winone -= baseWin;
                            //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
                            //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0 ) pj.winone -= (maFan + pi.mjflower.length);
                            //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0 ) pj.winone -= maFan;
                        }
                    }


                    if (maCount > 0) pi.mjdesc.push("买马" + maCount);
                    if (maCount >= 0) {
                        pi.zhongMaNum = maCount;
                    }

                }

            }
            GLog("赢得玩家的分====" + pl.winone);
            GLog("最终     胡家类型：" + pl.winType);
        }
        else {
            tData.winner = -1;
            GLog("黄庄");
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
    }

    function EndGameForGangDong(tb, pl, byEndRoom) {
        GLog("function EndGmaeForGangDong");
        var tData = tb.tData;
        var pls = [];
        tb.AllPlayerRun(function (p) {
            p.mjState = TableState.roundFinish;
            pls.push(p);
        });

        var horse = tData.horse;
        if (pl && tData.jiejieGao) {
            GLog("EndGameForGuangDong===========linkZhuang=================================" + pl.linkZhuang);
            horse += (pl.linkHu)*2;
            //switch (pl.linkZhuang) {
            //    case 1:
            //
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}
        }


        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui)) horse = horse + 2;
            }
        }
        GLog("endGame  horse===" + horse);
        //不管胡不胡都给每位玩家 传送left4Ma
        GLog("eneGameforGuangDong pls.length======"+pls.length);
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
                        if (sameColor)
                        {
                            des = "清一色";
                            judgeType = 1;
                        }
                        if (hunyise) {
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
                            pi.mjdesc.push("杠上花");
                            judgeType = 1;
                        }


                    }

                    pi.baseWin = 1
                    var maFan = 1;//算分
                    var maCount = 0;
                    var zhongMaNum = majiang.getMaPrice(pi);
                    if(zhongMaNum == 0){
                        maFan = 1;
                        maCount = zhongMaNum;
                    }else{
                        maFan = 2 * zhongMaNum;
                        maCount = zhongMaNum;
                    }
                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;
                        var roundWin = 1;
                        //抢杠胡 包3家
                        if (pi.winType == WinType.eatGang) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            judgeType = 1;
                            //后加的 在广州的基础上 新增七对加番选项 ：即选七对加番后 胡了七对或豪华七对 胡牌变为每家4分，即2×2
                            if(num2 > 0 && tData.canFan7){
                                if(maFan == 1)  baseWin = (tData.maxPlayer - 1)*2 * 2;
                                else baseWin = maFan * (tData.maxPlayer - 1) + (tData.maxPlayer - 1) * 2 * 2 ;
                            }else
                            {
                                if(maFan == 1)  baseWin = (tData.maxPlayer - 1)*2;
                                else baseWin = maFan * (tData.maxPlayer - 1) + (tData.maxPlayer - 1) * 2;
                            }
                            if(pi.mjdesc.indexOf("抢杠胡") == -1)pi.mjdesc.push("抢杠胡");
                            if(tData.maxPlayer == 4 && pj.mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && pj.mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
                        }
                        else {
                            //后加的 在广州的基础上 新增七对加番选项 ：即选七对加番后 胡了七对或豪华七对 胡牌变为每家4分，即2×2
                            if(num2 > 0 && tData.canFan7)
                            {
                                if (maFan == 1) baseWin = 2 * 2;//无马 基础分2
                                else baseWin = maFan + 1 * 2 * 2;
                            }else{
                                if (maFan == 1) baseWin = maFan + 1;//无马 基础分2
                                else baseWin = maFan + 1 * 2;
                            }
                            pi.baseWin = 1;
                        }

                        pi.winone += roundWin * baseWin;
                        pj.winone -= roundWin * baseWin;
                    }


                    if (maFan != 1) pi.mjdesc.push("买马" + maCount);
                    if (maCount >= 0) {
                        pi.zhongMaNum = maCount;
                    }
                }
            }

            for(var i=0;i<pls.length;i++){
                GLog("");
                if(pls[i].winType > 0)
                {
                    GLog("赢得玩家  " + pls[i].uid + " 赢得分:"+pls[i].winone + " 描述：" + pls[i].mjdesc );
                }
                else{
                    GLog("输得玩家  " + pls[i].uid + " 赢得分:"+pls[i].winone + " 描述：" + pls[i].mjdesc );
                }
                GLog("");
            }
            GLog("赢得玩家的分====" + pl.winone);
            GLog("最终     胡家类型：" + pl.winType);
            GLog("pi.desc===="+pl.mjdesc);

        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
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
                    if (majiang.isGetBenMenMenFengKeZi(pi)) if(pi.mjdesc.indexOf("风位刻") == -1) pi.mjdesc.push("风位刻");
                    if (majiang.getSanYuanPaiKeZiNum(pi) > 0)  pi.mjdesc.push("三元刻X" + majiang.getSanYuanPaiKeZiNum(pi));
                    if (pi.baoZiMo.isOk) tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer]).mjdesc.push("包自摸");
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
                        if (pi.baoZiMo.isOk) {
                            pi.winone += Math.pow(2, pi.baseWin);
                            tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer]).winone -= Math.pow(2, pi.baseWin);
                            if(tData.maxPlayer == 4 && tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer]).mjdesc.indexOf("包三家") == -1) pj.mjdesc.push("包三家");
                            if(tData.maxPlayer == 3 && tb.getPlayer(tData.uids[pi.baoZiMo.putCardPlayer]).mjdesc.indexOf("包两家") == -1) pj.mjdesc.push("包两家");
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
            GLog("黄庄");
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
                //owner.$inc = {money: -tb.createPara.money};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma','zhongMaNum','winTotalNum','mingGangTotalNum','anGangTotalNum','zhongMaTotalNum'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
    }

    function EndGameForDongGuan(tb, pl, byEndRoom) {
        GLog("function EndGameForDongGuan");
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
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui)) horse = horse + 2;
            }
        }
        GLog("EndGameForDongGuan  horse==========================================" + horse);
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
                        GLog("红中 算马个数是"+pi.mjzhong.length);
                    }
                    maFan = 2 * maCount;

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

                    if (maCount > 0) baseWin = baseWin + maFan;
                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;
                        //抢杠胡 被抢杠者包3家
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
        else {
            tData.winner = -1;
            GLog("黄庄");
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                 owner.$inc = {money: -tb.createPara.money};
                // owner.$inc = {money: 0};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
    }

    function EndGameForYiBaiZhuang(tb, pl, byEndRoom) {
        GLog("function EndGameForYiBaiZhuang");
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
        if(tData.fanGui){
            if (pl) {
                if (!majiang.isHuWithFanGui(pl,tData.gui) && tData.guiJiaMa) horse = horse + 2;
            }
        }
        GLog("EndGameForYiBaiZhuang  horse==========================================" + horse);
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
                if (pi.winType > 0) {
                    pi.baseWin = 1
                    var num2 = pi.huType == 7 ? 1 : 0;
                    if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                    var desc = "";
                    //100张 0平胡 1碰碰胡 2七对 3龙七对 4混一色 5清一色 6混碰 7清碰 8幺九 9字一色 10十三幺
                    //二期需求 去掉7对胡法 混一色 及 混碰
                    var huType = majiang.getHuTypeForYiBaiZhang(pi);
                    //鬼牌模式 摸到4鬼 直接平胡
                    //if((tData.withZhong || tData.fanGui) && tData.gui4Hu && majiang.check4guiforhands(pi.mjhand,tData.withZhong,tData.fanGui,tData.gui)) huType = 1000;
                    //if(huType == 1000) desc = "平胡";
                    var baseWin = 2;
                    switch (huType) {
                        case majiang.YI_BAI_ZHANG.PINGHU:
                            desc = "平胡";
                            break;
                        case majiang.YI_BAI_ZHANG.PENGPENGHU:
                            desc = "碰碰胡";
                            if(tData.canBigWin) baseWin = 4;
                            break;
                        //case majiang.YI_BAI_ZHANG.HUNYISE:
                        //    desc = "混一色";
                        //    if(tData.canBigWin) baseWin = 4;
                        //    break;
                        case majiang.YI_BAI_ZHANG.QINGYISE:
                            desc = "清一色";
                            if(tData.canBigWin) baseWin = 8;
                            break;
                        //case majiang.YI_BAI_ZHANG.HUNPENG:
                        //    desc = "混碰";
                        //    if(tData.canBigWin) baseWin = 6;
                        //    break;
                        //case majiang.YI_BAI_ZHANG.QINGPENG:
                        //    desc = "清碰";
                        //    if(tData.canBigWin) baseWin = 12;
                        //    break;
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

                    if(maCount > 0) pi.mjdesc.push("买马" + maCount);

                    if(pi.winType == WinType.pickGang23 || pi.winType == WinType.pickGang1)
                    {
                        pi.mjdesc.push("杠上花");
                    }

                    if (maCount > 0) baseWin = baseWin + maFan;
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
            GLog("赢得玩家的分====" + pl.winone);
            GLog("最终     胡家类型：" + huType + desc);
        }
        else {
            tData.winner = -1;
            GLog("黄庄");
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom && !tData.coinRoomCreate) {
            if (!owner.$inc) {
                // owner.$inc = {money: -tb.createPara.money};
                // owner.$inc = {money: 0};
            }
            //后加的
            tb.AllPlayerRun(function(p) {
                if(!p.info.$inc) {
                    //GLog("===初始化 playNum=1");
                    p.info.$inc = {playNum:1};
                } else if(!p.info.$inc.playNum) {
                    p.info.$inc.playNum = 1;
                } else {
                    p.info.$inc.playNum += 1;
                    //GLog("===增加 playNum="+p.info.$inc.playNum);
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
        if(tData.roundNum == 0)
        {
            tb.AllPlayerRun(function (p) {
                GLog(p.uid + "赢得总次数:" + p.winTotalNum);
                GLog(p.uid +"中马总个数："+p.zhongMaTotalNum);
                GLog(p.uid +"暗杠的总次数:" + p.anGangTotalNum);
                GLog(p.uid +"明杠的总次数:" + p.mingGangTotalNum);
                GLog("---------------------");
            });
        }
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
        }
    }

    //Table.prototype.GamePause=function(){return  this.PlayerCount()!=4 || this.tData.delEnd!=0 || !this.AllPlayerCheck(function(pl){ return pl.onLine; });}
    Table.prototype.MJTick = function (pl, msg, session, next) {
        GLog("Table.prototype.MJTick");
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
        GLog("Table.prototype.MJPutForShenZhen");
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
                        GLog("p.eatFlag" + p.eatFlag);
                        if (p.eatFlag != 0) {
                            GLog("p.mjState" + p.mjState);
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            GLog("p.mjState" + p.mjState);
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
        GLog("Table.prototype.MJPutForGangDong");
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
                        GLog("p.eatFlag" + p.eatFlag);
                        if (p.eatFlag != 0) {
                            GLog("p.mjState" + p.mjState);
                            p.mjState = TableState.waitEat;
                        }
                        else {
                            GLog("p.mjState" + p.mjState);
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

    function MJPutForDongGuan(pl, msg, self) {
        GLog("东莞麻将 打牌中");
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                if (self.tData.zhongIsMa && msg.card == 71) {
                    GLog("遇到红中打出红中");
                    pl.mjzhong.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 6;//红中
                    self.NotifyAll('MJZhong', {uid: pl.uid, card: msg.card});
                    self.mjlog.push('MJZhong', {uid:pl.uid, card:msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    GLog(">>>> 遇到红中打出红中 红中算马 " + msg.card);
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
                            GLog("p.eatFlag" + p.eatFlag);

                            if (p.eatFlag == 2 && p.skipPeng.indexOf(msg.card) != -1) //过碰
                                p.eatFlag = 0;

                            if (p.eatFlag != 0) {
                                GLog("p.mjState" + p.mjState);
                                p.mjState = TableState.waitEat;
                            }
                            else {
                                GLog("p.mjState" + p.mjState);
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
        GLog("Table.prototype.MJPutForHuiZhou");
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                GLog("<<<<" + self.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人发牌" + msg.card);
                if (majiang.isFlower8(msg.card)) {
                    pl.mjflower.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 5;//花牌
                    self.NotifyAll('MJFlower', {uid: pl.uid, card: msg.card});
                    self.mjlog.push('MJFlower', {uid:pl.uid, card:msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    GLog(">>>> 遇到花牌打出花牌 " + msg.card);
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

    function MJPutForJiPingHu(pl, msg, self){
        GLog("Table.prototype.MJPutForJiPingHu");
        var tData = self.tData;
        if (tData.tState == TableState.waitPut && pl.uid == tData.uids[tData.curPlayer]) {
            var cdIdx = pl.mjhand.indexOf(msg.card);
            if (cdIdx >= 0) {
                GLog("<<<<" + self.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人发牌" + msg.card);
                if (majiang.isFlower8(msg.card)) {
                    pl.mjflower.push(msg.card);
                    pl.mjhand.splice(cdIdx, 1);
                    tData.putType = 5;//花牌
                    self.NotifyAll('MJFlower', {uid: pl.uid, card: msg.card});
                    self.AllPlayerRun(function (pl) {
                        pl.mjState = TableState.waitCard;
                    });
                    GLog(">>>> 遇到花牌打出花牌 " + msg.card);
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
        GLog("100章 打牌中");
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
                            GLog("p.eatFlag" + p.eatFlag);
                            if (p.eatFlag != 0) {
                                GLog("p.mjState" + p.mjState);
                                p.mjState = TableState.waitEat;
                            }
                            else {
                                GLog("p.mjState" + p.mjState);
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

    Table.prototype.MJPut = function (pl, msg, session, next) {
        GLog("Table.prototype.MJPut");
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
        }


    }

    function SendNewCardForGuangDong(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
            if ((tData.gameType == GamesType.SHEN_ZHEN || tData.gameType == GamesType.GANG_DONG)&& tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                    GLog("连庄次数："+tb.players[tData.uids[i]].linkHu+"    预留下马数horse："+horse);
                }
                GLog("======================================================================");
                //switch (tb.players[tData.uids[tData.zhuang]].linkZhuang) {
                //    case 1:
                //        //horse = horse + 2;
                //        break;
                //    case 2:
                //        horse = horse + 2;
                //        break;
                //    case 3:
                //        horse = horse + 4;
                //        break;
                //    case 4:
                //        horse = horse + 6;
                //        break;
                //    case 5:
                //        horse = horse + 8;
                //        break;
                //    case 6:
                //        horse = horse + 10;
                //        break;
                //    case 7:
                //        horse = horse + 12;
                //        break;
                //    case 8:
                //        horse = horse + 14;
                //        break;
                //}

              //  GLog("连庄次数："+tb.players[tData.uids[tData.zhuang]].linkZhuang+"    预留下马数horse："+horse);
            }
            GLog("预留下马数horse-------------------------------------------："+horse);
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
        return false;
    }

    function SendNewCardForHuiZhou(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
            if (tData.gameType == GamesType.SHEN_ZHEN && tData.jiejieGao) //此局多预留2匹马
            {
                GLog("======================================================================");
                switch (tb.players[tData.uids[tData.zhuang]].linkZhuang) {
                    case 1:
                        //horse = horse + 2;
                        break;
                    case 2:
                        horse = horse + 2;
                        break;
                    case 3:
                        horse = horse + 4;
                        break;
                    case 4:
                        horse = horse + 6;
                        break;
                    case 5:
                        horse = horse + 8;
                        break;
                    case 6:
                        horse = horse + 10;
                        break;
                    case 7:
                        horse = horse + 12;
                        break;
                    case 8:
                        horse = horse + 14;
                        break;
                }

                GLog("连庄次数："+tb.players[tData.uids[tData.zhuang]].linkZhuang+"    预留下马数horse："+horse);
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
        return false;
    }
    function SendNewCardForShenZhen(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
            if (tData.gameType == GamesType.SHEN_ZHEN && tData.jiejieGao) //此局多预留2匹马
            {
                //所有玩家中 连胡数不为0的数
                for(var i=0;i<tData.maxPlayer;i++)
                {
                    if(tb.players[tData.uids[i]].linkHu == 0) continue;
                    horse += (tb.players[tData.uids[i]].linkHu)*2;
                    GLog("连庄次数："+tb.players[tData.uids[i]].linkHu+"    预留下马数horse："+horse);
                }
                GLog("======================================================================");
                //switch (tb.players[tData.uids[tData.zhuang]].linkZhuang) {
                //    case 1:
                //        //horse = horse + 2;
                //        break;
                //    case 2:
                //        horse = horse + 2;
                //        break;
                //    case 3:
                //        horse = horse + 4;
                //        break;
                //    case 4:
                //        horse = horse + 6;
                //        break;
                //    case 5:
                //        horse = horse + 8;
                //        break;
                //    case 6:
                //        horse = horse + 10;
                //        break;
                //    case 7:
                //        horse = horse + 12;
                //        break;
                //    case 8:
                //        horse = horse + 14;
                //        break;
                //}

                //GLog("连庄次数："+tb.players[tData.uids[tData.zhuang]].linkZhuang+"    预留下马数horse："+horse);
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
        return false;
    }
    function SendNewCardForJiPingHu(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
            if (tData.gameType == GamesType.SHEN_ZHEN && tData.jiejieGao) //此局多预留2匹马
            {
                GLog("======================================================================");
                switch (tb.players[tData.uids[tData.zhuang]].linkZhuang) {
                    case 1:
                        //horse = horse + 2;
                        break;
                    case 2:
                        horse = horse + 2;
                        break;
                    case 3:
                        horse = horse + 4;
                        break;
                    case 4:
                        horse = horse + 6;
                        break;
                    case 5:
                        horse = horse + 8;
                        break;
                    case 6:
                        horse = horse + 10;
                        break;
                    case 7:
                        horse = horse + 12;
                        break;
                    case 8:
                        horse = horse + 14;
                        break;
                }

                GLog("连庄次数："+tb.players[tData.uids[tData.zhuang]].linkZhuang+"    预留下马数horse："+horse);
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
        return false;
    }
    function SendNewCardForDongGuan(tb)
    {
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong || tData.fanGui) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
            if (tData.gameType == GamesType.SHEN_ZHEN && tData.jiejieGao) //此局多预留2匹马
            {
                GLog("======================================================================");
                switch (tb.players[tData.uids[tData.zhuang]].linkZhuang) {
                    case 1:
                        //horse = horse + 2;
                        break;
                    case 2:
                        horse = horse + 2;
                        break;
                    case 3:
                        horse = horse + 4;
                        break;
                    case 4:
                        horse = horse + 6;
                        break;
                    case 5:
                        horse = horse + 8;
                        break;
                    case 6:
                        horse = horse + 10;
                        break;
                    case 7:
                        horse = horse + 12;
                        break;
                    case 8:
                        horse = horse + 14;
                        break;
                }

                GLog("连庄次数："+tb.players[tData.uids[tData.zhuang]].linkZhuang+"    预留下马数horse："+horse);
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
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
                GLog("<<<<" + tb.getPlayer(pl.uid).info.name + " 第" + tData.curPlayer + "个人摸牌成功" + newCard);

                return true;
            }
            else//没有牌了
            {
                EndGame(tb, null);
                GLog("摸牌失败 已无牌");
            }
        } else GLog("摸牌失败");
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
        }
    }
    Table.prototype.TryNewCard = function () {
        GLog("function TryNewCard");
        SendNewCard(this);
    }

    //老版本
    //function EndRoom(tb, msg) {
    //    GLog("function EndRoom");
    //    var playInfo = null;
    //    if (tb.tData.roundNum > -2) {
    //        if (tb.tData.roundNum != tb.createPara.round) {
    //            logid++;
    //            var playid = app.serverId + "_" + logid;
    //            var endTime = new Date();
    //            var nowStr = endTime.Format("yyyy-MM-dd hh:mm:ss");
    //            var tableName = endTime.Format("yyyy-MM-dd");
    //            var tData = tb.tData;
    //            playInfo = {
    //                owner: tData.owner,
    //                money: tb.createPara.money,
    //                now: nowStr,
    //                tableid: tb.tableid,
    //                logid: playid,
    //                players: []
    //            };
    //            tb.AllPlayerRun(function (p) {
    //                var pinfo = {};
    //                pinfo.uid = p.uid;
    //                pinfo.winall = p.winall;
    //                pinfo.nickname = p.info.nickname || p.info.name;
    //                pinfo.money = p.info.money;
    //                playInfo.players.push(pinfo);
    //            });
    //            tb.AllPlayerRun(function (p) {
    //                var table = "majiangLog";
    //                app.mdb.db.collection("majiangLog").update({_id: p.uid},
    //                    {$push: {logs: {$each: [playInfo], $slice: -50}}}, {upsert: true}, function (er, doc) {
    //                    });
    //
    //                /*
    //                 app.mdb.findOne(table,{_id:p.uid},function(er,doc){
    //
    //                 if(doc)
    //                 {
    //                 app.mdb.update(table,{_id:p.uid},{logs:{
    //                 $each:[playInfo],$slice: -50
    //                 }},"$push");
    //                 }
    //                 else
    //                 {
    //                 app.mdb.insert(table,{_id:p.uid,uid:p.uid,logs:[playInfo]},function(){});
    //                 }
    //                 });
    //                 */
    //
    //
    //            });
    //
    //            //统计场数
    //            var dayID = parseInt(endTime.Format("yyyyMMdd"));
    //            var inc = {};
    //            var guiString = "0";
    //            //游戏类型t1 总局数r4 马数h2 红中鬼g1 无鬼g0 翻鬼g2 风牌f1 f0 胡7对 d0 d1  能吃 c1 c0 能吃胡 p0 p1 节节高 j0 j1
    //            switch (tData.gameType){
    //                case GamesType.GANG_DONG:
    //                {
    //                    if(tData.withZhong) guiString = "1";
    //                    if(tData.fanGui) guiString = "2";
    //                    inc["t1_r"+tData.roundAll + "_h" + tData.horse + "_g" + guiString + "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) + "_s"+tData.maxPlayer] = 1;
    //                }
    //                    break;
    //                case GamesType.HUI_ZHOU:
    //                    inc["t2_r"+tData.roundAll + "_h" + tData.horse + "_g" + guiString + "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) + "_j" + (tData.jiejieGao ? 1:0)+ "_s"+tData.maxPlayer] = 1;
    //                    break;
    //                case GamesType.SHEN_ZHEN:
    //                {
    //                    if(tData.withZhong) guiString = "1";
    //                    if(tData.fanGui) guiString = "2";
    //                    inc["t3_r"+tData.roundAll + "_h" + tData.horse + "_g" + guiString + "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0)+ "_s"+tData.maxPlayer] = 1;
    //                }
    //                    break;
    //                case GamesType.JI_PING_HU:
    //                {
    //                    inc["t4_r"+tData.roundAll  + "_g" + guiString + "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p1" + "_s"+tData.maxPlayer] = 1; //_p1 默认为点炮的意思
    //                }
    //                    break;
    //            }
    //            //inc[tData.roundAll + "_" + (tData.noBigWin ? "z" : "s") + "_c" + (tData.canEat ? 1 : 0) + "_f" + (tData.withWind ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0)] = 1;
    //            app.mdb.db.collection("dayLog").update({_id: dayID}, {$inc: inc}, {upsert: true}, function (er, doc) {
    //
    //            });
    //            //合并回放
    //            if (!app.mjlogs) app.mjlogs = {array: [], tableName: tableName};
    //            if (app.mjlogs.tableName != tableName || app.mjlogs.array.length >= 10) {
    //                app.mdb.db.collection(app.mjlogs.tableName).insertMany(app.mjlogs.array, function (er, doc) {
    //                });
    //                app.mjlogs.array = [];
    //                app.mjlogs.tableName = tableName;
    //            }
    //            app.mjlogs.array.push({logid: playid, endTime: endTime, mjlog: tb.mjlog});
    //        }
    //
    //        if (msg) {
    //            if (playInfo) msg.playInfo = playInfo;
    //            msg.showEnd = tb.tData.roundNum != tb.createPara.round;
    //            tb.NotifyAll("endRoom", msg);
    //        }
    //
    //        tb.SetTimer();
    //        tb.tData.roundNum = -2;
    //
    //        DestroyTable(tb);
    //        var uid2did = tb.uid2did;
    //        var uids = {};
    //        for (var uid in uid2did) {
    //            var did = uid2did[uid];
    //            var ids = uids[did];
    //            if (!ids)uids[did] = ids = [];
    //            ids.push(uid);
    //        }
    //        for (var did in uids) {
    //            var ids = uids[did];
    //            app.rpc.pkplayer.Rpc.endVipTable(did, {uids: ids, tableid: tb.tableid}, function () {
    //            });
    //        }
    //    }
    //    return playInfo;
    //}

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
                    ip:getPublicIp(),
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
                    //app.mdb.db.collection("majiangLog").update({_id: p.uid},
                    //    {$push: {logs: {$each: [playInfo], $slice: -50}}}, {upsert: true}, function (er, doc) {
                    //    });
                    //新添加的
                    app.mdb.db.collection("majiangLog").update({_id:p.uid},
                        {$push:{logs:{$each:[playInfo],$slice: -50}},$set:{lastGameDay:dayID}},{upsert:true}, function(er,doc)
                        {
                        });
                });


                if(!app.playday) app.playday={dayID:dayID,flushAt:Date.now(),inc:{}};
                var playday=app.playday;
                //var inc = {};
                var guiString = "0";
                if(tData.withZhong) guiString = "1";
                if(tData.fanGui) guiString = "2";
                var incKey= "";
                //游戏类型t1 总局数r4 马数h2 红中鬼g1 无鬼g0 翻鬼g2 风牌f1 f0 胡7对 d0 d1  能吃 c1 c0 能吃胡 p0 p1 节节高 j0 j1
                switch (tData.gameType){
                    case GamesType.GANG_DONG:
                    {
                        incKey ="t1_r"+tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */+ "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.HUI_ZHOU:
                        incKey ="t2_r"+tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */+ "_j" + (tData.jiejieGao ? 1:0)+ "_s"+tData.maxPlayer;
                        break;
                    case GamesType.SHEN_ZHEN:
                    {
                        incKey ="t3_r"+tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0) */+ "_s"+tData.maxPlayer;
                    }
                        break;
                    case GamesType.JI_PING_HU:
                    {
                        incKey ="t4_r"+tData.roundAll  + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p1" */+ "_s"+tData.maxPlayer; //_p1 默认为点炮的意思
                    }
                        break;
                    case GamesType.DONG_GUAN:
                    {
                        incKey ="t5_r"+tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p0"*/ + "_s"+tData.maxPlayer + "_m" + (tData.zhongIsMa ? 1 :0); //_p1 默认为点炮的意思
                    }
                        break;
                    case GamesType.YI_BAI_ZHANG:
                    {
                        incKey ="t6_r"+tData.roundAll /*+ "_h" + tData.horse*/ + "_g" + guiString /*+ "_f"+(tData.withWind ? 1 : 0) + "_d" + (tData.canHu7 ? 1 : 0)  + "_c" + (tData.canEat ? 1 : 0) + "_p0" */+ "_s"+tData.maxPlayer  + "_b" + (tData.canBigWin ? 1 : 0); //_p1 默认为点炮的意思
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

                // app.mdb.db.collection("dayLog").update({_id: dayID}, {$inc: inc}, {upsert: true}, function (er, doc) {
                //
                //});
                ////合并回放
                //if (!app.mjlogs) app.mjlogs = {array: [], tableName: tableName};
                //if (app.mjlogs.tableName != tableName || app.mjlogs.array.length >= 10) {
                //    app.mdb.db.collection(app.mjlogs.tableName).insertMany(app.mjlogs.array, function (er, doc) {
                //    });
                //    app.mjlogs.array = [];
                //    app.mjlogs.tableName = tableName;
                //}
                //app.mjlogs.array.push({logid: playid, endTime: endTime, mjlog: tb.mjlog});
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
        GLog("Table.prototype.MJPassForGuangDong");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                GLog("============想胡的人进来了");
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    GLog("此人" + pl.info.name + "过胡");
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
                //pl.notify("MJPass",{mjState:pl.mjState,skipPeng:pl.skipPeng,skipHu:pl.skipHu});
                //this.NotifyAll("MJPass",{skipPeng:pl.skipPeng,skipHu:pl.skipHu});
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
        GLog("Table.prototype.MJPassForHuiZhou");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                GLog("============想胡的人进来了");
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    GLog("此人" + pl.info.name + "过胡");
                    pl.skipHu = true;
                }

                pl.eatFlag = 0;
                if (!SendNewCard(self)) //过后尝试发牌
                    pl.notify("MJPass", {mjState: pl.mjState, skipPeng: pl.skipPeng, skipHu: pl.skipHu});
                //pl.notify("MJPass",{mjState:pl.mjState,skipPeng:pl.skipPeng,skipHu:pl.skipHu});
                //this.NotifyAll("MJPass",{skipPeng:pl.skipPeng,skipHu:pl.skipHu});
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
        GLog("Table.prototype.MJPassForShenZhen");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                GLog("============想胡的人进来了");
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
                }
                if (tData.gameType == 2 && pl.eatFlag >= 8 && !pl.skipHu) {
                    GLog("此人" + pl.info.name + "过胡");
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
        GLog("Table.prototype.MJPassForJiPingHu");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                GLog("============想胡的人进来了");
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 2 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0) //惠州过碰
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
                }
                if (tData.gameType == 4 && pl.eatFlag >= 8 && !pl.skipHu) {
                    GLog("此人" + pl.info.name + "过胡");
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
        GLog("Table.prototype.MJPassForGuangDong");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
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
        GLog("Table.prototype.MJPassForYiBaiZhang");
        var tData = self.tData;
        if (tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat) {
            GLog("此人" + pl.info.name + "想      过胡");
            if (pl.eatFlag == msg.eatFlag /*&& this.CheckPlayerCount(function(p){
             GLog(p.uid+" 他的 eatFlag："+p.eatFlag);
             return p!=pl&&p.eatFlag>msg.eatFlag })==0*/
            ) {
                self.mjlog.push("MJPass", {uid: pl.uid, eatFlag: msg.eatFlag});//发牌
                pl.mjState = TableState.waitCard;
                if (tData.gameType == 5 && (pl.eatFlag == 2 || pl.eatFlag >= 10) && pl.skipPeng.length == 0)
                {
                    pl.skipPeng.push(tData.lastPut);
                    GLog("此人" + pl.info.name + "过碰牌" + tData.lastPut + " skipPeng.length= " + pl.skipPeng.length);
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
        GLog("Table.prototype.MJPass");
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
        }

    }

    function MJChiForJiPingHu(pl, msg,self){
        GLog("Table.prototype. MJChiForJiPingHu");
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
        GLog("Table.prototype.MJChi");
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
        GLog("MJPengForShenZhen");
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
        GLog("MJPengForHuiZhou");
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
                    GLog(pl.info.name + " 碰的次数：" + pl.baojiu.num);
                    if (pl.baojiu.num == 4) pl.baojiu.putCardPlayer.push(lastPlayer);
                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
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
        GLog("MJPengForJiPingHu");
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
                    // GLog(pl.info.name + " 碰的次数：" + pl.baojiu.num);
                    if (pl.baojiu.num == 4) pl.baojiu.putCardPlayer.push(lastPlayer);


                    if(pl.mjhand.length == 2){
                        pl.baoZiMo.putCardPlayer.push(lastPlayer);
                        pl.baoZiMo.isOk = true;
                        GLog(pl.uid +"碰后达成包自摸条件、使其成包自摸的那个人是"+ tData.uids[lastPlayer] );
                    }

                    //pl.notify('MJPeng',{tData:tData,from:lastPlayer,baojiu:pl.baojiu});
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

    Table.prototype.MJPeng = function (pl, msg, session, next) {
        GLog("Table.prototype.MJPeng");
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
        }

    }

    function MJGangForShenZhen(pl, msg, self) {
        GLog("Table.prototype.MJGangForShenZhen");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong || tData.fanGui) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }
            //switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
            //    case 1:
            //        //horse = horse + 2;
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}
        }

        GLog("horse------" + horse);
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
                        if (p.eatFlag >= 8) GLog("在准备碰的过程中 发现有玩家想胡！！");
                        return p.eatFlag < 4;
                    }
                })
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
                GLog("自摸名杠");
                GLog("");
            }
            else return;
            msg.uid = pl.uid;
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            GLog("canEatGang " + canEatGang);
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    GLog("hType" + hType);
                    if (hType > 0)//开杠胡
                    {
                        GLog("tData.canEatHu" + tData.canEatHu + "  msg.gang = " + msg.gang + "   hType = " + hType);
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
                    GLog("13幺的胡");
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            //if(canEatGang)
            //{
            //	tData.putType=msg.gang;
            //	tData.curPlayer=tData.uids.indexOf(pl.uid);
            //	tData.lastPut=msg.card;
            //}
            //else
            //{
            //	tData.putType=0;
            //	tData.curPlayer=(tData.uids.indexOf(pl.uid)+3)%4;
            //}
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                GLog("杠胡");
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠");
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
        GLog("Table.prototype.MJGangForGangDong");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong || tData.fanGui) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马(之前是根据连庄 现在是根据连胡)
        {
            //所有玩家中 连胡数不为0的数
            for(var i=0;i<tData.maxPlayer;i++)
            {
                if(self.players[tData.uids[i]].linkHu == 0) continue;
                horse += (self.players[tData.uids[i]].linkHu)*2;
            }

            //switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
            //    case 1:
            //        //horse = horse + 2;
            //        break;
            //    case 2:
            //        horse = horse + 2;
            //        break;
            //    case 3:
            //        horse = horse + 4;
            //        break;
            //    case 4:
            //        horse = horse + 6;
            //        break;
            //    case 5:
            //        horse = horse + 8;
            //        break;
            //    case 6:
            //        horse = horse + 10;
            //        break;
            //    case 7:
            //        horse = horse + 12;
            //        break;
            //    case 8:
            //        horse = horse + 14;
            //        break;
            //}
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
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = (msg.gang == 2);//只抢自摸明杠
            GLog("canEatGang " + canEatGang);
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    GLog("hType" + hType);
                    if (hType > 0)//开杠胡
                    {
                        GLog("tData.canEatHu" + tData.canEatHu + "  msg.gang = " + msg.gang + "   hType = " + hType);
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
            //if (canEatGang) {
            //    tData.putType = msg.gang;
            //    tData.curPlayer = tData.uids.indexOf(pl.uid);
            //    tData.lastPut = msg.card;
            //}
            //else {
            //    tData.putType = 0;
            //    tData.curPlayer = (tData.uids.indexOf(pl.uid) + 3) % 4;
            //}
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                GLog("杠胡");
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠");
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
        GLog("Table.prototype.MJGangForDongGuan");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong || tData.fanGui) horse = horse + 2;
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
            GLog("canEatGang " + canEatGang);
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                var huType = GetHuType(tData, p, msg.card);
                if (canEatGang && p != pl && !p.skipHu && huType > 0 && huType != 13 ) {
                    GLog("msg.gang = " + msg.gang + "   huType = " + huType);
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                GLog("杠胡");
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠");
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
        GLog("Table.prototype.MJGangForHuiZhou");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong) horse = horse + 2;

        GLog("horse------" + horse);
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
                GLog("自摸名杠");
                GLog("");
            }
            else return;
            msg.uid = pl.uid;

            var canEatGang = msg.gang == 2;//只抢自摸明杠
            var hType = 0;

            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                var isJiHu = 0;
                if ((canEatGang || msg.gang == 3) && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    isJiHu = majiang.prejudgeHuType(p, msg.card);
                    GLog("hType" + hType);
                    if (hType > 0 )//开杠胡
                    {
                        GLog("tData.canEatHu" + tData.canEatHu + "  msg.gang = " + msg.gang + "   hType = " + hType);

                        if (hType == 13 || msg.gang != 3) {
                            p.mjState = TableState.waitEat;
                            p.eatFlag = 8;
                        }
                        //if ((hType == 13 || msg.gang != 3) && isJiHu > 0) {
                        //    p.mjState = TableState.waitEat;
                        //    p.eatFlag = 8;
                        //}
                        //if ((hType == 13 || msg.gang != 3) && isJiHu > 0) {
                        //    p.mjState = TableState.waitEat;
                        //    p.eatFlag = 8;
                        //}

                    }
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
        GLog("Table.prototype.MJGangForJiPingHu");
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
            GLog("canEatGang " + canEatGang);
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

                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                //if(hType>0)GLog("有人可以胡！！！！！");
                if (canEatGang && p != pl && !p.skipHu) {
                    var hType = GetHuType(tData, p, msg.card);//开杠测试
                    GLog("hType" + hType);
                    if (hType > 0 && isCanHu)//开杠胡
                    {
                        GLog("tData.canEatHu" + tData.canEatHu + "  msg.gang = " + msg.gang + "   hType = " + hType);
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

                    GLog("13幺的胡");
                }


            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            //if(canEatGang || hType == 13 )
            //{
            //	GLog("自摸明杠或者13幺了")
            //	tData.putType=msg.gang;
            //	tData.curPlayer=tData.uids.indexOf(pl.uid);
            //	tData.lastPut=msg.card;
            //}
            //else
            //{
            //	GLog("没有自摸明杠")
            //	tData.putType=0;
            //	tData.curPlayer=(tData.uids.indexOf(pl.uid)+3)%4;
            //}


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
        GLog("Table.prototype.MJGangForYiBaiZhang");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong || tData.fanGui) horse = horse + 2;
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
            GLog("canEatGang " + canEatGang);
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                var huType = GetHuType(tData, p, msg.card);
                if (canEatGang && p != pl && !p.skipHu && huType > 0  ) {
                    GLog("msg.gang = " + msg.gang + "   huType = " + huType);
                    p.mjState = TableState.waitEat;
                    p.eatFlag = 8;
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠

            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3 || msg.gang == 4) {
                GLog("杠胡");
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠");
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

    Table.prototype.MJGang = function (pl, msg, session, next) {
        GLog("Table.prototype.MJGang");
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
        GLog("Table.prototype.MJHuForShenZhen");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;

        GLog("是否过胡：" + pl.skipHu);
        GLog("tData.tState===" + tData.tState);
        GLog("pl.mjState:==" + pl.mjState);
        GLog("tData.uids[tData.curPlayer]==" + tData.uids[tData.curPlayer]);
        GLog("pl.uid=" + pl.uid);
        GLog("pl.eatFlag==" + pl.eatFlag);

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
        //GLog("是否过胡："+ pl.skipHu + "tData.tState==="+tData.tState + "  pl.mjState:=="+pl.mjState + "  tData.uids[tData.curPlayer]=="+tData.uids[tData.curPlayer] + "  pl.uid="+pl.uid +" pl.eatFlag=="+pl.eatFlag )
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /* &&!HighPlayerHuForShenZhen(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            GLog("点炮胡 抢杠胡 ");
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
        GLog("Table.prototype.MJHuForGuangDong");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;

        GLog("是否过胡：" + pl.skipHu + "tData.tState===" + tData.tState + "  pl.mjState:==" + pl.mjState + "  tData.uids[tData.curPlayer]==" + tData.uids[tData.curPlayer] + "  pl.uid=" + pl.uid + " pl.eatFlag==" + pl.eatFlag)

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
        //GLog("是否过胡："+ pl.skipHu + "tData.tState==="+tData.tState + "  pl.mjState:=="+pl.mjState + "  tData.uids[tData.curPlayer]=="+tData.uids[tData.curPlayer] + "  pl.uid="+pl.uid +" pl.eatFlag=="+pl.eatFlag )
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            GLog("点炮胡 抢杠胡 ");
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

    function MJHuForHuiZhou(pl, msg, self) {
        GLog("Table.prototype.MJHuForHuiZhou");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        GLog("");
        GLog("房间状态：" + tData.tState);
        GLog("此人状态：" + pl.mjState);
        GLog("房间指定发牌人的uid为：" + tData.uids[tData.curPlayer] + " 实际胡人uid：" + pl.uid);
        GLog("此人吃牌状态pl.eatFlag：" + pl.eatFlag);
        GLog("房间出牌状态tData.eatFlag：" + tData.putType);

        GLog("截胡返回值====" + !HighPlayerHu(self, pl));


        //自摸胡
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
            && !HighPlayerHu(self, pl)// 邵阳麻将可以多家胡 //&&(tData.putType>0||tData.canEatHu)
        ) {
            GLog("点炮胡 抢杠胡 ");
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
                    GLog("p.uid====" + p.uid + "=====    pl.uid" + pl.uid);
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
        GLog("Table.prototype.MJHuForJiPingHu");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;
        GLog("");
        GLog("房间状态：" + tData.tState);
        GLog("此人状态：" + pl.mjState);
        GLog("房间指定发牌人的uid为：" + tData.uids[tData.curPlayer] + " 实际胡人uid：" + pl.uid);
        GLog("此人吃牌状态pl.eatFlag：" + pl.eatFlag);
        GLog("房间出牌状态tData.eatFlag：" + tData.putType);

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
            GLog("点炮胡 抢杠胡 ");
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
                    GLog("p.uid====" + p.uid + "=====    pl.uid" + pl.uid);
                    if (p.mjState == TableState.waitEat && p.eatFlag >= 8 ) {
                        p.mjhand.push(tData.lastPut);
                        p.winType = winType;
                        // huMembers.push(p);
                    }
                });
                //if(huMembers.length >= 2) {
                //    GLog("胡的人数量:"+huMembers.length);
                //    for(var i=0;i<huMembers.length;i++){
                //        GLog("胡的人id:"+huMembers[i].uid);
                //    }
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

    function MJHuForDongGuan(pl, msg, self) {
        GLog("Table.prototype.MJHuForDongGuan");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;

        GLog("是否过胡：" + pl.skipHu + "tData.tState===" + tData.tState + "  pl.mjState:==" + pl.mjState + "  tData.uids[tData.curPlayer]==" + tData.uids[tData.curPlayer] + "  pl.uid=" + pl.uid + " pl.eatFlag==" + pl.eatFlag)

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
        //GLog("是否过胡："+ pl.skipHu + "tData.tState==="+tData.tState + "  pl.mjState:=="+pl.mjState + "  tData.uids[tData.curPlayer]=="+tData.uids[tData.curPlayer] + "  pl.uid="+pl.uid +" pl.eatFlag=="+pl.eatFlag )
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            GLog("点炮胡 抢杠胡 ");
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
        GLog("Table.prototype.MJHuForYiBaiZhang");
        var tData = self.tData;
        var uids = self.tData.uids;
        var canEnd = false;

        GLog("是否过胡：" + pl.skipHu + "tData.tState===" + tData.tState + "  pl.mjState:==" + pl.mjState + "  tData.uids[tData.curPlayer]==" + tData.uids[tData.curPlayer] + "  pl.uid=" + pl.uid + " pl.eatFlag==" + pl.eatFlag)

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
        //GLog("是否过胡："+ pl.skipHu + "tData.tState==="+tData.tState + "  pl.mjState:=="+pl.mjState + "  tData.uids[tData.curPlayer]=="+tData.uids[tData.curPlayer] + "  pl.uid="+pl.uid +" pl.eatFlag=="+pl.eatFlag )
        else if (
            !pl.skipHu
            && tData.tState == TableState.waitEat && pl.mjState == TableState.waitEat && tData.uids[tData.curPlayer] != pl.uid && pl.eatFlag >= 8
            && (tData.putType > 0 || tData.canEatHu)
        /*&& !HighPlayerHuForGuangDong(self,pl)*/// 邵阳麻将可以多家胡
        ) {
            GLog("点炮胡 抢杠胡 ");
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
        GLog("Table.prototype.MJHu");
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