import ErrorMessage from "./ErrorMessage";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const ConfirmPasswordInput = ({ value, onChange, error }: InputProps) => (
  <div className="form-group">
    <label htmlFor="confirmPassword">Confirm Password</label>
    <input
      type="password"
      id="confirmPassword"
      name="confirmPassword"
      value={value}
      onChange={onChange}
      required
    />
    <ErrorMessage message={error} />
  </div>
);

export default ConfirmPasswordInput;
