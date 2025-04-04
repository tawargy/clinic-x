import drug from "../druglist.json";

export function getDrug(searchTerm: string) {
  if (!searchTerm) return [];

  const filteredDrugs = drug.filter((d) =>
    d.name.toLowerCase().startsWith(searchTerm.toLowerCase()),
  );
  return filteredDrugs;
}
