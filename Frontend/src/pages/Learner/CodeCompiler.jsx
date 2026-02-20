// CodeCompiler.jsx
import React, { useEffect, useState, useRef } from "react";
import { FaPlay, FaStop, FaLaptopCode, FaCopy, FaDownload } from "react-icons/fa";

const DEFAULT_TEMPLATES = {
  javascript: `// JavaScript example
function greet(name) {
  console.log("Hello, " + name + "!");
}
greet(readLine());`,

  python: `# Python example
name = input("Enter name: ")
print("Hello, " + name + "!")`,

  java: `// Java execution is not supported in-browser.`,
  cpp: `// C++ execution is not supported in-browser.`,
};

export default function CodeCompiler() {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(DEFAULT_TEMPLATES.javascript);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState(null);
  const [lastExecTime, setLastExecTime] = useState(null);
  const outputRef = useRef(null);

  useEffect(() => {
    setCode(DEFAULT_TEMPLATES[language] || "");
  }, [language]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const appendOutput = (text) => setOutput((prev) => prev + text);

  const ensurePyodide = async () => {
    if (pyodide) return pyodide;
    appendOutput("[info] Loading Python runtime...\n");

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js";
    script.async = true;

    const pyPromise = new Promise((resolve, reject) => {
      script.onload = async () => {
        try {
          const py = await window.loadPyodide({
            indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
          });
          py.setStdout({ batched: (s) => appendOutput(s) });
          py.setStderr({ batched: (s) => appendOutput(s) });
          setPyodide(py);
          appendOutput("[info] Pyodide ready.\n");
          resolve(py);
        } catch (err) {
          appendOutput(`[error] Pyodide failed: ${err}\n`);
          reject(err);
        }
      };
      script.onerror = reject;
    });

    document.head.appendChild(script);
    return pyPromise;
  };

  const runJavaScript = async (source) => {
    setOutput("");
    setIsRunning(true);
    const start = performance.now();

    const originalLog = console.log;
    console.log = (...args) => appendOutput(args.join(" ") + "\n");

    const inputLines = stdin.split(/\r?\n/);
    let inputIndex = 0;
    const readLine = () => inputLines[inputIndex++] ?? "";

    try {
      const wrapped = `(async function(readLine){
        ${source}
      })`;
      const fn = new Function("readLine", `return ${wrapped}`);
      const result = fn(readLine);
      if (result?.then) await result;
    } catch (err) {
      appendOutput("[stderr] " + err + "\n");
    } finally {
      console.log = originalLog;
      setLastExecTime((performance.now() - start).toFixed(2));
      setIsRunning(false);
    }
  };

  const runPython = async (source) => {
    setOutput("");
    setIsRunning(true);
    const start = performance.now();
    try {
      const py = await ensurePyodide();
      const setup = `
__stdin_lines = """${stdin.replace(/"""/g, '\\"""')}""".splitlines()
__stdin_index = 0
def input(prompt=None):
    global __stdin_index
    if prompt: print(prompt, end="")
    if __stdin_index >= len(__stdin_lines): return ""
    val = __stdin_lines[__stdin_index]; __stdin_index += 1; return val
`;
      await py.runPythonAsync(setup);
      await py.runPythonAsync(source);
      setLastExecTime((performance.now() - start).toFixed(2));
    } catch (err) {
      appendOutput("[stderr] " + err + "\n");
    } finally {
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    if (language === "javascript") runJavaScript(code);
    else if (language === "python") runPython(code);
    else appendOutput(`[info] ${language} not supported in-browser.\n`);
  };

  const handleCopyCode = () => navigator.clipboard.writeText(code);
  const handleCopyOutput = () => navigator.clipboard.writeText(output);

  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `code.${language === "python" ? "py" : language === "javascript" ? "js" : "txt"}`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto my-8 p-4 bg-white shadow-xl rounded-2xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 px-4 py-2 border-b bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-xl text-white">
        <h3 className="font-bold flex items-center gap-2 text-lg lg:text-xl">
          <FaLaptopCode /> Code Compiler
        </h3>
        <div className="flex gap-2 items-center w-full lg:w-auto">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border rounded px-2 py-1 text-black"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java (N/A)</option>
            <option value="cpp">C++ (N/A)</option>
          </select>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`flex items-center gap-1 px-3 py-1 rounded bg-green-600 hover:bg-green-700 transition text-white`}
          >
            <FaPlay /> {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      {/* Main Editor + Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* Code Editor */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Editor</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyCode}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
              >
                <FaCopy /> Copy
              </button>
              <button
                onClick={handleDownloadCode}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-xs flex items-center gap-1"
              >
                <FaDownload /> Download
              </button>
            </div>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ height: 300 }}
            className="w-full border rounded p-3 font-mono text-sm resize-y focus:outline-none focus:ring focus:ring-green-400"
          />
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            placeholder="stdin (user input, separate lines by Enter)"
            className="w-full h-24 border rounded p-2 mt-2 font-mono text-sm resize-y focus:outline-none focus:ring focus:ring-green-400"
          />
        </div>

        {/* Output Panel */}
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">Output</span>
            <div className="flex gap-2">
              <button
                onClick={handleCopyOutput}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs flex items-center gap-1"
              >
                <FaCopy /> Copy
              </button>
              <button
                onClick={() => setOutput("")}
                className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400 text-xs flex items-center gap-1"
              >
                <FaStop /> Clear
              </button>
            </div>
          </div>
          <div
            ref={outputRef}
            className="bg-black text-white p-3 rounded h-full min-h-[300px] overflow-auto font-mono text-sm resize-y"
          >
            {output || "No output yet."}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Execution Time: {lastExecTime ? `${lastExecTime} ms` : "—"}
          </div>
        </div>
      </div>
    </div>
  );
}
