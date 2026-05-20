"use client";

import {
  createCashgram,
  createOrderAction,
  createPaymentAction,
  paymentVerify,
} from "@/actions";
import { load } from "@cashfreepayments/cashfree-js";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Crown,
  Sparkles,
  Zap,
  Building2,
  CheckCircle2,
  Calendar,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Star,
} from "lucide-react";

function MemberShipPage({ ProfileInfo, AllPlan }) {
  const matchedPlan = AllPlan.find(
    (plan) => plan.type === ProfileInfo.memberShipType,
  );
  const [hoveredPlan, setHoveredPlan] = useState(null);
  const cashfreeRef = useRef(null);

  useEffect(() => {
    const initializeSDK = async () => {
      try {
        cashfreeRef.current = await load({ mode: "sandbox" });
      } catch (error) {
        console.error("Failed to load payment gateway:", error);
      }
    };
    initializeSDK();
  }, []);

  const getSessionId = async (plan) => {
    const res = await createPaymentAction({
      amount: plan.price,
      customer_id: ProfileInfo.userId,
      customer_email: ProfileInfo.email,
    });
    if (res?.payment_session_id) {
      return {
        paymentSessionId: res.payment_session_id,
        orderId: res.order_id,
        orderStatus: res.order_status,
      };
    }
    throw new Error("Failed to retrieve valid session data.");
  };

  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  function getEndDate(duration) {
  const endDate = new Date();

  const months = Number(duration);

  if (isNaN(months) || months <= 0) {
    throw new Error(`Invalid membership duration: ${duration}`);
  }

  endDate.setMonth(endDate.getMonth() + months);

  return endDate;
}

  const verifyPayment = async ({ orderId, plan }) => {
    try {
      const memberShipStartDate = getCurrentDate();
      const memberShipEndDate = getEndDate(Number(plan.month));
      let data = await paymentVerify(orderId);
      console.log("call begin");

      if (data?.[0]?.payment_status === "SUCCESS") {
        await createOrderAction(
          {
            ...ProfileInfo,
            isPremiumUser: true,
            memberShipType: plan.type,
            memberShipStartDate,
            memberShipEndDate,
          },
          "/membership",
        );
      }
      toast.success("Payment successful! Your membership has been updated.");
    } catch (error) {
      console.log("Payment verification failed", error);
    }
  };

  const handlePay = async (plan) => {
    try {
      if (
        cashfreeRef.current &&
        typeof cashfreeRef.current.checkout === "function"
      ) {
        const sessionId = await getSessionId(plan);
        if (!sessionId) return;
        cashfreeRef.current
          .checkout({
            paymentSessionId: sessionId.paymentSessionId,
            redirectTarget: "_modal",
          })
          .then(() => verifyPayment({ orderId: sessionId.orderId, plan }))
          .catch((err) => console.error("Error during checkout:", err));
      }
    } catch (error) {
      console.error("Error in handlePay:", error);
    }
  };

  const trueIdx = AllPlan.findIndex(
    (plan) => ProfileInfo.memberShipType === plan.type,
  );
  const currentPlanPrice = matchedPlan?.price ?? 0;
  const plansToShow = AllPlan.slice(trueIdx + 1).filter(
    (plan) => plan.price > currentPlanPrice,
  );

  const planConfig = {
    basic: {
      icon: Zap,
      color: "from-blue-500 to-indigo-500",
      badge: "bg-blue-100 text-blue-700",
      accent: "border-blue-200",
      ring: "ring-blue-400",
    },
    teams: {
      icon: Building2,
      color: "from-violet-500 to-purple-600",
      badge: "bg-violet-100 text-violet-700",
      accent: "border-violet-200",
      ring: "ring-violet-400",
      popular: true,
    },
    enterprise: {
      icon: Crown,
      color: "from-amber-400 to-orange-500",
      badge: "bg-amber-100 text-amber-700",
      accent: "border-amber-200",
      ring: "ring-amber-400",
    },
  };

  const getConfig = (type) =>
    planConfig[type?.toLowerCase()] || planConfig.basic;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 110, damping: 16 },
    },
  };

  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      {/* ─── Hero Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 pt-6 pb-28 px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl" />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm font-medium mb-5 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            {ProfileInfo?.isPremiumUser
              ? "Premium Member"
              : "Unlock Your Potential"}
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight mb-3">
            {ProfileInfo?.isPremiumUser
              ? "Your Membership"
              : "Choose Your Best Plan"}
          </h1>
          <p className="text-violet-200 text-lg max-w-md mx-auto">
            {ProfileInfo?.isPremiumUser
              ? plansToShow.length > 0
                ? "You're on a premium plan. Upgrade anytime for more power."
                : "You're on our highest tier. Enjoy all premium benefits!"
              : "Get access to exclusive jobs and features. Cancel anytime."}
          </p>

          {ProfileInfo?.isPremiumUser && (
            <div className="inline-flex items-center gap-2 mt-5 px-5 py-2 rounded-full bg-white/15 border border-white/25 text-white font-semibold text-sm backdrop-blur-sm">
              <Crown className="w-4 h-4 text-amber-300" />
              {ProfileInfo.memberShipType?.toUpperCase()} Plan Active
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
            </div>
          )}
        </motion.div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 pb-20">
        {/* ─── Plan Cards or Top-plan banner ─── */}
        {plansToShow.length > 0 ? (
          <motion.div
            className={`grid gap-6 ${
              plansToShow.length === 1
                ? "grid-cols-1 max-w-sm mx-auto"
                : plansToShow.length === 2
                  ? "grid-cols-1 md:grid-cols-2 max-w-2xl mx-auto"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {plansToShow.map((plan, idx) => {
              const cfg = getConfig(plan.type);
              const PlanIcon = cfg.icon;
              const isHovered = hoveredPlan === plan.type;
              const isUnlimited = plan.job === "0";

              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  onHoverStart={() => setHoveredPlan(plan.type)}
                  onHoverEnd={() => setHoveredPlan(null)}
                  className="relative"
                >
                  {cfg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-bold shadow-lg shadow-violet-200">
                      ✦ Most Popular
                    </div>
                  )}

                  <motion.div
                    animate={{
                      y: isHovered ? -6 : 0,
                      scale: isHovered ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`relative bg-white rounded-3xl border-2 ${isHovered ? cfg.accent : "border-slate-100"} overflow-hidden shadow-sm ${isHovered ? "shadow-2xl shadow-violet-100" : ""} transition-shadow duration-300 h-full flex flex-col`}
                  >
                    <div className={`bg-gradient-to-br ${cfg.color} p-6 pb-8`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <PlanIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white/70 text-xs font-semibold uppercase tracking-widest mt-1">
                          {plan.type}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-2xl">
                        {plan.heading}
                      </h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-white text-4xl font-black">
                          ₹{plan.price}
                        </span>
                        <span className="text-white/60 text-sm">/yr</span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col -mt-4">
                      <div className="bg-slate-50 rounded-2xl p-4 mb-5">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 font-medium">
                            {isUnlimited
                              ? "Unlimited job applications"
                              : `${plan.job} job applications`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 font-medium">
                            {plan.month}{" "}
                            {Number(plan.month) === 1 ? "month" : "months"}{" "}
                            validity
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-slate-700 font-medium">
                            Priority support
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePay(plan)}
                        className={`mt-auto w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${cfg.color} hover:opacity-90 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg`}
                      >
                        Upgrade to {plan.type}{" "}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* User is already on the highest-priced plan */
          ProfileInfo?.isPremiumUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-md mx-auto bg-white rounded-3xl border border-amber-100 shadow-sm overflow-hidden text-center"
            >
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8">
                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-black text-2xl">
                  You're at the Top!
                </h3>
                <p className="text-white/70 text-sm mt-1">
                  No higher plan available
                </p>
              </div>
              <div className="p-6">
                <p className="text-slate-500 text-sm">
                  You're already on the{" "}
                  <span className="font-bold text-slate-700">
                    {ProfileInfo.memberShipType?.toUpperCase()}
                  </span>{" "}
                  plan — our highest tier. Enjoy all premium benefits!
                </p>
              </div>
            </motion.div>
          )
        )}

        {/* ─── Current Plan Card ─── */}
        <AnimatePresence>
          {trueIdx !== -1 && matchedPlan && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: plansToShow.length * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-8 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                    <Star className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">
                      Your Current Plan
                    </p>
                    <p className="text-slate-400 text-xs">
                      Active membership details
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
                {[
                  {
                    icon: Crown,
                    label: "Plan Type",
                    value: ProfileInfo?.memberShipType?.toUpperCase(),
                  },
                  {
                    icon: Briefcase,
                    label: "Jobs Available",
                    value:
                      matchedPlan.job === "0"
                        ? "Unlimited"
                        : `${matchedPlan.job} jobs`,
                  },
                  {
                    icon: Calendar,
                    label: "Purchased On",
                    value: ProfileInfo?.memberShipStartDate,
                  },
                  {
                    icon: Calendar,
                    label: "Expires On",
                    value: ProfileInfo?.memberShipEndDate,
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Icon className="w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-1">
                      {label}
                    </p>
                    <p className="text-slate-800 font-bold text-base">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default MemberShipPage;
