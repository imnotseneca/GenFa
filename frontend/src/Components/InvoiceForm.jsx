/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import InvoiceItem from "./InvoiceItem";
import InvoiceModal from "./InvoiceModal";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { BsArrowRight } from "react-icons/bs";
import "../App.css";
import {
  Container,
  Dropdown,
  Card,
  Form,
  Button,
  Col,
  Row,
} from "react-bootstrap";

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
    billFrom: `${userInfo.firstName} ${userInfo.lastName}`,
    notes: "",
    subTotal: "",
    receptorData: [], // Array to store data for multiple receivers
    receptorIDs: [],
  });

  const [selectedReceiverData, setSelectedReceiverData] = useState([]);

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

  const [dropdownOpen, setDropdownOpen] = useState(false);

  //Sort algorithm to order names alphabetically
  const sortedInvoiceReceivers = [...invoiceReceivers].sort((a, b) =>
    `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
  );

  //It will store a boolean value. If true, all receptors are selected from the checkbox.

  const areAllSelected = sortedInvoiceReceivers
    .map((receiver) => receiver._id)
    .every((value) => state.receptorIDs.includes(value));

  const handleDropdownToggle = (isOpen, event, metadata) => {
    // If the toggle event was triggered by a checkbox, keep the dropdown open
    if (metadata && metadata.source === "checkbox") {
      setDropdownOpen(true);
    } else {
      setDropdownOpen(isOpen);
    }
  };

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

  const handleCheckboxChange = (e) => {
    const { value } = e.target;

    setState((prevState) => {
      // Find the selected receiver data based on the clicked checkbox
      const selectedReceiver = invoiceReceivers.find(
        (receiver) => receiver._id === value
      );

      // Update the selectedReceiverData state based on whether the checkbox is checked or not
      const updatedReceiverData = e.target.checked
        ? [
            ...prevState.receptorData,
            {
              billTo: `${selectedReceiver.firstName} ${selectedReceiver.lastName}`,
              billToEmail: selectedReceiver.email,
              receptorID: selectedReceiver._id,
            },
          ]
        : prevState.receptorData.filter(
            (data) => data.receptorID !== selectedReceiver._id
          );

      // Update the selectedReceiverData state
      setSelectedReceiverData(updatedReceiverData);

      // Extract receptorIDs from updatedReceiverData
      const updatedReceptorIDs = updatedReceiverData.map(
        (data) => data.receptorID
      );

      handleDropdownToggle(true, null, { source: "checkbox" });

      return {
        ...prevState,
        receptorIDs: updatedReceptorIDs,
        receptorData: updatedReceiverData,
      };
    });
  };

  const dropdownCheckboxList = sortedInvoiceReceivers.map((receiver) => (
    <Dropdown.Item key={receiver._id}>
      <Form.Check
        label={`${receiver.firstName} ${receiver.lastName}`}
        value={receiver._id}
        onChange={handleCheckboxChange}
        checked={state.receptorIDs.includes(receiver._id)}
      />
    </Dropdown.Item>
  ));

  const handleSelectAll = () => {
    const allCheckboxValues = sortedInvoiceReceivers.map(
      (receiver) => receiver._id
    );

    // Check if all checkboxes are already selected
    const allSelected = allCheckboxValues.every((value) =>
      state.receptorIDs.includes(value)
    );

    // If all selected, unselect all; otherwise, select all
    const updatedReceptorIDs = allSelected ? [] : allCheckboxValues;

    const updatedReceiverData = updatedReceptorIDs.map((value) => {
      const selectedReceiver = invoiceReceivers.find(
        (receiver) => receiver._id === value
      );
      return {
        billTo: `${selectedReceiver.firstName} ${selectedReceiver.lastName}`,
        billToEmail: selectedReceiver.email,
        receptorID: selectedReceiver._id,
      };
    });

    setSelectedReceiverData((prevData) =>
      allSelected
        ? []
        : updateSelectedReceiverData(prevData, updatedReceiverData)
    );

    setState((prevState) => ({
      ...prevState,
      receptorIDs: updatedReceptorIDs,
      receptorData: updatedReceptorIDs.length === 0 ? [] : updatedReceiverData,
    }));
  };

  // Helper function to update selectedReceiverData
  const updateSelectedReceiverData = (prevData, newData) => {
    // Assuming a unique key like 'receptorID'
    const newDataKeys = new Set(newData.map((data) => data.receptorID));
    const filteredPrevData = prevData.filter(
      (data) => !newDataKeys.has(data.receptorID)
    );

    return [...filteredPrevData, ...newData];
  };

  useEffect(() => {
    // Update the form input values with the selectedReceiverData
    // Assuming selectedReceiverData is an array
    const selectedData =
      selectedReceiverData.length > 0 ? selectedReceiverData[0] : {};

    setState((prevFormState) => ({
      ...prevFormState,
      billTo: selectedData.billTo || "",
      billToEmail: selectedData.billToEmail || "",
      receptorIDs: state.receptorIDs, // You may not want to overwrite this in every useEffect
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
              <Container className="mb-5 flex-direction-column">
                <Col>
                  <Form.Label className="fw-bold" htmlFor="receptorOptions">
                    Receptor:
                  </Form.Label>
                  <Dropdown onToggle={handleDropdownToggle} show={dropdownOpen}>
                    <Dropdown.Toggle variant="secondary">
                      {`Seleccionar receptor/es (${state.receptorData.length})`}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>{dropdownCheckboxList}</Dropdown.Menu>
                  </Dropdown>
                  <hr />
                  <Button
                    variant="primary"
                    onClick={handleSelectAll}
                    className=""
                  >
                    {areAllSelected === true
                      ? `Deseleccionar todos`
                      : `Seleccionar todos`}
                  </Button>
                  <hr />
                  <Form.Label className="fw-bold my-2" htmlFor="receptorName">
                    Nombres del/los receptor/es:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Nombre"
                    value={selectedReceiverData
                      .map((receiver) => receiver.billTo)
                      .join(", ")}
                    type="text"
                    name="billTo"
                    className="my-2"
                    readOnly
                    disabled
                    autoComplete="Nombre"
                    required={true}
                    id="receptorName"
                  />
                  <Form.Label className="fw-bold my-2" htmlFor="receptorEmail">
                    E-mail/s del/los receptor/es:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Email"
                    value={selectedReceiverData
                      .map((receiver) => receiver.billToEmail)
                      .join(", ")}
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
                    Emisor:
                  </Form.Label>
                  <Form.Control
                    placeholder="Ingresa un Nombre"
                    value={state.billFrom}
                    type="text"
                    name="billFrom"
                    className="mb-2"
                    readOnly
                    disabled
                    autoComplete="Nombre"
                    required={true}
                    id="transmitter"
                  ></Form.Control>
                </Col>
              </Container>
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
