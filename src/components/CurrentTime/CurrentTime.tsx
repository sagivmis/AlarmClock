import React, { useEffect, useState } from 'react'
import './currenttime.css'

const CurrentTime = () => {

    const [hour, setHour] = useState<number>(0)
    const [minute, setMinute] = useState<number>(0)
    const [seconds, setSeconds] = useState<number>(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date();
            setHour(date.getHours());
            setMinute(date.getMinutes());
            setSeconds(date.getSeconds());
        }, 100)
        return () => clearInterval(interval);
    }, [])
    const displaySeconds = seconds < 10 ? `0${seconds}` : `${seconds}`
    const displayMinutes = minute < 10 ? `0${minute}` : `${minute}`
    const displayHour = hour < 10 ? `0${hour}` : `${hour}`
    return (
        <div className='current-time'>{`${displayHour}:${displayMinutes}`}<div className='seconds'>{`${displaySeconds}`}</div></div>
    )
}

export default CurrentTime