import {IonButton, IonCard, IonCol, IonLabel, IonRow} from '@ionic/react';
import {getMeasures, Habit, Measure} from '../data/habits';
import './HabitListItem.css';
import React, {useEffect, useState} from "react";
import MeasureInput from "./MeasureInput";

interface HabitListItemProps {
    habit: Habit;
    dates: Date[];
}

export const habitDescColSize = "6"
export const checkColSize = "2"

const HabitListItem: React.FunctionComponent<HabitListItemProps> = ({habit, dates}: HabitListItemProps) => {
    const [measures, setMeasures] = useState<Measure[]>([]);

    useEffect(() => {
        (async function () {
            // console.log("HabitListItem useEffect")
            const ms: Measure[] = await getMeasures(habit.id, dates);
            setMeasures(ms);
        })();
    }, [])

    return (
        <>
            <IonCard>
                <IonRow class="ion-align-items-center">
                    <IonCol size={habitDescColSize}>
                        <IonButton fill="clear" routerLink={`/habit/${habit.id}`}>
                            <IonLabel>{habit.description}</IonLabel>
                        </IonButton>
                    </IonCol>
                    {measures.map(m => <MeasureInput measureType={habit.measureType} measure={m}/>)}
                </IonRow>
            </IonCard>
        </>
    );
};

export default HabitListItem;
