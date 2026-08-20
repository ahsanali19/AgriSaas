// src/components/common/VoiceInput.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, Check, Loader2, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface VoiceInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  rows?: number;
  label?: string;
  labelIcon?: React.ReactNode;
  hint?: string;
  error?: string;
  lang?: string; // e.g. 'ur-PK', 'en-US', 'hi-IN'
  showLangSelector?: boolean;
  appendMode?: boolean; // if true, appends transcribed text to existing value with space; if false, replaces or appends intelligently
  onListeningStateChange?: (isListening: boolean) => void;
  containerClassName?: string;
}

// Check for Web Speech Recognition API in standard browser window
interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  value,
  onChange,
  isTextArea = false,
  rows = 3,
  label,
  labelIcon,
  hint,
  error,
  lang,
  showLangSelector = true,
  appendMode = true,
  onListeningStateChange,
  containerClassName = '',
  className = '',
  id,
  placeholder,
  disabled,
  ...props
}) => {
  const { language } = useLanguage();

  // Pick voice language: user prop -> context language mapping -> fallback
  const getSpeechLang = (appLang: string, overrideLang?: string) => {
    if (overrideLang) return overrideLang;
    switch (appLang) {
      case 'ur':
        return 'ur-PK';
      case 'hi':
        return 'hi-IN';
      case 'en':
      default:
        return 'en-US';
    }
  };

  const [activeSpeechLang, setActiveSpeechLang] = useState<string>(
    getSpeechLang(language, lang)
  );

  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [showToast, setShowToast] = useState<boolean>(false);

  const recognitionRef = useRef<any>(null);
  const baseValueRef = useRef<string>(value);

  // Keep base value updated when not actively dictating
  useEffect(() => {
    if (!isListening) {
      baseValueRef.current = value;
    }
  }, [value, isListening]);

  // Sync speech language with app language if not manually customized
  useEffect(() => {
    if (!lang) {
      setActiveSpeechLang(getSpeechLang(language));
    }
  }, [language, lang]);

  // Check speech recognition capability on mount
  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
    }
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const triggerToast = (msg: string) => {
    setErrorMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled) return;

    const win = window as unknown as IWindow;
    const SpeechRecognitionAPI = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      triggerToast(
        language === 'ur'
          ? 'معذرت، آپ کا براؤزر وائس اسپیچ ریکگنیشن سپورٹ نہیں کرتا۔ برائے مہربانی گوگل کروم یا ایج استعمال کریں۔'
          : 'Voice speech recognition is not supported in this browser. Please use Google Chrome, Edge, or Safari.'
      );
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      onListeningStateChange?.(false);
      return;
    }

    // Start listening
    try {
      const recognition = new SpeechRecognitionAPI();
      recognitionRef.current = recognition;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = activeSpeechLang;
      recognition.maxAlternatives = 1;

      baseValueRef.current = value || '';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setInterimTranscript('');
        onListeningStateChange?.(true);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTrans += transcriptChunk;
          } else {
            interimTrans += transcriptChunk;
          }
        }

        setInterimTranscript(interimTrans);

        if (finalTrans) {
          const currentBase = baseValueRef.current;
          let combined = '';
          if (appendMode && currentBase.trim().length > 0) {
            // Smart space separation
            combined = `${currentBase.trim()} ${finalTrans.trim()}`;
          } else {
            combined = finalTrans.trim();
          }

          baseValueRef.current = combined;

          // Dispatch simulated change event
          const simulatedEvent = {
            target: {
              value: combined,
              id,
              name: props.name || id || 'voice-input',
            }
          } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

          onChange(simulatedEvent);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error event:', event.error);
        setIsListening(false);
        onListeningStateChange?.(false);

        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          triggerToast(
            language === 'ur'
              ? 'مائیکروفون کی اجازت نہیں ملی۔ برائے مہربانی براؤزر سیٹنگز میں مائیک کی اجازت آن کریں۔'
              : 'Microphone permission denied. Please allow microphone access in your browser.'
          );
        } else if (event.error === 'no-speech') {
          // No speech detected, quietly stop or alert if needed
          setInterimTranscript('');
        } else if (event.error === 'network') {
          triggerToast(
            language === 'ur'
              ? 'نیٹ ورک کا مسئلہ ہے۔ براہ کرم انٹرنیٹ کنکشن چیک کریں۔'
              : 'Speech recognition network error. Please check your internet connection.'
          );
        } else {
          triggerToast(`Voice error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        onListeningStateChange?.(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      onListeningStateChange?.(false);
      triggerToast('Could not access microphone: ' + (err.message || 'Unknown error'));
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setActiveSpeechLang(newLang);
    if (isListening && recognitionRef.current) {
      // Restart with new language
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  };

  const fieldId = id || `voice-input-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={`space-y-1.5 font-sans relative ${containerClassName}`}>
      {/* Label and Language Controls */}
      {(label || showLangSelector) && (
        <div className="flex items-center justify-between gap-2">
          {label && (
            <label
              htmlFor={fieldId}
              className="text-xs font-bold text-slate-700 flex items-center gap-1.5 select-none"
            >
              {labelIcon && <span className="text-emerald-600">{labelIcon}</span>}
              <span>{label}</span>
            </label>
          )}

          {showLangSelector && isSupported && (
            <div className="flex items-center gap-1 text-[11px] text-slate-500 ml-auto">
              <Globe className="w-3 h-3 text-slate-400 shrink-0" />
              <select
                value={activeSpeechLang}
                onChange={handleLanguageChange}
                aria-label="Voice Recognition Language"
                className="bg-slate-50 text-[11px] font-semibold text-slate-700 rounded-lg px-1.5 py-0.5 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="ur-PK">اردو (Urdu)</option>
                <option value="en-US">English (US)</option>
                <option value="en-PK">English (PK)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Input / Textarea Container with Mic Button */}
      <div className="relative group">
        {isTextArea ? (
          <textarea
            id={fieldId}
            rows={rows}
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full text-sm border rounded-2xl transition-all duration-150 p-3 pr-12 focus:outline-none focus:ring-2 ${
              isListening
                ? 'border-rose-400 ring-2 ring-rose-300/50 bg-rose-50/20'
                : error
                ? 'border-red-300 ring-2 ring-red-200 bg-red-50/20'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-emerald-500/50 focus:border-emerald-600'
            } ${className}`}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            id={fieldId}
            type="text"
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full text-sm border rounded-xl transition-all duration-150 py-2.5 pl-3.5 pr-12 focus:outline-none focus:ring-2 ${
              isListening
                ? 'border-rose-400 ring-2 ring-rose-300/50 bg-rose-50/20'
                : error
                ? 'border-red-300 ring-2 ring-red-200 bg-red-50/20'
                : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-emerald-500/50 focus:border-emerald-600'
            } ${className}`}
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        )}

        {/* Microphone Action Button */}
        <div className={`absolute ${isTextArea ? 'top-2.5 right-2.5' : 'right-2 top-1/2 -translate-y-1/2'} flex items-center gap-1`}>
          <button
            type="button"
            onClick={toggleListening}
            disabled={disabled}
            title={
              isListening
                ? 'Listening... Click to stop (بولیں... روکنے کیلئے کلک کریں)'
                : `Voice Input (${activeSpeechLang}) - Click and Speak`
            }
            className={`p-2 rounded-xl transition-all duration-200 flex items-center justify-center shadow-sm relative ${
              isListening
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/40 shadow-md animate-pulse ring-4 ring-rose-200'
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300/80 hover:scale-105 active:scale-95'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {isListening ? (
              <>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-400 rounded-full animate-ping" />
                <Mic className="w-4 h-4 animate-bounce" />
              </>
            ) : (
              <Mic className="w-4 h-4 text-emerald-700" />
            )}
          </button>
        </div>
      </div>

      {/* Real-time Listening / Transcription Indicator */}
      {isListening && (
        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 animate-fadeIn">
          <div className="flex items-center gap-2 font-medium truncate">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
            </span>
            <span className="font-bold">
              {language === 'ur' ? 'سن رہا ہے...' : 'Listening...'}
            </span>
            {interimTranscript ? (
              <span className="italic text-rose-900 opacity-90 truncate max-w-[200px] sm:max-w-[280px]">
                "{interimTranscript}"
              </span>
            ) : (
              <span className="text-[11px] opacity-75">
                {language === 'ur'
                  ? 'صاف آواز میں بولیں (مائیک آن ہے)'
                  : 'Speak clearly into your microphone'}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={toggleListening}
            className="text-[10px] font-bold uppercase bg-rose-200 hover:bg-rose-300 text-rose-900 px-2 py-0.5 rounded-md transition ml-2 shrink-0"
          >
            {language === 'ur' ? 'مکمل' : 'Done'}
          </button>
        </div>
      )}

      {/* Error or Hint message */}
      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}

      {!error && hint && !isListening && (
        <p className="text-[11px] text-slate-500 font-medium">{hint}</p>
      )}

      {/* Floating Toast Notification for Permissions/Unsupported Alert */}
      {showToast && errorMessage && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700 flex items-start gap-3 animate-slideUp">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">
              Voice-to-Text Notification
            </h4>
            <p className="text-xs text-slate-200 mt-1 leading-relaxed">
              {errorMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg text-xs"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceInput;
