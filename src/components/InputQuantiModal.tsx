import {IonButton, IonInput, IonPage} from '@ionic/react';
import React, {useState} from "react";

interface InputQuantiModalProps {
    onDismiss: () => void;
    onConfirm: (value: number) => void;
}

export const InputQuantiModal: React.FunctionComponent<InputQuantiModalProps> = ({onDismiss, onConfirm}: InputQuantiModalProps) => {
    const [value, setValue] = useState(0)
    return (
        <>
            <IonPage>
                <IonInput
                    type="number"
                    value={value}
                    color="primary"
                    placeholder="Enter value"
                    required={true}
                    onIonChange={(e) => {
                        const newValue = parseInt(e.detail.value!, 10);
                        console.log(newValue);
                        setValue(newValue);
                    }}
                />
                <IonButton onClick={() => onDismiss()}>Cancel</IonButton>
                <IonButton onClick={() => {
                    if(value >= 0) {
                        onConfirm(value); onDismiss()
                    }
                }}>OK</IonButton>
            </IonPage>
        </>
    )
}