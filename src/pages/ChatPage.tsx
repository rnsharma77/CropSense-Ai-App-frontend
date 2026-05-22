import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { sendChatMessage } from "@/lib/api";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const ChatPage = () => {
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatWarning, setChatWarning] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi, I am your CropSense assistant. Ask about crop diseases, prevention, irrigation, or treatment best practices.",
    },
  ]);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || chatLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setChatError(null);
    setChatWarning(null);
    setChatLoading(true);

    try {
      const response = await sendChatMessage(userMessage.content, "English", "General farming assistance");
      if (!response.ok || !response.reply) {
        throw new Error(response.error || "No response from assistant");
      }

      if (response.fallback) {
        setChatWarning(response.warning || "Assistant is running in fallback mode.");
      }

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setChatError(error instanceof Error ? error.message : "Chat request failed");
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Farming Chat</h1>
            <p className="text-muted-foreground">Chat is now on its own dedicated page, separate from account actions.</p>
          </motion.div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" /> CropSense Assistant
              </CardTitle>
              <CardDescription>
                Ask crop and advisory questions. Your message is sent to the backend `/api/chat` endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-card-gradient p-4 h-[420px] overflow-y-auto space-y-3 mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`max-w-[90%] rounded-lg px-4 py-3 text-sm ${
                      message.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-accent text-accent-foreground prose prose-sm dark:prose-invert"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          h1: ({ node, ...props }) => <h1 className="text-lg font-bold mb-2" {...props} />,
                          h2: ({ node, ...props }) => <h2 className="text-base font-bold mb-2" {...props} />,
                          h3: ({ node, ...props }) => <h3 className="font-bold mb-1" {...props} />,
                          code: ({ node, inline, ...props }) =>
                            inline ? (
                              <code className="bg-black/20 px-1 rounded" {...props} />
                            ) : (
                              <code className="block bg-black/20 p-2 rounded mb-2 overflow-x-auto" {...props} />
                            ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                ))}
                {chatLoading ? (
                  <div className="mr-auto rounded-lg px-3 py-2 text-sm bg-accent text-accent-foreground inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                  </div>
                ) : null}
              </div>

              {chatError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive mb-3">
                  {chatError}
                </div>
              )}

              {chatWarning && (
                <div className="rounded-md border border-secondary/30 bg-secondary/10 px-3 py-2 text-sm text-secondary-foreground mb-3">
                  {chatWarning}
                </div>
              )}

              <form onSubmit={handleSend} className="space-y-3">
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask: What is the best organic treatment for leaf spot in tomato?"
                  className="min-h-[100px]"
                />
                <div className="flex justify-end">
                  <Button type="submit" className="bg-hero-gradient text-primary-foreground" disabled={chatLoading || !prompt.trim()}>
                    {chatLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Send Message
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChatPage;