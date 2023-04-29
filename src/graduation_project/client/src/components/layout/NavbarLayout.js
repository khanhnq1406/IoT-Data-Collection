import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import { AuthContext } from "../../contexts/AuthContext";
import { useContext, useState, useEffect } from "react";
import { apiUrl } from "../../contexts/constants";
import axios from "axios";
const NavbarLayout = (attribute) => {
  // Logout
  const {
    logoutUser,
    authState: { user },
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
            <Nav.Link eventKey="link-2">Node 2</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">Node 3</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">Node 4</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="link-3">Node 5</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="/alarm-table">Alarm</Nav.Link>
          </Nav.Item>
        </Nav>

        <div>
          <NavDropdown
            title={fullName}
            id="navbarScrollingDropdown"
            className="navUsername"
          >
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </div>
      </Container>
    </Navbar>
  );
};

export default NavbarLayout;
