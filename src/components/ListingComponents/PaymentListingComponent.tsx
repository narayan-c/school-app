import InPlaceEditingTableComponent, {
    DisplayColumn,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Config} from "../../config";


const url = `${Config.BASE_URL}/students/getpaymentdetails`; //'https://pps-api.onrender.com/getStudents/getallstudents';
const newidurl = `${Config.BASE_URL}/students/getnewpaymentid`; //'https://pps-api.onrender.com/getStudents/getallstudents';
const studentInfoURL = `${Config.BASE_URL}/students/getstudentinfo`;
interface PaymentProperties {
    paymentid: string,
    srno: string,
    name: string,
    ay: string,
    classname: string,
    paymentamount: number,
    notes: string,
    date: string
    omit?: boolean/*,
    toggle?: any*/
    /*note: string,
    rte: boolean*/
}

var displayColumns: DisplayColumn<PaymentProperties>[] = [
    {
        name: 'Payment Id',
        selector: (row) => {return <b>{row.paymentid}</b>},
        isEditable: false,
        fieldName : "paymentid",
        omit: true
    },
    {
        name: 'SR No',
        selector: (row) => {return <b>{row.srno}</b>},
        isEditable: false,
        fieldName : "srno",
        isCommonField: true,
        omit: false
    },
    {
        name: 'Name',
        selector: (row) => {return <b>{row.name}</b>},
        isEditable: false,
        fieldName : "name",
        isCommonField: true,
        omit: false
    },
    {
        name: 'classname',
        selector: (row) => {return <b>{row.classname}</b>},
        isEditable: false,
        isCommonField: true,
        fieldName : "classname",
        omit: false
    },
    {
        name: 'Date',
        selector: (row) => {return <b>{row.date}</b>},
        isEditable: false,
        fieldName : "date",
        omit: false
    },
    {
        name: 'Amount',
        selector: (row) => {return <b>{row.paymentamount}</b>},
        isEditable: false,
        fieldName : "paymentamount",
        omit: false
    },
    {
        name: 'Notes',
        selector: (row) => {return <b>{row.notes}</b>},
        isEditable: false,
        fieldName : "notes",
        omit: false
    }
]

var newEntryColumns : Record<keyof PaymentProperties, NewEntryColumn> = {
    "paymentid": {
      label: "Payment Id",
      type: "text",
      editable: true
    },
    "srno": {
        label: "SR No",
        type: "text",
        editable: false
    },
    "name": {
        label: "Name",
        type: "text",
        editable: false
    },
    "classname": {
        label: "Class",
        type: "text",
        editable: false
    },
    "ay": {
        label: "Academic Year",
        type: "text",
        editable: false
    },
    "paymentamount": {
        label: "Amount",
        type: "text",
        editable: true
    },
    "date": {
        label: "Date",
        type: "text",
        editable: true
    },
    "notes": {
        label: "Notes",
        type: "text",
        editable: true
    },
    "omit" : {
        label: "Omit",
        type: "text",
        editable: false
    }
}

async function newUniqueKeyGenerator() {
    const response = await fetch(newidurl);
    let responseText = await response.text();
    responseText = responseText.replaceAll('"','');
    return responseText;
}

function addNewEntryHandler(newEntry: PaymentProperties) {
    // from the object pick only those fields which need to be saved.
    // In this case they are, SRNo, paymentid, amount, date,notes
    console.log(`Saving ${newEntry.paymentid}, ${newEntry.srno}, ${newEntry.paymentamount}, ${newEntry.date}, ${newEntry.notes}`);
}
export default function PaymentListingComponent() {
    const params = useParams();
    const [studentList, setStudentList] = useState<PaymentProperties[]>([] as PaymentProperties[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [newEntryData, setNewEntryData] = useState<PaymentProperties>({paymentid: '', srno: '', name: '', classname: '', ay: '', paymentamount: 0, date: '', notes: '', omit: false});
    var uniqueKeyName = "paymentid";
    var uniqueKeyPrefix = "payment-";
    const dataFilterFunction = (data: string) => (row: PaymentProperties) => {
        // check if data appears in any field of row then return true.
        return (row.name.toLowerCase().includes(data.toLowerCase()) || row.notes.toLowerCase().includes(data.toLowerCase())
            || row.date.toLowerCase().includes(data.toLowerCase())
            );
    }
    /** Function to get data from the backend**/
    async function getData() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            console.log('Fetching data');
            const response = await fetch(`${url}?srno=${params.srno}`);
            const responseText = await response.text();
            let studentList = JSON.parse(responseText) as any;
            // set newEntryData with the things that we know will remain same for newly created entries.
            //srno, name, classname, ay.
            let paymentNewEntryData = {paymentid: '', srno: '', name: '', classname: '', ay: '', paymentamount: 0, date: '', notes: '', omit: false};
            if(studentList.length > 0) {
                paymentNewEntryData.srno = studentList[0].srno;
                paymentNewEntryData.name = studentList[0].name;
                paymentNewEntryData.ay = studentList[0]['admission ay'];
                paymentNewEntryData.classname = studentList[0].classname;
            } else {
                // fetch student information for this srno and fill the name, classname in paymentNewEntryData from there.
                const studentInfoResponse = await fetch(`${studentInfoURL}?srno=${params.srno}`);
                const studentResponseText = await studentInfoResponse.text();
                let studentInfo = JSON.parse(studentResponseText) as any;
                paymentNewEntryData.srno = studentInfo.srno;
                paymentNewEntryData.name = studentInfo.name;
                paymentNewEntryData.ay = studentInfo['admission ay'];
                paymentNewEntryData.classname = studentInfo.classname;
            }
            setNewEntryData(paymentNewEntryData);
            setStudentList(studentList);
            //console.log(JSON.parse(responseText) as any);
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
        {dataLoaded ? <InPlaceEditingTableComponent<PaymentProperties>
            initialData={studentList}
            displayColumns={displayColumns}
            newEntryColumns={newEntryColumns}
            newEntryData={newEntryData}
            uniqueKeyName={uniqueKeyName}
            newEntryUniqueKeyGenerator={newUniqueKeyGenerator}
            newEntryUpdateHandler={addNewEntryHandler}
            dataFilterFunction={dataFilterFunction}
        /> : <p>Loading</p>}
        </div>
    )
}

