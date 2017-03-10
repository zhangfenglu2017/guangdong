


(function(){

	function f_login(mail,code,isLocalGuest)
	{
        var geogData = {};
        geogData.latitude = jsclient.native.GetLatitudePos();    //纬度
        geogData.longitude = jsclient.native.GetLongitudePos();  //经度

		var loginData= code?{mail: mail, code:code}:mail;
		
		loginData.resVersion=jsclient.resVersion;
		loginData.app={appid:"com.coolgamebox.gdmj",os:cc.sys.os};
		loginData.remoteIP=jsclient.remoteIP;
        loginData.geogData = geogData;

		jsclient.gamenet.request("pkcon.handler.doLogin", loginData,
		function (rtn) 
		{
			var unblock=true;
			if (rtn.result==ZJHCode.Success) 
			{
				if(code)
                    sys.localStorage.setItem("loginData", JSON.stringify(loginData));

				log("玩家登陆数据：" + JSON.stringify(rtn));

				sendEvent("loginOK",rtn);
			}
			else if(rtn.result==ZJHCode.playerNotFound)
			{
				if(isLocalGuest)
				{
					unblock=false;
					getGuest();
				}
			}
			else if(rtn.result==ZJHCode.serverFull)
			{
			}
			else if(rtn.result==ZJHCode.clientRestart)
			{
			}
			else if(rtn.result==ZJHCode.clientUpdate)
			{
			}
			else if(rtn.result==ZJHCode.lockPlayerId)	//封号提示
			{
				sys.localStorage.removeItem("WX_USER_LOGIN");
				sys.localStorage.removeItem("loginData"); //不清除，无限登录
				sendEvent("logout");
				cc.log("====== 封号 ======");

				var banTime = rtn.data;
				var banStartTime;
				if(banTime >0)
				{
					var s = parseInt(banTime /1000 %60);
					var m = parseInt(banTime /1000 /60 %60);
					var h = parseInt(banTime /1000 /60 /60 %24);
					var d = parseInt(banTime /1000 /60 /60 /24 %365);
					banStartTime = d + "天" + h + "时" + m + "分" + s + "秒";
				}
				else
                {
					banStartTime = "永久期限";
				}
				jsclient.showMsg("尊敬的用户您好:\n您的账户存在异常已被封号处理!\n封号时间:"
					+banStartTime+"\n解除封号联系客服人员:"+jsclient.remoteCfg.weixinBuy, null, null, null);
			}
			
			if(unblock)
                jsclient.unblock();
		});


		//设置报错log服务器
		if( "undefined" !=  typeof(jsclient.remoteCfg.errorReportServer ) && "" != jsclient.remoteCfg.errorReportServer )
		{
			sys.localStorage.setItem("errorReportServer", jsclient.remoteCfg.errorReportServer);
			sys.localStorage.setItem("reportGameid", jsclient.remoteCfg.reportGameid);
		}
	}
	function getGuest()
	{
	  jsclient.gamenet.request("login.handler.reqGuestID", { app:"zjh"},
	  	function(rtn){

		  if(rtn.result==0)
		  {
			  sys.localStorage.setItem("guestData", JSON.stringify(rtn));
			  f_login(rtn.mail,rtn.code,false);//getGuest
		  }
	  });
	}
	function LoginAsGuest()
	{
		 jsclient.block();

		 var guest=sys.localStorage.getItem('guestData');

		 if(guest) 
		 	guest=JSON.parse(guest);

		 if(!guest) 
		 {
			getGuest();
		 }
		 else if(guest.mail&&guest.code)
		 {
			f_login(guest.mail,guest.code,true);//guest login
		 }
		 else
		 {
		 	getGuest();
		 }
			
	}
	function LoginAsWeChat(wxInfo)
	{
		jsclient.block();
		wxInfo.lType="wx";
		f_login(wxInfo);
	}

	var uI = 0;
	var users = [
		[110210,"FMJ1rZ"],
		[100002,"bxTwJx"],
		[31001,"EHGkmg"],
		[14001,"OpCLnx"],
		[20001,"RuvlVf"]
	];
			
	jsclient.autoLogin=function()
	{
		jsclient.block();
		var WX_USER_LOGIN=sys.localStorage.getItem("WX_USER_LOGIN");
		if(WX_USER_LOGIN)
		{
			WX_USER_LOGIN=JSON.parse(WX_USER_LOGIN);
			LoginAsWeChat(WX_USER_LOGIN);

			return true;
		}
		else 
		{
			var loginData=sys.localStorage.getItem("loginData");
			if(loginData) 
			{
				loginData=JSON.parse(loginData);
				f_login(loginData.mail,loginData.code);

				return true;
			}
			else
			{
				jsclient.unblock();
				return false;
			}
		}
	};

	var agreeNode, wechatLogin, logIcon;

	LoginLayer = cc.Layer.extend({
		jsBind:{
			back:
			{
                _layout:[[1,1],[0.5,0.5],[0,0],true],

				// _run:function ()
				// {
				// 	var loginBkAnim = playAnimByJson("changjing", "weixinnanshou");
				// 	this.addChild(loginBkAnim);
                 //    loginBkAnim.x = 0;
                 //    loginBkAnim.y = 0;
                 //    loginBkAnim.scale = this.scale;
				// }
            },

			logo:
			{
				_layout:[[0.35,0.35],[0.5,0.75],[0.08,0],true],

                _run:function ()
                {
                    logIcon = this;
                }
			},

			wechatLogin:
			{
			   _layout:[[0.6,0.1],[0.5,0.7],[0,-3]],

				_click:function(btn,etype)
				{
					if(agreeNode.isSelected())
					{
						if(cc.sys.OS_WINDOWS == cc.sys.os)
						{
							LoginAsGuest();
						}
						else
                        {
							if (jsclient.native)
								jsclient.native.wxLogin();
						}
					}
				},
				legal:
                {
					_click:function()
                    {
						jsclient.openWeb(1);
					}
				},

				agree:
                {
					_run:function(){ agreeNode = this;}
				},
				_run:function()
				{
                    wechatLogin = this;

                    //IOS提审用
                    if(jsclient.remoteCfg.guestLogin)
					{
						this.touchEnabled = false;
						this.setCascadeOpacityEnabled(false);
						this.opacity = 0;
					}

                    // this.visible = false;
				}
			},

			guestLogin:
			{
                _layout:[[0.6,0.1],[0.5,0.7],[0,-3]],

			    _visible:function()
				{
					return jsclient.remoteCfg.guestLogin;
                    // return true;
				},

                _click:function()
				{
					if(agreeNode.isSelected())
						LoginAsGuest();
				}
			},

			_event:
			{
				WX_USER_LOGIN:function(para)
				{
					if(para.openid)
					{
						
						cc.loader.loadTxt(jsb.fileUtils.getWritablePath()+"nickname.txt",
						function(er,txt){
							if(txt)
							{
								para.nickname=escape(txt);
								sys.localStorage.setItem("WX_USER_LOGIN", JSON.stringify(para));  
								LoginAsWeChat(para);
							}
						}); 
					}
				},
				loginOK:function()
				{
					if(jsclient.loginui){
						jsclient.loginui.removeFromParent(true);
						delete jsclient.loginui;
					}
				}
			},

			version:
            {
				_layout:[[0.1,0.1],[0.96,0.02],[0,0]],
				_run:function ()
                {
					var ver = "ver:" + jsclient.resVersion;
					this.setString(ver);
				}
			},

            fitnessTips:
            {
                _layout:[[0.7,0.7],[0.5,0.16],[0,0]],
            },


            _keyboard:
			{
				onKeyPressed: function (key, event) { },
				onKeyReleased: function (key, event)
                {
				   key-=96;
				   if(key==9&&uI>=0&&uI<users.length)
				   {
					   f_login(users[uI][0],users[uI][1]);
				   }
				   else if(key>=0&&key<users.length)
				   {
					   uI=key;
					   mylog(uI+" "+users[uI]);
				   }
				}
			},

		},
	    ctor:function ()
        {
	        this._super();
	        var loginui = ccs.load(res.Login_json);
			ConnectUI2Logic(loginui.node,this.jsBind);
	        this.addChild(loginui.node);
			jsclient.loginui=this;

	        var iRes = jsclient.autoLogin();
			if(!iRes)
			{
				var versionsPanel = new VersionsPanel();
				var versionsCallBack = function()
				{
					versionsPanel.visible = false;
				};

				jsclient.Scene.addChild(versionsPanel, 99);
				versionsPanel.runAction(cc.sequence(cc.delayTime(3), cc.callFunc(versionsCallBack)));
			}

            //播放特效
            var weixinAnim = playAnimByJson("weixindenglu", "weixinnanshou");
            this.addChild(weixinAnim);
            weixinAnim.x = wechatLogin.x;
            weixinAnim.y = wechatLogin.y;
            weixinAnim.scale = wechatLogin.scale;
            //
            // var logIconAnim = playAnimByJson("guangdongmajiang", "guangdongmajiang");
            // this.addChild(logIconAnim);
            // logIconAnim.x = logIcon.x;
            // logIconAnim.y = logIcon.y;
            // logIcon.visible = false;
            // logIconAnim.scale = logIcon.scale;

			// function callBack()
			// {
			// 	cc.log("========================这是我自己传入的回调函数======================");
			// }
            //
			// var effectHandle = getEffectMgrInst().createEffect(this, "res/animate/play/gang.ExportJson", "gang");
			// getEffectMgrInst().setEffectOffXY(effectHandle, logIcon.x, logIcon.y);
			// getEffectMgrInst().setEffectScale(effectHandle, 1);
			// getEffectMgrInst().playEffect(effectHandle, callBack);

			return true;
	    },
	});
	
})();



