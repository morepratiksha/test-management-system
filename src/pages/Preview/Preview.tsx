import { ArrowLeft, Edit3 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getTestById, publishTest } from "../../api/tests.api";
import { fetchQuestionsBulk } from "../../api/questions.api";
import { useState } from "react";
import { toast } from "sonner";

export default function Preview() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [publishing, setPublishing] = useState(false);
  const testQuery = useQuery({ queryKey: ["test", id], queryFn: () => getTestById(id as string), enabled: Boolean(id) });
  const test = testQuery.data?.data;
 const questionIds = [...new Set(test?.questions ?? [])];

const questionsQuery = useQuery({
  queryKey: ["questions", questionIds],
  queryFn: () =>
    fetchQuestionsBulk({
      question_ids: questionIds,
    }),
  enabled: questionIds.length > 0,
});

  async function handlePublish() {
    if (!id) return;
    try {
      setPublishing(true);
      await publishTest(id);
      toast.success("Test published successfully");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Unable to publish test.");
    } finally { setPublishing(false); }
  }
  

  return <section>
    <div className="page-heading"><div>
      <button className="back-link" onClick={() => navigate(id ? `/tests/${id}/questions` : "/dashboard")}><ArrowLeft size={17}/>Back</button>
      <span className="eyebrow">Final Review</span><h1>Preview & Publish</h1><p>Review the test before publishing it live.</p>
    </div>
    <div className="page-heading__actions"><button className="button button--secondary" onClick={() => navigate(`/tests/${id}/edit`)}><Edit3 size={17}/>Edit Test</button><button className="button button--primary" disabled={!test || publishing} onClick={handlePublish}>{publishing ? "Publishing..." : "Publish Test"}</button></div>
    </div>
    {testQuery.isLoading ? <div className="card state-block">Loading preview...</div> :
     testQuery.isError || !test ? <div className="card state-block state-block--error">Unable to load this test.</div> :
     <><div className="card preview-summary"><div><span className="eyebrow">Test</span><h2>{test.name}</h2><p>{test.subject || "Subject not available"}</p></div><div className="preview-summary__stats"><div><span>Questions</span><strong>{test.total_questions ?? test.questions?.length ?? "—"}</strong></div><div><span>Duration</span><strong>{test.total_time ?? "—"} min</strong></div><div><span>Total Marks</span><strong>{test.total_marks ?? "—"}</strong></div></div></div>
     <div className="card"><div className="section-title"><h2>Questions</h2><p>{questionsQuery.isLoading ? "Loading questions..." : `${questionsQuery.data?.data?.length ?? 0} questions loaded`}</p></div>
     {!test.questions?.length ? <div className="state-block">No question IDs are available on this test yet.</div> :
     <div className="question-list">{(questionsQuery.data?.data ?? []).map((q, i) => <article className="question-card" key={q.id}><div className="question-card__number">Q{i + 1}</div><div><h3>{q.question}</h3><div className="option-grid">{([1,2,3,4] as const).map(n => { const key = `option${n}` as "option1"|"option2"|"option3"|"option4"; return <div className={`option ${q.correct_option === key ? "option--correct" : ""}`} key={key}>{q[key]}</div>; })}</div></div></article>)}</div>}
     </div></>}
  </section>;
}
