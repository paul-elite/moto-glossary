"use client";

import { useState, useEffect } from "react";

interface GlossaryEntry {
  id: string;
  title: string;
  description: string;
  rules: string[];
}

export default function Home() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<GlossaryEntry | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: [""],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const res = await fetch("/api/glossary");
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error) {
      console.error("Failed to fetch entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openModal = (entry?: GlossaryEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        title: entry.title,
        description: entry.description,
        rules: entry.rules.length > 0 ? entry.rules : [""],
      });
    } else {
      setEditingEntry(null);
      setFormData({ title: "", description: "", rules: [""] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ title: "", description: "", rules: [""] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredRules = formData.rules.filter((r) => r.trim() !== "");

    try {
      if (editingEntry) {
        await fetch("/api/glossary", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingEntry.id,
            title: formData.title,
            description: formData.description,
            rules: filteredRules,
          }),
        });
      } else {
        await fetch("/api/glossary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            rules: filteredRules,
          }),
        });
      }
      fetchEntries();
      closeModal();
    } catch (error) {
      console.error("Failed to save entry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;
    try {
      await fetch(`/api/glossary?id=${id}`, { method: "DELETE" });
      fetchEntries();
    } catch (error) {
      console.error("Failed to delete entry:", error);
    }
  };

  const addRule = () => {
    setFormData({ ...formData, rules: [...formData.rules, ""] });
  };

  const updateRule = (index: number, value: string) => {
    const newRules = [...formData.rules];
    newRules[index] = value;
    setFormData({ ...formData, rules: newRules });
  };

  const removeRule = (index: number) => {
    const newRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: newRules.length > 0 ? newRules : [""] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-neutral-950/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">
              Moto Glossary
            </h1>
          </div>
          <button
            onClick={() => openModal()}
            className="group flex items-center gap-2 px-5 py-2.5 bg-[#01C705] hover:bg-[#00b004] text-white font-semibold rounded-xl shadow-lg shadow-[#01C705]/25 transition-all duration-300 hover:scale-105 hover:shadow-[#01C705]/40"
          >
            <svg className="w-5 h-5 transition-transform group-hover:rotate-90 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Entry
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-neutral-700 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-800 flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No entries yet</h2>
            <p className="text-neutral-500 mb-6">Get started by adding your first glossary entry</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#01C705] hover:bg-[#00b004] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isExpanded = expandedIds.has(entry.id);
              return (
                <div
                  key={entry.id}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:bg-white/[0.07] animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* List row - always visible */}
                  <div
                    className="flex items-center justify-between px-5 py-4 cursor-pointer"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    <div className="flex items-center gap-4">
                      <button
                        className="p-1 rounded-lg text-neutral-500 hover:text-white transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(entry.id);
                        }}
                      >
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      <h3 className="text-lg font-semibold text-white">{entry.title}</h3>
                      <span className="text-sm text-neutral-500">
                        {entry.rules.length} rule{entry.rules.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(entry);
                        }}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-all"
                        title="Edit"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(entry.id);
                        }}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-red-600 text-neutral-400 hover:text-white transition-all"
                        title="Delete"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded content */}
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 pb-5 pt-2 border-t border-white/10">
                        <p className="text-neutral-400 text-sm leading-relaxed mb-4">{entry.description}</p>

                        {entry.rules.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Defining Rules</h4>
                            <ul className="space-y-2">
                              {entry.rules.map((rule, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-neutral-300">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-neutral-500 mt-2"></span>
                                  <span>{rule}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-lg bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-neutral-800/50">
              <h2 className="text-xl font-bold text-white">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#01C705] focus:border-transparent transition-all"
                  placeholder="Enter term title..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#01C705] focus:border-transparent transition-all resize-none"
                  rows={3}
                  placeholder="Enter description..."
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-neutral-400">Rules</label>
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Rule
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#01C705] focus:border-transparent transition-all text-sm"
                        placeholder={`Rule ${index + 1}...`}
                      />
                      {formData.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="p-2.5 rounded-xl bg-neutral-800 hover:bg-red-600/20 text-neutral-500 hover:text-red-400 transition-all border border-neutral-700"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-medium rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#01C705] hover:bg-[#00b004] text-white font-semibold rounded-xl shadow-lg shadow-[#01C705]/25 transition-all hover:shadow-[#01C705]/40"
                >
                  {editingEntry ? "Save Changes" : "Add Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
