"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import ReadmeInfo from "./ReadmeInfo";
import HighlightedEditableCode from "./HighlightedEditableCode";
import ShimmerCodeEditor from "./ShimmerCodeEditor";
import { API_BASE_URL } from "@/lib/config";

interface MyReadmeComponentProps {
  onBackToHome: () => void;
}

export default function MyReadmeComponent({
  onBackToHome,
}: MyReadmeComponentProps) {
  const [readmeContent, setReadmeContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [projectFolder, setProjectFolder] = useState<string | null>(null);

  // Extract project name from folder path
  const getProjectName = (folder: string | null) => {
    if (!folder) return undefined;
    // Extract the last part of the folder path as project name
    const parts = folder.split("/");
    const projectName = parts[parts.length - 1];

    // Format: replace hyphens/underscores with spaces and capitalize each word
    return projectName
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 100; // 30x2s = 60s max

    const checkForReadme = async (folder: string) => {
      try {
        console.log(`🔍 Checking for README in folder: ${folder}`);
        const res = await fetch(
          `${API_BASE_URL}/api/check-readme?folder=${folder}`
        );

        if (!res.ok) {
          console.error(`❌ Check README request failed: ${res.status}`);
          return false;
        }

        const { exists } = await res.json();
        console.log(`📁 README exists: ${exists}`);

        if (exists) {
          console.log(`📖 Fetching README content...`);
          const readmeRes = await fetch(
            `${API_BASE_URL}/api/get-readme?folder=${folder}`
          );

          if (!readmeRes.ok) {
            console.error(`❌ Get README request failed: ${readmeRes.status}`);
            return false;
          }

          const { content } = await readmeRes.json();
          console.log(
            `✅ README content fetched: ${content.length} characters`
          );
          setReadmeContent(content);
          setLoading(false);
          return true;
        }
        return false;
      } catch (error) {
        console.error(`❌ Error checking for README:`, error);
        return false;
      }
    };

    const interval = setInterval(async () => {
      // First check if we have a folder name
      const folder = localStorage.getItem("projectFolder");

      if (folder && folder !== projectFolder) {
        setProjectFolder(folder);
        console.log("📂 Found folder name:", folder);
      }

      if (folder) {
        console.log(
          `🔄 Attempt ${
            attempts + 1
          }/${maxAttempts}: Checking for README in folder: ${folder}`
        );
        // If we have a folder, check for README
        const found = await checkForReadme(folder);
        if (found) {
          clearInterval(interval);
          return;
        }
      } else {
        console.log(
          `⏳ Attempt ${
            attempts + 1
          }/${maxAttempts}: Waiting for folder name...`
        );
      }

      attempts++;
      if (attempts >= maxAttempts) {
        console.log("⏰ Timeout reached, stopping polling");
        clearInterval(interval);
        setLoading(false);
        setReadmeContent("❌ Timed out while waiting for README generation.");
      }
    }, 2000); // poll every 2s

    return () => clearInterval(interval);
  }, [projectFolder]);

  return (
    <main>
      {loading ? (
        <ShimmerCodeEditor />
      ) : (
        <>
          <div className="flex flex-row-reverse justify-between px-24 my-10">
            <div className="flex items-center justify-between">
              <div className="mb-6">
                <Button
                  onClick={onBackToHome}
                  variant="outline"
                  className="flex items-center rounded-full gap-2  cursor-pointer transition-all duration-200 ease-in-out border border-rose-500 shadow-md shadow-rose-100 hover:bg-rose-100/50"
                >
                  <ArrowLeft className="h-4 w-4 text-rose-500" />
                  Back to Home
                </Button>
              </div>
            </div>

            {/* ReadmeInfo Section - Show when not loading */}
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
