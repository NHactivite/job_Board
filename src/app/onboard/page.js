"use client";
import { createProfileAction, fetchProfileAction } from "@/actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  candidateOnboardFRomControl,
  initialCandidateFromData,
  initialRecruiterFromData,
  recruiterOnboardFRomControl,
} from "@/utils";
import { useUser } from "@clerk/nextjs";
import { createClient } from "@supabase/supabase-js";
import { useState,useEffect } from "react";
import CommonFrom from "@/components/common-form";
import { useRouter } from "next/navigation";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

function OnBoard() {
  const { user } = useUser();

  const router = useRouter(); 
useEffect(() => {
  if (!user) return; // wait until user is loaded

  async function checkProfile() {
    const profileInfo = await fetchProfileAction(user?.id);
    console.log("profileInfo:", profileInfo);
    if (user && profileInfo) {
      router.push("/"); // already onboarded → redirect
    }
  }

  checkProfile();
}, [user]); 

  const [file, setFile] = useState(null);
  const [currentTab, setCurrentTab] = useState("candidate");
  const [fileStatus, setFileStatus] = useState(false);
  const [recruiterFromData, setRecruiterFromData] = useState(initialRecruiterFromData);
  const [candidateFromData, setCandidateFromData] = useState(initialCandidateFromData);

  const handleTabChange = (value) => setCurrentTab(value);

  // ── helper so both functions use identical path logic ──
// Fixed name per user — always overwrites, no duplicates
const buildFilePath = () => {
  return `resume_${user.id}.pdf`;  // same path every time for this user ✅
};

const handleUploadPdfToSuperbase = async () => {
  const filePath = buildFilePath();
  console.log("⭐ Uploading to:", filePath);

  const { data, error } = await supabaseClient.storage
    .from("job-board-public")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,  // ✅ overwrites if already exists — no 409, no duplicates
    });

  if (error) {
    console.error("Upload error:", error.message);
    return;
  }

  if (data) {
    const res = supabaseClient.storage
      .from("job-board-public")
      .getPublicUrl(data.path);
    setFileStatus(true);
    setCandidateFromData({
      ...candidateFromData,
      resume: { path: data.path, publicPath: res.data.publicUrl },
    });
  }
};

const uploadFile = async (e) => {
  e.preventDefault();

  if (file && !fileStatus) {
    handleUploadPdfToSuperbase();
    return;
  }

  if (fileStatus) {
    const filePath = buildFilePath();
    const { error } = await supabaseClient.storage
      .from("job-board-public")
      .remove([filePath]);

    if (error) {
      console.error("Remove error:", error.message);
      return;
    }

    setFileStatus(false);
    setFile(null);
    setCandidateFromData({
      ...candidateFromData,
      resume: { path: "", publicPath: "" },
    });
  }
};

// const handleUploadPdfToSuperbase = async () => {
//   const filePath = buildFilePath();
//   console.log("⭐ Uploading to:", filePath);

//   const { data, error } = await supabaseClient.storage
//     .from("job-board-public")
//     .upload(filePath, file, {
//       cacheControl: "3600",
//       upsert: true,  // ✅ overwrites if already exists — no 409, no duplicates
//     });

//   if (error) {
//     console.error("Upload error:", error.message);
//     return;
//   }

//   if (data) {
//     const res = supabaseClient.storage
//       .from("job-board-public")
//       .getPublicUrl(data.path);
//     setFileStatus(true);
//     setCandidateFromData({
//       ...candidateFromData,
//       resume: { path: data.path, publicPath: res.data.publicUrl },
//     });
//   }
// };

  // const handleUploadPdfToSuperbase = async () => {
  //   const filePath = buildFilePath(file.name);
  //   console.log("⭐ Uploading to:", filePath);

  //   const { data, error } = await supabaseClient.storage
  //     .from("job-board-public")
  //     .upload(filePath, file, { cacheControl: "3600", upsert: false });

  //   if (error) {
  //     console.error("Upload error:", error.message);
  //     if (error.statusCode === "409") {
  //       setCandidateFromData({ ...candidateFromData, resume: filePath });
  //       setFileStatus(true);
  //     }
  //   } else if (data) {
  //     const res = supabaseClient.storage.from("job-board-public").getPublicUrl(data.path);
  //     setFileStatus(true);
  //     setCandidateFromData({
  //       ...candidateFromData,
  //       resume: { path: data.path, publicPath: res.data.publicUrl },
  //     });
  //   }
  // };

  const handleFileChange = (event) => {
    event.preventDefault();
    setFile(event.target.files[0]);
  };

//   const uploadFile = async (e) => {
//   e.preventDefault();

//   if (file && !fileStatus) {
//     handleUploadPdfToSuperbase();
//     return;
//   }

//   if (file && fileStatus) {
//     const filePath = buildFilePath(file.name);
//     console.log("🗑️ Removing:", filePath);

//     const { data, error } = await supabaseClient.storage
//       .from("job-board-public")
//       .remove([filePath]);

//     console.log("Remove response:", data, error);

//     if (error) {
//       console.error("Remove error:", error.message);
//       return;
//     }

//     // ✅ No name check needed — if no error, it worked
//     setFileStatus(false);
//     setFile(null);
//     setCandidateFromData({
//       ...candidateFromData,
//       resume: { path: "", publicPath: "" },
//     });
//   }
// };

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
    const data =currentTab === "candidate"
        ? { candidateInfo: candidateFromData, role: "candidate", isPremiumUser: false, userId: user.id, email: user.primaryEmailAddress.emailAddress }
        : { recruiterInfo: recruiterFromData, role: "recruiter", userId: user.id, email: user.primaryEmailAddress.emailAddress, isPremiumUser: false };
    await createProfileAction(data, "/");
  };

  return (
    <div className="bg-white p-5 min-h-screen">
      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="w-full">
          <div className="pb-2 lg:flex items-baseline justify-between border-b">
            <h1 className="text-3xl my-2 lg:text-4xl font-bold tracking-tight text-gray-900">
              Welcome to onboarding
            </h1>
            <TabsList>
              <TabsTrigger value="candidate">Candidate</TabsTrigger>
              <TabsTrigger value="recruiter">Recruiter</TabsTrigger>
            </TabsList>
          </div>
        </div>
        <TabsContent value="candidate">
          <CommonFrom
            action={createProfile}
            formControls={candidateOnboardFRomControl}
            buttonText={"Onboard as candidate"}
            formData={candidateFromData}
            setFormData={setCandidateFromData}
            handleFileChange={handleFileChange}
            isBtnDisabled={!handleCandidateFromValid()}
            uploadFile={uploadFile}
            fileStatus={fileStatus}
          />
        </TabsContent>
        <TabsContent value="recruiter">
          <CommonFrom
            formControls={recruiterOnboardFRomControl}
            buttonText={"Onboard as recruiter"}
            formData={recruiterFromData}
            setFormData={setRecruiterFromData}
            isBtnDisabled={!handleRecuiterFromValid()}
            action={createProfile}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default OnBoard;