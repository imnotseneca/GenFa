/* eslint-disable react/prop-types */
import { Button, Container, Table, Form, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { BiTrash, BiCheck } from "react-icons/bi";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

function CustomPagination({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <Pagination className="my-2 align-self-center">
      <Pagination.First
        disabled={currentPage === 1}
        onClick={() => handlePageChange(1)}
      />
      <Pagination.Prev
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
      <Pagination.Item active linkClassName="bg-dark border-dark">
        {currentPage}
      </Pagination.Item>
      <Pagination.Ellipsis />
      <Pagination.Item disabled="true">{totalPages}</Pagination.Item>
      <Pagination.Next
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
      <Pagination.Last
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(totalPages)}
      />
    </Pagination>
  );
}

//Record component
export default function Record({
  invoices,
  handleUpdateInvoice,
  handleDeleteInvoice,
}) {
  const [stateInvoice, setInvoices] = useState([]);
  const [filters, setFilters] = useState({
    dateFilter: "", // "newToOld" or "oldToNew"
    nameFilter: "",
    reasonFilter: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  useEffect(() => {
    const filteredInvoices = invoices
      .filter(() => {
        if (filters.dateFilter === "newToOld") {
          return true; // No date filtering for this option
        } else if (filters.dateFilter === "oldToNew") {
          return true; // No date filtering for this option
        } else {
          // No date filtering for "No Filtering" option
          return true;
        }
      })
      .filter(
        (invoice) =>
          filters.nameFilter.trim() === "" || // Validate if nameFilter is empty or consists of only whitespace
          invoice.invoiceTo
            .toLowerCase()
            .includes(filters.nameFilter.toLowerCase())
      )
      .filter((invoice) =>
        invoice.reason
          .toLowerCase()
          .includes(filters.reasonFilter.toLowerCase())
      );

    setInvoices(filteredInvoices);
  }, [invoices, filters]);

  const sortedInvoices = [...stateInvoice].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (filters.dateFilter === "newToOld") {
      return dateB - dateA;
    } else if (filters.dateFilter === "oldToNew") {
      return dateA - dateB;
    } else {
      return 0; // No sorting by date
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const recordList = currentItems.map((invoice, index) => {
    const formatedDate = new Date(invoice.date).toLocaleDateString();
    return (
      <tbody key={index}>
        <tr className="text-center">
          <th>{formatedDate}</th>
          <th>{invoice.invoiceTo}</th>
          <th>{invoice.reason}</th>
          <th>{invoice.description}</th>
          <th>{invoice.quantity}</th>
          <th>{invoice.price}</th>
          <th
            className={
              invoice.status.toLowerCase() === "pendiente"
                ? "text-danger"
                : "text-success"
            }
          >
            {invoice.status}
          </th>
          <th>
            <Button
              style={{ border: "none" }}
              size="sm"
              type="submit"
              variant="outline-success"
              disabled={invoice.status === "Pago" ? true : false}
            >
              <BiCheck
                onClick={() => handleUpdateInvoice(invoice._id)}
                style={{
                  height: "33px",
                  width: "33px",
                  padding: "7.5px",
                  margin: "1em",
                }}
                className="text-white"
              />
            </Button>
          </th>
          <th>
            <Button
              style={{ border: "none" }}
              size="sm"
              type="submit"
              variant="outline-danger"
            >
              <BiTrash
                onClick={() => handleDeleteInvoice(invoice._id)}
                style={{
                  height: "33px",
                  width: "33px",
                  padding: "7.5px",
                  margin: "1em",
                }}
                className="text-white"
              />
            </Button>
          </th>
        </tr>
      </tbody>
    );
  });

  return invoices.length > 0 ? (
    <Container
      fluid
      className="d-flex flex-column justify-content-center"
      style={{ width: "min(90%,70.5rem)" }}
    >
      <Container>
        <h2 className="text-white text-center">
          Historial de facturas y recibos:
        </h2>
        <hr className="text-white" />
      </Container>
      <Container className="align-self-center w-75 my-2">
        <Form.Group className=" my-2">
          <Form.Label className="text-white" htmlFor="dateFilter">
            Filtrar por fecha de creación:
          </Form.Label>
          <Form.Control
            as="select"
            name="dateFilter"
            value={filters.dateFilter}
            onChange={handleFilterChange}
            id="dateFilter"
          >
            <option value="">Selecciona una opción:</option>
            <option value="newToOld">Nuevo a viejo</option>
            <option value="oldToNew">Viejo a nuevo</option>
          </Form.Control>
        </Form.Group>
        <Form.Group className=" my-2">
          <Form.Label className="text-white" htmlFor="nameFilter">Filtrar por nombre:</Form.Label>
          <Form.Control
            type="text"
            name="nameFilter"
            placeholder="Ej: Bruno Corrao"
            value={filters.nameFilter}
            onChange={handleFilterChange}
            id="nameFilter"
          />
        </Form.Group>
        <Form.Group className=" my-2">
          <Form.Label className="text-white" htmlFor="reasonFilter">Filtrar por razón:</Form.Label>
          <Form.Control
            type="text"
            name="reasonFilter"
            placeholder="Ej: Multa"
            value={filters.reasonFilter}
            onChange={handleFilterChange}
            id="reasonFilter"
          />
        </Form.Group>
      </Container>
      <Table
        variant="dark"
        striped
        bordered
        hover
        responsive="md"
        size="sm"
        className="my-2"
      >
        <thead>
          <tr className="text-center">
            <th>Fecha</th>
            <th>Destinatario</th>
            <th>Razón</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Actualizar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        {recordList}
      </Table>
      <CustomPagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalItems={sortedInvoices.length}
        onPageChange={setCurrentPage}
      />
    </Container>
  ) : (
    <Container
      fluid
      className="d-flex col lg-row justify-content-center align-items-center"
    >
      <h3 className="text-white m-0">
        Generá un factura para visualizar el historial
      </h3>
      <LiaFileInvoiceDollarSolid
        style={{
          height: "44px",
          width: "44px",
          padding: "7px",
          color: "white",
        }}
      />
    </Container>
  );
}
