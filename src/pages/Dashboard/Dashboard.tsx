import { Plus, RefreshCw, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTests } from "../../api/tests.api";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["tests"], queryFn: getTests });
  const tests = query.data?.data ?? [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tests;
    return tests.filter(t =>
      t.name?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.status?.toLowerCase().includes(q)
    );
  }, [tests, search]);

  const draft = tests.filter(t => t.status === "draft").length;
  const live = tests.filter(t => t.status === "live").length;

  return (
    <section>
      <div className="page-heading">
        <div><span className="eyebrow">Workspace</span><h1>Tests</h1><p>Manage your assessments, questions and publishing status.</p></div>
        <button className="button button--primary" onClick={() => navigate("/tests/create")}><Plus size={18}/>Create New Test</button>
      </div>
      <div className="stats-grid">
        <div className="stat-card"><span>Total Tests</span><strong>{tests.length}</strong></div>
        <div className="stat-card"><span>Draft</span><strong>{draft}</strong></div>
        <div className="stat-card"><span>Live</span><strong>{live}</strong></div>
      </div>
      <div className="card">
        <div className="card__toolbar">
          <div className="search-field"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tests..."/></div>
          <button className="button button--secondary" onClick={() => query.refetch()} disabled={query.isFetching}><RefreshCw size={17}/>{query.isFetching ? "Refreshing..." : "Refresh"}</button>
        </div>
        {query.isLoading ? <div className="state-block">Loading tests...</div> :
         query.isError ? <div className="state-block state-block--error">Unable to load tests. Check the API connection.</div> :
         filtered.length === 0 ? <div className="state-block">{search ? "No tests match your search." : "No tests found."}</div> :
         <div className="table-wrapper"><table className="data-table"><thead><tr><th>Test Name</th><th>Subject</th><th>Questions</th><th>Status</th><th>Created</th><th>Action</th></tr></thead>
         <tbody>{filtered.map(test => <tr key={test.id}>
           <td><strong>{test.name}</strong></td><td>{test.subject || "—"}</td><td>{test.total_questions ?? test.questions?.length ?? "—"}</td>
           <td><span className={`status ${test.status === "live" ? "status--live" : "status--draft"}`}>{test.status || "draft"}</span></td>
           <td>{formatDate(test.created_at)}</td>
           <td><button className="table-action" onClick={() => navigate(`/tests/${test.id}/edit`)}>Edit</button><button className="table-action" onClick={() => navigate(`/tests/${test.id}/preview`)}>View</button></td>
         </tr>)}</tbody></table></div>}
      </div>
    </section>
  );
}
