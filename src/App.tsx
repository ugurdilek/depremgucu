import React, { useState } from 'react';

const FloatInput: React.FC = () => {
    const [value, setValue] = useState<number | ''>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        if (input === '') {
            setValue('');
        } else {
            const parsed = parseFloat(input);
            if (!isNaN(parsed)) {
                setValue(parsed);
            }
        }
    };

    return (
        <div>
            <input
                type="number"
                step="any"
                value={value}
                onChange={handleChange}
                placeholder="Float sayı girin"
                style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
        </div>
    );
};

export default FloatInput;
