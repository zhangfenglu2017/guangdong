/**
 * Created by sk on 2016/10/9 0009.
 */


var ArmatureResManager =
{
    create: function ()
    {
        var object = {};

        // 当前加载的资源列表
        var m_loadResList = {};
        // 当前不使用的资源列表
        var m_garbageResList = {};


        object.onFrameMove = function(time)
        {
            cc.log("======================m_loadResList==============" + JSON.stringify(m_loadResList));
            cc.log("======================m_garbageResList==============" + JSON.stringify(m_garbageResList));
            for(var key in m_garbageResList)
            {
                var totalTime = m_garbageResList[key];
                totalTime = totalTime + time;
                if (totalTime > 5)
                {
                    ccs.ArmatureDataManager.getInstance().removeArmatureFileInfo(key);
                    cc.Director.getInstance().getTextureCache().removeUnusedTextures();
                    //cc.Director.getInstance().getTextureCache().getCachedTextureInfo();
                    m_garbageResList[key] = null;
                    delete m_garbageResList[key];
                }
                else
                {
                    m_garbageResList[key] = totalTime;
                }

            }
        }


        // 加载贴图资源
        object.loadArmatureRes = function(jsonName)
        {
            if(m_loadResList[jsonName])
            {
                m_loadResList[jsonName] = m_loadResList[jsonName] + 1;
                return;
            }

            if(m_garbageResList[jsonName])
            {
                m_loadResList[jsonName] = 1;
                m_garbageResList[jsonName] = null;
                delete m_garbageResList[jsonName];
                return;
            }

            ccs.ArmatureDataManager.getInstance().addArmatureFileInfo(jsonName);
            m_loadResList[jsonName] = 1;
        }



        // 卸载贴图资源
        object.unLoadArmatureRes = function(jsonName)
        {
            if(m_loadResList[jsonName] == null)
            {
                return;
            }

            m_loadResList[jsonName] = m_loadResList[jsonName] - 1;
            if(m_loadResList[jsonName] <= 0)
            {
                m_garbageResList[jsonName] = 0;
                m_loadResList[jsonName] = null;
                delete m_loadResList[jsonName];
            }
        }


        
        // 清理所有贴图
        object.clearArmatureRes = function()
        {
            for(var key in m_garbageResList)
            {
                ccs.ArmatureDataManager.getInstance().removeArmatureFileInfo(key);
            }

            m_garbageResList = {};

            for(var keyEx in m_loadResList)
            {
                ccs.ArmatureDataManager.getInstance().removeArmatureFileInfo(keyEx);
            }

            m_loadResList = {};
            cc.Director.getInstance().getTextureCache().removeUnusedTextures();
        }

        return object;
    }
}
