import { Add } from "@mui/icons-material";
import React, { useState } from "react";
import ModalComponent from "../../components/Modals/modal";
import SearchComponent from "../../components/Search";
import { useSelector } from "react-redux";
import { hasPermission } from "../../utils/permissionChecker";
import { PRIVILEGES } from "../../utils/privileges";
import { has } from "lodash";

const AddNoteModal = ({ show, setShow, notes }) => {
  // const [show, setShow] = useState(false);
  const { userInfo, user } = useSelector((state) => state.auth);

  const [noteText, setNoteText] = useState("......");
  const [noteTitle, setNoteTitle] = useState("New Note");

  /*When the button is clicked to submit the note, the date and time should be updated to the current date and time*/
  const [noteDate, setNoteDate] = useState("Today");
  const [noteTime, setNoteTime] = useState("Now");

  // Test state to store the notes temporarily
  const [tempNotes, setTempNotes] = useState(notes);

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDate = () => {
    const today = new Date();
    const options = { month: "short", day: "numeric", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  const updateNoteTitle = (e) => {
    if (!show) {
      setNoteTitle("New Note");
      setNoteDate("Today");
      setNoteTime("Now");
    }
    e.preventDefault();
    setNoteTitle(e.target.value);
    setNoteDate(getDate());
    setNoteTime(getFormattedTime());
  };

  const updateNoteText = (e) => {
    if (!show) {
      setNoteText("......");
      setNoteDate("Today");
      setNoteTime("Now");
    }
    e.preventDefault();
    setNoteText(e.target.value);
    setNoteDate(getDate());
    setNoteTime(getFormattedTime());
  };
  return (
    <div>
      <div
        onClick={() => setShow(true)}
        className="flex gap-1 items-center cursor-pointer"
      >
        <Add style={{ color: "#2B8C34", fontSize: "14px" }} />
        <p className="text-[#2B8C34] font-semibold text-xs ">Add note</p>
      </div>
      <ModalComponent
        style={{ maxWidth: "927px" }}
        show={show}
        showModal={() => {
          setNoteDate("Today");
          setNoteTime("Now");
          setNoteText("......");
          setNoteTitle("New Note");
          setShow(!show);
        }}
        title={"Notes"}
        subtitle=""
      >
        <div className="w-full flex border border-[#E1E6E1] rounded-lg mt-2">
          <div className="w-[40%] border-r border-r-[#E1E6E1] pb-3 border-b border-b-[#E1E6E1]">
            <div className="px-3 py-3">
              <SearchComponent placeholder={"Search"} />
            </div>

            {/* Scrollable container for notes */}
            <div
              className="max-h-[480px] overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`.overflow-y-auto::-webkit-scrollbar{
          display:none}`}</style>{" "}
              {/* Active note (always visible at top) */}
              {hasPermission(user, PRIVILEGES.ADD_NOTE) && (
                <div className={`bg-[#E1F7E3] px-3 py-2`}>
                  <p className="text-[#3E473F] font-semibold text-xs">
                    {noteTitle === "" ? "New Note" : noteTitle}
                  </p>
                  <p className="text-[#96A397] font-medium text-xs line-clamp-3 overflow-hidden text-ellipsis">
                    {noteText.substring(0, 60)}
                  </p>
                  <div className="text-xs font-semibold flex justify-between items-center mt-2">
                    <p className="text-[#5F6D60]">
                      {userInfo ? userInfo?.first_name : "Test"}{" "}
                      {userInfo ? userInfo?.last_name : "User"}
                    </p>
                    <div className="flex gap-1 items-center">
                      <p className="text-[#5F6D60]">{noteTime}</p>
                      <span className="text-[#E1E6E1]">|</span>
                      <p className="text-[#5F6D60]">{noteDate}</p>
                    </div>
                  </div>
                </div>
              )}
              {/* Other notes (scrollable if many) */}
              {tempNotes.length > 0 &&
                tempNotes.map((note, index) => (
                  <div key={note.id} className={` w-full flex flex-col`}>
                    <div className="flex w-full justify-start text-left items-center p-2">
                      <p className="text-xs font-semibold text-[#3E473F]">
                        {note.title}
                      </p>
                    </div>
                    <div className="flex justify-start text-left items-center py-1 px-2">
                      <p className="text-xs font-semibold text-[#79887B]">
                        {note.body?.substring(0, 100)}
                        {note.body?.length > 100 && "..."}
                      </p>
                    </div>
                    <div className="flex justify-between text-left items-center border-b border-b-[#E1E6E1] p-1">
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
                ))}
            </div>
          </div>
          <div className="w-[60%] flex flex-col">
            <div className=" pt-3 pb-2 px-4 border-b w-full border-b-[#E1E6E1]">
              <input
                className="placeholder:text-[#96A397] font-semibold text-base text-[#3E473F] w-full border-none outline-none"
                placeholder="Note title"
                onChange={updateNoteTitle}
                type="text"
                value={noteTitle === "New Note" ? "" : noteTitle}
              />
              {/* Note title and Date */}
              <div className="text-xs font-semibold flex justify-between items-center my-2 ">
                <p className="text-[#5F6D60]">
                  {userInfo ? userInfo?.first_name : "Test"}{" "}
                  {userInfo ? userInfo?.last_name : "User"}
                </p>
                <div className="flex gap-1 items-center">
                  <p className="text-[#5F6D60]">{noteTime}</p>
                  <span className="text-[#E1E6E1]">|</span>
                  <p className="text-[#5F6D60]">{noteDate}</p>
                </div>
              </div>
            </div>
            {/* Note body */}
            <div className="flex-1 px-4 pt-1">
              <textarea
                className="placeholder:text-[#79887B] font-medium text-sm text-[#79887B] outline-none min-h-[300px] w-full"
                placeholder="Add your note..."
                onChange={updateNoteText}
                value={noteText === "......" ? "" : noteText}
                type="text"
                // rows={5}
                // cols={5}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-2 mt-3">
          <button
            onClick={() => {
              if (noteText === "......" && noteTitle === "New Note") {
                setShow(false);
                return;
              }
              if (noteText && noteTitle) {
                setTempNotes([
                  ...tempNotes,
                  {
                    title: noteTitle,
                    text: noteText,
                    date: noteDate,
                    time: noteTime,
                  },
                ]);
                setNoteText("......");
                setNoteTitle("New Note");
                setNoteDate("Today");
                setNoteTime("Now");
              }

              setShow(false);
            }}
            className="bg-[#2B8C34] text-white font-semibold text-sm px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </ModalComponent>
    </div>
  );
};

export default AddNoteModal;
