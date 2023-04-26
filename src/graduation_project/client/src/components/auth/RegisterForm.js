const RegisterForm = () => {
  return (
    <div className="login">
      <img src={"images/manufacturer.png"} className="manufacturer"></img>
      <div className="center">
        <h1>Sign Up</h1>
        <form method="POST" action="/addUsers">
          <div class="txt_field">
            <input type="text" name="username" required />
            <span></span>
            <label>Username</label>
          </div>
          <div class="txt_field">
            <input type="password" name="password" required />
            <span></span>
            <label>Password</label>
          </div>
          <div class="txt_field">
            <input type="password" name="retypePassword" required />
            <span></span>
            <label>Confirm Password</label>
          </div>
          <input type="submit" value="Signup" />
          <div class="signup_link">
            Already a member? <a href="/login">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
