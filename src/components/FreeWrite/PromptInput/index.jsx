import React, { useState } from "react"

const PromptInput = ({ prompt, setPrompt, updatePrompt }) => {
	const [isEditing, setIsEditing] = useState(false)

	const handleChange = (e) => {
		setPrompt(e.target.value)
	}

	const handleClick = () => {
		setIsEditing(false)
		updatePrompt(prompt)
	}

	return (
		<div className='border-slate-300 mb-3 p-1 bg-white rounded-2xl shadow-xl pl-5'>
			<p className='my-4 font-semibold text-[#101828] border-b-[1px] w-1/2'>
				What prompt are you working on?
			</p>
			<textarea
				className='w-full text-[#475467]'
				placeholder='Some students have a story so compelling...'
				value={prompt}
				onChange={handleChange}
				onClick={() => setIsEditing(true)}
				onBlur={handleClick}
			/>
			{isEditing && (
				<div className='flex flex-row items-end justify-end space-x-2 mb-[.5rem]'>
					<div
						className='bg-[#FC0000]/10 rounded-md text-center p-2 w-[8rem] hover:cursor-pointer'
						onClick={() => setIsEditing(false)}
					>
						<p className='font-normal text-[#FC0000]'>Cancel</p>
					</div>
					<div
						className='bg-[#7D55D6] rounded-md text-center p-2 w-[8rem] hover:cursor-pointer'
						onClick={handleClick}
					>
						<p className='font-normal text-white'>Save</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default PromptInput
