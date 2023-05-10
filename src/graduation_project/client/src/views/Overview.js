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
      });
    }
    makeRequest();
  });
  // User interface handles
  const navigate = useNavigate();
  const onClickToNode1 = () => navigate("/node1");
  const onClickToNode2 = () => navigate("#node2");
  const onClickToNode3 = () => navigate("#node3");

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
      {testForm.Data1 != undefined ? (
        <Container>
          <Row>
            {/* Node 1 */}
            <Col>
              <Card
                onClick={onClickToNode1}
                style={{ width: "14.2rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 1
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 1
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data1.value,
                          testForm.Data1.min,
                          testForm.Data1.max
                        )}
                      >
                        {testForm.Data1.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 2
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data2.value,
                          testForm.Data2.min,
                          testForm.Data2.max
                        )}
                      >
                        {testForm.Data2.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 3
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data3.value,
                          testForm.Data3.min,
                          testForm.Data3.max
                        )}
                      >
                        {testForm.Data3.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Light 1
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
                </Card.Body>
              </Card>
            </Col>

            {/* Node 2 */}
            <Col>
              <Card
                onClick={onClickToNode2}
                style={{ width: "14.2rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 2
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 4
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data4.value,
                          testForm.Data4.min,
                          testForm.Data4.max
                        )}
                      >
                        {testForm.Data4.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 5
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data5.value,
                          testForm.Data5.min,
                          testForm.Data5.max
                        )}
                      >
                        {testForm.Data5.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 6
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data6.value,
                          testForm.Data6.min,
                          testForm.Data6.max
                        )}
                      >
                        {testForm.Data6.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Light 2
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
                style={{ width: "14.2rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 3
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 7
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data7.value,
                          testForm.Data7.min,
                          testForm.Data7.max
                        )}
                      >
                        {testForm.Data7.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 8
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data8.value,
                          testForm.Data8.min,
                          testForm.Data8.max
                        )}
                      >
                        {testForm.Data8.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 10
                      </Card.Title>

                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data10.value,
                          testForm.Data10.min,
                          testForm.Data10.max
                        )}
                      >
                        {testForm.Data10.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Light 3
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

            {/* Node 4 */}
            <Col>
              <Card
                onClick={onClickToNode1}
                style={{ width: "14.2rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 4
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 13
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data13.value,
                          testForm.Data13.min,
                          testForm.Data13.max
                        )}
                      >
                        {testForm.Data13.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 14
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data14.value,
                          testForm.Data14.min,
                          testForm.Data14.max
                        )}
                      >
                        {testForm.Data14.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 15
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data15.value,
                          testForm.Data15.min,
                          testForm.Data15.max
                        )}
                      >
                        {testForm.Data15.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Light 4
                      </Card.Title>
                      <Card.Text className="light-status">
                        {lightStatus.Light4.text}
                        <img
                          src={lightStatus.Light4.image}
                          className="light-image"
                        ></img>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                onClick={onClickToNode1}
                style={{ width: "14.2rem", cursor: "pointer" }}
                className="alight-center"
              >
                <Card.Header as="h5" className="card-header-text" href="/node1">
                  Node 5
                </Card.Header>
                <Card.Body>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 17
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data17.value,
                          testForm.Data17.min,
                          testForm.Data17.max
                        )}
                      >
                        {testForm.Data17.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 18
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data18.value,
                          testForm.Data18.min,
                          testForm.Data18.max
                        )}
                      >
                        {testForm.Data18.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>

                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Data 19
                      </Card.Title>
                      <Card.Text
                        className="data-value"
                        style={changeColor(
                          testForm.Data19.value,
                          testForm.Data19.min,
                          testForm.Data19.max
                        )}
                      >
                        {testForm.Data19.value}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  <Card style={{ width: "12.1rem" }} className="mb-2">
                    <Card.Body>
                      <Card.Title style={{ fontSize: "20px" }}>
                        Light 5
                      </Card.Title>
                      <Card.Text className="light-status">
                        {lightStatus.Light5.text}
                        <img
                          src={lightStatus.Light5.image}
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
