// "use client";
// import { searchJob } from "@/actions";
// import { motion } from "framer-motion";
// import { Search } from "lucide-react";
// import Link from "next/link";
// import { useState, useTransition } from "react";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// const HomePage = ({ ProfileInfo }) => {
//   const [query, setQuery] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const [jobResult, setJobResult] = useState({
//     available: "",
//     skills: "",
//     message: "",
//   });
//   const [hasSearched, setHasSearched] = useState(false);
//   const [showBox, setShowBox] = useState(false);
//   const handleSearch = () => {
//     setShowBox(true);
//     setHasSearched(true);
//     // startTransition(async () => {
      
//     //   const result = await searchJob(query);
//     //   console.log(result, "aiii");
//     //   setJobResult({...result,
//     //   available: Boolean(result.available),});
//     // });
//     startTransition(async () => {
//   const result = await searchJob(query);
//   console.log("raw result:", result);
//   console.log("available type:", typeof result.available);
//   console.log("available value:", result.available);
//   console.log("message value:", result.message);
//   console.log("Boolean(available):", Boolean(result.available));
  
//   setJobResult({
//     ...result,
//     available: Boolean(result.available),
//   });
// });
//   };
//   const companies = [
//     {
//       name: "Microsoft",
//       logo: "https://media.glassdoor.com/sql/1651/microsoft-squarelogo-1479856042252.png",
//     },
//     {
//       name: "freelance",
//       logo: "https://media.glassdoor.com/sql/392261/freelancer-squarelogo-1503383966970.png",
//     },
//     {
//       name: "Google",
//       logo: "https://media.glassdoor.com/sql/9079/google-squarelogo-1441130773284.png",
//     },
//     {
//       name: "IBM",
//       logo: "https://media.glassdoor.com/sql/354/ibm-squareLogo-1680100245029.png",
//     },
//     {
//       name: "Cisco",
//       logo: "https://media.glassdoor.com/sql/1425/cisco-systems-squareLogo-1702924319691.png",
//     },
//     {
//       name: "Nokia",
//       logo: "https://media.glassdoor.com/sql/3494/nokia-squareLogo-1677420008065.png",
//     },
//     {
//       name: "Adobe",
//       logo: "https://media.glassdoor.com/sql/1090/adobe-squareLogo-1696430095326.png",
//     },
//   ];
//   const testimonials = [
//     {
//       name: "SoftWare Enginer",
//       text: "Python, Java, C++",
//       hearts: 1,
//     },
//     {
//       name: "Data Scientist",
//       text: "Python/R, machine learning, data visualization",
//       hearts: 1,
//     },
//     {
//       name: "Cybersecurity Analyst",
//       text: "Ethical hacking, network security, cryptography, risk management",
//       hearts: 1,
//     },
//     {
//       name: "AI/ML Engineer",
//       text: "Python, TensorFlow, PyTorch, deep learning, NLP.",
//       hearts: 1,
//     },
//     {
//       name: "Full-Stack Developer",
//       text: "React, Node.js, databases (e.g., MongoDB, SQL)",
//       hearts: 1,
//     },
//   ];

//   // Main content fade-in
//   const pageVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: { duration: 0.8, ease: "easeOut" },
//     },
//   };

//   // Enhanced container variants with scale
//   const containerVariants = {
//     hidden: { opacity: 0, scale: 0.95 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: {
//         staggerChildren: 0.2,
//         duration: 0.6,
//       },
//     },
//   };
//   const testimonialVariants = {
//     initial: { x: "100%" }, // Start off-screen to the right
//     animate: {
//       x: "-100%", // Move left beyond the viewport
//       transition: {
//         x: {
//           repeat: Infinity, // Loop continuously
//           repeatType: "loop", // Loop back smoothly
//           duration: 30, // Duration for one full cycle (adjust for speed)
//           ease: "linear", // Smooth, constant motion
//         },
//       },
//     },
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, y: 30 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: { duration: 0.6, ease: "easeOut" },
//     },
//   };

//   const logoVariants = {
//     hidden: { opacity: 0, scale: 0 },
//     visible: {
//       opacity: 1,
//       scale: 1,
//       transition: { duration: 0.6, type: "spring" },
//     },
//     hover: {
//       scale: 1.1,
//       rotate: 5,
//       transition: { duration: 0.3 },
//     },
//   };

//   // Gradient background animation
//   const gradientVariants = {
//     animate: {
//       backgroundPosition: ["0% 0%", "100% 100%"],
//       transition: {
//         duration: 10,
//         repeat: Infinity,
//         repeatType: "reverse",
//       },
//     },
//   };

