import { FileText, Upload, X, Eye, ArrowRight } from "lucide-react";

export default function CommonFrom({
  action,
  buttonText,
  isBtnDisabled,
  btnType,
  formControls,
  formData,
  setFormData,
  handleFileChange,
  uploadFile,
  fileStatus,
  file,
}) {
  const renderInputByCommponentType = (getCurrentControl) => {
    switch (getCurrentControl.componentType) {
      case "input":
        return (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={getCurrentControl.name}
              className="text-xs font-semibold text-gray-900 uppercase tracking-wider"
            >
              {getCurrentControl.label}
            </label>
            <input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-00 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 outline-none transition-all duration-200 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        );

      case "file":
        return (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-900 uppercase tracking-wider">
              {getCurrentControl.label}
            </label>

            {/* Drop zone */}
            <label
              htmlFor={getCurrentControl.name}
              className="flex items-center gap-4 p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-300 hover:bg-violet-50/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-violet-200">
                <FileText className="w-5 h-5 text-gray-600 group-hover:text-violet-400 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 group-hover:text-gray-800">
                  {file ? file.name : "Choose a PDF file"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">PDF up to 10MB</p>
              </div>
              <input
                onChange={handleFileChange}
                id={getCurrentControl.name}
                type="file"
                className="hidden"
              />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); uploadFile(e); }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  fileStatus
                    ? "bg-red-50 border border-red-200 text-red-500 hover:bg-red-100"
                    : "bg-violet-600 text-white hover:bg-violet-500"
                }`}
              >
                {fileStatus ? (
                  <><X className="w-3.5 h-3.5" /> Remove</>
                ) : (
                  <><Upload className="w-3.5 h-3.5" /> {file === null ? "Update" : "Upload"}</>
                )}
              </button>
            </label>

            {/* Uploaded file info */}
            {formData[getCurrentControl.name]?.path && (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-sm text-emerald-700 font-medium truncate">
                    {formData[getCurrentControl.name]?.path?.split("/").pop().replace(/_[^/]+$/, "")}
                  </span>
                </div>
                {formData[getCurrentControl.name]?.publicPath && (
                  <button
                    type="button"
                    onClick={() => window.open(formData[getCurrentControl.name]?.publicPath, "_blank")}
                    className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 ml-3"
                  >
                    <Eye className="w-3.5 h-3.5" /> View
                  </button>
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor={getCurrentControl.name}
              className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
              {getCurrentControl.label}
            </label>
            <input
              type="text"
              disabled={getCurrentControl.disabled}
              placeholder={getCurrentControl.placeholder}
              name={getCurrentControl.name}
              id={getCurrentControl.name}
              value={formData[getCurrentControl.name]}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-300 outline-none transition-all duration-200 focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
            />
          </div>
        );
    }
  };

  return (
    <form action={action} className="space-y-5">
      {formControls.map((control, idx) => (
        <div key={idx}>{renderInputByCommponentType(control)}</div>
      ))}

      <div className="pt-2">
        <button
          type={btnType || "submit"}
          disabled={isBtnDisabled}
          className="w-full flex items-center justify-center gap-2 h-12 px-6 bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-violet-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.98]"
        >
          {buttonText} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}