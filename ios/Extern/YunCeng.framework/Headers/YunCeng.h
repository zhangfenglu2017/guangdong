//
//  YunCeng.h
//  YunCeng
//
//  Created by chuanshi.zl on 15/5/19.
//  Copyright (c) 2015年 Alibaba Cloud Computing Ltd. All rights reserved.
//
#ifndef __IPHONE_5_0
#warning "This project uses features only available in iOS SDK 5.0 and later."
#endif

#ifdef __OBJC__
#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "YunCeng.h"

FOUNDATION_EXPORT double YunCengVersionNumber;

FOUNDATION_EXPORT const unsigned char YunCengVersionString[];

typedef NS_ENUM(NSInteger, YC_CODE) {
    YC_OK = 0,	 /* *< Success */
    
    YC_ERR_NETWORK      = 1000,       /* 网络通信异常 */
    YC_ERR_NETWORK_CONN = 1001,       /* 网络连接失败 */
    
    YC_ERR_KEY            = 2000,     /* appkey错误 */
    YC_ERR_KEY_SECBUF     = 2001,
    YC_ERR_KEY_LEN_MISMATCH   = 2002,
    YC_ERR_KEY_CLEN_MISMATCH  = 2003,
    
    YC_ERR_API_PROXY = 3000,          /* 3000~3999 服务端错误 */
    YC_ERR_RESP      = 4000,            /* 服务端响应错误        */
    YC_ERR_FORMAT    = 4001,            /* 服务端返回内容格式异常  */
    
    YC_ERR_INTR       = 9000,         /* SDK内部错误          */
    YC_ERR_INTR_NOMEM = 9001          /* 内存不足    */
};


@interface YunCeng : NSObject

/*! @brief 初始化云层SDK
 *
 * @param appKey
 * @exception YunCengException
 */
+(void) initWithAppKey:(NSString *)appKey;

/*! @brief 获取动态IP地址
 *
 * @param groupName
 * @throw YunCengException
 */
+(NSString *) getNextIPByGroupName:(NSString *)groupName;

@end


FOUNDATION_EXPORT NSString *const YUNCENG_EXCEPTION_NAME;


@interface YunCengException : NSException {
}

@property(readonly) YC_CODE code;

-(instancetype) initWithCode:(YC_CODE) code;

+(instancetype) exceptionWithCode:(YC_CODE) code;
@end


#endif

/*! @brief 初始化
 *
 * @param app_key
 * @return YC_CODE
 */
int YunCeng_Init(const char *app_key);

/*! @brief 获取动态IP地址
 *
 * @param group_name
 * @param ip 出参，动态IP地址
 * @return YC_CODE
 */
int YunCeng_GetNextIPByGroupName(const char *group_name, char *ip);

