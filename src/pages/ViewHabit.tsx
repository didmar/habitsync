/**
 * View the details for the selected habit
 */
import React, {useState} from 'react';
import {deleteHabit, getHabit, Habit} from '../data/habits';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonRouter,
    useIonViewWillEnter,
} from '@ionic/react';
import {useParams} from 'react-router';
import './ViewHabit.css';
import {create, trash} from "ionicons/icons";

function ViewHabit() {
  const params = useParams<{ id: string }>();
  const [habit, setHabit] = useState<Habit | undefined | null>(null);

  const router = useIonRouter();

  useIonViewWillEnter(async () => {
    const msg = await getHabit(params.id);
    setHabit(msg);
  });

  return (
    <IonPage id="view-habit-page">
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>{habit ? habit.description : ""}</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home"></IonBackButton>
          </IonButtons>
          {habit && (
          <IonButtons slot="end">
            <IonButton onClick={ e => console.log(e) }>
              <IonIcon icon={create}/>
            </IonButton>
            <IonButton onClick={ e => {
                deleteHabit(habit.id)
                router.goBack();
            }}>
              <IonIcon icon={trash}/>
            </IonButton>
          </IonButtons>)}
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
            habit === null ? (<div>Loading...</div>)  : (<div>Not found</div>)
        )}
      </IonContent>
    </IonPage>
  );
}

export default ViewHabit;
