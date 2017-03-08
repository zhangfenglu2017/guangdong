//
//  UserRecord.h
//  Duration
//
//  Created by gjq on 16/3/25.
//
//

#import <Foundation/Foundation.h>
#import <AudioToolbox/AudioToolbox.h>
#import <AVFoundation/AVFoundation.h>

@interface UserRecord : NSObject<AVAudioRecorderDelegate>
{
    AVAudioRecorder *recorder;
    NSURL *urlPlay;
}
-(NSString*)beginRecord:(NSString*)recordPath;
-(void)stopRecord;
+(void)changeSpearker;
@end
