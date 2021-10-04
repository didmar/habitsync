import HabitListItem from '../components/HabitListItem';
import {useState} from 'react';
import {getHabits, Habit} from '../data/habits';
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
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
    setTimeout(() => {
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

        <IonList>
          {habits.map(h => <HabitListItem key={h.id} habit={h} />)}
        </IonList>

      </IonContent>
    </IonPage>
  );
};

export default Home;
