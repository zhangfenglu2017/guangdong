function setEffectsVolume(v)
{
	if(v<0)
	{
		var ev=sys.localStorage.getItem("EffectVolume");
		if(!ev) ev="0.5";
		v=parseFloat(ev);
	}
	else
	{
		sys.localStorage.setItem("EffectVolume",v);
	}
	cc.audioEngine.setEffectsVolume(v);
	return v;
}
function setMusicVolume(v)
{
	if(v<0)
	{
		var ev=sys.localStorage.getItem("MusicVolume");
		if(!ev) ev="0.5";
		v=parseFloat(ev);
	}
	else
	{
		sys.localStorage.setItem("MusicVolume",v);
	}
	cc.audioEngine.setMusicVolume(v);
	return v;
}
var SettingLayer = cc.Layer.extend({
	jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},
		back:
		{	_layout:[[0.54,0.66],[0.5,0.5],[0,0]],
		    close:{
				_click:function(){
					jsclient.setui.removeFromParent(true);
				}
			},
			delBtn:{
				
				_click:function(){
					jsclient.delRoom(true);
					jsclient.setui.removeFromParent(true);
				}
			}
			,
			exitBtn:
			{
				_visible:jsclient.playui,
				_click:function(){
                   jsclient.logout();
				   jsclient.setui.removeFromParent(true);
				}
			},
			Slider_effect:{
				_run:function(){ this.setPercent(setEffectsVolume(-1)*100); },
				_slider:function(sdr,tp){setEffectsVolume(this.getPercent()/100);}
			},
			Slider_music:{
				_run:function(){ this.setPercent(setMusicVolume(-1)*100); },
				_slider:function(sdr,tp){setMusicVolume(this.getPercent()/100);}
			}
		}
		

    },
    ctor:function () {
        this._super();
        var setui = ccs.load("res/setting.json");
		ConnectUI2Logic(setui.node,this.jsBind);
        this.addChild(setui.node);
		jsclient.setui=this;
		cc.log("machao_data "+JSON.stringify(jsclient.data));
        return true;
    },
    onEnter:function () 
	{
        this._super();
       	if (this.getName() == "HomeClick") 
       	{
       		this.jsBind.back.exitBtn._node.visible = true;
       		this.jsBind.back.exitBtn._node.setEnabled(true);
       		this.jsBind.back.delBtn._node.visible= false;
       		this.jsBind.back.delBtn._node.setEnabled(false);
       	}else if(this.getName() == "PlayLayerClick")
       	{
       		var sData=jsclient.data.sData;
			var tData=sData.tData;
			cc.log("machao_data "+JSON.stringify(jsclient.data));
       		cc.log("machao_tdata "+JSON.stringify(tData));
       		this.jsBind.back.delBtn._node.visible = true;
       		this.jsBind.back.delBtn._node.setEnabled(true);
       		this.jsBind.back.exitBtn._node.visible = false;
       		this.jsBind.back.exitBtn._node.setEnabled(false);
       	}
       
		
	}
});

