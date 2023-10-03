import React, { Fragment, useState } from "react";
import toast from "react-hot-toast";
import { Dialog, Transition } from "@headlessui/react";
import LoadingDots from "@/components/loading-dots";
import { PlusIcon } from "@heroicons/react/20/solid";

export const NewChatModal = ({ fetchChats, isOpen, setIsOpen }) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const onclick = () => {
    if (title.length == 0) {
      toast.error("Title cannot be empty!");
      return;
    }

    setLoading(true);
    fetch("/api/auth/new-chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
      }),
    }).then(async (res) => {
      setLoading(false);
      if (res.status === 200) {
        toast.success("Created successfully");
        closeModal();
        fetchChats();
      } else {
        toast.error(await res.text());
      }
    });
  };
  return (
    <>
      <div className="flex items-center justify-center ml-2">
        <div className="tooltip tooltip-left" data-tip="New Chat">
          <button type="button" onClick={openModal} className="btn btn-sm btn-outline btn-square">
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    New Chat
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Create a new chat</p>
                  </div>

                  <div className="mt-4">
                    <input className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal mb-4" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
                    <button disabled={loading} onClick={() => onclick()} className={`${loading ? "cursor-not-allowed border-gray-200 bg-gray-100" : "border-black bg-black text-white hover:bg-white hover:text-black"} flex h-10 px-4 items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}>
                      {loading ? <LoadingDots color="#808080" /> : <p>New Chat</p>}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
