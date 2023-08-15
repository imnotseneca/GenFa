import { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Col, Form, Card, Button, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../Components/Loader";
import { useRegisterMutation } from "../features/auth/usersApiSlice";
import { toast } from "react-toastify";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    career: "",
    university: "",
    password: "",
    confirmPassword: "",
  });

  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    career,
    university,
  } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

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
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden!");
    } else {
      try {
        const res = await register({
          firstName,
          lastName,
          email,
          password,
          career,
          university,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Usuario creado con éxito!')
        navigate("/");
      } catch (err) {
        toast.error(err?.data?.message || err.console.error());
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Col lg={12} className="d-flex flex-column align-items-center justify-content-center">
        <Col className="d-flex flex-column align-items-center justify-content-center my-2 text-white">
          <h1 className="">
            <FaUser />
            Registro
          </h1>
          <p className="fw-bold text-center">Ingresá tus datos y creá un usuario 🧑</p>
        </Col>
        <Card className="d-flex p-4 p-xl-5 my-3 my-xl-4 mx-2" style={{"maxWidth": '1024px'}}>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formFirstName"
              type="text"
              placeholder="Nombre:"
              name="firstName"
              value={firstName}
              onChange={handleChange}
            />
            <label htmlFor="formName">Nombre:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formLastName"
              type="text"
              placeholder="Agustin"
              name="lastName"
              value={lastName}
              onChange={handleChange}
            />
            <label htmlFor="formName">Apellido:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formEmail"
              type="email"
              placeholder="agustinvita@gmail.com"
              name="email"
              value={email}
              onChange={handleChange}
            />
            <label htmlFor="formEmail">Dirección de e-mail:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formCareer"
              type="text"
              placeholder="Medicina"
              name="career"
              value={career}
              onChange={handleChange}
            />
            <label htmlFor="formEmail">Carrera:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formUniversity"
              type="text"
              placeholder="Universidad Naciona de La Plata"
              name="university"
              value={university}
              onChange={handleChange}
            />
            <label htmlFor="formEmail">Universidad:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formPassword"
              type="password"
              placeholder="********"
              name="password"
              value={password}
              onChange={handleChange}
            />
            <label htmlFor="formPassword">Contraseña:</label>
          </Form.Floating>
          <Form.Floating className="mb-3">
            <Form.Control
              id="formConfirmPassword"
              type="password"
              placeholder="********"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
            <label htmlFor="formPassword">Confirmar contraseña:</label>
          </Form.Floating>
          {isLoading && <Loader />}
          <Button variant="primary" type="submit">
            Crear usuario
          </Button>
          <Row className="py-3 text-center">
            <Col>
              Ya tenés una cuenta? <Link to={`/login`} className="fw-bold">Ingresa aca.</Link>
            </Col>
          </Row>
        </Card>
      </Col>
    </Form>
  );
}
