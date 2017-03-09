//Jian
//2016年7月14日 20:29:44
//单次结算界面

function SetEndOnePlayerUI(node, off)
{
    var pl = getUIPlayer(off);
    node = node.getChildByName("head");
    var uibind =
    {
        head:
        {
            headImg:
            {
                _run:function ()
                {
                    this.zIndex = 2;
                }
            },

            name:
            {
                _text: function ()
                {
                    return unescape(pl.info.nickname || pl.info.name) + "";
                }
            },

            winType:
            {
                _text: function ()
                {
                    return pl.baseWin > 0 ? ("X" + pl.baseWin) : "";
                }
            },

            up:
            {
                _visible: false,

                _run: function ()
                {
                    var arry = [];
                    for (var i = 0; i < pl.mjgang0.length; i++)
                    {
                        for (var j = 0; j < 4; j++)
                        {
                            if (j == 3)
                            {
                                arry.push(AddNewCard(node, "up", "gang0", pl.mjgang0[i], 0, "isgang4"))
                            }
                            else
                            {
                                arry.push(AddNewCard(node, "up", "gang0", pl.mjgang0[i], 0));
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
                                var card = AddNewCard(node, "down", "gang1", 0, 0, "isgang4");
                                card.tag = pl.mjgang1[i];
                                arry.push(card);
                            }
                            else
                            {
                                arry.push(AddNewCard(node, "up", "gang1", pl.mjgang1[i], 0));
                            }
                        }
                    }
                    //添加碰
                    for (var i = 0; i < pl.mjpeng.length; i++)
                    {
                        //AddNewCard(node,copy,name,tag,off)
                        for (var j = 0; j < 3; j++)
                        {
                            arry.push(AddNewCard(node, "up", "peng", pl.mjpeng[i], 0));
                        }
                    }

                    //添加吃
                    for (var i = 0; i < pl.mjchi.length; i++)
                    {
                        arry.push(AddNewCard(node, "up", "chi", pl.mjchi[i], 0));
                    }

                    //添加手牌
                    for (var i = 0; i < pl.mjhand.length; i++)
                    {
                        arry.push(AddNewCard(node, "up", "mjhand", pl.mjhand[i], 0));
                    }

                    for (var i = 0; i < arry.length; i++)
                    {
                        arry[i].visible = true;
                        arry[i].enabled = false;
                    }

                    cc.log("node.children.length" + node.children.length);
                    RestoreCardLayout(node, 0, pl);
                }
            },

            down:
            {
                _visible: false
            },

            stand:
            {
                _visible: false
            },

            cardType:
            {
                _text: function ()
                {
                    return pl.mjdesc + ""
                }
            },
        },
        winNum:
        {
            _text: function ()
            {
                var pre = "";
                if (pl.winone > 0)
                    pre = "+";

                return pre + pl.winone;
            },

            hu:
            {
                _run: function ()
                {
                    this.visible = (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0 );
                }
            }
        }
    };
    ConnectUI2Logic(node.parent, uibind);
    
    jsclient.loadWxHead(pl.info.headimgurl,node,65,60,0.2,1);
}


function GetDelPlayer(off)
{
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (tData.firstDel < 0)
        return null;

    var idx = (tData.uids.indexOf(tData.firstDel) + off) % 4;
    return sData.players[tData.uids[idx] + ""];
}


