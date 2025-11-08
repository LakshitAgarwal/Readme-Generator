"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import ReadmeInfo from "./ReadmeInfo";
import HighlightedEditableCode from "./HighlightedEditableCode";
import { API_BASE_URL } from "@/lib/config";
// Magic UI terminal components for better log visualization
import {
  Terminal,
  AnimatedSpan,
  TypingAnimation,
} from "@/components/magicui/terminal";

import StarArrowHint from "@/components/StarArrowHint";
import { motion } from "motion/react";

interface MyReadmeComponentProps {
  onBackToHome: () => void;
}

export default function MyReadmeComponent({
  onBackToHome,
}: MyReadmeComponentProps) {
  const [readmeContent, setReadmeContent] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectFolder, setProjectFolder] = useState<string | null>(null);

  // Ref for auto-scrolling terminal
  const terminalRef = useRef<HTMLDivElement>(null);

  // Determine log color based on content
  const getLogClass = (log: string) => {
    // Colour key-switch logs blue and retry warnings yellow (handle possible prefixes)
    if (log.includes("[RETRY]")) return "text-yellow-400";
    if (log.includes("🔁")) return "text-green-400";
    if (log.startsWith("❌") || /error/i.test(log)) return "text-red-500";
    if (/✔|✓|✅|success/i.test(log)) return "text-green-500";
    if (/⚠|warn|warning/i.test(log)) return "text-yellow-400";
    if (/ℹ|info/i.test(log)) return "text-blue-400";
    return "text-gray-300 text-wrap";
  };

  /**
   * Parse individual SSE message chunks ("data: ...\n\n") coming from backend
   * basically SSE se data jaise aa raha usko as it is nhi dikha skte to usko sudhar rahe
   */
  const handleSSEMessage = (raw: string) => {
    // Remove the leading "data:" if present and trim white-space
    const data = raw.replace(/^data:\s*/, "").trim();

    if (!data) return;

    if (data.startsWith("[README]")) {
      // The rest is base64-encoded README markdown
      const base64 = data.replace("[README]", "");
      try {
        const binary = window.atob(base64);
        const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
        const decoded = new TextDecoder("utf-8").decode(bytes);
        setReadmeContent(decoded);
      } catch (e) {
        console.error("Failed to decode README content", e);
      }
      setLoading(false);
    } else if (data.startsWith("[DONE]")) {
      // Generation completed – README will arrive in a separate event
    } else if (data.startsWith("[ERROR]")) {
      // Error message from backend
      setLogs((prev) => [...prev, `❌ ${data}`]);
      setLoading(false);
    } else {
      // Regular or retry log line – shorten noisy retry errors
      const displayLog = data.includes("[RETRY]")
        ? "⚠️ Rate limit hit – don't worry we are switching API key…"
        : data;
      setLogs((prev) => [...prev, displayLog]);
    }
  };

  // Extract project name from folder path
  const getProjectName = (folder: string | null) => {
    if (!folder) return undefined;
    const parts = folder.split("/");
    return parts[parts.length - 1]
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Generate README
  useEffect(() => {
    const githubLink = localStorage.getItem("githubLink");
    
    // If no GitHub link is found, redirect back to home
    if (!githubLink) {
      console.warn("No GitHub link found in localStorage, redirecting to home");
      onBackToHome();
      return;
    }

    async function generateReadme(link: string) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/generate-readme`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ githubLink: link }),
        });

        if (!response.ok || !response.body) {
          throw new Error(`Failed with status ${response.status}`);
        }

        const folderName = link.split("/").pop() || null;
        setProjectFolder(folderName);

        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // Split on double new-line which signifies end of an SSE event
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || ""; // keep incomplete chunk in buffer

          parts.forEach(handleSSEMessage);
        }

        // Handle any remaining buffered data
        if (buffer) handleSSEMessage(buffer);
      } catch (err) {
        console.error("Error streaming README generation:", err);
        setLogs((prev) => [
          ...prev,
          `❌ Error streaming README generation: ${String(err)}`,
        ]);
        setLoading(false);
      }
    }

    generateReadme(githubLink);
  }, [onBackToHome]);

  // Auto-scroll to bottom when new logs are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <main>
      {loading ? (
        <div className="w-full px-8 py-8 space-y-8">
          {/* Center heading section */}
          <div className="text-center space-y-3">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"
            >
              README Magic ✨
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-gray-600 text-xl font-medium"
            >
              We&apos;re crafting your perfect README
            </motion.p>
          </div>

          {/* Terminal and arrow section */}
          <div className="flex w-full justify-center items-start gap-8">
            <Terminal
              ref={terminalRef}
              className="flex-1 overflow-y-auto bg-black p-6 font-mono text-sm shadow-2xl shadow-rose-300/80 rounded-xl"
            >
              {logs.length === 0 ? (
                <TypingAnimation className="text-gray-400">
                  Waiting for logs...
                </TypingAnimation>
              ) : (
                logs.map((log, idx) => (
                  <AnimatedSpan key={idx} className={getLogClass(log)}>
                    {log}
                  </AnimatedSpan>
                ))
              )}
            </Terminal>

            <div className="w-[30%] hidden md:flex justify-end items-start">
              <StarArrowHint />
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row-reverse justify-between md:px-24 px-4 md:my-10 my-4">
            <div className="flex items-center justify-between">
              <div className="mb-6">
                <Button
                  onClick={onBackToHome}
                  variant="outline"
                  className="flex items-center rounded-full gap-2  cursor-pointer transition-all duration-200 ease-in-out border border-rose-500 shadow-md shadow-rose-100 hover:bg-rose-100/50"
                >
                  <ArrowLeft className="md:h-4 md:w-4 h-3 w-3 text-rose-500" />
                  Back to Home
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <ReadmeInfo
                projectName={getProjectName(projectFolder)}
                isLoading={false}
              />
            </div>
          </div>

          <HighlightedEditableCode readmeContent={readmeContent} />
        </>
      )}
    </main>
  );
}
