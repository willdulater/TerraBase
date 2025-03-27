import Message from "./Message";
import ChatModal from "./ChatModal";
import { useState, useEffect, useRef } from "react";
import Request from "../Request/index.jsx";
import CenterForm from "./CenterForm";
import EmptyThreadInfo from "./EmptyThreadInfo";
import { toast } from "react-hot-toast";
import TemplateSelector from "./TemplateSelector";

const Center = ({
  threads,
  setThreads,
  selectedThread,
  setSelectedThread,
  socket,
  setShowCTASubscribed,
  freewriteThreads,
  setFreewriteThreads,
  setSelectedFreewriteThread,
  setSelectedMode,
  selectedTemplate,
  setSelectedTemplate,
 showTemplateSelector,
 setShowTemplateSelector,

}) => {
  const [delilahWorking, setDelilahWorking] = useState(false);
  const [templateType2, setTemplateType2] = useState(null);


  const defaultTextFieldValues = {
      extracurricular: "Extracurricular/Work Experience Essay",
      academic: "Academic Interest Essay",
      identity: "Personal Identity Essay",
      community: "Community Engagement and Service Essay",
      why: "Why College Essay",
      intellectual: "Intellectual Curiosity Essay",
      creative: "Creative Thinking Essay",
      general: "General Supplemental Essay",
    };

    // Get the corresponding text_field_value or use a fallback
    const textFieldValue = defaultTextFieldValues[selectedTemplate] || "";



  useEffect(() => {
    if (socket === null) return;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
    //  console.log("WebSocket Response:", data);


      if (data["error"] !== undefined && data["error"] === "tokens_used") {
        setDelilahWorking(false);
        setShowCTASubscribed(true);
        return;
      }

      if (data["error"] !== undefined && data["error"] === "openai_error") {
        setDelilahWorking(false);
        toast.error(data["message"]);
      }

      if (data.websocket_type === "get_template_type") {
        if (data.template_type) {
          console.log("Received Template Type:", data.template_type);
          setSelectedTemplate(data.template_type || "Default Template"); // Update state with template_type
        } else {
          console.error("Template type not found in response");
        }
      }

      if (
        data["output_text"] &&
        (data["websocket_type"] === "generation" ||
          data["websocket_type"] === "regenerate" ||
          data["websocket_type"] === "command" ||
          data["websocket_type"] === "create")
      ) {
        setThreads(
          threads.map((thread) => {
            if (thread.id === data["thread_id"]) {
              const lastGeneration = thread.generations.slice(-1)[0];
              lastGeneration.text = lastGeneration.text + data["output_text"];
            }
            return thread;
          })
        );
      }
      if (data["prompt"]) {
        setThreads(
          threads.map((thread) => {
            if (thread.id === selectedThread) {
              return {
                ...thread,
                generations: [...thread.generations, data],
              };
            }
            return thread;
          })
        );
      }

      if (data["status"] === "DONE") {
        setDelilahWorking(false);
      }
    };

    return () => {
      socket.onmessage = null;
    };
  }, [threads, selectedThread, socket]);

  useEffect(() => {
    if (socket && socket.readyState === 1 && selectedThread) {
   //   console.log("Sending get_template_type for thread:", selectedThread);
   //   console.log("Selected Thread:", selectedThread);
      socket.send(
        JSON.stringify({
          websocket_type: "get_template_type",
          thread_id: selectedThread,
        })
      );
    } else {
      console.error("WebSocket not ready or selectedThread is missing");
    }
  }, [socket, selectedThread]);

  const sendCommand = (valCommand, valTextFieldValue) => {
    setDelilahWorking(true);
    const data = {
      command: valCommand,
      text_field_value: valTextFieldValue,
      thread_id: selectedThread,
    };
    socket.send(JSON.stringify({ ...data, websocket_type: "command" }));
  };

  const sendCreate = (valCommand, valTextFieldValue) => {
    setDelilahWorking(true);
    const data = {
      prompt_type: selectedTemplate,
      command: valCommand,
      text_field_value: valTextFieldValue,
      thread_id: selectedThread,
      template_type: selectedTemplate
    };
    socket.send(JSON.stringify({ ...data, websocket_type: "create" }));
  };

  const regenerateGeneration = (e) => {
    if (e) e.preventDefault();
    if (delilahWorking) return;
    setDelilahWorking(true);
    setThreads(
      threads.map((thread) => {
        if (thread.id === selectedThread) {
          return {
            ...thread,
            generations: [
              ...thread.generations.slice(0, thread.generations.length - 1),
            ],
          };
        }
        return thread;
      })
    );

    const toSend = { websocket_type: "regenerate", thread_id: selectedThread };
    socket.send(JSON.stringify(toSend));
  };

  const deleteGeneration = () => {
    setDelilahWorking(true);

    const deleteRequest = new Request(
      "threads/" + selectedThread + "/delete_last_generation/",
      {
        method: "POST",
      }
    );

    deleteRequest
      .then((response) => {
        setThreads(
          threads.map((thread) => {
            if (thread.id === selectedThread) {
              return response.data;
            }
            return thread;
          })
        );
        setDelilahWorking(false);
        toast.success("Last generation deleted!");
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setDelilahWorking(false);
      });
  };

  const deleteGenerationFinal = (generationId) => {
    setDelilahWorking(true);

    console.log("Selected Thread ID:", selectedThread);
  console.log("Generation ID:", generationId);


    const deleteRequest = new Request(
      `threads/${selectedThread}/delete_generation/`, // Updated endpoint
      {
        method: "POST",
        data: {
          generation_id: generationId, // Pass the generation ID to delete
        },
      }
    );

    deleteRequest
      .then((response) => {
        setThreads(
          threads.map((thread) => {
            if (thread.id === selectedThread) {
              return response.data; // Update the thread with the new data
            }
            return thread;
          })
        );
        setDelilahWorking(false);
        toast.success("Generation deleted!");
      })
      .catch((err) => {
        toast.error(err.response?.data?.detail || "Failed to delete generation.");
        setDelilahWorking(false);
      });
  };


  

  const getThreadGenerations = () => {
    if (threads.length === 0 || !selectedThread) {
    console.warn("No threads or no selected thread");
    return [];
  }
  const thread = threads.find((thread) => thread.id === selectedThread);
  if (!thread) {
    console.error("Thread not found:", selectedThread);
    return [];
  }
  return thread.generations || [];
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() => {
      elementRef.current.scrollIntoView();
    });
    return <div ref={elementRef} />;
  };

  return (
    <div className="h-screen w-full flex flex-col from-[#F4FAFE] to-[#F4FAFE] bg-gradient-135">
      {showTemplateSelector ? ( //change to true to show configuration page
        // Configuration Page
        <div className="flex-1 overflow-y-auto">
          <TemplateSelector
            showTemplateSelector={showTemplateSelector}
            setShowTemplateSelector={setShowTemplateSelector}
            setSelectedTemplate={setSelectedTemplate}
            setThreads={setThreads}
            setSelectedThread={setSelectedThread}
            threads={threads}
            socket={socket}
            selectedThread={selectedThread}
          />
        </div>
        
      ) : (
        // Chat Feature
        <>
          <div className="flex flex-col items-center w-full mt-8">
            {/* Render selectedTemplate at the top */}
            

            {/* CenterForm placed at the top */}
            {getThreadGenerations().length !== 0 && (
              <div className="w-full max-w-6xl mx-auto">
                <CenterForm
                  sendCommand={sendCommand}
                  deleteGeneration={deleteGeneration}
                  regenerateGeneration={regenerateGeneration}
                  getThreadGenerations={getThreadGenerations}
                  delilahWorking={delilahWorking}
                  sendCreate={sendCreate}
        
                />
                <hr className="w-full border-t-2 border-gray-300 mt-4" />
              </div>
            )}

            
          </div>
          

          <div className="overflow-y-scroll overflow-x-hidden h-screen mx-auto left-0 right-0 w-5/6 mt-4">
  {getThreadGenerations().map((generation, index, arr) => (
    <div
      key={index}
      className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200"
    >
      {/* User Input Section */}
      <div className="mb-3">
        <p className="text-sm font-semibold text-blue-600 mb-1">Your Input:</p>
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <Message
            text={generation.prompt.user_string}
            writtenByDelilah={false}
            sendCommand={sendCommand}
            delilahWorking={delilahWorking}
            setDelilahWorking={setDelilahWorking}
            isLast={false}
            freewriteThreads={freewriteThreads}
            setFreewriteThreads={setFreewriteThreads}
            setSelectedFreewriteThread={setSelectedFreewriteThread}
            setShowCTASubscribed={setShowCTASubscribed}
            setSelectedMode={setSelectedMode}
            deleteGenerationFinal={deleteGenerationFinal}
            generationId={generation.id}
          />
        </div>
      </div>

      {/* AI Response Section */}
      <div>
        <p className="text-sm font-semibold text-green-600 mb-1">AI Response:</p>
        <div className="bg-green-50 border border-green-200 rounded p-3">
          <Message
            text={generation.text || "No response generated yet"}
            writtenByDelilah={true}
            sendCommand={sendCommand}
            delilahWorking={delilahWorking}
            setDelilahWorking={setDelilahWorking}
            isLast={index === arr.length - 1}
            freewriteThreads={freewriteThreads}
            setFreewriteThreads={setFreewriteThreads}
            setSelectedFreewriteThread={setSelectedFreewriteThread}
            setShowCTASubscribed={setShowCTASubscribed}
            setSelectedMode={setSelectedMode}
            deleteGenerationFinal={deleteGenerationFinal}
            generationId={generation.id}
          />
        </div>
      </div>

      {/* Optional Divider */}
      {index !== arr.length - 1 && (
        <div className="w-full h-px bg-gray-300 my-2"></div>
      )}
    </div>
  ))}
  <AlwaysScrollToBottom />
</div>

          
        </>
      )}
    </div>
  );
};

export default Center;