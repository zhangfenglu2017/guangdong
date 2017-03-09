var res = {
    // Update_bk:"res/login/z_loading.png",
	Update_bk:"res/login/z_login.png",

	Updae_json:"res/Update.json",
	Login_json:"res/Login.json",
	
	Create_json:"res/create.json",
	Enter_json:"res/enter.json",
	
	Home_json:"res/Home.json",
	Play_json:"res/Play.json",
	Block_json:"res/block.json",
	
	EndOne_json:"res/endOne.json",
	EndAll_json:"res/endAll.json",

	// CreateRoom_json:"res/createRoom.json",
    //
	// PlayMJ_png:"res/playing/MJ/bottom/Z_bottom.png",
	// PlayMJ_plist:"res/playing/MJ/bottom/Z_bottom.plist",
    //
	// PlayMJ_left_png:"res/playing/MJ/left/Z_left.png",
	// PlayMJ_left_plist:"res/playing/MJ/left/Z_left.plist",
    //
	// PlayMJ_right_png:"res/playing/MJ/right/Z_right.png",
	// PlayMJ_right_plist:"res/playing/MJ/right/Z_right.plist",
    //
	// PlayMJ_my_png:"res/playing/MJ/my/Z_my.png",
	// PlayMJ_my_plist:"res/playing/MJ/my/Z_my.plist",
    //
	// PlayMJ_MJ_png:"res/playing/MJ/mjEmpty.png",
	// PlayMJ_MJ_plist:"res/playing/MJ/mjEmpty.plist",

    PlayMJ_my_png:"res/MaJiangNew/z_mj.png",
    PlayMJ_my_plist:"res/MaJiangNew/z_mj.plist",

	PlayMJ_emoji_png:"res/playerchat/emoji_action_texture.png",
	PlayMJ_emoji_plist:"res/playerchat/emoji_action_texture.plist",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
// cc.spriteFrameCache.addSpriteFrames("res/playing/MJ/bottom/Z_bottom.plist");
// cc.spriteFrameCache.addSpriteFrames("res/playing/MJ/mjEmpty.plist");
// cc.spriteFrameCache.addSpriteFrames("res/playing/MJ/my/Z_my.plist");
// cc.spriteFrameCache.addSpriteFrames("res/playing/MJ/right/Z_right.plist");
// cc.spriteFrameCache.addSpriteFrames("res/playing/MJ/left/Z_left.plist");

cc.spriteFrameCache.addSpriteFrames("res/MaJiangNew/z_mj.plist");
cc.spriteFrameCache.addSpriteFrames("res/playerchat/emoji_action_texture.plist");

var jsclient={};

var BlockLayer;
var DelRoomLayer;
var EndRoomLayer;
var WebViewLayer;
var WebViewLayer1;
var PlayLogLayer;
var UserInfoLayer;
var LoginLayer;
var UpdateLayer;
var CreateLayer;
var ChangeIDLayer;
var ExportDataLayer;

function sendEvent(eName,ePara)
{
	cc.eventManager.dispatchCustomEvent(eName,ePara);
}

 
var lognum = 0;
function mylog(txt)
{
	if( cc.sys.OS_WINDOWS != cc.sys.os ) 
		return;

	if(!jsclient.Scene) 
		return;

	var size = jsclient.size;
	var helloLabel = new cc.LabelTTF(txt, "Arial", 20);
	// position the label on the center of the screen
	helloLabel.x = size.width / 2;
	helloLabel.y = - (50*lognum);
	// add the label as a child to this layer
	jsclient.Scene.addChild(helloLabel);
	lognum++;
	helloLabel.zIndex = 2000;
	helloLabel.runAction(
		cc.sequence(
			cc.moveBy(10,0,size.height),
			cc.callFunc(function(){ 
				helloLabel.removeFromParent(true);
				lognum--; 
			})
		)
	);
}

function doLayout(wgt,pct,pos,off,isMax,isPar)
{
	var screen=jsclient.size;
	var cutsize={width:0,height:0};
	var scPar=1;
	if(isPar)
	{
		var min={};
		var psize= {width:wgt.parent.width,height:wgt.parent.height};      //wgt.parent.getSize();
		scPar=wgt.parent.scale;

		cutsize.width=Math.max(0,(psize.width*scPar-screen.width)/2);
		cutsize.height=Math.max(0,(psize.height*scPar-screen.height)/2);

		min.width=Math.min(screen.width,psize.width*scPar);
		min.height=Math.min(screen.height,psize.height*scPar);
		screen=min;
		//mylog(screen.width+" "+screen.height);
	}
	
	var size={width:wgt.width,height:wgt.height}; //wgt.getSize();
	var sw=screen.width*pct[0]/size.width,sh=screen.height*pct[1]/size.height;
	
	if(isMax==true)
	{
		var sc=Math.max(sw,sh);
		sw=sc; sh=sc;
	}
	else if(isMax==2)
	{
		
	}
	else if(sw!=0&&sh!=0)
	{
		var sc=Math.min(sw,sh);
		sw=sc; sh=sc;
	}
	else 
	{
		var sc=Math.max(sw,sh);
		sw=sc; sh=sc;
	}
    
	sw/=scPar;	sh/=scPar;		 
	wgt.scaleX=sw; wgt.scaleY=sh;
	wgt.setPosition(cutsize.width/scPar+screen.width*pos[0]/scPar +off[0]*size.width*sw, 
		cutsize.height/scPar+screen.height*pos[1]/scPar+off[1]*size.height*sh);
}

function showSize()
{
	var size = cc.view.getFrameSize();  
	var wsize = jsclient.size;  
	mylog(size.width+"/"+size.height+"/"+wsize.width+"/"+wsize.height);
}

//注册事件
function BindUIEvent(pjs,node,evt,func)
{
	cc.eventManager.addListener(cc.EventListener.create({
		event: cc.EventListener.CUSTOM,
		eventName: evt,
		callback: function(et)
		{
			func.call(node,et.getUserData(),evt);
		}}), node);

		if(evt=="resize")
			func.call(node);
}

//不同类型的事件
var bindFunction = {
	_event:function(pjs,node,js)
	{
		for(var evt in js)
		{
			BindUIEvent(pjs,node,evt,js[evt]);
		   //cc.eventManager.addCustomListener(evt,func);	
		}
	},
	_touch:function(pjs,node,js)
	{
		node.addTouchEventListener(js,node);
	},
	_click:function(pjs,node,js)
	{
		node.addTouchEventListener(function(btn,eT)
		{ 
        	if(eT==2)
			{
				js(btn,eT);
			}				
		},node);
	}
	,_visible:function(pjs,node,js)
	{
		if(typeof js=="function") node.visible=js();
		else node.visible=js;
	}
	,_keyboard:function(pjs,node,js)
	{
		cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: js.onKeyPressed,
                onKeyReleased:js.onKeyReleased, 
            }, node);
	}
	,_check:function(pjs,node,js)
	{
	   	node.addEventListener(js,pjs);
	}
	,_layout:function(pjs,node,js)
	{
		var ar=[node];  

		for(var i=0;i<js.length;i++)
		   ar.push(js[i]);

	   	BindUIEvent(pjs,node,"resize",function(){
			doLayout.apply(node,ar);
		});
	},
	_text:function(pjs,node,js)
	{
		node.setString(js())
		
	},
	_run:function(pjs,node,js)
	{
		js.call(node);
	}
	,_slider:function(pjs,node,js)
	{
		node.addEventListener(js,node);
	}
	,_listener:function(pjs,node,js)
	{
		node.addEventListener(js,node);
	}
}

//链接cocosStudio
function ConnectUI2Logic(node,js)
{
	if(node == null)
		return;
	
	for(var cd in js)
	{
		if(cd.substr(0,1) == "_")
		{
			var func = bindFunction[cd];
			if(func) 
				func(js,node,js[cd]);
		}
		else
		{
			ConnectUI2Logic(node.getChildByName(cd), js[cd]);
		}
	}
	js._node = node;
	//node.userObject=js;
}