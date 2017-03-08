#include "IosTools.h"
#import "AppController.h"

std::string IosTools::getBuildVersion()
{
    NSString* buildVersion = [AppController getBuildVersion];
    NSLog(@"buildVersion:%@", buildVersion);
    std::string data = [buildVersion cStringUsingEncoding: NSUTF8StringEncoding];
    return data;
}

std::string IosTools::getVersion()
{
    NSString* version = [AppController getVersion];
    NSLog(@"version:%@", version);
    std::string data = [version cStringUsingEncoding: NSUTF8StringEncoding];
    return data;
}

std::string  IosTools::getFullVersion()
{
    NSString* buildVersion = [AppController getBuildVersion];
    NSString* version = [AppController getVersion];
    version = [version stringByAppendingString:@"."];
    NSString* fullVersion = [version stringByAppendingString:buildVersion];
    std::string data = [fullVersion cStringUsingEncoding: NSUTF8StringEncoding];
    return data;
}

