"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YouTubePlayer } from "@/components/results/youtube-player"
import { TimestampedOutline } from "@/components/results/timestamped-outline"
import { OutlineTab } from "@/components/results/outline-tab"
import { SummariesTab } from "@/components/results/summaries-tab"
import { FlashcardsTab } from "@/components/results/flashcards-tab"
import { SearchTab } from "@/components/results/search-tab"
import { FileText, BookOpen, Layers, Search, ArrowLeft } from "lucide-react"

// Sample data - in production this would come from your AI processing backend
const sampleVideoId = "dQw4w9WgXcQ" // Replace with actual educational video

const sampleOutlineItems = [
  { id: "1", timestamp: 0, title: "Introduction to Machine Learning" },
  { id: "2", timestamp: 120, title: "Supervised vs Unsupervised Learning" },
  { id: "3", timestamp: 300, title: "Neural Network Fundamentals" },
  { id: "4", timestamp: 480, title: "Training and Backpropagation" },
  { id: "5", timestamp: 720, title: "Practical Applications" },
  { id: "6", timestamp: 900, title: "Common Pitfalls and Solutions" },
  { id: "7", timestamp: 1080, title: "Summary and Next Steps" },
]

const sampleOutlineSections = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    timestamp: 0,
    content: [
      "Definition and scope of machine learning",
      "Historical context and evolution",
      "Key differences from traditional programming",
      "Real-world applications overview",
    ],
  },
  {
    id: "2",
    title: "Supervised vs Unsupervised Learning",
    timestamp: 120,
    content: [
      "Labeled vs unlabeled data",
      "Classification and regression tasks",
      "Clustering and dimensionality reduction",
      "When to use each approach",
    ],
  },
  {
    id: "3",
    title: "Neural Network Fundamentals",
    timestamp: 300,
    content: [
      "Neurons and activation functions",
      "Layers: input, hidden, and output",
      "Forward propagation explained",
      "Loss functions and optimization",
    ],
  },
  {
    id: "4",
    title: "Training and Backpropagation",
    timestamp: 480,
    content: [
      "Gradient descent algorithm",
      "Chain rule in neural networks",
      "Learning rate and its importance",
      "Batch vs stochastic gradient descent",
    ],
  },
]

const sampleSummaries = {
  "90sec": `Machine learning enables computers to learn from data without explicit programming. The two main types are supervised learning (using labeled data) and unsupervised learning (finding patterns in unlabeled data). Neural networks, inspired by the brain, use layers of interconnected nodes to process information. Training involves backpropagation, which adjusts network weights to minimize prediction errors.`,
  "5min": `Machine learning is a subset of AI that allows systems to automatically learn and improve from experience. Unlike traditional programming where rules are explicitly coded, ML algorithms identify patterns in data to make predictions or decisions.

There are two primary paradigms: supervised learning uses labeled datasets where the correct output is known, while unsupervised learning discovers hidden patterns in unlabeled data. Common supervised tasks include classification and regression, while unsupervised methods include clustering and dimensionality reduction.

Neural networks form the backbone of modern ML. They consist of layers of artificial neurons that process information through weighted connections. The input layer receives data, hidden layers perform transformations, and the output layer produces predictions.

Training neural networks relies on backpropagation, an algorithm that calculates how much each weight contributed to the error, then adjusts weights accordingly using gradient descent. The learning rate controls how large these adjustments are—too high causes instability, too low means slow learning.`,
  full: `[Full comprehensive notes would appear here with all details from the lecture, including examples, equations, and additional context. This section would typically be 2-3x longer than the 5-minute summary, covering every topic in depth with practical examples and code snippets where relevant.]

Machine learning represents a fundamental shift in how we approach problem-solving with computers. Traditional programming requires developers to explicitly define rules and logic for every scenario. Machine learning, in contrast, enables systems to discover these rules automatically by analyzing patterns in data.

The field emerged from the recognition that many real-world problems are too complex for rule-based approaches. Consider email spam detection: writing explicit rules for every type of spam would be impractical and quickly outdated. ML systems instead learn to identify spam by studying thousands of examples.

Supervised learning is the most common paradigm, where algorithms learn from labeled training data. Each training example consists of an input (features) and the correct output (label). The algorithm's goal is to learn a mapping function that can accurately predict labels for new, unseen inputs.

[Additional sections would continue with similar depth...]`,
}

