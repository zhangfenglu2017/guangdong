//主界面
//2016年11月18日 11:49:45
//建子赫

function changeLabelAtals(node,count)
{
	node.setString("" + count);
	return ;

    
    // var changeLabelAtals_size = node.getVirtualRendererSize();
    // var  stringnum = node.getString();
    // var oneNumwith ;
    // if (stringnum>999)
    // {
		// oneNumwith = changeLabelAtals_size.width /4;
    // }
    // else if(stringnum>99)
    // {
		// oneNumwith = changeLabelAtals_size.width /3;
    // }
    // else if(stringnum>9)
    // {
		// oneNumwith = changeLabelAtals_size.width /2;
    // }
    // else
    // {
	 //    oneNumwith = changeLabelAtals_size.width ;
    // }
    //
    // var size=node.getVirtualRendererSize();
    // if(count>999)
    // {
		// size.width= oneNumwith*4;
    // }
    // else if (count > 99)
    // {
		// size.width=  oneNumwith*3;
    // }
    // else if(count>9)
    // {
		// size.width=  oneNumwith*2;
    // }
    // else
    // {
	 //    size.width=  oneNumwith;
    // }
    // node.setSize(size);
    // node.setString(count);
    
    
}

//跑马灯 文字
function homeRunText(node)
{
	var length = node.stringLength * node.fontSize + node.getParent().getCustomSize().width;
	node.width = length;
	node.anchorX = 0;
	node.x += node.getParent().getCustomSize().width;
	var startPosX = node.x;
	var callback = function()
    {
		node.x = startPosX;
	};
    node.stopAllActions();
	node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(length/100.0,cc.p(-length,0)),cc.callFunc(callback))));

    // log("跑马灯 文字时间：" + length/150.0 + "    长度" + length);
}

//初始加载一下麻将
function initMJTexture(node)
{
    var ID_arry = jsclient.majiang.randomCards();
    var used_arry=[];
    for (var i = 0; i < ID_arry.length; i++)
    {
		var isused =false;
		for (var j = 0; j < used_arry.length; j++)
        {
			if(used_arry[j]==ID_arry[i])
			{
				isused =true;
			}
		}
		used_arry.push(ID_arry[i]);
		if (!isused)
		{
			for (var j = 0; j < 5; j++)
			{
				var  img = new ccui.ImageView();
				setCardPic(img,ID_arry[i],j);
				doLayout(img,[0.01,0.01],[0,2],[0,0],false,false);
				node.addChild(img);
			}
		}
	}
}


var newPlayerAwardBtn = null, newPlayerAwardLeftTime = 0 ;
//新手礼包倒计时，只需设置newPlayerAwardLeftTime即可
function newPlayerAwardTimer (dt)
{
    --newPlayerAwardLeftTime;
    if( newPlayerAwardLeftTime <= 0 )
    {
        newPlayerAwardBtn.setVisible(false);
        newPlayerAwardBtn.unscheduleAllCallbacks();
        newPlayerAwardBtn.removeFromParent(true);
        newPlayerAwardBtn = null;
        newPlayerAwardLeftTime  = 0;
    }
}


function showNwePlayerGift() {

    //屏蔽新手礼包
    // if(jsclient.getGiftData() == null)
    {
        newPlayerAwardBtn.setVisible(false);
        return;
    }

    var off = getTimeOff( jsclient.data.pinfo.sendTime, new Date().toUTCString());
    newPlayerAwardLeftTime  = jsclient.getGiftData().actData.validTime * 3600 - off;

    //时间没到24小时，没领过
    var flag = jsclient.data.pinfo.recommendBy;
    var isVisible = (flag == null || flag <= 0) && (newPlayerAwardLeftTime > 0);
    if( isVisible )
        newPlayerAwardBtn.schedule(newPlayerAwardTimer, 1.00 );

    newPlayerAwardBtn.setVisible(isVisible);
}

