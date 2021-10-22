import HabitListItem, {checkColSize, habitDescColSize} from '../components/HabitListItem';
import React, {useState} from 'react';
import {addHabit, getHabits, Habit, MeasureKind, MeasureType, Period, Target, updateHabitsOrder} from '../data/habits';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonLabel,
    IonList,
    IonPage,
    IonRefresher,
    IonRefresherContent,
    IonReorderGroup,
    IonRow,
    IonTitle,
    IonToolbar,
    useIonViewWillEnter
} from '@ionic/react';
import './Home.css';
import {EditHabitModal} from "../components/EditHabitModal";
import {add, reorderFourOutline} from "ionicons/icons";
import { ItemReorderEventDetail } from '@ionic/core';

const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

const Home: React.FunctionComponent = () => {

    const [habits, setHabits] = useState<Habit[]>([]);

    const [dates, setDates] = useState<Date[]>([]);

    const [reorderMode, setReorderMode] = useState<boolean>(false);

    // State to trigger the update of the measures in sub-components when refreshing
    const [refreshDate, setRefreshDate] = useState<number>(Date.now());

    const updateDates = () => {
        const now = Date.now();
        setDates([0, 1, 2].map(i => new Date(now - 86400000 * i)))
    }

    const updateHabits = async () => {
        const hbts: Habit[] = await getHabits();
        hbts.sort(compareHabits)
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
    const defaultTarget = new Target(1, Period.day, undefined, undefined)
    const defaultHabit = new Habit("dummy", "", defaultMeasureType, defaultTarget, 0)
    const onHabitEditModalClose = async (editedHabit?: Habit) => {
        setHabitEditModal({ isOpen: false })
        if(editedHabit !== undefined) {
            const newHabit = await addHabit(editedHabit)
            newHabit.order = habits.length;
            setHabits(currentHabits => [...currentHabits, newHabit]);
        }
    }

    function doReorder(event: CustomEvent<ItemReorderEventDetail>) {
        //console.log('Dragged from index', event.detail.from, 'to', event.detail.to);

        const length = habits.length
        for (var i = 0, cpt = 0; i < length; i++) {
            if(i != event.detail.from && i != event.detail.to) {
                habits[i].order = cpt
                cpt++;
            } else if (i == event.detail.from) {
                habits[i].order = event.detail.to
            } else if (i == event.detail.to) {
                if(event.detail.to < event.detail.from) {
                    cpt ++;
                }
                habits[i].order = cpt
                cpt++;
                if(event.detail.to > event.detail.from) {
                    cpt ++;
                }
            }
        }

        //for (var i = 0, cpt = 0; i < length; i++) {
        //    console.log("- " + habits[i].description + " -> " + habits[i].order.toString())
        //}

        updateHabitsOrder(habits)
        habits.sort(compareHabits)

        event.detail.complete();
    }

    function compareHabits(habit1: Habit, habit2: Habit): number {
        if(habit1.order < habit2.order) {
            return -1
        } else if (habit1.order == habit2.order) {
            return 0
        } else {
            return 1
        }
    };

    return (
        <IonPage id="home-page" color="primary">
            <IonHeader>
                <IonToolbar>
                    <IonRow class="ion-align-items-center">
                        <IonCol size={parseInt(habitDescColSize).toString()}>
                            <IonButtons>
                                <IonButton onClick={() => setHabitEditModal({ isOpen: true})}>
                                    <IonIcon icon={add}/>
                                </IonButton>
                                <IonButton onClick={() => setReorderMode(! reorderMode)}>
                                    <IonIcon icon={reorderFourOutline}/>
                                </IonButton>
                                &ensp;
                                <IonLabel>Habits</IonLabel>
                            </IonButtons>
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

                <IonList>
                    <span key={refreshDate}>
                        <IonReorderGroup disabled={! reorderMode} onIonItemReorder={doReorder}>
                            {habits.map(h => <HabitListItem habit={h} dates={dates}/>)}
                        </IonReorderGroup>
                    </span>
                </IonList>
            </IonContent>
        </IonPage>
    );
};

export default Home;
