import React, {useEffect, useState} from "react";
import {Form, Button, Col, Container, Row} from "react-bootstrap";
import Modal from '@mui/material/Modal';
import {Config} from "../../config";


const paymentURL = `${Config.BASE_URL}/getStudents/addpaymentdetails?`;

export default function NewPaymentComponent(props) {
    const [qrModalOpen, setQRModalOpen] = React.useState(false);

    const handleClose = () => {
        setQRModalOpen(false);
    };

    const handleOpen = (feeamount) => {
        setQRModalOpen(true);
        // Fetch QR Image and set QR Image URL
        genQR(feeamount);
    };

    var divstyle = {
        width: '-webkit-fill-available'
    }
    var colstyle = {
        margin: 'auto'
    }
    var buttonstyle = {
        margin: 'auto',
        justifyContent: 'center'
    }

    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');
    const [qrImage, setQRImage] = useState('');
    async function genQR(amount) {
        const text = "Some text here...";
        try {
            let url = "https://upiqr.in/api/qr?";
            url = url + "vpa="+encodeURIComponent('parishkaaramschool@ybl');
            url = url + "&name="+encodeURIComponent('Parishkaaram Public School');
            url = url + "&amount="+amount+'.00';
            // set image to empty first.
            setQRImage('');
            const response = await fetch(url);
            const responseText = await response.text();
            setQRImage(responseText);
        } catch (error) {
            setQRImage("Request error!");
        }
    }
    async function addPaymentDetails() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            //setFeeDetails([]);
            console.log(props.srno);
            if (props.srno && amount && date) {
                const response = await fetch(paymentURL + `srno=${props.srno}&amount=${amount}&date=${date}&notes=${notes}`);
                const responseText = await response.text();
                //setFeeDetails(JSON.parse(responseText) as any[]);
                console.log(JSON.parse(responseText));
                props.refreshListHandler();
                alert('Payment Added Successfully!');
                //Clear text box values.
                setAmount('');
                setDate('');
                setNotes('');
            } else {
                alert('Please enter amount and date!');
            }
        } catch (error) {
            //setFeeDetails([]);
        }
    }
    // after rendering of component get the data
    useEffect(() => {
        //getFeeDetails();
    },[props.srno]);
    return(
        <div style={divstyle}>
            <b>Fee payment for {props.name}</b><br/><hr/>
            <Form>
                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridClass">
                        <Form.Label>Class</Form.Label>
                        <Form.Control placeholder="Class" value={props.classname} />
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control  placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formGridDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" placeholder="Today's date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </Form.Group>

                    <Form.Group as={Col} controlId="formGridNotes">
                        <Form.Label>Notes</Form.Label>
                        <Form.Control  placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)}/>
                    </Form.Group>
                </Row>

                <Row className="mb-3">
                    <Form.Group as={Col} controlId="formQRButton">
                        <Button variant="primary" onClick={()=>{ handleOpen(amount)}} disabled={amount?false:true}>
                            QR Code
                        </Button>
                    </Form.Group>
                    <Form.Group as={Col} controlId="formPaymentButton">
                        <Button variant="primary"  onClick={()=>{ addPaymentDetails();}}>
                            Add Payment
                        </Button>
                    </Form.Group>
                </Row>
                <Modal
                    onClose={handleClose}
                    open={qrModalOpen}
                    style={{
                        position: 'absolute',
                        border: '2px solid #000',
                        backgroundColor: 'gray',
                        boxShadow: '2px solid black',
                        height: 400,
                        width: 400,
                        margin: 'auto'
                    }}
                >
                    <div className="board-row" style={{width:'400px'}} dangerouslySetInnerHTML={{__html: qrImage}} >
                    </div>
                </Modal>
            </Form>
            {/*<Container fluid="true">
                <Row>
                    <Col style={colstyle}>Class={props.classname}</Col>
                    <Col style={colstyle}  >
                        <label>Amount</label>
                        <input type="text" name="amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                    </Col>
                </Row>
                <Row>
                    <Col style={colstyle} >
                        <label>Date</label>
                        <input type="text" name="date" value={date} onChange={(e) => setDate(e.target.value)}/>
                    </Col>
                    <Col style={colstyle}  >
                        <label>Notes</label>
                        <input type="text" name="notes" value={notes} onChange={(e) => setNotes(e.target.value)}/>
                    </Col>
                </Row>
                <Row style={buttonstyle}>
                    <button className="btn btn-primary" onClick={()=>{ addPaymentDetails();}}>Add Payment</button>
                    {amount?<button className="btn btn-primary" onClick={()=>{ handleOpen(amount)}}>QR Code</button>:null}
                </Row>
                <Modal
                    onClose={handleClose}
                    open={qrModalOpen}
                    style={{
                        position: 'absolute',
                        border: '2px solid #000',
                        backgroundColor: 'gray',
                        boxShadow: '2px solid black',
                        height: 400,
                        width: 400,
                        margin: 'auto'
                    }}
                >
                    <div className="board-row" style={{width:'400px'}} dangerouslySetInnerHTML={{__html: qrImage}} >
                    </div>
                </Modal>
            </Container>*/}
        </div>
    )

}