var updateTishi, joinRoom, createRoom, updesc;
var HomeLayer=cc.Layer.extend(
{
	jsBind:
    {
		_event:
        {
			logout:function()
            {
				if(jsclient.homeui)
                {
					jsclient.homeui.removeFromParent(true);
					delete jsclient.homeui;
				}
			},
            cfgUpdate:function (changeValue)
            {
                //更新提示
                if(changeValue && !changeValue.isShowed)
                    this.addChild(new TipsPanel(), 9);

                //重起提示
                // if (changeValue && changeValue.severRestart)
                // {
                //     if(jsclient.errorLayer)
                //     {
                //         jsclient.errorLayer.removeFromParent(true);
                //         jsclient.errorLayer = null;
                //         jsclient.Scene.addChild(new ErroPrompt(changeValue.severRestart), 1000);
                //     }
                //     else
                //     {
                //         jsclient.Scene.addChild(new ErroPrompt(changeValue.severRestart), 1000);
                //     }
                // }
            },
		},

        back:
        {
			_layout:[[1,1],[0.5,0.5],[0,0],true],
		},

        title:
        {
            _layout:[[0.35,0.3],[0.53,0.9],[0,0]],

            scroll:
            {
                msg:
                {
                    _event:
                    {
                        cfgUpdate:function (changeValue)
                        {
                            if(jsclient.updateCfg && jsclient.updateCfg.homeScroll && jsclient.updateCfg.homeScroll != this.getString())
                            {
                                log("跑马灯：" + jsclient.updateCfg.homeScroll);
                                this.setString(jsclient.updateCfg.homeScroll);
                                homeRunText(this);
                            }
                        },
                    },

                    _text:function()
                    {
                        if(jsclient.updateCfg && jsclient.updateCfg.homeScroll)
                            return jsclient.updateCfg.homeScroll;
                        else
                            return "";

                        // return jsclient.remoteCfg.homeScroll;
                    },
                    _run:function()
                    {
                        if(jsclient.updateCfg && jsclient.updateCfg.homeScroll && jsclient.updateCfg.homeScroll == this.getString())
                            homeRunText(this);
                    }
                }
            }
        },

        headBorder:
        {
            _layout:[[0.25,0.2],[0.15,0.9],[0,0]],

            headbk:
            {
                _run:function()
                {
                    var selfHead = GetSelfHead();
                    // var uid = silfHead.uid;
                    var url = selfHead.url;
                    jsclient.loadWxHead(url,this,65,65,0.2,1)
                },

                _click:function()
                {
                    jsclient.showPlayerInfo(jsclient.data.pinfo);
                }
            },

            name:
            {
                _text:function()
                {
                    var pinfo=jsclient.data.pinfo;
                    return unescape(pinfo.nickname||pinfo.name);
                }
            },

            uid:
            {
                _text:function()
                {
                    return "ID:"+SelfUid();
                },
            },

            moneyback:
            {
                _visible:function()
                {
                    //IOS提审用
                    // return false;
                    return !jsclient.remoteCfg.hideMoney;
                },

                money:
                {
                    _run:function()
                    {
                        changeLabelAtals(this,jsclient.data.pinfo.money);
                    },

                    _event:
                    {
                        updateInfo:function()
                        {
                            changeLabelAtals(this,jsclient.data.pinfo.money);
                        },

                        loginOK:function()
                        {
                            changeLabelAtals(this,jsclient.data.pinfo.money);
                        }
                    }
                },

                buyMoney:
                {
                    _click:function()
                    {
                        jsclient.data.isShop = false;
                        jsclient.uiPara = {lessMoney:false};
                        jsclient.Scene.addChild(new PayLayer());
                    }
                }
            }
        },

        xslb:
        {
            _layout: [[0.09, 0.13], [0.05, 0.6], [0, 0]],
            _run : function()
            {
                newPlayerAwardBtn = this;

                // var flag = jsclient.data.pinfo.recommendBy;
                // var isVisible = (flag == null || flag <= 0) && (newPlayerAwardLeftTime > 0);
                // this.setVisible(isVisible);
                showNwePlayerGift();
            },
            _click: function ()
            {
                jsclient.activationCodeLayer = new ActivationCodeLayer();
                jsclient.Scene.addChild( jsclient.activationCodeLayer );
            },

            _event:
            {
                UpdateGiftFlag: function (actionCfg)
                {
                    showNwePlayerGift();
                }
            }
        },

        mflz:
        {
            _layout: [[0.09, 0.13], [0.05, 0.75], [0, 0]],

            _run:function ()
            {
                //屏蔽免费领钻
                this.visible = false;
            },

            _click:function()
            {
                jsclient.Scene.addChild(new Activity());
            }
        },

		setting:
        {
			_layout:[[0.107,0.107],[1,0.99],[-0.7,-0.6]],
			_click:function()
            {
				var settringLayer = new  SettingLayer();
				settringLayer.setName("HomeClick");
				jsclient.Scene.addChild(settringLayer);
			}
		},

		help:
        {
			_layout:[[0.107,0.107],[1,0.99],[-1.9,-0.6]],
			_click:function()
            {
				jsclient.openWeb(2);
			}
		},

		history:
        {
			_layout:[[0.125,0.125],[0.25,0.07],[0,0]],
            _click:function()
            {
				if (!jsclient.data.sData)
                    jsclient.Scene.addChild(new PlayLogLayer());
				else
                    jsclient.showMsg("正在游戏中，不能查看战绩");
			}
		},

		share:
        {
			_layout:[[0.125,0.125],[0.05,0.07],[0,0]],
			_click:function()
            {
                jsclient.uiPara = {
                    title:"【星悦•广东麻将】",
                    desc:"【星悦•广东麻将】广东正宗麻将，买马、鬼牌特色玩法，足不出户打麻将。还不快快加入，展现你的牌技！戳我下载！",
                    //isActivity:false
                };

                //var jianRongPath = "res/JianRong.cfg";

                //if(jsb.fileUtils.isFileExist(jianRongPath) )
                //{
                //    jsclient.native.ShowLogOnJava("新包======================================" );
                //    jsclient.Scene.addChild(new ShareWXLayer());
                //}
                //else
                //{
                //    jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,"星悦•广东麻将","广东正宗麻将，买马、鬼牌特色玩法，足不出户打麻将。还不快快加入，展现你的牌技！戳我下载！");
                //    jsclient.native.ShowLogOnJava("老包======================================" );
                //}

                if("undefined" == typeof (jsb.fileUtils.getXXSecretData))//老包
                {
                    jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,"星悦•广东麻将","广东正宗麻将，买马、鬼牌特色玩法，足不出户打麻将。还不快快加入，展现你的牌技！戳我下载！");
                }
                else{//新包
                    jsclient.Scene.addChild(new ShareWXLayer());
                }

			}
		},

		notice:
		{
			_layout:[[0.135,0.135],[0.15,0.075],[0,0]],
			_click:function()
            {
				jsclient.openWeb(0);
			}
		},

		buy:
        {
			_layout:[[0.125,0.125],[0.35,0.07],[0,0]],

            _run:function ()
            {
                this.visible = false;
            },

			_click:function()
            {
				jsclient.data.isShop = true;
				jsclient.uiPara={lessMoney:false};
				jsclient.Scene.addChild(new PayLayer());
			}
		},

        activity:
        {
            _layout:[[0.125,0.125],[0.45,0.07],[0,0]],

            _run:function ()
            {
                this.visible = false;
            },

            _click:function()
            {
                jsclient.Scene.addChild(new Activity());
            }
        },

        noticeImg:
        {
            _layout:[[0.5,0.5],[0.5,0.17],[0,0]],
        },

		joinRoom:
        {
			_run:function()
			{
                doLayout(this,[0.5,0.5],[0.3,0.45],[0,0] );

				 // if(jsclient.remoteCfg.hideMoney)
				 // {
					//  doLayout(this,[0.5,0.5],[0.3,0.45],[0,0] );
				 // }
				 // else
				 // {
					//  doLayout(this,[0.4,0.4],[0.2,0.45],[0,0] );
				 // }

                joinRoom = this;
			},
			_touch:function(btn,eT)
			{
				if(eT == 2)
				{
					if (!jsclient.data.sData)
					{
						sendEvent("joinRoom");
					}
                    else
					{
						sendEvent("returnPlayerLayer");
					}

				}
			},
            _event:
            {
				returnHome:function()
				{
					this.loadTextures("res/home-yli/returnGame.png","res/home-yli/returnGame.png");
				},

                LeaveGame:function()
				{
					this.loadTextures("res/home-yli/joinGame.png","res/home-yli/joinGame.png");
				}
			}
		},

		createRoom:
        {
			_run:function()
			{
                doLayout(this,[0.5,0.5],[0.7,0.45],[0,0] );

				 // if(jsclient.remoteCfg.hideMoney)
				 // {
					//  doLayout(this,[0.5,0.5],[0.7,0.45],[0,0] );
				 // }
				 // else
				 // {
					//  doLayout(this,[0.4,0.4],[0.5,0.45],[0,0] );
				 // }

                createRoom = this;
			},
			_click:function(btn,eT)
			{
				if (!jsclient.data.sData)
				{
					sendEvent("createRoom");
				}
				else
				{
					jsclient.showMsg("房间已经创建,请点击返回游戏");
				}
			}
		},

		coinRoom:
        {
			_run:function()
			{
                this.visible = false;

				 // if(jsclient.remoteCfg.hideMoney)
				 // {
					//  this.visible = false;
				 // }
				 // else
				 // {
					//  doLayout(this,[0.4,0.4],[0.8,0.45],[0,0] );
				 // }
			},
			_click:function(btn,eT)
			{
				 if(jsclient.remoteCfg.coinRoom)
                     jsclient.joinGame(null);
				 else
                     jsclient.showMsg("暂未开放,敬请期待");
			}
		},

	},

	ctor:function ()
    {
	    this._super();
        var homeui = ccs.load(res.Home_json);
		ConnectUI2Logic(homeui.node,this.jsBind);
        this.addChild(homeui.node);
		jsclient.homeui=this;
		playMusic("bgMain");
		initMJTexture(this);

        jsclient.startUpdateHomeTipCfg();

        //播放特效
        var createRoomAnim = playAnimByJson("chuangjianfangjian", "chuangjianfangjian");
        homeui.node.addChild(createRoomAnim);
        createRoomAnim.x = createRoom.x;
        createRoomAnim.y = createRoom.y;
        createRoomAnim.scale = createRoom.scale;

        // var joinRoomAnim = playAnimByJson("jiaruyouxi", "jiaruyouxi");
        // this.addChild(joinRoomAnim);
        // joinRoomAnim.x = joinRoom.x;
        // joinRoomAnim.y = joinRoom.y;
        // joinRoomAnim.scale = joinRoom.scale;

		return true;
	}
});


