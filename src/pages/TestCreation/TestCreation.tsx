import { ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createTest } from "../../api/tests.api";
import {
  getSubjects,
  getTopicsBySubject,
} from "../../api/taxonomy.api";

const schema = z.object({
  name: z.string().trim().min(1, "Test name is required"),

  type: z.string().min(1, "Test type is required"),

  subject: z.string().min(1, "Subject is required"),

  topics: z
    .array(z.string())
    .min(1, "At least one topic is required"),

  sub_topics: z.array(z.string()).default([]),

  correct_marks: z.coerce.number(),

  wrong_marks: z.coerce.number(),

  unattempt_marks: z.coerce.number(),

  difficulty: z.string().min(1, "Difficulty is required"),

  total_time: z.coerce.number().positive(),

  total_marks: z.coerce.number().nonnegative(),

  total_questions: z.coerce.number().positive(),
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

export default function TestCreation() {
  const navigate = useNavigate();

  const subjectsQuery = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),


    
    defaultValues: {
      name: "",
      type: "chapterwise",
      subject: "",
      topics: [],
      sub_topics: [],
      correct_marks: 4,
      wrong_marks: -1,
      unattempt_marks: 0,
      difficulty: "medium",
      total_time: 60,
      total_marks: 0,
      total_questions: 1,
    },
  });

  const selectedSubject = watch("subject");
  const selectedTopics = watch("topics");

  const topicsQuery = useQuery({
    queryKey: ["topics", selectedSubject],
    queryFn: () => getTopicsBySubject(selectedSubject),
    enabled: !!selectedSubject,
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      createTest({
        ...values,
        status: "draft",
      }),

    onSuccess: (response) => {
    if (response.status !== "success" || !response.data?.id) {
  return toast.error(
    response.message || "Unable to create test."
  );
}

      toast.success("Test created successfully");

      navigate(`/tests/${response.data.id}/questions`);
    },

    onError: (error: any) => {
      const apiErrors = error?.response?.data?.errors;

      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        toast.error(apiErrors[0]?.msg || "Validation failed.");
      } else {
        toast.error(
          error?.response?.data?.message ||
            "Unable to save the test."
        );
      }
    },
  });

  const handleSubjectChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subjectId = event.target.value;

    setValue("subject", subjectId);

    // Clear topics when subject changes because
    // previously selected topics may belong to another subject.
    setValue("topics", []);
    setValue("sub_topics", []);
  };

  const handleTopicChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const options = Array.from(
      event.target.selectedOptions
    );

    const topicIds = options.map((option) => option.value);

    setValue("topics", topicIds, {
      shouldValidate: true,
    });

    // Clear sub-topics when topics change.
    setValue("sub_topics", []);
  };

  return (
    <section>
      <div className="page-heading">
        <div>
          <button
            className="back-link"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft size={17} />
            Back to Tests
          </button>

          <span className="eyebrow">Test Management</span>

          <h1>Create Test</h1>

          <p>
            Set up the test details before adding questions.
          </p>
        </div>
      </div>

      <form
        className="card form-card"
        onSubmit={handleSubmit((values) =>
          mutation.mutate(values)
        )}
      >
        <div className="section-title">
          <h2>Test Details</h2>

          <p>
            Enter the information required by the documented
            test API.
          </p>
        </div>

        <div className="form-grid">
          {/* Test Name */}
          <div className="field field--wide">
            <label htmlFor="name">Test Name</label>

            <input
              id="name"
              placeholder="Enter test name"
              {...register("name")}
            />

            {errors.name && (
              <span className="field__error">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Test Type */}
          <div className="field">
            <label htmlFor="type">Test Type</label>

            <select id="type" {...register("type")}>
              <option value="chapterwise">
                Chapter Wise
              </option>

              <option value="pyq">PYQ</option>

              <option value="mock">Mock Test</option>
            </select>

            {errors.type && (
              <span className="field__error">
                {errors.type.message}
              </span>
            )}
          </div>

          {/* Subject */}
          <div className="field">
            <label htmlFor="subject">Subject</label>

            <select
              id="subject"
              value={selectedSubject}
              onChange={handleSubjectChange}
            >
              <option value="">Select subject</option>

              {(subjectsQuery.data?.data ?? []).map(
                (subject) => (
                  <option
                    key={subject.id}
                    value={subject.id}
                  >
                    {subject.name}
                  </option>
                )
              )}
            </select>

            {subjectsQuery.isLoading && (
              <span className="field__hint">
                Loading subjects...
              </span>
            )}

            {errors.subject && (
              <span className="field__error">
                {errors.subject.message}
              </span>
            )}
          </div>

          {/* Topics */}
          <div className="field field--wide">
            <label htmlFor="topics">Topics</label>

            <select
              id="topics"
              multiple
              value={selectedTopics}
              onChange={handleTopicChange}
              disabled={
                !selectedSubject ||
                topicsQuery.isLoading
              }
              size={Math.min(
                Math.max(
                  topicsQuery.data?.data?.length ?? 3,
                  3
                ),
                6
              )}
            >
              {!selectedSubject && (
                <option value="" disabled>
                  Select a subject first
                </option>
              )}

              {selectedSubject &&
                topicsQuery.isLoading && (
                  <option value="" disabled>
                    Loading topics...
                  </option>
                )}

              {selectedSubject &&
                !topicsQuery.isLoading &&
                (topicsQuery.data?.data ?? []).map(
                  (topic) => (
                    <option
                      key={topic.id}
                      value={topic.id}
                    >
                      {topic.name}
                    </option>
                  )
                )}
            </select>

            {selectedSubject &&
              !topicsQuery.isLoading &&
              (topicsQuery.data?.data ?? []).length === 0 && (
                <span className="field__hint">
                  No topics available for this subject.
                </span>
              )}

            <span className="field__hint">
              Hold Ctrl (Windows) or Command (Mac) to select
              multiple topics.
            </span>

            {errors.topics && (
              <span className="field__error">
                {errors.topics.message}
              </span>
            )}
          </div>

          {/* Difficulty */}
          <div className="field">
            <label htmlFor="difficulty">
              Difficulty
            </label>

            <select
              id="difficulty"
              {...register("difficulty")}
            >
              <option value="easy">Easy</option>

              <option value="medium">Medium</option>

              <option value="difficult">
                Difficult
              </option>
            </select>

            {errors.difficulty && (
              <span className="field__error">
                {errors.difficulty.message}
              </span>
            )}
          </div>

          {/* Total Time */}
          <div className="field">
            <label htmlFor="total_time">
              Total Time (minutes)
            </label>

            <input
              id="total_time"
              type="number"
              min="1"
              {...register("total_time")}
            />

            {errors.total_time && (
              <span className="field__error">
                {errors.total_time.message}
              </span>
            )}
          </div>

          {/* Total Questions */}
          <div className="field">
            <label htmlFor="total_questions">
              Total Questions
            </label>

            <input
              id="total_questions"
              type="number"
              min="1"
              {...register("total_questions")}
            />

            {errors.total_questions && (
              <span className="field__error">
                {errors.total_questions.message}
              </span>
            )}
          </div>
        </div>

        {/* Marking Scheme */}
        <div className="section-title section-title--spaced">
          <h2>Marking Scheme</h2>

          <p>
            Configure correct, wrong and unattempted marks.
          </p>
        </div>

        <div className="form-grid form-grid--three">
          <div className="field">
            <label htmlFor="correct_marks">
              Correct Marks
            </label>

            <input
              id="correct_marks"
              type="number"
              step="0.01"
              {...register("correct_marks")}
            />
          </div>

          <div className="field">
            <label htmlFor="wrong_marks">
              Wrong Marks
            </label>

            <input
              id="wrong_marks"
              type="number"
              step="0.01"
              {...register("wrong_marks")}
            />
          </div>

          <div className="field">
            <label htmlFor="unattempt_marks">
              Unattempted Marks
            </label>

            <input
              id="unattempt_marks"
              type="number"
              step="0.01"
              {...register("unattempt_marks")}
            />
          </div>

          <div className="field">
            <label htmlFor="total_marks">
              Total Marks
            </label>

            <input
              id="total_marks"
              type="number"
              step="0.01"
              {...register("total_marks")}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button button--secondary"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </button>

          <button
            className="button button--primary"
            type="submit"
            disabled={
              isSubmitting || mutation.isPending
            }
          >
            Next: Add Questions

            <ArrowRight size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}