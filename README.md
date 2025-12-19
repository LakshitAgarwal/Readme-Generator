# 🧠 README Generator Project
This project is a comprehensive solution for automating the analysis and documentation of codebases. It utilizes a large language model (LLM) to select important files, summarize their content, and generate a README document. The project aims to simplify the process of understanding and documenting complex codebases, making it easier for developers to collaborate and maintain their projects.

## 🚀 Key Features
- **Automated File Selection**: Uses an LLM to identify the most relevant files in a codebase.
- **File Summarization**: Generates concise summaries of each selected file's content.
- **README Generation**: Compiles the summaries into a comprehensive README document.
- **LLM Fallback Mechanism**: Ensures reliability by rotating through multiple LLM providers and API keys.
- **Modular Design**: Allows for easy integration with other tools and services.

## 📸 Working


https://github.com/user-attachments/assets/67bd497a-6c44-4c24-9501-ccc81ad9c6ff


<img width="1436" alt="Screenshot 2025-06-24 at 6 08 38 PM" src="https://github.com/user-attachments/assets/665aade1-33a9-4554-b064-3b6df7b55005" />
<img width="1436" alt="Screenshot 2025-06-24 at 6 08 38 PM" src="https://github.com/user-attachments/assets/3835bff7-2cc4-44f5-bb3e-0004e899d2dc" />

## 🛠️ Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Express.js, Node.js, Python
- **LLM Providers**: Gemini, Groq
- **Utilities**: `langgraph`, `google.generativeai`, `langchain`, `dotenv`, `groq`
- **Database**: Not specified

## 📦 Installation
To set up the project, follow these steps:
1. **Prerequisites**: Ensure you have Node.js and Python installed on your system.
2. **Clone the Repository**: Run `git clone https://github.com/your-repo-url.git` to download the project.
3. **Install Dependencies**: Navigate to the project directory and run `npm install` for the frontend and `pip install -r requirements.txt` for the backend.
4. **Configure Environment Variables**: Set up your environment variables for API keys and other configurations.

## 💻 Usage
1. **Start the Backend**: Run `node server.js` to start the Express server.
2. **Start the Frontend**: Run `npm run dev` to start the Next.js development server.
3. **Interact with the Application**: Open your web browser and navigate to `http://localhost:3000` to use the application.

## 📂 Project Structure
```markdown
project/
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── config.ts
│   │   ├── utils.ts
│   │   └── ...
│   ├── next.config.ts
│   ├── package.json
│   └── ...
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   ├── readme.ts
│   │   │   └── ...
│   │   ├── utils/
│   │   │   ├── make-dir.ts
│   │   │   ├── clone-repo.ts
│   │   │   └── ...
│   │   ├── python/
│   │   │   ├── agents.py
│   │   │   ├── llm_fallback.py
│   │   │   ├── prompts.py
│   │   │   └── ...
│   │   └── ...
│   ├── package.json
│   └── ...
├── .env
├── README.md
└── ...
```
## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn and create. Any contributions you make are **greatly appreciated**.
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 📬 Contact
[@LakshitAgarwal](https://x.com/lakshitagarwal7?s=21) - [lakshit7811@gmail.com](mailto:lakshit7811@gmail.com)

## Thanks
This project was made possible thanks to the contributions of many individuals and the support of our community. 
This is written by [readme.ai](https://readme-generator-phi.vercel.app/) for better documentation.

