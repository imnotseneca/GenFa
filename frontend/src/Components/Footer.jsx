import { Container, Row } from "react-bootstrap";
import { TiSocialGithub, TiSocialLinkedin } from "react-icons/ti";
import { MdOutlineEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer>
      <hr />
      <Container
        fluid
        className="d-flex justify-content-center align-item-center"
      >
        <Row className="p-2">
          <a href="mailto:brunocorraodev@gmail.com">
            <MdOutlineEmail size={28} style={{ color: "#fff" }} url="" />
          </a>
        </Row>
        <Row className="p-2">
          <a href="https://www.linkedin.com/in/bruno-corrao/">
          <TiSocialLinkedin size={28} style={{ color: "#fff" }} url="" />
          </a>
        </Row>
        <Row className="p-2">
          <a href="https://github.com/imnotseneca">
          <TiSocialGithub size={28} style={{ color: "#fff" }} url="" />
          </a>
        </Row>
      </Container>
      <Container
        fluid
        className="d-flex justify-content-center align-item-center"
      >
        <Row className="p-2 text-align-center">
          <span style={{ color: "#fff" }}>
            <a href="https://www.linkedin.com/in/bruno-corrao/" style={{color:'#9d2929', paddingRight: '5px',  textDecoration: 'none'}}>Bruno Corrao</a>  
             @ All rights reserved.
          </span>
        </Row>
      </Container>
    </footer>
  );
}
