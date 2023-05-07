import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../../contexts/constants";
import { AuthContext } from "../../contexts/AuthContext";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";

const AlarmModal = (props) => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const {
    authState: { role },
  } = useContext(AuthContext);

  const [alarmInfo, setalarmInfo] = useState();
  useEffect(() => {
    async function makeRequest() {
      await sleep(2000);
      const data = axios.get(`${apiUrl}/database/getWarning`);
      data.then((data) => {
        const alarmData = data.data;
        setalarmInfo(alarmData);
      });
    }
    makeRequest();
  });
  async function actionHandle(text, status, id) {
    axios.post(`${apiUrl}/database/setAlarmStatus`, {
      id: id,
      text: text,
      status: status,
    });
  }
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
              <th>Status</th>
              <th>Value</th>
              <th>Limit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {alarmInfo &&
              alarmInfo.map((val, key) => {
                return (
                  <tr
                    bgcolor={
                      val.status == "Active"
                        ? "#ff4200"
                        : val.status == "Acknowledged"
                        ? "#ffa500"
                        : "#00f300"
                    }
                    key={key}
                  >
                    <td>{val.id}</td>
                    <td>{val.date}</td>
                    <td>{val.time}</td>
                    <td>{val.text}</td>
                    <td>{val.status}</td>
                    <td>{val.value}</td>
                    <td>{val.limit}</td>

                    <td>
                      <Dropdown>
                        <Dropdown.Toggle
                          style={{
                            backgroundColor: "transparent",
                            border: "0px",
                            width: "20px",
                            height: "20px",
                            position: "absolute",
                            top: "-9px",
                            left: "-14px",
                          }}
                        >
                          <img
                            src="/images/action.png"
                            style={{ width: "30px" }}
                          />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item href={`/alarm-table`}>
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "0px",
                                color: "#000000",
                              }}
                              type="submit"
                            >
                              Go to alarm table
                            </Button>
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item>
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "0px",
                                color: "#000000",
                              }}
                              onClick={() =>
                                actionHandle(val.text, "Acknowledged", val.id)
                              }
                            >
                              Acknowledge
                            </Button>
                          </Dropdown.Item>
                          <Dropdown.Item>
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "0px",
                                color: "#000000",
                              }}
                              onClick={() =>
                                actionHandle(val.text, "Disable", val.id)
                              }
                            >
                              Disable
                            </Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
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