//新手礼包
(function() {
    var input;
    ChangeIDLayer = cc.Layer.extend({
        jsBind:
        {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
            back:
            {
                _layout: [[0, 0.8], [0.5, 0.5], [0, 0]],
                inputimg:
                {
                    input:
                    {
                        _run:function()
                        {
                            input = this;
                        },
                        _listener:function(sender,eType)
                        {
                            switch (eType)
                            {
                            case ccui.TextField.EVENT_DETACH_WITH_IME:
                                //SendChatMsg(false);
                                break;
                            }
                        }
                    }
                },
                send_btn:
                {
                    _click:function(btn,eT)
                    {
                        //change id
                        var id = parseInt(input.string);
                        if(id)
                        {
                            jsclient.data.pinfo.uid = id;
                            sendEvent("changeId");
                            jsclient.changeidui.removeFromParent(true);
                            jsclient.changeidui = null;
                        }
                    }
                },
                close:
                {
                    _click:function(btn,eT)
                    {
                        jsclient.changeidui.removeFromParent(true);
                        jsclient.changeidui = null;
                    }
                }
            }
        },
        ctor: function () {
            this._super();
            var changeidui = ccs.load("res/ChangeIdLayer.json");
            ConnectUI2Logic(changeidui.node, this.jsBind);
            this.addChild(changeidui.node);
            jsclient.changeidui = this;
            return true;
        }
    });
}());


//更细提示框
var updateBack = null;
var TipsPanel = cc.Layer.extend({
    jsBind:
    {
        block:{_layout:[[1,1],[0.5,0.5],[0,0],true]},
        back:
        {
            _layout:[[0, 0.8],[0.5,0.5],[0,0]],
            
            _run:function()
            {
                // if(jsclient.changeValue == null || jsclient.changeValue.isShowed)
                //     return;

                updateBack = this;

                doLayout(updateBack, [0,0],[0.5,0.5],[0,0] );
                updateBack.runAction(cc.sequence(
                    cc.delayTime(0.1),
                    cc.callFunc(
                        function ()
                        {
                            doLayout(updateBack,[0,0.9],[0.5,0.5],[0,0] );
                        }
                    ),
                    cc.delayTime(0.1),
                    cc.callFunc(
                        function ()
                        {
                            doLayout(updateBack,[0,0.75],[0.5,0.5],[0,0] );
                        }
                    ),
                    cc.delayTime(0.1),
                    cc.callFunc(
                        function ()
                        {
                            doLayout(updateBack,[0,0.80],[0.5,0.5],[0,0] );
                        }
                    )
                ));
            },

            // _visible: function ()
            // {
            //     // 判断 有更新 有则显示出来 且只显示1次 否则 不显示
            //     // var isUpdate = sys.localStorage.getItem("isUpdate");
            //     // if(isUpdate && isUpdate == "1"){
            //     //     sys.localStorage.setItem("isUpdate", "0");
            //     //     return true;
            //     // }
            //     return (jsclient.changeValue == null || !jsclient.changeValue.isShowed);
            // },

            uptitle:
            {
                _text: function ()
                {
                    return jsclient.remoteCfg.uptitle;
                }
            },

            ScrollView:
            {
                updesc:
                {
                    _text: function ()
                    {
                        return jsclient.updateCfg.gameTip;
                    }
                }
            },

            close:
            {
                _click:function(btn,eT)
                {
                    jsclient.tipsPanel.removeFromParent(true);
                    jsclient.tipsPanel = null;
                }
            }
        }
    },
    ctor: function ()
    {
        this._super();
        var tipsui = ccs.load("res/UpdatePanel.json");
        ConnectUI2Logic(tipsui.node, this.jsBind);
        this.addChild(tipsui.node);
        jsclient.tipsPanel = this;
        return true;
    }
});


//home提示框
var HomeTips = cc.Layer.extend({
    jsBind:
    {
        block:{_layout:[[1,1],[0.5,0.5],[0,0],true]},
        back:
        {
            _layout:[[0, 0.8],[0.5,0.5],[0,0]],

            Image:
            {
                _event:
                {
                    loadHomeTipImg:function(d)
                    {
                        var dirpath =  jsb.fileUtils.getWritablePath();
                        var filepath = dirpath + jsclient.homeTipCfg.Pic;

                        this.loadTexture(filepath);
                        jsclient.homeTips.setVisible(true);
                    }
                },
            },

            close:
            {
                _click:function(btn,eT)
                {
                    jsclient.homeTips.removeFromParent(true);
                    jsclient.homeTips = null;
                }
            }
        }
    },
    ctor: function ()
    {
        this._super();
        var tipsui = ccs.load("res/HomeTips.json");
        ConnectUI2Logic(tipsui.node, this.jsBind);
        this.addChild(tipsui.node);
        this.setVisible(false);
        jsclient.homeTips = this;
        return true;
    }
});


//版本号提示框
var VersionsPanel = cc.Layer.extend({
    jsBind:
    {
        block:{_layout:[[1,1],[0.5,0.5],[0,0],true]},
        back:
        {
            _layout:[[0, 0.8],[0.5,0.5],[0,0]],

            close:
            {
                _click:function(btn,eT)
                {
                    jsclient.versionsPanel.removeFromParent(true);
                    jsclient.versionsPanel = null;
                }
            }
        }
    },
    ctor: function ()
    {
        this._super();
        var versionsui = ccs.load("res/versionsPanel.json");
        ConnectUI2Logic(versionsui.node, this.jsBind);
        this.addChild(versionsui.node);

        jsclient.versionsPanel = this;

        return true;
    }
});

