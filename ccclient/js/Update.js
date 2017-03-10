(function () 
{
    /*
     提示: 参考:孙书林 的代码
     功能：
     客户端:循环请求web下的configuration.json，发现与上次有差别时，更新游戏内显示。（5分钟请求一次）
     服务端:路南平
     web端:产品配置
     生效时间:假如10分钟后效

     配置文件说明：
     {
     "weixinBuy":"hnxiuhhhggggxiu7332072" 			//微信号
     ,"severRestart":"重启！！！！！！！！！！！！！！！！！！" 	//服务器重启提示
     ,"restartTipBegin":"2016,10,26,15,50,00" 		//服务器重启提示面板开始弹出时间
     ,"restartTipEnd":"2016,10,31,17,50,00"			//服务器重启提示面板停止弹出时间
     ,"restartTipInterval": "300"						//服务器重启提示面板弹出间隔
     ,"gameTip":"1111111跑得快更新说明 V1.3.6\n\n1.增加出牌选项：黑桃3先出、赢家先出（选项在第二局生效）\n2.报单修改：报单后，出单牌时，只能出手中最大的牌\n3.新增癞子玩法\n\n\n咨询微信号：nuokf123"			//公告面板
     ,"homeScroll":"1112222!!!!!代理咨询请联系微信号:leyouxihn002，禁止赌博，如因此产生的法律责任与该平台无关。"					//跑马灯文字
     }
     （注意：后台输入内容全部是字符串，想公告，重启提示等有指定换行格式需要的程序里面需要处理一下，“\n”后台输入的是两个字符，要在程序内换成一个转义字符）。
     循环请求：
     主要是比较文本差异，处理时间，找到需要更新的字段，然后发送消息“cfgUpdate”。*/
    function startUpdateCfg()
    {
        var updateCfgInterval = 10*60; //重复请求时间间隔
        var restartTime = -1; //重启弹出累计时间
        //字符串\n替换
        var formatStr = function (obj) 
        {
            if(!obj) return;
            for(var key in obj){
                obj[key] = obj[key].replace(/\\n/g,"\n");
            }
            return obj;
        };
        //日期格式替换
        var formatData = function (data) 
        {
            if(!data) return false;
            var times = data.split(",");
            for(var i = 0; i < times.length; i++){
                times[i] = Number(times[i]);
            }
            return times;
        };
        //更新数据
        var updatecfg = function () 
        {
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.open("GET", "http://gdmj.coolgamebox.com:800/gdmj/configuration.json");
            xhr.onreadystatechange = function ()
            {
                if (xhr.readyState == 4 && xhr.status == 200)
                {
                    jsclient.updateCfg = formatStr(JSON.parse(xhr.responseText));
                    if(!jsclient.lastUpdateCfg)
                    {
                        jsclient.lastUpdateCfg = jsclient.updateCfg;
                        GetRemoteCfg();
                    }

                    cc.log("更新内容： " + JSON.stringify(jsclient.updateCfg));

                    var changeValue = {};
                    changeValue.isShowed = true; //提示界面是否显示过了
                    jsclient.changeValue = changeValue;
                    
                    for(var key in jsclient.updateCfg)
                    {
                        //if(jsclient.updateCfg[key] != jsclient.lastUpdateCfg[key]){
                        if(jsclient.updateCfg[key] != jsclient.lastUpdateCfg[key] || !jsclient.isCfgRead)
                        {
                            changeValue[key] = jsclient.updateCfg[key];
                            cc.log("wcx6 " + key +"=" +  jsclient.updateCfg[key]);
                            changeValue.isShowed = false;
                        }
                    }

                    //有重启配置并且累计时间大于弹出间隔时间时弹出面板
                    var time_now = jsclient.getCurrentTime();
                    if(jsclient.dateInRectDate(time_now, formatData(jsclient.updateCfg.restartTipBegin), formatData(jsclient.updateCfg.restartTipEnd)))
                    {
                        if((restartTime >= Number(jsclient.updateCfg.restartTipInterval)) || (restartTime < 0))
                        {
                            changeValue.severRestart = jsclient.updateCfg.severRestart;
                            restartTime = 0;
                        }
                        else
                        {
                            changeValue.severRestart = null;
                        }
                    }
                    
                    restartTime += updateCfgInterval;
                    
                    { //存文件
                        jsclient.isCfgRead = true;
                        jsb.fileUtils.writeStringToFile(JSON.stringify(jsclient.updateCfg),
                            jsb.fileUtils.getWritablePath()+  'configuration.json');
                    }
                    
                    sendEvent("cfgUpdate", changeValue); //此时 home ui 不一定存在
                    jsclient.lastUpdateCfg = jsclient.deepClone(jsclient.updateCfg);
                }
                else if(!jsclient.updateCfg)
                {
                    CfgGetFail();
                }
            };
            xhr.onerror = function (event) {
                if(!jsclient.updateCfg)
                    CfgGetFail();
            };
            xhr.send();
        };
        //jsclient.Scene.runAction(cc.repeatForever(cc.sequence(cc.callFunc(updatecfg), cc.DelayTime(updateCfgInterval))));
        {
            jsclient.Scene.runAction(cc.repeatForever(cc.sequence(cc.callFunc(updatecfg), cc.DelayTime(updateCfgInterval))));
        }
    }

    var jindu = 1,isAlready = false;
    function upText()
    {
        jindu++;
        if(jindu<=99)
        {
            if(jindu !=99)  bar.setPercent(jindu);
            loadTitle.setString("资源正在加载中(" + jindu + "%)");
        }
        else
        {
            if(jindu==100)
                GetRemoteCfg();
        }
    }

    function setProgressPercent(p)
    {
        if(p==100)
        {
            isAlready = false;
            //jsclient.updateui.schedule(upText,0.01);
        }
        else
        {
            bar.setPercent(p);
            loadTitle.setString("资源正在更新中(" + parseInt(p) + "%)");
            isAlready = true;

            var isUpdate = sys.localStorage.getItem("isUpdate");
            if(!isUpdate || isUpdate != "1") sys.localStorage.setItem("isUpdate", "1");

        }
    }

    function CfgGetFail()
    {
        sendEvent("disconnect", 5);
    }

    function LoadConfig(remoteCfgName)
    {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://gdmj.coolgamebox.com:800/gdmj/" + remoteCfgName);
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                jsclient.remoteCfg = JSON.parse(xhr.responseText);
                sendEvent("updateFinish");
            }
            else
                CfgGetFail();
        };
        xhr.onerror = function (event)
        {
            CfgGetFail();
        };
        xhr.send();
    }

    function LoadActionCfg(remoteCfgName)
    {
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.open("GET", "http://gdmj.coolgamebox.com:800/gdmj/" + remoteCfgName);
        xhr.onreadystatechange = function ()
        {
            if (xhr.readyState == 4 && xhr.status == 200)
            {
                jsclient.actionCfg = JSON.parse(xhr.responseText);
                log("活动数据：" + JSON.stringify(jsclient.actionCfg));
                sendEvent("UpdateGiftFlag", jsclient.actionCfg);
            }
        };
        xhr.send();
    }
    
    function LoadUpdateCfg(remoteCfgName)
    {
        if(jsclient.updateCfg)
            return;

        if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + remoteCfgName))
        {
            cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + remoteCfgName, function (er, txt)
            {
                if (txt && txt.length > 0)
                {
                    //设置
                    jsclient.isCfgRead = true; //文件读取成功
                    jsclient.updateCfg = JSON.parse(txt);
                    jsclient.lastUpdateCfg = jsclient.deepClone(jsclient.updateCfg);
                    startUpdateCfg();
                }
                else
                {
                    jsclient.isCfgRead = false; //文件读取失败
                    startUpdateCfg();
                }
            });
        }
        else
        {
            jsclient.isCfgRead = false; //文件读取失败
            startUpdateCfg();
        }
    }

    function GetRemoteCfgNet()
    {
        var remoteCfgName = "android.json";
        if (cc.sys.OS_IOS == cc.sys.os)
        {
            if (jsb.fileUtils.isFileExist(jsb.fileUtils.getWritablePath() + "majiangios.txt"))
            {
                cc.loader.loadTxt(jsb.fileUtils.getWritablePath() + "majiangios.txt", function (er, txt)
                {
                    if (txt && txt.length > 0)
                    {
                        remoteCfgName = txt + ".json";
                        LoadConfig(remoteCfgName);
                    }
                    else
                        CfgGetFail();
                });
                return;
            }
            else 
                remoteCfgName = "appstore.json";
        }
        LoadConfig(remoteCfgName);
    }

    function GetRemoteCfg()
    {
        cc.loader.loadTxt("res/test.cfg", function (er, txt)
        {
            if (er || txt.length == 0)
            {
                GetRemoteCfgNet();
            }
            else
            {
                jsclient.remoteCfg = JSON.parse(txt);
                sendEvent("updateFinish");
            }
        });

        var onDelayCallback = function ()
        {
            LoadActionCfg("action.json");
            LoadUpdateCfg("configuration.json");
        };
        
        jsclient.Scene.runAction(cc.sequence(cc.DelayTime(1), cc.callFunc(onDelayCallback)));
    }

    function GetRemoteIP()
    {

        // if (cc.sys.OS_WINDOWS == cc.sys.os)
        // {
            // jsclient.remoteIP = "192.168.1.1";
            GetRemoteCfg();
        // LoadUpdateCfg("configuration.json");
            // return;
        // };

        // var xhr = cc.loader.getXMLHttpRequest();
        // xhr.open("GET", "http://ip.taobao.com/service/getIpInfo2.php?ip=myip");
        // xhr.onreadystatechange = function () {
        //     if (xhr.readyState == 4 && xhr.status == 200) {
        //
        //         var js = JSON.parse(xhr.responseText);
        //         jsclient.remoteIP = js.data.ip;
        //     }
        //
        //    // GetRemoteCfg();
        //     if(isAlready){
        //         GetRemoteCfg();
        //     }else jsclient.updateui.schedule(upText,0.01);
        //
        //
        // }
        // xhr.onerror = function (event) {
        //     GetRemoteCfg();
        // }
        // xhr.send();

    }

    var manager, listener, loadTitle,barbk,bar;

    UpdateLayer = cc.Layer.extend({
        jsBind:
        {
            back:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0],true],

                _event:
                {
                    connect: function ()
                    {
                        jsclient.updateui.removeFromParent(true);
                    },

                    AssetsManagerEvent: function (event)
                    {
                        function updateFinish(upOK, code)
                        {
                            cc.eventManager.removeListener(listener);
                            if (upOK == 1)
                            {
                                jsclient.resVersion = manager.getLocalManifest().getVersion();
                                GetRemoteIP();
                            }
                            else if (upOK == 2)
                                jsclient.restartGame();
                            else
                                sendEvent("disconnect", 10 + code);

                            manager.release();
                        }

                        code = ["ERROR_NO_LOCAL_MANIFEST,", "ERROR_DOWNLOAD_MANIFEST", "ERROR_PARSE_MANIFEST", "NEW_VERSION_FOUND", "ALREADY_UP_TO_DATE",
                            "UPDATE_PROGRESSION", "ASSET_UPDATED", "ERROR_UPDATING", "UPDATE_FINISHED", "UPDATE_FAILED", "ERROR_DECOMPRESS"];

                        //var error=code[event.getEventCode()] + "|" + event.getMessage() + "|" + event.getAssetId() + "|" + event.getPercent();
                        //cc.log(error);

                        switch (event.getEventCode())
                        {
                            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                            case jsb.EventAssetsManager.ERROR_UPDATING:
                            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                            case jsb.EventAssetsManager.UPDATE_FAILED:

                                updateFinish(0, event.getEventCode());
                                break;
                            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                                break;
                            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                                setProgressPercent(event.getPercent());
                                break;
                            case jsb.EventAssetsManager.ASSET_UPDATED:
                                break;
                            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:

                                updateFinish(1);
                                break;
                            case jsb.EventAssetsManager.UPDATE_FINISHED:
                                updateFinish(2);
                                break;
                            default:
                                break;
                        }
                    }
                }
            },

            logo:
            {
                _layout:[[0.35,0.35],[0.5,0.75],[0.08,0],true]
            },

            barbk:
            {
                _layout: [[0.43, 0.07], [0.51, 0.2], [0,0],true],
                _run:function()
                {
                    barbk = this;
                },

                bar:
                {
                    _run: function ()
                    {
                        bar = this;
                    }
                },

                loadTitle:
                {
                    _run: function ()
                    {
                        loadTitle = this;
                    }
                }
            }
        },
        ctor: function ()
        {
            this._super();
            var updateui = ccs.load(res.Updae_json);
            ConnectUI2Logic(updateui.node, this.jsBind);
            this.addChild(updateui.node);
            jsclient.updateui = this;
            //this.schedule(upText,0.01);
            return true;
        },
        onEnter: function ()
        {
            this._super();

            function UpdateResource()
            {
                manager = new jsb.AssetsManager("res/project.manifest", jsb.fileUtils.getWritablePath() + "update");
                manager.update();
                // As the process is asynchronised, you need to retain the assets manager to make sure it won't be released before the process is ended.
                manager.retain();
                if (!manager.getLocalManifest().isLoaded())
                {
                    manager.release();
                    GetRemoteIP();
                }
                else
                {
                    listener = new jsb.EventListenerAssetsManager(manager, function (event)
                    {
                        sendEvent("AssetsManagerEvent", event);
                    });
                    cc.eventManager.addListener(listener, 1);
                }
            }
            //if(  cc.sys.OS_WINDOWS == cc.sys.os )  GetRemoteIP();	else
            UpdateResource();
        }
    });


})();


