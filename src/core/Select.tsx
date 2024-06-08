export interface SelectProps {
  options: {
    value: string;
    label: string;
  }[];
  id: string;
  label: string;
  onChange: (value: string) => void;
}
export const Select = (props: SelectProps) => {
  const { options, id, label, onChange } = props;

  return (
    <div>
      <label htmlFor={id} className="block text-sm pb-1">
        {label}
      </label>
      <select
        id={id}
        className="border text-sm block w-full p-1"
        onChange={(event) => onChange(event.currentTarget.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
