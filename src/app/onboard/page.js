"use client";
import { createProfileAction } from "@/actions";
import {
  candidateOnboardFRomControl,
  initialCandidateFromData,
  initialRecruiterFromData,
  recruiterOnboardFRomControl,
} from "@/utils";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import CommonFrom from "@/components/common-form";
import { Briefcase, User, Sparkles } from "lucide-react";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function OnBoard() {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [currentTab, setCurrentTab] = useState("candidate");
  const [fileStatus, setFileStatus] = useState(false);
  const [recruiterFromData, setRecruiterFromData] = useState(initialRecruiterFromData);
  const [candidateFromData, setCandidateFromData] = useState(initialCandidateFromData);

  const handleTabChange = (value) => setCurrentTab(value);

  const handleUploadPdfToSuperbase = async () => {
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    const { data, error } = await supabaseClient.storage
      .from("job-board-public")
      .upload(`${sanitizedFileName}_${user.id}`, file, { cacheControl: "3600", upsert: false });
    if (error) {
      if (error.statusCode === "409") {
        setCandidateFromData({ ...candidateFromData, resume: `${sanitizedFileName}_${user.id}` });
        setFileStatus(true);
      }
    } else if (data) {
      const res = supabaseClient.storage.from("job-board-public").getPublicUrl(data.path);
      setFileStatus(true);
      setCandidateFromData({ ...candidateFromData, resume: { path: data.path, publicPath: res.data.publicUrl } });
    }
  };

  const handleFileChange = (event) => { event.preventDefault(); setFile(event.target.files[0]); };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (file && !fileStatus) { handleUploadPdfToSuperbase(); return; }
    const sanitizedFileName = file.name.replace(/\s+/g, "_");
    if (fileStatus) {
      const { data } = await supabaseClient.storage.from("job-board-public").remove([`${sanitizedFileName}_${user.id}`]);
      if (data[0]?.name == `${sanitizedFileName}_${user.id}`) {
        setFileStatus(false);
        setCandidateFromData({ ...candidateFromData, resume: { path: "", publicPath: "" } });
      }
    }
  };

  const handleRecuiterFromValid = () =>
    Object.keys(recruiterFromData).every((key) => {
      const v = recruiterFromData[key];
      return typeof v === "string" ? v.trim() !== "" : true;
    });

  const handleCandidateFromValid = () =>
    Object.keys(candidateFromData).every((key) => {
      const v = candidateFromData[key];
      return typeof v === "string" ? v.trim() !== "" : true;
    });

  const createProfile = async () => {
    const data = currentTab === "candidate"
      ? { candidateInfo: candidateFromData, role: "candidate", isPremiumUser: false, userId: user.id, email: user.primaryEmailAddress.emailAddress }
      : { recruiterInfo: recruiterFromData, role: "recruiter", userId: user.id, email: user.primaryEmailAddress.emailAddress, isPremiumUser: false };
    await createProfileAction(data, "/onboard");
  };

  const tabs = [
    { value: "candidate", label: "Candidate", icon: User,     desc: "Looking for opportunities" },
    { value: "recruiter", label: "Recruiter",  icon: Briefcase, desc: "Hiring top talent"          },
  ];

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
      <div className="fixed top-0 right-0 w-[450px] h-[450px] rounded-full bg-violet-200/25 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[350px] h-[350px] rounded-full bg-blue-200/20 blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-5">

        {/* ── HEADER ── */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-4 py-1 text-violet-600 text-sm mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Get Started
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Welcome to <span className="bg-gradient-to-r from-violet-600 to-blue-500 text-transparent bg-clip-text">Onboarding</span>
          </h1>
          <p className="text-gray-600 text-base">Tell us who you are so we can personalise your experience</p>
        </div>

        {/* ── TAB TOGGLE ── */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {tabs.map(({ value, label, icon: Icon, desc }) => (
            <button
              key={value}
              onClick={() => handleTabChange(value)}
              className={`relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                currentTab === value
                  ? "bg-white border-violet-400 shadow-lg shadow-violet-100"
                  : "bg-white/60 border-gray-100 hover:border-gray-200 hover:bg-white"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentTab === value ? "bg-violet-100 border border-violet-200" : "bg-gray-100 border border-gray-200"
              }`}>
                <Icon className={`w-5 h-5 ${currentTab === value ? "text-violet-600" : "text-gray-400"}`} />
              </div>
              <div className="text-center">
                <p className={`font-display font-bold text-sm ${currentTab === value ? "text-gray-900" : "text-gray-500"}`}>{label}</p>
                <p className={`text-xs mt-0.5 ${currentTab === value ? "text-gray-400" : "text-gray-300"}`}>{desc}</p>
              </div>
              {currentTab === value && (
                <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>
          ))}
        </div>

        {/* ── FORM CARD ── */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-blue-500" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-7">
              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                {currentTab === "candidate"
                  ? <User className="w-4 h-4 text-violet-600" />
                  : <Briefcase className="w-4 h-4 text-violet-600" />
                }
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">
                  {currentTab === "candidate" ? "Candidate Profile" : "Recruiter Profile"}
                </h2>
                <p className="text-gray-400 text-sm">Fill in your details below</p>
              </div>
            </div>

            {currentTab === "candidate" ? (
              <CommonFrom
                action={createProfile}
                formControls={candidateOnboardFRomControl}
                buttonText="Onboard as Candidate"
                formData={candidateFromData}
                setFormData={setCandidateFromData}
                handleFileChange={handleFileChange}
                isBtnDisabled={!handleCandidateFromValid()}
                uploadFile={uploadFile}
                fileStatus={fileStatus}
              />
            ) : (
              <CommonFrom
                formControls={recruiterOnboardFRomControl}
                buttonText="Onboard as Recruiter"
                formData={recruiterFromData}
                setFormData={setRecruiterFromData}
                isBtnDisabled={!handleRecuiterFromValid()}
                action={createProfile}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default OnBoard;