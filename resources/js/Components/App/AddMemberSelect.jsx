import React from "react";
import Select from "react-select";

export default function AddMemberSelect({ members, selectedMembers, setSelectedMembers }) {
  const options = members.map((m) => ({
    value: m.id,
    label: m.name,
  }));

  return (
    <div className="mt-4">
      <Select
        isMulti
        options={options}
        value={options.filter((opt) =>
            selectedMembers.includes(opt.value)
        )}
        onChange={(selected) =>
            setSelectedMembers(selected.map((s) => s.value))
        }
        placeholder="Search and select members..."
        styles={{
            control: (base, state) => ({
            ...base,
            backgroundColor: "#1f2937",
            borderColor: state.isFocused ? "#6366f1" : "#374151",
            boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
            "&:hover": { borderColor: "#6366f1" },
            }),
            input: (base) => ({
            ...base,
            color: "white", 
            }),
            menu: (base) => ({
            ...base,
            backgroundColor: "#111827",
            color: "white",
            }),
            option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
                ? "#6366f1"
                : state.isFocused
                ? "#374151"
                : "transparent",
            color: "white",
            cursor: "pointer",
            }),
            multiValue: (base) => ({
            ...base,
            backgroundColor: "#374151",
            color: "white",
            }),
            multiValueLabel: (base) => ({
            ...base,
            color: "white",
            }),
            multiValueRemove: (base) => ({
            ...base,
            color: "#f87171",
            "&:hover": { backgroundColor: "#b91c1c", color: "white" },
            }),
            placeholder: (base) => ({
            ...base,
            color: "#9ca3af",
            }),
            singleValue: (base) => ({
            ...base,
            color: "white",
            }),
        }}
        />

    </div>
  );
}
