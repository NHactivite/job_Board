"use client"

import { useState } from "react";
import CommonCard from "../common-card";
import JobApplicant from "../job-applicants";
import { Users, MapPin, Zap, ChevronRight, Briefcase } from "lucide-react";

const RecruiterJobCard = ({ jobItem, jobApplication }) => {
  const [showApplicantsDrawer, setShowApplicantsDrawer] = useState(false);
  const [currentCandidateDetails, setCurrentCandidateDetails] = useState(null);
  const [showCurrentCandidateDetailsModel, setShowCurrentCandidateDetailsModel] = useState(false);

  const applicants = jobApplication.filter(item => item.jobId === jobItem._id);
  const count = applicants.length;

  const colors = [
    { bg: "from-violet-500 to-purple-600", light: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", dot: "bg-violet-500" },
    { bg: "from-blue-500 to-cyan-600", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", dot: "bg-blue-500" },
    { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
    { bg: "from-orange-500 to-amber-600", light: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", dot: "bg-orange-500" },
    { bg: "from-rose-500 to-pink-600", light: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", dot: "bg-rose-500" },
  ];
  const color = colors[(jobItem?.title?.length || 0) % colors.length];
  const initials = jobItem?.companyName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "??"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .rec-card { font-family: 'DM Sans', sans-serif; transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .rec-card:hover { transform: translateY(-4px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.12); }
        .rec-title { font-family: 'Syne', sans-serif; }
        .applicant-btn { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .applicant-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .skill-pill { transition: transform 0.15s ease; }
        .skill-pill:hover { transform: scale(1.05); }
      `}</style>

      <div
        className="rec-card bg-white rounded-2xl border border-gray-100 overflow-hidden"
        style={{ boxShadow: "0 4px 24px -6px rgba(0,0,0,0.07)" }}
      >
        {/* Top gradient bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${color.bg}`} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-bold text-xs font-mono">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="rec-title font-bold text-gray-900 text-base leading-tight truncate">
                {jobItem.title}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{jobItem.companyName}</p>
            </div>
            {/* Applicant count badge */}
            <div className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${count > 0 ? `${color.light} ${color.border} border` : "bg-gray-50 border border-gray-100"}`}>
              <Users className={`w-3.5 h-3.5 ${count > 0 ? color.text : "text-gray-400"}`} />
              <span className={`text-xs font-bold ${count > 0 ? color.text : "text-gray-400"}`}>
                {count}
              </span>
            </div>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-2 mb-4">
            {jobItem.location && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> {jobItem.location}
              </span>
            )}
            {jobItem.type && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <Briefcase className="w-3 h-3" /> {jobItem.type}
              </span>
            )}
          </div>

          {/* Skills */}
          {jobItem?.skills && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {jobItem.skills.split(",").slice(0, 3).map((skill, idx) => (
                <span key={idx} className={`skill-pill text-xs font-medium px-2.5 py-1 rounded-lg ${color.light} ${color.text}`}>
                  {skill.trim()}
                </span>
              ))}
              {jobItem.skills.split(",").length > 3 && (
                <span className="text-xs text-gray-400 px-1 py-1">
                  +{jobItem.skills.split(",").length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-gray-50">
            <button
              disabled={count === 0}
              onClick={() => setShowApplicantsDrawer(true)}
              className={`applicant-btn w-full flex items-center justify-between px-4 py-2.5 rounded-xl font-semibold text-sm
                ${count > 0
                  ? `bg-gradient-to-r ${color.bg} text-white shadow-md`
                  : "bg-gray-50 border border-gray-100 text-gray-400 cursor-not-allowed"
                }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {count > 0 ? `${count} Applicant${count > 1 ? "s" : ""}` : "No Applicants Yet"}
              </div>
              {count > 0 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      <JobApplicant
        showApplicantsDrawer={showApplicantsDrawer}
        setShowApplicantsDrawer={setShowApplicantsDrawer}
        currentCandidateDetails={currentCandidateDetails}
        setCurrentCandidateDetails={setCurrentCandidateDetails}
        showCurrentCandidateDetailsModel={showCurrentCandidateDetailsModel}
        setShowCurrentCandidateDetailsModel={setShowCurrentCandidateDetailsModel}
        jobItem={jobItem}
        jobApplication={applicants}
      />
    </>
  );
};

export default RecruiterJobCard;