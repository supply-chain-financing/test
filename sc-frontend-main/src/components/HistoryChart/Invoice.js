import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import { useState, useEffect } from "react";
import axios from "axios";
import BootStrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationFactory,
} from "react-bootstrap-table2-paginator";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import styled from "styled-components";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { RefreshAuthLogic } from "../../refreshAuthLogic";
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { useSelector, useDispatch } from "react-redux";
import Form from "react-bootstrap/Form";

const ModalPlace = styled.div`
  margin-top: 1vh;
  //border: 2px solid black;
`;
const BootstrapInput = withStyles((theme) => ({
  root: {
    "label + &": {
      marginTop: theme.spacing(2),
      fontFamily: "jf",
    },
  },
  input: {
    borderRadius: 10,
    position: "relative",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #adceed",
    fontFamily: "jf",
    fontSize: 16,
    padding: "10px 26px 10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: ["jf"].join(","),
    "&:focus": {
      borderRadius: 4,
      borderColor: "#f29979",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
      fontFamily: "jf",
    },
  },
}))(InputBase);

export default function Invoice() {
  const [invoices, setInvoices] = useState([]);
  const [modalInfo, setModalInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const { user: { userId, industryId, classroomId, flow } } = useSelector(state => state.user)

  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const [amount, setAmount] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [isFollow , setIsFollowed] = useState(false);
  const [repaymentInfo,setRepaymentInfo] =  useState([]);
  const { accessToken } = useSelector(state => state.accessToken)
  //auto handle request when accessToken was expired
  const instance = axios.create({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })
  const refreshAuthLogic = RefreshAuthLogic()
  createAuthRefreshInterceptor(instance, refreshAuthLogic)
  const repayment = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        onClick={() => {
          setIsFollowed(true);
        }}
      >
        ??????
      </Button>
    );
  };
  const columns = [
    { dataField: "invoiceId", text: "????????????" },
    { dataField: "transactionDate", text: "?????????" },
    { dataField: "deliveryDate", text: "?????????" },
    { dataField: "paymentDate", text: "????????????" },
    { dataField: "amount", text: "??????" },
    { dataField: "unitPrice", text: "??????" },
    { dataField: "payable", text: "????????????" },
    { dataField: "creditTerms", text: "????????????" },
    { dataField: "invoiceStatus", text: "????????????" },
    { dataField: "repayment", text: "??????"  ,formatter: repayment }
  ];


  const rowEvents = {
    onClick: (e, row) => {
      console.log(row);
      setModalInfo(row);
      setRepaymentInfo(row);
      toggleTrueFalse();
    },
  };

  const toggleTrueFalse = () => {
    setShowModal(handleShow);
  };
  

  //get invoice api
  const getData = () => {
    instance
      .get("http://localhost:3300/invoice/me",
    )
      .then(res => {
        setInvoices(res.data.invoices)
      })
      .catch((err) => {
        console.log(err);
      })
  };
  useEffect(() => {
    getData();
  }, []);

  // ?????? API ????????????
  function handleRepayment(){
    //?????????????????? alert????????? ??????return
    console.log(repaymentInfo.payable);
    if(flow.cash <repaymentInfo.payable ){
      alert("???????????????????????????");
      handleClose();
      return;
    }
    console.log("????????????" + repaymentInfo.invoiceId);
    handleClose();
  }

  const ModalContent = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>????????????{modalInfo.invoiceId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <ul>
            <ol>????????????{modalInfo.transactionDate}</ol>
            <ol>????????????{modalInfo.deliveryDate}</ol>
            <ol>???????????????{modalInfo.paymentDate}</ol>
            <ol>?????????{modalInfo.amount}</ol>
            <ol>?????????{modalInfo.unitPrice}</ol>
            <ol>???????????????{modalInfo.payable}</ol>
            <ol>???????????????{modalInfo.creditTerms}</ol>
          </ul> */}
          ??????????????????????

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ??????
          </Button>
          {modalInfo.invoiceStatus==="unpaid" ?  <Button variant="danger" onClick={handleRepayment}>
            ????????????
          </Button> : null}
         
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <>
      <BootStrapTable
        keyField="stockId"
        data={invoices} //??????invoice
        columns={columns}
        pagination={paginationFactory()}
        
        rowEvents={rowEvents}
      />
      <ModalPlace>{show ? <ModalContent /> : null}</ModalPlace>
    </>
  );
}
