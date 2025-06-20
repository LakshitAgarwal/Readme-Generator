# Prompt to help LLM choose important files from the list
select_files_prompt = """
You are an experienced software engineer performing static analysis on a codebase to generate a high-level understanding of the application's structure and logic.

Below is the file tree of the entire project:
{file_tree}

From this list, identify and return only the most relevant files that are essential for understanding:
- The main functionality
- Application flow
- Configuration
- Routing (if any)
- Core business logic
- Key utilities or helpers

Avoid test files, style files (CSS, SCSS), images.

💡 Output Format (strictly):
"Only return the list of filenames as a clean JSON array of strings. No markdown formatting, no explanation. Example: ["index.html", "script.js"]"
"""

# Prompt to generate summary from a file
summarize_prompt = """
You are an AI assistant helping developers document codebases.

Your task is to summarize the purpose and functionality of the following file in clear and concise technical language. Focus on:
- What this file does
- Any important functions, classes, or components defined
- How it fits into the larger application

Filename: {filename}

File Content:
{content}

🔍 Notes:
- Mention important libraries used, if applicable.
- Highlight API routes, handlers, utility logic, etc., based on file type.
- Ignore internal implementation details unless necessary to understand functionality.

🎯 Output:
Return a short but descriptive paragraph or bullet summary. Use a professional tone.

"""

# Prompt to merge all summaries into a README
generate_readme_prompt = """
You are a world-class AI technical writer and markdown formatting expert. Your task is to generate a beautiful, developer-friendly, and comprehensive `README.md` file for a code repository based on the provided file summaries.

🔍 Your job is to:
- 1. **Project Overview**: Start with project heading and a summary of what the project does and what are its core features what problem it solves (if any).

- **Key Features**: Clearly list the most important features and capabilities of the project. Use bullet points and optionally elaborate in 1-2 lines each.

- **Tech Stack**: Present the technologies used in a clean bullet or table format. Try not to skip anything. include each and every tech stack that is used in any way. (e.g., frontend, backend, database, AI tools, build tools, etc.)

- **Getting Started / Setup Instructions**:
    - Prerequisites
    - Installation
    - Running locally

- Add a `📂 Project Structure` section that visually displays the folder hierarchy using a markdown code block (like a tree)

- Include **installation and setup** instructions if possible from context

- Ensure a **Screenshots** section with a proper heading but no images just leave space
- Finish with sections like **Contributing**, **License**, and **Contact** and also a heartfelt thanks message (if data allows)

🎨 Style Guidelines (make it look beautiful) :
- Use markdown (`#`, `##`, `-`, ` ``` `, etc.)
- Make it visually appealing using **emojis**
- Keep the tone friendly yet professional — imagine it being read by devs on GitHub
- Ensure all markdown renders cleanly and completely — **no broken sections or half-done formatting**
- Also use emojis to make it more appealing.

📥 Input: Summaries of core files in the project
{summaries}

📤 Output: A fully written and properly structured `README.md` file with the following ideal sections (if possible):
1. 🧠 Project Title + Description
2. 🚀 Features
3. 🛠️ Tech Stack
4. 📦 Installation
5. 💻 Usage
6. 📂 Project Structure (tree format)
7. 📸 Screenshots (just leave space)
8. 🤝 Contributing
9. 📝 License
10. 📬 Contact
11. 💖 Thanks Message

⚠️ IMPORTANT:
- Generate the full README in one go
- Don’t leave empty or broken markdown
- Use developer-friendly tone, clean formatting, and emojis tastefully

"""
