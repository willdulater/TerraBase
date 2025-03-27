import "react-quill/dist/quill.snow.css";
import "./style.css";
import { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import Request from "../Request";
import CommandMenu from "./CommandMenu";
import EssayGrader from "./EssayGrader";
import EssayGrader2 from "./EssayGrader2";
import DraftInputModal from "./DraftInputModal";
import TransformTextModal from "./TransformTextModal";
import GenerateTextModal from "./GenerateTextModal";
import { toast } from "react-hot-toast";
import EssayFeedback from "./EssayFeedback";

const editorModules = {
  toolbar: [
    [{ header: [false, 3, 2, 1] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }], // Add color and highlight options
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["clean"],
  ],
};

const FreeWrite = ({
  freewriteThreads,
  setFreewriteThreads,
  selectedFreewriteThread,
  socket,
  setShowCTASubscribed,
}) => {
  const [text, setText] = useState(
    freewriteThreads.find(
      (freewriteThread) => freewriteThread.id === selectedFreewriteThread
    ).text
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modeGenerating, setModeGenerating] = useState("");

  const [insertedTextStartingIndex, setInsertedTextStartingIndex] = useState(0);

  const [transformModal, setTransformModal] = useState(false);
  const [generateModal, setGenerateModal] = useState(false);
  const [showPromptInput, setShowPromptInput] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [font, setFont] = useState("sans-serif");
  const [fontSize, setFontSize] = useState("16px");

  //get the rating data
  const [ratingData, setRatingData] = useState(null);

  const [showGrader, setShowGrader] = useState(true); // Toggle state

  const [selectedRatingSystem, setSelectedRatingSystem] = useState("vspice");

  const quillRef = useRef(null);

  //processes receving text generation from server

  useEffect(() => {
    if (socket === null) return;

    let completeText = "";

    
   

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const editor = quillRef.current.getEditor();

      //console.log(data);
      // Log the received data for debugging

      if (data["error"] !== undefined && data["error"] === "tokens_used") {
        setShowCTASubscribed(true);
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
        return;
      }

      if (data["error"] !== undefined && data["error"] === "openai_error") {
        toast.error(data["message"]);
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
      }

      if (data["error"] !== undefined && data["error"] === "max_tokens") {
        toast.error(data["message"]);
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
      }

      if (!data["first_output"]) {
        // Check for completion signal
        if (data["status"] === "DONE") {
          

          console.log("Full data received:", completeText);
          console.log("end");
          console.log(data);

          if (data["mode"] === "limmy") {
            const processedRating = extractRatingData(completeText);
            console.log("Processed data received:", processedRating);
            setRatingData(processedRating);
          } else if (data["mode"] === "vspice") {
            const processedRating = extractRatingData(completeText);
            console.log("Processed VSPICE data");
            setRatingData(processedRating);
          }

          

          // Clear the buffer
          completeText = "";
          setIsGenerating(false);
          return;
        }

        completeText += data["output_text"]; // Append snippet to buffer
      }

      if (data["first_output"]) {
        console.log(data);
        if (data["mode"] === "headline") {
          editor.setSelection(0, 0);
          editor.insertText(editor.getSelection(true).index, "\n\n");
          editor.setSelection(0, 0);
        }

        if (data["mode"] === "flowery" || data["mode"] === "transform") {
          toast.success("bruh");
          editor.setSelection(
            editor.getSelection(true).index + editor.getSelection(true).length,
            0
          );
          editor.insertText(editor.getSelection(true).index, "\n\n");
          editor.setSelection(
            editor.getSelection(true).index + editor.getSelection(true).length,
            0
          );
        }

        if (data["mode"] === "generate") {
          editor.setSelection(
            editor.getSelection(true).index + editor.getSelection(true).length,
            0
          );
          editor.insertText(editor.getSelection(true).index, "\n");
          editor.setSelection(
            editor.getSelection(true).index + editor.getSelection(true).length,
            0
          );
        }

        setInsertedTextStartingIndex(editor.getSelection(true).index);
        if (data["output_text"] !== "\n") {
          editor.insertText(
            editor.getSelection(true).index,
            data["output_text"]
          );
        }
      } else if (
        data["output_text"] &&
        data["websocket_type"] === "freewritesnippet"
      ) {
        if (data["mode"] === "headline") {
          if (data["output_text"] !== "\n") {
            editor.insertText(
              editor.getSelection(true).index,
              data["output_text"]
            );
          }
        } else {
          if (data["mode"] !== "rating") {
            editor.insertText(
              editor.getSelection(true).index,
              data["output_text"]
            );
          }
        }
      }

      if (data["status"] === "DONE") {
        editor.formatText(
          insertedTextStartingIndex,
          editor.getSelection(true).index - insertedTextStartingIndex,
          {
            background: "#C8E4FC",
          }
        );

        setTimeout(() => {
          editor.formatText(
            insertedTextStartingIndex,
            editor.getSelection(true).index - insertedTextStartingIndex,
            {
              background: "transparent",
            }
          );
        }, 2000);

        if (data["mode"] === "headline") {
          const firstLine = new Promise((resolve, reject) => {
            resolve(editor.getLines(0, 1)[0]);
          });
          firstLine.then((firstLine) => {
            editor.formatText(0, firstLine.cache.length, "header", 1);
          });
        } else {
          // insert two new lines after the generated text
          editor.setSelection(
            editor.getSelection(true).index + editor.getSelection(true).length,
            0
          );
          editor.insertText(editor.getSelection(true).index, "\n");
        }
        setIsGenerating(false);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [insertedTextStartingIndex, selectedRatingSystem]);

  //always selects the current freewrite thread when sending input text

  useEffect(() => {
    quillRef.current.getEditor().focus();
    setText(
      freewriteThreads.find(
        (freewriteThread) => freewriteThread.id === selectedFreewriteThread
      ).text
    );
  }, [selectedFreewriteThread, selectedRatingSystem]);

  //saves the text to the server

  useEffect(() => {
    let timeoutId = null;

    if (text) {
      timeoutId = setTimeout(() => {
        const parameters = {
          data: {
            text: text,
          },
          method: "POST",
        };
        const updateTextRequest = new Request(
          "freewritethreads/" + selectedFreewriteThread + "/settext/",
          parameters
        );
        setIsSaving(true);

        updateTextRequest
          .then((res) => {
            const newFreewriteThreads = freewriteThreads.map(
              (freewriteThread) => {
                if (freewriteThread.id === selectedFreewriteThread) {
                  freewriteThread.text = text;
                }
                return freewriteThread;
              }
            );
            setFreewriteThreads(newFreewriteThreads);
            setIsSaving(false);
          })
          .catch((err) => {
            setIsSaving(false);
          });
      }, 250);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text]);

  //gets the text from the quill editor

  const getQuillText = () => {
    const quillText = quillRef.current.getEditor().root.innerHTML;
    const div = document.createElement("div");
    div.innerHTML = quillText;
    return div.textContent || div.innerText || "";
  };

  //extracts the rating data from the server response

  const extractRatingData = (data) => {
    // Validate input
    if (typeof data !== "string") {
      console.error("Invalid input data. Expected a string.");
      return null;
    }

    const sections = data.split("\n\n"); // Split the response into sections
    const results = {
      scores: {}, // To store individual scores
      feedback: {}, // To store individual feedback
      overallScore: 0, // To store calculated overall score
    };

    let totalScore = 0; // Sum of scores for calculating overall score
    let scoreCount = 0; // Count of scores for calculating the average

    sections.forEach((section) => {
      const [header, feedback] = section.split("\nFeedback: ");
      if (header && feedback) {
        const [category, score] = header.split(": ");
        if (category && score) {
          const trimmedCategory = category.trim().toLowerCase();
          const scoreValue = parseInt(score.split("/")[0], 10); // Extract numeric score

          if (!isNaN(scoreValue)) {
            results.scores[trimmedCategory] = scoreValue; // Store score
            results.feedback[trimmedCategory] = feedback.trim(); // Store feedback
            totalScore += scoreValue;
            scoreCount += 1;
          }
        }
      }
    });

    // Calculate overall score as the average of individual category scores
    if (scoreCount > 0) {
      results.overallScore = Math.round(totalScore / scoreCount); // Round to nearest whole number
    }

    return results;
  };

  //handles the change in the rating system

  const handleSystemChange = (event) => {
    setSelectedRatingSystem(event.target.value);
  };

  //quill editor modules

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        // image and video
        ["image", "video"],
      ],
    },
  };

  useEffect(() => {
    if (!socket) {
      // Reinitialize the WebSocket
      // Example: setSocket(new WebSocket("ws://example.com"));
    }
  }, [socket]);

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.focus(); // Focus on the editor
      editor.setSelection(editor.getLength(), 0); // Move cursor to the end
    }
  }, [selectedFreewriteThread]);

  const handleRating = () => {
    // Ensure quillRef is defined and contains the editor
    if (!quillRef.current) {
      toast.error("Editor is not ready. Please try again later.");
      setTimeout(() => {
        setIsGenerating(false);
      }, 100);
      return;
    }

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      toast.error("WebSocket connection is closed. Please try again later.");
      setTimeout(() => {
        setIsGenerating(false);
      }, 100);
      return;
    }

    // Get the text from the currently selected thread
    const editor = quillRef.current.getEditor();
    const editorText = editor.getText().trim();

    // Validate the text content
    if (editorText.length < 5) {
      toast.error("The text is too short to evaluate. Please write more.");
      setTimeout(() => {
        setIsGenerating(false);
      }, 100);
      return;
    }

    // Calculate the word count
    const wordCount = editorText.split(/\s+/).filter(Boolean).length;

    // Check if the word count exceeds the limit
    if (wordCount > 1500) {
      toast.error("The text exceeds the 1500-word limit. Please shorten it.");
      setTimeout(() => {
        setIsGenerating(false);
      }, 100);
      return;
    }

    // Send the full editor text using the socket with "rating" type
    socket.send(
      JSON.stringify({
        input_text: editorText, // Use the full text from the editor
        mode: selectedRatingSystem,
        websocket_type: "rating",
        freewrite_thread_id: selectedFreewriteThread, // Always use the latest thread ID
      })
    );

    // Optionally show feedback
    toast.success("Rating request sent successfully!");
  };

  const handleContextMenu = (e, mode) => {
    e.preventDefault();
    setIsGenerating(true);
    if (mode === "headline") {
      if (getQuillText().length < 5) {
        toast.error("Write at least a couple of words to generate a title.");
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
        return;
      }
      socket.send(
        JSON.stringify({
          input_text: getQuillText(),
          mode: mode,
          websocket_type: "freewritesnippet",
          freewrite_thread_id: selectedFreewriteThread,
        })
      );
    } else if (mode === "flowery") {
      if (window.getSelection().toString().length < 5) {
        toast.error("Select at least a couple of words to show don't tell.");
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
      } else {
        socket.send(
          JSON.stringify({
            input_text: window.getSelection().toString(),
            mode: mode,
            websocket_type: "freewritesnippet",
            freewrite_thread_id: selectedFreewriteThread,
          })
        );
      }
    } else if (mode === "paragraph") {
      const editor = quillRef.current.getEditor();
      const selectionIndex = editor.getSelection().index;
      const lines = editor.getLines(0, selectionIndex);
      const paragraphs = lines
        .map((line) => line.cache)
        .filter((line) => line.length > 0);

      // iterate through the paragraphs backwards, until we have 3 paragraphs whose length is greater than 5
      // paragraphs have a structure of delta, which is an array of operations, which is an array of insertions of text, each of which have a length
      // check the length of the text in each insertion, and if it's greater than 5, add it to the text to replace

      let textToReplace = "";
      let paragraphsFound = 0;
      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const paragraph = paragraphs[i];
        if (paragraph.length < 5) {
          textToReplace = "\n" + textToReplace;
          continue;
        }

        if (!paragraph.delta) {
          textToReplace = "\n" + textToReplace;
          continue;
        }

        if (paragraphsFound === 3) {
          break;
        }

        let ops = paragraph.delta.ops;

        // if it is the paragraph the user selected, we only want to select the text from the beginning of the paragraph to the end of the selection
        if (i === paragraphs.length - 1) {
          const selectionIndex = editor.getSelection().index;
          const selectionLength = editor.getSelection().length;
          const selectionEndIndex = selectionIndex + selectionLength;

          // find the beginning of the paragraph the user is selecting from
          let paragraphStartIndex = 0;
          for (let j = 0; j < i; j++) {
            paragraphStartIndex += paragraphs[j].length;
          }

          // select the text from paragraphStartIndex to selectionEndIndex
          let textToAdd = editor.getText(
            paragraphStartIndex,
            selectionEndIndex - paragraphStartIndex
          );
          textToReplace = textToAdd + textToReplace;
          paragraphsFound++;
          continue;
        }

        for (let j = 0; j < ops.length; j++) {
          const op = ops[j];
          if (op.insert) {
            textToReplace = op.insert + textToReplace;
          }
        }

        paragraphsFound++;
      }

      if (textToReplace.length < 5) {
        toast.error("Select a different location to add a paragraph.");
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
        return;
      }

      socket.send(
        JSON.stringify({
          input_text: textToReplace,
          mode: mode,
          websocket_type: "freewritesnippet",
          freewrite_thread_id: selectedFreewriteThread,
        })
      );
    } else if (mode === "sentence") {
      const editor = quillRef.current.getEditor();
      const selectionIndex = editor.getSelection().index;
      const lines = editor.getLines(0, selectionIndex);
      const paragraphs = lines
        .map((line) => line.cache)
        .filter((line) => line.length > 0);

      // iterate through the paragraphs backwards, until we have 3 paragraphs whose length is greater than 5
      // paragraphs have a structure of delta, which is an array of operations, which is an array of insertions of text, each of which have a length
      // check the length of the text in each insertion, and if it's greater than 5, add it to the text to replace

      let textToReplace = "";
      let paragraphsFound = 0;

      for (let i = paragraphs.length - 1; i >= 0; i--) {
        const paragraph = paragraphs[i];
        if (paragraph.length < 5) {
          textToReplace = "\n" + textToReplace;
          continue;
        }

        if (!paragraph.delta) {
          textToReplace = "\n" + textToReplace;
          continue;
        }

        if (paragraphsFound === 1) {
          break;
        }

        let ops = paragraph.delta.ops;

        // if it is the paragraph the user selected, we only want to select the text from the beginning of the paragraph to the end of the selection
        if (i === paragraphs.length - 1) {
          const selectionIndex = editor.getSelection().index;
          const selectionLength = editor.getSelection().length;
          const selectionEndIndex = selectionIndex + selectionLength;

          // find the beginning of the paragraph the user is selecting from
          let paragraphStartIndex = 0;
          for (let j = 0; j < i; j++) {
            paragraphStartIndex += paragraphs[j].length;
          }

          // select the text from paragraphStartIndex to selectionEndIndex
          let textToAdd = editor.getText(
            paragraphStartIndex,
            selectionEndIndex - paragraphStartIndex
          );
          textToReplace = textToAdd + textToReplace;
          paragraphsFound++;
          continue;
        }

        for (let j = 0; j < ops.length; j++) {
          const op = ops[j];
          if (op.insert) {
            textToReplace = op.insert + textToReplace;
            paragraphsFound++;
          }
        }
      }

      if (textToReplace.length < 5) {
        toast.error("Select a different location to add a paragraph.");
        setTimeout(() => {
          setIsGenerating(false);
        }, 100);
        return;
      }
      socket.send(
        JSON.stringify({
          input_text: textToReplace,
          mode: mode,
          websocket_type: "freewritesnippet",
          freewrite_thread_id: selectedFreewriteThread,
        })
      );
    } else {
      socket.send(
        JSON.stringify({
          input_text: window.getSelection().toString(),
          mode: mode,
          websocket_type: "freewritesnippet",
          freewrite_thread_id: selectedFreewriteThread,
        })
      );
    }
  };

  const showButton = text.replace(/(<([^>]+)>)/gi, "").length > 0;

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* Toolbar Header */}
      <div
        className={`w-full flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        <div className="text-xl font-semibold">Suppal Editor</div>

        {/* Toggle Button */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-full">
            <div className="toggle-button">
              <button
                className={`px-4 py-2 rounded-l-full ${
                  showGrader ? "active" : "inactive"
                }`}
                onClick={() => setShowGrader(true)}
              >
                Grader
              </button>

              <button
                className={`px-4 py-2 rounded-r-full ${
                  !showGrader ? "active" : "inactive"
                }`}
                onClick={() => setShowGrader(false)}
              >
                Editor
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Word and Character Counter */}
          <div>
            Words:{" "}
            {text.replace(/<[^>]+>/g, "").trim() === ""
              ? 0
              : text
                  .replace(/<[^>]+>/g, "")
                  .trim()
                  .split(/\s+/)
                  .filter(Boolean).length}{" "}
            | Characters: {text.replace(/<[^>]+>/g, "").trim().length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Text Editor */}
        <div className="flex-[50%] p-4 border-r border-gray-300 dark:border-gray-700">
          <div
            className={`relative h-full overflow-y-scroll border rounded-md shadow-md ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <ReactQuill
              theme="snow"
              value={text}
              onChange={setText}
              modules={editorModules}
              ref={quillRef}
              readOnly={isGenerating}
              className={`p-4 h-full ${isDarkMode ? "react-quill-dark" : ""}`}
            />
          </div>
        </div>

        {/* Conditional Rendering */}
        {showGrader ? (
          <>
            {/* Essay Grader */}
            <div className="flex-[25%] p-4 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
              <div className="sticky top-4 space-y-4">
                {/* Dropdown for selecting rating system */}
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
          Evaluation Rubric
          </h2>
                <div className="flex justify-center items-center w-full mb-4">
                
                  
                  <select
                    value={selectedRatingSystem}
                    onChange={handleSystemChange}
                    className="px-4 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
                  >
                    <option value="vspice">VSPICE</option>
                    <option value="limmy">LimmyTalks</option>
                    {/* Add more options as needed */}
                  </select>
                </div>

                <div className="flex justify-center items-center w-full mb-4">
                  <button
                    className={`px-6 py-2 rounded-full text-sm font-semibold shadow-md transition-all ${
                      isGenerating
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : isDarkMode
                        ? "bg-blue-500 text-white hover:bg-blue-400"
                        : "bg-[#0f4d92] text-white hover:bg-[#00356b]"
                    }`}
                    onClick={() => {
                      handleRating(selectedRatingSystem); // Use the selected rating system
                      setIsGenerating(true);
                    }}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.372 0 0 5.372 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Evaluate Essay"
                    )}
                  </button>
                </div>

                {/* Conditional rendering of EssayGrader or EssayGrader2 */}
                {selectedRatingSystem === "vspice" ? (
                  <EssayGrader2
                    socket={socket}
                    handleRating={handleRating}
                    ratingData={ratingData}
                    setRatingData={setRatingData}
                  />
                ) : (
                  <EssayGrader
                    socket={socket}
                    handleRating={handleRating}
                    ratingData={ratingData}
                    setRatingData={setRatingData}
                  />
                )}
              </div>
            </div>

            {/* Essay Feedback */}
            <div className="flex-[25%] p-4 overflow-y-auto">
              <div className="sticky top-4 space-y-4">
                <EssayFeedback ratingData={ratingData} />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-[5%] p-4">
            <CommandMenu
              submitCommand={handleContextMenu}
              setTransformModal={setTransformModal}
              setGenerateModal={setGenerateModal}
              isGenerating={isGenerating}
              modeGenerating={modeGenerating}
              setModeGenerating={setModeGenerating}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FreeWrite;
