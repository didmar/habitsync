import {IonCheckbox, IonCol} from '@ionic/react';
import {Measure, updateChecked} from '../data/habits';
import React from "react";

interface MeasureInputProps {
  key: number;
  measure: Measure;
}

export const habitDescColSize = "6"
export const checkColSize = "2"

const MeasureInput: React.FC<MeasureInputProps> = ({ key, measure }) => {
  return (
      <IonCol key={key} size={checkColSize}>
          <IonCheckbox
              checked={measure.value !== undefined && measure.value > 0}
              onIonChange={e => updateChecked(measure, e.detail.checked)}/>
      </IonCol>
  );
};

export default MeasureInput;
