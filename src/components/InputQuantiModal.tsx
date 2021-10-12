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
    onDismiss: () => void;
    onConfirm: (value: number) => void;
}

export const InputQuantiModal: React.FunctionComponent<InputQuantiModalProps> = ({onDismiss, onConfirm}: InputQuantiModalProps) => {
    const [value, setValue] = useState(0)
    const [inputMode, setInputMode] = useState<InputMode>(InputMode.manual)

    function onInputModeChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const newValue: string = e.detail.value!
        setInputMode(InputMode[newValue as keyof typeof InputMode])
    }

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
                    <IonItem disabled={inputMode !== InputMode.manual}>
                        <IonInput
                            type="number"
                            value={value}
                            color="primary"
                            placeholder="Enter value"
                            required={true}
                            onIonChange={(e) => {
                                const newValue = parseFloat(e.detail.value!);
                                console.log(newValue);
                                setValue(newValue);
                            }}
                        />
                    </IonItem>
                    <IonItem disabled={inputMode !== InputMode.stopwatch}>
                        <StopwatchModal onStopped={(minutes) => setValue(minutes)}/>
                    </IonItem>
                    <IonItem>
                        <IonButtons slot="end">
                            <IonButton onClick={() => onDismiss()}>Cancel</IonButton>
                            <IonButton onClick={() => {
                                if(value >= 0) {
                                    onConfirm(value); onDismiss()
                                }
                                }}>
                                OK
                            </IonButton>
                        </IonButtons>
                    </IonItem>
                </IonList>
            </IonPage>
        </>
    )
}