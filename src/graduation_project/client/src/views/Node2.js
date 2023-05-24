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
const Node2 = () => {
  // Delay function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const {
    authState: { role },
  } = useContext(AuthContext);
  // Get data
  const [testForm, setTestForm] = useState({
    data4: "",
    data5: "",
    data6: "",
    setAlarm: false,
    setAlarm4: false,
    setAlarm5: false,
    setAlarm6: false,
  });
  const [lightStatus, setLightStatus] = useState({
    text: "Start",
    image: "/images/light-on.png",
  });
  const { data4, data5, data6, setAlarm, setAlarm4, setAlarm5, setAlarm6 } =
    testForm;
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
          if (name === "Light2") {
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
        setTestForm({
          ...testForm,
          data4: dataThen.data[3].value,
          data5: dataThen.data[4].value,
          data6: dataThen.data[5].value,
          setAlarm: hasAlarm,
          setAlarm4: hasAlarmArr[3],
          setAlarm5: hasAlarmArr[4],
          setAlarm6: hasAlarmArr[5],
        });
      });

      // Get chart data
      const chartData = axios.get(`${apiUrl}/database/getChartData`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: false,
          id: 2,
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
    min_Data4: "",
    min_Data5: "",
    min_Data6: "",
    max_Data4: "",
    max_Data5: "",
    max_Data6: "",
  });
  const { min_Data4, min_Data5, min_Data6, max_Data4, max_Data5, max_Data6 } =
    alarmValue;

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
      setAlarmData({
        ...alarmValue,
        min_Data4: alarmDataThen.data[3].min,
        min_Data5: alarmDataThen.data[4].min,
        min_Data6: alarmDataThen.data[5].min,
        max_Data4: alarmDataThen.data[3].max,
        max_Data5: alarmDataThen.data[4].max,
        max_Data6: alarmDataThen.data[5].max,
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
              label: "Temperature",
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
          id: 2,
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
      params: { sliderValue: sliderValue.sliderValue, firstTime: true, id: 2 },
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
      params: { name: "Light2" },
    });
    console.log("Start:", data);
  }

  async function stopClick() {
    const data = axios.get(`${apiUrl}/database/setStop`, {
      params: { name: "Light2" },
    });
    console.log("Stop: ", data);
  }

  async function resetClick() {
    const data = axios.get(`${apiUrl}/database/setReset`, {
      params: { name: "Light2" },
    });
    console.log("Reset: ", data);
  }
  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/node2" />

      <Container>
        <Row>
          {/* Node 1 */}
          <Col className="col-3">
            <Card
              style={{ width: "19.1rem", cursor: "pointer" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text" href="/node1">
                Node 2
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 4</Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data4, min_Data4, max_Data4)}
                    >
                      {data4}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 5</Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data5, min_Data5, max_Data5)}
                    >
                      {data5}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 6</Card.Title>

                    <Card.Text
                      className="data-value"
                      style={changeColor(data6, min_Data6, max_Data6)}
                    >
                      {data6}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Light</Card.Title>
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
              <Card.Header as="h5" className="card-header-text" href="/node1">
                Chart 2
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
                        <Col style={{ textAlign: "center" }}>Data 4</Col>
                        <Col style={{ textAlign: "center" }}>Data 5</Col>
                        <Col style={{ textAlign: "center" }}>Data 6</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode2}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data4"
                              value={min_Data4}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data5"
                              value={min_Data5}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data6"
                              value={min_Data6}
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
                              name="max_Data4"
                              value={max_Data4}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data5"
                              value={max_Data5}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data6"
                              value={max_Data6}
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
                        <Col style={{ textAlign: "center" }}>Data 4</Col>
                        <Col style={{ textAlign: "center" }}>Data 5</Col>
                        <Col style={{ textAlign: "center" }}>Data 6</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode2}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data4"
                              value={min_Data4}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data5"
                              value={min_Data5}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Data6"
                              value={min_Data6}
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
                              name="max_Data4"
                              value={max_Data4}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data5"
                              value={max_Data5}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Data6"
                              value={max_Data6}
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

export default Node2;