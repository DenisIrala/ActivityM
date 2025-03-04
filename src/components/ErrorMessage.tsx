const ErrorMessage = ({ message }: { message?: string }) => {
  return (
    <p className={`error-message ${message ? "active" : ""}`}>{message}</p>
  );
};

export default ErrorMessage;
