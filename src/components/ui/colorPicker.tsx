"use client"

import * as React from "react"
import { HABIT_COLORS } from "~/lib/habitUtils"

interface ColorPickerProps {
  value?: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {/* Predefined color palette */}
      <div className="grid grid-cols-5 gap-2">
        {HABIT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={`w-10 h-10 rounded-lg transition-all duration-200 hover:scale-110 ${
              value === color
                ? "ring-2 ring-offset-2 ring-primary scale-110"
                : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-300"
            }`}
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="custom-color"
          className="text-sm text-muted-foreground"
        >
          Custom:
        </label>
        <input
          id="custom-color"
          type="color"
          value={value ?? "#3b82f6"}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 rounded-lg border border-input cursor-pointer"
        />
      </div>
    </div>
  )
}
