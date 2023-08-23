/* eslint-disable react/prop-types */
// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";
import { Container, Table } from "react-bootstrap";
// import { BiTrash } from "react-icons/bi";
import EditableField from './EditableField'

export default function InvoiceItem({
  items,
  onItemizedItemEdit,
  // onRowAdd,
  onRowDel,
  currency,
}) {
  const itemTable = items.map((item, index) => (
    <ItemRow
      onItemizedItemEdit={onItemizedItemEdit}
      item={item}
      onRowDel={onRowDel}
      key={index}
      currency={currency}
    ></ItemRow>
  ));
  return (
    <Container fluid>
      <Table responsive>
        <thead>
          <tr>
            <th>Razón</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th className="text-center">Precio</th>
          </tr>
        </thead>
        <tbody>{itemTable}</tbody>
      </Table>
      {/* <Button className="fw-bold mt-2" onClick={onRowAdd}>Agregar Item</Button> */}
    </Container>
  );
}



function ItemRow(props) {

  // const onDeleteEvent = () => {
  //   props.onRowDel(props.item);
  // };
  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "name",
            placeholder: "Ej: Cuota/multa",
            value: props.item.name,
            id: 1,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            type: "text",
            name: "description",
            placeholder: "Ej: Cuota agosto",
            value: props.item.description,
            id: 2,
          }}
        />
      </td>
      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            type: "number",
            name: "quantity",
            min: 1,
            step: "1",
            value: props.item.quantity,
            id: 3,
          }}
        />
      </td>
      <td style={{ minWidth: "100px" }}>
        <EditableField
          onItemizedItemEdit={props.onItemizedItemEdit}
          cellData={{
            leading: props.currency,
            type: "number",
            name: "price",
            min: 1,
            step: "0.01",
            textAlign: "text-end",
            value: props.item.price,
            id: 4,
          }}
        />
      </td>
      {/* <td className="text-center" style={{ minWidth: 50 }}>
        <BiTrash
          onClick={() => onDeleteEvent(props.items)}
          style={{ height: "33px", width: "33px", padding: "7.5px", marginTop: '0.3em' }}
          className="text-white btn btn-danger"
        />
      </td> */}
    </tr>
  );
}
