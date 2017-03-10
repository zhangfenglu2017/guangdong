/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2014 Chukong Technologies Inc.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

#import <UIKit/UIKit.h>
#import "cocos2d.h"
#include "scripting/js-bindings/manual/ScriptingCore.h"
#import "AppController.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "platform/ios/CCEAGLView-ios.h"
#import "Foundation/Foundation.h"
#import "AudioToolbox/AudioToolbox.h"

#import <Foundation/Foundation.h>
#import "UserRecord.h"
#import <YunCeng/YunCeng.h>


@implementation AppController

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate s_sharedApplication;
static UserRecord* myRecord=NULL;
BOOL isRecord = false;

static NSString* latPos;
static NSString* lonPos;

//语音时时功能添加
NSString *strRoomId;//接入应用地方
NSString *strUserID;//接入应用地方
NSString *strUserName;//接入应用地方
//__weak NSObject *p1 = p;
AVRoom* avRoom;//接入应用地方

+(void)initGameVoiceRoom
{
    avRoom = [[AVRoom alloc] init];//接入声音应用地方
    [avRoom retain];
    [avRoom SetCallback:avRoom callbackQueue:dispatch_get_main_queue()];
    Byte signkey[] = {0x91,0x93,0xcc,0x66,0x2a,0x1c,0xe,0xc1,
        0x35,0xec,0x71,0xfb,0x7,0x19,0x4b,0x38,
        0x15,0xf1,0x43,0xf5,0x7c,0xd2,0xb5,0x9a,
        0xe3,0xdd,0xdb,0xe0,0xf1,0x74,0x36,0xd};
    
    NSData *nsDataAppSignature = [[NSData alloc] initWithBytes:signkey length:32];
    
    [avRoom SetLogLevel:AVROOM_LOG_LEVEL_DEBUG];//接入应用地方
    [avRoom Init:1 AppSignature:nsDataAppSignature];//接入应用地方
    NSLog(@"initGameVoiceRoom=");
    
}
+(void)JoinGameVoiceRoom
{
    [self initGameVoiceRoom];
    
    NSLog(@"JoinGameVoiceRoom strRoomId =:%@",strRoomId);
    //    if (nEnv == 1)
    //    {
    //        NSString *strIP = [self.mNotifEntity strTestIP];
    //        NSString *strPort = [self.mNotifEntity strTestPort];
    //        [avRoom SetTestServer:strIP Port:[strPort intValue] Enable:true];
    //    }
    //    else
    //    {
    //        [avRoom SetTestServer:@"" Port:0 Enable:false];
    //    }
    
    int nRoomKey = [strRoomId intValue];//接入应用地方
    RoomUser* roomUser = [RoomUser new];//接入应用地方
    
    [roomUser setStrUserID:strUserID];//接入应用地方
    
    [roomUser setStrUserName:strUserName];//接入应用地方
    
    [avRoom GetInRoom:nRoomKey RoomUser:roomUser]; //接入应用地方
}
+(void)setVoiceRoomID:(NSString*)roomId
{
    strRoomId = roomId;
    NSLog(@"setVoiceRoomID strRoomId =:%@",strRoomId);
}
+(void)setVoiceUserName:(NSString*)userName
{
    
    strUserName = userName;
    
    
    NSLog(@"setVoiceUserName strUserName =:%@",strUserName);
}
+(void)setVoiceUserId:(NSString*)userId
{
    strUserID = userId;
    NSLog(@"setVoiceUserId strUserID =:%@",strUserID);
}
+(void)voiceStart
{
    NSLog(@"JoinGameVoiceRoom uuuu u vioceStart =");
    //    [avRoom EnableSpeaker:true];
    [avRoom EnableMic:true];
    //    [avRoom EnableAux:false];
    
}
+(void)voiceStop
{
    NSLog(@"JoinGameVoiceRoom uuuu u vioceStop =");
    //    [avRoom EnableSpeaker:false];
    [avRoom EnableMic:false];
    //    [avRoom EnableAux:true];
    
}
+(void)leaveRoom
{
    NSLog(@"leaverRoom uuuu u leaverRoom =");
    //    [avRoom EnableSpeaker:true];
    [avRoom LeaveRoom];
    //    [avRoom EnableAux:false];
    
}
+(void)returnRoom
{
    NSLog(@"returnRoom uuuu u returnRoom =");
    //    [avRoom EnableSpeaker:true];
    [avRoom ReGetInRoom];
    //    [avRoom EnableAux:false];
    
}

