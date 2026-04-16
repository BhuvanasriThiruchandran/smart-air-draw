import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle } from 'lucide-react';

const gestures = [
  {
    section: 'Drawing Hand',
    items: [
      { emoji: '☝️', gesture: 'Index finger up', action: 'Draw in the air' },
      { emoji: '🤏', gesture: 'Pinch (thumb + index)', action: 'Erase nearby strokes' },
      { emoji: '✊', gesture: 'Fist', action: 'Clear the full canvas' },
    ],
  },
  {
    section: 'Control Hand',
    items: [
      { emoji: '✌️', gesture: 'Two fingers up', action: 'Select and move a stroke' },
      { emoji: '🤏', gesture: 'Pinch + spread/close', action: 'Resize selected stroke' },
      { emoji: '🖐️', gesture: 'Open palm + twist', action: 'Rotate selected stroke' },
    ],
  },
  {
    section: 'Tips',
    items: [
      { emoji: '💡', gesture: 'Keep hand visible', action: 'Better lighting improves detection' },
      { emoji: '📐', gesture: 'Release after rotate', action: 'Snaps close to clean angles' },
      { emoji: '🌀', gesture: 'Move smoothly', action: 'Helps create cleaner strokes' },
    ],
  },
];

export default function HelpPanel({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-meta"
            style={{
              width: '390px',
              maxWidth: '92vw',
              maxHeight: '80vh',
              overflowY: 'auto',
              borderRadius: '20px',
              padding: '24px',
              color: '#fff',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HelpCircle size={20} style={{ color: '#ff4d6d' }} />
                <span
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                  }}
                >
                  Smart Air Draw Guide
                </span>
              </div>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.65)',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {gestures.map((section, sIdx) => (
              <div
                key={sIdx}
                style={{ marginBottom: sIdx < gestures.length - 1 ? '16px' : 0 }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'rgba(255, 255, 255, 0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '8px',
                  }}
                >
                  {section.section}
                </div>

                {section.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      marginBottom: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 77, 109, 0.12)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '20px',
                        width: '28px',
                        textAlign: 'center',
                      }}
                    >
                      {item.emoji}
                    </span>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>
                        {item.gesture}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {item.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}