//消息、联系我们
(function ()
{
    var webViewLayer, uiPara, title, des, cont_us, message,contact_us;

    WebViewLayer = cc.Layer.extend(
    {
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true]
            },
            back:
            {
                _layout: [[0, 0.89], [0.5, 0.5], [0, 0]],

                title:
                {
                    _run: function ()
                    {
                        title = this;
                    }
                },
                des:
                {
                    _run: function ()
                    {
                        des = this;
                    }
                },
                cont_us:
                {
                    _run: function ()
                    {
                        cont_us = this;
                    }
                },

                message:
                {
                    _run:function()
                    {
                        message = this;
                    },

                    _check:function(sender, type)
                    {
                        switch (type)
                        {
                        case ccui.CheckBox.EVENT_SELECTED:
                            contact_us.selected = false;
                            title.visible = true;
                            des.visible = true;
                            cont_us.visible = false;
                            break;
                        case ccui.CheckBox.EVENT_UNSELECTED:
                            contact_us.selected = true;
                            title.visible = false;
                            des.visible = false;
                            cont_us.visible = true;
                            break;
                        }
                    }
                },
                contact_us:
                {
                    _run:function()
                    {
                        contact_us = this;
                    },
                    _check:function(sender, type)
                    {
                        switch (type)
                        {
                        case ccui.CheckBox.EVENT_SELECTED:
                            message.selected = false;
                            title.visible = false;
                            des.visible = false;
                            cont_us.visible = true;
                            break;
                        case ccui.CheckBox.EVENT_UNSELECTED:
                            message.selected = true;
                            title.visible = true;
                            des.visible = true;
                            cont_us.visible = false;
                            break;
                        }
                    }
                },

                close:
                {
                    _click: function ()
                    {
                        webViewLayer.removeFromParent(true);
                    }
                }
            }
        },
        ctor: function ()
        {
            this._super();
            var web = ccs.load("res/WebView.json");
            // uiPara = jsclient.uiPara;
            ConnectUI2Logic(web.node, this.jsBind);
            title.setVisible(false);
            des.setVisible(false);
            cont_us.setVisible(false);

            var url = jsclient.remoteCfg.noticeUrl;
            log("联系我们：" + url);
            if (ccui.WebView)
            {
                var xhr = cc.loader.getXMLHttpRequest();
                // xhr.open("GET", "http://gdmj.coolgamebox.com:800/gdmj/notice.json");

                xhr.open("GET", url);
                xhr.onreadystatechange = function ()
                {
                    if (xhr.readyState == 4 && xhr.status == 200)
                    {
                        var js = JSON.parse(xhr.responseText);
                        var noticeJson = js;
                        if (title && des && cont_us)
                        {
                            title.setString(noticeJson.title);
                            des.setString(noticeJson.desc);
                            cont_us.setString(noticeJson.contact);
                            title.visible = true;
                            des.visible = true;
                            //cont_us.visible = true;
                        }
                    }
                };
                xhr.onerror = function (event)
                {
                };
                xhr.send();
            }
            this.addChild(web.node);
            webViewLayer = this;
        }
    });

})();

