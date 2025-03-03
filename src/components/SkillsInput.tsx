import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface Skill {
  SkillID: number;
  SkillName: string;
}

interface SkillsInputProps {
  id: string;
  label: string;
  value: string[];
  onChange: (skills: string[]) => void;
  maxSkills?: number;
  disabledSkills?: string[];
}

const SkillsInput: React.FC<SkillsInputProps> = ({
  id,
  label,
  value,
  onChange,
  maxSkills = 10,
  disabledSkills = []
}) => {
  const { token } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [otherSkill, setOtherSkill] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSkills = async () => {
      if (!inputValue || !showSuggestions) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/skills?search=${inputValue}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to fetch skills');
        }

        setSuggestions(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSkills, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, token, showSuggestions]);

  const handleAddSkill = (skillName: string) => {
    if (maxSkills && value.length >= maxSkills) {
      setError(`Maximum ${maxSkills} skills allowed`);
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    if (!value.includes(skillName) && !disabledSkills.includes(skillName)) {
      onChange([...value, skillName]);
    }
    setInputValue('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleAddOtherSkill = () => {
    if (!otherSkill.trim()) return;
    
    handleAddSkill(otherSkill.trim());
    setOtherSkill('');
    setShowOtherInput(false);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    onChange(value.filter(skill => skill !== skillToRemove));
    setError('');
  };

  const handleInputFocus = () => {
    setError('');
    setShowSuggestions(true);
  };

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="skills-input-wrapper">
        <div className="skills-input-container">
          <div className="input-with-suggestions">
            <input
              type="text"
              id={id}
              className="form-control"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              onFocus={handleInputFocus}
              placeholder="Type to search skills..."
            />
            {showSuggestions && !error && (inputValue || isLoading) && (
              <div className="suggestions-container">
                {isLoading && <div className="text-muted">Loading...</div>}
                {!isLoading && suggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {suggestions.map((skill) => (
                      <li
                        key={skill.SkillID}
                        className={`suggestion-item ${
                          value.includes(skill.SkillName) || disabledSkills.includes(skill.SkillName)
                            ? 'disabled'
                            : ''
                        }`}
                        onClick={() => !value.includes(skill.SkillName) && handleAddSkill(skill.SkillName)}
                      >
                        {skill.SkillName}
                      </li>
                    ))}
                    <li
                      className="suggestion-item other-option"
                      onClick={() => {
                        setShowOtherInput(true);
                        setInputValue('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      + Add Other Skill
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>

          {showOtherInput && (
            <div className="other-skill-input">
              <input
                type="text"
                className="form-control"
                value={otherSkill}
                onChange={(e) => setOtherSkill(e.target.value)}
                placeholder="Enter custom skill"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleAddOtherSkill}
              >
                Add
              </button>
            </div>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="selected-skills">
          {value.map((skill) => (
            <span key={skill} className="skill-tag">
              {skill}
              <button
                type="button"
                className="remove-skill"
                onClick={() => handleRemoveSkill(skill)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsInput; 