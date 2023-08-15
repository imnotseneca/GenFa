import { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { Col, Form, Card, Button, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../features/auth/authSlice";
import Loader from "../Components/Loader";
import { useUpdateProfileMutation } from "../features/auth/usersApiSlice";
import { useNavigate } from "react-router-dom";

export default function Profile() {
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

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
    }));
  }, [userInfo.firstName, userInfo.lastName]);

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
        const res = await updateProfile({
          _id: userInfo._id,
          firstName,
          lastName,
          email,
          password,
          career,
          university,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/profile");
        toast.success("Usuario actualizado con éxito!");
      } catch (error) {
        toast.error(error?.data.message || error.error);
      }
    }
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-white">
      <Container>
        <h1 className="text-center mt-2">Datos de tu perfil:</h1>
      </Container>
      <Card className="d-flex flex-column justify-content-center align-items-center my-3" style={{width: 'min(90%, 40.5rem)'}}>
        <Card.Img
          variant="top"
          src="https://img.freepik.com/free-icon/user_318-644324.jpg"
          style={{ width: "100px", height: "100px" }}
          className="my-2"
        />
        <Card.Body>
          <Card.Title className="text-center">
            {userInfo.firstName} {userInfo.lastName}
          </Card.Title>
          <Card.Text>
            Email: <strong>{userInfo.email}</strong>
          </Card.Text>
          <Card.Text>
            Carrera: <strong>{userInfo.career}</strong>
          </Card.Text>
          <Card.Text>
            Universidad: <strong>{userInfo.university}</strong>
          </Card.Text>
        </Card.Body>
      </Card>
      <hr />
      <Form onSubmit={handleSubmit}>
        <Col
          lg={12}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <Container fluid>
            <Col className="d-flex flex-column align-items-center justify-content-center my-2">
              <h1 className="text-center">
                <FaUserEdit />
                Actualizar perfil
              </h1>
              <p className="fw-bold text-center mt-3">
                Ingresá tus datos y actualizá tu usuario 🧑.
              </p>
            </Col>
          </Container>
          <hr />
          <Container fluid>
            <Card className="d-flex p-4 p-xl-5 my-3 my-xl-4 mx-2">
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
                  placeholder="Contraseña"
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
                  placeholder="Confirmar contraseña"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <label htmlFor="formPassword">Confirmar contraseña:</label>
              </Form.Floating>
              {isLoading && <Loader />}
              <Button variant="primary" type="submit">
                Actualizar usuario
              </Button>
            </Card>
          </Container>
        </Col>
      </Form>
    </div>
  );
}