//用户协议
(function ()
{
    var webViewLayer1, uiPara, webView, scroll;

    WebViewLayer1 = cc.Layer.extend(
    {
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0],2],
                back:
                {
                    scroll:
                    {
                        _run:function()
                        {
                            scroll = this;
                        }
                    }
                },
                yes:
                {
                    _click: function ()
                    {
                        webViewLayer1.removeFromParent(true);
                    }
                },
            },
        },
        ctor:function ()
        {
            this._super();
            var web = ccs.load("res/WebView1.json");
            ConnectUI2Logic(web.node, this.jsBind);

            var url = jsclient.remoteCfg.legalUrl;
            log("协议：" + jsclient.remoteCfg.legalUrl);
            if (ccui.WebView)
            {
                var bkNode = this.jsBind.block.back._node;
                var cSize = bkNode.getCustomSize();
                webView = new ccui.WebView(url);
                webView.name = "webView";
                webView.setContentSize(cSize.width*bkNode.scaleX*0.82,cSize.height*bkNode.scaleY*0.75);
                webView.setPosition(bkNode.x-cSize.width*0.125,bkNode.y-cSize.height* 0.025);
                webView.color = cc.color(254, 231, 197);
                webView.setScalesPageToFit(true);
                bkNode.addChild(webView);
                webView.setEventListener(ccui.WebView.EventType.LOADED, function ()
                {
                    webView.visible = true;
                });
                webView.visible = false;
            }
            this.addChild(web.node);
            webViewLayer1 = this;
        }
    });

})();

