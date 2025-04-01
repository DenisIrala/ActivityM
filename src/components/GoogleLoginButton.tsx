import React from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";


const GoogleLoginButton: React.FC = () => {
    const navigate = useNavigate();
    const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      console.log("API_BASE URL:", API_BASE);

  const handleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;

    // Decode the JWT token from Google
    const decoded: any = jwtDecode(credentialResponse.credential);
    console.log("Google User:", decoded);

    try {
      const res = await axios.post(`${API_BASE}/google-login`, {
        token: credentialResponse.credential,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.username);
        navigate("/home")
      } else {
        console.error("Login failed:", res.data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = () => {
    googleLogout();
    console.log("User logged out");
  };

  return (
    <div>
      <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Login Failed")} />

    </div>
  );
};

export default GoogleLoginButton;