interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  error?: string;
}

export default function InputField({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error
}: InputFieldProps) {
  return (
    <div className="mb-4">
      <label 
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1 bg-blue-950"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2
          ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}