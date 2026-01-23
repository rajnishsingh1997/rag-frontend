import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  isBusy: boolean;
  isReadingPdf: boolean;
  messages: ChatMessage[];
  question: string;
  isChatLoading: boolean;
  onQuestionChange: (value: string) => void;
  onAsk: (event: React.FormEvent<HTMLFormElement>) => void;
};

const ChatPanel = ({
  isBusy,
  isReadingPdf,
  messages,
  question,
  isChatLoading,
  onQuestionChange,
  onAsk,
}: ChatPanelProps) => {
  return (
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
        <div className="h-full overflow-y-auto pr-1">
          {isReadingPdf && isBusy ? (
            <div className="h-full rounded-2xl border border-dashed border-border/60 bg-background/70 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin" />
                <p className="text-sm">Processing...</p>
              </div>
            </div>
          ) : messages.length || isChatLoading ? (
            <div className="space-y-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground border border-border/60"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isChatLoading ? (
                <div className="flex justify-start">
                  <div className="max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm bg-background text-foreground border border-border/60">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:120ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:240ms]" />
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="h-full rounded-2xl border border-dashed border-border/60 bg-background/70 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {isReadingPdf
                  ? "PDF uploaded and ready. Ask a question to get started."
                  : "Start a conversation about your PDF."}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border/50 px-4 py-4">
        <form
          onSubmit={onAsk}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Input
            placeholder="Ask a question..."
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            disabled={isBusy || !isReadingPdf}
          />
          <Button type="submit" disabled={isBusy || !isReadingPdf}>
            Ask
          </Button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip: Ask for summaries, key points, or specific details.
        </p>
      </div>
    </section>
  );
};

export default ChatPanel;
