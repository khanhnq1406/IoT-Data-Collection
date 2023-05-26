import Table from "react-bootstrap/esm/Table";
import NavbarLayout from "../components/layout/NavbarLayout";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/esm/Button";
import CloseButton from "react-bootstrap/CloseButton";
import exportFromJSON from "export-from-json";
const Node1DataTable = () => {
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const [sortAlarm, setsortAlarm] = useState({
    date: "",
    time: "",
    status: "",
    node: "",
    name: "",
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
      const data = axios.get(`${apiUrl}/database/getDataTable`, {
        params: { sortAlarm },
      });
      data.then((data) => {
        console.log(data.data);
        let alarmData = data.data.data;
        var filtered = alarmData.filter(function (value, index, arr) {
          return value.data_table != null;
        });
        setAllData(filtered.reverse());
        Pagination(filtered);
      });
    }
    makeRequest();
  });
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

  async function setNode(node) {
    setsortAlarm({ ...sortAlarm, node: node });
  }

  async function setName(event) {
    const name = event.target.value;
    setsortAlarm({ ...sortAlarm, name: name });
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

  async function setStatus(status) {
    setsortAlarm({ ...sortAlarm, status: status });
  }

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
    let fileName = "Data_" + dateString + "-" + timeString;
    let exportType = exportFromJSON.types.xls;
    exportFromJSON({
      data: allData,
      fileName: fileName,
      exportType: exportType,
    });
  };
  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "80px" }}>
      <NavbarLayout defActiveKey="/data-table" />
      <h1 style={{ margin: "5px" }}>Data Table</h1>
      <div style={{ margin: "5px" }}>
        <Button onClick={ExportToExcel}>Export to Excel</Button>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">Node</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={() => setNode("Node 1")}>
                    Node 1
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setNode("Node 2")}>
                    Node 2
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setNode("Node 3")}>
                    Node 3
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setNode("Node 4")}>
                    Node 4
                  </Dropdown.Item>
                  <Dropdown.Item as="button" onClick={() => setNode("Node 5")}>
                    Node 5
                  </Dropdown.Item>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.node = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.node !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.node = "")}
                  style={{
                    fontWeight: "normal",
                    width: "93px",
                    padding: "5px",
                  }}
                >
                  {sortAlarm.node}
                  <CloseButton
                    onClick={() => (sortAlarm.node = "")}
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
                <Dropdown.Toggle className="header-table">Name</Dropdown.Toggle>
                <Dropdown.Menu>
                  <div>
                    <Form.Control
                      type="input"
                      onChange={setName}
                      style={{ border: "0px" }}
                      placeholder="Search values"
                    />
                  </div>
                  <Dropdown.Divider></Dropdown.Divider>
                  <Dropdown.Item onClick={() => (sortAlarm.name = "")}>
                    Clear Filter
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {sortAlarm.name !== "" ? (
                <Alert
                  variant="primary"
                  onClose={() => (sortAlarm.name = "")}
                  style={{
                    fontWeight: "normal",
                    padding: "5px",
                  }}
                >
                  {sortAlarm.name}
                  <CloseButton
                    onClick={() => (sortAlarm.name = "")}
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
                    width: "130px",
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
                    width: "130px",
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
            <th style={{ margin: "6px" }}>Value</th>
            <th style={{ margin: "6px" }}>Min</th>
            <th style={{ margin: "6px" }}>Max</th>
            <th>
              <Dropdown>
                <Dropdown.Toggle className="header-table">
                  Status
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item as="button" onClick={() => setStatus("Good")}>
                    Good
                  </Dropdown.Item>
                  <Dropdown.Item
                    as="button"
                    onClick={() => setStatus("Warning")}
                  >
                    Warning
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
          </tr>
        </thead>
        <tbody>
          {pageData &&
            pageData.map((val, key) => {
              return (
                <tr
                  bgcolor={val.status == "Good" ? "#00f300" : "#ffa500"}
                  key={key}
                >
                  {val.data_table != null ? (
                    <td>{val.data_table.node}</td>
                  ) : (
                    <td>Null</td>
                  )}
                  {val.data_table != null ? (
                    <td>{val.data_table.name}</td>
                  ) : (
                    <td>Null</td>
                  )}
                  <td>{val.date}</td>
                  <td>{val.time}</td>
                  <td>{val.value}</td>
                  <td>{val.min}</td>
                  <td>{val.max}</td>
                  <td>{val.status}</td>
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
export default Node1DataTable;
