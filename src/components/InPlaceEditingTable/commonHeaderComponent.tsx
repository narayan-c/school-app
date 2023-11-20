import {DisplayColumn} from "./inPlaceEditingTableComponent";
import './commonHeaderComponent.css';

export default function CommonHeaderComponent<T>(props: {column: DisplayColumn<T>[], samplerow: T}) {
    return (
        <div className="headerContainer">
            {props.column.filter(col=> {
                if (col.isCommonField)
                    return true;
                else
                    return false;
            }).map((column, index) => (
                <div key={index} className="columnContainer">
                    <span style={{ fontWeight: 'bold', marginRight: '5px' }}>{String(column.name)}:</span>
                    <span>{column.selector(props.samplerow)}</span>
                </div>
            ))}
        </div>
    );
}