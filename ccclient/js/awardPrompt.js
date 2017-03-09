//获得钻石界面

(function()
{
    var layer,diamondNum = 0;
    AwardPrompt = cc.Layer.extend({
        jsBind: {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},
            back:
            {
                _layout:[[0.54,0.66],[0.5,0.5],[0,0]],
                num:
                {
                    _run: function()
                    {
                        this.setString(diamondNum);
                    }
                },

                close:
                {
                    _click:function(btn,eT)
                    {
                        layer.removeFromParent( true );
                    }
                }
            }
        },
        ctor: function (num)
        {
            this._super();
            diamondNum = num;
            var changeidui = ccs.load("res/awardPrompt.json");
            ConnectUI2Logic(changeidui.node, this.jsBind);
            this.addChild(changeidui.node);
            layer = this;
            return true;
        }
    });
})();

