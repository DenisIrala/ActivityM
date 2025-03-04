import React, { useState } from "react";
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

    if (name === "username" && value.length < 3) {
      error = "Username must be at least 3 characters long.";
    }

    if (name === "password" && value.length < 6) {
      error = "Password must be at least 6 characters long.";
    }

    if (name === "confirmPassword" && value !== formData.password) {
      error = "Passwords do not match.";
    }

    if (name === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      error = "Enter a valid email address.";
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate input field on change
    validateField(name, value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Final validation before submission
    const newErrors: Partial<SignupFormData> = {};
    Object.entries(formData).forEach(([key, value]) => {
      validateField(key, value);
      if (errors[key as keyof SignupFormData]) {
        newErrors[key as keyof SignupFormData] =
          errors[key as keyof SignupFormData];
      }
    });

    if (Object.values(newErrors).some((err) => err)) {
      setErrors(newErrors);
      return;
    }

    console.log("Signup successful:", formData);
    alert("Signup successful! (Simulated API Response)");
  };

  return (
    <div className="auth-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={Object.values(errors).some((err) => err)}
        >
          Create Account
        </button>

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
