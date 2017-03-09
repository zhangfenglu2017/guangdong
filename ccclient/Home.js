
function GetSelfHead()
{
	var pinfo=jsclient.data.pinfo;
	return {uid:pinfo.uid,url:pinfo.headimgurl};
}

function changeLabelAtals(node,count)
{
	return ;
	var changeLabelAtals_size = node.getVirtualRendererSize();
	var  stringnum = node.getString();
	var oneNumwith ;
	if (stringnum>999)
	{
		oneNumwith = changeLabelAtals_size.width /4;
	}else if(stringnum>99)
	{
		oneNumwith = changeLabelAtals_size.width /3;
	}else if(stringnum>9)
	{
		oneNumwith = changeLabelAtals_size.width /2;
	}else
	{
		oneNumwith = changeLabelAtals_size.width ;
	}
	var size=node.getVirtualRendererSize();
	if(count>999)
	{
		size.width= oneNumwith*4;
	}else if (count > 99)
	{
		size.width=  oneNumwith*3;
	}else if(count>9)
	{
		size.width=  oneNumwith*2;
	}else
	{
		size.width=  oneNumwith;
	}
	node.setSize(size);
	node.setString(count);
}



function homeRunText(node) {
	var length = node.stringLength * node.fontSize + node.getParent().getCustomSize().width;
	node.width = length;
	node.anchorX = 0;
	node.x += node.getParent().getCustomSize().width/2;
	var startPosX = node.x;
	var callback = function() {
		cc.log("callback");
		node.x = startPosX;
	}
	node.runAction(cc.repeatForever(cc.sequence(cc.moveBy(length/150.0,cc.p(-length,0)),cc.callFunc(callback))));
}

function initMJTexture(node)
{
	var ID_arry = jsclient.majiang.randomCards();
	var used_arry=[];
	for (var i = 0; i < ID_arry.length; i++) {
		var isused =false;
		for (var j = 0; j < used_arry.length; j++) {
			if(used_arry[j]==ID_arry[i])
			{
				isused =true;
			}
		}
		used_arry.push(ID_arry[i]);
		if (!isused)
		{
			for (var j = 0; j < 5; j++) {
				var  img = new ccui.ImageView();
				setCardPic(img,ID_arry[i],j);
				doLayout(img,[0.01,0.01],[0,2],[0,0],false,false);
				node.addChild(img);
			}
		}


	}
}


