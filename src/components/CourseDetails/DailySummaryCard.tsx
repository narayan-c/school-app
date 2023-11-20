import React, {useState} from "react";
import {Card, ListGroup} from "react-bootstrap";
import {List, ListItem} from "@mui/material";



function DailySummayrInfo ({ id }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card /*onClick={() => setExpanded(!expanded)}*/ style={{  }}>
            <Card.Body>
                <Card.Title>
                    Daily Summary - {id}
                </Card.Title>
            </Card.Body>
        </Card>
    );
}

function DailySummaryInfoList (){
    return (
        <List style={{marginLeft:"2%"}}>
            {[1, 2, 3].map(id =>
                <DailySummayrInfo key={id} id={id}/>
            )}
        </List>
    );
}


export default DailySummaryInfoList;