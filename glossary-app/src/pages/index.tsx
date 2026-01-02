import React, { useState, useEffect } from 'react';
import GlossaryList from '../components/GlossaryList';
import GlossaryItemForm from '../components/GlossaryItemForm';
import { GlossaryEntry } from '../types';

const IndexPage: React.FC = () => {
  const [glossaryItems, setGlossaryItems] = useState<GlossaryEntry[]>([]);

  useEffect(() => {
    const storedItems = localStorage.getItem('glossaryItems');
    if (storedItems) {
      setGlossaryItems(JSON.parse(storedItems));
    }
  }, []);

  const addGlossaryItem = (item: GlossaryEntry) => {
    const updatedItems = [...glossaryItems, item];
    setGlossaryItems(updatedItems);
    localStorage.setItem('glossaryItems', JSON.stringify(updatedItems));
  };

  return (
    <div>
      <h1>Glossary Application</h1>
      <GlossaryItemForm onAddItem={addGlossaryItem} />
      <GlossaryList items={glossaryItems} />
    </div>
  );
};

export default IndexPage;