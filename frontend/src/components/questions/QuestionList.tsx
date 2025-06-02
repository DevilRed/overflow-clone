import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { PaginationLink, QuestionsData } from "../../types";
import { QuestionListItem } from "./QuestionListItem";


type QuestionListProps = {
  fetchQuestionsPage: (url: string) => void;
};

export const QuestionList = ({ fetchQuestionsPage }: QuestionListProps) => {
  const { questions } = useSelector((state: RootState) => ({
    questions: state.questions.questions as QuestionsData | undefined
  }));

  const renderPaginationLinks = () => (
    <ul className="pagination">
      {questions?.meta?.links?.map((link: PaginationLink, index: number) => (
        <li key={index} className={`page-item ${!link.url ? "disabled" : ""}`}>
          <button
            onClick={(e) => {
              e.preventDefault();
              if (link.url) {
                fetchQuestionsPage(link.url);
              }
            }}
            className={`page-link ${link.active ? "active" : ""}`}
            disabled={!link.url}
          >
            {link.label}
          </button>
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
