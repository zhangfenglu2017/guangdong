//Jian
//2016年7月14日 17:13:28
//创建房间

(function()
{
    var createui,round4,round8,Joker,gdmj,canHu7,ma2,ma4,ma6;
    var horse = 2;

    CreateLayer = cc.Layer.extend(
    {
        jsBind:
        {
            //背景
            block:
            {
                _layout:[[2,2],[0.5,0.5],[0,0]]
            },
 
            //内容
            back:
            {
                _layout:[[0.85,0.85],[0.5,0.5],[0,0]],

                _run:function()
                {
                    this.setCascadeOpacityEnabled(false);
                    this.opacity = 0;
                },

                //返回
                close:
                {
                    _click:function()
                    {
                        createui.removeFromParent(true);
                    }
                },

                play_method_text:
                {
                    //选择广州麻将
                    gdmj:
                    {
                        _run:function()
                        {
                            this.setTouchEnabled(false);
                            gdmj = this;
                        }
                    },
                },

                playType:
                {
                    Joker:
                    {
                        _run:function()
                        {
                            Joker = this;
                        },
                    },
                    canHu7:
                    {
                        _run:function()
                        {
                            canHu7 = this;
                        },
                    }
                },

                horse:
                {
                    ma2:
                    {
                        _run:function ()
                        {
                            ma2 = this;
                        },
                        _check:function ()
                        {
                            horse = 2;
                            ma2.setSelected(true);
                            ma2.setTouchEnabled(false);
                            ma4.setSelected(false);
                            ma4.setTouchEnabled(true);
                            ma6.setSelected(false);
                            ma6.setTouchEnabled(true);
                        }
                    },

                    ma4:
                    {
                        _run:function ()
                        {
                            ma4 = this;
                        },
                        _check:function ()
                        {
                            horse = 4;
                            ma2.setSelected(false);
                            ma2.setTouchEnabled(true);
                            ma4.setSelected(true);
                            ma4.setTouchEnabled(false);
                            ma6.setSelected(false);
                            ma6.setTouchEnabled(true);
                        }
                    },

                    ma6:
                    {
                        _run:function ()
                        {
                            ma6 = this;
                        },
                        _check:function ()
                        {
                            horse = 6;
                            ma2.setSelected(false);
                            ma2.setTouchEnabled(true);
                            ma4.setSelected(false);
                            ma4.setTouchEnabled(true);
                            ma6.setSelected(true);
                            ma6.setTouchEnabled(false);
                        }
                    },
                },

                round:
                {
                    round4:
                    {
                        _run:function()
                        {
                            round4 = this;
                        },

                        _check:function(sender, type)
                        {
                            switch (type)
                            {
                                case ccui.CheckBox.EVENT_SELECTED:
                                    round8.setSelected(false);
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                    round8.setSelected(true);
                                    break;
                            }
                        }
                    },

                    round8:
                    {
                        _run:function()
                        {
                            round8 = this;
                        },
                        _check:function(sender, type)
                        {
                            switch (type)
                            {
                                case ccui.CheckBox.EVENT_SELECTED:
                                    round4.setSelected(false);
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                    round4.setSelected(true);
                                    break;
                            }
                        }
                    }
                },

                //创建,判断金钱
                yes:
                {
                    _click:function(btn,evt)
                    {
                       var majiang = jsclient.data.gameInfo.gdmj;
                       var isRound4 = round4.isSelected();
                       var needMoney = isRound4?majiang.round4:majiang.round8;
                       var haveMoney = jsclient.data.pinfo.money;
                       if(haveMoney >= needMoney)
                       {
                           jsclient.createRoom(
                               isRound4?"round4":"round8", //4局或8局
                               false,                      //胡
                               true,                       //风
                               false,                      //吃
                               true,                       //广州麻将
                               canHu7.isSelected(),        //7
                               false,                      //258
                               Joker.isSelected(),        //红中
                               horse                      //几匹马
                           );
                           log("创建房间的马数：" + horse);
                       }
                       else
                       {
                           jsclient.uiPara = {lessMoney:true};
                           jsclient.Scene.addChild(new PayLayer());
                       }
                       createui.removeFromParent(true);
                    }
                },

            }
        },

        ctor:function ()
        {
            this._super();
            var jsonui = ccs.load(res.Create_json);
            ConnectUI2Logic(jsonui.node,this.jsBind);
            this.addChild(jsonui.node);
            createui = this;
            horse = 2;
            return true;
        }
    });
})();

