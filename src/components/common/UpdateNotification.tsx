// src/components/common/UpdateNotification.tsx
import React, { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, Sparkles, X, ArrowUpCircle } from 'lucide-react';

export const UpdateNotification: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Hook into the Vite PWA service worker registration with prompt mode
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    offlineReady: [offlineReady, setOfflineReady],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // Periodically check for SW updates (e.g. every 30 minutes)
      if (r) {
        setInterval(() => {
          r.update();
        }, 30 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn('SW registration error:', error);
    },
  });

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      // Explicitly clear runtime cache keys for fresh assets
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => {
            // Keep critical user offline data if needed, or clear all to force fresh bundle
            return caches.delete(cacheName);
          })
        );
      }

      // Instruct the waiting service worker to skipWaiting & reload immediately
      await updateServiceWorker(true);
    } catch (err) {
      console.error('Failed to update service worker:', err);
      window.location.reload();
    }
  };

  const handleClose = () => {
    setNeedRefresh(false);
    setOfflineReady(false);
  };

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-md animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center justify-between gap-3">
        
        {/* Left Icon & Message */}
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
            {needRefresh ? (
              <ArrowUpCircle className="w-5 h-5 text-emerald-400 animate-pulse" />
            ) : (
              <Sparkles className="w-5 h-5 text-emerald-400" />
            )}
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold text-white flex items-center space-x-1.5 truncate">
              <span>{needRefresh ? 'New version available!' : 'App ready to work offline'}</span>
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              {needRefresh
                ? 'Click update to get the latest features and fixes.'
                : 'Green Digital System is cached for full offline use.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5 shrink-0">
          {needRefresh ? (
            <button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs px-3 py-1.5 rounded-xl transition"
            >
              OK
            </button>
          )}

          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition"
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default UpdateNotification;