(function()
{
    var playerId;
    var homeId;
    function printfLogToFile(ip,owner,now,logid,pid,hid)
    {
        if(ip)
        {
            jsclient.block();
            var xhr = cc.loader.getXMLHttpRequest();
            // var playUrl="http://"+ip+":800/playlog/"+now.substr(0,10)+"/"+owner+"_"+hid+".json";
            var playUrl="http://"+jsclient.remoteCfg.playBackServer+"/"+ip+"/playlog/"+now.substr(0,10)+"/"+owner+"_"+hid+".json";
            cc.log(playUrl);
            xhr.open("GET", playUrl);
            xhr.onreadystatechange = function () {
                jsclient.unblock();
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var obj = JSON.parse(xhr.responseText);
                    jsb.fileUtils.writeStringToFile(JSON.stringify(obj),
                        jsb.fileUtils.getWritablePath()+ pid + "_" + hid + '_.json');
                    jsclient.exportdataui.removeFromParent(true);
                    jsclient.exportdataui = null;
                    jsclient.showMsg("已写入文件");
                    jsclient.unblock();
                }
                else {
                    jsclient.showMsg("查询失败");
                    jsclient.unblock();
                }
            }
            xhr.onerror = function (event) {
                jsclient.showMsg("查询失败");
                jsclient.unblock();
            }
            xhr.send();
        }
        else
        {
            jsclient.block();
            jsclient.gamenet.request(
                "pkplayer.handler.getSymjLog",
                {now:now,logid:logid}, function(item){
                    if(item.result == 0) {
                        jsb.fileUtils.writeStringToFile(JSON.stringify(item.data["mjlog"]),
                            jsb.fileUtils.getWritablePath()+ pid + "_" + hid + '_.json');
                        jsclient.exportdataui.removeFromParent(true);
                        jsclient.exportdataui = null;
                        jsclient.showMsg("已写入文件");
                        jsclient.unblock();
                    }
                    else {
                        jsclient.showMsg("查询失败");
                        jsclient.unblock();
                    }
                });
        }
    }
    function printfLogListToFile(logs,pid) 
    {
        jsb.fileUtils.writeStringToFile(JSON.stringify(logs),
            jsb.fileUtils.getWritablePath()+ pid + "_" + 'logList.json');
        jsclient.exportdataui.removeFromParent(true);
        jsclient.exportdataui = null;
        jsclient.showMsg("已写入文件");
        jsclient.unblock();
    }
    
    ExportDataLayer = cc.Layer.extend({
        jsBind:
        {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
            back:
            {
                _layout: [[0, 0.8], [0.5, 0.5], [0, 0]],
                inputimg:
                {
                    playerId:
                    {
                        _run:function()
                        {
                            playerId = this;
                        },
                        _listener:function(sender,eType)
                        {
                            switch (eType) {
                            case ccui.TextField.EVENT_DETACH_WITH_IME:
                                //SendChatMsg(false);
                                break;
                            }
                        }
                    }
                },
                inputimg1:
                {
                    homeId:
                    {
                        _run:function() 
                        {
                            homeId = this;
                        },
                        _listener:function(sender,eType) 
                        {
                            switch (eType) 
                            {
                            case ccui.TextField.EVENT_DETACH_WITH_IME:
                                //SendChatMsg(false);
                                break;
                            }
                        }
                    }
                },
                send_list_btn:
                {
                    _click:function(btn,eT) 
                    {
                        var pId = parseInt(playerId.string);
                        if(pId)
                        {
                            var logs = [];
                            jsclient.block();
                            jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn)
                            {
                                if(rtn.result == 0) 
                                {
                                    logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
                                    if(logs.length > 0)
                                    {
                                        printfLogListToFile(logs,pId);
                                    }
                                    else 
                                    {
                                        jsclient.showMsg("查询失败");
                                        jsclient.unblock();
                                    }
                                }
                                else 
                                {
                                    jsclient.showMsg("查询失败");
                                    jsclient.unblock();
                                }
                            });
                        }
                    }
                },
                send_btn:
                {
                    _click:function(btn,eT)
                    {
                        //change id
                        var pId = parseInt(playerId.string);
                        var hId = parseInt(homeId.string);
                        if(pId && hId)
                        {
                            var logs = [];
                            jsclient.block();
                            jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn)
                            {
                                if(rtn.result == 0) 
                                {
                                    logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
                                    if(logs.length > 0)
                                    {
                                        for(var i = 0;i < logs.length;i++)
                                        {
                                            if(parseInt(logs[i].tableid) == hId)
                                            {
                                                printfLogToFile(logs[i].url,logs[i].owner,logs[i].now,logs[i].logid,pId,hId);
                                            }
                                        }
                                    }
                                    else 
                                    {
                                        jsclient.showMsg("查询失败");
                                        jsclient.unblock();
                                    }
                                }
                                else 
                                {
                                    jsclient.showMsg("查询失败");
                                    jsclient.unblock();
                                }
                            });
                            // jsclient.exportdataui.removeFromParent(true);
                            // jsclient.exportdataui = null;
                        }
                    }
                },
                close:
                {
                    _click:function(btn,eT)
                    {
                        jsclient.exportdataui.removeFromParent(true);
                        jsclient.exportdataui = null;
                    }
                }
            }
        },
        ctor: function () 
        {
            this._super();
            var exportdataui = ccs.load("res/ExportDataLayer.json");
            ConnectUI2Logic(exportdataui.node, this.jsBind);
            this.addChild(exportdataui.node);
            jsclient.exportdataui = this;
            return true;
        }
    });
})();


//消息、联系我们
(function ()
{
    var webViewLayer, uiPara, title, des, cont_us, message,contact_us;

    WebViewLayer = cc.Layer.extend(
        {
            jsBind:
            {
                block:
                {
                    _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
                },
                back:
                {
                    _layout: [[0, 0.89], [0.5, 0.5], [0, 0]],

                    title:
                    {
                        _run: function ()
                        {
                            title = this;
                        }
                    },
                    des:
                    {
                        _run: function ()
                        {
                            des = this;
                        }
                    },
                    cont_us:
                    {
                        _run: function ()
                        {
                            cont_us = this;
                        }
                    },

                    message:
                    {
                        _run:function()
                        {
                            message = this;
                        },

                        _check:function(sender, type)
                        {
                            switch (type)
                            {
                                case ccui.CheckBox.EVENT_SELECTED:
                                    contact_us.selected = false;
                                    title.visible = true;
                                    des.visible = true;
                                    cont_us.visible = false;
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                    contact_us.selected = true;
                                    title.visible = false;
                                    des.visible = false;
                                    cont_us.visible = true;
                                    break;
                            }
                        }
                    },
                    contact_us:
                    {
                        _run:function()
                        {
                            contact_us = this;
                        },
                        _check:function(sender, type)
                        {
                            switch (type)
                            {
                                case ccui.CheckBox.EVENT_SELECTED:
                                    message.selected = false;
                                    title.visible = false;
                                    des.visible = false;
                                    cont_us.visible = true;
                                    break;
                                case ccui.CheckBox.EVENT_UNSELECTED:
                                    message.selected = true;
                                    title.visible = true;
                                    des.visible = true;
                                    cont_us.visible = false;
                                    break;
                            }
                        }
                    },

                    close:
                    {
                        _click: function ()
                        {
                            webViewLayer.removeFromParent(true);
                        }
                    }
                }
            },
            ctor: function ()
            {
                this._super();
                var web = ccs.load("res/WebView.json");
                // uiPara = jsclient.uiPara;
                ConnectUI2Logic(web.node, this.jsBind);
                title.setVisible(false);
                des.setVisible(false);
                cont_us.setVisible(false);

                var url = jsclient.remoteCfg.noticeUrl;
                log("联系我们：" + url);
                if (ccui.WebView)
                {
                    var xhr = cc.loader.getXMLHttpRequest();
                    // xhr.open("GET", "http://gdmj.coolgamebox.com:800/gdmj/notice.json");

                    xhr.open("GET", url);
                    xhr.onreadystatechange = function ()
                    {
                        if (xhr.readyState == 4 && xhr.status == 200)
                        {
                            var js = JSON.parse(xhr.responseText);
                            var noticeJson = js;
                            if (title && des && cont_us)
                            {
                                title.setString(noticeJson.title);
                                des.setString(noticeJson.desc);
                                cont_us.setString(noticeJson.contact);
                                title.visible = true;
                                des.visible = true;
                                //cont_us.visible = true;
                            }
                        }
                    };
                    xhr.onerror = function (event)
                    {
                    };
                    xhr.send();
                }
                this.addChild(web.node);
                webViewLayer = this;
            }
        });

})();

