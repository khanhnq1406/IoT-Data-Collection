import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { apiUrl } from "../contexts/constants";
import { useState, useEffect } from "react";
import axios from "axios";
const Test = () => {
  const [testForm, setTestForm] = useState({
    data1: "",
    data2: "",
    data3: "",
    data4: "",
    data5: "",
    data6: "",
    data7: "",
    data8: "",
  });
  const { data1, data2, data3, data4, data5, data6, data7, data8 } = testForm;

  const onChangeTest = (event) =>
    setTestForm({ ...testForm, [event.target.name]: event.target.value });

  const test = async (event) => {
    event.preventDefault();
    const res = axios.post(`${apiUrl}/test`, testForm);
    console.log(res);
  };
  useEffect(() => {
    const dataBE = axios.get(`${apiUrl}/test/getData`);
    dataBE.then((dataThen) => {
      console.log(dataThen.data[0].value);
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
      });
    });
  }, []);

  return (
    <div>
      {/* <Button onClick={getData}>Get Data</Button> */}
      {/* <p> {data1} </p> */}
      <Form onSubmit={test}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 1</Form.Label>
          <Form.Control name="data1" value={data1} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 2</Form.Label>
          <Form.Control name="data2" value={data2} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 3</Form.Label>
          <Form.Control name="data3" value={data3} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 4</Form.Label>
          <Form.Control name="data4" value={data4} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 5</Form.Label>
          <Form.Control name="data5" value={data5} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 6</Form.Label>
          <Form.Control name="data6" value={data6} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 7</Form.Label>
          <Form.Control name="data7" value={data7} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 8</Form.Label>
          <Form.Control name="data8" value={data8} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};
export default Test;
