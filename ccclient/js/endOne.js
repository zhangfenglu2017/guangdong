//Jian
//2016年7月14日 20:29:44
//单次结算界面

function SetEndOnePlayerUI(node, off)
{
    var pl = getUIPlayer(off);

    if(pl == null)
        return;

    node = node.getChildByName("head");
    var uibind =
    {
        head: {
            headImg: {
                _run: function () {
                    this.zIndex = 2;
                }
            },
            linkZhuang: {
                _run: function () {
                    this.zIndex = 10;
                    var path = "res/play-yli/zhuang_" + pl.linkZhuang + ".png";
                    cc.log("path = " + path);
                    this.loadTexture(path);
                }
            },
            baojiuzhang: {
                _visible: function () {
                    this.zIndex = 100;
                    return checkShowBaoJiuZhang(pl);
                },
            },
            name: {
                _text: function () {
                    return unescape(pl.info.nickname || pl.info.name) + "";
                }
            },

            userId:
            {
                _text:function ()
                {
                    return "ID:" + pl.info._id
                }
            },

            winType: {
                _text: function () {
                    if(jsclient.data.sData.tData.gameType == 4)
                        return pl.baseWin > 0 ? ( pl.baseWin + "番") : "";
                    //不再提示X1
                    //return pl.baseWin > 0 ? ( "X" + pl.baseWin) : "";
                    return "";
                }
            },

            up: {
                _visible: false,

                _run: function () {
                    var arry = [];
                    for (var i = 0; i < pl.mjgang0.length; i++) {
                        for (var j = 0; j < 4; j++) {
                            if (j == 3) {
                                arry.push(AddNewCard(node, "up", "gang0", pl.mjgang0[i], 0, "isgang4"))
                            }
                            else {
                                arry.push(AddNewCard(node, "up", "gang0", pl.mjgang0[i], 0));
                            }
                        }
                    }

                    //添加暗杠
                    for (var i = 0; i < pl.mjgang1.length; i++) {

                        for (var j = 0; j < 4; j++) {
                            if (j == 3) {
                                var card = AddNewCard(node, "down", "gang1", 0, 0, "isgang4");
                                card.tag = pl.mjgang1[i];
                                arry.push(card);
                            }
                            else {
                                arry.push(AddNewCard(node, "up", "gang1", pl.mjgang1[i], 0));
                            }
                        }
                    }
                    //添加碰
                    for (var i = 0; i < pl.mjpeng.length; i++) {
                        //AddNewCard(node,copy,name,tag,off)
                        for (var j = 0; j < 3; j++) {
                            arry.push(AddNewCard(node, "up", "peng", pl.mjpeng[i], 0));
                        }
                    }

                    //添加吃
                    for (var i = 0; i < pl.mjchi.length; i++) {
                        arry.push(AddNewCard(node, "up", "chi", pl.mjchi[i], 0));
                    }

                    //添加手牌
                    for (var i = 0; i < pl.mjhand.length; i++) {
                        arry.push(AddNewCard(node, "up", "mjhand", pl.mjhand[i], 0));
                    }

                    for (var i = 0; i < arry.length; i++) {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                    }

                    cc.log("node.children.length" + node.children.length);
                    RestoreCardLayout(node, 0, pl);
                },
            },

            down: {
                _visible: false
            },

            stand: {
                _visible: false
            },

            cardType: {
                _text: function () {
                    return pl.mjdesc + ""
                }
            },
        },
        winNum: {
            _text: function () {
                var pre = "";
                if (pl.winone > 0)
                    pre = "+";

                return pre + pl.winone;
            },

            hu: {
                _run: function () {
                    this.visible = (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0 );
                }
            }
        }
    };
    ConnectUI2Logic(node.parent, uibind);

    jsclient.loadWxHead(pl.info.headimgurl, node, 65, 60, 0.2, 1);
}


function GetDelPlayer(off) {
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (tData.firstDel < 0)
        return null;

    var idx = (tData.uids.indexOf(tData.firstDel) + off) % 4;
    return sData.players[tData.uids[idx] + ""];
}


