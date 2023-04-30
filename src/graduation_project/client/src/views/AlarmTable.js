import NavbarLayout from "../components/layout/NavbarLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import CloseButton from "react-bootstrap/CloseButton";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
const AlarmTable = () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [alarmInfo, setalarmInfo] = useState();
  const [sortAlarm, setsortAlarm] = useState({
    date: "",
    time: "",
    text: "",
    status: "",
  });

  useEffect(() => {
    async function makeRequest() {
      await sleep(1000);
      const data = axios.get(`${apiUrl}/database/getAlarmTable`, {
        params: { sortAlarm },
      });
      data.then((data) => {
        const alarmData = data.data;
        setalarmInfo(alarmData.reverse());
      });
    }
    makeRequest();
  });

  async function actionHandle(text, status) {
    console.log(text);
    console.log(status);
    axios.post(`${apiUrl}/database/setAlarmStatus`, {
      text: text,
      status: status,
    });
  }

  async function setDate(event) {
    const dateChoose = new Date(event.target.value);
    const year = dateChoose.getFullYear();
    const month = dateChoose.getMonth();
    const day = dateChoose.getDate();
    const dateString = day + "/" + Number(month + 1) + "/" + year;
    setsortAlarm({ ...sortAlarm, date: dateString });
  }

  async function setTime(event) {
    const timeValue = event.target.value;
    const hours = parseInt(timeValue.slice(0, 2));
    let minutes = timeValue.slice(3, 5);
    const meridian = timeValue.slice(6);
    if (hours === 12 && meridian === "AM") {
      hours -= 12;
    } else if (meridian === "PM" && hours < 12) {
      hours += 12;
    }
    const timeString = `${hours
      .toString()
      .padStart(2, "0")}:${minutes}${meridian}`;
    console.log(timeString);
    setsortAlarm({ ...sortAlarm, time: timeString });
  }

  async function setText(event) {
    const text = event.target.value;
    setsortAlarm({ ...sortAlarm, text: text });
  }
  async function setStatus(status) {
    setsortAlarm({ ...sortAlarm, status: status });
  }
  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/alarm-table" />
      <h1>Alarm</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">Date</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form.Control
                    type="date"
                    onChange={setDate}
                    style={{ border: "0px" }}
                  />
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.date = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.date !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.date = "")}
                  style={{
                    fontWeight: "normal",
                    width: "120px",
                    padding: "5px",
                  }}
                >
                  {sortAlarm.date}
                  <CloseButton
                    onClick={() => (sortAlarm.date = "")}
                    style={{
                      scale: "80%",
                      marginLeft: "5px",
                      position: "absolute",
                      top: "5px",
                    }}
                  ></CloseButton>
                </Alert>
              ) : (
                <></>
              )}
            </th>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">Time</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Form.Control
                    type="time"
                    onChange={setTime}
                    style={{ border: "0px" }}
                  />
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.time = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.time !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.time = "")}
                  style={{
                    fontWeight: "normal",
                    width: "80px",
                    padding: "5px",
                  }}
                >
                  {sortAlarm.time}
                  <CloseButton
                    onClick={() => (sortAlarm.time = "")}
                    style={{
                      scale: "80%",
                      marginLeft: "5px",
                      position: "absolute",
                      top: "5px",
                    }}
                  ></CloseButton>
                </Alert>
              ) : (
                <></>
              )}
            </th>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">Text</Dropdown.Toggle>
                <Dropdown.Menu>
                  <div>
                    <Form.Control
                      placeholder="Search values"
                      style={{ border: "0px" }}
                      onChange={setText}
                      value={sortAlarm.text}
                    />
                  </div>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.text = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.text !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.text = "")}
                  style={{
                    fontWeight: "normal",
                    padding: "5px",
                  }}
                >
                  {sortAlarm.text}
                  <CloseButton
                    onClick={() => (sortAlarm.text = "")}
                    style={{
                      scale: "80%",
                      marginLeft: "5px",
                      position: "absolute",
                      top: "5px",
                    }}
                  ></CloseButton>
                </Alert>
              ) : (
                <></>
              )}
            </th>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">
                  Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as="button"
                    onClick={() => setStatus("Active")}
                  >
                    Active
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => setStatus("Acknowledged")}
                  >
                    Acknowledged
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setStatus("OK")}>
                    OK
                  </Dropdown.Item>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.status = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.status !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.status = "")}
                  style={{
                    fontWeight: "normal",
                    padding: "5px",
                    width: "160px",
                  }}
                >
                  {sortAlarm.status}
                  <CloseButton
                    onClick={() => (sortAlarm.status = "")}
                    style={{
                      scale: "80%",
                      marginLeft: "5px",
                      position: "absolute",
                      top: "5px",
                    }}
                  ></CloseButton>
                </Alert>
              ) : (
                <></>
              )}
            </th>
            <th>
              <div style={{ margin: "6px" }}>Value</div>
            </th>
            <th>
              <div style={{ margin: "6px" }}>Limit</div>
            </th>
            <th>
              <div style={{ margin: "6px" }}>Action</div>
            </th>
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
                          style={{ width: "30px", opacity: "85%" }}
                        />
                      </Dropdown.Toggle>
                      {key == 0 ? (
                        <Dropdown.Menu>
                          <Dropdown.Item>
                            <Button
                              style={{
                                backgroundColor: "transparent",
                                border: "0px",
                                color: "#000000",
                              }}
                              onClick={() =>
                                actionHandle(val.text, "Acknowledged")
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
                              onClick={() => actionHandle(val.text, "Disable")}
                            >
                              Disable
                            </Button>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      ) : (
                        <Dropdown.Menu>
                          <Dropdown.Item>Remove alarm</Dropdown.Item>
                        </Dropdown.Menu>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
    </div>
  );
};
export default AlarmTable;
