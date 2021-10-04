/**
 * View the details for the selected habit
 */
import { useState } from 'react';
import { Habit, getHabit } from '../data/habits';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react';
import { useParams } from 'react-router';
import './ViewHabit.css';

function ViewHabit() {
  const [habit, setHabit] = useState<Habit>();
  const params = useParams<{ id: string }>();

  useIonViewWillEnter(async () => {
    const msg = await getHabit(params.id);
    setHabit(msg);
  });

  return (
    <IonPage id="view-habit-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Home" defaultHref="/home"></IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {habit ? (
          <>
            <IonItem>
              <div slot="start" className="dot dot-unread"></div>
              <IonLabel className="ion-text-wrap">
                <h2>
                  {habit.description}
                </h2>
              </IonLabel>
            </IonItem>
          </>
        ) : (
          <div>Not found</div>
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewHabit;
