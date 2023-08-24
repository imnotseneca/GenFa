/* eslint-disable react/prop-types */
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { BiCloudDownload } from "react-icons/bi";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Container, Button, CloseButton } from "react-bootstrap";

// jsPDF DOCS - > https://artskydj.github.io/jsPDF/docs/jsPDF.html

export default function InvoiceModal(props) {
  const newInvoiceData = {
    invoiceTo: props.info.billTo,
    invoiceFrom: props.info.billFrom,
    reason: props.items[0].name,
    description: props.items[0].description,
    quantity: props.items[0].quantity,
    price: props.items[0].price,
    receptorID: props.info.receptorID,
  };

  const GenerateInvoice = async () => {
    html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [412, 1012],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Factura_${props.info.billTo}_${new Date().toLocaleDateString()}.pdf`
      );
    });

    props.handlePostInvoice(newInvoiceData);
  };
  return (
    <div>
      <Modal
        show={props.showModal}
        onHide={props.closeModal}
        aria-labelledby="contained-modal-title-vcenter"
        size="md"
        centered
        style={{ padding: "0" }}
      >
        <Container className="bg-light p-0 d-flex justify-content-end">
          <CloseButton
            aria-label="close button"
            onClick={props.closeModal}
            className="p-2"
          />
        </Container>
        <div
          id="invoiceCapture"
          className="d-flex-md flex-column justify-conte nt-between align-items-start bg-light w-100 p-4"
        >
          <div className="d-flex flex-row align-items-center bg-light w-100 p-4">
            <div className="w-100">
              <h4 className="fw-bold my-2">
                {props.info.billFrom || "John Uberbacher"}
              </h4>
              <h6 className="fw-bold text-secondary mb-1">
                Factura #: {props.info.invoiceNumber || ""}
              </h6>
            </div>
            <div className="text-end ms-4">
              <h6 className="fw-bold mt-1 mb-2">Monto&nbsp;adeudado:</h6>
              <h5 className="fw-bold text-secondary">
                {" "}
                {props.info.currency} {props.total}
              </h5>
            </div>
          </div>
          <div className="p-4">
            <Container className="mb-4">
              <Col md={12}>
                <h5 className="fw-bold">Facturado&nbsp;a:</h5>
                <p>
                  <strong>Nombre:</strong> {props.info.billTo || ""}
                </p>
                <p>
                  <strong>Dirección de E-mail: </strong>
                  {props.info.billToEmail || ""}
                </p>
              </Col>
              <Col md={12}>
                <h5 className="fw-bold">Facturado por:</h5>
                <div>{props.info.billFrom || ""}</div>
                <div>{props.info.billFromAddress || ""}</div>
                <div>{props.info.billFromEmail || ""}</div>
              </Col>
              <Col md={12}>
                <h5 className="fw-bold mt-2">Fecha&nbsp;de&nbsp;emisión:</h5>
                <div>{new Date().toLocaleDateString() || ""}</div>
              </Col>
            </Container>
            <Table className="mb-0">
              <thead>
                <tr>
                  <th>CANT.</th>
                  <th>DESC.</th>
                  <th className="text-end">PRECIO</th>
                  <th className="text-end">MONTO</th>
                </tr>
              </thead>
              <tbody>
                {props.items.map((item, i) => {
                  return (
                    <tr id={i} key={i}>
                      <td style={{ width: "70px" }}>{item.quantity}</td>
                      <td>
                        {item.name} - {item.description}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {props.info.currency} {item.price}
                      </td>
                      <td className="text-end" style={{ width: "100px" }}>
                        {props.info.currency} {item.price * item.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table>
              <tbody>
                <tr>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    SUBTOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {props.info.currency} {props.info.subTotal}
                  </td>
                </tr>
                <tr className="text-end">
                  <td></td>
                  <td className="fw-bold" style={{ width: "100px" }}>
                    TOTAL
                  </td>
                  <td className="text-end" style={{ width: "100px" }}>
                    {props.info.currency} {props.total}
                  </td>
                </tr>
              </tbody>
            </Table>
            {props.info.notes && (
              <div className="bg-light py-3 px-4 rounded">
                <p>{props.info.notes}</p>
              </div>
            )}
          </div>
        </div>
        <div className="pb-4 px-4">
          <Row>
            <Col md={12}>
              <Button
                variant="outline-primary"
                className="d-block w-100 my-1"
                onClick={GenerateInvoice}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BiCloudDownload
                  style={{ width: "16px", height: "16px", marginTop: "-3px" }}
                  className="me-2"
                />
                Descargar copia
              </Button>
            </Col>
            {/* <Col md={4}>
              <Button
                variant="primary"
                className="d-block w-100 my-1"
                onClick={GenerateInvoice}
              >
                <BiPaperPlane
                  style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                  className="me-2"
                />
                Enivar&nbsp;por&nbsp;Email
              </Button>
            </Col>
            <Col md={4}>
              <Button
                variant="primary"
                className="d-block w-100 my-1"
                onClick={GenerateInvoice}
              >
                <BiPaperPlane
                  style={{ width: "15px", height: "15px", marginTop: "-3px" }}
                  className="me-2"
                />
                Enivar&nbsp;por&nbsp;Wpp
              </Button>
            </Col> */}
          </Row>
        </div>
      </Modal>
      <hr className="mt-4 mb-3 text-white" />
    </div>
  );
}
