"use client"

import { createJobApplicationAction } from "@/actions"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { Button } from "../ui/button"
import { Fragment, useState, useEffect } from "react"
import { MapPin, Briefcase, Star, Zap, ChevronRight, X, CheckCircle2, Lock } from "lucide-react"

export const CandidateJobCard = ({ jobItem, profileInfo, jobApplication }) => {
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [applied, setApplied] = useState(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const matchingCount = jobApplication?.reduce((acc, item) => {
      return item.candidateUserId === profileInfo?.userId ? acc + 1 : acc
    }, 0)
    setCount(matchingCount)
  }, [jobApplication, profileInfo])

  useEffect(() => {
    jobApplication?.map((item) => (
      (item.candidateUserId === profileInfo?.userId && item.jobId === jobItem._id)
        ? setApplied(true)
        : null
    ))
  }, [showDetailsDrawer])

  async function handleJobApply() {
    await createJobApplicationAction(
      {
        recruiterUserId: jobItem?.recruiterId,
        name: profileInfo?.candidateInfo?.name,
        email: profileInfo?.email,
        candidateUserId: profileInfo?.userId,
        status: ["Applied"],
        jobId: jobItem._id,
        jobAppliedDate: new Date().toLocaleDateString()
      }, "/jobs")
    setShowDetailsDrawer(false)
  }

  const BtnDisabled =
    profileInfo.memberShipType === "teams" && count === 10 ? true
      : profileInfo.memberShipType === "basic" && count === 5 ? true
        : !profileInfo.memberShipType && count === 2 ? true
          : false

  // Deterministic color per job title
  const colors = [
    { bg: "from-violet-500 to-purple-600", light: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
    { bg: "from-blue-500 to-cyan-600", light: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    { bg: "from-emerald-500 to-teal-600", light: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
    { bg: "from-orange-500 to-amber-600", light: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    { bg: "from-rose-500 to-pink-600", light: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  ]
  const color = colors[(jobItem?.title?.length || 0) % colors.length]

  const initials = jobItem?.companyName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

  return (
    <Fragment>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,400&display=swap');
        .job-card { font-family: 'DM Sans', sans-serif; }
        .job-card-title { font-family: 'Syne', sans-serif; }
        .job-card-hover { transition: all 0.25s cubic-bezier(0.4,0,0.2,1); }
        .job-card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12); }
        .skill-chip { transition: all 0.15s ease; }
        .skill-chip:hover { transform: scale(1.05); }
        .apply-btn { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .apply-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 20px -4px rgba(139,92,246,0.4); }
        .drawer-enter { animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1); }
        @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* ── CARD ── */}
      <div
        className="job-card job-card-hover bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer group"
        onClick={() => setShowDetailsDrawer(true)}
        style={{ boxShadow: "0 4px 20px -4px rgba(0,0,0,0.06)" }}
      >
        {/* Top accent bar */}
        <div className={`h-1 w-full bg-gradient-to-r ${color.bg}`} />

        <div className="p-5">
          {/* Company logo + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color.bg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <span className="text-white font-bold text-sm font-mono">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="job-card-title font-bold text-gray-900 text-base leading-tight truncate group-hover:text-violet-600 transition-colors">
                {jobItem.title}
              </h3>
              <p className="text-sm text-gray-500 mt-0.5 truncate">{jobItem.companyName}</p>
            </div>
            {applied && (
              <span className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3 h-3" /> Applied
              </span>
            )}
          </div>

          {/* Meta chips */}
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
            {jobItem.experience && (
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                <Star className="w-3 h-3" /> {jobItem.experience}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div className="flex gap-1.5 flex-wrap">
              {jobItem?.skills?.split(",").slice(0, 2).map((skill, idx) => (
                <span key={idx} className={`text-xs font-medium px-2 py-0.5 rounded-md ${color.light} ${color.text}`}>
                  {skill.trim()}
                </span>
              ))}
              {jobItem?.skills?.split(",").length > 2 && (
                <span className="text-xs text-gray-400">+{jobItem.skills.split(",").length - 2}</span>
              )}
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold ${color.text} group-hover:gap-2 transition-all`}>
              View <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* ── DRAWER ── */}
      <Drawer open={showDetailsDrawer} onOpenChange={setShowDetailsDrawer}>
        <DrawerContent className="job-card max-h-[90vh] rounded-t-3xl border-0 outline-none focus:outline-none" style={{ boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.15)" }}>
          <div className="drawer-enter overflow-y-auto">

            {/* Drawer handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="px-6 pb-8">
              <DrawerHeader className="px-0 pb-0">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color.bg} flex items-center justify-center flex-shrink-0 shadow-md`}>
                      <span className="text-white font-bold text-lg font-mono">{initials}</span>
                    </div>
                    <div>
                      <DrawerTitle className="job-card-title text-2xl font-extrabold text-gray-900 leading-tight">
                        {jobItem.title}
                      </DrawerTitle>
                      <p className="text-gray-500 mt-1 font-medium">{jobItem.companyName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailsDrawer(false)}
                    className="flex-shrink-0 w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors mt-1"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Apply / upgrade banner */}
                {BtnDisabled && !applied && (
                  <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 mb-5">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Application limit reached</p>
                      <p className="text-xs text-amber-600 mt-0.5">Upgrade your plan to apply to more jobs</p>
                    </div>
                  </div>
                )}

                {applied && (
                  <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 mb-5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <p className="text-sm font-semibold text-emerald-700">You've already applied to this position</p>
                  </div>
                )}
              </DrawerHeader>

              <DrawerDescription asChild>
                <div>
                  {/* Meta grid */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                      { icon: MapPin, label: "Location", value: jobItem.location },
                      { icon: Briefcase, label: "Type", value: jobItem.type },
                      { icon: Star, label: "Experience", value: jobItem.experience },
                    ].map(({ icon: Icon, label, value }) => value ? (
                      <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-center">
                        <div className={`w-8 h-8 rounded-xl ${color.light} ${color.border} border flex items-center justify-center mx-auto mb-2`}>
                          <Icon className={`w-4 h-4 ${color.text}`} />
                        </div>
                        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                        <p className="text-xs font-semibold text-gray-800 uppercase tracking-wide">{value}</p>
                      </div>
                    ) : null)}
                  </div>

                  {/* Skills */}
                  {jobItem?.skills && (
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className={`w-4 h-4 ${color.text}`} />
                        <h4 className="job-card-title text-sm font-bold text-gray-900 uppercase tracking-wider">Skills Required</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {jobItem.skills.split(",").map((skill, idx) => (
                          <span
                            key={idx}
                            className={`skill-chip text-sm font-medium px-3 py-1.5 rounded-xl ${color.light} ${color.text} ${color.border} border`}
                          >
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {jobItem?.description && (
                    <div className="mb-8">
                      <h4 className="job-card-title text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">About the Role</h4>
                      <p className="text-gray-600 leading-relaxed text-sm">{jobItem.description}</p>
                    </div>
                  )}

                  {/* Apply button */}
                  <button
                    disabled={applied || BtnDisabled}
                    onClick={applied ? null : handleJobApply}
                    className={`apply-btn w-full h-13 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                      ${applied
                        ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-600"
                        : `bg-gradient-to-r ${color.bg} text-white shadow-lg`
                      }`}
                  >
                    {applied ? (
                      <><CheckCircle2 className="w-4 h-4" /> Already Applied</>
                    ) : (
                      <><Zap className="w-4 h-4" /> Apply Now</>
                    )}
                  </button>
                </div>
              </DrawerDescription>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </Fragment>
  )
}