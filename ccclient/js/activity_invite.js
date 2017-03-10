

(function () {

    var activity, invite, uiItem, uiList, uiBar, leftImg, rightImg;
    var _curNum = 1;
    var _maxNum = 2;

    function BindLogItem(ui, url, num)
    {
        var bind =
        {
            item:
            {
                _run:function()
                {
                    if(num)
                        jsclient.loadWxHead(url,this,65,60,0.2,1);
                },

                name:
                {
                    _text: function ()
                    {
                        return num;
                    }
                }
            }
        }
        ConnectUI2Logic(ui, bind);
    }

    //初始化数据
    function initData()
    {
        _curNum = 0;

        if (jsclient.data.pinfo.recommendData && jsclient.data.pinfo.recommendData.players)
        {
            for(var js in jsclient.data.pinfo.recommendData.players)
            {
                _curNum++;
            }
        }
        
        if(jsclient.getInviteData())
            _maxNum = jsclient.getInviteData().actData.maxNum;
        
        _maxNum = _maxNum ? _maxNum : -99;

        cc.log("获取要求好友数据" + JSON.stringify(jsclient.data.pinfo.recommendData));
    }

    //初始化领奖按钮状态
    function initAwardButtonState()
    {
        for (var i = 0; i < 5; i++) 
        {
            updateAwardButtonByIndex(i);
        }
    }

    //初始化ListView
    function initListView()
    {
        uiList.removeAllItems();
        uiList.setScrollBarEnabled(false);
        uiList.setBounceEnabled(false);

        var num = 0;
        if(jsclient.data.pinfo.recommendData && jsclient.data.pinfo.recommendData.players)
        {
            for( var key in jsclient.data.pinfo.recommendData.players)
            {
                var value = jsclient.data.pinfo.recommendData.players[key];
                var item = uiItem.clone();

                item.visible = true;
                uiList.insertCustomItem(item, num);

                var url = value.headimgurl ? value.headimgurl : null;
                var name = value.nickname ? value.nickname : "";
                BindLogItem(item, url, unescape(name));
                num++;
            }
        }

        for (var i = num; i < 20; i++)
        {
            var item = uiItem.clone();
            item.visible = true;
            uiList.insertCustomItem(item, num);

            var url = null;
            var name = "" ;
            BindLogItem(item, url, name);
        }

    }

    function onClickAwardButtonEvent(index)
    {
        var awardBtn = invite.getChildByName("award_" + index);
        var yes = awardBtn.getChildByName("yes");
        var no = awardBtn.getChildByName("no");

        //当前对应的奖励
        var data = null;
        if(jsclient.getInviteData())
            data = jsclient.getInviteData().actData.rewards[index];

        var awardNum = 0;
        if(data)
        {
            awardNum = data[1] ? data[1] : -99;
        }

        data = jsclient.getInviteData().actData.rewards[index];
        var needNum = 99;
        if(data)
        {
            needNum = data[2];
        }
        //提示文本
        var text; 
        //是否为富文本
        var isRichText = false; 

        if(yes.visible)
        {
            //发送消息 领取奖励
            // yes.visible = false;
            // no.visible = true;
            jsclient.getInviteReward(index);
        }
        else if(no.visible)
        {
            //提示已经领过奖励
            text = "您已经领取过该奖励,无法重复领取。";
            activity.addChild(new ErroPrompt(text, isRichText));
        }
        else if(!yes.visible && !no.visible)
        {
            //提示达成条件并获取多少奖励
            text =
            {
                1 :
                {
                    type    : "text",
                    content : "目前已邀请" + _curNum + "人,邀请好友数量达" + needNum + "人,即可领取" + awardNum + "个",
                    color   : { r : 228,g : 192, b : 112 }
                },
                2 :
                {
                    type    : "image",
                    path    : "res/activity/invite/invite_zuanshi.png",
                    scale   : 0.22
                },
                3 :
                {
                    type    : "text",
                    content : "的奖励,快去多多邀请好友。",
                    color   : { r : 228,g : 192, b : 112 }
                },
            };

            isRichText = true;
            activity.addChild(new ErroPrompt(text, isRichText));
        }
    }


    //更新领奖按钮状态
    function updateAwardButtonByIndex(index)
    {
        var data;
        if(jsclient.getInviteData())
            data = jsclient.getInviteData().actData.rewards[index];

        var needNum = 99;
        if(data)
        {
            needNum = data[2];
        }

        // 获取进度条总长度
        var barbg = invite.getChildByName("barbg");
        var bgSize = barbg.getContentSize();
        // 根据最大人数算出门一人占多少坐标
        var everyX = bgSize.width / _maxNum;

        var awardBtn = invite.getChildByName("award_" + index);
        var yes = awardBtn.getChildByName("yes");
        var no = awardBtn.getChildByName("no");
        var text = awardBtn.getChildByName("text");

        yes.visible = false;
        no.visible = false;
        text.setString(needNum + "人");

        awardBtn.x = everyX * needNum;
        if (index != 0)
        {
            var lastAwardBtn = invite.getChildByName("award_" + (index - 1));
            var size = lastAwardBtn.getContentSize();
            awardBtn.x = lastAwardBtn.x + everyX + size.width / 2 > awardBtn.x ? lastAwardBtn.x + everyX + size.width / 2 : awardBtn.x;
        }

        if (_curNum >= needNum)
        {
            yes.visible = true;
        }

        var plData = [];
        if(jsclient.data.pinfo.recommendData)
        if(jsclient.data.pinfo.recommendData.rewards)
            plData = jsclient.data.pinfo.recommendData.rewards;

        for (var i = 0; i < plData.length; i++)
        {
            if(index == plData[i])
            {
                no.visible = true;
                yes.visible = false;
            }
        }

    }


    //根据listView内容所在位置 更新向左向右符号
    function updateListViewPrompt()
    {
        var pos = uiList.getInnerContainerPosition();
        var containerSize = uiList.getInnerContainerSize();
        var listSize = uiList.getContentSize();
        //在左
        if(Math.abs(pos.x) <= 5)
        {
            leftImg.visible = false;
            // rightImg.visible = true;
        }
        var rightOffset = Math.abs(pos.x) + listSize.width - containerSize.width;
        //在右
        if(Math.abs(rightOffset) <= 5)
        {
            // leftImg.visible = true;
            rightImg.visible = false;
        }
        //在中间
        if (Math.abs(pos.x) > 5 && Math.abs(rightOffset) > 5)
        {
            leftImg.visible = true;
            rightImg.visible = true;
        }
    }


    Activity_Invite = cc.Layer.extend({
        jsBind:
        {
            back:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0]],
                invite:
                {
                    _run: function ()
                    {
                        invite = this;
                    },

                    inviteNum:
                    {
                        _text: function ()
                        {
                            return "邀请的好友(" + _curNum + "/" + _maxNum + ")";
                        }
                    },

                    list:
                    {
                        _run: function ()
                        {
                            uiList = this;
                        },
                        _listenerScrollView:function(sender,eType)
                        {
                            updateListViewPrompt();
                        }
                    },

                    leftImg:
                    {
                        _visible: false,
                        _run: function ()
                        {
                            leftImg = this;
                        }
                    },

                    rightImg:
                    {
                        _run: function ()
                        {
                            rightImg = this;
                        }
                    },

                    item:
                    {
                        _visible: false,
                        _run: function ()
                        {
                            uiItem = this;
                        }
                    },

                    barbg:
                    {
                        bar:
                        {
                            _run: function ()
                            {
                                var preNum = _curNum / _maxNum * 100;
                                this.setPercent(preNum);
                            }
                        }
                    },

                    invitebt:
                    {
                        //邀请按钮
                        _click:function()
                        {
                            var pinfo = jsclient.data.pinfo;
                            var name = unescape(pinfo.nickname || pinfo.name);

                            var str  = "邀请码："+SelfUid() +"，玩家" + name + "邀请您加入星悦广东麻将,"
                            + "新手礼包界面输入邀请码，即可获得钻石奖励【星悦广东麻将】";
                            jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl, "星悦广东麻将",str);
                        }
                    },
                    award_0:
                    {
                        //1阶段奖励
                        _click:function()
                        {
                            onClickAwardButtonEvent(0);
                        }
        
                    },
                    award_1:
                    {
                        //2阶段奖励
                        _click:function()
                        {
                            onClickAwardButtonEvent(1);
                        }
                    },
                    award_2:
                    {
                        //3阶段奖励
                        _click:function()
                        {
                            onClickAwardButtonEvent(2);
                        }
                    },
                    award_3:
                    {
                        //4阶段奖励
                        _click:function()
                        {
                            onClickAwardButtonEvent(3);
                        }
                    },
                    award_4:
                    {
                        _click:function()
                        {
                            onClickAwardButtonEvent(4);
                        }
                    },
                    _event: 
                    {
                        actData: function (data) 
                        {
                            updateAwardButtonByIndex(data.index);
                            activity.addChild(new AwardPrompt(data.num));
                        }
                    }
                }
            }
        },
        ctor: function ()
        {
            this._super();
            initData();
            var invite = ccs.load("res/Activity_Invite.json");
            ConnectUI2Logic(invite.node, this.jsBind);

            this.addChild(invite.node);
            activity = this;

            initAwardButtonState();
            initListView();
        }
    });

})();


