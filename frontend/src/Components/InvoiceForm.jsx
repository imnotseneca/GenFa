/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { BsArrowRight } from "react-icons/bs";
import "../App.css";
import { Container } from "react-bootstrap";

export default function InvoiceForm({
  invoices,
  handlePostInvoice,
  invoiceReceivers,
}) {
  const { userInfo } = useSelector((state) => state.auth);

  const [state, setState] = useState({
    isOpen: false,
    currency: "$",
    currentDate: "",
    invoiceNumber: 0,
    billTo: ``,
    billToEmail: "",
    billFrom: `${userInfo.firstName} ${userInfo.lastName}`,
    notes: "",
    subTotal: "",
    receptorID: "",
  });

  const [selectedReceiverData, setSelectedReceiverData] = useState({
    billTo: "",
    billToEmail: "",
    receptorID: "",
  });
  const [total, setTotal] = useState(0.0);
  const [items, setItems] = useState([
    {
      id: "0",
      name: "",
      description: "",
      price: 1.0,
      quantity: 1,
    },
  ]);

  // const onChange = (event) => {
  //   setState((state) => ({
  //     ...state,
  //     [event.target.name]: event.target.value,
  //   }));
  // };

  const onItemizedItemEdit = (event) => {
    const individualItem = {
      id: event.target.id,
      name: event.target.name,
      value: event.target.value,
    };

    const newItems = items.map((item) => {
      for (const key in item) {
        if (key === individualItem.name && item.id === individualItem.id) {
          item[key] = individualItem.value;
        }
      }
      return item;
    });
    setItems(newItems);
  };

  // const handleAddEvent = () => {
  //   const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
  //   const item = {
  //     id: id,
  //     name: "",
  //     price: 1.0,
  //     description: "",
  //     quantity: 1,
  //   };
  //   setItems((items) => [...items, item]);
  // };

  // const handleRowDel = (item) => {
  //   if (items.length > 0) {
  //     setItems((oldState) => {
  //       const itemIndex = oldState.findIndex(
  //         (data) => data.id === item.id
  //       );
  //       if (itemIndex !== -1) {
  //         oldState.splice(itemIndex, 1);
  //       } return [...oldState]
  //     })
  //     } else {
  //       setItems([
  //         {
  //           id: "0",
  //           name: "",
  //           description: "",
  //           price: 1.0,
  //           quantity: 1,
  //         },
  //       ]);
  //     }
  //   }

  const handeCalculateTotal = (items) => {
    let subTotal = 0;
    items.map((item) => {
      subTotal += parseFloat(item.price).toFixed(2) * parseInt(item.quantity);
    })[0];

    subTotal = parseFloat(subTotal).toFixed(2);

    const total = parseFloat(subTotal);
    setTotal(total);
    setState((state) => ({
      ...state,
      subTotal,
    }));
  };

  const sortedInvoiceReceivers = [...invoiceReceivers].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
  );

  const invoiceReceiverList = sortedInvoiceReceivers.map((receiver) => {
    return (
      <option value={receiver._id} key={receiver._id}>
        {receiver.firstName} {receiver.lastName}
      </option>
    );
  });

  function handleSelectOption(e) {
    const selectedReceiverId = e.target.value; // Use the _id as the value
    const selectedReceiverData = invoiceReceivers.find(
      (receiver) => receiver._id === selectedReceiverId
    );

    setSelectedReceiverData({
      billTo: `${selectedReceiverData.firstName} ${selectedReceiverData.lastName}`,
      billToEmail: selectedReceiverData.email,
      receptorID: selectedReceiverData._id,
    });
  }

  useEffect(() => {
    // Update the form input values with the selectedReceiverData
    setState((prevFormState) => ({
      ...prevFormState,
      billTo: selectedReceiverData.billTo,
      billToEmail: selectedReceiverData.billToEmail,
      receptorID: selectedReceiverData.receptorID,
    }));
    // Calculate total, etc.
    handeCalculateTotal(items);
  }, [selectedReceiverData, items]);

  return (
    <Container fluid>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setState((state) => ({ ...state, isOpen: true }));
        }}
      >
        <Col>
          <Col lg={12}>
            <Card className="d-flex p-4 p-xl-5 my-3 my-xl-4 paper-shadow">
              <div className="d-flex flex-row justify-content-between">
                <div className="d-flex flex-row mb-3">
                  <div className="mb-2">
                    <span className="fw-bold">
                      Fecha actual: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-row mb-3">
                  <div className="mb-2">
                    <span className="fw-bold">
                      Número de factura: #{invoices.length + 1}
                    </span>
                  </div>
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold" htmlFor="receptorOption">
                    Receptor:
                  </Form.Label>
                  <Form.Select
                    aria-label="Default select example"
                    id="receptorOption"
                    onChange={handleSelectOption}
                  >
                    <option>Selecciona un receptor:</option>
                    {invoiceReceiverList}
                  </Form.Select>
                  <Form.Label className="fw-bold" htmlFor="receptorName">
                    Nombre del receptor:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Nombre"
                    value={state.billTo}
                    type="text"
                    name="billTo"
                    className="my-2"
                    readOnly
                    disabled
                    autoComplete="Nombre"
                    required={true}
                    id="receptorName"
                  ></Form.Control>
                  <Form.Label className="fw-bold" htmlFor="receptorEmail">
                    E-mail del receptor:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Email"
                    value={state.billToEmail}
                    type="text"
                    name="billToEmail"
                    className="my-2"
                    readOnly
                    disabled
                    autoComplete="email"
                    required={true}
                    id="receptorEmail"
                  ></Form.Control>
                </Col>
                <Col>
                  <Form.Label className="fw-bold" htmlFor="transmitter">
                    Nombre del Emisor:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Nombre"
                    value={state.billFrom}
                    type="text"
                    name="billFrom"
                    className="my-2"
                    readOnly
                    disabled
                    autoComplete="Nombre"
                    required={true}
                    id="transmitter"
                  ></Form.Control>
                </Col>
              </Row>
              <InvoiceItem
                items={items}
                onItemizedItemEdit={onItemizedItemEdit}
                // onRowAdd={handleAddEvent}
                // onRowDel={handleRowDel}
                currency={state.currency}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    {!isNaN(state.subTotal) ? (
                      <span>
                        {state.currency} {state.subTotal}
                      </span>
                    ) : (
                      `$0.00`
                    )}
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Total:</span>
                    {!isNaN(total) ? (
                      <span>
                        {state.currency} {total}
                      </span>
                    ) : (
                      `$0.00`
                    )}
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col lg={3}>
            <div className="pt-md-3 pt-xl-4">
              <Button
                variant="primary"
                type="submit"
                className="d-block w-100 text-center m-1"
                size="lg"
              >
                Revisar factura <BsArrowRight />
              </Button>
            </div>
          </Col>
        </Col>
        <InvoiceModal
          showModal={state.isOpen}
          closeModal={() => setState((state) => ({ ...state, isOpen: false }))}
          info={state}
          items={items}
          total={total}
          handlePostInvoice={handlePostInvoice}
        />
      </Form>
    </Container>
  );
}
