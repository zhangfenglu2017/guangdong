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

                    dgmjtable: {
                        _run: function () {
                            tables[5] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(5);
                        }
                    },

                    ybzhmjtable: {
                        _run: function () {
                            tables[6] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(6);
                        }
                    },

                    srfmjtable: {
                        _run: function () {
                            tables[7] = this;
                            this.visible = false;
                        },

                        _click: function () {
                            setPanelContentByType(7);
                        }
                    },

                    gdmj: {
                        self1Nozhong: null,
                        self1Zhong: null,
                        self1FanGui:null,
                        self1Nofeng: null,
                        self1Feng: null,
                        self1CanHu7: null,
                        self1CanFan7:null,
                        self1Ma2: null,
                        self1Ma4: null,
                        self1Ma6: null,
                        self1Round4: null,
                        self1Round8: null,
                        self1JJG:null,

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

                            fangui: {
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
                                },
                                _click:function()
                                {
                                    if(self1CanHu7.isSelected())
                                    {
                                        self1CanFan7.setTouchEnabled(true)
                                    }
                                    else
                                    {
                                        self1CanFan7.setSelected(false);
                                        self1CanFan7.setTouchEnabled(false)
                                    }
                                }
                            },

                            canFan7: {
                                _run: function () {
                                    self1CanFan7 = this;
                                    self1CanFan7.setTouchEnabled(false)
                                }
                            },

                            jjg:{
                                _run: function () {
                                    self1JJG = this;
                                }
                            }
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

                                if (haveMoney >= needMoney)
                                {
                                    jsclient.createRoom(
                                        1,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self1Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        self1CanHu7.isSelected(),   //7
                                        self1CanFan7.isSelected(),  //7对加番
                                        false,                     //258
                                        self1Zhong.isSelected(),    //红中鬼牌
                                        false,                      //红中为马
                                        horse,                     //几匹马
                                        self1JJG.isSelected(),     //节节高
                                        self1FanGui.isSelected(),   //翻鬼
                                        0,                          //番
                                        4,                         //人数
                                        false,                       //大胡
                                        true,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        true,                         //4鬼胡牌
                                        1                             //4鬼加倍
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
                        yes:
                        {
                            _click: function (btn, evt)
                            {
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

                                if (haveMoney >= needMoney)
                                {
                                    jsclient.createRoom(
                                        2,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self2Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        false,                     //7
                                        false,                      //7加番
                                        false,                     //258
                                        false,                     //中为鬼牌
                                        false,                      //中为马
                                        horse,                     //几匹马
                                        false,                      //节节高
                                        false,                       //翻鬼
                                        0,                           //番
                                        4,                          //人数
                                        false,                       //大胡
                                        true,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        true,                         //4鬼胡牌
                                        1                             //4鬼加倍
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
                            _click: function (btn, evt)
                            {
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

                                if (haveMoney >= needMoney)
                                {
                                    jsclient.createRoom(
                                        3,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
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
                                        self3JJG.isSelected(),      //节节高
                                        self3FanGui.isSelected(),    //翻鬼
                                        0,                            //番
                                        4,                            //人数
                                        false,                       //大胡
                                        true,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        true,                         //4鬼胡牌
                                        1                             //4鬼加倍
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
                                        false,                      //7加番
                                        false,                     //258
                                        false,                     //鬼牌
                                        false,                     //中为马
                                        0,                         //几匹马
                                        false,                    //节节高
                                        false,                    //翻鬼
                                        fannum,                     //番
                                        4,                          //人数
                                        false,                       //大胡
                                        false,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        false,                         //4鬼胡牌
                                        1                             //4鬼加倍
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

                    dgmj: {
                        self5Nozhong: null,
                        self5Zhong: null,
                        self5FanGui:null,
                        self5Nofeng: null,
                        self5Feng: null,
                        self5CanHu7: null,
                        self5CanFan7:null,
                        self5Ma2: null,
                        self5Ma4: null,
                        self5Ma6: null,
                        self5Round4: null,
                        self5Round8: null,
                        self5ZhongIsMa:null,

                        _run: function () {
                            gamemjs[5] = this;
                        },

                        playType: {
                            nozhong: {
                                _run: function () {
                                    self5Nozhong = this;
                                },

                                _click: function () {

                                    self5ZhongIsMa.setTouchEnabled(true);

                                    self5Zhong.setSelected(false);
                                    self5Zhong.setTouchEnabled(true);
                                    self5Nozhong.setSelected(true);
                                    self5Nozhong.setTouchEnabled(false);
                                    self5FanGui.setSelected(false);
                                    self5FanGui.setTouchEnabled(true);
                                }
                            },

                            zhong: {
                                _run: function () {
                                    self5Zhong = this;
                                },

                                _click:function()
                                {
                                    if(self5Zhong.isSelected())
                                    {
                                        self5ZhongIsMa.setSelected(false);
                                        // self5ZhongIsMa.setTouchEnabled(false);
                                    }
                                    else
                                    {
                                        // self5ZhongIsMa.setTouchEnabled(true);
                                    }

                                    self5Zhong.setSelected(true);
                                    self5Zhong.setTouchEnabled(false);
                                    self5Nozhong.setSelected(false);
                                    self5Nozhong.setTouchEnabled(true);
                                    self5FanGui.setSelected(false);
                                    self5FanGui.setTouchEnabled(true);
                                }
                            },

                            fangui:
                            {
                                _run: function () {
                                    self5FanGui = this;
                                },

                                _click: function () {

                                    self5ZhongIsMa.setTouchEnabled(true);

                                    self5Zhong.setSelected(false);
                                    self5Zhong.setTouchEnabled(true);
                                    self5Nozhong.setSelected(false);
                                    self5Nozhong.setTouchEnabled(true);
                                    self5FanGui.setSelected(true);
                                    self5FanGui.setTouchEnabled(false);
                                }
                            },

                            nofeng: {
                                _run: function () {
                                    self5Nofeng = this;
                                },

                                _click: function () {
                                    self5Feng.setSelected(false);
                                    self5Feng.setTouchEnabled(true);
                                    self5Nofeng.setSelected(true);
                                    self5Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self5Feng = this;
                                },

                                _click: function () {
                                    self5Feng.setSelected(true);
                                    self5Feng.setTouchEnabled(false);
                                    self5Nofeng.setSelected(false);
                                    self5Nofeng.setTouchEnabled(true);
                                }
                            },

                            zhongisma:{
                                _run: function () {
                                    self5ZhongIsMa = this;
                                    // self5ZhongIsMa.setTouchEnabled(false);
                                },

                                _click: function () {

                                    self5ZhongIsMa.setTouchEnabled(true);

                                    if(self5Zhong.isSelected())
                                    {
                                        self5Zhong.setSelected(false);
                                        self5Zhong.setTouchEnabled(true);
                                        self5Nozhong.setSelected(true);
                                        self5Nozhong.setTouchEnabled(false);
                                        self5FanGui.setSelected(false);
                                        self5FanGui.setTouchEnabled(true);
                                    }



                                }
                            }
                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self5Ma2 = this;
                                },
                                _click: function () {
                                    self5Ma2.setSelected(true);
                                    self5Ma2.setTouchEnabled(false);
                                    self5Ma4.setSelected(false);
                                    self5Ma4.setTouchEnabled(true);
                                    self5Ma6.setSelected(false);
                                    self5Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self5Ma4 = this;
                                },
                                _click: function () {
                                    self5Ma2.setSelected(false);
                                    self5Ma2.setTouchEnabled(true);
                                    self5Ma4.setSelected(true);
                                    self5Ma4.setTouchEnabled(false);
                                    self5Ma6.setSelected(false);
                                    self5Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self5Ma6 = this;
                                },
                                _click: function () {
                                    self5Ma2.setSelected(false);
                                    self5Ma2.setTouchEnabled(true);
                                    self5Ma4.setSelected(false);
                                    self5Ma4.setTouchEnabled(true);
                                    self5Ma6.setSelected(true);
                                    self5Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self5Round4 = this;
                                },

                                _click: function () {
                                    self5Round4.setSelected(true);
                                    self5Round4.setTouchEnabled(false);
                                    self5Round8.setSelected(false);
                                    self5Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self5Round8 = this;
                                },
                                _click: function () {
                                    self5Round4.setSelected(false);
                                    self5Round4.setTouchEnabled(true);
                                    self5Round8.setSelected(true);
                                    self5Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes:
                        {
                            _click: function (btn, evt)
                            {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self5Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var horse = 2;
                                if (self5Ma2.isSelected())
                                    horse = 2;
                                else if (self5Ma4.isSelected())
                                    horse = 4;
                                else if (self5Ma6.isSelected())
                                    horse = 6;

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
                                        false,                     //节节高
                                        self5FanGui.isSelected(),   //翻鬼
                                        0,                          //番
                                        4,                         //人数
                                        false,                       //大胡
                                        true,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        true,                         //4鬼胡牌
                                        1                           //4鬼加倍
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

                    ybzhmj: {
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

                                    self6NoGuiHu.setTouchEnabled(true);
                                    self6Gui4Hu.setTouchEnabled(true);
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

                                    self6NoGuiHu.setTouchEnabled(true);
                                    self6Gui4Hu.setTouchEnabled(true);
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
                                    if(self6NoGuiHu.isSelected())
                                    {
                                        self6NoGuiBei.setTouchEnabled(true);
                                        self6NoGuiMa.setTouchEnabled(true);
                                    }
                                    else
                                    {
                                        self6NoGuiBei.setSelected(false);
                                        self6NoGuiBei.setTouchEnabled(false);

                                        self6NoGuiMa.setSelected(false);
                                        self6NoGuiMa.setTouchEnabled(false);
                                    }

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
                                    if(self6NoGuiMa.isSelected())
                                    {
                                        self6NoGuiMa.setSelected(false);
                                    }
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

                                    if(self6NoGuiBei.isSelected())
                                    {
                                        self6NoGuiBei.setSelected(false);
                                    }
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
                                    if(self6Nozhong.isSelected())
                                        return;

                                    if(self6Gui4Hu.isSelected())
                                    {
                                        self6Gui4Bei.setTouchEnabled(true);
                                    }
                                    else
                                    {
                                        self6Gui4Bei.setSelected(false);
                                        self6Gui4Bei.setTouchEnabled(false);
                                    }
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

                                }
                            }
                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self6Ma2 = this;
                                },
                                _click: function () {
                                    self6Ma2.setSelected(true);
                                    self6Ma2.setTouchEnabled(false);
                                    self6Ma4.setSelected(false);
                                    self6Ma4.setTouchEnabled(true);
                                    self6Ma6.setSelected(false);
                                    self6Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self6Ma4 = this;
                                },
                                _click: function () {
                                    self6Ma2.setSelected(false);
                                    self6Ma2.setTouchEnabled(true);
                                    self6Ma4.setSelected(true);
                                    self6Ma4.setTouchEnabled(false);
                                    self6Ma6.setSelected(false);
                                    self6Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self6Ma6 = this;
                                },
                                _click: function () {
                                    self6Ma2.setSelected(false);
                                    self6Ma2.setTouchEnabled(true);
                                    self6Ma4.setSelected(false);
                                    self6Ma4.setTouchEnabled(true);
                                    self6Ma6.setSelected(true);
                                    self6Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self6Round4 = this;
                                },

                                _click: function () {
                                    self6Round4.setSelected(true);
                                    self6Round4.setTouchEnabled(false);
                                    self6Round8.setSelected(false);
                                    self6Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self6Round8 = this;
                                },
                                _click: function () {
                                    self6Round4.setSelected(false);
                                    self6Round4.setTouchEnabled(true);
                                    self6Round8.setSelected(true);
                                    self6Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes:
                        {
                            _click: function (btn, evt)
                            {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self6Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

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
                                        false,                     //节节高
                                        self6FanGui.isSelected(),   //翻鬼
                                        0,                          //番
                                        4,                            //人数
                                        self6DaHu.isSelected(),      //大胡
                                        self6NoGuiMa.isSelected(),  //无鬼加码
                                        self6NoGuiBei.isSelected(), //无鬼加倍
                                        self6Gui4Hu.isSelected(),   //4鬼胡牌
                                        gui4huBeiNum                //4鬼加倍
                                    );
                                }
                                else
                                {
                                    jsclient.uiPara = {lessMoney: true};
                                    jsclient.Scene.addChild(new PayLayer());
                                }
                                createui.removeFromParent(true);
                            }
                        },
                    },

                    srfmj: {
                        self7Nozhong: null,
                        self7Zhong: null,
                        self7FanGui:null,
                        self7Nofeng: null,
                        self7Feng: null,
                        self7CanHu7: null,
                        self7CanFan7:null,
                        self7Ma2: null,
                        self7Ma4: null,
                        self7Ma6: null,
                        self7Round4: null,
                        self7Round8: null,
                        self7JJG:null,

                        _run: function () {
                            gamemjs[7] = this;
                        },

                        playType: {
                            nozhong: {
                                _run: function () {
                                    self7Nozhong = this;
                                },

                                _click: function () {
                                    self7Zhong.setSelected(false);
                                    self7Zhong.setTouchEnabled(true);
                                    self7Nozhong.setSelected(true);
                                    self7Nozhong.setTouchEnabled(false);
                                    self7FanGui.setSelected(false);
                                    self7FanGui.setTouchEnabled(true);
                                }
                            },

                            zhong: {
                                _run: function () {
                                    self7Zhong = this;
                                },

                                _click: function () {
                                    self7Zhong.setSelected(true);
                                    self7Zhong.setTouchEnabled(false);
                                    self7Nozhong.setSelected(false);
                                    self7Nozhong.setTouchEnabled(true);
                                    self7FanGui.setSelected(false);
                                    self7FanGui.setTouchEnabled(true);
                                }
                            },

                            fangui: {
                                _run: function () {
                                    self7FanGui = this;
                                },

                                _click: function () {
                                    self7Zhong.setSelected(false);
                                    self7Zhong.setTouchEnabled(true);
                                    self7Nozhong.setSelected(false);
                                    self7Nozhong.setTouchEnabled(true);
                                    self7FanGui.setSelected(true);
                                    self7FanGui.setTouchEnabled(false);
                                }
                            },

                            nofeng: {
                                _run: function () {
                                    self7Nofeng = this;
                                },

                                _click: function () {
                                    self7Feng.setSelected(false);
                                    self7Feng.setTouchEnabled(true);
                                    self7Nofeng.setSelected(true);
                                    self7Nofeng.setTouchEnabled(false);
                                }
                            },

                            feng: {
                                _run: function () {
                                    self7Feng = this;
                                },

                                _click: function () {
                                    self7Feng.setSelected(true);
                                    self7Feng.setTouchEnabled(false);
                                    self7Nofeng.setSelected(false);
                                    self7Nofeng.setTouchEnabled(true);
                                }
                            },

                            canHu7: {
                                _run: function () {
                                    self7CanHu7 = this;
                                },
                                _click:function()
                                {
                                    if(self7CanHu7.isSelected())
                                    {
                                        self7CanFan7.setTouchEnabled(true)
                                    }
                                    else
                                    {
                                        self7CanFan7.setSelected(false);
                                        self7CanFan7.setTouchEnabled(false)
                                    }
                                }
                            },

                            canFan7: {
                                _run: function () {
                                    self7CanFan7 = this;
                                    self7CanFan7.setTouchEnabled(false)
                                }
                            },

                            jjg:{
                                _run: function () {
                                    self7JJG = this;
                                }
                            }
                        },

                        horse: {
                            ma2: {
                                _run: function () {
                                    self7Ma2 = this;
                                },
                                _click: function () {
                                    self7Ma2.setSelected(true);
                                    self7Ma2.setTouchEnabled(false);
                                    self7Ma4.setSelected(false);
                                    self7Ma4.setTouchEnabled(true);
                                    self7Ma6.setSelected(false);
                                    self7Ma6.setTouchEnabled(true);
                                }
                            },

                            ma4: {
                                _run: function () {
                                    self7Ma4 = this;
                                },
                                _click: function () {
                                    self7Ma2.setSelected(false);
                                    self7Ma2.setTouchEnabled(true);
                                    self7Ma4.setSelected(true);
                                    self7Ma4.setTouchEnabled(false);
                                    self7Ma6.setSelected(false);
                                    self7Ma6.setTouchEnabled(true);
                                }
                            },

                            ma6: {
                                _run: function () {
                                    self7Ma6 = this;
                                },
                                _click: function () {
                                    self7Ma2.setSelected(false);
                                    self7Ma2.setTouchEnabled(true);
                                    self7Ma4.setSelected(false);
                                    self7Ma4.setTouchEnabled(true);
                                    self7Ma6.setSelected(true);
                                    self7Ma6.setTouchEnabled(false);
                                }
                            },
                        },

                        round: {
                            round4: {
                                _run: function () {
                                    self7Round4 = this;
                                },

                                _click: function () {
                                    self7Round4.setSelected(true);
                                    self7Round4.setTouchEnabled(false);
                                    self7Round8.setSelected(false);
                                    self7Round8.setTouchEnabled(true);
                                }
                            },

                            round8: {
                                _run: function () {
                                    self7Round8 = this;
                                },
                                _click: function () {
                                    self7Round4.setSelected(false);
                                    self7Round4.setTouchEnabled(true);
                                    self7Round8.setSelected(true);
                                    self7Round8.setTouchEnabled(false);
                                }
                            }
                        },

                        //创建,判断金钱
                        yes:
                        {
                            _click: function (btn, evt)
                            {
                                var majiang = jsclient.data.gameInfo.gdmj;
                                var isRound = self7Round4.isSelected();
                                var needMoney = isRound ? majiang.round4 : majiang.round8;
                                var haveMoney = jsclient.data.pinfo.money;

                                var horse = 2;
                                if (self7Ma2.isSelected())
                                    horse = 2;
                                else if (self7Ma4.isSelected())
                                    horse = 4;
                                else if (self7Ma6.isSelected())
                                    horse = 6;

                                if (haveMoney >= needMoney)
                                {
                                    jsclient.createRoom(
                                        1,                        //游戏类型
                                        isRound ? "round4" : "round8",//4局或8局
                                        false,                     //吃胡
                                        self7Feng.isSelected(),     //带风
                                        false,                     //吃
                                        true,                      //无效参数
                                        self7CanHu7.isSelected(),   //7
                                        self7CanFan7.isSelected(),  //7对加番
                                        false,                     //258
                                        self7Zhong.isSelected(),    //红中鬼牌
                                        false,                      //红中为马
                                        horse,                     //几匹马
                                        self7JJG.isSelected(),     //节节高
                                        self7FanGui.isSelected(),   //翻鬼
                                        0,                          //番
                                        3,                         //人数
                                        false,                       //大胡
                                        true,                        //无鬼加码
                                        false,                        //无鬼翻倍
                                        true,                         //4鬼胡牌
                                        1                             //4鬼加倍
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

