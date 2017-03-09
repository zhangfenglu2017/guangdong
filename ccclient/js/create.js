//Jian
//2016年7月14日 17:13:28
//创建房间


(function () {

    var tables = [];
    var gamemjs = [];
    //0 没有，1广州，2惠州，3深圳，4鸡平胡
    tables[0] = null;
    gamemjs[0] = null;

    function setPanelContentByType(type) {
        var gameType = type;

        for(var i = 1; i < tables.length; i++)
        {
            var gameTable = tables[i];
            var game = gamemjs[i];

            if(i == gameType)
            {
                gameTable.setBright(false);
                gameTable.setEnabled(false);
                gameTable.setTouchEnabled(false);
                gameTable.setVisible(false);

                log("当前游戏类型：" + gameType);
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

    CreateLayer = cc.Layer.extend(
        {
            jsBind: {
                //背景
                block: {
                    _layout: [[0, 1], [0.5, 0.5], [0, 0]],
                },

                //返回
                close: {
                    _layout: [[0.1, 0.1], [0.95, 0.95], [0, 0]],
                    _click: function () {
                        createui.removeFromParent(true);
                    }
                },

                //标题
                table: {
                    _layout: [[0.8, 0.8], [0.05, 0.52], [0, 0]],
                },

                //内容
                back: {
                    _layout: [[0.9, 1], [0.54, 0.47], [0, 0], 3],

                    gdmjtable: {
                        _run: function () {
                            tables[1] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(1);
                        }
                    },

                    hzhmjtable: {
                        _run: function () {
                            tables[2] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(2);
                        }
                    },

                    shzhmjtable: {
                        _run: function () {
                            tables[3] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(3);
                        }
                    },

                    jphmjtable: {
                        _run: function () {
                            tables[4] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(4);
                        }
                    },

                    gdmj: {
                        self1Nozhong: null,
                        self1Zhong: null,
                        self1FanGui:null,
                        self1Nofeng: null,
                        self1Feng: null,
                        self1CanHu7: null,
                        self1Ma2: null,
                        self1Ma4: null,
                        self1Ma6: null,
                        self1Round4: null,
                        self1Round8: null,

                        _run: function () {
                            gamemjs[1] = this;
                        },

                        playType: {
                            nozhong: {
                                _run: function () {
                                    self1Nozhong = this;
                                },

                                _click: function () {
                                    self1Zhong.setSelected(false);
                                    self1Zhong.setTouchEnabled(true);
                                    self1Nozhong.setSelected(true);
                                    self1Nozhong.setTouchEnabled(false);
                                    self1FanGui.setSelected(false);
                                    self1FanGui.setTouchEnabled(true);
                                }
                            },

                            zhong: {
                                _run: function () {
                                    self1Zhong = this;
                                },

                                _click: function () {
                                    self1Zhong.setSelected(true);
                                    self1Zhong.setTouchEnabled(false);
                                    self1Nozhong.setSelected(false);
                                    self1Nozhong.setTouchEnabled(true);
                                    self1FanGui.setSelected(false);
                                    self1FanGui.setTouchEnabled(true);
                                }
                            },

                            fangui:
                            {
                                _run: function () {
                                    self1FanGui = this;
                                },

                                _click: function () {
                                    self1Zhong.setSelected(false);
                                    self1Zhong.setTouchEnabled(true);
                                    self1Nozhong.setSelected(false);
                                    self1Nozhong.setTouchEnabled(true);
                                    self1FanGui.setSelected(true);
                                    self1FanGui.setTouchEnabled(false);
                                }
                            },

                            nofeng: {
                                _run: function () {
                                    self1Nofeng = this;
                                },

                                _click: function () {
                                    self1Feng.setSelected(false);
                                    self1Feng.setTouchEnabled(true);
                                    self1Nofeng.setSelected(true);
                                    self1Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self1Feng = this;
                                },

                                _click: function () {
                                    self1Feng.setSelected(true);
                                    self1Feng.setTouchEnabled(false);
                                    self1Nofeng.setSelected(false);
                                    self1Nofeng.setTouchEnabled(true);
                                }
                            },

                            canHu7: {
                                _run: function () {
                                    self1CanHu7 = this;
                                }
                            },

                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self1Ma2 = this;
                                },
                                _click: function () {
                                    self1Ma2.setSelected(true);
                                    self1Ma2.setTouchEnabled(false);
                                    self1Ma4.setSelected(false);
                                    self1Ma4.setTouchEnabled(true);
                                    self1Ma6.setSelected(false);
                                    self1Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self1Ma4 = this;
                                },
                                _click: function () {
                                    self1Ma2.setSelected(false);
                                    self1Ma2.setTouchEnabled(true);
                                    self1Ma4.setSelected(true);
                                    self1Ma4.setTouchEnabled(false);
                                    self1Ma6.setSelected(false);
                                    self1Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self1Ma6 = this;
                                },
                                _click: function () {
                                    self1Ma2.setSelected(false);
                                    self1Ma2.setTouchEnabled(true);
                                    self1Ma4.setSelected(false);
                                    self1Ma4.setTouchEnabled(true);
                                    self1Ma6.setSelected(true);
                                    self1Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self1Round4 = this;
                                },

                                _click: function () {
                                    self1Round4.setSelected(true);
                                    self1Round4.setTouchEnabled(false);
                                    self1Round8.setSelected(false);
                                    self1Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self1Round8 = this;
                                },
                                _click: function () {
                                    self1Round4.setSelected(false);
                                    self1Round4.setTouchEnabled(true);
                                    self1Round8.setSelected(true);
                                    self1Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes:
                        {
                            _click: function (btn, evt)
                            {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self1Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var horse = 2;
                                if (self1Ma2.isSelected())
                                    horse = 2;
                                else if (self1Ma4.isSelected())
                                    horse = 4;
                                else if (self1Ma6.isSelected())
                                    horse = 6;

                                if (haveMoney >= needMoney) {
                                    jsclient.createRoom(
                                        1,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self1Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        self1CanHu7.isSelected(),   //7
                                        false,                     //258
                                        self1Zhong.isSelected(),    //鬼牌
                                        horse,                     //几匹马
                                        false,                     //节节高
                                        self1FanGui.isSelected(),   //翻鬼
                                        0                           //番
                                    );
                                }
                                else {
                                    jsclient.uiPara = {lessMoney: true};
                                    jsclient.Scene.addChild(new PayLayer());
                                }
                                createui.removeFromParent(true);
                            }
                        },
                    },

                    hzhmj: {
                        self2Nofeng: null,
                        self2Feng: null,
                        self2CanHu7: null,
                        self2Ma2: null,
                        self2Ma4: null,
                        self2Ma6: null,
                        self2Round4: null,
                        self2Round8: null,

                        _run: function () {
                            gamemjs[2] = this;
                        },

                        playType: {

                            nofeng: {
                                _run: function () {
                                    self2Nofeng = this;
                                },

                                _click: function () {
                                    self2Feng.setSelected(false);
                                    self2Feng.setTouchEnabled(true);
                                    self2Nofeng.setSelected(true);
                                    self2Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self2Feng = this;
                                },

                                _click: function () {
                                    self2Feng.setSelected(true);
                                    self2Feng.setTouchEnabled(false);
                                    self2Nofeng.setSelected(false);
                                    self2Nofeng.setTouchEnabled(true);
                                }
                            },

                            canHu7: {
                                _run: function () {
                                    self2CanHu7 = this;
                                }

                                // _click:function(sender, type)
                                // {
                                //     switch (type)
                                //     {
                                //         case ccui.CheckBox.EVENT_SELECTED:
                                //             canHu7 = false;
                                //             break;
                                //         case ccui.CheckBox.EVENT_UNSELECTED:
                                //             canHu7 = true;
                                //             break;
                                //     }
                                // }
                            },

                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self2Ma2 = this;
                                },
                                _click: function () {
                                    self2Ma2.setSelected(true);
                                    self2Ma2.setTouchEnabled(false);
                                    self2Ma4.setSelected(false);
                                    self2Ma4.setTouchEnabled(true);
                                    self2Ma6.setSelected(false);
                                    self2Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self2Ma4 = this;
                                },
                                _click: function () {
                                    self2Ma2.setSelected(false);
                                    self2Ma2.setTouchEnabled(true);
                                    self2Ma4.setSelected(true);
                                    self2Ma4.setTouchEnabled(false);
                                    self2Ma6.setSelected(false);
                                    self2Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self2Ma6 = this;
                                },
                                _click: function () {
                                    self2Ma2.setSelected(false);
                                    self2Ma2.setTouchEnabled(true);
                                    self2Ma4.setSelected(false);
                                    self2Ma4.setTouchEnabled(true);
                                    self2Ma6.setSelected(true);
                                    self2Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self2Round4 = this;
                                },

                                _click: function () {
                                    self2Round4.setSelected(true);
                                    self2Round4.setTouchEnabled(false);
                                    self2Round8.setSelected(false);
                                    self2Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self2Round8 = this;
                                },
                                _click: function () {
                                    self2Round4.setSelected(false);
                                    self2Round4.setTouchEnabled(true);
                                    self2Round8.setSelected(true);
                                    self2Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes: {
                            _click: function (btn, evt) {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self2Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var horse = 2;
                                if (self2Ma2.isSelected())
                                    horse = 2;
                                else if (self2Ma4.isSelected())
                                    horse = 4;
                                else if (self2Ma6.isSelected())
                                    horse = 6;

                                if (haveMoney >= needMoney) {
                                    jsclient.createRoom(
                                        2,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self2Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        false,                     //7
                                        false,                     //258
                                        false,                     //鬼牌
                                        horse,                     //几匹马
                                        false,                      //节节高
                                        false,                       //翻鬼
                                        0                            //番
                                    );
                                }
                                else {
                                    jsclient.uiPara = {lessMoney: true};
                                    jsclient.Scene.addChild(new PayLayer());
                                }
                                createui.removeFromParent(true);
                            }
                        },
                    },

                    shzhmj: {
                        self3Nozhong: null,
                        self3Zhong: null,
                        self3FanGui:null,
                        self3Nofeng: null,
                        self3Feng: null,
                        self3JJG: null,
                        self3Ma2: null,
                        self3Ma4: null,
                        self3Ma6: null,
                        self3Round4: null,
                        self3Round8: null,

                        _run: function () {
                            gamemjs[3] = this;
                        },

                        playType: {
                            nozhong: {
                                _run: function () {
                                    self3Nozhong = this;
                                },

                                _click: function () {
                                    self3Zhong.setSelected(false);
                                    self3Zhong.setTouchEnabled(true);
                                    self3Nozhong.setSelected(true);
                                    self3Nozhong.setTouchEnabled(false);
                                    self3FanGui.setSelected(false);
                                    self3FanGui.setTouchEnabled(true);
                                }
                            },

                            zhong: {
                                _run: function () {
                                    self3Zhong = this;
                                },

                                _click: function () {
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

                            nofeng: {
                                _run: function () {
                                    self3Nofeng = this;
                                },

                                _click: function () {
                                    self3Feng.setSelected(false);
                                    self3Feng.setTouchEnabled(true);
                                    self3Nofeng.setSelected(true);
                                    self3Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self3Feng = this;
                                },

                                _click: function () {
                                    self3Feng.setSelected(true);
                                    self3Feng.setTouchEnabled(false);
                                    self3Nofeng.setSelected(false);
                                    self3Nofeng.setTouchEnabled(true);
                                }
                            },

                            jjg: {
                                _run: function () {
                                    self3JJG = this;
                                }
                            },

                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self3Ma2 = this;
                                },
                                _click: function () {
                                    self3Ma2.setSelected(true);
                                    self3Ma2.setTouchEnabled(false);
                                    self3Ma4.setSelected(false);
                                    self3Ma4.setTouchEnabled(true);
                                    self3Ma6.setSelected(false);
                                    self3Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self3Ma4 = this;
                                },
                                _click: function () {
                                    self3Ma2.setSelected(false);
                                    self3Ma2.setTouchEnabled(true);
                                    self3Ma4.setSelected(true);
                                    self3Ma4.setTouchEnabled(false);
                                    self3Ma6.setSelected(false);
                                    self3Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self3Ma6 = this;
                                },
                                _click: function () {
                                    self3Ma2.setSelected(false);
                                    self3Ma2.setTouchEnabled(true);
                                    self3Ma4.setSelected(false);
                                    self3Ma4.setTouchEnabled(true);
                                    self3Ma6.setSelected(true);
                                    self3Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self3Round4 = this;
                                },

                                _click: function () {
                                    self3Round4.setSelected(true);
                                    self3Round4.setTouchEnabled(false);
                                    self3Round8.setSelected(false);
                                    self3Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self3Round8 = this;
                                },
                                _click: function () {
                                    self3Round4.setSelected(false);
                                    self3Round4.setTouchEnabled(true);
                                    self3Round8.setSelected(true);
                                    self3Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes: {
                            _click: function (btn, evt) {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self3Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var horse = 2;
                                if (self3Ma2.isSelected())
                                    horse = 2;
                                else if (self3Ma4.isSelected())
                                    horse = 4;
                                else if (self3Ma6.isSelected())
                                    horse = 6;

                                if (haveMoney >= needMoney) {
                                    jsclient.createRoom(
                                        3,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self3Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        true,                       //7
                                        false,                     //258
                                        self3Zhong.isSelected(),    //鬼牌
                                        horse,                     //几匹马
                                        self3JJG.isSelected(),      //节节高
                                        self3FanGui.isSelected(),    //翻鬼
                                        0                              //番
                                    );
                                }
                                else {
                                    jsclient.uiPara = {lessMoney: true};
                                    jsclient.Scene.addChild(new PayLayer());
                                }
                                createui.removeFromParent(true);
                            }
                        },
                    },

                    jphmj: {
                        self4Nofeng: null,
                        self4Feng: null,
                        self4Fan0: null,
                        self4Fan1: null,
                        self4Fan3: null,
                        self4Round4: null,
                        self4Round8: null,

                        _run: function () {
                            gamemjs[4] = this;
                        },

                        playType: {
                            _run:function ()
                            {
                                this.visible = false;
                            },

                            nofeng: {
                                _run: function () {
                                    self4Nofeng = this;
                                },

                                _click: function () {
                                    self4Feng.setSelected(false);
                                    self4Feng.setTouchEnabled(true);
                                    self4Nofeng.setSelected(true);
                                    self4Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self4Feng = this;
                                },

                                _click: function () {
                                    self4Feng.setSelected(true);
                                    self4Feng.setTouchEnabled(false);
                                    self4Nofeng.setSelected(false);
                                    self4Nofeng.setTouchEnabled(true);
                                }
                            },
                        },

                        fanshu: {
                            fan0: {
                                _run: function () {
                                    self4Fan0 = this;
                                },
                                _click: function () {
                                    self4Fan0.setSelected(true);
                                    self4Fan0.setTouchEnabled(false);
                                    self4Fan1.setSelected(false);
                                    self4Fan1.setTouchEnabled(true);
                                    self4Fan3.setSelected(false);
                                    self4Fan3.setTouchEnabled(true);
                                }
                            },

                            fan1: {
                                _run: function () {
                                    self4Fan1 = this;
                                },
                                _click: function () {
                                    self4Fan0.setSelected(false);
                                    self4Fan0.setTouchEnabled(true);
                                    self4Fan1.setSelected(true);
                                    self4Fan1.setTouchEnabled(false);
                                    self4Fan3.setSelected(false);
                                    self4Fan3.setTouchEnabled(true);
                                }
                            },

                            fan3: {
                                _run: function () {
                                    self4Fan3 = this;
                                },
                                _click: function () {
                                    self4Fan0.setSelected(false);
                                    self4Fan0.setTouchEnabled(true);
                                    self4Fan1.setSelected(false);
                                    self4Fan1.setTouchEnabled(true);
                                    self4Fan3.setSelected(true);
                                    self4Fan3.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self4Round4 = this;
                                },

                                _click: function () {
                                    self4Round4.setSelected(true);
                                    self4Round4.setTouchEnabled(false);
                                    self4Round8.setSelected(false);
                                    self4Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self4Round8 = this;
                                },
                                _click: function () {
                                    self4Round4.setSelected(false);
                                    self4Round4.setTouchEnabled(true);
                                    self4Round8.setSelected(true);
                                    self4Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes: {
                            _click: function (btn, evt) {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self4Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var fannum = 0;
                                if(self4Fan0.isSelected())
                                    fannum = 0;
                                else if(self4Fan1.isSelected())
                                    fannum = 1;
                                else if(self4Fan3.isSelected())
                                    fannum = 3;


                                if (haveMoney >= needMoney) {
                                    jsclient.createRoom(
                                        4,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self4Feng.isSelected(),     //带风
                                        true,                      //吃
                                        true,                      //无效参数
                                        false,                       //7
                                        false,                     //258
                                        false,                     //鬼牌
                                        0,                         //几匹马
                                        false,                    //节节高
                                        false,                    //翻鬼
                                        fannum                     //番
                                    );
                                }
                                else {
                                    jsclient.uiPara = {lessMoney: true};
                                    jsclient.Scene.addChild(new PayLayer());
                                }
                                createui.removeFromParent(true);
                            }
                        },
                    },
                }
            },

            ctor: function () {
                this._super();
                var jsonui = ccs.load(res.Create_json);
                ConnectUI2Logic(jsonui.node, this.jsBind);
                this.addChild(jsonui.node);
                createui = this;
                setPanelContentByType(1);
                return true;
            }
        });
})();

