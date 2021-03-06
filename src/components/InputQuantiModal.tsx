import {
    IonButton,
    IonButtons,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSegment,
    IonSegmentButton,
} from '@ionic/react';
import React, {useState} from "react";
import StopwatchModal from "./StopwatchModal";
import {create, timer} from "ionicons/icons";
import {SegmentChangeEventDetail} from "@ionic/core";

export enum InputMode {
    manual = "manual",
    stopwatch = "stopwatch",
}

interface InputQuantiModalProps {
    initValue: number | undefined;
    onDismiss: () => void;
    onConfirm: (value: number) => void;
}

export const InputQuantiModal: React.FunctionComponent<InputQuantiModalProps> = ({initValue, onDismiss, onConfirm}: InputQuantiModalProps) => {
    const [value, setValue] = useState<number | undefined>(initValue)
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.manual)

    function onInputModeChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const newValue: string = e.detail.value!
        setInputMode(InputMode[newValue as keyof typeof InputMode])
        setValue(undefined)
    }

    const manualInput = (
        <>
            <IonItem disabled={inputMode !== InputMode.manual}>
                <IonInput
                    style={{"max-width": "200px", "margin-left": "auto", "margin-right": "auto"}}
                    type="number"
                    inputmode="numeric"
                    value={value ? value : ""}
                    color="primary"
                    placeholder="Enter value"
                    required={true}
                    onIonChange={(e) => {
                        if(e.detail.value) {
                            const newValue = parseFloat(e.detail.value!);
                            console.log(newValue);
                            setValue(newValue);
                        }
                    }}
                />
            </IonItem>
        </>
    )

    const stopwatchInput = (
        <>
            <IonItem
                disabled={inputMode !== InputMode.stopwatch}
                style={{"max-width": "400px", "margin-left": "auto", "margin-right": "auto"}}>
                <StopwatchModal
                    onResetted={() => setValue(undefined)}
                    onStarted={(_) => setValue(undefined)}
                    onStopped={(seconds) => setValue(seconds)}/>
            </IonItem>
        </>
    )

    return (
        <>
            <IonPage>
                <IonList>
                    <IonSegment
                        onIonChange={onInputModeChange}
                        value={inputMode.toString()}>
                        <IonSegmentButton value={InputMode.manual}>
                            <IonIcon icon={create}/>
                            <IonLabel>Manual</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value={InputMode.stopwatch}>
                            <IonIcon icon={timer}/>
                            <IonLabel>Stopwatch</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    {inputMode === InputMode.manual ? manualInput : stopwatchInput}
                    <IonItem>
                        <IonButtons slot="start">
                            <IonButton
                                onClick={() => onDismiss()}>
                                Cancel
                            </IonButton>
                        </IonButtons>
                        <IonButtons slot="end">

                            <IonButton
                                type={"submit"}
                                disabled={value === undefined || value < 0}
                                onClick={() => { onConfirm(value!); onDismiss() }}>
                                OK
                            </IonButton>
                        </IonButtons>
                    </IonItem>
                </IonList>
            </IonPage>
        </>
    )
}