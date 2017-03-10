/**
 * Created by sk on 2016/12/3 0009.
 */


// 特效管理器
var EffectManager =
{
    create: function ()
    {
        var object = {};

        // ======================pravite=========================//
        // 特效列表
        var m_effectList = {};
        // 特效句柄
        var m_effectHandle = -1;

        // 分配特效句柄
        var allotEffectHandle = function()
        {
            m_effectHandle = m_effectHandle + 1;
            return m_effectHandle;
        }


        // ======================public==========================//
        // 创建特效
        // @param playNode 特效要播放到的节点
        // @param jsonName 特效json的名字
        // @param aniName 特效动作的名字
        // @return 返回该特效的唯一标识句柄
        object.createEffect = function(playNode, jsonName, aniName)
        {
            if(playNode == null)
            {
                return -1;
            }

            var effetctHandleID = allotEffectHandle();
            var effectTarget = ArmatureEffect.create(effetctHandleID, playNode, jsonName, aniName);
            if(effectTarget)
            {
                m_effectList[effetctHandleID] = effectTarget;
                return effetctHandleID;
            }
            
            return -1;
        }


        // 设置特效偏移量，针对父节点(playNode)
        // @param effectHandleID 特效唯一标识
        // @param offX, offY 偏移量
        object.setEffectOffXY = function(effectHandleID, offX, offY)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.setOffXY(offX, offY);
                return true;
            }

            return false;
        }


        // 设置特效缩放
        // @param effectHandleID 特效唯一标识
        // @param scale 缩放值
        object.setEffectScale = function(effectHandleID, scale)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.setScale(scale);
                return true;
            }

            return false;
        }

        
        // 设置特效zorder
        // @param effectHandleID 特效唯一标识
        // @param zorder zorder
        object.setEffectZorder = function(effectHandleID, zorder)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.setZorder(zorder);
                return true;
            }

            return false;
        }


        // 设置特效tag
        // @param effectHandleID 特效唯一标识
        // @param tag 特效node的标记，非特效对象标识
        object.setEffectTag = function(effectHandleID, tag)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.setTag(tag);
                return true;
            }

            return false;
        }



        //=========================以上set函数请在playEffect之前调用，不然设置无效====================//

        // 播放特效
        // @param effectHandleID 特效唯一标识
        // @param callBack 回调函数，不循环特效播放完会进行执行
        // @return 播放状态, false即为播放失败
        object.playEffect = function(effectHandleID, callBack)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.playEffect(callBack);
                return true;
            }

            return false;
        }


        
        // 停止特效
        // @param effectHandleID 特效唯一标识
        object.stopEffect = function(effectHandleID)
        {
            if( (effectHandleID == null) || (effectHandleID < 0) )
            {
                return false;
            }

            var effectTarget = m_effectList[effectHandleID];
            if(effectTarget)
            {
                effectTarget.stopEffect();
                m_effectList[effectHandleID] = null;// 从列表里删除
                delete m_effectList[effectHandleID];
                return true;
            }

            return false;
        }


        // 从列表中删除
        object.removeEffectFormList = function(effectHandleID)
        {
            if(m_effectList[effectHandleID])
            {
                m_effectList[effectHandleID] = null;
                delete m_effectList[effectHandleID];


                //cc.log("======================m_effectList==============" + JSON.stringify(m_effectList));
            }
        }



        return object;
    }
};
