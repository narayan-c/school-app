import React from "react";
import {Dropdown, Form} from "react-bootstrap";


export function createDropDown(data: string, editable: boolean, isBeingEdited: boolean, callback) {

    function handleSelect(itemValue) {
        callback(itemValue);
    }
    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Dropdown Button
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1" onClick={() => handleSelect('Action 1')}>Action 1</Dropdown.Item>
                    <Dropdown.Item href="#/action-2" onClick={() => handleSelect('Action 2')}>Action 2</Dropdown.Item>
                    <Dropdown.Item href="#/action-3" onClick={() => handleSelect('Action 3')}>Action 3</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}

export function multiLineTextInput(data: string, editable: boolean, isBeingEdited: boolean, callback) {
    const handleChange = (event) => {
        callback(event.target.value);
    };

    return (
        <textarea
            value={data}
            onChange={handleChange}
            rows={4}  // Default to 4 rows if not provided
            cols={50} // Default to 50 columns if not provided
            placeholder={"Type your text here..."}
        />
    );
}

export function simpleTextInput(data: string, callback) {
    const handleChange = (event) => {
        callback(event.target.value);
    };
    return (
        <Form.Group>
            <Form.Control
                type="text"
                value={data}
                onChange={handleChange}
            />
            {/*{props.helpText && <Form.Text className="text-muted">{props.helpText}</Form.Text>}*/}
        </Form.Group>
    );
}

export function simpleLabel(props: {isEditable: boolean, isInEditMode: boolean, data: string, onChange: any}) {
    if (props.isEditable) {
        if (props.isInEditMode) {
            return simpleTextInput(props.data, props.onChange);
        }
    }
    return <label>{props.data}</label>

}