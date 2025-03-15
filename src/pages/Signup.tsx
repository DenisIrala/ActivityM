import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UsernameInput from "../components/UsernameInput";
import PasswordInput from "../components/PasswordInput";
import EmailInput from "../components/EmailInput";
import ConfirmPasswordInput from "../components/ConfirmPasswordInput";
import SubmitButton from "../components/SubmitButton";

import "../css/Auth.css";

type SignupFormData = {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
};

const Signup = () => {
  const [formData, setFormData] = useState<SignupFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<SignupFormData>>({});
  const [signupError, setSignupError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "username" && value.length < 3)
      error = "Username must be at least 3 characters long.";
    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value))
      error = "Enter a valid email address.";
    if (name === "password" && value.length < 6)
      error = "Password must be at least 6 characters long.";
    if (name === "confirmPassword" && value !== formData.password)
      error = "Passwords do not match.";

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
      console.log("API_BASE URL:", API_BASE);

      const response = await axios.post(`${API_BASE}/register`, {
        username: formData.username,
        pass: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      console.log("Signup successful:", response.data);
      navigate("/home"); // Redirect after successful signup
    } catch (error: any) {
      if (error.response) {
        setSignupError(error.response.data.error);
      } else {
        setSignupError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        <UsernameInput
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
        />
        <EmailInput
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />
        <ConfirmPasswordInput
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />
        {signupError && <p className="error-message">{signupError}</p>}

        <SubmitButton
          text="Create Account"
          disabled={Object.values(errors).some((err) => err)}
        />

        <div className="login-link">
          <p>
            Already a member?{" "}
            <a href="/" className="redirect-link">
              Login
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
