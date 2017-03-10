/**
 * Created by sk on 2016/10/9 0009.
 */


// 帧循环管理器
var FrameMoveLayer = cc.Layer.extend(
{
    // 构造
    ctor: function()
    {
        this._super();
        this.scheduleUpdate(); //开启每帧调用，对应update
        return true;
    },

    // update
    update: function(time)
    {
        getArmatureResMgrInst().onFrameMove(time);
    },
}

);

