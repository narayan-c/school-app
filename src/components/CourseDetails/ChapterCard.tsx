import React, {useState} from "react";
import DailySummaryInfoList from "./DailySummaryCard";
import {Card, ListGroup} from "react-bootstrap";
import {List} from "@mui/material";



function ChapterCard ({ id }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
        <Card  style={{  }}>
            <Card.Body>
                <Card.Title>
                    Card A - {id}
                    <span style={{ marginLeft: '10px' }} onClick={() => setExpanded(!expanded)}>{expanded ? '-' : '+'}</span>
                </Card.Title>
            </Card.Body>
        </Card>
        {expanded && <DailySummaryInfoList />}
        </>
    );
}

function ChapterCardList (props: {className: string, subject: string}){
    return (
        <List style={{marginLeft:"1%"}}>
            {[1, 2, 3].map(id =>
                <ChapterCard key={id} id={id}/>
            )}
        </List>
);
}


export default ChapterCardList;