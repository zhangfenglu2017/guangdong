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
package com.happyplay.gxmj.wxapi;

import java.io.BufferedOutputStream;
import java.io.DataOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.ParseException;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.cocos2dx.javascript.AppActivity;
import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxHelper;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;

import com.loopj.android.http.HttpGet;
import com.tencent.mm.sdk.openapi.*;
import com.tencent.mm.sdk.modelbase.BaseReq;
import com.tencent.mm.sdk.modelbase.BaseResp;
import com.tencent.mm.sdk.modelmsg.*;

import android.util.Log;

public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		AppActivity.ccActivity.api.handleIntent(getIntent(), this);
		finish();
		Log.i("weixin", "onCreate");
	}

	@Override
	protected void onNewIntent(Intent intent) {
		super.onNewIntent(intent);
		setIntent(intent);

		AppActivity.ccActivity.api.handleIntent(intent, this);
		finish();
		Log.i("weixin", "onNewIntent");
	}

	@Override
	public void onReq(BaseReq arg0) {
		Log.i("weixin", "onReq");
	}

	public void startAsyncWorkWithWXLoginSuccess(String str) {
		new AsyncWork(new Runnable() {
			String code;

			public Runnable setjs(String js) {
				this.code = js;
				return this;
			}

			@Override
			public void run() {

				Log.i("weixin", "errCode==0");
				/*
				 * �û�ͬ��
				 */

				String strResult;
				String uriAPI = "https://api.weixin.qq.com/sns/oauth2/access_token?appid="
						+ AppActivity.AppID
						+ "&secret="
						+ AppActivity.AppSecret
						+ "&code="
						+ code
						+ "&grant_type=authorization_code"; // ������ַ�ַ�
				HttpPost httpRequest = new HttpPost(uriAPI); // ����HTTP POST����
				List<NameValuePair> params = new ArrayList<NameValuePair>(); // Post�������ͱ���������NameValuePair[]���鴢��
				HttpResponse httpResponse;

				try {
					httpRequest
							.setEntity((HttpEntity) new UrlEncodedFormEntity(
									params, HTTP.UTF_8));
					httpResponse = new DefaultHttpClient().execute(httpRequest);
					Log.i("weixin", httpResponse.getStatusLine()
							.getStatusCode() + "");

					strResult = EntityUtils.toString(httpResponse.getEntity());
					/*
					 * ͨ������token�ٴ�����΢���û���Ϣ
					 */
					// ����һ��JSON����
					Log.i("weixin", strResult);
					JSONObject jsonObject = new JSONObject(strResult);
					String openid = (String) jsonObject.get("openid");
					String access_token = (String) jsonObject
							.get("access_token");
					// ��ȡĳ�������JSON����

					Log.i("weixin", openid);
					String serverURL = "https://api.weixin.qq.com/sns/userinfo?access_token="
							+ access_token + "&openid=" + openid;
					Log.i("weixin", "http1");

					HttpGet gHttpRequest = new HttpGet(serverURL);// ����http
																	// get����
					Log.i("weixin", "http");
					HttpResponse gHttpResponse = new DefaultHttpClient()
							.execute(gHttpRequest);// ����http����
					Log.i("weixin", gHttpResponse.getStatusLine()
							.getStatusCode() + "get");

					if (gHttpResponse.getStatusLine().getStatusCode() == 200) {

						String userinfo = EntityUtils.toString(
								gHttpResponse.getEntity(), HTTP.UTF_8);// ��ȡ��Ӧ���ַ�
						Log.i("weixin", userinfo);
						JSONObject jsonNickName = new JSONObject(userinfo);
						String nickname = (String) jsonNickName.get("nickname");
						ChineseMessage message = new ChineseMessage();
						message.write(nickname, "nickname");
						RunJS("WX_USER_LOGIN", userinfo);
					}

					Log.i("weixin", "strResult");

				} catch (Exception e) {
					// TODO Auto-generated catch block
					
					RunJS("WX_USER_LOGIN", "{errCode:" + code + "}");
					e.printStackTrace();
				} // ����http����

			}

		}.setjs(str)).execute();
	}

	@Override
	public void onResp(BaseResp arg0) {
		String   classname = "com.tencent.mm.sdk.modelmsg.SendMessageToWX.Resp";
		//com.tencent.mm.sdk.modelmsg.SendAuth$Resp
		Log.i("weixin", arg0.getClass().getCanonicalName());
		if(classname.equals(arg0.getClass().getCanonicalName()))
		{
			Log.i("weixin", arg0.getClass().getName());
		}else if (arg0.errCode == 0) {
			String code = ((SendAuth.Resp) arg0).code;
			startAsyncWorkWithWXLoginSuccess(code);
		} else {
			Log.i("weixin", "errCode==-4");
			/*
			 * �û��ܾ���Ȩ
			 */
			RunJS("WX_USER_LOGIN", "{errCode:" + arg0.errCode + "}");
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
				org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge.evalString("cc.eventManager.dispatchCustomEvent('"
								+ js + "'," + para + " )");
				
			}

			public Runnable setjs(String js, String pa) {
				this.js = js;
				this.para = pa;
				return this;
			}

		}).setjs(name, param));
	}
	/*��������Ϣ���浽sdcard��*/

	public class ChineseMessage
	{
	 public  void write(String s,String name)
	 {
		 
	
	  try 
	  { 
	  FileOutputStream  outStream = new FileOutputStream(Cocos2dxHelper.getCocos2dxWritablePath()+"/"+name+".txt");
	   DataOutputStream out=new DataOutputStream(  
	              new BufferedOutputStream(  
	            		  outStream)); 
	   out.write(s.getBytes("UTF-8"));
	   out.flush();
	   out.close();//�ǵùر�
	   outStream.close();
	  } 
	  catch (Exception e)
	  {
	   Log.e("m", "file write error");
	  } 
	 }
	}
	private class AsyncWork extends AsyncTask<Object, Object, Object> {

		java.lang.Runnable task;

		public AsyncWork(java.lang.Runnable _task) {
			super();
			task = _task;
		}

		@Override
		protected Object doInBackground(Object... params) {
			task.run();
			return null;
		}
	}
}
