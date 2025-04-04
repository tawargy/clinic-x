export const followupNames = (name: string) => {
  if (name === "new") return "New";
  if (name === "followup_1") return "First follow up";
  if (name === "followup_2") return "Second follow up";
  if (name === "followup_3") return "Third follow up";
  return name.replace("_", " ");
};
