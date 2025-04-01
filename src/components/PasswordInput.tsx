import ErrorMessage from "./ErrorMessage";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const PasswordInput = ({ value, onChange, error }: InputProps) => (
  <div className="form-group">
    <label htmlFor="password">Password:</label>
    <input
      type="password"
      id="password"
      name="password"
      value={value}
      onChange={onChange}
      required
    />
    <ErrorMessage message={error} />
  </div>
);

export default PasswordInput;
