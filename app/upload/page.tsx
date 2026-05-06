"use client"
import React, { useState } from "react"
import { Navbar } from "@/components/navbar"
import { FileUploader } from "@/components/upload/file-uploader"
import { FileSpreadsheet, Shield, Zap, Info, ChevronRight, Activity } from "lucide-react"

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleUseSample = (name: string) => {
    // Mock sample data content
    const sampleCSV = name === "Customer CRM Data" 
      ? "id,name,email,phone,status\n1,John Doe,john@example.com,555-0199,Active\n2,Jane Smith,,555-0122,Pending\n3,Bob Wilson,bob@gmail.com,invalid_phone,Active"
      : "item_id,quantity,price,location,last_updated\nSKU-100,45,29.99,Warehouse A,2023-01-01\nSKU-101,,15.50,Warehouse B,2023-01-05\nSKU-102,12,0.00,Unknown,N/A";
    
    const file = new File([sampleCSV], `${name.toLowerCase().replace(/ /g, "_")}.csv`, { type: "text/csv" });
    setSelectedFile(file);
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <Navbar />
      <main className="px-6 py-12 lg:px-12 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Upload Column */}
          <div className="xl:col-span-7 space-y-10">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-foreground flex items-center gap-3 font-heading">
                Ingest Dataset
                <span className="text-xs font-normal px-2 py-1 bg-primary/10 text-primary rounded-full uppercase tracking-widest">v2.4</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Deploy our neural profiling engine on your raw data. Supports high-volume CSV, Excel, and structured JSON payloads.
              </p>
            </div>

            <div className="p-1 bg-gradient-to-br from-primary/20 via-transparent to-primary/5 rounded-[2rem]">
              <div className="bg-background rounded-[1.8rem] p-2 shadow-2xl shadow-primary/5">
                <FileUploader 
                  externalFile={selectedFile} 
                  onFileChange={setSelectedFile} 
                />
              </div>
            </div>

            {/* Horizontal Scaling Capability Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Zap, title: "Streaming Analysis", val: "Sub-50ms" },
                { icon: Activity, title: "Memory Latency", val: "2.4ms" },
                { icon: Shield, title: "Encrypted State", val: "AES-256" }
              ].map(stat => (
                <div key={stat.title} className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card/30">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{stat.title}</div>
                    <div className="text-sm font-bold">{stat.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contextual Sidebar Column */}
          <div className="xl:col-span-5 space-y-12">
            
            {/* Try Sample Data - Horizontal Scaling Component */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Reference Samples
                  <Info className="h-4 w-4 text-muted-foreground" />
                </h3>
              </div>
              
              <div className="flex flex-col gap-3">
                {[
                  { name: "Customer CRM Data", size: "2.4 MB", rows: "5k", desc: "Missing emails and malformed phone numbers." },
                  { name: "Inventory Logistics", size: "1.1 MB", rows: "12k", desc: "Inconsistent timestamps and null quantities." },
                  { name: "Sales Performance", size: "3.2 MB", rows: "8k", desc: "Currency conflicts and duplicate transaction IDs." }
                ].map(sample => (
                  <button 
                    key={sample.name} 
                    onClick={() => handleUseSample(sample.name)}
                    className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-background hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all text-left"
                  >
                    <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-bold">{sample.name}</div>
                        <div className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-mono">{sample.rows} rows</div>
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{sample.desc}</div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all self-center" />
                  </button>
                ))}
              </div>
            </section>

            {/* Technical Specifications */}
            <section className="p-8 rounded-[2rem] bg-secondary/50 border border-border/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Ingestion Constraints</h3>
              <div className="space-y-4">
                {[
                  { label: "Max Payload", val: "50.00 MB" },
                  { label: "Buffer Encoding", val: "UTF-8/16" },
                  { label: "Parallel Workers", val: "8 (WASM)" },
                  { label: "Schema Inference", val: "Strict Mode" }
                ].map(item => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-mono text-primary font-bold">{item.val}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-8 border-t border-border/50">
                <div className="flex items-center gap-3 text-xs text-muted-foreground leading-relaxed">
                  <Shield className="h-8 w-8 text-emerald-500 shrink-0" />
                  <p>All data processed locally via WebAssembly. No datasets are persisted to permanent storage unless explicitly requested for training cycles.</p>
                </div>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  )
}