//用户协议
(function ()
{
    var webViewLayer1, uiPara, webView, scroll,xieyiPanel;

    WebViewLayer1 = cc.Layer.extend(
        {
            jsBind:
            {
                block:
                {
                    _layout: [[1, 1], [0.5, 0.5], [0, 0],2],
                    back:
                    {
                        scroll:
                        {
                            _run:function()
                            {
                                scroll = this;
                            }
                        },
                        help:
                        {
                            _run:function ()
                            {
                                help = this;
                            },
                            xieyiScroll: {
                                _run: function() {
                                    xieyiPanel = this;
                                }
                            }
                        },
                    },
                    yes:
                    {
                        _click: function ()
                        {
                            webViewLayer1.removeFromParent(true);
                        }
                    },
                },
            },
            ctor:function ()
            {
                this._super();
                var web = ccs.load("res/WebView1.json");
                ConnectUI2Logic(web.node, this.jsBind);

                var url = jsclient.remoteCfg.legalUrl;
                log("协议：" + jsclient.remoteCfg.legalUrl);
                //if (ccui.WebView)
                //{
                //
                //    var bkNode = this.jsBind.block.back._node;
                //    var cSize = bkNode.getCustomSize();
                //    webView = new ccui.WebView(url);
                //   // webView = new ccui.WebView();
                //    var benDiUrlPath = "res/web/legal.html";
                //    //var benDiUrlPath1 = jsb.fileUtils.getWritablePath() +  "update/res/web/legal.html";
                //
                //    //webView.loadFile(benDiUrlPath);
                //
                //    //if (jsb.fileUtils.isFileExist(benDiUrlPath1)) {
                //    //    jsclient.native.ShowLogOnJava("读取热更位置的本地协议文档======================================" );
                //    //    webView.loadFile(benDiUrlPath1);
                //    //}
                //    //else{
                //    //    if(jsb.fileUtils.isFileExist(benDiUrlPath) )
                //    //    {
                //    //        jsclient.native.ShowLogOnJava("有本地协议文档======================================" );
                //    //        webView.loadFile(benDiUrlPath);
                //    //    }
                //    //    else
                //    //    {
                //    //        //webView.loadURL(url);
                //    //        //jsclient.native.ShowLogOnJava("没有本地协议文档======================================" );
                //    //    }
                //    //}
                //
                //
                //    webView.name = "webView";
                //    webView.setContentSize(cSize.width*bkNode.scaleX*0.82,cSize.height*bkNode.scaleY*0.75);
                //    webView.setPosition(bkNode.x-cSize.width*0.125,bkNode.y-cSize.height* 0.025);
                //    webView.color = cc.color(254, 231, 197);
                //    webView.setScalesPageToFit(true);
                //    bkNode.addChild(webView);
                //    webView.setEventListener(ccui.WebView.EventType.LOADED, function ()
                //    {
                //        webView.visible = true;
                //    });
                //    webView.visible = false;
                //}
                this.addChild(web.node);
                webViewLayer1 = this;

                var path = "legal.html";
                this.scheduleOnce(function() {
                    this.setShowTextFile1(path);
                }, 0.01);


            },
            setScrollText1: function(text) {
                xieyiPanel.removeAllChildren();
                var strList = text.split("\n");
                var scrollview_width = xieyiPanel.getCustomSize().width;
                var scrollview_height = xieyiPanel.getCustomSize().height;

                var total_height = 0;
                for (var i = 0; i < strList.length; i++) {
                    var str_content = strList[i];
                    //str_content = str_content.substr(0,str_content.length-1);
                    var lb_render = new cc.LabelTTF(str_content, "", 30);
                    var lb_width = lb_render.getContentSize().width;
                    var lb_height = lb_render.getContentSize().height;
                    var line_num = Math.ceil(lb_width / scrollview_width);
                    var line_height = line_num * lb_height + 5;

                    total_height += line_height;
                }

                var pos_y = 0;
                if (total_height > scrollview_height) {
                    pos_y = total_height;
                } else {
                    pos_y = scrollview_height;
                }

                for (var i = 0; i < strList.length; i++) {
                    var str_content = strList[i];
                    //str_content = str_content.substr(0,str_content.length-1);
                    var lb_render = new cc.LabelTTF(str_content, "", 30);
                    var lb_width = lb_render.getContentSize().width;
                    var lb_height = lb_render.getContentSize().height;
                    var line_num = Math.ceil(lb_width / scrollview_width);
                    var line_height = line_num * lb_height + 5;

                    var lb_text = new cc.LabelTTF(str_content, "", 30);
                    lb_text.setFontFillColor(cc.color(71, 43, 33));
                    lb_text.setDimensions(scrollview_width, line_height);
                    lb_text.setContentSize(scrollview_width, line_height);
                    if (i == 0) {
                        lb_text.setAnchorPoint(0, 1);
                        lb_text.setPosition(scrollview_width / 2 - lb_width / 2, pos_y);
                    } else {
                        lb_text.setAnchorPoint(0, 1);
                        lb_text.setPosition(0, pos_y);
                    }

                    xieyiPanel.addChild(lb_text);

                    pos_y -= line_height;
                }

                if (total_height > scrollview_height) {
                    xieyiPanel.setInnerContainerSize(cc.size(scrollview_width, total_height));
                }
            },
            setShowTextFile1: function(path) {
                console.log("setShowTextFile path=" + path);
                var realPath = path;
                var updatePath = jsb.fileUtils.getWritablePath() + "update/web/help/" + path + ".txt";
                if (jsb.fileUtils.isFileExist(updatePath)) {
                    realPath = updatePath;
                } else {
                    //if(jsb.fileUtils.isFileExist( "res/web/help/"+ path))
                    {
                        realPath = "res/web/help/" + path + ".txt";
                    }
                }

                cc.loader.loadTxt(realPath, function(er, txt) {
                    if (!er && txt && txt.length != 0) {
                        webViewLayer1.setScrollText1(txt);
                    }
                });
            }

        });

})();

