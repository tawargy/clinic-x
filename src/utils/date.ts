export const formatDate = (date: Date | undefined) => {
  if (!date) return "";

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getAge = (dob: Date | undefined) => {
  if (!dob) return "";
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();
  return age.toString();
};
