import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Request from "../../Request";
import { Dialog, Transition } from "@headlessui/react";
import { useEffect } from "react";

const TemplateSelector = ({
  showTemplateSelector,
  setShowTemplateSelector,
  setSelectedTemplate,
  setThreads,
  selectedThread,
  setSelectedThread,
  threads,
  socket,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
  console.log("Template Selector is now:", showTemplateSelector);
}, [showTemplateSelector]);

  const handleTemplateSelect = (templateType) => {
    // Define default text_field_value based on templateType
    const defaultTextFieldValues = {
      extracurricular: "Help me write about my most meaningful extracurricular activity or work experience.",
      academic: "Help me write about my academic interests and how they align with my college goals.",
      identity: "Help me write about my personal background and identity.",
      community: "Help me write about my involvement in community service and how it has shaped me.",
      why: "Help me explain why I want to attend this college.",
      intellectual: "Help me write about my intellectual curiosity and how it influences my learning.",
      creative: "Help me write about my creative thinking process and how I solve problems uniquely.",
      general: "Help me write a general supplemental essay that reflects my personality and goals.",
    };

    // Get the corresponding text_field_value or use a fallback
    const textFieldValue = defaultTextFieldValues[templateType] || "Help me with my essay.";

    setSelectedTemplate(templateType);

    const threadRequest = new Request("threads/", {
      method: "POST",
      data: {
        title: `${templateType.charAt(0).toUpperCase() + templateType.slice(1)} Essay`, // Capitalized title
        description: "This is the new thread's description",
      },
    });

    threadRequest
      .then((res) => {
        const newThread = res.data;

        // Update threads state
        setThreads([...threads, newThread]);

        // Immediately set the selected thread to the new thread's ID
        setSelectedThread(newThread.id);

        // Prepare data for socket communication
        const data = {
          prompt_type: templateType,
          command: "command",
          text_field_value: textFieldValue,
          thread_id: newThread.id, // Use the new thread's ID directly
          template_type: templateType,
        };

        // Send data via socket
        socket.send(JSON.stringify({ ...data, websocket_type: "create_new" }));

        // Close the template selector
        setShowTemplateSelector(false);
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
  };

  return (
    <Transition.Root show={showTemplateSelector} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setShowTemplateSelector(false)}>
        {/* Background Overlay */}
        <Transition.Child
  as={Fragment}
  enter="ease-out duration-300"
  enterFrom="opacity-0"
  enterTo="opacity-100"
  leave="ease-in duration-300"
  leaveFrom="opacity-100"
  leaveTo="opacity-0"
>
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
</Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

            <Transition.Child
  as={Fragment}
  enter="ease-out duration-300"
  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  enterTo="opacity-100 translate-y-0 sm:scale-100"
  leave="ease-in duration-300"
  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
>
  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-6xl sm:w-full sm:p-6">
   

     {/* Close Button */}
<button
  className="absolute top-4 right-4 text-gray-700 hover:text-red-600 rounded-full h-12 w-12 flex items-center justify-center text-3xl"
  onClick={() => setShowTemplateSelector(false)}
  aria-label="Close Template Selector"
  tabIndex="-1"
>
  &times;
</button>



      

      <div className="text-center">
                  <h3 className="text-3xl font-bold mb-4">Supplemental Types</h3>
                  <p className="text-gray-500 text-lg mb-6">
                    Select a template for more refined and relevant text generation.
                  </p>
                </div>
     
      <div className="w-full mx-auto">
        {/* Template Cards */}

        {/* Extracurricular Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("extracurricular")}
>
  <img src="template-ec.svg" alt="Extracurricular Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Extracurricular/Work Experience Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that ask for details about the student's non-academic activities, such as clubs, sports, or jobs.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: Briefly elaborate on one of your extracurricular activities, a job you hold, or responsibilities you have for your family. (Stanford)
    </p>
  </div>
</div>

{/* Academic Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("academic")}
>
  <img src="template-academic.svg" alt="Academic Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Academic Interest Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that seek insight into the student's academic interests, research experiences, and intellectual pursuits.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: What academic areas most pique your curiosity, and how do the programs offered at Princeton suit your particular interests?
    </p>
  </div>
</div>

{/* Identity Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("identity")}
>
  <img src="template-identity.svg" alt="Identity Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Personal Identity Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that inquire about the student's self-identity, personal background, and how these have shaped their experiences.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: Share how an aspect of your growing up has inspired or challenged you, and what unique contributions this might allow you to make to the Brown community.
    </p>
  </div>
</div>

{/* Community Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("community")}
>
  <img src="template-community.svg" alt="Community Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Community Engagement and Service Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that focus on the student's involvement in their community and how they contribute to the welfare of others.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: How will you explore community at Penn? 
    </p>
  </div>
</div>

{/* Why College Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("why")}
>
  <img src="template-why.svg" alt="Why College Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Why College Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that explain your reasons for wanting to attend a specific college or university.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: What is it about Yale that has led you to apply?
    </p>
  </div>
</div>

{/* Intellectual Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("intellectual")}
>
  <img src="template-intellectual.svg" alt="Intellectual Icon" className="w-16 h-16 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Intellectual Curiosity Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that explore your passion for learning and curiosity about the world.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: Tell us about an intellectual or creative passion you have pursued; what did you learn about yourself through that pursuit? (Amherst)
    </p>
  </div>
</div>

{/* Creative Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("creative")}
>
  <img src="template-creative.svg" alt="Creative Icon" className="w-12 h-12 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">Creative Thinking Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Essays that highlight your creativity and unique problem-solving approach.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: In what ways do we become younger as we get older? (UChicago)
    </p>
  </div>
</div>

{/* General Card */}
<div className="border-t border-gray-300 w-full"></div>
<div
  className="hover:bg-gray-300 cursor-pointer transition duration-200 rounded-lg overflow-hidden flex items-center gap-x-4"
  onClick={() => handleTemplateSelect("general")}
>
  <img src="template-general.svg" alt="General Icon" className="w-12 h-12 m-4" />
  <div className="flex-1 py-4">
    <h2 className="text-2xl font-semibold">General Supplemental Essay</h2>
    <p className="text-gray-600 mt-2 text-lg">
      Everything else.
    </p>
    <p className="text-gray-400 text-sm mt-1 italic">
      Ex: Write a note to your future roommate that reveals something about you or that will help your roommate.
    </p>
  </div>
</div>
</div>
      
      </Dialog.Panel>
      </Transition.Child>
    </div>
    </div>
    </Dialog>
    </Transition.Root>
  );
};

export default TemplateSelector;
