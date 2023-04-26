import { AuthContext } from "../../contexts/AuthContext";
import { useState, useContext } from "react";
import AlertMessage from "../layout/AlertMessage";

const LoginForm = () => {
  // Context
  const { loginUser } = useContext(AuthContext);

  // Local state
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });

  const [alert, setAlert] = useState(null);

  const { username, password } = loginForm;

  const onChangeLoginForm = (event) =>
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });

  const login = async (event) => {
    event.preventDefault();

    try {
      const loginData = await loginUser(loginForm);
      if (!loginData.success) {
        setAlert({ type: "danger", message: loginData.message });
        setTimeout(() => setAlert(null), 5000);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="login">
      <img src={"images/manufacturer.png"} className="manufacturer"></img>
      <div className="center">
        <AlertMessage info={alert} />
        <h1>Login</h1>
        <form onSubmit={login}>
          <div className="txt_field">
            <input
              type="text"
              name="username"
              required
              value={username}
              onChange={onChangeLoginForm}
            />
            <span></span>
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              name="password"
              required
              value={password}
              onChange={onChangeLoginForm}
            />
            <span></span>
            <label>Password</label>
          </div>
          <div className="pass">Forgot Password?</div>
          <input type="submit" value="Login" />
          <div className="signup_link">
            Not a member?
            <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
