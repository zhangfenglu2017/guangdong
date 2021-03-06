/****************************************************************************
Copyright (c) 2008-2010 Ricardo Quesada
Copyright (c) 2010-2012 cocos2d-x.org
Copyright (c) 2011      Zynga Inc.
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
package org.cocos2dx.javascript;

import java.io.ByteArrayOutputStream;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxHelper;

import com.aliyun.security.yunceng.android.sdk.YunCeng;
import com.aliyun.security.yunceng.android.sdk.exception.YunCengException;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationClientOption.AMapLocationMode;
import com.amap.api.location.AMapLocationListener;
import com.amap.api.maps.AMapUtils;
import com.amap.api.maps.model.LatLng;
import com.happyplay.pop.popAlert;



import com.happyplay.gxmj.R;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap.CompressFormat;
import android.media.AudioFormat;
import android.media.AudioRecord;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Environment;
import android.os.Vibrator;

import com.happyplay.httpClient.httpClient;
import com.pocketdigi.utils.FLameUtils;
import com.tencent.mm.sdk.openapi.*;
import com.tencent.mm.sdk.modelmsg.*;
import com.zego.AVRoom;
import com.zego.AVRoomCallback;
import com.zego.AuxData;
import com.zego.RoomUser;
import com.zego.TextMsg;

import android.util.Log;

import java.io.*;
import java.math.BigDecimal;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Date;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Locale;

import android.view.WindowManager;
import android.widget.Toast;

public class AppActivity extends Cocos2dxActivity  //implements IWXAPIEventHandler 
	implements AMapLocationListener
{
	
	//阿里盾
	public static String appKey_AliDun = "gxo_C7B2mlgGYhIKOcpWw+4OKMExNxMk90ENn+KVHUb5D-4SO8sK6Et_8BhkQougeGN9EQJ4GEeWa6k3GGbN5sSoBy3Muto6qtZFERKZ6ygGXtDMtUO6kE0hNYg3+K3F+BF7H3WG9X6qmIM-aprKImmD81rvJeMCXbJGm8_ZMmqHqD8APS8xHMETrYCjclumqjOyIA4fmyQtmm1bOpOa8rRt6KTAiBojRL0wuTA_r7WxqPExm+wqVh4t+my7QggaLvtzmtjs6JbJ6YeXJb8miWLxXlQ2LUyQGnhphbo+1wrQMfFoRAvtuA5uQ";
	public static int initAliDunCode=-1;
	
	public AMapLocationClientOption mLocationOption = null;
	public AMapLocationClient mlocationClient = null;
	public double latitudePos = 0.0;//纬度坐标
	public double longitudePos = 0.0;//获取经度
    	
	public static String AppID="wx073b364e22383a0d";
	public static String AppSecret="b3faacee5a142ca523dc3f31fd4b0ece";	
	private  BatteryReceiver receiver=null;
	private  VibratorUtil vibrato =null;
	public IWXAPI api;


	//----------------录音------------
	private static short[] mBuffer;
	private static AudioRecord mRecorder;
	static String tempFile;
	static String mp3Path;
	static boolean isRecording = false;
	static boolean isStartRecording = false;
	
	private static AVRoom avRoom; 
	//----------------录音------------
	
	static boolean canSend = true;
	
	public class BatteryReceiver extends BroadcastReceiver
    {

		@Override
		public void onReceive(Context arg0, Intent arg1) {
			// TODO Auto-generated method stub
				int current=arg1.getExtras().getInt("level");//锟斤拷玫锟角帮拷锟斤拷锟�
	            int total=arg1.getExtras().getInt("scale");//锟斤拷锟斤拷艿锟斤拷锟�
	            int percent=current*100/total;
	            Log.i("battery", "锟斤拷锟节的碉拷锟斤拷锟斤拷"+percent+"%锟斤拷");
	            RunJS("nativePower", percent+"");
	            unregisterReceiver(receiver);
		}
    	
    }
    
    /** 
     * 手机震动工具类 
     * @author Administrator 
     * 
     */  
    public class VibratorUtil {  
          
        /** 
         * final Activity activity  ：调用该方法的Activity实例 
         * long milliseconds ：震动的时长，单位是毫秒 
         * long[] pattern  ：自定义震动模式 。数组中数字的含义依次是[静止时长，震动时长，静止时长，震动时长。。。]时长的单位是毫秒 
         * boolean isRepeat ： 是否反复震动，如果是true，反复震动，如果是false，只震动一次 
         */  
          
         public  void Vibrate(final Activity activity, long milliseconds) {   
                Vibrator vib = (Vibrator) activity.getSystemService(Service.VIBRATOR_SERVICE);   
                vib.vibrate(milliseconds);   
         }   
         public  void Vibrate(final Activity activity, long[] pattern,boolean isRepeat) {   
                Vibrator vib = (Vibrator) activity.getSystemService(Service.VIBRATOR_SERVICE);   
                vib.vibrate(pattern, isRepeat ? 1 : -1);   
         }   
      
    }  
    
    
	public void RunJS(String name, String param) {

		Cocos2dxHelper.runOnGLThread((new Runnable() {

			String js;
			String para;

			@Override
			public void run() {
				// TODO Auto-generated method stub
				Log.i("weixin", "js:" + js);
				Log.i("weixin", "para:" + para);
				String command = "cc.eventManager.dispatchCustomEvent('"
						+ js + "','" + para + "' )";
				Log.i("command", command);
				org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge.evalString(command);
			}

			public Runnable setjs(String js, String pa) {
				this.js = js;
				this.para = pa;
				return this;
			}

		}).setjs(name, param));
	}
    
	public  void getBatteryCount()
	{
		receiver=new BatteryReceiver();
		IntentFilter filter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
		registerReceiver(receiver, filter);
	}
	
	public  void onNativeVibrato(long[] pattern,boolean isRepeat)
	{
		
		if(isRepeat)
		{
			Log.i("vib", "3");
		}else
		{
			Log.i("vib", "4");
		}
		vibrato.Vibrate(ccActivity, pattern,isRepeat);
	}
	
	
	public static void NativeBattery()
	{
       ccActivity.getBatteryCount();
	}
	
	public static void NativeVibrato(String pattern,String isRepeat)
	{
		Log.i("vib", "1");
		
		boolean isRepeat_b = false;
		if(isRepeat.equals("true"))
		{
		 isRepeat_b = true;
		}
		
		
		String[]  strArry=  pattern.split(",");
		long[] arry =new long[strArry.length];
		for(int i = 0;i<strArry.length;i++)
		{
			arry[i] = Long.valueOf(strArry[i]);
		}
		
		Log.i("vib", "3");

		 ccActivity.onNativeVibrato(arry,isRepeat_b);
		 Log.i("vib", "4");
	}
	
	
	public void regToWx()
	{
			
		api=WXAPIFactory.createWXAPI(this, AppID,true);
		api.registerApp(AppID);
	
			
	}
	
	public void wxLogin() 
	{ 
	    // send oauth request 
		Log.i("weixin", "wxlogin");
	    SendAuth.Req req = new SendAuth.Req();
	    req.scope = "snsapi_userinfo";
	    req.state = "wechat_sdk_demo_test";
	    api.sendReq(req);
	    Log.i("weixin", "wxlogin");
	}

	public void wxShareText(String path) 
	{ 

		// 锟斤拷始锟斤拷锟�?锟侥憋拷锟斤拷锟斤拷锟斤拷锟�
		Log.i("weixin", "wxShareText"+path);
		WXTextObject textObj = new WXTextObject();
		textObj.text = path;
		
		// 锟斤拷WXTextObject锟斤拷锟斤拷锟绞硷拷锟揭伙拷锟絎XMediaMessage锟斤拷锟斤拷
		WXMediaMessage msg = new WXMediaMessage();
		msg.mediaObject = textObj;

		// 锟斤拷锟斤拷锟侥憋拷锟斤拷锟酵碉拷锟斤拷息时锟斤拷title锟街段诧拷锟斤拷锟斤拷锟斤拷
		// msg.title = "Will be ignored";
		msg.title = "锟斤拷锟斤拷锟斤拷锟街憋拷锟斤拷";
		msg.description = path;

		// 锟斤拷锟斤拷一锟斤拷Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("text"); // transaction锟街讹拷锟斤拷锟斤拷唯一锟斤拷识一锟斤拷锟斤拷锟斤拷
		req.message = msg;
		req.scene = SendMessageToWX.Req.WXSceneSession;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟斤拷圈锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷?锟斤拷锟斤拷圈
		// req.scene = SendMessageToWX.Req.WXSceneSession;//锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟窖对伙拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟�
		// req.scene = SendMessageToWX.Req.WXSceneTimeline;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟秸藏ｏ拷锟斤拷锟斤拷锟斤拷锟斤拷拥锟轿拷锟斤拷詹锟�
		// 锟斤拷锟斤拷api锟接口凤拷锟斤拷锟斤拷莸锟轿拷锟� 
		api.sendReq(req);
		Log.i("weixin", "wxShareText1"+path);
	}
	public void wxShareWebView(String url,String title,String description) 
	{ 

		// 锟斤拷始锟斤拷锟斤拷url锟斤拷锟斤拷锟斤拷锟�
						
		Log.i("weixin", "wxShareutl"+url);
		
		WXWebpageObject webpage = new WXWebpageObject();
		webpage.webpageUrl = url;
		
		// 锟斤拷WXTextObject锟斤拷锟斤拷锟绞硷拷锟揭伙拷锟絎XMediaMessage锟斤拷锟斤拷
		WXMediaMessage msg = new WXMediaMessage(webpage);
		msg.title = title;
		msg.description = description;
		// 锟斤拷锟斤拷锟侥憋拷锟斤拷锟酵碉拷锟斤拷息时锟斤拷title锟街段诧拷锟斤拷锟斤拷锟斤拷
		// msg.title = "Will be ignored";
		Bitmap thumb = BitmapFactory.decodeResource(getResources(), R.drawable.icon);
		msg.thumbData = bmpToByteArray(thumb, true);
		// 锟斤拷锟斤拷一锟斤拷Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage"); // transaction锟街讹拷锟斤拷锟斤拷唯一锟斤拷识一锟斤拷锟斤拷锟斤拷
		req.message = msg;
		req.scene = SendMessageToWX.Req.WXSceneSession;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟斤拷圈锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷?锟斤拷锟斤拷圈
		// req.scene = SendMessageToWX.Req.WXSceneSession;//锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟窖对伙拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟�
		// req.scene = SendMessageToWX.Req.WXSceneTimeline;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟秸藏ｏ拷锟斤拷锟斤拷锟斤拷锟斤拷拥锟轿拷锟斤拷詹锟�
		// 锟斤拷锟斤拷api锟接口凤拷锟斤拷锟斤拷莸锟轿拷锟� 
		api.sendReq(req);
		Log.i("weixin", "wxShareurl");
	}
	public void wxShareWebViewTimeline(String url,String title,String description) 
	{ 

		// 锟斤拷始锟斤拷锟斤拷url锟斤拷锟斤拷锟斤拷锟�
		
		
		Log.i("weixin", "wxShareutl_Timeline"+url);
		WXWebpageObject webpage = new WXWebpageObject();
		webpage.webpageUrl = url;
		
		// 锟斤拷WXTextObject锟斤拷锟斤拷锟绞硷拷锟揭伙拷锟絎XMediaMessage锟斤拷锟斤拷
		WXMediaMessage msg = new WXMediaMessage(webpage);
		msg.title = title;
		msg.description = description;
		// 锟斤拷锟斤拷锟侥憋拷锟斤拷锟酵碉拷锟斤拷息时锟斤拷title锟街段诧拷锟斤拷锟斤拷锟斤拷
		// msg.title = "Will be ignored";
		Bitmap thumb = BitmapFactory.decodeResource(getResources(), R.drawable.icon);
		msg.thumbData = bmpToByteArray(thumb, true);
		// 锟斤拷锟斤拷一锟斤拷Req
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("webpage"); // transaction锟街讹拷锟斤拷锟斤拷唯一锟斤拷识一锟斤拷锟斤拷锟斤拷
		req.message = msg;
		//req.scene = SendMessageToWX.Req.WXSceneSession;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟斤拷圈锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷?锟斤拷锟斤拷圈
		// req.scene = SendMessageToWX.Req.WXSceneSession;//锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟斤拷锟窖对伙拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟斤拷锟�
		req.scene = SendMessageToWX.Req.WXSceneTimeline;// 锟斤拷示锟斤拷锟酵筹拷锟斤拷为锟秸藏ｏ拷锟斤拷锟斤拷锟斤拷锟斤拷拥锟轿拷锟斤拷詹锟�
		// 锟斤拷锟斤拷api锟接口凤拷锟斤拷锟斤拷莸锟轿拷锟� 
		api.sendReq(req);
		Log.i("weixin", "wxShareurl_Timeline");
	}
	public void wxShareTexture(String path) 
	{ 
	   /*
	    * 微锟脚凤拷锟斤拷
	    * */
		Log.i("weixin","wxShareTexture");
		Bitmap bmp = BitmapFactory.decodeFile(path);
		float  scaleNumeber= bmp.getWidth() / 120f;
		float scaleHeight = bmp.getHeight() / scaleNumeber;
//		WXImageObject imgObj = new WXImageObject(bmp);
		
		WXMediaMessage msg = new WXMediaMessage();
//		msg.mediaObject = imgObj;
		msg.mediaObject = new WXImageObject( Bitmap.createScaledBitmap(bmp, 800, (int)(bmp.getHeight()/(bmp.getWidth() / 800.f)), true));

		Log.i("weixin","wxShareTexture"+scaleNumeber);
		Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, 120, (int)scaleHeight, true);
		bmp.recycle();
		msg.thumbData = bmpToByteArray(thumbBmp, true);  //锟斤拷锟斤拷锟斤拷锟斤拷图
		//msg.thumbData =thumbBmp;
		SendMessageToWX.Req req = new SendMessageToWX.Req();
		req.transaction = buildTransaction("img");
		req.message = msg;
		req.scene =  SendMessageToWX.Req.WXSceneSession;
		api.sendReq(req);
		Log.i("weixin","wxShareTexture");
		
	}
	public static byte[] bmpToByteArray(final Bitmap bmp, final boolean needRecycle) {
		ByteArrayOutputStream output = new ByteArrayOutputStream();
		bmp.compress(CompressFormat.JPEG, 80, output);
		if (needRecycle) {
			bmp.recycle();
		}
		
		byte[] result = output.toByteArray();
		try {
			output.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
	public static AppActivity ccActivity;  
	private String buildTransaction(final String type) {
		return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
	}
	public static void StartWxLogin()
	{
		if(ccActivity!=null)
		{
			ccActivity.wxLogin();
		}
	}
	public static void StartShareTextWxSceneSession(String path)
	{
		Log.i("weixin", "share");
		if(ccActivity!=null)
		{
			
			ccActivity.wxShareText(path);
		}
	}
	public static void StartShareWebViewWxSceneSession(String url,String title,String description)
	{
		if(ccActivity!=null)
		{
			ccActivity.wxShareWebView( url, title, description);
		}
	}
	public static void StartShareTextureWxSceneSession(String path)
	{
		if(ccActivity!=null)
		{
			ccActivity.wxShareTexture(path);
		}
	}
	public static void StartShareWebViewWxTimeline(String url,String title,String description)
	{
		if(ccActivity!=null)
		{
			ccActivity.wxShareWebViewTimeline( url, title, description);
		}
	}
/**
 * 上传文件
 * @param fileName {String} 文件名
 * @param url {String} 网址
 * @param eventName {String} 事件名称
 * */
	public static void uploadFile(final String fileName, final String url,final String eventName)
	{
		new Thread() {
			public void run() {
				httpClient http = new httpClient(fileName, url);
				http.uploadFile();
				Log.i("send:", "send successful");
				if (http.ok == 1)
				{
					ccActivity.RunJS(eventName, http.filePath);
				}
			}
		}.start();
	}

	/**
	 * 下载文件
	 * @param fileName {String} 文件名
	 * @param url {String} 网址
	 * @param eventName {String} 事件名称
	 * */
	public static void downLoadFile(final String filePath, final  String fileName,final String url,final String eventName)
	{
		new Thread() {
			public void run() {
				httpClient http = new httpClient(filePath, fileName, url);
				http.downLoadFile();
				Log.i("download:", "download successful");
				if (http.ok == 1)
				{
					ccActivity.RunJS(eventName, http.filePath);
				}
			}
		}.start();
	}

	public static String startRecord(String filePath, String nameString) {

		if (isStartRecording)
		{
			//如果已经录音则不开始新的录音线程
			return "";
		}
		//定义临时录音文件和mp3文件
//		String basePath = getFilesDir(ccActivity.getApplicationContext());
		String basePath = filePath;	// 路径改为上层传输

		tempFile = basePath +"." + "temp.raw";
		mp3Path = basePath  + nameString + ".mp3";
		//初始化录音
		initRecorder();
		//录音标记
		isRecording = true;
		isStartRecording = true;
		canSend = true;
		//开始录音
		try{
			mRecorder.startRecording();
		}
		catch(Exception e)
		{
			canSend = false;
			popAlert.showToast("您尚未开启语音权限", ccActivity);
			e.printStackTrace();
		}

		//获取临时录音文件File对象，对已存在的文件做删除处理
		File rawFile = new File(tempFile);
		if (rawFile.exists()) {
			rawFile.delete();
			try {
				rawFile.createNewFile();
			} catch (IOException e) {
				rawFile = null;
				e.printStackTrace();
			}
		}
		//录音数据读写
		ccActivity.startBufferedWrite(rawFile == null ? new File(tempFile) : rawFile);

		Log.i("fanjiaheTest", "startRecord" + tempFile + "||" + mp3Path);
		return mp3Path;
	}

	/**
	 * 关闭录音 js调用
	 */
	public static void endRecord(final String eventName) {

		if (!isStartRecording || !isRecording)
		{
			return;
		}
		//停止录音
		try {
			isRecording = false;
			mRecorder.stop();
			mRecorder.release();
			mRecorder = null;
		} catch (IllegalStateException e) {
			e.printStackTrace();
		}

		//将raw转换成mp3格式
		new Thread() {
			public void run() {
				FLameUtils lameUtils = new FLameUtils(1, 16000, 96);
				lameUtils.raw2mp3(tempFile, mp3Path);
				Log.i("record", "stopRecord" + tempFile + "||" + mp3Path);
				// 这里应该回调给js层 结束转换了
				ccActivity.RunJS(eventName, canSend ? mp3Path : null);
				isStartRecording = false;
			}
		}.start();
	}
	/**
	 * 获取|设置文件存储目录
	 * @param context
	 * @return
	 */
	public static String getFilesDir(Context context) {

		File targetDir = null;

		//sd卡判断
		if (Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED)) {
			// targetDir = context.getExternalFilesDir(null); // not support android 2.1
			targetDir = new File(Environment.getExternalStorageDirectory(), "Android/data/" + context.getApplicationInfo().packageName + "/files");
			if (!targetDir.exists()) {
				targetDir.mkdirs();
			}
		}

		if (targetDir == null || !targetDir.exists()) {
			targetDir = context.getFilesDir();
		}

		return targetDir.getPath();
	}

	/**
	 * 初始化AudioRecorder
	 */
	public static void initRecorder() {
		int bufferSize = AudioRecord.getMinBufferSize(16000, AudioFormat.CHANNEL_IN_MONO,
				AudioFormat.ENCODING_PCM_16BIT);
		mBuffer = new short[bufferSize];
		mRecorder = new AudioRecord(MediaRecorder.AudioSource.MIC, 16000, AudioFormat.CHANNEL_IN_MONO,
				AudioFormat.ENCODING_PCM_16BIT, bufferSize);
	}

	/**
	 * 向录音文件中写入数据
	 * @param file
	 */
	private void startBufferedWrite(final File file) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				DataOutputStream output = null;
				try {
					output = new DataOutputStream(new BufferedOutputStream(new FileOutputStream(file)));
					while (isRecording) {
						int readSize = mRecorder.read(mBuffer, 0, mBuffer.length);

//						for (int i = 0; i < readSize; i++) {
//							mBuffer[i] = (short)(mBuffer[i]  * 2);	// 更改录音时的声音大小
//						}
						for (int i = 0; i < readSize; i++) {
							output.writeShort(mBuffer[i]);
						}
					}
				} catch (IOException e) {
					Toast.makeText(AppActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
				} finally {
					if (output != null) {
						try {
							output.flush();
						} catch (IOException e) {
							Toast.makeText(AppActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
						} finally {
							try {
								output.close();
							} catch (IOException e) {
								Toast.makeText(AppActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
							}
						}
					}
				}
			}
		}).start();
	}
	
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ccActivity=this;
        
        //阿里盾初始化
  		int code = YunCeng.init(appKey_AliDun);
  		initAliDunCode = code;
        
		//http://stackoverflow.com/questions/8325395/avoiding-resuming-app-at-lock-screen
      
		//getWindow().setFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
		//getWindow().addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED | WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON);
        vibrato = new VibratorUtil();
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        regToWx();
        
        mlocationClient = new AMapLocationClient(this);
        //初始化定位参数
        mLocationOption = new AMapLocationClientOption();
      //设置定位监听
        mlocationClient.setLocationListener(this);
      //设置定位模式为高精度模式，Battery_Saving为低功耗模式，Device_Sensors是仅设备模式
        mLocationOption.setLocationMode(AMapLocationMode.Hight_Accuracy);
        //设置定位间隔,单位毫秒,默认为2000ms
        mLocationOption.setInterval(2000);
        //设置定位参数
        mlocationClient.setLocationOption(mLocationOption);
	 // 此方法为每隔固定时间会发起一次定位请求，为了减少电量消耗或网络流量消耗，
	 // 注意设置合适的定位时间的间隔（最小间隔支持为2000ms），并且在合适时间调用stopLocation()方法来取消定位请求
	 // 在定位结束后，在合适的生命周期调用onDestroy()方法
	 // 在单次定位情况下，定位无论成功与否，都无需调用stopLocation()方法移除请求，定位sdk内部会移除
	 //启动定位
        mlocationClient.startLocation();
        
