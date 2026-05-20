"use client";

import { getCandidateDetailsByIdAction, updateJobApplication } from "@/actions";
import Link from "next/link";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  User, Mail, Briefcase, MapPin, Building2, DollarSign,
  Clock, GraduationCap, Code2, Linkedin, Github,
  FileText, CheckCircle2, XCircle, Calendar, ExternalLink,
  Star, Trophy
} from "lucide-react";

function CandidateList({
  currentCandidateDetails,
  setCurrentCandidateDetails,
  jobApplication,
  showCurrentCandidateDetailsModel,
  setShowCurrentCandidateDetailsModel,
}) {
  const [selectedDateTime, setSelectedDateTime] = useState(null);

  const handleFetchCandidateDetails = async (id) => {
    const data = await getCandidateDetailsByIdAction(id);
    if (data) {
      setCurrentCandidateDetails(data);
      setShowCurrentCandidateDetailsModel(true);
    }
  };

  const handlePreviewResume = () => {
    const url = currentCandidateDetails?.candidateInfo?.resume?.publicPath;
    if (url) {
      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("target", "_blank");
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleUpdateJobStatus = async (status) => {
    let copy = [...jobApplication];
    const idx = copy.findIndex(item => item.candidateUserId === currentCandidateDetails?.userId);
    await updateJobApplication({ ...copy[idx], status: copy[idx].status.concat(status) }, "/jobs");
  };

  const handleUpdateJobInterview = async (time) => {
    let copy = [...jobApplication];
    const idx = copy.findIndex(item => item.candidateUserId === currentCandidateDetails?.userId);
    await updateJobApplication({ ...copy[idx], interviewDate: time }, "/jobs");
  };

  const isApplicationExists = jobApplication.find(
    item => item.candidateUserId === currentCandidateDetails?.userId
  );
  const isSelected = isApplicationExists?.status.includes("Selected");
  const isRejected = isApplicationExists?.status.includes("Rejected");
  const interviewDate = isApplicationExists?.interviewDate;

  const InfoRow = ({ icon: Icon, label, value, href }) => (
    value ? (
      <div className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
        <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-3.5 h-3.5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">{label}</p>
          {href ? (
            <a href={value} target="_blank" rel="noopener noreferrer"
              className="text-sm font-medium text-violet-600 hover:underline flex items-center gap-1 truncate">
              {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <p className="text-sm font-semibold text-gray-800 truncate">{value}</p>
          )}
        </div>
      </div>
    ) : null
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .cl-wrap { font-family: 'DM Sans', sans-serif; }
        .cl-title { font-family: 'Syne', sans-serif; }
        .candidate-card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .candidate-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px -8px rgba(0,0,0,0.1); }
        .action-btn { transition: all 0.2s ease; }
        .action-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 13px;
          outline: none;
          background: #f9fafb;
          font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .react-datepicker__input-container input:focus {
          border-color: #8b5cf6;
          background: white;
          box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
        }
        .dialog-enter { animation: dialogIn 0.25s cubic-bezier(0.4,0,0.2,1); }
        @keyframes dialogIn { from { opacity:0; transform:scale(0.97) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      {/* ── CANDIDATE CARDS GRID ── */}
      <div className="cl-wrap grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobApplication?.map((item, idx) => {
          const appIsSelected = item.status?.includes("Selected");
          const appIsRejected = item.status?.includes("Rejected");
          const hasInterview = !!item.interviewDate;
          const interviewPassed = hasInterview && new Date(item.interviewDate) <= new Date();

          return (
            <div
              key={idx}
              className="candidate-card bg-white rounded-2xl border border-gray-100 overflow-hidden"
              style={{ boxShadow: "0 4px 20px -6px rgba(0,0,0,0.07)" }}
            >
              {/* Status bar */}
              <div className={`h-1 w-full ${appIsSelected ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                : appIsRejected ? "bg-gradient-to-r from-red-400 to-rose-500"
                  : "bg-gradient-to-r from-violet-500 to-purple-600"}`} />

              <div className="p-4">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {item.name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="cl-title font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-gray-400 truncate">{item.email}</p>
                  </div>
                  {appIsSelected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                  {appIsRejected && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      <XCircle className="w-3 h-3" /> Rejected
                    </span>
                  )}
                </div>

                {/* Interview info */}
                <div className="mb-4">
                  {interviewPassed ? (
                    <Link
                      href={{ pathname: "/interview", query: { id: item.candidateUserId } }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold"
                    >
                      <Trophy className="w-3.5 h-3.5" /> Take Interview
                    </Link>
                  ) : hasInterview ? (
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                      <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-blue-700">
                        {format(new Date(item.interviewDate), "MMM d, yyyy h:mm aa")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                      <Calendar className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                      <span className="text-xs text-gray-400">No interview scheduled</span>
                    </div>
                  )}
                </div>

                {/* View profile button */}
                <button
                  onClick={() => handleFetchCandidateDetails(item?.candidateUserId)}
                  className="action-btn w-full py-2.5 rounded-xl border-2 border-violet-200 text-violet-600 text-xs font-semibold hover:bg-violet-50 flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" /> View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── CANDIDATE DETAIL DIALOG ── */}
      <Dialog
        open={showCurrentCandidateDetailsModel}
        onOpenChange={() => {
          setCurrentCandidateDetails(null);
          setShowCurrentCandidateDetailsModel(false);
        }}
      >
        <DialogContent className="cl-wrap max-w-2xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-3xl border-0"
          style={{ boxShadow: "0 24px 64px -12px rgba(0,0,0,0.2)" }}>

          <DialogTitle className="sr-only">Candidate Details</DialogTitle>

          <div className="dialog-enter">
            {/* Header */}
            <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-6 ">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xl cl-title">
                    {currentCandidateDetails?.candidateInfo?.name?.charAt(0)?.toUpperCase() || "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <h2 className="cl-title text-xl font-extrabold text-white">
                    {currentCandidateDetails?.candidateInfo?.name}
                  </h2>
                  <p className="text-violet-200 text-sm mt-0.5">{currentCandidateDetails?.email}</p>
                </div>
                {/* Status badge */}
                {isSelected ? (
                  <span className="flex items-center gap-1.5 bg-emerald-400/20 border border-emerald-300/30 text-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </span>
                ) : isRejected ? (
                  <span className="flex items-center gap-1.5 bg-red-400/20 border border-red-300/30 text-red-200 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5" /> Applied
                  </span>
                )}
              </div>
            </div>

            <div className="p-6 space-y-6">

              {/* Info grid */}
              <div className="bg-gray-50/60 rounded-2xl p-4 border border-gray-100">
                <h3 className="cl-title text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Profile Info</h3>
                <InfoRow icon={Mail} label="Email" value={currentCandidateDetails?.email} />
                <InfoRow icon={Briefcase} label="Role" value={currentCandidateDetails?.role} />
                <InfoRow icon={Building2} label="Current Company" value={currentCandidateDetails?.candidateInfo?.currentCompanyName} />
                <InfoRow icon={DollarSign} label="Current Salary" value={currentCandidateDetails?.candidateInfo?.currentSalary} />
                <InfoRow icon={MapPin} label="Current Location" value={currentCandidateDetails?.candidateInfo?.currentJobLocation} />
                <InfoRow icon={MapPin} label="Preferred Location" value={currentCandidateDetails?.candidateInfo?.preferedJobLocation} />
                <InfoRow icon={Building2} label="Previous Companies" value={currentCandidateDetails?.candidateInfo?.previousCompanies} />
                <InfoRow icon={Clock} label="Notice Period" value={currentCandidateDetails?.candidateInfo?.noticePeriod} />
                <InfoRow icon={Briefcase} label="Total Experience" value={currentCandidateDetails?.candidateInfo?.totalExperience} />
                <InfoRow icon={GraduationCap} label="College" value={currentCandidateDetails?.candidateInfo?.college} />
                <InfoRow icon={MapPin} label="College Location" value={currentCandidateDetails?.candidateInfo?.collegeLocation} />
                <InfoRow icon={GraduationCap} label="Graduated Year" value={currentCandidateDetails?.candidateInfo?.graduatedYear} />
                <InfoRow icon={Linkedin} label="LinkedIn" value={currentCandidateDetails?.candidateInfo?.linkedinProfile} href />
                <InfoRow icon={Github} label="GitHub" value={currentCandidateDetails?.candidateInfo?.githubProfile} href />
              </div>

              {/* Skills */}
              {currentCandidateDetails?.candidateInfo?.skills && (
                <div>
                  <h3 className="cl-title text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Code2 className="w-3.5 h-3.5" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentCandidateDetails.candidateInfo.skills.split(",").map((s, i) => (
                      <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-violet-50 text-violet-600 border border-violet-100">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Resume */}
              <button
                onClick={handlePreviewResume}
                className="action-btn w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 text-sm font-semibold hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50"
              >
                <FileText className="w-4 h-4" /> View Resume
              </button>

              {/* ── ACTION SECTION ── */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-4">
                <h3 className="cl-title text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</h3>

                {/* Select / Reject */}
                <div className="flex gap-3">
                  {isSelected ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm font-semibold">
                      <CheckCircle2 className="w-4 h-4" /> Selected
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpdateJobStatus("Selected")}
                      disabled={isRejected}
                      className="action-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Select
                    </button>
                  )}

                  {isRejected ? (
                    <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-500 text-sm font-semibold">
                      <XCircle className="w-4 h-4" /> Rejected
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpdateJobStatus("Rejected")}
                      disabled={isSelected}
                      className="action-btn flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-400"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  )}
                </div>

                {/* Interview scheduler — only shown after selected */}
                {isSelected && !isRejected ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-violet-500" />
                      <p className="text-sm font-semibold text-gray-700">
                        {interviewDate ? "Update Interview Date" : "Schedule Interview"}
                      </p>
                    </div>

                    {interviewDate && (
                      <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-blue-700">
                          Current: {format(new Date(interviewDate), "MMMM d, yyyy h:mm aa")}
                        </span>
                      </div>
                    )}

                    <DatePicker
                      selected={selectedDateTime}
                      onChange={setSelectedDateTime}
                      showTimeSelect
                      timeFormat="HH:mm"
                      timeIntervals={1}
                      dateFormat="MMMM d, yyyy h:mm aa"
                      minDate={new Date()}
                      maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
                      placeholderText="Click to select date and time"
                    />

                    <button
                      onClick={() => handleUpdateJobInterview(selectedDateTime)}
                      disabled={!selectedDateTime}
                      className="action-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-violet-200"
                    >
                      <Calendar className="w-4 h-4" />
                      {interviewDate ? "Update Interview" : "Schedule Interview"}
                    </button>
                  </div>
                ) : !isSelected && !isRejected ? (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                    <Star className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs font-medium text-amber-700">
                      Select the candidate first to schedule an interview
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CandidateList;