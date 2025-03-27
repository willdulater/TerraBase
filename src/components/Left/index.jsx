import NavTray from "./NavTray";
import NewThreadButton from "./NewThreadButton";
import ThreadsTray from "./ThreadsTray";
import NewFreewriteThreadButton from "./FreeWriteThreadsTray/NewFreewriteThreadButton";
import FreeWriteThreadsTray from "./FreeWriteThreadsTray";

import NewInterviewButton from "./NewInterviewButton";

import InterviewThreadsTray from "./InterviewThreadsTray";
import ModeSelector from "./ModeSelector";

const Left = ({
  showNav,
  selectedMode,
  setSelectedMode,
  threads,
  setThreads,
  selectedThread,
  setSelectedThread,
  setShowChatModal,
  freewriteThreads,
  setFreewriteThreads,
  selectedFreewriteThread,
  setSelectedFreewriteThread,
  setShowCTASubscribed,
  interviewThreads,
  setInterviewThreads,
  selectedInterviewThread,
  setSelectedInterviewThread,
  setShowInterviewModal,
  subscription,
  setShowTemplateSelector,
}) => {
  return (
    <div
      className={`${
        showNav ? "w-64" : "w-0 hidden"
      } h-screen flex flex-col border-r border-gray-700 transition-all duration-300`}
    >
      {/* Mode Selector (Top Navigation) */}
      <ModeSelector selectedMode={selectedMode} setSelectedMode={setSelectedMode} />

      {/* Section Wrappers */}
      <div className="flex flex-col flex-grow overflow-y-auto mt-2 space-y-2 px-3">
        

        {/* Interview Mode */}
        {selectedMode === "interview" && (
          <SidebarSection title="Interviews">
            <InterviewThreadsTray
              interviewThreads={interviewThreads}
              setInterviewThreads={setInterviewThreads}
              selectedInterviewThread={selectedInterviewThread}
              setSelectedInterviewThread={setSelectedInterviewThread}
            />
          </SidebarSection>
        )}

        {/* Chat Mode */}
        {selectedMode === "chat" && (
          <SidebarSection title="Threads">
            <ThreadsTray
              threads={threads}
              setThreads={setThreads}
              selectedThread={selectedThread}
              setSelectedThread={setSelectedThread}
              setShowTemplateSelector={setShowTemplateSelector}
              selectedMode={selectedMode}
              setSelectedMode={setSelectedMode}
            />
          </SidebarSection>
        )}

        {/* Freewrite Mode */}
        {selectedMode === "freewrite" && (
          <SidebarSection title="Freewrite">
            <FreeWriteThreadsTray
              freewriteThreads={freewriteThreads}
              setFreewriteThreads={setFreewriteThreads}
              selectedFreewriteThread={selectedFreewriteThread}
              setSelectedFreewriteThread={setSelectedFreewriteThread}
            />
          </SidebarSection>
        )}
      </div>

      {/* Bottom Navigation */}
      <NavTray setSelectedMode={setSelectedMode} subscription={subscription} />
    </div>
  );
};

// Sidebar Section Component (Reusable)
const SidebarSection = ({ title, children }) => {
  return (
    <div className="text-gray-400">
      <h3 className="text-xs font-medium px-2 mb-1 uppercase tracking-widest">{title}</h3>
      <div className="bg-gray-800 p-2 rounded-lg">{children}</div>
    </div>
  );
};

export default Left;
