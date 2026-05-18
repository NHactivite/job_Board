"use client";

import { createPlanAction, fetchPlanUpadateAction } from "@/actions";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Crown, Zap, Building2, Plus, Save, Tag, Calendar,
  Briefcase, DollarSign, Type, X, Settings, Sparkles,
} from "lucide-react";

const planIconMap = {
  basic: { icon: Zap, gradient: "from-blue-500 to-indigo-500", bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", accent: "bg-blue-500" },
  teams: { icon: Building2, gradient: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200", accent: "bg-violet-500" },
  enterprise: { icon: Crown, gradient: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-200", accent: "bg-amber-400" },
};
const getConfig = (type) => planIconMap[type?.toLowerCase()] || planIconMap.basic;

const fields = [
  { key: "heading", label: "Heading", placeholder: "e.g. Pro Plan", icon: Tag, type: "text" },
  { key: "price", label: "Price (₹)", placeholder: "e.g. 999", icon: DollarSign, type: "number" },
  { key: "type", label: "Type", placeholder: "e.g. basic, teams", icon: Type, type: "text" },
  { key: "month", label: "Validity (months)", placeholder: "e.g. 6", icon: Calendar, type: "number" },
  { key: "job", label: "Jobs Allowed (0 = unlimited)", placeholder: "e.g. 10", icon: Briefcase, type: "text" },
];

const FormField = ({ field, value, onChange }) => {
  const Icon = field.icon;
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {field.label}
      </label>
      <input
        type={field.type}
        placeholder={field.placeholder}
        value={value}
        onChange={(e) => onChange(field.type === "number" && field.key === "price"
          ? Number(e.target.value)
          : e.target.value
        )}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 placeholder:text-slate-300 outline-none focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-100 transition-all duration-200"
      />
    </div>
  );
};

const Plan = ({ data }) => {
  const [planDataList, setPlanDataList] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [savingIdx, setSavingIdx] = useState(null);
  const newPlan = { heading: "", price: 0, type: "", month: "", job: "" };
  const [newPlanData, setNewPlanData] = useState(newPlan);

  useEffect(() => {
    setPlanDataList(data.map((item) => ({
      id: item._id || "",
      heading: item.heading || "",
      price: item.price || 0,
      type: item.type || "",
      month: item.month || "",
      job: item.job || "",
    })));
  }, [data]);

  const isPlanUnchanged = (index) => {
    const current = planDataList[index];
    const original = data[index];
    return JSON.stringify({
      id: current.id, heading: current.heading, price: current.price,
      type: current.type, month: current.month, job: current.job,
    }) === JSON.stringify({
      id: original._id || original.id, heading: original.heading,
      price: original.price, type: original.type, month: original.month, job: original.job,
    });
  };

  const handleChange = (index, field, value) => {
    const updatedList = [...planDataList];
    updatedList[index][field] = value;
    setPlanDataList(updatedList);
  };

  const handleSubmit = async (e, idx) => {
    e.preventDefault();
    setSavingIdx(idx);
    await fetchPlanUpadateAction(planDataList[idx], "/admin/plan");
    toast.success("Plan updated successfully!");
    setSavingIdx(null);
  };

  const handleNewPlan = async (e) => {
    e.preventDefault();
    await createPlanAction(newPlanData, "/admin/plan");
    toast.success("New plan added successfully!");
    setShowDialog(false);
    setNewPlanData(newPlan);
  };

  const isNewPlanInvalid = !newPlanData.heading || newPlanData.price === 0 || !newPlanData.type;

  return (
    <div className="min-h-screen bg-[#F8F7FF]">

      {/* ─── Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 pt-2 pb-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-6xl mx-auto flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold mb-4 backdrop-blur-sm">
              <Settings className="w-3.5 h-3.5" /> Plan Management
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">Membership Plans</h1>
            <p className="text-slate-400 mt-1.5 text-sm">Edit existing plans or create a new subscription tier</p>
          </div>
          <button
            onClick={() => setShowDialog(true)}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-bold shadow-lg shadow-violet-900/40 hover:opacity-90 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Plan
          </button>
        </div>
      </div>

      {/* ─── Cards ─── */}
      <div className="max-w-6xl mx-auto px-6 mt-5 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {planDataList.map((plan, idx) => {
            const cfg = getConfig(plan.type);
            const PlanIcon = cfg.icon;
            const unchanged = isPlanUnchanged(idx);
            const isSaving = savingIdx === idx;

            return (
              <form key={idx} onSubmit={(e) => handleSubmit(e, idx)}>
                <div className={`bg-white rounded-3xl border ${unchanged ? "border-slate-100" : cfg.border} shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 overflow-hidden h-full flex flex-col`}>

                  {/* Card top accent bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${cfg.gradient}`} />

                  {/* Card header */}
                  <div className="px-6 pt-5 pb-4 flex items-center gap-3 border-b border-slate-50">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm`}>
                      <PlanIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-black capitalize ${cfg.text}`}>{plan.type || "New Plan"}</h3>
                      <p className="text-xs text-slate-400">{plan.heading || "No heading set"}</p>
                    </div>
                    {!unchanged && (
                      <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                        Unsaved
                      </span>
                    )}
                  </div>

                  {/* Fields */}
                  <div className="px-6 py-5 space-y-4 flex-1">
                    {fields.map((field) => (
                      <FormField
                        key={field.key}
                        field={field}
                        value={plan[field.key]}
                        onChange={(val) => handleChange(idx, field.key, val)}
                      />
                    ))}
                  </div>

                  {/* Submit */}
                  <div className="px-6 pb-6">
                    <button
                      type="submit"
                      disabled={unchanged || isSaving}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200
                        ${unchanged
                          ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                          : `bg-gradient-to-r ${cfg.gradient} text-white shadow-lg hover:opacity-90 active:scale-[0.98]`
                        }`}
                    >
                      {isSaving
                        ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</>
                        : <><Save className="w-4 h-4" /> Update Plan</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            );
          })}

          {/* Add new plan card (mobile) */}
          <button
            onClick={() => setShowDialog(true)}
            className="sm:hidden flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8 text-slate-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">Add New Plan</span>
          </button>
        </div>
      </div>

      {/* ─── Dialog ─── */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl border border-slate-100 shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <DialogTitle className="text-white font-black text-lg">New Plan</DialogTitle>
            </div>
            <button onClick={() => setShowDialog(false)} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleNewPlan} className="p-6 space-y-4">
            {fields.map((field) => (
              <FormField
                key={field.key}
                field={field}
                value={newPlanData[field.key]}
                onChange={(val) => setNewPlanData({ ...newPlanData, [field.key]: val })}
              />
            ))}

            <button
              type="submit"
              disabled={isNewPlanInvalid}
              className={`w-full mt-2 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all
                ${isNewPlanInvalid
                  ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-200 hover:opacity-90 active:scale-[0.98]"
                }`}
            >
              <Plus className="w-4 h-4" /> Create Plan
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Plan;