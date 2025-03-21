import React, { useState } from 'react';
import { generatePathway } from '../api'; // Replace with your actual API function

const InputForm = ({ setPathway }) => {
    const [technology, setTechnology] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!technology.trim()) {
            setError('Please enter a technology name.');
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            const response = await generatePathway(technology);

            if (response && Array.isArray(response.data.pathway)) {
                setPathway(response.data.pathway);
            } else {
                setError('Unexpected data format from API.');
            }
        } catch (err) {
            setError('Failed to generate pathway. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="input-form">
            <input
                type="text"
                placeholder="Enter technology"
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                className="form-input"
            />
            <button type="submit" disabled={isLoading} className="form-button">
                {isLoading ? 'Generating...' : 'Generate Pathway'}
            </button>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
};

export default InputForm;
