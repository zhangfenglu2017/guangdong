//2016年10月26日 12:21:09
//新手礼包弹框
//jian



(function()
{
    var input, actCodeLayer;
    ActivationCodeLayer = cc.Layer.extend(
    {
        jsBind:
        {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]},
            back:
            {
                _layout:[[0.54,0.66],[0.5,0.5],[0,0]],

                inputimg:
                {
                    input:{
                        _run:function()
                        {
                            input = this;
                        },
                        _listener:function(sender,eType)
                        {
                            switch (eType)
                            {
                                case ccui.TextField.EVENT_DETACH_WITH_IME:
                                    break;
                            }
                        }
                    }
                },
                send_btn:
                {
                    _click:function(btn,eT)
                    {
                        var data =
                        {
                            actId   : jsclient.getGiftData()._id,
                            actType : jsclient.getGiftData().actType,
                            uid     : parseInt( input.getString())
                        };
                        jsclient.getNewPlayerReward( data );
                    }
                },
                close:
                {
                    _click:function(btn,eT)
                    {
                        actCodeLayer.removeFromParent( true );
                    }
                },
                tips:
                {
                    _text:function ()
                    {
                        var num = jsclient.getGiftData().actData.rewards[1];
                        return "新手礼包包含" + num + "钻石";
                    }
                }
            }
        },
        ctor: function ()
        {
            this._super();
            var changeidui = ccs.load("res/activationCodeLayer.json");
            ConnectUI2Logic(changeidui.node, this.jsBind);
            this.addChild(changeidui.node);
            actCodeLayer = this;
            return true;
        }
    });
})();

