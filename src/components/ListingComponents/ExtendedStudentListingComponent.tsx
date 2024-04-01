import InPlaceEditingTableComponent, {
    DisplayColumn,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";
import {Config} from "../../config";
import StudentListingComponent, {
    AddedFields,
    ExtendedProps,
    ExtendedStudentComponentProps,
    StudentProperties
} from "./StudentListingComponent";


const url = `${Config.BASE_URL}/students/getpaymentinfoallstudents`; //'https://pps-api.onrender.com/getStudents/getallstudents';

interface FeeDetails extends StudentProperties {
    srno: string,
    feeDetails: any[],
    discountDetails: any[],
    paymentDetails: any[]
}
let totalFeeMonthly = 0;
let totalDiscountMonthly = 0;
// @ts-ignore
window.totalFeeMonthly = 0;
// @ts-ignore
window.totalDiscountMonthly = 0;
function getTotalFeeMonthly(){
    return totalFeeMonthly;
}
function getTotalDiscountMonthly(){
    return totalDiscountMonthly;
}
function getFormattedDiscountColumn(row) {

    // get monthly fee.
    let monthlyFee = 0;
    if (row.feeDetails) {
        row.feeDetails.forEach(feeHead => {
            if(feeHead.feehead.toLowerCase() == "monthly") {
                monthlyFee = parseInt(feeHead.fee);
            }
        })
    }
    let monthlyDiscount = 0;
    // get monthly discount and compute actual fee to be paid and return the appropriate html code.
    if(row.discountDetails) {
        row.discountDetails.forEach(discount => {
            if(discount.discountfeehead && discount.discountfeehead.toLowerCase() == "monthly") {
                if (discount.discountedamount.toLowerCase() == "full")
                    monthlyDiscount = monthlyFee;
                else
                    monthlyDiscount = parseInt(discount.discountedamount);
            }
        })
    }
    // now prepare html fragment based on the values of monthly fee and monthly discount.
    if (monthlyDiscount == 0) {
        // @ts-ignore
        window.totalFeeMonthly += monthlyFee;
        return <div>
            To pay monthly: {monthlyFee}
        </div>
    } else if (monthlyDiscount == monthlyFee) {
        // @ts-ignore
        window.totalDiscountMonthly += monthlyFee;
        return <div>
            Monthly Fee: {monthlyFee} <br/>
            Completely free
        </div>
    } else {
        // @ts-ignore
        window.totalFeeMonthly += monthlyFee - monthlyDiscount;
        // @ts-ignore
        window.totalDiscountMonthly += monthlyDiscount;
        return <div>
            Monthly Fee: {monthlyFee}<br/>
            Discount: {monthlyDiscount}<br/>
            To pay monthly: {monthlyFee - monthlyDiscount}
        </div>
    }
}

function getFormattedPaymentColumn(row) {

    if(row.paymentDetails) {
        return row.paymentDetails.map(detail => {
            let notes='';
            if (detail.notes && detail.notes.trim != '')
                notes = `(${detail.notes})`;
            let line = `${detail.paymentamount} paid on ${detail.date} ${notes}`;
            return <div>{line} <br/> </div>
        });
    } else
        return 0;
}

function getFormattedFeeColumn(row) {

}
var extendedDisplayColumns: DisplayColumn<AddedFields<FeeDetails>>[] = [
    {
        name: 'Fee Details',
        selector: (row) => {return <b>Fee Found</b>},
        isEditable: false,
        fieldName : "feeDetails",
        omit: true,
        width: '5rem'

    },
    {
        name: 'Discount Details',
        selector: (row) => {return <div>{getFormattedDiscountColumn(row)}</div>},
        isEditable: false,
        fieldName : "discountDetails",
        omit: false,
        width: '12rem'

    },
    {
        name: 'Payment Details',
        selector: (row) => {return <div> {getFormattedPaymentColumn(row)}</div>},
        isEditable: false,
        fieldName : "paymentDetails",
        omit: true,
        width: '25rem'


    }
]


export default function ExtendedStudentListingComponent() {
    const [studentList, setStudentList] = useState<ExtendedProps<FeeDetails>[]>([] as ExtendedProps<FeeDetails>[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const dataFilterFunction = (data: string) => (row: FeeDetails) => {
        // check if data appears in any field of row then return true.
        return (row.name.toLowerCase().includes(data.toLowerCase()));
    }
    /** Function to get data from the backend**/
    async function getData() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            const response = await fetch(url);
            const responseText = await response.text();
            let feeDetails = JSON.parse(responseText) as any[];
            setStudentList(feeDetails);
            console.log(feeDetails);
            setDataLoaded(true);
        } catch (error) {
            console.log('setting data as empty')
            setStudentList([]);
        }
    }
    // after rendering of component get the data
    useEffect(() => {

        getData();
    },[]);
    return (
        <div>
        {dataLoaded ? <StudentListingComponent<FeeDetails>
            extendedInitialData={studentList}
            extendedDisplayColumns={extendedDisplayColumns}
           /> : <p>Loading</p>}
        </div>
    )
}

