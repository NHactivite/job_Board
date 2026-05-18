"use server";

import Application from "@/models/application";
import Job from "@/models/job";
const { default: ConnectDB } = require("@/database");
const { default: Profile } = require("@/models/profile");
import { revalidatePath } from "next/cache";

import { Cashfree } from "cashfree-pg";

import Plan from "@/models/plans";

import { GoogleGenAI } from "@google/genai";

// ==================open ai------------------------

// import OpenAI from "openai";
// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// async function generateAIResponse(prompt) {
//   try {
//     const response = await client.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: prompt },
//       ],
//       temperature: 0.2,
//     });

//     return response.choices[0].message.content?.trim();
//   } catch (error) {
//     console.error("AI Generation Error:", error);
//     return null;
//   }
// }

// ===============================open ai end--------------------

// Gemini API Key---------------------------------------------------

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

console.log("Gemini key exists:", !!GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});
async function generateAIResponse(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Recommended model for fast text tasks
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("AI Generation Error:", error);
    return null; // Your other functions already gracefully handle null returns
  }
}
// -------------------gimini end-------------------------------

// Initialize Cashfree with your credentials-------------------------------------
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Cashfree credentials are missing in environment variables");
}
Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
// crete profile action

// cashgram end
export const createProfileAction = async (formData, pathToRevalidate) => {
  await ConnectDB();

  await Profile.create(formData);
  revalidatePath(pathToRevalidate);
};

export const fetchProfileAction = async (id) => {
  await ConnectDB();
  const result = Profile.findOne({ userId: id }).lean();
  return result;
};
export const fetchAllProfileAction = async () => {
  await ConnectDB();
  const result = Profile.find({}).lean();
  return result;
};

export async function getMembershipUsers() {
  await ConnectDB();
  const usersWithMembership = await Profile.find(
    { memberShipType: { $exists: true, $ne: null } },
    { memberShipType: 1, _id: 0 },
  ).lean();

  return usersWithMembership;
}

export const fetchPlanAction = async () => {
  await ConnectDB();
  const result = await Plan.find({}).lean();
  return result;
};
export const fetchPlanUpadateAction = async (data, pathToRevalidate) => {
  await ConnectDB();
  const result = await Plan.findByIdAndUpdate(
    data.id,
    {
      $set: {
        heading: data.heading,
        price: data.price,
        type: data.type,
        month: data.month,
        job: data.job,
      },
    },
    { new: true },
  ).lean();
  revalidatePath(pathToRevalidate);
};

export const createPlanAction = async (data, pathToRevalidate) => {
  await ConnectDB();
  await Plan.create(data);
  revalidatePath(pathToRevalidate);
};

// create job action

export async function postNewJobAction({ formData, pathToRevalidate }) {
  await ConnectDB();
  await Job.create(formData);
  revalidatePath(pathToRevalidate);
}

// fetch job action

// recruiter

export async function fetchJobsForRecruiterAction(id) {
  await ConnectDB();
  const result = await Job.find({ recruiterId: id });
  return JSON.parse(JSON.stringify(result));
}

// candidate

export async function fetchJobsForCandidateAction(filterParams = {}) {
  await ConnectDB();

  let updatedParams = {};
  Object.keys(filterParams).forEach((filterKey) => {
    updatedParams[filterKey] = { $in: filterParams[filterKey].split(",") };
  });

  const result = await Job.find(
    filterParams && Object.keys(filterParams).length > 0 ? updatedParams : {},
  );
  return JSON.parse(JSON.stringify(result));
}

// create job application

export async function createJobApplicationAction(data, pathToRevalidate) {
  await ConnectDB();
  await Application.create(data);
  revalidatePath(pathToRevalidate);
}
export async function fetchJobApplicationAction() {
  await ConnectDB();
  const result = await Application.find({});
  return JSON.parse(JSON.stringify(result));
}

// fetch job application for candidate

export async function fetchJobApplicationForCandidate(candidateId) {
  await ConnectDB();
  const result = await Application.find({ candidateUserId: candidateId });

  return JSON.parse(JSON.stringify(result));
}
// fetch job application for candidate

export async function fetchJobApplicationForRecruiter(recruiterId) {
  await ConnectDB();
  const result = await Application.find({ recruiterUserId: recruiterId });
  return JSON.parse(JSON.stringify(result));
}

//get candidate details by CandidateId

