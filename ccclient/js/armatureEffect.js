/**
 * Created by sk on 2016/12/3 .
 */



// 特效对象，暂无继承，等有了粒子特效，抽象出一个baseEffect
var ArmatureEffect =
{
    create: function (effectHandleID, playNode, jsonName, aniName)
    {
        var object = {};


        // ======================pravite=========================//
        // 要在哪个node上播放
        var m_playNode = playNode;
        // 创建的特效node
        var m_armatureNode = null;
        // 特效句柄
        var m_effectHandle = effectHandleID;
        // 特效的json名字
        var m_jsonName = jsonName;
        // 特效动作名字
        var m_aniName = aniName;
        // 针对父节点的偏移量
        var m_offX = 0;
        var m_offY = 0;
        // 默认缩放
        var m_scale = 1;
        // 在playNode上的zorder
        var m_zorder = 10000;
        // 在playNode上的tag
        var m_tag = 10000;
        // 回调函数
        var m_callBack = null;


        // 释放特效
        var releaseEffect = function()
        {
            if(m_armatureNode)
            {
                m_armatureNode.getAnimation().stop();
                m_armatureNode.removeFromParent(true);
                m_armatureNode.release();
            }

            // 释放贴图
            getArmatureResMgrInst().unLoadArmatureRes(m_jsonName);
            m_armatureNode = null;
            m_effectHandle = 0;
            m_jsonName = "";
            m_aniName = "";
            m_offX = 0;
            m_offY = 0;
            m_scale = 1;
            m_zorder = 10000;
            m_tag = 10000;
            m_callBack = null;
        }



        // 加载特效资源
        var loadEffectRes = function()
        {
            // 加载贴图
            getArmatureResMgrInst().loadArmatureRes(m_jsonName);

            var begin = m_jsonName.lastIndexOf("/");
            var end = m_jsonName.lastIndexOf(".");
            var filterName = m_jsonName.substring(begin + 1, end);

            m_armatureNode = ccs.Armature.create(filterName);

            m_armatureNode.setPosition(m_offX, m_offY);
            m_armatureNode.setScale(m_scale);
            m_armatureNode.retain();

            m_playNode.addChild(m_armatureNode, m_zorder, m_tag);
        }



        // 特效播放结束
        var endEffect = function()
        {
            if(m_callBack)
            {
                m_callBack();
            }

            var effectHandleID = m_effectHandle;
            releaseEffect();
            getEffectMgrInst().removeEffectFormList(effectHandleID);
        }


        // 设置播放的偏移量
        // @param offX, offY x的偏移量，y的偏移量
        object.setOffXY = function(offX, offY)
        {
            m_offX = offX;
            m_offY = offY;
        }


        // 设置缩放值
        // @param scale 缩放值
        object.setScale = function(scale)
        {
            m_scale = scale;
        }


        // 设置渲染层级
        // @param zorder 层级
        object.setZorder = function(zorder)
        {
            m_zorder = zorder;
        }


        // 设置node标记
        // @param tag 标记ID
        object.setTag = function(tag)
        {
            m_tag = tag;
        }



        //======================public==========================//
        // 播放特效
        // @param callback 回调函数
        object.playEffect = function(callBack)
        {
            loadEffectRes();
            m_callBack = callBack;
            if(m_armatureNode && m_armatureNode.getAnimation())
            {
                m_armatureNode.getAnimation().play(m_aniName);

                function endCallback(armature, movementType, aniName)
                {
                    // 只有不循环的，才帮忙处理
                    if(movementType == ccs.MovementEventType.complete)
                    {
                        endEffect();
                    }
                }

                m_armatureNode.getAnimation().setMovementEventCallFunc(endCallback);
            }
        }

        
    
        return object;
    }
}
