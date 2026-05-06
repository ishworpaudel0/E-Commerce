import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/storeHook";
import { loginUser } from "../store/slices/authSlice";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await dispatch(loginUser({ email, password }));
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>Sign In</h2>
      {error && (
        <div
          style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label
            htmlFor="email"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{ display: "block", marginBottom: "5px" }}
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            backgroundColor: loading ? "#9e9e9e" : "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            marginTop: "10px",
          }}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <div
        style={{ marginTop: "20px", textAlign: "center", fontSize: "0.9rem" }}
      >
        Don't have an account? <Link to="/register">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