//up yuyin over
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSString *appKey_aliDun = @"gxo_C7B2mlgGYhIKOcpWw+4OKMExNxMk90ENn+KVHUb5D-4SO8sK6Et_8BhkQougeGN9EQJ4GEeWa6k3GGbN5sSoBy3Muto6qtZFERKZ6ygGXtDMtUO6kE0hNYg3+K3F+BF7H3WG9X6qmIM-aprKImmD81rvJeMCXbJGm8_ZMmqHqD8APS8xHMETrYCjclumqjOyIA4fmyQtmm1bOpOa8rRt6KTAiBojRL0wuTA_r7WxqPExm+wqVh4t+my7QggaLvtzmtjs6JbJ6YeXJb8miWLxXlQ2LUyQGnhphbo+1wrQMfFoRAvtuA5uQ";
    [YunCeng initWithAppKey:appKey_aliDun];
    
    [self configLocationManager];
    [WXApi registerApp:@"wx073b364e22383a0d"];
    cocos2d::Application *app = cocos2d::Application::getInstance();
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();
    
    // Override point for customization after application launch.
    
    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];
    CCEAGLView *eaglView = [CCEAGLView viewWithFrame: [window bounds]
                                         pixelFormat: (NSString*)cocos2d::GLViewImpl::_pixelFormat
                                         depthFormat: cocos2d::GLViewImpl::_depthFormat
                                  preserveBackbuffer: NO
                                          sharegroup: nil
                                       multiSampling: NO
                                     numberOfSamples: 0 ];
    
    [eaglView setMultipleTouchEnabled:YES];
    
    // Use RootViewController manage CCEAGLView
    viewController = [[RootViewController alloc] initWithNibName:nil bundle:nil];
    viewController.wantsFullScreenLayout = YES;
    viewController.view = eaglView;
    
    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:viewController];
    }
    
    [window makeKeyAndVisible];
    
    [[UIApplication sharedApplication] setStatusBarHidden: YES];
    [UIApplication sharedApplication].idleTimerDisabled=YES;//不自动锁屏
    
    
    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView(eaglView);
    cocos2d::Director::getInstance()->setOpenGLView(glview);
    
    
    [self startSerialLocation];
    
    [self addNotBackUpiCloud];
    app->run();
    return YES;
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
{
    return [WXApi handleOpenURL:url delegate:self];
}

