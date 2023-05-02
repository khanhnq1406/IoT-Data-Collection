import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PageNotFound from "../components/layout/404";
import NavbarLayout from "../components/layout/NavbarLayout";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/esm/Table";
import Form from "react-bootstrap/Form";
import DropDown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import AlertMessage from "../components/layout/AlertMessage";
import RegisterForm from "../components/auth/RegisterForm";
const Admin = () => {
  const {
    authState: { role },
  } = useContext(AuthContext);
  const [currentPageData, setCurrentPage] = useState({
    totalPages: null,
    pageData: null,
    pageNumbers: [],
    pageSize: 10,
    currentPage: 1,
  });
  const { totalPages, pageData, pageNumbers, pageSize, currentPage } =
    currentPageData;
  const [key, setKey] = useState("users");
  const [users, setUsers] = useState();
  function setUser() {
    const Users = axios.get(`${apiUrl}/database/getUsers`);
    Users.then((users) => {
      setUsers(users.data);
      Pagination(users.data);
    });
  }
  useEffect(() => {
    setUser();
  }, []);
  useEffect(() => {
    setUser();
  }, [key]);
  const Pagination = (data) => {
    // Calculate the total number of pages
    const totalPagesValue = Math.ceil(data.length / pageSize);
    // Calculate the starting and ending index for the current page
    const startIndex = (Number(currentPage) - 1) * Number(pageSize);
    const endIndex = Number(startIndex) + Number(pageSize);
    // Get the data for the current page
    const currentPageValue = data.slice(startIndex, endIndex);
    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      totalPages: totalPagesValue,
      pageData: currentPageValue,
    }));

    renderPageNumbers();
  };

  function handlePageSize(e) {
    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      currentPage: 1,
      pageSize: e.target.value,
    }));
  }

  // Render the page numbers
  const renderPageNumbers = () => {
    const pageNumbersValue = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbersValue.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      pageNumbers: pageNumbersValue,
    }));
  };

  const [alert, setAlert] = useState(null);

  // Edit username
  const editUsername = (event, username) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure change username?");
    if (confirm) {
      const usernameInput = event.target.elements.editUsername.value;
      const response = axios.post(`${apiUrl}/database/editUsername`, {
        data: usernameInput,
        username: username,
      });
      response.then((data) => {
        const errorCode = data.data;
        console.log(errorCode);
        if (errorCode != null) {
          setAlert({
            type: "danger",
            message: `Error: username "${usernameInput}" is already exist`,
          });
          setTimeout(() => setAlert(null), 5000);
        } else {
          setAlert({
            type: "success",
            message: `Username changed!`,
          });
          setTimeout(() => setAlert(null), 5000);
          setUser();
        }
      });
    }
  };

  // Edit password
  const editPassword = (event, username) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure change password?");
    if (confirm) {
      const newPassword = event.target.elements.newPassword.value;
      const confirmPassword = event.target.elements.confirmPassword.value;
      if (newPassword !== confirmPassword) {
        setAlert({
          type: "danger",
          message: `Password confirmation doesn't match password`,
        });
        setTimeout(() => setAlert(null), 5000);
      } else {
        const response = axios.post(`${apiUrl}/database/editPassword`, {
          data: newPassword,
          username: username,
        });
        response.then((data) => {
          const errorCode = data.data;
          if (errorCode != null) {
            setAlert({
              type: "danger",
              message: `Error: Cannot change password`,
            });
            setTimeout(() => setAlert(null), 5000);
          } else {
            setAlert({
              type: "success",
              message: `Password changed!`,
            });
            setTimeout(() => setAlert(null), 5000);
          }
        });
      }
    }
  };

  // Edit first name
  const editFirstName = (event, username) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure change first name?");
    if (confirm) {
      const newFirstName = event.target.elements.newFirstName.value;
      const response = axios.post(`${apiUrl}/database/editFirstName`, {
        data: newFirstName,
        username: username,
      });
      response.then((data) => {
        const errorCode = data.data;
        console.log(errorCode);
        if (errorCode != null) {
          setAlert({
            type: "danger",
            message: `Error: Cannot change first name`,
          });
          setTimeout(() => setAlert(null), 5000);
        } else {
          setAlert({
            type: "success",
            message: `First name changed!`,
          });
          setTimeout(() => setAlert(null), 5000);
          setUser();
        }
      });
    }
  };

  // Edit last name
  const editLastName = (event, username) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure change last name?");
    if (confirm) {
      const newLastName = event.target.elements.newLastName.value;
      const response = axios.post(`${apiUrl}/database/editLastName`, {
        data: newLastName,
        username: username,
      });
      response.then((data) => {
        const errorCode = data.data;
        if (errorCode != null) {
          setAlert({
            type: "danger",
            message: `Error: Cannot change last name`,
          });
          setTimeout(() => setAlert(null), 5000);
        } else {
          setAlert({
            type: "success",
            message: `Last name changed!`,
          });
          setTimeout(() => setAlert(null), 5000);
          setUser();
        }
      });
    }
  };

  // Edit role
  const editRole = (role, username) => {
    const response = axios.post(`${apiUrl}/database/editRole`, {
      data: role,
      username: username,
    });
    const confirm = window.confirm("Are you sure change role?");
    if (confirm)
      response.then((data) => {
        const errorCode = data.data;
        if (errorCode != null) {
          window.alert("Error: cannot change role");
        } else {
          window.alert("Role changed!");
          setUser();
        }
      });
  };

  function deleteUser(username) {
    const confirm = window.confirm(`Are you sure delete user "${username}"?`);
    if (confirm) {
      const response = axios.post(`${apiUrl}/database/deleteUser`, {
        username: username,
      });
      response.then((data) => {
        const errorCode = data.data;
        if (errorCode != null) {
          window.alert("Error: cannot delete user");
        } else {
          window.alert("User deleted!");
          setUser();
        }
      });
    }
  }
  return (
    <>
      {role == "admin" ? (
        <div style={{ backgroundColor: "#eff2f7", paddingBottom: "360px" }}>
          <NavbarLayout />
          <div>
            <h3 style={{ margin: "5px" }}>Admin page</h3>
            <div style={{ margin: "5px" }}>
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="users" title="Users">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>
                          <div style={{ marginLeft: "10px" }}>Username</div>
                        </th>
                        <th>
                          <div style={{ marginLeft: "10px" }}>Password</div>
                        </th>
                        <th>
                          <div style={{ marginLeft: "10px" }}>First Name</div>
                        </th>
                        <th>
                          <div style={{ marginLeft: "10px" }}>Last Name</div>
                        </th>
                        <th>
                          <div style={{ marginLeft: "10px" }}>Role</div>
                        </th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData != undefined ? (
                        pageData.map((item) => (
                          <tr key={item.username}>
                            <td style={{ display: "flex" }}>
                              <div>
                                <DropDown>
                                  <DropDown.Toggle
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "0px",
                                      color: "#000000",
                                    }}
                                  >
                                    {item.username}
                                  </DropDown.Toggle>
                                  <DropDown.Menu>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "270px",
                                      }}
                                    >
                                      <Form
                                        style={{
                                          margin: "5px",
                                          display: "flex",
                                        }}
                                        onSubmit={(event) =>
                                          editUsername(event, item.username)
                                        }
                                      >
                                        <Form.Control
                                          placeholder="New username"
                                          type="text"
                                          name="editUsername"
                                        ></Form.Control>

                                        <Button
                                          style={{
                                            marginLeft: "10px",
                                            marginRight: "5px",
                                          }}
                                          type="submit"
                                        >
                                          Submit
                                        </Button>
                                      </Form>
                                    </div>
                                    <div style={{ margin: "5px" }}>
                                      <AlertMessage info={alert} />
                                    </div>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </td>
                            <td>
                              <div>
                                <DropDown>
                                  <DropDown.Toggle
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "0px",
                                      color: "#000000",
                                    }}
                                  >
                                    ***
                                  </DropDown.Toggle>
                                  <DropDown.Menu>
                                    <div>
                                      <Form
                                        onSubmit={(event) =>
                                          editPassword(event, item.username)
                                        }
                                      >
                                        <div
                                          style={{
                                            margin: "5px",
                                          }}
                                        >
                                          <Form.Control
                                            placeholder="New password"
                                            type="password"
                                            style={{
                                              marginBottom: "5px",
                                            }}
                                            name="newPassword"
                                          ></Form.Control>
                                          <Form.Control
                                            placeholder="Confirm password"
                                            type="password"
                                            style={{
                                              width: "180px",
                                            }}
                                            name="confirmPassword"
                                          ></Form.Control>
                                        </div>
                                        <Button
                                          style={{
                                            marginLeft: "5px",
                                          }}
                                          type="submit"
                                        >
                                          Submit
                                        </Button>
                                      </Form>
                                    </div>
                                    <div style={{ margin: "5px" }}>
                                      <AlertMessage info={alert} />
                                    </div>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </td>
                            <td>
                              <div>
                                <DropDown>
                                  <DropDown.Toggle
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "0px",
                                      color: "#000000",
                                    }}
                                  >
                                    {item.first_name}
                                  </DropDown.Toggle>
                                  <DropDown.Menu>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "270px",
                                      }}
                                    >
                                      <Form
                                        style={{
                                          margin: "5px",
                                          display: "flex",
                                        }}
                                        onSubmit={(event) =>
                                          editFirstName(event, item.username)
                                        }
                                      >
                                        <Form.Control
                                          placeholder="New first name"
                                          name="newFirstName"
                                        ></Form.Control>

                                        <Button
                                          style={{
                                            marginLeft: "10px",
                                            marginRight: "5px",
                                          }}
                                          type="submit"
                                        >
                                          Submit
                                        </Button>
                                      </Form>
                                    </div>
                                    <div style={{ margin: "5px" }}>
                                      <AlertMessage info={alert} />
                                    </div>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </td>
                            <td>
                              <div>
                                <DropDown>
                                  <DropDown.Toggle
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "0px",
                                      color: "#000000",
                                    }}
                                  >
                                    {item.last_name}
                                  </DropDown.Toggle>
                                  <DropDown.Menu>
                                    <div
                                      style={{
                                        display: "flex",
                                        width: "270px",
                                      }}
                                    >
                                      <Form
                                        style={{
                                          margin: "5px",
                                          display: "flex",
                                        }}
                                        onSubmit={(event) =>
                                          editLastName(event, item.username)
                                        }
                                      >
                                        <Form.Control
                                          placeholder="New last name"
                                          name="newLastName"
                                        ></Form.Control>

                                        <Button
                                          style={{
                                            marginLeft: "10px",
                                            marginRight: "5px",
                                          }}
                                          type="submit"
                                        >
                                          Submit
                                        </Button>
                                      </Form>
                                    </div>
                                    <div style={{ margin: "5px" }}>
                                      <AlertMessage info={alert} />
                                    </div>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </td>
                            <td>
                              <div>
                                <DropDown>
                                  <DropDown.Toggle
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "0px",
                                      color: "#000000",
                                    }}
                                  >
                                    {item.role}
                                  </DropDown.Toggle>
                                  <DropDown.Menu>
                                    <DropDown.Item
                                      onClick={() =>
                                        editRole("admin", item.username)
                                      }
                                    >
                                      admin
                                    </DropDown.Item>
                                    <DropDown.Item
                                      onClick={() =>
                                        editRole("operator", item.username)
                                      }
                                    >
                                      operator
                                    </DropDown.Item>
                                    <DropDown.Item
                                      onClick={() =>
                                        editRole("monitor", item.username)
                                      }
                                    >
                                      monitor
                                    </DropDown.Item>
                                  </DropDown.Menu>
                                </DropDown>
                              </div>
                            </td>
                            <td>
                              <div>
                                <Button
                                  style={{
                                    backgroundColor: "transparent",
                                    border: "0px",
                                  }}
                                  onClick={() => deleteUser(item.username)}
                                >
                                  <img
                                    src="/images/cancel.png"
                                    style={{ width: "20px" }}
                                  ></img>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </tbody>
                  </Table>
                  <div>
                    {pageData != null ? (
                      <div style={{ display: "flex" }}>
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            left: "5%",
                          }}
                        >
                          <div>Page</div>
                          <select
                            style={{ marginLeft: "5px", marginRight: "5px" }}
                            value={currentPage}
                            onChange={(e) =>
                              setCurrentPage((currentPageData) => ({
                                ...currentPageData,
                                currentPage: e.target.value,
                              }))
                            }
                          >
                            {pageNumbers}
                          </select>
                          <div>of {totalPages}</div>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            right: "5%",
                          }}
                        >
                          <div>Items per page</div>
                          <select
                            style={{ marginLeft: "5px" }}
                            value={pageSize}
                            onChange={handlePageSize}
                          >
                            <option value="10">10</option>
                            <option value="15">15</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </Tab>
                <Tab eventKey="newUser" title="New user">
                  <RegisterForm />
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      ) : (
        <>
          <PageNotFound></PageNotFound>
        </>
      )}
    </>
  );
};

export default Admin;
