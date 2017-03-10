/**
 * Created by sk on 2016/10/9 0009.
 */

//============单例对象=============//


    
var getArmatureResMgrInst = (function()
{
    var inst = null;
    //var testValue = 1;
    function getInstance()
    {
        if(inst == null)
        {
            inst = ArmatureResManager.create();
            //testValue = testValue + 1;
        }

        return inst;
    }

    return getInstance;
})();



var getEffectMgrInst = (function()
{
    var inst = null;
    function getInstance()
    {
        if(inst == null)
        {
            inst = EffectManager.create();
        }

        return inst;
    }

    return getInstance;
})();




var getFrameMoveMgrInst = (function()
{
    var inst = null;
    function getInstance()
    {
        if(inst == null)
        {
            inst = new FrameMoveLayer();
        }

        return inst;
    }

    return getInstance;
})();