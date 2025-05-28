export default function useValidation(errors, field) {
  const renderErrors = (field) =>
    errors?.[field]?.map((error, index) => (
      <div key={index} className="alert alert-danger" role="alert">
        {error}
      </div>
    ));
  return renderErrors(field);
}
