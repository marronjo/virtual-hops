import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Button, Card, Col, Collapse, Form, Jumbotron, Row} from "react-bootstrap";
import React, {useState, useEffect} from 'react';

function App() {


    useEffect(() => {
        console.log("TEST")
    }, []);

    const [count, setCount] = useState("Created");

    const handleButtonClick = (index, text) => {
        console.log("HandleButtonClick: " + index);
        jjson[index].stage = text;
        setJSON(jjson);
        setFF(createCard(jjson));
    }
    const createCard = (jsons) => {
        return jsons.map((s, index) => {
            return (
                <Card style={{width: '18rem', margin: '20px'}}>
                    <Card.Body>
                        {s.stage === 'Cancel' && <h3 style={{
                            textAlign: 'left',
                            color: 'red',
                            fontWeight: 'bold',
                            fontSize: 8
                        }}>Status:{" "}{s.stage} {index}</h3>}
                        {s.stage === 'Created' && <h3 style={{
                            textAlign: 'left',
                            color: 'gray',
                            fontWeight: 'bold',
                            fontSize: 8
                        }}>Status:{" "}{s.stage} {index}</h3>}
                        {s.stage === 'Accept' && <h3 style={{
                            textAlign: 'left',
                            color: 'green',
                            fontWeight: 'bold',
                            fontSize: 8
                        }}>Status:{" "}{s.stage} {index}</h3>}
                        <Card.Title style={{color: 'blue'}}>{s.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{s.subtitle}</Card.Subtitle>
                        <Card.Text className="mb-2 text-muted">{s.text}</Card.Text>
                        <Card.Text className="mb-2 text-muted">{s.price} PLN</Card.Text>
                        <Row>
                            <Col>
                                <Button onClick={() => handleButtonClick(index, "Accept")}>Accept</Button>
                            </Col>
                            <Col>
                                <Button style={{align: "end"}} variant="danger"
                                        onClick={() => handleButtonClick(index, "Cancel")}>Cancel</Button>
                            </Col>
                        </Row>

                        {/* <Card.Link className="mb-2 text-muted" class="text-success" >Zaakceptuj ofertę</Card.Link>
                */}
                    </Card.Body>
                </Card>
            )
        })
    }

    /*    let json =  [{"title":"ISIN - 1 do 10000", "subtitle":"akcje nieme", "text":"Mozliwość WZA", "price":20},
            {"title":"ISIN - 1 do 10", "subtitle":"akcje imienne", "text":"Mozliwość wyniesienia smieci",
                "price": 10}
        ];*/

    let json = [];
    const f = createCard(json);

    const [ff, setFF] = useState(f);

    const [jjson, setJSON] = useState(json);

    const [values, setValues] = useState({
        title: '',
        subtitle: '',
        text: '',
        price: ''
    });

    const [open, setOpen] = useState(false);

    const handleChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = (event) => {

        console.log("Handle submit")
        //   // const f =ff;
        // let json = jjson;
        // console.log(json.length);
        jjson.push({
            "title": values.title,
            "subtitle": values.subtitle,
            "text": values.text,
            "price": values.price,
            "stage": "Created"
        });

        setJSON(jjson);

        console.log(jjson);

        const gg = createCard(jjson);
        setFF(gg);

        setOpen(!open);


        fetch("http://localhost:3045/", {
            headers:{"Content-Type": "application/json"},
            method: "POST",
            body: JSON.stringify({"start": values.title, "stop":values.subtitle, "text": values.text, "amount": values.price})
        }).then(request => request)
            .then(response => {
             console.log(response.json());
        }).catch((error) => {
            console.error(error);
        });

        event.preventDefault();

    }

    return (

        <div className={"App"}>

            <Jumbotron id={"Jumbo"} style={{height: 10, textAlign: "end"}}>
                <h5>Client address: 0xa7578120e2550984701fccc7dbfa44ae5a89bfd2</h5>
            </Jumbotron>

            <Button
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}>Add transaction
            </Button>
            <Collapse in={open}>
                <div id="example-collapse-text">

                    <Jumbotron id={"Jumbo"}>
                        <h1>Tx details:</h1>
                        <Form onSubmit={handleSubmit}>

                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>From:</Form.Label>
                                <Form.Control type="text" name="title" placeholder="ETH"
                                              onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>To:</Form.Label>
                                <Form.Control type="text" name="subtitle" placeholder="BNB"
                                              onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Text</Form.Label>
                                <Form.Control type="text" name="text" placeholder="Lora Rebi Maximus"
                                              onChange={handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="number" name="price" placeholder="100" onChange={handleChange}/>
                            </Form.Group>

                            <Button variant="primary" type={"submit"}>Send </Button>
                        </Form>
                    </Jumbotron>
                </div>
            </Collapse>

            <Jumbotron class="bg-secondary text-white" style={{minHeight: "600px"}} id={"Jumbo"}>
                <h1>VirtualHop {count}</h1>
                <Row style={{align: "center"}}>
                    {ff}
                </Row>
            </Jumbotron>

        </div>

    );
}

export default App;
