import {IonCheckbox, IonCol} from '@ionic/react';
import {Measure, updateValue} from '../data/habits';
import React, {useEffect, useState} from "react";

interface MeasureInputProps {
    measure: Measure;
}

export const habitDescColSize = "6"
export const checkColSize = "2"

const MeasureInput: React.FunctionComponent<MeasureInputProps> = ({measure}: MeasureInputProps) => {

    const [value, setValue] = useState<number | undefined>(undefined);

    useEffect(() => {
        (async function () {
            setValue(measure.value);
        })();
    }, [])

    function checked(): boolean {
        return value !== undefined && value > 0;
    };

    return (
        <>
            <IonCol size={checkColSize}>
                <IonCheckbox
                    checked={checked()}
                    onIonChange={e => {
                        console.log("MeasureInput onIonChange" + e.toString());
                        const value = e.detail.checked ? 1 : 0
                        updateValue(measure, value);
                        setValue(value);
                    }}
                />
            </IonCol>
        </>
    );
};

export default MeasureInput;
