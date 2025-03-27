import { useEffect, useState, useRef } from "react"
import Request from "../../Request/index.jsx"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { useAuth0 } from "@auth0/auth0-react"
import logo from "../../../img/collegebase-mini.png"
import CenterMenu from "../CenterMenu"
import { toast } from "react-hot-toast"

const Message = ({
	sendCommand,
	writtenByDelilah,
	text,
	delilahWorking,
	deleteGenerationFinal,
	isLast,
	freewriteThreads,
	setFreewriteThreads,
	setSelectedFreewriteThread,
	setShowCTASubscribed,
	setSelectedMode,
	generationId,
}) => {
	const [contextMenu, setContextMenu] = useState(null)
	const { user } = useAuth0()
	const { picture } = user
	const elementRef = useRef(null)

	useEffect(() => {
		function handleSelectionChange(e) {
			const selection = window.getSelection().toString()
			e.preventDefault()

			if (selection.length > 5) {
				setContextMenu(
					contextMenu === null
						? {
								mouseX: e.clientX + 2,
								mouseY: e.clientY - 6,
						  }
						: null
				)
			} else {
				setContextMenu(null)
			}
		}

		if (elementRef.current) {
			elementRef.current.addEventListener("mouseup", handleSelectionChange)
		}

		return () => {
			if (elementRef.current) {
				elementRef.current.removeEventListener("mouseup", handleSelectionChange)
			}
		}
	}, [contextMenu, elementRef, text])

	const handleContextMenu = (event) => {
		event.preventDefault()
	}

	const handleCopy = () => {
	navigator.clipboard.writeText(text.trim()); // Use the entire `text` instead of selected text
	setContextMenu(null);
	toast.success("Message copied to clipboard!");
	};

	const handleShowDontTell = (e) => {
  e.preventDefault();
  sendCommand("showdonttell", text.trim()); // Pass the entire `text` instead of selected text
  setContextMenu(null);
  toast.success("Show Don't Tell command sent!");
};



	const handleDelete = () => {
    if (deleteGenerationFinal && generationId) {


      deleteGenerationFinal(generationId); // Use generationId when deleting
    }
  	};

	const handleOpenInFreewrite = (e) => {
		const threadRequest = new Request("freewritethreads/", {
			method: "POST",
			data: {
				title: "Refine Essay",
				description: "This is the new thread's description",
				text: text.trim(),
			},
		})
		threadRequest
			.then((res) => {
				setFreewriteThreads([...freewriteThreads, res.data])
				setSelectedFreewriteThread(res.data.id)
				setSelectedMode("freewrite")
				setContextMenu(null)
			})
			.catch((err) => {
				setShowCTASubscribed(true)
			})
	}

	return (
  <div className="relative my-3">
    <div
      className={`flex flex-col p-4 gap-2 rounded-lg shadow-md ${
        writtenByDelilah ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"
      }`}
      ref={elementRef}
    >
      {/* Message Header with Profile Picture and Name */}
      <div className="flex items-center gap-3">
        {/* Profile Picture */}
        {!writtenByDelilah ? (
          <img
            src={picture}
            alt="User"
            className="h-8 w-8 rounded-full shadow-sm"
          />
        ) : (
          <img
            className="h-8 w-8 rounded-full shadow-sm"
            src={logo}
            alt="Suppal Logo"
          />
        )}
        
        {/* Name (You or Suppal AI) */}
        <span
          className={`font-semibold text-sm ${
            writtenByDelilah ? "text-blue-600" : "text-gray-600"
          }`}
        >
          {writtenByDelilah ? "Suppal AI" : "You"}
        </span>
      </div>

      {/* Message Text */}
      <div
        className="whitespace-pre-wrap leading-relaxed text-gray-700 relative hover:cursor-text mt-2"
        onContextMenu={handleContextMenu}
      >
        {text.trim()}
      </div>

	  


      {/* Footer Section */}
{/* Footer Section (only for AI responses) */}
{writtenByDelilah && !delilahWorking && (
  <div className="flex justify-between items-center mt-4">
    {/* Word Count */}
    <div className="text-xs text-gray-500">
      {`Word Count: ${text.trim().split(/\s+/).filter(Boolean).length}`}
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition"
      >
        Copy
      </button>

      {/* Open in Refine */}
      <button
        onClick={handleOpenInFreewrite}
        className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 transition"
      >
        Open in Refine
      </button>

      {/* Show Don't Tell */}
      <button
        onClick={handleShowDontTell}
        className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500 transition"
      >
        Show Don't Tell
      </button>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition"
      >
        Delete
      </button>
    </div>
  </div>
)}



      {/* Context Menu */}
      <Menu
        open={contextMenu !== null}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? {
                top: contextMenu.mouseY,
                left: contextMenu.mouseX,
              }
            : undefined
        }
      >
        <MenuItem onClick={handleCopy}>
          <ListItemText>Copy</ListItemText>
          <Typography variant="body2" color="text.secondary">
            ⌘C
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={handleOpenInFreewrite}
          disabled={
            !(window.getSelection().toString().length > 0) || delilahWorking
          }
        >
          Open in Refine
        </MenuItem>
        <MenuItem
          onClick={handleShowDontTell}
          disabled={
            !(window.getSelection().toString().length > 0) || delilahWorking
          }
        >
          Show Don't Tell
        </MenuItem>
        
      </Menu>
    </div>
  </div>
);



}
export default Message
