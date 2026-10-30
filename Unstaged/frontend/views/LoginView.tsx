import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginView.css";

interface User {
  id: number;
  username: string;
  password: string;
}

function LoginView() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [triedLogin, setTriedLogin] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  async function login() {
    setTriedLogin(true);

    try {
      const response = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        setLoginFailed(true);
        return;
      }

      const user: User = await response.json();

      sessionStorage.setItem("currentUser", JSON.stringify(user));

      setLoginFailed(false);

      navigate("/reviews");
    } catch {
      setLoginFailed(true);
    }
  }

  return (
    <div id="LoginView">
      <h1 className="main_title">Unstaged</h1>

      <input
        type="text"
        placeholder="Enter Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            login();
          }
        }}
      />

      <button onClick={login}>Login</button>
      <button onClick={() => navigate("/register")}>Register</button>

      {loginFailed && triedLogin && <p>Incorrect username or password</p>}
    </div>
  );
}

export default LoginView;
