import { useState } from "react";
import React, { useEffect } from "react";
import { Layout, Button, Input } from "antd";
import { useNavigate } from "react-router-dom";
import {
  EyeOutlined,
  EyeInvisibleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import "./welcome.css";
import axios from "axios";
import {
  storeToken,
  isUserLoggedIn,
  getCurrentUserRole,
} from "../TokenManagement/tokenUtils";
const { Header, Content, Footer } = Layout;

export default function Welcome() {
  const [isLogin, setLogin] = useState(false);
  const [isSignin, setSignin] = useState(false);
  const [isHome, setHome] = useState(true);
  const [isAdmin, setAdmin] = useState(false);
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [showSignupPasswordConfirm, setShowSignupPasswordConfirm] =
    useState(false);
  const navigate = useNavigate();

  function signFunc() {
    setHome(false);
    setAdmin(false);
    setLogin(false);
    setSignin(true);
  }

  function logFunc() {
    setHome(false);
    setAdmin(false);
    setSignin(false);
    setLogin(true);
  }

  function AdminFunc() {
    setHome(false);
    setSignin(false);
    setLogin(false);
    setAdmin(true);
  }

  function navigateFunc() {
    navigate("/home");
  }

  function handleOwnerLogin() {
    if (!adminName || !adminPassword) {
      setErrorMessage("Please enter both username and password.");
      return;
    }
    axios
      .post(" http://localhost:5000/login/owner", {
        username: adminName,
        password: adminPassword,
      })
      .then((response) => {
        console.log("owner login successful", response.data);
        storeToken(response.data.userId, response.data.token, "owner");
        navigate("/owner-dashboard");
      })
      .catch((error) => {
        console.log("owner login failed");
        setErrorMessage(error.response?.data?.msg || "Login failed");
      });
  }

  function handleCustomerLogin() {
    if (!loginName || !loginPassword) {
      setErrorMessage("Please enter both email and password.");
      return;
    }
    console.log(loginName, loginPassword);

    axios
      .post("http://localhost:5000/login/customer", {
        name: loginName,
        password: loginPassword,
      })
      .then((response) => {
        console.log("customer login successful", response.data);
        storeToken(response.data.userId, response.data.token, "customer");
        navigateFunc();
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.msg || "Login failed");
      });
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function handleCustomerSignup() {
    if (
      !signupName ||
      !signupPassword ||
      !signupEmail ||
      !signupPasswordConfirm
    ) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!isValidEmail(signupEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (signupPassword !== signupPasswordConfirm) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    axios
      .post("http://localhost:5000/register/customer", {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      })
      .then((response) => {
        //  setErrorMessage("Sign up successful! You can now log in.");
        setSignin(false);
        setLogin(true);
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.msg || "Sign up failed");
      });
  }

  useEffect(() => {
    setErrorMessage(null); // Reset error message
  }, [isLogin]);
  useEffect(() => {
    setErrorMessage(null); // Reset error message
  }, [isSignin]);
  useEffect(() => {
    setErrorMessage(null); // Reset error message
  }, [isAdmin]);

  useEffect(() => {
    if (isUserLoggedIn()) {
      const role = getCurrentUserRole();
      if (role === "owner") {
        navigate("/owner-dashboard");
      } else if (role === "customer") {
        navigate("/home");
      }
    }
  }, [navigate]);

  return (
    <Layout>
      <Header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          margin: 0,
        }}
      >
        <h1 style={{ textAlign: "center", color: "white" }}> Pet Store </h1>
      </Header>
      <Content style={{ padding: "0 43px" }}>
        <h2>Welcome to the Pet store</h2>
        <div
          style={{
            padding: 26,
            paddingBottom: 40,
            paddingLeft: 830,
            minHeight: 700,
            backgroundImage:
              'url("https://www.phoenixmag.com/wp-content/uploads/2022/01/cute-pets-1280x720.jpg")',
          }}
        >
          <div
            className="sized-div"
            style={{
              backgroundImage: `url(https://www.shutterstock.com/image-photo/kitten-jumping-isolated-on-white-260nw-56474257.jpg)`,
              backgroundSize: "50% 25%",
              backgroundPosition: "bottom right",
              backgroundRepeat: "no-repeat",
            }}
          >
            {isHome && (
              <>
                <Button
                  size="large"
                  style={{
                    marginTop: "8px",
                    marginLeft: "22px",
                    position: "relative",
                    fontSize: "16px",
                  }}
                  onClick={() => {
                    setAdminName("");
                    setAdminPassword("");
                    AdminFunc();
                  }}
                >
                  Admin Login
                </Button>
                <h2 style={{ marginTop: 40 }}>Please Sign up or Log in</h2>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "60px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={() => {
                    setSignupEmail("");
                    setSignupName("");
                    setSignupPassword("");
                    setSignupPasswordConfirm("");
                    signFunc();
                  }}
                >
                  Sign Up
                </Button>
                <h2
                  style={{
                    marginTop: "50px",
                    marginLeft: "30px",
                  }}
                >
                  OR
                </h2>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={() => {
                    setLoginName("");
                    setLoginPassword("");
                    logFunc();
                  }}
                >
                  Log in
                </Button>
              </>
            )}
            {isLogin && (
              <>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    setLoginName("");
                    setLoginPassword("");
                    setHome(true);
                    setLogin(false);
                  }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "16px",
                  }}
                />
                <h2 style={{ marginTop: 40 }}>Log In</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <label style={{ marginTop: "60px", marginRight: "230px" }}>
                  Name :
                </label>
                <Input
                  placeholder="Name"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  style={{ marginTop: "20px", margin: "10px" }}
                />
                <label style={{ marginTop: "40px", marginRight: "200px" }}>
                  Password :
                </label>
                <Input
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  type={showLoginPassword ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showLoginPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    />
                  }
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={handleCustomerLogin}
                >
                  Log in
                </Button>
                <p
                  style={{
                    marginTop: "30px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                >
                  Not registered?
                </p>
                <Button
                  type="default"
                  size="small"
                  style={{
                    marginTop: "10px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={() => {
                    setLoginName("");
                    setLoginPassword("");
                    signFunc();
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isSignin && (
              <>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    setSignupName("");
                    setSignupEmail("");
                    setSignupPassword("");
                    setSignupPasswordConfirm("");
                    setHome(true);
                    setSignin(false);
                  }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "16px",
                  }}
                />
                <h2>Sign Up</h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <label style={{ marginTop: "20px", marginRight: "225px" }}>
                  Name :
                </label>
                <Input
                  placeholder="Name"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  style={{ marginTop: "10px", margin: "10px" }}
                />
                <label style={{ marginTop: "40px", marginRight: "210px" }}>
                  Password :
                </label>
                <Input
                  placeholder="Password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  type={showSignupPassword ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showSignupPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    />
                  }
                />
                <label style={{ marginTop: "40px", marginRight: "150px" }}>
                  Confirm Password :
                </label>
                <Input
                  placeholder="Confirm Password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  type={showSignupPasswordConfirm ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showSignupPasswordConfirm ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() =>
                        setShowSignupPasswordConfirm(!showSignupPasswordConfirm)
                      }
                    />
                  }
                />
                <label style={{ marginTop: "40px", marginRight: "230px" }}>
                  Email :
                </label>
                <Input
                  placeholder="Email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  style={{ marginTop: "50px", margin: "10px" }}
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "20px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={handleCustomerSignup}
                >
                  Sign Up
                </Button>
              </>
            )}

            {isAdmin && (
              <>
                <Button
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => {
                    setHome(true);
                    setAdmin(false);
                  }}
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    fontSize: "16px",
                  }}
                />
                <h2 style={{ marginTop: 80, marginBottom: 40 }}>
                  Admin Log In
                </h2>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                <label style={{ marginTop: "80px", marginRight: "230px" }}>
                  Name :
                </label>
                <Input
                  placeholder="Name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  style={{ marginTop: "20px", margin: "10px" }}
                />
                <label style={{ marginTop: "60px", marginRight: "200px" }}>
                  Password :
                </label>
                <Input
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  type={showAdminPassword ? "text" : "password"}
                  style={{ marginTop: "50px", margin: "10px" }}
                  addonAfter={
                    <Button
                      type="text"
                      icon={
                        showAdminPassword ? (
                          <EyeInvisibleOutlined />
                        ) : (
                          <EyeOutlined />
                        )
                      }
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    />
                  }
                />
                <Button
                  type="primary"
                  size="large"
                  style={{
                    marginTop: "60px",
                    marginLeft: "28px",
                    position: "relative",
                  }}
                  onClick={handleOwnerLogin}
                >
                  Log in
                </Button>
              </>
            )}
          </div>
        </div>
      </Content>
      <Footer>
        <p>Triton industries©</p>
        <p>contact : talha.asgher222@gmail.com</p>
      </Footer>
    </Layout>
  );
}
