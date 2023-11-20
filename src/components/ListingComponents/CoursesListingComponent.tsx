import InPlaceEditingTableComponent, {
    DisplayColumn,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";


const url = 'https://pps-api.onrender.com/courses/getallcourses';//'https://pps-api.onrender.com/getStudents/getallstudents';

interface CourseProperties {
    courseid: string,
    class: string,
    subject: string,
    omit?: boolean/*,
    toggle?: any*/
    /*note: string,
    rte: boolean*/
}

var displayColumns: DisplayColumn<CourseProperties>[] = [
    {
        name: 'Class',
        selector: (row) => {return <b>{row.class}</b>},
        isEditable: false,
        fieldName : "class",
        omit: false
    },
    {
        name: 'Subject',
        selector: (row) => {return <b>{row.subject}</b>},
        isEditable: false,
        fieldName : "subject",
        omit: false
    }
]

var newEntryColumns : Record<keyof CourseProperties, NewEntryColumn> = {
    "courseid": {
        label: "Course ID",
        type: "text",
        editable: false
    },
    "subject": {
        label: "Subject",
        type: "text",
        editable: true
    },
    "class": {
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
        resolve('course-1');
    });
    return myPromise;
}

export default function CoursesListingComponent() {
    const [studentList, setStudentList] = useState<CourseProperties[]>([] as CourseProperties[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    var newEntryData: CourseProperties = {courseid: '', subject: '', class: '', omit: false};
    var uniqueKeyName = "courseid";
    var uniqueKeyPrefix = "course-";
    const dataFilterFunction = (data: string) => (row: CourseProperties) => {
        // check if data appears in any field of row then return true.
        return (row.subject.toLowerCase().includes(data.toLowerCase()) || row.class.toLowerCase().includes(data.toLowerCase())
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
        {dataLoaded ? <InPlaceEditingTableComponent<CourseProperties>
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

