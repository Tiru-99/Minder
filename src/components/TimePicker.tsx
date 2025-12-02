"use client"
import { useState, useEffect } from "react";

export default function TimePickerComponent({ onChange, initialValue }: { onChange: (time: string, errMsg: string) => void, initialValue?: string }) {
    const [hourVal, setHourVal] = useState<string>("");
    const [minuteVal, setMinuteVal] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>("");

    const updateParent = (hourValue: string, minuteValue: string, errMsg: string) => {
        const time = hourValue + ":" + minuteValue;
        onChange(time, errMsg);
    }

    useEffect(() => {
        if (initialValue) {
            const [h, m] = initialValue.split(":");
            if (h && m) {
                setHourVal(h);
                setMinuteVal(m);
            }
        }
    }, [initialValue]);

    useEffect(() => {
        let err = "";
        if (hourVal.length === 0 || minuteVal.length === 0) {
            err = "Time Cannot be empty";
            setErrMsg(err);
        }
        else if (parseInt(hourVal) > 24 || parseInt(minuteVal) > 59) {
            err = "Invalid time";
            setErrMsg(err);
        } else {
            err = "";
            setErrMsg(err);
        }
        // Only update parent if we have values or if it's a user interaction (implicit by state change)
        // But we want to avoid infinite loops or premature updates if initialValue is setting it.
        // For now, this is fine as long as parent doesn't cycle `onChange` back to `initialValue` causing a loop.
        updateParent(hourVal, minuteVal, err);

    }, [hourVal, minuteVal])

    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>, type: "hour" | "minute") => {
        const value = e.target.value;

        if (value.length > 2) {
            return;
        }

        if (value === "" && type === "hour") {
            setHourVal(value);
            return;
        }

        if (value === "" && type === "minute") {
            setMinuteVal(value);
            return;
        }

        if (/^[0-9]*$/.test(value)) {
            if (type === "hour") {
                setHourVal(value);
            } else {
                setMinuteVal(value);
            }
        }
    }

    return (
        <>
            <div className="flex items-center gap-1">
                {/* Hour Component */}
                <input
                    type="text"
                    placeholder="HH"
                    value={hourVal}
                    onChange={(e) => handleNumberInput(e, "hour")}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors"
                />
                <span className="text-white font-bold text-sm">:</span>

                {/* Minute Component */}
                <input
                    type="text"
                    placeholder="MM"
                    value={minuteVal}
                    onChange={(e) => handleNumberInput(e, "minute")}
                    className="w-full rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none transition-colors"
                />
            </div>
            <p className="text-red-500 text-sm mt-1">{errMsg}</p>

        </>
    )
}