function DelRoomAgree(node, off) {
    var pl = GetDelPlayer(off);
    if (!pl) return;
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (off == 0) {
        node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]申请解散房间");
    }
    else {
        if (pl.delRoom > 0) {
            node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]同意");
        }
        else if (pl.delRoom == 0) {
            node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]等待选择");
        }
        else if (pl.delRoom < 0) {
            node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]拒绝");
        }
    }
}

//是否同意解散房间
function DelRoomVisible(node) 
{
    var pl = getUIPlayer(0);
    node.visible = pl.delRoom == 0;
}


//解散房间倒计时同意
function DelRoomTime(node) {
    var callback = function () {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var time = sData.serverNow + Date.now();
        var needtime = tData.delEnd - time;
        var need_s = Math.floor((needtime / 1000) % 60);
        var need_m = Math.floor((needtime / 1000) / 60);
        if (need_s == 0 && need_m == 0) {
            node.cleanup();
        }
        node.setString("在" + need_m + "分" + need_s + "之后将自动同意");
    };
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.DelayTime(1.0))));
}

//申请房间解散
(function () {
    DelRoomLayer = cc.Layer.extend(
        {
            jsBind: {
                block: {
                    _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
                },

                back: {
                    _layout: [[0.54, 0.65], [0.5, 0.5], [0, 0]],

                    time: {
                        _run: function () {
                            DelRoomTime(this);
                        }
                    },
                    player0: {
                        _run: function () {
                            DelRoomAgree(this, 0);
                        },
                        _event: {
                            DelRoom: function () {
                                DelRoomAgree(this, 0);
                            }
                        }
                    },
                    player1: {
                        _run: function () {
                            DelRoomAgree(this, 1);
                        },
                        _event: {
                            DelRoom: function () {
                                DelRoomAgree(this, 1);
                            }
                        }
                    },
                    player2: {
                        _run: function () {
                            DelRoomAgree(this, 2);
                        },
                        _event: {
                            DelRoom: function () {
                                DelRoomAgree(this, 2);
                            }
                        }
                    },
                    player3: {
                        _run: function () {
                            if (IsThreeTable())
                            {
                                this.visible = false;
                                return;
                            }

                            DelRoomAgree(this, 3);
                        },
                        _event: {
                            DelRoom: function () {

                                if (IsThreeTable())
                                {
                                    return;
                                }

                                DelRoomAgree(this, 3);
                            }
                        }
                    },

                    yes: {
                        _click: function () {
                            jsclient.delRoom(true);
                        }
                        , _event: {
                            DelRoom: function () {
                                DelRoomVisible(this);
                            }
                        }
                        , _run: function () {
                            DelRoomVisible(this);
                        }
                    },

                    no: {
                        _click: function () {
                            jsclient.delRoom(false);
                        }
                        , _event: {
                            DelRoom: function () {
                                DelRoomVisible(this);
                            }
                        }
                        , _run: function () {
                            DelRoomVisible(this);
                        }
                    }
                },

                _event: {
                    endRoom: function () {
                        jsclient.delroomui.removeFromParent(true);
                        delete jsclient.delroomui;
                    },
                    roundEnd: function () {
                        jsclient.delroomui.removeFromParent(true);
                        delete jsclient.delroomui;
                    }
                }
            },
            ctor: function () {
                this._super();
                var delroomui = ccs.load("res/DelRoom.json");
                ConnectUI2Logic(delroomui.node, this.jsBind);
                this.addChild(delroomui.node);
                jsclient.delroomui = this;
                return true;
            }
        });

    //房间已经解散提示
    var endroomui;
    EndRoomLayer = cc.Layer.extend(
        {
            jsBind: {
                block: {_layout: [[1, 1], [0.5, 0.5], [0, 0], true]},

                back: {
                    // _layout: [[1, 1], [0.5, 0.5], [0, 0]],
                    _layout:[[0.54,0.66],[0.5,0.5],[0,0]],

                    tohome: {
                        _click: function () {
                            var msg = jsclient.endRoomMsg;
                            if (msg.reason >= 0) {
                                jsclient.leaveGame();
                            }
                            endroomui.removeFromParent(true);
                        }
                    },

                    info: {
                        _text: function () {
                            var msg = jsclient.endRoomMsg;
                            if (msg.reason == 0) {
                                if (jsclient.remoteCfg.hideMoney) return "还没有开始打牌";
                                var sData = jsclient.data.sData;
                                var tData = sData.tData;
                                if (tData.uids[0] == SelfUid()) return "游戏未开始，解散房间将不会扣除钻石";
                                return "房间已被" + GetUidNames([tData.uids[0]]) + "解散,请重新加入游戏"
                            }
                            else if (msg.reason == 1) {
                                return "解散房间申请超时";
                            } else if (msg.reason == 2) {
                                return "玩家 " + GetUidNames(msg.yesuid) + " 同意解散房间";
                            }

                        }
                    }
                }
            },
            ctor: function () {
                this._super();
                endroomui = ccs.load("res/EndRoom.json");
                ConnectUI2Logic(endroomui.node, this.jsBind);
                this.addChild(endroomui.node);
                endroomui = this;
                return true;
            }
        });


})();


