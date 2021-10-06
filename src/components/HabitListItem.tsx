import {IonButton, IonCol, IonLabel, IonRow} from '@ionic/react';
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

const HabitListItem: React.FC<HabitListItemProps> = ({ habit , dates }) => {
  const [measures, setMeasures] = useState<Measure[]>([]);

  useEffect(() => {
      (async function() {
        const ms: Measure[] = await getMeasures(habit.id, dates);
        setMeasures(ms);
      })();
  }, [])

  return (
      <IonRow>
          <IonCol size={habitDescColSize}>
              <IonButton fill="clear" routerLink={`/habit/${habit.id}`}>
                  <IonLabel>{habit.description}</IonLabel>
              </IonButton>
          </IonCol>
          {measures.map(m => <MeasureInput key={measures.indexOf(m)} measure={m}/>)}
      </IonRow>
  );
};

export default HabitListItem;
