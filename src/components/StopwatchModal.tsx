import React, { useState, useEffect } from "react";
import {IonButton, IonButtons, IonLabel} from "@ionic/react";

interface StopwatchModalProps {
    onStopped: (minutes: number) => void;
}


const StopwatchModal = ({onStopped}: StopwatchModalProps) => {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        // @ts-ignore
        let interval;
        if (running) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 10);
            }, 10);
        } else if (!running) {
            clearInterval(interval);
        }
        // @ts-ignore
        return () => clearInterval(interval);
    }, [running]);

    function onStartStop() {
        return () => {
            setRunning(!running);
            onStopped(Math.floor((time / 1000)))
        };
    }

    function onReset() {
        return () => {
            setRunning(false);
            setTime(0);
            onStopped(0)
        };
    }

    return (
        <>
            <IonLabel className="numbers">
                <span>{("0" + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
                <span>{("0" + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
                <span>{("0" + ((time / 10) % 100)).slice(-2)}</span>
            </IonLabel>
            <IonButtons className="stopwatch">
                <IonButton onClick={onStartStop()}>Start/Stop</IonButton>
                <IonButton onClick={onReset()}>Reset</IonButton>
            </IonButtons>
        </>
    );
};

export default StopwatchModal;