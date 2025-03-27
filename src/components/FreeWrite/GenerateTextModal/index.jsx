import { Dialog, Transition } from "@headlessui/react"
import { useState, useEffect, Fragment } from "react"
import TextareaAutosize from "react-textarea-autosize"
import toast from "react-hot-toast"

const GenerateTextModal = ({
	open,
	setOpen,
	selectedThread,
	socket,
	setIsGenerating,
}) => {
	const [textToGenerate, setTextToGenerate] = useState("transformText")

	useEffect(() => {
		if (!open) {
			setTimeout(() => {
				setTextToGenerate("")
			}, 500)
		}
	}, [open])

	const submitGenerateText = () => {
		if (textToGenerate.length < 5) {
			toast.error(
				"Write a bit more about what you want to generate. It should be at least 5 characters long."
			)
			return
		}

		setIsGenerating(true)
		socket.send(
			JSON.stringify({
				input_text: textToGenerate,
				websocket_type: "freewritesnippet",
				mode: "generate",
				freewrite_thread_id: selectedThread,
			})
		)
		setOpen(false)
	}

	return (
		<Transition.Root show={open} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={setOpen}>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
				</Transition.Child>

				<div className='fixed inset-0 z-10 overflow-y-auto'>
					<div className='flex min-h-full h-[16rem] items-end justify-center p-4 text-center sm:items-center sm:p-0'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
							enterTo='opacity-100 translate-y-0 sm:scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 translate-y-0 sm:scale-100'
							leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						>
							<Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-1/2 sm:p-6 sm:px-12 sm:h-fit'>
								<div className='mt-3 text-center sm:mt-0 sm:text-left'>
									<p className='text-lg font-bold'>Transform text</p>
								</div>

								<div className='flex flex-col mt-3 space-y-3 min-h-[4rem]'>
									<div className='flex flex-col'>
										<div className='flex flex-row justify-between'>
											<div className='flex flex-row'>
												<p className='text-xs text-[#545E6B] font-bold'>
													What would you like to write about?
												</p>
											</div>
										</div>
										<TextareaAutosize
											type='text'
											className='border-[1px] border-[#E5E7EB] rounded-lg p-2 mt-1 sm:min-h-max'
											value={textToGenerate}
											onChange={(e) => setTextToGenerate(e.target.value)}
											placeholder='A paragraph about the future of AI'
										/>
									</div>
								</div>

								<div className='mt-5 sm:mt-10 flex flex-row justify-end w-full'>
									<button
										type='button'
										className='mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-2/5 sm:text-sm'
										onClick={() => setOpen(false)}
									>
										Cancel
									</button>
									<button
										type='button'
										className={
											"inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-delilahPrimary/80 focus:ring-offset-2 sm:ml-3 sm:w-2/5 sm:text-sm bg-delilahSecondary"
										}
										onClick={(e) => submitGenerateText()}
									>
										Generate
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	)
}

export default GenerateTextModal
