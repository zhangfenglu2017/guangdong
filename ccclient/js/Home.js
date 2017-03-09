
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
	node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(length/150.0,cc.p(-length,0)),cc.callFunc(callback))));
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
			}
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
                    _text:function()
                    {
                        return jsclient.remoteCfg.homeScroll;
                    },
                    _run:function()
                    {
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
                //jsclient.data.noticeSwitch = 0;
				 jsclient.openWeb({url:jsclient.remoteCfg.helpUrl, help:true,noticeSwitch:0});
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
				jsclient.native.wxShareUrl(jsclient.remoteCfg.wxShareUrl,"星悦•广东麻将","广东正宗麻将，买马、鬼牌特色玩法，足不出户打麻将。还不快快加入，展现你的牌技！戳我下载！");
			}
		},

		notice:
		{
			_layout:[[0.135,0.135],[0.15,0.075],[0,0]],
			_click:function()
            {
				jsclient.openWeb({url:jsclient.remoteCfg.helpUrl, help:false,noticeSwitch:1});
			}
		},

		buy:
        {
			_layout:[[0.125,0.125],[0.35,0.07],[0,0]],
			_click:function()
            {
				jsclient.data.isShop = true;
				jsclient.uiPara={lessMoney:false};
				jsclient.Scene.addChild(new PayLayer());
			}
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
		}
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

		return true;
	}
});

(function()
{
    var input;
    ChangeIDLayer = cc.Layer.extend({
        jsBind: {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
            _event: {

            },
            back: {
                _layout: [[0, 0.4], [0.5, 0.5], [0, 0]],
                inputimg:{
                    input:{
                        _run:function() {
                            input = this;
                        },
                        _listener:function(sender,eType) {
                            switch (eType) {
                                case ccui.TextField.EVENT_DETACH_WITH_IME:
                                    //SendChatMsg(false);
                                    break;
                            }
                        }
                    }
                },
                send_btn:{
                    _click:function(btn,eT){
                        //change id
                        var id = parseInt(input.string)
                        if(id){
                            jsclient.data.pinfo.uid = id;
                            sendEvent("changeId");
                            jsclient.changeidui.removeFromParent(true);
                            jsclient.changeidui = null;
                        }
                    }
                },
                close:{
                    _click:function(btn,eT){
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
})();

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
            var playUrl="http://"+ip+":800/playlog/"+now.substr(0,10)+"/"+owner+"_"+hid+".json";
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
    function printfLogListToFile(logs,pid) {
        jsb.fileUtils.writeStringToFile(JSON.stringify(logs),
            jsb.fileUtils.getWritablePath()+ pid + "_" + 'logList.json');
        jsclient.exportdataui.removeFromParent(true);
        jsclient.exportdataui = null;
        jsclient.showMsg("已写入文件");
        jsclient.unblock();
    }
    ExportDataLayer = cc.Layer.extend({
        jsBind: {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
            _event: {

            },
            back: {
                _layout: [[0, 0.4], [0.5, 0.5], [0, 0]],
                inputimg:{
                    playerId:{
                        _run:function() {
                            playerId = this;
                        },
                        _listener:function(sender,eType) {
                            switch (eType) {
                                case ccui.TextField.EVENT_DETACH_WITH_IME:
                                    //SendChatMsg(false);
                                    break;
                            }
                        }
                    }
                },
                inputimg1:{
                    homeId:{
                        _run:function() {
                            homeId = this;
                        },
                        _listener:function(sender,eType) {
                            switch (eType) {
                                case ccui.TextField.EVENT_DETACH_WITH_IME:
                                    //SendChatMsg(false);
                                    break;
                            }
                        }
                    }
                },
                send_list_btn:{
                    _click:function(btn,eT) {
                        var pId = parseInt(playerId.string);
                        if(pId){
                            var logs = [];
                            jsclient.block();
                            jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn){
                                if(rtn.result == 0) {
                                    logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
                                    if(logs.length > 0){
                                        printfLogListToFile(logs,pId);
                                    }
                                    else {
                                        jsclient.showMsg("查询失败");
                                        jsclient.unblock();
                                    }
                                }
                                else {
                                    jsclient.showMsg("查询失败");
                                    jsclient.unblock();
                                }
                            });
                        }
                    }
                },
                send_btn:{
                    _click:function(btn,eT){
                        //change id
                        var pId = parseInt(playerId.string);
                        var hId = parseInt(homeId.string);
                        if(pId && hId){
                            var logs = [];
                            jsclient.block();
                            jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:pId},function(rtn){
                                if(rtn.result == 0) {
                                    logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
                                    if(logs.length > 0){
                                        for(var i = 0;i < logs.length;i++){
                                            if(parseInt(logs[i].tableid) == hId){
                                                printfLogToFile(logs[i].ip,logs[i].owner,logs[i].now,logs[i].logid,pId,hId);
                                            }
                                        }
                                    }
                                    else {
                                        jsclient.showMsg("查询失败");
                                        jsclient.unblock();
                                    }
                                }
                                else {
                                    jsclient.showMsg("查询失败");
                                    jsclient.unblock();
                                }
                            });
                            // jsclient.exportdataui.removeFromParent(true);
                            // jsclient.exportdataui = null;
                        }
                    }
                },
                close:{
                    _click:function(btn,eT){
                        jsclient.exportdataui.removeFromParent(true);
                        jsclient.exportdataui = null;
                    }
                }
            }
        },
        ctor: function () {
            this._super();
            var exportdataui = ccs.load("res/ExportDataLayer.json");
            ConnectUI2Logic(exportdataui.node, this.jsBind);
            this.addChild(exportdataui.node);
            jsclient.exportdataui = this;
            return true;
        }
    });
})();