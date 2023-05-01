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
import exportFromJSON from "export-from-json";
const AlarmTable = () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const [sortAlarm, setsortAlarm] = useState({
    date: "",
    time: "",
    text: "",
    status: "",
  });

  const [currentPageData, setCurrentPage] = useState({
    totalPages: null,
    pageData: null,
    pageNumbers: [],
    pageSize: 10,
    currentPage: 1,
  });
  const [allData, setAllData] = useState();
  const { totalPages, pageData, pageNumbers, pageSize, currentPage } =
    currentPageData;
  useEffect(() => {
    async function makeRequest() {
      await sleep(1000);
      const data = axios.get(`${apiUrl}/database/getAlarmTable`, {
        params: { sortAlarm },
      });
      data.then((data) => {
        const alarmData = data.data;
        setAllData(alarmData.reverse());
        Pagination(alarmData);
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
    const dateString =
      (String(day).length == 1 ? "0" + day : day) +
      "/" +
      (String(Number(month + 1)).length == 1
        ? "0" + Number(month + 1)
        : Number(month + 1)) +
      "/" +
      year;
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

  const Pagination = (data) => {
    // Calculate the total number of pages
    const totalPagesValue = Math.ceil(data.length / pageSize);
    // Calculate the starting and ending index for the current page
    const startIndex = (Number(currentPage) - 1) * Number(pageSize);
    const endIndex = Number(startIndex) + Number(pageSize);

    // Get the data for the current page
    const currentPageValue = data.slice(startIndex, endIndex);
    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      totalPages: totalPagesValue,
      pageData: currentPageValue,
    }));
    renderPageNumbers();
  };

  function handlePageSize(e) {
    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      currentPage: 1,
      pageSize: e.target.value,
    }));
  }

  // Render the page numbers
  const renderPageNumbers = () => {
    const pageNumbersValue = [];

    for (let i = 1; i <= totalPages; i++) {
      pageNumbersValue.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    setCurrentPage((currentPageData) => ({
      ...currentPageData,
      pageNumbers: pageNumbersValue,
    }));
  };

  //Export json to excel file
  const ExportToExcel = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const dateString = day + "_" + Number(month + 1) + "_" + year;
    const timeString = hour + "_" + minute + "_" + second;
    let fileName = "Alarm_" + dateString + "-" + timeString;
    let exportType = exportFromJSON.types.xls;
    exportFromJSON({
      data: allData,
      fileName: fileName,
      exportType: exportType,
    });
  };
  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/alarm-table" />
      <h1 style={{ margin: "5px" }}>Alarm</h1>
      <div style={{ margin: "5px" }}>
        <Button onClick={ExportToExcel}>Export to Excel</Button>
      </div>
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
                  <Dropdown.Item onClick={() => (sortAlarm.date = "Ascending")}>
                    Ascending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => (sortAlarm.date = "Descending")}
                  >
                    Descending
                  </Dropdown.Item>
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
                  <Dropdown.Item onClick={() => (sortAlarm.time = "Ascending")}>
                    Ascending
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => (sortAlarm.time = "Descending")}
                  >
                    Descending
                  </Dropdown.Item>
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
          {pageData &&
            pageData.map((val, key) => {
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
                    {key == 0 && val.status != "OK" ? (
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
                      </Dropdown>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </Table>
      <div>
        {pageData != null ? (
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", position: "absolute", left: "5%" }}>
              <div>Page</div>
              <select
                style={{ marginLeft: "5px", marginRight: "5px" }}
                value={currentPage}
                onChange={(e) =>
                  setCurrentPage((currentPageData) => ({
                    ...currentPageData,
                    currentPage: e.target.value,
                  }))
                }
              >
                {pageNumbers}
              </select>
              <div>of {totalPages}</div>
            </div>
            <div style={{ display: "flex", position: "absolute", right: "5%" }}>
              <div>Items per page</div>
              <select
                style={{ marginLeft: "5px" }}
                value={pageSize}
                onChange={handlePageSize}
              >
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
                <option value="30">30</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default AlarmTable;
