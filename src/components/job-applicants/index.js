"use client"

import CandidateList from "../candidate-list";
import { DialogTitle } from "../ui/dialog";
import { Drawer, DrawerContent } from "../ui/drawer";
import { ScrollArea } from "../ui/scroll-area";
import { Users, X } from "lucide-react";

const JobApplicant = ({
  showApplicantsDrawer,
  setShowApplicantsDrawer,
  currentCandidateDetails,
  setCurrentCandidateDetails,
  showCurrentCandidateDetailsModel,
  setShowCurrentCandidateDetailsModel,
  jobApplication,
  jobItem,
}) => {
  const count = jobApplication?.length || 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .applicant-drawer { font-family: 'DM Sans', sans-serif; }
        .applicant-title { font-family: 'Syne', sans-serif; }
        .drawer-slide { animation: drawerUp 0.3s cubic-bezier(0.4,0,0.2,1); }
        @keyframes drawerUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <Drawer open={showApplicantsDrawer} onOpenChange={setShowApplicantsDrawer}>
        <DrawerContent
          className="applicant-drawer rounded-t-3xl border-0 outline-none focus:outline-none max-h-[80vh]"
          style={{ boxShadow: "0 -20px 60px -10px rgba(0,0,0,0.15)" }}
        >
          <DialogTitle className="sr-only">Candidate Details</DialogTitle>
          <div className="drawer-slide flex flex-col h-full">

            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
                  <Users className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <h2 className="applicant-title font-bold text-gray-900 text-base leading-tight">
                    {jobItem?.title || "Applicants"}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {count} applicant{count !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApplicantsDrawer(false)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="px-6 py-4">
                {count === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm font-semibold text-gray-400">No applicants yet</p>
                    <p className="text-xs text-gray-300 mt-1">Applications will appear here</p>
                  </div>
                ) : (
                  <CandidateList
                    currentCandidateDetails={currentCandidateDetails}
                    setCurrentCandidateDetails={setCurrentCandidateDetails}
                    jobApplication={jobApplication}
                    showCurrentCandidateDetailsModel={showCurrentCandidateDetailsModel}
                    setShowCurrentCandidateDetailsModel={setShowCurrentCandidateDetailsModel}
                  />
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default JobApplicant;