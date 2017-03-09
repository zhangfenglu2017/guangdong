//Jian
//2016年7月15日 11:48:03
//全局结算界面

function SetEndAllPlayerUI(node,off)
{
	var sData = jsclient.data.sData;
	var tData = sData.tData;
	var pl = getUIPlayer(off);

    if(pl == null)
        return;

    //名称  分数 房主
	var uibind =
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
            _text:function()
            {
                return unescape(pl.info.nickname||pl.info.name)+"";
            }
        },
                        
        id:
        {
            _text:function ()
            {
                return "ID:" + pl.info._id
            }
        },

		winNum:
        {
			_text:function(){return pl.winall+""; } 
		},

        win:
        {
            _visible:function ()
            {
                return false;
            }
        },

        fangzhu:
        {
            _run:function ()
            {
                if (tData.uids[0] == pl.info.uid)
                {
                    this.visible = true;
                }
            }
        },


        hunum:
        {
            _text:function(){return "胡牌次数："+pl.winTotalNum; }
        },

        manum:
        {
            _text:function(){return "中马个数："+pl.zhongMaTotalNum; }
        },

        gang1num:
        {
            _text:function(){return "暗杠个数："+pl.anGangTotalNum; }
        },

        gang2num:
        {
            _text:function(){return "明杠个数："+pl.mingGangTotalNum; }
        },

	};

	ConnectUI2Logic(node,uibind);

    //头像
    jsclient.loadWxHead(pl.info.headimgurl,node,65,60,0.2,1);
    //大赢家
    var MaxWinAll = 0;
    var win = node.getChildByName("win");

    for (var i = 0; i < 4; i++)
    {
        var play = getUIPlayer(i);
        if(play)
            MaxWinAll = MaxWinAll>play.winall?MaxWinAll:play.winall;
    }

    if (MaxWinAll > 0 && MaxWinAll == pl.winall)
    {
        if (IsThreeTable())
        {
            if (off == 3)
                off = 2;
        }
        win.visible = true;
    }
}

var EndAllLayer = cc.Layer.extend(
    {
    sprite:null,

	jsBind:
    {
        back:
        {
            _layout: [[0, 1], [0.5, 0.5], [0, 0]]
        },

        gameID:
        {
            _layout:  [[0.2, 0.2], [0.02, 0.08], [0, 0]],

            _text:function()
            {
                return jsclient.data.sData.tData.tableid;
            }
        },

        gameTime:
        {
            _layout:  [[0.2, 0.2], [0.02, 0.04], [0, 0]],

            _text:function()
            {
                return jsclient.data.sData.tData.createRoomTime + "";
            }
        },

        table:
        {
            _layout:  [[0.6, 0.6], [0.1, 0.75], [0, 0]]
        },

		share:
        {
            // _layout:[[0.16,0.16],[0.7,0.1],[0,0]],
            _layout: [[0.15, 0], [0.5, 0.07], [1, 0.5]],

            _click:function()
            {
				sendEvent("capture_screen");
			},

			_event:
            {
				captureScreen_OK:function(){jsclient.native.wxShareImage();}
			}
		},

		tohome:
        {
            // _layout:[[0.16,0.16],[0.4,0.1],[0,0]],
            _layout: [[0.15, 0], [0.2, 0.07], [1, 0.5]],

            _click:function()
            {
				jsclient.leaveGame();
				jsclient.endallui.removeFromParent(true);
			}
		},

        head0:
        {
            _layout: [[0.12, 0.12], [0.2, 0.8], [0,0]],

            fangzhu:
            {
                _run:function() {this.visible =false;this.zIndex =100;}
            },

            _run:function(){

                if (IsThreeTable())
                {
                    this.y -= 50;
                }

                SetEndAllPlayerUI(this,0);
            }
        },

        head1:
        {
            _layout: [[0.12, 0.12], [0.2, 0.62], [0,0]],

            fangzhu:
            {
                _run:function(){this.visible =false;this.zIndex =100;}
            },

		    _run:function(){

                if (IsThreeTable())
                {
                    this.y -= 50;
                }

                SetEndAllPlayerUI(this,1);
            }
        },

        head2:
        {
            _layout: [[0.12, 0.12], [0.2, 0.44], [0,0]],

            fangzhu:
            {
                _run: function () {this.visible = false;this.zIndex = 100;}
            },

            _run:function(){
                if (IsThreeTable())
                {
                    SetEndAllPlayerUI(this,3);
                    this.y -= 50;
                }
                else
                    SetEndAllPlayerUI(this,2);

            }

        },

		head3:
        {
            _layout: [[0.12, 0.12], [0.2, 0.26], [0,0]],

            fangzhu:
            {
                _run:function(){this.visible =false;this.zIndex =100;}
            },

            _run:function(){

                if (IsThreeTable())
                    this.visible = false;
                else
                    SetEndAllPlayerUI(this,3);
            }
        },

        backbar0:
        {
            _layout: [[0.85, 1], [0.55, 0.8], [0, 0]],

            _run:function()
            {
                if (IsThreeTable())
                {
                    this.y -= 50;
                }
            }

        },
        backbar1:
        {
            _layout: [[0.85, 1], [0.55, 0.62], [0, 0]],

            _run:function()
            {
                if (IsThreeTable())
                {
                    this.y -= 50;
                }
            }
        },
        backbar2:
        {
            _layout: [[0.85, 1], [0.55, 0.44], [0, 0]],

            _run:function()
            {
                if (IsThreeTable())
                {
                    this.y -= 50;
                }
            }
        },
        backbar3:
        {
            _layout: [[0.85, 1], [0.55, 0.26], [0, 0]],

            _run:function()
            {
                if (IsThreeTable())
                {
                    this.visible = false;
                }
            }
        },
	},
    ctor:function () 
    {
        this._super();
        var endallui = ccs.load(res.EndAll_json);
		ConnectUI2Logic(endallui.node,this.jsBind);
        this.addChild(endallui.node);
		jsclient.endallui = this;

        return true;
    }
});