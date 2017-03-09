//Jian
//2016年7月14日 17:13:28
//创建房间

(function()
{
    var createui,round4,round8,price,canEatHu,withWind,canEat,noBigWin,yesBigWin,playinfotext1,playinfotext2,posXoffset,zimohu;
    var other_play_method_text,canHuWith258,canHu7,withZhong;

    function checkChildVisible()
    {
        // var select = noBigWin.isSelected();
        // if (select)
        // {
        //     yesBigWin.setSelected(false);
        //     playinfotext1.visible =false;
        //     playinfotext2.visible =true;
        //     withWind.visible = false;
        //     canEat.visible =false;
        //     canEatHu.visible = true;
        //     canEatHu.x=withWind.x;
        // }
        // else
        // {
        //     yesBigWin.setSelected(true);
        //     playinfotext1.visible =true;
        //     playinfotext2.visible =false;
        //      withWind.visible = true;
        //     canEat.visible =true;
        //     canEatHu.visible = false;
        //     canEatHu.x=posXoffset;
        // }
    }

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


                //标题
                table:
                {
                    // _layout:[[0.6,0.6],[0.5,0.9],[0,0]]
                },

                //返回
                close:
                {   //缩放 位置  旋转
                    // _layout:[[0.2,0.2],[0.94,0.92],[0,0]],

                    _click:function()
                    {
                        createui.removeFromParent(true);
                    }
                },

                play_method_text:
                {
                    //选择广州麻将
                    noBigWin:
                    {
                        _run:function()
                        {
                            this.setTouchEnabled(false);
                            noBigWin = this;
                        }

                        // _check:function(sender, type)
                        // {
                        //     switch (type)
                        //     {
                        //         case ccui.CheckBox.EVENT_SELECTED:
                        //              yesBigWin.setSelected(false);
                        //              other_play_method_text.visible = true;
                        //              playinfotext1.visible =false;
                        //              playinfotext2.visible =true;
                        //              withWind.visible = false;
                        //              canEat.visible =false;
                        //              canEatHu.visible = true;
                        //              canEatHu.x=withWind.x;
                        //             break;
                        //         case ccui.CheckBox.EVENT_UNSELECTED:
                        //              yesBigWin.setSelected(true);
                        //              other_play_method_text.visible = false;
                        //              playinfotext1.visible =true;
                        //              playinfotext2.visible =false;
                        //              withWind.visible = true;
                        //              canEat.visible =true;
                        //              canEatHu.visible = false;
                        //              canEatHu.x=posXoffset;
                        //             break;
                        //     }
                        // }
                     },

                     yesBigWin:
                     {
                        _run:function()
                        {
                            this.setVisible(false);
                            yesBigWin = this;
                        }

                        // _check:function(sender, type)
                        // {
                        //     switch (type)
                        //     {
                        //         case ccui.CheckBox.EVENT_SELECTED:
                        //              noBigWin.setSelected(false);
                        //              other_play_method_text.visible=false;
                        //              playinfotext1.visible =true;
                        //              playinfotext2.visible =false;
                        //              withWind.visible = true;
                        //              canEat.visible =true;
                        //              canEatHu.visible = false;
                        //              canEatHu.x=posXoffset;
                        //             break;
                        //         case ccui.CheckBox.EVENT_UNSELECTED:
                        //              noBigWin.setSelected(true);
                        //              other_play_method_text.visible=true;
                        //              playinfotext1.visible =false;
                        //              playinfotext2.visible =true;
                        //              withWind.visible = false;
                        //              canEat.visible =false;
                        //              canEatHu.visible = true;
                        //               canEatHu.x=withWind.x;
                        //
                        //             break;
                        //     }
                        // }
                     },

                    playinfotext1:
                    {
                        _run:function(){ playinfotext1 = this;}
                    },

                    playinfotext2:
                    {
                        _run:function()
                        {
                            this.setVisible(false);
                            playinfotext2 = this;
                        },
                    }
                },

                other_play_method_text:
                {
                    _run:function ()
                    {
                        this.setVisible(false);
                        other_play_method_text = this;
                    },

                    canHuWith258:
                    {
                        _run:function ()
                        {
                            this.setVisible(false);
                            canHuWith258 = this;
                        }
                    },
                    canHu7:{
                        _run:function ()
                        {
                            this.setVisible(false);
                            canHu7 = this;
                        }
                    },

                    withZhong:
                    {
                        _run:function ()
                        {
                            this.setVisible(false);
                            withZhong = this;
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
                               // isRound4?"round4":"round8",
                               // false,//canEatHu.isSelected(),
                               // true,//withWind.isSelected(),
                               // false, //canEat.isSelected(),
                               // false,//,noBigWin.isSelected(),
                               // false,//canHu7.isSelected(),
                               // false,//canHuWith258.isSelected(),
                               // true//withZhong.isSelected()
                               isRound4?"round4":"round8", //4局或8局
                               false,                       //胡
                               true,                       //
                               false,                       //吃
                               true,                       //广州麻将
                               false,                       //7
                               false,                       //258
                               withWind.isSelected()        //红中
                           );
                       }
                       else
                       {
                           jsclient.uiPara = {lessMoney:true};
                           jsclient.Scene.addChild(new PayLayer());
                       }
                       createui.removeFromParent(true);
                    }
                },

                money:
                {
                    _visible:function()
                    {
                        return false;
                        //!jsclient.remoteCfg.hideMoney;
                    },
                    price:
                    {
                        _run:function()
                        {
                            this.setVisible(false);
                            price = this;
                        }
                    }
                },

                playType:
                {
                    canEat:
                    {
                        _run:function()
                        {
                            this.setVisible(false);
                            canEat=this;
                        }
                    },

                    withWind:
                    {
                        _run:function(){ withWind = this;},

                        _check:function()
                        {
                            // var touchState = this.isSelected();
                            // this.setSelected(!touchState);
                        }
                    },

                    canEatHu:
                    {
                        _run:function()
                        {
                            this.setVisible(false);
                            canEatHu = this;
                            posXoffset = canEatHu.x;
                        },

                            // _check:function(sender, type)
                            // {
                            //     switch (type)
                            //     {
                            //     case ccui.CheckBox.EVENT_SELECTED:
                            //         zimohu.setSelected(false);
                            //         break;
                            //     case ccui.CheckBox.EVENT_UNSELECTED:
                            //         zimohu.setSelected(true);
                            //         break;
                            //     }
                            // },

                        zimohu:
                        {
                            _run:function()
                            {
                                this.setVisible(false);
                                zimohu = this;
                            }

                            // _check:function(sender, type)
                            // {
                            //     switch (type)
                            //     {
                            //     case ccui.CheckBox.EVENT_SELECTED:
                            //         canEatHu.setSelected(false);
                            //         break;
                            //     case ccui.CheckBox.EVENT_UNSELECTED:
                            //          canEatHu.setSelected(true);
                            //         break;
                            //
                            //     }
                            // }
                        }
                    }
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
                                 // price.setString(jsclient.data.gameInfo.gdmj.round4);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                 round8.setSelected(true);
                                 // price.setString(jsclient.data.gameInfo.gdmj.round8);
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
                                  // price.setString(jsclient.data.gameInfo.gdmj.round8);
                                break;
                            case ccui.CheckBox.EVENT_UNSELECTED:
                                  round4.setSelected(true);
                                  // price.setString(jsclient.data.gameInfo.gdmj.round4);
                                break;
                            }
                        }
                    }
                }
            }
        },

        ctor:function ()
        {
            this._super();
            var jsonui = ccs.load(res.Create_json);
            ConnectUI2Logic(jsonui.node,this.jsBind);
            // price.setString(round4.isSelected()?jsclient.data.gameInfo.gdmj.round4:jsclient.data.gameInfo.gdmj.round8);
            // checkChildVisible();
            this.addChild(jsonui.node);
            createui = this;
            return true;
        }
    });
})();

