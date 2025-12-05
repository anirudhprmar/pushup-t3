"use client"

import * as React from "react"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { BookOpen, X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"

interface JournalEntryProps {
  isOpen: boolean
  onSave: (notes: string) => void
  onSkip: () => void
  habitName: string
}

export function JournalEntry({ isOpen, onSave, onSkip, habitName }: JournalEntryProps) {
  const [notes, setNotes] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  React.useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isOpen])

  const handleSave = () => {
    onSave(notes)
    setNotes("")
  }

  const handleSkip = () => {
    onSkip()
    setNotes("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-4 bottom-4 md:inset-x-auto md:right-4 md:bottom-4 md:w-[500px] z-50"
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-primary/10 to-primary/5 px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Reflect on your progress</h3>
                    <p className="text-sm text-muted-foreground">
                      How did {habitName} go?
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <Textarea
                ref={textareaRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you accomplish? How do you feel? Any insights or challenges?"
                className="min-h-32 resize-none"
                maxLength={500}
              />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{notes.length}/500 characters</span>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border flex gap-3 justify-end">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
              >
                Skip for now
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={notes.trim().length === 0}
              >
                Save Reflection
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
