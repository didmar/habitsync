import { useState } from 'react';
import { Habit, getHabit } from '../data/habits';
import {
  IonCheckbox,
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
import { addCircle } from 'ionicons/icons';
import { useParams } from 'react-router';
import './ViewHabit.css';

function ViewHabit() {
  const [habit, setHabit] = useState<Habit>();
  const params = useParams<{ id: string }>();

  useIonViewWillEnter(() => {
    const msg = getHabit(parseInt(params.id, 10));
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
