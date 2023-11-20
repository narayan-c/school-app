import React, {useEffect, useState} from "react";
import {Config} from "../../config";


const paymentDetailURL = `${Config.BASE_URL}/getStudents/getpaymentdetails?`;
interface PaymentDetailProperties {
    paymentamount: string,
    date: string,
    notes: string
}
export default function PaymentDetailComponent(props) {
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetailProperties[]>([]);
    // create a state to track total payment done so far
    const [totalPayment, setTotalPayment] = useState(0);
    async function getPaymentDetails() {
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            setPaymentDetails([]);
            console.log('change triggered');
            console.log(props.srno);
            if (props.srno) {
                const response = await fetch(paymentDetailURL + `srno=${props.srno}`);
                const responseText = await response.text();
                let tmpPaymentDetails = JSON.parse(responseText) as any[];
                // iterate over payment details and add total payment
                let totalPayment = 0;
                tmpPaymentDetails.forEach((paymentDetail) => {
                    totalPayment += parseInt(paymentDetail.paymentamount);
                });
                // set total payment
                setTotalPayment(totalPayment);
                setPaymentDetails(tmpPaymentDetails);
                console.log(JSON.parse(responseText));
            }
        } catch (error) {
            setPaymentDetails([]);
        }
    }
    // after rendering of component get the data
    useEffect(() => {
        getPaymentDetails();
    },[props.srno, props.refreshList]);
    return(
        <div style={{overflowY: "scroll"}}>
            <b>Payment Details for {props.name}</b><br/>
            {paymentDetails.length == 0 ? (`No Payment Details Found!`) :
                (paymentDetails.map((paymentDetail, index) =>
                <div>
                    Payment Amount <span>=</span> {paymentDetail.paymentamount}<br/>
                    Date <span>=</span> {paymentDetail.date}<br/>
                    Notes <span>=</span> {paymentDetail.notes}<br/>
                    <hr/>
                </div>
            ))
            }
            <hr/>
            <b>Total Payment = {totalPayment}</b>
        </div>
    )

}