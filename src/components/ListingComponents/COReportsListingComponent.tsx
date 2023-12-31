import InPlaceEditingTableComponent, {
    DisplayColumn,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";
import {Config} from "../../config";


const url = `${Config.BASE_URL}/teachers/getallcoreports`; //'https://pps-api.onrender.com/getStudents/getallstudents';

interface COReportProperties {
    coid: string,
    empid: string,
    name: string,
    joiningdate: string,
    academicq: string,
    professionalq: string,
    omit?: boolean/*,
    toggle?: any*/
    /*note: string,
    rte: boolean*/
}

var displayColumns: DisplayColumn<COReportProperties>[] = [
    {
        name: 'Emp Id',
        selector: (row) => {return <b>{row.empid}</b>},
        isEditable: false,
        fieldName : "empid",
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
        name: 'Joining Date',
        selector: (row) => {return <b>{row.joiningdate}</b>},
        isEditable: false,
        fieldName : "joiningdate",
        omit: false
    },
    {
        name: 'Academic Q',
        selector: (row) => {return <b>{row.academicq}</b>},
        isEditable: false,
        fieldName : "academicq",
        omit: false
    },
    {
        name: 'Professional Q',
        selector: (row) => {return <b>{row.professionalq}</b>},
        isEditable: false,
        fieldName : "professionalq",
        omit: false
    }
]

var newEntryColumns : Record<keyof COReportProperties, NewEntryColumn> = {
    "coid": {
      label: "Observation Id",
      type: "text",
      editable: false
    },
    "empid": {
        label: "Emp Id",
        type: "text",
        editable: true
    },
    "name": {
        label: "Name",
        type: "text",
        editable: true
    },
    "joiningdate": {
        label: "Joining Date",
        type: "text",
        editable: true
    },
    "academicq": {
        label: "Academic Qualification",
        type: "text",
        editable: true
    },
    "professionalq": {
        label: "Professional Qualification",
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
        resolve('co-1');
    });
    return myPromise;
}

export default function COReportsListingComponent(props: {empid: string}) {
    const [studentList, setStudentList] = useState<COReportProperties[]>([] as COReportProperties[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    var newEntryData: COReportProperties = {coid: '', empid: '', name: '', joiningdate: '', academicq: '', professionalq: '',omit: false};

    var uniqueKeyName = "coid";
    var uniqueKeyPrefix = "co-"
    const dataFilterFunction = (data: string) => (row: COReportProperties) => {
        // check if data appears in any field of row then return true.
        return (row.name.toLowerCase().includes(data.toLowerCase()) || row.academicq.toLowerCase().includes(data.toLowerCase())
            || row.professionalq.toLowerCase().includes(data.toLowerCase())
            );
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
        {dataLoaded ? <InPlaceEditingTableComponent<COReportProperties>
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

