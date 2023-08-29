import { Container, Form, Col, Card, Row, Button } from "react-bootstrap";
import { useNavigate, Link, useParams } from "react-router-dom";
import Footer from "../Components/Footer";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    password: "",
  });

  const baseUrl =
    import.meta.env.VITE_APP_ENV === "production"
      ? import.meta.env.VITE_APP_PROD_BACK_URL
      : import.meta.env.VITE_APP_DEV_BACK_URL;

  const navigate = useNavigate();
  const { id, token } = useParams();

  const { password } = formData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios
        .post(`${baseUrl}/api/v1/users/resetPassword/${id}/${token}`, {
          password,
        })
        .then((res) => {
          console.log(res.data.Status);
          if (res.data.Status === "Success") {
            toast.success("Contraseña actualizada con exito!");
            navigate("/login");
          }
        });
    } catch (error) {
      toast.error(error);
    }
  };
  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      <Container className="d-flex flex-column align-items-center justify-content-center my-3 text-white ">
        <h1 className="text-bold text-center">Bienvenido a GenFa💸</h1>
        <p className="text-center">
          Para continuar ingresá una nueva contraseña:
        </p>
      </Container>
      <Form onSubmit={handleSubmit}>
        <Col
          lg={12}
          className="d-flex flex-column align-items-center justify-content-center"
        >
          <Card
            className="d-flex p-4 p-xl-5 my-3 my-xl-4 mx-2"
            style={{ maxWidth: "1024px" }}
          >
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
            <Button variant="primary" type="submit">
              Actualizar
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
      <Footer />
    </>
  );
}