//游戏玩法
(function ()
{
    var webViewLayer2, uiPara, webView, scroll, tables = [], url = [], help;

    function createWebViewByUrl(url)
    {
        log("玩法：" + url);
        if (ccui.WebView)
        {
            var cSize = help.getCustomSize();
            webView = new ccui.WebView(url);
            webView.setContentSize(cSize.width, cSize.height);
            webView.setPosition(400,220);
            webView.color = cc.color(254, 231, 197);
            webView.setScalesPageToFit(true);
            help.addChild(webView);
            webView.setEventListener(ccui.WebView.EventType.LOADED, function ()
            {
                webView.visible = true;
            });
            webView.visible = false;
        }
    }

    function setPanelContentByType(type)
    {
        // var url1 = jsclient.remoteCfg.help1Url;
        // var url2 = jsclient.remoteCfg.help2Url;
        // var url3 = jsclient.remoteCfg.help3Url;
        // var url4 = jsclient.remoteCfg.help4Url;
        // var url5 = jsclient.remoteCfg.help5Url;
        // var url6 = jsclient.remoteCfg.help6Url;
        // var url7 = jsclient.remoteCfg.help7Url;
        // var url8 = jsclient.remoteCfg.help8Url;
        // var url9 = jsclient.remoteCfg.help9Url;

        url[1] = jsclient.remoteCfg.help1Url;
        url[2] = jsclient.remoteCfg.help2Url;
        url[3] = jsclient.remoteCfg.help3Url;
        url[4] = jsclient.remoteCfg.help4Url;
        url[5] = jsclient.remoteCfg.help5Url;
        url[6] = jsclient.remoteCfg.help6Url;
        url[7] = jsclient.remoteCfg.help7Url;
        url[8] = jsclient.remoteCfg.help8Url;
        url[9] = jsclient.remoteCfg.help9Url;

        for(var i = 1; i < tables.length; i++)
        {
            var gameTable = tables[i];

            if(i == type)
            {
                gameTable.setBright(false);
                gameTable.setEnabled(false);
            }
            else
            {
                gameTable.setBright(true);
                gameTable.setEnabled(true);
            }
        }

        createWebViewByUrl(url[type]);


    }

    WebViewLayer2 = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0],2],
                back:
                {
                    scroll:
                    {
                        _run:function()
                        {
                            scroll = this;
                        }
                    }
                },

                ScrollView:
                {
                    gdmjtable:
                    {
                        _run:function ()
                        {
                            tables[1] = this;
                        },

                        _click:function()
                        {
                            setPanelContentByType(1);
                        }
                    },

                    hzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[2] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(2);
                        }
                    },

                    shzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[3] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(3);
                        }
                    },

                    jphmjtable:
                    {
                        _run:function ()
                        {
                            tables[4] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(4);
                        }
                    },

                    dgmjtable:
                    {
                        _run:function ()
                        {
                            tables[5] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(5);
                        }
                    },

                    ybzhmjtable:
                    {
                        _run:function ()
                        {
                            tables[6] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(6);
                        }
                    },

                    bdhmjtable:
                    {
                        _run:function ()
                        {
                            tables[7] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(7);
                        }
                    },

                    chshmjtable:
                    {
                        _run:function ()
                        {
                            tables[8] = this;
                        },

                        _click:function ()
                        {
                            setPanelContentByType(8);
                        }
                    },

                },

                help:
                {
                    _run:function ()
                    {
                        help = this;
                    }
                },

                yes:
                {
                    _click: function ()
                    {
                        webViewLayer2.removeFromParent(true);
                    }
                },
            },
        },
        ctor:function ()
        {
            this._super();
            var web = ccs.load("res/WebView2.json");
            ConnectUI2Logic(web.node, this.jsBind);
            this.addChild(web.node);
            webViewLayer2 = this;

            setPanelContentByType(1);
        }
    });

})();

