const planMap = {
    
    "The OSCE plan": { 1: "osce-plan-1",3: "osce-plan-3", 12: "osce-plan-12" },
    "The Full Package": { 1: "full-package-1", 3: "full-package-3", 12: "full-package-12" }, // ✅ Added missing comma
    "The Pass Guarantee": { 12: "pass-guarantee-12" }
};

const PlanSlug = (plan, mode) => planMap[plan]?.[mode] || "invalid-plan";

export default PlanSlug;
