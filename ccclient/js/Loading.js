//jian
//2016年7月13日 14:41:05
//背景层（loading层）      

var BlockLayer = cc.Layer.extend(
    {
    sprite:null,
    jsBind:
    {
        loading:
        {
            _layout:[[0.2,0.2],[0.5,0.5],[0,0]],
            _run:function()
            {
                this.runAction(cc.repeatForever(cc.rotateBy(2,-360)));
            }
        },

        block:
        {
            _layout:[[1,1],[0.5,0.5],[0,0],true]
        }
    },

    ctor:function()
    {
        this._super();

        var blockui = ccs.load(res.Block_json);
        ConnectUI2Logic(blockui.node,this.jsBind);
        this.addChild(blockui.node);

        jsclient.blockui = this;
        return true;
    },

    onEnter:function()
    {
        this._super();
        jsclient.block = function()
        {
            jsclient.blockui.zIndex=1000;
        };

        jsclient.unblock = function()
        {
            jsclient.blockui.zIndex=-1000;
        };

        jsclient.unblock();

    }
});