-(BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
{
    return [WXApi handleOpenURL:url delegate:self];
}

-(void)onReq:(BaseReq *)req
{
    
}

-(void)onResp:(BaseResp *)resp
{
    NSLog(@"weixinonResp");
    NSString * appid =@"wx073b364e22383a0d";
    NSString * secret = @"b3faacee5a142ca523dc3f31fd4b0ece";
    
    NSString *code;
    NSString * grant_type=@"authorization_code";
    SendAuthResp *aresp = (SendAuthResp *)resp;
    if([resp isKindOfClass:[SendMessageToWXResp class]])
    {
        
    }else if (aresp.errCode == 0) {
        code = aresp.code;
        NSLog(@"weixincode");
        NSLog(code);
        NSString *url =[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/oauth2/access_token?appid=%@&secret=%@&code=%@&grant_type=authorization_code",appid,secret,code];
        dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,0),^{
            
            NSURL *zoneUrl=[NSURL URLWithString:url];
            
            NSString *zoneStr = [NSString stringWithContentsOfURL:zoneUrl encoding:NSUTF8StringEncoding error:nil];
            NSData *data = [zoneStr dataUsingEncoding:NSUTF8StringEncoding];
            dispatch_async(dispatch_get_main_queue(), ^{
                if(data){
                    NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
                    self->access_token = [dic objectForKey:@"access_token"];
                    NSLog(@"access_token:");
                    // NSLog(access_token);
                    
                    self->openid = [dic objectForKey:@"openid"];
                    NSLog(@"openid:");
                    //NSLog(openid);
                    [self getUserInfo];
                }
            });
        });
        
        
        
    }else
    {
        NSLog(@"false");
    }
}
-(void)getUserInfo
{
https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code
    NSString*url=[NSString stringWithFormat:@"https://api.weixin.qq.com/sns/userinfo?access_token=%@&openid=%@",self->access_token,self->openid];
    NSLog(@"url:");
    NSLog(url);
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT,0),^{
        NSURL *zoneUrl = [NSURL URLWithString:url];
        NSString *zoneStr = [NSString stringWithContentsOfURL:zoneUrl encoding:NSUTF8StringEncoding error:nil];
        NSData *data = [zoneStr dataUsingEncoding:NSUTF8StringEncoding];
        dispatch_async(dispatch_get_main_queue(), ^{
            if(data){
                NSString *result = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                NSDictionary *dic = [NSJSONSerialization JSONObjectWithData:data options:NSJSONReadingMutableContainers error:nil];
                NSString*   nickname = [dic objectForKey:@"nickname"];
                cocos2d::CCFileUtils::getInstance()->writeStringToFile(nickname.UTF8String,
                                                                       cocos2d::CCFileUtils::getInstance()->getWritablePath()+"/nickname.txt");
                
                std::string result_c_str= [result cStringUsingEncoding: NSUTF8StringEncoding];
                std::string event ="WX_USER_LOGIN";
                std::string funName ="cc.eventManager.dispatchCustomEvent";
                std::string rStr = funName + "(\"" + event + "\"," + result_c_str + ");";
                
                
                ScriptingCore::getInstance()->evalString(rStr.c_str());
                
            }
        });
    });
}

+(void)sendAuthRequest
{
    SendAuthReq* req = [[[SendAuthReq alloc] init] autorelease];
    req.scope = @"snsapi_userinfo";
    req.state = @"123";
    [WXApi sendReq:req];
}


+(void)NativeBattery
{
    [[UIDevice currentDevice] setBatteryMonitoringEnabled:YES];
    float battery =  [[UIDevice currentDevice] batteryLevel];
    int   batteryNum =  floor(battery*100);
    
    std::stringstream ss;
    std::string result_c_str;
    ss<<batteryNum;
    ss>>result_c_str;
    std::string event ="nativePower";
    std::string funName ="cc.eventManager.dispatchCustomEvent";
    
    std::string rStr = funName + "(\"" + event + "\"," + result_c_str + ");";
    ScriptingCore::getInstance()->evalString(rStr.c_str());
}

+(void)NativeVibrato
{
    NSLog(@"NativeVibrato");
    AudioServicesPlaySystemSound(kSystemSoundID_Vibrate);
}



