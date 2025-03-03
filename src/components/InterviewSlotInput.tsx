import React from 'react';

interface InterviewSlotInputProps {
  id: string;
  label: string;
  value: string[];
  slots: Array<{ InterviewSlotID: number; InterviewSlotName: string }>;
  onChange: (slots: string[]) => void;
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
    const selectedSlot = e.target.value;
    if (selectedSlot && !value.includes(selectedSlot)) {
      if (value.length < maxSlots) {
        onChange([...value, selectedSlot]);
      }
    }
  };

  const removeSlot = (slotToRemove: string) => {
    onChange(value.filter(slot => slot !== slotToRemove));
  };

  return (
    <div className="form-group">
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
            .filter(slot => !value.includes(slot.InterviewSlotName))
            .map(slot => (
              <option key={slot.InterviewSlotID} value={slot.InterviewSlotName}>
                {slot.InterviewSlotName}
              </option>
            ))}
        </select>
        <div className="selected-slots">
          {value.map(slotName => {
            const slot = slots.find(s => s.InterviewSlotName === slotName);
            return (
              <div key={slotName} className="selected-slot">
                <span>{slot?.InterviewSlotName}</span>
                <button
                  type="button"
                  onClick={() => removeSlot(slotName)}
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