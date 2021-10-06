import {IonButton, IonCheckbox, IonCol, IonIcon, IonItem, IonLabel, IonRouterLink, IonRow} from '@ionic/react';
import {Habit, updateChecked} from '../data/habits';
import './HabitListItem.css';
import React from "react";
import {settingsOutline} from "ionicons/icons";

interface HabitListItemProps {
  habit: Habit;
}

const HabitListItem: React.FC<HabitListItemProps> = ({ habit }) => {
  /**
   * Renders one habit from the list
   */
  return (
        <IonRow>
            <IonCol size="3">
                <IonLabel>
                    {habit.description}
                </IonLabel>
            </IonCol>
            <IonCol>
                <IonCheckbox checked={habit.checked} onIonChange={e => updateChecked(habit.id, e.detail.checked)}/>
            </IonCol>
            <IonCol>
                <IonCheckbox checked={habit.checked} onIonChange={e => updateChecked(habit.id, e.detail.checked)}/>
            </IonCol>
            <IonCol>
                <IonCheckbox checked={habit.checked} onIonChange={e => updateChecked(habit.id, e.detail.checked)}/>
            </IonCol>
            <IonCol size="1">
                <IonButton fill="clear" routerLink={`/habit/${habit.id}`}>
                    <IonIcon slot="icon-only" icon={settingsOutline}/>
                </IonButton>
            </IonCol>

        </IonRow>
  );
};

export default HabitListItem;
