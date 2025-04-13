function InfoCard({ title, content, icon, darkMode }) {
  if (!content) return null;

  return (
    <div
      className={`${darkMode ? "bg-gray-700" : "bg-white"} rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200`}
    >
      <h3
        className={`text-sm font-medium mb-3 flex items-center gap-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
      >
        {icon}
        {title}
      </h3>
      <p
        className={`${darkMode ? "text-gray-300" : "text-gray-700"} whitespace-pre-wrap text-sm leading-relaxed`}
      >
        {content || `No ${title.toLowerCase()} information available`}
      </p>
    </div>
  );
}
export default InfoCard;
