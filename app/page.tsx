"use client"

import Link from "next/link"
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Zap, 
  BarChart3, 
  Wand2, 
  CheckCircle2,
  Database,
  Leaf
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Simple Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 w-full items-center justify-between px-6 lg:px-12">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <Leaf className="h-4 w-4" />
            </div>
            <span className="text-xl font-bold tracking-tight">Data Sanitizer Pro</span>
          </div>
          <div className="hidden md:flex flex-1 justify-center items-center gap-12">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Methodology</Link>
            <Link href="#feedback" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Feedback</Link>
          </div>
          <Button asChild size="sm" className="rounded-full px-5">
            <Link href="/upload">Launch Platform</Link>
          </Button>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="w-full px-6 lg:px-12 relative z-10">
            <div className="w-full text-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Enterprise Data Intelligence</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl font-bold tracking-tight text-foreground sm:text-8xl mb-8 font-heading"
              >
                Pristine data for <br />
                <span className="text-primary italic">smarter</span> analytics.
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg leading-relaxed text-muted-foreground mb-10 max-w-4xl mx-auto"
              >
                Data Sanitizer Pro automatically profiles, cleans, and optimizes your datasets 
                using advanced statistical heuristics and machine learning.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
              >
                <Button asChild size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20">
                  <Link href="/upload">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  <Link href="#how-it-works">View Methodology</Link>
                </Button>
              </motion.div>

              {/* Running Feedback Simulation */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mx-auto max-w-xl p-4 rounded-2xl bg-black/5 border border-primary/10 backdrop-blur-sm text-left font-mono text-xs"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-primary/5 pb-2">
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/50" />
                  </div>
                  <span className="text-primary/60 uppercase tracking-tighter">Live Sanitization Feed</span>
                </div>
                <div className="space-y-1.5 overflow-hidden">
                  <div className="flex justify-between items-center text-primary">
                    <span>[PROCESS] Analyzing `customer_v4_final.csv`</span>
                    <span className="text-[10px] opacity-50">0.4ms</span>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>[SIGNAL] Detected 42 redundant headers</span>
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>[HEURISTIC] Imputing missing `email` fields via fuzzy matching</span>
                    <motion.div 
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="h-1.5 w-12 bg-primary/20 rounded-full overflow-hidden"
                    >
                      <motion.div 
                        animate={{ x: [-48, 48] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="h-full w-6 bg-primary" 
                      />
                    </motion.div>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>[OUTPUT] Exporting sanitized partition...</span>
                    <span className="text-[10px] opacity-50 italic">Waiting</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-50">
             <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
             <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
          </div>
        </section>

        {/* Core Capabilities */}
        <section id="features" className="py-24 bg-white/50 border-y border-border/50">
          <div className="w-full px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { 
                  icon: BarChart3, 
                  title: "Statistical Profiling", 
                  desc: "Instant distribution analysis, outlier detection, and schema validation." 
                },
                { 
                  icon: Wand2, 
                  title: "Automated Cleaning", 
                  desc: "Intelligent imputation, deduplication, and type normalization in one click." 
                },
                { 
                  icon: Shield, 
                  title: "ML Readiness", 
                  desc: "Ensures your data meets the rigorous standards of modern model training." 
                }
              ].map((feature, i) => (
                <motion.div 
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works / Flowchart Section */}
        <section id="how-it-works" className="py-24 overflow-hidden">
          <div className="w-full px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-heading">How Data Sanitizer Pro Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform orchestrates a multi-stage pipeline to transform raw data into enterprise-grade assets.
              </p>
            </div>

            <div className="relative">
              {/* Connection Line (Desktop) */}
              <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 -translate-y-1/2 z-0" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                {[
                  {
                    step: "01",
                    title: "Smart Ingestion",
                    desc: "Our high-performance parser handles CSV, Excel, and JSON. It automatically detects delimiters, encodings, and nested structures while validating against schema constraints.",
                    icon: Database
                  },
                  {
                    step: "02",
                    title: "Advanced Profiling",
                    desc: "Utilizing statistical distributions and neural pattern matching, we identify missing values (MCAR/MAR), semantic outliers, and data drift across your entire dataset.",
                    icon: BarChart3
                  },
                  {
                    step: "03",
                    title: "Automated Sanitization",
                    desc: "Intelligent strategies are applied: KNN imputation for missing values, Z-score normalization, and fuzzy deduplication using Levenshtein distance metrics.",
                    icon: Wand2
                  },
                  {
                    step: "04",
                    title: "Verified Delivery",
                    desc: "Receive your sanitized data along with a detailed quality scorecard. Our ML-readiness index ensures your data is optimized for training and inference.",
                    icon: CheckCircle2
                  }
                ].map((item, i) => (
                  <motion.div 
                    key={item.step}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative p-8 rounded-3xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="absolute -top-4 -right-4 text-6xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">
                      {item.step}
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Running Feedback / Testimonials Section */}
        <section id="feedback" className="py-24 bg-primary/5 relative overflow-hidden">
          <div className="w-full px-6 lg:px-12">
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Platform Pulse</h2>
                <p className="text-muted-foreground">
                  Real-time feedback from data scientists and engineers leveraging Data Sanitizer Pro.
                </p>
              </div>
              <div className="flex gap-8 py-4 px-8 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1.2M+</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Rows Cleaned</div>
                </div>
                <div className="h-8 w-px bg-border/50 self-center" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.8%</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest">Accuracy</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  quote: "Data Sanitizer Pro cut our data prep time by 70%. The outlier detection is frighteningly accurate.",
                  author: "Sarah Chen",
                  role: "Lead Data Scientist, TechFlow",
                  avatar: "SC"
                },
                {
                  quote: "The ML-readiness score is a game changer. We no longer waste GPU cycles on dirty data.",
                  author: "Marcus Thorne",
                  role: "ML Engineer, Horizon AI",
                  avatar: "MT"
                },
                {
                  quote: "Finally, a data cleaning tool that understands semantic context rather than just regex.",
                  author: "Elena Rodriguez",
                  role: "Director of Analytics, DataCore",
                  avatar: "ER"
                }
              ].map((testimonial, i) => (
                <motion.div 
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-3xl bg-background border border-border/50 flex flex-col justify-between"
                >
                  <p className="text-lg italic text-foreground/80 mb-8 font-medium">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
        </section>

        {/* New Section: Supported Scenarios */}
        <section className="py-24 border-t border-border/50">
          <div className="w-full px-6 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Designed for Every Data Challenge</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  From messy CRM exports to high-frequency sensor logs, Data Sanitizer Pro provides the specialized heuristics needed for your specific domain.
                </p>
                <div className="space-y-6">
                  {[
                    { title: "Machine Learning Research", desc: "Remove noise and normalize features to prevent model bias and improve convergence rates." },
                    { title: "Business Intelligence", desc: "Deduplicate customer records and standardize addresses for accurate regional reporting." },
                    { title: "Financial Auditing", desc: "Detect transaction anomalies and reconcile fragmented ledger entries with high precision." }
                  ].map(scenario => (
                    <div key={scenario.title} className="flex gap-4">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-foreground">{scenario.title}</h4>
                        <p className="text-sm text-muted-foreground">{scenario.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Leaf className="h-32 w-32" />
                </div>
                <h3 className="text-xl font-bold mb-4 italic text-primary">Technical Edge</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Memory-Safe", val: "Rust-Engine" },
                    { label: "Concurrency", val: "Parallel Ops" },
                    { label: "Security", val: "AES-256" },
                    { label: "Uptime", val: "99.9% SLA" }
                  ].map(stat => (
                    <div key={stat.label} className="p-4 bg-background rounded-2xl border border-border/50 shadow-sm">
                      <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-1">{stat.label}</div>
                      <div className="text-sm font-bold">{stat.val}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 p-6 bg-primary rounded-2xl text-white shadow-lg shadow-primary/20">
                  <div className="text-xs uppercase tracking-widest opacity-70 mb-2">Platform Performance</div>
                  <div className="text-2xl font-bold mb-4">500ms Response</div>
                  <p className="text-xs opacity-90 leading-relaxed">
                    Our distributed compute layer ensures that even multi-gigabyte datasets are profiled and ready for sanitization in sub-second latency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>


      </main>

      <footer className="py-12 border-t border-border/50 text-center">
        <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
          <Leaf className="h-4 w-4" />
          <span className="font-bold">Data Sanitizer Pro</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Data Sanitizer Pro. Enterprise Data Sanitization.
        </p>
      </footer>
    </div>
  )
}
