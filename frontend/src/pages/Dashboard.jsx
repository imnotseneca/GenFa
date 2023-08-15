import Container from "react-bootstrap/Container";
import InvoiceForm from "../Components/InvoiceForm";
import Record from "../Components/Record";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  //IMPLEMENT INVOICES.STATE TO REDUX TO AVOID REPEATED CALLS TO SERVER AND DB.
  const fetchData = async () => {
    try {
      const response = await axios.get("https://invoice-withdb-bl7o-dev.fl0.io/api/v1/invoices");
      setInvoices([...response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateInvoice = async (id) => {
    try {
      await axios
        .put(`https://invoice-withdb-bl7o-dev.fl0.io/api/v1/invoices/${id}`, { status: `Pago` })
        .then((res) => {
          // Handle the updated invoice in the frontend, for example, update the state.
          const updatedInvoice = res.data;
          setInvoices((prevInvoices) => {
            return prevInvoices.map((invoice) =>
              invoice._id === updatedInvoice._id ? updatedInvoice : invoice
            );
          });
        });
      toast.success("Factura actualizada con éxito!");
    } catch (err) {
      toast.error(`Error al actualizar el estado de la factura.`);
    }
  };

  const handleDeleteInvoice = async (id) => {
    try {
      await axios.delete(`https://invoice-withdb-bl7o-dev.fl0.io/api/v1/invoices/${id}`);
      // Remove the deleted invoice from the frontend
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== id)
      );
      toast.success("Factura eliminada con éxito!");
    } catch (error) {
      toast.error("Error al eliminar la factura:", error);
    }
  };

  const handlePostInvoice = async (newInvoice) => {
    try {
      const response = await axios.post(
        "https://invoice-withdb-bl7o-dev.fl0.io/api/v1/invoices",
        newInvoice
      );
      setInvoices((prevInvoices) => [...prevInvoices, response.data]); // Update state with new invoice
      toast.success("Factura creada con éxito");
    } catch (error) {
      toast.error("Error adding invoice:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container fluid className="lg-container">
        <h1 className="text-white text-center my-2">Generador de facturas</h1>
        <hr className="text-white"/>
        <InvoiceForm
          invoices={invoices}
          handlePostInvoice={handlePostInvoice}
        />
      </Container>
      <Record
        invoices={invoices}
        handleUpdateInvoice={handleUpdateInvoice}
        handleDeleteInvoice={handleDeleteInvoice}
      />
    </div>
  );
}
