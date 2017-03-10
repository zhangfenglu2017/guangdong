


(function()
{
    function  getRichTextItem ( data, index )
    {
        var item = null;
        if( data.type == "text" )
        {
            item = ccui.RichElementText(index,data.color, 255, data.content,"Helvetica", 30 );
        }
        else if( data.type == "image" )
        {
            var node = new cc.Node();
            var image  = new ccui.ImageView(data.path);
            image.setScale( data.scale );
            var size    = image.getContentSize();
            node.setContentSize( cc.size( size.width * data.scale, size.height *data.scale  ) );
            image.x = size.width * data.scale / 2;
            image.y = size.height * data.scale / 2;
            node.addChild( image );
            item = new ccui.RichElementCustomNode(index, cc.color.WHITE, 255, node);
        }
        return item;
    }
    
    function  addRichText( jsonObj, node )
    {
        var richText = new ccui.RichText();
        richText.ignoreContentAdaptWithSize(false);
        richText.width  = node.width;
        richText.height = node.height;

        for( var key in jsonObj )
        {
            var data = jsonObj[key];
            var item = getRichTextItem( data, key );
            richText.pushBackElement( item );
        }
        richText.x = node.width / 2;
        richText.y = node.height / 2;
        node.addChild( richText );
    }


    //提示框
    var text, errorLayer;
    ErroPrompt = cc.Layer.extend({
        _isRichText : false,

        jsBind:
        {
            block:{_layout:[[1,1],[0.5,0.5],[0,0],true]	},

            back:
            {
                _layout:[[0.54,0.66],[0.5,0.5],[0,0]],
                close:
                {
                    _click:function(btn,eT)
                    {
                        errorLayer.removeFromParent( true );
                        jsclient.errorLayer = null;
                    }
                },

                inner:
                {
                    _run: function ()
                    {
                        if( errorLayer._isRichText )
                        {
                            addRichText(text, this);
                        }
                        this.visible = errorLayer._isRichText;
                    }

                },

                content :
                {
                    _run : function ()
                    {
                        if( !errorLayer._isRichText )
                          this.setString( text );

                        this.visible = !errorLayer._isRichText;
                    }
                }
            }
        },
        ctor: function ( txt, isRichText )
        {
            this._super();
            errorLayer    = this;
            text = txt;

            this._isRichText = isRichText ? true : false;
            var changeidui = ccs.load("res/erroPrompt.json");
            ConnectUI2Logic(changeidui.node, this.jsBind);
            this.addChild(changeidui.node);

            jsclient.errorLayer = this;

            return true;
        }

    });
})();



