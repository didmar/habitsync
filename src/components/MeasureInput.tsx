import {IonCheckbox, IonCol, IonIcon, IonLabel, useIonModal} from '@ionic/react';
import {Measure, MeasureKind, MeasureType, updateMeasureValue} from '../data/habits';
import React, {useEffect, useState} from "react";
import {InputQuantiModal} from './InputQuantiModal'
import {help} from "ionicons/icons";

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

    /**
     * Modal to set the value in the "quanti" case
     */
    const handleDismiss = () => {
        dismiss();
    };
    const handleSetValue = (newValue: number) => {
        updateMeasureValue(measure, newValue).then(() => setValue(newValue))
    }
    const [present, dismiss] = useIonModal(InputQuantiModal, {
        onDismiss: handleDismiss,
        onConfirm: handleSetValue,
    });

    function formatQuanti(value: number, name: string) {
        if (name === "seconds") {
            return Math.round(value).toString() + "s"
        }
        if (name === "minutes") {
            if(value >= 600) {
                // 1200 => 20h
                return Math.floor(value / 60).toString() + "h"
            }
            if(value >= 60) {
                // 68 => 1h08
                return Math.floor(value / 60).toString() + "h" + (value % 60).toString().padStart(2, "0") + "m"
            }
            // 12.3 => 12.3m
            return value.toString() + "m"
        }
        if (name === "meters") {
            if(value >= 1000) {
                // 3100 => 3.1km
                return (value / 1000).toString() + "km"
            }
            // 100 => 100m
            return Math.round(value).toString() + "m"
        }
        if (name === "kilometers") {
            if(value >= 10) {
                // 13700 => 14km
                return Math.round(value).toString() + "km"
            }
            // 2.2 => 2.2km
            return value.toString() + "km"
        }
        if (value >= 1_000_000) {
            // 1000000 => 1M
            return Math.round(value / 1_000_000) + "M"
        }
        if (value >= 10_000) {
            // 22800 => 23K
            return Math.round(value / 1_000) + "K"
        }
        if (value >= 1_000) {
            // 1500 => 1.5K
            return (value / 1_000) + "K"
        }
        return value.toString()
    }

    var checker;
    if (measureType.kind === MeasureKind.binary) {
        checker =
            <>{
                value === undefined ?
                    <IonIcon
                        icon={help}
                        onClick={e => {
                            const newValue = 1  // ticked
                            updateMeasureValue(measure, newValue).then(() => setValue(newValue))
                        }}
                    />
                    :
                    <IonCheckbox
                        checked={value > 0}
                        onIonChange={e => {
                            const newValue = e.detail.checked ? 1 : 0
                            updateMeasureValue(measure, newValue).then(() => setValue(newValue))
                        }}
                    />
            }
            </>
    } else {
        const fmtValue = value === undefined ? "?" : formatQuanti(value, measureType.unit!)
        checker = <IonLabel onClick={ () => present({}) }>{fmtValue}</IonLabel>;
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
