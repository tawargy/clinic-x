import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto mt-8 text-center">
      <h3 className="text-red-600 text-5xl font-bold ">Page Not Found</h3>
      <p className="text-3xl m-4">4o4</p>
      <button
        className="text-green-600"
        type="button"
        onClick={() => navigate("/", { replace: true })}
      >
        Home
      </button>
    </div>
  );
}

export default Error;
