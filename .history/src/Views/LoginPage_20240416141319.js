import React, { useState, useEffect } from "react";
import "./LoginPage.css";
import { Input, Checkbox, Button, notification } from "antd";
import {
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import imageSrc from "../assets/big__1_-removebg.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  // 使用useState追踪用户名、密码和记住密码复选框的状态
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // 当组件挂载时，检查localStorage中是否有保存的用户名和密码
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedPassword = localStorage.getItem("password");
    if (savedUsername && savedPassword) {
      setUsername(savedUsername);
      setPassword(savedPassword);
      setRememberMe(true); // 如果我们从localStorage中获取到了信息，自动勾选记住密码
    }
  }, []);

  // const handleLogin = () => {
  //   // 使用正则表达式来检查密码是否为6-16位字母和数字的组合
  //   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
  //   if (!passwordRegex.test(password)) {
  //     notification.error({
  //       message: "登录失败",
  //       description: "密码必须是6-16位字母和数字的组合。",
  //       duration: 2.5,
  //     });
  //     return; // 如果密码格式不正确，提前退出函数
  //   }

  //   console.log(username, password);
  //   navigate("/home");

  //   if (rememberMe) {
  //     localStorage.setItem("username", username);
  //     localStorage.setItem("password", password);
  //   } else {
  //     localStorage.removeItem("username");
  //     localStorage.removeItem("password");
  //   }
  // };

  const handleLogin = async () => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/;
    if (!passwordRegex.test(password)) {
      notification.error({
        message: "登录失败",
        description: "密码必须是6-16位字母和数字的组合。",
        duration: 2.5,
      });
      return; // 如果密码格式不正确，提前退出函数
    }

    // 准备请求参数
    const loginDetails = {
      userName: username,
      password: password,
    };

    // 发起登录请求
    try {
      const response = await fetch(
        "https://n58mgwvs5a83.hk1.xiaomiqiu123.top/MedicalStaff/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
        }
      );

      const data = await response.json(); // 解析JSON数据

      if (response.ok) {
        console.log(data); // 日志记录，实际应用中可移除
        localStorage.setItem("userId", data.data.id); // 保存用户ID
        console.log(data.data.id);

        if (rememberMe) {
          localStorage.setItem("username", username);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("username");
          localStorage.removeItem("password");
        }

        navigate("/home"); // 登录成功后导航到主页
      } else {
        throw new Error(data.message || "登录失败");
      }
    } catch (error) {
      notification.error({
        message: "登录错误",
        description: error.message,
        duration: 2.5,
      });
    }
  };

  // 更新状态的函数
  const onUsernameChange = (e) => setUsername(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);
  const onRememberMeChange = (e) => setRememberMe(e.target.checked);

  return (
    <>
      <div className="backgroudImg"></div>

      <div className="container">
        <div className="nav">
          <img src={imageSrc} className="imgIcon" />
          <p>智慧养老院健康管理系统</p>
        </div>
        <div className="content">
          <div className="fieldset">
            <p className="loginText">登录</p>
            <Input
              value={username}
              onChange={onUsernameChange}
              placeholder="请输入用户名"
              size="large"
              variant="filled"
              prefix={<UserOutlined />}
              className="inputStyle"
            />
            <Input.Password
              value={password}
              onChange={onPasswordChange}
              placeholder="请输入密码(6-16位字母加数字)"
              prefix={<LockOutlined />}
              size="large"
              variant="filled"
              className="inputStyle"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <div style={{ marginBottom: 30 }}>
              <Checkbox checked={rememberMe} onChange={onRememberMeChange}>
                记住密码
              </Checkbox>
            </div>
            <Button
              onClick={handleLogin}
              type="primary"
              size="large"
              className="buttonBig"
            >
              登录
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
