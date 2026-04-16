import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Settings,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Eye,
  EyeOff,
  Zap,
  HelpCircle
} from 'lucide-react';

const COLORS = [
  '#ff4d6d', // Theme pink/red
  '#00ffff',
  '#ffff00',
  '#00ff00',
  '#ff0000',
  '#ffffff',
];

const ControlPanel = ({
  settings,
  onSettingsChange,
  onClear,
  onUndo,
  onRedo,
  onSave,
  onToggleCamera,
  cameraVisible,
  gestureVisible,
  onToggleGestures,
  onHelp
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div style={{
      position: 'fixed',
      right: '24px',
      top: '24px',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      alignItems: 'flex-end',
    }}>
      
      <motion.button
        className="glass-meta"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
        }}
      >
        <Settings size={22} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="glass-meta"
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            style={{
              borderRadius: '24px',
              padding: '24px',
              width: '280px',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              marginTop: '12px'
            }}
          >
            {/* Color Palette */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: '14px',
                fontWeight: 600,
                color: 'rgba(255, 255, 255, 0.7)'
              }}>
                <Palette size={16} /> Colors
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
                {COLORS.map((c) => (
                  <motion.div
                    key={c}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onSettingsChange({ color: c })}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: c,
                      cursor: 'pointer',
                      border: settings.color === c ? '2px solid #fff' : 'none',
                      boxShadow: settings.color === c ? `0 0 15px ${c}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Sliders */}
            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Brush: {settings.lineWidth}px
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={settings.lineWidth}
                onChange={(e) => onSettingsChange({ lineWidth: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: settings.color }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                Glow: {settings.glowIntensity}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={settings.glowIntensity}
                onChange={(e) => onSettingsChange({ glowIntensity: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: settings.color }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <ActionButton icon={<Undo2 size={18} />} label="Undo" onClick={onUndo} />
              <ActionButton icon={<Redo2 size={18} />} label="Redo" onClick={onRedo} />
              <ActionButton icon={<Trash2 size={18} />} label="Clear" onClick={onClear} />
              <ActionButton icon={<Download size={18} />} label="Save" onClick={onSave} />

              <ActionButton
                icon={cameraVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                label="Camera"
                onClick={onToggleCamera}
              />

              <ActionButton
                icon={<Zap size={18} />}
                label="Gestures"
                onClick={onToggleGestures}
                active={gestureVisible}
              />

              <ActionButton
                icon={<HelpCircle size={18} />}
                label="Help"
                onClick={onHelp}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Your Branding */}
      <div style={{
        marginTop: '10px',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center'
      }}>
        Smart Air Draw ✨
      </div>
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, active = false }) => (
  <motion.button
    className="glass-meta"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    style={{
      borderRadius: '12px',
      padding: '10px',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      cursor: 'pointer',
      fontSize: '10px',
      boxShadow: active ? '0 0 10px rgba(255, 77, 109, 0.6)' : 'none'
    }}
  >
    {icon}
    {label}
  </motion.button>
);

export default ControlPanel;