//报九张是否显示
function checkShowBaoJiuZhang(pl) {
    if(pl.huType == jsclient.majiang.HUI_ZHOU_HTYPE.ZIYISE || pl.huType == jsclient.majiang.HUI_ZHOU_HTYPE.DAGE || pl.huType == jsclient.majiang.HUI_ZHOU_HTYPE.QUANYAOJIU)
    {
        if ((pl.winType == 4 || pl.winType == 5 || pl.winType == 6 ) && (pl.baojiu && pl.baojiu.num == 4)) return true;
    }
    return false;
}

//判断显示不显示买马  有人赢 才显示
function checkShowMa()
{
    var show = false;

    for (var i = 0; i < 4; i++)
    {
        var pl = getUIPlayer(i);

        if(pl)
        {
            if (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0 && jsclient.data.sData.tData.horse > 0) {
                show = true;
                break;
            }
        }
    }

    return show;
}

//判断中马没有
function checkMjMa(off) {
    var pl = null;
    for (var i = 0; i < 4; i++)
    {
        pl = getUIPlayer(i);

        if(pl)
        {
            if (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0)
            {
                break;
            }
        }
    }

    if (pl == null)
        return false;

    var sData = jsclient.data.sData;
    var tData = sData.tData;

    if(tData.baozhama)
        return true;

    var mjMa = pl.mjMa;
    var mj = pl.left4Ma[off];

    if (mj == null)
        return false;

    for (var i = 0; i < mjMa.length; i++) {
        if (pl.mjMa[i] == mj)
            return true
    }

    return false
}

//判断是否多人赢
function checkWinCount()
{
    var plCount = 0;
    for (var i = 0; i < 4; i++)
    {
        pl = getUIPlayer(i);
        if(pl)
        {
            if (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0)
            {
                plCount ++;
            }
        }
    }

    if(plCount > 1)
        return true;

    return false;
}

//设置买马的牌
function setMjMa(node, off)
{
    var pl = getUIPlayer(0);
    var cd = pl.left4Ma[off];
    if (cd != null) {
        setCardPic(node, cd);
        return true
    }

    return false
}