//   return (
//     <>
//       {/* Main Content */}
//       <motion.main variants={pageVariants} initial="hidden" animate="visible">
//         {/* Hero Section */}
//         <section className="relative overflow-hidden rounded-md mx-2">
//           <motion.div
//             className="absolute inset-0 z-0"
//             variants={gradientVariants}
//             animate="animate"
//             style={{
//               background: "linear-gradient(45deg, #f3e7ff, #e3f2fd, #f3e7ff)",
//               backgroundSize: "200% 200%",
//             }}
//           />
//           <div className="relative z-10 container mx-auto px-4 py-10 flex ">
//             <div className="flex flex-wrap items-center gap-12 ">
//               <motion.div
//                 className=" w-5/6 lg:w-5/12 space-y-8"
//                 variants={containerVariants}
//                 initial="hidden"
//                 animate="visible"
//               >
//                 <motion.span variants={itemVariants} className="flex space-x-3">
//                   <span className="block w-16 h-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full" />
//                   <span className="hidden lg:font-medium text-gray-600 bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text">
//                     Your Career Journey Starts Here
//                   </span>
//                 </motion.span>

//                 <motion.h1
//                   variants={itemVariants}
//                   className="text-3xl lg:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-700 via-blue-600 to-indigo-600 text-transparent bg-clip-text"
//                 >
//                   Discover Your <br /> Dream Job
//                 </motion.h1>

//                 <motion.p
//                   variants={itemVariants}
//                   className="text-xl text-gray-600 max-w-md"
//                 >
//                   Connect with top companies and unlock your career potential
//                   with ease
//                 </motion.p>
//                 <motion.div variants={itemVariants} className="flex gap-4  ">
//                   {ProfileInfo ? (
//                     ProfileInfo?.role === "candidate" ? (
//                       <Link
//                         href={"/jobs"}
//                         className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//                       >
//                         Browse Jobs
//                       </Link>
//                     ) : (
//                       <Link
//                         href={"/jobs"}
//                         className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//                       >
//                         Post New Job
//                       </Link>
//                     )
//                   ) : (
//                     <div className="hidden lg:flex gap-4">
//                       <Link
//                         href={"/jobs"}
//                         className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//                       >
//                         Post New Job
//                       </Link>
//                       <Link
//                         href={"/jobs"}
//                         className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//                       >
//                         Browse Jobs
//                       </Link>
//                     </div>
//                   )}
//                 </motion.div>
//               </motion.div>

//               <motion.div
//                 className="lg:w-7/12 hidden md:block"
//                 initial={{ opacity: 0, x: 100 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 transition={{ duration: 1, delay: 0.5 }}
//               >
//                 <img
//                   src="https://static.vecteezy.com/system/resources/previews/000/172/715/original/vector-job-search-via-website.jpg"
//                   alt="Job search illustration"
//                   width={600}
//                   height={400}
//                   className="rounded-xl shadow-2xl"
//                 />
//               </motion.div>
//             </div>

//             <div className="border-black h-full w-96 ">
//               <div className="flex gap-2">
//                 <Input
//                   placeholder="Kown about job skills..."
//                   className="flex-1 text-sm"
//                   value={query}
//                   onChange={(e) => {
//                     setJobResult({});
//                     setQuery(e.target.value);
//                     setShowBox(false);
//                   }}
//                 />
//                 <Button
//                   size="icon"
//                   className="bg-violet-600 hover:bg-violet-700"
//                   onClick={handleSearch}
//                   disabled={isPending}
//                 >
//                   <Search className="h-4 w-4" />
//                 </Button>
//               </div>
//               {(hasSearched || isPending) && showBox && (
//                 <div className="bg-slate-300 mt-5 p-3 rounded-sm transition-all duration-300 ease-in-out max-h-[400px] overflow-y-auto">
//                   {isPending && (
//                     <p className="text-blue-600 mt-2">Searching...</p>
//                   )}
//                   {!isPending &&
//                     hasSearched &&
//                     !jobResult?.message && (
//                       <pre
//                         className={`whitespace-pre-wrap mt-2 text-sm font-medium ${
//                           jobResult?.available
//                             ? "text-green-600"
//                             : "text-red-600"
//                         }`}
//                       >
//                         Available: {jobResult?.available ? "yes" : "no"}
//                       </pre>
//                     )}
//                   {jobResult?.skills && (
//                     <pre className="whitespace-pre-wrap mt-2 text-sm text-gray-700">
//                      {jobResult?.available ? "Mention Skills are:-" : "Important Skills are:-"} {jobResult.skills}
//                     </pre>
//                   )}
                  
