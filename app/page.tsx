"use client";

import { useState, useEffect } from "react";

interface GlossaryEntry {
  id: string;
  title: string;
  description: string;
  rules: string[];
  formula?: string;
}

interface ChangelogItem {
  id: string;
  entry_title: string;
  action: string;
  created_at: string;
  old_data?: any;
  new_data?: any;
}

export default function Home() {
  const [entries, setEntries] = useState<GlossaryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [changelog, setChangelog] = useState<ChangelogItem[]>([]);
  const [editingEntry, setEditingEntry] = useState<GlossaryEntry | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rules: [""],
    formula: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setError(null);
      const res = await fetch("/api/glossary");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const data = await res.json();
      setEntries(data.entries || []);
    } catch (error: any) {
      console.error("Failed to fetch entries:", error);
      setError(error.message || "An unexpected error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChangelog = async () => {
    try {
      const res = await fetch("/api/changelog");
      const data = await res.json();
      setChangelog(data.history || []);
      setIsChangelogOpen(true);
    } catch (error) {
      console.error("Failed to fetch changelog:", error);
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
        formula: entry.formula || "",
      });
    } else {
      setEditingEntry(null);
      setFormData({ title: "", description: "", rules: [""], formula: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEntry(null);
    setFormData({ title: "", description: "", rules: [""], formula: "" });
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
            formula: formData.formula,
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
            formula: formData.formula,
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

  const exportToJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "moto_glossary.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#01C705]/30">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Moto Glossary</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all"
                title="More Options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-fade-in-up py-1">
                    <button
                      onClick={() => {
                        fetchChangelog();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      View Changelog
                    </button>
                    <button
                      onClick={() => {
                        exportToJson();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 transition-all text-left"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export JSON
                    </button>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => openModal()}
              className="group flex items-center gap-2 px-6 py-2.5 bg-[#01C705] hover:bg-[#00b004] text-white font-semibold rounded-xl shadow-lg shadow-[#01C705]/20 transition-all duration-300 hover:scale-105"
            >
              Add Entry
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-neutral-800 border-t-[#01C705] rounded-full animate-spin"></div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-neutral-900 flex items-center justify-center border border-white/5">
              <svg className="w-10 h-10 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">No entries yet</h2>
            <p className="text-neutral-500 mb-6">Start building the canonical source of truth.</p>
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
          <div className="space-y-3">
            {entries.map((entry, index) => {
              const isExpanded = expandedIds.has(entry.id);
              return (
                <div
                  key={entry.id}
                  className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-neutral-900 hover:border-white/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  {/* List row */}
                  <div
                    className="flex items-center justify-between px-6 py-5 cursor-pointer group"
                    onClick={() => toggleExpand(entry.id)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-1.5 rounded-lg bg-white/5 text-neutral-500 group-hover:text-white transition-all duration-300 ${isExpanded ? "rotate-180 text-white bg-[#01C705]/20" : ""}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#01C705] transition-colors">{entry.title}</h3>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            {entry.rules.length} Constraints
                          </span>
                          {entry.formula && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#01C705] bg-[#01C705]/10 px-1.5 py-0.5 rounded">
                              Metric
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openModal(entry);
                        }}
                        className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all"
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
                        className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-all"
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
                      <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6">
                        <div>
                          <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">Definition</h4>
                          <p className="text-neutral-300 text-sm leading-relaxed">{entry.description}</p>
                        </div>

                        {entry.formula && (
                          <div>
                            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-2">Logic / Formula</h4>
                            <div className="bg-black border border-white/10 rounded-xl p-4 font-mono text-sm text-[#01C705] overflow-x-auto">
                              {entry.formula}
                            </div>
                          </div>
                        )}

                        {entry.rules.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] mb-3">Constraints & Rules</h4>
                            <ul className="space-y-2.5">
                              {entry.rules.map((rule, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-neutral-400">
                                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#01C705] mt-2"></span>
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

      {/* Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative w-full max-w-xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-white/5 bg-neutral-800/30">
              <h2 className="text-xl font-bold text-white">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#01C705] transition-all"
                    placeholder="e.g. Wait Time (Rider)"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#01C705] transition-all resize-none"
                    rows={3}
                    placeholder="Clear, unambiguous definition..."
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-2">Logic / Formula (Optional)</label>
                  <input
                    type="text"
                    value={formData.formula}
                    onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/10 rounded-xl text-[#01C705] font-mono placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#01C705] transition-all"
                    placeholder="e.g. driver_arrival_ts - driver_accept_ts"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Constraints & Rules</label>
                  <button
                    type="button"
                    onClick={addRule}
                    className="text-xs text-[#01C705] hover:text-[#00b004] font-bold flex items-center gap-1 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Constraint
                  </button>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                  {formData.rules.map((rule, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={rule}
                        onChange={(e) => updateRule(index, e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white placeholder-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#01C705] transition-all text-sm"
                        placeholder={`Constraint ${index + 1}...`}
                      />
                      {formData.rules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRule(index)}
                          className="p-2.5 rounded-xl bg-black border border-white/10 hover:bg-red-500/10 text-neutral-600 hover:text-red-500 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 bg-[#01C705] hover:bg-[#00b004] text-white font-bold rounded-2xl shadow-lg shadow-[#01C705]/20 transition-all hover:scale-[1.02]"
                >
                  {editingEntry ? "Update Entry" : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Changelog Modal */}
      {isChangelogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsChangelogOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up">
            <div className="px-8 py-6 border-b border-white/5 bg-neutral-800/30 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Version Changelog</h2>
              <button onClick={() => setIsChangelogOpen(false)} className="text-neutral-500 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar space-y-4">
              {changelog.length === 0 ? (
                <p className="text-center text-neutral-500 py-10">No changes recorded yet.</p>
              ) : (
                changelog.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.action === 'CREATE' ? 'bg-[#01C705]' :
                      item.action === 'UPDATE' ? 'bg-blue-500' : 'bg-red-500'
                      }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">{item.entry_title}</span>
                        <span className="text-[10px] font-bold text-neutral-600 uppercase">
                          {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        <span className="font-bold uppercase tracking-widest text-[9px] mr-2">
                          {item.action}
                        </span>
                        {item.action === 'UPDATE' ? 'Modified entry details' :
                          item.action === 'CREATE' ? 'Added new entry to glossary' : 'Removed entry from glossary'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}</style>
    </div>
  );
}
