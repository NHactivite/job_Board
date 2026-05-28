"use client";

import { updateProfileAction } from "@/actions";
import {
  candidateOnboardFRomControl,
  initialCandidateFromData,
  initialRecruiterFromData,
  recruiterOnboardFRomControl,
} from "@/utils";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import CommonFrom from "../common-form";
import { User, Briefcase, Upload, Shield, Mail, Sparkles } from "lucide-react";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

function AccountInfo({ profileInfo }) {
  const [candidateFormData, setCandidateFromData] = useState(initialCandidateFromData);
  const [recruiterFormData, setRecruiterFromData] = useState(initialRecruiterFromData);
  const [view, setView] = useState(false);
  const [hasViewChanged, setHasViewChanged] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (profileInfo?.role === "recruiter") setRecruiterFromData(profileInfo.recruiterInfo);
    if (profileInfo?.role === "candidate") {
      setCandidateFromData({ ...profileInfo.candidateInfo });
    }
  }, [profileInfo]);

  useEffect(() => {
    if (hasViewChanged) {
      handleUpdateResume();
      setHasViewChanged(false);
      setView(false);
    } else {
      setHasViewChanged(true);
    }
  }, [view]);

  const handleFileChange = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
  };

  const handleUploadPdfToSuperbase = async () => {
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const { data } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`${sanitizedFileName}_${profileInfo.userId}`, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (data) {
      const res = supabaseClient.storage.from("job-board-public").getPublicUrl(data.path);
      setCandidateFromData((prev) => ({
        ...prev,
        resume: { path: data.path, publicPath: res.data.publicUrl },
      }));
      setView(true);
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const sanitizedFileName = profileInfo.candidateInfo.resume?.path.split("/").pop();
    const { data } = await supabaseClient.storage
      .from("job-board-public")
      .remove(sanitizedFileName);
    if (data[0]?.name == sanitizedFileName) {
      handleUploadPdfToSuperbase();
    }
  };

  const handleUpdateResume = async () => {
    await updateProfileAction(
      {
        _id: profileInfo?._id,
        candidateInfo: { ...profileInfo?.candidateInfo, resume: candidateFormData.resume },
        isPremiumUser: profileInfo?.isPremiumUser,
        role: profileInfo?.role,
        userId: profileInfo.userId,
        email: profileInfo?.email,
      },
      "/account"
    );
  };

  const handleUpdateAccount = async () => {
    await updateProfileAction(
      profileInfo?.role === "candidate"
        ? {
            _id: profileInfo?._id,
            isPremiumUser: profileInfo?.isPremiumUser,
            role: profileInfo?.role,
            userId: profileInfo.userId,
            email: profileInfo?.email,
          }
        : {
            _id: profileInfo?._id,
            recruiterInfo: recruiterFormData,
            isPremiumUser: profileInfo?.isPremiumUser,
            role: profileInfo?.role,
            userId: profileInfo.userId,
            email: profileInfo?.email,
          },
      "/account"
    );
  };

  const isCandidate = profileInfo?.role === "candidate";
  const roleLabel = isCandidate ? "Candidate" : "Recruiter";
  const RoleIcon = isCandidate ? User : Briefcase;

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        * { font-family: 'DM Sans', sans-serif; }
        .grid-bg {
          background-image: linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px);
          background-size: 40px 40px;
        }
      `}</style>

      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-[400px] h-[400px] rounded-full bg-violet-200/30 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-blue-200/30 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-5">

        {/* ── HEADER ── */}
        <div className="mb-10">
          {/* Top meta row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center">
              <RoleIcon className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-sm font-medium text-violet-600 bg-violet-50 border border-violet-100 px-3 py-1 rounded-full">
              {roleLabel} Account
            </span>
            {profileInfo?.isPremiumUser && (
              <span className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Premium
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Account <span className="bg-gradient-to-r from-violet-600 to-blue-500 text-transparent bg-clip-text">Details</span>
          </h1>
          <p className="text-gray-400 text-base">Manage your profile information and preferences</p>
        </div>

        {/* ── INFO TILES ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            {
              icon: Mail,
              label: "Email",
              value: profileInfo?.email || "—",
              color: "text-blue-600",
              bg: "bg-blue-50",
              border: "border-blue-100",
            },
            {
              icon: RoleIcon,
              label: "Role",
              value: roleLabel,
              color: "text-violet-600",
              bg: "bg-violet-50",
              border: "border-violet-100",
            },
            {
              icon: Shield,
              label: "Membership",
              value: profileInfo?.isPremiumUser
                ? (profileInfo?.memberShipType?.toUpperCase() || "Premium")
                : "Free",
              color: profileInfo?.isPremiumUser ? "text-amber-600" : "text-gray-500",
              bg: profileInfo?.isPremiumUser ? "bg-amber-50" : "bg-gray-100",
              border: profileInfo?.isPremiumUser ? "border-amber-100" : "border-gray-200",
            },
          ].map((tile, i) => (
            <div
              key={i}
              className={`${tile.bg} border ${tile.border} rounded-2xl p-5 flex items-center gap-4`}
            >
              <div className={`w-10 h-10 rounded-xl ${tile.bg} border ${tile.border} flex items-center justify-center flex-shrink-0`}>
                <tile.icon className={`w-5 h-5 ${tile.color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{tile.label}</p>
                <p className={`font-display font-bold text-base ${tile.color} truncate max-w-[160px]`}>{tile.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── FORM CARD ── */}
        <div className="relative bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-blue-500" />

          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                <Upload className="w-4 h-4 text-violet-600" />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">Profile Information</h2>
                <p className="text-gray-400 text-sm">Update your details below</p>
              </div>
            </div>

            <CommonFrom
              handleFileChange={handleFileChange}
              uploadFile={uploadFile}
              action={handleUpdateAccount}
              formControls={
                isCandidate ? candidateOnboardFRomControl : recruiterOnboardFRomControl
              }
              formData={isCandidate ? candidateFormData : recruiterFormData}
              buttonText="Save Changes"
              setFormData={isCandidate ? setCandidateFromData : setRecruiterFromData}
              file={file}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default AccountInfo;