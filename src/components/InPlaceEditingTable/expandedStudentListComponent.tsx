import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
    Assessment as MarksSummaryIcon,
    Visibility as ObservationSummaryIcon,
    Description as CopyCheckingIcon,
    PostAdd as AddSummaryIcon,
    NoteAdd as AddGeneralSummaryIcon,
    Notes as ShowGeneralSummaryIcon
} from '@mui/icons-material';


export default function ExpandedComponent(columns: any)  {
    return function ({data}) {
        return (
            <div>
                {columns.map(column => (
                    <div key={column.selector}>
                        <strong>{column.name}:</strong> {column.selector(data)}
                    </div>
                ))}
            </div>
        );
    };
}

