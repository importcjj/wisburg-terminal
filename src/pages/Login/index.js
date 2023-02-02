import React, { useState } from "react";
import { LockOutlined, UserOutlined, WechatOutlined } from "@ant-design/icons";
import { Button, Checkbox, Divider, Form, Input, message } from "antd";
import { useAuth } from "../../hooks/useAuth";
import { listen } from "@tauri-apps/api/event";
import { useNavigate } from "react-router-dom";
import { WebviewWindow } from "@tauri-apps/api/window";

import "./index.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const WECHAT_QRCODE = "https://open.weixin.qq.com/connect/qrconnect?appid=wxe7d39940a780faf7&redirect_uri=http%3A%2F%2Fwww.wisburg.com%2Fwechat.html%3Fredirect_to%3Dhttp%3A%2F%2Fwww.wisburg.com%2F?action=terminal-login&response_type=code&scope=snsapi_login&state=wx_login&style=white&href=data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDE2MHB4OyBtYXJnaW4tdG9wOiAyOHB4OyBib3JkZXItcmFkaXVzOiA4cHg7fQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtmb250LXdlaWdodDogNjAwO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjAwcHg7IG1hcmdpbi10b3A6IDI2cHh9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7IHBhZGRpbmc6IDA7fQ=="

const Login = () => {
  const [account, setAccount] = useLocalStorage("account", {});
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { login, authByToken } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    const unlisten = listen("wechat-login", (event) => {
      const { token } = event.payload;
      authByToken(token).then(user => {
        console.log(user)
        setTimeout(() => {
          navigate("/", { replace: true });
          const wechatWindow = WebviewWindow.getByLabel('wechat');
          wechatWindow.close();
        }, 1000);
      })
    })

    return () => {unlisten.then(f => f())}
  }, [])

  const openWechatLogin = () => {
    const mainWindow = WebviewWindow.getByLabel('main')
    mainWindow.hide();
    const wechatWindow = new WebviewWindow('wechat', { url: WECHAT_QRCODE, title: "微信扫码登录" });
    wechatWindow.once('tauri://destroyed', () => {mainWindow.show()});
  }

  const onFinish = (values) => {
    setLoading(true);
    login(values)
      .then(() => {
        if (values.remember) {
          setAccount(values);
        } else {
          setAccount({ remember: false });
        }
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      })
      .catch((e) => {
        setLoading(false);
        messageApi.open({
          type: "error",
          content: `登录失败: ${e}`,
        });
      })
      .finally(() => { });
  };
  return (
    <div className="login-box">
      {window.location.toString()}
      {contextHolder}
      {/* <iframe id="wechat-qrcode" allowtransparency="true" scrolling="no" frameBorder={0} height={300} width={200} style={{ overflow: "hidden" }} src="https://open.weixin.qq.com/connect/qrconnect?appid=wxe7d39940a780faf7&redirect_uri=https%3A%2F%2Fwww.wisburg.com%2Fwechat.html%3Fredirect_to%3Dhttps%3A%2F%2Fwww.wisburg.com%2F?action=terminal-login&response_type=code&scope=snsapi_login&state=wx_login&style=white&href=data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDE2MHB4OyBtYXJnaW4tdG9wOiAyOHB4OyBib3JkZXItcmFkaXVzOiA4cHg7fQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtmb250LXdlaWdodDogNjAwO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjAwcHg7IG1hcmdpbi10b3A6IDI2cHh9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7IHBhZGRpbmc6IDA7fQ==" /> */}
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
          ...account,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="phone_number"
          rules={[
            {
              required: true,
              message: "请输入账号",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="手机号"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "请输入密码!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <Button style={{width:'100%'}}
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            登录
          </Button>
          {/* Or <a href="">register now!</a> */}
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: "#fff" }}>记住我</Checkbox>
          </Form.Item>
        </Form.Item>


      </Form>

      <div className="login-methods">
        <a>第三方登录：</a>
        <WechatOutlined onClick={openWechatLogin} style={{color: "rgb(102,220, 120)"}}/>
      </div>
    </div>
  );
};

export default Login;