var NetErrorLayer = cc.Layer.extend({
	jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true],
		},
		restart:{
			_layout:[[0.5,0.5],[0.5,0.5],[0,0]],
			_click:function()
			{
                jsclient.restartGame();
			}
		},
	},
    ctor:function () 
	{
		this._super();
        var netui = ccs.load("res/NetError.json");
		ConnectUI2Logic(netui.node,this.jsBind);
        this.addChild(netui.node);
		jsclient.netui=this;
        return true;
	}
});
(function(){
var input,sendType,playerChatLayer,uiitem,changyong,emoji,emoji_bg_chat,emoji_bg,changyong_text,changyong_text1,emoji_text1,emoji_text;

var CHAT_TYPE_INPUT = 0;
var CHAT_TYPE_DEFULT = 1;
var CHAT_TYPE_EMOJI = 2;

function emojiAction(num)
{
	MJChat(SelfUid(),CHAT_TYPE_EMOJI,"",num);
	playerChatLayer.removeFromParent(true);
}

function BindItem(node,num)
{
	var bind={
		_click:function()
		{
			MJChat(SelfUid(),CHAT_TYPE_DEFULT,node.getChildByName("text").getString(),num);
			playerChatLayer.removeFromParent(true);
		}
		,text:{
			_run:function(){
			switch(num){
			case 0:
			this.setString("快点啊，都等到我花儿都谢了！");
			break;
			case 1:
			this.setString("怎么又断线了，网络怎么这么差啊！");
			break;
			case 2:
			this.setString("不要走决战到天亮!");
			break;
			case 3:
			this.setString("你的牌打的也太好了！");
			break;
			case 4:
			this.setString("你是妹妹还是哥哥啊？");
			break;
			case 5:
			this.setString("和你合作真是太愉快了！");
			break;
			case 6:
			this.setString("大家好很高兴见到各位！");
			break;
			case 7:
			this.setString("各位，真是不好意思我得离开一会。");
			break;
			case 8:
			this.setString("不要吵了专心玩游戏吧！");
			break;
			default:
			break;
			}
			}
		}

	}
	ConnectUI2Logic(node,bind);
}
function MJChat(uid,type,msg,num){jsclient.gamenet.request("pkroom.handler.tableMsg",{cmd:"MJChat",uid:uid ,type:type,msg:msg ,num:num  }); }
function SendChatMsg(byClick)
{
	if (input.string) 
	{
		//新增代码
        mylog("屏蔽字判断1：" + input.string);
	    var newString = checkChatWords(input.string);

		MJChat(SelfUid(),CHAT_TYPE_INPUT,newString,0);
	}
	if(byClick) input.didNotSelectSelf();
	mylog("send "+byClick);
	playerChatLayer.removeFromParent(true);
	
}

window.ChatLayer = cc.Layer.extend({
	jsBind:{
		block:{
			_layout:[[1,1],[0.5,0.5],[0,0],true]
			,_click:function()
			{
				playerChatLayer.removeFromParent(true);
			}
			
		 }
		,back:{
			//_layout:[[0.73,0.89],[0.5,0.5],[0,0]]
			_layout:[[0,0.89],[0.5,0.5],[0,0]]
			,inputimg:{
				input:{
					_run:function()
					{
						input = this;
					}
					,_listener:function(sender,eType)
					{
						switch (eType) {
                          case ccui.TextField.EVENT_DETACH_WITH_IME:
						     //SendChatMsg(false);
							 break;
						}
					}
				}
			}
			,send_btn:{
				_click:function(){SendChatMsg(true);}
			}
			,changyong:{
				_run:function()
				{
					changyong = this;
				},_check:function(sender, type)
				{
					switch (type) {
						case ccui.CheckBox.EVENT_SELECTED:
							emoji.selected =false;
							changyong.zIndex = 10;
							emoji.zIndex = 5;
							emoji_bg_chat.visible =true;
							emoji_bg.visible = false;
							break;
						case ccui.CheckBox.EVENT_UNSELECTED:
							changyong.zIndex = 5;
							emoji.zIndex = 10;
							emoji.selected =true;
							emoji_bg_chat.visible =false;
							emoji_bg.visible = true;
							break;
					}
				}
			}
			,emoji:{
				_run:function()
				{
					emoji = this;
				},_check:function(sender, type)
				{
					switch (type) {
						case ccui.CheckBox.EVENT_SELECTED:
							changyong.selected = false;
							emoji.zIndex = 10;
							changyong.zIndex = 5;
							emoji_bg_chat.visible =false;
							emoji_bg.visible = true;
							break;
						case ccui.CheckBox.EVENT_UNSELECTED:
							emoji.zIndex = 5;
							changyong.zIndex = 10;
							changyong.selected = true;
							emoji_bg_chat.visible =true;
							emoji_bg.visible = false;
							break;
					}
				}
			}
			,emoji_bg_chat:{
				_run:function(){
					emoji_bg_chat = this;
				}
				,item:{
					_visible:false
					,_run:function(){
						uiitem = this;
						uiitem.opacity=0;
					}
					,text:{}
				}
				,list:{
					_run:function()
					{
					
					var num=9;
                    for(var i=0;i<num;i++)
					{
						var item=uiitem.clone();
						item.visible=true;

						item.scale=this.width/item.width*0.9;
						this.insertCustomItem(item,i);
 						BindItem(item,i);
						
					}	
					}
				}
				
			}
			,emoji_bg:{
				_run:function(){
					emoji_bg = this;
				}
				,happy:{_click:function(){emojiAction(0);}}
				,angry:{_click:function(){emojiAction(1);}}
				,smaile:{_click:function(){emojiAction(2);}}
				,han:{_click:function(){emojiAction(3);}}
				,zhiya:{_click:function(){emojiAction(4);}}
				,shihua:{_click:function(){emojiAction(5);}}
				,jiong:{_click:function(){emojiAction(6);}}
				,sleep:{_click:function(){emojiAction(7);}}
				,fennu:{_click:function(){emojiAction(8);}}
				,yun:{_click:function(){emojiAction(9);}}
				,lihai:{_click:function(){emojiAction(10);}}
				,touxiang:{_click:function(){emojiAction(11);}}
				,se:{_click:function(){emojiAction(12);}}
				,huaxiao:{_click:function(){emojiAction(13);}}
				,shaoxiang:{_click:function(){emojiAction(14);}}

			}

		}
	
	},
    ctor:function () 
	{
		this._super();
        var chatui = ccs.load("res/PlayerChat.json");
		ConnectUI2Logic(chatui.node,this.jsBind);
        this.addChild(chatui.node);
		playerChatLayer = this;
        return true;

	}
});


})();


