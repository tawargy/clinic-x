import { useCallback } from "react";
function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

const debouncedSearch = useCallback(
  debounce((input: string) => {
    addPatient(input);
  }, 500),
  [],
);
// const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const input = e.target.value;
//   if (input.length < 1) {
//     setSearchResult(undefined);
//     return;
//   }
//   debouncedSearch(input);
// };

// const onBlurHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
//   setTimeout(() => {
//     setSearchResult(undefined);
//     e.target.value = "";
//   }, 200);
// };