+(void)wxShareTexture:(NSString* )path
{
    
    NSLog(@"filepath11:%@",path);
    WXMediaMessage * message =[WXMediaMessage message];
    UIImage *image  = [[UIImage alloc]initWithContentsOfFile:path];
    CGSize size= [image size];
    
    CGSize scaleSize = CGSizeMake(120, 120 / size.width *size.height);
    
    UIGraphicsBeginImageContext(scaleSize);
    CGRect rect = CGRectMake(0.0, 0.0, scaleSize.width, scaleSize.height);
    [image drawInRect:rect];
    UIImage * scaleimage = UIGraphicsGetImageFromCurrentImageContext();
    [message setThumbImage:scaleimage];
    UIGraphicsEndImageContext();
    
    /**
     缩放截屏图片为512
     */
    CGSize scaleSize1 = CGSizeMake(400,400 / size.width * size.height);
    UIGraphicsBeginImageContext(scaleSize1);
    CGRect rect1 = CGRectMake(0.0, 0.0, scaleSize1.width, scaleSize1.height);
    [image drawInRect:rect1];
    UIImage * scaleimage1 = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    WXImageObject *imgobject = [WXImageObject object];
    //获取图片
    
    //UIImagePNGRepresentation(<#UIImage * _Nonnull image#>)
    //imgobject.imageData = [NSData dataWithContentsOfFile:path];
    imgobject.imageData =UIImageJPEGRepresentation(scaleimage1, 100);
    message.mediaObject = imgobject;
    SendMessageToWXReq * req =[[[SendMessageToWXReq alloc] init] autorelease];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    [WXApi sendReq:req];
    NSLog(@"filepath12:%@",path);
}

+(void)wxShareUrl:(NSString*)title AndText:(NSString*)text AndUrl:(NSString*)url
{
    
    NSLog(@"weixinshareurl:%@",url);
    WXMediaMessage * message = [WXMediaMessage message];
    message.title = title;
    message.description = text;
    [message setThumbImage:[UIImage imageNamed:@"Icon-100.png"]];
    WXWebpageObject * webpageObject = [WXWebpageObject object];
    webpageObject.webpageUrl = url;
    message.mediaObject = webpageObject;
    SendMessageToWXReq* req = [[SendMessageToWXReq alloc]init];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneSession;
    [WXApi sendReq:req];
}

+(void)wxShareUrlTimeline:(NSString*)title AndText:(NSString*)text AndUrl:(NSString*)url
{
    
    NSLog(@"weixinshareurl:%@",url);
    WXMediaMessage * message = [WXMediaMessage message];
    message.title = title;
    message.description = text;
    [message setThumbImage:[UIImage imageNamed:@"Icon-100.png"]];
    WXWebpageObject * webpageObject = [WXWebpageObject object];
    webpageObject.webpageUrl = url;
    message.mediaObject = webpageObject;
    SendMessageToWXReq* req = [[SendMessageToWXReq alloc]init];
    req.bText = NO;
    req.message = message;
    req.scene = WXSceneTimeline;    //share to friendsAround
    [WXApi sendReq:req];
}

/**
 * 初始化 录音
 */
+(id)initRecorder
{
    if(!myRecord)
    {
        NSLog(@"create new Instance");
        myRecord=[[UserRecord alloc]init];
    }
    return myRecord;
}
+(NSString*)startRecord:(NSString*)filePath lajioc:(NSString *)fileName
{
    if (isRecord) return @"";
    UserRecord*recoder=[self initRecorder];
    NSString* path=[recoder beginRecord:filePath fileName:fileName];
    NSString *homePath=NSHomeDirectory();
    isRecord = true;
    return  path;
}
+(void)endRecord:(NSString*)eventName
{
    if(!isRecord) return;
    UserRecord*recoder=[self initRecorder];
    [recoder stopRecord];
    NSURL *recordFile = [recoder getAudioFile];
    NSString * fileName = [recordFile absoluteString];
    isRecord = false;
    [self runJs:eventName lajioc:fileName];
}

+(void)runJs:(NSString *)eventName lajioc:(NSString *)para
{
    std::string event = [eventName cStringUsingEncoding: NSUTF8StringEncoding];
    std::string data = [para cStringUsingEncoding: NSUTF8StringEncoding];
    std::string funName ="cc.eventManager.dispatchCustomEvent";
    
    std::string rStr = funName + "(\"" + event + "\", \"" + data + "\");";
    NSLog(@"jsCallBack Str is: %s", rStr.c_str());
    
    ScriptingCore::getInstance()->evalString(rStr.c_str());
}

