
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
			_layout:[[0.125,0.125],[0.25,0.07],[0,0]]
			,_click:function(){
				if (!jsclient.data.sData) {jsclient.Scene.addChild(new PlayLogLayer());}
				else  jsclient.showMsg("正在游戏中，不能查看战绩");
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
				 if(jsclient.remoteCfg.hideMoney)
				 {
					 doLayout(this,[0.5,0.5],[0.3,0.45],[0,0] );
				 }
				 else
				 {
					 doLayout(this,[0.4,0.4],[0.2,0.45],[0,0] );
				 }
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
				 if(jsclient.remoteCfg.hideMoney)
				 {
					 doLayout(this,[0.5,0.5],[0.7,0.45],[0,0] );
				 }
				 else
				 {
					 doLayout(this,[0.4,0.4],[0.5,0.45],[0,0] );
				 }
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
				 if(jsclient.remoteCfg.hideMoney)
				 {
					 this.visible = false;
				 }
				 else
				 {
					 doLayout(this,[0.4,0.4],[0.8,0.45],[0,0] );
				 }
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