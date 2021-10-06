import HabitListItem from '../components/HabitListItem';
import React, {useState} from 'react';
import {getHabits, Habit} from '../data/habits';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent, IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {

  const [habits, setHabits] = useState<Habit[]>([]);

  useIonViewWillEnter( async () => {
    const hs = await getHabits()
    if(hs != undefined) {
      setHabits(hs);
    }
  });

  const refresh = (e: CustomEvent) => {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      e.detail.complete();
    }, 3000);
  };

  return (
    <IonPage id="home-page" color="primary">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Habits</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">
              Home
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            <IonCol size="3"/>
            <IonCol>
              D+0
            </IonCol>
            <IonCol>
              D-1
            </IonCol>
            <IonCol>
              D-2
            </IonCol>
            <IonCol size="1"/>
          </IonRow>
          {habits.map(h => <HabitListItem key={h.id} habit={h} />)}
        </IonGrid>

      </IonContent>
    </IonPage>
  );
};

export default Home;
