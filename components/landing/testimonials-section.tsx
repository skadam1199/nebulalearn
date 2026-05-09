"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Quote } from "lucide-react"

const testimonials = [
  {
    quote: "NebulaLearn cut our students' review time in half. The AI outlines alone saved my department countless hours of re-watching recordings.",
    author: "Dr. Sarah Chen",
    role: "Dean of Engineering",
    institution: "Stanford University",
    avatar: "SC"
  },
  {
    quote: "The faculty insights heatmap is a game-changer. I can finally see which concepts students replay — and fix my explanations accordingly.",
    author: "Prof. Michael Torres",
    role: "Computer Science",
    institution: "MIT",
    avatar: "MT"
  },
  {
    quote: "Semantic search is unreal. I typed 'eigenvalue intuition' and it took me straight to the 34-minute mark. No more scrubbing.",
    author: "Emily Johnson",
    role: "Graduate Student",
    institution: "Harvard SEAS",
    avatar: "EJ"
  },
  {
    quote: "The multilingual support made NebulaLearn an instant win for our international cohorts. Summaries in their native language — brilliant.",
    author: "Dr. Robert Kim",
    role: "Vice Provost, Academic Innovation",
    institution: "UCLA",
    avatar: "RK"
  },
  {
    quote: "Knowing our data is 100% private was the deciding factor. Other tools wanted to train on our lecture content. NebulaLearn doesn't.",
    author: "Prof. Lisa Martinez",
    role: "Head of Psychology",
    institution: "NYU",
    avatar: "LM"
  },
  {
    quote: "Flashcard generation from a 90-minute lecture used to take a TA a full day. Now it takes 60 seconds. The quality is remarkable.",
    author: "Dr. James Wright",
    role: "Physics Professor",
    institution: "Caltech",
    avatar: "JW"
  }
]

const universities = [
  "Stanford", "MIT", "Harvard", "UCLA", "NYU", "UMD", "Caltech", "Yale", "Princeton", "Columbia", "Berkeley", "Cornell"
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-10 px-4 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              leading institutions
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Educators and students across top universities are already transforming how they use lecture videos.
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:bg-card/80 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                <Quote className="w-8 h-8 text-primary/40 mb-4" />
                <p className="text-foreground leading-relaxed mb-6 text-pretty">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-semibold text-sm">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-primary">{testimonial.institution}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Marquee logos section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20"
        >
          <p className="text-center text-sm text-muted-foreground mb-8 tracking-widest uppercase">
            Trusted by teams at
          </p>

          {/* Marquee container */}
          <div className="relative overflow-hidden w-full">
            {/* Left fade */}
            <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            {/* Right fade */}
            <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
              {/* First set */}
              {universities.map((uni) => (
                <span
                  key={`a-${uni}`}
                  className="mx-10 text-lg font-bold text-muted-foreground hover:text-primary transition-colors duration-200 cursor-default whitespace-nowrap"
                >
                  {uni}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {universities.map((uni) => (
                <span
                  key={`b-${uni}`}
                  className="mx-10 text-lg font-bold text-muted-foreground hover:text-primary transition-colors duration-200 cursor-default whitespace-nowrap"
                >
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  )
}