var playLogIfoArry = [];
var playLogInfoItem = {};
(function ()
{
    var playLogView, uiItem, uiList;

    function BindLogItem(ui, item, num)
    {
        var bind =
        {
            time:
            {
                _text: function ()
                {
                    return item.now
                }
            },

            tableid:
            {
                _text: function ()
                {
                    return "房间ID:" + item.tableid
                }
            },

            player0:
            {
                _text: function ()
                {
                    return unescape(item.players[0].nickname);
                }
            },

            player0num:
            {
                _text: function ()
                {
                    return ":" + item.players[0].winall;
                }
            },

            player1:
            {
                _text: function ()
                {
                    return unescape(item.players[1].nickname);
                }
            },

            player1num:
            {
                _text: function ()
                {
                    return ":" + item.players[1].winall;
                }
            },

            player2:
            {
                _text: function ()
                {
                    return unescape(item.players[2].nickname);
                }
            },

            player2num:
            {
                _text: function ()
                {
                    return ":" + item.players[2].winall;
                }
            },

            player3:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return unescape(item.players[3].nickname);
                }
            },

            player3num:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return ":" + item.players[3].winall;
                }
            },

            num:
            {
                _text: function ()
                {
                    return num + "";
                }
            },

            _click: function ()
            {
                //jsclient.getPlayLogOne(item.now, item.logid);
                jsclient.getPlayLogOne(item);
                playLogInfoItem = item;
            }
        };

        ConnectUI2Logic(ui, bind);
    }


    PlayLogLayer = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            },

            close:
            {
                _layout:[[0.08,0.08],[1,1],[-0.5,-0.5]],

                _click: function ()
                {
                    playLogView.removeFromParent(true);
                    delete jsclient.data.sData;
                }
            },

            table:
            {
                _layout:[[0.6, 0.6], [0.08, 0.62], [0, 0]]
            },

            back:
            {
                _layout: [[0.88, 0.90], [0.555, 0.45], [0, 0], 2],

                list:
                {
                    _run: function ()
                    {
                        uiList = this;
                    }
                },

                _event:
                {
                    playLog: function ()
                    {
                        var log = jsclient.data.playLog;
                        uiList.removeAllItems();
                        var num = log.logs.length;
                        for (var i = 0; i < log.logs.length; i++)
                        {
                            var item = uiItem.clone();
                            item.visible = true;
                            item.scale = uiList.width / item.width * 0.9;
                            uiList.insertCustomItem(item, 0);
                            BindLogItem(item, log.logs[i], num - i);

                        }
                    }
                }
            },

            item:
            {
                _layout: [[0.7, 0], [0.5, 0.5], [0, 0]],

                 _run: function ()
                 {
                     this.setVisible(false);
                     this.setOpacity(0);
                     // this.opacity = 0;
                     // this.visible = false;
                     uiItem = this;

                },

                _event:
                {
                    playLogOne: function (msg)
                    {
                        playLogIfoArry = [];
                        var arry = [];
                        arry[0] = [];
                        var j = 0;

                        for (var i = 0; i < msg.length; i++)
                        {
                            arry[j].push(msg[i]);

                            if (msg[i] == "roundEnd")
                            {
                                arry[j].push(msg[i + 1]);
                                playLogIfoArry.push(arry[j]);
                                i++;
                                j++;
                                arry[j] = [];
                                arry[j].push(msg[0]);
                                arry[j].push(msg[1]);
                            }
                            else if (i == msg.length - 1)
                            {
                                playLogIfoArry.push(arry[j]);
                            }
                        }

                        if (msg)
                        {
                            jsclient.Scene.addChild(new playLogInfoLayer());
                        }
                    }
                }
            },

        },
        ctor: function ()
        {
            this._super();
            var web = ccs.load("res/PlayLog.json");
            ConnectUI2Logic(web.node, this.jsBind);
            var playLog = jsclient.data.playLog;
            if (!playLog)
                jsclient.getPlayLog();
            else
                this.jsBind.back._event.playLog();

            this.addChild(web.node);
            playLogView = this;
        }
    });

})();

