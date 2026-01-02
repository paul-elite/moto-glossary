import { GlossaryEntry } from '../types';

const STORAGE_KEY = 'glossaryEntries';

export const saveGlossaryEntry = (entry: GlossaryEntry) => {
  const existingEntries = getGlossaryEntries();
  existingEntries.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existingEntries));
};

export const getGlossaryEntries = (): GlossaryEntry[] => {
  const entries = localStorage.getItem(STORAGE_KEY);
  return entries ? JSON.parse(entries) : [];
};