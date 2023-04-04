import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";
import Table from "react-bootstrap/Table";

const AlarmModal = (props) => {
  const [alarmInfo, setalarmInfo] = useState();
  const data = axios.get(`${apiUrl}/database/getWarning`);

  data.then((data) => {
    const alarmData = data.data;
    setalarmInfo(alarmData);
    console.log(alarmInfo);
  });

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Alarm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Date</th>
              <th>Time</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {alarmInfo &&
              alarmInfo.map((val, key) => {
                return (
                  <tr key={key}>
                    <td>{val.id}</td>
                    <td>{val.date}</td>
                    <td>{val.time}</td>
                    <td>{val.text}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};
export default AlarmModal;
