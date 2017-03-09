


(function ()
{
    var activityLayer, activityInvite;
    Activity = cc.Layer.extend({
        jsBind:
        {
            block:
            {
                _layout: [[0, 1], [0.5, 0.5], [0, 0]],
            },

            yes:
            {
                _layout: [[0.1, 0.1], [0.95, 0.95], [0, 0]],
                _click: function ()
                {
                    activityLayer.removeFromParent(true);
                }
            },

            table:
            {
                _layout: [[0.3, 0.3], [0.55, 0.93], [0, 0]],
            },

            back:
            {
                _layout: [[0.955, 1], [0.5, 0.455], [0, 0], 3],

                yqyltable:
                {
                    // _click:function ()
                    // {
                    //     if(activityInvite)
                    //         activityInvite.setVisible(true);
                    //     else
                    //     {
                    //         activityInvite = new Activity_Invite();
                    //         this.addChild(activityInvite);
                    //     }
                    // }
                }
            }
        },
        ctor: function ()
        {
            this._super();
            var activity = ccs.load("res/Activity.json");
            ConnectUI2Logic(activity.node, this.jsBind);
            this.addChild(activity.node);

            activityInvite = new Activity_Invite();
            this.addChild(activityInvite);
            activityLayer = this;
        }
    });
})();
