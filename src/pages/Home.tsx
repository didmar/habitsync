import HabitListItem, {checkColSize, habitDescColSize} from '../components/HabitListItem';
import React, {useState} from 'react';
import {addHabit, getHabits, Habit, MeasureType} from '../data/habits';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonDatetime,
    IonGrid,
    IonHeader,
    IonIcon,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonRow,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import {EditHabitModal} from "../components/EditHabitModal";
import {add} from "ionicons/icons";

const dateDisplayFormat = "DDD D"

const Home: React.FunctionComponent = () => {

    const [habits, setHabits] = useState<Habit[]>([]);

    const [dates, setDates] = useState<Date[]>([]);

    const updateDates = () => {
        const now = Date.now();
        setDates([0, 1, 2].map(i => new Date(now - 86400000 * i)))
    }

    const updateHabits = async () => {
        const hbts: Habit[] = await getHabits();
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

    const [habitEditModal, setHabitEditModal] = useState({isOpen: false});
    const defaultHabit = new Habit("dummy", "", MeasureType.binary)
    const onHabitEditModalClose = async (editedHabit?: Habit) => {
        setHabitEditModal({ isOpen: false })
        if(editedHabit !== undefined) {
            const newHabit = await addHabit(editedHabit)
            setHabits(currentHabits => [...currentHabits, newHabit]);
        }
    }

    return (
        <IonPage id="home-page" color="primary">
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Habits</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={() => setHabitEditModal({ isOpen: true})}>
                            <IonIcon icon={add}/>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent/>
                </IonRefresher>

                <EditHabitModal
                    initialHabit={defaultHabit}
                    isOpen={habitEditModal.isOpen}
                    onClose={onHabitEditModalClose}/>

                <IonGrid>
                    <IonRow>
                        <IonCol size={habitDescColSize}/>
                        {
                            dates.map(d =>
                                <IonCol size={checkColSize}>
                                    <IonDatetime displayFormat={dateDisplayFormat} value={d.toISOString()}
                                                 display-timezone="utc" disabled={true} />
                                </IonCol>
                            )
                        }
                    </IonRow>
                    {habits.map(h => <HabitListItem habit={h} dates={dates}/>)}
                </IonGrid>

            </IonContent>
        </IonPage>
    );
};

export default Home;
