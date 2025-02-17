import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("accessToken", data.accessToken);
        navigate("/settings");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Form
        onSubmit={handleSubmit}
        className="p-4 border rounded bg-white shadow"
      >
        <h2 className="mb-4 text-center">Login</h2>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <Button color="primary" type="submit" block>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
