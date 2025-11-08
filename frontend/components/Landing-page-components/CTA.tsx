import { Button } from "../ui/button";
import toast from "react-hot-toast";

interface CTAProps {
  onGenerateClick: (linkFromHero?: string) => void;
  githubLink: string;
  checkAndCorrectGithubLink: (link: string) => { isValid: boolean; correctedUrl: string };
}

export default function CTA({ onGenerateClick, githubLink, checkAndCorrectGithubLink }: CTAProps) {
  const handleClick = () => {
    // Check if we have a GitHub link entered
    if (!githubLink.trim()) {
      // Scroll to top to show the form and show helpful message
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Wait for scroll to complete, then show toast and focus input
      setTimeout(() => {
        toast.error("Please enter your GitHub repository link above first!");
        
        // Try to focus the input field
        const inputElement = document.querySelector('input[placeholder*="github.com"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.style.boxShadow = "0 0 0 3px rgba(244, 63, 94, 0.3)";
          
          // Remove the highlight after 3 seconds
          setTimeout(() => {
            inputElement.style.boxShadow = "";
          }, 3000);
        }
      }, 500);
      return;
    }
    
    // Try to validate and auto-correct the URL
    const validation = checkAndCorrectGithubLink(githubLink);
    
    if (!validation.isValid) {
      // Scroll to top and highlight the input
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      setTimeout(() => {
        toast.error("Please enter a valid GitHub repository link!");
        
        const inputElement = document.querySelector('input[placeholder*="github.com"]') as HTMLInputElement;
        if (inputElement) {
          inputElement.focus();
          inputElement.select(); // Select all text for easy editing
          inputElement.style.boxShadow = "0 0 0 3px rgba(251, 146, 60, 0.3)";
          
          setTimeout(() => {
            inputElement.style.boxShadow = "";
          }, 3000);
        }
      }, 500);
      return;
    }
    
    // If we have a valid link (possibly corrected), proceed with generation
    onGenerateClick(validation.correctedUrl);
  };

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-extrabold w-[90%] mx-auto md:w-full">
        Done Writing Docs? Let AI Take Over.
      </h1>
      <h2 className="text-gray-600 py-4 md:w-1/3 w-8/12 mx-auto">
        Instantly turn your GitHub repo into a polished README. Save time, stay
        focused on building.
      </h2>
      <Button
        onClick={handleClick}
        variant="outline"
        className="h-10 px-6 py-2.5 rounded-lg text-base
              bg-gradient-to-r from-rose-100 to-pink-100 
              text-rose-600 hover:text-rose-600 font-medium transition-all duration-200
              border border-rose-200/50 
              hover:bg-rose-50 hover:border-rose-500
              active:bg-rose-100
              cursor-pointer shadow-lg shadow-rose-200"
      >
        🚀 Generate My README →
      </Button>
    </div>
  );
}
