"use client"

import * as React from "react"
import { useState, useEffect } from "react"

interface HomeTimingProps {
    showSeconds?: boolean;
    showTimezone?: boolean;
}

export function HomeTiming(props: HomeTimingProps) {
    const { showSeconds = false, showTimezone = false } = props;

    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [timezoneName, setTimezoneName] = useState<string>("");

    useEffect(() => {
        const timezoneOffset = currentTime.getTimezoneOffset();

        const timezoneShorter = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const offset = -timezoneOffset / 60;
        const offsetStr = offset >= 0 ? `+${offset}` : `${offset}`;

        setTimezoneName(`${timezoneShorter} GMT${offsetStr}`);

        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: showSeconds ? '2-digit' : undefined,
            hour12: true
        });
    };

    const formatDate = (date: Date): string => {
        const day = date.getDate();

        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const weekday = weekdays[date.getDay()];

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[date.getMonth()];

        return `${weekday} | ${month} ${day}`;
    };

    return (
        <div className="min-w-80 z-50 text-primary p-4 rounded-xl bg-background flex flex-col items-center justify-center gap-2">
            <div className="flex flex-col gap-1 items-center">
                <div className="text-sm">{formatDate(currentTime)}</div>
                <div className="text-5xl font-black font-open-sans tabular-nums leading-tight text-foreground">{formatTime(currentTime)}</div>
                {showTimezone && (<div className="text-xs text-foreground/50">{timezoneName}</div>)}
            </div>
        </div>
    )
}