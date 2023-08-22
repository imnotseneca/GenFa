import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../features/auth/usersApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { Row, Col, Form, Card, Button, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../Components/Loader";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      const tokenFromResponse = await res.text();
      console.log(tokenFromResponse)
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || console.error(err));
    }
  };
  return (
    <>
      <Container className="d-flex flex-column align-items-center justify-content-center my-3 text-white ">
        <h1 className="text-bold text-center">Bienvenido a GenFa💸</h1>
        <p className="text-center">Aca vas a poder generar facturas y recibos para mandarle a los pibardos</p>
      </Container>
      <Form onSubmit={handleSubmit}>
        <Col
          lg={12}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <Col className="d-flex flex-column align-items-center justify-content-center my-2 text-white">
            <h1 className="text-center">
              <FaSignInAlt />
              Login
            </h1>
            <p className="text-center">
              Ingresá tus datos para empezar a facturar 💰
            </p>
          </Col>
          <Card
            className="d-flex p-4 p-xl-5 my-3 my-xl-4 mx-2"
            style={{ maxWidth: "1024px" }}
          >
            <Form.Floating className="mb-3">
              <Form.Control
                id="formEmail"
                type="email"
                placeholder="nombre@gmail.com:"
                name="email"
                value={email}
                onChange={handleChange}
              />
              <label htmlFor="formEmail">Dirección de e-mail:</label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <label htmlFor="formPassword">Contraseña:</label>
              <Form.Control
                id="formPassword"
                type="password"
                placeholder="*******"
                name="password"
                value={password}
                onChange={handleChange}
              />
            </Form.Floating>
            {isLoading && <Loader />}
            <Button variant="primary" type="submit">
              Ingresar
            </Button>
            <Row className="py-3 text-center">
              <Col>
                Todavía no tenés una cuenta?{" "}
                <Link to={`/register`} className="fw-bold">
                  Registrate aca.
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>
      </Form>
    </>
  );
}
