
function ShowSameIP(msg)
{
	var sameIPUI;
	var SameIPInfo = cc.Layer.extend({
	jsBind:{
		block:
        {
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		back:
		{
            _layout:[[0.54,0.66],[0.5,0.5],[0,0]],

		    msg:
            {
                _text:function()
                {
                    return msg;
                }
			},
			
			close:
			{
				_click:function()
				{
					sameIPUI.removeFromParent(true);
				}
			}
	        ,
			yes:
			{
				_click:function()
				{
					sameIPUI.removeFromParent(true);
                    jsclient.sameIPUI = null;
                    sendEvent("mjgeog");
				}
			},
			del:
			{
				_click:function()
				{
					sameIPUI.removeFromParent(true);
                    jsclient.sameIPUI = null;
                    sendEvent("playEffectFangui");
					jsclient.delRoom(true);
				}
			}

		}
    },
    ctor:function ()
    {
        this._super();
		sameIPUI=this;
        var jsonui = ccs.load("res/SameIP.json");
		ConnectUI2Logic(jsonui.node,this.jsBind);
        this.addChild(jsonui.node);
        jsclient.sameIPUI = this;
        return true;
    }
});	

   jsclient.Scene.addChild(new SameIPInfo());
}

//地理提示框
function ShowSameGeog(msg)
{
    var sameGeogUI;
    var SameGeogInfo = cc.Layer.extend({
        jsBind:{
            block:
            {
                _layout:[[1,1],[0.5,0.5],[0,0],true]
            },
            back:
            {
                _layout:[[0.54,0.65],[0.5,0.5],[0,0]],
                msg:
                {
                    _text:function()
                    {
                        return msg;
                    }
                },

                close:
                {
                    _click:function()
                    {
                        sameGeogUI.removeFromParent(true);
                    }
                }
                ,
                yes:
                {
                    _click:function()
                    {
                        sameGeogUI.removeFromParent(true);
                        jsclient.sameGeogUI = null;
                        sendEvent("playEffectFangui");
                    }
                },
                del:
                {
                    _click:function()
                    {
                        sameGeogUI.removeFromParent(true);
                        jsclient.sameGeogUI = null;
                        sendEvent("playEffectFangui");
                        jsclient.delRoom(true);
                    }
                }

            }
        },
        ctor:function ()
        {
            this._super();
            sameGeogUI=this;
            var jsonui = ccs.load("res/SameIP.json");
            ConnectUI2Logic(jsonui.node,this.jsBind);
            this.addChild(jsonui.node);
            jsclient.sameGeogUI = this;
            return true;
        }
    });

    jsclient.Scene.addChild(new SameGeogInfo());
}

(function()
{
    var pinfo;
    UserInfoLayer = cc.Layer.extend(
    {
	    jsBind:
        {
            block:
            {
                _layout:[[1,1],[0.5,0.5],[0,0],true]
            },

            back:
            {
                _layout:[[0.54,0.66],[0.5,0.5],[0,0]],

                _run:function ()
                {
                    var url = pinfo.headimgurl;
                    jsclient.loadWxHead(url,this,181,268,0.2,1);
                },

                name:
                {
                    _text:function()
                    {
                        return unescape(pinfo.nickname || pinfo.name);
                    }
                },

                close:
                {
                    _click:function()
                    {
                        jsclient.userInfoLayerUi.removeFromParent(true);
                        jsclient.userInfoLayerUi = null;
                    }
                },

                ID:
                {
                    _text:function(){ return "ID:"+pinfo.uid; }
                },

                IP:
                {
                    _text:function(){  if(pinfo.remoteIP)  return "IP:"+pinfo.remoteIP; else return "";}
                },

                coin:
                {
                    _visible:function()
                    {
                        return jsclient.remoteCfg.coinRoom;
                    },

                    num:
                    {
                        _text:function(){ return  pinfo.coin;}
                    }
                },

                money:
                {
                    _visible: function ()
                    {
                         return !jsclient.remoteCfg.hideMoney;
                       // return false;
                    },
                    num:
                    {
                        _text: function ()
                        {
                            return pinfo.money;
                        }
                    }
                },

                headImg:
                {
                    _run:function ()
                    {
                        this.zIndex = 2;
                    }
                },

                geog:
                {
                    _text:function ()
                    {
                        var sData=jsclient.data.sData;
                        if(!sData)
                            return "";

                        var pls = sData.players;
                        if(!pls || pls.length <= 0)
                            return "";

                        var plays = [];
                        var ipmsg = "";
                        var index = 0;
                        for(var uid  in pls)
                        {
                            var pl = pls[uid];
                            var selfUid = SelfUid();

                            // log("玩家数据：" + JSON.stringify(pl));
                            if(pl.info.uid == selfUid)
                                continue;

                            var geogData = pl.info.geogData;
                            if(geogData.latitude <= 0 || geogData.longitude <= 0)
                            {
                                ipmsg = ipmsg + "未获取" + unescape(pl.info.nickname||pl.info.name) + "的地理位置.\n";

                                continue;
                            }

                            plays[index] = pl;
                            index++;
                        }

                        for(var i = 0; i < plays.length; i++ )
                        {
                            var pi1 = plays[i];
                            var geogData1 = pi1.info.geogData;
                            
                            for (var j = i+1; j < plays.length; j++)
                            {
                                var pi2 = plays[j];
                                var geogData2 = pi2.info.geogData;

                                var distance = jsclient.native.CalculateLineDistance(
                                    geogData1.latitude, geogData1.longitude, geogData2.latitude, geogData2.longitude);

                                if(distance < 100  && distance > 0)
                                {
                                    ipmsg = ipmsg + unescape(pi1.info.nickname||pi1.info.name) + "和"
                                    + unescape(pi2.info.nickname||pi2.info.name) + "相距小于" + distance + "米\n";
                                }
                            }
                        }

                        return ipmsg;
                    }
                }
            }
        },

        ctor:function ()
        {
            this._super();
            pinfo = jsclient.uiPara;
            var userInfoLayerUi = ccs.load("res/UserInfo.json");
            ConnectUI2Logic(userInfoLayerUi.node,this.jsBind);
            this.addChild(userInfoLayerUi.node);
            jsclient.userInfoLayerUi = this;
            return true;
        }
    });
	
})();



