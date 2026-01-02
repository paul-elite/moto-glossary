import React from 'react';
import GlossaryItem from './GlossaryItem';

type GlossaryEntry = {
  title: string;
  description: string;
  rules: string;
};

type GlossaryListProps = {
  entries: GlossaryEntry[];
};

const GlossaryList: React.FC<GlossaryListProps> = ({ entries }) => {
  return (
    <div>
      <h2>Glossary</h2>
      <ul>
        {entries.map((entry, index) => (
          <li key={index}>
            <GlossaryItem 
              title={entry.title} 
              description={entry.description} 
              rules={entry.rules} 
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GlossaryList;