export const getCandidateDetailsByIdAction = async (candidateId) => {
  await ConnectDB();
  const result = await Profile.findOne({ userId: candidateId });
  return JSON.parse(JSON.stringify(result));
};

// update job-Application

export async function updateJobApplication(data, pathToRevalidate) {
  await ConnectDB();
  const {
    recruiterUserId,
    name,
    jobAppliedDate,
    email,
    _id,
    candidateUserId,
    status,
    jobId,
    interviewDate,
  } = data;

  await Application.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      recruiterUserId,
      name,
      jobAppliedDate,
      email,
      candidateUserId,
      status,
      jobId,
      interviewDate,
    },
    {
      new: true,
    },
  );
  revalidatePath(pathToRevalidate);
}

// filer actions

export async function createFilterCategoryAction() {
  await ConnectDB();
  const result = await Job.find({});

  return JSON.parse(JSON.stringify(result));
}

// update profile data

export async function updateProfileAction(data, pathToRevalidate) {
  await ConnectDB();
  const {
    _id,
    candidateInfo,
    recruiterInfo,
    isPremiumUser,
    role,
    userId,
    email,
  } = data;

  await Profile.findOneAndUpdate(
    {
      _id: _id,
    },
    {
      recruiterInfo,
      candidateInfo,
      isPremiumUser,
      role,
      userId,
      email,
    },
    { new: true },
  );
  revalidatePath(pathToRevalidate);
}

export async function createPaymentAction(data) {
  const { amount, customer_id, customer_email } = data;

  const request = {
    order_amount: amount,
    order_currency: "INR",
    customer_details: {
      customer_id: customer_id,
      customer_phone: "9999999999", // Use a dummy email for sandbox
      customer_email: customer_email,
    },
    order_id: `order_${Date.now()}`,
  };

  try {
    const response = await Cashfree.PGCreateOrder("2023-08-01", request);
    return response.data; // Return the data to the caller
  } catch (error) {
    console.error(
      "Error setting up order request:",
      error?.response?.data || error,
    );
    throw error; // Propagate error for better handling in the caller
  }
}

export const paymentVerify = async (order_id) => {
  try {
    const response = await Cashfree.PGOrderFetchPayments(
      "2023-08-01",
      order_id,
    );
    return response.data; // Ensure data is returned
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error; // Re-throw the error to handle it upstream
  }
};

export async function createOrderAction(data, pathToRevalidate) {
  try {
    await ConnectDB();
    const {
      _id,
      candidateInfo,
      recruiterInfo,
      isPremiumUser,
      role,
      userId,
      email,
      memberShipType,
      memberShipStartDate,
      memberShipEndDate,
    } = data;

    await Profile.findOneAndUpdate(
      {
        _id: _id,
      },
      {
        recruiterInfo,
        candidateInfo,
        isPremiumUser,
        role,
        userId,
        email,
        memberShipType,
        memberShipStartDate,
        memberShipEndDate,
      },
      { new: true },
    );
    revalidatePath(pathToRevalidate);
  } catch (error) {
    throw error;
  }
}
// ===---------------------open ai--------------------------------

async function normalizeJobTitle(title) {
  const prompt = `
Convert this into a professional job title.

Rules:
- Return ONLY the job title
- No explanation
- If invalid return "none"

Input: "${title}"
`;

  const result = await generateAIResponse(prompt);
  console.log(result, "innormalization");

  if (!result) return null;

  const cleaned = result.toLowerCase().trim();

  if (cleaned === "none") return null;

  return cleaned;
}

async function findClosestJobTitle(normalizedTitle, storedTitles) {
  const prompt = `
Given the normalized job title: "${normalizedTitle}"
And the following list of stored job titles: ${storedTitles.map((t) => `"${t}"`).join(", ")}

Which one from the list best matches the normalized title?
Reply with ONLY the matching title from the list, nothing else.
If none match, reply with exactly: none
`;

  const result = await generateAIResponse(prompt);
  console.log(result, "closest match");

  if (!result || result.toLowerCase().trim() === "none") return null;

  return result.trim();
}

async function isGreeting(text) {
  const cleaned = text.toLowerCase().trim();

  const greetings = [
    "hi", "hii", "hello", "hey", "hlo",
    "yo", "yoo", "hola", "namaste", "hy",
  ];

  if (greetings.includes(cleaned)) {
    return true;
  }

  const prompt = `
Determine if this message is a greeting.

Reply ONLY with:
yes
or
no

Message: "${text}"
`;

  const result = await generateAIResponse(prompt);
  console.log(result, "ai greeting");

  const decision = result?.toLowerCase().trim().replace(".", "");

  return decision === "yes";
}

