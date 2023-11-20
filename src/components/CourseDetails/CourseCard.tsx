
import React, { useState } from 'react';
import ChapterCardList from "./ChapterCard";
import {Card} from "react-bootstrap";

function MainCard (props: {className: string, courseName: string}) {

    const [expanded, setExpanded] = useState(false);

    return (
        <>
        <Card  style={{ }}>
            <Card.Body>
                <Card.Title>
                    {props.className} - {props.courseName}
                    <span style={{ marginLeft: '10px' }} onClick={() => setExpanded(!expanded)}>{expanded ? '-' : '+'}</span>
                </Card.Title>
            </Card.Body>
        </Card>
        {expanded && <ChapterCardList  className={props.className} subject={props.courseName}/>}
        </>
);
}

export default MainCard;