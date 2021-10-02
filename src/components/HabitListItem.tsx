import {IonCheckbox, IonItem, IonLabel} from '@ionic/react';
import {Habit, updateChecked} from '../data/habits';
import './HabitListItem.css';
import React from "react";

interface HabitListItemProps {
  habit: Habit;
}

const HabitListItem: React.FC<HabitListItemProps> = ({ habit }) => {
  return (
    <div>
        <IonCheckbox checked={habit.checked} onIonChange={e => updateChecked(habit.id, e.detail.checked)}/>
        <IonItem routerLink={`/habit/${habit.id}`} detail={true}>
        <IonLabel>
          {habit.description}
        </IonLabel>
      </IonItem>
    </div>
  );
};

export default HabitListItem;
