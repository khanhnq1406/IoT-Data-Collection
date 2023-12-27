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
import { useNavigate } from "react-router-dom";

let chart;
const Node1 = () => {
  // Delay function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const {
    authState: { role },
  } = useContext(AuthContext);
  // Get data
  const [testForm, setTestForm] = useState({
    data1: "",
    data2: "",
    data3: "",
    data13: "",
    data14: "",
    data15: "",
    setAlarm: false,
    setAlarm1: false,
    setAlarm2: false,
    setAlarm3: false,
    chartId: 1,
  });
  const [lightStatus, setLightStatus] = useState({
    text: "Start",
    image: "/images/light-on.png",
  });
  const {
    data1,
    data2,
    data3,
    data13,
    data14,
    data15,
    setAlarm,
    setAlarm1,
    setAlarm2,
    setAlarm3,
    chartId,
  } = testForm;
  useEffect(() => {
    async function makeRequest() {
      // await sleep(2000);

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
          if (name == "Light1") {
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
        setTestForm((testForm) => ({
          ...testForm,
          data1: dataThen.data[0].value,
          data2: dataThen.data[1].value,
          data3: dataThen.data[2].value,
          data13: dataThen.data[12].value,
          data14: Math.round((dataThen.data[13].value / 3600) * 10) / 10,
          data15: dataThen.data[14].value,
          setAlarm: hasAlarm,
          setAlarm1: hasAlarmArr[0],
          setAlarm2: hasAlarmArr[1],
          setAlarm3: hasAlarmArr[2],
        }));
      });

      // Get chart data
      const chartData = axios.get(`${apiUrl}/database/getChartDataNode1`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: false,
          id: chartId,
        },
      });
      chartData.then((data) => {
        updateChart(data.data);
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
    min_Product1: "",
    min_Product2: "",
    min_Product3: "",
    min_FaultyProduct: "",
    min_Running: "",
    min_OffHour: "",
    max_Product1: "",
    max_Product2: "",
    max_Product3: "",
    max_FaultyProduct: "",
    max_Running: "",
    max_OffHour: "",
  });
  const {
    min_Product1,
    min_Product2,
    min_Product3,
    min_FaultyProduct,
    min_Running,
    min_OffHour,
    max_Product1,
    max_Product2,
    max_Product3,
    max_FaultyProduct,
    max_Running,
    max_OffHour,
  } = alarmValue;

  const onChangeAlarmValue = (event) => {
    setAlarmData({ ...alarmValue, [event.target.name]: event.target.value });
  };

  const setAlarmValueNode1 = async (event) => {
    event.preventDefault();
    const res = axios.post(`${apiUrl}/database/setAlarmValue`, alarmValue);
  };

  useEffect(() => {
    const alarmDataBE = axios.get(`${apiUrl}/database/getAlarmRange`);
    alarmDataBE.then((alarmDataThen) => {
      setAlarmData({
        ...alarmValue,
        min_Product1: alarmDataThen.data[0].min,
        min_Product2: alarmDataThen.data[1].min,
        min_Product3: alarmDataThen.data[2].min,
        min_FaultyProduct: alarmDataThen.data[12].min,
        min_Running: alarmDataThen.data[13].min,
        min_OffHour: alarmDataThen.data[14].min,
        max_Product1: alarmDataThen.data[0].max,
        max_Product2: alarmDataThen.data[1].max,
        max_Product3: alarmDataThen.data[2].max,
        max_FaultyProduct: alarmDataThen.data[12].max,
        max_Running: alarmDataThen.data[13].max,
        max_OffHour: alarmDataThen.data[14].max,
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
        type: "pie",
        data: {
          labels: ["Faulty Product", "Product 3", "Product 2", "Product 1"], // array of x-axis labels
          datasets: [
            {
              label: "Time",
              data: [10, 20, 30, 40], // array of y-axis values
              backgroundColor: [
                "rgb(24, 208, 101)",
                "rgb(54, 162, 235)",
                "rgb(255, 205, 86)",
                "rgb(255, 99, 132)",
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
      const chartData = axios.get(`${apiUrl}/database/getChartDataNode1`, {
        params: {
          sliderValue: sliderValue.sliderValue,
          firstTime: true,
          id: chartId,
        },
      });
      chartData.then((data) => {
        updateChart(data.data);
      });
    };
  }, []);

  function updateChart(data) {
    if (data.length === 4) {
      console.log(data);
      chart.data.labels = [
        "Faulty Product",
        "Product 3",
        "Product 2",
        "Product 1",
      ];
      chart.data.datasets[0].label = data[0].time;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        chart.data.datasets[0].data[index] = element.value;
      }
      chart.update();
    }

    // chart.data.labels.push()
    // const labelsLength = chart.data.labels.length;
    // if (timestamp === chart.data.labels[labelsLength - 1]) {
    //   return;
    // }
    // chart.data.labels.push(timestamp); // add new x-axis label
    // chart.data.datasets[0].label = "Data " + chartId;
    // while (chart.data.datasets[0].data.length >= sliderValue) {
    //   chart.data.datasets[0].data.shift();
    //   chart.data.labels.shift();
    // }
    // chart.data.datasets.forEach((dataset) => {
    //   dataset.data.push(value); // add new y-axis value
    // });
    // chart.update(); // redraw chart
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
    // chart.data.datasets[0].data.length = 0;
    // chart.data.labels.length = 0;
    // const chartData = axios.get(`${apiUrl}/database/getChartDataNode1`, {
    //   params: {
    //     sliderValue: sliderValue.sliderValue,
    //     firstTime: true,
    //     id: chartId,
    //   },
    // });
    // chartData.then((data) => {
    //   for (let index = 0; index < data.data.length; index++) {
    //     const element = data.data[index];
    //     const timestamp = element.date + " " + element.time;
    //     updateChart(timestamp, element.value, sliderValue.sliderValue);
    //   }
    //   chart.data.datasets[0].data.slice(0, -1);
    //   chart.data.labels.slice(0, -1);
    //   chart.update();
    // });
  }

  //Handle button start, stop, reset click
  async function startClick() {
    const data = axios.get(`${apiUrl}/database/setStart`, {
      params: { name: "Light1" },
    });
    console.log("Start:", data);
  }

  async function stopClick() {
    const data = axios.get(`${apiUrl}/database/setStop`, {
      params: { name: "Light1" },
    });
    console.log("Stop: ", data);
  }

  async function resetClick() {
    const data = axios.get(`${apiUrl}/database/setReset`, {
      params: { name: "Light1" },
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
  // useEffect(() => {
  //   // This code will run every time the `stateValue` changes
  //   if (chart != undefined) {
  //     chart.data.datasets[0].data.length = 0;
  //     chart.data.labels.length = 0;
  //     const chartData = axios.get(`${apiUrl}/database/getChartDataNode1`, {
  //       params: {
  //         sliderValue: sliderValue.sliderValue,
  //         firstTime: true,
  //         id: chartId,
  //       },
  //     });
  //     chartData.then((data) => {
  //       for (let index = 0; index < data.data.length; index++) {
  //         const element = data.data[index];
  //         const timestamp = element.date + " " + element.time;
  //         updateChart(timestamp, element.value, sliderValue.sliderValue);
  //       }
  //       chart.data.datasets[0].data.slice(0, -1);
  //       chart.data.labels.slice(0, -1);
  //       chart.update();
  //     });
  //   }
  // }, [chartId]);

  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/node1" />

      <Container>
        <Row>
          {/* Node 1 */}

          <Col className="col-3">
            <Card
              style={{ width: "20.1rem", cursor: "pointer" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text">
                Node 1
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Product 1
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(data1, min_Product1, max_Product1)}
                        >
                          {data1}
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Product 2
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(data2, min_Product2, max_Product2)}
                        >
                          {data2}
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Product 3
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(data3, min_Product3, max_Product3)}
                        >
                          {data3}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col>
                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Faulty
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(
                            data13,
                            min_FaultyProduct,
                            max_FaultyProduct
                          )}
                        >
                          {data13}
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Running
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(data14, min_Running, max_Running)}
                        >
                          {data14}
                        </Card.Text>
                      </Card.Body>
                    </Card>

                    <Card style={{}} className="mb-2">
                      <Card.Body>
                        <Card.Title style={{ fontSize: "20px" }}>
                          Total
                        </Card.Title>

                        <Card.Text
                          className="data-value"
                          style={changeColor(data15, min_OffHour, max_OffHour)}
                        >
                          {data15}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Card
                    style={{ width: "18rem", marginLeft: "12px" }}
                    className="mb-2"
                  >
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        System Status
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
                </Row>
              </Card.Body>
            </Card>
          </Col>
          <Col>
            <Card
              style={{ width: "33.5rem", marginLeft: "6px" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text" href="#">
                {/* <Form.Select
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
                  <option value="1">Pie Charts</option>
                  <option value="2">Chart Data 2</option>
                  <option value="3">Chart Data 3</option>
                </Form.Select> */}
                Product Proportion
              </Card.Header>
              <Card.Body style={{ height: "565px" }}>
                <div style={{ margin: "5px" }}>
                  <canvas id="myChart" width="40" height="500px"></canvas>
                </div>
                {/* <Form>
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
                </Form> */}
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
                        Product Limit
                      </Card.Title>

                      <Row>
                        <Col className="col-2"></Col>
                        <Col style={{ textAlign: "center" }}>Product1</Col>
                        <Col style={{ textAlign: "center" }}>Product2</Col>
                        <Col style={{ textAlign: "center" }}>Product3</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode1}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product1"
                              value={min_Product1}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product2"
                              value={min_Product2}
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product3"
                              value={min_Product3}
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
                              name="max_Product1"
                              value={max_Product1}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Product2"
                              value={max_Product2}
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Product3"
                              value={max_Product3}
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
                          Another Limit
                        </Card.Title>
                        <Row>
                          <Col className="col-2"></Col>
                          <Col style={{ textAlign: "center" }}>Faulty</Col>
                          <Col style={{ textAlign: "center" }}>Running</Col>
                          <Col style={{ textAlign: "center" }}>
                            Total Product
                          </Col>
                        </Row>
                        <Form onSubmit={setAlarmValueNode1}>
                          <Row>
                            <Col className="col-2">Min</Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_FaultyProduct"
                                value={min_FaultyProduct}
                              ></Form.Control>
                            </Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_Running"
                                value={min_Running}
                              ></Form.Control>
                            </Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_OffHour"
                                value={min_OffHour}
                              ></Form.Control>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              className="col-2"
                              style={{ paddingTop: "10px" }}
                            >
                              Max
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="max_FaultyProduct"
                                value={max_FaultyProduct}
                              ></Form.Control>
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="max_Running"
                                value={max_Running}
                              ></Form.Control>
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="max_OffHour"
                                value={max_OffHour}
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
                    <Card>
                      <Card.Body>
                        <Card.Title className="card-header-text">
                          Motor
                        </Card.Title>
                        <Row>
                          <Col style={{ textAlign: "center" }}>
                            <Button
                              className="control-button btn-start"
                              onClick={startClick}
                            >
                              Start
                            </Button>
                          </Col>
                          <Col style={{ textAlign: "center" }}>
                            <Button
                              className="control-button btn-stop"
                              onClick={stopClick}
                            >
                              Stop
                            </Button>
                          </Col>
                          {/* <Col>
                            <Button
                              className="control-button btn-reset"
                              onClick={resetClick}
                            >
                              Reset
                            </Button>
                          </Col> */}
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
                        <Col style={{ textAlign: "center" }}>Data1</Col>
                        <Col style={{ textAlign: "center" }}>Data2</Col>
                        <Col style={{ textAlign: "center" }}>Data3</Col>
                      </Row>
                      <Form onSubmit={setAlarmValueNode1}>
                        <Row>
                          <Col className="col-2">Min</Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product1"
                              value={min_Product1}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product2"
                              value={min_Product2}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="min_Product3"
                              value={min_Product3}
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
                              name="max_Product1"
                              value={max_Product1}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Product2"
                              value={max_Product2}
                              disabled
                            ></Form.Control>
                          </Col>
                          <Col style={{ paddingTop: "10px" }}>
                            <Form.Control
                              style={{ height: "30px" }}
                              onChange={onChangeAlarmValue}
                              name="max_Product3"
                              value={max_Product3}
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
                          Another Limit
                        </Card.Title>
                        <Row>
                          <Col className="col-2"></Col>
                          <Col style={{ textAlign: "center" }}>Faulty</Col>
                          <Col style={{ textAlign: "center" }}>Running</Col>
                          <Col style={{ textAlign: "center" }}>
                            Total Product
                          </Col>
                        </Row>
                        <Form onSubmit={setAlarmValueNode1}>
                          <Row>
                            <Col className="col-2">Min</Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_FaultyProduct"
                                value={min_FaultyProduct}
                                disabled
                              ></Form.Control>
                            </Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_Running"
                                value={min_Running}
                                disabled
                              ></Form.Control>
                            </Col>
                            <Col>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="min_OffHour"
                                value={min_OffHour}
                                disabled
                              ></Form.Control>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              className="col-2"
                              style={{ paddingTop: "10px" }}
                            >
                              Max
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="max_FaultyProduct"
                                value={max_FaultyProduct}
                                disabled
                              ></Form.Control>
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                disabled
                                name="max_Running"
                                value={max_Running}
                              ></Form.Control>
                            </Col>
                            <Col style={{ paddingTop: "10px" }}>
                              <Form.Control
                                style={{ height: "30px" }}
                                onChange={onChangeAlarmValue}
                                name="max_OffHour"
                                value={max_OffHour}
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
                    </Card>
                    <Card>
                      <Card.Body>
                        <Card.Title className="card-header-text">
                          Motor
                        </Card.Title>
                        <Row>
                          <Col style={{ textAlign: "center" }}>
                            <Button
                              className="control-button btn-start"
                              onClick={startClick}
                              disabled
                            >
                              Start
                            </Button>
                          </Col>
                          <Col style={{ textAlign: "center" }}>
                            <Button
                              className="control-button btn-stop"
                              onClick={stopClick}
                              disabled
                            >
                              Stop
                            </Button>
                          </Col>
                          {/* <Col>
                            <Button
                              className="control-button btn-reset"
                              onClick={resetClick}
                              disabled
                            >
                              Reset
                            </Button>
                          </Col> */}
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

export default Node1;
