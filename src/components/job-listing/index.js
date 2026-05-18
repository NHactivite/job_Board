"use client";
import { filterMenuData, formUrlQuery } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CandidateJobCard } from "../candidate-job-card";
import PostNewJob from "../post-new-job";
import RecruiterJobCard from "../recruiter-job-card";
import { Label } from "../ui/label";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import { Briefcase, LayoutDashboard, SlidersHorizontal, Check, ChevronDown, X } from "lucide-react";

function JobListing({ user, profileInfo, jobList, jobApplication, filterCategories }) {
  const isCandidate = profileInfo?.role === "candidate";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
  };

  const filterMenus = filterMenuData.map((item) => ({
    id: item.id,
    name: item.label,
    options: [...new Set(filterCategories.map((listItem) => listItem[item.id]))],
  }));

  const [filterParams, setFilterParams] = useState({});
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleFilter = (getSectionId, getCurrentOption) => {
    let cpyFilterParams = { ...filterParams };
    const indexOfCurrentSection = Object.keys(cpyFilterParams).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilterParams = { ...cpyFilterParams, [getSectionId]: [getCurrentOption] };
    } else {
      const indexOfCurrentOption = cpyFilterParams[getSectionId].indexOf(getCurrentOption);
      if (indexOfCurrentOption === -1) {
        cpyFilterParams[getSectionId].push(getCurrentOption);
      } else {
        cpyFilterParams[getSectionId].splice(indexOfCurrentOption, 1);
      }
    }
    setFilterParams(cpyFilterParams);
    sessionStorage.setItem("filterParams", JSON.stringify(cpyFilterParams));
  };

  const clearAllFilters = () => {
    setFilterParams({});
    sessionStorage.removeItem("filterParams");
  };

  const activeFilterCount = filterParams
    ? Object.values(filterParams).flat().length
    : 0;

  useEffect(() => {
    setFilterParams(JSON.parse(sessionStorage.getItem("filterParams")) || {});
  }, []);

  useEffect(() => {
    if (filterParams && Object.keys(filterParams).length > 0) {
      const url = formUrlQuery({ params: searchParams.toString(), dataToAdd: filterParams });
      router.push(url, { scroll: false });
    }
  }, [filterParams, searchParams]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-[#F8F7FF]"
    >
      {/* ─── Page Header ─── */}
      <div className="relative overflow-hidden bg-white border-b border-slate-100">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-72 h-72 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-48 h-48 rounded-full bg-indigo-100/40 blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-200">
                {isCandidate
                  ? <Briefcase className="w-5 h-5 text-white" />
                  : <LayoutDashboard className="w-5 h-5 text-white" />
                }
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-slate-900">
                  {isCandidate ? "Explore All Jobs" : "Jobs Dashboard"}
                </h1>
                <p className="text-sm text-slate-400 mt-0.5">
                  {jobList?.length ?? 0} {jobList?.length === 1 ? "listing" : "listings"} available
                </p>
              </div>
            </div>

            {/* Filters or Post Job */}
            {isCandidate ? (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter by
                </div>

                <Menubar className="border-0 bg-transparent p-0 h-auto gap-2">
                  {filterMenus.map((filterMenu, idx) => {
                    const activeCount = filterParams?.[filterMenu.id]?.length ?? 0;
                    return (
                      <MenubarMenu key={idx}>
                        <MenubarTrigger
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer select-none
                            ${activeCount > 0
                              ? "bg-violet-600 text-white border-violet-600 shadow-sm shadow-violet-200"
                              : "bg-white text-slate-600 border-slate-200 hover:border-violet-300 hover:text-violet-600"
                            }`}
                        >
                          {filterMenu.name}
                          {activeCount > 0 && (
                            <span className="ml-1 bg-white/25 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                              {activeCount}
                            </span>
                          )}
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </MenubarTrigger>
                        <MenubarContent className="rounded-xl border border-slate-100 shadow-xl shadow-slate-100 p-1.5 min-w-[180px]">
                          {filterMenu.options.map((option, oidx) => {
                            const isActive =
                              filterParams?.[filterMenu.id]?.indexOf(option) > -1;
                            return (
                              <MenubarItem
                                key={oidx}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                                  ${isActive
                                    ? "bg-violet-50 text-violet-700"
                                    : "text-slate-600 hover:bg-slate-50"
                                  }`}
                                onClick={() => handleFilter(filterMenu.id, option)}
                              >
                                <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all
                                  ${isActive ? "bg-violet-600 border-violet-600" : "border-slate-300"}`}>
                                  {isActive && <Check className="w-2.5 h-2.5 text-white" />}
                                </div>
                                <span className="font-medium">{option}</span>
                              </MenubarItem>
                            );
                          })}
                        </MenubarContent>
                      </MenubarMenu>
                    );
                  })}
                </Menubar>

                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear all
                  </button>
                )}
              </div>
            ) : (
              <PostNewJob profileInfo={profileInfo} user={user} currentCount={jobList.length} />
            )}
          </div>

          {/* Active filter pills */}
          <AnimatePresence>
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="flex flex-wrap gap-2 overflow-hidden"
              >
                {filterParams &&
                  Object.entries(filterParams).map(([sectionId, values]) =>
                    values.map((val) => (
                      <span
                        key={`${sectionId}-${val}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium"
                      >
                        {val}
                        <button
                          onClick={() => handleFilter(sectionId, val)}
                          className="hover:text-violet-900 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ─── Job Grid ─── */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {jobList && jobList.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {jobList.map((jobItem, idx) => (
              <motion.div key={idx} variants={itemVariants}>
                {isCandidate ? (
                  <CandidateJobCard
                    jobItem={jobItem}
                    profileInfo={profileInfo}
                    jobApplication={jobApplication}
                    currentCount={jobList.length}
                  />
                ) : (
                  <RecruiterJobCard
                    jobItem={jobItem}
                    jobApplication={jobApplication}
                    currentCount={jobList.length}
                    profileInfo={profileInfo}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-28 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-5 shadow-inner">
              <Briefcase className="w-9 h-9 text-violet-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-2">No jobs found</h3>
            <p className="text-slate-400 text-sm max-w-xs">
              {activeFilterCount > 0
                ? "Try adjusting or clearing your filters to see more listings."
                : "No listings available right now. Check back soon!"}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}

export default JobListing;