//                   {jobResult?.message && (
//                     <pre
//                       className={`whitespace-pre-wrap mt-2 text-sm font-medium text-blue-600`}
//                     >
//                       {jobResult?.message}
//                     </pre>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </section>
//         <motion.div
//           variants={itemVariants}
//           className="flex gap-4 justify-around my-4"
//         >
//           {ProfileInfo ? null : (
//             <div className="flex gap-4 lg:hidden ">
//               <Link
//                 href={"/jobs"}
//                 className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//               >
//                 Post New Job
//               </Link>
//               <Link
//                 href={"/jobs"}
//                 className="flex bg-black text-white rounded-md h-11 items-center justify-center px-5"
//               >
//                 Browse Jobs
//               </Link>
//             </div>
//           )}
//         </motion.div>
//         {/* Popular Jobs Section */}
//         <section className="py-16 bg-gradient-to-br from-purple-600 via-blue-300 to-indigo-60 rounded-xl my-8  relative overflow-hidden ">
//           <div className="container mx-auto px-4">
//             <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
//               Popular jobs and skills in demand
//             </h2>

//             {/* Testimonial Slider with Continuous Animation */}
//             <motion.div
//               className="flex gap-8 whitespace-nowrap "
//               variants={testimonialVariants}
//               initial="initial"
//               animate="animate"
//             >
//               {testimonials.map((testimonial, index) => (
//                 <motion.div
//                   key={index}
//                   className="inline-block w-[300px] bg-white rounded-2xl p-6 shadow-md border border-gray-200 "
//                   whileHover={{ scale: 1.05 }} // Slight scale on hover for interactivity
//                   transition={{ duration: 0.3 }}
//                 >
//                   <div className="flex items-center gap-4 mb-4 min-w-60">
//                     <div>
//                       <p className="font-semibold">{testimonial.name}</p>
//                     </div>
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="text-gray-800 mb-4 break-words whitespace-normal">
//                       {testimonial.text}
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </motion.div>
//           </div>
//         </section>

//         {/* Companies Section */}
//         <section className="py-16  rounded-md bg-gradient-to-br from-purple-600 via-blue-300 to-indigo-60">
//           <div className="container mx-auto px-4 ">
//             <motion.div
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="text-center mb-12"
//             >
//               <motion.h2
//                 variants={itemVariants}
//                 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text"
//               >
//                 Top Hiring Companies
//               </motion.h2>
//               <motion.div
//                 className="flex flex-wrap justify-center gap-6"
//                 variants={containerVariants}
//               >
//                 {companies.map((company, index) => (
//                   <motion.div
//                     key={index}
//                     variants={logoVariants}
//                     whileHover="hover"
//                     className="bg-white p-4 rounded-xl shadow-lg border border-gray-100"
//                   >
//                     <img
//                       src={company.logo}
//                       alt={`${company.name} logo`}
//                       width={100}
//                       height={100}
//                       className="object-contain"
//                     />
//                   </motion.div>
//                 ))}
//               </motion.div>
//             </motion.div>
//           </div>
//         </section>

//         {/* Footer */}
//       </motion.main>
//     </>
//   );
// };

// export default HomePage;

"use client";
import { searchJob } from "@/actions";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Briefcase, Plus, TrendingUp, CheckCircle2, XCircle, Loader2, ArrowRight, Sparkles, Users, Building2, Star } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";

