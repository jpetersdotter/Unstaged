import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterView.css";

function RegisterView() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");

  const [triedRegister, setTriedRegister] = useState(false);
  const [registerFailed, setRegisterFailed] = useState(false);
  const [registerSucceeded, setRegisterSucceeded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function register() {
    setTriedRegister(true);
    setRegisterFailed(false);
    setRegisterSucceeded(false);
    setErrorMessage("");

    if (!username || !password || !passwordAgain) {
      setRegisterFailed(true);
      setErrorMessage("Please fill in all fields");
      return;
    }

    if (password !== passwordAgain) {
      setRegisterFailed(true);
      setErrorMessage("Passwords must match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.status === 409) {
        setRegisterFailed(true);
        setErrorMessage("Username already exists");
        return;
      }

      if (!response.ok) {
        setRegisterFailed(true);
        setErrorMessage("Something went wrong");
        return;
      }

      setRegisterSucceeded(true);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch {
      setRegisterFailed(true);
    }
  }

  return (
    <div id="RegisterView">
      <h1 className="main_title">Create account</h1>

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
      />

      <input
        type="password"
        placeholder="Enter Password Again"
        value={passwordAgain}
        onChange={(event) => setPasswordAgain(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            register();
          }
        }}
      />

      <button onClick={register}>Register</button>
      <button onClick={() => navigate("/login")}>Back</button>

      {registerFailed && triedRegister && <p>{errorMessage}</p>}

      {registerSucceeded && <p>You are registered! Redirecting to login...</p>}
    </div>
  );
}

export default RegisterView;
