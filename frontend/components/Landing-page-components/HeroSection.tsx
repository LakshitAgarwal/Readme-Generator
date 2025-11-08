"use client";

import { Sparkles, Link as LinkIcon, Check, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useMemo, useState, useEffect } from "react";

interface HeroSectionProps {
  onGenerateClick: (linkFromHero?: string) => void;
  githubLink: string;
  setGithubLink: (link: string) => void;
  checkAndCorrectGithubLink: (link: string) => { isValid: boolean; correctedUrl: string };
}

export default function HeroSection({ 
  onGenerateClick, 
  githubLink, 
  setGithubLink,
  checkAndCorrectGithubLink
}: HeroSectionProps) {

  const [isTyping, setIsTyping] = useState(false);

  // Show typing indicator briefly when user is typing
  useEffect(() => {
    if (githubLink.trim()) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 300);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [githubLink]);

  // Memoized validation for performance
  const urlValidation = useMemo(() => {
    if (!githubLink.trim()) {
      return { 
        state: 'empty', 
        isValid: false, 
        correctedUrl: githubLink,
        message: '' 
      };
    }
    
    const validation = checkAndCorrectGithubLink(githubLink);
    
    // Treat both valid and correctable URLs as "valid" (green) for simplicity
    if (validation.isValid) {
      return { 
        state: 'valid', 
        isValid: true, 
        correctedUrl: validation.correctedUrl,
        message: 'Valid GitHub URL' 
      };
    } else {
      return { 
        state: 'invalid', 
        isValid: false, 
        correctedUrl: githubLink,
        message: 'Invalid GitHub URL format' 
      };
    }
  }, [githubLink, checkAndCorrectGithubLink]);

  // Get validation icon based on state
  const getValidationIcon = () => {
    if (isTyping) {
      return <div className="h-4 w-4 border-2 border-gray-300 border-t-rose-500 rounded-full animate-spin" />;
    }
    
    switch (urlValidation.state) {
      case 'valid':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'invalid':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  // Get input field styling based on validation state
  const getInputStyling = () => {
    const baseClasses = "w-full h-14 pl-12 text-base rounded-xl border-2 transition-all duration-200 placeholder:text-gray-400 hover:border-rose-200 focus:bg-rose-50/50 focus:ring-2 focus:ring-rose-100 focus:shadow-lg focus:shadow-rose-100";
    
    switch (urlValidation.state) {
      case 'valid':
        return `${baseClasses} pr-12 border-green-300 bg-green-50/30 focus:border-green-400 focus:ring-green-100`;
      case 'invalid':
        return `${baseClasses} pr-12 border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-100`;
      default:
        return `${baseClasses} pr-40 border-rose-200/50 focus:border-rose-300`;
    }
  };

  const handleSubmit = () => {
    if (!githubLink.trim()) {
      toast.error("Please enter a GitHub repository link");
      return;
    }

    // Try to validate and auto-correct the URL
    const validation = checkAndCorrectGithubLink(githubLink);
    
    if (!validation.isValid) {
      toast.error("Enter a valid Github Repo link");
      return;
    }

    // If URL was corrected, update the input field
    if (validation.correctedUrl !== githubLink) {
      setGithubLink(validation.correctedUrl);
      toast.success(`URL corrected!`);
    }

    // Pass the validated/corrected link to the parent component
    onGenerateClick(validation.correctedUrl);
  };

  return (
    <div className="text-center">
      {/* Badge */}
      <div
        className="relative inline-flex items-center md:px-6 px-3 md:py-2.5 py-1.5 rounded-full
        bg-gradient-to-r from-rose-100 via-pink-100 to-indigo-100 
        bg-[length:200%_200%] animate-[gradientMove_8s_ease_infinite] 
        text-rose-600 shadow-md overflow-hidden border border-white/30 
        backdrop-blur-sm"
      >
        <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-rose-500 animate-[pingSlow_2s_infinite]" />
        <span className="ml-2 text-sm md:text-base font-medium bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
          Powered by AI
        </span>

        {/* Shine effect */}
        <div
          className="absolute top-0 left-0 w-1/2 h-full 
          bg-gradient-to-r from-transparent via-white/40 to-transparent 
          skew-x-[-20deg] animate-[shine_2s_infinite] pointer-events-none"
        ></div>
      </div>

      {/* Heading */}
      <div className="mt-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-center">
          <span className="relative inline-block">
            The Fastest Way to{" "}
            <span className="relative inline-block">
              <span className="relative z-10 px-2">Professional</span>
              <span
                className="absolute inset-0 bg-rose-100/50 -rotate-2 rounded-lg transform -skew-y-1"
                aria-hidden="true"
              ></span>
            </span>
          </span>
          <span className="block mt-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            README
          </span>
        </h1>

        <h2 className="md:text-xl font-medium sm:text-[21px] mt-4 text-gray-500 max-w-3/4 md:max-w-2xl mx-auto">
          Automatically generate professional READMEs from your codebase.
        </h2>
      </div>

      {/* Link Input */}
      <div className="mt-10 flex items-center justify-center max-w-xl mx-auto px-4">
        <div className="relative w-full group">
          <div className="relative">
            <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-rose-400" />
            <Input
              value={githubLink}
              onChange={(e) => {
                setGithubLink(e.target.value);
              }}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              type="link"
              placeholder="https://github.com/username/repo"
              className={getInputStyling()}
            />

            {/* Validation Icon */}
            {githubLink.trim() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {getValidationIcon()}
                <Button
                  onClick={handleSubmit}
                  type="submit"
                  variant="outline"
                  className="h-8 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 hover:text-rose-600 border border-rose-200/50 hover:bg-rose-50 hover:border-rose-500 active:bg-rose-100"
                >
                  Generate →
                </Button>
              </div>
            )}

            {/* Generate Button - Show when no input */}
            {!githubLink.trim() && (
              <Button
                onClick={handleSubmit}
                type="submit"
                variant="outline"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 py-2.5 rounded-lg text-base font-medium transition-all duration-200 cursor-pointer bg-gradient-to-r from-rose-100 to-pink-100 text-rose-600 hover:text-rose-600 border border-rose-200/50 hover:bg-rose-50 hover:border-rose-500 active:bg-rose-100"
              >
                Generate →
              </Button>
            )}

            <Toaster position="top-center" />
          </div>
          
          {/* Validation Message */}
          {githubLink.trim() && (
            <div className={`mt-2 text-xs font-medium transition-all duration-200 ${
              isTyping
                ? 'text-gray-500'
                : urlValidation.state === 'valid' 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {isTyping ? 'Checking URL...' : urlValidation.message}
            </div>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-sm text-gray-500 mt-4 space-y-2">
        <h3>⚠️ AI can make mistakes. Verify before using.</h3>
      </div>
    </div>
  );
}
