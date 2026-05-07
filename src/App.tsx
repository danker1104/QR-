/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Link2, QrCode, Type, RefreshCw, Copy, Check } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('https://google.com');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<SVGSVGElement>(null);

  const downloadQRCode = () => {
    const svg = qrRef.current;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-code-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-10 font-sans selection:bg-slate-900 selection:text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] p-8 sm:p-12 flex flex-col gap-10"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">QR Spark</h1>
          <p className="text-slate-500 font-medium italic">Enter your URL below to create a high-resolution QR code instantly.</p>
        </div>

        {/* Interaction Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Destination URL</label>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="https://example.com/your-page" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg text-slate-800 placeholder-slate-300 focus:outline-none focus:border-slate-900 transition-colors"
                id="qr-input"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors group/btn"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={downloadQRCode}
            disabled={!input}
            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-lg shadow-slate-200 flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
            id="btn-download"
          >
            <Download className="w-5 h-5" />
            Download QR Code
          </button>
        </div>

        {/* QR Display */}
        <div className="flex items-center justify-center pt-4">
          <div className="relative group">
            <div className="absolute -inset-4 bg-slate-50 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <motion.div 
              key={input}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-48 h-48 sm:w-64 sm:h-64 bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden"
            >
              {input ? (
                <QRCodeSVG
                  value={input}
                  size={512}
                  level="H"
                  includeMargin={false}
                  ref={qrRef}
                  className="w-full h-full text-slate-900"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-300">
                  <QrCode className="w-12 h-12" />
                  <span className="text-xs font-bold uppercase tracking-widest">Awaiting Input</span>
                </div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-slate-400 font-medium border-t border-slate-50 pt-8">
          <div className="flex gap-4">
            <span className="hover:text-slate-600 cursor-pointer">PNG</span>
            <span className="hover:text-slate-600 cursor-pointer">SVG</span>
            <span className="hover:text-slate-600 cursor-pointer">PDF</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            <span>Instant Preview</span>
          </div>
        </div>
      </motion.div>

      {/* Background Stats */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12 text-slate-400 uppercase text-[10px] font-bold tracking-[0.2em]">
        <span>Fast Rendering</span>
        <span>Vector Support</span>
        <span>No Tracking</span>
      </div>
    </div>
  );
}
