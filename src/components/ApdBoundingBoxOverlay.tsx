import React from 'react';
import { ApdItem } from '../types/k3';

interface Props {
  photoUrl?: string;
  detections: ApdItem[];
  isScanning?: boolean;
}

export const ApdBoundingBoxOverlay: React.FC<Props> = ({
  photoUrl,
  detections,
  isScanning = false,
}) => {
  const content = (
    <>
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Foto Pekerja APD"
          className="w-full h-full object-cover"
        />
      )}

      {/* Target Watermark info */}
      <div className="absolute top-2.5 inset-x-0 flex justify-center z-10 pointer-events-none">
        <span className="text-[10px] font-bold tracking-wider bg-slate-900/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-xs">
          DETEKSI AI • GIS 150 KV WARU
        </span>
      </div>

      {/* Corner crosshairs for viewfinder look */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400 z-10 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400 z-10 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400 z-10 pointer-events-none" />

      {/* Bounding boxes overlay */}
      {!isScanning && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {detections.map((item) => {
            if (!item.detected || !item.bbox) return null;
            const { x, y, width, height } = item.bbox;

            return (
              <div
                key={item.key}
                className="absolute transition-all duration-300"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                }}
              >
                {/* Box outline */}
                <div
                  className="w-full h-full rounded border-2 shadow-[0_0_10px_rgba(0,0,0,0.4)] relative"
                  style={{
                    borderColor: item.color,
                    backgroundColor: `${item.color}15`,
                  }}
                >
                  {/* Badge Label */}
                  <div
                    className="absolute -top-5 left-0 flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-md whitespace-nowrap"
                    style={{ backgroundColor: item.color }}
                  >
                    <span>{item.nameIndo}</span>
                    <span className="opacity-90 font-mono text-[9px]">
                      {item.confidence}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );

  if (photoUrl) {
    return (
      <div className="relative w-full max-w-md mx-auto aspect-[3/4] rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-md select-none">
        {content}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 pointer-events-none select-none">
      {content}
    </div>
  );
};
