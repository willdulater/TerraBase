import { useState } from "react"
import PaperPlane from "../../../svg/paperplane.svg"
import TextareaAutosize from "react-textarea-autosize"

const InterviewForm = ({
	commandValue,
	setCommandValue,
	sendCommand,
	formSubmitting,
	setFormSubmitting,
	predictedCommands,
	loadingPredictedCommands,
	sendPredictedCommand,
}) => {
	const [showPredicted, setShowPredicted] = useState(true) // Toggle state

	const submitForm = (e) => {
		if (commandValue.trim().length === 0) return
		e.preventDefault()
		setFormSubmitting(true)
		sendCommand(e)
	}

	const submitPredictedCommand = (e, command) => {
		e.preventDefault()
		setFormSubmitting(true)
		sendPredictedCommand(command)
	}

	return (
		<form
			onSubmit={submitForm}
			className="rounded-2xl bg-white w-4/5 mx-auto mb-8 shadow-xl border border-gray-200"
		>
			<div className="flex flex-col p-4">
				{/* Toggle Predicted Commands Section */}
				<div className="flex justify-between items-center mb-4">
					<label className="text-md font-semibold text-gray-700">
						Predicted Responses
					</label>
					<div 
						className={`relative w-12 h-6 rounded-full transition duration-300 cursor-pointer ${
							showPredicted ? "bg-[#0f4d92]" : "bg-gray-300"
						}`}
						onClick={() => setShowPredicted(!showPredicted)}
					>
						<div
							className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
								showPredicted ? "translate-x-6" : "translate-x-0"
							}`}
						></div>
					</div>
				</div>

				{/* Display Predicted Commands */}
				<div className="w-full text-center">
					{showPredicted && predictedCommands.length > 0 ? (
						<div className="flex flex-wrap justify-center gap-2">
							{predictedCommands.map((command, index) => (
								<p
									key={index}
									className={`text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-200 transition ${
										loadingPredictedCommands ? "cursor-default opacity-50" : "cursor-pointer"
									}`}
									onClick={(e) => {
										if (!loadingPredictedCommands) submitPredictedCommand(e, command)
									}}
								>
									{loadingPredictedCommands ? "Loading..." : command}
								</p>
							))}
						</div>
					) : (
						<p className="text-sm text-gray-500 italic">
							{showPredicted ? "No Predictions Available" : "Predicted Commands Disabled"}
						</p>
					)}
				</div>
			</div>

			{/* Input Field & Submit Button */}
			<div className="px-4 flex flex-row justify-center items-center w-full">
				<div className="w-full flex flex-col p-3">
					<TextareaAutosize
						className="w-full text-gray-700 bg-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-[#7C55D6] focus:outline-none resize-none transition"
						type="text"
						value={commandValue}
						onChange={(e) => setCommandValue(e.target.value)}
						placeholder="Write your response..."
						disabled={formSubmitting}
						maxRows={3}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								if (e.shiftKey) return
								submitForm(e)
							}
						}}
						minLength={1}
					/>
				</div>

				<button
					className="bg-[#0f4d92] p-3 rounded-lg transition duration-300 hover:bg-[#00356b] shadow-md"
					type="submit"
				>
					<img src={PaperPlane} alt="Send" className="w-5 h-5" />
				</button>
			</div>
		</form>
	)
}

export default InterviewForm
