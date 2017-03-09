


(function () {
    var mjcards = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,

        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,

        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,

        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91

    ]

    var mjGuicards = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,

        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,

        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
    ]

    //惠州麻将
    var huizhoumjcards = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,

        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        11, 12, 13, 14, 15, 16, 17, 18, 19,

        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,


        // 花8个春夏秋冬、梅兰菊竹
        111, 121, 131, 141, 151, 161, 171, 181,

        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91

    ]

    //100涨麻将
    var yibaizhangcards = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,

        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,

        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91,
        31, 41, 51, 61, 81, 91
    ]

    var s13 = [1, 9, 11, 19, 21, 29, 31, 41, 51, 61, 71, 81, 91];

    function canLink(a, b) {
        return (a + 1 == b || a == b);
    }

    var majiang = {};
    var myObject;
    majiang.init = function (object)
    {
        myObject = object;
    }

    //惠州牌型枚举
    majiang.HUI_ZHOU_HTYPE = {
        ERROR: -1,//错误类型
        JIHU: 0,//鸡胡
        QINGYISE: 1,//清一色
        ZASE: 2,//杂色
        DAGE: 3,//大哥
        ZAPENG: 4,//杂碰
        SHISANYAO: 5,//十三幺
        PENGPENGHU: 6,//碰碰胡
        ZAYAOJIU: 7,//杂幺九
        QINGYAOJIU: 8,//清幺九
        ZIYISE: 9,//字一色
        QUANYAOJIU: 10//全幺九
    }

    //深圳牌型枚举
    majiang.SHEN_ZHEN_HUTYPE = {
        PINGHU: 0,//平胡
        HUNYISE: 1,//混一色
        DUIDUIHU: 2,//对对胡
        QIXIAODUI: 3,//七小对
        QINGYISE: 4,//清一色
        HAOHUAQIXIAODUI: 5,//豪华七小对
        FENGYISE: 6,//风一色
        SHISANYAO: 7,//十三幺
        DASANYUAN: 8,//大三元
        XIAOSANYUAN: 9,//小三元
        DASIXI: 10,//大四喜
        XIAOSIXI: 11,//小四喜
        HUNYISE_DUIDUIHU: 12,//混一色 对对胡
        HUNYISE_QIXIAODUI: 13,//混一色 七小对
        HUNYISE_HAOHUAQIXIAODUI: 14,//混一色 豪华七小对
        DAGE: 15,//大哥
        QINGYISE_QIXIAODUI: 16,//清一色 七小对
        QINGYISE_HAOHUAQIXIAODUI: 17,//清一色 豪华七小对
    }

    //鸡平胡牌型枚举
    majiang.JI_PING_HU_HUTYPE = {
        JIHU: 0,//鸡胡
        PINGHU: 1,//平胡
        PENGPENGHU: 2,//碰碰胡
        HUNYISE: 3,//混一色
        QINGYISE: 4,//清一色
        HUNPENG: 5,//混碰
        QINGPENG: 6,//清碰
        HUNYAOJIU: 7,//混幺九
        QINGYAOJIU: 8,//清幺九
        DASANYUAN: 9,//大三元
        XIAOSANYUAN: 10,//小三元
        DASIXI: 11,//大四喜
        XIAOSIXI: 12,//小四喜
        SHISANYAO: 13,//十三幺
        ZIYISE: 14,//字一色
        JIUBAOLILANDENG: 15,//九莲宝灯
    }

    //东莞胡牌型枚举
    majiang.DONG_GUAN_HUTYPE = {
        PINGHU: 0,//平胡
        HUNYISE: 1,//混一色
        DADUIHU: 2,//大对胡
        QINGYISE: 3,//清一色
        QIDUI: 4,//七对
        LONG_QIDUI: 5,//龙七对
        HUN_QIDUI: 6,//混七对
        HUN_LONG_QIDUI: 7,//混龙七对
        QING_QI_DUI: 8,//清七对
        QING_LONG_QIDUI:9,//清龙七对
        HUN_DADUI: 10,//混大对
        QING_DADUI: 11,//清大对
    }

    //100张胡牌类型枚举
    majiang.YI_BAI_ZHANG = {
        PINGHU: 0,//平胡
        PENGPENGHU: 1,//碰碰胡
        QIDUI: 2,//七对
        LONG_QIDUI: 3,//龙七对
        HUNYISE: 4,//混一色
        QINGYISE: 5,//清一色
        HUNPENG: 6,//混碰
        QINGPENG: 7,//清碰
        YAOJIU: 8,//幺九（混幺九）
        ZIYISE: 9,//字一色
        SHISANYAO: 10,//十三幺
    }

    var searchMa = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        11, 12, 13, 14, 15, 16, 17, 18, 19,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        31, 41, 51, 61, 71, 81, 91,
        111, 121, 131, 141, 151, 161, 171, 181
    ];

    majiang.initMa = function (off) {
        var rtn = [];
        for (var q = 0; q < searchMa.length; q++) {
            switch (off) {
                case 0://1 5 9东 中 春 梅
                    if ((searchMa[q] % 10 == 1 || searchMa[q] % 10 == 5 || searchMa[q] % 10 == 9) && searchMa[q] < 30 || searchMa[q] == 31 || searchMa[q] == 71 || searchMa[q] == 111 || searchMa[q] == 151)
                        rtn.push(searchMa[q]);
                    break;
                case 1://26发南 夏兰
                    if ((searchMa[q] % 10 == 2 || searchMa[q] % 10 == 6 ) && searchMa[q] < 30 || searchMa[q] == 41 || searchMa[q] == 81 || searchMa[q] == 121 || searchMa[q] == 161)
                        rtn.push(searchMa[q]);
                    break;
                case 2://37西白秋竹
                    if ((searchMa[q] % 10 == 3 || searchMa[q] % 10 == 7 ) && searchMa[q] < 30 || searchMa[q] == 51 || searchMa[q] == 91 || searchMa[q] == 131 || searchMa[q] == 181)
                        rtn.push(searchMa[q]);
                    break;
                case 3://48北冬菊
                    if ((searchMa[q] % 10 == 4 || searchMa[q] % 10 == 8 ) && searchMa[q] < 30 || searchMa[q] == 61 || searchMa[q] == 141 || searchMa[q] == 171)
                        rtn.push(searchMa[q]);
                    break;
            }
        }
        return rtn;
    }

    majiang.initMaForShenZhen = function (off) {
        var rtn = [];
        for (var q = 0; q < searchMa.length; q++) {
            switch (off) {
                case 0://1 5 9
                    if ((searchMa[q] % 10 == 1 || searchMa[q] % 10 == 5 || searchMa[q] % 10 == 9) && searchMa[q] < 30)
                        rtn.push(searchMa[q]);
                    break;
                case 1://26
                    if ((searchMa[q] % 10 == 2 || searchMa[q] % 10 == 6 ) && searchMa[q] < 30)
                        rtn.push(searchMa[q]);
                    break;
                case 2://37
                    if ((searchMa[q] % 10 == 3 || searchMa[q] % 10 == 7 ) && searchMa[q] < 30)
                        rtn.push(searchMa[q]);
                    break;
                case 3://48
                    if ((searchMa[q] % 10 == 4 || searchMa[q] % 10 == 8 ) && searchMa[q] < 30)
                        rtn.push(searchMa[q]);
                    break;
            }
        }
        return rtn;
    }
    majiang.isHuWithHongZhong = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var noHongCount = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(71) == -1) {
                noHongCount++;
            }
        }
        if (noHongCount >= test.length) {
            // console.log("不含红中");
            return false;
        } else return true;
    }

    majiang.isHuWithFanGui = function (pl, gui) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var noGuiCount = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(gui) == -1) {
                noGuiCount++;
            }
        }
        if (noGuiCount >= test.length) {
            // console.log("不含红中");
            return false;
        } else return true;
    }

    //惠州全幺九 不含风 全部由1和9组成的碰碰胡，并且必须有1和9
    //1 9 1 19 1 29  11 9 11 19 11 29 21 9 21 19 21 29
    majiang.quanYaoJiu = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCards = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 31, 41, 51, 61, 71, 81, 91];
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            for (var j = 0; j < errorCards.length; j++) {
                if (cds.indexOf(errorCards[j]) != -1) return false;
            }
        }
        return true;
    }

    majiang.getHuTypeNew = function (pi)
    {
        var judge = majiang.HUI_ZHOU_HTYPE.JIHU;
        var num3 = majiang.All3New(pi);
        var sameColor = majiang.SameColorNew(pi);
        var zaSe = majiang.zaSe(pi);
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingYaoJiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSeNew(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        var quanYaoJiu = majiang.quanYaoJiu(pi);
        console.log("quanYaoJiu ==== " + quanYaoJiu);
        if (shiSanYao) judge = majiang.HUI_ZHOU_HTYPE.SHISANYAO;
        if (sameColor) judge = majiang.HUI_ZHOU_HTYPE.QINGYISE;
        if (zaSe) judge = majiang.HUI_ZHOU_HTYPE.ZASE;
        console.log("num3的值：" + num3);
        if (num3 == 1 || num3 == 2) {
            judge = majiang.HUI_ZHOU_HTYPE.PENGPENGHU;
            if (quanYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.QUANYAOJIU;
            if (sameColor) judge = majiang.HUI_ZHOU_HTYPE.DAGE;
            if (zaSe) judge = majiang.HUI_ZHOU_HTYPE.ZAPENG;
            if (zaYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.ZAYAOJIU;
            if (ziYiSe) judge = majiang.HUI_ZHOU_HTYPE.ZIYISE;
            if (qingYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.QINGYAOJIU;
        }
        return judge;
    }
    //惠州 0 鸡胡 1清一色 2杂色 3大哥  4杂碰 5十三幺 6碰碰胡 7杂幺九 8清幺九 9字一色 (不含杠上花和抢杠胡)
    majiang.getHuType = function (pi) {
        var judge = majiang.HUI_ZHOU_HTYPE.JIHU;
        var num3 = majiang.All3(pi);
        var sameColor = majiang.SameColor(pi);
        var zaSe = majiang.zaSe(pi);
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingYaoJiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSe(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        var quanYaoJiu = majiang.quanYaoJiu(pi);
        console.log("quanYaoJiu ==== " + quanYaoJiu);
        if (shiSanYao) judge = majiang.HUI_ZHOU_HTYPE.SHISANYAO;
        if (sameColor) judge = majiang.HUI_ZHOU_HTYPE.QINGYISE;
        if (zaSe) judge = majiang.HUI_ZHOU_HTYPE.ZASE;
        console.log("num3的值：" + num3);
        if (num3 == 1 || num3 == 2) {
            judge = majiang.HUI_ZHOU_HTYPE.PENGPENGHU;
            if (quanYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.QUANYAOJIU;
            if (sameColor) judge = majiang.HUI_ZHOU_HTYPE.DAGE;
            if (zaSe) judge = majiang.HUI_ZHOU_HTYPE.ZAPENG;
            if (zaYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.ZAYAOJIU;
            if (ziYiSe) judge = majiang.HUI_ZHOU_HTYPE.ZIYISE;
            if (qingYaoJiu) judge = majiang.HUI_ZHOU_HTYPE.QINGYAOJIU;
        }

        //var handDes = "";
        //for(var i=0;i<pi.mjhand.length;i++)
        //{
        //    handDes = handDes + pi.mjhand[i] + ",";
        //}
        //
        //console.log("查看手牌：" + handDes);
        //console.log("胡的类型："+judge);
        return judge;

    }

    //100张 0平胡 1碰碰胡 2七对 3龙七对 4混一色 5清一色 6混碰 7清碰 8幺九(混幺九) 9字一色 10十三幺
    //二期需求 去掉了 混一色 混碰 和7对胡法 （注：清碰胡法改成清一色胡法)
    majiang.getHuTypeForYiBaiZhang = function(pi){
        var judge = majiang.YI_BAI_ZHANG.PINGHU;
        var num3 = majiang.All3(pi);
        //var hunyise = majiang.HunYiSe(pi);
        //if (hunyise) judge = majiang.YI_BAI_ZHANG.HUNYISE;
        var sameColor = majiang.SameColor(pi);
        if (sameColor) judge = majiang.YI_BAI_ZHANG.QINGYISE;
        var ziYiSe = majiang.ziYiSe(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        if (shiSanYao) judge = majiang.YI_BAI_ZHANG.SHISANYAO;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var quanyaojiu = majiang.quanYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        //if(yaojiu) judge = majiang.YI_BAI_ZHANG.YAOJIU;
        if (num3 == 1 || num3 == 2) {
            judge = majiang.YI_BAI_ZHANG.PENGPENGHU;
            //if (hunyise) judge = majiang.YI_BAI_ZHANG.HUNPENG;
            if (sameColor) judge = majiang.YI_BAI_ZHANG.QINGYISE;
            if (ziYiSe) judge = majiang.YI_BAI_ZHANG.ZIYISE;
            if(zaYaoJiu || quanyaojiu || qingyaojiu) judge = majiang.YI_BAI_ZHANG.YAOJIU;
        }
        return judge;
    }

    majiang.getHuTypeForYiBaiZhangNew = function(pi){
        var judge = majiang.YI_BAI_ZHANG.PINGHU;
        var num3 = majiang.All3New(pi);
        //var hunyise = majiang.HunYiSe(pi);
        //if (hunyise) judge = majiang.YI_BAI_ZHANG.HUNYISE;
        var sameColor = majiang.SameColorNew(pi);
        if (sameColor) judge = majiang.YI_BAI_ZHANG.QINGYISE;
        var ziYiSe = majiang.ziYiSeNew(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        if (shiSanYao) judge = majiang.YI_BAI_ZHANG.SHISANYAO;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var quanyaojiu = majiang.quanYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        //if(yaojiu) judge = majiang.YI_BAI_ZHANG.YAOJIU;
        if (num3 == 1 || num3 == 2) {
            judge = majiang.YI_BAI_ZHANG.PENGPENGHU;
            //if (hunyise) judge = majiang.YI_BAI_ZHANG.HUNPENG;
            if (sameColor) judge = majiang.YI_BAI_ZHANG.QINGYISE;
            if (ziYiSe) judge = majiang.YI_BAI_ZHANG.ZIYISE;
            if(zaYaoJiu || quanyaojiu || qingyaojiu) judge = majiang.YI_BAI_ZHANG.YAOJIU;
        }
        return judge;
    }

    //东莞 0平胡 1混一色 2大对胡 3清一色 4七对 5龙七对 6混七对 7混龙七对 8清七对 9清龙七对 10混大对 11清大对
    majiang.getHuTypeForDongGuanNew = function(pi){
        var judge = majiang.DONG_GUAN_HUTYPE.PINGHU;
        var num3 = majiang.All3New(pi);
        var hunyise = majiang.HunYiSeNew(pi);
        if (hunyise) judge = majiang.DONG_GUAN_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColorNew(pi);
        if (sameColor) judge = majiang.DONG_GUAN_HUTYPE.QINGYISE;
        if (num3 == 1 || num3 == 2) {
            judge = majiang.DONG_GUAN_HUTYPE.DADUIHU;
            if (hunyise) judge = majiang.DONG_GUAN_HUTYPE.HUN_DADUI;
            if(sameColor) judge = majiang.DONG_GUAN_HUTYPE.QING_DADUI;
        }
        return judge;
    }

    //东莞 0平胡 1混一色 2大对胡 3清一色 4七对 5龙七对 6混七对 7混龙七对 8清七对 9清龙七对 10混大对 11清大对
    majiang.getHuTypeForDongGuan = function(pi){
        var judge = majiang.DONG_GUAN_HUTYPE.PINGHU;
        var num3 = majiang.All3(pi);
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.DONG_GUAN_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColor(pi);
        if (sameColor) judge = majiang.DONG_GUAN_HUTYPE.QINGYISE;
        if (num3 == 1 || num3 == 2) {
            judge = majiang.DONG_GUAN_HUTYPE.DADUIHU;
            if(sameColor) judge = majiang.DONG_GUAN_HUTYPE.QING_DADUI;
            if (hunyise) judge = majiang.DONG_GUAN_HUTYPE.HUN_DADUI;
        }
        return judge;
    }

    //深圳大三元 有中、发、白三组刻子 71 81 91
    majiang.daSanYuan = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];

        var errorCount = 0;
        var hongzhongCounts = 0;
        var faCounts = 0;
        var baiCounts = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) return false;

        if (pi.mjpeng.indexOf(71) != -1) hongzhongCounts = 3;
        if (pi.mjpeng.indexOf(81) != -1) faCounts = 3;
        if (pi.mjpeng.indexOf(91) != -1) baiCounts = 3;
        if (pi.mjgang0.indexOf(71) != -1 || pi.mjgang1.indexOf(71) != -1) hongzhongCounts = 4;
        if (pi.mjgang0.indexOf(81) != -1 || pi.mjgang1.indexOf(81) != -1) faCounts = 4;
        if (pi.mjgang0.indexOf(91) != -1 || pi.mjgang1.indexOf(91) != -1) baiCounts = 4;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(71) != -1) {
                //console.log(cds.length);
                for (var q = 0; q < cds.length; q++) {
                    if (cds[q] == 71) hongzhongCounts++;
                }
            }
            if (cds.indexOf(81) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 81) faCounts++;
                }
            }
            if (cds.indexOf(91) != -1) {
                for (var k = 0; k < cds.length; k++) {
                    if (cds[k] == 91) baiCounts++;
                }
            }
        }
        // console.log("红中："+hongzhongCounts + "发："+faCounts + "白板："+baiCounts);
        if (hongzhongCounts >= 3 && faCounts >= 3 && baiCounts >= 3) return true;
        return false;
    }

    //深圳小三元，拿齐中、发、白三种三元牌，但其中一种是将
    majiang.xiaoSanYuan = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCount = 0;
        var hongzhongCounts = 0;
        var faCounts = 0;
        var baiCounts = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) return false;

        if (pi.mjpeng.indexOf(71) != -1) hongzhongCounts = 3;
        if (pi.mjpeng.indexOf(81) != -1) faCounts = 3;
        if (pi.mjpeng.indexOf(91) != -1) baiCounts = 3;
        if (pi.mjgang0.indexOf(71) != -1 || pi.mjgang1.indexOf(71) != -1) hongzhongCounts = 4;
        if (pi.mjgang0.indexOf(81) != -1 || pi.mjgang1.indexOf(81) != -1) faCounts = 4;
        if (pi.mjgang0.indexOf(91) != -1 || pi.mjgang1.indexOf(91) != -1) baiCounts = 4;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];

            if (cds.indexOf(71) != -1) {
                console.log(cds.length);
                for (var q = 0; q < cds.length; q++) {
                    if (cds[q] == 71) hongzhongCounts++;
                }
            }
            if (cds.indexOf(81) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 81) faCounts++;
                }
            }
            if (cds.indexOf(91) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 91) baiCounts++;
                }
            }
        }


        // console.log("红中："+hongzhongCounts + "发："+faCounts + "白板："+baiCounts);
        if (hongzhongCounts >= 3 && faCounts >= 3 && baiCounts == 2) return true;
        if (hongzhongCounts >= 3 && baiCounts >= 3 && faCounts == 2) return true;
        if (faCounts >= 3 && baiCounts >= 3 && hongzhongCounts == 2) return true;
        return false;
    }

    //深圳 大四喜 胡牌者完成东、南、西、北四组刻子
    majiang.daSiXi = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCount = 0;
        var dongCounts = 0;
        var nanCounts = 0;
        var xiCounts = 0;
        var beiCounts = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) return false;

        if (pi.mjpeng.indexOf(31) != -1) dongCounts = 3;
        if (pi.mjpeng.indexOf(41) != -1) nanCounts = 3;
        if (pi.mjpeng.indexOf(51) != -1) xiCounts = 3;
        if (pi.mjpeng.indexOf(61) != -1) beiCounts = 3;

        if (pi.mjgang0.indexOf(31) != -1 || pi.mjgang1.indexOf(31) != -1) dongCounts = 4;
        if (pi.mjgang0.indexOf(41) != -1 || pi.mjgang1.indexOf(41) != -1) nanCounts = 4;
        if (pi.mjgang0.indexOf(51) != -1 || pi.mjgang1.indexOf(51) != -1) xiCounts = 4;
        if (pi.mjgang0.indexOf(61) != -1 || pi.mjgang1.indexOf(61) != -1) beiCounts = 4;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];

            if (cds.indexOf(31) != -1) {
                //console.log(cds.length);
                for (var q = 0; q < cds.length; q++) {
                    if (cds[q] == 31) dongCounts++;
                }
            }
            if (cds.indexOf(41) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 41) nanCounts++;
                }
            }
            if (cds.indexOf(51) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 51) xiCounts++;
                }
            }
            if (cds.indexOf(61) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 61) beiCounts++;
                }
            }
        }


        if (dongCounts >= 3 && nanCounts >= 3 && xiCounts >= 3 && beiCounts >= 3) return true;

        return false;
    }

    //深圳 小四喜 胡牌者完成东、南、西、北其中三组刻子，外加一组对子
    majiang.xiaoSiXi = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCount = 0;
        var dongCounts = 0;
        var nanCounts = 0;
        var xiCounts = 0;
        var beiCounts = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) return false;

        if (pi.mjpeng.indexOf(31) != -1) dongCounts = 3;
        if (pi.mjpeng.indexOf(41) != -1) nanCounts = 3;
        if (pi.mjpeng.indexOf(51) != -1) xiCounts = 3;
        if (pi.mjpeng.indexOf(61) != -1) beiCounts = 3;

        if (pi.mjgang0.indexOf(31) != -1 || pi.mjgang1.indexOf(31) != -1) dongCounts = 4;
        if (pi.mjgang0.indexOf(41) != -1 || pi.mjgang1.indexOf(41) != -1) nanCounts = 4;
        if (pi.mjgang0.indexOf(51) != -1 || pi.mjgang1.indexOf(51) != -1) xiCounts = 4;
        if (pi.mjgang0.indexOf(61) != -1 || pi.mjgang1.indexOf(61) != -1) beiCounts = 4;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];

            if (cds.indexOf(31) != -1) {
                console.log(cds.length);
                for (var q = 0; q < cds.length; q++) {
                    if (cds[q] == 31) dongCounts++;
                }
            }
            if (cds.indexOf(41) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 41) nanCounts++;
                }
            }
            if (cds.indexOf(51) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 51) xiCounts++;
                }
            }
            if (cds.indexOf(61) != -1) {
                for (var j = 0; j < cds.length; j++) {
                    if (cds[j] == 61) beiCounts++;
                }
            }
        }


        if (dongCounts >= 3 && nanCounts >= 3 && xiCounts >= 3 && beiCounts == 2) return true;
        if (dongCounts >= 3 && nanCounts >= 3 && beiCounts >= 3 && xiCounts == 2) return true;
        if (dongCounts >= 3 && beiCounts >= 3 && xiCounts >= 3 && nanCounts == 2) return true;
        if (nanCounts >= 3 && beiCounts >= 3 && xiCounts >= 3 && dongCounts == 2) return true;
        return false;
    }

    //深圳
    majiang.getHuTypeForShenZhenNew = function (pi) {
        var judge = majiang.SHEN_ZHEN_HUTYPE.PINGHU;
        var hunyise = majiang.HunYiSeNew(pi);
        if (hunyise) judge = majiang.SHEN_ZHEN_HUTYPE.HUNYISE;
        var qingyise = majiang.SameColorNew(pi);
        if (qingyise) judge = majiang.SHEN_ZHEN_HUTYPE.QINGYISE;
        var fengyise = majiang.ziYiSeNew(pi);
        var shisanyao = majiang.shiSanYao(pi);
        if (shisanyao) judge = majiang.SHEN_ZHEN_HUTYPE.SHISANYAO;


        var num3 = majiang.All3New(pi);
        if (num3 == 1 || num3 == 2) {
            judge = majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU;
            if (hunyise) judge = majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU;
            if (fengyise) judge = majiang.SHEN_ZHEN_HUTYPE.FENGYISE;
            if (qingyise) judge = majiang.SHEN_ZHEN_HUTYPE.DAGE;
        }
        var dasanyuan = majiang.daSanYuan(pi);
        if (dasanyuan) judge = majiang.SHEN_ZHEN_HUTYPE.DASANYUAN;
        var xiaosanyuan = majiang.xiaoSanYuan(pi);
        if (xiaosanyuan) judge = majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN;
        var dasixi = majiang.daSiXi(pi);
        if (dasixi) judge = majiang.SHEN_ZHEN_HUTYPE.DASIXI;
        var xiaosixi = majiang.xiaoSiXi(pi);
        if (xiaosixi) judge = majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI;
        return judge;
    }

    //深圳
    majiang.getHuTypeForShenZhen = function (pi) {
        var judge = majiang.SHEN_ZHEN_HUTYPE.PINGHU;
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.SHEN_ZHEN_HUTYPE.HUNYISE;
        var qingyise = majiang.SameColor(pi);
        if (qingyise) judge = majiang.SHEN_ZHEN_HUTYPE.QINGYISE;
        var fengyise = majiang.ziYiSe(pi);
        var shisanyao = majiang.shiSanYao(pi);
        if (shisanyao) judge = majiang.SHEN_ZHEN_HUTYPE.SHISANYAO;


        var num3 = majiang.All3(pi);
        if (num3 == 1 || num3 == 2) {
            judge = majiang.SHEN_ZHEN_HUTYPE.DUIDUIHU;
            if (hunyise) judge = majiang.SHEN_ZHEN_HUTYPE.HUNYISE_DUIDUIHU;
            if (qingyise) judge = majiang.SHEN_ZHEN_HUTYPE.DAGE;
            if (fengyise) judge = majiang.SHEN_ZHEN_HUTYPE.FENGYISE;
        }
        var dasanyuan = majiang.daSanYuan(pi);
        if (dasanyuan) judge = majiang.SHEN_ZHEN_HUTYPE.DASANYUAN;
        var xiaosanyuan = majiang.xiaoSanYuan(pi);
        if (xiaosanyuan) judge = majiang.SHEN_ZHEN_HUTYPE.XIAOSANYUAN;
        var dasixi = majiang.daSiXi(pi);
        if (dasixi) judge = majiang.SHEN_ZHEN_HUTYPE.DASIXI;
        var xiaosixi = majiang.xiaoSiXi(pi);
        if (xiaosixi) judge = majiang.SHEN_ZHEN_HUTYPE.XIAOSIXI;
        return judge;
    }

    //惠州13幺
    majiang.shiSanYao = function (pi) {
        if (pi.mjhand.length != 14) return false;
        for (var i = 0; i < s13.length; i++) {
            if (pi.mjhand.indexOf(s13[i]) == -1) return false;
        }
        return true;
    }

    //惠州预先判断胡的类型 不影响手牌
    majiang.prejudgeHuType = function (pi, cd) {
        if (pi.mjhand.length == 14) return majiang.HUI_ZHOU_HTYPE.ERROR;
        //var huType = canHuNoZhong(false,pi.mjhand,cd,false);
        //if(huType == 13) return majiang.HUI_ZHOU_HTYPE.SHISANYAO; //先判断13幺  暂时没有7对 有的话也要这样判断
        if(cd != 0) pi.mjhand.push(cd);//不是13幺的情况  假设先push进 打出的那张牌
        var huType = majiang.getHuType(pi);
        if(cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);
        return huType;
    }

    //深圳 预测 胡类型
    majiang.prejudgeHuTypeForShenZhen = function (pi, cd) {
        if (pi.mjhand.length == 14) return majiang.HUI_ZHOU_HTYPE.ERROR;
        var huType1 = canHuNoZhong(false, pi.mjhand, cd, false);
        var qixiaodui = false;
        var haohuaqixiaodui = false;
        if (huType1 == 7) {
            qixiaodui = true;
            pi.mjhand.push(cd);
            var haohua7dui = majiang.canGang1([], pi.mjhand, []);
            pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);
            if (haohua7dui.length > 0) {
                //return majiang.SHEN_ZHEN_HUTYPE.HAOHUAQIXIAODUI;
                haohuaqixiaodui = true;
            }
            // return majiang.SHEN_ZHEN_HUTYPE.QIXIAODUI;
        }
        if(cd != 0) pi.mjhand.push(cd);// 假设先push进 打出的那张牌
        var huType = majiang.getHuTypeForShenZhen(pi);
        if(cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);

        if (haohuaqixiaodui && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) return majiang.SHEN_ZHEN_HUTYPE.HUNYISE_HAOHUAQIXIAODUI;
        if (haohuaqixiaodui && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) return majiang.SHEN_ZHEN_HUTYPE.QINGYISE_HAOHUAQIXIAODUI;
        if (qixiaodui && huType == majiang.SHEN_ZHEN_HUTYPE.QINGYISE) return majiang.SHEN_ZHEN_HUTYPE.QINGYISE_QIXIAODUI;
        if (qixiaodui && huType == majiang.SHEN_ZHEN_HUTYPE.HUNYISE) return majiang.SHEN_ZHEN_HUTYPE.HUNYISE_QIXIAODUI;
        if (haohuaqixiaodui) return majiang.SHEN_ZHEN_HUTYPE.HAOHUAQIXIAODUI;
        if (qixiaodui) return majiang.SHEN_ZHEN_HUTYPE.QIXIAODUI;
        return huType;
    }

    //鸡平胡 九宝莲灯
    majiang.jiuBaoLianDeng = function (pi) {
        var qingyise = majiang.SameColor(pi);
        if (!qingyise) return false;
        if (pi.mjhand.length != 14) return false;
        var test1 = [1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 9, 9];
        var test2 = [11, 11, 11, 12, 13, 14, 15, 16, 17, 18, 19, 19, 19];
        var test3 = [21, 21, 21, 22, 23, 24, 25, 26, 27, 28, 29, 29, 29];

        var isOk = false;
        var findNum1_9 = 0;
        var findNum11_19 = 0;
        var findNum21_29 = 0;

        for(var i=0;i<pi.mjhand.length;i++)
        {
            if(pi.mjhand[i] == 1 || pi.mjhand[i] == 9) findNum1_9++;
            if(pi.mjhand[i] == 11 || pi.mjhand[i] == 19) findNum11_19++;
            if(pi.mjhand[i] == 21 || pi.mjhand[i] == 29) findNum21_29++;
        }

        for (var i = 0; i < test1.length; i++) {
            if (pi.mjhand.indexOf(test1[i]) != -1 && pi.mjhand[13] < 10) isOk = true;
        }

        for (var i = 0; i < test2.length; i++) {
            if (pi.mjhand.indexOf(test2[i]) != -1 && pi.mjhand[13] < 20 && pi.mjhand[13] > 10) isOk = true;
        }

        for (var i = 0; i < test3.length; i++) {
            if (pi.mjhand.indexOf(test3[i]) != -1 && pi.mjhand[13] < 30 && pi.mjhand[13] > 20) isOk = true;
        }

        if(findNum11_19 >= 6 && isOk) return true;
        if(findNum1_9 >= 6 && isOk) return true;
        if(findNum21_29 >= 6 && isOk) return true;

        return false;
    }
    //鸡平胡
    majiang.getHuTypeForJiPingHu = function (pi) {
        var judge = majiang.JI_PING_HU_HUTYPE.JIHU;
        var pingHu = majiang.pingHu(pi);
        if (pingHu) judge = majiang.JI_PING_HU_HUTYPE.PINGHU;
        var qingyise = majiang.SameColor(pi);
        if (qingyise) judge = majiang.JI_PING_HU_HUTYPE.QINGYISE;
        var shisanyao = majiang.shiSanYao(pi);
        if (shisanyao) judge = majiang.JI_PING_HU_HUTYPE.SHISANYAO;
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.JI_PING_HU_HUTYPE.HUNYISE;
        var ziYiSe = majiang.ziYiSe(pi);
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingYaoJiu = majiang.qingYaoJiu(pi);

        var num3 = majiang.All3(pi);
        if (num3 == 1 || num3 == 2) {
            judge = majiang.JI_PING_HU_HUTYPE.PENGPENGHU;

            if (ziYiSe) judge = majiang.JI_PING_HU_HUTYPE.ZIYISE;
            if (qingyise) judge = majiang.JI_PING_HU_HUTYPE.QINGPENG;
            if (hunyise) judge = majiang.JI_PING_HU_HUTYPE.HUNPENG;
            if (zaYaoJiu) judge = majiang.JI_PING_HU_HUTYPE.HUNYAOJIU;
            if (qingYaoJiu) judge = majiang.JI_PING_HU_HUTYPE.QINGYAOJIU;

        }

        var dasanyuan = majiang.daSanYuan(pi);
        if (dasanyuan) judge = majiang.JI_PING_HU_HUTYPE.DASANYUAN;
        var xiaosanyuan = majiang.xiaoSanYuan(pi);
        if (xiaosanyuan) judge = majiang.JI_PING_HU_HUTYPE.XIAOSANYUAN;
        var dasixi = majiang.daSiXi(pi);
        if (dasixi) judge = majiang.JI_PING_HU_HUTYPE.DASIXI;
        var xiaosixi = majiang.xiaoSiXi(pi);
        if (xiaosixi) judge = majiang.JI_PING_HU_HUTYPE.XIAOSIXI;
        var jiuBaoLianDeng = majiang.jiuBaoLianDeng(pi);
        if (jiuBaoLianDeng) judge = majiang.JI_PING_HU_HUTYPE.JIUBAOLILANDENG;
        return judge;
    }
    //鸡平胡 预测 胡类型
    majiang.prejudgeHuTypeForJiPingHu = function (pi, cd) {
        if(cd != 0) pi.mjhand.push(cd);// 假设先push进 打出的那张牌
        var huType = majiang.getHuTypeForJiPingHu(pi);
        if(cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);
        return huType;
    }

    //鸡平胡 平胡
    majiang.pingHu = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var cards = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,41,51,61,71,81,91];
        var sameNum = 1;
        for(var i=0;i<pi.mjhand.length-1;i++)
        {
            if(pi.mjhand[i] == pi.mjhand[i+1]) sameNum++;
        }

        console.log("sameNum ==== " + sameNum);
        if (pi.mjpeng.length > 0 || pi.mjgang0 > 0 || pi.mjgang1.length > 0 || sameNum >= 3) return false;
        return true;
    }

    //是否拿到该风圈局的刻子
    majiang.isGetFengQuanKeZi = function(curCircleWind,pl)
    {
        var quanFeng = -1;
        switch (curCircleWind)
        {
            case 0:
                quanFeng = 31;//东风圈
                break;
            case 1:
                quanFeng = 41;//南风圈
                break;
            case 2:
                quanFeng = 51;//西风圈
                break;
            case 3:
                quanFeng = 61;//北风圈
                break;
        }
        if(quanFeng != -1 && pl.mjgang0.indexOf(quanFeng) != -1) return true;
        if(quanFeng != -1 && pl.mjpeng.indexOf(quanFeng) != -1) return true;
        if(quanFeng != -1 && pl.mjgang1.indexOf(quanFeng) != -1) return true;
        var sum1 = 0;
        for(var i=0;i<pl.mjhand.length;i++)
        {
            if(quanFeng != -1 && pl.mjhand[i] == quanFeng) sum1++;
        }
        if(sum1 >= 3) return true;
        return false;
    }

    //是否拿到本盘门风的刻子
    majiang.isGetBenMenMenFengKeZi = function(p)
    {
        var fengWei = -1;
        switch(p.fengWei){
            case 0:
                fengWei = 31;//东
                break;
            case 1:
                fengWei = 41;//南
                break;
            case 2:
                fengWei = 51;//西
                break;
            case 3:
                fengWei = 61;//北
                break;
        }

        if(fengWei != -1 && p.mjgang0.indexOf(fengWei) != -1) return true;
        if(fengWei != -1 && p.mjpeng.indexOf(fengWei) != -1) return true;
        if(fengWei != -1 && p.mjgang1.indexOf(fengWei) != -1) return true;
        var sum = 0;
        for(var i=0;i<p.mjhand.length;i++)
        {
            if(fengWei != -1 && p.mjhand[i] == fengWei) sum++;
        }
        if(sum >= 3) return true;
        return false;
    }

    //三元牌 刻字数(红中、白板、发财，任意一个刻子为1番，两个刻子为2番)
    majiang.getSanYuanPaiKeZiNum = function(pl){
        var nums = 0;
        if (pl.mjpeng.indexOf(71) != -1) nums++;
        if (pl.mjpeng.indexOf(81) != -1) nums++;
        if (pl.mjpeng.indexOf(91) != -1) nums++;
        if (pl.mjgang0.indexOf(71) != -1 || pl.mjgang1.indexOf(71) != -1) nums++;
        if (pl.mjgang0.indexOf(81) != -1 || pl.mjgang1.indexOf(81) != -1) nums++;
        if (pl.mjgang0.indexOf(91) != -1 || pl.mjgang1.indexOf(91) != -1) nums++;

        var zhongNums = 0;
        var baiNums = 0;
        var faNums = 0;
        for(var i=0;i<pl.mjhand.length;i++)
        {
            if(pl.mjhand[i] == 71) zhongNums++;
            if(pl.mjhand[i] == 81) faNums++;
            if(pl.mjhand[i] == 91) baiNums++;
        }

        if(zhongNums >= 3) nums++;
        if(faNums >= 3) nums++;
        if(baiNums >= 3) nums++;

        return nums;
    }

    //惠州清幺九 （ 杂碰 且必须 含1和9 或 11和19 或 21和29）
    //majiang.qingYaoJiu = function (pi) {
    //    var num3 = majiang.All3(pi);
    //    var zaSe = majiang.zaSe(pi);
    //    var judeg = false;
    //    if (num3 == 1 && zaSe) judeg = true;
    //    if (!judeg) return false;
    //    var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
    //    for (var i = 0; i < test.length; i++) {
    //        var cds = test[i];
    //        if (cds.indexOf(1) != -1 && cds.indexOf(9) != -1 || cds.indexOf(11) != -1 && cds.indexOf(19) != -1 && cds.indexOf(21) != -1 && cds.indexOf(29) != -1) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}
    //惠州清幺九  必须 1种颜色 带风牌
    majiang.qingYaoJiu = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCount = 0;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) //test 中不含风
        {
            return false;
        }

        var noFengCds = [];
        for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
        //含风 去掉风
        for (var i = 0; i < noFengCds.length; i++) {
            noFengCds[i] = [];
            for (var k = 0; k < test[i].length; k++) {
                if (test[i][k] < 31) {
                    noFengCds[i].push(test[i][k]);
                }
            }
        }
        //判断 除 1 9 还有无其他杂牌
        var disCard = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28];
        for (var z = 0; z < noFengCds.length; z++) {
            console.log("====="+z);
            var cds = noFengCds[z];
            //后加测试
            for(var q=0;q<cds.length;q++){
                console.log("------"+cds[q]);
            }
            for (var q = 0; q < disCard.length; q++) {
                if (cds.indexOf(disCard[q]) != -1) return false;
            }
        }
        for (var z = 0; z < noFengCds.length; z++) {
            var cds = noFengCds[z];
            if((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
            if((cds.indexOf(11) != -1 || cds.indexOf(19) != -1) && (cds.indexOf(1) != -1 || cds.indexOf(9) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
            if((cds.indexOf(21) != -1 || cds.indexOf(29) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(1) != -1 || cds.indexOf(9) != -1)) return false;
            if ((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
            if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  (cds.indexOf(19) != -1 ||  cds.indexOf(11) != -1) && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
            if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && (cds.indexOf(21) != -1 || cds.indexOf(29)) != -1  ) return true;
        }
        return false;
    }

    //惠州杂幺九 必须 含1和19 1和29 或 11和9 或 11和29 或21和9 或 21和19
    //majiang.zaYaoJiu = function (pi) {
    //    var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
    //    var errorCount = 0;
    //
    //    for (var i = 0; i < test.length; i++) {
    //        var cds = test[i];
    //        if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
    //            errorCount++;
    //        } else {
    //            //console.log("含风");
    //        }
    //    }
    //    if (errorCount >= test.length) //test 中不含风
    //    {
    //        return false;
    //    }
    //
    //    var noFengCds = [];
    //    for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
    //    //含风 去掉风
    //    for (var i = 0; i < noFengCds.length; i++) {
    //        noFengCds[i] = [];
    //        for (var k = 0; k < test[i].length; k++) {
    //            if (test[i][k] < 31) {
    //                noFengCds[i].push(test[i][k]);
    //            }
    //        }
    //    }
    //    //判断 除 1 9 还有无其他杂牌
    //    var disCard = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28];
    //    for (var z = 0; z < noFengCds.length; z++) {
    //        var cds = noFengCds[z];
    //        for (var q = 0; q < disCard.length; q++) {
    //            if (cds.indexOf(disCard[q]) != -1) return false;
    //        }
    //        if (cds.indexOf(1) != -1 && cds.indexOf(19) != -1 || cds.indexOf(1) != -1 && cds.indexOf(29) != -1 || cds.indexOf(11) != -1 && cds.indexOf(9) != -1 || cds.indexOf(11) != -1 && cds.indexOf(29) != -1 || cds.indexOf(21) != -1 && cds.indexOf(9) != -1 || cds.indexOf(21) != -1 && cds.indexOf(19) != -1) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}
    //惠州杂幺九 必须 2种颜色以上 带风牌
    majiang.zaYaoJiu = function (pi) {
        var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
        var errorCount = 0;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        if (errorCount >= test.length) //test 中不含风
        {
            return false;
        }

        var noFengCds = [];
        for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
        //含风 去掉风
        for (var i = 0; i < noFengCds.length; i++) {
            noFengCds[i] = [];
            for (var k = 0; k < test[i].length; k++) {
                if (test[i][k] < 31) {
                    noFengCds[i].push(test[i][k]);
                }
            }
        }
        //判断 除 1 9 还有无其他杂牌
        var disCard = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28];
        for (var z = 0; z < noFengCds.length; z++) {
            var cds = noFengCds[z];
            for (var q = 0; q < disCard.length; q++) {
                if (cds.indexOf(disCard[q]) != -1) return false;
            }
            //if (cds.indexOf(1) != -1 || cds.indexOf(19) != -1 ||  cds.indexOf(29) != -1 ||  cds.indexOf(9) != -1 || cds.indexOf(11) != -1 || cds.indexOf(21) != -1  ) {
            //    return true;
            //}
        }

        for (var z = 0; z < noFengCds.length; z++) {
            var cds = noFengCds[z];
            for (var q = 0; q < disCard.length; q++) {
                if (cds.indexOf(disCard[q]) != -1) return false;
            }
            if (cds.indexOf(1) != -1 || cds.indexOf(19) != -1 ||  cds.indexOf(29) != -1 ||  cds.indexOf(9) != -1 || cds.indexOf(11) != -1 || cds.indexOf(21) != -1  ) {
                return true;
            }
        }
        return false;
    }

    //惠州 字一色 全是由风牌组成的碰碰胡
    majiang.ziYiSe = function (pi) {
        if (majiang.All3(pi) != 2) return false;
        return true;
    }
    majiang.ziYiSeNew = function (pi) {
        if (majiang.All3New(pi) != 2) return false;
        return true;
    }
    //惠州杂色 (清一色和风)
    majiang.zaSe = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var errorCount = 0;
        var color = -1;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            }
        }
        if (errorCount >= test.length)  return false;//test 中不含风

        var noFengCds = [];
        for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
        //含风 去掉风
        for (var i = 0; i < noFengCds.length; i++) {
            noFengCds[i] = [];
            for (var k = 0; k < test[i].length; k++) {
                if (test[i][k] < 31) {
                    noFengCds[i].push(test[i][k]);
                }
            }
        }
        if (noFengCds.length == 0) return false;
        for (var z = 0; z < noFengCds.length; z++) {
            for (var q = 0; q < noFengCds[z].length; q++) {
                var cd = noFengCds[z][q];
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }

    //惠州 花牌判断
    majiang.isFlower8 = function (card) {
        switch (card) {
            case 111:
            case 121:
            case 131:
            case 141:
            case 151:
            case 161:
            case 171:
            case 181:
                return true;
        }
        return false;
    }

    majiang.HunYiSe = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var fengPai = [31,41,51,61,71,81,91];
        var allFengPaiCounts = 0;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts++;
        }
        if(allFengPaiCounts >= pl.mjhand.length) return false; //全是风牌 则不是混一色
        var errorCount = 0;
        var color = -1;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        console.log("errorCount===" + errorCount);
        if (errorCount >= test.length) //test 中不含风
        {
            return false;
        }

        var noFengCds = [];
        for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
        //含风 去掉风
        for (var i = 0; i < noFengCds.length; i++) {
            noFengCds[i] = [];
            for (var k = 0; k < test[i].length; k++) {
                if (test[i][k] < 31) {
                    noFengCds[i].push(test[i][k]);
                }
            }
        }
        if (noFengCds.length == 0) return false;
        for (var z = 0; z < noFengCds.length; z++) {
            for (var q = 0; q < noFengCds[z].length; q++) {
                var cd = noFengCds[z][q];
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }

    majiang.HunYiSeNew = function (pl) {
        //var test=[  pl.mjhand,  pl.mjpeng,  pl.mjgang0,  pl.mjgang1,  pl.mjchi	];
        //var color=-1;
        //for(var i=0;i<test.length;i++)
        //{
        //    var cds=test[i];
        //    for(var j=0;j<cds.length;j++)
        //    {
        //        var cd=cds[j];
        //        if(isFeng(cd)) continue;
        //        if(majiang.isEqualHunCard(cd))
        //        {
        //            continue;
        //        }
        //        if(color==-1) color=Math.floor(cd/10);
        //        else if(color!=Math.floor(cd/10)) return false;
        //    }
        //}
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var fengPai = [31,41,51,61,71,81,91];
        var allFengPaiCounts = 0;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts++;
        }
        if(allFengPaiCounts >= pl.mjhand.length) return false; //全是风牌 则不是混一色
        var errorCount = 0;
        var color = -1;

        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(31) == -1 && cds.indexOf(41) == -1 && cds.indexOf(51) == -1 && cds.indexOf(61) == -1 && cds.indexOf(71) == -1 && cds.indexOf(81) == -1 && cds.indexOf(91) == -1) {
                errorCount++;
            } else {
                //console.log("含风");
            }
        }
        console.log("errorCount===" + errorCount);
        if (errorCount >= test.length) //test 中不含风
        {
            return false;
        }

        var noFengCds = [];
        for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
        //含风 去掉风
        for (var i = 0; i < noFengCds.length; i++) {
            noFengCds[i] = [];
            for (var k = 0; k < test[i].length; k++) {
                if (test[i][k] < 31) {
                    noFengCds[i].push(test[i][k]);
                }
            }
        }
        if (noFengCds.length == 0) return false;
        for (var z = 0; z < noFengCds.length; z++) {
            for (var q = 0; q < noFengCds[z].length; q++) {
                var cd = noFengCds[z][q];
                if(majiang.isEqualHunCard(cd))
                {
                    continue;
                }
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }

    majiang.getMaPrice = function (pl) {
        var counts = 0;
        for (var i = 0; i < pl.mjMa.length; i++) {
            for (var j = 0; j < pl.left4Ma.length; j++) {
                if (pl.mjMa[i] == pl.left4Ma[j]) counts++;
            }
        }
        return counts;//0 1 2 3 4
    }


    majiang.randomCards = function (withWind, withZhong) {
        //return testCds[(++nextTest)%testCds.length ];

        //var rtn=[]; rtn.length=withWind?mjcards.length:(mjcards.length-28);
        var rtn = [];
        if (withWind && withZhong) rtn.length = mjcards.length;
        if (withWind && !withZhong) rtn.length = mjcards.length;
        if (!withWind && withZhong) rtn.length = mjcards.length - 24;
        if (!withWind && !withZhong) rtn.length = mjcards.length - 24;
        //rtn.length=withWind?mjcards.length:(mjcards.length-24);

        for (var i = 0; i < rtn.length; i++) rtn[i] = mjcards[i];
        if (withZhong || withWind) {
            for (var i = 0; i < 4; i++) {
                rtn.push(71);
            }
        }
        for (var i = 0; i < rtn.length; i++) {
            var ci = rtn[i];
            var j = Math.floor(Math.random() * rtn.length);
            rtn[i] = rtn[j];
            rtn[j] = ci;
        }
        //查看 初始牌
        //for(var i=0;i<rtn.length;i++){
        //    var tt ="";
        //    tt = tt + rtn[i] + ",";
        //    console.log(tt);
        //}
        //console.log("是否含有红中："+withZhong);
        return rtn;
    }


    majiang.randomHuiZhouCards = function (withWind, withZhong) {
        //return testCds[(++nextTest)%testCds.length ];

        //var rtn=[]; rtn.length=withWind?mjcards.length:(mjcards.length-28);
        var rtn = [];
        if (withWind && withZhong) rtn.length = huizhoumjcards.length;
        if (withWind && !withZhong) rtn.length = huizhoumjcards.length;
        if (!withWind && withZhong) rtn.length = huizhoumjcards.length - 24;
        if (!withWind && !withZhong) rtn.length = huizhoumjcards.length - 24;
        //rtn.length=withWind?mjcards.length:(mjcards.length-24);

        for (var i = 0; i < rtn.length; i++) rtn[i] = huizhoumjcards[i];
        if (withZhong || withWind) {
            for (var i = 0; i < 4; i++) {
                rtn.push(71);
            }
        }
        for (var i = 0; i < rtn.length; i++) {
            var ci = rtn[i];
            var j = Math.floor(Math.random() * rtn.length);
            rtn[i] = rtn[j];
            rtn[j] = ci;
        }
        //查看 初始牌
        //for(var i=0;i<rtn.length;i++){
        //    var tt ="";
        //    tt = tt + rtn[i] + ",";
        //    console.log(tt);
        //}
        //console.log("是否含有红中："+withZhong);
        return rtn;
    }

    majiang.randomYiBaiZhangCards = function (withWind, withZhong){
        var rtn = [];
        if (withWind && withZhong) rtn.length = yibaizhangcards.length;
        if (withWind && !withZhong) rtn.length = yibaizhangcards.length;
        if (!withWind && withZhong) rtn.length = yibaizhangcards.length - 24;
        if (!withWind && !withZhong) rtn.length = yibaizhangcards.length - 24;
        //rtn.length=withWind?mjcards.length:(mjcards.length-24);

        for (var i = 0; i < rtn.length; i++) rtn[i] = yibaizhangcards[i];
        if (withZhong || withWind) {
            for (var i = 0; i < 4; i++) {
                rtn.push(71);
            }
        }
        for (var i = 0; i < rtn.length; i++) {
            var ci = rtn[i];
            var j = Math.floor(Math.random() * rtn.length);
            rtn[i] = rtn[j];
            rtn[j] = ci;
        }
        //查看 初始牌
        //for(var i=0;i<rtn.length;i++){
        //    var tt ="";
        //    tt = tt + rtn[i] + ",";
        //    console.log(tt);
        //}
        //console.log("是否含有红中："+withZhong);
        return rtn;
    }

    function canMath3(cds, i) {
        if (i + 2 >= cds.length) return false;
        var pat = [[0, 0, 0], [0, 1, 2]];
        for (var j = 0; j < pat.length; j++) {
            var pj = pat[j];
            for (var k = 0; k < pj.length; k++) {
                if (pj[k] + cds[i] != cds[k + i]) break;
                if (k == pj.length - 1) return true;
            }
        }
        return false
    }

    function canMath6(cds, i) {
        if (i + 5 >= cds.length) return false;
        var pat = [[0, 0, 1, 1, 2, 2], [0, 1, 1, 2, 2, 3], [0, 1, 1, 1, 1, 2]];
        for (var j = 0; j < pat.length; j++) {
            var pj = pat[j];
            for (var k = 0; k < pj.length; k++) {
                if (pj[k] + cds[i] != cds[k + i]) break;
                if (k == pj.length - 1) return true;
            }
        }
        return false;
    }

    function canMath9(cds, i) {
        if (i + 8 >= cds.length) return false;
        var pat = [[0, 1, 1, 2, 2, 2, 3, 3, 4], [0, 1, 1, 1, 2, 2, 2, 3, 3], [0, 0, 1, 1, 1, 2, 2, 2, 3]];
        for (var j = 0; j < pat.length; j++) {
            var pj = pat[j];
            for (var k = 0; k < pj.length; k++) {
                if (pj[k] + cds[i] != cds[k + i]) break;
                if (k == pj.length - 1) return true;
            }
        }
        return false;
    }

    function canMath12(cds, i) {
        if (i + 11 >= cds.length) return false;
        //var pat=[[0,1,1,2,2,2,3,3,3,4,4,5]];
        var pat = [[0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 5], [0, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4], [0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 4],[0,1,1,1,2,2,2,2,3,3,3,4]];
        for (var j = 0; j < pat.length; j++) {
            var pj = pat[j];
            for (var k = 0; k < pj.length; k++) {
                if (pj[k] + cds[i] != cds[k + i]) break;
                if (k == pj.length - 1) return true;
            }
        }
        return false;
    }

    function getAllCdsTypeAndCount(cds) {
        var cdsObj = {};
        for (var i = 0; i < cds.length; i++) {
            if (!cdsObj[cds[i]]) {
                cdsObj[cds[i]] = {
                    count: 1
                }
            }
            else {
                cdsObj[cds[i]].count++;
            }
        }
        return cdsObj;
    }

    function getClearCdsByOneType(type, cds) {
        var arr = [];
        for (var i = 0; i < cds.length; i++) {
            if (cds[i] != type) {
                arr.push(cds[i]);
            }
        }
        return arr;
    }

    function mergeArrByTwo(arr, other) {
        var tempArr = [];
        for (var i = 0; i < arr.length; i++) {
            tempArr.push(arr[i]);
        }
        for (var i = 0; i < other.length; i++) {
            tempArr.push(other[i]);
        }
        return tempArr;
    }

    function cloneCds(cds) {
        var arr = [];
        for (var i = 0; i < cds.length; i++) {
            arr.push(cds[i]);
        }
        return arr;
    }

    function ruleOutByArr(cds) {
        var dict = {};
        var arr = [];
        for (var i = 0; i < cds.length; i++) {
            if (!dict[cds[i]]) {
                dict[cds[i]] = "";
            }
        }
        var objDict = Object.keys(dict);
        for (var i = 0; i < objDict.length; i++) {
            arr.push(parseInt(objDict[i]));
        }
        return arr;
    }

    function isCard258(card) {
        switch (card) {
            case 2:
            case 12:
            case 22:
            case 5:
            case 15:
            case 25:
            case 8:
            case 18:
            case 28:
                return true;
        }
        return false;
    }

    var cardType = {//分牌类型
        tiao: 0,
        tong: 1,
        wan: 2,
        feng: 3,
        hun: 4
    };
    var MJPAI_HUNMAX = 4;
    var needMinHunNum = MJPAI_HUNMAX;

    function calNeedHunNumToBePu(typeVec, needNum) {
        var p1, p2, p3;
        if (needMinHunNum == 0) return;
        if (needNum >= needMinHunNum)return;

        var vSize = typeVec.length;
        if (vSize == 0) {
            needMinHunNum = needNum > needMinHunNum ? needMinHunNum : needNum;
            return;
        }
        else if (vSize == 1) {
            needMinHunNum = (needNum + 2) > needMinHunNum ? needMinHunNum : (needNum + 2);
            return;
        }
        else if (vSize == 2) {
            p1 = typeVec[0];
            p2 = typeVec[1];

            if (p2 - p1 < 3) {
                needMinHunNum = (needNum + 1) > needMinHunNum ? needMinHunNum : (needNum + 1);
            }
            return;
        }
        //大于等于3张牌
        p1 = typeVec[0];
        p2 = typeVec[1];
        p3 = typeVec[2];
        var k2 = 1;
        var k3 = 2;

        //第一个自己一扑
        if (needNum + 2 < needMinHunNum) {
            typeVec.splice(0, 1);
            calNeedHunNumToBePu(typeVec, needNum + 2);
            typeVec.splice(0, 0, p1);
        }
        //第一个跟其它的一个一扑
        if (needNum + 1 < needMinHunNum) {
            for (var i = 1; i < typeVec.length; i++) {
                if (needNum + 1 >= needMinHunNum) break;
                p2 = typeVec[i];
                k2 = i;
                //455567这里可结合的可能为 45 46 否则是45 45 45 46
                //如果当前的value不等于下一个value则和下一个结合避免重复
                if (i + 1 != typeVec.length) {
                    p3 = typeVec[i + 1];
                    k3 = i + 1;
                    if (p3 == p2) continue;
                }
                if (p2 - p1 < 3) {
                    typeVec.splice(0, 1);
                    typeVec.splice(k2 - 1, 1);

                    calNeedHunNumToBePu(typeVec, needNum + 1);

                    typeVec.splice(k2 - 1, 0, p2);
                    typeVec.splice(0, 0, p1);
                }
                else break;
            }

        }
        //第一个和其它两个一扑
        //后面间隔两张张不跟前面一张相同222234
        //可能性为222 234
        for (var ii = 1; ii < typeVec.length; ii++) {
            if (needNum >= needMinHunNum) break;
            p2 = typeVec[ii];
            k2 = ii;
            if (ii + 2 < typeVec.length) {
                if (typeVec[ii + 2] == p2) continue;
            }
            for (var j = ii + 1; j < typeVec.length; j++) {
                if (needNum >= needMinHunNum) break;
                p3 = typeVec[j];
                k3 = j;

                if (p1 == p3) {
                }
                if (j + 1 < typeVec.length) {
                    if (p3 == typeVec[j + 1]) continue;
                }

                var tempSeg = [p1, p2, p3];
                if (canMatchSeq(tempSeg)) {
                    typeVec.splice(0, 1);
                    typeVec.splice(k2 - 1, 1);
                    typeVec.splice(k3 - 2, 1);

                    calNeedHunNumToBePu(typeVec, needNum);
                    typeVec.splice(k3 - 2, 0, p3);
                    typeVec.splice(k2 - 1, 0, p2);
                    typeVec.splice(0, 0, p1);
                }
                //4556
            }
        }
    }

    function isCanHunHu(hunNum, m_HuPaiVec, with258) {
        var huSize = m_HuPaiVec.length;
        if (huSize <= 0) {
            if (hunNum >= 2) {
                return true;
            } else {
                return false;
            }
        }
        var firstPai = m_HuPaiVec[0];
        var huPaiCopy = [];
        for (var i = 0; i < m_HuPaiVec.length; i++) {
            huPaiCopy.push(m_HuPaiVec[i]);
        }
        for (var it = 0; it < huPaiCopy.length; it++) {
            if (it == huPaiCopy.length - 1) {
                if (hunNum > 0) {
                    hunNum = hunNum - 1;
                    var pairCard = huPaiCopy[it];
                    m_HuPaiVec.splice(it, 1);
                    needMinHunNum = MJPAI_HUNMAX;
                    calNeedHunNumToBePu(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum) {
                        if (with258) {
                            if (isCard258(pairCard))
                                return true;
                        } else
                            return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it, 0, pairCard);
                }
            }
            else {
                if ((it + 2 == huPaiCopy.length) || (huPaiCopy[it] != huPaiCopy[it + 2])) {
                    if (huPaiCopy[it] == huPaiCopy[it + 1]) {
                        var pair1 = m_HuPaiVec[it];
                        var pair2 = m_HuPaiVec[it + 1];
                        m_HuPaiVec.splice(it, 1);
                        m_HuPaiVec.splice(it, 1);

                        needMinHunNum = MJPAI_HUNMAX;
                        calNeedHunNumToBePu(m_HuPaiVec, 0);
                        if (needMinHunNum <= hunNum) {
                            if (with258) {
                                if (isCard258(pair1))
                                    return true;
                            } else
                                return true;
                        }
                        m_HuPaiVec.splice(it, 0, pair2);
                        m_HuPaiVec.splice(it, 0, pair1);
                    }
                }
                if (hunNum > 0 && (huPaiCopy[it] != huPaiCopy[it + 1])) {
                    hunNum = hunNum - 1;
                    var pair3 = m_HuPaiVec[it];
                    m_HuPaiVec.splice(it, 1);
                    needMinHunNum = MJPAI_HUNMAX;
                    calNeedHunNumToBePu(m_HuPaiVec, 0);
                    if (needMinHunNum <= hunNum) {
                        if (with258) {
                            if (isCard258(pair3))
                                return true;
                        } else
                            return true;
                    }
                    hunNum = hunNum + 1;
                    m_HuPaiVec.splice(it, 0, pair3);
                }
            }
        }
        return false;
    }

    function canMatchSeq(seg) {
        var matchOK = true;
        for (var m = 0; m < seg.length;) {
            if (canMath12(seg, m))      m += 12;
            else if (canMath9(seg, m))  m += 9;
            else if (canMath6(seg, m))  m += 6;
            else if (canMath3(seg, m))  m += 3;
            else {
                matchOK = false;
                break;
            }
        }
        return matchOK;
    }

    function isTiao(card) {
        if (card >= 1 && card <= 9) {
            return true;
        }
        return false;
    }

    function isTong(card) {
        if (card >= 11 && card <= 19) {
            return true;
        }
        return false;
    }

    function isWan(card) {
        if (card >= 21 && card <= 29) {
            return true;
        }
        return false;
    }

    function isFeng(card) {
        if (card >= 31 && card <= 91) {
            return true;
        }
        return false;
    }

    function isHun(card) {
        if (card == 71) {
            return true;
        }
        return false;
    }

    function isWind(card) {
        if (card >= 31 && card <= 91) {
            return true;
        }
        return false;
    }

    function is4HongZhong(cds, cd) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        var count = 0;
        for (var i = 0; i < cds.length; i++) {
            console.log(cds[i]);
            if (cds[i] == 71) {
                count++;
            }
        }
        console.log("count===" + count);
        if (count == 4) return true;
        return false;
    }


    majiang.toFontGuiPai = function (cds, withZhong, isFanGui, gui) {
        //console.log("进来排序手牌了==============鬼牌是："+gui);
        if (withZhong) {
            cds.sort(function (node1, node2) {
                return node2.tag == 71;
            });
        }
        if (isFanGui) {
            cds.sort(function (node1, node2) {
                return node2.tag == gui;
            });
        }

    };

    function is4SameGui(cds, cd, gui) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        var count = 0;
        for (var i = 0; i < cds.length; i++) {
            if (cds[i] == gui) {
                count++;
            }
        }
        if (count == 4) return true;
        return false;
    }
    //检测手中是否含4鬼（红中鬼与翻鬼）
    majiang.check4guiforhands = function(cards,withZhong,isfanGui,gui)
    {
        var isOk = false;
        var count = 0;
        if(withZhong)
        {
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] == 71) {
                    count++;
                }
            }
            if (count == 4) isOk = true;
        }
        else if(isfanGui)
        {
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] == gui) {
                    count++;
                }
            }
            if (count == 4) isOk = true;
        }
        return isOk;
    }

    //随机 任意鬼牌 (不含花牌)
    majiang.getRandomGui = function (withWind) {
        var randomIndex;
        if (!withWind) randomIndex = Math.floor(Math.random() * (mjcards.length - 24));
        else  randomIndex = Math.floor(Math.random() * mjcards.length);

        if (!withWind) return mjGuicards[randomIndex];
        else  return mjcards[randomIndex];

    }

    //随机 任意鬼牌 不包括万
    majiang.getRandomGuiForYiBaiZhang = function () {

        return yibaizhangcards[Math.floor(Math.random() * yibaizhangcards.length)];
    }

    //翻鬼的7对胡
    function can_7_HuForFanGui(cds, cd, with258, withHun, gui) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });

        if (cds.length != 14) {
            return false;
        }
        var oddCards = [];
        var pairs = [];
        var hunCards = [];
        var isodd258 = false;
        var ispair258 = false;
        for (i = 0; i < cds.length; i++) {
            if (withHun) {
                if (gui == cds[i]) {
                    hunCards.push(cds[i]);
                    continue;
                }
            }
            if (i == cds.length - 1) {
                oddCards.push(cds[i]);
            } else if (cds[i] != cds[i + 1]) {
                oddCards.push(cds[i]);
                if (with258 && isCard258(cds[i])) {
                    isodd258 = true;
                }
            } else {
                if (with258 && isCard258(cds[i])) {
                    ispair258 = true;
                }
                pairs.push(cds[i]);
                i++;
            }
        }
        if (oddCards.length > 0) {//有单牌
            if (withHun) {
                if (hunCards.length == oddCards.length) {//单牌数==红中数
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
                if(oddCards.length < hunCards.length && hunCards.length == 3 ){
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4) {
                return true;
            } else if (with258) {
                if (ispair258)
                    return true;
            } else {
                return true;
            }
        }
        return false;
    }

    function can_7_Hu(cds, cd, with258, withHun) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });

        if (cds.length != 14) {
            return false;
        }
        var oddCards = [];
        var pairs = [];
        var hunCards = [];
        var isodd258 = false;
        var ispair258 = false;
        for (i = 0; i < cds.length; i++) {
            if (withHun) {
                if (isHun(cds[i])) {
                    hunCards.push(cds[i]);
                    continue;
                }
            }
            if (i == cds.length - 1) {
                oddCards.push(cds[i]);
            } else if (cds[i] != cds[i + 1]) {
                oddCards.push(cds[i]);
                if (with258 && isCard258(cds[i])) {
                    isodd258 = true;
                }
            } else {
                if (with258 && isCard258(cds[i])) {
                    ispair258 = true;
                }
                pairs.push(cds[i]);
                i++;
            }
        }
        if (oddCards.length > 0) {//有单牌
            if (withHun) {
                if (hunCards.length == oddCards.length) {//单牌数==红中数
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
                if(oddCards.length < hunCards.length && hunCards.length == 3 ){
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4) {
                return true;
            } else if (with258) {
                if (ispair258)
                    return true;
            } else {
                return true;
            }
        }
        return false;
    }

    //任意癞子护法
    function canHunHuForFanGui(no7, cds, cd, with258, withHun, gui,gui4Hu) {
        var cdsss = cds;
        //分牌，按类型：条，筒，万，红中，1,2,3,5
        //1.初始化
        var allCards = [];
        allCards[cardType.tiao] = [];
        allCards[cardType.tong] = [];
        allCards[cardType.wan] = [];
        allCards[cardType.feng] = [];// 暂时没用到
        allCards[cardType.hun] = [];
        var tmp = [];
        for (var i = 0; i < cds.length; i++) {
            tmp.push(cds[i]);
        }
        if (cd) {
            tmp.push(cd);
        }
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if (gui == cds[i]) {
                allCards[cardType.hun].push(cds[i]);
            } else if (isTiao(cds[i])) {
                allCards[cardType.tiao].push(cds[i]);
            } else if (isTong(cds[i])) {
                allCards[cardType.tong].push(cds[i]);
            } else if (isWan(cds[i])) {
                allCards[cardType.wan].push(cds[i]);
            } else if (isWind(cds[i])) {
                allCards[cardType.feng].push(cds[i]);
            }
        }
        var needHunNum = 0;
        var jiangNeedNum = 0;
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;

        //暂不支持风
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        //var fengToPuNeedNum = 0;
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var vecSize = 0;
        var isHu = false;
        var hunHuType = 100;//混胡的类型定义
        curHunNum = allCards[cardType.hun].length;
        // console.info("hun:"+curHunNum);
        // console.info("tongToPuNeedNum:"+tongToPuNeedNum);
        // console.info("tiaoToPuNeedNum:"+tiaoToPuNeedNum);
        // console.info("wanToPuNeedNum:"+wanToPuNeedNum);

        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.wan].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.wan], with258);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tong].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.tong], with258);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tiao].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.tiao], with258);
            if (isHu)  return hunHuType;
        }
        //将在风中,暂时不支持，待续
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.feng].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.feng], with258);
            if (isHu)  return hunHuType;
        }

        //放置最后判断能否胡7对
        if (!no7) {
            var isHu7 = can_7_HuForFanGui(cdsss, cd, with258, withHun, gui);
            if (isHu7)
                return 7;
        }
        if (is4SameGui(cdsss, cd, gui) && gui4Hu) return 100;
        return 0;
    }

    //新任意癞子护法
    function canHunHuForFanGuiNew(no7, cds, cd, with258, withHun, gui,gui4Hu) {
        var cdsss = cds;
        //分牌，按类型：条，筒，万，红中，1,2,3,5
        //1.初始化
        var allCards = [];
        allCards[cardType.tiao] = [];
        allCards[cardType.tong] = [];
        allCards[cardType.wan] = [];
        allCards[cardType.feng] = [];// 暂时没用到
        allCards[cardType.hun] = [];
        var tmp = [];
        for (var i = 0; i < cds.length; i++) {
            tmp.push(cds[i]);
        }
        if (cd) {
            tmp.push(cd);
        }
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if (gui == cds[i]) {
                allCards[cardType.hun].push(cds[i]);
            } else if (isTiao(cds[i])) {
                allCards[cardType.tiao].push(cds[i]);
            } else if (isTong(cds[i])) {
                allCards[cardType.tong].push(cds[i]);
            } else if (isWan(cds[i])) {
                allCards[cardType.wan].push(cds[i]);
            } else if (isWind(cds[i])) {
                allCards[cardType.feng].push(cds[i]);
            }
        }
        var needHunNum = 0;
        var jiangNeedNum = 0;
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;

        //暂不支持风
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        //var fengToPuNeedNum = 0;
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var vecSize = 0;
        var isHu = false;
        var isHu1 = false;
        var isHu2 = false;
        var isHu3 = false;
        curHunNum = allCards[cardType.hun].length;
        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.wan].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.wan], with258);
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tong].length;
            hasNum = curHunNum - needHunNum;
            isHu1 = isCanHunHu(hasNum, allCards[cardType.tong], with258);
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tiao].length;
            hasNum = curHunNum - needHunNum;
            isHu2 = isCanHunHu(hasNum, allCards[cardType.tiao], with258);
        }
        //将在风中,暂时不支持，待续
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.feng].length;
            hasNum = curHunNum - needHunNum;
            isHu3 = isCanHunHu(hasNum, allCards[cardType.feng], with258);
        }

        //放置最后判断能否胡7对
        var isHu7 = false;
        if (!no7) {
            isHu7 = can_7_HuForFanGui(cdsss, cd, with258, withHun, gui);
        }
        //胡七小对 及其他类型
        if(isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 8;
        if(isHu7 && (!isHu && !isHu1 && !isHu2 && !isHu3)) return 7;
        if(!isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 100;
        if (is4SameGui(cdsss, cd, gui) && gui4Hu) return 100;
        return 0;
    }

    //红中癞子胡法
    function canHunHu(no7, cds, cd, with258, withHun,gui4Hu) {
        var cdsss = cds;
        //分牌，按类型：条，筒，万，红中，1,2,3,5
        //1.初始化
        var allCards = [];
        allCards[cardType.tiao] = [];
        allCards[cardType.tong] = [];
        allCards[cardType.wan] = [];
        allCards[cardType.feng] = [];// 暂时没用到
        allCards[cardType.hun] = [];
        var tmp = [];
        for (var i = 0; i < cds.length; i++) {
            tmp.push(cds[i]);
        }
        if (cd) {
            tmp.push(cd);
        }
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if (isHun(cds[i])) {
                allCards[cardType.hun].push(cds[i]);
            } else if (isTiao(cds[i])) {
                allCards[cardType.tiao].push(cds[i]);
            } else if (isTong(cds[i])) {
                allCards[cardType.tong].push(cds[i]);
            } else if (isWan(cds[i])) {
                allCards[cardType.wan].push(cds[i]);
            } else if (isWind(cds[i])) {
                allCards[cardType.feng].push(cds[i]);
            }
        }
        var needHunNum = 0;
        var jiangNeedNum = 0;
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;

        //暂不支持风
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        //var fengToPuNeedNum = 0;
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var vecSize = 0;
        var isHu = false;
        var hunHuType = 100;//混胡的类型定义
        curHunNum = allCards[cardType.hun].length;
        // console.info("hun:"+curHunNum);
        // console.info("tongToPuNeedNum:"+tongToPuNeedNum);
        // console.info("tiaoToPuNeedNum:"+tiaoToPuNeedNum);
        // console.info("wanToPuNeedNum:"+wanToPuNeedNum);

        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.wan].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.wan], with258);
            if (isHu)  return hunHuType;
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tong].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.tong], with258);
            if (isHu)  return hunHuType;
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tiao].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.tiao], with258);
            if (isHu)  return hunHuType;
        }
        //将在风中,暂时不支持，待续
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.feng].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.feng], with258);
            if (isHu)  return hunHuType;
        }
        ////最后判断能否胡7对
        if (!no7) {
            var isHu7 = can_7_Hu(cdsss, cd, with258, withHun);
            if (isHu7)
                return 7;
        }
        if (is4HongZhong(cdsss, cd) && gui4Hu) return 100;
        return 0;
    }

    //红中癞子胡法
    function canHunHuNew(no7, cds, cd, with258, withHun,gui4Hu) {
        var cdsss = cds;

        //分牌，按类型：条，筒，万，红中，1,2,3,5
        //1.初始化
        var allCards = [];
        allCards[cardType.tiao] = [];
        allCards[cardType.tong] = [];
        allCards[cardType.wan] = [];
        allCards[cardType.feng] = [];// 暂时没用到
        allCards[cardType.hun] = [];
        var tmp = [];
        for (var i = 0; i < cds.length; i++) {
            tmp.push(cds[i]);
        }
        if (cd) {
            tmp.push(cd);
        }
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if (isHun(cds[i])) {
                allCards[cardType.hun].push(cds[i]);
            } else if (isTiao(cds[i])) {
                allCards[cardType.tiao].push(cds[i]);
            } else if (isTong(cds[i])) {
                allCards[cardType.tong].push(cds[i]);
            } else if (isWan(cds[i])) {
                allCards[cardType.wan].push(cds[i]);
            } else if (isWind(cds[i])) {
                allCards[cardType.feng].push(cds[i]);
            }
        }
        var needHunNum = 0;
        var jiangNeedNum = 0;
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.wan], 0);
        var wanToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tong], 0);
        var tongToPuNeedNum = needMinHunNum;

        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.tiao], 0);
        var tiaoToPuNeedNum = needMinHunNum;

        //暂不支持风
        needMinHunNum = MJPAI_HUNMAX;
        calNeedHunNumToBePu(allCards[cardType.feng], 0);
        //var fengToPuNeedNum = 0;
        var fengToPuNeedNum = needMinHunNum;

        var hasNum = 0;
        var vecSize = 0;
        var isHu = false;
        var isHu1 = false;
        var isHu2 = false;
        var isHu3 = false;
        curHunNum = allCards[cardType.hun].length;
        // console.info("hun:"+curHunNum);
        // console.info("tongToPuNeedNum:"+tongToPuNeedNum);
        // console.info("tiaoToPuNeedNum:"+tiaoToPuNeedNum);
        // console.info("wanToPuNeedNum:"+wanToPuNeedNum);

        //将在万中
        //如果需要的混小于等于当前的则计算将在将在万中需要的混的个数
        needHunNum = tongToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.wan].length;
            hasNum = curHunNum - needHunNum;
            isHu = isCanHunHu(hasNum, allCards[cardType.wan], with258);
        }
        //将在饼中
        needHunNum = wanToPuNeedNum + tiaoToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tong].length;
            hasNum = curHunNum - needHunNum;
            isHu1 = isCanHunHu(hasNum, allCards[cardType.tong], with258);
        }
        //将在条中
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + fengToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.tiao].length;
            hasNum = curHunNum - needHunNum;
            isHu2 = isCanHunHu(hasNum, allCards[cardType.tiao], with258);
        }
        //将在风中,暂时不支持，待续
        needHunNum = wanToPuNeedNum + tongToPuNeedNum + tiaoToPuNeedNum;
        if (needHunNum <= curHunNum) {
            vecSize = allCards[cardType.feng].length;
            hasNum = curHunNum - needHunNum;
            isHu3 = isCanHunHu(hasNum, allCards[cardType.feng], with258);
        }
        ////最后判断能否胡7对
        var isHu7 = false;
        if (!no7) {
            isHu7 = can_7_Hu(cdsss, cd, with258, withHun);
        }
        console.log("胡了没"+isHu);
        //胡七小对 及其他类型
        if(isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 8;
        if(isHu7 && (!isHu && !isHu1 && !isHu2 && !isHu3)) return 7;
        if(!isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 100;
        //摸到4个红中 胡
        if (is4HongZhong(cdsss, cd) && gui4Hu) return 100;
        return 0;
    }

    majiang.canHu = function (no7, cds, cd, with258, withZhong, fanGui, gui,gui4Hu) {
        if(myObject &&(myObject.tData.gameType == 6 ||myObject.tData.gameType == 1 || myObject.tData.gameType == 5 || myObject.tData.gameType == 3 ) )
            return majiang.canHuNew(no7, cds, cd, with258, withZhong, fanGui, gui,gui4Hu);
        else{
            //带红中癞子
            if (withZhong) {
                return canHunHu(no7, cds, cd, with258, withZhong,gui4Hu);
            }
            else if (fanGui) {
                return canHunHuForFanGui(no7, cds, cd, with258, fanGui, gui,gui4Hu);
            }
            else {
                return canHuNoZhong(no7, cds, cd, with258);
            }
        }
    }

    //新的canHu算法
    majiang.canHuNew = function (no7, cds, cd, with258, withZhong, fanGui, gui,gui4Hu) {
        //带红中癞子
        if (withZhong) {
            return canHunHuNew(no7, cds, cd, with258, withZhong,gui4Hu);
        }
        else if (fanGui) {
            return canHunHuForFanGuiNew(no7, cds, cd, with258, fanGui, gui,gui4Hu);
        }
        else {
            return canHuNoZhong(no7, cds, cd, with258);
        }
    }

    function canHuZhong(no7, cds, cd, with258) {
        // var startTime = new Date().getTime();
        // var endTime = 0;
        var cdsLen = cds.length;
        var tmp = [];
        for (var i = 0; i < cdsLen; i++) tmp.push(cds[i]);
        if (cd) {
            tmp.push(cd);
            console.log("cd=====" + cd);
        }
        cds = tmp;

        var cloneArr = cloneCds(cds);
        console.info("cds : " + JSON.stringify(cloneArr));
        var mjType = [
            0,
            // 1,  2,  3,  4,  5,  6,  7,  8,  9,
            // 11, 12, 13, 14, 15, 16, 17, 18, 19,
            // 21, 22, 23, 24, 25, 26, 27, 28, 29,
            71
        ];
        var mjTypeCount = getAllCdsTypeAndCount(cloneArr);
        var mjRemain = getClearCdsByOneType(71, cloneArr);
        var zhongCount = 0;
        if (mjTypeCount[71]) {
            zhongCount = mjTypeCount[71].count;
        }
        //变换牌行 任何牌行
        //无红中
        if (zhongCount == 0) {
            return canHuNoZhong(no7, cds, 0, with258);
        }
        //有红中
        //all
        var keys = Object.keys(mjTypeCount);
        var maxFindCount = zhongCount > 2 ? 2 : zhongCount;
        for (var j = 0; j < keys.length; j++) {
            // console.info("keys : " + keys[j]);
            if (parseInt(keys[j]) != 71) {
                var index = parseInt(keys[j]);
                //left
                for (var i = index; i >= index - maxFindCount; i--) {
                    // console.info("left : " + i);
                    if (i % 10 == 0) {
                        break;
                    }
                    else {
                        mjType.push(i);
                    }
                }
                //right
                for (var i = index; i <= index + maxFindCount; i++) {
                    // console.info("right : " + i);
                    if (i % 10 == 0) {
                        break;
                    }
                    else {
                        mjType.push(i);
                    }
                }
                mjType.push(index);
            }
        }
        //是否是258
        if (with258) {
            var arr258 = [2, 5, 8, 12, 15, 18, 22, 25, 28];
            for (var i = 0; i < arr258.length; i++) {
                mjType.push(arr258[i]);
            }
        }
        // console.info("ruleOutByArr before : " + JSON.stringify(mjType));
        mjType = ruleOutByArr(mjType);
        // console.info("ruleOutByArr after : " + JSON.stringify(mjType));

        //排序
        mjType.sort(function (a, b) {
            return a - b
        });
        var mjTypeLen = mjType.length;
        var len = Math.pow(mjTypeLen, zhongCount);
        // console.info("len : " + len + " zhongCount : " + zhongCount);
        var cdIdx1 = 0;
        var cdIdx2 = 0;
        var cdIdx3 = 0;
        var cdIdx4 = 0;
        var arrCds = [];
        for (var i = 0; i < len; i++) {
            cdIdx1 = i % mjTypeLen;
            cdIdx2 = Math.floor(i / mjTypeLen) % mjTypeLen;
            cdIdx3 = Math.floor(i / mjTypeLen / mjTypeLen) % mjTypeLen;
            cdIdx4 = Math.floor(i / mjTypeLen / mjTypeLen / mjTypeLen) % mjTypeLen;
            // console.info("cdIdx1 : " + cdIdx1 + " cdIdx2 : " + cdIdx2 + " cdIdx3 : " + cdIdx3 + " cdIdx4 : " + cdIdx4);
            if (mjType[cdIdx1]) {
                arrCds.push(mjType[cdIdx1]);
            }
            if (mjType[cdIdx2]) {
                arrCds.push(mjType[cdIdx2]);
            }
            if (mjType[cdIdx3]) {
                arrCds.push(mjType[cdIdx3]);
            }
            if (mjType[cdIdx4]) {
                arrCds.push(mjType[cdIdx4]);
            }
            if (arrCds.length > 0) {
                //补红中
                if (arrCds.length < zhongCount) {
                    for (var j = 0; j < zhongCount - arrCds.length; j++) {
                        arrCds.push(71);
                    }
                }
                var tempCds = mergeArrByTwo(mjRemain, arrCds);
                var huType = canHuNoZhong(no7, tempCds, 0, with258);
                arrCds = [];
                if (huType > 0) {
                    // endTime = new Date().getTime();
                    // console.info("ms : " + (endTime - startTime));
                    // console.info("hu cards : " + JSON.stringify(tempCds));
                    return huType;
                }
            }
        }
        // endTime = new Date().getTime();
        // console.info("ms : " + (endTime - startTime));
        return 0;
    }

    function canHuNoZhong(no7, cds, cd, with258) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        cds = tmp;

        cds.sort(function (a, b) {
            return a - b
        });
        var pair = {};
        //做将
        var isWith258 = false;
        if (with258) {
            for (var i = 0; i < cds.length; i++) {
                if (i < cds.length - 1 && cds[i] == cds[i + 1]) {
                    switch (cds[i]) {
                        case 2:
                        case 12:
                        case 22:
                        case 5:
                        case 15:
                        case 25:
                        case 8:
                        case 18:
                        case 28:
                            pair[cds[i]] = cds[i];
                            isWith258 = true;
                            break;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < cds.length; i++) {
                if (i < cds.length - 1 && cds[i] == cds[i + 1]) {
                    pair[cds[i]] = cds[i];
                }
            }
        }
        if (Object.keys(pair).length == 0) return -1;
        for (var pairKey in pair) {
            var pcd = pair[pairKey];
            var left = [];
            var pnum = 0;
            for (var i = 0; i < cds.length; i++) {
                if (cds[i] == pcd && pnum < 2)
                    pnum++;
                else   left.push(cds[i]);
            }
            if (left.length == 0) return 1;
            if (left.length == 12) {
                var is13 = true, off13 = 0;
                for (var i = 0; i + off13 < s13.length; i++) {
                    if (pcd == s13[i]) off13++;
                    if (left[i] != s13[i + off13]) {
                        is13 = false;
                        break;
                    }
                }
                if (off13 == 1 && is13) return 13;
                var is7 = true;
                if (no7) {
                    is7 = false;
                }
                else {
                    for (var i = 0; i < left.length; i += 2) {
                        if (left[i] != left[i + 1]) {
                            is7 = false;
                            break;
                        }
                    }
                }
                if (is7) {
                    if (with258) {
                        if (isWith258) {
                            return 7;
                        }
                        else {
                            return 0;
                        }
                    }
                    else {
                        return 7;
                    }
                }
            }
            var segs = [];
            var seg = [left[0]];
            for (var i = 1; i < left.length; i++) {
                if (canLink(left[i - 1], left[i])) seg.push(left[i]);
                else {
                    segs.push(seg);
                    seg = [left[i]];
                }
            }
            if (seg.length > 0) segs.push(seg);
            var matchOK = true;
            for (var i = 0; i < segs.length; i++) {
                seg = segs[i];
                if (seg.length % 3 != 0) {
                    matchOK = false;
                    break;
                }
                for (var m = 0; m < seg.length;) {
                    if (canMath12(seg, m))      m += 12;
                    else if (canMath9(seg, m))  m += 9;
                    else if (canMath6(seg, m))  m += 6;
                    else if (canMath3(seg, m))  m += 3;
                    else {
                        matchOK = false;
                        break;
                    }
                }
            }
            if (matchOK) return 1;
        }
        return 0;
    }

    majiang.canGang1 = function (peng, hand, peng4) {
        var rtn = [];
        for (var i = 0; i < peng.length; i++) {
            if (hand.indexOf(peng[i]) >= 0 && peng4.indexOf(peng[i]) < 0) {
                rtn.push(peng[i]);
            }
        }
        var cnum = {};
        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            var num = cnum[cd];
            if (!num) num = 0;
            num++;
            cnum[cd] = num;
            if (num == 4) rtn.push(cd);
        }
        return rtn;
    }
    majiang.canPengForQiDui = function(hand)
    {
        var rtn = [];
        var cnum = {};
        for (var i = 0; i < hand.length; i++) {
            var cd = hand[i];
            if(majiang.isEqualHunCard(cd))
            {
                continue;
            }
            var num = cnum[cd];
            if (!num) num = 0;
            num++;
            cnum[cd] = num;
            if (num == 3 || num == 4) rtn.push(cd);
        }
        return rtn;
    }
    majiang.canGang0 = function (hand, cd) {
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        return num == 3;
    }
    majiang.canPeng = function (hand, cd) {
        var num = 0;
        for (var i = 0; i < hand.length; i++) {
            if (hand[i] == cd) num++;
        }
        return num >= 2;
    }
    majiang.canChi = function (hand, cd) {
        var num = [0, 0, 0, 0, 0];
        var rtn = [];
        for (var i = 0; i < hand.length; i++) {
            var dif = hand[i] - cd;
            switch (dif) {
                case -2:
                case -1:
                case 1:
                case 2:
                    num[dif + 2]++;
                    break;
            }
        }
        if (num[3] > 0 && num[4] > 0) rtn.push(0);
        if (num[1] > 0 && num[3] > 0) rtn.push(1);
        if (num[0] > 0 && num[1] > 0) rtn.push(2);
        return rtn;
    }

    majiang.OnlyHand = function (pl) {
        return pl.mjpeng.length == 0 && pl.mjgang0.length == 0 && pl.mjchi.length == 0;
    }
    majiang.SameColor = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var fengPai = [31,41,51,61,71,81,91];
        var handFengPaiCounts = 0;
        var pengFengPaiCounts = 0;
        var mingGangFengPaiCounts = 0;
        var anGangFengPaiCounts = 0;
        var chiFengPaiCounts = 0;
        var error = 0;//如果这个不为0 说明吃、碰、杠中不全是风牌
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) handFengPaiCounts++;
            else error++;
        }
        //检测 碰牌 杠牌  吃牌 是否都是风牌
        if(pl.mjpeng.length > 0)
        {
            for(var i=0;i<pl.mjpeng.length;i++)
            {
                if(fengPai.indexOf(pl.mjpeng[i]) != -1) pengFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjgang0.length >0){
            for(var i=0;i<pl.mjgang0.length;i++)
            {
                if(fengPai.indexOf(pl.mjgang0[i]) != -1) mingGangFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjgang1.length >0){
            for(var i=0;i<pl.mjgang1.length;i++)
            {
                if(fengPai.indexOf(pl.mjgang1[i]) != -1) anGangFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjchi.length >0){
            for(var i=0;i<pl.mjchi.length;i++)
            {
                if(fengPai.indexOf(pl.mjchi[i]) != -1) chiFengPaiCounts ++;
                else error++;
            }
        }
        if(handFengPaiCounts >= pl.mjhand.length && pengFengPaiCounts * 3 >= pl.mjpeng.length && mingGangFengPaiCounts*4 >= pl.mjgang0.length && anGangFengPaiCounts*4 >= pl.mjgang1.length && chiFengPaiCounts >= pl.mjchi.length && error == 0 ) return true; //全是风牌 则是清一色
        var color = -1;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            for (var j = 0; j < cds.length; j++) {
                var cd = cds[j];
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }

    majiang.SameColorNew = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var fengPai = [31,41,51,61,71,81,91];
        var handFengPaiCounts = 0;
        var pengFengPaiCounts = 0;
        var mingGangFengPaiCounts = 0;
        var anGangFengPaiCounts = 0;
        var chiFengPaiCounts = 0;
        var error = 0;//如果这个不为0 说明吃、碰、杠中不全是风牌
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) handFengPaiCounts++;
            else error++;
        }
        //检测 碰牌 杠牌  吃牌 是否都是风牌
        if(pl.mjpeng.length > 0)
        {
            for(var i=0;i<pl.mjpeng.length;i++)
            {
                if(fengPai.indexOf(pl.mjpeng[i]) != -1) pengFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjgang0.length >0){
            for(var i=0;i<pl.mjgang0.length;i++)
            {
                if(fengPai.indexOf(pl.mjgang0[i]) != -1) mingGangFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjgang1.length >0){
            for(var i=0;i<pl.mjgang1.length;i++)
            {
                if(fengPai.indexOf(pl.mjgang1[i]) != -1) anGangFengPaiCounts ++;
                else error++;
            }
        }
        if(pl.mjchi.length >0){
            for(var i=0;i<pl.mjchi.length;i++)
            {
                if(fengPai.indexOf(pl.mjchi[i]) != -1) chiFengPaiCounts ++;
                else error++;
            }
        }
        if(handFengPaiCounts >= pl.mjhand.length && pengFengPaiCounts * 3 >= pl.mjpeng.length && mingGangFengPaiCounts*4 >= pl.mjgang0.length && anGangFengPaiCounts*4 >= pl.mjgang1.length && chiFengPaiCounts >= pl.mjchi.length && error == 0 ) return true; //全是风牌 则是清一色
        var color = -1;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            for (var j = 0; j < cds.length; j++) {
                var cd = cds[j];
                if(majiang.isEqualHunCard(cd))
                {
                    continue;
                }
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }
    majiang.All3 = function (pl) {
        if (pl.mjchi.length > 0) return 0;
        var hnum = {};
        var mjhand = pl.mjhand;
        for (var i = 0; i < mjhand.length; i++) {
            var cd = mjhand[i];
            var cnum = hnum[cd];
            if (!cnum) cnum = 0;
            cnum++;
            hnum[cd] = cnum;
        }
        var smallNum = 0;
        var num2 = 0;
        for (var cd in hnum) {
            var cnum = hnum[cd];
            if (cnum != 3) num2++;
            else if (cd < 30) smallNum++;
        }
        if (num2 > 1) return 0;
        if (smallNum > 0) return 1;
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1];
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            for (var j = 0; j < cds.length; j++) {
                if (cds[j] < 30) return 1;
            }
        }
        return 2;
    }

    //判断手牌是否含有红中 或者 鬼
    majiang.isFindGuiForMjhand = function(mjhand)
    {
        if(myObject && myObject.tData.withZhong &&  mjhand.indexOf(71) != -1) return true;
        if(myObject && myObject.tData.fanGui && mjhand.indexOf(myObject.tData.gui) != -1) return true;
        return false;
    }

    majiang.isEqualHunCard = function(card)
    {
        if(myObject && myObject.tData.withZhong && card == 71) return true;
        if(myObject && myObject.tData.fanGui && myObject.tData.gui == card) return true;
        return false;
    }
    //癞子判断
    majiang.All3New = function(pl)
    {
        //有吃牌
        if(pl.mjchi.length > 0) return 0;

        var laiziNums = 0;
        var cds = pl.mjhand.slice();
        //1，2，3，4张牌的数量
        //var counts = [0,0,0,0];
        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        var count4 = 0;
        //计算各牌的数量
        var PAI = {};
        var tempCD = 0;
        for(var i = 0; i < cds.length; i++){
            tempCD = cds[i];
            if(majiang.isEqualHunCard(tempCD))
            {
                laiziNums++;
                continue;
            }
            if(PAI[tempCD]){
                PAI[tempCD]++;
            }else{
                PAI[tempCD] = 1;
            }
        }
        var tempCount = 0;
        for(var i in PAI){
            tempCount = PAI[i];
            //counts[tempCount]++;
            if(tempCount == 1) count1++;
            else if(tempCount == 2) count2++;
            else if(tempCount == 3) count3++;
            else if(tempCount == 4) count4++;
        }

        //碰碰胡判断
        if(count4 == 0){
            //条件判断
            var needNums = count1 * 2 + count2 - 1;
            if(needNums <= laiziNums){
                return 1;
            }
        }
        return 0;
    }
    majiang.CardCount = function (pl) {
        var rtn = (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length;
        if (pl.mjhand) rtn += pl.mjhand.length;
        return rtn;
    }
    majiang.NumOK = function (pl) {
        return pl.mjhand.length + (pl.mjpeng.length + pl.mjgang0.length + pl.mjgang1.length) * 3 + pl.mjchi.length == 14;
    }

    //鸡平胡
    //

    function TestRandomCards() {
        var cards = majiang.randomCards();
        var nums = {};
        for (var i = 0; i < cards.length; i++) {
            var cd = cards[i];
            if (!nums[cd]) nums[cd] = 1;
            else nums[cd] = nums[cd] + 1;
        }
        for (var c in nums) {
            if (nums[c] != 4) console.error("not 4");
        }
        if (Object.keys(nums).length != 34) console.error("not 34");
    }

    function TestHu() {
        var hu = [
            /*
             [19,5,8,16,2,23,11,6,31,13,26,1,28,81]
             ,[1,9,11,19,21,29,31,41,51,61,71,81,91,71]
             ,[1,1, 2,2, 3,3, 4,4, 5,5, 6,6, 7,7]
             ,[1,2,3,4,4]
             ,[1,1,2,2,3,3,4,4]
             ,[8,5,15,14,16,81,6,27,21,22,17,13,12,91]
             ,*/
            //[15,17,23,18,16,23,15,15]
            //[6,7,14,15,15,16,16,16,17,17,18,26,26]
            [6, 71, 71, 71, 71, 16, 16, 16, 17, 17, 18, 26, 26]
        ];
        for (var i = 0; i < hu.length; i++) {
            //console.info( majiang.canHu(false,hu[i])+"     "+hu[i]);
            console.info(majiang.canHu(false, hu[i], 2, false, true) + "     " + hu[i]);
        }
    }

    function TestcanGang1() {
        var gang = [
            [[1], [1, 2, 2, 2, 2]],
            [[1], [2, 3]],
        ];
        for (var i = 0; i < gang.length; i++)
            console.info(majiang.canGang1(gang[i][0], gang[i][1]));
    }

    function TestChi() {

        var chi = [

            [1, 2, 4, 5], 3

        ];
        console.info(majiang.canChi(chi, 3));
    }

    function TestCardType() {
        var tests =
            [
                //{name:"", mjpeng:[2,18],mjgang0:[],mjgang1:[],mjchi:[],mjhand:[4,4,4,5,5,5,5,6],mjdesc:[],baseWin:0 },
                {
                    name: "",
                    mjpeng: [],
                    mjgang0: [],
                    mjgang1: [],
                    mjchi: [],
                    mjhand: [2, 2, 2, 2, 4, 4, 5, 5, 11, 11, 12, 12, 13, 13],
                    mjdesc: [],
                    baseWin: 0
                }
                , {name: "", mjpeng: [], mjgang0: [], mjgang1: [], mjchi: [], mjhand: [], mjdesc: [], baseWin: 0}
                , {name: "", mjpeng: [], mjgang0: [], mjgang1: [], mjchi: [], mjhand: [], mjdesc: [], baseWin: 0}
                , {name: "", mjpeng: [], mjgang0: [], mjgang1: [], mjchi: [], mjhand: [], mjdesc: [], baseWin: 0}
                , {name: "", mjpeng: [], mjgang0: [], mjgang1: [], mjchi: [], mjhand: [], mjdesc: [], baseWin: 0}
            ];
        for (var i = 0; i < tests.length; i++) {
            var pl = tests[i];
            if (!majiang.NumOK(pl)) {
                pl.mjdesc.push("牌数不对");
                pl.huType = -1;
            }
            else pl.huType = majiang.canHu(false, pl.mjhand);
            if (pl.huType == 0) {
                pl.mjdesc.push("不胡");
            }
            else if (pl.huType > 0) {
                var is13 = pl.huType == 13;
                var allHand = majiang.OnlyHand(pl);
                var num2 = pl.huType == 7 ? 1 : 0;
                if (num2 == 1 && majiang.canGang1([], pl.mjhand).length > 0) num2 = 2;
                var num3 = (num2 > 0 || is13) ? 0 : majiang.All3(pl);
                var sameColor = is13 ? false : majiang.SameColor(pl);
                var baseWin = 1;
                if (allHand) //门清
                {
                    baseWin *= 4;
                    pl.mjdesc.push("门清");
                }
                if (sameColor)//清一色
                {
                    baseWin *= 8;
                    pl.mjdesc.push("清一色");
                }
                if (is13) {
                    baseWin *= 24;
                    pl.mjdesc.push("十三幺");
                }
                if (num2 > 0) {
                    baseWin *= num2 > 1 ? 16 : 8;
                    pl.mjdesc.push(num2 > 1 ? "龙七对" : "七巧对");
                }
                if (num3 > 0) {
                    baseWin *= num3 > 1 ? 16 : 8;
                    pl.mjdesc.push(num3 > 1 ? "风一色" : "大对碰");
                }
                if (pl.mjdesc.length == 0) pl.mjdesc.push("平胡");
                pl.baseWin = baseWin;
            }
            console.info(pl.name + " " + pl.mjdesc + "  " + pl.baseWin);
        }
    }

    function TestAll_3() {
        var pl = {
            mjhand: [21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 25, 25],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var result = majiang.All3(pl);
        var sameColor = majiang.SameColor(pl);
        var hunyise = majiang.HunYiSe(pl);
        var remind = "";
        if (result == 1) {
            remind = "碰碰胡";
            //清一色
            if (sameColor)//清一色
            {
                remind = "清碰"
            }
            //混一色
            if (hunyise) {
                remind = "混碰";
            }
            console.log(remind);
        }
    }

    function testHuWithHongZhong() {
        var pl = {
            mjhand: [21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 25, 25],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        majiang.isHuWithHongZhong(pl);

    }

    function testZiYiSe() {
        var pl = {
            mjhand: [11, 11, 11, 41, 41, 41, 51, 51, 51, 71, 71, 71, 81, 81],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        if (majiang.ziYiSe(pl)) console.log("字一色");
        else console.log("不是字一色");
    }

    function testHuHongZhong() {
        var pl = {
            mjhand: [21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 24, 25, 25],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        canHuZhong(false, pl.mjhand, 0, false);
    }

    function test4HongZhong() {
        var cards = [1, 2, 3, 4, 5, 6, 7, 8, 11, 12, 71, 71, 71];
        cd = 71;
        return is4HongZhong(cards, cd);
    }

    function testIsJiHu() {
        var pl = {
            mjhand: [21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24, 25, 25],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var isJiHu = majiang.isJiHu(pl, 24);
        if (isJiHu) {
            console.log("是机胡");
        } else {
            console.log("不是机胡");
        }
        var handDes = "";
        // for(var i=0;i<majiang.hand.length;i++)
        // {
        //     handDes = handDes + majiang.hand[i];
        // }
        // console.log("查看手牌：" + handDes);
        //  var huType = majiang.getHuType(pl);
        //  console.log("胡的类型："+huType);

    }

    function testIsQingYaoJiu() {
        var pl = {
            mjhand: [1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 7, 8, 9],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var num3 = majiang.All3(pl);
        if (num3 == 1 || num3 == 2) {
            var isQingYaoJiu = majiang.qingYaoJiu(pl);
            if (isQingYaoJiu) console.log("是清幺九");
            else console.log("不是清幺九");
        }
    }

    function testHuType() {
        console.log("testHuType=====");
        var pl = {
            mjhand: [1, 1, 1, 9, 9, 11, 11, 11, 19, 19, 19, 21, 21, 21],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        console.log("testHuType=====");
        var huType = majiang.getHuType(pl);
        console.log("testHuType=====" + huType);

    }

    function testDaSanYuan() {
        var pl = {
            mjhand: [91, 91, 91, 19, 19, 19, 21, 21],
            mjpeng: [],
            mjgang0: [71, 71, 71, 71],
            mjgang1: [81, 81, 81, 81],
            mjchi: [],
        }
        var isDaSanYuan = majiang.DaSanYuan(pl);
        if (isDaSanYuan) console.log("是大三元");
        else console.log("不是大三元");
    }

    function testGetHuTypeForShenZhen() {
        var pl = {
            mjhand: [1, 1, 1, 81, 81, 81, 71, 71, 71, 14, 14],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [61, 61, 61, 61],
            mjchi: [],
        }
        var huTy = majiang.getHuTypeForShenZhen(pl);
        console.log("=====" + huTy);


    }

    function testCanHuForGui() {
        var pl = {
            mjhand: [16, 1, 2, 3, 4, 14, 15, 91, 91, 91],
            mjpeng: [],
            mjgang0: [18],
            mjgang1: [],
            mjchi: [],
        }

        var isHu = majiang.canHu(false, pl.mjhand, 13, false, false, true, 16);
        if (isHu > 0) console.log("可以胡");
        else  console.log("不可以胡");
    }

    function testHunYiSe(){
        var pl = {
            mjhand: [71,31, 31, 31, 41, 41, 41, 51, 51, 51,61,61,61,81],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var isHunYiSe = majiang.HunYiSe(pl);
        if(isHunYiSe) console.log("是混一色");
        else console.log("不是混一色");
    }
    function testJiPingHuJiHu(){
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,23,23],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var isJiHu = majiang.pingHu(pl);
        if(isJiHu) console.log("平胡");
        else console.log("不是平胡");
    }

    function testForYiBaiZhang()
    {
        var pl = {
            mjhand: [71,71,71,2,2,2,3,3,3,4,4,4,5,5],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var desc = "";
        var huType = majiang.getHuTypeForYiBaiZhang(pl);
        switch (huType) {
            case majiang.YI_BAI_ZHANG.PINGHU:
                desc = "平胡";
                break;
            case majiang.YI_BAI_ZHANG.PENGPENGHU:
                desc = "碰碰胡";
                break;
            case majiang.YI_BAI_ZHANG.HUNYISE:
                desc = "混一色";
                break;
            case majiang.YI_BAI_ZHANG.QINGYISE:
                desc = "清一色";
                break;
            case majiang.YI_BAI_ZHANG.HUNPENG:
                desc = "混碰";
                break;
            case majiang.YI_BAI_ZHANG.QINGPENG:
                desc = "清碰";
                break;
            case majiang.YI_BAI_ZHANG.YAOJIU:
                desc = "幺九";
                break;
            case majiang.YI_BAI_ZHANG.ZIYISE:
                desc = "字一色";

                break;
            case majiang.YI_BAI_ZHANG.SHISANYAO:
                desc = "十三幺";
                break;
        }

        console.log("一百张 胡的类型："+desc);
    }

    function testForTest()
    {
        function nan (a,b,c)
        {
            console.log("c===="+c);
        }
        function xi (a,b,f,e)
        {
            console.log("e===="+e);
            console.log("f===="+f);
        }
        function dong (a,b,c,d,e,f)
        {
            console.log("e===="+e);
            if(a) nan(a,b,c);
            else if(b) xi(a,b,e,f);
        }
        dong(false,true,1,2,3,4);
    }
    function testCanhu()
    {
        //majiang.canHu = function (no7, cds, cd, with258, withZhong, fanGui, gui,gui4Hu);
        majiang.canHu(true,[1,2],5,false,false,false,0,true);
    }
    function testQingYaoJiu()
    {
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [1,1, 9, 9, 9],
            mjpeng: [29,81],
            mjgang0: [],
            mjgang1: [21],
            mjchi: [],
        }
        var isYaoJiu = majiang.qingYaoJiu(pl);
        if(isYaoJiu) console.log("是幺九");
        else console.log("不是幺九");

        var isYaoJiu = majiang.zaYaoJiu(pl);
        if(isYaoJiu) console.log("是混幺九");
        else console.log("不是混幺九");
    }
    //测试用 否则不可打开注释
    //var myObject = {};
    //myObject.tData = {};
    function testForYiBaiZhangLaiZi()
    {

        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [71,71,71,71, 2,2,5,5,5,6,6,6,9,9],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        myObject.tData.withZhong = true;
        var isHu = majiang.getHuTypeForYiBaiZhangNew(pl);
        if(isHu > 0) console.log(isHu);
        else console.log("无法胡牌");
    }
    function testForHunYiSeForGuangDong()
    {
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [2,3,4,5,5,5,6,7,8,9,41,41,41,9],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var hunyise = majiang.HunYiSe(pl);
        if(hunyise) console.log("混一色");

    }
    function testHuForShenZhenOfGui()
    {
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [71,1,1,2,3,4,5,6,6,7,7,8,31,31],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }
        var huType = majiang.getHuTypeForShenZhenNew(pl);
        console.log("==="+huType);
    }
    function testHuForLaiZi()
    {
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [71,71,14,15,17,18,22,23,26,26,27,28,29],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }

        //majiang.canHuNew(no7, cds, cd, with258, withZhong, fanGui, gui,gui4Hu)
        var isHu =  majiang.canHuNew(true, pl.mjhand, 19, false, true, false, 0,false);
        console.log("````````````````"+isHu);
    }
    function testForQingYaoJIu()
    {
        var pl = {
            // mjhand: [1,2, 3, 4, 5, 6, 7, 8, 9, 21,22,23,24,24],
            mjhand: [1,1,1,9,9,9,31,31,31,41,41,41,51,51],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }

        var isQingYaojiu = majiang.qingYaoJiu(pl);
        console.log("***"+isQingYaojiu);
    }
    function DoTest() {
        //testZiYiSe();
        //testHuWithHongZhong();
        //test4HongZhong();
        //TestAll_3();
        //TestCardType();
        //TestRandomCards();
        //testHuHongZhong();
        //TestHu();
        //TestcanGang1();
        //TestChi();
        //console.info(majiang.canGang0([2,3,4,3,3],3));
        //console.info(majiang.canPeng([2,3,4,3,3],3));
        //testIsJiHu();
        // testIsQingYaoJiu();
        //testHuType();
        //var tt = [1,3,4,5,5];
        //console.log(tt.indexOf(4));
        //testDaSanYuan();
        //testGetHuTypeForShenZhen();
        //testCanHuForGui();
        //testHunYiSe();
        //testJiPingHuJiHu();
        //testForYiBaiZhang();
        //testForTest();//测试函数多个参数 传递问题
        //testCanhu();
        //testQingYaoJiu();
        //testForYiBaiZhangLaiZi();
        //testForHunYiSeForGuangDong();
        //testHuForShenZhenOfGui();
        //testHuForLaiZi();
        //testForQingYaoJIu();
    }

    if (typeof(jsclient) != "undefined") {
        jsclient.majiang = majiang;
    }
    else {
        module.exports = majiang;
        //console.log(Math.pow(2,0) );
        DoTest();
    }


})();