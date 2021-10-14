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
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useState} from "react";
import {arrowBack, checkmarkCircleOutline, save, timer} from "ionicons/icons";
import {Habit, MeasureKind, MeasureType, units} from "../data/habits";
import {InputChangeEventDetail, SegmentChangeEventDetail, SelectChangeEventDetail} from "@ionic/core";

interface EditHabitModalProps {
    initialHabit: Habit;
    isOpen: boolean;
    onClose: (editedHabit?: Habit) => void;
}

export const EditHabitModal: React.FunctionComponent<EditHabitModalProps> = ({initialHabit, isOpen, onClose}: EditHabitModalProps) => {
    const [habit, setHabit] = useState<Habit>(initialHabit)
    // const [unit, setUnit] = useState<string | undefined>("other")

    function onNameInput(e: CustomEvent<InputChangeEventDetail>) {
        setHabit(new Habit(habit.id, e.detail.value!, habit.measureType));
    }

    function onMeasureKindChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const newValue: string = e.detail.value!
        const kind: MeasureKind = MeasureKind[newValue as keyof typeof MeasureKind]
        const unit = kind === MeasureKind.binary ? undefined : "other"
        const newMes: MeasureType = new MeasureType(kind, unit)
        setHabit(new Habit(habit.id, habit.description, newMes))
    }

    function onSelectChange(e:  CustomEvent<SelectChangeEventDetail>) {
        const newUnit = e.detail.value!
        setHabit(new Habit(habit.id, habit.description, new MeasureType(MeasureKind.quanti, newUnit)))
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
                            onIonChange={onMeasureKindChange}
                            value={habit.measureType.kind.toString()}>
                            <IonSegmentButton value={MeasureKind.binary}>
                                <IonIcon icon={checkmarkCircleOutline}/>
                                <IonLabel>Binary</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value={MeasureKind.quanti}>
                                <IonIcon icon={timer}/>
                                <IonLabel>Quantifiable</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <IonItem disabled={habit.measureType.kind === MeasureKind.binary}>
                            <IonLabel>Unit:</IonLabel>
                            <IonSelect value={habit.measureType.unit} onIonChange={onSelectChange}>
                                {units.map(unitDef => (
                                    <IonSelectOption key={units.indexOf(unitDef)} value={unitDef.name}>
                                        {unitDef.name} {unitDef.suffix ? "(" + unitDef.suffix + ")" : ""}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Daily target:</IonLabel>
                            <IonInput
                                color="primary"
                                placeholder="How many units to do to validate the habit on a given day"/>
                        </IonItem>
                    </IonList>
                </IonContent>
            </IonModal>
        </>
    )
}