import { useState, useEffect } from "react";
import API from "../services/Api";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  /* 🔥 READ QUERY PARAM */
  useEffect(() => {
    const mode = searchParams.get("mode");
    setIsLogin(mode !== "signup"); // signup → false
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : {
            username: form.username,
            email: form.email,
            password: form.password
          };

      const res = await API.post(endpoint, payload);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
      window.location.reload(); // update navbar state
    } catch (err) {
      alert(err.response?.data?.message || "Authentication failed");
    }
  };

  /* 🔁 TOGGLE + UPDATE URL */
  const toggleMode = () => {
    const nextIsLogin = !isLogin;
    setIsLogin(nextIsLogin);
    navigate(nextIsLogin ? "/auth" : "/auth?mode=signup");
  };

  return (
    <div className="container mt-5 pt-5" style={{ maxWidth: 400 }}>
      <h3 className="text-center mb-3">
        {isLogin ? "Login" : "Sign Up"}
      </h3>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            className="form-control mb-2"
            placeholder="Username"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            required
          />
        )}

        <input
          type="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
          required
        />

        <button className="btn btn-danger w-100">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>

      <p className="text-center mt-3">
        {isLogin ? "New user?" : "Already have an account?"}
        <span
          className="text-primary ms-2"
          style={{ cursor: "pointer" }}
          onClick={toggleMode}
        >
          {isLogin ? "Sign Up" : "Login"}
        </span>
      </p>
    </div>
  );
}