const HomePage = ({ ProfileInfo }) => {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [jobResult, setJobResult] = useState({ available: "", skills: "", message: "" });
  const [hasSearched, setHasSearched] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setShowBox(true);
    setHasSearched(true);
    startTransition(async () => {
      const result = await searchJob(query);
      setJobResult({ ...result, available: Boolean(result.available) });
    });
  };

  const companies = [
    { name: "Microsoft", logo: "https://media.glassdoor.com/sql/1651/microsoft-squarelogo-1479856042252.png" },
    { name: "Freelancer", logo: "https://media.glassdoor.com/sql/392261/freelancer-squarelogo-1503383966970.png" },
    { name: "Google", logo: "https://media.glassdoor.com/sql/9079/google-squarelogo-1441130773284.png" },
    { name: "IBM", logo: "https://media.glassdoor.com/sql/354/ibm-squareLogo-1680100245029.png" },
    { name: "Cisco", logo: "https://media.glassdoor.com/sql/1425/cisco-systems-squareLogo-1702924319691.png" },
    { name: "Nokia", logo: "https://media.glassdoor.com/sql/3494/nokia-squareLogo-1677420008065.png" },
    { name: "Adobe", logo: "https://media.glassdoor.com/sql/1090/adobe-squareLogo-1696430095326.png" },
  ];

  const roles = [
    { title: "Software Engineer", skills: "Python · Java · C++", icon: "💻", tag: "High Demand", color: "indigo" },
    { title: "Data Scientist", skills: "Python/R · ML · Visualization", icon: "📊", tag: "Trending", color: "violet" },
    { title: "Cybersecurity Analyst", skills: "Ethical Hacking · Network Security", icon: "🛡️", tag: "Growing", color: "blue" },
    { title: "AI / ML Engineer", skills: "TensorFlow · PyTorch · NLP", icon: "🤖", tag: "Hot 🔥", color: "purple" },
    { title: "Full-Stack Developer", skills: "React · Node.js · MongoDB", icon: "🌐", tag: "High Demand", color: "indigo" },
  ];

  const tagColors = {
    indigo: "bg-indigo-100 text-indigo-700",
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
  };

  const stats = [
    { icon: Briefcase, value: "12,400+", label: "Active Listings" },
    { icon: Building2, value: "3,200+", label: "Companies" },
    { icon: Users, value: "98k+", label: "Placed Candidates" },
    { icon: Star, value: "4.9/5", label: "User Rating" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12, duration: 0.6 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <main className="min-h-screen bg-[#F8F7FF] font-sans overflow-x-hidden">

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* decorative blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-200/40 blur-3xl" />
        <div className="pointer-events-none absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 w-[300px] h-[300px] rounded-full bg-purple-100/50 blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

            {/* Left — Headline */}
            <motion.div
              className="flex-1 max-w-xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Your career journey starts here
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 mb-5">
                Discover<br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    Your Dream
                  </span>
                </span>
                <br />Job Today
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-slate-500 leading-relaxed mb-8 max-w-md">
                Connect with top companies, explore in-demand skills, and take the next step in your career with confidence.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
                {ProfileInfo ? (
                  ProfileInfo.role === "candidate" ? (
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200">
                      <Briefcase className="w-4 h-4" /> Browse Jobs <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200">
                      <Plus className="w-4 h-4" /> Post New Job
                    </Link>
                  )
                ) : (
                  <>
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200">
                      <Briefcase className="w-4 h-4" /> Browse Jobs
                    </Link>
                    <Link href="/jobs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold hover:border-violet-300 hover:text-violet-700 hover:-translate-y-0.5 transition-all duration-200">
                      <Plus className="w-4 h-4" /> Post a Job
                    </Link>
                  </>
                )}
              </motion.div>

              {/* Stats row */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-200">
                {stats.map(({ icon: Icon, value, label }) => (
                  <div key={label} className="text-center">
                    <div className="text-xl font-black text-slate-900">{value}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right — Search Card */}
            <motion.div
              className="w-full lg:w-[380px] flex-shrink-0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative bg-white rounded-3xl shadow-xl  border border-violet-100/60 p-6 overflow-hidden">
                {/* card accent */}
               
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-semibold text-slate-700">Explore Job Skills</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-5">Search any role to see required skills & demand</p>

                  {/* Search input */}
                  <div className={`flex items-center gap-2 rounded-xl border-2 bg-slate-50 px-3 py-2 transition-all duration-200 ${isFocused ? "border-violet-500 bg-white shadow-sm shadow-violet-100" : "border-slate-200"}`}>
                    <Search className={`w-4 h-4 flex-shrink-0 transition-colors ${isFocused ? "text-violet-500" : "text-slate-400"}`} />
                    <input
                      className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400 text-slate-800"
                      placeholder="e.g. Data Scientist, DevOps..."
                      value={query}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => { setJobResult({}); setQuery(e.target.value); setShowBox(false); }}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                      onClick={handleSearch}
                      disabled={isPending || !query.trim()}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 active:scale-95 transition-all"
                    >
                      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Search className="w-3 h-3" /> Search</>}
                    </button>
                  </div>

                  {/* Quick suggestions */}
                  {!showBox && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Software Engineer", "Data Scientist", "AI Engineer"].map((s) => (
                        <button
                          key={s}
                          onClick={() => { setQuery(s); }}
                          className="text-xs px-3 py-1 rounded-full bg-violet-50 text-violet-600 border border-violet-100 hover:bg-violet-100 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Result box */}
                  <AnimatePresence>
                    {(hasSearched || isPending) && showBox && (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className={`rounded-2xl border p-4 ${
                          isPending
                            ? "bg-slate-50 border-slate-200"
                            : jobResult?.available
                            ? "bg-emerald-50 border-emerald-200"
                            : jobResult?.message
                            ? "bg-blue-50 border-blue-200"
                            : "bg-red-50 border-red-200"
                        }`}>
                          {isPending && (
                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
                              Analysing job market…
                            </div>
                          )}

                          {!isPending && jobResult?.message && (
                            <p className="text-sm text-blue-700 font-medium">{jobResult.message}</p>
                          )}

                          {!isPending && hasSearched && !jobResult?.message && (
                            <>
                              <div className={`flex items-center gap-2 text-sm font-semibold mb-3 ${jobResult?.available ? "text-emerald-700" : "text-red-700"}`}>
                                {jobResult?.available
                                  ? <><CheckCircle2 className="w-4 h-4" /> Roles actively hiring</>
                                  : <><XCircle className="w-4 h-4" /> Low availability right now</>
                                }
                              </div>
                              {jobResult?.skills && (
                                <div>
                                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                    {jobResult?.available ? "Key Skills Required" : "Skills to Build"}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {jobResult.skills.split(/[,·\n]/).filter(Boolean).map((skill, i) => (
                                      <span key={i} className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                                        jobResult?.available
                                          ? "bg-emerald-100 text-emerald-800"
                                          : "bg-violet-100 text-violet-600"
                                      }`}>
                                        {skill.trim()}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── POPULAR ROLES ─── */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold mb-3">
            <TrendingUp className="w-3 h-3" /> In Demand Now
          </div>
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Popular Jobs & Skills
          </h2>
          <p className="text-slate-500 mt-2 text-base">Explore top roles and the skills they require</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {roles.map((role, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:shadow-violet-100 hover:border-violet-200 transition-all duration-300 cursor-pointer"
            >
              <div className="text-3xl mb-4">{role.icon}</div>
              <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2 group-hover:text-violet-700 transition-colors">{role.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{role.skills}</p>
              <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${tagColors[role.color]}`}>
                {role.tag}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── COMPANIES ─── */}
      <section className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 py-16 px-6 rounded-3xl mx-4 mb-16 overflow-hidden relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.12)_0%,_transparent_60%)]" />

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-10">
            <p className="text-violet-200 text-sm font-semibold uppercase tracking-widest mb-2">Trusted by professionals at</p>
            <h2 className="text-3xl lg:text-4xl font-black text-white">Top Hiring Companies</h2>
          </div>

          {/* Marquee */}
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            <div className="flex gap-4 w-max animate-[marquee_22s_linear_infinite]">
              {[...companies, ...companies].map((c, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 flex-shrink-0 hover:bg-white/20 transition-colors cursor-pointer group">
                  <img
                    src={c.logo}
                    alt={c.name}
                    className="w-8 h-8 object-contain rounded-lg bg-white p-0.5"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span className="text-white font-semibold text-sm">{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Marquee keyframe via style tag */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </main>
  );
};

export default HomePage;


// -------------------------1==========
// "use client";
// import { searchJob } from "@/actions";
// import { motion, AnimatePresence } from "framer-motion";
// import { Search, Briefcase, ArrowRight, Sparkles, CheckCircle2, XCircle, MessageCircle } from "lucide-react";
// import Link from "next/link";
// import { useState, useTransition } from "react";

// const HomePage = ({ ProfileInfo }) => {
//   const [query, setQuery] = useState("");
//   const [isPending, startTransition] = useTransition();
//   const [jobResult, setJobResult] = useState({ available: "", skills: "", message: "" });
//   const [hasSearched, setHasSearched] = useState(false);
//   const [showBox, setShowBox] = useState(false);

//   const handleSearch = () => {
//     if (!query.trim()) return;
//     setShowBox(true);
//     setHasSearched(true);
//     startTransition(async () => {
//       const result = await searchJob(query);
//       setJobResult({ ...result, available: Boolean(result.available) });
//     });
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") handleSearch();
//   };

//   const companies = [
//     { name: "Microsoft", logo: "https://media.glassdoor.com/sql/1651/microsoft-squarelogo-1479856042252.png" },
//     { name: "Freelancer", logo: "https://media.glassdoor.com/sql/392261/freelancer-squarelogo-1503383966970.png" },
//     { name: "Google", logo: "https://media.glassdoor.com/sql/9079/google-squarelogo-1441130773284.png" },
//     { name: "IBM", logo: "https://media.glassdoor.com/sql/354/ibm-squareLogo-1680100245029.png" },
//     { name: "Cisco", logo: "https://media.glassdoor.com/sql/1425/cisco-systems-squareLogo-1702924319691.png" },
//     { name: "Nokia", logo: "https://media.glassdoor.com/sql/3494/nokia-squareLogo-1677420008065.png" },
//     { name: "Adobe", logo: "https://media.glassdoor.com/sql/1090/adobe-squareLogo-1696430095326.png" },
//   ];

//   const jobCards = [
//     { name: "Software Engineer", text: "Python, Java, C++", icon: "💻", color: "from-blue-500 to-cyan-400" },
//     { name: "Data Scientist", text: "Python/R, ML, Data Viz", icon: "📊", color: "from-violet-500 to-purple-400" },
//     { name: "Cybersecurity Analyst", text: "Ethical hacking, Cryptography", icon: "🔐", color: "from-red-500 to-orange-400" },
//     { name: "AI/ML Engineer", text: "TensorFlow, PyTorch, NLP", icon: "🤖", color: "from-emerald-500 to-teal-400" },
//     { name: "Full-Stack Developer", text: "React, Node.js, MongoDB", icon: "🌐", color: "from-pink-500 to-rose-400" },
//     { name: "Cloud Architect", text: "AWS, Azure, Docker, K8s", icon: "☁️", color: "from-sky-500 to-blue-400" },
//   ];

//   const stats = [
//     { value: "50K+", label: "Active Jobs" },
//     { value: "10K+", label: "Companies" },
//     { value: "2M+", label: "Job Seekers" },
//   ];

//   return (
//     <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
//         * { font-family: 'DM Sans', sans-serif; }
//         .font-display { font-family: 'Syne', sans-serif; }
//         .glow { box-shadow: 0 0 40px rgba(139,92,246,0.3); }
//         .glow-sm { box-shadow: 0 0 20px rgba(139,92,246,0.2); }
//         .grid-bg {
//           background-image: linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px),
//             linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px);
//           background-size: 40px 40px;
//         }
//         .ticker-wrap { overflow: hidden; white-space: nowrap; }
//         .ticker-inner { display: inline-flex; gap: 2rem; animation: ticker 30s linear infinite; }
//         @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
//         .search-input::placeholder { color: rgba(255,255,255,0.3); }
//         .search-input:focus { outline: none; }
//         .result-box { backdrop-filter: blur(20px); }
//         .company-logo { filter: grayscale(100%) brightness(0) invert(1); opacity: 0.5; transition: all 0.3s; }
//         .company-logo:hover { filter: none; opacity: 1; }
//         .card-shine::before {
//           content: '';
//           position: absolute;
//           inset: 0;
//           background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%);
//           border-radius: inherit;
//         }
//       `}</style>

//       {/* ── HERO ── */}
//       <section className="relative min-h-screen grid-bg flex flex-col">
//         {/* Ambient blobs */}
//         <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
//         <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-600/15 blur-[100px] pointer-events-none" />

//         <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 pt-24 pb-16 text-center">
//           {/* Badge */}
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5 }}
//             className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-violet-300 mb-8"
//           >
//             <Sparkles className="w-3.5 h-3.5" />
//             AI-Powered Job Discovery
//           </motion.div>

//           {/* Headline */}
//           <motion.h1
//             className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[1.05] tracking-tight mb-6"
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, delay: 0.1 }}
//           >
//             <span className="text-white">Find Your</span>
//             <br />
//             <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-blue-400 text-transparent bg-clip-text">
//               Dream Career
//             </span>
//           </motion.h1>

//           <motion.p
//             className="text-white/50 text-lg md:text-xl max-w-xl mb-12 font-light"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ duration: 0.7, delay: 0.25 }}
//           >
//             Ask about any job title and instantly discover required skills,
//             availability, and career insights — powered by AI.
//           </motion.p>

//           {/* ── SEARCH BAR ── */}
//           <motion.div
//             className="w-full max-w-2xl"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.35 }}
//           >
//             <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 glow-sm hover:border-violet-500/40 transition-all duration-300">
//               <Search className="ml-3 w-5 h-5 text-white/30 flex-shrink-0" />
//               <input
//                 className="search-input flex-1 bg-transparent px-4 py-3 text-white text-base"
//                 placeholder="e.g. Full-Stack Developer, Data Scientist..."
//                 value={query}
//                 onChange={(e) => {
//                   setJobResult({});
//                   setQuery(e.target.value);
//                   setShowBox(false);
//                 }}
//                 onKeyDown={handleKeyDown}
//               />
//               <button
//                 onClick={handleSearch}
//                 disabled={isPending || !query.trim()}
//                 className="flex-shrink-0 flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-5 py-3 rounded-xl transition-all duration-200"
//               >
//                 {isPending ? (
//                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                 ) : (
//                   <>Explore <ArrowRight className="w-4 h-4" /></>
//                 )}
//               </button>
//             </div>

//             {/* ── RESULT BOX ── */}
//             <AnimatePresence>
//               {showBox && (hasSearched || isPending) && (
//                 <motion.div
//                   initial={{ opacity: 0, y: -10, scale: 0.98 }}
//                   animate={{ opacity: 1, y: 0, scale: 1 }}
//                   exit={{ opacity: 0, y: -10, scale: 0.98 }}
//                   transition={{ duration: 0.25 }}
//                   className="result-box mt-3 bg-white/5 border border-white/10 rounded-2xl p-5 text-left max-h-80 overflow-y-auto"
//                 >
//                   {/* Loading */}
//                   {isPending && (
//                     <div className="flex items-center gap-3 text-violet-300">
//                       <div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
//                       <span className="text-sm">Analyzing job market...</span>
//                     </div>
//                   )}

//                   {/* Greeting / message */}
//                   {!isPending && jobResult?.message && (
//                     <div className="flex items-start gap-3">
//                       <MessageCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
//                       <p className="text-blue-300 text-sm">{jobResult.message}</p>
//                     </div>
//                   )}

//                   {/* Available badge */}
//                   {!isPending && hasSearched && !jobResult?.message && (
//                     <div className="flex items-center gap-2 mb-4">
//                       {jobResult?.available ? (
//                         <>
//                           <CheckCircle2 className="w-5 h-5 text-emerald-400" />
//                           <span className="text-emerald-400 font-semibold text-sm">Job Available in our listings</span>
//                           <span className="ml-auto bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">Active</span>
//                         </>
//                       ) : (
//                         <>
//                           <XCircle className="w-5 h-5 text-amber-400" />
//                           <span className="text-amber-400 font-semibold text-sm">Not in current listings</span>
//                           <span className="ml-auto bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded-full border border-amber-500/30">Suggested Skills</span>
//                         </>
//                       )}
//                     </div>
//                   )}

//                   {/* Skills */}
//                   {!isPending && jobResult?.skills && (
//                     <div>
//                       <p className="text-white/40 text-xs uppercase tracking-widest mb-3">
//                         {jobResult?.available ? "Required Skills" : "Key Skills to Learn"}
//                       </p>
//                       <div className="flex flex-wrap gap-2">
//                         {jobResult.skills.split(/[,\n]/).map((skill, i) => skill.trim() && (
//                           <span
//                             key={i}
//                             className="bg-violet-500/15 border border-violet-500/25 text-violet-200 text-xs px-3 py-1.5 rounded-lg"
//                           >
//                             {skill.trim()}
//                           </span>
//                         ))}
//                       </div>
//                     </div>
//                   )}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>

//           {/* Stats row */}
//           <motion.div
//             className="flex gap-10 mt-16"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6, duration: 0.6 }}
//           >
//             {stats.map((s, i) => (
//               <div key={i} className="text-center">
//                 <p className="font-display text-2xl font-bold text-white">{s.value}</p>
//                 <p className="text-white/30 text-xs mt-1">{s.label}</p>
//               </div>
//             ))}
//           </motion.div>

//           {/* CTA Buttons */}
//           <motion.div
//             className="flex gap-4 mt-10"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.7 }}
//           >
//             {ProfileInfo ? (
//               <Link
//                 href="/jobs"
//                 className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-all"
//               >
//                 <Briefcase className="w-4 h-4" />
//                 {ProfileInfo.role === "candidate" ? "Browse Jobs" : "Post New Job"}
//               </Link>
//             ) : (
//               <>
//                 <Link href="/jobs" className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/90 transition-all">
//                   <Briefcase className="w-4 h-4" /> Browse Jobs
//                 </Link>
//                 <Link href="/jobs" className="flex items-center gap-2 bg-white/5 border border-white/10 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-white/10 transition-all">
//                   Post a Job <ArrowRight className="w-4 h-4" />
//                 </Link>
//               </>
//             )}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── SKILLS TICKER ── */}
//       <section className="py-16 border-y border-white/5 bg-[#0d0d14] overflow-hidden">
//         <p className="text-center text-white/20 text-xs uppercase tracking-widest mb-8">Popular roles in demand</p>
//         <div className="ticker-wrap">
//           <div className="ticker-inner">
//             {[...jobCards, ...jobCards].map((card, i) => (
//               <div
//                 key={i}
//                 className="inline-flex items-center gap-3 bg-white/5 border border-white/8 rounded-xl px-5 py-3 flex-shrink-0"
//               >
//                 <span className="text-xl">{card.icon}</span>
//                 <div>
//                   <p className="text-white font-medium text-sm whitespace-nowrap">{card.name}</p>
//                   <p className="text-white/30 text-xs whitespace-nowrap">{card.text}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ── JOB CARDS GRID ── */}
//       <section className="py-24 px-4 max-w-6xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.6 }}
//           className="text-center mb-16"
//         >
//           <p className="text-violet-400 text-sm uppercase tracking-widest mb-3 font-medium">Trending Now</p>
//           <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
//             Jobs & Skills <span className="text-white/30">in Demand</span>
//           </h2>
//         </motion.div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//           {jobCards.map((card, i) => (
//             <motion.div
//               key={i}
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.4, delay: i * 0.08 }}
//               whileHover={{ y: -4, transition: { duration: 0.2 } }}
//               className="relative card-shine group bg-white/[0.03] border border-white/8 rounded-2xl p-6 cursor-pointer hover:border-violet-500/30 hover:bg-white/[0.06] transition-all duration-300"
//             >
//               <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg mb-4`}>
//                 {card.icon}
//               </div>
//               <h3 className="font-display font-bold text-white text-lg mb-2">{card.name}</h3>
//               <p className="text-white/40 text-sm leading-relaxed">{card.text}</p>
//               <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity">
//                 <ArrowRight className="w-4 h-4 text-violet-400" />
//               </div>
//             </motion.div>
//           ))}
//         </div>
//       </section>

//       {/* ── COMPANIES ── */}
//       <section className="py-20 px-4 border-t border-white/5">
//         <div className="max-w-5xl mx-auto">
//           <motion.div
//             initial={{ opacity: 0 }}
//             whileInView={{ opacity: 1 }}
//             viewport={{ once: true }}
//             className="text-center mb-14"
//           >
//             <p className="text-white/20 text-sm uppercase tracking-widest mb-3">Trusted by professionals at</p>
//             <h2 className="font-display text-3xl md:text-4xl font-bold text-white">Top Hiring Companies</h2>
//           </motion.div>

//           <motion.div
//             className="flex flex-wrap justify-center items-center gap-8 md:gap-12"
//             initial={{ opacity: 0, y: 10 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             {companies.map((company, i) => (
//               <motion.div
//                 key={i}
//                 whileHover={{ scale: 1.1 }}
//                 transition={{ duration: 0.2 }}
//                 className="flex items-center justify-center"
//               >
//                 <img
//                   src={company.logo}
//                   alt={company.name}
//                   width={70}
//                   height={70}
//                   className="company-logo object-contain"
//                 />
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* ── CTA BANNER ── */}
//       <section className="py-20 px-4">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="max-w-4xl mx-auto relative overflow-hidden bg-gradient-to-br from-violet-600/20 to-blue-600/10 border border-violet-500/20 rounded-3xl p-12 text-center glow"
//         >
//           <div className="absolute inset-0 grid-bg opacity-30" />
//           <div className="relative z-10">
//             <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">
//               Ready to Land Your <br />
//               <span className="bg-gradient-to-r from-violet-400 to-blue-400 text-transparent bg-clip-text">Next Role?</span>
//             </h2>
//             <p className="text-white/40 mb-8 max-w-md mx-auto">
//               Join thousands of professionals using AI to navigate their career journey.
//             </p>
//             <div className="flex gap-4 justify-center">
//               <Link href="/jobs" className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-7 py-3.5 rounded-xl transition-all flex items-center gap-2">
//                 Get Started <ArrowRight className="w-4 h-4" />
//               </Link>
//             </div>
//           </div>
//         </motion.div>
//       </section>
//     </div>
//   );
// };

// export default HomePage;