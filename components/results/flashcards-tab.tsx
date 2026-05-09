"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RotateCcw, Lightbulb } from "lucide-react"

interface Flashcard {
  id: string
  question: string
  answer: string
}

interface FlashcardsTabProps {
  flashcards: Flashcard[]
}

export function FlashcardsTab({ flashcards }: FlashcardsTabProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const currentCard = flashcards[currentIndex]

  const goToPrevious = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))
  }

  const goToNext = () => {
    setIsFlipped(false)
    setCurrentIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))
  }

  const flipCard = () => setIsFlipped(!isFlipped)

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
        <div className="flex gap-1">
          {flashcards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIsFlipped(false)
                setCurrentIndex(i)
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentIndex ? "bg-cyan-500 w-4" : "bg-secondary hover:bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <motion.div
          className="relative w-full h-[300px] cursor-pointer"
          onClick={flipCard}
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        >
          {/* Front - Question */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-card to-secondary border border-border backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden" }}
          >
            <div className="p-3 rounded-xl bg-cyan-500/10 mb-4">
              <Lightbulb className="w-6 h-6 text-cyan-500" />
            </div>
            <span className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Question</span>
            <p className="text-lg font-medium text-foreground">{currentCard.question}</p>
            <span className="absolute bottom-4 text-xs text-muted-foreground">
              Click to reveal answer
            </span>
          </div>

          {/* Back - Answer */}
          <div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-card border border-cyan-500/30 backdrop-blur-sm p-8 flex flex-col items-center justify-center text-center"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="p-3 rounded-xl bg-cyan-500/20 mb-4">
              <RotateCcw className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs uppercase tracking-wider text-cyan-400 mb-3">Answer</span>
            <p className="text-lg font-medium text-foreground">{currentCard.answer}</p>
            <span className="absolute bottom-4 text-xs text-muted-foreground">
              Click to see question
            </span>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          onClick={goToPrevious}
          className="rounded-xl border-border hover:border-cyan-500/50 hover:bg-cyan-500/10"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Previous
        </Button>
        <Button
          size="lg"
          onClick={goToNext}
          className="rounded-xl bg-cyan-500 hover:bg-cyan-600 text-background"
        >
          Next
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  )
}
