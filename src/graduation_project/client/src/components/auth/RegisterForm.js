import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/esm/Button";
import AlertMessage from "../layout/AlertMessage";
import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";
const RegisterForm = () => {
  const [alert, setAlert] = useState(null);
  function submitHandle(event) {
    event.preventDefault();
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const username = event.target.username.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;
    const role = event.target.role.value;
    if (confirmPassword != password) {
      setAlert({
        type: "danger",
        message: `Password confirmation doesn't match password`,
      });
      setTimeout(() => setAlert(null), 5000);
    } else {
      const confirm = window.confirm("Are you sure create new user?");
      if (confirm) {
        const response = axios.post(`${apiUrl}/database/createUser`, {
          firstName: firstName,
          lastName: lastName,
          username: username,
          password: password,
          role: role,
        });
        response.then((data) => {
          const errorCode = data.data;
          console.log(errorCode);
          if (errorCode != null) {
            if (errorCode.code == "23505") {
              setAlert({
                type: "danger",
                message: `Sorry, that username already exists!`,
              });
              setTimeout(() => setAlert(null), 5000);
            } else {
              setAlert({
                type: "danger",
                message: `Error: cannot create user`,
              });
              setTimeout(() => setAlert(null), 5000);
            }
          } else {
            setAlert({
              type: "info",
              message: `The user has been successfully created`,
            });
            setTimeout(() => setAlert(null), 5000);
          }
        });
      }
    }
  }
  return (
    <div>
      <Form onSubmit={submitHandle}>
        <div style={{ margin: "5px" }}>
          <div style={{ marginBottom: "10px" }}>
            <div>
              <AlertMessage info={alert} />
            </div>
            <Row>
              <Col>
                <Form.Label>
                  First Name<span class="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  required
                ></Form.Control>
              </Col>
              <Col>
                <Form.Label>
                  Last Name<span class="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  required
                ></Form.Control>
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <Row>
              <Col>
                <Form.Label>
                  Username<span class="required">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  required
                ></Form.Control>
              </Col>
              <Col>
                <Form.Label>
                  Role<span class="required">*</span>
                </Form.Label>
                <Form.Select name="role" required>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                  <option value="monitor">Monitor</option>
                </Form.Select>
              </Col>
            </Row>
          </div>
          <div style={{ marginBottom: "5px" }}>
            <Row>
              <Col>
                <Form.Label>
                  Password<span class="required">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  required
                ></Form.Control>
              </Col>
              <Col>
                <Form.Label>
                  Confirm Password<span class="required">*</span>
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                ></Form.Control>
              </Col>
            </Row>
          </div>
          <div
            style={{ position: "absolute", right: "10px", marginTop: "10px" }}
          >
            <Button type="submit" style={{}}>
              Create new user
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default RegisterForm;