+(NSString*)getBuildVersion
{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    // app build版本
    NSString *app_build = [infoDictionary objectForKey:@"CFBundleVersion"];
    return app_build;
}

+(NSString*)getVersion
{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *app_Version = [infoDictionary objectForKey:@"CFBundleShortVersionString"];
    return app_Version;
}

+(void)HelloOC:(NSString*)message
{
    NSLog(@"HelloOC: %@", message);
}

+(void)downloadFile:(NSString*)filePath fileName:(NSString*)fileName url:(NSString*)urlStr eventName:(NSString*)eventName
{
    NSLog(@"\nfilePath is: %@ \n fileName is: %@ \n urlStr is: %@\n eventName is: %@", filePath, fileName, urlStr, eventName);
    
    //    filePath = @"/Users/machao/Desktop/appData/scmj/";
    //    urlStr = @"http://192.168.1.123:3000/9.jpg";
    //    fileName = [urlStr lastPathComponent];
    
    NSString* zipFilePath = [filePath stringByAppendingString:fileName];
    NSURL    *url = [NSURL URLWithString:urlStr];
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    NSOperationQueue *que = [[NSOperationQueue alloc] init];
    
    [NSURLConnection sendAsynchronousRequest:request queue:que completionHandler:^(NSURLResponse *response, NSData *data, NSError *connectionError) {
        if (connectionError) {
            NSLog(@"AsynchronousRequest1 get data is OK  on thread %@!!",[NSThread currentThread]);
        }
        else{
            NSLog(@" statusCode is %ld on thread %@",(long)[(NSHTTPURLResponse*)response  statusCode],[NSThread currentThread]);
            
            if (data != nil){
                NSLog(@"下载成功");
                if ([data writeToFile:zipFilePath atomically:YES]) {
                    NSLog(@"保存成功.");
                    dispatch_async(dispatch_get_main_queue(), ^{
                        [self runJs:eventName lajioc:zipFilePath];
                    });
                }
                else
                {
                    NSLog(@"保存失败.");
                }
                
            } else {
                NSLog(@"%@", connectionError);
            }
        }
    }];
    
}