//单次结算
var EndOneLayer = cc.Layer.extend(
    {
        jsBind:
        {
            back:
            {
                _layout: [[0, 1], [0.5, 0.5], [0, 0]],

                playTable:
                {
                    _text:function()
                    {
                        var gameType =  jsclient.data.sData.tData.gameType;

                        if(gameType == 1)
                            return "广东推倒胡";
                        else if(gameType == 2)
                            return "惠州庄麻将";
                        else if(gameType == 3)
                            return "香港麻将";
                        else if(gameType == 4)
                            return "鸡平胡";
                        else if(gameType == 5)
                            return "东莞麻将";
                        else if(gameType == 6)
                            return "100张";
                        else if(gameType == 7)
                            return "河源百搭";
                        else if(gameType == 8)
                            return "潮汕麻将";
                        else if(gameType == 9)
                            return "深圳麻将";
                    }
                }
            },

            gameID:
            {
                _layout:  [[0.2, 0.2], [0.02, 0.08], [0, 0]],

                _text:function()
                {
                    return jsclient.data.sData.tData.tableid;
                }
            },

            gameTime:
            {
                _layout:  [[0.2, 0.2], [0.02, 0.04], [0, 0]],

                _text:function()
                {
                    return jsclient.data.sData.tData.createRoomTime + "";
                }
            },

            maima:
            {
                _layout: [[0.4, 0.4], [0.065, 0.55], [0, 0]],

                _visible:function ()
                {
                    return checkShowMa();
                },

                _click: function ()
                {
                    if(jsclient.playui == null)
                        return;

                    jsclient.playui.addChild(new ShowMaPanel());
                }
            },

            mjtips: {
                _layout: [[0.15, 0.15], [0.08, 0.75], [0, 0]],

                _visible: function () {
                    // return checkShowMa();
                    return false;
                },

                // mjtx0:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(0)
                //     }
                // },
                // mjtx1:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(1)
                //     }
                // },
                // mjtx2:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(2)
                //     }
                // },
                // mjtx3:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(3)
                //     }
                // },
                // mjtx4:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(4)
                //     }
                // },
                // mjtx5:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(5)
                //     }
                // },
                // mjtx6:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(6)
                //     }
                // },
                // mjtx7:
                // {
                //     _visible:function ()
                //     {
                //         return checkMjMa(7)
                //     }
                // },
                //
                // mjbk1:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 0);
                //         this.setVisible(show);
                //     }
                // },
                //
                // mjbk2:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 1);
                //         this.setVisible(show);
                //     }
                // },
                //
                // mjbk3:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 2);
                //         this.setVisible(show);
                //     }
                // },
                //
                // mjbk4:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 3);
                //         this.setVisible(show);
                //     }
                // },
                // mjbk5:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 4);
                //         this.setVisible(show);
                //     }
                // },
                // mjbk6:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 5);
                //         this.setVisible(show);
                //     }
                // },
                // mjbk7:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 6);
                //         this.setVisible(show);
                //     }
                // },
                // mjbk8:
                // {
                //     _run:function ()
                //     {
                //         var show = setMjMa(this, 7);
                //         this.setVisible(show);
                //     }
                // },
                //
                // mjzz1:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[0];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(0);
                //     }
                // },
                // mjzz2:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[1];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(1);
                //     }
                // },
                // mjzz3:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[2];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(2);
                //     }
                // },
                // mjzz4:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[3];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(3);
                //     }
                // },
                // mjzz5:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[4];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(4);
                //     }
                // },
                // mjzz6:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[5];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(5);
                //     }
                // },
                // mjzz7:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[6];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(6);
                //     }
                // },
                // mjzz8:
                // {
                //     _visible:function ()
                //     {
                //         var pl = getUIPlayer(0);
                //         var cd = pl.left4Ma[7];
                //
                //         if(cd == null)
                //             return false;
                //
                //         return !checkMjMa(7);
                //     }
                // },

            },

            wintitle: {
                _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

                _visible: function () {
                    var pl = getUIPlayer(0);
                    if (pl)
                        return pl.winone >= 1;

                    return false;
                }
            },

            losetitle: {
                _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

                _visible: function () {
                    var pl = getUIPlayer(0);
                    if (pl)
                        return pl.winone < 0;

                    return false;
                }
            },

            pingju: {
                _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

                _visible: function ()
                {
                    var pl0 = getUIPlayer(0);
                    var pl1 = getUIPlayer(1);
                    var pl2 = getUIPlayer(2);
                    var pl3 = getUIPlayer(3);

                    if(IsThreeTable())
                    {
                        if (pl0 && pl1 && pl3)
                        {
                            if (pl0.winone == 0 && pl1.winone == 0 && pl3.winone == 0)
                            {
                                //如果都没赢，就荒了
                                return false;
                            }
                        }
                    }
                    else
                    {
                        if (pl0 && pl1 && pl2 && pl3)
                        {
                            if (pl0.winone == 0 && pl1.winone == 0 && pl2.winone == 0 && pl3.winone == 0)
                            {
                                //如果都没赢，就荒了
                                return false;
                            }
                        }
                    }

                    if (pl0)
                        return pl0.winone == 0;

                    return false;
                }
            },

            huang: {
                _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],
                _visible: function ()
                {
                    var pl0 = getUIPlayer(0);
                    var pl1 = getUIPlayer(1);
                    var pl2 = getUIPlayer(2);
                    var pl3 = getUIPlayer(3);

                    if(IsThreeTable())
                    {
                        if (pl0.winone == 0 && pl1.winone == 0 && pl3.winone == 0)
                        {
                            //如果都没赢，就荒了
                            return true;
                        }
                    }
                    else
                    {
                        if (pl0 && pl1 && pl2 && pl3)
                        {
                            if (pl0.winone == 0 && pl1.winone == 0 && pl2.winone == 0 && pl3.winone == 0)
                            {
                                //如果都没赢，就荒了
                                return true;
                            }
                        }
                    }

                    return false;
                },

            },

            share: {
                _layout: [[0.15, 0], [0.2, 0.07], [1, 0.5]],

                _click: function () {
                    sendEvent("capture_screen");
                },

                _event: {
                    captureScreen_OK: function () {
                        jsclient.native.wxShareImage();
                    }
                }
            },

            ready: {
                _layout: [[0.15, 0], [0.5, 0.07], [1, 0.5]],

                _click: function (btn, eT) {
                    
                    sendEvent("clearCardUI");
                    jsclient.endoneui.removeFromParent(true);
                    jsclient.MJPass2Net();
                }
            },

            head0: {
                backbar: {_layout: [[0.85, 1], [0.55, 0.8], [0, 0]]},

                head: {
                    _layout: [[0.12, 0.12], [0.2, 0.82], [0, 0]],
                    zhuang: {_visible: false},
                    linkZhuang: {_visible: false},
                    up:
                    {
                        gui:
                        {
                            _visible : false
                        }
                    }
                },

                winNum: {_layout: [[0.05, 0.05], [0.83, 0.8], [0, 0]]},

                _run: function () {

                    if (IsThreeTable())
                    {
                        this.y -= 50;
                    }

                    SetEndOnePlayerUI(this, 0);
                },

            },

            head1: {
                backbar: {_layout: [[0.85, 1], [0.55, 0.62], [0, 0]]},

                head: {
                    _layout: [[0.12, 0.12], [0.2, 0.64], [0, 0]],
                    zhuang: {_visible: false},
                    linkZhuang: {_visible: false},

                    up:
                    {
                        gui:
                        {
                            _visible : false
                        }
                    }
                },

                winNum: {_layout: [[0.05, 0.05], [0.83, 0.62], [0, 0]]},

                _run: function () {

                    if (IsThreeTable())
                    {
                        this.y -= 50;
                    }

                    SetEndOnePlayerUI(this, 1);
                }
            },

            head2: {
                backbar: {_layout: [[0.85, 1], [0.55, 0.44], [0, 0]]},

                head: {
                    _layout: [[0.12, 0.12], [0.2, 0.46], [0, 0]],
                    zhuang: {_visible: false},
                    linkZhuang: {_visible: false},

                    up:
                    {
                        gui:
                        {
                            _visible : false
                        }
                    }
                },

                winNum: {_layout: [[0.05, 0.05], [0.83, 0.44], [0, 0]]},

                _run: function () {

                    if (IsThreeTable())
                    {
                        this.y -= 50;
                        SetEndOnePlayerUI(this, 3);
                    }
                    else
                        SetEndOnePlayerUI(this, 2);
                }
            },

            head3: {
                backbar: {_layout: [[0.85, 1], [0.55, 0.26], [0, 0]]},

                head: {
                    _layout: [[0.12, 0.12], [0.2, 0.28], [0, 0]],
                    zhuang: {_visible: false},
                    linkZhuang: {_visible: false},

                    up:
                    {
                        gui:
                        {
                            _visible : false
                        }
                    }
                },

                winNum: {_layout: [[0.05, 0.05], [0.83, 0.26], [0, 0]]},

                _run: function () {

                    if (IsThreeTable())
                    {
                        this.visible = false;
                    }
                    else
                        SetEndOnePlayerUI(this, 3);

                }
            },

            _run:function()
            {
                // var wintitle = this.getChildByName("wintitle");
                // var losetitle = this.getChildByName("losetitle");
                // var pingju = this.getChildByName("pingju");
                // var huang = this.getChildByName("huang");
                //
                // var gameEndTableAnim = null;

                // if(wintitle.visible)
                // {
                //     gameEndTableAnim = playAnimByJson("ying", "ying");
                //     gameEndTableAnim.x = wintitle.x;
                //     gameEndTableAnim.y = wintitle.y;
                //     gameEndTableAnim.scale = wintitle.scale;
                //     this.addChild(gameEndTableAnim);
                //
                //     log("单局结束...赢！！！")
                // }
                // else if(losetitle.visible)
                // {
                //     gameEndTableAnim = playAnimByJson("shu", "shu");
                //     gameEndTableAnim.x = losetitle.x;
                //     gameEndTableAnim.y = losetitle.y;
                //     gameEndTableAnim.scale = losetitle.scale;
                //     this.addChild(gameEndTableAnim);
                //
                //     log("单局结束...输！！！")
                // }
                // else if(pingju.visible)
                // {
                //     gameEndTableAnim = playAnimByJson("ping", "ping");
                //     gameEndTableAnim.x = pingju.x;
                //     gameEndTableAnim.y = pingju.y;
                //     gameEndTableAnim.scale = pingju.scale;
                //     this.addChild(gameEndTableAnim);
                //
                //     log("单局结束...平！！！")
                // }
                // else if(huang.visible)
                // {
                //     gameEndTableAnim = playAnimByJson("huang", "huang");
                //     gameEndTableAnim.x = huang.x;
                //     gameEndTableAnim.y = huang.y;
                //     gameEndTableAnim.scale = huang.scale;
                //     this.addChild(gameEndTableAnim);
                //
                //     log("单局结束...荒！！！")
                // }
            }
        },
        ctor: function () {
            this._super();
            var endoneui = ccs.load(res.EndOne_json);
            ConnectUI2Logic(endoneui.node, this.jsBind);
            this.addChild(endoneui.node);
            jsclient.endoneui = this;

            var sData = jsclient.data.sData;
            var tData = sData.tData;

            var selfUid = SelfUid();
            var zoff = (tData.zhuang + tData.maxPlayer - tData.uids.indexOf(selfUid)) % tData.maxPlayer;
            var zhuang = this.jsBind["head" + zoff].head.zhuang._node;
            var linkZhuang = this.jsBind["head" + zoff].head.linkZhuang._node;

            if ((tData.gameType == 3 || tData.gameType == 1) && tData.jiejieGao)
            {
                zhuang.visible = false;
                linkZhuang.visible = true;
            }
            else
            {
                zhuang.visible = true;
                linkZhuang.visible = false;
            }
            zhuang.zIndex = 10;

            return true;
        }
    });

