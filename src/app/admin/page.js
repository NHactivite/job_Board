import {
  Briefcase,
  Users,
  FileText,
  DollarSign,
  Crown,
  ArrowUpRight,
  LayoutDashboard,
  Settings,
  Zap,
  Building2,
  Star,
} from "lucide-react";
import Link from "next/link";
import {
  fetchAllProfileAction,
  fetchJobApplicationAction,
  fetchJobsForCandidateAction,
  fetchPlanAction,
  getMembershipUsers,
} from "@/actions";

export default async function AdminDashboardPage() {
  const TotalJobs = await fetchJobsForCandidateAction({});
  const TotalUsers = await fetchAllProfileAction({});
  const TotalApplications = await fetchJobApplicationAction({});
  const TotalRevenu = await getMembershipUsers({});
  const AllPlan = await fetchPlanAction();

  const clculateRevenue = (allPlan, key) => {
    const membershipTypes = key.map((r) => r.memberShipType);
    return allPlan.reduce((acc, item) => {
      if (membershipTypes.includes(item.type)) return acc + item.price;
      return acc;
    }, 0);
  };

  const totalRevenu = clculateRevenue(AllPlan, TotalRevenu);

  const planIconMap = {
    basic: { icon: Zap, color: "from-blue-500 to-indigo-500", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    teams: { icon: Building2, color: "from-violet-500 to-purple-600", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
    enterprise: { icon: Crown, color: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-100" },
  };

  const getPlanConfig = (type) =>
    planIconMap[type?.toLowerCase()] || planIconMap.basic;

  const statCards = [
    {
      label: "Total Jobs",
      value: TotalJobs.length,
      icon: Briefcase,
      gradient: "from-violet-500 to-indigo-600",
      bg: "bg-violet-50",
      text: "text-violet-600",
      change: "+12% this month",
    },
    {
      label: "Total Users",
      value: TotalUsers.length,
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      text: "text-blue-600",
      change: "+8% this month",
    },
    {
      label: "Applications",
      value: TotalApplications.length,
      icon: FileText,
      gradient: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      change: "+23% this month",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenu.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
      text: "text-amber-600",
      change: "+5% this month",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F7FF]">

      {/* ─── Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-8 pt-5 pb-5 mb-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15)_0%,transparent_60%)]" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 w-72 h-32 bg-violet-500/10 blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto flex items-start justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/70 text-xs font-semibold mb-4 backdrop-blur-sm">
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Panel
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm max-w-md">
              Overview of platform performance, users, and revenue
            </p>
          </div>

          <Link
            href="/admin/plan"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm"
          >
            <Settings className="w-4 h-4" /> Manage Plans
          </Link>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 pb-20 space-y-8">

        {/* ─── Stat Cards ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map(({ label, value, icon: Icon, gradient, bg, text, change }) => (
            <div
              key={label}
              className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-100 transition-all duration-300 overflow-hidden group"
            >
              <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
                    <ArrowUpRight className="w-3 h-3" />
                    {change.split(" ")[0]}
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
                <div className="text-sm text-slate-400 font-medium">{label}</div>
                <div className="text-xs text-slate-300 mt-1">{change}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Plans Section ─── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Membership Plans</h2>
              <p className="text-sm text-slate-400 mt-0.5">Active subscription tiers and pricing</p>
            </div>
            <Star className="w-5 h-5 text-amber-400" />
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {AllPlan.map((item) => {
                const cfg = getPlanConfig(item.type);
                const PlanIcon = cfg.icon;
                return (
                  <div
                    key={item.id}
                    className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-5 flex items-center justify-between group hover:shadow-md transition-all duration-200`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cfg.color} flex items-center justify-center shadow-sm`}>
                        <PlanIcon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold capitalize ${cfg.text}`}>{item.type}</p>
                        <p className="text-xs text-slate-400">{item.month} {Number(item.month) === 1 ? "month" : "months"} validity</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-slate-900">₹{item.price}</p>
                      <p className="text-xs text-slate-400">per year</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link href="/admin/plan">
              <button className="w-full py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-500 text-sm font-semibold hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all duration-200 flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" /> Manage All Plans
              </button>
            </Link>
          </div>
        </div>

        {/* ─── Quick Actions ─── */}
       
      </div>
    </div>
  );
}