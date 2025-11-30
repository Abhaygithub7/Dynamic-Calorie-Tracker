import React, { useMemo } from 'react';

interface StickFigureProps {
  percentage: number; // 0 to ... infinity (e.g. 1.2 = 120%)
}

const StickFigure: React.FC<StickFigureProps> = ({ percentage }) => {
  // 0 - 0.9: Skinny to Muscular (Beefy)
  // 0.9 - 1.1: Peak Beefy
  // > 1.1: Obese

  // Calculate visual parameters based on percentage
  const visuals = useMemo(() => {
    let headRadius = 12;
    let torsoWidth = 2;
    let limbWidth = 2;
    let torsoShape = "line"; // 'line', 'triangle', 'circle'
    let bellyScale = 1;
    let muscleDefinition = 0; // 0 to 1
    let mood = "neutral"; // neutral, happy, concerned

    if (percentage < 0.5) {
      // Skinny
      limbWidth = 2 + (percentage * 2); // 2 -> 3
      torsoWidth = 2 + (percentage * 2);
      mood = "neutral";
    } else if (percentage >= 0.5 && percentage <= 1.1) {
      // Getting Beefy
      const beefFactor = (percentage - 0.5) / 0.6; // 0 to 1
      limbWidth = 3 + (beefFactor * 8); // 3 -> 11 (Thick muscles)
      torsoWidth = 3 + (beefFactor * 10);
      torsoShape = "triangle"; // Broad shoulders
      muscleDefinition = beefFactor;
      mood = "happy";
    } else {
      // Obese
      const fatFactor = Math.min((percentage - 1.1) / 0.5, 1); // 0 to 1 cap at 1.6 total (160%)
      limbWidth = 8 + (fatFactor * 4); // Soft thick limbs
      torsoShape = "circle";
      bellyScale = 1 + (fatFactor * 2); // Belly grows significantly
      mood = "concerned";
    }

    return { headRadius, torsoWidth, limbWidth, torsoShape, bellyScale, muscleDefinition, mood };
  }, [percentage]);

  // Dynamic Paths
  const headCy = 40;

  // Torso
  let torsoPath = "";
  if (visuals.torsoShape === 'line') {
    torsoPath = `M 100 ${headCy + visuals.headRadius} L 100 110`;
  } else if (visuals.torsoShape === 'triangle') {
    // Inverted triangle for beefy
    const shoulderWidth = 5 + (visuals.muscleDefinition * 30);
    torsoPath = `M ${100 - shoulderWidth} ${headCy + visuals.headRadius + 5} L ${100 + shoulderWidth} ${headCy + visuals.headRadius + 5} L 100 110 Z`;
  } else {
    // Circle/Ellipse for obese
    // Handled via <ellipse> element logic in render, but we can assume path for simplicity if we want
    // Actually, let's use an ellipse element conditionally for the belly
  }

  // Limbs (Simple lines or complex paths for muscles could be done, keeping it simple strokes first)
  // Arms
  const armStartY = headCy + visuals.headRadius + 10;
  const armLen = 40;
  // If beefy, arms flex a bit?
  const armFlex = visuals.muscleDefinition > 0.5 ? 20 : 0;

  const leftArmPath = `M ${visuals.torsoShape === 'triangle' ? 100 - (5 + visuals.muscleDefinition * 30) : 100} ${armStartY} L ${70 - armFlex} ${armStartY + 20} L ${60} ${armStartY + armLen}`;
  const rightArmPath = `M ${visuals.torsoShape === 'triangle' ? 100 + (5 + visuals.muscleDefinition * 30) : 100} ${armStartY} L ${130 + armFlex} ${armStartY + 20} L ${140} ${armStartY + armLen}`;

  // Legs
  const legStartY = 110;
  const legLen = 50;
  const leftLegPath = `M 100 ${legStartY} L 80 ${legStartY + legLen}`;
  const rightLegPath = `M 100 ${legStartY} L 120 ${legStartY + legLen}`;

  return (
    <div className="relative w-64 h-64 mx-auto transition-all duration-500">
      <svg viewBox="0 0 200 200" className="w-full h-full overflow-visible">
        <defs>
          <radialGradient id="beefGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="1" />
            <stop offset="100%" stopColor="#b91c1c" stopOpacity="1" />
          </radialGradient>
          <radialGradient id="fatGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#fca5a5" stopOpacity="1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
          </radialGradient>
        </defs>

        {/* Head */}
        <circle
          cx="100"
          cy={headCy}
          r={visuals.headRadius}
          className="fill-gray-200 stroke-gray-900 dark:fill-gray-800 dark:stroke-gray-200"
          strokeWidth="3"
        />

        {/* Face */}
        {visuals.mood === 'happy' && (
          <path d="M 95 42 Q 100 47 105 42" fill="none" className="stroke-gray-900 dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" />
        )}
        {visuals.mood === 'neutral' && (
          <line x1="95" y1="42" x2="105" y2="42" className="stroke-gray-900 dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" />
        )}
        {visuals.mood === 'concerned' && (
          <path d="M 95 45 Q 100 40 105 45" fill="none" className="stroke-gray-900 dark:stroke-gray-200" strokeWidth="2" strokeLinecap="round" />
        )}


        {/* Torso Render Logic */}
        {visuals.torsoShape === 'circle' ? (
          <ellipse
            cx="100"
            cy="90"
            rx={20 * visuals.bellyScale}
            ry={25 * visuals.bellyScale}
            fill={visuals.bellyScale > 1.5 ? "url(#fatGradient)" : "currentColor"}
            className="transition-path fill-gray-200 stroke-gray-900 dark:fill-gray-800 dark:stroke-gray-200"
            strokeWidth="3"
          />
        ) : (
          <path
            d={torsoPath}
            fill={visuals.torsoShape === 'triangle' ? "url(#beefGradient)" : "none"}
            className="transition-path stroke-gray-900 dark:stroke-gray-200"
            strokeWidth={visuals.torsoWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Limbs */}
        <path
          d={leftArmPath}
          fill="none"
          className="transition-path stroke-gray-900 dark:stroke-gray-200"
          strokeWidth={visuals.limbWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rightArmPath}
          fill="none"
          className="transition-path stroke-gray-900 dark:stroke-gray-200"
          strokeWidth={visuals.limbWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={leftLegPath}
          fill="none"
          className="transition-path stroke-gray-900 dark:stroke-gray-200"
          strokeWidth={visuals.limbWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={rightLegPath}
          fill="none"
          className="transition-path stroke-gray-900 dark:stroke-gray-200"
          strokeWidth={visuals.limbWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Status Badge */}
      <div className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm
        ${visuals.torsoShape === 'line' ? 'bg-gray-200 text-gray-700' : ''}
        ${visuals.torsoShape === 'triangle' ? 'bg-red-500 text-white' : ''}
        ${visuals.torsoShape === 'circle' ? 'bg-yellow-400 text-yellow-900' : ''}
      `}>
        {visuals.torsoShape === 'line' && "Skinny / Normal"}
        {visuals.torsoShape === 'triangle' && "BEEFY"}
        {visuals.torsoShape === 'circle' && "OVERLOAD"}
      </div>
    </div>
  );
};

export default StickFigure;
