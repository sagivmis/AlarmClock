import React, { useEffect, useState } from 'react'
import './sidebar.css'
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

import { IconButton } from '@mui/material';

interface ISideBar {
    open?: boolean;
}

const SideBar = (props: ISideBar) => {
    const { open = false } = props
    const [showSideBar, setShowSideBar] = useState(open);

    useEffect(() => {
        setShowSideBar(open);
    }, [open])

    return (
        showSideBar ? <div className='sidebar'>
            <IconButton aria-label="show-panel" className='close-sidebar' onClick={() => { setShowSideBar(prev => !prev) }}>
                <HighlightOffOutlinedIcon />
            </IconButton>
        </div> : <IconButton aria-label="show-panel" className='sidebar-closed' onClick={() => { setShowSideBar(prev => !prev) }}>
            <AddBoxOutlinedIcon />
        </IconButton>
    )


}

export default SideBar