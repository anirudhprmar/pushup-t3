
export default function CircularProgress({ value, label, color, maxValue = 100 }: { value: number; label: string; color: string; maxValue?: number }) {

    // Use smaller size on mobile (70px) and larger on desktop (90px)
    const mobileSize = 70;
    const desktopSize = 90;
    const percentage = maxValue > 0 ? Math.min(100, (value / maxValue) * 100) : 0;
    
   

   return (
      <div className="flex flex-col items-center gap-2">
        {/* Mobile */}
        <div className="relative sm:hidden" style={{ width: mobileSize, height: mobileSize }}>
          <svg className="transform -rotate-90" width={mobileSize} height={mobileSize}>
            <circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - 8) / 2}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx={mobileSize / 2}
              cy={mobileSize / 2}
              r={(mobileSize - 8) / 2}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * ((mobileSize - 8) / 2)}
              strokeDashoffset={2 * Math.PI * ((mobileSize - 8) / 2) - (percentage / 100) * 2 * Math.PI * ((mobileSize - 8) / 2)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
          </div>
        </div>
        
        {/* Desktop */}
        <div className="relative hidden sm:block" style={{ width: desktopSize, height: desktopSize }}>
          <svg className="transform -rotate-90" width={desktopSize} height={desktopSize}>
            <circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - 8) / 2}
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/20"
            />
            <circle
              cx={desktopSize / 2}
              cy={desktopSize / 2}
              r={(desktopSize - 8) / 2}
              stroke={color}
              strokeWidth="6"
              fill="none"
              strokeDasharray={2 * Math.PI * ((desktopSize - 8) / 2)}
              strokeDashoffset={2 * Math.PI * ((desktopSize - 8) / 2) - (percentage / 100) * 2 * Math.PI * ((desktopSize - 8) / 2)}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold" style={{ color }}>{value}</span>
          </div>
        </div>
        
        <span className="text-xs text-muted-foreground text-center">{label}</span>
      </div>
    );
}

