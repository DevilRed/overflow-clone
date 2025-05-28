import { Link } from "react-router-dom";

export const UserQuestions = ({ questions }) => {
  return (
    <div className="col-md-9">
      <table className="table table-responsive">
        <caption>List of asked questions</caption>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Published</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question, index) => (
            <tr key={index}>
              <td>{(index += 1)}</td>
              <td>
                <Link
                  className="text-decoration-none"
                  to={`/question/${question.slug}`}
                >
                  {question.title}
                </Link>
              </td>
              <td>{question.created_at}</td>
              <td>
                <Link
                  className="btn btn-sm btn-warning"
                  to={`/edit/question/${question.slug}`}
                >
                  <i className="bi bi-pen"></i>
                </Link>
                <button
                  className="btn btn-sm btn-danger ms-2"
                  onClick={() => console.log("deleting")}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
