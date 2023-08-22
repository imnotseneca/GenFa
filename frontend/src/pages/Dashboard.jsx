import Container from "react-bootstrap/Container";
import InvoiceForm from "../Components/InvoiceForm";
import Record from "../Components/Record";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  const { userInfo } = useSelector((state) => state.auth);

  //IMPLEMENT INVOICES.STATE TO REDUX TO AVOID REPEATED CALLS TO SERVER AND DB.
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/invoices",
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
      setInvoices([...response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleUpdateInvoice = async (id) => {
    try {
      await axios
        .put(
          `http://localhost:3000/api/v1/invoices/${id}`,
          { status: `Pago` },
          {
            headers: {
              Authorization: `${userInfo.token}`,
            },
          }
        )
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
      await axios.delete(`http://localhost:3000/api/v1/invoices/${id}`, {
        headers: {
          Authorization: `${userInfo.token}`,
        },
      });
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
        "http://localhost:3000/api/v1/invoices",
        newInvoice,
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
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
        <hr className="text-white" />
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