const sampleFlashcards = [
  {
    id: "1",
    question: "What is the key difference between supervised and unsupervised learning?",
    answer: "Supervised learning uses labeled data with known outputs, while unsupervised learning finds patterns in unlabeled data without predefined categories.",
  },
  {
    id: "2",
    question: "What is backpropagation?",
    answer: "Backpropagation is an algorithm that calculates the gradient of the loss function with respect to each weight, allowing neural networks to learn by adjusting weights to minimize prediction errors.",
  },
  {
    id: "3",
    question: "What are the three types of layers in a neural network?",
    answer: "Input layer (receives data), hidden layers (perform transformations), and output layer (produces predictions).",
  },
  {
    id: "4",
    question: "What is the purpose of an activation function?",
    answer: "Activation functions introduce non-linearity into neural networks, allowing them to learn complex patterns that cannot be represented by linear transformations alone.",
  },
  {
    id: "5",
    question: "What happens if the learning rate is too high?",
    answer: "If the learning rate is too high, the optimization process becomes unstable and may overshoot the optimal weights, causing the loss to oscillate or diverge instead of converging.",
  },
]

export default function ResultsPage() {
  const [currentTime, setCurrentTime] = useState(0)

  const handleSeek = useCallback((timestamp: number) => {
    // In production, this would control the YouTube player
    setCurrentTime(timestamp)
    const iframe = document.getElementById("youtube-player") as HTMLIFrameElement
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: "seekTo",
          args: [timestamp, true],
        }),
        "*"
      )
    }
  }, [])

  const handleSearch = useCallback((query: string) => {
    // This would call your AI semantic search backend
    return []
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Dashboard</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-background"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <span className="text-xl font-bold text-foreground">NebulaLearn</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Video Player + Timestamped Outline (40%) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-[40%] space-y-4"
          >
            <div className="sticky top-24">
              {/* Video Player */}
              <YouTubePlayer 
                videoId={sampleVideoId} 
                onTimeUpdate={setCurrentTime}
              />

              {/* Timestamped Outline */}
              <div className="mt-4 p-4 rounded-xl bg-card/30 border border-border backdrop-blur-sm">
                <TimestampedOutline 
                  items={sampleOutlineItems}
                  currentTime={currentTime}
                  onSeek={handleSeek}
                />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Tabs (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-[60%]"
          >
            <Tabs defaultValue="outline" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-14 p-1 bg-secondary/50 rounded-xl backdrop-blur-sm mb-6">
                <TabsTrigger 
                  value="outline" 
                  className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Outline
                </TabsTrigger>
                <TabsTrigger 
                  value="summaries"
                  className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Summaries
                </TabsTrigger>
                <TabsTrigger 
                  value="flashcards"
                  className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all"
                >
                  <Layers className="w-4 h-4 mr-2" />
                  Flashcards
                </TabsTrigger>
                <TabsTrigger 
                  value="search"
                  className="rounded-lg data-[state=active]:bg-cyan-500 data-[state=active]:text-background data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 transition-all"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </TabsTrigger>
              </TabsList>

              <div className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur-sm min-h-[500px]">
                <TabsContent value="outline" className="mt-0">
                  <OutlineTab sections={sampleOutlineSections} onSeek={handleSeek} />
                </TabsContent>

                <TabsContent value="summaries" className="mt-0">
                  <SummariesTab summaries={sampleSummaries} />
                </TabsContent>

                <TabsContent value="flashcards" className="mt-0">
                  <FlashcardsTab flashcards={sampleFlashcards} />
                </TabsContent>

                <TabsContent value="search" className="mt-0">
                  <SearchTab onSearch={handleSearch} onSeek={handleSeek} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
