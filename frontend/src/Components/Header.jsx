import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("/api/v1/users/logout");

      if (response.status === 200) {
        dispatch(logout());
        navigate("/");
      } else {
        console.log("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  return (
    <header>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg" collapseOnSelect>
        <Container style={{ width: "min(90%,70.5rem)" }}>
          <Navbar.Brand className="logo" href="/" style={{ padding: "8px" }}>
            GenFa💸
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-navs">
            <Nav className="me-auto">
              {userInfo ? (
                <Container fluid className="d-flex align-items-center">
                  <NavDropdown
                    title={`${userInfo.firstName} ${userInfo.lastName}`}
                    id="username"
                    style={{
                      width: "100%",
                      fontWeight: "bold",
                    }}
                  >
                    <Container fluid className="d-flex align-items-center">
                      <FaUser size={24} />
                      <NavDropdown.Item href="/profile">
                        Perfil
                      </NavDropdown.Item>
                    </Container>
                    <hr />
                    <Container fluid className="d-flex align-items-center">
                      <BiLogOut size={28} />
                      <NavDropdown.Item href="/" onClick={handleLogout}>
                        <Navbar.Text>Deslogear</Navbar.Text>
                      </NavDropdown.Item>
                    </Container>
                  </NavDropdown>
                </Container>
              ) : (
                <>
                  {" "}
                  <Nav.Link href="/login" style={{ padding: "8px" }}>
                    <FaSignInAlt style={{ margin: "5px" }} />
                    Login
                  </Nav.Link>
                  <Nav.Link href="/register" style={{ padding: "8px" }}>
                    <FaSignOutAlt style={{ margin: "5px" }} />
                    Registro
                  </Nav.Link>{" "}
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
