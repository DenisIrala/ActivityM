import ErrorMessage from "./ErrorMessage";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const UsernameInput = ({ value, onChange, error }: InputProps) => (
  <div className="form-group">
    <label htmlFor="username">Username:</label>
    <input
      type="text"
      id="username"
      name="username"
      value={value}
      onChange={onChange}
      required
    />
    <ErrorMessage message={error} />
  </div>
);

export default UsernameInput;
