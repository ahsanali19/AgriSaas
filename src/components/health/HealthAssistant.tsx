// src/components/health/HealthAssistant.tsx
import React, { useState } from 'react';
import { useFarm } from '../../context/FarmContext';
import { HealthRecord } from '../../types';
import { VoiceInput } from '../common/VoiceInput';
import {
  Stethoscope,
  Sparkles,
  AlertTriangle,
  HeartPulse,
  Plus,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Send,
  Info,
  Phone,
  FileText,
  Activity,
  Check,
  ChevronRight
} from 'lucide-react';

const INITIAL_HEALTH_RECORDS: HealthRecord[] = [
  {
    id: 1,
    animalTag: 'PK-SAH-084',
    species: 'Cow',
    symptoms: 'Swollen left quarter udder with clotted watery milk. Moderate fever of 103.5°F and reluctance to stand.',
    severity: 'critical',
    reportedDate: '2026-08-18',
    status: 'Veterinarian Consulted',
    aiPreliminaryDiagnosis: 'Acute Clinical Mastitis (Bacterial infection)',
    aiSuggestedTreatment: 'Immediate milking out of affected quarter. Apply cold compress. Administer intramammary antibiotic infusions under vet supervision. Isolate milk from bulk tank.'
  },
  {
    id: 2,
    animalTag: 'Flock #BR-2026-08',
    species: 'Broiler',
    symptoms: 'Birds panting with open beaks, reduced feed intake by 30%, slight wet droppings.',
    severity: 'moderate',
    reportedDate: '2026-08-19',
    status: 'Treatment Ongoing',
    aiPreliminaryDiagnosis: 'Severe Heat Stress with early respiratory distress',
    aiSuggestedTreatment: 'Operate tunnel ventilation fans at max velocity. Add Vitamin C (Ascorbic acid) and electrolytes in drinker water. Dim lighting during hottest peak hours.'
  },
  {
    id: 3,
    animalTag: 'Pond #01',
    species: 'Fish',
    symptoms: 'Fingerlings crowding near water inlet and gasping at water surface at dawn.',
    severity: 'moderate',
    reportedDate: '2026-08-17',
    status: 'Resolved',
    aiPreliminaryDiagnosis: 'Nocturnal Dissolved Oxygen (DO) Depletion',
    aiSuggestedTreatment: 'Operate paddlewheel aerators from 3:00 AM to 8:00 AM. Stop feeding for 24 hours to reduce biological oxygen demand (BOD).'
  }
];

const COMMON_SYMPTOM_CHIPS = [
  'Swollen Hot Udder (Mastitis)',
  'High Body Temp / Fever 104°F+',
  'Loss of Appetite / Off-Feed',
  'Panting / Heatstroke distress',
  'Bloody Droppings (Coccidiosis)',
  'Nasal Discharge & Coughing',
  'Limping / Hoof Rot',
  'Surface Gasping for Air (Fish)',
  'Sudden Drop in Milk Yield'
];

