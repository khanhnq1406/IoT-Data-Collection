import NavbarLayout from "../components/layout/NavbarLayout";
import { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { apiUrl } from "../contexts/constants";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import AlarmModal from "../components/layout/Alarm";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Chart from "chart.js/auto";
import { AuthContext } from "../contexts/AuthContext";

let chart;
const Node4 = () => {
  // Delay function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const {
    authState: { role },
  } = useContext(AuthContext);
  // Get data
  const [testForm, setTestForm] = useState({
    data13: "",
    data14: "",
    data15: "",
    setAlarm: false,
    setAlarm13: false,
    setAlarm14: false,
    setAlarm15: false,
    chartId: "13",
  });
  const [lightStatus, setLightStatus] = useState({
    text: "Start",
    image: "/images/light-on.png",
  });
  const {
    data13,
    data14,
    data15,
    setAlarm,
    setAlarm13,
    setAlarm14,
    setAlarm15,
    chartId,
  } = testForm;
  useEffect(() => {
    async function makeRequest() {
      await sleep(2000);

      // Get number data
      const dataBE = axios.get(`${apiUrl}/test/getData`);
      dataBE.then((dataThen) => {
        let hasAlarm = false;
        let hasAlarmArr = [false, false, false];
        for (let index = 0; index < dataThen.data.length; index++) {
          const element = dataThen.data[index].value;
          const max = dataThen.data[index].max;
          const min = dataThen.data[index].min;
          const name = dataThen.data[index].name;
          if (name === "Light4") {
            const espData = dataThen.data[index].espData;
            if (espData == "Stop") {
              setLightStatus({
                ...lightStatus,
                text: "Stop",
                image: "/images/light-off.png",
              });
            } else if (espData == "Start") {
              setLightStatus({
                ...lightStatus,
                text: "Start",
                image: "/images/light-on.png",
              });
            } else if (espData == "Reset") {
              setLightStatus({
                ...lightStatus,
                text: "Reset",
                image: "/images/light-reset.png",
              });
            }
          }
          if (
            (element >= max || element <= min) &&
            max != null &&
            min != null
          ) {
            hasAlarm = true;
            hasAlarmArr[index] = true;
          }
        }
        console.log(dataThen.data);
        setTestForm((testForm) => ({
          ...testForm,
          data13: dataThen.data[12].value,
          data14: dataThen.data[13].value,
          data15: dataThen.data[14].value,
          setAlarm: hasAlarm,
          setAlarm13: hasAlarmArr[12],
          setAlarm14: hasAlarmArr[13],
          setAlarm15: hasAlarmArr[14],
        }));
      });

      // Get chart data
      const chartData = axios.get(`${apiUrl}/database/getChartData`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: false,
          id: chartId,
        },
      });
      chartData.then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          const timestamp = element.date + " " + element.time;
          updateChart(timestamp, element.value, sliderValue.sliderValue);
        }
      });
    }
    makeRequest();
  });

  // Change color depend on value
  const changeColor = (data, min, max) =>
    data <= min || data >= max
      ? { color: "#ffc441" }
      : {
          color: "#18D065",
        };
  // Alarm modal show
  const [modalShow, setModalShow] = useState(false);

  // Set alarm
  const [alarmValue, setAlarmData] = useState({
    min_Data13: "",
    min_Data14: "",
    min_Data15: "",
    max_Data13: "",
    max_Data14: "",
    max_Data15: "",
  });
  const {
    min_Data13,
    min_Data14,
    min_Data15,
    max_Data13,
    max_Data14,
    max_Data15,
  } = alarmValue;

  const onChangeAlarmValue = (event) => {
    setAlarmData({ ...alarmValue, [event.target.name]: event.target.value });
  };

  const setAlarmValueNode2 = async (event) => {
    event.preventDefault();
    const res = axios.post(`${apiUrl}/database/setAlarmValue`, alarmValue);
  };

  useEffect(() => {
    const alarmDataBE = axios.get(`${apiUrl}/database/getAlarmRange`);
    alarmDataBE.then((alarmDataThen) => {
      console.log(alarmDataThen.data);
      setAlarmData({
        ...alarmValue,
        min_Data13: alarmDataThen.data[9].min,
        min_Data14: alarmDataThen.data[10].min,
        min_Data15: alarmDataThen.data[11].min,
        max_Data13: alarmDataThen.data[9].max,
        max_Data14: alarmDataThen.data[10].max,
        max_Data15: alarmDataThen.data[11].max,
      });
    });
  }, []);

  // Chart
  useEffect(() => {
    return () => {
      const existingChart = Chart.getChart("0"); //get the existing chart instance
      console.log("existingChart:", existingChart);
      if (existingChart) {
        existingChart.destroy(); // destroy the existing chart
      }
      const ctx = document.getElementById("myChart").getContext("2d");
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: [], // array of x-axis labels
          datasets: [
            {
              label: "Data " + chartId,
              data: [], // array of y-axis values
              backgroundColor: "rgba(255, 99, 132, 0.2)", // fill color
              borderColor: "rgba(255, 99, 132, 1)", // line color
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      const chartData = axios.get(`${apiUrl}/database/getChartData`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: true,
          id: chartId,
        },
      });
      chartData.then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          const timestamp = element.date + " " + element.time;
          updateChart(timestamp, element.value, sliderValue.sliderValue);
        }
      });
    };
  }, []);

  function updateChart(timestamp, value, sliderValue) {
    const labelsLength = chart.data.labels.length;
    if (timestamp === chart.data.labels[labelsLength - 1]) {
      return;
    }
    chart.data.labels.push(timestamp); // add new x-axis label
    chart.data.datasets[0].label = "Data " + chartId;
    while (chart.data.datasets[0].data.length >= sliderValue) {
      chart.data.datasets[0].data.shift();
      chart.data.labels.shift();
    }
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(value); // add new y-axis value
    });
    chart.update(); // redraw chart
  }

  // Slider
  const [sliderValue, setValue] = useState({
    sliderValue: 10,
    limitData: 10,
  });
  function handleOnChange(event) {
    setValue({ ...sliderValue, sliderValue: event.target.value });
  }

  function handleOnClick(event) {
    chart.data.datasets[0].data.length = 0;
    chart.data.labels.length = 0;
    const chartData = axios.get(`${apiUrl}/database/getChartData`, {
      params: {
        sliderValue: sliderValue.sliderValue,
        firstTime: true,
        id: chartId,
      },
    });
    chartData.then((data) => {
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        const timestamp = element.date + " " + element.time;
        updateChart(timestamp, element.value, sliderValue.sliderValue);
      }
      chart.data.datasets[0].data.slice(0, -1);
      chart.data.labels.slice(0, -1);
      chart.update();
    });
  }

  //Handle button start, stop, reset click
  async function startClick() {
    const data = axios.get(`${apiUrl}/database/setStart`, {
      params: { name: "Light4" },
    });
    console.log("Start:", data);
  }

  async function stopClick() {
    const data = axios.get(`${apiUrl}/database/setStop`, {
      params: { name: "Light4" },
    });
    console.log("Stop: ", data);
  }

  async function resetClick() {
    const data = axios.get(`${apiUrl}/database/setReset`, {
      params: { name: "Light4" },
    });
    console.log("Reset: ", data);
  }

  function handleChartId(event) {
    const dataId = event.target.value;
    setTestForm((testForm) => ({
      ...testForm,
      chartId: dataId,
    }));
  }
  useEffect(() => {
    // This code will run every time the `stateValue` changes
    if (chart != undefined) {
      chart.data.datasets[0].data.length = 0;
      chart.data.labels.length = 0;
      const chartData = axios.get(`${apiUrl}/database/getChartData`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: true,
          id: chartId,
        },
      });
      chartData.then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          const timestamp = element.date + " " + element.time;
          updateChart(timestamp, element.value, sliderValue.sliderValue);
        }
        chart.data.datasets[0].data.slice(0, -1);
        chart.data.labels.slice(0, -1);
        chart.update();
      });
    }
  }, [chartId]);

  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/node4" />

      <Container>
        <Row>
          {/* Node 1 */}
          <Col className="col-3">
            <Card
              style={{ width: "19.1rem", cursor: "pointer" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text">
                Node 4
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>
                      Data 13
                    </Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data13, min_Data13, max_Data13)}
                    >
                      {data13}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>
                      Data 14
                    </Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data14, min_Data14, max_Data14)}
                    >
                      {data14}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>
                      Data 15
                    </Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data15, min_Data15, max_Data15)}
                    >
                      {data15}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>
                      Light 4
                    </Card.Title>
                    <Card.Text className="light-status">
                      {lightStatus.text}
                      <img
                        src={lightStatus.image}
                        className="light-image"
                      ></img>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card style={{ width: "33.5rem" }} className="alight-center">
              <Card.Header as="h5" className="card-header-text" href="#">
                <Form.Select
                  aria-label="Default select example"
                  style={{
                    fontSize: "0.92em",
                    fontWeight: "unset",
                    fontFamily: "Poppins, sans-serif",
                    textAlign: "center",
                    backgroundColor: "transparent",
                    // border: "0px",
                  }}
                  onChange={handleChartId}
                >
                  <option value="13">Chart Data 13</option>
                  <option value="14">Chart Data 14</option>
                  <option value="15">Chart Data 15</option>
                </Form.Select>
              </Card.Header>
              <Card.Body style={{ height: "550px" }}>
                <div>
                  <canvas id="myChart" width="40" height="430px"></canvas>
                </div>
                <Form>
                  <Form.Label>Data Display</Form.Label>
                  <Form.Range
                    min="10"
                    max="100"
                    value={sliderValue.sliderValue}
                    onChange={handleOnChange}
                    onClick={handleOnClick}
                  />
                  <Form.Text className="text-muted">
                    Value: {sliderValue.sliderValue}
                  </Form.Text>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          {role == "admin" || role == "operator" ? (
            <Col>
              <Card style={{ width: "25rem" }} className="alight-center">
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Control
                </Card.Header>

                <Card.Body>
                  <Card>
                    <Card.Body>
                      <Card.Title className="card-header-text">
                        Setting Value
                      </Card.Title>

                      <Row>
                        <Col className="col-2"></Col>
                        <Col style={{ textAlign: "center" }}>Data 13</Col>
                        <Col style={{ textAlign: "center" }}>Data 14</Col>
                        <Col style={{ textAlign: "center" }}>Data 15</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode2}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data13"
                              value={min_Data13}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data14"
                              value={min_Data14}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data15"
                              value={min_Data15}
                            ></Form.Control>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-2" style={{ paddingTop: "10px" }}>
                            Max
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data13"
                              value={max_Data13}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data14"
                              value={max_Data14}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data15"
                              value={max_Data15}
                            ></Form.Control>
                          </Col>
                        </Row>
                        <Button
                          style={{ display: "none" }}
                          type="submit"
                        ></Button>
                      </Form>
                    </Card.Body>

                    <Card>
                      <Card.Body>
                        <Card.Title className="card-header-text">
                          Button
                        </Card.Title>
                        <Row>
                          <Col>
                            <Button
                              className="control-button btn-start"
                              onClick={startClick}
                            >
                              Start
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="control-button btn-stop"
                              onClick={stopClick}
                            >
                              Stop
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="control-button btn-reset"
                              onClick={resetClick}
                            >
                              Reset
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          ) : (
            <Col>
              <Card style={{ width: "25rem" }} className="alight-center">
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Control
                </Card.Header>

                <Card.Body>
                  <Card>
                    <Card.Body>
                      <Card.Title className="card-header-text">
                        Setting Value
                      </Card.Title>

                      <Row>
                        <Col className="col-2"></Col>
                        <Col style={{ textAlign: "center" }}>Data 13</Col>
                        <Col style={{ textAlign: "center" }}>Data 14</Col>
                        <Col style={{ textAlign: "center" }}>Data 15</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode2}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data13"
                              value={min_Data13}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data14"
                              value={min_Data14}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data15"
                              value={min_Data15}
                              disabled
                            ></Form.Control>
                          </Col>
                        </Row>
                        <Row>
                          <Col className="col-2" style={{ paddingTop: "10px" }}>
                            Max
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data13"
                              value={max_Data13}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data14"
                              value={max_Data14}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data15"
                              value={max_Data15}
                              disabled
                            ></Form.Control>
                          </Col>
                        </Row>
                        <Button
                          style={{ display: "none" }}
                          type="submit"
                        ></Button>
                      </Form>
                    </Card.Body>

                    <Card>
                      <Card.Body>
                        <Card.Title className="card-header-text">
                          Button
                        </Card.Title>
                        <Row>
                          <Col>
                            <Button
                              className="control-button btn-start"
                              onClick={startClick}
                              disabled
                            >
                              Start
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="control-button btn-stop"
                              onClick={stopClick}
                              disabled
                            >
                              Stop
                            </Button>
                          </Col>
                          <Col>
                            <Button
                              className="control-button btn-reset"
                              onClick={resetClick}
                              disabled
                            >
                              Reset
                            </Button>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      {/* Alarm */}

      {setAlarm && (
        <>
          <Button
            className="alarm-button"
            style={{
              backgroundColor: "transparent",
              border: "0px",
              scale: "10%",
            }}
            onClick={() => setModalShow(true)}
          >
            <img src="images/alarm.gif"></img>
          </Button>
          <AlarmModal show={modalShow} onHide={() => setModalShow(false)} />
        </>
      )}
    </div>
  );
};

export default Node4;
