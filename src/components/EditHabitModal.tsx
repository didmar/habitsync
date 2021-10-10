import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSegment,
    IonSegmentButton,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import React, {useState} from "react";
import {arrowBack, checkmarkCircleOutline, timer} from "ionicons/icons";
import {Habit, MeasureType} from "../data/habits";

interface EditHabitModalProps {
    initialHabit: Habit;
    isOpen: boolean;
    onClose: (editedHabit?: Habit) => void;
}

export const EditHabitModal: React.FunctionComponent<EditHabitModalProps> = ({initialHabit, isOpen, onClose}: EditHabitModalProps) => {
    const [habit, setHabit] = useState<Habit>(initialHabit)
    return (
        <>
            <IonModal
                isOpen={isOpen}
                cssClass='my-custom-class'
                onDidDismiss={e => onClose(undefined)}>
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonBackButton text="buttonText" icon={arrowBack} />
                        </IonButtons>
                        <IonTitle>
                            Create new habit
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonList>
                        <IonItem>
                            <IonLabel>Name:</IonLabel>
                            <IonInput
                                color="primary"
                                value={habit.description}
                                onIonChange={e => setHabit(new Habit(habit.id, e.detail.value!, habit.measureType))}
                                />
                        </IonItem>
                        <IonSegment
                            onIonChange={e => {
                                const newValue: string = e.detail.value!
                                const newMes: MeasureType = MeasureType[newValue as keyof typeof MeasureType]
                                setHabit(new Habit(habit.id, habit.description, newMes))
                            }}
                            value={habit.measureType.toString()}>
                            <IonSegmentButton value={MeasureType.binary}>
                                <IonIcon icon={checkmarkCircleOutline}/>
                                <IonLabel>Binary</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value={MeasureType.quanti}>
                                <IonIcon icon={timer}/>
                                <IonLabel>Quantifiable</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <IonItem>
                            <IonLabel>Unit:</IonLabel>
                            <IonInput color="primary"/>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Daily target:</IonLabel>
                            <IonInput color="primary"/>
                        </IonItem>

                        <IonItem>
                            <IonButton onClick={e => onClose(undefined)}>Cancel</IonButton>
                            <IonButton onClick={e => onClose(habit)}>Add</IonButton>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    )
}