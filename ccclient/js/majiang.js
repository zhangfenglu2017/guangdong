

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

    var mjcardsBaiBanGui = [
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

        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81

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

    //100涨麻将 白鬼
    var yibaizhangcardsBaiGui = [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        1, 2, 3, 4, 5, 6, 7, 8, 9,

        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,
        21, 22, 23, 24, 25, 26, 27, 28, 29,

        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81,
        31, 41, 51, 61, 71, 81
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

    //河源百搭牌型枚举
    majiang.HE_YUAN_BAI_DA_HUTYPE = {
        JIHU: 0,//鸡胡
        HUNYISE: 1,//混一色
        PENGPENGHU: 2,//碰碰胡
        QINGYISE: 3,//清一色
        HUNPENG: 4,//混碰
        DAGE: 5,//大哥
        YAOJIU: 6,//幺九（混、清幺九）
        ZIYISE: 7,//字一色
        QUANYAOJIU: 8,//全幺九
        SHISANYAO: 9,//十三幺
        QIXIAODUI:10,//七小对
    }

    //潮汕麻将 0平胡 1碰碰胡 2混一色 3清一色 4七小对 5混碰 6清碰 7混七小对 8豪华七小对 9幺九（别的玩法中的杂幺九）10 清七小对 11幺九七小对 12混豪华七对 13清豪华七对 14混幺九
    // 15十八罗汉 16双豪华七对 17 纯大字 18 纯幺九 19幺九豪华七小对 20纯大字七小对
    majiang.CHAO_SHAN_HUTYPE = {
        PINGHU: 0,//平胡
        PENGPENGHU: 1,//碰碰胡
        HUNYISE: 2,//混一色
        QINGYISE: 3,//清一色
        QIXIAODUI:4,//七小对
        HUNPENG: 5,//混碰
        QINGPENG: 6,//清碰
        HUNQIXIAODUI:7,//混七小对
        HAOHUAQIXIAODUI:8,//豪华七小对
        YAOJIU:9,//幺九 别的玩法中的杂幺九
        QINGQIXIAODUI:10,//清七小对
        YAOJIUQIXIAODUI:11,//幺九七小对
        HUNHAOHUAQIDUI:12,//混豪华七对
        QINGHAOHUAQIDUI:13,//清豪华七对
        HUNYAOJIU:14,//混幺九
        SHIBALUOHAN:15,//十八罗汉
        SHUANGHAOHUAQIDUI:16,//双豪华七对
        CHUNDAZI:17,//纯大字
        CHUNYAOJIU:18,//纯幺九
        YAOJIUHAOHUAQIXIAODUI:19,//幺九豪华七小对
        CHUNDAZIQIXIAODUI:20,//纯大字七小对
        SHISANYAO:21,//十三幺
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

    majiang.isHuWithBaiBan = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var noHongCount = 0;
        for (var i = 0; i < test.length; i++) {
            var cds = test[i];
            if (cds.indexOf(91) == -1) {
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

    majiang.deepCopy = function(p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                majiang.deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        return c;
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
        var shiSanYao = majiang.shiSanYaoNew(pi);
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
        if (shiSanYao) judge = majiang.HUI_ZHOU_HTYPE.SHISANYAO;
        if (sameColor) judge = majiang.HUI_ZHOU_HTYPE.QINGYISE;
        if (zaSe) judge = majiang.HUI_ZHOU_HTYPE.ZASE;
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
        var shiSanYao = majiang.shiSanYaoNew(pi);
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

    //河源百搭 0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺
    majiang.getHuTypeForHeYuanBaiDa = function(pi)
    {
        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3(pi);
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColor(pi);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSe(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pi);

        if (num3 == 1 || num3 == 2) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }
        return judge;
    }

    //河源百搭2017-2-13 无鬼情况 大胡无7对 鸡胡 7对可选  0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺 10七小对
    majiang.getHuTypeForHeYuanBaiDaNoGui = function(pi,isDaHu,canHu7)
    {
        var qiXiaoDui = false;
        if(isDaHu) canHu7 = false;
        if(canHu7 && pi.huType == 7 ) qiXiaoDui = true;
        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3(pi);
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColor(pi);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSe(pi);
        var shiSanYao = majiang.shiSanYao(pi);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pi);

        if (num3 == 1 || num3 == 2) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }

        if(qiXiaoDui)
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI;
        return judge;
    }

    //河源百搭 0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺
    majiang.getHuTypeForHeYuanBaiDaNew = function(pi)
    {
        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3New(pi);
        var hunyise = majiang.HunYiSeNew(pi);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColorNew(pi);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSeNew(pi);
        var shiSanYao = majiang.shiSanYaoNew(pi);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pi);

        if (num3 == 1 || num3 == 2) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }
        return judge;
    }

    //河源百搭2017-2-15 有鬼牌 百搭大胡无七小对 百搭鸡胡均是2分 0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺 10七小对
    majiang.getHuTypeForHeYuanBaiHaveGui = function(pi,isDaHu,canHu7)
    {
        var qiXiaoDui = false;
        if(isDaHu) canHu7 = false;
        if(canHu7 && (pi.huType == 8 || pi.huType == 7 )) qiXiaoDui = true; // 鸡胡
        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3New(pi);
        var hunyise = majiang.HunYiSeNew(pi);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColorNew(pi);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSeNew(pi);
        var shiSanYao = majiang.shiSanYaoNew(pi);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pi);

        if (num3 == 1 || num3 == 2) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }
        if(qiXiaoDui) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI;
        return judge;
    }

    //河源百搭 无将情况下 判断胡成的牌型 花调花
    majiang.getHuDataForDanDiaoOrHuaDiaoXinXuQiu = function(tData,pl)
    {
        var result = {huType:-1,type:0};
        if(majiang.canFindFlowerForMjhand(pl.mjhand))//必须有鬼
        {
            var orignHuType = majiang.getHuTypeForHeYuanBaiHaveGui(pl,tData.baidadahu,tData.canHu7);//最初能胡的牌型
            var rtn = []; //存放抛去2张鬼的牌型
            var noJiangPai = [];//没有将的牌型
            for (var i = 0; i < pl.mjhand.length; i++) {
                if (i != ( pl.mjhand.length - 1)) {
                    rtn.push(pl.mjhand[i]);
                }
            }

            for (var i = 0; i < rtn.length; i++) {
                if (rtn[i] >= 111) {
                    rtn.splice(rtn.indexOf(rtn[i]), 1);
                    break;
                }
            }
            for (var i = 0; i < rtn.length; i++) {
                noJiangPai.push(rtn[i]);
            }

            //固定了一对具体的将 （风牌） 还能胡 则可能 胡成花调花 不能胡肯定无法成花调花
            var pai = 31;
            var xunHunNum = 0;
            while (true) {
                xunHunNum++;
                if (rtn.indexOf(pai) != -1 && rtn.indexOf(91) == -1) {
                    pai++;
                }
                if (rtn.indexOf(pai) == -1) {
                    break;
                }
                if (xunHunNum >= 12) break;
            }

            rtn.push(pai);
            rtn.push(pai);
            var huType = majiang.canHu(!tData.canHu7, rtn, 0, false, false, false,tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui);
            if (huType <= 0) {
                result.huType =  orignHuType;
                result.type = 0;
                return result;
            }
            if (huType == 7 || huType == 8)
            {
                result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI;
                result.type = 2;
                return result;
            }

            //去掉将后判断胡的牌型
            var test = [];
            test.mjhand = noJiangPai;
            test.mjpeng = pl.mjpeng;
            test.mjgang0 = pl.mjgang0;
            test.mjgang1 = pl.mjgang1;
            test.winType = pl.winType;
            test.mjchi = pl.mjchi;

            var nowHuType = majiang.getHuTypeForHeYuanBaiHaveGuiForGuDingJiang(test,tData.baidadahu,tData.canHu7);

            if(nowHuType == orignHuType)
            {
                result.huType =  nowHuType;
                result.type = 2;
                return result;
            }
            else//
            {
                if(!tData.canJiHu && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU)//不可鸡胡 就算 能鸡胡单吊花 也不能单吊花 按之前牌型算
                {
                    result.huType = orignHuType;
                    result.type = 0;
                    return result;
                }
                result.huType = nowHuType;
                result.type = 2;
                return result;

            }
        }
    }

    //河源百搭 无将情况下 判断胡成的牌型 单吊花
    majiang.getHuDataForDanDiaoXinXuQiu = function(tData,pl)
    {
        var result = {huType:-1,type:0};
        if(majiang.canFindFlowerForMjhand(pl.mjhand))//必须有鬼
        {
            var orignHuType = majiang.getHuTypeForHeYuanBaiHaveGui(pl,tData.baidadahu,tData.canHu7);//最初能胡的牌型
            var rtn = []; //存放抛去2张将的牌型
            var noJiangPai = [];//没有将的牌型
            var lastPai = pl.mjhand[pl.mjhand.length - 1];
            for (var i = 0; i < pl.mjhand.length; i++) {
                if (i != ( pl.mjhand.length - 1)) {
                    rtn.push(pl.mjhand[i]);
                }
            }

            for (var i = 0; i < rtn.length; i++) {
                if (rtn[i] >= 111) {
                    rtn.splice(rtn.indexOf(rtn[i]), 1);
                    break;
                }
            }
            for (var i = 0; i < rtn.length; i++) {
                noJiangPai.push(rtn[i]);
            }

            //把2张 最后摸的牌做一次将 放回原牌丢里 看看是否能胡 不能胡肯定 不是单吊花  能胡的话 再换成别的将测试能不能胡
            var pai = lastPai;
            rtn.push(pai);
            rtn.push(pai);
            if(majiang.canHu(!tData.canHu7, rtn, 0, false, false,false, tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui) <= 0)
            {
                result.huType =  orignHuType;
                result.type = 0;
                return result;
            }

            rtn.splice(rtn.indexOf(pai), 1);
            rtn.splice(rtn.indexOf(pai), 1);

            //固定了一对具体的将 （风牌） 还能胡 则可能 胡成花调花 不能胡肯定无法成花调花
            pai = 31;
            var xunHunNum = 0;
            while (true) {
                xunHunNum++;
                if (rtn.indexOf(pai) != -1 && rtn.indexOf(91) == -1) {
                    pai++;
                }
                if (rtn.indexOf(pai) == -1) {
                    break;
                }
                if (xunHunNum >= 12) break;
            }

            rtn.push(pai);
            rtn.push(pai);
            var huType = majiang.canHu(!tData.canHu7, rtn, 0, false, false,false, tData.fanGui, tData.gui, tData.gui4Hu, tData.nextgui);
            if (huType <= 0) {
                result.huType =  orignHuType;
                result.type = 0;
                return result;
            }
            if (huType == 7 || huType == 8)
            {
                result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI;
                result.type = 1;
                return result;
            }

            //去掉将后判断胡的牌型
            var test = [];
            test.mjhand = noJiangPai;
            test.mjpeng = pl.mjpeng;
            test.mjgang0 = pl.mjgang0;
            test.mjgang1 = pl.mjgang1;
            test.winType = pl.winType;
            test.mjchi = pl.mjchi;

            //没有将 胡测牌型  需要在把2个最后摸的牌做将放回去
            var nowHuType = majiang.getHuTypeForHeYuanBaiHaveGuiForGuDingJiang(test,tData.baidadahu,tData.canHu7);

            var yiTojiu = false;
            var shiyiToshijiu =false;
            var ershiyiToershijiu = false;
            var sanshiyiTojiushiyi = false;
            for(var i= 0;i<test.mjhand.length;i++)
            {
                if(test.mjhand[i] >= 111) continue;
                if(test.mjhand[i] <= 9) yiTojiu = true;
                if(test.mjhand[i] >= 11 && test.mjhand[i] <= 19) shiyiToshijiu =true;
                if(test.mjhand[i] >= 21  && test.mjhand[i] <= 29) ershiyiToershijiu = true;
                if(test.mjhand[i] >= 31  && test.mjhand[i] <= 91) sanshiyiTojiushiyi = true;
            }

            for(var i= 0;i<test.mjpeng.length;i++)
            {
                if(test.mjpeng[i] <= 9) yiTojiu = true;
                if(test.mjpeng[i] >= 11 && test.mjpeng[i] <= 19) shiyiToshijiu =true;
                if(test.mjpeng[i] >= 21  && test.mjpeng[i] <= 29) ershiyiToershijiu = true;
                if(test.mjpeng[i] >= 31  && test.mjpeng[i] <= 91) sanshiyiTojiushiyi = true;
            }
            for(var i= 0;i<test.mjgang0.length;i++)
            {
                if(test.mjgang0[i] <= 9) yiTojiu = true;
                if(test.mjgang0[i] >= 11 && test.mjgang0[i] <= 19) shiyiToshijiu =true;
                if(test.mjgang0[i] >= 21  && test.mjgang0[i] <= 29) ershiyiToershijiu = true;
                if(test.mjgang0[i] >= 31  && test.mjgang0[i] <= 91) sanshiyiTojiushiyi = true;
            }
            for(var i= 0;i<test.mjgang1.length;i++)
            {
                if(test.mjgang1[i] <= 9) yiTojiu = true;
                if(test.mjgang1[i] >= 11 && test.mjgang1[i] <= 19) shiyiToshijiu =true;
                if(test.mjgang1[i] >= 21  && test.mjgang1[i] <= 29) ershiyiToershijiu = true;
                if(test.mjgang1[i] >= 31  && test.mjgang1[i] <= 91) sanshiyiTojiushiyi = true;
            }

            //鸡胡不考虑
            //混一色 考虑加入将 是否是鸡胡
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE )
            {
                if(((yiTojiu && lastPai > 9 ) || (shiyiToshijiu &&  (lastPai > 19 || lastPai < 11)) || (ershiyiToershijiu && (lastPai < 21))) && lastPai< 31)
                {
                    if(tData.canJiHu)
                    {
                        result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
                        result.type = 1;
                        return result;
                    }else{
                        result.huType =  orignHuType;
                        result.type = 0;
                        return result;
                    }
                }
            }
            //清一色 考虑加入将 是否是混一色
            //清一色 考虑加入将 是否是鸡胡
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE )
            {
                if(( (yiTojiu || shiyiToshijiu || ershiyiToershijiu)&& (lastPai >= 31 && lastPai <= 91)))
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
                    result.type = 1;
                    return result;
                }
                if( (yiTojiu && (lastPai >= 11 &&  lastPai <= 29 )) || (shiyiToshijiu && (lastPai <= 9 || (lastPai >= 21 && lastPai <= 29 ))) || (ershiyiToershijiu && (lastPai <= 19)) )
                {
                    if(tData.canJiHu)
                    {
                        result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
                        result.type = 1;
                        return result;
                    }else{
                        result.huType =  orignHuType;
                        result.type = 0;
                        return result;
                    }
                }
            }

            //碰碰胡不考虑
            //混碰 考虑加入将 是否是碰碰胡
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG)
            {
                if( (yiTojiu && (lastPai >= 11 &&  lastPai <= 29 )) || (shiyiToshijiu && (lastPai <= 9 || (lastPai >= 21 && lastPai <= 29 ))) || (ershiyiToershijiu && (lastPai <= 19))  )
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
                    result.type = 1;
                    return result;
                }
            }

            //大哥 考虑加入将 是否是碰碰胡
            //大哥 考虑加入将 是否是混碰
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE)
            {
                if((yiTojiu && (lastPai >= 11 &&  lastPai <= 29 )) || (shiyiToshijiu && (lastPai <= 9 || (lastPai >= 21 && lastPai <= 29 ))) || (ershiyiToershijiu && (lastPai <= 19))  )
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
                    result.type = 1;
                    return result;
                }
                if(( (yiTojiu || shiyiToshijiu || ershiyiToershijiu)&& (lastPai >= 31 && lastPai <= 91)))
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
                    result.type = 1;
                    return result;
                }

            }

            //字一色 考虑加入将 是否是幺九
            //字一色 考虑加入将 是否是混碰
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE)
            {
                if(sanshiyiTojiushiyi && (lastPai == 1 || lastPai == 9 ||  lastPai == 11 ||  lastPai == 19 || lastPai == 21 || lastPai == 29))
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
                    result.type = 1;
                    return result;
                }
                if(sanshiyiTojiushiyi && (lastPai <= 29))
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
                    result.type = 1;
                    return result;
                }
            }

            //幺九 考虑加入将 是否是混碰
            //幺九 考虑加入将 是否是碰碰胡
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU)
            {
                if((yiTojiu && !shiyiToshijiu && !ershiyiToershijiu && lastPai < 9 ) ||  (!yiTojiu && shiyiToshijiu && !ershiyiToershijiu && lastPai > 11 && lastPai < 19 )  ||  (!yiTojiu && !shiyiToshijiu && ershiyiToershijiu && lastPai > 21 && lastPai < 29 )   ) //必须都是一色和风
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
                    result.type = 1;
                    return result;
                }
                if(lastPai != 1 && lastPai != 9 && lastPai != 11 && lastPai != 19 && lastPai != 21 && lastPai != 29 && lastPai < 31)
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
                    result.type = 1;
                    return result;
                }
            }
            //全幺九 考虑加入将 是否是 幺九
            //全幺九 考虑加入将 是否是 碰碰胡
            if(nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU)
            {
                if(lastPai >= 31 && lastPai <= 91)
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
                    result.type = 1;
                    return result;
                }
                if(lastPai != 1 && lastPai != 9 && lastPai != 11 && lastPai != 19 && lastPai != 21 && lastPai != 29 && lastPai < 31)
                {
                    result.huType =  majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
                    result.type = 1;
                    return result;
                }
            }

            if(nowHuType == orignHuType)
            {
                result.huType =  nowHuType;
                result.type = 1;
                return result;
            }
            else//
            {
                if(!tData.canJiHu && nowHuType == majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU)//不可鸡胡 就算 能鸡胡单吊花 也不能单吊花 按之前牌型算
                {
                    result.huType = orignHuType;
                    result.type = 0;
                    return result;
                }
                result.huType = nowHuType;
                result.type = 1;
                return result;

            }
        }
    }

    //河源百搭2017-2-18花调花 固定一对将后胡的牌型 有鬼牌 百搭大胡无七小对 百搭鸡胡均是2分 0鸡胡 1混一色 2碰碰胡 3清一色  4混碰  5大哥 6幺九 7字一色 8全幺九 9十三幺 10七小对
    majiang.getHuTypeForHeYuanBaiHaveGuiForGuDingJiang = function(pl,isDaHu,canHu7)
    {
        var qiXiaoDui = false;
        if(isDaHu) canHu7 = false;
        if(canHu7 && (pl.huType == 8 || pl.huType == 7 )) qiXiaoDui = true; // 鸡胡

        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3NewNoJiang(pl);
        var hunyise = majiang.HunYiSeNewNoJiang(pl);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColorNew(pl);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pl);
        var qingyaojiu = majiang.qingYaoJiu(pl);
        var ziYiSe = majiang.ziYiSeNew(pl);
        var shiSanYao = majiang.shiSanYaoNew(pl);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pl);

        if (num3 == 1) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }
        if(qiXiaoDui) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QIXIAODUI;
        return judge;
    }

    //潮汕麻将 0平胡 1碰碰胡 2混一色 3清一色 4七小对 5混碰 6清碰 7混七小对 8豪华七小对 9幺九（别的玩法中的杂幺九）10 清七小对 11幺九七小对 12混豪华七对 13清豪华七对 14混幺九
    // 15十八罗汉 16双豪华七对 17 纯大字 18 纯幺九 19幺九豪华七小对 20纯大字七小对
    //服务器端进行的判断
    majiang.getHuTypeForChaoShan = function(pi)
    {
        var qiXiaoDui = false;
        var haoHuaQiDui = false;
        var chunDaZi = false;
        var judge = majiang.CHAO_SHAN_HUTYPE.PINGHU;//0
        var num3 = majiang.All3(pi);
        if(pi.huType == 7 ) qiXiaoDui = true;
        var hunyise = majiang.HunYiSe(pi);
        if (hunyise) judge = majiang.CHAO_SHAN_HUTYPE.HUNYISE;//2
        var sameColor = majiang.SameColor(pi);
        if (sameColor) judge = majiang.CHAO_SHAN_HUTYPE.QINGYISE;//3
        if(qiXiaoDui) judge = majiang.CHAO_SHAN_HUTYPE.QIXIAODUI;//4
        if (num3 == 1 || num3 == 2) {
            judge = majiang.CHAO_SHAN_HUTYPE.PENGPENGHU;//1
            if (hunyise) judge = majiang.CHAO_SHAN_HUTYPE.HUNPENG;//5
            if (sameColor) judge = majiang.CHAO_SHAN_HUTYPE.QINGPENG;//6
        }
        if (qiXiaoDui && hunyise) judge = majiang.CHAO_SHAN_HUTYPE.HUNQIXIAODUI;//7
        if(qiXiaoDui && majiang.canGang1([], pi.mjhand, []).length > 0) {
            haoHuaQiDui = true;
        }
        if(haoHuaQiDui) judge = majiang.CHAO_SHAN_HUTYPE.HAOHUAQIXIAODUI;//8
        var yaoJiu = majiang.zaYaoJiu(pi);
        if(yaoJiu) judge = majiang.CHAO_SHAN_HUTYPE.YAOJIU;//9
        if (qiXiaoDui && sameColor) judge = majiang.CHAO_SHAN_HUTYPE.QINGQIXIAODUI;//10
        var hunYaoJiu = majiang.qingYaoJiu(pi);
        var chunYaoJiu = majiang.quanYaoJiu(pi);
        if(qiXiaoDui && (hunYaoJiu || yaoJiu || chunYaoJiu)) judge = majiang.CHAO_SHAN_HUTYPE.YAOJIUQIXIAODUI;//11
        if(haoHuaQiDui && hunyise) judge = majiang.CHAO_SHAN_HUTYPE.HUNHAOHUAQIDUI;//12
        if(haoHuaQiDui && sameColor ) judge = majiang.CHAO_SHAN_HUTYPE.QINGHAOHUAQIDUI;//13
        if(hunYaoJiu) judge = majiang.CHAO_SHAN_HUTYPE.HUNYAOJIU;//14
        if(majiang.shiBaLuoHan(pi)) judge = majiang.CHAO_SHAN_HUTYPE.SHIBALUOHAN;//15
        if(haoHuaQiDui && majiang.canGang1([], pi.mjhand, []).length == 2) judge = majiang.CHAO_SHAN_HUTYPE.SHUANGHAOHUAQIDUI;//16
        if(num3 == 2) chunDaZi = true;
        if(chunDaZi)  judge = majiang.CHAO_SHAN_HUTYPE.CHUNDAZI;//17
        if(chunYaoJiu) judge = majiang.CHAO_SHAN_HUTYPE.CHUNYAOJIU; //18
        if(haoHuaQiDui&& (hunYaoJiu || yaoJiu || chunYaoJiu)) judge = majiang.CHAO_SHAN_HUTYPE.YAOJIUHAOHUAQIXIAODUI;//19
        if(qiXiaoDui && chunDaZi ) judge = majiang.CHAO_SHAN_HUTYPE.CHUNDAZIQIXIAODUI;//20
        if(majiang.shiSanYao(pi)) judge = majiang.CHAO_SHAN_HUTYPE.SHISANYAO;//21
        //if(pi.huType == 13) judge = majiang.CHAO_SHAN_HUTYPE.SHISANYAO;//21
        return judge;
    }

    ////潮汕 预判胡牌类型
    //majiang.prejudgeHuTypeForChaoShan(pi,cd)
    //{
    //
    //}

    //去重 第一个数组参数去重 及 当第二个数组参数 有数据的时候 第二个数组参数 会将第一个数组里的数去除掉
    majiang.getQuChongCards = function(cardsArray,cds)
    {
        var rtn = [];
        var rtn1 = [];
        var rtn2 = [];
        var rtn3 = [];//需要删除的元素
        for(var i=0;i<cardsArray.length;i++)
        {
            rtn.push(cardsArray[i]);
        }
        rtn.sort(function (a, b) {
            return a - b
        });
        for(var i=0;i<rtn.length;i++)
        {
            if(rtn[i] != rtn[i+1]) rtn1.push(rtn[i]);
        }
        for(var i=0;i<rtn1.length;i++)
        {
            rtn3.push(rtn1[i]);
        }
        if(cds && cds.length > 0)
        {
            for(var i=0;i<cds.length;i++)
            {
                rtn1.push(cds[i]);
            }
            rtn1.sort(function (a, b) {
                return a - b
            });

            for(var i=0;i<rtn1.length;i++)
            {
                if(rtn1[i] != rtn1[i+1]) rtn2.push(rtn1[i]);
            }

            for(var d = 0;d< rtn3.length; d++ ) ////要去掉的值
            {
                for(var q = 0;q<rtn2.length;q++) ////该从这里去掉
                {
                    if(rtn2[q] == rtn3[d])
                    {
                        rtn2.splice(q,1);
                        q = q - 1;
                    }
                }
            }

            return rtn2;
        }
        else{
            return rtn1;
        }

    }

    //潮汕 十八罗汉
    majiang.shiBaLuoHan = function(pi)
    {
        var mingGangCounts = pi.mjgang0.length;
        var anGangCounts = pi.mjgang1.length;
        if(mingGangCounts + anGangCounts == 4) return true;
        return false;
    }

    //河源百搭  单吊才用
    majiang.getHuTypeForHeYuanBaiDaNewForDanDiao = function(pi)
    {
        var judge = majiang.HE_YUAN_BAI_DA_HUTYPE.JIHU;
        var num3 = majiang.All3NewDanDiao(pi);
        var hunyise = majiang.HunYiSeNew(pi);
        if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNYISE;
        var sameColor = majiang.SameColorNew(pi);
        if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QINGYISE;
        var zaYaoJiu = majiang.zaYaoJiu(pi);
        var qingyaojiu = majiang.qingYaoJiu(pi);
        var ziYiSe = majiang.ziYiSeNew(pi);
        var shiSanYao = majiang.shiSanYaoNew(pi);
        if (shiSanYao) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.SHISANYAO;
        var quanYaoJiu = majiang.quanYaoJiu(pi);

        if (num3 == 1 || num3 == 2) {
            judge = majiang.HE_YUAN_BAI_DA_HUTYPE.PENGPENGHU;
            if (hunyise) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.HUNPENG;
            if (sameColor) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.DAGE;
            if (ziYiSe) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.ZIYISE;
            if(zaYaoJiu || qingyaojiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.YAOJIU;
            if (quanYaoJiu) judge = majiang.HE_YUAN_BAI_DA_HUTYPE.QUANYAOJIU;
        }
        return judge;
    }

    //河源百搭 单调花
    majiang.isDanDiaoHuaFor13 = function(td,pl,is13)
    {
        var cds = [];
        var paixu = [];

        for(var i=0;i<pl.mjhand.length;i++)
        {
            cds.push(pl.mjhand[i]);
            paixu.push(pl.mjhand[i]);
        }

        paixu.sort(function (a, b) {
            return a - b
        });
        for(var k =0;k<paixu.length;k++)
        {
            if(paixu[k] < 111 && paixu[k] == paixu[k+1]) return false;
        }

        cds.splice(cds.indexOf(cds.length), 1);
        if(is13)
        {
            for (var i = 0; i < cds.length; i++) {
                if( cds[i] < 111 &&  cds[i] == pl.mjhand[pl.mjhand.length-1]) return false;
            }
        }
        return true;
    }

    //河源百搭 花调花
    majiang.isHuaDiaoHuaFor13 = function(td,pl,is13)
    {
        if(!majiang.canFindFlowerForMjhand(pl.mjhand[pl.mjhand.length-1]) ) return false;
        for(var k =0;k<pl.mjhand.length;k++)
        {
            if(pl.mjhand[k] < 111 && pl.mjhand[k] == pl.mjhand[k+1]) return false;
        }
        if(majiang.isDanDiaoHuaFor13(td,pl,is13)) return true;
    }

    //河源百搭 花调花
    majiang.isHuaDiaoHua = function(td,pl)
    {
        if(!majiang.canFindFlowerForMjhand(pl.mjhand[pl.mjhand.length-1]) ) return false;
        // if(majiang.isDanDiaoHua(td,pl)) return true;
        return true;
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

    //听牌 客户端
    majiang.canTingHu = function(mjhand)
    {
        Array.prototype.insert = function (index, item) {
            this.splice(index, 0, item);
        };
        var data = {};
        var withZhong = jsclient.data.sData.tData.withZhong;
        var withBai = jsclient.data.sData.tData.withBai;
        var gui = jsclient.data.sData.tData.gui;
        var fanGui = jsclient.data.sData.tData.fanGui;
        var twogui = jsclient.data.sData.tData.twogui;
        var canHu7 = jsclient.data.sData.tData.canHu7;
        var gui4Hu = jsclient.data.sData.tData.gui4Hu;
        var nextgui = jsclient.data.sData.tData.nextgui;

        var virtualPl = {};
        virtualPl.mjhand = [];
        for(var i=0;i<mjhand.length;i++)
        {
            virtualPl.mjhand.push(mjhand[i]);
            data[mjhand[i]+""] = [];
        }
        var canTingPai = [1,2,3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,29,31,41,51,61,71,81,91];
        majiang.isClient = true;
        var deletHunZiIndexForCanTingPai = 0;
        var searchHunZiNum = 0;
        for(var i=0;i<canTingPai.length;i++)
        {
            if(majiang.isEqualHunCardForTingPai(canTingPai[i],withZhong,withBai,fanGui,twogui,nextgui,gui))
            {
                searchHunZiNum++;
                deletHunZiIndexForCanTingPai = i;
            }
        }
        for(var i=0;i<searchHunZiNum;i++)
        {
            canTingPai.splice(canTingPai.indexOf(canTingPai[(deletHunZiIndexForCanTingPai-searchHunZiNum+1)]), 1);
        }

        for(var i=0;i<virtualPl.mjhand.length;i++)
        {
            if(virtualPl.mjhand[i] == virtualPl.mjhand[i+1]) continue;
            if(majiang.isEqualHunCardForTingPai(virtualPl.mjhand[i],withZhong,withBai,fanGui,twogui,nextgui,gui))
                continue;
            var deletPai = virtualPl.mjhand[i];
            virtualPl.mjhand.splice(i,1);
            for(var j=0;j<canTingPai.length;j++)
            {
                if( majiang.canHu(!canHu7, virtualPl.mjhand, canTingPai[j], false, withZhong,withBai,fanGui,gui,gui4Hu,nextgui) >0 )
                {
                    if(data[mjhand[i] + ""].indexOf(canTingPai[j]) == -1)data[mjhand[i]+""].push(canTingPai[j]);
                }
            }
            virtualPl.mjhand.insert(i,deletPai);
        }
        return data;
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
        var shisanyao = majiang.shiSanYaoNew(pi);
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
    //13幺
    majiang.shiSanYaoNew = function(pi)
    {
        if(pi.mjhand.length != 14) return false;
        var other = [2,3,4,5,6,7,8,12,13,14,15,16,17,18,22,23,24,25,26,27,28];
        var rtn = []; //除去鬼牌 保存构成 13 幺的部分牌
        for(var i=0;i<pi.mjhand.length;i++)
        {
            if(majiang.isEqualHunCard(pi.mjhand[i])) //去掉鬼牌
            {
                continue;
            }
            for(var j=0;j<other.length;j++) //除了13幺还有其他牌
            {
                if(pi.mjhand.indexOf(other[j]) != -1 && !majiang.isEqualHunCard(other[j]) ) return false;
            }
            rtn.push(pi.mjhand[i]);
        }
        var yiTiaoCounts = 0;
        var jiuTiaoCounts = 0;
        var yiWanCounts = 0;
        var jiuWanCounts = 0;
        var yiTongCounts = 0;
        var jiuTongCounts = 0;
        var dongCounts = 0;
        var nanCounts = 0;
        var xiCounts = 0;
        var beiCounts = 0;
        var zhongCounts = 0;
        var faCounts = 0;
        var baiCounts = 0;
        for(var i=0;i<rtn.length;i++)
        {
            if(rtn[i] == 1 && !majiang.isEqualHunCard(1)) yiTiaoCounts++;
            if(rtn[i] == 9 && !majiang.isEqualHunCard(9)) jiuTiaoCounts ++;
            if(rtn[i] == 11 && !majiang.isEqualHunCard(11)) yiWanCounts ++;
            if(rtn[i] == 19 && !majiang.isEqualHunCard(19)) jiuWanCounts ++;
            if(rtn[i] == 21 && !majiang.isEqualHunCard(21)) yiTongCounts++;
            if(rtn[i] == 29 && !majiang.isEqualHunCard(29)) jiuTongCounts ++;
            if(rtn[i] == 31 && !majiang.isEqualHunCard(31)) dongCounts ++;
            if(rtn[i] == 41 && !majiang.isEqualHunCard(41)) nanCounts ++;
            if(rtn[i] == 51 && !majiang.isEqualHunCard(51)) xiCounts ++;
            if(rtn[i] == 61 && !majiang.isEqualHunCard(61)) beiCounts ++;
            if(rtn[i] == 71 && !majiang.isEqualHunCard(71)) zhongCounts ++;
            if(rtn[i] == 81 && !majiang.isEqualHunCard(81)) faCounts ++;
            if(rtn[i] == 91 && !majiang.isEqualHunCard(91)) baiCounts ++;
        }
        if(yiTiaoCounts > 2 || jiuTiaoCounts > 2 || yiWanCounts > 2 || jiuWanCounts > 2 || yiTongCounts > 2 || jiuTongCounts > 2 || dongCounts > 2 || nanCounts > 2 || xiCounts > 2 || beiCounts > 2 || zhongCounts > 2 || faCounts > 2 || baiCounts > 2) return false;
        //1条
        if(yiTiaoCounts >= 2 && (jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9条
        if(jiuTiaoCounts >= 2 && (yiTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //1万
        if(yiWanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9万
        if(jiuWanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //1桶
        if(yiTongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9桶
        if(jiuTongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //东
        if(dongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //南
        if(nanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //西
        if(xiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //北
        if(beiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //中
        if(zhongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //发
        if(faCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || baiCounts >= 2 ) ) return false;
        //白
        if(baiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 ) ) return false;

        return true;
    }

    //13幺 canhu法
    majiang.canHuForShiSanYaoNew = function(cardss)
    {
        if(cardss.length != 14) return false;
        var other = [2,3,4,5,6,7,8,12,13,14,15,16,17,18,22,23,24,25,26,27,28];
        var rtn = []; //除去鬼牌 保存构成 13 幺的部分牌
        for(var i=0;i<cardss.length;i++)
        {
            if(majiang.isEqualHunCard(cardss[i])) //去掉鬼牌
            {
                continue;
            }
            for(var j=0;j<other.length;j++) //除了13幺还有其他牌
            {
                if(cardss.indexOf(other[j]) != -1 && !majiang.isEqualHunCard(other[j]) ) return false;
            }
            rtn.push(cardss[i]);
        }
        var yiTiaoCounts = 0;
        var jiuTiaoCounts = 0;
        var yiWanCounts = 0;
        var jiuWanCounts = 0;
        var yiTongCounts = 0;
        var jiuTongCounts = 0;
        var dongCounts = 0;
        var nanCounts = 0;
        var xiCounts = 0;
        var beiCounts = 0;
        var zhongCounts = 0;
        var faCounts = 0;
        var baiCounts = 0;
        for(var i=0;i<rtn.length;i++)
        {
            if(rtn[i] == 1 && !majiang.isEqualHunCard(1)) yiTiaoCounts++;
            if(rtn[i] == 9 && !majiang.isEqualHunCard(9)) jiuTiaoCounts ++;
            if(rtn[i] == 11 && !majiang.isEqualHunCard(11)) yiWanCounts ++;
            if(rtn[i] == 19 && !majiang.isEqualHunCard(19)) jiuWanCounts ++;
            if(rtn[i] == 21 && !majiang.isEqualHunCard(21)) yiTongCounts++;
            if(rtn[i] == 29 && !majiang.isEqualHunCard(29)) jiuTongCounts ++;
            if(rtn[i] == 31 && !majiang.isEqualHunCard(31)) dongCounts ++;
            if(rtn[i] == 41 && !majiang.isEqualHunCard(41)) nanCounts ++;
            if(rtn[i] == 51 && !majiang.isEqualHunCard(51)) xiCounts ++;
            if(rtn[i] == 61 && !majiang.isEqualHunCard(61)) beiCounts ++;
            if(rtn[i] == 71 && !majiang.isEqualHunCard(71)) zhongCounts ++;
            if(rtn[i] == 81 && !majiang.isEqualHunCard(81)) faCounts ++;
            if(rtn[i] == 91 && !majiang.isEqualHunCard(91)) baiCounts ++;
        }
        if(yiTiaoCounts > 2 || jiuTiaoCounts > 2 || yiWanCounts > 2 || jiuWanCounts > 2 || yiTongCounts > 2 || jiuTongCounts > 2 || dongCounts > 2 || nanCounts > 2 || xiCounts > 2 || beiCounts > 2 || zhongCounts > 2 || faCounts > 2 || baiCounts > 2) return false;
        //1条
        if(yiTiaoCounts >= 2 && (jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9条
        if(jiuTiaoCounts >= 2 && (yiTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //1万
        if(yiWanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9万
        if(jiuWanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //1桶
        if(yiTongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //9桶
        if(jiuTongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || dongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //东
        if(dongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || nanCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //南
        if(nanCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //西
        if(xiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //北
        if(beiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //中
        if(zhongCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || faCounts >= 2 || baiCounts >= 2 ) ) return false;
        //发
        if(faCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || baiCounts >= 2 ) ) return false;
        //白
        if(baiCounts >= 2 && (yiTiaoCounts >= 2 || jiuTiaoCounts >= 2 || yiWanCounts >= 2 || jiuWanCounts >= 2 || yiTongCounts >= 2 || jiuTongCounts >= 2 || dongCounts >= 2 || nanCounts  >= 2 || xiCounts >= 2 || beiCounts >= 2 || zhongCounts >= 2 || faCounts >= 2 ) ) return false;

        return true;
    }
    //惠州预先判断胡的类型 不影响手牌
    majiang.prejudgeHuType = function (pi, cd) {
        //if (pi.mjhand.length == 14) return majiang.HUI_ZHOU_HTYPE.ERROR;
        //var huType = canHuNoZhong(false,pi.mjhand,cd,false);
        //if(huType == 13) return majiang.HUI_ZHOU_HTYPE.SHISANYAO; //先判断13幺  暂时没有7对 有的话也要这样判断
        if(cd && cd != 0) pi.mjhand.push(cd);//不是13幺的情况  假设先push进 打出的那张牌
        var huType = majiang.getHuType(pi);
        if(cd && cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);
        return huType;
    }

    //深圳 预测 胡类型
    majiang.prejudgeHuTypeForShenZhen = function (pi, cd) {
        //if (pi.mjhand.length == 14) return majiang.HUI_ZHOU_HTYPE.ERROR;
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
        if(cd && cd != 0) pi.mjhand.push(cd);// 假设先push进 打出的那张牌
        var huType = majiang.getHuTypeForShenZhen(pi);
        if(cd && cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);

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
        if(cd && cd != 0) pi.mjhand.push(cd);// 假设先push进 打出的那张牌
        var huType = majiang.getHuTypeForJiPingHu(pi);
        if(cd && cd != 0) pi.mjhand.splice(pi.mjhand.indexOf(cd), 1);
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
        console.log("==========================1");
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

        //收集 手牌 碰牌 杠牌 所有的 19
        var all1TO9 = [];

        for (var z = 0; z < noFengCds.length; z++) {
            var cdss = noFengCds[z];
            for (var k = 0; k <cdss.length; k++) {
                if(cdss[k] == 1 || cdss[k] == 9 || cdss[k] == 11 || cdss[k] == 19 || cdss[k] == 21 || cdss[k] == 29)
                {
                    all1TO9.push(cdss[k]);
                }
            }
            //if((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
            //if((cds.indexOf(11) != -1 || cds.indexOf(19) != -1) && (cds.indexOf(1) != -1 || cds.indexOf(9) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
            //if((cds.indexOf(21) != -1 || cds.indexOf(29) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(1) != -1 || cds.indexOf(9) != -1)) return false;
            //if ((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
            //if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  (cds.indexOf(19) != -1 ||  cds.indexOf(11) != -1) && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
            //if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && (cds.indexOf(21) != -1 || cds.indexOf(29)) != -1  ) return true;
        }
        if((all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) && (all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1 || all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1)) return false;
        if((all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1) && (all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1 || all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1) ) return false;
        if((all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1) && (all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1 || all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) ) return false;
        if((all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) && all1TO9.indexOf(11) == -1 && all1TO9.indexOf(19) == -1 && all1TO9.indexOf(21) == -1 && all1TO9.indexOf(29) == -1 ) return true;
        if((all1TO9.indexOf(1) == -1 && all1TO9.indexOf(9) == -1) && (all1TO9.indexOf(11) != -1 ||  all1TO9.indexOf(19) != -1) && all1TO9.indexOf(21) == -1 && all1TO9.indexOf(29) == -1 ) return true;
        if (all1TO9.indexOf(1) == -1 && all1TO9.indexOf(9) == -1 &&  all1TO9.indexOf(19) == -1 &&  all1TO9.indexOf(11) == -1 && (all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29)) != -1  ) return true;

        return false;
    }

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

    ////做牌推到胡清幺九 鬼
    //majiang.qingYaoJiuNew = function (pi) {
    //    var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
    //    var errorCount = 0;
    //
    //    for (var i = 0; i < test.length; i++) {
    //        var cds = test[i];
    //        if (( (cds.indexOf(31) == -1 && !majiang.isEqualHunCard(31) ) && (cds.indexOf(41) == -1 && !majiang.isEqualHunCard(41) )&& (cds.indexOf(51) == -1 && !majiang.isEqualHunCard(51) ) && (cds.indexOf(61) == -1 && !majiang.isEqualHunCard(61) ) && (cds.indexOf(71) == -1 && !majiang.isEqualHunCard(41) )&& (cds.indexOf(81) == -1 && !majiang.isEqualHunCard(81) ) && (cds.indexOf(91) == -1) && !majiang.isEqualHunCard(91) )) {
    //            errorCount++;
    //        } else {
    //            //console.log("含风");
    //        }
    //    }
    //    if (errorCount >= test.length) //test 中不含风
    //    {
    //        return false;
    //    }
    //    console.log("==========================1");
    //    var noFengCds = [];
    //    for (var i = 0; i < test.length; i++) noFengCds.push(test[i]);
    //    //含风 去掉风
    //    for (var i = 0; i < noFengCds.length; i++) {
    //        noFengCds[i] = [];
    //        for (var k = 0; k < test[i].length; k++) {
    //            if (test[i][k] < 31 && !majiang.isEqualHunCard(test[i][k])) {
    //                noFengCds[i].push(test[i][k]);
    //            }
    //        }
    //    }
    //    //判断 除 1 9 还有无其他杂牌
    //    var disCard = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28];
    //    for (var z = 0; z < noFengCds.length; z++) {
    //        console.log("====="+z);
    //        var cds = noFengCds[z];
    //        //后加测试
    //        for(var q=0;q<cds.length;q++){
    //            console.log("------"+cds[q]);
    //        }
    //        for (var q = 0; q < disCard.length; q++) {
    //            if (cds.indexOf(disCard[q]) != -1) return false;
    //        }
    //    }
    //
    //    //收集 手牌 碰牌 杠牌 所有的 19
    //    var all1TO9 = [];
    //
    //    for (var z = 0; z < noFengCds.length; z++) {
    //        var cdss = noFengCds[z];
    //        for (var k = 0; k <cdss.length; k++) {
    //            if(cdss[k] == 1 || cdss[k] == 9 || cdss[k] == 11 || cdss[k] == 19 || cdss[k] == 21 || cdss[k] == 29)
    //            {
    //                all1TO9.push(cdss[k]);
    //            }
    //        }
    //        //if((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
    //        //if((cds.indexOf(11) != -1 || cds.indexOf(19) != -1) && (cds.indexOf(1) != -1 || cds.indexOf(9) != -1 || cds.indexOf(21) != -1 || cds.indexOf(29) != -1)) return false;
    //        //if((cds.indexOf(21) != -1 || cds.indexOf(29) != -1) && (cds.indexOf(11) != -1 || cds.indexOf(19) != -1 || cds.indexOf(1) != -1 || cds.indexOf(9) != -1)) return false;
    //        //if ((cds.indexOf(1) != -1 || cds.indexOf(9) != -1) &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
    //        //if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  (cds.indexOf(19) != -1 ||  cds.indexOf(11) != -1) && cds.indexOf(21) == -1 && cds.indexOf(29) == -1  ) return true;
    //        //if (cds.indexOf(1) == -1 && cds.indexOf(9) == -1 &&  cds.indexOf(19) == -1 &&  cds.indexOf(11) == -1 && (cds.indexOf(21) != -1 || cds.indexOf(29)) != -1  ) return true;
    //    }
    //    if((all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) && (all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1 || all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1)) return false;
    //    if((all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1) && (all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1 || all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1) ) return false;
    //    if((all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29) != -1) && (all1TO9.indexOf(11) != -1 || all1TO9.indexOf(19) != -1 || all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) ) return false;
    //    if((all1TO9.indexOf(1) != -1 || all1TO9.indexOf(9) != -1) && all1TO9.indexOf(11) == -1 && all1TO9.indexOf(19) == -1 && all1TO9.indexOf(21) == -1 && all1TO9.indexOf(29) == -1 ) return true;
    //    if((all1TO9.indexOf(1) == -1 && all1TO9.indexOf(9) == -1) && (all1TO9.indexOf(11) != -1 ||  all1TO9.indexOf(19) != -1) && all1TO9.indexOf(21) == -1 && all1TO9.indexOf(29) == -1 ) return true;
    //    if (all1TO9.indexOf(1) == -1 && all1TO9.indexOf(9) == -1 &&  all1TO9.indexOf(19) == -1 &&  all1TO9.indexOf(11) == -1 && (all1TO9.indexOf(21) != -1 || all1TO9.indexOf(29)) != -1  ) return true;
    //
    //    return false;
    //}
    ////做牌推到胡杂幺九 鬼
    //majiang.zaYaoJiuNew = function (pi) {
    //    var test = [pi.mjhand, pi.mjpeng, pi.mjgang0, pi.mjgang1, pi.mjchi];
    //    var errorCount = 0;
    //
    //    for (var i = 0; i < test.length; i++) {
    //        var cds = test[i];
    //        if (( (cds.indexOf(31) == -1 && !majiang.isEqualHunCard(31) ) && (cds.indexOf(41) == -1 && !majiang.isEqualHunCard(41) )&& (cds.indexOf(51) == -1 && !majiang.isEqualHunCard(51) ) && (cds.indexOf(61) == -1 && !majiang.isEqualHunCard(61) ) && (cds.indexOf(71) == -1 && !majiang.isEqualHunCard(41) )&& (cds.indexOf(81) == -1 && !majiang.isEqualHunCard(81) ) && (cds.indexOf(91) == -1) && !majiang.isEqualHunCard(91) )) {
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
    //            if (test[i][k] < 31 && !majiang.isEqualHunCard(test[i][k])) {
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
    //        //if (cds.indexOf(1) != -1 || cds.indexOf(19) != -1 ||  cds.indexOf(29) != -1 ||  cds.indexOf(9) != -1 || cds.indexOf(11) != -1 || cds.indexOf(21) != -1  ) {
    //        //    return true;
    //        //}
    //    }
    //
    //    for (var z = 0; z < noFengCds.length; z++) {
    //        var cds = noFengCds[z];
    //        for (var q = 0; q < disCard.length; q++) {
    //            if (cds.indexOf(disCard[q]) != -1) return false;
    //        }
    //        if (cds.indexOf(1) != -1 || cds.indexOf(19) != -1 ||  cds.indexOf(29) != -1 ||  cds.indexOf(9) != -1 || cds.indexOf(11) != -1 || cds.indexOf(21) != -1  ) {
    //            return true;
    //        }
    //    }
    //    return false;
    //}

    //惠州 字一色 全是由风牌组成的碰碰胡
    majiang.ziYiSe = function (pi) {
        if (majiang.All3(pi) != 2) return false;
        return true;
    }
    majiang.ziYiSeNew = function (pi) {
        //抛去鬼牌 都是风牌则就是字一色
        for(var i=0;i<pi.mjpeng.length;i++)
        {
            if(pi.mjpeng[i] < 31) return false;
        }
        for(var i=0;i<pi.mjgang0.length;i++)
        {
            if(pi.mjgang0[i] < 31) return false;
        }
        for(var i=0;i<pi.mjgang1.length;i++)
        {
            if(pi.mjgang1[i] < 31) return false;
        }
        for(var i=0;i<pi.mjhand.length;i++)
        {
            if(majiang.isEqualHunCard(pi.mjhand[i]))
            {
                continue;
            }
            if(pi.mjhand[i] < 31) return false;
        }
        return true;
    }

    //做牌推到胡
    majiang.ziYiSeNewForTuiDaoHu = function (pi) {
        //抛去鬼牌 都是风牌则就是字一色
        for(var i=0;i<pi.mjpeng.length;i++)
        {
            if(pi.mjpeng[i] < 31) return false;
        }
        for(var i=0;i<pi.mjgang0.length;i++)
        {
            if(pi.mjgang0[i] < 31) return false;
        }
        for(var i=0;i<pi.mjgang1.length;i++)
        {
            if(pi.mjgang1[i] < 31) return false;
        }
        for(var i=0;i<pi.mjhand.length;i++)
        {
            if(majiang.isEqualHunCardForTuiDaoHu(pi.mjhand[i]))
            {
                continue;
            }
            if(pi.mjhand[i] < 31) return false;
        }
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
        var allFengPaiCounts1 = 0;
        var allFengPaiCounts2 = 0;
        var allFengPaiCounts3 = 0;
        var allFengPaiCounts4 = 0;
        var allFengPaiCounts5 = 0;
        var no1 = false;
        var no2 = false;
        var no3 = false;
        var no4 = false;
        var no5 = false;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts1++;
        }
        if(allFengPaiCounts1 >= pl.mjhand.length) no1 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjpeng.length; i++)
        {
            if(fengPai.indexOf(pl.mjpeng[i]) != -1) allFengPaiCounts2++;
        }
        if(allFengPaiCounts2 >= pl.mjpeng.length) no2 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang0.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang0[i]) != -1) allFengPaiCounts3++;
        }
        if(allFengPaiCounts3 >= pl.mjgang0.length) no3 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang1.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang1[i]) != -1) allFengPaiCounts4++;
        }
        if(allFengPaiCounts4 >= pl.mjgang1.length) no4 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjchi.length; i++)
        {
            if(fengPai.indexOf(pl.mjchi[i]) != -1) allFengPaiCounts5++;
        }
        if(allFengPaiCounts5 >= pl.mjchi.length) no5 = true; //全是风牌 则不是混一色

        if(no1 && no2 && no3 && no4 && no5) return false;

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
        var allFengPaiCounts1 = 0;
        var allFengPaiCounts2 = 0;
        var allFengPaiCounts3 = 0;
        var allFengPaiCounts4 = 0;
        var allFengPaiCounts5 = 0;
        var no1 = false;
        var no2 = false;
        var no3 = false;
        var no4 = false;
        var no5 = false;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts1++;
        }
        if(allFengPaiCounts1 >= pl.mjhand.length) no1 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjpeng.length; i++)
        {
            if(fengPai.indexOf(pl.mjpeng[i]) != -1) allFengPaiCounts2++;
        }
        if(allFengPaiCounts2 >= pl.mjpeng.length) no2 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang0.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang0[i]) != -1) allFengPaiCounts3++;
        }
        if(allFengPaiCounts3 >= pl.mjgang0.length) no3 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang1.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang1[i]) != -1) allFengPaiCounts4++;
        }
        if(allFengPaiCounts4 >= pl.mjgang1.length) no4 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjchi.length; i++)
        {
            if(fengPai.indexOf(pl.mjchi[i]) != -1) allFengPaiCounts5++;
        }
        if(allFengPaiCounts5 >= pl.mjchi.length) no5 = true; //全是风牌 则不是混一色

        if(no1 && no2 && no3 && no4 && no5) return false;
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

    //做牌推到胡特殊处理 服务器结束时 不能用于普遍胡法
    majiang.HunYiSeNewForZuoPai = function (pl) {
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
        var allFengPaiCounts1 = 0;
        var allFengPaiCounts2 = 0;
        var allFengPaiCounts3 = 0;
        var allFengPaiCounts4 = 0;
        var allFengPaiCounts5 = 0;
        var no1 = false;
        var no2 = false;
        var no3 = false;
        var no4 = false;
        var no5 = false;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts1++;
        }
        if(allFengPaiCounts1 >= pl.mjhand.length) no1 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjpeng.length; i++)
        {
            if(fengPai.indexOf(pl.mjpeng[i]) != -1) allFengPaiCounts2++;
        }
        if(allFengPaiCounts2 >= pl.mjpeng.length) no2 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang0.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang0[i]) != -1) allFengPaiCounts3++;
        }
        if(allFengPaiCounts3 >= pl.mjgang0.length) no3 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang1.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang1[i]) != -1) allFengPaiCounts4++;
        }
        if(allFengPaiCounts4 >= pl.mjgang1.length) no4 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjchi.length; i++)
        {
            if(fengPai.indexOf(pl.mjchi[i]) != -1) allFengPaiCounts5++;
        }
        if(allFengPaiCounts5 >= pl.mjchi.length) no5 = true; //全是风牌 则不是混一色

        if(no1 && no2 && no3 && no4 && no5) return false;
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
                if(majiang.isEqualHunCardForTuiDaoHu(cd))
                {
                    continue;
                }
                if (color == -1) color = Math.floor(cd / 10);
                else if (color != Math.floor(cd / 10)) return false;
            }
        }
        return true;
    }

    majiang.HunYiSeNewNoJiang = function (pl) {
        var test = [pl.mjhand, pl.mjpeng, pl.mjgang0, pl.mjgang1, pl.mjchi];
        var fengPai = [31,41,51,61,71,81,91];
        var allFengPaiCounts1 = 0;
        var allFengPaiCounts2 = 0;
        var allFengPaiCounts3 = 0;
        var allFengPaiCounts4 = 0;
        var allFengPaiCounts5 = 0;
        var no1 = false;
        var no2 = false;
        var no3 = false;
        var no4 = false;
        var no5 = false;
        for(var i=0;i<pl.mjhand.length;i++){
            if(fengPai.indexOf(pl.mjhand[i]) != -1) allFengPaiCounts1++;
        }
        if(allFengPaiCounts1 >= pl.mjhand.length) no1 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjpeng.length; i++)
        {
            if(fengPai.indexOf(pl.mjpeng[i]) != -1) allFengPaiCounts2++;
        }
        if(allFengPaiCounts2 >= pl.mjpeng.length) no2 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang0.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang0[i]) != -1) allFengPaiCounts3++;
        }
        if(allFengPaiCounts3 >= pl.mjgang0.length) no3 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjgang1.length; i++)
        {
            if(fengPai.indexOf(pl.mjgang1[i]) != -1) allFengPaiCounts4++;
        }
        if(allFengPaiCounts4 >= pl.mjgang1.length) no4 = true; //全是风牌 则不是混一色

        for(var i=0;i<pl.mjchi.length; i++)
        {
            if(fengPai.indexOf(pl.mjchi[i]) != -1) allFengPaiCounts5++;
        }
        if(allFengPaiCounts5 >= pl.mjchi.length) no5 = true; //全是风牌 则不是混一色

        if(no1 && no2 && no3 && no4 && no5) return false;
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

    majiang.randomCardsWithBai = function (withWind, withBai) {
        //return testCds[(++nextTest)%testCds.length ];

        //var rtn=[]; rtn.length=withWind?mjcards.length:(mjcards.length-28);
        var rtn = [];
        if (withWind && withBai) rtn.length = mjcardsBaiBanGui.length;
        if (withWind && !withBai) rtn.length = mjcardsBaiBanGui.length;
        if (!withWind && withBai) rtn.length = mjcardsBaiBanGui.length - 24;
        if (!withWind && !withBai) rtn.length = mjcardsBaiBanGui.length - 24;
        //rtn.length=withWind?mjcards.length:(mjcards.length-24);

        for (var i = 0; i < rtn.length; i++) rtn[i] = mjcardsBaiBanGui[i];
        if (withBai || withWind) {
            for (var i = 0; i < 4; i++) {
                rtn.push(91);
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


    majiang.randomHuiZhouCards = function (withWind, withZhong,maxPlayer) {
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

        if(maxPlayer == 4)
        {
            while(true)
            {
                if(rtn[52] >= 111 || rtn[53] >= 111 ||rtn[54] >= 111 || rtn[55] >= 111 || rtn[56] >= 111 || rtn[57] >= 111 || rtn[58] >= 111 || rtn[59] >= 111 || rtn[60] >= 111 )
                {
                    for (var i = 0; i < rtn.length; i++) {
                        var ci = rtn[i];
                        var j = Math.floor(Math.random() * rtn.length);
                        rtn[i] = rtn[j];
                        rtn[j] = ci;
                    }
                }
                else
                {
                    break;
                }
            }
        }else
        {
            while(true)
            {
                if( rtn[39] >= 111 || rtn[40] >= 111 || rtn[41] >= 111 || rtn[42] >= 111 || rtn[43] >= 111 || rtn[44] >= 111 || rtn[45] >= 111 || rtn[46] >= 111 )
                {
                    for (var i = 0; i < rtn.length; i++) {
                        var ci = rtn[i];
                        var j = Math.floor(Math.random() * rtn.length);
                        rtn[i] = rtn[j];
                        rtn[j] = ci;
                    }
                }
                else
                {
                    break;
                }
            }
        }


        //查看 初始牌
        var tt ="";
        for(var i=0;i<rtn.length;i++){

            tt = tt + rtn[i] + ",";

        }
        console.log(tt);
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

    majiang.randomYiBaiZhangCardsBaiGui = function (withWind, withBai){
        var rtn = [];
        if (withWind && withBai) rtn.length = yibaizhangcardsBaiGui.length;
        if (withWind && !withBai) rtn.length = yibaizhangcardsBaiGui.length;
        if (!withWind && withBai) rtn.length = yibaizhangcardsBaiGui.length - 24;
        if (!withWind && !withBai) rtn.length = yibaizhangcardsBaiGui.length - 24;
        //rtn.length=withWind?mjcards.length:(mjcards.length-24);

        for (var i = 0; i < rtn.length; i++) rtn[i] = yibaizhangcardsBaiGui[i];
        if (withBai || withWind) {
            for (var i = 0; i < 4; i++) {
                rtn.push(91);
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

    //河源百搭
    majiang.randomHeYuanBaiDaCards = function(withWind,withZhong)
    {
        var rtn = [];
        if (withWind && withZhong) rtn.length = huizhoumjcards.length;
        if (withWind && !withZhong) rtn.length = huizhoumjcards.length;
        if (!withWind && withZhong) rtn.length = huizhoumjcards.length - 24;
        if (!withWind && !withZhong) rtn.length = huizhoumjcards.length - 24;
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
            else
            {
                needMinHunNum = (needNum + 4) > needMinHunNum ? needMinHunNum : (needNum + 4);
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

    function isHunBai(card) {
        if (card == 91) {
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
        // var allPai = "";
        for (var i = 0; i < cds.length; i++) {
            // allPai = allPai + cds[i] + ",";
            if (cds[i] == 71) {
                count++;
            }
        }
        // console.log(allPai);
        // console.log("count===" + count);
        if (count == 4) return true;
        return false;
    }

    function is4Bai(cds, cd) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) tmp.push(cds[i]);
        if (cd) tmp.push(cd);
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        var count = 0;
        // var allPai = "";
        for (var i = 0; i < cds.length; i++) {
            // allPai = allPai + cds[i] + ",";
            if (cds[i] == 91) {
                count++;
            }
        }
        // console.log(allPai);
        // console.log("count===" + count);
        if (count == 4) return true;
        return false;
    }

    majiang.toFontGuiPai = function (cds) {

        var gameType = jsclient.data.sData.tData.gameType;
        var withZhong = jsclient.data.sData.tData.withZhong;
        var withBai = jsclient.data.sData.tData.withBai;
        var isFanGui = jsclient.data.sData.tData.fanGui;
        var twogui = jsclient.data.sData.tData.twogui;
        var gui1 = jsclient.data.sData.tData.gui;
        var gui2 = jsclient.data.sData.tData.nextgui;

        if (withZhong) {
            cds.sort(function (node1, node2) {
                return node2.tag == 71;
            });
        }
        else if(withBai)
        {
            cds.sort(function (node1, node2) {
                return node2.tag == 91;
            });
        }

        if(twogui){
            cds.sort(function (node1, node2) {
                return node2.tag == gui2;
            });
        }

        if (isFanGui) {
            cds.sort(function (node1, node2) {
                return node2.tag == gui1;
            });
        }

        if(gameType == 7 && isFanGui) {
            cds.sort(function (node1, node2) {
                return (node2.tag >= 111 && node2.tag <= 181);
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
    majiang.check4guiforhands = function(cards,withZhong,withBai,isfanGui,gui)
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
        else if(withBai)
        {
            for (var i = 0; i < cards.length; i++) {
                if (cards[i] == 91) {
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

    //河源百搭7对胡法 判断组成对子后 还剩余的癞子数
    majiang.can_7_HuForLeftHun = function(cds, cd, with258, withHun, gui,nextgui)
    {
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
                if (gui == cds[i] || nextgui == cds[i] || cds[i] >= 111) {
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
                        return 1; //可组成单调花的条件
                    } else
                        return 1; //可组成单调花的条件
                }
                //if(oddCards.length < hunCards.length && (hunCards.length == 3 || hunCards.length == 5 || hunCards.length == 7)){
                //    if (with258 && (ispair258 || isodd258)) {
                //        return true;
                //    } else
                //        return true;
                //}
                if (hunCards.length > oddCards.length && hunCards.length>0 && oddCards.length > 0)
                {
                    if( (hunCards.length - oddCards.length) % 2 == 0 ) return 2; //可形成花凋花的条件
                }
            }
        } else {
            //if (hunCards.length == 2 || hunCards.length == 4 || hunCards.length == 6 || hunCards.length == 8) {
            //    return true;
            //} else if (with258) {
            //    //if (ispair258)
            //        return true;
            //} else {
            //    //return true;
            //}
        }
        return false;
    }

    //河源百搭 7对护法
    majiang.can_7_HuForHeYuanBaiDa = function(cds, cd, with258, withHun, gui,nextgui)
    {
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
                if (gui == cds[i] || nextgui == cds[i] || cds[i] >= 111) {
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
                if(oddCards.length < hunCards.length && (hunCards.length == 3 || hunCards.length == 5 || hunCards.length == 7)){
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
                if (hunCards.length > oddCards.length && hunCards.length>0 && oddCards.length > 0)
                {
                    if( (hunCards.length - oddCards.length) % 2 == 0 ) return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4 || hunCards.length == 6 || hunCards.length == 8) {
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
    //翻鬼的7对胡
    function can_7_HuForFanGui(cds, cd, with258, withHun, gui,nextgui) {
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
                if (gui == cds[i] || nextgui == cds[i] || cds[i] >= 111) {
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
                if(oddCards.length < hunCards.length && (hunCards.length == 3 || hunCards.length == 5 || hunCards.length == 7)){
                    if (with258 && (ispair258 || isodd258)) {
                        return true;
                    } else
                        return true;
                }
                if (hunCards.length > oddCards.length && hunCards.length>0 && oddCards.length > 0)
                {
                    if( (hunCards.length - oddCards.length) % 2 == 0 ) return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4 || hunCards.length == 6 || hunCards.length == 8) {
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

    majiang.can_7_Hu = function (cds, cd, with258, withHun)
    {
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
                if (hunCards.length > oddCards.length && hunCards.length>0 && oddCards.length > 0)
                {
                    if( (hunCards.length - oddCards.length) % 2 == 0 ) return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4 || hunCards.length == 6 || hunCards.length == 8) {
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

    function can_7_Hu(cds, cd, with258, withHun,withBai) {
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
            else if(withBai){
                if (isHunBai(cds[i])) {
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
            if (withHun || withBai) {
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
                if (hunCards.length > oddCards.length && hunCards.length>0 && oddCards.length > 0)
                {
                    if( (hunCards.length - oddCards.length) % 2 == 0 ) return true;
                }
            }
        } else {
            if (hunCards.length == 2 || hunCards.length == 4 || hunCards.length == 6 || hunCards.length == 8) {
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
        if(majiang.canHuForShiSanYaoNew(tmp)) return 13;
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
    function canHunHuForFanGuiNew(no7, cds, cd, with258, withHun, gui,gui4Hu,nextgui) {
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
        if(majiang.canHuForShiSanYaoNew(tmp)) return 13;
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if (gui == cds[i] || nextgui == cds[i] || cds[i] >= 110) {
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
        if(nextgui != 0 ||  majiang.canFindFlowerForMjhand(cdsss)) MJPAI_HUNMAX = 8;
        else MJPAI_HUNMAX = 4;
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
        //console.log("=================需要的needHunNum:" + needHunNum);
        // console.log("----------------- 现实一共有混子curHunNum:" + curHunNum);
        //放置最后判断能否胡7对
        var isHu7 = false;
        if (!no7) {
            isHu7 = can_7_HuForFanGui(cdsss, cd, with258, withHun, gui,nextgui);
        }
        //胡七小对 及其他类型
        if(isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 8;
        if(isHu7 && (!isHu && !isHu1 && !isHu2 && !isHu3)) return 7;
        if(!isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 100;
        if (is4SameGui(cdsss, cd, gui) && gui4Hu) return 100;
        if(nextgui != 0 && is4SameGui(cdsss, cd, nextgui) && gui4Hu) return 100;
        return 0;
    }

    //红中癞子胡法 白板癞子
    function canHunHu(no7, cds, cd, with258, withHun,withBai,gui4Hu) {
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
        if(majiang.canHuForShiSanYaoNew(tmp)) return 13;
        cds = tmp;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if ((isHun(cds[i]) && withHun) || (isHunBai(cds[i]) && withBai) ) {
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
            var isHu7 = can_7_Hu(cdsss, cd, with258, withHun,withBai);
            if (isHu7)
                return 7;
        }
        if(withHun)
        {
            if (is4HongZhong(cdsss, cd) && gui4Hu) return 100;
        }
        else if(withBai)
        {
            if(is4Bai(cdsss,cd) && gui4Hu) return 100;
        }
        return 0;
    }

    //红中癞子胡法 白鬼癞子
    function canHunHuNew(no7, cds, cd, with258, withHun,withBai,gui4Hu) {
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
        if(majiang.canHuForShiSanYaoNew(tmp)) return 13;
        cds.sort(function (a, b) {
            return a - b
        });
        for (i = 0; i < cds.length; i++) {
            if ((isHun(cds[i]) && withHun) || (isHunBai(cds[i]) && withBai) ) {
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
            isHu7 = can_7_Hu(cdsss, cd, with258, withHun,withBai);
        }
        console.log("胡了没"+isHu);
        //胡七小对 及其他类型
        if(isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 8;
        if(isHu7 && (!isHu && !isHu1 && !isHu2 && !isHu3)) return 7;
        if(!isHu7 && (isHu || isHu1 || isHu2 || isHu3)) return 100;
        //摸到4个红中 胡
        if(withHun)
        {
            if (is4HongZhong(cdsss, cd) && gui4Hu) return 100;
        }
        else if(withBai)
        {
            if (is4Bai(cdsss, cd) && gui4Hu) return 100;
        }

        return 0;
    }

    //寻找花牌
    majiang.canFindFlowerForMjhand = function(cds)
    {
        if(cds >= 111) return true;
        for(var i=0;i<cds.length;i++)
        {
            if(cds[i] >= 111 && cds[i] <= 181)
            {
                return true;
            }
        }
        return false;
    }

    majiang.canHu = function (no7, cds, cd, with258, withZhong,withBai, fanGui, gui,gui4Hu,nextgui) {
        if(myObject && myObject.tData && (myObject.tData.gameType == 6 ||myObject.tData.gameType == 1 || myObject.tData.gameType == 5 || myObject.tData.gameType == 3 || myObject.tData.gameType == 7 || myObject.tData.gameType == 9 || myObject.tData.gameType == 10) )
            return majiang.canHuNew(no7, cds, cd, with258, withZhong,withBai, fanGui, gui,gui4Hu,nextgui);
        else{
            //带红中癞子
            if (withZhong || withBai) {
                return canHunHu(no7, cds, cd, with258, withZhong,withBai,gui4Hu);
            }
            else if (fanGui) {
                if( gui == 0  && nextgui == 0 )
                {
                    if(majiang.canFindFlowerForMjhand(cds)) return majiang.canHuNew(no7, cds, cd, with258, withZhong,withBai, fanGui, gui,gui4Hu,nextgui);
                    else
                    {
                        return canHuNoZhong(no7, cds, cd, with258);
                    }
                }
                if((nextgui && nextgui != 0) ||  majiang.canFindFlowerForMjhand(cds) ) return majiang.canHuNew(no7, cds, cd, with258, withZhong, withBai,fanGui, gui,gui4Hu,nextgui);
                return canHunHuForFanGui(no7, cds, cd, with258, fanGui, gui,gui4Hu);
            }
            else {
                return canHuNoZhong(no7, cds, cd, with258);
            }
        }
    }

    //新的canHu算法
    majiang.canHuNew = function (no7, cds, cd, with258, withZhong, withBai,fanGui, gui,gui4Hu,nextgui) {
        var tmp = [];
        for (var i = 0; i < cds.length; i++) {
            tmp.push(cds[i]);
        }
        if (cd) {
            tmp.push(cd);
        }
        //带红中癞子
        if (withZhong && majiang.canFindGuiPaiForMjhand(tmp,withZhong,withBai,fanGui,gui,nextgui)) {
            return canHunHuNew(no7, cds, cd, with258, withZhong,withBai,gui4Hu);
        }
        else if(withBai && majiang.canFindGuiPaiForMjhand(tmp,withZhong,withBai,fanGui,gui,nextgui))
        {
            return canHunHuNew(no7, cds, cd, with258, withZhong,withBai,gui4Hu);
        }
        else if (fanGui && majiang.canFindGuiPaiForMjhand(tmp,withZhong,withBai,fanGui,gui,nextgui)) {
            return canHunHuForFanGuiNew(no7, cds, cd, with258, fanGui, gui,gui4Hu,nextgui);
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

    majiang.canHuNoZhong = function(no7, cds, cd, with258) {
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
    };

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

    majiang.SameColorNewForZuoPai = function (pl) {
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
                if(majiang.isEqualHunCardForTuiDaoHu(cd))
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

    //惠州 门清 胡牌时检测胡牌 是否无吃牌、碰牌和明杠 且必须是自模糊
    majiang.isMenQing = function(pl)
    {
        if(pl.mjgang0.length == 0 && (pl.winType == 4 || pl.winType == 5 || pl.winType == 6 || pl.winType == 7) && pl.mjpeng.length == 0 && pl.mjchi.length == 0) return true;
        return false;
    }

    //判断手牌是否含有红中 或者 鬼
    majiang.isFindGuiForMjhand = function(mjhand)
    {
        if(myObject && myObject.tData.fanGui && majiang.canFindFlowerForMjhand(mjhand)) return true;
        if(myObject && myObject.tData.withZhong &&  mjhand.indexOf(71) != -1) return true;
        if(myObject && myObject.tData.withBai &&  mjhand.indexOf(91) != -1) return true;
        if(myObject && myObject.tData.fanGui && (mjhand.indexOf(myObject.tData.gui) != -1 || (myObject.tData.twogui && mjhand.indexOf(myObject.tData.nextgui) != -1))) return true;
        return false;
    }

    majiang.canFindGuiPaiForMjhand = function(mjhand,withZhong,withBai,fanGui,gui,nextgui)
    {
        if(majiang.canFindFlowerForMjhand(mjhand)) return true;
        if(withZhong &&  mjhand.indexOf(71) != -1) return true;
        else if(withBai && mjhand.indexOf(91) != -1) return true;
        if(fanGui && (mjhand.indexOf(gui) != -1 || (mjhand.indexOf(nextgui) != -1))) return true;
        return false;
    }

    majiang.isEqualHunCard = function(card)
    {
        if(myObject &&  myObject.tData && myObject.tData.withZhong && card == 71) return true;
        else if(myObject &&  myObject.tData && myObject.tData.withBai && card == 91) return true;
        if(myObject && myObject.tData &&　myObject.tData.fanGui && (myObject.tData.gui == card || ( myObject.tData.twogui && myObject.tData.nextgui == card))) return true;
        if(myObject && myObject.tData && myObject.tData.fanGui && myObject.tData.gui == 0 && myObject.tData.nextgui == 0 && card >= 111 ) return true;

        if(majiang.isClient && card >= 111) return true;
        if(majiang.isClient && jsclient.data.sData.tData.withZhong && card == 71) return true;
        if(majiang.isClient && jsclient.data.sData.tData.withBai && card == 91) return true;
        if(majiang.isClient && jsclient.data.sData.tData.fanGui && (jsclient.data.sData.tData.gui == card || ( jsclient.data.sData.tData.twogui && jsclient.data.sData.tData.nextgui == card))) return true;
        if(majiang.isClient && jsclient.data.sData.tData.fanGui && jsclient.data.sData.tData.gui == 0 && jsclient.data.sData.tData.nextgui == 0 && card >= 111 ) return true;
        return false;
    }

    //推到胡 特殊处理
    majiang.isEqualHunCardForTuiDaoHu = function(card)
    {
        if(card >= 111)
          return true;
        return false;
    }

    //河源百搭花鬼胡法 判断 手牌花鬼的数量
    majiang.getFlowerHunNum = function(pl)
    {
        var num = 0;
        for(var i = 0;i<pl.mjhand.length;i++)
        {
            if(pl.mjhand[i] >= 111 )
                num ++;
        }
        return num;
    }

    //判断听牌（客户端里面是否有鬼）
    majiang.isEqualHunCardForTingPai = function(card,withZhong,withBai,fanGui,twogui,nextgui,gui)
    {
        if(majiang.isClient && card >= 111) return true;
        if(majiang.isClient && withZhong && card == 71) return true;
        else if(majiang.isClient && withBai && card == 91) return true;
        if(majiang.isClient && fanGui && (card == gui || ( twogui && card == nextgui))) return true;
        if(majiang.isClient && fanGui && gui == 0 && nextgui == 0 && card >= 111 ) return true;
        return false;
    }

    //推倒胡爆炸马算法
    majiang.getMaCountsForBaoZhaMa = function(card)
    {
        //东西南北中发白酒算5个马
        var fengPai = [31,41,51,61,71,81,91];
        if(fengPai.indexOf(card) != -1) return 5;
        //抓到1就是中10个马
        var yiPai = [1,11,21];
        if(yiPai.indexOf(card) != -1) return 10;
        return (card % 10);
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
            // var needNums = count1 * 2 + count2 + 1;
            if(needNums <= laiziNums){
                return 1;
            }
        }
        else{
            //条件判断
            var needNums = count1 * 2 + count2 + count4;
            // console.log("需要的癞子数是:"+needNums);
            if(needNums == laiziNums || (needNums < laiziNums  && (laiziNums - needNums) % 2 != 0))
            {
                return 1;
            }
        }
        return 0;
    }

    //癞子判断 抛去做将的2张牌
    majiang.All3NewNoJiang = function(pl)
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
            var needNums = count1 * 2 + count2;
            if(needNums <= laiziNums){
                return 1;
            }
        }
        else
        {
            if (count4 == 1 || count4 == 2 || count4 == 3 )
            {
                var needNums = count1 * 2 + count2;
                if(needNums <= laiziNums)
                {
                    return 1;
                }
            }
            if(count4 == 4)
            {
                return 1;
            }
        }

        return 0;
    }

    //癞子碰碰胡单吊算法
    majiang.All3NewDanDiao = function(pl)
    {
        var newCards = [];
        for(var i=0;i<pl.mjhand.length;i++){
            if(i == pl.mjhand.length - 2) break;
            newCards.push(pl.mjhand[i]);
        }
        //有吃牌
        if(pl.mjchi.length > 0) return 0;
        var laiziNums = 0;
        var cds = newCards.slice();
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
        //2个癞子不可以做将 且 癞子不能与 已做将牌 的同种牌做将
        for(var i in PAI){
            tempCount = PAI[i];
            //counts[tempCount]++;
            // mjhand: [111,111,111,4,4,4,12,12,12,14,14,16,16,16],
            if(tempCount == 1)
            {
                // console.log("a=" + i);
                count1++;
            }
            else if(tempCount == 2)
            {
                //console.log("b=" + i);
                count2++;
            }
            else if(tempCount == 3)
            {
                //console.log("c=" + i);
                count3++;
            }
            else if(tempCount == 4)
            {
                //console.log("d=" + i);
                count4++;
            }
        }
        //碰碰胡判断
        if(count4 == 0){
            //条件判断
            var needNums = count1 * 2 + count2;
            // console.log("需要的癞子数是:"+needNums);
            if(needNums == laiziNums || (needNums < laiziNums  && (laiziNums - needNums) % 2 != 0))
            {
                return 1;
            }
        }else{
            //条件判断
            var needNums = count1 * 2 + count2 + count4;
            // console.log("需要的癞子数是:"+needNums);
            if(needNums == laiziNums || (needNums < laiziNums  && (laiziNums - needNums) % 2 != 0))
            {
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

    majiang.nextGui = function (gui,isLianXu){
        var next = 0;
        if(myObject && myObject.tData.fanGui && gui != 0 && myObject.tData.twogui && isLianXu)
        {
            next = gui + 1;
            if(gui % 10 == 9 && gui < 30 ) next = (gui + 2) - 10 ; //9条 9万 9筒
            if(gui > 30 && gui<100) next =  gui + 10;
            if(gui == 91) next = 31;
        }
        if(myObject && myObject.tData.fanGui && gui != 0 && myObject.tData.twogui && !isLianXu)
        {
            switch (myObject.tData.gameType)
            {
                case 1:
                {
                    next = majiang.getRandomGui(tData.withWind);
                    while(next == gui)
                    {
                        next = majiang.getRandomGui(tData.withWind);
                    }
                }
                    break;
                default :
                {
                    next = majiang.getRandomGui(tData.withWind);
                    while(next == gui)
                    {
                        next = majiang.getRandomGui(tData.withWind);
                    }
                }
                    break;
            }
        }
        return next;
    }

    function DoTest() {
        var pl = {
            // mjhand: [3,3,3,2,2,2,5,5,5,6,6,6,9,1],
            mjhand: [3,3,3,2,2,2,5,5,5,6,6,6,9,1],
            mjpeng: [],
            mjgang0: [],
            mjgang1: [],
            mjchi: [],
        }

        //var rtn = majiang.randomHuiZhouCards(true,true,3);
        //for(var i=0;i<rtn.length;i++)
        //{
        //    //console.log("起手摸到花牌");
        //    //if(i >= 39 && i<=46)
        //    //{
        //    //    if(rtn[i] > 111) console.log("起手摸到花牌");
        //    //}
        //    //if(i >= 52 && i<=59)
        //    //{
        //    //    if(rtn[i] > 111) console.log("起手摸到花牌");
        //    //}
        //}
        //var start = new Date().getTime();//起始时间
        //for(var i=0;i<36;i++)
        //{
        //    var isHu = majiang.canHu(false, pl.mjhand, 14, false, false, true, 16);
        //}
        //
        //var end = new Date().getTime()
        //console.log( (end - start)+"ms");
        //var end = majiang.qingYaoJiu(pl);
        //console.log( "======"+end);
        //console.log(JSON.stringify( majiang.canTingHu(pl.mjhand)));
        //var end = new Date().getTime();
        //console.log( (end - start)+"ms");

        //var qq = majiang.canHu(false, pl.mjhand, 9, false, true,false,0,true,0);
        //console.log( qq+"ms");

        //for(var j = 0;j<10;j++)
        //{
        //    var rtn = majiang.randomHuiZhouCards(true,true,4);
        //    var pai = "";
        //    for(var i=53;i<61;i++)
        //    {
        //        pai = pai + rtn[i] + ",";
        //    }
        //    console.log( pai);
        //}

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