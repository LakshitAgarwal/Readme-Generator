import {
  BrainCircuit,
  FileOutput,
  Link,
  MoveRight,
  ArrowDown,
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="md:py-16 py-8 mt-4">
      <h1 className="text-center text-3xl font-bold text-rose-500 mb-12">
        How It Works
      </h1>
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-0 md:space-x-8">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="mb-6 relative">
              <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 shadow-lg shadow-blue-200/50 border border-blue-100/50 group-hover:shadow-xl group-hover:shadow-blue-300/50 transition-all duration-300 group-hover:scale-110">
                <Link className="h-9 w-9 text-blue-600 group-hover:text-blue-700 transition-colors duration-300" />
              </div>
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-3xl bg-blue-400/20 group-hover:animate-ping"></div>
            </div>
            <div className="font-bold text-lg text-foreground mb-1 group-hover:text-blue-600 transition-colors duration-300">
              Paste Your Repository Link
            </div>
            <div className="text-muted-foreground text-sm">
              Just drop your GitHub repo URL
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="md:mx-4 flex flex-col items-center justify-center">
            <ArrowDown className="h-6 w-6 text-rose-300 block md:hidden animate-bounce" />
            <MoveRight
              size={32}
              className="h-6 w-6 text-rose-300 hidden md:block hover:text-rose-400 transition-colors duration-300"
            />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="mb-6 relative">
              <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 shadow-lg shadow-emerald-200/50 border border-emerald-100/50 group-hover:shadow-xl group-hover:shadow-emerald-300/50 transition-all duration-300 group-hover:scale-110">
                <BrainCircuit className="h-9 w-9 text-emerald-600 group-hover:text-emerald-700 transition-colors duration-300" />
              </div>
              {/* Rotating ring effect */}
              <div className="absolute inset-0 rounded-3xl border-2 border-emerald-300/30 group-hover:animate-spin"></div>
            </div>
            <div className="font-bold text-lg text-foreground mb-1 group-hover:text-emerald-600 transition-colors duration-300">
              Let AI Analyze & Generate
            </div>
            <div className="text-muted-foreground text-sm">
              Our AI reads your codebase, then crafts a tailored README.md.
            </div>
          </div>

          {/* Arrow 2 */}
          <div className="md:mx-4 flex flex-col items-center justify-center">
            <ArrowDown className="h-6 w-6 text-rose-300 block md:hidden animate-bounce" />
            <MoveRight
              size={32}
              className="h-6 w-6 text-rose-300 hidden md:block hover:text-rose-400 transition-colors duration-300"
            />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center flex-1 group">
            <div className="mb-6 relative">
              <div className="flex items-center justify-center h-20 w-20 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 shadow-lg shadow-purple-200/50 border border-purple-100/50 group-hover:shadow-xl group-hover:shadow-purple-300/50 transition-all duration-300 group-hover:scale-110">
                <FileOutput className="h-9 w-9 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-3xl bg-purple-400/20 blur-lg group-hover:blur-xl group-hover:bg-purple-400/30 transition-all duration-300"></div>
            </div>
            <div className="font-bold text-lg text-foreground mb-1 group-hover:text-purple-600 transition-colors duration-300">
              Get Your Polished README
            </div>
            <div className="text-muted-foreground text-sm">
              Download or copy your clean, professional README
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
