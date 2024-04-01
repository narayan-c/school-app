// This component is for listing the students (either of a class or for all) that allows in place editing of some data.
// The spec is as following.
// Props: class="" if present then the listing is only for that class. If absent then the listing is for all the students.
// for: if present the editable information will be shown corresponding to that use case. Currently supported usecase will be.
// 1. uploading marks
// 2. uploading academicObservation
// 3. uploading copyCheckingObservation
// Corresponding enum typs for these actions are defined in Enums.ts file. In future we might add more such actions. These actions are important because
// the layout of the datatable will have in place editing options based on the action that is used in props.
// 1. Actions for uploading marks - metadata (date, class, subject, chapter, total marks, paper ID), one editor box in every row to enter the marks. one checkbox
// to represent that the paper was done on a different date because of students' absence. Then it opens up (date, paperID) also.
// 2. Actions for uploading academicObservation - metadata (date, class, subject). present/absent, homework done/partially done/not done cleanly/ very good/notebook missing, book missing, asked questions in class/ participated, behavioral problem if any.
// 3. Actions for uploading copyCheckingObservation - metadata (date, class, subject). all the points on copycheckingobservation (or a summary points of those)

import React, {useEffect, useRef, useState} from 'react';
import DataTable, {IDataTableProps} from 'react-data-table-component';
import ExpandedComponent from "./expandedStudentListComponent";
import {simpleLabel} from "../UIComponents/components";
import { Modal, Button, Form } from 'react-bootstrap';
import CommonHeaderComponent from "./commonHeaderComponent";






/*
Columns for marks entering
- Exam date, Marks
Columns for daily classroom observation
- Observation date,
- present/absent
- homework - done properly/ some mistakes/ lots of mistakes/ not done at all/ not completely done/ did not bring notebook
- classroom - teacher asked questions/ teacher asked to read/ teacher asked to come on board/ teacher didn't ask
- observation - text
Columns for
 */
export interface InPlaceEditingTableProps<T> {
    initialData: T[];
    displayColumns: DisplayColumn<T>[];
    newEntryColumns?: Record<keyof T, NewEntryColumn>;
    newEntryData?: T;
    newEntryUniqueKeyGenerator?: ()=> Promise<string>; // assuming that the uniqueKey will be of type string.
    newEntryUpdateHandler?: (T) => void;
    uniqueKeyName: string;
    dataFilterFunction: (data: string) => (row: T) => boolean;
    // ... Any other required props
}
export type DisplayColumn<T> = {
        name: string;
        selector: (row: T) => JSX.Element;
        isEditable: boolean;
        isCommonField?: boolean;
        fieldName: keyof T;
        omit: boolean;
        width?: string;
        sortable?: boolean;

};
export type NewEntryColumn = {
    label: string;
    type: 'text' | 'date' | 'dropdown';
    editable: boolean;
    options?: string[];  // Only needed for 'dropdown' type
}

