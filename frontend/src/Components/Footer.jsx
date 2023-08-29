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
          <a
            href="mailto:brunocorraodev@gmail.com"
            alt="mail-link"
            aria-label="Find more about Bruno Corrao by email"
          >
            <MdOutlineEmail size={28} style={{ color: "#fff" }} url="" />
          </a>
        </Row>
        <Row className="p-2">
          <a
            href="https://www.linkedin.com/in/bruno-corrao/"
            alt="linkedin-link"
            aria-label="Find more about Bruno Corrao at Linkedin"
          >
            <TiSocialLinkedin size={28} style={{ color: "#fff" }} url="" />
          </a>
        </Row>
        <Row className="p-2">
          <a
            href="https://github.com/imnotseneca"
            alt="github-link"
            aria-label="Find more about Bruno Corrao at Github"
          >
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
            <a
              href="https://www.linkedin.com/in/bruno-corrao/"
              style={{
                color: "#b6b5c7",
                paddingRight: "5px",
                textDecoration: "none",
              }}
            >
              Bruno Corrao
            </a>
            @ All rights reserved.
          </span>
        </Row>
      </Container>
    </footer>
  );
}
