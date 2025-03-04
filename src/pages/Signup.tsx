import React, { useState } from "react";
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (Object.values(errors).some((err) => err)) return;
    console.log("Signup successful:", formData);
    alert("Signup successful! (Simulated API Response)");
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
