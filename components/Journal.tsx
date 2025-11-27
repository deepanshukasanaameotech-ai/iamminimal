import React, { useState, useEffect } from 'react';
import { JournalEntry, IdentityTrait } from '../types';
import { PenTool, Brain, Save } from 'lucide-react';
import { getBehavioralInsight, generateIdentityQuestions } from '../services/ai';

interface JournalProps {
  entries: JournalEntry[];
  setEntries: React.Dispatch<React.SetStateAction<JournalEntry[]>>;
  identity: IdentityTrait[];
}

export const Journal: React.FC<JournalProps> = ({ entries, setEntries, identity }) => {
  const [mode, setMode] = useState<'WRITE' | 'MAP' | 'REVIEW'>('WRITE');
  const [content, setContent] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [identityQs, setIdentityQs] = useState<string[]>([]);

  const saveEntry = async () => {
    if (!content.trim()) return;
    
    // Auto-analyze on save if lengthy
    if (content.length > 50) {
        setIsAnalyzing(true);
        const insight = await getBehavioralInsight(content, 'JOURNAL');
        setAnalysis(insight);
        setIsAnalyzing(false);
        
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content,
            type: 'REFLECTION',
            tags: [],
            aiInsight: insight
        };
        setEntries([newEntry, ...entries]);
    } else {
        const newEntry: JournalEntry = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            content,
            type: 'REFLECTION',
            tags: []
        };
        setEntries([newEntry, ...entries]);
    }
    setContent('');
  };

  useEffect(() => {
      if (mode === 'MAP' && identityQs.length === 0) {
          generateIdentityQuestions().then(setIdentityQs);
      }
  }, [mode]);

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex space-x-6 border-b border-zinc-800 pb-2">
        {['WRITE', 'MAP', 'REVIEW'].map((m) => (
          <button
            key={m}
            onClick={() => setMode(m as any)}
            className={`text-sm font-bold tracking-widest pb-2 transition-colors ${
              mode === m ? 'text-white border-b-2 border-emerald-500' : 'text-zinc-600'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'WRITE' && (
          <div className="flex-1 flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                  <h3 className="text-zinc-500 text-xs uppercase tracking-widest">Mental Clarity Protocol</h3>
                  <button onClick={saveEntry} disabled={isAnalyzing} className="text-emerald-500 hover:text-white transition-colors">
                      <Save size={20} />
                  </button>
              </div>
              <textarea 
                className="flex-1 bg-zinc-900/30 border border-zinc-800 p-4 text-zinc-300 focus:outline-none focus:border-zinc-600 resize-none font-light leading-relaxed"
                placeholder="Confront the chaos. Write the truth..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              {analysis && (
                  <div className="bg-emerald-900/10 border-l-2 border-emerald-500 p-4 text-sm text-zinc-400 italic">
                      AI Insight: "{analysis}"
                  </div>
              )}
          </div>
      )}

      {mode === 'MAP' && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="space-y-2">
                  <h2 className="text-2xl font-light text-white">Identity Blueprint</h2>
                  <p className="text-zinc-500 text-sm">Who are you becoming?</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                      <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Future Strengths</h4>
                      <ul className="space-y-2">
                          <li className="text-emerald-400 font-medium">Hyper-focused</li>
                          <li className="text-emerald-400 font-medium">Financially Sovereign</li>
                          <li className="text-emerald-400 font-medium">Physically Robust</li>
                      </ul>
                  </div>
                  <div className="p-4 border border-zinc-800 bg-zinc-900/20">
                      <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Current Weaknesses (The Shadow)</h4>
                      <ul className="space-y-2">
                          <li className="text-zinc-400">Procrastination via consumption</li>
                          <li className="text-zinc-400">Avoidance of difficult conversations</li>
                      </ul>
                  </div>
              </div>
              
              <div className="mt-8">
                  <h4 className="text-xs text-zinc-500 uppercase tracking-widest mb-4">Deep Questions</h4>
                  {identityQs.length > 0 ? (
                      <div className="space-y-4">
                          {identityQs.map((q, i) => (
                              <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm">
                                  {q}
                              </div>
                          ))}
                      </div>
                  ) : (
                      <div className="text-zinc-700 text-sm animate-pulse">Consulting the oracle...</div>
                  )}
              </div>
          </div>
      )}

      {mode === 'REVIEW' && (
          <div className="space-y-4 overflow-y-auto max-h-[60vh]">
              {entries.map(entry => (
                  <div key={entry.id} className="p-4 border-b border-zinc-800 space-y-2">
                      <div className="text-xs text-zinc-600">{new Date(entry.date).toLocaleDateString()}</div>
                      <p className="text-zinc-300 text-sm">{entry.content}</p>
                      {entry.aiInsight && (
                           <div className="text-xs text-emerald-600 mt-2 pl-2 border-l border-emerald-900">{entry.aiInsight}</div>
                      )}
                  </div>
              ))}
              {entries.length === 0 && <div className="text-zinc-600 text-center py-10">No records found. Begin the work.</div>}
          </div>
      )}
    </div>
  );
};