import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import userAuthStore from "@/store/auth.store";

const Home = () => {
  const user = userAuthStore((state) => state.user);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const isReadingPdf = Boolean(selectedFile);
  const pdfUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-6 bg-muted/30 border-y border-border/40 sm:px-6">
        <div className="mx-auto w-full max-w-6xl space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Workspace</p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Chat with your PDF's
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                id="pdfUpload"
                className="hidden"
              />
              <Button variant="outline" asChild>
                <label htmlFor="pdfUpload">Upload PDF</label>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            <section className="rounded-2xl border border-border/60 bg-card/70 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Uploaded PDF</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </p>
                </div>
                <Button size="sm" variant="ghost">
                  View
                </Button>
              </div>
              <div className="h-[45vh] overflow-y-auto px-4 py-4 sm:h-[52vh] lg:h-[62vh]">
                {selectedFile ? (
                  <div className="rounded-xl border border-border/60 bg-background p-2 shadow-sm">
                    <object
                      data={pdfUrl}
                      type="application/pdf"
                      className="h-[38vh] w-full rounded-lg sm:h-[46vh] lg:h-[56vh]"
                    >
                      <p className="text-sm text-muted-foreground">
                        PDF preview is not supported in this browser.
                      </p>
                    </object>
                  </div>
                ) : (
                  <div className="h-full rounded-2xl border border-dashed border-border/60 bg-background/70 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Upload a PDF to preview it here.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border/60 bg-card/70 shadow-sm flex flex-col min-h-[55vh]">
              <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
                <div>
                  <p className="text-sm font-medium">Chat</p>
                  <p className="text-xs text-muted-foreground">
                    Ask questions about your document
                  </p>
                </div>
              </div>
              <div className="flex-1 px-4 py-6">
                <div className="h-full rounded-2xl border border-dashed border-border/60 bg-background/70 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    {isReadingPdf
                      ? "PDF uploaded. Ask a question to get started."
                      : "Start a conversation about your PDF."}
                  </p>
                </div>
              </div>
              <div className="border-t border-border/50 px-4 py-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Input placeholder="Ask a question..." />
                  <Button>Ask</Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Tip: Ask for summaries, key points, or specific details.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
