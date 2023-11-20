import InPlaceEditingTableComponent, {
    DisplayColumn,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {Config} from "../../config";


const url = `${Config.BASE_URL}/students/getallstudents`; //'https://pps-api.onrender.com/getStudents/getallstudents';
let navigate; // For navigation with React Router

interface StudentProperties {
    srno: string,
    name: string,
    classname: string,
    omit?: boolean/*,
    toggle?: any*/
    /*note: string,
    rte: boolean*/
}

var displayColumns: DisplayColumn<StudentProperties>[] = [
    {
        name: 'SRNO',
        selector: (row) => {return <b>{row.srno}</b>},
        isEditable: false,
        fieldName : "srno",
        omit: false
    },
    {
        name: 'Name',
        selector: (row) => {return <b>{row.name}</b>},
        isEditable: false,
        fieldName : "name",
        omit: false
    },
    {
        name: 'Class',
        selector: (row) => {return <b>{row.classname}</b>},
        isEditable: false,
        fieldName : "classname",
        omit: false
    },
    {
        name: 'Payment Info',
        selector: (row) => {return <button className="btn btn-primary" onClick={()=>{ navigate(`/fees/${row.srno}`);}}>Fee</button>
        },
        isEditable: false,
        fieldName : "classname",
        omit: false
    }
]

var newEntryColumns : Record<keyof StudentProperties, NewEntryColumn> = {
    "srno": {
        label: "SrNo.",
        type: "text",
        editable: true
    },
    "name": {
        label: "Name",
        type: "text",
        editable: true
    },
    "classname": {
        label: "Class",
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
    const myPromise: Promise<string> = new Promise((resolve, reject) => {
        resolve('sr-1');
    });
    return myPromise;
}

export default function StudentListingComponent() {
    navigate = useNavigate();
    const [studentList, setStudentList] = useState<StudentProperties[]>([] as StudentProperties[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    var newEntryData: StudentProperties = {srno: '', name: '', classname: '', omit: false};
    var uniqueKeyName = "srno";
    var uniqueKeyPrefix = "sr-";
    const dataFilterFunction = (data: string) => (row: StudentProperties) => {
        // check if data appears in any field of row then return true.
        return (row.srno.toLowerCase().includes(data.toLowerCase()) || row.classname.toLowerCase().includes(data.toLowerCase())
            || row.name.toLowerCase().includes(data.toLowerCase()));
    }
    /** Function to get data from the backend**/
    async function getData() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            const response = await fetch(url);
            const responseText = await response.text();
            setStudentList(JSON.parse(responseText) as any);
            console.log(JSON.parse(responseText) as any);
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
        {dataLoaded ? <InPlaceEditingTableComponent<StudentProperties>
            initialData={studentList}
            displayColumns={displayColumns}
            newEntryColumns={newEntryColumns}
            newEntryData={newEntryData}
            uniqueKeyName={uniqueKeyName}
            dataFilterFunction={dataFilterFunction}
         newEntryUniqueKeyGenerator={newUniqueKeyGenerator}/> : <p>Loading</p>}
        </div>
    )
}