function DelRoomAgree(node, off)
{
    var pl = GetDelPlayer(off);
    if (!pl) return;
    var sData = jsclient.data.sData;
    var tData = sData.tData;
    if (off == 0)
    {
        node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]申请解散房间");
    }
    else
    {
        if (pl.delRoom > 0)
        {
            node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]同意");
        }
        else if (pl.delRoom == 0)
        {
            node.setString("玩家[" + unescape(pl.info.nickname || pl.info.name) + "]等待选择");
        }
        else if (pl.delRoom < 0)
        {
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
function DelRoomTime(node)
{
    var callback = function ()
    {
        var sData = jsclient.data.sData;
        var tData = sData.tData;
        var time = sData.serverNow + Date.now();
        var needtime = tData.delEnd - time;
        var need_s = Math.floor((needtime / 1000) % 60);
        var need_m = Math.floor((needtime / 1000) / 60);
        if (need_s == 0 && need_m == 0)
        {
            node.cleanup();
        }
        node.setString("在" + need_m + "分" + need_s + "之后将自动同意");
    };
    node.runAction(cc.repeatForever(cc.sequence(cc.callFunc(callback), cc.DelayTime(1.0))));
}

//申请房间解散
(function ()
{
    DelRoomLayer = cc.Layer.extend(
    {
        jsBind: {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
            },

            back:
            {
                _layout: [[0.5, 0.5], [0.5, 0.5], [0, 0]],

                player0:
                {
                    _run: function () {
                        DelRoomAgree(this, 0);
                    },
                    _event: {
                        DelRoom: function () {
                            DelRoomAgree(this, 0);
                        }
                    }
                }, time: {
                    _run: function () {
                        DelRoomTime(this);
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
                        DelRoomAgree(this, 3);
                    },
                    _event: {
                        DelRoom: function () {
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

            _event:
            {
                endRoom: function ()
                {
                    jsclient.delroomui.removeFromParent(true);
                    delete jsclient.delroomui;
                },
                roundEnd: function ()
                {
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

            back:
            {
                _layout: [[0.5, 0.5], [0.5, 0.5], [0, 0]],

                tohome:
                {
                    _click: function ()
                    {
                        var msg = jsclient.endRoomMsg;
                        if (msg.reason >= 0)
                        {
                            jsclient.leaveGame();
                        }
                        endroomui.removeFromParent(true);
                    }
                },

                info:
                {
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

//判断显示不显示买马
function checkShowMa()
{
    var show = false;

    for(var i = 0; i < 4; i++)
    {
        var pl = getUIPlayer(i);
        if(jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0 )
        {
            show = true;
            break;
        }

    }

    return show;
}

//判断中马没有
function checkMjMa(off)
{

    var pl = null;
    for (var i = 0; i < 4; i++)
    {
        pl = getUIPlayer(i);
        if (jsclient.majiang.CardCount(pl) == 14 && pl.winType > 0)
        {
            break;
        }
    }

    if(pl == null)
        return false;

    var mjMa = pl.mjMa;
    var mj = pl.left4Ma[off];

    for(var i = 0; i<mjMa.length; i++)
    {
        if(pl.mjMa[i] == mj)
            return true
    }

    return false
}

//设置买马的牌
function setMjMa(node, off)
{
    var pl = getUIPlayer(0);
    var cd = pl.left4Ma[off];
    if(cd != null)
        setCardPic(node, cd);
}

//单次结算
var EndOneLayer = cc.Layer.extend(
{
    jsBind:
    {
        back:
        {
            _layout: [[0, 1], [0.5, 0.5], [0, 0]]
        },

        mjtips:
        {
            _layout: [[0.15, 0.15], [0.06, 0.6], [0, 0]],

            _visible: function ()
            {
                return checkShowMa()
            },

            mjtx0:
            {
                _visible:function ()
                {
                    return checkMjMa(0)
                }
            },
            mjtx1:
            {
                _visible:function ()
                {
                    return checkMjMa(1)
                }
            },
            mjtx2:
            {
                _visible:function ()
                {
                    return checkMjMa(2)
                }
            },
            mjtx3:
            {
                _visible:function ()
                {
                    return checkMjMa(3)
                }
            },

            mjbk1:
            {
                _run:function ()
                {
                    setMjMa(this, 0);
                }
            },

            mjbk2:
            {
                _run:function ()
                {
                    setMjMa(this, 1);
                }
            },

            mjbk3:
            {
                _run:function ()
                {
                    setMjMa(this, 2);
                }
            },

            mjbk4:
            {
                _run:function ()
                {
                    setMjMa(this, 3);
                }
            },

            mjzz1:
            {
                _visible:function ()
                {
                    return !checkMjMa(0);
                }
            },
            mjzz2:
            {
                _visible:function ()
                {
                    return !checkMjMa(1);
                }
            },
            mjzz3:
            {
                _visible:function ()
                {
                    return !checkMjMa(2);
                }
            },
            mjzz4:
            {
                _visible:function ()
                {
                    return !checkMjMa(3);
                }
            },

        },

        wintitle:
        {
            _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

            _visible: function ()
            {
                var pl = getUIPlayer(0);
                if (pl)
                    return pl.winone >= 1;

                return false;
            }
        },

        losetitle:
        {
            _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

            _visible: function ()
            {
                var pl = getUIPlayer(0);
                if (pl)
                    return pl.winone < 0;

                return false;
            }
        },

        pingju:
        {
            _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],

            _visible: function ()
            {
                var pl0 = getUIPlayer(0);
                var pl1 = getUIPlayer(1);
                var pl2 = getUIPlayer(2);
                var pl3 = getUIPlayer(3);

                if (pl0 && pl1 && pl2 && pl3)
                {
                    if (pl0.winone == 0 && pl1.winone == 0 && pl2.winone == 0 && pl3.winone == 0)
                    {
                        //如果都没赢，就荒了
                        return false;
                    }
                }

                if (pl0)
                    return pl0.winone == 0;

                return false;
            }
        },

        huang:
        {
            _layout: [[0.25, 0.25], [0.06, 0.9], [0, 0]],
            _visible: function ()
            {
                return false;
            },

            _run: function ()
            {
                var pl0 = getUIPlayer(0);
                var pl1 = getUIPlayer(1);
                var pl2 = getUIPlayer(2);
                var pl3 = getUIPlayer(3);

                if (pl0 && pl1 && pl2 && pl3)
                {
                    if (pl0.winone == 0 && pl1.winone == 0 && pl2.winone == 0 && pl3.winone == 0)
                    {
                        //如果都没赢，就荒了
                        this.setVisible(true);
                    }
                }
            }
        },

        share:
        {
            _layout: [[0.15, 0], [0.2, 0.07], [1, 0.5]],

            _click: function ()
            {
                sendEvent("capture_screen");
            },

            _event:
            {
                captureScreen_OK: function ()
                {
                    jsclient.native.wxShareImage();
                }
            }
        },

        ready:
        {
            _layout: [[0.15, 0], [0.5, 0.07], [1, 0.5]],

            _click: function (btn, eT)
            {
                sendEvent("clearCardUI");
                jsclient.endoneui.removeFromParent(true);
                jsclient.MJPass2Net();
            }
        },

        head0:
        {
            backbar: {_layout: [[0.85, 1], [0.55, 0.8], [0, 0]]},

            head:
            {
                _layout: [[0.12, 0.12], [0.2, 0.82], [0,0]],
                zhuang: {_visible: false}
            },

            winNum: {_layout: [[0.05, 0.05], [0.83, 0.8], [0,0]]},

            _run: function ()
            {
                SetEndOnePlayerUI(this, 0);
            }
        },

        head1:
        {
            backbar: {_layout: [[0.85, 1], [0.55, 0.62], [0, 0]]},

            head:
            {
                _layout: [[0.12, 0.12], [0.2, 0.64], [0,0]],
                zhuang: {_visible: false}
            },

            winNum: {_layout: [[0.05, 0.05], [0.83, 0.62], [0,0]]},

            _run: function ()
            {
                SetEndOnePlayerUI(this, 1);
            }
        },

        head2:
        {
            backbar: {_layout: [[0.85, 1], [0.55, 0.44], [0, 0]]},

            head:
            {
                _layout: [[0.12, 0.12], [0.2, 0.46], [0,0]],
                zhuang: {_visible: false}
            },

            winNum: {_layout: [[0.05, 0.05], [0.83, 0.44], [0,0]]},

            _run: function ()
            {
                SetEndOnePlayerUI(this, 2);
            }
        },

        head3:
        {
            backbar: {_layout: [[0.85, 1], [0.55, 0.26], [0, 0]]},

            head:
            {
                _layout: [[0.12, 0.12], [0.2, 0.28], [0,0]],
                zhuang: {_visible: false}
            },

            winNum: {_layout: [[0.05, 0.05], [0.83, 0.26], [0,0]]},

            _run: function ()
            {
                SetEndOnePlayerUI(this, 3);
            }
        }
    },
    ctor: function ()
    {
        this._super();
        var endoneui = ccs.load(res.EndOne_json);
        ConnectUI2Logic(endoneui.node, this.jsBind);
        this.addChild(endoneui.node);
        jsclient.endoneui = this;

        var sData = jsclient.data.sData;
        var tData = sData.tData;

        var selfUid = SelfUid();
        var zoff = (tData.zhuang + 4 - tData.uids.indexOf(selfUid)) % 4;
        var zhuang = this.jsBind["head" + zoff].head.zhuang._node;
        zhuang.visible = true;
        zhuang.zIndex = 10;

        //new
        //  var pl = sData.players[SelfUid() + ""];
        //测试
        //  for(var i=0;i<4;i++)
        //  {
        //      var pl = getUIPlayer(i);
        //      //console.log("==============================="+pl.mjMa.length);
        //      for(var j=0;j<pl.mjMa.length;j++){
        //          console.log("------------ma--------------"+j+"------"+pl.mjMa[j]);
        //      }
        //  }

        // pl.left4Ma

        return true;
    }
});


