import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";

import { createQuestionsBulk } from "../../api/questions.api";
import { getTestById } from "../../api/tests.api";
import type { QuestionPayload } from "../../types/question.types";

type QuestionForm = Omit<QuestionPayload, "test_id" | "type" | "subject">;

const createEmptyQuestion = (): QuestionForm => ({
  question: "",
  option1: "",
  option2: "",
  option3: "",
  option4: "",
  correct_option: "option1",
  explanation: "",
  difficulty: "medium",

});

export default function Questions() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questions, setQuestions] = useState<QuestionForm[]>([
    createEmptyQuestion(),
  ]);

  /*
   * Fetch the test details so we can get the subject.
   * The subject is already stored against the test,
   * so the user does not need to enter it again for every question.
   */
  const {
    data: testResponse,
    isLoading: isTestLoading,
  } = useQuery({
    queryKey: ["test", id],
    queryFn: () => getTestById(id!),
    enabled: !!id,
  });

  const subject = testResponse?.data?.subject;

  const mutation = useMutation({
    mutationFn: async (questionList: QuestionForm[]) => {
      if (!id) {
        throw new Error("Test ID is missing.");
      }

      if (!subject) {
        throw new Error(
          "Test subject is missing. Please go back and check the test details."
        );
      }

      const payload: QuestionPayload[] = questionList.map(
        (question) => ({
          type: "mcq",
          subject,
          question: question.question.trim(),

          option1: question.option1.trim(),
          option2: question.option2.trim(),
          option3: question.option3.trim(),
          option4: question.option4.trim(),

          correct_option: question.correct_option,

          test_id: id,

          ...(question.explanation?.trim()
            ? {
                explanation: question.explanation.trim(),
              }
            : {}),

          ...(question.difficulty
            ? {
                difficulty: question.difficulty,
              }
            : {}),

          ...(question.topic?.trim()
            ? {
                topic: question.topic.trim(),
              }
            : {}),

          ...(question.sub_topic?.trim()
            ? {
                sub_topic: question.sub_topic.trim(),
              }
            : {}),

          ...(question.media_url?.trim()
            ? {
                media_url: question.media_url.trim(),
              }
            : {}),
        })
      );

      return createQuestionsBulk({
        questions: payload,
      });
    },

   onSuccess: (response) => {
  if (response.status !== "success") {
    toast.error(
      response.message || "Unable to save questions."
    );
    return;
  }

  toast.success(
    response.message || "Questions added successfully."
  );

  if (id) {
    navigate(`/tests/${id}/preview`);
  }
},

    onError: (error: any) => {
      const apiErrors = error?.response?.data?.errors;

      if (
        Array.isArray(apiErrors) &&
        apiErrors.length > 0
      ) {
        toast.error(
          apiErrors[0]?.msg || "Validation failed."
        );
      } else {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Unable to save questions."
        );
      }
    },
  });

  const updateQuestion = (
    index: number,
    field: keyof QuestionForm,
    value: string
  ) => {
    setQuestions((current) =>
      current.map((question, questionIndex) =>
        questionIndex === index
          ? {
              ...question,
              [field]: value,
            }
          : question
      )
    );
  };

  const addQuestion = () => {
    setQuestions((current) => [
      ...current,
      createEmptyQuestion(),
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error("At least one question is required.");
      return;
    }

    setQuestions((current) =>
      current.filter(
        (_, questionIndex) => questionIndex !== index
      )
    );
  };

  const validateQuestions = () => {
    for (
      let index = 0;
      index < questions.length;
      index++
    ) {
      const question = questions[index];
      const questionNumber = index + 1;

      if (!question.question.trim()) {
        toast.error(
          `Question ${questionNumber}: question text is required.`
        );
        return false;
      }

      if (!question.option1.trim()) {
        toast.error(
          `Question ${questionNumber}: Option 1 is required.`
        );
        return false;
      }

      if (!question.option2.trim()) {
        toast.error(
          `Question ${questionNumber}: Option 2 is required.`
        );
        return false;
      }

      if (!question.option3.trim()) {
        toast.error(
          `Question ${questionNumber}: Option 3 is required.`
        );
        return false;
      }

      if (!question.option4.trim()) {
        toast.error(
          `Question ${questionNumber}: Option 4 is required.`
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = () => {
    if (!id) {
      toast.error("Test ID is missing.");
      return;
    }

    if (!subject) {
      toast.error(
        "Test subject could not be loaded. Please go back and check the test details."
      );
      return;
    }

    if (!validateQuestions()) {
      return;
    }

    mutation.mutate(questions);
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <button
            className="back-link"
            type="button"
            onClick={() =>
              navigate(
                id ? `/tests/${id}/edit` : "/dashboard"
              )
            }
          >
            <ArrowLeft size={17} />
            Back to Test
          </button>

          <span className="eyebrow">
            Question Management
          </span>

          <h1>Add Questions</h1>

          <p>
            Create multiple-choice questions for this test.
          </p>
        </div>
      </div>

      <div className="questions-header">
        <div>
          <h2>Question Builder</h2>

          <p>
            Add the MCQs that will be included in this test.
          </p>

          {subject && (
            <p>
              Subject: <strong>{subject}</strong>
            </p>
          )}
        </div>

        <button
          type="button"
          className="button button--secondary"
          onClick={addQuestion}
          disabled={isTestLoading}
        >
          <Plus size={17} />
          Add Question
        </button>
      </div>

      <div className="questions-list">
        {questions.map((question, index) => (
          <div
            className="card question-card"
            key={index}
          >
            <div className="question-card__header">
              <div>
                <span className="eyebrow">
                  Question {index + 1}
                </span>

                <h3>MCQ</h3>
              </div>

              {questions.length > 1 && (
                <button
                  type="button"
                  className="button button--danger"
                  onClick={() =>
                    removeQuestion(index)
                  }
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              )}
            </div>

            <div className="field field--wide">
              <label htmlFor={`question-${index}`}>
                Question
              </label>

              <textarea
                id={`question-${index}`}
                rows={4}
                placeholder="Enter the question"
                value={question.question}
                onChange={(event) =>
                  updateQuestion(
                    index,
                    "question",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-grid form-grid--two">
              <div className="field">
                <label htmlFor={`option1-${index}`}>
                  Option 1
                </label>

                <input
                  id={`option1-${index}`}
                  placeholder="Enter option 1"
                  value={question.option1}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "option1",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label htmlFor={`option2-${index}`}>
                  Option 2
                </label>

                <input
                  id={`option2-${index}`}
                  placeholder="Enter option 2"
                  value={question.option2}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "option2",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label htmlFor={`option3-${index}`}>
                  Option 3
                </label>

                <input
                  id={`option3-${index}`}
                  placeholder="Enter option 3"
                  value={question.option3}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "option3",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label htmlFor={`option4-${index}`}>
                  Option 4
                </label>

                <input
                  id={`option4-${index}`}
                  placeholder="Enter option 4"
                  value={question.option4}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "option4",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-grid form-grid--three question-meta-grid">
              <div className="field">
                <label htmlFor={`correct-${index}`}>
                  Correct Option
                </label>

                <select
                  id={`correct-${index}`}
                  value={question.correct_option}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "correct_option",
                      event.target.value
                    )
                  }
                >
                  <option value="option1">
                    Option 1
                  </option>

                  <option value="option2">
                    Option 2
                  </option>

                  <option value="option3">
                    Option 3
                  </option>

                  <option value="option4">
                    Option 4
                  </option>
                </select>
              </div>

              <div className="field">
                <label htmlFor={`difficulty-${index}`}>
                  Difficulty
                </label>

                <select
                  id={`difficulty-${index}`}
                  value={question.difficulty}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "difficulty",
                      event.target.value
                    )
                  }
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="difficult">
                    Difficult
                  </option>
                </select>
              </div>

              <div className="field">
                <label htmlFor={`topic-${index}`}>
                  Topic
                </label>

                <input
                  id={`topic-${index}`}
                  placeholder="Optional"
                  value={question.topic}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "topic",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="form-grid form-grid--two question-extra-grid">
              <div className="field">
                <label htmlFor={`sub-topic-${index}`}>
                  Sub-topic
                </label>

                <input
                  id={`sub-topic-${index}`}
                  placeholder="Optional"
                  value={question.sub_topic}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "sub_topic",
                      event.target.value
                    )
                  }
                />
              </div>

              <div className="field">
                <label htmlFor={`media-${index}`}>
                  Media URL
                </label>

                <input
                  id={`media-${index}`}
                  placeholder="Optional"
                  value={question.media_url}
                  onChange={(event) =>
                    updateQuestion(
                      index,
                      "media_url",
                      event.target.value
                    )
                  }
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor={`explanation-${index}`}>
                Explanation
              </label>

              <textarea
                id={`explanation-${index}`}
                rows={3}
                placeholder="Optional explanation for the correct answer"
                value={question.explanation}
                onChange={(event) =>
                  updateQuestion(
                    index,
                    "explanation",
                    event.target.value
                  )
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="button button--secondary"
          onClick={() =>
            navigate(
              id ? `/tests/${id}/edit` : "/dashboard"
            )
          }
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <button
          type="button"
          className="button button--primary"
          disabled={
            mutation.isPending ||
            isTestLoading ||
            !subject
          }
          onClick={handleSubmit}
        >
          {mutation.isPending
            ? "Saving Questions..."
            : isTestLoading
            ? "Loading Test..."
            : "Save Questions"}

          <ArrowRight size={17} />
        </button>
      </div>
    </section>
  );
}