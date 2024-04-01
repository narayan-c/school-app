import InPlaceEditingTableComponent, {
    DisplayColumn, InPlaceEditingTableProps,
    NewEntryColumn
} from "../InPlaceEditingTable/inPlaceEditingTableComponent";
import {useEffect, useState} from "react";
import {Navigate, useNavigate} from "react-router-dom";
import {Config} from "../../config";


const url = `${Config.BASE_URL}/students/getallstudents`; //'https://pps-api.onrender.com/getStudents/getallstudents';
let navigate; // For navigation with React Router

export type AddedFields<T extends StudentProperties> = {
    [K in Exclude<keyof T, keyof StudentProperties>]: T[K];
};

export type ExtendedProps<T extends StudentProperties> = AddedFields<T> & Pick<StudentProperties, 'srno'>;

export interface ExtendedStudentComponentProps<T extends StudentProperties> {
    extendedInitialData: ExtendedProps<T>[];
    extendedDisplayColumns: DisplayColumn<AddedFields<T>>[];
}

export interface StudentProperties {
    srno: string,
    name: string,
    classname: string,
    note: string,
    rte?: string,
    siblings?: string,
    omit?: boolean,
    sortable?: boolean/*
    toggle?: any*/
    /*note: string,
    rte: boolean*/
}



async function newUniqueKeyGenerator() {
    const myPromise: Promise<string> = new Promise((resolve, reject) => {
        resolve('sr-1');
    });
    return myPromise;
}


function createExtendedDisplayColumn<T extends StudentProperties>(props: DisplayColumn<AddedFields<T>>[], studentList: T[]) : DisplayColumn<T>[]{
    function rednerNotes(row: T) {
        let isRTE = false;
        let isSiblings = false;
        let finalHTML = <div></div>;
        let siblings: string [] = [];
        if (row.rte)
            isRTE = true;
        if (row.siblings) {
            isSiblings = true;
            // split row.siblings to get each sibling sr number separately.
            // for each SRno get the name by traversing over studentList and put the name and the classname there.
            // Step 1: Split the values
            const srNumbers = row.siblings.split(', ');
            // Step 2-5: Iterate and process each SR number
            srNumbers.forEach(sr => {
                // Step 3: Search the array of JSON objects based on SR number
                const foundObject = studentList.find(item => item.srno === sr.split('-')[1]);

                // Step 4: Retrieve other fields for that SR number
                if (foundObject) {
                    console.log("Object found" + foundObject.name + ", " + foundObject.classname);
                    siblings.push(`${foundObject.name}(${foundObject.classname})`);
                    // Use concatenatedValue as needed
                }
            });

        }
        finalHTML = (
            <>
                {isRTE ? <u>RTE<br /></u> : ''}
                {row.siblings ? (
                    <>
                        <b>Siblings:<br /></b>
                        {siblings.map((sibling, index) => (
                            <div key={index}>{sibling}</div>
                        ))}
                    </>
                ) : ''}
            </>
        );
        return finalHTML;
    }
    var displayColumns = [
        {
            name: 'SRNO',
            selector: (row) => {return <b>{row.srno}</b>},
            isEditable: false,
            fieldName : "srno",
            omit: false,
            width: '5rem',
            sortable: true
        },
        {
            name: 'Name',
            selector: (row) => {return <b>{row.name}</b>},
            isEditable: false,
            fieldName : "name",
            omit: false,
            width: '12rem',

        },
        {
            name: 'Class',
            selector: (row) => {return <b>{row.classname}</b>},
            isEditable: false,
            fieldName : "classname",
            omit: false,
            width: '6rem',
            sortable: true

        },
        {
            name: 'Notes',
            selector: (row) => {return <>{rednerNotes(row)}</>},
            isEditable: false,
            fieldName : "Notes",
            omit: false,
            width: '14rem'
        },
        {
            name: 'Payment Info',
            selector: (row) => {return <button className="btn btn-primary" onClick={()=>{ navigate(`/fees/${row.srno}`);}}>Fee</button>
            },
            isEditable: false,
            fieldName : "classname",
            omit: false,
            width: '8rem'

        },
        ...props
    ] as DisplayColumn<T>[];
    return displayColumns;
}



export default function StudentListingComponent<T extends StudentProperties>(props: ExtendedStudentComponentProps<T>) {
    function createExtendedData<T extends StudentProperties>(
        baseData: StudentProperties[],
        otherProps: ExtendedProps<T>[]
    ): T[] {        // iterate over baseData and props and merge them based on srno.
        // Create a map to hold merged objects
        // Create a map to index baseData by srno
        const baseDataMap = new Map<string, StudentProperties>();
        baseData.forEach(item => baseDataMap.set(item.srno, item));
        // Merge props into baseData
        const mergedData: T[] = otherProps.map(propItem => {
            const baseItem = baseDataMap.get(propItem.srno);
            if (baseItem) {
                return { ...baseItem, ...propItem } as T;
            }
            return propItem as T;
        });
        return mergedData;
    }
    navigate = useNavigate();
    const [studentList, setStudentList] = useState<T[]>([] as T[]);
    const [dataLoaded, setDataLoaded] = useState(false);
    var uniqueKeyName = "srno";
    const stripTags = (jsxElement) => {
        if (typeof jsxElement === 'string') {
            return jsxElement; // If the element is already a string, return it
        }

        if (Array.isArray(jsxElement)) {
            // If the element is an array, concatenate text content of each item
            return jsxElement.map(stripTags).join('');
        }

        // If the element is an object (React element), recursively process its children
        const { props } = jsxElement;
        if (props && props.children) {
            return stripTags(props.children);
        }

        return '';
    };
    const dataFilterFunction = (data: string) => (row: T) => {
        // check if data appears in any field of row then return true.
        return (row.srno.toLowerCase().includes(data.toLowerCase()) || row.classname.toLowerCase().includes(data.toLowerCase())
            || row.name.toLowerCase().includes(data.toLowerCase()) || stripTags(displayColumns[3].selector(row)).toLowerCase().includes(data.toLowerCase()));
    }
    /** Function to get data from the backend**/
    async function getData() {
        const text = "Some text here...";
        try {
            // set studentList to empty first.
            //setStudentList({} as []);
            const response = await fetch(url);
            const responseText = await response.text();
            // save responseText as array of StudentProperties.
            let studentInfo = JSON.parse(responseText) as StudentProperties[];
            // now pass studentInfo and props.extendedInitialData to createExtendedData method.
            let combinedStudentData = createExtendedData(studentInfo, props.extendedInitialData);
            setStudentList(combinedStudentData);
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
    let displayColumns = createExtendedDisplayColumn(props.extendedDisplayColumns, studentList);
    return (
        <div>
        {dataLoaded ? <InPlaceEditingTableComponent<T>
            initialData={studentList}
            displayColumns={displayColumns}
            uniqueKeyName={uniqueKeyName}
            dataFilterFunction={dataFilterFunction}
         newEntryUniqueKeyGenerator={newUniqueKeyGenerator}/> : <p>Loading</p>}
        </div>
    )
}