//游戏玩法
(function ()
{
    var webViewLayer2, uiPara, webView, scroll, tables = [], url = [], help;

    function createWebViewByUrl(url,nativeUrlPath,nativeUrlPath1)
    {
        //log("玩法：" + nativeUrlPath1);
        if (ccui.WebView)
        {
            var cSize = help.getCustomSize();
            webView = new ccui.WebView(url);
            // webView = new ccui.WebView();
            //  webView.loadFile(nativeUrlPath);


            //if (jsb.fileUtils.isFileExist(nativeUrlPath1)) {
            //    jsclient.native.ShowLogOnJava("读取热更位置的本地帮助文档======================================" );
            //    webView.loadFile(nativeUrlPath1);
            //}
            //else{
            //    if(jsb.fileUtils.isFileExist(nativeUrlPath) )
            //    {
            //        jsclient.native.ShowLogOnJava("有本地帮助文档======================================" );
            //        webView.loadFile(nativeUrlPath);
            //    }
            //    else
            //    {
            //        webView.loadURL(url);
            //        jsclient.native.ShowLogOnJava("没有本地帮助文档======================================" );
            //    }
            //}
            webView.setContentSize(cSize.width, cSize.height);
            webView.setPosition(400,220);
            webView.color = cc.color(254, 231, 197);
            webView.setScalesPageToFit(true);
            help.addChild(webView);
            webView.setEventListener(ccui.WebView.EventType.LOADED, function ()
            {
                webView.visible = true;
            });
            webView.visible = false;
        }
    }

    function setPanelContentByType(type)
    {
        // var url1 = jsclient.remoteCfg.help1Url;
        // var url2 = jsclient.remoteCfg.help2Url;
        // var url3 = jsclient.remoteCfg.help3Url;
        // var url4 = jsclient.remoteCfg.help4Url;
        // var url5 = jsclient.remoteCfg.help5Url;
        // var url6 = jsclient.remoteCfg.help6Url;
        // var url7 = jsclient.remoteCfg.help7Url;
        // var url8 = jsclient.remoteCfg.help8Url;
        // var url9 = jsclient.remoteCfg.help9Url;

        url[1] = jsclient.remoteCfg.help1Url;
        url[2] = jsclient.remoteCfg.help2Url;
        url[3] = jsclient.remoteCfg.help3Url;
        url[4] = jsclient.remoteCfg.help4Url;
        url[5] = jsclient.remoteCfg.help5Url;
        url[6] = jsclient.remoteCfg.help6Url;
        url[7] = jsclient.remoteCfg.help7Url;
        url[8] = jsclient.remoteCfg.help8Url;
        url[9] = jsclient.remoteCfg.help9Url;

        for(var i = 1; i < tables.length; i++)
        {
            var gameTable = tables[i];

            if(i == type)
            {
                gameTable.setBright(false);
                gameTable.setEnabled(false);
            }
            else
            {
                gameTable.setBright(true);
                gameTable.setEnabled(true);
            }
        }

        // var nativeUrlPath = "res/web/help" + type + ".html";
        // var nativeUrlPath1 = jsb.fileUtils.getWritablePath() + "update/res/web/help" + type + ".html"
        //createWebViewByUrl(url[type]);

        var path = "help"+type + ".html";

        webViewLayer2.scheduleOnce(function() {
            webViewLayer2.setShowTextFile(path);
        }, 0.01);
    }



    var ScrollPanel;
    WebViewLayer2 = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0],2],
                back:
                {
                    scroll:
                    {
                        _run:function()
                        {
                            scroll = this;
                        }
                    }
                },

                ScrollView:
                {
                    gdmjtable:
                    {
                        _run:function ()
                        {
                            tables[1] = this;
                        },

                        _click:function()
                        {
                            setPanelContentByType(1);
                        }
                    },

                    hzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[2] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(2);
                        }
                    },

                    shzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[3] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(3);
                        }
                    },

                    jphmjtable:
                    {
                        _run:function ()
                        {
                            tables[4] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(4);
                        }
                    },

                    dgmjtable:
                    {
                        _run:function ()
                        {
                            tables[5] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(5);
                        }
                    },

                    ybzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[6] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(6);
                        }
                    },

                    bdhmjtable:
                    {
                        _run:function ()
                        {
                            tables[7] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(7);
                        }
                    },

                    chshmjtable:
                    {
                        _run:function ()
                        {
                            tables[8] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(8);
                        }
                    },

                    xgmjtable:
                    {
                        _run:function ()
                        {
                            tables[9] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(9);
                        }
                    },

                },

                help:
                {
                    _run:function ()
                    {
                        help = this;
                    },
                    ScrollView_1: {
                        _run: function() {
                            ScrollPanel = this;
                        }
                    }
                },

                yes:
                {
                    _click: function ()
                    {
                        webViewLayer2.removeFromParent(true);
                    }
                },
            },
        },
        ctor:function ()
        {
            this._super();
            var web = ccs.load("res/WebView2.json");
            ConnectUI2Logic(web.node, this.jsBind);
            this.addChild(web.node);
            webViewLayer2 = this;

            setPanelContentByType(1);

        },
        setScrollText: function(text) {
            ScrollPanel.removeAllChildren();
            var strList = text.split("\n");
            var scrollview_width = ScrollPanel.getCustomSize().width;
            var scrollview_height = ScrollPanel.getCustomSize().height;

            var total_height = 0;
            for (var i = 0; i < strList.length; i++) {
                var str_content = strList[i];
                //str_content = str_content.substr(0,str_content.length-1);
                var lb_render = new cc.LabelTTF(str_content, "", 30);
                var lb_width = lb_render.getContentSize().width;
                var lb_height = lb_render.getContentSize().height;
                var line_num = Math.ceil(lb_width / scrollview_width);
                var line_height = line_num * lb_height + 5;

                total_height += line_height;
            }

            var pos_y = 0;
            if (total_height > scrollview_height) {
                pos_y = total_height;
            } else {
                pos_y = scrollview_height;
            }

            for (var i = 0; i < strList.length; i++) {
                var str_content = strList[i];
                //str_content = str_content.substr(0,str_content.length-1);
                var lb_render = new cc.LabelTTF(str_content, "", 30);
                var lb_width = lb_render.getContentSize().width;
                var lb_height = lb_render.getContentSize().height;
                var line_num = Math.ceil(lb_width / scrollview_width);
                var line_height = line_num * lb_height + 5;

                var lb_text = new cc.LabelTTF(str_content, "", 30);
                lb_text.setFontFillColor(cc.color(71, 43, 33));
                lb_text.setDimensions(scrollview_width, line_height);
                lb_text.setContentSize(scrollview_width, line_height);
                if (i == 0) {
                    lb_text.setAnchorPoint(0, 1);
                    lb_text.setPosition(scrollview_width / 2 - lb_width / 2, pos_y);
                } else {
                    lb_text.setAnchorPoint(0, 1);
                    lb_text.setPosition(0, pos_y);
                }

                ScrollPanel.addChild(lb_text);

                pos_y -= line_height;
            }

            if (total_height > scrollview_height) {
                ScrollPanel.setInnerContainerSize(cc.size(scrollview_width, total_height));
            }
        },
        setShowTextFile: function(path) {
            console.log("setShowTextFile path=" + path);
            var realPath = path;
            var updatePath = jsb.fileUtils.getWritablePath() + "update/web/help/" + path + ".txt";
            if (jsb.fileUtils.isFileExist(updatePath)) {
                realPath = updatePath;
            } else {
                //if(jsb.fileUtils.isFileExist( "res/web/help/"+ path))
                {
                    realPath = "res/web/help/" + path + ".txt";
                }
            }

            cc.loader.loadTxt(realPath, function(er, txt) {
                if (!er && txt && txt.length != 0) {
                    webViewLayer2.setScrollText(txt);
                }
            });
        }
    });

})();


//战绩回放
var playLogIfoArry = [];
var playLogInfoItem = {};
(function ()
{
    var playLogView, uiItem, uiList;

    function BindLogItem(ui, item, num)
    {
        var bind =
        {
            time:
            {
                _text: function ()
                {
                    return item.now
                }
            },

            tableid:
            {
                _text: function ()
                {
                    return "房间ID:" + item.tableid
                }
            },

            player0:
            {
                _text: function ()
                {
                    return unescape(item.players[0].nickname);
                }
            },

            player0num:
            {
                _text: function ()
                {
                    return ":" + item.players[0].winall;
                }
            },

            player1:
            {
                _text: function ()
                {
                    return unescape(item.players[1].nickname);
                }
            },

            player1num:
            {
                _text: function ()
                {
                    return ":" + item.players[1].winall;
                }
            },

            player2:
            {
                _text: function ()
                {
                    return unescape(item.players[2].nickname);
                }
            },

            player2num:
            {
                _text: function ()
                {
                    return ":" + item.players[2].winall;
                }
            },

            player3:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return unescape(item.players[3].nickname);
                }
            },

            player3num:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return ":" + item.players[3].winall;
                }
            },

            num:
            {
                _text: function ()
                {
                    return num + "";
                }
            },

            _click: function ()
            {
                //jsclient.getPlayLogOne(item.now, item.logid);
                jsclient.getPlayLogOne(item);
                playLogInfoItem = item;
            }
        };

        ConnectUI2Logic(ui, bind);
    }


    PlayLogLayer = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            },

            close:
            {
                _layout:[[0.08,0.08],[1,1],[-0.5,-0.5]],

                _click: function ()
                {
                    playLogView.removeFromParent(true);
                    delete jsclient.data.sData;
                }
            },

            table:
            {
                _layout:[[0.6, 0.6], [0.08, 0.62], [0, 0]]
            },

            back:
            {
                _layout: [[0.88, 0.90], [0.555, 0.45], [0, 0], 2],

                list:
                {
                    _run: function ()
                    {
                        uiList = this;
                    }
                },

                _event:
                {
                    playLog: function ()
                    {
                        var log = jsclient.data.playLog;
                        uiList.removeAllItems();
                        var num = log.logs.length;
                        for (var i = 0; i < log.logs.length; i++)
                        {
                            var item = uiItem.clone();
                            item.visible = true;
                            item.scale = uiList.width / item.width * 0.9;
                            uiList.insertCustomItem(item, 0);
                            BindLogItem(item, log.logs[i], num - i);

                        }
                    }
                }
            },

            item:
            {
                _layout: [[0.7, 0], [0.5, 0.5], [0, 0]],

                _run: function ()
                {
                    this.setVisible(false);
                    this.setOpacity(0);
                    // this.opacity = 0;
                    // this.visible = false;
                    uiItem = this;

                },

                _event:
                {
                    playLogOne: function (msg)
                    {
                        playLogIfoArry = [];
                        var arry = [];
                        arry[0] = [];
                        var j = 0;

                        for (var i = 0; i < msg.length; i++)
                        {
                            arry[j].push(msg[i]);

                            if (msg[i] == "roundEnd")
                            {
                                arry[j].push(msg[i + 1]);
                                playLogIfoArry.push(arry[j]);
                                i++;
                                j++;
                                arry[j] = [];
                                arry[j].push(msg[0]);
                                arry[j].push(msg[1]);
                            }
                            else if (i == msg.length - 1)
                            {
                                playLogIfoArry.push(arry[j]);
                            }
                        }

                        if (msg)
                        {
                            jsclient.Scene.addChild(new playLogInfoLayer());
                        }
                    }
                }
            },

        },
        ctor: function ()
        {
            this._super();
            var web = ccs.load("res/PlayLog.json");
            ConnectUI2Logic(web.node, this.jsBind);
            var playLog = jsclient.data.playLog;
            if (!playLog)
                jsclient.getPlayLog();
            else
                this.jsBind.back._event.playLog();

            this.addChild(web.node);
            playLogView = this;
        }
    });

})();