+(void)uploadFile:(NSString *)filedic url:(NSString*)strUrl eventName:(NSString*)eventName
{
    NSLog(@"uploadFile %@", filedic);
    //分界线的标识符
    NSString *TWITTERFON_FORM_BOUNDARY = @"AaB03x";
    //根据url初始化request
    //        NSString* URL = [NSString stringWithFormat:@"http://%@%@",NSLocalizedString(@"MQTT_IP", @""),NSLocalizedString(@"im_uploadfileURL", @"")];
    NSString* URL = strUrl;
    
    NSString* fileName = [filedic lastPathComponent];
    
    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:URL]
                                                           cachePolicy:NSURLRequestReloadIgnoringLocalCacheData
                                                       timeoutInterval:10];
    //分界线 --AaB03x
    NSString *MPboundary=[[NSString alloc]initWithFormat:@"--%@",TWITTERFON_FORM_BOUNDARY];
    //结束符 AaB03x--
    NSString *endMPboundary=[[NSString alloc]initWithFormat:@"%@--",MPboundary];
    //要上传的文件
    //        NSData *data = [NSData dataWithContentsOfFile:[filedic objectForKey:@"filepath"]];
    NSData *data = [NSData dataWithContentsOfFile:filedic];
    
    
    //http body的字符串
    NSMutableString *body=[[NSMutableString alloc]init];
    //参数的集合普通的key－value参数
    
    body = [self setParamsKey:@"uptype" value:@"1" body:body];
    
    ////添加分界线，换行
    [body appendFormat:@"%@\r\n",MPboundary];
    //声明文件字段，文件名
    [body appendFormat:@"Content-Disposition: form-data; name=\"upfile\"; filename=\"%@\"\r\n", fileName];
    //声明上传文件的格式
    [body appendFormat:@"Content-Type: %@\r\n\r\n",[self GetContentType:fileName]];
    
    //声明结束符：--AaB03x--
    NSString *end=[[NSString alloc]initWithFormat:@"\r\n%@",endMPboundary];
    //声明myRequestData，用来放入http body
    NSMutableData *myRequestData=[NSMutableData data];
    //将body字符串转化为UTF8格式的二进制
    [myRequestData appendData:[body dataUsingEncoding:NSUTF8StringEncoding]];
    //将file的data加入
    [myRequestData appendData:data];
    //加入结束符--AaB03x--
    [myRequestData appendData:[end dataUsingEncoding:NSUTF8StringEncoding]];
    
    //设置HTTPHeader中Content-Type的值
    NSString *content=[[NSString alloc]initWithFormat:@"multipart/form-data; boundary=%@",TWITTERFON_FORM_BOUNDARY];
    //设置HTTPHeader
    [request setValue:content forHTTPHeaderField:@"Content-Type"];
    //设置Content-Length
    [request setValue:[NSString stringWithFormat:@"%d", [myRequestData length]] forHTTPHeaderField:@"Content-Length"];
    //设置http body
    [request setHTTPBody:myRequestData];
    //http method
    [request setHTTPMethod:@"POST"];
    
    //开线程下载
    dispatch_queue_t defaultQueue = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0);
    dispatch_async(defaultQueue, ^{
        // 另开线程
        NSData *returnData = [NSURLConnection sendSynchronousRequest:request returningResponse:nil error:nil];
        NSString *returnString = [[NSString alloc] initWithData:returnData encoding:NSUTF8StringEncoding];
        NSLog(@"上传状态返回值: %@", returnString);
        dispatch_async(dispatch_get_main_queue(), ^{
            [self runJs:eventName lajioc:filedic];
        });
    });
}

+(NSMutableString*)setParamsKey:(NSString*)key value:(NSString*)value body:(NSMutableString*)body{
    NSString *TWITTERFON_FORM_BOUNDARY = @"AaB03x";
    //分界线 --AaB03x
    NSString *MPboundary=[[NSString alloc]initWithFormat:@"--%@",TWITTERFON_FORM_BOUNDARY];
    //添加分界线，换行
    [body appendFormat:@"%@\r\n",MPboundary];
    //添加字段名称，换2行
    [body appendFormat:@"Content-Disposition: form-data; name=\"%@\"\r\n\r\n",key];
    //添加字段的值
    [body appendFormat:@"%@\r\n",value];
    return body;
}

+(NSString*)GetContentType:(NSString*)filename{
    if ([filename hasSuffix:@".avi"]) {
        return @"video/avi";
    }
    else if([filename hasSuffix:@".bmp"])
    {
        return @"application/x-bmp";
    }
    else if([filename hasSuffix:@"jpeg"])
    {
        return @"image/jpeg";
    }
    else if([filename hasSuffix:@"jpg"])
    {
        return @"image/jpeg";
    }
    else if([filename hasSuffix:@"png"])
    {
        return @"image/x-png";
    }
    else if([filename hasSuffix:@"mp3"])
    {
        return @"audio/mp3";
    }
    else if([filename hasSuffix:@"mp4"])
    {
        return @"video/mpeg4";
    }
    else if([filename hasSuffix:@"rmvb"])
    {
        return @"application/vnd.rn-realmedia-vbr";
    }
    else if([filename hasSuffix:@"txt"])
    {
        return @"text/plain";
    }
    else if([filename hasSuffix:@"xsl"])
    {
        return @"application/x-xls";
    }
    else if([filename hasSuffix:@"xslx"])
    {
        return @"application/x-xls";
    }
    else if([filename hasSuffix:@"xwd"])
    {
        return @"application/x-xwd";
    }
    else if([filename hasSuffix:@"doc"])
    {
        return @"application/msword";
    }
    else if([filename hasSuffix:@"docx"])
    {
        return @"application/msword";
    }
    else if([filename hasSuffix:@"ppt"])
    {
        return @"application/x-ppt";
    }
    else if([filename hasSuffix:@"pdf"])
    {
        return @"application/pdf";
    }
    return nil;
}


