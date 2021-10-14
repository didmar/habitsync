import HabitListItem, {checkColSize, habitDescColSize} from '../components/HabitListItem';
import React, {useState} from 'react';
import {addHabit, getHabits, Habit, MeasureKind, MeasureType} from '../data/habits';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonLabel,
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

const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const Home: React.FunctionComponent = () => {

    const [habits, setHabits] = useState<Habit[]>([]);

    const [dates, setDates] = useState<Date[]>([]);

    // State to trigger the update of the measures in sub-components when refreshing
    const [refreshDate, setRefreshDate] = useState<number>(Date.now());

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
        setRefreshDate(Date.now());  // Trigger measures update
    }

    useIonViewWillEnter(updateEverything);

    const refresh = async (e: CustomEvent) => {
        console.log("Begin refresh")

        await updateEverything()

        setTimeout(() => {
            e.detail.complete();
            console.log("Completed refresh");
        }, 2000);
    };

    const [habitEditModal, setHabitEditModal] = useState({isOpen: false});
    const defaultMeasureType = new MeasureType(MeasureKind.binary, undefined)
    const defaultHabit = new Habit("dummy", "", defaultMeasureType)
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
                    <IonRow class="ion-align-items-center">
                        <IonCol size={"1"}>
                            <IonButtons>
                                <IonButton onClick={() => setHabitEditModal({ isOpen: true})}>
                                    <IonIcon icon={add}/>
                                </IonButton>
                            </IonButtons>
                        </IonCol>
                        <IonCol size={(parseInt(habitDescColSize) - 1).toString()}>

                            <IonTitle>Habits</IonTitle>
                        </IonCol>
                        {
                            dates.map(d =>
                                <IonCol size={checkColSize}>
                                    <IonLabel>
                                        {weekDays[d.getDay()]}<br/>{d.getDate()}
                                    </IonLabel>
                                </IonCol>
                            )
                        }
                    </IonRow>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={refresh}>
                    <IonRefresherContent/>
                </IonRefresher>

                <EditHabitModal
                    initialHabit={defaultHabit}
                    isOpen={habitEditModal.isOpen}
                    onClose={onHabitEditModalClose}/>

                <IonGrid>
                    <span key={refreshDate}>
                        {habits.map(h => <HabitListItem habit={h} dates={dates}/>)}
                    </span>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Home;
