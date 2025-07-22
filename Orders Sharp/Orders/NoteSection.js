import React, { useState } from "react";
import AddNoteModal from "./AddNoteModal";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissionChecker";
import { PRIVILEGES } from "../../utils/privileges";

const NoteSection = ({ notes }) => {
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="w-[25%] ">
      <div>
        <div className="border border-[#E1E6E1] rounded-t-[8px] py-3 px-4 bg-white flex justify-between items-center">
          <p className="text-[#4B564D] font-semibold text-sm ">Notes</p>
          <AddNoteModal show={showModal} setShow={setShowModal} notes={notes} />
        </div>
        <div className="border-b-[none] border-x border-[#E1E6E1] rounded-b-lg p-4 bg-white flex flex-col justify-center items-center max-w-[400px]">
          {/* Displaying the notes dynamically */}
          <div
            className="w-full h-80 overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style>{`.overflow-y-auto::-webkit-scrollbar{
          display:none}`}</style>
            {notes.length > 0 ? (
              notes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  className="mb-2 w-full flex flex-col border border-[#E1E6E1] rounded-md "
                >
                  <div className="flex w-full bg-[#F6F7F6] justify-start text-left items-center border-b border-b-[#E1E6E1] p-2">
                    <p className="text-xs font-semibold text-[#3E473F]">
                      {note.title}
                    </p>
                  </div>
                  <div className="flex justify-start text-left items-center border-b border-b-[#E1E6E1] py-1 px-2">
                    <p className="text-xs font-semibold text-[#79887B]">
                      {note.body.substring(0, 100)}
                      {note.body.length > 100 && "..."}
                    </p>
                  </div>
                  <div className="flex justify-between text-left items-center border-b border-b-[#E1E6E1] p-2">
                    <p className="text-xs font-semibold text-[#5F6D60]">
                      {note.user}
                    </p>
                    <p className="text-xs font-semibold text-[#5F6D60]">
                      {note.time}{" "}
                      <span className="text-base text-[#E1E6E1]">|</span>{" "}
                      {note.date}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[#5F6D60] flex items-center justify-center font-semibold text-xs max-w-[148px] w-full text-center">
                You haven’t added any notes yet
              </p>
            )}
          </div>
          {notes.length > 3 && (
            <div className="flex items-center mt-2">
              <button
                onClick={() => {
                  // Handle view more notes
                  setShowModal(true);
                }}
                className="text-[#2B8C34] font-semibold text-xs text-left"
              >
                View More
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteSection;
