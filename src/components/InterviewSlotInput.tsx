import React from 'react';

interface InterviewSlotInputProps {
  id: string;
  label: string;
  value: number[];
  slots: Array<{ InterviewSlotID: number; InterviewSlotName: string }>;
  onChange: (slots: number[]) => void;
  maxSlots?: number;
  minSlots?: number;
}

const InterviewSlotInput: React.FC<InterviewSlotInputProps> = ({
  id,
  label,
  value,
  slots,
  onChange,
  maxSlots = 3,
  minSlots = 3
}) => {
  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlotId = Number(e.target.value);
    if (selectedSlotId && !value.includes(selectedSlotId)) {
      if (value.length < maxSlots) {
        onChange([...value, selectedSlotId]);
      }
    }
  };

  const removeSlot = (slotToRemove: number) => {
    onChange(value.filter(slot => slot !== slotToRemove));
  };

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="slot-input-container">
        <select
          id={id}
          className="form-control"
          onChange={handleSlotChange}
          value=""
          disabled={value.length >= maxSlots}
        >
          <option value="">Select Interview Slot</option>
          {slots
            .filter(slot => !value.includes(slot.InterviewSlotID))
            .map(slot => (
              <option key={slot.InterviewSlotID} value={slot.InterviewSlotID}>
                {slot.InterviewSlotName}
              </option>
            ))}
        </select>
        <div className="selected-slots">
          {value.map(slotId => {
            const slot = slots.find(s => s.InterviewSlotID === slotId);
            return (
              <div key={slotId} className="selected-slot">
                <span>{slot?.InterviewSlotName}</span>
                <button
                  type="button"
                  onClick={() => removeSlot(slotId)}
                  className="remove-slot"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <div className="slots-info">
          {value.length} of {maxSlots} slots selected
          {value.length < minSlots && (
            <span className="slots-warning">
              (minimum {minSlots} required)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewSlotInput;