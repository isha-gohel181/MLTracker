import React, { useState, useEffect } from "react";

const codeLines = [
  [
    { text: "import ", className: "text-purple-400" },
    { text: "mltracker", className: "text-white" },
  ],
  [{ text: "# Initialize tracking", className: "text-gray-500" }],
  [
    { text: "tracker = ", className: "text-blue-400" },
    { text: "mltracker.init()", className: "text-white" },
  ],
  [{ text: "# Log parameters", className: "text-gray-500" }],
  [{ text: "tracker.log_params({", className: "text-white" }],
  [
    { text: `"learning_rate": `, className: "text-green-400" },
    { text: "0.001", className: "text-yellow-400" },
    { text: ",", className: "text-green-400" },
  ],
  [
    { text: `"batch_size": `, className: "text-green-400" },
    { text: "32", className: "text-yellow-400" },
  ],
  [{ text: "})", className: "text-white" }],
  [{ text: "# Track metrics", className: "text-gray-500" }],
  [
    { text: 'tracker.log_metric("accuracy", ', className: "text-white" },
    { text: "0.95", className: "text-yellow-400" },
    { text: ")", className: "text-white" },
  ],
];

const ColoredTypedCode = () => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentLineContent, setCurrentLineContent] = useState([]);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    if (currentLineIndex >= codeLines.length) {
      setTypingDone(true);
      return;
    }

    const line = codeLines[currentLineIndex];
    const flatLine = line.map(({ text }) => text).join("");

    const timeout = setTimeout(() => {
      const typedText = flatLine.slice(0, currentCharIndex + 1);

      // Create colored fragments based on character count
      let remaining = typedText.length;
      let fragments = [];
      for (let i = 0; i < line.length && remaining > 0; i++) {
        const { text, className } = line[i];
        const take = Math.min(remaining, text.length);
        if (take > 0) {
          fragments.push(
            <span key={i} className={className}>
              {text.slice(0, take)}
            </span>
          );
          remaining -= take;
        }
      }

      setCurrentLineContent(fragments);

      if (currentCharIndex + 1 < flatLine.length) {
        setCurrentCharIndex((prev) => prev + 1);
      } else {
        // Done with this line
        setDisplayedLines((prev) => [...prev, fragments]);
        setCurrentLineContent([]);
        setCurrentCharIndex(0);
        setCurrentLineIndex((prev) => prev + 1);
      }
    }, 80);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, currentLineIndex]);

  return (
    <pre className="font-mono text-sm space-y-1 text-left select-text text-gray-200">
      {displayedLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      {!typingDone && <div>{currentLineContent}<span className="animate-blink cursor">|</span></div>}
      <style>{`
        .animate-blink {
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .cursor {
          display: inline-block;
          width: 1ch;
        }
      `}</style>
    </pre>
  );
};

export default ColoredTypedCode;
