import React, {useEffect, useState} from "react";


const feeDetailUrl = 'https://pps-api.onrender.com/getStudents/showfeedetails?srno=';

interface FeeDetailProperties {
    head: string,
    fee: string,
    discount: string,
    reason: string
}
export default function FeeDetailComponent(props: {srno: string, name: string, classname: string}) {
    const [feeDetails, setFeeDetails] = useState<FeeDetailProperties[]>([]);
    // create a state to keep track of total fee
    const [totalFee, setTotalFee] = useState(0);
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    async function getFeeDetails() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            setFeeDetails([]);
            console.log(props.srno);
            if (props.srno) {
                const response = await fetch(feeDetailUrl + props.srno);
                const responseText = await response.text();
                // iterate over fee details and add total fee without discount
                let totalFee = 0;
                let tmpFeeDetails = JSON.parse(responseText) as any[];
                tmpFeeDetails.forEach((feeDetail) => {
                    // don't add fee for head admission fee
                    if (feeDetail.head == 'annual') {
                        totalFee += parseInt(feeDetail.fee);
                        // if discount is present for this head then subtract that
                        if (feeDetail.discount != 0) {
                            totalFee -= parseInt(feeDetail.discount);
                        }
                    } else if (feeDetail.head == 'monthly') {
                        // add monthly fee for each month starting from april of 2023 to the current month
                        // get current month
                        let currentMonth = new Date().getMonth();
                        // get current year
                        let currentYear = new Date().getFullYear();
                        // find number of months from april 2023 to current month and current year
                        let numberOfMonths = (currentYear - 2023) * 12 + (currentMonth-2);
                        // add monthly fee for each month
                        for (let i = 0; i < numberOfMonths; i++) {
                            totalFee += parseInt(feeDetail.fee);
                            // if discount is present for this head then subtract that
                            if (feeDetail.discount && feeDetail.discount != 0) {
                                totalFee -= parseInt(feeDetail.discount);
                            }
                        }
                    }
                });
                // set total fee
                setTotalFee(totalFee);
                setFeeDetails(tmpFeeDetails);
                console.log(JSON.parse(responseText));
            }
        } catch (error) {
            setFeeDetails([]);
        }
    }
    // after rendering of component get the data
    useEffect(() => {
        getFeeDetails();
    },[props.srno]);
    return(
        <div style={{overflowY: "scroll"}}>
            <b>Fee Details for {props.name}({props.classname})</b><br/>
            {feeDetails.map((feeDetail, index) =>
                <div>
                    {feeDetail.head}<span>=</span> {feeDetail.fee}<br/>
                    {feeDetail.discount != '0' ? (
                        <div>
                            <span> Discount = {feeDetail.discount}</span><br/>
                            <span> Reason = {feeDetail.reason}</span>
                        </div>
                        ) : null}
                    <hr/>
                </div>
            )}
            <b>Total Fee = {totalFee} upto {monthNames[new Date().getMonth()]}</b>
        </div>
    )

}