//战绩回放
var plmjhand1 = [];
var plmjhand2 = [];
var plmjhand3 = [];
var updatelayer_itme_node;
(function ()
{
    var playLogInfoView, uiItem, uiList, msgCount, delay, update_tData, players;
    var hand = [];

    function BindLogItem(ui, item, num)
    {
        for (var i = 0; i < playLogIfoArry[num - 1].length; i++)
        {
            if (playLogIfoArry[num - 1][i] == "players")
            {
                for (var id in playLogIfoArry[num - 1][i + 1])
                {
                    for (var j = 0; j < item.players.length; j++)
                    {
                        if (item.players[j].nickname == playLogIfoArry[num - 1][i + 1][id]["info"]["nickname"])
                        {
                            item.players[j].uid = id;
                        }
                    }
                }

            }
            else if (playLogIfoArry[num - 1][i] == "roundEnd")
            {
                for (var j = 0; j < item.players.length; j++)
                {
                    var _uid = item.players[j].uid;
                    item.players[j].winone = playLogIfoArry[num - 1][i + 1]["players"][_uid].winone;
                }
            }
        }

        var bind =
        {
            time:
            {
                _text: function ()
                {
                    return item.now
                }
            },

            tableid:
            {
                _text: function ()
                {
                    return "房间ID:" + item.tableid
                }
            },

            player0:
            {
                _text: function ()
                {
                    return unescape(item.players[0].nickname);
                }
            },

            player0num:
            {
                _text: function ()
                {
                    return ":" + item.players[0].winone;
                }
            },

            player1:
            {
                _text: function ()
                {
                    return unescape(item.players[1].nickname);
                }
            },

            player1num:
            {
                _text: function ()
                {
                    return ":" + item.players[1].winone;
                }
            },

            player2:
            {
                _text: function ()
                {
                    return unescape(item.players[2].nickname);
                }
            },

            player2num:
            {
                _text: function ()
                {
                    return ":" + item.players[2].winone;
                }
            },

            player3:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return unescape(item.players[3].nickname);
                }
            },

            player3num:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].winone == null)
                        return "";

                    return ":" + item.players[3].winone;
                }
            },

            num:
            {
                _text: function ()
                {
                    return num + "";
                }
            },

            replay:
            {
                _click: function ()
                {
                    createReplayLayer(playLogIfoArry[num - 1]);
                }
            }
        };

        ConnectUI2Logic(ui, bind);
    }

    function createReplayLayer(msg)
    {
        logMsg = JSON.parse(JSON.stringify(msg));

        var arry = [];
        var object = {};
        for (var i = 0; i < logMsg.length; i++)
        {
            if (logMsg[i] == "players")
            {
                object[logMsg[i]] = logMsg[i + 1];
                arry[0] = "reinitSceneData";
            }
            if (logMsg[i] == "mjhand")
            {
                object["tData"] = logMsg[i + 2];
                hand = logMsg[i + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);
            }
        }
    }

    function replayController(node)
    {
        plmjhand1 = [];
        plmjhand2 = [];
        plmjhand3 = [];
        delay = 0.5;

        msgCount = 0;
        var callback = function (dt)
        {
            if (logMsg.length == msgCount)
            {
                return;
            }

            if(logMsg[msgCount] == "MJFlower")
            {
                var arry = [];
                arry[0] = "MJFlower";
                arry[1]=logMsg[msgCount+1];

                sendEvent("QueueNetMsg",arry);
            }
            else if(logMsg[msgCount] == "MJZhong")
            {
                var arry = [];
                arry[0] = "MJZhong";
                arry[1]=logMsg[msgCount+1];

                sendEvent("QueueNetMsg",arry);
            }
            else if (logMsg[msgCount] == "mjhand")
            {
                var arry = [];
                var object = {};
                object["tData"] = logMsg[msgCount + 2];
                var mjhand = [];

                var tData = logMsg[msgCount + 2];
                var selfIndex = tData.uids.indexOf(SelfUid());
                var zhuangIndex = tData.zhuang;
                if (!tData.maxPlayer)
                    tData.maxPlayer = 4;
                for (var j = 0; j < tData.maxPlayer; j++)
                {
                    var cardOff = (selfIndex + j + tData.maxPlayer - zhuangIndex) % tData.maxPlayer;
                    if (j == 0)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            mjhand.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                        arry[0] = "mjhand";
                        arry[1] = object;
                        arry[2] = true;
                        object[logMsg[msgCount]] = mjhand;
                        sendEvent("QueueNetMsg", arry);

                    }
                    else if (j == 1)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand1.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                    else if (j == 2)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand2.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                    else if (j == 3)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand3.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                }

            }
            else if (logMsg[msgCount] == "newCard")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                arry[1] = hand[logMsg[msgCount + 1].cardNext - 1];
                jsclient.data.sData.tData = logMsg[msgCount + 1];
                sendEvent("QueueNetMsg", arry);
            }
            else if (logMsg[msgCount] == "MJPut")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                update_tData = object;

                if (logMsg[msgCount + 1]["uid"] == SelfUid())
                {
                    var putcardParent = jsclient.replayui.jsBind.down._node;
                    var children = jsclient.replayui.jsBind.down._node.children;
                    for (var i = 0; i < children.length; i++)
                    {
                        if (children[i].name == "stand" && children[i].tag == logMsg[msgCount + 1]["card"])
                        {
                            putcard = children[i];
                        }
                    }
                    HandleMJPut(putcardParent, {uid: SelfUid(), card: logMsg[msgCount + 1]["card"]}, 0);
                    sendEvent("QueueNetMsg", arry);
                }
                else
                {
                    sendEvent("QueueNetMsg", arry);
                }

            }
            else if (logMsg[msgCount] == "MJPeng")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);


                var tData =  logMsg[msgCount+1].tData;
                var  curuid= tData.uids[tData.curPlayer];
                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && curuid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "peng";
                        ed.lastput = sData.lastPut;
                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "MJGang")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);

                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && logMsg[msgCount + 1].uid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "gang0";
                        ed.lastput = sData.lastPut;

                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "MJChi")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);

                var tData =  logMsg[msgCount+1].tData;
                var curuid= tData.uids[tData.curPlayer];
                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && curuid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "chi0";
                        ed.lastput = sData.lastPut;
                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "roundEnd")
            {
                var sData=jsclient.data.sData;
                var tData=sData.tData;
                var uids=tData.uids;
                var players = logMsg[msgCount + 1].players;
                var ed = {};
                var mjhand = [];
                // var uid;
                // for (var i in players)
                // {
                //     if (players[i].winType > 0)
                //     {
                //         uid = i;
                //     }
                // }
                for (var i = 0; i < tData.maxPlayer; i++)
                {
                    // var pl = getUIPlayer(i);
                    // if (pl && uid == pl.info.uid)
                    // {
                    //     var sData=jsclient.data.sData.tData;
                    //     ed.off = i;
                    //     ed.eatWhat = "hu";
                    //     ed.lastput = sData.lastPut;
                    //     sendEvent("showcaneat", ed);
                    // }

                    var selfIndex = uids.indexOf(SelfUid());
                    selfIndex = (selfIndex + i) % tData.maxPlayer;

                    var pl = players[uids[selfIndex]];
                    if (!pl)
                        continue;

                    mjhand = pl.mjhand.slice(0);
                    if (pl.winType > 0)
                    {
                        var index = getIndexPlayer(uids[selfIndex]);
                        ed.off = index;
                        ed.eatWhat = "hu";

                        if(pl.winType > 3)
                            ed.lastput = mjhand[mjhand.length-1];
                        else
                            ed.lastput = tData.lastPut;

                        sendEvent("showcaneat",ed);
                        // break;
                    }
                }
                /*var arry = [];
                 var object = {};
                 arry[0] = logMsg[msgCount];
                 object = logMsg[msgCount+1];
                 arry[1] =object;
                 sendEvent("QueueNetMsg",arry);*/

                //为了显示马，把日志里面的数据 赋值给 sData
                for (var i = 0; i < tData.maxPlayer; i++)
                {
                    players[uids[i]].mjpeng = jsclient.data.sData.players[uids[i]].mjpeng;
                    players[uids[i]].mjgang0 = jsclient.data.sData.players[uids[i]].mjgang0;
                    players[uids[i]].mjgang1 = jsclient.data.sData.players[uids[i]].mjgang1;
                    players[uids[i]].mjchi = jsclient.data.sData.players[uids[i]].mjchi;
                    players[uids[i]].mjput = jsclient.data.sData.players[uids[i]].mjput;
                    players[uids[i]].mjput = jsclient.data.sData.players[uids[i]].mjput;
                }

                jsclient.data.sData.players = players;

                // if(jsclient.replayui)
                //     jsclient.replayui.addChild(new ShowMaPanel());
                sendEvent("replayEndShowMa");

                // log("服务返回玩家回放数据sData：" + JSON.stringify(sData))
                // log("服务返回玩家回放数据players：" + JSON.stringify(players))
            }

            msgCount++;
        }.bind(node);

        if (logMsg[msgCount] == "MJPut")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJPeng")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJGang")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJChi")
        {
            delay = 1.5;
        }
        else if(logMsg[msgCount] == "MJZhong")
        {
            delay = 1.5;
        }

        node.schedule(callback, delay);
        // node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(delay),cc.callFunc(callback))));
    }

    playLogInfoLayer = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            },

            close:
            {
                _layout:[[0.08,0.08],[1,1],[-0.5,-0.5]],
                _click: function ()
                {
                    playLogInfoView.removeFromParent(true);
                    playLogIfoArry = [];
                }
            },

            table:
            {
                _layout:[[0.6, 0.6], [0.08, 0.62], [0, 0]]
            },

            back:
            {
                _layout: [[0.88, 0.90], [0.555, 0.45], [0, 0], 2],

                list:
                {
                    _run: function ()
                    {
                        uiList = this;
                    }
                },

                _event:
                {
                    playLog: function ()
                    {
                        uiList.removeAllItems();

                        for (var i = 0; i < playLogIfoArry.length; i++) {
                            var item = uiItem.clone();
                            item.visible = true;
                            item.scale = uiList.width / item.width * 0.9;
                            uiList.insertCustomItem(item, 0);
                            BindLogItem(item, playLogInfoItem, i + 1);
                        }
                    }
                }
            },

            item:
            {
                _layout: [[0.7, 0], [0.5, 0.5], [0, 0]],

                _run: function ()
                {
                    this.setVisible(false);
                    this.setOpacity(0);
                    // this.visible = false;
                    // this.opacity = 0;
                    uiItem = this;
                },

                _event:
                {
                    reinitSceneData: function ()
                    {
                        updatelayer_itme_node = this;
                        replayController(this);
                    },

                    MJPut: function ()
                    {
                        var arry = [];
                        arry[0] = "waitPut";
                        object = jsclient.data.sData.tData;
                        arry[1] = object;
                        var btnReplay = this.getChildByName("replay");
                        var callback = function ()
                        {
                            sendEvent("QueueNetMsg", arry);
                        };
                        btnReplay.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback)));
                    }
                }

            },
        },

        ctor: function ()
        {
            this._super();
            var web = ccs.load("res/PlayLogInfo.json");
            ConnectUI2Logic(web.node, this.jsBind);

            var playLog = jsclient.data.playLog;
            if (!playLog)
                jsclient.getPlayLog();
            else
                this.jsBind.back._event.playLog();

            this.addChild(web.node);
            playLogInfoView = this;
        }
    });

})();

