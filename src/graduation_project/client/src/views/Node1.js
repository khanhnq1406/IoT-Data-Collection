import NavbarLayout from "../components/layout/NavbarLayout";
import { useState, useEffect, useRef } from "react";
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
let chart;
const Node1 = () => {
  // Delay function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Get data
  const [testForm, setTestForm] = useState({
    data1: "",
    data2: "",
    data3: "",
    setAlarm: false,
  });
  const { data1, data2, data3, setAlarm } = testForm;
  useEffect(() => {
    async function makeRequest() {
      await sleep(2000);
      const dataBE = axios.get(`${apiUrl}/test/getData`);
      dataBE.then((dataThen) => {
        let hasAlarm = false;
        for (let index = 0; index < dataThen.data.length; index++) {
          const element = dataThen.data[index].value;
          const max = dataThen.data[index].max;
          const min = dataThen.data[index].min;
          if (
            (element >= max || element <= min) &&
            max != null &&
            min != null
          ) {
            hasAlarm = true;
            break;
          }
        }
        setTestForm({
          ...testForm,
          data1: dataThen.data[0].value,
          data2: dataThen.data[1].value,
          data3: dataThen.data[2].value,
          setAlarm: hasAlarm,
        });
      });
      const chartData = axios.get(`${apiUrl}/database/getChartData`, {
        params: { sliderValue: sliderValue, firstTime: false },
      });
      chartData.then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          const timestamp = element.date + " " + element.time;
          updateChart(timestamp, element.value, sliderValue);
        }
      });
      // const newData = Math.random() * 100;
      // updateChart(newData);
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
    minData1: "",
    minData2: "",
    minData3: "",
    maxData1: "",
    maxData2: "",
    maxData3: "",
  });
  const { minData1, minData2, minData3, maxData1, maxData2, maxData3 } =
    alarmValue;

  const onChangeAlarmValue = (event) => {
    setAlarmData({ ...alarmValue, [event.target.name]: event.target.value });
  };

  const setAlarmValue = async (event) => {
    event.preventDefault();
    const res = axios.post(`${apiUrl}/database/setAlarmValue`, alarmValue);
  };

  useEffect(() => {
    const alarmDataBE = axios.get(`${apiUrl}/database/getAlarmRange`);
    alarmDataBE.then((alarmDataThen) => {
      setAlarmData({
        ...alarmValue,
        minData1: alarmDataThen.data[0].min,
        minData2: alarmDataThen.data[1].min,
        minData3: alarmDataThen.data[2].min,
        maxData1: alarmDataThen.data[0].max,
        maxData2: alarmDataThen.data[1].max,
        maxData3: alarmDataThen.data[2].max,
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
        params: { sliderValue: sliderValue, firstTime: true },
      });
      chartData.then((data) => {
        for (let index = 0; index < data.data.length; index++) {
          const element = data.data[index];
          const timestamp = element.date + " " + element.time;
          updateChart(timestamp, element.value, sliderValue);
        }
      });
    };
  }, []);

  function updateChart(timestamp, value, sliderValue) {
    const labelsLength = chart.data.labels.length;
    if (timestamp === chart.data.labels[labelsLength - 2]) {
      return;
    }
    chart.data.labels.push(timestamp); // add new x-axis label
    console.log(
      "chart.data.datasets[0].data.length: ",
      chart.data.datasets[0].data.length
    );

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
  const [sliderValue, setValue] = useState(10);
  function handleOnChange(event) {
    setValue(event.target.value);
    console.log("sliderValue: ", sliderValue);
  }

  function handleOnClick(event) {
    setValue(event.target.value);
    console.log("sliderValue: ", sliderValue);
    chart.data.datasets[0].data.length = 0;
    chart.data.labels.length = 0;
    const chartData = axios.get(`${apiUrl}/database/getChartData`, {
      params: { sliderValue: sliderValue, firstTime: true },
    });
    chartData.then((data) => {
      for (let index = 0; index < data.data.length; index++) {
        const element = data.data[index];
        const timestamp = element.date + " " + element.time;
        updateChart(timestamp, element.value, sliderValue);
      }
    });
  }

  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/node1" />

      <Container>
        <Row>
          {/* Node 1 */}
          <Col className="col-3">
            <Card
              style={{ width: "19.1rem", cursor: "pointer" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text" href="/node1">
                Node 1
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 1</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data1, minData1, maxData1)}
                    >
                      {data1}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 2</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data2, minData2, maxData2)}
                    >
                      {data2}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "17rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 3</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data3, minData3, maxData3)}
                    >
                      {data3}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "33.5rem" }} className="alight-center">
              <Card.Header as="h5" className="card-header-text" href="/node1">
                Chart 1
              </Card.Header>
              <Card.Body style={{ height: "550px" }}>
                <div>
                  <canvas id="myChart" width="40" height="430px"></canvas>
                </div>
                <div>
                  <Form.Label>Data Display</Form.Label>
                  <Form.Range
                    min="10"
                    max="100"
                    value={sliderValue}
                    onChange={handleOnChange}
                    onClick={handleOnClick}
                  />
                  <Form.Text className="text-muted">
                    Value: {sliderValue}
                  </Form.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>

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
                      <Col style={{ textAlign: "center" }}>Data1</Col>
                      <Col style={{ textAlign: "center" }}>Data2</Col>
                      <Col style={{ textAlign: "center" }}>Data3</Col>
                    </Row>
                    <Form onSubmit={setAlarmValue}>
                      <Row>
                        <Col className="col-2">Min</Col>
                        <Col>
                          <Form.Control
                            style={{ height: "30px" }}
                            onChange={onChangeAlarmValue}
                            name="minData1"
                            value={minData1}
                          ></Form.Control>
                        </Col>
                        <Col>
                          <Form.Control
                            style={{ height: "30px" }}
                            onChange={onChangeAlarmValue}
                            name="minData2"
                            value={minData2}
                          ></Form.Control>
                        </Col>
                        <Col>
                          <Form.Control
                            style={{ height: "30px" }}
                            onChange={onChangeAlarmValue}
                            name="minData3"
                            value={minData3}
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
                            name="maxData1"
                            value={maxData1}
                          ></Form.Control>
                        </Col>
                        <Col style={{ paddingTop: "10px" }}>
                          <Form.Control
                            style={{ height: "30px" }}
                            onChange={onChangeAlarmValue}
                            name="maxData2"
                            value={maxData2}
                          ></Form.Control>
                        </Col>
                        <Col style={{ paddingTop: "10px" }}>
                          <Form.Control
                            style={{ height: "30px" }}
                            onChange={onChangeAlarmValue}
                            name="maxData3"
                            value={maxData3}
                          ></Form.Control>
                        </Col>
                      </Row>
                      <Button
                        style={{ display: "none" }}
                        type="submit"
                      ></Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>
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

export default Node1;
