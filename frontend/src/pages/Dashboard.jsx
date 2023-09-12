/* eslint-disable react/prop-types */
import Container from "react-bootstrap/Container";
import InvoiceForm from "../Components/InvoiceForm";
import Record from "../Components/Record";
import { Table, Pagination } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from '../Components/Loader'

export default function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [invoiceReceivers, setInvoiceReceivers] = useState([]);
  const [invoiceForReceivers, setInvoiceForReceivers] = useState([]);
  const { userInfo } = useSelector((state) => state.auth);
  const [isloading, setIsloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  //IMPLEMENT INVOICES.STATE TO REDUX TO AVOID REPEATED CALLS TO SERVER AND DB.

  const fetchInvoiceReceivers = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_ENV === "production"
          ? `${
              import.meta.env.VITE_APP_PROD_BACK_URL
            }/api/v1/users/getAllInvoiceReceivers`
          : `${
              import.meta.env.VITE_APP_DEV_BACK_URL
            }/api/v1/users/getAllInvoiceReceivers`,
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
      setInvoiceReceivers([...response.data]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchInvoicesForReceivers = async () => {
    try {
      setIsloading(true);
      const response = await axios.get(
        import.meta.env.VITE_APP_ENV === "production"
          ? `${
              import.meta.env.VITE_APP_PROD_BACK_URL
            }/api/v1/invoices/receiverInvoices`
          : `${
              import.meta.env.VITE_APP_DEV_BACK_URL
            }/api/v1/invoices/receiverInvoices`,
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
      setIsloading(false);
      setInvoiceForReceivers([...response.data]);
    } catch (error) {
      setIsloading(false);
      console.error("Error fetching user invoices:", error);
    }
  };

  const invoiceForReceiverList = invoiceForReceivers.map((invoice, index) => {
    const formatedDate = new Date(invoice.date).toLocaleDateString();
    return (
      <tbody key={index}>
        <tr className="text-center">
          <th>{formatedDate}</th>
          <th>{invoice.invoiceFrom}</th>
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
        </tr>
      </tbody>
    );
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_APP_ENV === "production"
          ? `${import.meta.env.VITE_APP_PROD_BACK_URL}/api/v1/invoices`
          : `${import.meta.env.VITE_APP_DEV_BACK_URL}/api/v1/invoices`,
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
          import.meta.env.VITE_APP_ENV === "production"
            ? `${import.meta.env.VITE_APP_PROD_BACK_URL}/api/v1/invoices/${id}`
            : `${import.meta.env.VITE_APP_DEV_BACK_URL}/api/v1/invoices/${id}`,
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
      await axios.delete(
        import.meta.env.VITE_APP_ENV === "production"
          ? `${import.meta.env.VITE_APP_PROD_BACK_URL}/api/v1/invoices/${id}`
          : `${import.meta.env.VITE_APP_DEV_BACK_URL}/api/v1/invoices/${id}`,
        {
          headers: {
            Authorization: `${userInfo.token}`,
          },
        }
      );
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
        import.meta.env.VITE_APP_ENV === "production"
          ? `${import.meta.env.VITE_APP_PROD_BACK_URL}/api/v1/invoices`
          : `${import.meta.env.VITE_APP_DEV_BACK_URL}/api/v1/invoices`,
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
      console.error("Error adding invoice:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchInvoiceReceivers();
    fetchInvoicesForReceivers();
  }, []);

  //   return (
  //     <div className="App d-flex flex-column align-items-center justify-content-center w-100">
  //       <Container fluid className="lg-container">
  //         <h1 className="text-white text-center my-2">
  //           {userInfo.role === "invoiceMaker"
  //             ? "Generador de facturas"
  //             : "Historial de facturas"}
  //         </h1>
  //         <hr className="text-white" />
  //       </Container>
  //       {userInfo.role === "invoiceMaker" ? (
  //         <Container>
  //           <InvoiceForm
  //             invoiceReceivers={invoiceReceivers}
  //             invoices={invoices}
  //             handlePostInvoice={handlePostInvoice}
  //           />
  //           <Record
  //             invoices={invoices}
  //             handleUpdateInvoice={handleUpdateInvoice}
  //             handleDeleteInvoice={handleDeleteInvoice}
  //           />
  //         </Container>
  //       ) : invoiceForReceivers.length > 0 ? (
  //         <Container>
  //           <Table
  //             variant="dark"
  //             striped
  //             bordered
  //             hover
  //             responsive="md"
  //             size="sm"
  //             className="my-2"
  //           >
  //             <thead>
  //               <tr className="text-center">
  //                 <th>Fecha</th>
  //                 <th>Emisor</th>
  //                 <th>Razón</th>
  //                 <th>Descripción</th>
  //                 <th>Cantidad</th>
  //                 <th>Precio</th>
  //                 <th>Estado</th>
  //               </tr>
  //             </thead>
  //             {invoiceForReceiverList}
  //           </Table>
  //           <CustomPagination
  //         currentPage={currentPage}
  //         itemsPerPage={itemsPerPage}
  //         totalItems={invoiceForReceivers.length}
  //         onPageChange={setCurrentPage}
  //       />
  //         </Container>
  //       ) : (
  //         <h2>Aun no te han generado facturas.</h2>
  //       )}
  //     </div>
  //   );
  // }
  return (
    <div className="App d-flex flex-column align-items-center justify-content-center w-100">
      <Container fluid className="lg-container">
        <h1 className="text-white text-center my-2">
          {userInfo.role === "invoiceMaker"
            ? "Generador de facturas"
            : "Historial de facturas"}
        </h1>
        <hr className="text-white" />
      </Container>
      {isloading ? (
        <Loader/> // Render a loader here
      ) : userInfo.role === "invoiceMaker" ? (
        <Container>
          <InvoiceForm
            invoiceReceivers={invoiceReceivers}
            invoices={invoices}
            handlePostInvoice={handlePostInvoice}
          />
          <Record
            invoices={invoices}
            handleUpdateInvoice={handleUpdateInvoice}
            handleDeleteInvoice={handleDeleteInvoice}
          />
        </Container>
      ) : invoiceForReceivers.length > 0 ? (
        <Container>
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
                <th>Emisor</th>
                <th>Razón</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            {invoiceForReceiverList}
          </Table>
          <CustomPagination
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            totalItems={invoiceForReceivers.length}
            onPageChange={setCurrentPage}
          />
        </Container>
      ) : (
        <h2>Aun no te han generado facturas.</h2>
      )}
    </div>
  );
}
