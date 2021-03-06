//Jian
//2016年7月14日 17:13:28
//创建房间

//加载房间后台配置  json名：gamefree.json
function LoadCreateRoomCfg(remoteCfgName)
{
    var xhr = cc.loader.getXMLHttpRequest();
    xhr.open("GET", "http://sources4.happyplaygame.net:80/gdmj/" + remoteCfgName);
    xhr.onreadystatechange = function ()
    {
        if (xhr.readyState == 4 && xhr.status == 200)
        {
            var actData = JSON.parse(xhr.responseText);
            cc.log("免费玩法数据：" + JSON.stringify(actData));
            analysisActivityData(actData);
        }
        else
        {
            cc.log("请求免费玩法数据失败...请求免费玩法数据失败...请求免费玩法数据失败...");
        }
    };
    xhr.send();
}

//解析后台配置免费活动
function analysisActivityData(data)
{
    jsclient.freeGames = {};
    for(var key in data)
    {
        var actData = data[key];
        var gameTypes = actData["gameType"];
        var startTime = actData["gameStartTime"];
        var endTime = actData["gameEndTime"];

        var currentTime = new Date().toUTCString();
        var t1 = getTimeOff(startTime, currentTime);
        var t2 = getTimeOff(endTime, currentTime);
        var t3 = getTimeOff(startTime, endTime);

        //当前时间小于开始时间  ||  当前时间大于结束时间  || 结束时间小于开始时间
        if(t1 <= 0 || t2 >= 0 || t3 <= 0)
        {
            cc.log("当前时间小于开始时间  ||  当前时间大于结束时间  || 结束时间小于开始时间：");
            sendEvent("freeGameType", null);
            continue;
        }

        //免费的玩法
        for(var i = 0; i < gameTypes.length; i++)
        {
            jsclient.freeGames[gameTypes[i]] = gameTypes[i];
            sendEvent("freeGameType", gameTypes[i]);
        }
    }
}


