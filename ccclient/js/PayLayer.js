function NewPopMsgLayer(uiPara) {
    var popui;
	var PopMsgLayer = cc.Layer.extend({
		jsBind:{
			block:{
				_layout:[[1,1],[0.5,0.5],[0,0],true],
				_event:{
					connect:function(){
						popui.removeFromParent(true);
					}
				}
			},
			back:
			{	_layout:[[0.54,0.66],[0.5,0.5],[0,0]],
				no:{
					_visible:function(){ return !!uiPara.no;  }
					,_click:function(){
						popui.removeFromParent(true);
						if(uiPara.no) uiPara.no();
					}
				},
				msg:{
					_text:function(){ return uiPara.msg; }
				},
				yes:{
					_click:function(){
						popui.removeFromParent(true);
						if(uiPara.yes) uiPara.yes();
					}
				}
			}
		},
		ctor:function () {
			this._super();
			var msgui = ccs.load("res/PopUpMsg" + uiPara.style + ".json");
			ConnectUI2Logic(msgui.node,this.jsBind);
			this.addChild(msgui.node);
			return true;
		}
	   
	});
	   
    popui=new PopMsgLayer();

    return popui;

	
};



var payLayerText;
var PayLayer = cc.Layer.extend({
	jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		back:
		{	_layout:[[0.54,0.66],[0.5,0.5],[0,0]],
		    close:{
				_click:function(){
					jsclient.payLayerui.removeFromParent(true);
					delete jsclient.payLayerui;
				}
			},
			weixinBuy:
            {
				_text:function()
                {
                    //提审后注意修改
                    // return "";
                    return jsclient.remoteCfg.weixinBuy;
				}
			},
			lessMoney:
            {
				_visible:function()
                {
					//提审关闭
                    return true;
					// return false;
				}
			},
			text:
            {
				_run:function()
                {
					payLayerText = this;
				}
			}
		}
		

    },
    ctor:function ()
    {
        this._super();
        var payLayerui = ccs.load("res/PayLayer.json");
		ConnectUI2Logic(payLayerui.node,this.jsBind);
        this.addChild(payLayerui.node);
		jsclient.payLayerui=this;
		if(jsclient.data.isShop){//shop
			//提审这么写
			// payLayerText.setString("暂未开放");
            payLayerText.setString("请联系所在群主或添加以下微信号。");
		}else{//not shop
			payLayerText.setString("请联系所在群主或添加以下微信号。");
		}


        return true;
    }
   
});





