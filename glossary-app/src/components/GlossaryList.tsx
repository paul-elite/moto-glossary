import React from 'react';
import GlossaryItem from './GlossaryItem';

import { GlossaryEntry } from '../types';

type GlossaryListProps = {
  items: GlossaryEntry[];
};

const GlossaryList: React.FC<GlossaryListProps> = ({ items }) => {
  return (
    <div>
      <h2>Glossary</h2>
      <ul>
        {items.map((entry, index) => (
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