//设置禁止云同步

-(void)addNotBackUpiCloud{
    
    
    
    NSArray *docPaths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    
    NSArray *libPaths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
    
    
    NSString *docPath = [docPaths objectAtIndex:0];
    
    NSString *libPath = [libPaths objectAtIndex:0];
    
    
    
    [self fileList:docPath];
    
    [self fileList:libPath];
    
    
    
}


- (void)fileList:(NSString*)directory{
    
    NSError *error = nil;
    
    NSFileManager * fileManager = [NSFileManager defaultManager];
    
    NSArray *fileList = [fileManager contentsOfDirectoryAtPath:directory error:&error];
    
    for (NSString* each in fileList) {
        
        NSMutableString* path = [[NSMutableString alloc]initWithString:directory];
        
        [path appendFormat:@"/%@",each];
        NSLog(@"path %@:", each);
        
        NSURL *filePath = [NSURL fileURLWithPath:path];
        
        [self addSkipBackupAttributeToItemAtURL:filePath];
        
        [self fileList:path];
    }
}



//设置禁止云同步

-(BOOL)addSkipBackupAttributeToItemAtURL:(NSURL *)URL{
    
    double version = [[UIDevice currentDevice].systemVersion doubleValue];//判定系统版本。
    
    if(version >=5.1f){
        
        NSError *error = nil;
        
        BOOL success = [URL setResourceValue: [NSNumber numberWithBool: YES] forKey: NSURLIsExcludedFromBackupKey error: &error];
        
        if(!success){
            
            NSLog(@"Error excluding %@ from backup %@", [URL lastPathComponent], error);
        }else
        {
            NSLog(@"successful");
        }
        
        return success;
        
    }
    
    //    const char* filePath = [[URL path] fileSystemRepresentation];
    //        const char* attrName = "com.apple.MobileBackup";
    //
    //    u_int8_t attrValue = 1;
    //
    //    int result = setxattr(filePath, attrName, &attrValue, sizeof(attrValue), 0, 0);
    
    
    //    return result == 0;
    return false;
}


- (void)applicationWillResignActive:(UIApplication *)application {
    /*
     Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
     Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
     */
    cocos2d::Director::getInstance()->pause();
}


- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
     Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
     */
    cocos2d::Director::getInstance()->resume();
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
     Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
     If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
     */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
    [UIApplication sharedApplication].idleTimerDisabled=NO;//自动锁屏
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
     Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
     */
    cocos2d::Application::getInstance()->applicationWillEnterForeground();
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
     Called when the application is about to terminate.
     See also applicationDidEnterBackground:.
     */
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
     Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
     */
    cocos2d::Director::getInstance()->purgeCachedData();
}


- (void)dealloc {
    [super dealloc];
}

- (void)configLocationManager
{
    [AMapServices sharedServices].apiKey = @"f04f38274fee86941eef35f91bc813d0";
    
    locationManager = [[AMapLocationManager alloc] init];
    
    [locationManager setDelegate:self];
    
    [locationManager setPausesLocationUpdatesAutomatically:NO];
    
    [locationManager setAllowsBackgroundLocationUpdates:YES];
}

- (void)startSerialLocation
{
    //开始定位
    [locationManager startUpdatingLocation];
}

- (void)stopSerialLocation
{
    //停止定位
    [locationManager stopUpdatingLocation];
}

- (void)amapLocationManager:(AMapLocationManager *)manager didFailWithError:(NSError *)error
{
    //定位错误
    NSLog(@"%s, 定位错误amapLocationManager = %@, error = %@", __func__, [manager class], error);
}

