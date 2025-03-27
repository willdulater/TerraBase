import toast from "react-hot-toast"
import { TailSpin } from "react-loading-icons"

const CommandMenu = ({
	submitCommand,
	setTransformModal,
	setGenerateModal,
	isGenerating,
	modeGenerating,
	setModeGenerating,
	isDarkMode,
}) => {
	return (
  <div className={`flex flex-col w-full p-4 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}>
    {/* Header */}
    <div className="flex flex-row items-center justify-between mb-4">
      <p className="font-bold text-lg">Commands</p>
    </div>

    {/* Divider */}
    <div className={`h-[2px] ${
          isDarkMode ? "bg-gray-600" : "bg-gray-200"
        } mb-4`}></div>

    {/* Command Buttons */}
    <div className="space-y-4">
      
	  {/* Write a Sentence */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-3 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-600 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        onClick={(e) => {
          setModeGenerating("sentence");
          submitCommand(e, "sentence");
        }}
        disabled={isGenerating}
      >
        <span className="material-icons text-orange-500 mr-3">short_text</span>
        <p className="flex-1 font-medium">Write a sentence</p>
        {isGenerating && modeGenerating === "sentence" && (
          <TailSpin className="animate-spin h-5 w-5 text-orange-500" />
        )}
      </button>

      {/* Write a Paragraph */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-3 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-600 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        onClick={(e) => {
          setModeGenerating("paragraph");
          submitCommand(e, "paragraph");
        }}
        disabled={isGenerating}
      >
        <span className="material-icons text-red-500 mr-3">notes</span>
        <p className="flex-1 font-medium">Write a paragraph</p>
        {isGenerating && modeGenerating === "paragraph" && (
          <TailSpin className="animate-spin h-5 w-5 text-red-500" />
        )}
      </button>

      {/* Generate Content */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-3 rounded-lg${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-600 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        onClick={(e) => {
          setModeGenerating("generate");
          setGenerateModal(true);
        }}
        disabled={isGenerating}
      >
        <span className="material-icons text-green-500 mr-3">article</span>
        <p className="flex-1 font-medium">Generate content</p>
        {isGenerating && modeGenerating === "generate" && (
          <TailSpin className="animate-spin h-5 w-5 text-green-500" />
        )}
      </button>

      {/* Transform Text */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-3 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-600 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        onClick={(e) => {
          if (window.getSelection().toString().length < 5) {
            toast.error("Please select a word or phrase to transform!");
          } else {
            setModeGenerating("transform");
            setTransformModal(true);
          }
        }}
        disabled={isGenerating}
      >
        <span className="material-icons text-yellow-500 mr-3">transform</span>
        <p className="flex-1 font-medium">Transform text</p>
        {isGenerating && modeGenerating === "transform" && (
          <TailSpin className="animate-spin h-5 w-5 text-yellow-500" />
        )}
      </button>

      {/* Show Don't Tell */}
      <button
        type="button"
        className={`flex items-center w-full px-4 py-3 rounded-lg ${
            isDarkMode
              ? "bg-gray-800 hover:bg-gray-600 text-gray-200"
              : "bg-white hover:bg-gray-100 text-gray-800"
          }`}
        onClick={(e) => {
          setModeGenerating("flowery");
          submitCommand(e, "flowery");
        }}
        disabled={isGenerating}
      >
        <span className="material-icons text-purple-500 mr-3">auto_fix_high</span>
        <p className="flex-1 font-medium">Show don't tell</p>
        {isGenerating && modeGenerating === "flowery" && (
          <TailSpin className="animate-spin h-5 w-5 text-purple-500" />
        )}
      </button>

      
    </div>
  </div>
);

}

export default CommandMenu