export const searchJob = async (title) => {
  await ConnectDB();

  try {
    if (!title) {
      return { error: "Job title is required" };
    }

    const isGreet = await isGreeting(title);
    console.log(isGreet, "decision");

    if (isGreet) {
      return {
        message: "Hello! How can I assist you with your job search today?",
      };
    }

    const normalizedTitle = await normalizeJobTitle(title);

    if (!normalizedTitle) {
      return { message: "Could not understand the job title. Please try again." };
    }

    const jobs = await Job.find({}, "title skills").lean();
    const storedTitles = jobs.map((job) => job.title.toLowerCase());

    const closestMatch =
      storedTitles.length > 0
        ? await findClosestJobTitle(normalizedTitle, storedTitles)
        : null;

    if (closestMatch) {
      const matchedJob = jobs.find(
        (job) =>
          job.title.toLowerCase().trim() === closestMatch.toLowerCase().trim()
      );

      return {
        available: true,
        skills: matchedJob?.skills || "No skills listed for this job.",
      };
    }

    const skillPrompt = `Given the job title "${normalizedTitle}", provide a concise list of 3-5 key skills. List skills only.`;
    const result = await generateAIResponse(skillPrompt);

    return {
      available: false,
      skills: result,
    };

  } catch (error) {
    console.error("Search job error:", error);
    return { error: "Something went wrong" };
  }
};
// ========================gemini-----------------------------------------

// async function normalizeJobTitle(title) {
//   const prompt = `Convert the following into a professional, standardized job title (no extra words): "${title}"`;
//   const result = await generateAIResponse(prompt);

//   console.log(result,"innormalization");

//   return result;
// }

// // Use Gemini to find the closest matching title from DB
// async function findClosestJobTitle(normalizedTitle, storedTitles) {
//   const prompt = `
// Given the normalized job title: "${normalizedTitle}"
// And the following list of stored job titles: ${storedTitles.map(t => `"${t}"`).join(", ")}

// Which one from the list best matches the normalized title? Just return the best match. If none match, say "none".
// `;
//   const result = await generateAIResponse(prompt);
//   console.log(result,"closest match");

//   // const match = result.response.text().trim().toLowerCase();

//   if (result === "none") return null;

//   return result;
// }
// // AI-based greeting detection
// async function isGreeting(text) {
//   const prompt = `Is the following message a greeting? Just answer "yes" or "no": "${text}"`;
//   const result = await generateAIResponse(prompt);
//   return result==="yes";
// }

// export const searchJob = async (title) => {
//   await ConnectDB();

//   try {
//     if (!title) {
//       return { error: "Job title is required" };
//     }

//     // AI greeting check
//     const isGreet = await isGreeting(title);
//     console.log(isGreet,"decison");

//     if (isGreet) {
//       return {
//         message: "Hello! How can I assist you with your job search today?"
//       };
//     }

//     // Normalize user input
//     const normalizedTitle = await normalizeJobTitle(title);

//     // Fetch jobs
//     const jobs = await Job.find({}, "title skills").lean();
//     const storedTitles = jobs.map(job => job.title.toLowerCase());

//     const closestMatch =
//       storedTitles.length > 0
//         ? await findClosestJobTitle(normalizedTitle, storedTitles)
//         : null;

//     if (closestMatch) {
//       const matchedJob = jobs.find(
//         job => job.title.toLowerCase() === closestMatch
//       );

//       return {
//         available: true,
//         skills: matchedJob?.skills || ""
//       };
//     }

//     // AI fallback skills
//     const skillPrompt = `Given the job title "${normalizedTitle}", provide a concise list of 3-5 key skills. List skills only.`;
//     const result = await generateAIResponse(skillPrompt);

//     return {
//       available: false,
//       skills: result
//     };

//   } catch (error) {
//     console.error("Search job error:", error);
//     return {
//       error: "Something went wrong"
//     };
//   }
// };

// export const setDate=async(data)=>{
//   await ConnectDB();
//   try{
//     const { _id,interviewDate}=data;
//   await Application.findOneAndUpdate({
//     _id:_id
//   },{
//     interviewDate:interviewDate
//   },{new:true})
//   }catch(error){
//     console.log(error)
//     return { success: false,error:error.message}
//   }
// }