export default function InPlaceEditingTableComponent<T>(props: InPlaceEditingTableProps<T>) {
    const [studentList, setStudentList] = useState<T[]>(props.initialData);
    const [originalList, setOriginalList] = useState<T[]>(props.initialData);
    const [editingRows, setEditingRows] = useState(new Set());
    const [editsBuffer, setEditsBuffer] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [showModal, setShowModal] = useState(false);
    const [displayData, setDisplayData] = useState<T[]>(props.initialData);

    var floatingIcon = {
        bottom: '20px',
        right: '20px',
        cursor: 'pointer',
        backgroundColor: '#007BFF',  // Bootstrap primary color, you can change as needed
        color: 'white',  // Text color
        width: '50px',  // Circle width
        height: '50px',  // Circle height
        borderRadius: '50%',  // Makes it a circle
        lineHeight: '50px',  // Centers the "+" vertically
        fontSize: '24px',  // Increases the font size of the "+"
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'  // Optional: Add a slight shadow for a floating effect
    };

    function ModalInput() {

        /** Component for Modal*/
        const [newEntry, setNewEntry] = useState<T>(props.newEntryData!);
        const [isInitialized, setInitialized] = useState(false);
        async function initializeNewData ()  {
            var newData = props.newEntryData!;
            newData[props.uniqueKeyName] = await props.newEntryUniqueKeyGenerator!();
            // for the columns which don't change(isCommonField is true) we get the value from originalList[0] data and
            // assign them in newData.
            // @ts-ignore
            setNewEntry(newData);
            setInitialized(true);
        }

        useEffect(() =>  {
            initializeNewData();
        }, []);
        const handleAddEntry = () => {
            /*let srno = newEntry.srno;
            //now iterate over all field of newEntry. For every field that is not 'srno' call handleEditChange method with srno, field and value.
            for (let key in newEntry) {
                if (key !== 'srno') {
                    handleEditChange(srno, key, newEntry[key]);
                }
            }*/
            // use the compulsory values stored in newEntry to create an object of studentProperty and then add it to studentList.
            //let newRow: StudentProperties = { ...newEntry, classname: 'Nursery'};
            // Add newEntry to originalList
            setOriginalList(prevData => [...prevData, newEntry]);
            if(props.newEntryUpdateHandler)
                props.newEntryUpdateHandler(newEntry);
            // trigger the change on filter box.
            handleFilter('');
            // Reset newEntry
            //setNewEntry({ srno: "", name: "" });
            // Close the modal
            setShowModal(false);
        };
        return (
            <div>
                {isInitialized? <Modal show={showModal} onShow={()=>initializeNewData()} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {Object.keys(props.newEntryColumns!).map((key) => {
                            const field = props.newEntryColumns![key];
                            if (!field.editable) {
                                return null;
                            }
                            switch (field.type) {
                                case 'text':
                                    return (
                                        <Form.Group key={key}>
                                            <Form.Label>{field.label}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                value={newEntry[key] as string}
                                                onChange={(e) =>
                                                    setNewEntry(prev => ({ ...prev, [key]: e.target.value }))
                                                }
                                            />
                                        </Form.Group>
                                    );
                                case 'date':
                                    return (
                                        <Form.Group key={key}>
                                            <Form.Label>{field.label}</Form.Label>
                                            <Form.Control
                                                type="date"
                                                value={newEntry[key] as string}
                                                onChange={(e) =>
                                                    setNewEntry(prev => ({ ...prev, [key]: e.target.value }))
                                                }
                                            />
                                        </Form.Group>
                                    );
                                case 'dropdown':
                                    return (
                                        <Form.Group key={key}>
                                            <Form.Label>{field.label}</Form.Label>
                                            <Form.Select
                                                value={newEntry[key] as string}
                                                onChange={(e) =>
                                                    setNewEntry(prev => ({ ...prev, [key]: (e.target as HTMLSelectElement).value }))
                                                }
                                            >
                                                {field.options?.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                    );
                            }
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddEntry}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal> : "" }
                    </div>
        )
    }

    /** Functions to handle edit/save flow for editable components present on a row**/
    const handleEditChange = (uniqueKey, key, value) => {
        setEditsBuffer(prevBuffer => ({
            ...prevBuffer,
            [uniqueKey]: {
                ...prevBuffer[uniqueKey],
                [key]: value
            }
        }));
    };
    const startEditing = (uniqueKey) => {
        // @ts-ignore
        setEditingRows(prev => new Set([...prev, uniqueKey]));
    };
    const stopEditing = (uniqueKey) => {
        setEditingRows(prev => {
            prev.delete(uniqueKey);
            // @ts-ignore
            return new Set([...prev]);
        });
    };
    const handleSave = (uniqueKey) => {
        // Stop editing - change the button back from save to edit.
        stopEditing(uniqueKey);
        // @TODO update the data in backend by iterating over the values stored in buffer.

        // Modify original list by merging with the values present in editsBuffer but do it only for the rows whose srno is same as id.
        let modifiedOriginalList = originalList.map(row => row[props.uniqueKeyName] == uniqueKey? ({
            ...row,
            ...(editsBuffer[row[props.uniqueKeyName]] || {})
        }) : row);

        /*
         Code for save all.
         let modifiedOriginalList = originalList.map(row => ({
            ...row,
            ...(editsBuffer[row.srno] || {})
        }));
        // after that empty editsBuffer.
        setEditsBuffer({});
         */
        // Dont' clear the complete buffer but remove only entries for this id. There might be multiple entries for this.
        setEditsBuffer(prevBuffer => {
            // Copy the previous buffer
            const updatedBuffer = { ...prevBuffer };

            // Remove the entry with the specified id
            delete updatedBuffer[uniqueKey];

            return updatedBuffer;
        });
        setOriginalList(modifiedOriginalList);

    };

    /** Function to handle search bar at the top of the table **/
    function handleFilter(value) {
        if(value=='')
            setStudentList(originalList);
        else {
            const newData = originalList.filter(props.dataFilterFunction(value));
            setStudentList(newData);
        }
    }

    /** Functions to handle getting derived data from original data and the modified values present in buffer **/
    const getDisplayData = () => {
        return studentList.map(row => ({
            ...row,
            ...(editsBuffer[row[props.uniqueKeyName]] || {})
        }));
    };
    //console.log(getDisplayData());

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
        setStudentList(props.initialData);
        setOriginalList(props.initialData);
        setDisplayData(props.initialData);
    }, []);
    useEffect(() => {
       handleFilter('')
    }, [originalList]);
    useEffect(() => {
        console.log('computing display data from ' + props.initialData.length);
        setDisplayData(getDisplayData());
    }, [studentList, editsBuffer]);

    // Iterate of passed columns props and build the column field to be used with this table.
    const column : any = props.displayColumns.filter(col => {
        if (col.isCommonField) {
            return false;
        } else
            return true;
    }).map(col=>{
        let colToReturn =  {
            name: col.name,
            omit: false,
            width: col.width,
            sortable: col.sortable
        }
        if (col.isEditable) {
            if (col.fieldName) {
                // @ts-ignore
                colToReturn.selector = row => {
                    simpleLabel({
                        isEditable: true,
                        isInEditMode: editingRows.has(row[props.uniqueKeyName]),
                        data: row[col.fieldName!],
                        onChange: (value) => handleEditChange(row[props.uniqueKeyName], col.fieldName, value)
                    });
                }
            } else {
                // if column is editable then the caller must provide the fieldname in the column interface. Otherwise throw error.
                throw "if column is editable then the caller must provide the fieldname in the column interface";
            }
        } else {
            // @ts-ignore
            colToReturn.selector = col.selector;
        }
        if (col.omit)
            colToReturn.omit = true;
        return colToReturn
    })
    // Columns of the data table
   /* const column = [
        {name: "SR No", selector: row => simpleLabel({isEditable: true, isInEditMode: editingRows.has(row.srno), data: row.srno, onChange: (value)=> handleEditChange(row.srno,"srno", value)}), omit: true},
        {name: "Name", selector: row => row.rte?<b>{row.name}</b>:row.name, omit: false},
        {name: "Class", selector: row => simpleLabel({isEditable: true, isInEditMode: editingRows.has(row.srno), data: row.classname, onChange: (value)=> handleEditChange(row.srno,"classname", value)}), omit: false},
        /!*{
            name: 'Toggle',
            selector: row => <button onClick={() => handleToggle(row)}>Toggle</button>
        }*!/
        {name: "Note", selector: row => simpleLabel({isEditable: true, isInEditMode: editingRows.has(row.srno), data: row.note, onChange: (value)=> handleEditChange(row.srno,"note", value)}), omit: false},
        {name: "Action", selector: row => editingRows.has(row.srno)
                ? <button className="btn btn-primary" onClick={() => handleSave(row.srno)}>Save</button>
                : <button className="btn btn-primary" onClick={() => startEditing(row.srno)}>Edit</button>, omit: false}
    ];*/
    const breakpoint = 768; // example breakpoint
    const regularColumns = windowWidth > breakpoint
        ? column  // Display all columns for larger screens
        : column.slice(0, 4);  // Display only the first 4 columns for smaller screens
    const expandableColumns = windowWidth > breakpoint
        ? []  // No expandable columns for larger screens
        : column.slice(4);  // Make the rest of the columns expandable

    return (
        <div>
            <CommonHeaderComponent<T> column={props.displayColumns} samplerow={props.newEntryData? props.newEntryData: undefined }/>
            {props.newEntryColumns? <ModalInput></ModalInput>: <></>}
            <div className="text-end"><input type="text" onChange={(e)=>handleFilter(e.target.value)}/></div>
            <DataTable
                responsive={true}
                columns={regularColumns}
                data={displayData}
                expandableRows={expandableColumns.length >0? true: false}
                expandableRowsComponent={ExpandedComponent(expandableColumns)}
                pagination
                highlightOnHover
            />
            {/*<div style={{position: 'fixed', textAlign: 'center', ...floatingIcon}} onClick={() => setShowModal(true)}><i className="fas fa-plus"></i>
            </div>*/}
        </div>
    );
}