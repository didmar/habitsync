import React, { useState, useEffect } from "react";
import {IonButton, IonButtons, IonLabel} from "@ionic/react";

interface StopwatchModalProps {
    onResetted: () => void;
    onStarted: (seconds: number) => void;
    onStopped: (seconds: number) => void;
}


const StopwatchModal = ({onResetted, onStarted, onStopped}: StopwatchModalProps) => {
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
            const seconds = (time / 1000)
            if(running) {
                console.log("Stopped !!")
                onStopped(seconds)
            } else {
                console.log("Started !!")
                onStarted(seconds)
            }
        };
    }

    function onReset() {
        return () => {
            setRunning(false);
            setTime(0);
            onResetted()
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