import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { apiUrl } from "../contexts/constants";
import { useState } from "react";
import axios from "axios";
const Test = () => {
  const [testForm, setTestForm] = useState({
    data1: "",
    data2: "",
  });
  const { data1, data2 } = testForm;

  const onChangeTest = (event) =>
    setTestForm({ ...testForm, [event.target.name]: event.target.value });

  const test = async (event) => {
    event.preventDefault();
    const res = axios.post(`${apiUrl}/test`, testForm);
    console.log(res);
  };
  const [data, setData] = useState();

  const dataBE = axios.get(`${apiUrl}/test/getData`);
  dataBE.then((dataThen) => {
    console.log(dataThen.data[0].value);
    setTestForm({
      ...testForm,
      data1: dataThen.data[0].value,
      data2: dataThen.data[1].value,
    });
  });
  // console.log(dataBE);
  // data = dataBE;

  return (
    <div>
      {/* <Button onClick={getData}>Get Data</Button> */}
      <p> {data1} </p>
      <Form onSubmit={test}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 1</Form.Label>
          <Form.Control name="data1" value={data1} onChange={onChangeTest} />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>
        {/* <Button variant="primary" type="submit">
          Submit
        </Button> */}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Data 2</Form.Label>
          <Form.Control name="data2" value={data2} onChange={onChangeTest} />
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