var plmjhand1 = [];
var plmjhand2 = [];
var plmjhand3 = [];
var updatelayer_itme_node;
(function ()
{
    var playLogInfoView, uiItem, uiList, msgCount, delay, update_tData, players;
    var hand = [];

    function BindLogItem(ui, item, num)
    {
        for (var i = 0; i < playLogIfoArry[num - 1].length; i++)
        {
            if (playLogIfoArry[num - 1][i] == "players")
            {
                for (var id in playLogIfoArry[num - 1][i + 1])
                {
                    for (var j = 0; j < item.players.length; j++)
                    {
                        if (item.players[j].nickname == playLogIfoArry[num - 1][i + 1][id]["info"]["nickname"])
                        {
                            item.players[j].uid = id;
                        }
                    }
                }

            }
            else if (playLogIfoArry[num - 1][i] == "roundEnd")
            {
                for (var j = 0; j < item.players.length; j++)
                {
                    var _uid = item.players[j].uid;
                    item.players[j].winone = playLogIfoArry[num - 1][i + 1]["players"][_uid].winone;
                }
            }
        }

        var bind =
        {
            time:
            {
                _text: function ()
                {
                    return item.now
                }
            },

            tableid:
            {
                _text: function ()
                {
                    return "房间ID:" + item.tableid
                }
            },

            player0:
            {
                _text: function ()
                {
                    return unescape(item.players[0].nickname);
                }
            },

            player0num:
            {
                _text: function ()
                {
                    return ":" + item.players[0].winone;
                }
            },

            player1:
            {
                _text: function ()
                {
                    return unescape(item.players[1].nickname);
                }
            },

            player1num:
            {
                _text: function ()
                {
                    return ":" + item.players[1].winone;
                }
            },

            player2:
            {
                _text: function ()
                {
                    return unescape(item.players[2].nickname);
                }
            },

            player2num:
            {
                _text: function ()
                {
                    return ":" + item.players[2].winone;
                }
            },

            player3:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].nickname == null)
                        return "";

                    return unescape(item.players[3].nickname);
                }
            },

            player3num:
            {
                _text: function ()
                {
                    if(item.players[3] == null || item.players[3].winone == null)
                        return "";

                    return ":" + item.players[3].winone;
                }
            },

            num:
            {
                _text: function ()
                {
                    return num + "";
                }
            },

            replay:
            {
                _click: function ()
                {
                    createReplayLayer(playLogIfoArry[num - 1]);
                }
            }
        };

        ConnectUI2Logic(ui, bind);
    }

    function createReplayLayer(msg)
    {
        logMsg = JSON.parse(JSON.stringify(msg));

        var arry = [];
        var object = {};
        for (var i = 0; i < logMsg.length; i++)
        {
            if (logMsg[i] == "players")
            {
                object[logMsg[i]] = logMsg[i + 1];
                arry[0] = "reinitSceneData";
            }
            if (logMsg[i] == "mjhand")
            {
                object["tData"] = logMsg[i + 2];
                hand = logMsg[i + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);
            }
        }
    }

    function replayController(node)
    {
        plmjhand1 = [];
        plmjhand2 = [];
        plmjhand3 = [];
        delay = 0.5;

        msgCount = 0;
        var callback = function (dt)
        {
            if (logMsg.length == msgCount)
            {
                return;
            }

            if(logMsg[msgCount] == "MJFlower")
            {
                var arry = [];
                arry[0] = "MJFlower";
                arry[1]=logMsg[msgCount+1];

                sendEvent("QueueNetMsg",arry);
            }
            else if(logMsg[msgCount] == "MJZhong")
            {
                var arry = [];
                arry[0] = "MJZhong";
                arry[1]=logMsg[msgCount+1];

                sendEvent("QueueNetMsg",arry);
            }
            else if (logMsg[msgCount] == "mjhand")
            {
                var arry = [];
                var object = {};
                object["tData"] = logMsg[msgCount + 2];
                var mjhand = [];

                var tData = logMsg[msgCount + 2];
                var selfIndex = tData.uids.indexOf(SelfUid());
                var zhuangIndex = tData.zhuang;
                if (!tData.maxPlayer)
                    tData.maxPlayer = 4;
                for (var j = 0; j < tData.maxPlayer; j++)
                {
                    var cardOff = (selfIndex + j + tData.maxPlayer - zhuangIndex) % tData.maxPlayer;
                    if (j == 0)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            mjhand.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                        arry[0] = "mjhand";
                        arry[1] = object;
                        arry[2] = true;
                        object[logMsg[msgCount]] = mjhand;
                        sendEvent("QueueNetMsg", arry);

                    }
                    else if (j == 1)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand1.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                    else if (j == 2)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand2.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                    else if (j == 3)
                    {
                        for (var z = 0; z < 13; z++)
                        {
                            plmjhand3.push(logMsg[msgCount + 1][z + cardOff * 13]);
                        }
                    }
                }

            }
            else if (logMsg[msgCount] == "newCard")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                arry[1] = hand[logMsg[msgCount + 1].cardNext - 1];
                jsclient.data.sData.tData = logMsg[msgCount + 1];
                sendEvent("QueueNetMsg", arry);
            }
            else if (logMsg[msgCount] == "MJPut")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                update_tData = object;

                if (logMsg[msgCount + 1]["uid"] == SelfUid())
                {
                    var putcardParent = jsclient.replayui.jsBind.down._node;
                    var children = jsclient.replayui.jsBind.down._node.children;
                    for (var i = 0; i < children.length; i++)
                    {
                        if (children[i].name == "stand" && children[i].tag == logMsg[msgCount + 1]["card"])
                        {
                            putcard = children[i];
                        }
                    }
                    HandleMJPut(putcardParent, {uid: SelfUid(), card: logMsg[msgCount + 1]["card"]}, 0);
                    sendEvent("QueueNetMsg", arry);
                }
                else
                {
                    sendEvent("QueueNetMsg", arry);
                }

            }
            else if (logMsg[msgCount] == "MJPeng")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);


                var tData =  logMsg[msgCount+1].tData;
                var  curuid= tData.uids[tData.curPlayer];
                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && curuid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "peng";
                        ed.lastput = sData.lastPut;
                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "MJGang")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);

                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && logMsg[msgCount + 1].uid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "gang0";
                        ed.lastput = sData.lastPut;

                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "MJChi")
            {
                var arry = [];
                var object = {};
                arry[0] = logMsg[msgCount];
                object = logMsg[msgCount + 1];
                arry[1] = object;
                sendEvent("QueueNetMsg", arry);

                var tData =  logMsg[msgCount+1].tData;
                var curuid= tData.uids[tData.curPlayer];
                var ed = {};
                for (var i = 0; i < 4; i++)
                {
                    var pl = getUIPlayer(i);
                    if (pl && curuid == pl.info.uid)
                    {
                        var sData=jsclient.data.sData.tData;
                        ed.off = i;
                        ed.eatWhat = "chi0";
                        ed.lastput = sData.lastPut;
                        sendEvent("showcaneat", ed);
                    }
                }
            }
            else if (logMsg[msgCount] == "roundEnd")
            {
                var sData=jsclient.data.sData;
                var tData=sData.tData;
                var uids=tData.uids;
                var players = logMsg[msgCount + 1].players;
                var ed = {};
                var mjhand = [];
                // var uid;
                // for (var i in players)
                // {
                //     if (players[i].winType > 0)
                //     {
                //         uid = i;
                //     }
                // }
                for (var i = 0; i < tData.maxPlayer; i++)
                {
                    // var pl = getUIPlayer(i);
                    // if (pl && uid == pl.info.uid)
                    // {
                    //     var sData=jsclient.data.sData.tData;
                    //     ed.off = i;
                    //     ed.eatWhat = "hu";
                    //     ed.lastput = sData.lastPut;
                    //     sendEvent("showcaneat", ed);
                    // }

                    var selfIndex = uids.indexOf(SelfUid());
                    selfIndex = (selfIndex + i) % tData.maxPlayer;

                    var pl = players[uids[selfIndex]];
                    if (!pl)
                        continue;

                    mjhand = pl.mjhand.slice(0);
                    if (pl.winType > 0)
                    {
                        var index = getIndexPlayer(uids[selfIndex]);
                        ed.off = index;
                        ed.eatWhat = "hu";

                        if(pl.winType > 3)
                            ed.lastput = mjhand[mjhand.length-1];
                        else
                            ed.lastput = tData.lastPut;

                        sendEvent("showcaneat",ed);
                        // break;
                    }
                }
                /*var arry = [];
                 var object = {};
                 arry[0] = logMsg[msgCount];
                 object = logMsg[msgCount+1];
                 arry[1] =object;
                 sendEvent("QueueNetMsg",arry);*/

                //为了显示马，把日志里面的数据 赋值给 sData
                for (var i = 0; i < tData.maxPlayer; i++)
                {
                    players[uids[i]].mjpeng = jsclient.data.sData.players[uids[i]].mjpeng;
                    players[uids[i]].mjgang0 = jsclient.data.sData.players[uids[i]].mjgang0;
                    players[uids[i]].mjgang1 = jsclient.data.sData.players[uids[i]].mjgang1;
                    players[uids[i]].mjchi = jsclient.data.sData.players[uids[i]].mjchi;
                    players[uids[i]].mjput = jsclient.data.sData.players[uids[i]].mjput;
                    players[uids[i]].mjput = jsclient.data.sData.players[uids[i]].mjput;
                }

                jsclient.data.sData.players = players;

                // if(jsclient.replayui)
                //     jsclient.replayui.addChild(new ShowMaPanel());
                sendEvent("replayEndShowMa");
                
                // log("服务返回玩家回放数据sData：" + JSON.stringify(sData))
                // log("服务返回玩家回放数据players：" + JSON.stringify(players))
            }
            
            msgCount++;
        }.bind(node);

        if (logMsg[msgCount] == "MJPut")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJPeng")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJGang")
        {
            delay = 1.5;
        }
        else if (logMsg[msgCount] == "MJChi")
        {
            delay = 1.5;
        }
        else if(logMsg[msgCount] == "MJZhong")
        {
            delay = 1.5;
        }

        node.schedule(callback, delay);
        // node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(delay),cc.callFunc(callback))));
    }

    playLogInfoLayer = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[1, 1], [0.5, 0.5], [0, 0], true],
            },

            close:
            {
                _layout:[[0.08,0.08],[1,1],[-0.5,-0.5]],
                _click: function ()
                {
                    playLogInfoView.removeFromParent(true);
                    playLogIfoArry = [];
                }
            },

            table:
            {
                _layout:[[0.6, 0.6], [0.08, 0.62], [0, 0]]
            },

            back:
            {
                _layout: [[0.88, 0.90], [0.555, 0.45], [0, 0], 2],

                list:
                {
                    _run: function ()
                    {
                        uiList = this;
                    }
                },

                _event:
                {
                    playLog: function ()
                    {
                        uiList.removeAllItems();

                        for (var i = 0; i < playLogIfoArry.length; i++) {
                            var item = uiItem.clone();
                            item.visible = true;
                            item.scale = uiList.width / item.width * 0.9;
                            uiList.insertCustomItem(item, 0);
                            BindLogItem(item, playLogInfoItem, i + 1);
                        }
                    }
                }
            },

            item:
            {
                _layout: [[0.7, 0], [0.5, 0.5], [0, 0]],

                _run: function ()
                {
                    this.setVisible(false);
                    this.setOpacity(0);
                    // this.visible = false;
                    // this.opacity = 0;
                    uiItem = this;
                },

                _event:
                {
                    reinitSceneData: function ()
                    {
                        updatelayer_itme_node = this;
                        replayController(this);
                    },

                    MJPut: function ()
                    {
                        var arry = [];
                        arry[0] = "waitPut";
                        object = jsclient.data.sData.tData;
                        arry[1] = object;
                        var btnReplay = this.getChildByName("replay");
                        var callback = function ()
                        {
                            sendEvent("QueueNetMsg", arry);
                        };
                        btnReplay.runAction(cc.sequence(cc.delayTime(0.5), cc.callFunc(callback)));
                    }
                }

            },
        },

        ctor: function ()
        {
            this._super();
            var web = ccs.load("res/PlayLogInfo.json");
            ConnectUI2Logic(web.node, this.jsBind);

            var playLog = jsclient.data.playLog;
            if (!playLog)
                jsclient.getPlayLog();
            else
                this.jsBind.back._event.playLog();

            this.addChild(web.node);
            playLogInfoView = this;
        }
    });

})();