//显示买马牌
function showEndMa()
{
    var pl = getUIPlayer(0);
    var cardMa = pl.left4Ma;
    // var cardMa = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
    var index = 0;
    var col = 8;
    var row = 3;
    var time = 0.05;
    var sposx = 120;
    var sposy = 400;
    var offx = 25;
    var offy = 15;

    var cardCount = cardMa.length;

    var cardSize = cardNode.getContentSize();
    var scale = cardNode.scale;

    //如果超过24个马 就计算 行
    if(cardCount >= 20)
    {
        sposx = 10;

        row = cardCount / col;

        if(cardCount % col > 0)
            row = row + 1;

        var svSize = ScrollView.getInnerContainerSize();
        ScrollView.setInnerContainerSize(cc.size(svSize.width, row * ((offy + cardSize.height) * scale)));
    }

    switch (cardCount)
    {
    case 1:
        sposx = 330;
        sposy = 150;
        offx = 0;
        break;
    case 2:
        sposx = 240;
        sposy = 150;
        offx = 110;
        break;
    case 4:
        sposx = 130;
        sposy = 150;
        offx = 65;
        break;
    case 6:
        sposx = 210;
        sposy = 200;
        offx = 55;
        col = 3;
        break;
    case 8:
        sposx = 130;
        sposy = 220;
        offx = 65;
        offy = 30;
        col = 4;
        break;
    case 10:
        sposx = 80;
        sposy = 220;
        offx = 65;
        offy = 30;
        col = 5;
        break;
    case 12:
        sposx = 50;
        sposy = 220;
        offx = 50;
        offy = 30;
        col = 6;
        break;
    case 14:
        sposx = 30;
        sposy = 220;
        offx = 35;
        offy = 30;
        col = 7;
        break;
    case 16:
        sposx = 15;
        sposy = 220;
        offy = 30;
        break;
    case 18:
        sposx = 30;
        sposy = 260;
        offx = 55;
        col = 6;
        break;
    case 20:
        sposx = 80;
        sposy = 280;
        offx = 55;
        col = 5;
        row = 4;
        break;
    }

    var svSize = ScrollView.getInnerContainerSize();

    for (var i = 0; i < row; i++)
    {
        for (var j = 0; j < col; j++)
        {
            var cd = cardMa[index];
            index++;

            if (index > cardCount)
                return;

            if (cd == null)
                return;

            var cardClone = cardNode.clone();

            var cadrContent =
            {
                down: {
                    _run: function () {
                        this.visible = true;
                    },
                },

                up: {
                    _run: function () {
                        this.visible = false;
                        setCardPic(this, cd);
                    },
                },

                close: {
                    _visible: function () {
                        return false;
                    },
                },

                open: {
                    _visible: function () {
                        return false;
                    }
                }
            };

            cardClone.scale = scale;
            cardClone.x = sposx + j * (cardSize.width * scale + offx);
            if(cardCount >= 20)
                cardClone.y =  svSize.height - (i + 1) * (cardSize.height * scale + offy);
            else
                cardClone.y =  sposy - i * (cardSize.height * scale + offy);

            cardClone.visible = true;

            ConnectUI2Logic(cardClone, cadrContent);
            ScrollView.addChild(cardClone);
            showCardActionAndMa(index - 1, cardClone, index * time);
        }
    }
}

