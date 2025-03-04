import React, { useState } from "react";
import UsernameInput from "../components/UsernameInput";
import PasswordInput from "../components/PasswordInput";
import SubmitButton from "../components/SubmitButton";

import "../css/Auth.css";

type LoginFormData = {
  username: string;
  password: string;
};

const Login = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "username" && value.length < 3)
      error = "Username must be at least 3 characters long.";
    if (name === "password" && value.length < 6)
      error = "Password must be at least 6 characters long.";
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) return;
    console.log("Login successful:", formData);
    alert("Login successful! (Simulated API Response)");
  };

  return (
    <div className="auth-container">
      <h1>Login</h1>
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
        <SubmitButton
          text="Login"
          disabled={Object.values(errors).some((err) => err)}
        />
        <div className="signup-link">
          <p>
            Not a member yet?{" "}
            <a href="/signup" className="redirect-link">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