//创建房间界面
(function () {

    var roomTipsPanel = null;
    var createui = null;
    var tables = [];
    var gamemjs = [];
    //0 没有，1广州，2惠州，3深圳，4鸡平胡
    tables[0] = null;
    gamemjs[0] = null;

    function setPanelContentByType(type)
    {
        // var gameType = type;

        for(var i = 1; i < tables.length; i++)
        {
            var gameTable = tables[i];
            var game = gamemjs[i];

            if(i == type)
            {
                gameTable.setBright(false);
                gameTable.setEnabled(false);
                gameTable.setTouchEnabled(false);
                gameTable.setVisible(true);

                game.setVisible(true);
            }
            else
            {
                gameTable.setBright(true);
                gameTable.setEnabled(true);
                gameTable.setTouchEnabled(true);
                gameTable.setVisible(true);

                game.setVisible(false);
            }
        }
    }
    
    //读取用户创建房间选项
    function readCreateRoomCfg()
    {
        var path = jsb.fileUtils.getWritablePath();
        var file =  jsb.fileUtils.getStringFromFile(path + "createRoom.json");
        log("创建房间cfg： " + file);
        if(file == null || file == "")
        {
            return null;
        }
        else
        {
            return file;
        }

    }

    //写入用户创建房间选项
    function writeCreateRoomCfg(data)
    {
        log("写入用户创建房间选项" + JSON.stringify(data));
        var path = jsb.fileUtils.getWritablePath();
        jsb.fileUtils.writeStringToFile(JSON.stringify(data), path + "createRoom.json");
    }
    
    //设置创建房间默认选项
    function setCreateRoomSelected(layer)
    {
        var fileData = readCreateRoomCfg();
        if (fileData == null)
            return;

        var roomCfg = JSON.parse(fileData);
        if (roomCfg == null)
            return;

        for(var gameType in roomCfg)
        {
            var game = roomCfg[gameType];
            log("创建房间游戏 gameType：" + gameType);
            for (var playType in game)
            {
                var cfgType = game[playType];
                log("创建房间选项 playType：" + playType);
                for (var playVal in cfgType)
                {
                    var cfgVal = cfgType[playVal];
                    var gamePlayNode = layer.jsBind.back[gameType];
                    if(gamePlayNode == null)
                        continue;

                    var gameTypeNode = gamePlayNode[playType];
                    if(gameTypeNode == null)
                        continue;

                    var cfgValNode = gameTypeNode._node.getChildByName(playVal);
                    if(cfgValNode == null)
                        continue;

                    if(cfgVal != 0 && !cfgValNode.isSelected())
                    {
                        log("创建房间值 playVal：" + playVal);

                        //去掉16局的临时写法
                        if(playVal == "round16")
                            playVal  = "round4";

                        layer.jsBind.back[gameType][playType][playVal]._node.setSelected(true);
                        layer.jsBind.back[gameType][playType][playVal]._click();
                        // cfgValNode.setSelected(true);
                        // cfgValNode._click();
                    }
                }
            }
        }
    }

    var text = null;
    CreateLayer = cc.Layer.extend(
    {
        jsBind:
        {
            //背景
            block:
            {
                _layout: [[0, 1], [0.5, 0.5], [0, 0]],
            },

            //内容
            back:
            {
                _layout: [[1, 0], [0.5, 0.5], [0, 0],true],

                close:
                {
                    _click: function ()
                    {
                        // createui.removeFromParent(true);
                        createui.visible = false;
                    }
                },

                TableScrollView:
                {
                    gdmjtable:
                    {
                        _run: function ()
                        {
                            tables[1] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(1);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    hzhmjtable:
                    {
                        _run: function ()
                        {
                            tables[2] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(2);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    shzhmjtable:
                    {
                        _run: function ()
                        {
                            tables[3] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(3);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    jphmjtable:
                    {
                        _run: function ()
                        {
                            tables[4] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(4);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["4"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    dgmjtable:
                    {
                        _run: function ()
                        {
                            tables[5] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(5);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["5"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    ybzhmjtable:
                    {
                        _run: function ()
                        {
                            tables[6] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(6);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["6"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    bdhmjtable:
                    {
                        _run: function ()
                        {
                            tables[7] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(7);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["7"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    chshmjtable:
                    {
                        _run: function ()
                        {
                            tables[8] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(8);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["8"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    xgmjtable:
                    {
                        _run: function ()
                        {
                            tables[9] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(9);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["9"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },

                    zptdhmjtable:
                    {
                        _run: function ()
                        {
                            tables[10] = this;
                            this.visible = false;
                        },

                        _click: function ()
                        {
                            setPanelContentByType(10);
                        },

                        mianfei:
                        {
                            _event:
                            {
                                freeGameType:function(roomCfg)
                                {
                                    if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                        this.visible = true;
                                    else
                                        this.visible = false;
                                },
                            }
                        }
                    },
                },

                gdmj:
                {
                    //局数
                    self1Round4: null,
                    self1Round8: null,
                    // self1Round16: null,

                    //鬼牌
                    self1Nozhong: null,
                    self1Zhong: null,
                    self1BaiBan: null,
                    self1FanGui:null,
                    self1ShuangGui:null,

                    //玩法
                    self1Nofeng: null,
                    self1Feng: null,
                    self1NoGuiHu:null,
                    self1NoGuiBei:null,
                    self1NoGuiMa:null,
                    self1CanHu7: null,
                    // self1CanFan7:null,
                    self1GenZhuang:null,
                    self1JJG:null,
                    self1ZhongIsMa:null,

                    //牌型
                    self1hdh2b:null,
                    self1gbqb:null,
                    self1gb2b:null,
                    self1hzhsg:null,

                    //人数
                    self1Srmj:null,

                    //买马
                    self1Ma2: null,
                    self1Ma4: null,
                    self1Ma6: null,
                    self1Ma8: null,
                    self1Ma10: null,
                    self1MaBom: null,

                    self1OK:null,

                    _run: function ()
                    {
                        gamemjs[1] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self1Nozhong = this;
                            },

                            _click: function ()
                            {
                                // self1Nozhong.setSelected(true);
                                self1Nozhong.setTouchEnabled(false);
                                text = self1Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Zhong.setSelected(false);
                                self1Zhong.setTouchEnabled(true);
                                text = self1Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1BaiBan.setSelected(false);
                                self1BaiBan.setTouchEnabled(true);
                                text = self1BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1FanGui.setSelected(false);
                                self1FanGui.setTouchEnabled(true);
                                text = self1FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1ShuangGui.setSelected(false);
                                self1ShuangGui.setTouchEnabled(true);
                                text = self1ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                self1NoGuiHu.setSelected(false);
                                self1NoGuiHu.setTouchEnabled(true);
                                text = self1NoGuiHu.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1NoGuiBei.setSelected(false);
                                self1NoGuiBei.setTouchEnabled(true);
                                text = self1NoGuiBei.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1NoGuiMa.setSelected(false);
                                self1NoGuiMa.setTouchEnabled(true);
                                text = self1NoGuiMa.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            },
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self1Zhong = this;
                            },

                            _click: function ()
                            {
                                self1Nozhong.setSelected(false);
                                self1Nozhong.setTouchEnabled(true);
                                text = self1Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));


                                // self1Zhong.setSelected(true);
                                self1Zhong.setTouchEnabled(false);
                                text = self1Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1BaiBan.setSelected(false);
                                self1BaiBan.setTouchEnabled(true);
                                text = self1BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1FanGui.setSelected(false);
                                self1FanGui.setTouchEnabled(true);
                                text = self1FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1ShuangGui.setSelected(false);
                                self1ShuangGui.setTouchEnabled(true);
                                text = self1ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1ZhongIsMa.setSelected(false);
                                text = self1ZhongIsMa.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self1NoGuiHu.setSelected(true);
                                // self1NoGuiHu.setTouchEnabled(false);
                                // text = self1NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self1NoGuiBei.setSelected(false);
                                // self1NoGuiBei.setTouchEnabled(true);
                                // text = self1NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self1NoGuiMa.setSelected(false);
                                // self1NoGuiMa.setTouchEnabled(true);
                                // text = self1NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        baiban:
                        {
                            _run: function ()
                            {
                                self1BaiBan = this;
                            },

                            _click: function ()
                            {
                                self1Nozhong.setSelected(false);
                                self1Nozhong.setTouchEnabled(true);
                                text = self1Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Zhong.setSelected(false);
                                self1Zhong.setTouchEnabled(true);
                                text = self1Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1BaiBan.setSelected(true);
                                self1BaiBan.setTouchEnabled(false);
                                text = self1BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1FanGui.setSelected(false);
                                self1FanGui.setTouchEnabled(true);
                                text = self1FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1ShuangGui.setSelected(false);
                                self1ShuangGui.setTouchEnabled(true);
                                text = self1ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self1NoGuiHu.setSelected(true);
                                // self1NoGuiHu.setTouchEnabled(false);
                                // text = self1NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self1NoGuiBei.setSelected(false);
                                // self1NoGuiBei.setTouchEnabled(true);
                                // text = self1NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self1NoGuiMa.setSelected(false);
                                // self1NoGuiMa.setTouchEnabled(true);
                                // text = self1NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self1FanGui = this;
                            },

                            _click: function ()
                            {
                                self1Nozhong.setSelected(false);
                                self1Nozhong.setTouchEnabled(true);
                                text = self1Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Zhong.setSelected(false);
                                self1Zhong.setTouchEnabled(true);
                                text = self1Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1BaiBan.setSelected(false);
                                self1BaiBan.setTouchEnabled(true);
                                text = self1BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1FanGui.setSelected(true);
                                self1FanGui.setTouchEnabled(false);
                                text = self1FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1ShuangGui.setSelected(false);
                                self1ShuangGui.setTouchEnabled(true);
                                text = self1ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self1NoGuiHu.setSelected(true);
                                // self1NoGuiHu.setTouchEnabled(false);
                                // text = self1NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self1NoGuiBei.setSelected(false);
                                // self1NoGuiBei.setTouchEnabled(true);
                                // text = self1NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self1NoGuiMa.setSelected(false);
                                // self1NoGuiMa.setTouchEnabled(true);
                                // text = self1NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        shuanggui:
                        {
                            _run: function ()
                            {
                                self1ShuangGui = this;
                            },

                            _click: function ()
                            {
                                text = self1ShuangGui.getChildByName("Text_1");
                                if(self1ShuangGui.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                if(self1FanGui.isSelected() == false)
                                {

                                    self1Nozhong.setSelected(false);
                                    self1Nozhong.setTouchEnabled(true);
                                    text = self1Nozhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1Zhong.setSelected(false);
                                    self1Zhong.setTouchEnabled(true);
                                    text = self1Zhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1BaiBan.setSelected(false);
                                    self1BaiBan.setTouchEnabled(true);
                                    text = self1BaiBan.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1FanGui.setSelected(true);
                                    self1FanGui.setTouchEnabled(false);
                                    text = self1FanGui.getChildByName("Text_1");
                                    text.setTextColor(cc.color(242,61,5));

                                    //无鬼胡
                                    // self1NoGuiHu.setSelected(true);
                                    // self1NoGuiHu.setTouchEnabled(false);
                                    // text = self1NoGuiHu.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(242,61,5));
                                    //
                                    // self1NoGuiBei.setSelected(false);
                                    // self1NoGuiBei.setTouchEnabled(true);
                                    // text = self1NoGuiBei.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(108,37,20));
                                    //
                                    // self1NoGuiMa.setSelected(false);
                                    // self1NoGuiMa.setTouchEnabled(true);
                                    // text = self1NoGuiMa.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self1Nofeng = this;
                            },

                            _click: function ()
                            {
                                self1Feng.setSelected(false);
                                self1Feng.setTouchEnabled(true);
                                text = self1Feng.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Nofeng.setSelected(true);
                                self1Nofeng.setTouchEnabled(false);
                                text = self1Nofeng.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self1Feng = this;
                            },

                            _click: function ()
                            {
                                // self1Feng.setSelected(true);
                                self1Feng.setTouchEnabled(false);
                                text = self1Feng.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));


                                self1Nofeng.setSelected(false);
                                self1Nofeng.setTouchEnabled(true);
                                text = self1Nofeng.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        noguihu:
                        {
                            _run: function ()
                            {
                                self1NoGuiHu = this;
                            },

                            _click: function ()
                            {
                                text = self1NoGuiHu.getChildByName("Text_1");
                                if(self1NoGuiHu.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self1Nozhong.isSelected())
                                    {
                                        self1Nozhong.setSelected(false);
                                        self1Nozhong.setTouchEnabled(true);
                                        text = self1Nozhong.getChildByName("Text_1");
                                        text.setTextColor(cc.color(108,37,20));

                                        self1Zhong.setSelected(true);
                                        self1Zhong.setTouchEnabled(false);
                                        text = self1Zhong.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));

                                        self1ZhongIsMa.setSelected(false);
                                        self1ZhongIsMa.setTouchEnabled(true);
                                        text = self1ZhongIsMa.getChildByName("Text_1");
                                        text.setTextColor(cc.color(108,37,20));
                                    }

                                    if(!self1NoGuiMa.isSelected() && !self1NoGuiBei.isSelected())
                                    {
                                        self1NoGuiMa.setSelected(true);
                                        // self1NoGuiMa.setTouchEnabled(false);
                                        text = self1NoGuiMa.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    self1NoGuiBei.setSelected(false);
                                    self1NoGuiBei.setTouchEnabled(true);
                                    text = self1NoGuiBei.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1NoGuiMa.setSelected(false);
                                    self1NoGuiMa.setTouchEnabled(true);
                                    text = self1NoGuiMa.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        noguibei:
                        {
                            _run: function ()
                            {
                                self1NoGuiBei = this;
                            },

                            _click: function ()
                            {
                                text = self1NoGuiBei.getChildByName("Text_1");
                                if(self1NoGuiBei.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self1NoGuiHu.isSelected() == false)
                                    {
                                        self1NoGuiHu.setSelected(true);
                                        // self1NoGuiHu.setTouchEnabled(false);
                                        text = self1NoGuiHu.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));

                                        if(self1Nozhong.isSelected())
                                        {
                                            self1Nozhong.setSelected(false);
                                            self1Nozhong.setTouchEnabled(true);
                                            text = self1Nozhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));

                                            self1Zhong.setSelected(true);
                                            self1Zhong.setTouchEnabled(false);
                                            text = self1Zhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(242,61,5));

                                            self1ZhongIsMa.setSelected(false);
                                            self1ZhongIsMa.setTouchEnabled(true);
                                            text = self1ZhongIsMa.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));
                                        }
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    if(!self1NoGuiMa.isSelected())
                                    {
                                        self1NoGuiMa.setSelected(true);
                                        // self1NoGuiMa.setTouchEnabled(false);
                                        text = self1NoGuiMa.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                            }
                        },

                        noguima:
                        {
                            _run: function ()
                            {
                                self1NoGuiMa = this;
                            },

                            _click: function ()
                            {
                                text = self1NoGuiMa.getChildByName("Text_1");
                                if(self1NoGuiMa.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self1NoGuiHu.isSelected() == false)
                                    {
                                        self1NoGuiHu.setSelected(true);
                                        // self1NoGuiHu.setTouchEnabled(false);
                                        text = self1NoGuiHu.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));

                                        if(self1Nozhong.isSelected())
                                        {
                                            self1Nozhong.setSelected(false);
                                            // self1Nozhong.setTouchEnabled(true);
                                            text = self1Nozhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));

                                            self1Zhong.setSelected(true);
                                            self1Zhong.setTouchEnabled(false);
                                            text = self1Zhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(242,61,5));

                                            self1ZhongIsMa.setSelected(false);
                                            self1ZhongIsMa.setTouchEnabled(true);
                                            text = self1ZhongIsMa.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));
                                        }
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    if(!self1NoGuiBei.isSelected())
                                    {
                                        self1NoGuiBei.setSelected(true);
                                        // self1NoGuiBei.setTouchEnabled(false);
                                        text = self1NoGuiBei.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                            }
                        },

                        canHu7:
                        {
                            _run: function ()
                            {
                                self1CanHu7 = this;
                            },

                            _click:function()
                            {
                                text = self1CanHu7.getChildByName("Text_1");
                                if(self1CanHu7.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                // if(self1CanFan7.isSelected())
                                // {
                                //     self1CanFan7.setSelected(false);
                                //     text = self1CanFan7.getChildByName("Text_1");
                                //     text.setTextColor(cc.color(108,37,20));
                                // }
                            }
                        },

                        // canFan7:
                        // {
                        //     _run: function ()
                        //     {
                        //         self1CanFan7 = this;
                        //     },
                        //
                        //     _click:function()
                        //     {
                        //         text = self1CanFan7.getChildByName("Text_1");
                        //         if(self1CanFan7.isSelected())
                        //         {
                        //             text.setTextColor(cc.color(242,61,5));
                        //         }
                        //         else
                        //         {
                        //             text.setTextColor(cc.color(108,37,20));
                        //         }
                        //
                        //         if(!self1CanHu7.isSelected())
                        //         {
                        //             self1CanHu7.setSelected(true);
                        //             text = self1CanHu7.getChildByName("Text_1");
                        //             text.setTextColor(cc.color(242,61,5));
                        //         }
                        //     }
                        // },

                        genzhuang:
                        {
                            _run: function ()
                            {
                                self1GenZhuang = this;
                            },

                            _click:function()
                            {
                                text = self1GenZhuang.getChildByName("Text_1");
                                if(self1GenZhuang.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        jjg:
                        {
                            _run: function ()
                            {
                                self1JJG = this;
                            },

                            _click:function()
                            {
                                text = self1JJG.getChildByName("Text_1");
                                if(self1JJG.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                if(self1MaBom.isSelected())
                                {
                                    self1MaBom.setSelected(false);
                                    self1MaBom.setTouchEnabled(true);
                                    text = self1MaBom.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1Ma2.setSelected(true);
                                    self1Ma2.setTouchEnabled(false);
                                    text = self1Ma2.getChildByName("Text_1");
                                    text.setTextColor(cc.color(242,61,5));
                                }
                            }
                        },

                        zhongisma:
                        {
                            _run: function ()
                            {
                                self1ZhongIsMa = this;
                            },

                            _click:function()
                            {
                                text = self1ZhongIsMa.getChildByName("Text_1");
                                if(self1ZhongIsMa.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                if(self1Zhong.isSelected())
                                {
                                    self1Nozhong.setSelected(true);
                                    self1Nozhong.setTouchEnabled(false);
                                    text = self1Nozhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(242,61,5));

                                    self1Zhong.setSelected(false);
                                    self1Zhong.setTouchEnabled(true);
                                    text = self1Zhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    //无鬼胡
                                    self1NoGuiHu.setSelected(false);
                                    self1NoGuiHu.setTouchEnabled(true);
                                    text = self1NoGuiHu.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1NoGuiBei.setSelected(false);
                                    self1NoGuiBei.setTouchEnabled(true);
                                    text = self1NoGuiBei.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self1NoGuiMa.setSelected(false);
                                    self1NoGuiMa.setTouchEnabled(true);
                                    text = self1NoGuiMa.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        //牌型
                        hdh2b:
                        {
                            _run: function ()
                            {
                                self1hdh2b = this;
                            },

                            _click:function()
                            {
                                text = self1hdh2b.getChildByName("Text_1");
                                if(self1hdh2b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        gbqb:
                        {
                            _run: function ()
                            {
                                self1gbqb = this;
                            },

                            _click:function()
                            {
                                text = self1gbqb.getChildByName("Text_1");
                                if(self1gbqb.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        gb2b:
                        {
                            _run: function ()
                            {
                                self1gb2b = this;
                            },

                            _click:function()
                            {
                                text = self1gb2b.getChildByName("Text_1");
                                if(self1gb2b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        hzhsg:
                        {
                            _run: function ()
                            {
                                self1hzhsg = this;
                            },

                            _click:function()
                            {
                                text = self1hzhsg.getChildByName("Text_1");
                                if(self1hzhsg.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },
                    },

                    renshu:
                    {
                        srmj:
                        {
                            _run: function ()
                            {
                                self1Srmj = this;
                            },

                            _click:function()
                            {
                                text = self1Srmj.getChildByName("Text_1");
                                if(self1Srmj.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        }
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self1Ma2 = this;
                            },
                            _click: function ()
                            {
                                // self1Ma2.setSelected(true);
                                self1Ma2.setTouchEnabled(false);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Ma4.setSelected(false);
                                self1Ma4.setTouchEnabled(true);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma6.setSelected(false);
                                self1Ma6.setTouchEnabled(true);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma8.setSelected(false);
                                self1Ma8.setTouchEnabled(true);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma10.setSelected(false);
                                self1Ma10.setTouchEnabled(true);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1MaBom.setSelected(false);
                                self1MaBom.setTouchEnabled(true);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self1Ma4 = this;
                            },

                            _click: function ()
                            {
                                self1Ma2.setSelected(false);
                                self1Ma2.setTouchEnabled(true);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Ma4.setSelected(true);
                                self1Ma4.setTouchEnabled(false);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Ma6.setSelected(false);
                                self1Ma6.setTouchEnabled(true);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma8.setSelected(false);
                                self1Ma8.setTouchEnabled(true);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma10.setSelected(false);
                                self1Ma10.setTouchEnabled(true);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1MaBom.setSelected(false);
                                self1MaBom.setTouchEnabled(true);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self1Ma6 = this;
                            },

                            _click: function ()
                            {
                                self1Ma2.setSelected(false);
                                self1Ma2.setTouchEnabled(true);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma4.setSelected(false);
                                self1Ma4.setTouchEnabled(true);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Ma6.setSelected(true);
                                self1Ma6.setTouchEnabled(false);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Ma8.setSelected(false);
                                self1Ma8.setTouchEnabled(true);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma10.setSelected(false);
                                self1Ma10.setTouchEnabled(true);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1MaBom.setSelected(false);
                                self1MaBom.setTouchEnabled(true);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma8:
                        {
                            _run: function ()
                            {
                                self1Ma8 = this;
                            },

                            _click: function ()
                            {
                                self1Ma2.setSelected(false);
                                self1Ma2.setTouchEnabled(true);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma4.setSelected(false);
                                self1Ma4.setTouchEnabled(true);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma6.setSelected(false);
                                self1Ma6.setTouchEnabled(true);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Ma8.setSelected(true);
                                self1Ma8.setTouchEnabled(false);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Ma10.setSelected(false);
                                self1Ma10.setTouchEnabled(true);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1MaBom.setSelected(false);
                                self1MaBom.setTouchEnabled(true);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma10:
                        {
                            _run: function ()
                            {
                                self1Ma10 = this;
                            },

                            _click: function ()
                            {
                                self1Ma2.setSelected(false);
                                self1Ma2.setTouchEnabled(true);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma4.setSelected(false);
                                self1Ma4.setTouchEnabled(true);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma6.setSelected(false);
                                self1Ma6.setTouchEnabled(true);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma8.setSelected(false);
                                self1Ma8.setTouchEnabled(true);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Ma10.setSelected(true);
                                self1Ma10.setTouchEnabled(false);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1MaBom.setSelected(false);
                                self1MaBom.setTouchEnabled(true);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        mabaozha:
                        {

                            _run:function ()
                            {
                                self1MaBom = this;
                            },

                            _click: function ()
                            {
                                self1Ma2.setSelected(false);
                                self1Ma2.setTouchEnabled(true);
                                text = self1Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma4.setSelected(false);
                                self1Ma4.setTouchEnabled(true);
                                text = self1Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma6.setSelected(false);
                                self1Ma6.setTouchEnabled(true);
                                text = self1Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma8.setSelected(false);
                                self1Ma8.setTouchEnabled(true);
                                text = self1Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self1Ma10.setSelected(false);
                                self1Ma10.setTouchEnabled(true);
                                text = self1Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1MaBom.setSelected(true);
                                self1MaBom.setTouchEnabled(false);
                                text = self1MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1JJG.setSelected(false);
                                self1JJG.setTouchEnabled(true);
                                text = self1JJG.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        }
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self1Round4 = this;
                            },

                            _click: function ()
                            {
                                // self1Round4.setSelected(true);
                                self1Round4.setTouchEnabled(false);
                                text = self1Round4.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self1Round8.setSelected(false);
                                self1Round8.setTouchEnabled(true);
                                text = self1Round8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Round16.setSelected(false);
                                // self1Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                                    return;

                                self1OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self1OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self1Round8 = this;
                            },

                            _click: function ()
                            {
                                self1Round4.setSelected(false);
                                self1Round4.setTouchEnabled(true);
                                text = self1Round4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self1Round8.setSelected(true);
                                self1Round8.setTouchEnabled(false);
                                text = self1Round8.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                // self1Round16.setSelected(false);
                                // self1Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                                    return;

                                self1OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self1OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        },

                        // round16:
                        // {
                        //     _run: function ()
                        //     {
                        //         self1Round16 = this;
                        //     },
                        //
                        //     _click: function ()
                        //     {
                        //         self1Round4.setSelected(false);
                        //         self1Round4.setTouchEnabled(true);
                        //         self1Round8.setSelected(false);
                        //         self1Round8.setTouchEnabled(true);
                        //         self1Round16.setSelected(true);
                        //         self1Round16.setTouchEnabled(false);
                        //
                        //         if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                        //             return;
                        //
                        //         self1OK.loadTextureNormal("res/createRoomNew/queding_5.png");
                        //         self1OK.loadTexturePressed("res/createRoomNew/queding_5_press.png");
                        //     }
                        // },
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self1OK = this;
                        },

                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var haveMoney = jsclient.data.pinfo.money;

                            var isRound = "round4";
                            if(self1Round4.isSelected())
                                isRound = "round4";
                            else if(self1Round8.isSelected())
                                isRound = "round8";
                            // else if(self1Round16.isSelected())
                            //     isRound = "round16";

                            var needMoney = majiang.round4;
                            if(self1Round4.isSelected())
                                needMoney = majiang.round4;
                            else if(self1Round8.isSelected())
                                needMoney = majiang.round8;
                            // else if(self1Round16.isSelected())
                            //     needMoney = majiang.round16;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self1Ma2.isSelected())
                                horse = 2;
                            else if (self1Ma4.isSelected())
                                horse = 4;
                            else if (self1Ma6.isSelected())
                                horse = 6;
                            else if (self1Ma8.isSelected())
                                horse = 8;
                            else if (self1Ma10.isSelected())
                                horse = 10;
                            else if(self1MaBom.isSelected())
                                horse = 1;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    1,                        //游戏类型
                                    isRound,                  //4局或8局
                                    false,                     //吃胡
                                    self1Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    self1CanHu7.isSelected(),   //7
                                    false,                    //7对加番
                                    false,                     //258
                                    self1Zhong.isSelected(),    //红中鬼牌
                                    self1ZhongIsMa.isSelected(),//红中为马
                                    horse,                     //几匹马
                                    self1MaBom.isSelected(),   //爆炸马
                                    self1JJG.isSelected(),     //节节高
                                    self1FanGui.isSelected(),   //翻鬼
                                    self1ShuangGui.isSelected(),//双鬼
                                    0,                          //番
                                    self1Srmj.isSelected() ? 3 : 4,//人数
                                    false,                       //大胡
                                    self1NoGuiMa.isSelected(),   //无鬼加码
                                    self1NoGuiBei.isSelected(),   //无鬼翻倍
                                    true,                         //4鬼胡牌
                                    1,                            //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                        //可鸡胡
                                    false,                        //马跟底
                                    false,                        //马跟底对对胡
                                    false,                        //门清加分
                                    false,                        //百搭鸡胡
                                    false,                        //百搭大胡
                                    false,                        //海底翻倍(潮汕)
                                    false,                        //可点炮(潮汕)

                                    self1BaiBan.isSelected(),      //白板鬼牌
                                    self1GenZhuang.isSelected(),    //跟庄
                                    self1hzhsg.isSelected(),        //荒庄算杠
                                    self1gbqb.isSelected(),         //杠爆全包

                                    self1gb2b.isSelected() ? 2 : 0,         //杠爆2倍
                                    self1hdh2b.isSelected() ? 2 : 0,        //海底胡2倍
                                    0,                          //碰碰胡翻倍
                                    0,                          //清一色倍
                                    0,                         //十三幺倍
                                    0,                          //幺九倍
                                    0,                           //字一色倍
                                    0                             //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                gdmj:
                                {
                                    playType:
                                    {
                                        nozhong: self1Nozhong.isSelected() ? 1:0,
                                        zhong: self1Zhong.isSelected() ? 1:0,
                                        baiban: self1BaiBan.isSelected() ? 1:0,
                                        fangui:self1FanGui.isSelected() ? 1:0,
                                        shuanggui:self1ShuangGui.isSelected() ? 1:0,
                                        nofeng: self1Nofeng.isSelected() ? 1:0,
                                        feng: self1Feng.isSelected() ? 1:0,
                                        canHu7: self1CanHu7.isSelected() ? 1:0,
                                        // canFan7:self1CanFan7.isSelected() ? 1:0,
                                        jjg:self1JJG.isSelected() ? 1:0,
                                        genzhuang:self1GenZhuang.isSelected() ? 1:0,
                                        zhongisma:self1ZhongIsMa.isSelected() ? 1:0,
                                        hzhsg:self1hzhsg.isSelected() ? 1:0,
                                        gb2b:self1gb2b.isSelected() ? 1:0,
                                        gbqb:self1gbqb.isSelected() ? 1:0,
                                        hdh2b:self1hdh2b.isSelected() ? 1:0,
                                        noguihu:self1NoGuiHu.isSelected() ? 1:0,
                                        noguibei:self1NoGuiBei.isSelected() ? 1:0,
                                        noguima:self1NoGuiMa.isSelected() ? 1:0,
                                    },

                                    renshu:
                                    {
                                        srmj:self1Srmj.isSelected() ? 1:0
                                    },

                                    horse:
                                    {
                                        mabaozha: self1MaBom.isSelected() ? 1:0,
                                        ma2: self1Ma2.isSelected() ? 1:0,
                                        ma4: self1Ma4.isSelected() ? 1:0,
                                        ma6: self1Ma6.isSelected() ? 1:0,
                                        ma8: self1Ma8.isSelected() ? 1:0,
                                        ma10: self1Ma10.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self1Round4.isSelected() ? 1:0,
                                        round8: self1Round8.isSelected() ? 1:0,
                                        // round16: self1Round16.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["1"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                hzhmj:
                {
                    self2Nofeng: null,
                    self2Feng: null,
                    self2CanHu7: null,
                    self2NoJiHu:null,
                    self2MaDiFen:null,
                    self2DuiDuiHu:null,
                    self2MenQing:null,
                    self2Srmj:null,
                    self2Ma2: null,
                    self2Ma4: null,
                    self2Ma6: null,
                    self2Ma8: null,
                    self2Ma10: null,
                    self2Round4: null,
                    self2Round8: null,
                    self2Round16: null,
                    self2OK:null,

                    _run: function ()
                    {
                        gamemjs[2] = this;
                    },

                    playType:
                    {
                        nofeng:
                        {
                            _run: function ()
                            {
                                self2Nofeng = this;
                            },

                            _click: function ()
                            {
                                self2Feng.setSelected(false);
                                self2Feng.setTouchEnabled(true);
                                self2Nofeng.setSelected(true);
                                self2Nofeng.setTouchEnabled(false);
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self2Feng = this;
                            },

                            _click: function ()
                            {
                                self2Feng.setSelected(true);
                                self2Feng.setTouchEnabled(false);
                                self2Nofeng.setSelected(false);
                                self2Nofeng.setTouchEnabled(true);
                            }
                        },

                        canHu7:
                        {
                            _run: function ()
                            {
                                self2CanHu7 = this;
                            },

                            _click:function(sender, type)
                            {
                                //     switch (type)
                                //     {
                                //         case ccui.CheckBox.EVENT_SELECTED:
                                //             canHu7 = false;
                                //             break;
                                //         case ccui.CheckBox.EVENT_UNSELECTED:
                                //             canHu7 = true;
                                //             break;
                                //     }
                            }
                        },

                        nojihu:
                        {
                            _run: function ()
                            {
                                self2NoJiHu = this;
                            },

                            _click: function ()
                            {
                            }
                        },

                        difenma:
                        {
                            _run: function ()
                            {
                                self2MaDiFen = this;
                            },

                            _click: function ()
                            {

                                if(self2DuiDuiHu.isSelected())
                                    self2DuiDuiHu.setSelected(false);
                            }
                        },

                        duiduihu:
                        {
                            _run: function ()
                            {
                                self2DuiDuiHu = this;
                            },

                            _click: function ()
                            {

                                if(!self2MaDiFen.isSelected())
                                {
                                    self2MaDiFen.setSelected(true);
                                }
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self2DuiDuiHu.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 30;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。跟至对对胡：跟的底分最多9分。公式：底分+花+[（对对胡+花）×马]。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },

                        menqing:
                        {

                            _run: function ()
                            {
                                self2MenQing = this;
                            },

                            _click: function ()
                            {
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self2Ma2 = this;
                            },
                            _click: function ()
                            {
                                self2Ma2.setSelected(true);
                                self2Ma2.setTouchEnabled(false);
                                self2Ma4.setSelected(false);
                                self2Ma4.setTouchEnabled(true);
                                self2Ma6.setSelected(false);
                                self2Ma6.setTouchEnabled(true);
                                self2Ma8.setSelected(false);
                                self2Ma8.setTouchEnabled(true);
                                self2Ma10.setSelected(false);
                                self2Ma10.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self2Ma4 = this;
                            },
                            _click: function ()
                            {
                                self2Ma2.setSelected(false);
                                self2Ma2.setTouchEnabled(true);
                                self2Ma4.setSelected(true);
                                self2Ma4.setTouchEnabled(false);
                                self2Ma6.setSelected(false);
                                self2Ma6.setTouchEnabled(true);
                                self2Ma8.setSelected(false);
                                self2Ma8.setTouchEnabled(true);
                                self2Ma10.setSelected(false);
                                self2Ma10.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self2Ma6 = this;
                            },
                            _click: function ()
                            {
                                self2Ma2.setSelected(false);
                                self2Ma2.setTouchEnabled(true);
                                self2Ma4.setSelected(false);
                                self2Ma4.setTouchEnabled(true);
                                self2Ma6.setSelected(true);
                                self2Ma6.setTouchEnabled(false);
                                self2Ma8.setSelected(false);
                                self2Ma8.setTouchEnabled(true);
                                self2Ma10.setSelected(false);
                                self2Ma10.setTouchEnabled(true);
                            }
                        },

                        ma8:
                        {
                            _run: function ()
                            {
                                self2Ma8 = this;
                            },
                            _click: function ()
                            {
                                self2Ma2.setSelected(false);
                                self2Ma2.setTouchEnabled(true);
                                self2Ma4.setSelected(false);
                                self2Ma4.setTouchEnabled(true);
                                self2Ma6.setSelected(false);
                                self2Ma6.setTouchEnabled(true);
                                self2Ma8.setSelected(true);
                                self2Ma8.setTouchEnabled(false);
                                self2Ma10.setSelected(false);
                                self2Ma10.setTouchEnabled(true);
                            }
                        },

                        ma10:
                        {
                            _run: function ()
                            {
                                self2Ma10 = this;
                            },
                            _click: function ()
                            {
                                self2Ma2.setSelected(false);
                                self2Ma2.setTouchEnabled(true);
                                self2Ma4.setSelected(false);
                                self2Ma4.setTouchEnabled(true);
                                self2Ma6.setSelected(false);
                                self2Ma6.setTouchEnabled(true);
                                self2Ma8.setSelected(false);
                                self2Ma8.setTouchEnabled(true);
                                self2Ma10.setSelected(true);
                                self2Ma10.setTouchEnabled(false);
                            }
                        },

                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self2Round4 = this;
                            },

                            _click: function ()
                            {
                                self2Round4.setSelected(true);
                                self2Round4.setTouchEnabled(false);
                                self2Round8.setSelected(false);
                                self2Round8.setTouchEnabled(true);
                                self2Round16.setSelected(false);
                                self2Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                    return;

                                self2OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self2OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self2Round8 = this;
                            },
                            _click: function ()
                            {
                                self2Round4.setSelected(false);
                                self2Round4.setTouchEnabled(true);
                                self2Round8.setSelected(true);
                                self2Round8.setTouchEnabled(false);
                                self2Round16.setSelected(false);
                                self2Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                    return;

                                self2OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self2OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        },

                        round16:
                        {
                            _run: function ()
                            {
                                self2Round16 = this;
                            },
                            _click: function ()
                            {
                                self2Round4.setSelected(false);
                                self2Round4.setTouchEnabled(true);
                                self2Round8.setSelected(false);
                                self2Round8.setTouchEnabled(true);
                                self2Round16.setSelected(true);
                                self2Round16.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                    return;

                                self2OK.loadTextureNormal("res/createRoomNew/queding_5.png");
                                self2OK.loadTexturePressed("res/createRoomNew/queding_5_press.png");
                            }
                        }
                    },

                    renshu:
                    {
                        srmj:
                        {
                            _run: function ()
                            {
                                self2Srmj = this;
                            },

                            _click:function()
                            {
                                // text = self2Srmj.getChildByName("Text_1");
                                // if(self2Srmj.isSelected())
                                // {
                                //     text.setTextColor(cc.color(242,61,5));
                                // }
                                // else
                                // {
                                //     text.setTextColor(cc.color(108,37,20));
                                // }
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self2OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var haveMoney = jsclient.data.pinfo.money;

                            var isRound = "round4";
                            if(self2Round4.isSelected())
                                isRound = "round4";
                            else if(self2Round8.isSelected())
                                isRound = "round8";
                            else if(self2Round16.isSelected())
                                isRound = "round16";

                            var needMoney = majiang.round4;
                            if(self2Round4.isSelected())
                                needMoney = majiang.round4;
                            else if(self2Round8.isSelected())
                                needMoney = majiang.round8;
                            else if(self2Round16.isSelected())
                                needMoney = majiang.round16;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self2Ma2.isSelected())
                                horse = 2;
                            else if (self2Ma4.isSelected())
                                horse = 4;
                            else if (self2Ma6.isSelected())
                                horse = 6;
                            else if (self2Ma8.isSelected())
                                horse = 8;
                            else if (self2Ma10.isSelected())
                                horse = 10;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    2,                        //游戏类型
                                    isRound,                    //4局或8局
                                    false,                     //吃胡
                                    self2Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    self2CanHu7.isSelected(),  //7
                                    false,                      //7加番
                                    false,                     //258
                                    false,                     //中为鬼牌
                                    false,                      //中为马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    false,                      //节节高
                                    false,                       //翻鬼
                                    false,                      //双鬼
                                    0,                           //番
                                    self2Srmj.isSelected() ? 3 : 4,//人数
                                    false,                       //大胡
                                    true,                        //无鬼加码
                                    false,                        //无鬼翻倍
                                    true,                         //4鬼胡牌
                                    1,                             //4鬼加倍
                                    self2NoJiHu.isSelected(),     //不可鸡胡
                                    false,                      //可鸡胡
                                    self2MaDiFen.isSelected(),    //马跟底
                                    self2DuiDuiHu.isSelected(),   //马跟底对对胡
                                    self2MenQing.isSelected(),     //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                hzhmj:
                                {
                                    playType:
                                    {
                                        nofeng: self2Nofeng.isSelected() ? 1:0,
                                        feng: self2Feng.isSelected() ? 1:0,
                                        nojihu: self2NoJiHu.isSelected() ? 1:0,
                                        difenma:self2MaDiFen.isSelected() ? 1:0,
                                        duiduihu:self2DuiDuiHu.isSelected() ? 1:0,
                                        menqing:self2MenQing.isSelected() ? 1:0,
                                        canHu7:self2CanHu7.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self2Ma2.isSelected() ? 1:0,
                                        ma4: self2Ma4.isSelected() ? 1:0,
                                        ma6: self2Ma6.isSelected() ? 1:0,
                                        ma8: self2Ma8.isSelected() ? 1:0,
                                        ma10: self2Ma10.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self2Round4.isSelected() ? 1:0,
                                        round8: self2Round8.isSelected() ? 1:0,
                                        round16: self2Round16.isSelected() ? 1:0,
                                    },

                                    renshu:
                                    {
                                        srmj:self2Srmj.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["2"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                shzhmj:
                {
                    self3Nozhong: null,
                    self3Zhong: null,
                    self3FanGui:null,
                    self3Nofeng: null,
                    self3Feng: null,
                    self3JJG: null,
                    self3Srmj:null,
                    self3MaDiFen:null,
                    self3DuiDuiHu:null,
                    self3Ma2: null,
                    self3Ma4: null,
                    self3Ma6: null,
                    self3Ma8: null,
                    self3Ma10: null,
                    self3Round4: null,
                    self3Round8: null,
                    self3Round16: null,
                    self3OK:null,

                    _run: function ()
                    {
                        gamemjs[3] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self3Nozhong = this;
                            },

                            _click: function ()
                            {
                                self3Zhong.setSelected(false);
                                self3Zhong.setTouchEnabled(true);
                                self3Nozhong.setSelected(true);
                                self3Nozhong.setTouchEnabled(false);
                                self3FanGui.setSelected(false);
                                self3FanGui.setTouchEnabled(true);
                            }
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self3Zhong = this;
                            },

                            _click: function ()
                            {
                                self3Zhong.setSelected(true);
                                self3Zhong.setTouchEnabled(false);
                                self3Nozhong.setSelected(false);
                                self3Nozhong.setTouchEnabled(true);
                                self3FanGui.setSelected(false);
                                self3FanGui.setTouchEnabled(true);
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self3FanGui = this;
                            },

                            _click: function ()
                            {
                                self3Zhong.setSelected(false);
                                self3Zhong.setTouchEnabled(true);
                                self3Nozhong.setSelected(false);
                                self3Nozhong.setTouchEnabled(true);
                                self3FanGui.setSelected(true);
                                self3FanGui.setTouchEnabled(false);
                            }
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self3Nofeng = this;
                            },

                            _click: function ()
                            {
                                self3Feng.setSelected(false);
                                self3Feng.setTouchEnabled(true);
                                self3Nofeng.setSelected(true);
                                self3Nofeng.setTouchEnabled(false);
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self3Feng = this;
                            },

                            _click: function ()
                            {
                                self3Feng.setSelected(true);
                                self3Feng.setTouchEnabled(false);
                                self3Nofeng.setSelected(false);
                                self3Nofeng.setTouchEnabled(true);
                            }
                        },

                        jjg:
                        {
                            _run: function ()
                            {
                                self3JJG = this;
                            },

                            _click: function ()
                            {
                            }
                        },

                        difenma:
                        {
                            _run: function ()
                            {
                                self3MaDiFen = this;
                            },

                            _click: function ()
                            {
                                if(self3DuiDuiHu.isSelected())
                                    self3DuiDuiHu.setSelected(false);
                            }
                        },

                        duiduihu:
                        {
                            _run: function ()
                            {
                                self3DuiDuiHu = this;
                            },

                            _click: function ()
                            {
                                if(!self3MaDiFen.isSelected())
                                    self3MaDiFen.setSelected(true);
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self3DuiDuiHu.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 30;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。跟至对对胡：跟的底分最多6分。公式：底分+花+[（对对胡+花）×马]。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self3Ma2 = this;
                            },
                            _click: function ()
                            {
                                self3Ma2.setSelected(true);
                                self3Ma2.setTouchEnabled(false);
                                self3Ma4.setSelected(false);
                                self3Ma4.setTouchEnabled(true);
                                self3Ma6.setSelected(false);
                                self3Ma6.setTouchEnabled(true);
                                self3Ma8.setSelected(false);
                                self3Ma8.setTouchEnabled(true);
                                self3Ma10.setSelected(false);
                                self3Ma10.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self3Ma4 = this;
                            },
                            _click: function ()
                            {
                                self3Ma2.setSelected(false);
                                self3Ma2.setTouchEnabled(true);
                                self3Ma4.setSelected(true);
                                self3Ma4.setTouchEnabled(false);
                                self3Ma6.setSelected(false);
                                self3Ma6.setTouchEnabled(true);
                                self3Ma8.setSelected(false);
                                self3Ma8.setTouchEnabled(true);
                                self3Ma10.setSelected(false);
                                self3Ma10.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self3Ma6 = this;
                            },
                            _click: function ()
                            {
                                self3Ma2.setSelected(false);
                                self3Ma2.setTouchEnabled(true);
                                self3Ma4.setSelected(false);
                                self3Ma4.setTouchEnabled(true);
                                self3Ma6.setSelected(true);
                                self3Ma6.setTouchEnabled(false);
                                self3Ma8.setSelected(false);
                                self3Ma8.setTouchEnabled(true);
                                self3Ma10.setSelected(false);
                                self3Ma10.setTouchEnabled(true);
                            }
                        },

                        ma8:
                        {
                            _run: function ()
                            {
                                self3Ma8 = this;
                            },
                            _click: function ()
                            {
                                self3Ma2.setSelected(false);
                                self3Ma2.setTouchEnabled(true);
                                self3Ma4.setSelected(false);
                                self3Ma4.setTouchEnabled(true);
                                self3Ma6.setSelected(false);
                                self3Ma6.setTouchEnabled(true);
                                self3Ma8.setSelected(true);
                                self3Ma8.setTouchEnabled(false);
                                self3Ma10.setSelected(false);
                                self3Ma10.setTouchEnabled(true);
                            }
                        },

                        ma10:
                        {
                            _run: function ()
                            {
                                self3Ma10 = this;
                            },
                            _click: function ()
                            {
                                self3Ma2.setSelected(false);
                                self3Ma2.setTouchEnabled(true);
                                self3Ma4.setSelected(false);
                                self3Ma4.setTouchEnabled(true);
                                self3Ma6.setSelected(false);
                                self3Ma6.setTouchEnabled(true);
                                self3Ma8.setSelected(false);
                                self3Ma8.setTouchEnabled(true);
                                self3Ma10.setSelected(true);
                                self3Ma10.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self3Round4 = this;
                            },

                            _click: function ()
                            {
                                self3Round4.setSelected(true);
                                self3Round4.setTouchEnabled(false);
                                self3Round8.setSelected(false);
                                self3Round8.setTouchEnabled(true);
                                self3Round16.setSelected(false);
                                self3Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                    return;

                                self3OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self3OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self3Round8 = this;
                            },
                            _click: function ()
                            {
                                self3Round4.setSelected(false);
                                self3Round4.setTouchEnabled(true);
                                self3Round8.setSelected(true);
                                self3Round8.setTouchEnabled(false);
                                self3Round16.setSelected(false);
                                self3Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                    return;

                                self3OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self3OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        },

                        round16:
                        {
                            _run: function ()
                            {
                                self3Round16 = this;
                            },
                            _click: function ()
                            {
                                self3Round4.setSelected(false);
                                self3Round4.setTouchEnabled(true);
                                self3Round8.setSelected(false);
                                self3Round8.setTouchEnabled(true);
                                self3Round16.setSelected(true);
                                self3Round16.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                    return;

                                self3OK.loadTextureNormal("res/createRoomNew/queding_5.png");
                                self3OK.loadTexturePressed("res/createRoomNew/queding_5_press.png");
                            }
                        }
                    },

                    renshu:
                    {
                        srmj:
                        {
                            _run: function ()
                            {
                                self3Srmj = this;
                            },

                            _click:function()
                            {
                                // text = self3Srmj.getChildByName("Text_1");
                                // if(self3Srmj.isSelected())
                                // {
                                //     text.setTextColor(cc.color(242,61,5));
                                // }
                                // else
                                // {
                                //     text.setTextColor(cc.color(108,37,20));
                                // }
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self3OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var haveMoney = jsclient.data.pinfo.money;

                            var isRound = "round4";
                            if(self3Round4.isSelected())
                                isRound = "round4";
                            else if(self3Round8.isSelected())
                                isRound = "round8";
                            else if(self3Round16.isSelected())
                                isRound = "round16";

                            var needMoney = majiang.round4;
                            if(self3Round4.isSelected())
                                needMoney = majiang.round4;
                            else if(self3Round8.isSelected())
                                needMoney = majiang.round8;
                            else if(self3Round16.isSelected())
                                needMoney = majiang.round16;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self3Ma2.isSelected())
                                horse = 2;
                            else if (self3Ma4.isSelected())
                                horse = 4;
                            else if (self3Ma6.isSelected())
                                horse = 6;
                            else if (self3Ma8.isSelected())
                                horse = 8;
                            else if (self3Ma10.isSelected())
                                horse = 10;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    3,                        //游戏类型
                                    isRound,                   //4局或8局
                                    false,                     //吃胡
                                    self3Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    true,                       //7
                                    false,                      //7加番
                                    false,                     //258
                                    self3Zhong.isSelected(),    //鬼牌
                                    false,                      //中为马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    self3JJG.isSelected(),      //节节高
                                    self3FanGui.isSelected(),    //翻鬼
                                    false,                      //双鬼
                                    0,                            //番
                                    self3Srmj.isSelected() ? 3 : 4,//人数
                                    false,                       //大胡
                                    true,                        //无鬼加码
                                    false,                        //无鬼翻倍
                                    true,                         //4鬼胡牌
                                    1,                            //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                      //可鸡胡
                                    self3MaDiFen.isSelected(),    //马跟底
                                    self3DuiDuiHu.isSelected(),  //马跟底对对胡
                                    false,                          //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                shzhmj:
                                {
                                    playType:
                                    {
                                        nozhong: self3Nozhong.isSelected() ? 1:0,
                                        zhong: self3Zhong.isSelected() ? 1:0,
                                        fangui:self3FanGui.isSelected() ? 1:0,
                                        nofeng: self3Nofeng.isSelected() ? 1:0,
                                        feng: self3Feng.isSelected() ? 1:0,
                                        difenma: self3MaDiFen.isSelected() ? 1:0,
                                        duiduihu:self3DuiDuiHu.isSelected() ? 1:0,
                                        jjg:self3JJG.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self3Ma2.isSelected() ? 1:0,
                                        ma4: self3Ma4.isSelected() ? 1:0,
                                        ma6: self3Ma6.isSelected() ? 1:0,
                                        ma8: self3Ma8.isSelected() ? 1:0,
                                        ma10: self3Ma10.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self3Round4.isSelected() ? 1:0,
                                        round8: self3Round8.isSelected() ? 1:0,
                                        round16: self3Round16.isSelected() ? 1:0,
                                    },

                                    renshu:
                                    {
                                        srmj:self3Srmj.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["3"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                jphmj:
                {
                    self4Nofeng: null,
                    self4Feng: null,
                    self4Fan0: null,
                    self4Fan1: null,
                    self4Fan3: null,
                    self4Round4: null,
                    self4Round8: null,
                    self4OK:null,

                    _run: function ()
                    {
                        gamemjs[4] = this;
                    },

                    playType:
                    {
                        _run:function ()
                        {
                            this.visible = false;
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self4Nofeng = this;
                            },

                            _click: function ()
                            {
                                self4Feng.setSelected(false);
                                self4Feng.setTouchEnabled(true);
                                self4Nofeng.setSelected(true);
                                self4Nofeng.setTouchEnabled(false);
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self4Feng = this;
                            },

                            _click: function ()
                            {
                                self4Feng.setSelected(true);
                                self4Feng.setTouchEnabled(false);
                                self4Nofeng.setSelected(false);
                                self4Nofeng.setTouchEnabled(true);
                            }
                        },
                    },

                    fanshu:
                    {
                        fan0:
                        {
                            _run: function ()
                            {
                                self4Fan0 = this;
                            },
                            _click: function ()
                            {
                                self4Fan0.setSelected(true);
                                self4Fan0.setTouchEnabled(false);
                                self4Fan1.setSelected(false);
                                self4Fan1.setTouchEnabled(true);
                                self4Fan3.setSelected(false);
                                self4Fan3.setTouchEnabled(true);
                            }
                        },

                        fan1:
                        {
                            _run: function ()
                            {
                                self4Fan1 = this;
                            },
                            _click: function ()
                            {
                                self4Fan0.setSelected(false);
                                self4Fan0.setTouchEnabled(true);
                                self4Fan1.setSelected(true);
                                self4Fan1.setTouchEnabled(false);
                                self4Fan3.setSelected(false);
                                self4Fan3.setTouchEnabled(true);
                            }
                        },

                        fan3:
                        {
                            _run: function ()
                            {
                                self4Fan3 = this;
                            },
                            _click: function ()
                            {
                                self4Fan0.setSelected(false);
                                self4Fan0.setTouchEnabled(true);
                                self4Fan1.setSelected(false);
                                self4Fan1.setTouchEnabled(true);
                                self4Fan3.setSelected(true);
                                self4Fan3.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self4Round4 = this;
                            },

                            _click: function ()
                            {
                                self4Round4.setSelected(true);
                                self4Round4.setTouchEnabled(false);
                                self4Round8.setSelected(false);
                                self4Round8.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["4"] != null)
                                    return;

                                self4OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self4OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self4Round8 = this;
                            },
                            _click: function ()
                            {
                                self4Round4.setSelected(false);
                                self4Round4.setTouchEnabled(true);
                                self4Round8.setSelected(true);
                                self4Round8.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["4"] != null)
                                    return;

                                self4OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self4OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self4OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var isRound = self4Round4.isSelected();
                            var needMoney = isRound ? majiang.round4 : majiang.round8;
                            var haveMoney = jsclient.data.pinfo.money;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["4"] != null)
                                needMoney = 0;

                            var fannum = 0;
                            if(self4Fan0.isSelected())
                                fannum = 0;
                            else if(self4Fan1.isSelected())
                                fannum = 1;
                            else if(self4Fan3.isSelected())
                                fannum = 3;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    4,                        //游戏类型
                                    isRound ? "round4" : "round8",//4局或8局
                                    false,                     //吃胡
                                    self4Feng.isSelected(),     //带风
                                    true,                      //吃
                                    true,                      //无效参数
                                    false,                       //7
                                    false,                      //7加番
                                    false,                     //258
                                    false,                     //鬼牌
                                    false,                     //中为马
                                    0,                         //几匹马
                                    false,                      //爆炸马
                                    false,                    //节节高
                                    false,                    //翻鬼
                                    false,                      //双鬼
                                    fannum,                     //番
                                    4,                          //人数
                                    false,                       //大胡
                                    false,                        //无鬼加码
                                    false,                        //无鬼翻倍
                                    false,                         //4鬼胡牌
                                    1,                             //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                      //可鸡胡
                                    false,                         //马跟底
                                    false,                          //马跟底对对胡
                                    false,                          //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                jphmj:
                                {
                                    playType:
                                    {
                                    },

                                    fanshu:
                                    {
                                        fan0: self4Fan0.isSelected() ? 1:0,
                                        fan1: self4Fan1.isSelected() ? 1:0,
                                        fan3: self4Fan3.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self4Round4.isSelected() ? 1:0,
                                        round8: self4Round8.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["4"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                dgmj:
                {
                    self5Nozhong: null,
                    self5Zhong: null,
                    self5FanGui:null,
                    self5Nofeng: null,
                    self5Feng: null,
                    self5CanHu7: null,
                    self5CanFan7:null,
                    self5NoGuiHu:null,
                    self5NoGuiBei:null,
                    self5NoGuiMa:null,
                    self5Gui4Hu:null,
                    self5Gui4Bei:null,
                    self5MaDiFen:null,
                    self5DuiDuiHu:null,
                    self5Ma2: null,
                    self5Ma4: null,
                    self5Ma6: null,
                    self5Round4: null,
                    self5Round8: null,
                    self5ZhongIsMa:null,
                    self5OK:null,

                    _run: function ()
                    {
                        gamemjs[5] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self5Nozhong = this;
                            },

                            _click: function ()
                            {
                                self5Zhong.setSelected(false);
                                self5Zhong.setTouchEnabled(true);
                                self5Nozhong.setSelected(true);
                                self5Nozhong.setTouchEnabled(false);
                                self5FanGui.setSelected(false);
                                self5FanGui.setTouchEnabled(true);

                                self5NoGuiHu.setSelected(false);
                                self5NoGuiHu.setTouchEnabled(false);

                                self5NoGuiMa.setSelected(false);
                                self5NoGuiMa.setTouchEnabled(false);

                                self5NoGuiBei.setSelected(false);
                                self5NoGuiBei.setTouchEnabled(false);

                                self5Gui4Hu.setSelected(false);
                                self5Gui4Hu.setTouchEnabled(false);

                                self5Gui4Bei.setSelected(false);
                                self5Gui4Bei.setTouchEnabled(false);
                            }
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self5Zhong = this;
                            },

                            _click:function()
                            {
                                if(self5Zhong.isSelected())
                                    self5ZhongIsMa.setSelected(false);

                                self5Zhong.setSelected(true);
                                self5Zhong.setTouchEnabled(false);
                                self5Nozhong.setSelected(false);
                                self5Nozhong.setTouchEnabled(true);
                                self5FanGui.setSelected(false);
                                self5FanGui.setTouchEnabled(true);

                                //self5NoGuiHu.setTouchEnabled(true);
                                self5NoGuiMa.setTouchEnabled(true);
                                self5NoGuiBei.setTouchEnabled(true);
                                self5Gui4Hu.setTouchEnabled(true);
                                self5Gui4Bei.setTouchEnabled(true);

                                if(!self5NoGuiHu.isSelected())
                                    self5NoGuiHu.setSelected(true);

                                if(!self5NoGuiMa.isSelected() && !self5NoGuiBei.isSelected())
                                    self5NoGuiMa.setSelected(true);
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self5FanGui = this;
                            },

                            _click: function ()
                            {
                                self5Zhong.setSelected(false);
                                self5Zhong.setTouchEnabled(true);
                                self5Nozhong.setSelected(false);
                                self5Nozhong.setTouchEnabled(true);
                                self5FanGui.setSelected(true);
                                self5FanGui.setTouchEnabled(false);

                                //self5NoGuiHu.setTouchEnabled(true);
                                self5NoGuiMa.setTouchEnabled(true);
                                self5NoGuiBei.setTouchEnabled(true);
                                self5Gui4Hu.setTouchEnabled(true);
                                self5Gui4Bei.setTouchEnabled(true);

                                if(!self5NoGuiHu.isSelected())
                                    self5NoGuiHu.setSelected(true);

                                if(!self5NoGuiMa.isSelected() && !self5NoGuiBei.isSelected())
                                    self5NoGuiMa.setSelected(true);
                            }
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self5Nofeng = this;
                            },

                            _click: function ()
                            {
                                self5Feng.setSelected(false);
                                self5Feng.setTouchEnabled(true);
                                self5Nofeng.setSelected(true);
                                self5Nofeng.setTouchEnabled(false);
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self5Feng = this;
                            },

                            _click: function ()
                            {
                                self5Feng.setSelected(true);
                                self5Feng.setTouchEnabled(false);
                                self5Nofeng.setSelected(false);
                                self5Nofeng.setTouchEnabled(true);
                            }
                        },

                        zhongisma:
                        {
                            _run: function ()
                            {
                                self5ZhongIsMa = this;
                            },

                            _click: function ()
                            {
                                if(self5Zhong.isSelected())
                                {
                                    self5Zhong.setSelected(false);
                                    self5Zhong.setTouchEnabled(true);
                                    self5Nozhong.setSelected(true);
                                    self5Nozhong.setTouchEnabled(false);
                                    self5FanGui.setSelected(false);
                                    self5FanGui.setTouchEnabled(true);

                                    self5NoGuiHu.setSelected(false);
                                    self5NoGuiHu.setTouchEnabled(false);

                                    self5NoGuiMa.setSelected(false);
                                    self5NoGuiMa.setTouchEnabled(false);

                                    self5NoGuiBei.setSelected(false);
                                    self5NoGuiBei.setTouchEnabled(false);

                                    self5Gui4Hu.setSelected(false);
                                    self5Gui4Hu.setTouchEnabled(false);

                                    self5Gui4Bei.setSelected(false);
                                    self5Gui4Bei.setTouchEnabled(false);
                                }
                            }
                        },

                        noguihu:
                        {
                            _run: function ()
                            {
                                self5NoGuiHu = this;
                            },

                            _click: function ()
                            {
                                //if(self5NoGuiBei.isSelected())
                                //    self5NoGuiBei.setSelected(false);
                                //
                                //if(self5NoGuiMa.isSelected())
                                //    self5NoGuiMa.setSelected(false);
                            }
                        },

                        noguibei:
                        {
                            _run: function ()
                            {
                                self5NoGuiBei = this;
                            },

                            _click: function ()
                            {
                                //if(!self5NoGuiHu.isSelected())
                                //    self5NoGuiHu.setSelected(true);

                                if(self5NoGuiMa.isSelected())
                                    self5NoGuiMa.setSelected(false);
                                else
                                    self5NoGuiMa.setSelected(true);
                            }
                        },

                        noguima:
                        {
                            _run: function ()
                            {
                                self5NoGuiMa = this;
                            },

                            _click: function ()
                            {

                                //if(!self5NoGuiHu.isSelected())
                                //    self5NoGuiHu.setSelected(true);

                                if(self5NoGuiBei.isSelected())
                                    self5NoGuiBei.setSelected(false);
                                else
                                    self5NoGuiBei.setSelected(true);
                            }
                        },

                        gui4hu:
                        {
                            _run: function ()
                            {
                                self5Gui4Hu = this;
                            },

                            _click: function ()
                            {
                                if(self5Gui4Bei.isSelected())
                                    self5Gui4Bei.setSelected(false);
                            }
                        },

                        gui4bei:
                        {
                            _run: function ()
                            {
                                self5Gui4Bei = this;
                            },

                            _click: function ()
                            {
                                if(!self5Gui4Hu.isSelected())
                                    self5Gui4Hu.setSelected(true);
                            }
                        },

                        difenma:
                        {

                            _run: function ()
                            {
                                self5MaDiFen = this;
                            },

                            _click: function ()
                            {
                                if(self5DuiDuiHu.isSelected())
                                    self5DuiDuiHu.setSelected(false);
                            }
                        },

                        duiduihu:
                        {

                            _run: function ()
                            {
                                self5DuiDuiHu = this;
                            },

                            _click: function ()
                            {
                                if(!self5MaDiFen.isSelected())
                                    self5MaDiFen.setSelected(true);
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self5DuiDuiHu.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 30;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。跟至对对胡：跟的底分最多4分。公式：底分+花+[（对对胡+花）×马]。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self5Ma2 = this;
                            },
                            _click: function ()
                            {
                                self5Ma2.setSelected(true);
                                self5Ma2.setTouchEnabled(false);
                                self5Ma4.setSelected(false);
                                self5Ma4.setTouchEnabled(true);
                                self5Ma6.setSelected(false);
                                self5Ma6.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self5Ma4 = this;
                            },
                            _click: function ()
                            {
                                self5Ma2.setSelected(false);
                                self5Ma2.setTouchEnabled(true);
                                self5Ma4.setSelected(true);
                                self5Ma4.setTouchEnabled(false);
                                self5Ma6.setSelected(false);
                                self5Ma6.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self5Ma6 = this;
                            },
                            _click: function ()
                            {
                                self5Ma2.setSelected(false);
                                self5Ma2.setTouchEnabled(true);
                                self5Ma4.setSelected(false);
                                self5Ma4.setTouchEnabled(true);
                                self5Ma6.setSelected(true);
                                self5Ma6.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self5Round4 = this;
                            },

                            _click: function ()
                            {
                                self5Round4.setSelected(true);
                                self5Round4.setTouchEnabled(false);
                                self5Round8.setSelected(false);
                                self5Round8.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["5"] != null)
                                    return;

                                self5OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self5OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self5Round8 = this;
                            },
                            _click: function ()
                            {
                                self5Round4.setSelected(false);
                                self5Round4.setTouchEnabled(true);
                                self5Round8.setSelected(true);
                                self5Round8.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["5"] != null)
                                    return;

                                self5OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self5OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self5OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var isRound = self5Round4.isSelected();
                            var needMoney = isRound ? majiang.round4 : majiang.round8;
                            var haveMoney = jsclient.data.pinfo.money;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["5"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self5Ma2.isSelected())
                                horse = 2;
                            else if (self5Ma4.isSelected())
                                horse = 4;
                            else if (self5Ma6.isSelected())
                                horse = 6;

                            var gui4huBeiNum = 1;
                            if(self5Gui4Bei.isSelected())
                                gui4huBeiNum = 2;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    5,                        //游戏类型
                                    isRound ? "round4" : "round8",//4局或8局
                                    false,                     //吃胡
                                    self5Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    true,                       //7对
                                    false,                      //7对加番
                                    false,                     //258
                                    self5Zhong.isSelected(),    //红中鬼牌
                                    self5ZhongIsMa.isSelected(),//红中算马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    false,                     //节节高
                                    self5FanGui.isSelected(),   //翻鬼
                                    false,                      //双鬼
                                    0,                          //番
                                    4,                         //人数
                                    false,                       //大胡
                                    self5NoGuiMa.isSelected(),  //无鬼加码
                                    self5NoGuiBei.isSelected(), //无鬼加倍
                                    self5Gui4Hu.isSelected(),   //4鬼胡牌
                                    gui4huBeiNum,                //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                      //可鸡胡
                                    self5MaDiFen.isSelected(),   //马跟底
                                    self5DuiDuiHu.isSelected(),  //马跟底对对胡
                                    false,                          //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                dgmj:
                                {
                                    playType:
                                    {
                                        nozhong: self5Nozhong.isSelected() ? 1:0,
                                        zhong: self5Zhong.isSelected() ? 1:0,
                                        fangui:self5FanGui.isSelected() ? 1:0,
                                        nofeng: self5Nofeng.isSelected() ? 1:0,
                                        feng: self5Feng.isSelected() ? 1:0,
                                        zhongisma: self5ZhongIsMa.isSelected() ? 1:0,
                                        noguihu:self5NoGuiHu.isSelected() ? 1:0,
                                        noguibei:self5NoGuiBei.isSelected() ? 1:0,
                                        noguima:self5NoGuiMa.isSelected() ? 1:0,
                                        gui4hu:self5Gui4Hu.isSelected() ? 1:0,
                                        gui4bei:self5Gui4Bei.isSelected() ? 1:0,
                                        difenma:self5MaDiFen.isSelected() ? 1:0,
                                        duiduihu:self5DuiDuiHu.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self5Ma2.isSelected() ? 1:0,
                                        ma4: self5Ma4.isSelected() ? 1:0,
                                        ma6: self5Ma6.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self5Round4.isSelected() ? 1:0,
                                        round8: self5Round8.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["5"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                ybzhmj:
                {
                    self6Nozhong: null,
                    self6Zhong: null,
                    self6FanGui:null,
                    self6NoDaHu: null,
                    self6DaHu: null,
                    self6CanHu7: null,
                    self6CanFan7:null,
                    self6Ma2: null,
                    self6Ma4: null,
                    self6Ma6: null,
                    self6Round4: null,
                    self6Round8: null,
                    self6NoGuiHu:null,
                    self6NoGuiBei:null,
                    self6NoGuiMa:null,
                    self6Gui4Hu:null,
                    self6Gui4Bei:null,
                    self6OK:null,

                    _run: function ()
                    {
                        gamemjs[6] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self6Nozhong = this;
                            },

                            _click: function ()
                            {
                                self6Zhong.setSelected(false);
                                self6Zhong.setTouchEnabled(true);
                                self6Nozhong.setSelected(true);
                                self6Nozhong.setTouchEnabled(false);
                                self6FanGui.setSelected(false);
                                self6FanGui.setTouchEnabled(true);

                                self6NoGuiHu.setSelected(false);
                                self6NoGuiHu.setTouchEnabled(false);

                                self6NoGuiMa.setSelected(false);
                                self6NoGuiMa.setTouchEnabled(false);

                                self6NoGuiBei.setSelected(false);
                                self6NoGuiBei.setTouchEnabled(false);

                                self6Gui4Hu.setSelected(false);
                                self6Gui4Hu.setTouchEnabled(false);

                                self6Gui4Bei.setSelected(false);
                                self6Gui4Bei.setTouchEnabled(false);
                            }
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self6Zhong = this;
                            },

                            _click:function()
                            {
                                self6Zhong.setSelected(true);
                                self6Zhong.setTouchEnabled(false);
                                self6Nozhong.setSelected(false);
                                self6Nozhong.setTouchEnabled(true);
                                self6FanGui.setSelected(false);
                                self6FanGui.setTouchEnabled(true);

                                //self6NoGuiHu.setTouchEnabled(true);
                                self6NoGuiMa.setTouchEnabled(true);
                                self6NoGuiBei.setTouchEnabled(true);
                                self6Gui4Hu.setTouchEnabled(true);
                                self6Gui4Bei.setTouchEnabled(true);

                                if(!self6NoGuiHu.isSelected())
                                    self6NoGuiHu.setSelected(true);

                                if(!self6NoGuiMa.isSelected() && !self6NoGuiBei.isSelected())
                                    self6NoGuiMa.setSelected(true);
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self6FanGui = this;
                            },

                            _click: function ()
                            {
                                self6Zhong.setSelected(false);
                                self6Zhong.setTouchEnabled(true);
                                self6Nozhong.setSelected(false);
                                self6Nozhong.setTouchEnabled(true);
                                self6FanGui.setSelected(true);
                                self6FanGui.setTouchEnabled(false);

                                //self6NoGuiHu.setTouchEnabled(true);
                                self6NoGuiMa.setTouchEnabled(true);
                                self6NoGuiBei.setTouchEnabled(true);
                                self6Gui4Hu.setTouchEnabled(true);
                                self6Gui4Bei.setTouchEnabled(true);

                                if(!self6NoGuiHu.isSelected())
                                    self6NoGuiHu.setSelected(true);

                                if(!self6NoGuiMa.isSelected() && !self6NoGuiBei.isSelected())
                                    self6NoGuiMa.setSelected(true);
                            }
                        },

                        nodahu:
                        {
                            _run: function ()
                            {
                                self6NoDaHu = this;
                            },

                            _click: function ()
                            {
                                self6DaHu.setSelected(false);
                                self6DaHu.setTouchEnabled(true);
                                self6NoDaHu.setSelected(true);
                                self6NoDaHu.setTouchEnabled(false);
                            }
                        },

                        dahu:
                        {
                            _run: function ()
                            {
                                self6DaHu = this;
                            },

                            _click: function ()
                            {
                                self6DaHu.setSelected(true);
                                self6DaHu.setTouchEnabled(false);
                                self6NoDaHu.setSelected(false);
                                self6NoDaHu.setTouchEnabled(true);
                            }
                        },

                        noguihu:
                        {
                            _run: function ()
                            {
                                self6NoGuiHu = this;
                            },

                            _click: function ()
                            {
                                //if(self6NoGuiBei.isSelected())
                                //    self6NoGuiBei.setSelected(false);
                                //
                                //if(self6NoGuiMa.isSelected())
                                //    self6NoGuiMa.setSelected(false);
                            }
                        },

                        noguibei:
                        {
                            _run: function ()
                            {
                                self6NoGuiBei = this;
                            },

                            _click: function ()
                            {
                                //if(!self6NoGuiHu.isSelected())
                                //    self6NoGuiHu.setSelected(true);

                                if(self6NoGuiMa.isSelected())
                                    self6NoGuiMa.setSelected(false);
                                else
                                    self6NoGuiMa.setSelected(true);
                            }
                        },

                        noguima:
                        {
                            _run: function ()
                            {
                                self6NoGuiMa = this;
                            },

                            _click: function ()
                            {
                                //if(!self6NoGuiHu.isSelected())
                                //    self6NoGuiHu.setSelected(true);

                                if(self6NoGuiBei.isSelected())
                                    self6NoGuiBei.setSelected(false);
                                else
                                    self6NoGuiBei.setSelected(true);
                            }
                        },

                        gui4hu:
                        {
                            _run: function ()
                            {
                                self6Gui4Hu = this;
                            },

                            _click: function ()
                            {
                                if(self6Gui4Bei.isSelected())
                                    self6Gui4Bei.setSelected(false);
                            }
                        },

                        gui4bei:
                        {
                            _run: function ()
                            {
                                self6Gui4Bei = this;
                            },

                            _click: function ()
                            {
                                if(!self6Gui4Hu.isSelected())
                                    self6Gui4Hu.setSelected(true);
                            }
                        },

                        difenma:
                        {

                            _run: function ()
                            {
                                self6MaDiFen = this;
                            },

                            _click: function ()
                            {
                                if(self6DuiDuiHu.isSelected())
                                    self6DuiDuiHu.setSelected(false);
                            }
                        },

                        duiduihu:
                        {

                            _run: function ()
                            {
                                self6DuiDuiHu = this;
                            },

                            _click: function ()
                            {
                                if(!self6MaDiFen.isSelected())
                                    self6MaDiFen.setSelected(true);
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self6DuiDuiHu.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 30;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分：","中一个马在底分的基础上加倍。跟至对对胡：跟的底分最多4分（有大胡4分，无大胡2分）。公式：底分+花+[（对对胡+花）×马]。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self6Ma2 = this;
                            },
                            _click: function ()
                            {
                                self6Ma2.setSelected(true);
                                self6Ma2.setTouchEnabled(false);
                                self6Ma4.setSelected(false);
                                self6Ma4.setTouchEnabled(true);
                                self6Ma6.setSelected(false);
                                self6Ma6.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self6Ma4 = this;
                            },
                            _click: function ()
                            {
                                self6Ma2.setSelected(false);
                                self6Ma2.setTouchEnabled(true);
                                self6Ma4.setSelected(true);
                                self6Ma4.setTouchEnabled(false);
                                self6Ma6.setSelected(false);
                                self6Ma6.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self6Ma6 = this;
                            },
                            _click: function ()
                            {
                                self6Ma2.setSelected(false);
                                self6Ma2.setTouchEnabled(true);
                                self6Ma4.setSelected(false);
                                self6Ma4.setTouchEnabled(true);
                                self6Ma6.setSelected(true);
                                self6Ma6.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self6Round4 = this;
                            },

                            _click: function ()
                            {
                                self6Round4.setSelected(true);
                                self6Round4.setTouchEnabled(false);
                                self6Round8.setSelected(false);
                                self6Round8.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["6"] != null)
                                    return;

                                self6OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self6OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self6Round8 = this;
                            },
                            _click: function ()
                            {
                                self6Round4.setSelected(false);
                                self6Round4.setTouchEnabled(true);
                                self6Round8.setSelected(true);
                                self6Round8.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["6"] != null)
                                    return;

                                self6OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self6OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self6OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var isRound = self6Round4.isSelected();
                            var needMoney = isRound ? majiang.round4 : majiang.round8;
                            var haveMoney = jsclient.data.pinfo.money;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["6"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self6Ma2.isSelected())
                                horse = 2;
                            else if (self6Ma4.isSelected())
                                horse = 4;
                            else if (self6Ma6.isSelected())
                                horse = 6;

                            var gui4huBeiNum = 1;
                            if(self6Gui4Bei.isSelected())
                                gui4huBeiNum = 2;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    6,                        //游戏类型
                                    isRound ? "round4" : "round8",//4局或8局
                                    false,                     //吃胡
                                    true,                        //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    false,                       //7对
                                    false,                      //7对加番
                                    false,                     //258
                                    self6Zhong.isSelected(),    //红中鬼牌
                                    false,                      //红中算马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    false,                     //节节高
                                    self6FanGui.isSelected(),   //翻鬼
                                    false,                      //双鬼
                                    0,                          //番
                                    4,                            //人数
                                    self6DaHu.isSelected(),      //大胡
                                    self6NoGuiMa.isSelected(),  //无鬼加码
                                    self6NoGuiBei.isSelected(), //无鬼加倍
                                    self6Gui4Hu.isSelected(),   //4鬼胡牌
                                    gui4huBeiNum,                //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                      //可鸡胡
                                    self6MaDiFen.isSelected(),   //马跟底
                                    self6DuiDuiHu.isSelected(),   //马跟底对对胡
                                    false,                         //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                ybzhmj:
                                {
                                    playType:
                                    {
                                        nozhong: self6Nozhong.isSelected() ? 1:0,
                                        zhong: self6Zhong.isSelected() ? 1:0,
                                        fangui:self6FanGui.isSelected() ? 1:0,
                                        nodahu: self6NoDaHu.isSelected() ? 1:0,
                                        dahu: self6DaHu.isSelected() ? 1:0,
                                        noguihu:self6NoGuiHu.isSelected() ? 1:0,
                                        noguibei:self6NoGuiBei.isSelected() ? 1:0,
                                        noguima:self6NoGuiMa.isSelected() ? 1:0,
                                        gui4hu:self6Gui4Hu.isSelected() ? 1:0,
                                        gui4bei:self6Gui4Bei.isSelected() ? 1:0,
                                        difenma:self6MaDiFen.isSelected() ? 1:0,
                                        duiduihu:self6DuiDuiHu.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self6Ma2.isSelected() ? 1:0,
                                        ma4: self6Ma4.isSelected() ? 1:0,
                                        ma6: self6Ma6.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self6Round4.isSelected() ? 1:0,
                                        round8: self6Round8.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["6"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                bdhmj:
                {
                    self8Image_5:null,
                    self8Bddahu: null,
                    self8Bdjihu: null,
                    self8Magendi:null,
                    self8CanHu7: null,
                    self8CanFan7:null,
                    self8Wuhuahu:null,
                    self8Wuhuajiabei:null,
                    self8Wuhuajiama:null,
                    self8JiHu:null,
                    self8Ma2: null,
                    self8Ma4: null,
                    self8Ma6: null,
                    self8MaBom: null,
                    self8Round4: null,
                    self8Round8: null,
                    self8JJG:null,
                    self8OK:null,

                    _run: function ()
                    {
                        gamemjs[7] = this;
                    },

                    playType:
                    {

                        Image_5:
                        {
                            _run:function()
                            {
                                self8Image_5 = this;
                                this.visible = false;
                            }
                        },

                        bddahu:
                        {
                            _run: function ()
                            {
                                self8Bddahu = this;
                            },

                            _click: function ()
                            {
                                self8Bddahu.setSelected(true);
                                self8Bddahu.setTouchEnabled(false);
                                self8Bdjihu.setSelected(false);
                                self8Bdjihu.setTouchEnabled(true);

                                self8CanFan7.setSelected(false);
                                self8CanHu7.setSelected(false);
                                self8CanHu7.setVisible(false);
                                self8CanFan7.setVisible(false);
                                self8Image_5.setVisible(false);

                                if(self8JiHu.isSelected())
                                    self8JiHu.setSelected(false);
                            }
                        },

                        jihu:
                        {
                            _run: function ()
                            {
                                self8JiHu = this;
                            },

                            _click: function ()
                            {
                                if(!self8Bddahu.isSelected())
                                {
                                    self8Bddahu.setSelected(true);
                                    self8Bddahu.setTouchEnabled(false);
                                    self8Bdjihu.setSelected(false);
                                    self8Bdjihu.setTouchEnabled(true);

                                    self8CanFan7.setSelected(false);
                                    self8CanHu7.setSelected(false);
                                    self8CanHu7.setVisible(false);
                                    self8CanFan7.setVisible(false);
                                    self8Image_5.setVisible(false);
                                }

                            }
                        },

                        bdjihu:
                        {
                            _run: function ()
                            {
                                self8Bdjihu = this;
                            },

                            _click: function ()
                            {
                                self8Bddahu.setSelected(false);
                                self8Bddahu.setTouchEnabled(true);
                                self8Bdjihu.setSelected(true);
                                self8Bdjihu.setTouchEnabled(false);

                                self8CanHu7.setVisible(true);
                                self8CanFan7.setVisible(true);
                                self8Image_5.setVisible(true);

                                if(self8JiHu.isSelected())
                                    self8JiHu.setSelected(false);
                            }
                        },

                        magendi:
                        {
                            _run: function ()
                            {
                                self8Magendi = this;
                            },
                            _click: function ()
                            {
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self8Magendi.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 50;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },

                        canHu7:
                        {
                            _run: function ()
                            {
                                self8CanHu7 = this;
                                this.visible = false;
                            },

                            _click: function ()
                            {

                                if(self8CanFan7.isSelected())
                                    self8CanFan7.setSelected(false);
                            }
                        },

                        canFan7:
                        {
                            _run: function ()
                            {
                                self8CanFan7 = this;
                                this.visible = false;
                            },

                            _click: function ()
                            {
                                if(!self8CanHu7.isSelected())
                                    self8CanHu7.setSelected(true);
                            }
                        },

                        wuhuahu:
                        {
                            _run: function ()
                            {
                                self8Wuhuahu = this;
                            },

                            _click:function()
                            {

                                //if(self8Wuhuajiabei.isSelected())
                                //    self8Wuhuajiabei.setSelected(false);
                                //
                                //if(self8Wuhuajiama.isSelected())
                                //    self8Wuhuajiama.setSelected(false);
                            }
                        },

                        wuhuajiabei:
                        {
                            _run: function ()
                            {
                                self8Wuhuajiabei = this;
                            },

                            _click:function()
                            {

                                //if(!self8Wuhuahu.isSelected())
                                //    self8Wuhuahu.setSelected(true);

                                if(self8Wuhuajiama.isSelected())
                                    self8Wuhuajiama.setSelected(false);
                                else
                                    self8Wuhuajiama.setSelected(true);
                            }
                        },

                        wuhuajiama:
                        {
                            _run: function ()
                            {
                                self8Wuhuajiama = this;
                            },

                            _click:function()
                            {

                                //if(!self8Wuhuahu.isSelected())
                                //    self8Wuhuahu.setSelected(true);

                                if(self8Wuhuajiabei.isSelected())
                                    self8Wuhuajiabei.setSelected(false);
                                else
                                    self8Wuhuajiabei.setSelected(true);
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self8Ma2 = this;
                            },
                            _click: function ()
                            {
                                self8Ma2.setSelected(true);
                                self8Ma2.setTouchEnabled(false);
                                self8Ma4.setSelected(false);
                                self8Ma4.setTouchEnabled(true);
                                self8Ma6.setSelected(false);
                                self8Ma6.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self8Ma4 = this;
                            },
                            _click: function ()
                            {
                                self8Ma2.setSelected(false);
                                self8Ma2.setTouchEnabled(true);
                                self8Ma4.setSelected(true);
                                self8Ma4.setTouchEnabled(false);
                                self8Ma6.setSelected(false);
                                self8Ma6.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self8Ma6 = this;
                            },
                            _click: function ()
                            {
                                self8Ma2.setSelected(false);
                                self8Ma2.setTouchEnabled(true);
                                self8Ma4.setSelected(false);
                                self8Ma4.setTouchEnabled(true);
                                self8Ma6.setSelected(true);
                                self8Ma6.setTouchEnabled(false);
                            }
                        },

                        mabaozha:
                        {

                            _run:function ()
                            {
                                self8MaBom = this;
                            },

                            _click: function ()
                            {
                                self8Ma2.setSelected(false);
                                self8Ma2.setTouchEnabled(true);
                                self8Ma4.setSelected(false);
                                self8Ma4.setTouchEnabled(true);
                                self8Ma6.setSelected(false);
                                self8Ma6.setTouchEnabled(true);
                            }
                        }
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self8Round4 = this;
                            },

                            _click: function ()
                            {
                                self8Round4.setSelected(true);
                                self8Round4.setTouchEnabled(false);
                                self8Round8.setSelected(false);
                                self8Round8.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["7"] != null)
                                    return;

                                self8OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self8OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self8Round8 = this;
                            },
                            _click: function ()
                            {
                                self8Round4.setSelected(false);
                                self8Round4.setTouchEnabled(true);
                                self8Round8.setSelected(true);
                                self8Round8.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["7"] != null)
                                    return;

                                self8OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self8OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self8OK = this;
                        },

                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var isRound = self8Round4.isSelected();
                            var needMoney = isRound ? majiang.round4 : majiang.round8;
                            var haveMoney = jsclient.data.pinfo.money;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["7"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self8Ma2.isSelected())
                                horse = 2;
                            else if (self8Ma4.isSelected())
                                horse = 4;
                            else if (self8Ma6.isSelected())
                                horse = 6;
                            else if(self8MaBom.isSelected())
                                horse = 1;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    7,                              //游戏类型
                                    isRound ? "round4" : "round8",  //4局或8局
                                    false,                          //吃胡
                                    true,                           //带风
                                    false,                          //吃
                                    true,                           //无效参数
                                    self8CanHu7.isSelected(),       //7
                                    self8CanFan7.isSelected(),      //7对加番
                                    false,                          //258
                                    false,                          //红中鬼牌
                                    false,                          //红中为马
                                    horse,                          //几匹马
                                    false,                          //爆炸马
                                    false,                          //节节高
                                    true,                           //翻鬼
                                    false,                          //双鬼
                                    0,                              //番
                                    4,                              //人数
                                    false,                          //大胡
                                    self8Wuhuajiama.isSelected(),   //无鬼加码
                                    self8Wuhuajiabei.isSelected(),  //无鬼翻倍
                                    true,                           //4鬼胡牌
                                    1,                              //4鬼加倍
                                    false,                          //不可鸡胡
                                    self8JiHu.isSelected(),         //可鸡胡
                                    self8Magendi.isSelected(),      //马跟底
                                    false,                          //马跟底对对胡
                                    false,                          //门清加分
                                    self8Bdjihu.isSelected(),       //百搭鸡胡
                                    self8Bddahu.isSelected(),        //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                bdhmj:
                                {
                                    playType:
                                    {
                                        bddahu: self8Bddahu.isSelected() ? 1:0,
                                        jihu: self8JiHu.isSelected() ? 1:0,
                                        bdjihu:self8Bdjihu.isSelected() ? 1:0,
                                        magendi:self8Magendi.isSelected() ? 1:0,
                                        wuhuahu: self8Wuhuahu.isSelected() ? 1:0,
                                        wuhuajiabei: self8Wuhuajiabei.isSelected() ? 1:0,
                                        wuhuajiama: self8Wuhuajiama.isSelected() ? 1:0,
                                        canHu7: self8CanHu7.isSelected() ? 1:0,
                                        canFan7: self8CanFan7.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self8Ma2.isSelected() ? 1:0,
                                        ma4: self8Ma4.isSelected() ? 1:0,
                                        ma6: self8Ma6.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self8Round4.isSelected() ? 1:0,
                                        round8: self8Round8.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["7"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                chshmj:
                {
                    self9CanDianPao: null,
                    self9MaDiFen:null,
                    self9HaiDiBei:null,
                    self9Ma2: null,
                    self9Ma4: null,
                    self9Ma6: null,
                    self9Round4: null,
                    self9Round8: null,
                    self9OK:null,

                    _run: function ()
                    {
                        gamemjs[8] = this;
                    },

                    playType:
                    {

                        candianpao:
                        {
                            _run: function ()
                            {
                                self9CanDianPao = this;
                            },
                            _click: function ()
                            {
                            }
                        },

                        difenma:
                        {

                            _run: function ()
                            {
                                self9MaDiFen = this;
                            },
                            _click: function ()
                            {
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self9MaDiFen.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 50;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },

                        hidifanbei:
                        {

                            _run: function ()
                            {
                                self9HaiDiBei = this;
                            },
                            _click: function ()
                            {
                            }
                        }
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self9Ma2 = this;
                            },
                            _click: function ()
                            {
                                self9Ma2.setSelected(true);
                                self9Ma2.setTouchEnabled(false);
                                self9Ma4.setSelected(false);
                                self9Ma4.setTouchEnabled(true);
                                self9Ma6.setSelected(false);
                                self9Ma6.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self9Ma4 = this;
                            },
                            _click: function ()
                            {
                                self9Ma2.setSelected(false);
                                self9Ma2.setTouchEnabled(true);
                                self9Ma4.setSelected(true);
                                self9Ma4.setTouchEnabled(false);
                                self9Ma6.setSelected(false);
                                self9Ma6.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self9Ma6 = this;
                            },
                            _click: function ()
                            {
                                self9Ma2.setSelected(false);
                                self9Ma2.setTouchEnabled(true);
                                self9Ma4.setSelected(false);
                                self9Ma4.setTouchEnabled(true);
                                self9Ma6.setSelected(true);
                                self9Ma6.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self9Round4 = this;
                            },

                            _click: function ()
                            {
                                self9Round4.setSelected(true);
                                self9Round4.setTouchEnabled(false);
                                self9Round8.setSelected(false);
                                self9Round8.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["8"] != null)
                                    return;

                                self9OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self9OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self9Round8 = this;
                            },
                            _click: function ()
                            {
                                self9Round4.setSelected(false);
                                self9Round4.setTouchEnabled(true);
                                self9Round8.setSelected(true);
                                self9Round8.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["8"] != null)
                                    return;

                                self9OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self9OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self9OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var isRound = self9Round4.isSelected();
                            var needMoney = isRound ? majiang.round4 : majiang.round8;
                            var haveMoney = jsclient.data.pinfo.money;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["8"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self9Ma2.isSelected())
                                horse = 2;
                            else if (self9Ma4.isSelected())
                                horse = 4;
                            else if (self9Ma6.isSelected())
                                horse = 6;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    8,                        //游戏类型
                                    isRound ? "round4" : "round8",//4局或8局
                                    false,                     //吃胡
                                    true,                      //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    true,                     //7
                                    false,                      //7加番
                                    false,                     //258
                                    false,                     //中为鬼牌
                                    false,                      //中为马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    false,                      //节节高
                                    false,                       //翻鬼
                                    false,                      //双鬼
                                    0,                           //番
                                    4,                          //人数
                                    false,                       //大胡
                                    false,                        //无鬼加码
                                    false,                        //无鬼翻倍
                                    false,                         //4鬼胡牌
                                    1,                             //4鬼加倍
                                    false,                       //不可鸡胡
                                    false,                      //可鸡胡
                                    self9MaDiFen.isSelected(),    //马跟底
                                    false,                         //马跟底对对胡
                                    false,                       //门清加分
                                    false,                          //百搭鸡胡
                                    false,                          //百搭大胡
                                    self9HaiDiBei.isSelected(),     //海底翻倍
                                    self9CanDianPao.isSelected(),    //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                chshmj:
                                {
                                    playType:
                                    {
                                        candianpao: self9CanDianPao.isSelected() ? 1:0,
                                        difenma: self9MaDiFen.isSelected() ? 1:0,
                                        hidifanbei:self9HaiDiBei.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self9Ma2.isSelected() ? 1:0,
                                        ma4: self9Ma4.isSelected() ? 1:0,
                                        ma6: self9Ma6.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self9Round4.isSelected() ? 1:0,
                                        round8: self9Round8.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["8"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                xgmj:
                {
                    self10Nozhong: null,
                    self10Zhong: null,
                    self10FanGui:null,
                    self10Nofeng: null,
                    self10Feng: null,
                    self10JJG: null,
                    self10Srmj:null,
                    self10MaDiFen:null,
                    self10DuiDuiHu:null,
                    self10Ma2: null,
                    self10Ma4: null,
                    self10Ma6: null,
                    self10Ma8: null,
                    self10Ma10: null,
                    self10Round4: null,
                    self10Round8: null,
                    self10Round16: null,
                    self10OK:null,

                    _run: function ()
                    {
                        gamemjs[9] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self10Nozhong = this;
                            },

                            _click: function ()
                            {
                                self10Zhong.setSelected(false);
                                self10Zhong.setTouchEnabled(true);
                                self10Nozhong.setSelected(true);
                                self10Nozhong.setTouchEnabled(false);
                                self10FanGui.setSelected(false);
                                self10FanGui.setTouchEnabled(true);
                            }
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self10Zhong = this;
                            },

                            _click: function ()
                            {
                                self10Zhong.setSelected(true);
                                self10Zhong.setTouchEnabled(false);
                                self10Nozhong.setSelected(false);
                                self10Nozhong.setTouchEnabled(true);
                                self10FanGui.setSelected(false);
                                self10FanGui.setTouchEnabled(true);
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self10FanGui = this;
                            },

                            _click: function ()
                            {
                                self10Zhong.setSelected(false);
                                self10Zhong.setTouchEnabled(true);
                                self10Nozhong.setSelected(false);
                                self10Nozhong.setTouchEnabled(true);
                                self10FanGui.setSelected(true);
                                self10FanGui.setTouchEnabled(false);
                            }
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self10Nofeng = this;
                            },

                            _click: function ()
                            {
                                self10Feng.setSelected(false);
                                self10Feng.setTouchEnabled(true);
                                self10Nofeng.setSelected(true);
                                self10Nofeng.setTouchEnabled(false);
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self10Feng = this;
                            },

                            _click: function ()
                            {
                                self10Feng.setSelected(true);
                                self10Feng.setTouchEnabled(false);
                                self10Nofeng.setSelected(false);
                                self10Nofeng.setTouchEnabled(true);
                            }
                        },

                        jjg:
                        {
                            _run: function ()
                            {
                                self10JJG = this;
                            },

                            _click: function ()
                            {
                            }
                        },

                        difenma:
                        {
                            _run: function ()
                            {
                                self10MaDiFen = this;
                            },

                            _click: function ()
                            {
                                if(self10DuiDuiHu.isSelected())
                                    self10DuiDuiHu.setSelected(false);
                            }
                        },

                        duiduihu:
                        {
                            _run: function ()
                            {
                                self10DuiDuiHu = this;
                            },

                            _click: function ()
                            {
                                if(!self10MaDiFen.isSelected())
                                    self10MaDiFen.setSelected(true);
                            },

                            help:
                            {
                                _click: function ()
                                {
                                    if(roomTipsPanel == null)
                                    {
                                        roomTipsPanel = new RoomTipsLayer();

                                        var pos = self3DuiDuiHu.convertToWorldSpace();
                                        roomTipsPanel.x = pos.x;
                                        roomTipsPanel.y = pos.y + 30;

                                        jsclient.creatrUI.addChild(roomTipsPanel);

                                        setRoomTipsStr("马跟底分:","中一个马在底分的基础上加倍。跟至对对胡：跟的底分最多6分。公式：底分+花+[（对对胡+花）×马]。");
                                    }
                                    else if(roomTipsPanel)
                                    {
                                        roomTipsPanel.removeFromParent();
                                        roomTipsPanel = null;
                                    }
                                },
                            }
                        },
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self10Ma2 = this;
                            },
                            _click: function ()
                            {
                                self10Ma2.setSelected(true);
                                self10Ma2.setTouchEnabled(false);
                                self10Ma4.setSelected(false);
                                self10Ma4.setTouchEnabled(true);
                                self10Ma6.setSelected(false);
                                self10Ma6.setTouchEnabled(true);
                                self10Ma8.setSelected(false);
                                self10Ma8.setTouchEnabled(true);
                                self10Ma10.setSelected(false);
                                self10Ma10.setTouchEnabled(true);
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self10Ma4 = this;
                            },
                            _click: function ()
                            {
                                self10Ma2.setSelected(false);
                                self10Ma2.setTouchEnabled(true);
                                self10Ma4.setSelected(true);
                                self10Ma4.setTouchEnabled(false);
                                self10Ma6.setSelected(false);
                                self10Ma6.setTouchEnabled(true);
                                self10Ma8.setSelected(false);
                                self10Ma8.setTouchEnabled(true);
                                self10Ma10.setSelected(false);
                                self10Ma10.setTouchEnabled(true);
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self10Ma6 = this;
                            },
                            _click: function ()
                            {
                                self10Ma2.setSelected(false);
                                self10Ma2.setTouchEnabled(true);
                                self10Ma4.setSelected(false);
                                self10Ma4.setTouchEnabled(true);
                                self10Ma6.setSelected(true);
                                self10Ma6.setTouchEnabled(false);
                                self10Ma8.setSelected(false);
                                self10Ma8.setTouchEnabled(true);
                                self10Ma10.setSelected(false);
                                self10Ma10.setTouchEnabled(true);
                            }
                        },

                        ma8:
                        {
                            _run: function ()
                            {
                                self10Ma8 = this;
                            },
                            _click: function ()
                            {
                                self10Ma2.setSelected(false);
                                self10Ma2.setTouchEnabled(true);
                                self10Ma4.setSelected(false);
                                self10Ma4.setTouchEnabled(true);
                                self10Ma6.setSelected(false);
                                self10Ma6.setTouchEnabled(true);
                                self10Ma8.setSelected(true);
                                self10Ma8.setTouchEnabled(false);
                                self10Ma10.setSelected(false);
                                self10Ma10.setTouchEnabled(true);
                            }
                        },

                        ma10:
                        {
                            _run: function ()
                            {
                                self10Ma10 = this;
                            },
                            _click: function ()
                            {
                                self10Ma2.setSelected(false);
                                self10Ma2.setTouchEnabled(true);
                                self10Ma4.setSelected(false);
                                self10Ma4.setTouchEnabled(true);
                                self10Ma6.setSelected(false);
                                self10Ma6.setTouchEnabled(true);
                                self10Ma8.setSelected(false);
                                self10Ma8.setTouchEnabled(true);
                                self10Ma10.setSelected(true);
                                self10Ma10.setTouchEnabled(false);
                            }
                        },
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self10Round4 = this;
                            },

                            _click: function ()
                            {
                                self10Round4.setSelected(true);
                                self10Round4.setTouchEnabled(false);
                                self10Round8.setSelected(false);
                                self10Round8.setTouchEnabled(true);
                                self10Round16.setSelected(false);
                                self10Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["9"] != null)
                                    return;

                                self10OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self10OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self10Round8 = this;
                            },
                            _click: function ()
                            {
                                self10Round4.setSelected(false);
                                self10Round4.setTouchEnabled(true);
                                self10Round8.setSelected(true);
                                self10Round8.setTouchEnabled(false);
                                self10Round16.setSelected(false);
                                self10Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                    return;

                                self10OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self10OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        },

                        round16:
                        {
                            _run: function ()
                            {
                                self10Round16 = this;
                            },
                            _click: function ()
                            {
                                self10Round4.setSelected(false);
                                self10Round4.setTouchEnabled(true);
                                self10Round8.setSelected(false);
                                self10Round8.setTouchEnabled(true);
                                self10Round16.setSelected(true);
                                self10Round16.setTouchEnabled(false);

                                if(jsclient.freeGames && jsclient.freeGames["9"] != null)
                                    return;

                                self10OK.loadTextureNormal("res/createRoomNew/queding_5.png");
                                self10OK.loadTexturePressed("res/createRoomNew/queding_5_press.png");
                            }
                        }
                    },

                    renshu:
                    {
                        srmj:
                        {
                            _run: function ()
                            {
                                self10Srmj = this;
                            },

                            _click:function()
                            {
                                // text = self10Srmj.getChildByName("Text_1");
                                // if(self10Srmj.isSelected())
                                // {
                                //     text.setTextColor(cc.color(242,61,5));
                                // }
                                // else
                                // {
                                //     text.setTextColor(cc.color(108,37,20));
                                // }
                            }
                        }
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self10OK = this;
                        },
                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var haveMoney = jsclient.data.pinfo.money;

                            var isRound = "round4";
                            if(self10Round4.isSelected())
                                isRound = "round4";
                            else if(self10Round8.isSelected())
                                isRound = "round8";
                            else if(self10Round16.isSelected())
                                isRound = "round16";

                            var needMoney = majiang.round4;
                            if(self10Round4.isSelected())
                                needMoney = majiang.round4;
                            else if(self10Round8.isSelected())
                                needMoney = majiang.round8;
                            else if(self10Round16.isSelected())
                                needMoney = majiang.round16;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["9"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self10Ma2.isSelected())
                                horse = 2;
                            else if (self10Ma4.isSelected())
                                horse = 4;
                            else if (self10Ma6.isSelected())
                                horse = 6;
                            else if (self10Ma8.isSelected())
                                horse = 8;
                            else if (self10Ma10.isSelected())
                                horse = 10;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    9,                        //游戏类型
                                    isRound,                   //4局或8局
                                    false,                     //吃胡
                                    self10Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    true,                       //7
                                    false,                      //7加番
                                    false,                     //258
                                    self10Zhong.isSelected(),    //鬼牌
                                    false,                      //中为马
                                    horse,                     //几匹马
                                    false,                      //爆炸马
                                    self10JJG.isSelected(),      //节节高
                                    self10FanGui.isSelected(),    //翻鬼
                                    false,                      //双鬼
                                    0,                            //番
                                    self10Srmj.isSelected() ? 3 : 4,//人数
                                    false,                       //大胡
                                    true,                        //无鬼加码
                                    false,                        //无鬼翻倍
                                    true,                         //4鬼胡牌
                                    1,                            //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                      //可鸡胡
                                    self10MaDiFen.isSelected(),    //马跟底
                                    self10DuiDuiHu.isSelected(),  //马跟底对对胡
                                    false,                          //门清加分
                                    false,                          //百搭鸡胡
                                    false,                           //百搭大胡
                                    false,                           //海底翻倍(潮汕)
                                    false,                           //可点炮(潮汕)

                                    false,                           //白板鬼牌
                                    false,                          //跟庄
                                    false,                          //荒庄算杠
                                    false,                          //杠爆全包

                                    0,                              //杠爆2倍
                                    0,                              //海底胡2倍
                                    0,                              //碰碰胡翻倍
                                    0,                              //清一色倍
                                    0,                              //十三幺倍
                                    0,                              //幺九倍
                                    0,                              //字一色倍
                                    0                               //七小对翻倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                xgmj:
                                {
                                    playType:
                                    {
                                        nozhong: self10Nozhong.isSelected() ? 1:0,
                                        zhong: self10Zhong.isSelected() ? 1:0,
                                        fangui:self10FanGui.isSelected() ? 1:0,
                                        nofeng: self10Nofeng.isSelected() ? 1:0,
                                        feng: self10Feng.isSelected() ? 1:0,
                                        difenma: self10MaDiFen.isSelected() ? 1:0,
                                        duiduihu:self10DuiDuiHu.isSelected() ? 1:0,
                                        jjg:self10JJG.isSelected() ? 1:0,
                                    },

                                    horse:
                                    {
                                        ma2: self10Ma2.isSelected() ? 1:0,
                                        ma4: self10Ma4.isSelected() ? 1:0,
                                        ma6: self10Ma6.isSelected() ? 1:0,
                                        ma8: self10Ma8.isSelected() ? 1:0,
                                        ma10: self10Ma10.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self10Round4.isSelected() ? 1:0,
                                        round8: self10Round8.isSelected() ? 1:0,
                                        round16: self10Round16.isSelected() ? 1:0,
                                    },

                                    renshu:
                                    {
                                        srmj:self10Srmj.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["9"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },

                zptdhmj:
                {
                    //局数
                    self11Round4: null,
                    self11Round8: null,
                    // self11Round16: null,

                    //鬼牌
                    self11Nozhong: null,
                    self11Zhong: null,
                    self11BaiBan: null,
                    self11FanGui:null,
                    self11ShuangGui:null,

                    //玩法
                    self11Nofeng: null,
                    self11Feng: null,
                    self11NoGuiHu:null,
                    self11NoGuiBei:null,
                    self11NoGuiMa:null,
                    self11GenZhuang:null,
                    self11JJG:null,

                    //牌型
                    self11hdh2b:null,
                    self11gbqb:null,
                    self11gb2b:null,
                    self11hzhsg:null,
                    self11pph2b:null,
                    self11qys4b:null,
                    self11qxd4b:null,
                    self11shsy8b:null,
                    self11yj6b:null,
                    self11zys8b:null,

                    //人数
                    self11Srmj:null,

                    //买马
                    self11Ma2: null,
                    self11Ma4: null,
                    self11Ma6: null,
                    self11Ma8: null,
                    self11Ma10: null,
                    self11MaBom: null,

                    self11OK:null,

                    _run: function ()
                    {
                        gamemjs[10] = this;
                    },

                    playType:
                    {
                        nozhong:
                        {
                            _run: function ()
                            {
                                self11Nozhong = this;
                            },

                            _click: function ()
                            {
                                // self11Nozhong.setSelected(true);
                                self11Nozhong.setTouchEnabled(false);
                                text = self11Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Zhong.setSelected(false);
                                self11Zhong.setTouchEnabled(true);
                                text = self11Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11BaiBan.setSelected(false);
                                self11BaiBan.setTouchEnabled(true);
                                text = self11BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11FanGui.setSelected(false);
                                self11FanGui.setTouchEnabled(true);
                                text = self11FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11ShuangGui.setSelected(false);
                                self11ShuangGui.setTouchEnabled(true);
                                text = self11ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                self11NoGuiHu.setSelected(false);
                                self11NoGuiHu.setTouchEnabled(true);
                                text = self11NoGuiHu.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11NoGuiBei.setSelected(false);
                                self11NoGuiBei.setTouchEnabled(true);
                                text = self11NoGuiBei.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11NoGuiMa.setSelected(false);
                                self11NoGuiMa.setTouchEnabled(true);
                                text = self11NoGuiMa.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        zhong:
                        {
                            _run: function ()
                            {
                                self11Zhong = this;
                            },

                            _click: function ()
                            {
                                self11Nozhong.setSelected(false);
                                self11Nozhong.setTouchEnabled(true);
                                text = self11Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Zhong.setSelected(true);
                                self11Zhong.setTouchEnabled(false);
                                text = self11Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11BaiBan.setSelected(false);
                                self11BaiBan.setTouchEnabled(true);
                                text = self11BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11FanGui.setSelected(false);
                                self11FanGui.setTouchEnabled(true);
                                text = self11FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11ShuangGui.setSelected(false);
                                self11ShuangGui.setTouchEnabled(true);
                                text = self11ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self11NoGuiHu.setSelected(true);
                                // self11NoGuiHu.setTouchEnabled(false);
                                // text = self11NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self11NoGuiBei.setSelected(false);
                                // self11NoGuiBei.setTouchEnabled(true);
                                // text = self11NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self11NoGuiMa.setSelected(false);
                                // self11NoGuiMa.setTouchEnabled(true);
                                // text = self11NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        baiban:
                        {
                            _run: function ()
                            {
                                self11BaiBan = this;
                            },

                            _click: function ()
                            {
                                self11Nozhong.setSelected(false);
                                self11Nozhong.setTouchEnabled(true);
                                text = self11Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Zhong.setSelected(false);
                                self11Zhong.setTouchEnabled(true);
                                text = self11Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11BaiBan.setSelected(true);
                                self11BaiBan.setTouchEnabled(false);
                                text = self11BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11FanGui.setSelected(false);
                                self11FanGui.setTouchEnabled(true);
                                text = self11FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11ShuangGui.setSelected(false);
                                self11ShuangGui.setTouchEnabled(true);
                                text = self11ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self11NoGuiHu.setSelected(true);
                                // self11NoGuiHu.setTouchEnabled(false);
                                // text = self11NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self11NoGuiBei.setSelected(false);
                                // self11NoGuiBei.setTouchEnabled(true);
                                // text = self11NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self11NoGuiMa.setSelected(false);
                                // self11NoGuiMa.setTouchEnabled(true);
                                // text = self11NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        fangui:
                        {
                            _run: function ()
                            {
                                self11FanGui = this;
                            },

                            _click: function ()
                            {
                                self11Nozhong.setSelected(false);
                                self11Nozhong.setTouchEnabled(true);
                                text = self11Nozhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Zhong.setSelected(false);
                                self11Zhong.setTouchEnabled(true);
                                text = self11Zhong.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11BaiBan.setSelected(false);
                                self11BaiBan.setTouchEnabled(true);
                                text = self11BaiBan.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11FanGui.setSelected(true);
                                self11FanGui.setTouchEnabled(false);
                                text = self11FanGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11ShuangGui.setSelected(false);
                                self11ShuangGui.setTouchEnabled(true);
                                text = self11ShuangGui.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                //无鬼胡
                                // self11NoGuiHu.setSelected(true);
                                // self11NoGuiHu.setTouchEnabled(false);
                                // text = self11NoGuiHu.getChildByName("Text_1");
                                // text.setTextColor(cc.color(242,61,5));
                                //
                                // self11NoGuiBei.setSelected(false);
                                // self11NoGuiBei.setTouchEnabled(true);
                                // text = self11NoGuiBei.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                                //
                                // self11NoGuiMa.setSelected(false);
                                // self11NoGuiMa.setTouchEnabled(true);
                                // text = self11NoGuiMa.getChildByName("Text_1");
                                // text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        shuanggui:
                        {
                            _run: function ()
                            {
                                self11ShuangGui = this;
                            },

                            _click: function ()
                            {
                                text = self11ShuangGui.getChildByName("Text_1");
                                if(self11ShuangGui.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                if(self11FanGui.isSelected() == false)
                                {
                                    self11Nozhong.setSelected(false);
                                    self11Nozhong.setTouchEnabled(true);
                                    text = self11Nozhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self11Zhong.setSelected(false);
                                    self11Zhong.setTouchEnabled(true);
                                    text = self11Zhong.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self11BaiBan.setSelected(false);
                                    self11BaiBan.setTouchEnabled(true);
                                    text = self11BaiBan.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self11FanGui.setSelected(true);
                                    self11FanGui.setTouchEnabled(false);
                                    text = self11FanGui.getChildByName("Text_1");
                                    text.setTextColor(cc.color(242,61,5));

                                    //无鬼胡
                                    // self11NoGuiHu.setSelected(true);
                                    // self11NoGuiHu.setTouchEnabled(false);
                                    // text = self11NoGuiHu.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(242,61,5));
                                    //
                                    // self11NoGuiBei.setSelected(false);
                                    // self11NoGuiBei.setTouchEnabled(true);
                                    // text = self11NoGuiBei.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(108,37,20));
                                    //
                                    // self11NoGuiMa.setSelected(false);
                                    // self11NoGuiMa.setTouchEnabled(true);
                                    // text = self11NoGuiMa.getChildByName("Text_1");
                                    // text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        nofeng:
                        {
                            _run: function ()
                            {
                                self11Nofeng = this;
                            },

                            _click: function ()
                            {
                                self11Feng.setSelected(false);
                                self11Feng.setTouchEnabled(true);
                                text = self11Feng.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Nofeng.setSelected(true);
                                self11Nofeng.setTouchEnabled(false);
                                text = self11Nofeng.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));
                            }
                        },

                        feng:
                        {
                            _run: function ()
                            {
                                self11Feng = this;
                            },

                            _click: function ()
                            {
                                // self11Feng.setSelected(true);
                                self11Feng.setTouchEnabled(false);
                                text = self11Feng.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Nofeng.setSelected(false);
                                self11Nofeng.setTouchEnabled(true);
                                text = self11Nofeng.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        noguihu:
                        {
                            _run: function ()
                            {
                                self11NoGuiHu = this;
                            },

                            _click: function ()
                            {
                                text = self11NoGuiHu.getChildByName("Text_1");
                                if(self11NoGuiHu.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self11Nozhong.isSelected())
                                    {
                                        self11Nozhong.setSelected(false);
                                        self11Nozhong.setTouchEnabled(true);
                                        text = self11Nozhong.getChildByName("Text_1");
                                        text.setTextColor(cc.color(108,37,20));

                                        self11Zhong.setSelected(true);
                                        self11Zhong.setTouchEnabled(false);
                                        text = self11Zhong.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }

                                    if(!self11NoGuiMa.isSelected() && !self11NoGuiBei.isSelected())
                                    {
                                        self11NoGuiMa.setSelected(true);
                                        // self11NoGuiMa.setTouchEnabled(false);
                                        text = self11NoGuiMa.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    self11NoGuiMa.setSelected(false);
                                    // self11NoGuiMa.setTouchEnabled(false);
                                    text = self11NoGuiMa.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self11NoGuiBei.setSelected(false);
                                    // self11NoGuiBei.setTouchEnabled(false);
                                    text = self11NoGuiBei.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        noguibei:
                        {
                            _run: function ()
                            {
                                self11NoGuiBei = this;
                            },

                            _click: function ()
                            {
                                text = self11NoGuiBei.getChildByName("Text_1");
                                if(self11NoGuiBei.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self11NoGuiHu.isSelected() == false)
                                    {
                                        self11NoGuiHu.setSelected(true);
                                        // self11NoGuiHu.setTouchEnabled(false);
                                        text = self11NoGuiHu.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));

                                        if(self11Nozhong.isSelected())
                                        {
                                            self11Nozhong.setSelected(false);
                                            self11Nozhong.setTouchEnabled(true);
                                            text = self11Nozhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));

                                            self11Zhong.setSelected(true);
                                            self11Zhong.setTouchEnabled(false);
                                            text = self11Zhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(242,61,5));
                                        }
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    if(!self11NoGuiMa.isSelected())
                                    {
                                        self11NoGuiMa.setSelected(true);
                                        // self11NoGuiMa.setTouchEnabled(false);
                                        text = self11NoGuiMa.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                            }
                        },

                        noguima:
                        {
                            _run: function ()
                            {
                                self11NoGuiMa = this;
                            },

                            _click: function ()
                            {
                                text = self11NoGuiMa.getChildByName("Text_1");
                                if(self11NoGuiMa.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));

                                    if(self11NoGuiHu.isSelected() == false)
                                    {
                                        self11NoGuiHu.setSelected(true);
                                        self11NoGuiHu.setTouchEnabled(false);
                                        text = self11NoGuiHu.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));

                                        if(self11Nozhong.isSelected())
                                        {
                                            self11Nozhong.setSelected(false);
                                            self11Nozhong.setTouchEnabled(true);
                                            text = self11Nozhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(108,37,20));

                                            self11Zhong.setSelected(true);
                                            self11Zhong.setTouchEnabled(false);
                                            text = self11Zhong.getChildByName("Text_1");
                                            text.setTextColor(cc.color(242,61,5));

                                        }
                                    }
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));

                                    if(!self11NoGuiBei.isSelected())
                                    {
                                        self11NoGuiBei.setSelected(true);
                                        // self11NoGuiBei.setTouchEnabled(false);
                                        text = self11NoGuiBei.getChildByName("Text_1");
                                        text.setTextColor(cc.color(242,61,5));
                                    }
                                }
                            }
                        },

                        genzhuang:
                        {
                            _run: function ()
                            {
                                self11GenZhuang = this;
                            },

                            _click:function()
                            {
                                text = self11GenZhuang.getChildByName("Text_1");
                                if(self11GenZhuang.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        jjg:
                        {
                            _run: function ()
                            {
                                self11JJG = this;
                            },

                            _click:function()
                            {
                                text = self11JJG.getChildByName("Text_1");
                                if(self11JJG.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }

                                if(self11MaBom.isSelected())
                                {
                                    self11MaBom.setSelected(false);
                                    self11MaBom.setTouchEnabled(true);
                                    text = self11MaBom.getChildByName("Text_1");
                                    text.setTextColor(cc.color(108,37,20));

                                    self11Ma2.setSelected(true);
                                    self11Ma2.setTouchEnabled(false);
                                    text = self11Ma2.getChildByName("Text_1");
                                    text.setTextColor(cc.color(242,61,5));
                                }
                            }
                        },


                        //牌型
                        hdh2b:
                        {
                            _run: function ()
                            {
                                self11hdh2b = this;
                            },

                            _click:function()
                            {
                                text = self11hdh2b.getChildByName("Text_1");
                                if(self11hdh2b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        gbqb:
                        {
                            _run: function ()
                            {
                                self11gbqb = this;
                            },

                            _click:function()
                            {
                                text = self11gbqb.getChildByName("Text_1");
                                if(self11gbqb.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        gb2b:
                        {
                            _run: function ()
                            {
                                self11gb2b = this;
                            },

                            _click:function()
                            {
                                text = self11gb2b.getChildByName("Text_1");
                                if(self11gb2b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        hzhsg:
                        {
                            _run: function ()
                            {
                                self11hzhsg = this;
                            },

                            _click:function()
                            {
                                text = self11hzhsg.getChildByName("Text_1");
                                if(self11hzhsg.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        pph2b:
                        {
                            _run: function ()
                            {
                                self11pph2b = this;
                            },

                            _click:function()
                            {
                                text = self11pph2b.getChildByName("Text_1");
                                if(self11pph2b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        qys4b:
                        {
                            _run: function ()
                            {
                                self11qys4b = this;
                            },

                            _click:function()
                            {
                                text = self11qys4b.getChildByName("Text_1");
                                if(self11qys4b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        qxd4b:
                        {
                            _run: function ()
                            {
                                self11qxd4b = this;
                            },

                            _click:function()
                            {
                                text = self11qxd4b.getChildByName("Text_1");
                                if(self11qxd4b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        ssy8b:
                        {
                            _run: function ()
                            {
                                self11shsy8b = this;
                            },

                            _click:function()
                            {
                                text = self11shsy8b.getChildByName("Text_1");
                                if(self11shsy8b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        yj6b:
                        {
                            _run: function ()
                            {
                                self11yj6b = this;
                            },

                            _click:function()
                            {
                                text = self11yj6b.getChildByName("Text_1");
                                if(self11yj6b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },

                        zys8b:
                        {
                            _run: function ()
                            {
                                self11zys8b = this;
                            },

                            _click:function()
                            {
                                text = self11zys8b.getChildByName("Text_1");
                                if(self11zys8b.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        },
                    },

                    renshu:
                    {
                        srmj:
                        {
                            _run: function ()
                            {
                                self11Srmj = this;
                            },

                            _click:function()
                            {
                                text = self11Srmj.getChildByName("Text_1");
                                if(self11Srmj.isSelected())
                                {
                                    text.setTextColor(cc.color(242,61,5));
                                }
                                else
                                {
                                    text.setTextColor(cc.color(108,37,20));
                                }
                            }
                        }
                    },

                    horse:
                    {
                        ma2:
                        {
                            _run: function ()
                            {
                                self11Ma2 = this;
                            },
                            _click: function ()
                            {
                                // self11Ma2.setSelected(true);
                                self11Ma2.setTouchEnabled(false);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Ma4.setSelected(false);
                                self11Ma4.setTouchEnabled(true);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma6.setSelected(false);
                                self11Ma6.setTouchEnabled(true);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma8.setSelected(false);
                                self11Ma8.setTouchEnabled(true);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma10.setSelected(false);
                                self11Ma10.setTouchEnabled(true);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11MaBom.setSelected(false);
                                self11MaBom.setTouchEnabled(true);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma4:
                        {
                            _run: function ()
                            {
                                self11Ma4 = this;
                            },

                            _click: function ()
                            {
                                self11Ma2.setSelected(false);
                                self11Ma2.setTouchEnabled(true);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Ma4.setSelected(true);
                                self11Ma4.setTouchEnabled(false);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Ma6.setSelected(false);
                                self11Ma6.setTouchEnabled(true);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma8.setSelected(false);
                                self11Ma8.setTouchEnabled(true);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma10.setSelected(false);
                                self11Ma10.setTouchEnabled(true);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11MaBom.setSelected(false);
                                self11MaBom.setTouchEnabled(true);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma6:
                        {
                            _run: function ()
                            {
                                self11Ma6 = this;
                            },

                            _click: function ()
                            {
                                self11Ma2.setSelected(false);
                                self11Ma2.setTouchEnabled(true);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma4.setSelected(false);
                                self11Ma4.setTouchEnabled(true);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Ma6.setSelected(true);
                                self11Ma6.setTouchEnabled(false);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Ma8.setSelected(false);
                                self11Ma8.setTouchEnabled(true);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma10.setSelected(false);
                                self11Ma10.setTouchEnabled(true);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11MaBom.setSelected(false);
                                self11MaBom.setTouchEnabled(true);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma8:
                        {
                            _run: function ()
                            {
                                self11Ma8 = this;
                            },

                            _click: function ()
                            {
                                self11Ma2.setSelected(false);
                                self11Ma2.setTouchEnabled(true);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma4.setSelected(false);
                                self11Ma4.setTouchEnabled(true);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma6.setSelected(false);
                                self11Ma6.setTouchEnabled(true);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma8.setSelected(true);
                                self11Ma8.setTouchEnabled(false);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Ma10.setSelected(false);
                                self11Ma10.setTouchEnabled(true);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11MaBom.setSelected(false);
                                self11MaBom.setTouchEnabled(true);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        ma10:
                        {
                            _run: function ()
                            {
                                self11Ma10 = this;
                            },

                            _click: function ()
                            {
                                self11Ma2.setSelected(false);
                                self11Ma2.setTouchEnabled(true);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma4.setSelected(false);
                                self11Ma4.setTouchEnabled(true);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma6.setSelected(false);
                                self11Ma6.setTouchEnabled(true);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma8.setSelected(false);
                                self11Ma8.setTouchEnabled(true);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Ma10.setSelected(true);
                                self11Ma10.setTouchEnabled(false);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11MaBom.setSelected(false);
                                self11MaBom.setTouchEnabled(true);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        },

                        mabaozha:
                        {

                            _run:function ()
                            {
                                self11MaBom = this;
                            },

                            _click: function ()
                            {
                                self11Ma2.setSelected(false);
                                self11Ma2.setTouchEnabled(true);
                                text = self11Ma2.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma4.setSelected(false);
                                self11Ma4.setTouchEnabled(true);
                                text = self11Ma4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma6.setSelected(false);
                                self11Ma6.setTouchEnabled(true);
                                text = self11Ma6.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma8.setSelected(false);
                                self11Ma8.setTouchEnabled(true);
                                text = self11Ma8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                self11Ma10.setSelected(false);
                                self11Ma10.setTouchEnabled(true);
                                text = self11Ma10.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11MaBom.setSelected(true);
                                self11MaBom.setTouchEnabled(false);
                                text = self11MaBom.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11JJG.setSelected(false);
                                self11JJG.setTouchEnabled(true);
                                text = self11JJG.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));
                            }
                        }
                    },

                    round:
                    {
                        round4:
                        {
                            _run: function ()
                            {
                                self11Round4 = this;
                            },

                            _click: function ()
                            {
                                // self11Round4.setSelected(true);
                                self11Round4.setTouchEnabled(false);
                                text = self11Round4.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                self11Round8.setSelected(false);
                                self11Round8.setTouchEnabled(true);
                                text = self11Round8.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Round16.setSelected(false);
                                // self11Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                    return;

                                self11OK.loadTextureNormal("res/createRoomNew/queding_2.png");
                                self11OK.loadTexturePressed("res/createRoomNew/queding_2_press.png");
                            }
                        },

                        round8:
                        {
                            _run: function ()
                            {
                                self11Round8 = this;
                            },

                            _click: function ()
                            {
                                self11Round4.setSelected(false);
                                self11Round4.setTouchEnabled(true);
                                text = self11Round4.getChildByName("Text_1");
                                text.setTextColor(cc.color(108,37,20));

                                // self11Round8.setSelected(true);
                                self11Round8.setTouchEnabled(false);
                                text = self11Round8.getChildByName("Text_1");
                                text.setTextColor(cc.color(242,61,5));

                                // self11Round16.setSelected(false);
                                // self11Round16.setTouchEnabled(true);

                                if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                    return;

                                self11OK.loadTextureNormal("res/createRoomNew/queding_3.png");
                                self11OK.loadTexturePressed("res/createRoomNew/queding_3_press.png");
                            }
                        },
                    },

                    //创建,判断金钱
                    yes:
                    {
                        _run:function ()
                        {
                            self11OK = this;
                        },

                        _click: function (btn, evt)
                        {
                            var majiang = jsclient.data.gameInfo.gdmj;
                            var haveMoney = jsclient.data.pinfo.money;

                            var isRound = "round4";
                            if(self11Round4.isSelected())
                                isRound = "round4";
                            else if(self11Round8.isSelected())
                                isRound = "round8";

                            var needMoney = majiang.round4;
                            if(self11Round4.isSelected())
                                needMoney = majiang.round4;
                            else if(self11Round8.isSelected())
                                needMoney = majiang.round8;

                            //免费
                            if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                needMoney = 0;

                            var horse = 2;
                            if (self11Ma2.isSelected())
                                horse = 2;
                            else if (self11Ma4.isSelected())
                                horse = 4;
                            else if (self11Ma6.isSelected())
                                horse = 6;
                            else if (self11Ma8.isSelected())
                                horse = 8;
                            else if (self11Ma10.isSelected())
                                horse = 10;
                            else if(self11MaBom.isSelected())
                                horse = 1;

                            if (haveMoney >= needMoney)
                            {
                                jsclient.createRoom(
                                    10,                        //游戏类型
                                    isRound,                  //4局或8局
                                    false,                     //吃胡
                                    self11Feng.isSelected(),     //带风
                                    false,                     //吃
                                    true,                      //无效参数
                                    false,                     //7
                                    false,                    //7对加番
                                    false,                     //258
                                    self11Zhong.isSelected(),    //红中鬼牌
                                    false,                      //红中为马
                                    horse,                     //几匹马
                                    self11MaBom.isSelected(),   //爆炸马
                                    self11JJG.isSelected(),     //节节高
                                    self11FanGui.isSelected(),   //翻鬼
                                    self11ShuangGui.isSelected(),//双鬼
                                    0,                          //番
                                    self11Srmj.isSelected() ? 3 : 4,//人数
                                    false,                       //大胡
                                    self11NoGuiMa.isSelected(),  //无鬼加码
                                    self11NoGuiBei.isSelected(),   //无鬼翻倍
                                    true,                         //4鬼胡牌
                                    1,                            //4鬼加倍
                                    false,                        //不可鸡胡
                                    false,                        //可鸡胡
                                    false,                        //马跟底
                                    false,                        //马跟底对对胡
                                    false,                        //门清加分
                                    false,                        //百搭鸡胡
                                    false,                        //百搭大胡
                                    false,                        //海底翻倍(潮汕)
                                    false,                        //可点炮(潮汕)

                                    self11BaiBan.isSelected(),      //白板鬼牌
                                    self11GenZhuang.isSelected(),    //跟庄
                                    self11hzhsg.isSelected(),        //荒庄算杠
                                    self11gbqb.isSelected(),          //杠爆全包

                                    self11gb2b.isSelected() ? 2 : 0, //杠爆2倍
                                    self11hdh2b.isSelected() ? 2 : 0,//海底胡2倍
                                    self11pph2b.isSelected() ? 2 : 0,//碰碰胡2倍
                                    self11qys4b.isSelected() ? 4 : 0,//清一色4倍
                                    self11shsy8b.isSelected() ? 8 : 0,//十三幺8倍
                                    self11yj6b.isSelected() ? 6 : 0, //幺九6倍
                                    self11zys8b.isSelected() ? 8 : 0, //字一色8倍
                                    self11qxd4b.isSelected() ? 4 : 0  //七小对4倍
                                );
                            }
                            else
                            {
                                jsclient.uiPara = {lessMoney: true};
                                jsclient.Scene.addChild(new PayLayer());
                            }

                            var roomCfg =
                            {
                                zptdhmj:
                                {
                                    playType:
                                    {
                                        nozhong: self11Nozhong.isSelected() ? 1:0,
                                        zhong: self11Zhong.isSelected() ? 1:0,
                                        baiban: self11BaiBan.isSelected() ? 1:0,
                                        fangui:self11FanGui.isSelected() ? 1:0,
                                        shuanggui:self11ShuangGui.isSelected() ? 1:0,
                                        nofeng: self11Nofeng.isSelected() ? 1:0,
                                        feng: self11Feng.isSelected() ? 1:0,
                                        jjg:self11JJG.isSelected() ? 1:0,
                                        genzhuang:self11GenZhuang.isSelected() ? 1:0,
                                        noguihu:self11NoGuiHu.isSelected() ? 1:0,
                                        noguibei:self11NoGuiBei.isSelected() ? 1:0,
                                        noguima:self11NoGuiMa.isSelected() ? 1:0,

                                        hzhsg:self11hzhsg.isSelected() ? 1:0,
                                        gb2b:self11gb2b.isSelected() ? 1:0,
                                        gbqb:self11gbqb.isSelected() ? 1:0,
                                        hdh2b:self11hdh2b.isSelected() ? 1:0,
                                        pph2b:self11pph2b.isSelected() ? 1:0,
                                        qys4b:self11qys4b.isSelected() ? 1:0,
                                        qxd4b:self11qxd4b.isSelected() ? 1:0,
                                        ssy8b:self11shsy8b.isSelected() ? 1:0,
                                        yj6b:self11yj6b.isSelected() ? 1:0,
                                        zys8b:self11zys8b.isSelected() ? 1:0,
                                    },

                                    renshu:
                                    {
                                        srmj:self11Srmj.isSelected() ? 1:0
                                    },

                                    horse:
                                    {
                                        mabaozha: self11MaBom.isSelected() ? 1:0,
                                        ma2: self11Ma2.isSelected() ? 1:0,
                                        ma4: self11Ma4.isSelected() ? 1:0,
                                        ma6: self11Ma6.isSelected() ? 1:0,
                                        ma8: self11Ma8.isSelected() ? 1:0,
                                        ma10: self11Ma10.isSelected() ? 1:0,
                                    },

                                    round:
                                    {
                                        round4: self11Round4.isSelected() ? 1:0,
                                        round8: self11Round8.isSelected() ? 1:0,
                                        // round16: self11Round16.isSelected() ? 1:0,
                                    }
                                }

                            };

                            writeCreateRoomCfg(roomCfg);
                            // createui.removeFromParent(true);
                            createui.visible = false;
                        },

                        _event:
                        {
                            freeGameType:function(roomCfg)
                            {
                                if(jsclient.freeGames && jsclient.freeGames["10"] != null)
                                {
                                    this.loadTextureNormal("res/dissolveRoomNew/btn_confirm_normal.png");
                                    this.loadTexturePressed("res/dissolveRoomNew/btn_confirm_press.png");
                                }
                            },
                        }
                    },
                },
            }
        },

        ctor:function ()
        {
            this._super();
            var jsonui = ccs.load(res.Create_json);
            ConnectUI2Logic(jsonui.node, this.jsBind);
            this.addChild(jsonui.node);
            createui = this;
            setPanelContentByType(1);

            setCreateRoomSelected(this);
            jsclient.creatrUI = this;

            return true;
        }
    });


    //选项提示界面
    var table, content = null;

    function setRoomTipsStr(tableStr, contentStr)
    {
        if(table == null)
            return;

        if(content == null)
            return;

        table.setString(tableStr);
        content.setString(contentStr);
    }

    var RoomTipsLayer = cc.Layer.extend(
    {
        jsBind:
        {
            shield:
            {
                _touch:function(btn,eT)
                {
                    if(eT == 2)
                    {
                        if(roomTipsPanel)
                        {
                            roomTipsPanel.removeFromParent();
                            roomTipsPanel = null;
                        }
                    }
                    else if(eT == 3)
                    {
                        if(roomTipsPanel)
                        {
                            roomTipsPanel.removeFromParent();
                            roomTipsPanel = null;
                        }
                    }
                }
            },

            back:
            {
                table:
                {
                    _run:function()
                    {
                        table = this;
                    }
                },

                content:
                {
                    _run:function()
                    {
                        content = this;
                    }
                }
            },
        },

        ctor:function ()
        {
            this._super();
            var jsonui = ccs.load(res.RoomTips_json);
            ConnectUI2Logic(jsonui.node, this.jsBind);
            this.addChild(jsonui.node);

            return true;
        }
    });
})();


