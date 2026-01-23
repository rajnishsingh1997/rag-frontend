import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import userAuthStore from "@/store/auth.store";
import { toast } from "sonner";
import ChatPanel, { type ChatMessage } from "@/components/chat/ChatPanel";

const Home = () => {
  const user = userAuthStore((state) => state.user);
  console.log("User in Home:", user);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "IDLE" | "UPLOADING" | "PROCESSING" | "READY" | "FAILED"
  >("IDLE");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const isReadingPdf = Boolean(selectedFile);
  const isBusy = uploadStatus === "UPLOADING" || uploadStatus === "PROCESSING";
  const pdfUrl = useMemo(() => {
    if (!selectedFile) return "";
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    if (isBusy) return;
    setSelectedFile(file);
    setMessages([]);
    if (!user?._id) {
      toast.error("Missing user id. Please login again.");
      return;
    }
    const formData = new FormData();
    formData.append("uploadedFile", file);
    formData.append("_id", String(user._id));
    try {
      setUploadStatus("UPLOADING");
      const uploadResponse = await api.post("/upload/docs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const documentId = uploadResponse?.data?.documentId;
      if (!documentId) {
        setUploadStatus("FAILED");
        toast.error("Upload failed. Missing document id.");
        return;
      }
      setUploadStatus("PROCESSING");
      const ingestionResponse = await api.post(`/doc/${documentId}/ingest`);
      if (
        ingestionResponse?.data?.message ===
        "Document ingestion completed successfully"
      ) {
        toast.success("Your PDF is processed and ready to chat.");
      }
      setUploadStatus("READY");
    } catch (error) {
      setUploadStatus("FAILED");
      console.error("Upload failed:", error);
      toast.error("Upload or ingestion failed. Please try again.");
    }
  };

  const handleAsk = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed) return;
    setIsChatLoading(true);
    try {
      const response = await api.post("/chat/ask", { question: trimmed });
      const answer = response?.data?.answer;
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      if (answer) {
        setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
      }
      setQuestion("");
    } catch (error) {
      console.error("Chat request failed:", error);
      toast.error("Chat request failed. Please try again.");
    } finally {
      setIsChatLoading(false);
    }
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
                disabled={isBusy}
              />
              <Button variant="outline" asChild disabled={isBusy}>
                <label htmlFor="pdfUpload">
                  {isBusy ? "Processing..." : "Upload PDF"}
                </label>
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
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border/60 bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {uploadStatus}
                  </span>
                  <Button size="sm" variant="ghost">
                    View
                  </Button>
                </div>
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

            <ChatPanel
              isBusy={isBusy}
              isReadingPdf={isReadingPdf}
              messages={messages}
              question={question}
              isChatLoading={isChatLoading}
              onQuestionChange={setQuestion}
              onAsk={handleAsk}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
