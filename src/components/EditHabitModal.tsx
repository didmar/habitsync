import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonItemDivider,
    IonLabel,
    IonList,
    IonModal,
    IonRow,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import React, {useState} from "react";
import {arrowBack, checkmarkCircleOutline, save, timer} from "ionicons/icons";
import {Habit, MeasureKind, MeasureType, Period, periods, Target, units, unitsMap} from "../data/habits";
import {InputChangeEventDetail, SegmentChangeEventDetail, SelectChangeEventDetail} from "@ionic/core";

interface EditHabitModalProps {
    initialHabit: Habit;
    isOpen: boolean;
    onClose: (editedHabit?: Habit) => void;
}

export const EditHabitModal: React.FunctionComponent<EditHabitModalProps> = ({initialHabit, isOpen, onClose}: EditHabitModalProps) => {
    const [habit, setHabit] = useState<Habit>(initialHabit)

    function onNameInput(e: CustomEvent<InputChangeEventDetail>) {
        setHabit(new Habit(habit.id, e.detail.value!, habit.measureType, habit.target));
    }

    function onMeasureKindChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const newValue: string = e.detail.value!
        const kind: MeasureKind = MeasureKind[newValue as keyof typeof MeasureKind]
        const unit = kind === MeasureKind.binary ? undefined : "other"
        const newMes: MeasureType = new MeasureType(kind, unit)
        setHabit(new Habit(habit.id, habit.description, newMes, habit.target))
    }

    function onUnitSelect(e:  CustomEvent<SelectChangeEventDetail>) {
        let newUnit = e.detail.value!
        if(newUnit === null || newUnit === undefined) {
            return
        }
        if(newUnit !== habit.measureType.unit) {
            setHabit(new Habit(
                habit.id,
                habit.description,
                new MeasureType(MeasureKind.quanti, newUnit),
                habit.target,
            ))
        }
    }

    function updateTarget(gte: number, period: Period, every: number | undefined, times: number | undefined) {
        const newTarget = new Target(gte, period, every, times)
        setHabit(new Habit(habit.id, habit.description, habit.measureType, newTarget));
    }

    function onDailyTargetInput(e: CustomEvent<InputChangeEventDetail>) {
        updateTarget(parseInt(e.detail.value!), habit.target.period, habit.target.every, habit.target.times)
    }

    function onPeriodChange(e: CustomEvent<SegmentChangeEventDetail>) {
        const period: Period = Period[e.detail.value! as keyof typeof Period]
        updateTarget(habit.target.gte, period, habit.target.every, habit.target.times)
    }

    function onEveryChange(e: CustomEvent<InputChangeEventDetail>) {
        const newEvery = e.detail.value ? parseInt(e.detail.value!) : undefined
        updateTarget(habit.target.gte, habit.target.period, newEvery, undefined)
    }

    function onTimesChange(e: CustomEvent<InputChangeEventDetail>) {
        const newTimes = e.detail.value ? parseInt(e.detail.value!) : undefined
        updateTarget(habit.target.gte, habit.target.period, undefined, newTimes)
    }

    const onCancel = () => {
        onClose(undefined)
        setHabit(initialHabit)  // reset for next time with open the modal
    }

    const onConfirm = () => {
        onClose(habit)
        setHabit(initialHabit)  // reset for next time with open the modal
    }

    const repeatLabel = (
        (habit.target.every ? (
            "Every " + (habit.target.every > 1 ? habit.target.every.toString() + " " : "")
        ) : (
            habit.target.times ? habit.target.times + " times a " : "Once a "
        )) + habit.target.period.toString() + "(s)"
    );

    return (<>
        <IonModal
            isOpen={isOpen}
            cssClass='my-custom-class'
            onDidDismiss={onCancel}>

            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonButton onClick={onCancel}>
                            <IonIcon icon={arrowBack}/>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>
                        Create new habit
                    </IonTitle>
                    <IonButtons slot="end">
                        <IonButton shape="round" fill="outline" onClick={onConfirm}>
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

                    <IonGrid><IonRow>
                        <IonCol size={"6"}>
                            <IonItem>
                            <IonLabel>Target:</IonLabel>
                            <IonInput
                                    onIonChange={onDailyTargetInput}
                                    value={habit.target.gte}
                                    color="primary"
                                    placeholder="How many units to do to validate the habit on a given day"/>
                            </IonItem>
                        </IonCol>
                        <IonCol size={"6"}>
                            <IonItem>
                                <IonLabel>Unit:</IonLabel>
                                <IonSelect value={habit.measureType.unit} onIonChange={onUnitSelect} disabled={habit.measureType.kind === MeasureKind.binary}>
                                    {units.map( name => {
                                        const suffix = unitsMap.get(name);
                                        return (
                                            <IonSelectOption key={units.indexOf(name)} value={name}>
                                                {name} {suffix ? "(" + suffix + ")" : ""}
                                            </IonSelectOption>
                                        )
                                    })}
                                </IonSelect>
                            </IonItem>
                        </IonCol>
                    </IonRow></IonGrid>

                    <IonItemDivider>
                        <IonLabel color={"primary"}>Must reach target: <b>{repeatLabel}</b></IonLabel>
                    </IonItemDivider>

                    <IonItem>
                        <IonLabel>Period:</IonLabel>
                        <IonSelect value={habit.target.period}
                                   onIonChange={onPeriodChange}>
                            {periods.map( period => {
                                const key = periods.indexOf(period);
                                return (
                                    <IonSelectOption key={key} value={period}>
                                        {period}
                                    </IonSelectOption>
                                )
                            })}
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Every:</IonLabel>
                        <IonInput
                            onIonChange={onEveryChange}
                            value={habit.target.every}
                        />
                    </IonItem>

                    <IonItem>
                        <IonLabel>Times:</IonLabel>
                        <IonInput
                            onIonChange={onTimesChange}
                            value={habit.target.times}
                        />
                    </IonItem>

                </IonList>
            </IonContent>
        </IonModal>
    </>)
}