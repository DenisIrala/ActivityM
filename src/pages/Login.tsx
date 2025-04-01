import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UsernameInput from "../components/UsernameInput";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

import "../css/Auth.css";
import GoogleLoginButton from "../components/GoogleLoginButton";

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  useEffect(() => {
    document.title = "ActivityM";
    // You can also include cleanup logic if needed
    return () => {
      document.title = ""; // Reset title on unmount (optional)
    };
  }, []);

  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [loginError, setLoginError] = useState<string | null>(null);

  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "username" && value.length < 3)
      error = "Must be at least 3 characters.";
    if (name === "password" && value.length < 6)
      error = "Must be at least 6 characters.";
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      console.log("API_BASE URL:", API_BASE);

      const response = await axios.post(`${API_BASE}/login`, {
        username: formData.username,
        pass: formData.password,
      });

      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      //  console.log(response.data.token);
      // console.log(response.data.username);
      localStorage.setItem("username", response.data.username);

      navigate("/home"); // Redirect after successful login
    } catch (error: any) {
      if (error.response) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit} noValidate>
        <UsernameInput
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        {loginError && <p className="error-message">{loginError}</p>}{" "}
        <SubmitButton
          text="Login"
          disabled={Object.values(errors).some((err) => err)}
        />
        <button className="google-btn" disabled>
          <img src="/google-icon.webp" alt="Google icon" />
          Continue with Google
        </button>
        <GoogleLoginButton/>
        <div className="signup-link">
          <p>
            Not a member yet?{" "}
            <a href="/signup" className="redirect-link">
              Sign up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
