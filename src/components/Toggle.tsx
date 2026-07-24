interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

export function Toggle({ checked, onChange, label, description, icon }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
        checked
          ? "border-emerald-500 bg-emerald-50"
          : "border-stone-200 bg-white"
      }`}
    >
      {icon && (
        <div
          className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            checked ? "bg-emerald-500 text-white" : "bg-stone-100 text-stone-500"
          }`}
        >
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-stone-800">{label}</div>
        {description && (
          <div className="text-xs text-stone-500 mt-0.5">{description}</div>
        )}
      </div>
      <div
        className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${
          checked ? "bg-emerald-500" : "bg-stone-300"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </div>
    </button>
  );
}
