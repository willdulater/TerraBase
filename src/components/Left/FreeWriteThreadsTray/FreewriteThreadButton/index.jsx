import React, { useState } from "react"
import Request from "../../../Request/index.jsx"
import Modal from "../../../Modal"
import { ReactComponent as ChatIcon } from "../../../../svg/chat-icon.svg"
import {
	PencilSquareIcon,
	TrashIcon,
	CheckIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline"
import { toast } from "react-hot-toast"

const FreewriteThreadButton = ({
	thread,
	freewriteThreads,
	setFreewriteThreads,
	selectedFreewriteThread,
	setSelectedFreewriteThread,
}) => {
	const [showTextField, setShowTextField] = useState(false)
	const [textFieldValue, setTextFieldValue] = useState(thread.title)
	const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)

	const deleteThread = (e) => {
		e.preventDefault()
		setIsConfirmingDelete(false)
		const threadRequest = new Request(
			"freewritethreads/" + thread.id + "/delete/",
			{
				method: "DELETE",
			}
		)
		threadRequest
			.then((res) => {
				const indexOfDeletedThread = freewriteThreads.findIndex(
					(tempThread) => tempThread.id === thread.id
				)
				setFreewriteThreads(
					freewriteThreads.filter((tempThread) => tempThread.id !== thread.id)
				)
				if (indexOfDeletedThread === 0) {
					setSelectedFreewriteThread(freewriteThreads[1].id)
				} else {
					setSelectedFreewriteThread(
						freewriteThreads[indexOfDeletedThread - 1].id
					)
				}
			})
			.catch((err) => {
				toast.error(err.response.data.message)
			})
	}

	const handleTextFieldSubmit = (e) => {
		e.preventDefault()

		const threadRequest = new Request(
			"freewritethreads/" + thread.id + "/edit/",
			{
				method: "POST",
				data: { title: textFieldValue },
			}
		)
		threadRequest
			.then((res) => {
				setFreewriteThreads(
					freewriteThreads.map((threadTemp) => {
						if (threadTemp.id === thread.id) {
							threadTemp.title = textFieldValue
						}
						return threadTemp
					})
				)
				setShowTextField(false)
			})
			.catch((err) => {
				toast.error(err.response.data.message)
			})
	}

	const selectedFreeWriteThreadBackgroundClass = () => {
		return selectedFreewriteThread === thread.id ? "bg-[#90CAF9]/50" : ""
	}

	return (
		<>
			<Modal
				open={isConfirmingDelete}
				setOpen={setIsConfirmingDelete}
				titleText={"Delete thread"}
				bodyText={
					"Are you sure you want to delete this thread? You can find your previously deleted threads in the trash."
				}
				confirmButtonAction={deleteThread}
				confirmButtonText={"Delete"}
			/>
			<div
				className={
					"items-center flex flex-row hover:cursor-pointer w-full pl-7 py-3 pr-3 " +
					selectedFreeWriteThreadBackgroundClass()
				}
				onClick={() => setSelectedFreewriteThread(thread.id)}
			>
				<ChatIcon className='min-w-[1rem] h-4 shrink-0' />
				{!showTextField ? (
					<>
						<p className='whitespace-nowrap text-md text-left text-ellipsis overflow-hidden ml-3 mr-3 text-black text-opacity-100 grow'>
							{thread.title}
						</p>

						{selectedFreewriteThread === thread.id && (
							<div className='flex flex-row mr-3'>
								<PencilSquareIcon
									className='w-5 h-5 text-black text-opacity-90 mr-1'
									onClick={() => setShowTextField(true)}
								/>

								{freewriteThreads.length > 1 && (
									<TrashIcon
										className='w-5 h-5 text-black text-opacity-90'
										onClick={() => setIsConfirmingDelete(true)}
									/>
								)}
							</div>
						)}
					</>
				) : (
					<form
						className='flex flex-row w-full text-black'
						onSubmit={handleTextFieldSubmit}
					>
						<input
							type='text'
							className='grow bg-inherit ml-3'
							value={textFieldValue}
							onChange={(e) => setTextFieldValue(e.target.value)}
							autoFocus
							maxLength={100}
						/>

						<CheckIcon
							className='w-5 h-5 text-black text-opacity-90 ml-2 mr-1'
							onClick={(e) => handleTextFieldSubmit(e)}
						/>

						<XMarkIcon
							className='w-5 h-5 text-black text-opacity-90'
							onClick={() => setShowTextField(false)}
						/>
					</form>
				)}
			</div>
		</>
	)
}

export default FreewriteThreadButton
