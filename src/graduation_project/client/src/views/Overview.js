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
    data1: "",
    data2: "",
    data3: "",
    data4: "",
    data5: "",
    data6: "",
    data7: "",
    data8: "",
    setAlarm: false,
  });
  const { data1, data2, data3, data4, data5, data6, data7, data8, setAlarm } =
    testForm;
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
          console.log(max, min, element);
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
          data4: dataThen.data[3].value,
          data5: dataThen.data[4].value,
          data6: dataThen.data[5].value,
          data7: dataThen.data[6].value,
          data8: dataThen.data[7].value,
          setAlarm: hasAlarm,
        });
      });

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
    }
    makeRequest();
  });
  console.log(setAlarm);
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
                Node 1
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "18rem" }} className="mb-2">
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

                <Card style={{ width: "18rem" }} className="mb-2">
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

                <Card style={{ width: "18rem" }} className="mb-2">
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

          {/* Node 2 */}
          <Col>
            <Card
              onClick={onClickToNode2}
              style={{ width: "20.1rem", cursor: "pointer" }}
              className="alight-center"
            >
              <Card.Header as="h5" className="card-header-text" href="/node1">
                Node 2
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 4</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data4)}
                    >
                      {data4}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 5</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data5)}
                    >
                      {data5}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 6</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data6)}
                    >
                      {data6}
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
                Node 3
              </Card.Header>
              <Card.Body>
                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 7</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data7)}
                    >
                      {data7}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 8</Card.Title>
                    <Card.Text
                      className="data-value"
                      style={changeColor(data8)}
                    >
                      {data8}
                    </Card.Text>
                  </Card.Body>
                </Card>

                <Card style={{ width: "18rem" }} className="mb-2">
                  <Card.Body>
                    <Card.Title style={{ fontSize: "20px" }}>Data 9</Card.Title>
                    <Card.Text className="data-value">VALUE</Card.Text>
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
export default Overview;
