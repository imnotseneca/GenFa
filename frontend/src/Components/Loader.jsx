import { Spinner } from "react-bootstrap";

const Loader = () => {
  return (
    <Spinner
      animation="border"
      role="status"
      style={{
        width: "80px",
        height: "80px",
        margin: "auto",
        display: "block",
        color: 'silver'
      }}
    ></Spinner>
  );
};


export default Loader;