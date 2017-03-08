//
//  UserRecord.m
//  Duration
//
//  Created by gjq on 16/3/25.
//
//

#import "UserRecord.h"
#import "lame.h"
#import <AVFoundation/AVFoundation.h>

@implementation UserRecord{
    NSURL* recordUrl;
    NSURL* mp3FilePath;
    NSURL* audioFileSavePath;
    NSString*fileName;
    NSString* filePath;
}
-(NSString*)beginRecord:(NSString*)filePathT fileName:(NSString*)recordPath
{
    
    //LinearPCM 是iOS的一种无损编码格式,但是体积较为庞大
    //录音设置
    NSMutableDictionary *recordSettings = [[NSMutableDictionary alloc] init];
    //录音格式 无法使用
    [recordSettings setValue :[NSNumber numberWithInt:kAudioFormatLinearPCM] forKey: AVFormatIDKey];
    //采样率
    [recordSettings setValue :[NSNumber numberWithFloat:11025.0] forKey: AVSampleRateKey];//44100.0
    //通道数
    [recordSettings setValue :[NSNumber numberWithInt:2] forKey: AVNumberOfChannelsKey];
    //线性采样位数
    [recordSettings setValue :[NSNumber numberWithInt:16] forKey: AVLinearPCMBitDepthKey];
    //音频质量,采样质量
    [recordSettings setValue:[NSNumber numberWithInt:AVAudioQualityMin] forKey:AVEncoderAudioQualityKey];

    AVAudioSession * session = [AVAudioSession sharedInstance];
    NSError * sessionError;
    [session setCategory:AVAudioSessionCategoryPlayAndRecord error:&sessionError];
    if(session == nil)
        NSLog(@"Error creating session: %@", [sessionError description]);
    else
        [session setActive:YES error:nil];
    
    NSString * tempMp3FileName=[NSString stringWithFormat:@"%@.mp3",recordPath];
    NSString *tempCafFileName=[NSString stringWithFormat:@"%@.caf",recordPath];
    NSString *cafPath=[tempCafFileName stringByReplacingOccurrencesOfString:@" " withString:@""];
    fileName=[tempMp3FileName stringByReplacingOccurrencesOfString:@" " withString:@""];
    [fileName retain];
    filePath = filePathT;
    [filePath retain];

    NSLog(@"beginRecord name: %@ || %@",filePath, fileName);
//    recordUrl = [NSURL URLWithString:[NSTemporaryDirectory() stringByAppendingString:cafPath]];
    recordUrl = [NSURL URLWithString:[filePath stringByAppendingString:cafPath]];
    mp3FilePath = [NSURL URLWithString:[filePath stringByAppendingString:fileName]];

    recorder = [[AVAudioRecorder alloc] initWithURL:recordUrl settings:recordSettings error:nil];

    [recorder prepareToRecord];
    
    [recorder record];
    
    
    NSLog(@"recordUrl1 name: %@", recordUrl);
    NSLog(@"recordUrl2 name: %@", mp3FilePath);
    
    return mp3FilePath;

//    return  [NSString stringWithString:[NSTemporaryDirectory() stringByAppendingString:fileName]];
}
-(void)stopRecord
{
    [recorder stop];
    
    [self transformCAFToMP3];

    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    //默认情况下扬声器播放
    [audioSession setCategory:AVAudioSessionCategoryPlayback error:nil];
    [audioSession setActive:YES error:nil];
}
- (void)transformCAFToMP3
{
//    mp3FilePath = [NSURL URLWithString:[NSTemporaryDirectory() stringByAppendingString:fileName]];
    mp3FilePath = [NSURL URLWithString:[filePath stringByAppendingString:fileName]];

    @try {
        int read, write;
        
        NSLog(@"recordUrl is:%@", recordUrl);
        NSLog(@"mp3FilePath is:%@", mp3FilePath);

        FILE *pcm = fopen([[recordUrl absoluteString] cStringUsingEncoding:1], "rb");   //source 被转换的音频文件位置
        fseek(pcm, 4*1024, SEEK_CUR);                                                   //skip file header
        FILE *mp3 = fopen([[mp3FilePath absoluteString] cStringUsingEncoding:1], "wb"); //output 输出生成的Mp3文件位置
        
        const int PCM_SIZE = 8192;
        const int MP3_SIZE = 8192;
        short int pcm_buffer[PCM_SIZE*2];
        unsigned char mp3_buffer[MP3_SIZE];
        
        lame_t lame = lame_init();
        lame_set_in_samplerate(lame, 11025.0);
        lame_set_VBR(lame, vbr_default);
        lame_init_params(lame);
        
        do {
            read = fread(pcm_buffer, 2*sizeof(short int), PCM_SIZE, pcm);
            if (read == 0)
                write = lame_encode_flush(lame, mp3_buffer, MP3_SIZE);
            else
                write = lame_encode_buffer_interleaved(lame, pcm_buffer, read, mp3_buffer, MP3_SIZE);
            
            fwrite(mp3_buffer, write, 1, mp3);
            
        } while (read != 0);
        
        lame_close(lame);
        fclose(mp3);
        fclose(pcm);
    }
    @catch (NSException *exception) {
        NSLog(@"%@",[exception description]);
    }
    @finally {
        audioFileSavePath = mp3FilePath;
        NSLog(@"MP3生成成功: %@",audioFileSavePath);

    }
}

-(NSURL*)getAudioFile
{
    return audioFileSavePath;
}


+(void)changeSpearker
{
    
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    //默认情况下扬声器播放
    [audioSession setCategory:AVAudioSessionCategoryPlayback error:nil];
    [audioSession setActive:YES error:nil];
}
@end

