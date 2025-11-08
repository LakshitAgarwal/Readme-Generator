"use client";

import { useState } from "react";
import DemoSection from "@/components/Landing-page-components/DemoSection";
import HeroSection from "@/components/Landing-page-components/HeroSection";
import HowItWorks from "@/components/Landing-page-components/HowItWorks";
import CTA from "@/components/Landing-page-components/CTA";
import MyReadmeComponent from "@/components/my-readme-page/MyReadmeComponent";
import toast from "react-hot-toast";

export default function Home() {
  const [showReadme, setShowReadme] = useState(false);
  const [githubLink, setGithubLink] = useState("");

  // Enhanced validation function for GitHub URLs with auto-correction
  const checkAndCorrectGithubLink = (link: string) => {
    const pattern = /^https:\/\/github\.com\/[^\/]+\/[^\/]+(?:\/)?$/;
    
    // First, try the original link
    if (pattern.test(link)) {
      return { isValid: true, correctedUrl: link };
    }
    
    // If invalid, try adding https:// if missing
    const trimmedLink = link.trim();
    if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
      const correctedLink = `https://${trimmedLink}`;
      if (pattern.test(correctedLink)) {
        return { isValid: true, correctedUrl: correctedLink };
      }
    }
    
    // If still invalid, try converting http:// to https://
    if (trimmedLink.startsWith('http://')) {
      const httpsLink = trimmedLink.replace('http://', 'https://');
      if (pattern.test(httpsLink)) {
        return { isValid: true, correctedUrl: httpsLink };
      }
    }
    
    return { isValid: false, correctedUrl: link };
  };

  const handleGenerateClick = (linkFromHero?: string) => {
    const linkToValidate = linkFromHero || githubLink;
    
    if (!linkToValidate) {
      toast.error("Please enter your GitHub repository link first!");
      // Scroll to top to show the input field
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Try to validate and auto-correct the URL
    const validation = checkAndCorrectGithubLink(linkToValidate);
    
    if (!validation.isValid) {
      toast.error("Please enter a valid GitHub repository link!");
      // Scroll to top to show the input field
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If URL was corrected, update the state and show success message
    if (validation.correctedUrl !== linkToValidate) {
      setGithubLink(validation.correctedUrl);
      toast.success(`URL corrected to: ${validation.correctedUrl}`);
    }

    // Store the validated/corrected link and proceed
    localStorage.setItem("githubLink", validation.correctedUrl);
    setShowReadme(true);
    toast.success("Starting README generation… you can watch the live logs now!");
  };

  const handleBackToHome = () => {
    setShowReadme(false);
    // Clear the stored link when going back
    localStorage.removeItem("githubLink");
    setGithubLink("");
  };

  return (
    <div>
      {!showReadme ? (
        <div>
          <HeroSection 
            onGenerateClick={handleGenerateClick}
            githubLink={githubLink}
            setGithubLink={setGithubLink}
            checkAndCorrectGithubLink={checkAndCorrectGithubLink}
          />
          <DemoSection />
          <HowItWorks />
          <CTA 
            onGenerateClick={handleGenerateClick}
            githubLink={githubLink}
            checkAndCorrectGithubLink={checkAndCorrectGithubLink}
          />
        </div>
      ) : (
        <MyReadmeComponent onBackToHome={handleBackToHome} />
      )}
    </div>
  );
}
