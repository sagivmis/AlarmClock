import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import './clock.css'
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';

import useKeyboardShortcut from "use-keyboard-shortcut";

import { Button, IconButton, Stack, TextField } from '@mui/material';
import useAudio from '../../hooks/useAudio';
//@ts-ignore
import alarmClockSound from '../../assets/sound/Analog-watch-alarm-sound.mp3'
import { ClockType } from '../../types/types';


interface IClock {
    clock: ClockType;
    clockboard: ClockType[];
    setSelectedClock: Dispatch<SetStateAction<number>>;
    setClockboard: Dispatch<SetStateAction<ClockType[]>>;
    selected: boolean;
}

const Clock = (props: IClock) => {
    const { clock, setSelectedClock, selected, clockboard, setClockboard } = props;

    // references
    const audioPlayer = useRef<HTMLAudioElement>(null);

    const { playing, toggle } = useAudio(alarmClockSound, audioPlayer);
    const [hour, setHour] = useState<number>(clock.hour)
    const [minute, setMinute] = useState<number>(clock.minute)
    const [confirmedTime, setConfirmedTime] = useState(clock.confirmed);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [awoke, setAwoke] = useState(false);
    const [minuteInterval, setMinuteInterval] = useState(0);
    const [amountInterval, setAmountInterval] = useState(0);

    const { flushHeldKeys } = useKeyboardShortcut(
        ["ArrowUp"],
        (shortcutKeys: any) => { if (selected) console.log("Shift + UP has been pressed.") },
        {
            overrideSystem: false,
            ignoreInputFields: false,
            repeatOnHold: false
        }
    );

    const toggleAlarmClock = () => {
        const date = new Date();
        const currentHour = date.getHours();
        const currentMinute = date.getMinutes();

        if (playing && hour <= currentHour && minute <= currentMinute) setAwoke(true)
        toggle();
    }

    const confirmTime = (e: any) => {
        if (validateTime()) {
            setConfirmedTime(true);
            console.log(e.target.value);
            clock.hour = hour;
            clock.minute = minute;
        }
        else
            setError(true);
    }

    const validateTime = () => {
        if ((hour || hour === 0) && (minute || minute === 0))
            return hour <= 24 && hour >= 0 && minute >= 0 && minute <= 60;
        else setErrorMessage("Must fill 'Hour' and 'Minute'")
    }

    const editTime = (e: any) => {
        setConfirmedTime(false);
    }

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

    const checkTime = () => {
        const date = new Date();
        return (hour === date.getHours() && minute === date.getMinutes())
    }

    const stopAlarmClock = () => {
        toggleAlarmClock();
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (checkTime() && !playing && !awoke) toggleAlarmClock();
        }, 500)
        if (awoke) clearInterval(interval)
        return () => {
            clearInterval(interval);
        }
    }, [hour, minute, awoke])

    const addClockInFiveMinutes = () => {
        if ((hour || hour === 0) && (minute || minute === 0)) {
            const newMinute = minute >= 55 ? minute - 55 : minute + 5; // if above 55 need to reset the minutes to 0
            const newHour = minute >= 55 ? hour + 1 : hour; // if 'resetted' minutes, therefore an hour passed
            const newClock = {
                id: clockboard.length,
                hour: newHour,
                minute: newMinute,
                confirmed: true,
            } as ClockType
            setClockboard(prev => [...prev, newClock])
        }
    }

    const bulkAddClockInFiveMinutes = (amount: number) => {
        const maxAmount = 12; //until i fix more than 1 hour adjustment
        const amountToRepeat = Math.min(amount, maxAmount)
        for (let i = 0; i < amountToRepeat; i++) {
            if ((hour || hour === 0) && (minute || minute === 0)) {
                const newMinute = minute + i * 5 >= 55 ? minute + i * 5 - 55 : minute + i * 5 + 5; // if above 55 need to reset the minutes to 0
                const newHour = minute + i * 5 >= 55 ? hour + 1 : hour; // if 'resetted' minutes, therefore an hour passed
                const newClock = {
                    id: clockboard.length + i,
                    hour: newHour,
                    minute: newMinute,
                    confirmed: true,
                } as ClockType

                setClockboard(prev => [...prev, newClock])
            }
        }
    }

    const bulkAddClockIn = (interval: number, amount: number) => {
        const maxAmount = 60 / interval;
        const amountToRepeat = Math.min(amount, maxAmount);
        for (let i = 0; i < amountToRepeat; i++) {
            if ((hour || hour === 0) && (minute || minute === 0)) {
                const newMinute = minute + i * interval >= 60 - interval ? minute + i * interval - (60 - interval) : minute + i * interval + interval; // if above 55 need to reset the minutes to 0
                const newHour = minute + i * 5 >= 55 ? hour + 1 : hour; // if 'resetted' minutes, therefore an hour passed
                const newClock = {
                    id: clockboard.length + i,
                    hour: newHour,
                    minute: newMinute,
                    confirmed: true,
                } as ClockType

                setClockboard(prev => [...prev, newClock])
            }
        }
    }

    const addClockIn = (interval: number) => {
        //interval will be measured in minutes for adapdability
        if ((hour || hour === 0) && (minute || minute === 0)) {
            const newMinute = minute >= 60 - interval ? minute - 60 - interval : minute + interval; // if above 55 need to reset the minutes to 0
            const newHour = minute >= 60 - interval ? hour + 1 : hour; // if 'resetted' minutes, therefore an hour passed
            const newClock = {
                id: clockboard.length,
                hour: newHour,
                minute: newMinute,
                confirmed: true,
            } as ClockType
            setClockboard(prev => [...prev, newClock])
        }
    }

    const removeClock = () => {
        // clockboard.splice(clock.id, 0)
        setClockboard(prev => {
            return prev.filter((currentClock) => currentClock.id !== clock.id)
        })
    }

    const resetAwoke = () => {
        setAwoke(false);
    }
    const displayHours = hour === 0 ? '00' : hour && hour < 10 ? `0${hour}` : `${hour}`
    const displayMinutes = minute === 0 ? '00' : minute && minute < 10 ? `0${minute}` : `${minute}`

    const handleMinuteIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputMinute = parseInt(e.target.value);
        if (inputMinute >= 0 && inputMinute <= 60)
            setMinuteInterval(inputMinute)
    }
    const handleAmountIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputAmount = parseInt(e.target.value);
        const maxAmount = 60 / minuteInterval;
        if (inputAmount <= maxAmount)
            setAmountInterval(inputAmount)
    }
    return (
        <div className={`clock ${selected ? "selected" : ""} ${awoke ? "awoke" : ""} ${playing ? "playing" : ""}`} onClick={() => setSelectedClock(clock.id)}>
            <IconButton aria-label="clock" className='delete-clock' onClick={removeClock}>
                <HighlightOffOutlinedIcon className="delete-clock" />
            </IconButton>
            {awoke && <IconButton aria-label="clock" className='reset-awoke' onClick={resetAwoke}>
                <RestartAltOutlinedIcon className="reset-awoke" />
            </IconButton>}

            <Stack className='clock-input'>
                {!confirmedTime ?
                    <div className='time-input'>
                        <TextField error={hour || hour === 0 ? hour > 24 || hour < 0 : true} onChange={handleHourChange} value={displayHours} label="Hour" variant="outlined" className='hours-input' inputProps={{ maxLength: 3 }} />
                        <TextField error={minute || minute === 0 ? minute > 60 || minute < 0 : true} onChange={handleMinuteChange} value={displayMinutes} label="Minute" variant="outlined" className='minute-input' inputProps={{ maxLength: 3 }} />
                    </div>
                    :
                    <div className='confirmed-time'>
                        {`${displayHours} : ${displayMinutes}`}
                    </div>
                }
                {!confirmedTime ?
                    <IconButton aria-label="clock" className='confirm-clock-time' onClick={confirmTime}>
                        <CheckOutlinedIcon />
                        <audio ref={audioPlayer} src={alarmClockSound} preload='metadata' />
                    </IconButton>
                    :
                    <IconButton aria-label="clock" className='confirm-clock-time' onClick={editTime}>
                        <ModeEditOutlineOutlinedIcon />
                    </IconButton>
                }
                {playing ?
                    <IconButton disabled={awoke} aria-label="clock" className='pause-clock-sound sound' onClick={toggleAlarmClock}>
                        <PauseOutlinedIcon />
                        <audio ref={audioPlayer} src={alarmClockSound} preload='metadata' />
                    </IconButton>
                    :
                    <IconButton disabled={awoke} aria-label="clock" className='play-clock-sound sound' onClick={toggleAlarmClock}>
                        <PlayArrowIcon className="play-clock-sound" />
                    </IconButton>
                }
                {error && <div className='error-message'>{errorMessage}</div>}
                <div className="clock-panel">
                    <Button variant='text' size='small' className='five-min-btn' onClick={addClockInFiveMinutes}>+5 m</Button>
                    <Button variant='text' size='small' className='bulk-add-btn' onClick={() => bulkAddClockInFiveMinutes(12)}>12x</Button>
                </div>
                <Stack className="user-input-intervals">
                    <TextField error={false} onChange={handleMinuteIntervalChange} value={minuteInterval} label="Interval" variant="outlined" className='interval-input' inputProps={{ maxLength: 3 }} />
                    <TextField error={false} onChange={handleAmountIntervalChange} value={amountInterval} label="Amount" variant="outlined" className='amount-input' inputProps={{ maxLength: 3 }} />
                    <IconButton aria-label="user-intervals" size='small' className='bulk-add-btn' onClick={() => bulkAddClockIn(minuteInterval, amountInterval)}><CheckOutlinedIcon /></IconButton>

                </Stack>
            </Stack >
        </div >
    )
}

export default Clock