//翻拍动画(并且判断有没有中马)
function showCardActionAndMa(cardIndex, cardNode, time)
{
    var cardBack = cardNode.getChildByName("down");
    var cardImg = cardNode.getChildByName("up");
    var cardOpen = cardNode.getChildByName("open");
    var cardClose = cardNode.getChildByName("close");

    var onActionEnd = function ()
    {
        cardBack.visible = false;
        cardImg.visible = true;
        cardImg.scaleX = 0;

        cardImg.runAction(cc.sequence(cc.scaleTo(0.3, 1, 1), cc.callFunc(function ()
        {
            if (checkMjMa(cardIndex))
            {
                //如果有多人赢，则不显示高亮
                if(checkWinCount())
                    cardOpen.visible = false;
                else
                    cardOpen.visible = true;
            }
            else
            {
                //如果有多人赢，则不显示遮罩
                if(checkWinCount())
                    cardClose.visible = false;
                else
                    cardClose.visible = true;
            }
        })));
    };
    var actTime = cc.delayTime(time);
    var actScale = cc.scaleTo(0.3, 0, 1);
    var actCall = cc.callFunc(onActionEnd);
    var actSeq = cc.sequence(actTime, actScale, actCall);

    cardBack.visible = true;
    cardBack.runAction(actSeq);
}

//结算显示马
var cardNode, maBackNode, ScrollView;
var ShowMaPanel = cc.Layer.extend({
    jsBind: 
    {
        block:
        {
            _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
        },

        back:
        {
            _layout: [[0.88, 0.88], [0.5, 0.5], [0, 0]],

            _run: function ()
            {
                maBackNode = this;
            },

            OK:
            {
                _click: function (btn, eT)
                {
                    jsclient.endMaiMa.removeFromParent(true);
                }
            },

            ScrollView:
            {
                _run: function ()
                {
                    ScrollView = this;
                },
            }

        },

        card:
        {
            _run: function () 
            {
                this.visible = false;
                cardNode = this;
            }
        }

    },
    ctor: function () 
    {
        this._super();
        var endMaiMa = ccs.load("res/ShowMa.json");
        ConnectUI2Logic(endMaiMa.node, this.jsBind);
        this.addChild(endMaiMa.node);
        jsclient.endMaiMa = this;

        showEndMa();

        return true;
    }
});



