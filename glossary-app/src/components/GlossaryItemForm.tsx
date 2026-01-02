import React, { useState } from 'react';
import { GlossaryEntry } from '../types';

interface GlossaryItemFormProps {
  onAddItem: (item: GlossaryEntry) => void;
}

const GlossaryItemForm: React.FC<GlossaryItemFormProps> = ({ onAddItem }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [rules, setRules] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: GlossaryEntry = {
      title,
      description,
      rules,
    };
    onAddItem(newItem);
    setTitle('');
    setDescription('');
    setRules('');
  };

  return (
    <form onSubmit={handleSubmit} className="glossary-item-form">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="rules">Rules:</label>
        <textarea
          id="rules"
          value={rules}
          onChange={(e) => setRules(e.target.value)}
          required
        />
      </div>
      <button type="submit">Add Item</button>
    </form>
  );
};

export default GlossaryItemForm;