import { useState, useRef, useEffect, SetStateAction} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FeeDetailComponent from "../components/FeeDetail/FeeDetailComponent";
import PaymentDetailComponent from "../components/PaymentDetail/PaymentDetailComponent";
import NewPaymentComponent from "../components/NewPayment/NewPaymentComponent";
import StudentListComponent from "../components/ListingComponents/~studentListComponent";

export default function FeeDetailsPage() {
    const ref = useRef(null);
    var container = {
        maxWidth: '100%'
    }
    var rowstyle = {
        maxWidth: '100%'
    }
    var studentListArea = {
        background: '#85a3c2',
        //margin: '2px',
        height: '90vh'
    }
    var qrStyle3 = {
        //margin: '2px',
        height: '90vh'
    }
    var qrStyle2 = {
        height: '70%'
    }
    var feeDemandArea = {
        background: '#e1d6b9',
        // width: '30%',
        //margin: '1px',
        // overflowY: 'scroll',
        maxHeight: '100%'
    }
    var feePaidArea = {
        background: '#c988be',
        maxHeight: '100%',
        // overflowY: 'scroll'
    }
    var feePaymentArea = {
        background: '#8798a9',
    }
    const [srno, setSRNo] = useState('');
    const [studentname, setStudentname] = useState('');
    const [classname, setClassname] = useState('');
    const [amount, setAmount] = useState('sheet.title');
    const [refreshlist, setRefreshList] = useState(false);
    const [image, setImage] = useState('sheet.rowCount');

    function generateQR() {
        genQR(amount);
        // Now call API end point to get the image and then change the image calling setImage method.
    }

    const updateSRNumber = (updatedsrno: SetStateAction<string>) => {
        setSRNo(updatedsrno);
    }
    async function genQR(amount: string) {
        const text = "Some text here...";
        try {
            let url = "https://upiqr.in/api/qr?";
            url = url + "vpa="+encodeURIComponent('parishkaaramschool@ybl');
            url = url + "&name="+encodeURIComponent('Parishkaaram Public School');
            url = url + "&amount="+amount+'.00';
            // set image to empty first.
            setImage('');
            const response = await fetch(url);
            const responseText = await response.text();
            setImage(responseText);
        } catch (error) {
            setImage("Request error!");
        }
    }
    useEffect(() => {
        const element: any = ref.current;
        console.log(element.id);
        // now go to the parent class of this element which is article and parent div of that. from there remove class col--8 and add col--12.
        const el = document.getElementById("mycontainer");
        if (el && el.parentNode) {
            let parentNode: any = el.parentNode;
            let elem = parentNode.closest("div div");
            // remove class col--8 from it
            elem.classList.remove("col--8");
            elem.classList.add("col--12");
            elem = parentNode.closest(".container");
            //elem.style.maxWidth = "100%";
        }

    });
    return (
        <>
            <Container style={container} ref={ref} id="mycontainer" fluid={true}>
                <Row style={rowstyle}>
                    <Col style={studentListArea} xs={7} >
                        <StudentListComponent SRUpdateHandler={(srno: SetStateAction<string>, name: SetStateAction<string>, classname: SetStateAction<string>) => {setSRNo(srno); setStudentname(name); setClassname(classname);}}></StudentListComponent>
                    </Col>
                    <Col style={qrStyle3} xs={5}>
                        <Row style={qrStyle2}>
                            <Col style={feeDemandArea}>
                                <FeeDetailComponent srno={srno} name={studentname} classname={classname}></FeeDetailComponent>
                            </Col>
                            <Col style={feePaidArea}>
                                <PaymentDetailComponent srno={srno} name={studentname} classname={classname} refreshList={refreshlist}></PaymentDetailComponent>
                            </Col>
                        </Row>
                        <Row style={feePaymentArea}>
                            <NewPaymentComponent srno={srno} name={studentname} classname={classname} refreshListHandler={()=>setRefreshList(!refreshlist)}></NewPaymentComponent>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

<FeeDetailsPage/>