//        String sha1 = sHA1(this);
//        Log.e("gaode", "广东麻将SHA1:" + sha1);
        
        
        // 处理声音房间管理
        final AVRoomCallback mAVRoomCallback = new AVRoomCallback()
		{
			public void OnGetInResult(int nResult, int nRoomKey)
			{
				
			}
			
			public void OnDisconnected(int nErrorCode)
			{
				
			}

			public void OnSendBroadcastTextMsgResult(int nResult, String strMsg, long nMsgSeq)
			{
				
			}
			
			public void OnRoomUsersUpdate(RoomUser[] arrNewUsers, RoomUser[] arrLeftUsers)
			{
				
				
			}
			
			public void OnRoomUserUpdateAll(RoomUser [] arrUsers)
			{
				
			}
			
			@SuppressLint("SimpleDateFormat")
			public void OnReceiveBroadcastTextMsg(TextMsg textMsg)
			{
				
			}
			
			public void OnSelfBeginTalking()
			{
				
			}
			
			public void OnSelfKeepTalking()
			{
				
			}
			
			public void OnSelfEndTalking()
			{
				
			}
			
			public void OnOthersBeginTalking(RoomUser roomUser)
			{
			
			}
			
			public void OnOthersKeepTalking(RoomUser roomUser)
			{
				
			}
			
			public void OnOthersEndTalking(RoomUser roomUser)
			{
			
			}
			
			
			public AuxData OnAuxCallback(int nLenData)
			{
               
				 return null;
			}
		    
		    public void OnRecorderCallback(byte buffer[], int bufLength, int sampleRate, int channels, int bitDepth)
			{
				/*Message message = new Message();
			     Bundle bundle = new Bundle();
			     bundle.putInt("event", EVENT_RECORD);
			     bundle.putInt("sampleRate", sampleRate);
			     bundle.putInt("channels", channels);
			     bundle.putInt("bitDepth", bitDepth);
			     message.setData(bundle);
			     mHandler.sendMessage(message);	*/
			}
		};
 		avRoom = new AVRoom();
 		avRoom.SetCallback(mAVRoomCallback);
     		
 		byte[] signkey = { 
 			(byte) 0x41, (byte) 0x50, (byte) 0x9c, (byte) 0xfc,
			(byte) 0x68, (byte) 0x21, (byte) 0x82, (byte) 0x80, (byte) 0x43,
			(byte) 0x92, (byte) 0x5e, (byte) 0xbc, (byte) 0x90, (byte) 0x22,
			(byte) 0xd8, (byte) 0x8f, (byte) 0x36, (byte) 0x7d,
			(byte) 0x9f, (byte) 0x1d, (byte) 0x10, (byte) 0x5a,
			(byte) 0xab, (byte) 0xc0, (byte) 0xb8, (byte) 0x2a,
			(byte) 0x0, (byte) 0x59, (byte) 0x33, (byte) 0xc8,
			(byte) 0x94, (byte) 0x8a
		};
     	
 		int appId = 1663975539;
 		avRoom.Init(appId, signkey, getApplicationContext()); // appid signkey
 		this.getApplicationContext();

    }
	
	@Override
    public Cocos2dxGLSurfaceView onCreateView() 
	{
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        
        return glSurfaceView;
    }


	@Override
	public void onLocationChanged(AMapLocation amapLocation) {
		// TODO Auto-generated method stub
		if (amapLocation != null) {
	        if (amapLocation.getErrorCode() == 0) {
	        //定位成功回调信息，设置相关消息
	        int locationType = amapLocation.getLocationType();//获取当前定位结果来源，如网络定位结果，详见定位类型表
	        double latitude = amapLocation.getLatitude();//获取纬度
	        double longitude = amapLocation.getLongitude();//获取经度
	        float accuracy = amapLocation.getAccuracy();//获取精度信息
	        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	        Date date = new Date(amapLocation.getTime());
	        df.format(date);//定位时间
	        
	        Log.e("gaode", "位置来源"+locationType+"纬度"+latitude+"经度"+longitude+"精确度"+accuracy);
	        //结束定位
	        mlocationClient.onDestroy();
	        
	        this.latitudePos = latitude;//纬度坐标
	    	this.longitudePos = longitude;//
	        
	        
	    } else {
	              //显示错误信息ErrCode是错误码，errInfo是错误信息，详见错误码表。
	        Log.e("AmapError","location Error, ErrCode:"
	            + amapLocation.getErrorCode() + ", errInfo:"
	            + amapLocation.getErrorInfo());
	        }
	    }
		
	}
	
	//获取纬度坐标
	public String getLatitude(){
		return this.latitudePos+"";
	}
	
	//获取经度坐标
	public String getLongitude(){
		return this.longitudePos+"";
	}
	
		
	//计算两点之间的距离
	public String calculateLineDistance(String latitude1, String longitude1, 
			String latitude2, String longitude2) {
		
		BigDecimal bLatitude1 = new BigDecimal(latitude1);
		double la1 =  bLatitude1.doubleValue();
		
		BigDecimal bLongitude1 = new BigDecimal(longitude1);
		double lo1 =  bLongitude1.doubleValue();
		
		BigDecimal bLatitude2 = new BigDecimal(latitude2);
		double la2 =  bLatitude2.doubleValue();
		
		BigDecimal bLongitude2 = new BigDecimal(longitude2);
		double lo2 =  bLongitude2.doubleValue();
		
		float distance = 0;
		
        LatLng start = new LatLng(la1, lo1);
		LatLng end = new LatLng(la2,lo2);
		distance = AMapUtils.calculateLineDistance(start, end);
		//保留小数点后1位
		DecimalFormat df = new DecimalFormat("0.0");
		String result = df.format(distance);
		
		Log.e("gaode","玩家A和玩家B之间的距离为："+ distance);
		
		return result;
		
	}
	
	
	
	//获取apk 对应的 sal值
	public static String sHA1(Context context) {
	    try {
	        PackageInfo info = context.getPackageManager().getPackageInfo(
	            context.getPackageName(), PackageManager.GET_SIGNATURES);
	        byte[] cert = info.signatures[0].toByteArray();
	        MessageDigest md = MessageDigest.getInstance("SHA1");
	        byte[] publicKey = md.digest(cert);
	        StringBuffer hexString = new StringBuffer();
	        for (int i = 0; i < publicKey.length; i++) {
	            String appendString = Integer.toHexString(0xFF & publicKey[i])
	                .toUpperCase(Locale.US);
	            if (appendString.length() == 1)
	                hexString.append("0");
	                hexString.append(appendString);
	                hexString.append(":");
	        }
	        return hexString.toString();
	    } catch (NameNotFoundException e) {
	        e.printStackTrace();
	    } catch (NoSuchAlgorithmException e) {
	        e.printStackTrace();
	    }
	    return null;
	}
	
	public static String CalculateDistance(String latitude1, String longitude1, 
			String latitude2, String longitude2){
		
		if(ccActivity!=null)
		{
			return ccActivity.calculateLineDistance(latitude1,longitude1,latitude2,longitude2);
		}
		
		return "0";
	}
	
	//获取纬度坐标
	public static String getLatitudePos(){
		return ccActivity.getLatitude();
	}
	
	//获取经度坐标
	public static String getLongitudePos(){
		return ccActivity.getLongitude();
	}

	
	public static void ShowLogOnJava(String str){
		Log.i("js log", str);
	}
	
	
	//通过 阿里盾 获取 IP
	public static String getRemoteIpByAliDun(String groupName){
		
		if(initAliDunCode !=0){
			int code = YunCeng.init(appKey_AliDun);
			initAliDunCode = code;
		}
		
		String nextIp = "";
  		String errorInfo = "errorCode:";
  		Log.i("Ali Dun", "---- groupName="+groupName);
  		if (initAliDunCode == 0) {
  			// 鍒濆鍖栨垚鍔�
  			try {
  				nextIp = YunCeng.getNextIpByGroupName(groupName);
  				errorInfo = "get next ip :" + nextIp;
  				
  				if(nextIp == null)
  				{
  					nextIp = "errorCode:null";
  				}
  				
  				ccActivity.RunJS("GetRemoteIpByAliDun_Back", nextIp);
  			} catch (YunCengException ex) {
  				// 寮傚父鐮�
  				//get next ip return exception code:  ex.getCode();
  				errorInfo += ex.getCode();
  				ccActivity.RunJS("GetRemoteIpByAliDun_Back", errorInfo);
  			}
  		} else {
  			// 鍒濆鍖栧け璐�
  			//init return exception code: initAliDunCode;
  			errorInfo += initAliDunCode;
  			ccActivity.RunJS("GetRemoteIpByAliDun_Back", errorInfo);
  		}
  		Log.i("Ali Dun", errorInfo);
		return nextIp;
	}
	
	public void signalAliDun(){
		Log.i("Ali Dun", "----signalAliDun() 01----");
		//ccActivity.RunJS_02("setAliDunSignal", "");
		
//		Cocos2dxGLSurfaceView.getInstance().queueEvent(new Runnable() {
//
//			@Override
//			public void run() {
//				// TODO Auto-generated method stub
//				String strFunc = "setAliDunSignal()";
//				Log.i("Ali Dun", "----signalAliDun 01----");
//				org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge.evalString(strFunc);
//				Log.i("Ali Dun", "----signalAliDun 02----");
//			}
//		});
	}
	
	//获取本地(非线上)apk版本
	public static String getAndroidApkVersion(){
		int currentVesionCode = 0;
		String versionName = "error:";
		PackageManager pm = ccActivity.getPackageManager();
		try{
			PackageInfo info = pm.getPackageInfo(ccActivity.getPackageName(), 0);
			currentVesionCode = info.versionCode;
			versionName = info.versionName;
			Log.i("apk info", "apk_VersionCode="+currentVesionCode);
			Log.i("apk info", "apk_VersionName="+versionName);
		} catch(NameNotFoundException e)
		{
			
		}
		ccActivity.RunJS("getAndroidApkVersion_back", versionName);
		return versionName;
	}
	
	
	/**
	 * 
	 * @param mStrID
	 *            玩家id
	 * @param mStrName
	 *            玩家昵称
	 * @param roomid
	 *            房间id -- tableid 需要js前段调用在游戏玩家到齐开始游戏时
	 */
	public static void JoinGameVoiceRoom(final String mStrID,
			final String mStrName, final String roomid) { // jni
		Log.i("--avroom", "110 JoinGameVoiceRoom");
		RoomUser roomUser = new RoomUser();		 
		roomUser.strID = mStrID;// 玩家id
		roomUser.strName = mStrName;// 玩家昵称
		Log.i("--avroom", "110 GetInRoom");
		
		avRoom.GetInRoom(Integer.parseInt(roomid), roomUser);
//		avRoom.EnableMic(false);
		voiceStop();
		
	}
	
	/**
	 * 房间说话
	 */
	public static void vioceStart() {
		Log.i("--vioceStart", "110 vioceStart");
		avRoom.EnableMic(true);// 开启mac
	}

	/**
	 * 房间停止说话
	 */
	public static void voiceStop() {
		Log.i("--voiceStop", "110 voiceStop");
		avRoom.EnableMic(false);// 开启mac
	}
	
	/**
	 * 玩家离开房间
	 */
	public static void leaveRoom() {
		Log.i("--leaveRoom", "110 leaveRoom");
		avRoom.LeaveRoom();
	}

	/**
	 * 玩家返回房间
	 */
	public static void returnRoom() {
		Log.i("--returnRoom", "110 returnRoom");
		avRoom.ReGetInRoom();
	}
}
