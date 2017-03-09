//Jian
//2016年7月14日 15:03:43
//加入房间

function EnterAddNumber(n)
{
	var change = true;

	if(n>=0&&jsclient.entercode.length < 6)
        //没输入完毕
        jsclient.entercode.push(n);
    else if(n == -1 && jsclient.entercode.length > 0)
        //输错了删除后一位
        jsclient.entercode.length=jsclient.entercode.length-1;
	else if(n==-2&&jsclient.entercode.length>0)
        //重新输入
        jsclient.entercode.length = 0;
	else
        change = false;

	if(change) 
	{
	   sendEvent("EnterAddText");
	   if(jsclient.entercode.length == 6)
	   {
		   var entercode = jsclient.entercode;
		   var tableid = 0;
		   for(var i=0;i<entercode.length;i++)
		   {
               //计算下房间id
			   tableid = tableid * 10+ entercode[i];
		   }
		   jsclient.enterui.removeFromParent(true);
		   jsclient.joinGame(tableid);
	   }
    }
}

function EnterAddText()
{
	var idx=parseInt(this.getName()[2]+"");
	var entercode=jsclient.entercode;
	if(idx<entercode.length)
	{
		this.getChildByName("Text").setString(entercode[idx]);
	}
	else
		this.getChildByName("Text").setString("");
}

function EmptyStr()
{
    return "";
}

var EnterLayer = cc.Layer.extend({
    sprite:null,
	jsBind:
    {
		block:
        {
			_layout:[[1,1],[0.5,0.5],[0,0],true]
		},

		back:
		{
			_layout:[[0.8,0.8],[0.5,0.5],[0,0]],

            close:
            {
				_click:function(btn,evt)
				{
					   jsclient.enterui.removeFromParent(true);
				}
			},

            top:
            {
				bg0:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  },
				bg1:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  },
				bg2:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  },
				bg3:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  },
				bg4:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  },
				bg5:{ _event:{ EnterAddText:EnterAddText  } ,Text:{ _text:EmptyStr }  }
			},

			num:{
				Button_0:{ _click:function(){ EnterAddNumber(0); }  },
				Button_1:{ _click:function(){ EnterAddNumber(1); }  },
				Button_2:{ _click:function(){ EnterAddNumber(2); }  },
				Button_3:{ _click:function(){ EnterAddNumber(3); }  },
				Button_4:{ _click:function(){ EnterAddNumber(4); }  },
				Button_5:{ _click:function(){ EnterAddNumber(5); }  },
				Button_6:{ _click:function(){ EnterAddNumber(6); }  },
				Button_7:{ _click:function(){ EnterAddNumber(7); }  },
				Button_8:{ _click:function(){ EnterAddNumber(8); }  },
				Button_9:{ _click:function(){ EnterAddNumber(9); }  },
				clear:{ _click:function(){ EnterAddNumber(-2); }  },
				del:{ _click:function(){ EnterAddNumber(-1); } }
			}
		}
	},
    ctor:function () {
        this._super();
        var enterui = ccs.load(res.Enter_json);
		ConnectUI2Logic(enterui.node,this.jsBind);
        this.addChild(enterui.node);
		jsclient.enterui=this;
		jsclient.entercode=[];
        return true;
    }
});