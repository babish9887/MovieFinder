import React, { useState } from "react";
import login from "./css/login.module.css";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

function Login() {
  const [status, setstatus] = useState(true);
  const navigate = useNavigate();
  async function handleSubmit() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });
      const resdata = await res.json();
      if (resdata.status === "Fail") {
        return setstatus(false);
      }
      Cookies.set("jwt", resdata.token, { expires: 3 });
      toast.success(resdata.message);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (e) {
      toast.error(e.message);
    }
  }
  function handledatachange() {
    setstatus(true);
  }
  return (
    <div className={login.main}>
      <div className={login.container}>
        <h1>User Login</h1>
        <input
          type="text"
          placeholder="Email"
          id="email"
          onChange={handledatachange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          onChange={handledatachange}
          required
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        {!status && (
          <p style={{ color: "red", alignSelf: "start", fontSize: "1.2rem" }}>
            Credentials doesnot match
          </p>
        )}
        <div className={login.forgotpassword}>
          <Link to="/forgotpassword">
            <button className={login.fp} style={{ fontSize: "1.2rem" }}>
              Forgot Password?
            </button>
          </Link>
        </div>
        <button className={login.submit} onClick={handleSubmit}>
          Login
        </button>
        <span style={{ fontSize: "1.2rem" }}>
          Don't have an account?{" "}
          <Link to="/signup">
            <button
              id="signup"
              className={login.signup}
              style={{ fontSize: "1.2rem" }}
            >
              Signup
            </button>{" "}
          </Link>
        </span>
      </div>
    </div>
  );
}
export default Login;