float latitudePos;
float longitudePos;
- (void)amapLocationManager:(AMapLocationManager *)manager didUpdateLocation:(CLLocation *)location
{
    //定位结果
    NSLog(@"定位结果location:{lat:%f; lon:%f; accuracy:%f}", location.coordinate.latitude, location.coordinate.longitude, location.horizontalAccuracy);
    
    latitudePos = location.coordinate.latitude;
    longitudePos = location.coordinate.longitude;
    
    [self stopSerialLocation];
    
}


+(NSString*)getLatitudePos//wei du
{
    NSString* latPos = [NSString stringWithFormat:@"%6f",latitudePos];
    
    return latPos;
}

+(NSString*)getLongitudePos//jing du
{
    NSString* lonPos = [NSString stringWithFormat:@"%6f",longitudePos];
    
    return lonPos;
}

+(NSString*)calculateDistance:(NSString*)latvar1 lon1:(NSString*)lonvar1 lat2:(NSString*)latvar2 lon2:(NSString*)lonvar2
{
    
    double lat1 = [latvar1 doubleValue];
    double lon1 = [lonvar1 doubleValue];
    double lat2 = [latvar2 doubleValue];
    double lon2 = [lonvar2 doubleValue];
    
    double R = 6371004; //chi dao ban jing
    double dd = M_PI/180;
    
    double x1=lat1*dd, x2=lat2*dd;
    double y1=lon1*dd, y2=lon2*dd;
    
    double distance = (2*R*asin(sqrt(2-2*cos(x1)*cos(x2)*cos(y1-y2) - 2*sin(x1)*sin(x2))/2));
    
    NSString* disStr = [NSString stringWithFormat:@"%6f",distance];
    
    return disStr;
}

//+(const char*)getRemoteIpByAliDun:(char *)group
+(NSString *)getRemoteIpByAliDun:(NSString *)groupname
{
    //wxShareTexture:(NSString* )path
    //char ip[16];
    //    int ret = YunCeng_GetNextIPByGroupName("test.k2bnkr49tr.aliyungf.com", ip);
    NSString * ipNstr;
    //std::string event = [eventName cStringUsingEncoding: NSUTF8StringEncoding];
    std::string ip ;
    //NSString *groupname= [NSString stringWithUTF8String:group];
    
    NSLog(@"------------   alidun ip = 00 begin");
    
    std::string event ="GetRemoteIpByAliDun_Back";
    std::string funName ="cc.eventManager.dispatchCustomEvent";
    
    std::string errorCode="errorCode:";
    NSLog(@"--- groupName:%@",groupname);
    
    try {
        NSLog(@"------------   alidun ip = 00");
        ipNstr = [YunCeng getNextIPByGroupName:groupname];
        if (ipNstr == nil || ipNstr.length == 0) {
            ipNstr = @"errorCode:null";
        }
        ip = [ipNstr cStringUsingEncoding: NSUTF8StringEncoding];
        NSLog(@"------------   alidun ip = 01");
        //std::string rStr = funName + "(\"" + event + "\"," + ip + "));";
        
        std::string rStr = funName + "(\"" + event + "\", \"" + ip + "\");";
        
        NSLog(@"------------   alidun rStr=%s",rStr.c_str());
        ScriptingCore::getInstance()->evalString(rStr.c_str());
        
        //NSLog(@"------------   alidun ip = %s",ip.c_str());
        
    } catch (YunCengException *ex) {
        NSLog(@"------------   alidun exception");
        std::string  str = [[NSString stringWithFormat:@"%ld", (long)ex.code] cStringUsingEncoding:NSUTF8StringEncoding];
        std::string rStr = funName + "(\"" + event + "\"," + errorCode+str + ");";
        ScriptingCore::getInstance()->evalString(rStr.c_str());
        
        
    }
    
    
    return ipNstr;
}

@end

