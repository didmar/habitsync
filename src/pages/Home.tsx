import HabitListItem, {checkColSize, habitDescColSize} from '../components/HabitListItem';
import {useState} from 'react';
import {getHabits, Habit} from '../data/habits';
import {
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import './Home.css';

const dateDisplayFormat = "DDD D"

const Home: React.FC = () => {

  const [habits, setHabits] = useState<Habit[]>([]);

  const [dates, setDates] = useState<Date[]>([]);

  const updateDates = () => {
    const now = Date.now();
    setDates([0, 1, 2].map(i => new Date(now - 86400000 * i)))
  }

  const updateHabits = async () => {
    const hbts: Habit[] = await getHabits();
    console.log(hbts);
    setHabits(hbts);
  }

  const updateEverything = async () => {
    updateHabits();
    updateDates();
  }

  useIonViewWillEnter(updateEverything);

  const refresh = async (e: CustomEvent) => {
    console.log("Begin refresh")

    updateEverything()

    setTimeout(() => {
      e.detail.complete();
      console.log("Completed refresh");
    }, 2000);
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
              <IonCol size={habitDescColSize}/>
              {
                dates.map(d =>
                  <IonCol key={dates.indexOf(d)}  size={checkColSize}>
                    <IonDatetime displayFormat={dateDisplayFormat} value={d.toISOString()} display-timezone="utc"/>
                  </IonCol>
                )
              }
            </IonRow>
            {habits.map(h => <HabitListItem key={h.id} habit={h} dates={dates}/>)}
          </IonGrid>

        </IonContent>
      </IonPage>
  );
};

export default Home;
