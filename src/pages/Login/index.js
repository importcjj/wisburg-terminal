import React, { useState } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useAuth } from "../../hooks/useAuth";

import "./index.css";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const Login = () => {
  const [account, setAccount] = useLocalStorage("account", {});
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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
      <iframe id="wechat-qrcode" allowtransparency="true" scrolling="no" frameBorder={0} height={300} width={200} style={{ overflow: "hidden" }} src="https://open.weixin.qq.com/connect/qrconnect?appid=wxe7d39940a780faf7&redirect_uri=https%3A%2F%2Fwww.wisburg.com%2Fwechat.html%3Fredirect_to%3Dhttps%3A%2F%2Fwww.wisburg.com%2F?action=terminal-login&response_type=code&scope=snsapi_login&state=wx_login&style=white&href=data:text/css;base64,LmltcG93ZXJCb3ggLnFyY29kZSB7d2lkdGg6IDE2MHB4OyBtYXJnaW4tdG9wOiAyOHB4OyBib3JkZXItcmFkaXVzOiA4cHg7fQ0KLmltcG93ZXJCb3ggLnRpdGxlIHtmb250LXdlaWdodDogNjAwO30NCi5pbXBvd2VyQm94IC5pbmZvIHt3aWR0aDogMjAwcHg7IG1hcmdpbi10b3A6IDI2cHh9DQouc3RhdHVzX2ljb24ge2Rpc3BsYXk6IG5vbmV9DQouaW1wb3dlckJveCAuc3RhdHVzIHt0ZXh0LWFsaWduOiBjZW50ZXI7IHBhZGRpbmc6IDA7fQ==" />
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
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox style={{ color: "#fff" }}>记住我</Checkbox>
          </Form.Item>
          {/*
        <a className="login-form-forgot" href="">
          Forgot password
        </a> */}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            登录
          </Button>
          {/* Or <a href="">register now!</a> */}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
