import { Box, Button, FormControl, IconButton, MenuItem, Modal, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { ClockType } from '../../types/types'
import Clock from '../Clock/Clock'
import './clockboard.css'
import AddIcon from '@mui/icons-material/Add';
interface IClockBoard {
}

const clocks = [
    {
        id: 0,
        hour: 7,
        minute: 0,
        confirmed: true
    },
]
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 200,
    height: 300,
    bgcolor: 'background.paper',
    border: '0.1em solid #000',
    boxShadow: 24,
    p: 4,
};

const ClockBoard = (props: IClockBoard) => {
    const [selectedClock, setSelectedClock] = useState(-1);
    const [clockboard, setClockboard] = useState<ClockType[]>(clocks)
    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState<number | undefined>(0)
    const [minute, setMinute] = useState<number | undefined>(0)
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputHour = parseInt(e.target.value);
        setError(false);
        if (inputHour <= 24)
            setHour(inputHour);
        else {
            setHour(0)
            setErrorMessage("'Hour' must be >= 0 and <= 24");
            setError(true);
        }
    }

    const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputMinute = parseInt(e.target.value)
        setError(false);
        if (inputMinute <= 60)
            setMinute(inputMinute);
        else {
            setMinute(0);
            setErrorMessage("'Minute' must be >=0 and <=60")
            setError(true);
        }
    }


    const handleClose = () => {
        setOpen(false);
    }
    const addClock = () => { setOpen(true) }
    const displayHours = hour === 0 ? '00' : hour && hour < 10 ? `0${hour}` : `${hour}`
    const displayMinutes = minute === 0 ? '00' : minute && minute < 10 ? `0${minute}` : `${minute}`

    const [alarmSoundID, setAlarmSoundID] = useState(0);

    const handleDropdownChange = (e: SelectChangeEvent) => {
        const inputSound = parseInt(e.target.value);
        console.log(inputSound)
        setAlarmSoundID(inputSound)
    }
    const approveClock = () => {
        const newClock = {
            id: clockboard.length,
            hour: hour,
            minute: minute,
            confirmed: true,
        } as ClockType

        setClockboard(prev => [...prev, newClock])
        setOpen(false)
    }

    return (
        <div className='clockboard'>
            <IconButton aria-label="clockboard" onClick={addClock} className='add-clock-btn'>
                <AddIcon />
            </IconButton>
            {clockboard.map((clock) => <Clock clock={clock} key={clock.id} setClockboard={setClockboard} clockboard={clockboard} setSelectedClock={setSelectedClock} selected={selectedClock === clock.id} />)}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={style}>
                    <FormControl fullWidth className='add-clock-form'>
                        <Typography id="modal-title" variant="h6" component="h2">
                            New Clock
                        </Typography>
                        <div className='new-time-input'>
                            <TextField error={hour || hour === 0 ? hour > 24 || hour < 0 : true} onChange={handleHourChange} value={displayHours} label="Hour" variant="outlined" className='hours-input' inputProps={{ maxLength: 3 }} />
                            <TextField error={minute || minute === 0 ? minute > 60 || minute < 0 : true} onChange={handleMinuteChange} value={displayMinutes} label="Minute" variant="outlined" className='minute-input' inputProps={{ maxLength: 3 }} />
                        </div>
                        <Select
                            labelId="select-label"
                            id="select-sound"
                            className="select-sound"
                            value={alarmSoundID.toString()}
                            onChange={handleDropdownChange}
                            label='Sound'
                        >
                            <MenuItem value={0}>Classic Alarm</MenuItem>
                            <MenuItem value={1} disabled>N\A</MenuItem>
                            <MenuItem value={2} disabled>N\A</MenuItem>
                        </Select>
                        <Button variant='outlined' className="approve-clock-btn" onClick={approveClock}>ADD</Button>
                    </FormControl>
                    {error && <div className='error-message-modal'>{errorMessage}</div>}
                </Box>
            </Modal>
        </div>
    )
}

export default ClockBoard