var HomeLayer=cc.Layer.extend({
	jsBind:{
		_event:{
			logout:function(){
				if(jsclient.homeui){
					jsclient.homeui.removeFromParent(true);
					delete jsclient.homeui;
				}
			}

		},
		back:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		setting:{
			_layout:[[0.1,0.14],[1,1],[-0.7,-0.6]],
			_click:function(){
				var settringLayer = new  SettingLayer();
				settringLayer.setName("HomeClick");
				jsclient.Scene.addChild(settringLayer);
			}
		},
		help:{
			_layout:[[0.1,0.14],[1,1],[-1.9,-0.6]],
			_click:function(){
				jsclient.openWeb({url:jsclient.remoteCfg.helpUrl, help:true});
			}
		},
		history:{
			_layout:[[0.1,0.14],[1,1],[-3.1,-0.6]]
			,_click:function(){
				if (!jsclient.data.sData) {jsclient.Scene.addChild(new PlayLogLayer());}
				else  jsclient.showMsg("正在游戏中，不能查看战绩");
			}
		},
		title:{
			_layout:[[0.25,0.15],[0.5,1],[0,-0.5]],
			scroll:{
				msg:{
					_text:function(){
						return jsclient.remoteCfg.homeScroll;
					},
					_run:function() {
						homeRunText(this);
					}
				}
			}
		},
		msg:{
			_layout:[[0.8,0.1],[0.5,0.5],[0,3]]
		}
		,head:{
			_layout:[[0.12,0.12],[0,1],[0.7,-0.7]],
			_event:{
				loadWxHead:function(d)
				{
					if(d.uid==SelfUid())
					{
						var sp=new cc.Sprite(d.img);
						this.addChild(sp);
						doLayout(sp,[0.85,0.85],[0.5,0.5],[0,0],false,true);
					}
				}
			},
			_run:function()
			{
				var selfHead=GetSelfHead();
				jsclient.loadWxHead(selfHead.uid,selfHead.url);
			}
			,_click:function(){
				jsclient.showPlayerInfo(jsclient.data.pinfo);
			}

			,name:{
				_text:function(){ var pinfo=jsclient.data.pinfo; return unescape(pinfo.nickname||pinfo.name);  }
			},uid:
			{
				_event:{
					changeId:function () {
						this.setString("ID:"+SelfUid());
					}
				},
				_text:function(){return "ID:"+SelfUid();},
				_run:function(){
					if(jsclient.remoteCfg.hideMoney)
					{
						this.y=45;
					}

				}
			}
			,coinback:{
				_visible:function(){ return jsclient.remoteCfg.coinRoom },
				coin:{
					_run:function(){changeLabelAtals(this,jsclient.data.pinfo.coin); }
					,_event:{
						updateInfo:function()
						{
							changeLabelAtals(this,jsclient.data.pinfo.coin);
						}
					}
				},
				buyCoin:
				{
					_click:function(){mylog("buycoin");}
				}
			},
			moneyback:{
				_visible:function(){return !jsclient.remoteCfg.hideMoney;}
				,money:{
					_run:function(){
						changeLabelAtals(this,jsclient.data.pinfo.money);
					}

					,_event:{
						updateInfo:function()
						{
							changeLabelAtals(this,jsclient.data.pinfo.money);
						}
						,loginOK:function()
						{
							changeLabelAtals(this,jsclient.data.pinfo.money);
						}
					}
				}
				,buyMoney:
				{
					_click:function()
					{
						jsclient.uiPara={lessMoney:false};
						jsclient.Scene.addChild(new PayLayer());
					}
				}
			}
		},
		joinRoom:{

			_run:function()
			{
				if(jsclient.remoteCfg.hideMoney)
				{
					doLayout(this,[0.3,0.4],[0.5,0.5],[-0.7,0] );
				}
				else
				{
					doLayout(this,[0.3,0.4],[0,0.5],[0.6,-0.2] );
				}
			},
			_touch:function(btn,eT)
			{
				if(eT==2)
				{
					if (!jsclient.data.sData)
					{
						sendEvent("joinRoom");
					}else
					{
						sendEvent("returnPlayerLayer");
					}

				}
			},_event:{
				returnHome:function()
				{
					this.loadTextures("res/home/returnGame.png","res/home/returnGame1.png");
				}
				,LeaveGame:function()
				{
					this.loadTextures("res/home/joinGame.png","res/home/joingame1.png");
				}
			}
		},
		createRoom:{

			_run:function()
			{
				if(jsclient.remoteCfg.hideMoney)
				{
					doLayout(this,[0.3,0.4],[0.5,0.5],[0.7,0] );
				}
				else
				{
					doLayout(this,[0.3,0.4],[0.5,0.5],[0,-0.2] );
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
		coinRoom:{
			_run:function()
			{
				if(jsclient.remoteCfg.hideMoney)
				{
					this.visible=false;
				}
				else
				{
					doLayout(this,[0.3,0.4],[1,0.5],[-0.6,-0.2] );
				}
			},
			_click:function(btn,eT)
			{
				if(jsclient.remoteCfg.coinRoom) jsclient.joinGame(null);
				else jsclient.showMsg("暂未开放,敬请期待");
			}
		},
	},
	ctor:function () {
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

//TODO: pop change player ID
(function() {
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

//TODO: pop export data by id
(function() {
	var input;
	function printfLogToFile(now,logid,id) {
		jsclient.gamenet.request(
			"pkplayer.handler.getSymjLog",
			{now:now,logid:logid},
			function(item){
				if(item.result == 0) {
					jsb.fileUtils.writeStringToFile(JSON.stringify(item.data["mjlog"]),
						jsb.fileUtils.getWritablePath()+ SelfUid() + "_" + id + '_.json');
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
		);
	}
	ExportDataLayer = cc.Layer.extend({
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
						var id = parseInt(input.string);
						if(id){
							var logs = [];
							jsclient.block();
							jsclient.gamenet.request("pkplayer.handler.getSymjLog",{uid:SelfUid()},function(rtn){
								if(rtn.result == 0) {
									logs = JSON.parse(JSON.stringify(rtn.playLog["logs"]));
									if(logs.length > 0){
										for(var i = 0;i < logs.length;i++){
											if(parseInt(logs[i].tableid) == id){
												printfLogToFile(logs[i].now,logs[i].logid,id);
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