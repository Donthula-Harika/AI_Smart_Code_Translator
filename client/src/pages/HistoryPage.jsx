import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import HistoryList from "../components/HistoryList.jsx";
import CodeEditor from "../components/CodeEditor.jsx";
import {
  getHistory,
  deleteHistoryItem,
  clearHistory,
} from "../services/historyService.js";
import "../styles/history.css";

function HistoryPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const itemsPerPage = 8;

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(currentPage, itemsPerPage);
      setEntries(data.entries);
      setTotalPages(data.totalPages);
      setTotalEntries(data.totalEntries);
    } catch {
      toast.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [currentPage]);

  const handleDelete = async (id) => {
    try {
      await deleteHistoryItem(id);
      toast.success("Deleted");
      if (selectedEntry?._id === id) setSelectedEntry(null);
      fetchHistory();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Delete all history?")) return;
    try {
      const result = await clearHistory();
      toast.success(`Cleared ${result.deletedCount} entries`);
      setEntries([]);
      setTotalEntries(0);
      setTotalPages(1);
      setSelectedEntry(null);
      setCurrentPage(1);
    } catch {
      toast.error("Failed to clear");
    }
  };

  const renderOutput = () => {
    if (selectedEntry.type === "translate") {
      return <><span className="detail-lang-badge">Target: {selectedEntry.targetLanguage}</span><pre className="detail-code-block">{selectedEntry.output?.translatedCode}</pre></>;
    }
    if (selectedEntry.type === "analyze") {
      return <><div className="detail-complexity-row"><div className="detail-complexity-card"><div className="detail-complexity-label">Time</div><div className="detail-complexity-value">{selectedEntry.output?.timeComplexity}</div></div><div className="detail-complexity-card"><div className="detail-complexity-label">Space</div><div className="detail-complexity-value">{selectedEntry.output?.spaceComplexity}</div></div></div>{selectedEntry.output?.explanation && <p className="detail-text">{selectedEntry.output.explanation}</p>}</>;
    }
    if (selectedEntry.type === "optimize") {
      return <><pre className="detail-code-block">{selectedEntry.output?.optimizedCode}</pre>{selectedEntry.output?.suggestions && <p className="detail-text detail-text-top">{selectedEntry.output.suggestions}</p>}</>;
    }
    return <p className="detail-text">{selectedEntry.output?.explanation}</p>;
  };

  return <div className="history-page"><aside className="history-sidebar"><header className="history-sidebar-header"><div><span className="history-title">History</span><span className="history-count">{totalEntries}</span></div><button className="clear-all-btn" onClick={handleClearAll} disabled={!totalEntries}>Clear all</button></header><div className="history-list-container">{loading ? <div className="history-empty">Loading...</div> : <HistoryList entries={entries} onView={setSelectedEntry} onDelete={handleDelete} />}</div>{totalPages > 1 && <nav className="history-pagination"><button className="page-btn" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1}>Prev</button>{Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => <button key={page} className={`page-btn ${currentPage === page ? "active" : ""}`} onClick={() => setCurrentPage(page)}>{page}</button>)}<button className="page-btn" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages}>Next</button></nav>}</aside><main className="history-detail">{selectedEntry ? <><header className="history-detail-header"><div className="detail-header-left"><span className="detail-type">{selectedEntry.type}</span><span className="detail-date">{new Date(selectedEntry.createdAt).toLocaleString()}</span></div><button className="detail-close-btn" onClick={() => setSelectedEntry(null)}>Close</button></header><div className="history-detail-content"><section className="detail-section"><div className="detail-section-label">Source ({selectedEntry.sourceLanguage})</div><div className="detail-editor-container"><CodeEditor code={selectedEntry.inputCode || ""} onChange={() => {}} language={selectedEntry.sourceLanguage} readOnly /></div></section><section className="detail-section"><div className="detail-section-label">Result</div><div className="detail-output-box">{renderOutput()}</div></section></div></> : <div className="history-detail-empty">Select an entry to view its details</div>}</main></div>;
}

export default HistoryPage;
