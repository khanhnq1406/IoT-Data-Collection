import NavbarLayout from "../components/layout/NavbarLayout";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../contexts/constants";
import { useState, useEffect, React } from "react";
import axios from "axios";
import AlarmModal from "../components/layout/Alarm";
import Button from "react-bootstrap/Button";

const Overview = () => {
  // Delay function
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Get data
  const [testForm, setTestForm] = useState({
    setAlarm: false,
  });

  const [lightStatus, setLightStatus] = useState({
    Light1: {
      text: "Start",
      image: "/images/light-on.png",
    },
    Light2: {
      text: "Start",
      image: "/images/light-on.png",
    },
    Light3: {
      text: "Start",
      image: "/images/light-on.png",
    },
    Light4: {
      text: "Start",
      image: "/images/light-on.png",
    },
    Light5: {
      text: "Start",
      image: "/images/light-on.png",
    },
  });

  useEffect(() => {
    async function makeRequest() {
      // await sleep(1000);
      const dataBE = axios.get(`${apiUrl}/test/getData`);
      dataBE.then((dataThen) => {
        console.log(dataThen.data);
        let hasAlarm = false;
        for (let index = 0; index < dataThen.data.length; index++) {
          const element = dataThen.data[index].value;
          const max = dataThen.data[index].max;
          const min = dataThen.data[index].min;
          const name = dataThen.data[index].name;
          if (name.includes("Light")) {
            const espData = dataThen.data[index].espData;
            if (espData == "Stop") {
              lightStatus[name] = {
                text: "Stop",
                image: "/images/light-off.png",
              };
              setLightStatus({
                ...lightStatus,
              });
            } else if (espData == "Start") {
              lightStatus[name] = {
                text: "Start",
                image: "/images/light-on.png",
              };
              setLightStatus({
                ...lightStatus,
              });
            } else if (espData == "Reset") {
              lightStatus[name] = {
                text: "Reset",
                image: "/images/light-reset.png",
              };
              setLightStatus({
                ...lightStatus,
              });
            }
          }
          if (
            (element >= max || element <= min) &&
            max != null &&
            min != null
          ) {
            hasAlarm = true;
          }
          testForm[dataThen.data[index].name] = dataThen.data[index];
        }
        setTestForm({
          ...testForm,
          setAlarm: hasAlarm,
        });
        console.log(testForm);
      });
    }
    makeRequest();
  });
  // User interface handles
  const navigate = useNavigate();
  const onClickToNode1 = () => navigate("/node1");
  const onClickToNode2 = () => navigate("/node2");
  const onClickToNode3 = () => navigate("/node3");
  const onClickToNode4 = () => navigate("/node4");
  const onClickToNode5 = () => navigate("/node5");

  // Change color depend on value
  const changeColor = (data, min, max) =>
    data <= min || data >= max
      ? { color: "#ffc441" }
      : {
          color: "#18D065",
        };

  // Alarm modal show
  const [modalShow, setModalShow] = useState(false);

  // Return
  return (
    <div style={{ backgroundColor: "#eff2f7", paddingBottom: "152px" }}>
      <NavbarLayout defActiveKey="/overview" />
      {testForm.Product1 != undefined ? (
        <Container>
          <Row>
            {/* Node 1 */}
            <Col>
              <Card
                onClick={onClickToNode1}
                style={{ width: "20.1rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 1<br></br>Barcode Classification
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
                            style={changeColor(
                              testForm.Product1.value,
                              testForm.Product1.min,
                              testForm.Product1.max
                            )}
                          >
                            {testForm.Product1.value}
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
                            style={changeColor(
                              testForm.Product2.value,
                              testForm.Product2.min,
                              testForm.Product2.max
                            )}
                          >
                            {testForm.Product2.value}
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
                            style={changeColor(
                              testForm.Product3.value,
                              testForm.Product3.min,
                              testForm.Product3.max
                            )}
                          >
                            {testForm.Product3.value}
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
                              testForm.FaultyProduct.value,
                              testForm.FaultyProduct.min,
                              testForm.FaultyProduct.max
                            )}
                          >
                            {testForm.FaultyProduct.value}
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
                            style={changeColor(
                              testForm.Running.value,
                              testForm.Running.min,
                              testForm.Running.max
                            )}
                          >
                            {Math.round((testForm.Running.value / 3600) * 10) /
                              10}
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
                            style={changeColor(
                              testForm.OffHour.value,
                              testForm.OffHour.min,
                              testForm.OffHour.max
                            )}
                          >
                            {testForm.OffHour.value}
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
                          {lightStatus.Light1.text}
                          <img
                            src={lightStatus.Light1.image}
                            className="light-image"
                          ></img>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            {/* Node 2 */}
            <Col>
              <Card
                onClick={onClickToNode2}
                style={{ width: "20.1rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 2<br></br>Water Tank
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Water Level
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.WaterLevel.value,
                          testForm.WaterLevel.min,
                          testForm.WaterLevel.max
                        )}
                      >
                        {testForm.WaterLevel.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Error
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Error.value,
                          testForm.Error.min,
                          testForm.Error.max
                        )}
                      >
                        {testForm.Error.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>PWM</Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.PWM.value,
                          testForm.PWM.min,
                          testForm.PWM.max
                        )}
                      >
                        {testForm.PWM.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Motor Status
                      </Card.Title>
                      <Card.Text className="light-status">
                        {lightStatus.Light2.text}
                        <img
                          src={lightStatus.Light2.image}
                          className="light-image"
                        ></img>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>

            {/* Node 3 */}
            <Col>
              <Card
                onClick={onClickToNode3}
                style={{ width: "20.1rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 3<br></br>Automatic Fire Alarm
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Temperature
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Temperature.value,
                          testForm.Temperature.min,
                          testForm.Temperature.max
                        )}
                      >
                        {testForm.Temperature.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>PPM</Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.PPM.value,
                          testForm.PPM.min,
                          testForm.PPM.max
                        )}
                      >
                        {testForm.PPM.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Humidity
                      </Card.Title>

                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Humidity.value,
                          testForm.Humidity.min,
                          testForm.Humidity.max
                        )}
                      >
                        {testForm.Humidity.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "18rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Motor Status
                      </Card.Title>
                      <Card.Text className="light-status">
                        {lightStatus.Light3.text}
                        <img
                          src={lightStatus.Light3.image}
                          className="light-image"
                        ></img>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      ) : (
        <div>
          <img
            style={{ width: "100%", height: "auto" }}
            src="images/loading.gif"
          />
        </div>
      )}
      {/* Alarm */}

      {testForm.setAlarm && (
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
export default Overview;
