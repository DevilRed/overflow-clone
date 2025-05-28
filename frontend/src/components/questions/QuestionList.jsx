import { useSelector } from "react-redux";
import { QuestionListItem } from "./QuestionListItem";

export const QuestionList = ({ fetchQuestionsPage }) => {
  const { questions } = useSelector((state) => state.questions);
  const renderPaginationLinks = () => (
    <ul className="pagination">
      {questions?.meta?.links?.map((link, index) => (
        <li key={index} className={`page-item ${!link.url ? "disabled" : ""}`}>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (link.url) {
                fetchQuestionsPage(link.url);
              }
            }}
            className={`page-link ${link.active ? "active" : ""}`}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
  return (
    <>
      {questions?.data?.map((question) => (
        <QuestionListItem key={question.id} question={question} />
      ))}
      {/* pagination links with label counting items */}
      <div className="mt-4 d-flex justify-content-between">
        {questions?.meta && (
          <div className="text-muted">
            Showing {questions.meta.from} to {questions.meta.to} of{" "}
            {questions.meta.total} results
          </div>
        )}
        <div>{renderPaginationLinks()}</div>
      </div>
    </>
  );
};
