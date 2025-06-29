import express, { Request, Response, NextFunction } from "express";
import { prepareClonePath } from "../utils/make-dir";
import { cloneRepo } from "../utils/clone-repo";
import path from "path";
import fs from "fs";
import { exec } from "child_process";
import util from "util";
import { readFile } from "fs/promises";

const router = express.Router();
const execPromise = util.promisify(exec);

// POST /api/generate-readme
router.post(
  "/generate-readme",
  async (req: Request, res: Response): Promise<void> => {
    let finalDestination = "";
    try {
      const { githubLink } = req.body;
      if (!githubLink) {
        res.status(400).json({ error: "Github link is required" });
        return;
      }

      console.log(`Starting README generation for: ${githubLink}`);

      // this will make the directory. function is called.
      finalDestination = prepareClonePath(githubLink);

      //cloning the repo
      console.log(`Cloning repository to: ${finalDestination}`);
      await cloneRepo(githubLink, finalDestination);

      // 📌 Call the Python agent - path within backend directory
      const pythonScriptPath = path.resolve(
        __dirname,
        "..",
        "..",
        "python",
        "agents_groq.py"
      );

      // Use system python (Render doesn't need venv)
      const pythonCommand =
        process.env.NODE_ENV === "production"
          ? "python"
          : path.resolve(
              __dirname,
              "..",
              "..",
              "python",
              "venv",
              "bin",
              "python"
            );

      console.log(`Running Python script: ${pythonScriptPath}`);
      const { stdout } = await execPromise(
        `${pythonCommand} ${pythonScriptPath} ${finalDestination}`,
        { timeout: 240000 } // 4 minutes timeout
      );

      const readmePath = path.join(finalDestination, "readme.md");

      console.log(`README generated successfully at: ${readmePath}`);

      // You can return the summary here or pass it to GPT for README gen
      res.json({ readme: stdout.trim(), path: readmePath });
    } catch (err) {
      console.error("Error in README generation:", err);

      // Clean up on error
      if (finalDestination && fs.existsSync(finalDestination)) {
        try {
          fs.rmSync(finalDestination, { recursive: true, force: true });
          console.log(`Cleaned up directory: ${finalDestination}`);
        } catch (cleanupErr) {
          console.error("Error during cleanup:", cleanupErr);
        }
      }

      res.status(500).json({
        error: "README generation failed",
        details: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }
);

// GET /api/check-readme
router.get("/check-readme", (req: Request, res: Response): void => {
  const folder = req.query.folder as string;

  if (!folder) {
    console.log("❌ check-readme: Missing folder name");
    res.status(400).json({ error: "Missing folder name" });
    return;
  }

  const readmePath = path.join(
    __dirname,
    "..",
    "..",
    "temp",
    folder,
    "readme.md"
  );
  const exists = fs.existsSync(readmePath);

  console.log(
    `🔍 check-readme: folder=${folder}, path=${readmePath}, exists=${exists}`
  );
  res.json({ exists });
});

// GET /api/get-readme
router.get("/get-readme", (req: Request, res: Response): void => {
  const folder = req.query.folder as string;

  if (!folder) {
    console.log("❌ get-readme: Missing folder name");
    res.status(400).json({ error: "Missing folder name" });
    return;
  }

  const readmePath = path.join(
    __dirname,
    "..",
    "..",
    "temp",
    folder,
    "readme.md"
  );

  console.log(`📖 get-readme: attempting to read from ${readmePath}`);

  try {
    const content = fs.readFileSync(readmePath, "utf-8");
    console.log(
      `✅ get-readme: successfully read ${content.length} characters`
    );
    res.json({ content });
  } catch (err) {
    console.error(`❌ get-readme: failed to read file`, err);
    res.status(404).json({ error: err });
  }
});

// GET /api/get-readme/:folder
router.get(
  "/get-readme/:folder",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const folder = req.params.folder;
      const readmePath = path.join(
        __dirname,
        "..",
        "..",
        "temp",
        folder,
        "readme.md"
      );

      const content = await readFile(readmePath, "utf-8");

      res.json({ readme: content });
    } catch (error) {
      console.error("README not found:", error);
      res.status(404).json({ error: "README not found" });
    }
  }
);

export default router;
