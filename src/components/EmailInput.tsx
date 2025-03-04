import ErrorMessage from "./ErrorMessage";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

const EmailInput = ({ value, onChange, error }: InputProps) => (
  <div className="form-group">
    <label htmlFor="email">Email Address</label>
    <input
      type="email"
      id="email"
      name="email"
      value={value}
      onChange={onChange}
      required
    />
    <ErrorMessage message={error} />
  </div>
);

export default EmailInput;
