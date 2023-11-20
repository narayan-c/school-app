import React, {useEffect, useState} from 'react';
import DataTable from 'react-data-table-component';


const url = 'https://pps-api.onrender.com/getStudents/getallstudents';

function FilterComponent(props: { onClear: () => void, onFilter: (e) => void, filterText: string }) {
    return null;
}

interface StudentProperties {
    srno: string,
    name: string,
    classname: string,
    note: string,
    rte: boolean
}

export default function StudentListComponent(props) {
    const [studentList, setStudentList] = useState<StudentProperties[]>([]);
    const [originalList, setOriginalList] = useState<StudentProperties[]>([]);
    async function getData() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            const response = await fetch(url);
            const responseText = await response.text();
            setStudentList(JSON.parse(responseText) as any);
            setOriginalList(JSON.parse(responseText));
            console.log(JSON.parse(responseText));
        } catch (error) {
            setStudentList([]);
        }
    }
    // after rendering of component get the data
    useEffect(() => {

        getData();
    },[]);
    // Columns of the data table
    const column = [
        {name: "SR No", selector: row => row.srno},
        {name: "Name", selector: row => row.rte?<b>{row.name}</b>:row.name},
        {name: "Class", selector: row => row.classname},
        {name: "Note", selector: row => row.note},
        {name: "Action", selector: (row)=>(
            <button className="btn btn-primary" onClick={()=>{ props.SRUpdateHandler(row.srno, row.name, row.classname)}}>Fee</button>
            )}
    ];
    function handleFilter(event) {
        const newData = originalList.filter((item) => {
            const textData = event.target.value.toLowerCase();
            return item.name.toLowerCase().includes(textData) || item.srno.toLowerCase().includes(textData) ||
            item.classname.toLowerCase().includes(textData) || item.note.toLowerCase().includes(textData) ||
                item.rte.toString().toLowerCase().includes(textData);
        });
        setStudentList(newData);
    }
    return (
      <div>
          <div className="text-end"><input type="text" onChange={handleFilter}/></div>
       <DataTable
           columns={column}
           data={studentList}
           pagination
           highlightOnHover
       />
      </div>
    );
}