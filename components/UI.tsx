import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { LucideChevronLeft, LucideX, LucideCheck, LucidePalette } from 'lucide-react';

export const Heading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h1 className={`text-3xl font-extrabold tracking-tight mb-2 text-white ${className}`}>{children}</h1>
);

export const SubHeading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <h2 className={`text-lg font-semibold text-[#B3B3C6] mb-4 ${className}`}>{children}</h2>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <motion.div
    whileTap={onClick ? { scale: 0.98 } : undefined}
    onClick={onClick}
    className={`bg-[#1A1A22] rounded-[24px] p-6 w-full ${className}`}
  >
    {children}
  </motion.div>
);

export const ScreenContainer: React.FC<{ children: React.ReactNode; onBack?: () => void }> = ({ children, onBack }) => (
  <div className="relative w-full h-[100dvh] max-w-[430px] mx-auto flex flex-col p-5 z-10 overflow-hidden bg-[#0F0F14] text-white">
    {onBack && (
      <div className="absolute top-4 left-4 z-50">
        <button onClick={onBack} className="p-2 rounded-full text-[#B3B3C6] hover:bg-white/5 active:scale-90 transition-all">
          <LucideChevronLeft size={32} />
        </button>
      </div>
    )}
    {children}
  </div>
);

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth = true, className = '', ...props }) => {
  const baseStyle = "min-h-[56px] px-6 rounded-[20px] font-bold text-lg transition-transform active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-[#7C5CFF] text-white",
    secondary: "bg-transparent border-2 border-[#7C5CFF] text-white", 
    danger: "bg-[#E5484D] text-white",
    ghost: "bg-transparent text-[#B3B3C6]"
  };
  return <motion.button className={`${baseStyle} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>{children}</motion.button>;
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full bg-[#1A1A22] text-white placeholder-[#B3B3C6] text-xl font-semibold py-4 px-6 rounded-[20px] outline-none border border-transparent focus:border-[#7C5CFF] transition-all" />
);

export const DrawingCanvas: React.FC<{ onSave: (dataUrl: string) => void, label: string }> = ({ onSave, label }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) { ctx.lineCap = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = '#FFFFFF'; }
  }, []);

  const getPos = (e: any) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const start = (e: any) => { setIsDrawing(true); const pos = getPos(e); canvasRef.current!.getContext('2d')!.moveTo(pos.x, pos.y); };
  const draw = (e: any) => { if (!isDrawing) return; const pos = getPos(e); const ctx = canvasRef.current!.getContext('2d')!; ctx.lineTo(pos.x, pos.y); ctx.stroke(); };

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="bg-[#1A1A22] p-4 rounded-2xl border border-white/10 text-center font-bold text-[#7C5CFF]">{label}</div>
      <canvas ref={canvasRef} width={400} height={500} onMouseDown={start} onMouseMove={draw} onMouseUp={() => setIsDrawing(false)} onTouchStart={start} onTouchMove={draw} onTouchEnd={() => setIsDrawing(false)} className="flex-1 w-full bg-[#1A1A22] rounded-[32px] border-2 border-white/5 touch-none" />
      <Button onClick={() => onSave(canvasRef.current!.toDataURL())}>Submit & Discuss</Button>
    </div>
  );
};

export const ConfirmationModal: React.FC<any> = ({ isOpen, title, message, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel} />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#1A1A22] p-6 rounded-[24px] w-full max-w-xs z-10 border border-white/10">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <p className="text-[#B3B3C6] mb-6">{message}</p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel} className="flex-1">No</Button>
            <Button variant="danger" onClick={onConfirm} className="flex-1">Yes</Button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export const InfoModal: React.FC<any> = ({ isOpen, onClose }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-end justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80" onClick={onClose} />
        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="bg-[#1A1A22] p-6 rounded-t-[24px] w-full max-w-[430px] z-10">
           <Heading>Rules</Heading>
           <div className="space-y-4 mb-6 text-[#B3B3C6]">
              <p><b>Number Justify:</b> Answer a question with a number. Catch the liar.</p>
              <p><b>Impostor Word:</b> Everyone has the same word, but one person has a different one.</p>
              <p><b>Sketchy Suspect:</b> Draw the secret word. The impostor only knows the category!</p>
           </div>
           <Button onClick={onClose}>Got it</Button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);