//微信分享朋友圈UI
(function(){
    var shareWXLayer, uiPara;
    ShareWXLayer = cc.Layer.extend({
        jsBind:{
            block:{
                _layout:[[1,1],[0.5,0.5],[0,0],true]
            },
            back:
            {
                _layout:[[0.53,0.65],[0.5,0.5],[0,0]],
                close:{
                    _click:function()
                    {
                        shareWXLayer.removeFromParent(true);
                    }
                },
                friend:{
                    _click:function(){
                        cc.log("-------friend");
                        jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,
                            uiPara.title,
                            uiPara.desc);
                    }
                },
                circle:{
                    _click:function(){
                        cc.log("-------circle");
                        //if(uiPara.isActivity){
                        //    jsclient.native.wxShareUrlTimeline(jsclient.remoteCfg.wxShareUrl,
                        //        uiPara.desc,
                        //        "");
                        //    return;
                        //}
                        jsclient.native.wxShareUrlTimeline(jsclient.remoteCfg.wxShareUrl,
                            uiPara.title,
                            uiPara.desc);
                    }
                },
            }
        },
        ctor:function () {
            this._super();
            uiPara = jsclient.uiPara;
            jsclient.uiPara = null;
            var ui = ccs.load("res/ShareLayer.json");
            ConnectUI2Logic(ui.node, this.jsBind);
            this.addChild(ui.node);
            shareWXLayer = this;
            return true;
        }
    });

})();


//logo图标
(function ()
{
    var logoBack, logoTime = 100;

    function LogoShow()
    {
        logoTime +=2;
        var number = logoTime;
        if(number > 255)
            number = 255;
        logoBack.opacity = number;
    }
    function LogoEnd()
    {
        logoTime-=2;
        logoBack.opacity = logoTime;
        if(logoTime < 100){
            logoBack.stopAllActions();
            jsclient.blockui.visible = true;
            jsclient.Scene.addChild(new UpdateLayer());
        }
    }
    function LogoHide()
    {
        if(logoTime > 400){  //400 = 255 + 145  目的是让透明度最大值后延迟一段时间在变暗
            logoBack.stopAllActions();
            logoTime = 255;
            logoBack.runAction(cc.repeatForever(cc.sequence(cc.callFunc(LogoEnd),cc.delayTime(0.01))));
        }
    }

    LogoLayer = cc.Layer.extend(
        {
            jsBind:
            {
                back:
                {
                    _layout: [[1, 1], [0.5, 0.5], [0, 0],true],

                    _run:function ()
                    {
                        logoBack = this;
                        this.opacity = 0;
                        jsclient.blockui.visible = false;
                        this.runAction(cc.repeatForever(cc.sequence(cc.callFunc(LogoShow),cc.delayTime(0.01),cc.callFunc(LogoHide))));
                    }
                }
            },
            ctor:function ()
            {
                this._super();
                var logoui = ccs.load(res.Logo_Json);
                ConnectUI2Logic(logoui.node,this.jsBind);
                this.addChild(logoui.node);
                return true;
            }

        });
})();