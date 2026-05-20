"use client"

import CommonCard from "../common-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Activity, CheckCircle2, XCircle, Clock, Star, Briefcase } from "lucide-react";

const statusConfig = {
  Applied:   { icon: Briefcase,    color: "text-blue-600",    bg: "bg-blue-50",    border: "border-blue-200",    dot: "bg-blue-500"    },
  Selected:  { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
  Rejected:  { icon: XCircle,      color: "text-red-500",     bg: "bg-red-50",     border: "border-red-200",     dot: "bg-red-500"     },
  Interview: { icon: Clock,        color: "text-violet-600",  bg: "bg-violet-50",  border: "border-violet-200",  dot: "bg-violet-500"  },
};

const getStatusConfig = (status) =>
  statusConfig[status] || { icon: Star, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200", dot: "bg-gray-400" };

function CandidateActivity({ jobList, jobApplicants }) {
  const uniqueStatusArray = [
    ...new Set(jobApplicants.map(item => item.status).flat(1)),
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .ca-wrap { font-family: 'DM Sans', sans-serif; }
        .ca-title { font-family: 'Syne', sans-serif; }
        .activity-card { transition: all 0.2s cubic-bezier(0.4,0,0.2,1); }
        .activity-card:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -8px rgba(0,0,0,0.1); }
        .tab-fade { animation: tabIn 0.2s ease; }
        @keyframes tabIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div className="ca-wrap mx-auto max-w-7xl min-h-screen p-5">
        <Tabs defaultValue={uniqueStatusArray[0] || "Applied"} className="w-full">

          {/* ── HEADER ── */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-6 pt-4 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-200">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="ca-title text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                  Your Activity
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  {jobApplicants.length} application{jobApplicants.length !== 1 ? "s" : ""} tracked
                </p>
              </div>
            </div>

            {/* Tab triggers */}
            <TabsList className="bg-gray-100/80 rounded-2xl p-1 h-auto flex gap-1 flex-wrap">
              {uniqueStatusArray.map((status, idx) => {
                const cfg = getStatusConfig(status);
                const Icon = cfg.icon;
                const count = jobApplicants.filter(a => a.status.includes(status)).length;
                return (
                  <TabsTrigger
                    key={idx}
                    value={status}
                    className="rounded-xl px-4 py-2 text-sm font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-2 transition-all"
                  >
                    <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                    {status}
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md ${cfg.bg} ${cfg.color}`}>
                      {count}
                    </span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          {/* ── TAB CONTENTS ── */}
          {uniqueStatusArray.map((status, idx) => {
            const cfg = getStatusConfig(status);
            const Icon = cfg.icon;

            const filteredJobs = jobList.filter(jobItem =>
              jobApplicants
                .filter(app => app.status.indexOf(status) > -1)
                .findIndex(app => jobItem._id === app.jobId) > -1
            );

            return (
              <TabsContent key={idx} value={status} className="tab-fade mt-0">
                {filteredJobs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className={`w-16 h-16 rounded-3xl ${cfg.bg} ${cfg.border} border-2 flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${cfg.color}`} />
                    </div>
                    <p className="ca-title text-lg font-bold text-gray-400">No {status} applications</p>
                    <p className="text-sm text-gray-300 mt-1">Applications with this status will appear here</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredJobs.map((job, jIdx) => {
                      const matchedApplicant = jobApplicants.find(
                        app => app.jobId === job._id && app.status.includes(status)
                      );

                      return (
                        <div
                          key={jIdx}
                          className="activity-card bg-white rounded-2xl border border-gray-100 overflow-hidden"
                          style={{ boxShadow: "0 4px 20px -6px rgba(0,0,0,0.07)" }}
                        >
                          {/* Status accent bar */}
                          <div className={`h-1 w-full ${
                            status === "Selected" ? "bg-gradient-to-r from-emerald-400 to-teal-500"
                            : status === "Rejected" ? "bg-gradient-to-r from-red-400 to-rose-500"
                            : status === "Interview" ? "bg-gradient-to-r from-violet-500 to-purple-600"
                            : "bg-gradient-to-r from-blue-400 to-cyan-500"
                          }`} />

                          <div className="p-4">
                            {/* Status badge */}
                            <div className="flex items-center justify-between mb-3">
                              <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color} ${cfg.border} border`}>
                                <Icon className="w-3 h-3" />
                                {status}
                              </span>
                              {matchedApplicant?.jobAppliedDate && (
                                <span className="text-xs text-gray-400">
                                  {matchedApplicant.jobAppliedDate}
                                </span>
                              )}
                            </div>

                            <CommonCard
                              title={job.title}
                              interviewDate={matchedApplicant?.interviewDate}
                              status={matchedApplicant ? matchedApplicant.status[1] : "Unknown"}
                              id={matchedApplicant?.candidateUserId}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </>
  );
}

export default CandidateActivity;