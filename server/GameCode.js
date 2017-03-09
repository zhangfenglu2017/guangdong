module.exports = function (app, server, gameid, Player, Table, TableGroup, TableManager, Game) {
    var gameLog = [];

    function GLog(log) {
        app.FileWork(gameLog, __dirname + "/log.txt", log)
    }

    console.error(app.serverId + " reload game code " + gameid);
    var logid = Date.now();
    delete require.cache[require.resolve("./majiang.js")];
    var majiang = require("./majiang.js");
    var GamesType = {
        GANG_DONG: 1,//广东麻将
        HUI_ZHOU: 2,//惠州麻将
        SHEN_ZHEN: 3//深圳麻将
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
        var huType = majiang.canHu(!td.canHu7, pl.mjhand, cd, td.canHuWith258, td.withZhong);
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
        if (tData.withZhong) horse + 2;
        if (tData.jiejieGao) //此局多预留2匹马
        {
                switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
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

        }
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        if ((leftCard >= 2) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % 4] == pl.uid && //下家限制
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
        if (!pl.skipHu && GetHuType(tData, pl, cd) > 0 && (tData.canEatHu || tData.putType == 4 || isJiHu > 0)) {
            eatFlag += 8;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可胡");
        }
        if (tData.withZhong) horse + 2;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd)) {
            eatFlag += 4;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可明杠");
        }
        if ((leftCard >= horse) && majiang.canPeng(pl.mjhand, cd)) {
            eatFlag += 2;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可碰");
        }
        if ((leftCard > horse) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % 4] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) {
            eatFlag += 1;
            GLog("eatFlag=" + eatFlag + " " + pl.info.name + " 第" + tData.uids.indexOf(pl.uid) + "个人可吃");
        }
        GLog("总的 eatFlag=====" + eatFlag);
        return eatFlag;
    }

    function GetGuangDongEatFlag(pl, tData) {
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
        if (tData.withZhong) horse + 2;
        //if(leftCard>0&&majiang.canGang0(pl.mjhand,cd))        eatFlag+=4;
        if (leftCard > horse && majiang.canGang0(pl.mjhand, cd))        eatFlag += 4;
        //if((leftCard>4||tData.noBigWin)&&majiang.canPeng(pl.mjhand,cd))         eatFlag+=2;
        if ((leftCard >= 2 || tData.noBigWin) && majiang.canPeng(pl.mjhand, cd))         eatFlag += 2;
        //if((leftCard>4||tData.noBigWin)&&tData.canEat&&
        //    tData.uids[(tData.curPlayer+1)%4]==pl.uid && //下家限制
        //    majiang.canChi(pl.mjhand,cd).length>0
        // ) eatFlag+=1;
        if ((leftCard > 2 || tData.noBigWin) && tData.canEat &&
            tData.uids[(tData.curPlayer + 1) % 4] == pl.uid && //下家限制
            majiang.canChi(pl.mjhand, cd).length > 0
        ) eatFlag += 1;
        GLog("GetGuangDongEatFlag eatFlag=-------------" + eatFlag);
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
            tState: TableState.waitJoin,
            initCoin: 1000,   //积分显示
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
            jiejieGao: false
        };
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
                if (uids.length == 4 && uids.indexOf(0) < 0) return false;
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
            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
            GLog("节节高:" + tData.jiejieGao);
        }
        if (tData.owner == -1) {
            tData.owner = pl.uid;
            pl.linkZhuang = 1;
        }
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < 4) uids.push(pl.uid);
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
            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < 4) uids.push(pl.uid);
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
            GLog("游戏类型:" + tData.gameType);
            GLog("风牌:" + tData.withWind);
            GLog("能吃:" + tData.canEat);
            GLog("能胡7对:" + tData.canHu7);
            GLog("红中癞子:" + tData.withZhong);
            GLog("能吃胡:" + tData.canEatHu);
            GLog("总局数:" + tData.roundAll);
            GLog("马数:" + tData.horse);
        }
        if (tData.owner == -1)    tData.owner = pl.uid;
        var uids = tData.uids;
        if (uids.indexOf(pl.uid) < 0) {
            if (uids.length < 4) uids.push(pl.uid);
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
        }
    }
    //客户端收到initSceneData  session中的pkroom还没有设定好
    Table.prototype.initSceneData = function (pl) {
        GLog("Table.prototype.initSceneData");
        //公共
        var msg = {
            players: this.collectPlayer(
                'info', 'mjState', 'mjpeng', 'mjgang0', 'mjgang1', 'mjchi', 'mjput', 'onLine', 'delRoom',
                'isNew', 'winall', 'mjMa', 'left4Ma', 'mjflower', 'skipPeng', 'baojiu', 'skipHu', 'linkZhuang')
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

    function startGameForShenZhen(self) {
        GLog("Table.prototype.startGameForShenZhen");
        if (self.tData.roundNum > 0 && self.PlayerCount() == 4
            && self.AllPlayerCheck(function (pl) {
                return pl.mjState == TableState.isReady
            })) {
            var tData = self.tData;
            if (app.testCards && app.testCards[tData.owner]) {
                self.cards = app.testCards[tData.owner];
            }
            else {
                self.cards = majiang.randomCards(self.tData.withWind, self.tData.withZhong);//这里需要改成深圳的
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
            for (var i = 0; i < 4; i++) {
                var pl = self.players[tData.uids[(i + tData.zhuang) % 4]];
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
                var maCards = majiang.initMa(i);
                for (var j = 0; j < maCards.length; j++) {
                    pl.mjMa.push(maCards[j]);
                }

                for (var j = 0; j < 13; j++) {
                    pl.mjhand.push(cards[tData.cardNext++]);
                }
                if (pl.onLine)pl.notify("mjhand", {mjhand: pl.mjhand, tData: tData});
            }

            self.NotifyAll('getLinkZhuang', {players: self.collectPlayer('linkZhuang'), tData: app.CopyPtys(tData)});
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
            tData.curPlayer = (tData.curPlayer + 3) % 4;
            mjlog.push("mjhand", self.cards, app.CopyPtys(tData));//开始
            SendNewCard(self);//开始后第一张发牌
        }
    }

    Table.prototype.startGame = function () {
        GLog("Table.prototype.startGame");
        var tData = this.tData;
        switch (tData.gameType) {
            case GamesType.GANG_DONG:
            case GamesType.HUI_ZHOU:
            {
                if (this.tData.roundNum > 0 && this.PlayerCount() == 4
                    && this.AllPlayerCheck(function (pl) {
                        return pl.mjState == TableState.isReady
                    })) {
                    var tData = this.tData;
                    if (app.testCards && app.testCards[tData.owner]) {
                        this.cards = app.testCards[tData.owner];
                    }
                    else {
                        switch (tData.gameType) {
                            case 1:
                                this.cards = majiang.randomCards(this.tData.withWind, this.tData.withZhong);
                                break;
                            case 2:
                                this.cards = majiang.randomHuiZhouCards(this.tData.withWind, this.tData.withZhong);
                                break;
                            default :
                                this.cards = majiang.randomCards(this.tData.withWind, this.tData.withZhong);
                                break;
                        }
                    }
                    GLog("Table.prototype.startGame  withWind:" + this.tData.withWind + "    withZhong:" + this.tData.withZhong);
                    var info = "";
                    for (var i = 0; i < this.cards.length; i++) {

                        info = info + this.cards[i] + ",";
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
                    var cards = this.cards;
                    for (var i = 0; i < 4; i++) {
                        var pl = this.players[tData.uids[(i + tData.zhuang) % 4]];
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

                    var mjlog = this.mjlog;
                    if (mjlog.length == 0) {
                        mjlog.push("players", this.PlayerPtys(function (p) {
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
                    tData.curPlayer = (tData.curPlayer + 3) % 4;
                    mjlog.push("mjhand", this.cards, app.CopyPtys(tData));//开始
                    SendNewCard(this);//开始后第一张发牌
                }
            }
                break;
            case GamesType.SHEN_ZHEN:
                startGameForShenZhen(this);
                break;
        }

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
            GLog("EndGameForShenZhen===========linkZhuang=" + pl.linkZhuang);
            switch (pl.linkZhuang) {
                case 1:
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
        }
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        GLog("EndGameForShenZhen  horse===" + horse);
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma.length = 0;
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            //pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * 3;

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


                    var isGangShangHua = false;
                    var isQiangGangHu = false;

                    var maFan = 0;//算分
                    var maCount = 0;

                    switch (majiang.getMaPrice(pi)) {
                        case 0:
                            maCount = 0;
                            maFan = 0;
                            break;
                        case 1:
                            maFan = 2;
                            maCount = 1;
                            break;
                        case 2:
                            maFan = 4;
                            maCount = 2;
                            break;
                        case 3:
                            maFan = 6;
                            maCount = 3;
                            break;
                        case 4:
                            maFan = 8;
                            maCount = 4;
                            break;
                        case 5:
                            maFan = 10;
                            maCount = 5;
                            break;
                        case 6:
                            maFan = 12;
                            maCount = 6;
                            break;
                        case 7:
                            maFan = 14;
                            maCount = 7;
                            break;
                        case 8:
                            maFan = 16;
                            maCount = 8;
                            break;
                    }

                    if (maCount > 0) baseWin = baseWin + maFan;
                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;

                        //抢杠胡 杠炮的那个玩家包3家 马钱也包
                        if (pi.winType == WinType.eatGang) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            //roundWin*=tData.noBigWin?1:3;
                            //pj.mjdesc.push("杠炮");
                            isQiangGangHu = true;
                            baseWin = baseWin * 3;
                            pi.baseWin = pi.baseWin * 3;
                        }
                        else {
                            baseWin = baseWin;
                        }

                        if (pi.winType == WinType.pickGang23) {//
                            //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                            isGangShangHua = true;
                            GLog("胡家类型：" + pi.winType);
                        }

                        pi.winone += baseWin;
                        pj.winone -= baseWin;
                    }
                    if (isGangShangHua) {
                        GLog("胡家类型：" + pi.winType);
                        pi.mjdesc.push("杠上花");
                    }
                    if (isQiangGangHu) {
                        GLog("胡家类型：" + pi.winType);
                        pi.mjdesc.push("抢杠胡");
                    }

                    if (maCount > 0) pi.mjdesc.push("买马" + maCount);

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
        if (!byEndRoom) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma', 'linkZhuang'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
        if (!pl) {
            for (var i = 0; i < pls.length; i++) {
                var pi = pls[i];
                pi.linkZhuang = 0;//黄庄也可以连庄
            }
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
            pls[z].left4Ma.length = 0;
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
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * 3;

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
                        if (pi.mjflower.length > 0) pi.mjdesc.push("花 X" + pi.mjflower.length);
                        baseWin += pi.mjflower.length;
                    }


                    pi.baseWin = 1
                    var isGangShangHua = false;
                    var isQiangGangHu = false;
                    var isBaoJiu = false;

                    var maFan = 0;//算分
                    var maCount = 0;

                    switch (majiang.getMaPrice(pi)) {
                        case 0:
                            maCount = 0;
                            maFan = 0;
                            break;
                        case 1:
                            maFan = 2;
                            maCount = 1;
                            break;
                        case 2:
                            maFan = 4;
                            maCount = 2;
                            break;
                        case 3:
                            maFan = 6;
                            maCount = 3;
                            break;
                        case 4:
                            maFan = 8;
                            maCount = 4;
                            break;
                        case 5:
                            maFan = 10;
                            maCount = 5;
                            break;
                        case 6:
                            maFan = 12;
                            maCount = 6;
                            break;
                        case 7:
                            maFan = 14;
                            maCount = 7;
                            break;
                        case 8:
                            maFan = 16;
                            maCount = 8;
                            break;
                    }

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
                            isQiangGangHu = true;
                            baseWin = baseWin * 3;
                            pi.baseWin = 3;

                        }
                        else {
                            baseWin = baseWin;
                            pi.baseWin = 1;
                        }

                        if (pi.winType == WinType.pickGang1 || pi.winType == WinType.pickGang23) {//
                            //if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;
                            isGangShangHua = true;
                            GLog("胡家类型：" + pi.winType);
                            pi.baseWin = 1;
                        }

                        //报九张(一定放在最后)
                        if (pi.winType == WinType.pickNormal && pi.baojiu.num == 4) {
                            isBaoJiu = true;
                            pi.baseWin = 3;
                        }
                        //非点炮时 输的玩家 算马与花 该怎么算就怎么算
                        if (pi.winType != WinType.eatPut && pi.winType != WinType.eatGangPut) pi.winone += baseWin;
                        //目前 点炮时 赢的玩家 没加上 除了点炮者 输的玩家马与花的分 且点炮者没包三家
                        //点炮时 赢的玩家 只算除点炮者输的玩家的花与马 暂时未用
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType > 0) pi.winone += (maFan + pi.mjflower.length);
                        //if(pi.winType == WinType.eatPut && pi.winType ==  WinType.eatGangPut && huType == 0) pi.winone += maFan;
                        if (pi.winType == WinType.pickNormal && tb.getPlayer(tData.uids[pi.baojiu.putCardPlayer]) == pj) {
                            pj.winone -= baseWin * 3;
                        }
                        else if (isBaoJiu) {
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
                    if (isGangShangHua) {
                        GLog("胡家类型：" + pi.winType);
                        pi.mjdesc.push("杠上花");
                    }
                    if (isQiangGangHu) {
                        GLog("胡家类型：" + pi.winType);
                        pi.mjdesc.push("抢杠胡");
                    }

                    if (maCount > 0) pi.mjdesc.push("买马" + maCount);

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
        if (!byEndRoom) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma'),
            tData: app.CopyPtys(tData)
        };
        tb.mjlog.push("roundEnd", roundEnd);//一局结束
        var playInfo = null;
        if (tData.roundNum == 0) playInfo = EndRoom(tb);//结束
        if (playInfo) roundEnd.playInfo = playInfo;
        tb.NotifyAll("roundEnd", roundEnd);
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
        //鬼牌模式  判断胡牌是否含红中 无红中 增加2匹马
        if (tData.withZhong) {
            if (pl) {
                if (!majiang.isHuWithHongZhong(pl)) horse = horse + 2;
            }
        }
        GLog("endGame  horse===" + horse);
        //不管胡不胡都给每位玩家 传送left4Ma
        for (var z = 0; z < pls.length; z++) {
            pls[z].left4Ma.length = 0;
            for (var i = 0; i < horse; i++) {
                pls[z].left4Ma.push(tb.cards[tData.cardNext + i]);
            }
        }

        //算杠
        for (var i = 0; i < pls.length; i++) {
            var pi = pls[i];
            //pi.winone+=(pi.mjgang1.length*2+pi.mjgang0.length)*3;
            pi.winone += (pi.mjgang1.length * 2 + pi.mjgang0.length) * 3;

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
                    var num2 = pi.huType == 7 ? 1 : 0;
                    if (num2 == 1 && majiang.canGang1([], pi.mjhand, []).length > 0) num2 = 2;
                    GLog("num2=======" + num2);
                    var num3 = majiang.All3(pi);//0 1大对碰 2 含风大对碰

                    var sameColor = majiang.SameColor(pi);
                    var hunyise = majiang.HunYiSe(pi);

                    //var baseWin=1;
                    var baseWin = 2;
                    var judgeType = 0;
                    if (!tData.noBigWin) {
                        var des = "";
                        if (sameColor)//清一色
                        {
                            des = "清一色";
                            judgeType = 1;
                        }
                        //混一色
                        if (hunyise) {
                            des = "混一色";
                            judgeType = 1;
                        }
                        if (num3 == 1) {
                            des = "碰碰胡";
                            if (sameColor) des = "清碰";

                            if (hunyise) des = "混碰";
                            judgeType = 1;

                        }
                        if (des != "")    pi.mjdesc.push(des);

                        //天胡
                        if (tData.cardNext == 53 && tData.curPlayer == tData.zhuang && pi.winType >= WinType.pickNormal) {
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

                        //杠上花
                        if (pi.winType == WinType.pickGang23) {
                            pi.mjdesc.push("杠上花");
                            judgeType = 1;
                        }
                        //判断 7对 普通7对 有杠龙7对
                        if (num2 > 0) {
                            pi.mjdesc.push(num2 > 1 ? "龙七对" : "七对");
                            judgeType = 1;
                        }

                    }
                    //pi.baseWin=baseWin;
                    pi.baseWin = 1
                    var isGangShangHua = false;
                    var isQiangGangHu = false;

                    //var maFan = 1;//算翻
                    var maFan = 1;//算分
                    var maCount = 0;

                    switch (majiang.getMaPrice(pi)) {
                        case 0:
                            maCount = 0;
                            maFan = 1;
                            break;
                        case 1:
                            //maFan *=2;
                            maFan = 2;
                            maCount = 1;
                            break;
                        case 2:
                            //maFan *=4;
                            maFan = 4;
                            maCount = 2;
                            break;
                        case 3:
                            //maFan *=8;
                            maFan = 6;
                            maCount = 3;
                            break;
                        case 4:
                            //maFan *=16;
                            maFan = 8;
                            maCount = 4;
                            break;
                        case 5:
                            //maFan *=32;
                            maFan = 10;
                            maCount = 5;
                            break;
                        case 6:
                            //maFan *=64;
                            maFan = 12;
                            maCount = 6;
                            break;
                        case 7:
                            //maFan *=128;
                            maFan = 14;
                            maCount = 7;
                            break;
                        case 8:
                            //maFan *=256;
                            maFan = 16;
                            maCount = 8;
                            break;
                    }

                    for (var j = 0; j < pls.length; j++) {
                        var pj = pls[j];
                        if (pj.winType > 0) continue;

                        var roundWin = 1;
                        //点炮一家输
                        //if(pi.winType<=WinType.eatGangPut)
                        //{
                        //	if(pj.uid!=tData.uids[tData.curPlayer]) continue;
                        //	roundWin*=(!tData.noBigWin&&pi.winType==WinType.eatGangPut)?3:1;
                        //	pj.mjdesc.push( (tData.noBigWin||pi.winType<WinType.eatGangPut)?"点炮":"杠炮");
                        //}
                        //抢杠   邵阳包三家  转转不包
                        //抢杠胡 杠炮的那个玩家包3家 马钱也包
                        if (pi.winType == WinType.eatGang) {
                            if (pj.uid != tData.uids[tData.curPlayer]) continue;
                            //roundWin*=tData.noBigWin?1:3;
                            //pj.mjdesc.push("杠炮");
                            judgeType = 1;
                            isQiangGangHu = true;
                            //pi.mjdesc.push("抢杠胡");
                            baseWin = maFan * 3 + 3 * 2;
                            pi.baseWin = 3;

                        }
                        else {
                            if (maFan == 1) baseWin = maFan + 1;//无马 基础分2
                            else baseWin = maFan + 1 * 2;
                            pi.baseWin = 1;
                        }

                        //点杠者包3家  if(pi.winType==WinType.pickGang1){if(pj.uid!=tData.uids[tData.lastPutPlayer])	continue;roundWin*=3;}

                        //var maFan = 1;
                        //var maCount = 0;
                        if (pi.winType == WinType.pickGang1) {//点杠
                            if (pj.uid != tData.uids[tData.lastPutPlayer])    continue;
                            //baseWin = maFan * 3 +3*2;
                            //judgeType = 1;
                            //isGangShangHua = true;
                            //pi.baseWin=3;
                            isGangShangHua = true;
                            pi.baseWin = 1;
                            judgeType = 1;
                        }
                        //else
                        //{
                        //	if(maFan == 1) baseWin = maFan + 1;//无马 基础分2
                        //	else baseWin = maFan + 1*2;
                        //	pi.baseWin=1;
                        //}

                        pi.winone += roundWin * baseWin;
                        pj.winone -= roundWin * baseWin;
                    }
                    if (isGangShangHua) {
                        pi.mjdesc.push("杠上花");
                    }
                    if (isQiangGangHu) {
                        pi.mjdesc.push("抢杠胡");
                    }

                    //pi.baseWin=baseWin;
                    if (maFan != 1) pi.mjdesc.push("买马" + maCount);
                    if (judgeType == 0) {
                        pi.mjdesc.push("平胡");
                    }
                }
            }
        }
        else {
            tData.winner = -1;
        }

        tData.tState = TableState.roundFinish;
        var owner = tb.players[tData.uids[0]].info;
        if (!byEndRoom) {
            if (!owner.$inc) {
                owner.$inc = {money: -tb.createPara.money};
            }
        }
        tb.AllPlayerRun(function (p) {
            p.winall += p.winone;

        });
        tData.roundNum--;

        var roundEnd = {
            players: tb.collectPlayer('mjhand', 'mjdesc', 'winone', 'winall', 'winType', 'baseWin', 'mjMa', 'left4Ma'),
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
                        p.eatFlag = GetEatFlag(p, tData);
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

    Table.prototype.MJPut = function (pl, msg, session, next) {
        GLog("Table.prototype.MJPut");
        next(null, null);  //if(this.GamePause()) return;
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
        }


    }
    //发牌不要求在线
    function SendNewCard(tb) {
        GLog("function SendNewCard >>>>,尝试摸牌");
        var tData = tb.tData;
        var cards = tb.cards;
        var horse = tData.horse;
        if (tb.AllPlayerCheck(function (pl) {
                GLog("pl.uid======" + pl.uid + "   pl.mjState:" + pl.mjState);
                return pl.mjState == TableState.waitCard
            })) {
            if (tData.withZhong) horse = horse + 2; //GLog("SendNewCard  horse==="+horse);
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
                if (tData.putType == 0 || tData.putType == 4)tData.curPlayer = (tData.curPlayer + 1) % 4;
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

    Table.prototype.TryNewCard = function () {
        GLog("function TryNewCard");
        SendNewCard(this);
    }

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
                    owner: tData.owner,
                    money: tb.createPara.money,
                    now: nowStr,
                    tableid: tb.tableid,
                    logid: playid,
                    players: []
                };
                tb.AllPlayerRun(function (p) {
                    var pinfo = {};
                    pinfo.uid = p.uid;
                    pinfo.winall = p.winall;
                    pinfo.nickname = p.info.nickname || p.info.name;
                    pinfo.money = p.info.money;
                    playInfo.players.push(pinfo);
                });
                tb.AllPlayerRun(function (p) {
                    var table = "majiangLog";
                    app.mdb.db.collection("majiangLog").update({_id: p.uid},
                        {$push: {logs: {$each: [playInfo], $slice: -50}}}, {upsert: true}, function (er, doc) {
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
                var dayID = parseInt(endTime.Format("yyyyMMdd"));
                var inc = {};
                inc[tData.roundAll + "_" + (tData.noBigWin ? "z" : "s") + "_c" + (tData.canEat ? 1 : 0) + "_f" + (tData.withWind ? 1 : 0) + "_p" + (tData.canEatHu ? 1 : 0)] = 1;
                app.mdb.db.collection("dayLog").update({_id: dayID}, {$inc: inc}, {upsert: true}, function (er, doc) {

                });
                //合并回放
                if (!app.mjlogs) app.mjlogs = {array: [], tableName: tableName};
                if (app.mjlogs.tableName != tableName || app.mjlogs.array.length >= 10) {
                    app.mdb.db.collection(app.mjlogs.tableName).insertMany(app.mjlogs.array, function (er, doc) {
                    });
                    app.mjlogs.array = [];
                    app.mjlogs.tableName = tableName;
                }
                app.mjlogs.array.push({logid: playid, endTime: endTime, mjlog: tb.mjlog});
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

    Table.prototype.MJPass = function (pl, msg, session, next) {
        GLog("Table.prototype.MJPass");
        next(null, null); //if(this.GamePause()) return;
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
        }

    }

    Table.prototype.MJChi = function (pl, msg, session, next) {
        GLog("Table.prototype.MJChi");
        next(null, null); //if(this.GamePause()) return;
        var tData = this.tData;
        if (
            tData.canEat
            && tData.tState == TableState.waitEat
            && pl.mjState == TableState.waitEat
            && tData.uids[tData.curPlayer] != pl.uid
            && tData.uids[(tData.curPlayer + 1) % 4] == pl.uid//下家限制
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

    Table.prototype.MJPeng = function (pl, msg, session, next) {
        GLog("Table.prototype.MJPeng");
        next(null, null); //if(this.GamePause()) return;
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
        }

    }

    function MJGangForShenZhen(pl, msg, self) {
        GLog("Table.prototype.MJGangForShenZhen");
        var tData = self.tData;
        var horse = tData.horse;
        //鬼牌模式 或者带风模式 多预留2匹马
        if (tData.withZhong) horse = horse + 2;
        if (tData.jiejieGao) //为此局多预留2匹马
        {
            switch (self.players[tData.uids[tData.zhuang]].linkZhuang) {
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
                            if (msg.gang != 3 && hType != 13) {
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
            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3) {
                GLog("杠胡");
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠");
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + 3) % 4;
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
                            if (msg.gang != 3 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }
                        else {
                            if (msg.gang != 3 || hType == 13) {
                                p.mjState = TableState.waitEat;
                                p.eatFlag = 8;
                            }
                        }

                    }
                }
            });
            self.NotifyAll('MJGang', msg);
            self.mjlog.push('MJGang', msg);//杠
            if (canEatGang) {
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + 3) % 4;
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
            //var canEatGang= !tData.noBigWin|| (msg.gang==2&&tData.canEatHu); //邵阳麻将||点炮转转麻将
            var canEatGang = msg.gang == 2;//只抢自摸明杠

            var hType = 0;
            GLog("canEatGang " + canEatGang);
            self.AllPlayerRun(function (p) {
                p.mjState = TableState.waitCard;
                p.eatFlag = 0;
                GLog("p!=pl " + (p != pl) + "  !p.skipHu" + (!p.skipHu));
                //if(hType>0)GLog("有人可以胡！！！！！");
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
                            if (msg.gang != 3 && hType != 13) {
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


            if (msg.gang == 1 || msg.gang == 2 || msg.gang == 3) {
                GLog("杠胡")
                tData.putType = msg.gang;
                tData.curPlayer = tData.uids.indexOf(pl.uid);
                tData.lastPut = msg.card;
            }
            else {
                GLog("没杠")
                tData.putType = 0;
                tData.curPlayer = (tData.uids.indexOf(pl.uid) + 3) % 4;
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
        }
    }

    function HighPlayerHu(tb, pl)//此处必须保证没有其他玩家想胡牌,
    {
        GLog("function HighPlayerHu");
        var tData = tb.tData;
        var uids = tData.uids;

        GLog("出牌的那个人 uid 是" + uids[tData.curPlayer]);

        var h1Man = tb.players[uids[(tData.curPlayer + 1) % 4]];
        var h2Man = tb.players[uids[(tData.curPlayer + 2) % 4]];
        var h3Man = tb.players[uids[(tData.curPlayer + 3) % 4]];


        var h1ManType = majiang.prejudgeHuType(h1Man, tData.lastPut);
        var h2ManType = majiang.prejudgeHuType(h2Man, tData.lastPut);
        var h3ManType = majiang.prejudgeHuType(h3Man, tData.lastPut);


        GLog("点胡的那个人uid：" + pl.uid);
        GLog("");
        GLog("h1Man" + (tData.curPlayer + 1) % 4 + " uid:" + h1Man.uid + "胡牌类型：" + h1ManType + "是否过胡：" + h1Man.skipHu);
        GLog("h2Man" + (tData.curPlayer + 2) % 4 + " uid:" + h2Man.uid + "胡牌类型：" + h2ManType + "是否过胡：" + h1Man.skipHu);
        GLog("h3Man" + (tData.curPlayer + 3) % 4 + " uid:" + h3Man.uid + "胡牌类型：" + h3ManType + "是否过胡：" + h1Man.skipHu);
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
            for (var i = (tData.curPlayer + 1) % 4; uids[i] != pl.uid; i = (i + 1) % 4) {
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
        //&&!HighPlayerHu(this,pl)// 邵阳麻将可以多家胡
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
        //&&!HighPlayerHu(this,pl)// 邵阳麻将可以多家胡
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

    Table.prototype.MJHu = function (pl, msg, session, next) {
        GLog("Table.prototype.MJHu");
        //此处必须保证胡牌顺序
        next(null, null); //if(this.GamePause()) return;	
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

        }
    }
    Table.prototype.DelRoom = function (pl, msg, session, next) {
        GLog("Table.prototype.DelRoom");
        next(null, null);
        var table = this;
        var tData = this.tData;
        if (pl.delRoom == 0) {
            var yesuid = [];
            var nouid = [];
            if (msg.yes) {
                if (this.PlayerCount() < 4) {
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
                    }) >= 3) {
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