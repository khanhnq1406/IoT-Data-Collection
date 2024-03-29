import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { apiUrl, homeUrl } from "../../contexts/constants";
import axios from "axios";
const NavbarLayout = (attribute) => {
  // Logout
  const {
    logoutUser,
    authState: { user, role },
  } = useContext(AuthContext);
  const logout = () => logoutUser();
  // Get fullname
  const [info, getInfo] = useState({
    fullName: "",
  });
  const { fullName } = info;
  const getFullName = async () => {
    const response = await axios.get(`${apiUrl}/database/getfullname`, {
      params: {
        username: user,
      },
    });
    const fullName =
      response.data[0].first_name + " " + response.data[0].last_name;
    getInfo({
      fullName,
    });
  };
  useEffect(() => {
    getFullName();
  }, []);
  return (
    <Navbar variant="dark" className="navbar">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src="images/data.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Data Collection System
        </Navbar.Brand>

        <Nav
          variant="pills"
          defaultActiveKey={attribute.defActiveKey}
          className="navItems"
        >
          <Nav.Item>
            <Nav.Link href="/overview">Overview</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/node1">Node 1</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/node2">Node 2</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/node3">Node 3</Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link href="/node4">Node 4</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/node5">Node 5</Nav.Link>
          </Nav.Item> */}
          <div>
            <NavDropdown title="Table">
              <NavDropdown.Item href="/alarm-table">
                Alarm Table
              </NavDropdown.Item>
              <NavDropdown.Item href="/data-table">Data Table</NavDropdown.Item>
            </NavDropdown>
          </div>
        </Nav>

        <div>
          <NavDropdown
            title={fullName}
            id="navbarScrollingDropdown"
            className="navUsername"
          >
            {role == "admin" ? (
              <div>
                <NavDropdown.Item href="admin">Admin page</NavDropdown.Item>
                <NavDropdown.Divider></NavDropdown.Divider>
              </div>
            ) : (
              <></>
            )}
            <NavDropdown.Item onClick={logout} href={homeUrl}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarLayout;
