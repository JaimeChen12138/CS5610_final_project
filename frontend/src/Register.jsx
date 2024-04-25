import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./Register.css";

export default function Register() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [verifyPasswordState, setVerifyPasswordState] = useState("");

  const [error, setErrorValue] = useState("");
  const navigate = useNavigate();

  function setUsername(event) {
    const username = event.target.value;
    setUsernameInput(username);
  }

  function setPassword(event) {
    const pswd = event.target.value;
    setPasswordInput(pswd);
  }

  function updateVerifyPassword(event) {
    setVerifyPasswordState(event.target.value);
  }

  async function submit() {
    setErrorValue("");

    if (!passwordInput || !usernameInput || !verifyPasswordState) {
      setErrorValue("You should input all the information correctly !");
      return;
    }

    // verify password
    if (passwordInput !== verifyPasswordState) {
      setErrorValue("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post("/api/users/register", {
        username: usernameInput,
        password: passwordInput,
      });
      // console.log(response.data);
      if (response.data && response.data.username) {
        localStorage.setItem("activeUsername", response.data.username);
        window.dispatchEvent(new Event("storageUpdated"));
        navigate("/");
      } else {
        setErrorValue("Invalid response from server");
      }
    } catch (e) {
      setErrorValue(e.response.data);
    }
    // console.log(usernameInput, passwordInput);
  }

  return (
    <div className="register-container">
      <h1>Register</h1>
      {!!error && <h2>{error}</h2>}
      <div>
        <span>Username: </span>
        <input type="text" value={usernameInput} onInput={setUsername}></input>
      </div>
      <div>
        <span>Password: </span>
        <input type="text" value={passwordInput} onInput={setPassword}></input>
      </div>
      <div>
        <span>Verify Password: </span>
        <input
          type="text"
          value={verifyPasswordState}
          onInput={updateVerifyPassword}
        ></input>
      </div>

      <button onClick={submit}>Create Account</button>
    </div>
  );
}