export const HealthAssistant: React.FC = () => {
  const { dairyAnimals, poultryBatches, fishPonds } = useFarm();

  const [records, setRecords] = useState<HealthRecord[]>(INITIAL_HEALTH_RECORDS);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'triage' | 'history'>('triage');

  // Form State
  const [selectedSpecies, setSelectedSpecies] = useState<HealthRecord['species']>('Cow');
  const [animalTag, setAnimalTag] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'critical'>('moderate');
  const [activeAnalysisResult, setActiveAnalysisResult] = useState<HealthRecord | null>(null);

  const handleAddSymptomChip = (chip: string) => {
    if (symptoms.includes(chip)) return;
    setSymptoms(prev => prev ? `${prev}, ${chip}` : chip);
  };

  const handleSymptomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setAnalyzing(true);
    setActiveAnalysisResult(null);

    // Simulate AI Clinical Symptom Analysis Engine (Gemini API Integration Ready)
    setTimeout(() => {
      let diag = 'Preliminary Clinical Triage (Differential)';
      let treat = 'Isolate the animal to prevent disease transmission. Ensure clean water and monitor temperature hourly.';

      if (symptoms.toLowerCase().includes('mastitis') || symptoms.toLowerCase().includes('udder')) {
        diag = 'Suspected Clinical Mastitis / Udder Inflammation';
        treat = 'Immediate isolation. Strip affected quarter into a strip cup. Avoid cross-milking. Consult vet for antibiotic sensitivity testing.';
      } else if (symptoms.toLowerCase().includes('pant') || symptoms.toLowerCase().includes('fever') || symptoms.toLowerCase().includes('heat')) {
        diag = 'Severe Heat Prostration & Thermal Stress';
        treat = 'Move to shaded area with high airflow. Hose down head and neck with cold water. Supply oral rehydration electrolyte solution.';
      } else if (symptoms.toLowerCase().includes('gasp') || symptoms.toLowerCase().includes('fish')) {
        diag = 'Aquatic Hypoxia (Low Dissolved Oxygen)';
        treat = 'Run mechanical aerators immediately. Fresh water exchange (15-20%). Stop all artificial feeding until oxygen levels recover above 5.0 ppm.';
      }

      const newRecord: HealthRecord = {
        id: Date.now(),
        animalTag: animalTag || `${selectedSpecies}-Untagged`,
        species: selectedSpecies,
        symptoms,
        severity,
        reportedDate: new Date().toISOString().split('T')[0],
        status: 'Under Observation',
        aiPreliminaryDiagnosis: diag,
        aiSuggestedTreatment: treat
      };

      setRecords([newRecord, ...records]);
      setActiveAnalysisResult(newRecord);
      setAnalyzing(false);
    }, 800);
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>AI Clinical Veterinary Triage</span>
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-300">Livestock & Aqua Health</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Farm Health & Veterinary Assistant
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Report sick cattle, poultry flock distress, or fish pond mortalities. Get instant preliminary triage advisories, quarantine protocols, and track treatment logs.
            </p>
          </div>

          {/* Quick Vet Helpline */}
          <div className="bg-slate-950/60 border border-emerald-500/30 p-4 rounded-2xl flex items-center space-x-3 text-xs self-start sm:self-auto shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Livestock Emergency Helpline</div>
              <div className="font-mono font-bold text-sm text-white">0800-VET-CARE</div>
              <div className="text-[10px] text-emerald-400">24/7 South Asia Support</div>
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 opacity-10 text-9xl select-none pointer-events-none transform translate-x-8 translate-y-8">
          🩺
        </div>
      </div>

      {/* Main Grid: Clinical Form + AI Diagnosis Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Symptom Input Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Stethoscope className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-base text-slate-900">Log Sick Animal or Flock Symptoms</h2>
            </div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Step 1 of 2</span>
          </div>

          <form onSubmit={handleSymptomSubmit} className="space-y-4">
            
            {/* Species Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Select Species / Enterprise *
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['Cow', 'Buffalo', 'Goat', 'Broiler', 'Layer', 'Fish'] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => setSelectedSpecies(sp)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center space-y-1 ${
                      selectedSpecies === sp
                        ? 'bg-emerald-700 text-white shadow-md'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>
                      {sp === 'Cow' && '🐄'}
                      {sp === 'Buffalo' && '🐃'}
                      {sp === 'Goat' && '🐐'}
                      {sp === 'Broiler' && '🍗'}
                      {sp === 'Layer' && '🥚'}
                      {sp === 'Fish' && '🐟'}
                    </span>
                    <span className="text-[11px]">{sp}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Animal ID / Tag Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ear Tag Number / Batch ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. PK-SAH-084 or Flock #02"
                  value={animalTag}
                  onChange={(e) => setAnimalTag(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="low">🟢 Low (Mild Discomfort)</option>
                  <option value="moderate">🟡 Moderate (Requires Prompt Care)</option>
                  <option value="critical">🔴 Critical Alert (Immediate Vet)</option>
                </select>
              </div>
            </div>

            {/* Quick Symptom Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Common Observed Symptoms (Click to insert):</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOM_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleAddSymptomChip(chip)}
                    className="text-[11px] font-medium bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 transition"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Symptoms Textarea with Voice Recognition */}
            <VoiceInput
              id="clinical-symptoms-input"
              isTextArea
              rows={4}
              required
              label="Describe Clinical Symptoms & Onset Time (Speak or Type) *"
              placeholder="Describe fever readings, appetite, milk consistency, breathing sounds, or click the mic and speak in Urdu/English..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              hint="🎙️ Farmers can tap the microphone to describe symptoms by voice in Urdu, English, or Hindi."
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={analyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-lg shadow-emerald-900/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-[0.99]"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-200" />
                  <span>Analyzing Symptoms with Clinical Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Preliminary Triage & Advisory</span>
                </>
              )}
            </button>

          </form>
        </div>

        {/* Right Column: AI Triage Output & Active Analysis */}
        <div className="lg:col-span-5 space-y-4">
          
          {activeAnalysisResult ? (
            <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white rounded-3xl p-6 shadow-xl space-y-5 animate-fadeIn border border-emerald-700">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-800">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-bold text-base text-white">AI Clinical Triage Analysis</h3>
                </div>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  activeAnalysisResult.severity === 'critical'
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-amber-400 text-slate-950 font-bold'
                }`}>
                  {activeAnalysisResult.severity.toUpperCase()} ALERT
                </span>
              </div>

              {/* Subject Info */}
              <div className="flex items-center justify-between text-xs text-emerald-200 bg-emerald-950/80 p-3 rounded-2xl border border-emerald-800">
                <div>
                  <span className="text-slate-400">Target Animal: </span>
                  <strong className="text-white font-mono">{activeAnalysisResult.animalTag}</strong>
                </div>
                <div>
                  <span className="text-slate-400">Species: </span>
                  <strong className="text-white">{activeAnalysisResult.species}</strong>
                </div>
              </div>

              {/* Differential Diagnosis */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                  Preliminary Diagnosis:
                </div>
                <div className="bg-white/10 p-3 rounded-2xl font-bold text-sm text-white">
                  {activeAnalysisResult.aiPreliminaryDiagnosis}
                </div>
              </div>

              {/* Recommended First-Aid / Action Protocol */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-emerald-400 tracking-wider">
                  Immediate On-Farm Triage Protocols:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  {activeAnalysisResult.aiSuggestedTreatment}
                </p>
              </div>

              {/* Medical Disclaimer */}
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-[10px] text-emerald-300/80 flex items-start space-x-2">
                <Info className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>
                  <strong>Notice:</strong> This AI symptom analysis provides preliminary farm triage and is not a substitute for on-site diagnostic testing by a licensed veterinarian.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => alert(`Connecting with emergency veterinarian on duty for case: ${activeAnalysisResult.animalTag}`)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Vet Doctor</span>
                </button>
                <button
                  onClick={() => {
                    setSymptoms('');
                    setActiveAnalysisResult(null);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition text-center"
                >
                  New Case
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 text-center space-y-4 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <HeartPulse className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-bold text-base text-slate-900">AI Clinical Assistant Ready</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter symptoms on the left to run immediate algorithmic differential triage, generate biosecurity isolation protocols, and log treatment notes.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Case History & Treatment Logs */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900">Recent Farm Health Case Logs</h3>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {records.length} Cases
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">Biosecurity & Clinical Audit</span>
        </div>

        <div className="divide-y divide-slate-100">
          {records.map((rec) => (
            <div key={rec.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-900">{rec.animalTag}</span>
                  <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {rec.species}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.severity === 'critical' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed max-w-2xl">
                  {rec.symptoms}
                </p>
                {rec.aiPreliminaryDiagnosis && (
                  <div className="text-[11px] text-emerald-800 font-medium">
                    ↳ <strong>AI Triage:</strong> {rec.aiPreliminaryDiagnosis}
                  </div>
                )}
              </div>

              <div className="text-right sm:self-center shrink-0 space-y-1">
                <div className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {rec.status}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {rec.reportedDate}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HealthAssistant;
