import React from 'react';

type GlossaryItemProps = {
  title: string;
  description: string;
  rules: string;
};

const GlossaryItem: React.FC<GlossaryItemProps> = ({ title, description, rules }) => {
  return (
    <div className="glossary-item">
      <h3 className="glossary-item-title">{title}</h3>
      <p className="glossary-item-description">{description}</p>
      <p className="glossary-item-rules"><strong>Rules:</strong> {rules}</p>
    </div>
  );
};

export default GlossaryItem;