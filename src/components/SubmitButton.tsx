type SubmitButtonProps = {
  text: string;
  disabled: boolean;
};

const SubmitButton = ({ text, disabled }: SubmitButtonProps) => {
  return (
    <button type="submit" className="submit-button" disabled={disabled}>
      {text}
    </button>
  );
};

export default SubmitButton;
