function GameNet()
{
	var pomelo_ioError="io-error";
	var pomelo_onKick="onKick";
	var pomelo_error="error";
	var pomelo_close="close";
	var pomelo_disconnect="disconnect";
	var pomelo_reconnect="reconnect";
	var pomelo_heartbeatTimeout="heartbeat timeout";
    var pomelo = window.pomelo;
   
    var  reqPingPong=[];
	var  reqStart=Date.now();
	var  lastTableCmd=null;

    function ComputePingPong()
	{
        reqPingPong.push(Date.now()-reqStart);
        if(reqPingPong.length>5) 
            reqPingPong.splice(0,1);
        
        var pingpong=0;
        for(var i=0;i<reqPingPong.length;i++) 
           pingpong+=reqPingPong[i];
        
        jsclient.reqPingPong=pingpong/reqPingPong.length;
	}

    this.SetCallBack = function (evt,cb)
    {
        pomelo.off(evt);
		if(cb)
        pomelo.on(evt, function (data) 
		{
			if(lastTableCmd==evt) {lastTableCmd=null; ComputePingPong();}
			if(cc.sys.OS_WINDOWS==cc.sys.os) cc.log(evt+"@"+JSON.stringify(data));
			cb(data);
		});
    };
	
	this.QueueNetMsgCallback=function(evt)
	{
		this.SetCallBack(evt,function(d){sendEvent("QueueNetMsg",[evt,d]);});	
	};

    this.connect = function (host,port,f_ok,f_fail)
    {
		reqPingPong=[];
		pomelo.disconnect();
		this.SetCallBack(pomelo_disconnect,f_fail);
        pomelo.init({
            host: host,
            port: port,
            log: false
        }, f_ok);
    };

    this.disconnect=function()
	{
		this.SetCallBack(pomelo_disconnect);
		pomelo.disconnect();
	};

    this.request = function( type,msg,cb )
    {
        try
        {
            reqStart = Date.now();
            if (arguments.length == 2)
            {
                pomelo.notify(type, msg);
                lastTableCmd = null;
                if(type == "pkroom.handler.tableMsg")
                {
                    lastTableCmd=msg.cmd;
                }
            }
            else
            {
               pomelo.request(type, msg, function(rtn)
               {
                   ComputePingPong();
                   if(cc.sys.OS_WINDOWS==cc.sys.os) cc.log(type+" # "+(Date.now()-reqStart)+" "+JSON.stringify(rtn));
                   cb(rtn);
               });
            }
        }
        catch(e)
        {
            sendEvent("disconnect",2);
        }
    };

	this.resetCallback = function()
	{
		this.SetCallBack(pomelo_ioError, function (data) { });
		this.SetCallBack(pomelo_onKick, function (data) { });
		this.SetCallBack(pomelo_error, function (data) { });
		this.SetCallBack(pomelo_close, function (data) { });
		this.SetCallBack(pomelo_disconnect, function (data){ });
		this.SetCallBack(pomelo_reconnect, function (data){ });
		this.SetCallBack(pomelo_heartbeatTimeout, function(){ });
	};

    this.resetCallback();	
	//Object.defineProperty(this,"connected",{get:function(){return 1==pomelo.socket.readyState;}});
}
