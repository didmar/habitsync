import {
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
    IonToolbar,
} from '@ionic/react';
import React, {useState} from "react";
import {arrowBack, checkmarkCircleOutline, save, timer} from "ionicons/icons";
import {Habit, MeasureType} from "../data/habits";
import {InputChangeEventDetail, SegmentChangeEventDetail} from "@ionic/core";

interface EditHabitModalProps {
    initialHabit: Habit;
    isOpen: boolean;
    onClose: (editedHabit?: Habit) => void;
}

export const EditHabitModal: React.FunctionComponent<EditHabitModalProps> = ({initialHabit, isOpen, onClose}: EditHabitModalProps) => {
    const [habit, setHabit] = useState<Habit>(initialHabit)

    function onNameInput(e: CustomEvent<InputChangeEventDetail>) {
        setHabit(new Habit(habit.id, e.detail.value!, habit.measureType));
    }

    function onMeasureTypeChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const newValue: string = e.detail.value!
        const newMes: MeasureType = MeasureType[newValue as keyof typeof MeasureType]
        setHabit(new Habit(habit.id, habit.description, newMes))
    }

    return (
        <>
            <IonModal
                isOpen={isOpen}
                cssClass='my-custom-class'
                onDidDismiss={e => onClose(undefined)}>

                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonButton onClick={ e => onClose(undefined) }>
                                <IonIcon icon={arrowBack}/>
                            </IonButton>
                        </IonButtons>
                        <IonTitle>
                            Create new habit
                        </IonTitle>
                        <IonButtons slot="end">
                            <IonButton shape="round" fill="outline" onClick={ e => onClose(habit) }>
                                <IonIcon slot="start" icon={save}/>
                                Save
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonList  className="ion-padding">
                        <IonItem>
                            <IonLabel>Name:</IonLabel>
                            <IonInput
                                color="primary"
                                value={habit.description}
                                placeholder="Describe your new habit"
                                onIonChange={onNameInput}
                                />
                        </IonItem>
                        <IonSegment
                            onIonChange={onMeasureTypeChange}
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
                            <IonInput
                                disabled={habit.measureType === MeasureType.binary}
                                color="primary"
                                placeholder="mins, hrs, kms, ..."/>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Daily target:</IonLabel>
                            <IonInput
                                disabled={habit.measureType === MeasureType.binary}
                                color="primary"
                                placeholder="How many units to do to validate the habit on a given day"/>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    )
}