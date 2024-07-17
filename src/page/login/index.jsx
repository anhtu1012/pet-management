/* eslint-disable react/no-unknown-property */
import { Link, useNavigate } from "react-router-dom";
import "./index.scss";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      console.log("Google user credential: ", credential);

      await loginUserNam({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        token: token,
        role: "user",
      });
      navigate("/");
    } catch (error) {
      console.log("Google login error: ", error);
    }
  };

  const loginUserNam = async (user) => {
    try {
      const res = await axios.post(
        "https://662a755267df268010a405bf.mockapi.io/Diamond",
        user
      );
      console.log("User saved: ", res.data);
    } catch (error) {
      console.error("Error saving user: ", error);
    }
  };

  const handleLoginWithUsername = async () => {
    try {
      const res = await axios.get(
        "https://662a755267df268010a405bf.mockapi.io/Diamond"
      );
      const users = res.data;

      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        if (user.role === "admin") {
          navigate("/pet-management");
        } else {
          navigate("/");
        }
      } else {
        console.error("Invalid username or password");
        alert("Invalid username or password");
      }
    } catch (error) {
      console.error("Error logging in with username: ", error);
    }
  };

  return (
    <div className="login">
      <div className="wrapper">
        <div className="login_logo">
          <Link to="/">
            <img
              src="https://tiemcuapet.com/wp-content/uploads/2023/11/Tiem-cua-pet-20.png"
              width={200}
              alt=""
            />
          </Link>
        </div>
        <div className="line"></div>
        <div className="login_form">
          <h3>Login into your account</h3>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLoginWithUsername}>Login</button>
          <button className="login_google" onClick={handleLogin}>
            <img
              src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png"
              width={30}
              alt=""
            />
            <span>Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
