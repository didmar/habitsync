import {IonCheckbox, IonCol, IonLabel, useIonModal} from '@ionic/react';
import {Measure, MeasureType, updateValue} from '../data/habits';
import React, {useEffect, useState} from "react";
import {InputQuantiModal} from './InputQuantiModal'

interface MeasureInputProps {
    measureType: MeasureType;
    measure: Measure;
}

export const habitDescColSize = "6"
export const checkColSize = "2"

const MeasureInput: React.FunctionComponent<MeasureInputProps> = ({measureType, measure}: MeasureInputProps) => {

    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        (async function () {
            setValue(measure.value);
        })();
    }, [])

    function checked(): boolean {
        return value !== undefined && value > 0;
    }

    /**
     * Modal to set the value in the "quanti" case
     */
    const handleDismiss = () => {
        dismiss();
    };
    const handleSetValue = (newValue: number) => {
        setValue(newValue)
    }
    const [present, dismiss] = useIonModal(InputQuantiModal, {
        onDismiss: handleDismiss,
        onConfirm: handleSetValue,
    });

    var checker;
    if (measureType === "binary") {
        checker =
            <IonCheckbox
                checked={checked()}
                onIonChange={e => {
                    const value = e.detail.checked ? 1 : 0
                    updateValue(measure, value).then(() => setValue(value))
                }}
            />;
    } else {
        const fmtValue = value === undefined ? "?" : value
        checker = <IonLabel onClick={ () => present({}) }>{fmtValue}</IonLabel>;
        /*checker = <IonInput
            type="number"
            inputmode="numeric"
            step="any"
            value={value}
            onIonChange={e => {
                const value = parseInt(e.detail.value!, 10)
                updateValue(measure, value).then(() => setValue(value))
            }}/>*/
    }

    return (
        <>
            <IonCol size={checkColSize}>
                {checker}
            </IonCol>
        </>
    );
};

export default MeasureInput;
