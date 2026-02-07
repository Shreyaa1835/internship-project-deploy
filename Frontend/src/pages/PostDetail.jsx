import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { 
  Home, Command, FileText, Settings, 
  Activity, Zap, Trash2, Calendar, Download, X 
} from "lucide-react";
import BlogPostView from "../components/BlogPostView";
import ContentEditor from "../components/ContentEditor";
import PlagiarismChecker from "../components/PlagiarismChecker";
import DiffViewer from "../components/DiffViewer";

import SchedulePicker from "../components/SchedulePicker";
import ExportButton from "../components/ExportButton";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [editedTopic, setEditedTopic] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); 
  const [plagResult, setPlagResult] = useState(null);
  const [isPlagLoading, setIsPlagLoading] = useState(false);
  const [pendingContent, setPendingContent] = useState(null); 
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pinnedPanel, setPinnedPanel] = useState(null); 

  useEffect(() => {
    if (plagResult || isPlagLoading || pendingContent || pinnedPanel) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [plagResult, isPlagLoading, pendingContent, pinnedPanel]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) return;
        const token = await user.getIdToken();
        const res = await fetch(`http://localhost:8000/api/blog-posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Sync_Failure");
        const data = await res.json();
        setPost(data);
        setEditedContent(data.content || "");
        setEditedTopic(data.topic || ""); 
      } catch (err) { 
        console.error("Backend Sync Error:", err.message); 
      }
    };
    fetchPost();
  }, [id]);

  const handlePlagiarismCheck = async () => {
    setIsPlagLoading(true);
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`http://localhost:8000/api/blog-posts/${id}/check-plagiarism`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) { setIsPlagLoading(false); return; }
      const data = await res.json();
      setPlagResult(data); 
    } catch (err) { console.error(err); } finally { setIsPlagLoading(false); }
  };

  const handleHumanize = async (promptText) => {
    setIsPlagLoading(true); 
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const res = await fetch(`http://localhost:8000/api/blog-posts/${id}/humanize`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_prompt: promptText, tone: "balanced" })
      });
      const data = await res.json();
      if (data && data.rewritten_content) { setPendingContent(data.rewritten_content); }
    } catch (err) { console.error(err); } finally { setIsPlagLoading(false); }
  };

  const applyNeuralChanges = async () => {
    try {
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      const response = await fetch(`http://localhost:8000/api/blog-posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ topic: editedTopic, content: pendingContent })
      });
      if (!response.ok) throw new Error("Database_Update_Failed");
      setEditedContent(pendingContent);
      setPost(prev => ({ ...prev, content: pendingContent }));
      setPendingContent(null);
      setPlagResult(null); 
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) { setSaveStatus('error'); }
  };

  const handleCommit = async () => {
    setIsSaving(true);
    try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`http://localhost:8000/api/blog-posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ topic: editedTopic, content: editedContent })
        });
        if (!response.ok) throw new Error("Update_Failed");
        setSaveStatus('success'); 
        setIsEditing(false); 
        setPost({ ...post, topic: editedTopic, content: editedContent }); 
        setTimeout(() => setSaveStatus(null), 3000);
    } catch (err) { console.error(err); } finally { setIsSaving(false); }
  };

  const handleConfirmDelete = async () => {
    try {
        const auth = getAuth();
        const token = await auth.currentUser.getIdToken();
        const res = await fetch(`http://localhost:8000/api/blog-posts/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setSaveStatus('deleted');
          setTimeout(() => navigate("/dashboard"), 1500);
        }
    } catch (err) { console.error(err); }
  };

  if (!post) return <div className="h-screen bg-[#F4F9F7] flex items-center justify-center font-black text-emerald-800 tracking-[0.8em] animate-pulse">Loading</div>;

  return (
    <div className="h-screen w-full flex p-4 lg:p-8 font-sans relative overflow-hidden bg-[#f0f4f3]">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-emerald-300/40 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* SIDEBAR - */}
      <aside className={`w-20 hidden xl:flex flex-col items-center py-10 gap-10 bg-white/60 backdrop-blur-xl border border-white rounded-[3rem] shadow-xl h-fit sticky top-8 transition-all duration-300
        ${pinnedPanel ? 'z-[600] scale-105' : 'z-20'}`}>
        
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg border border-emerald-50">
          <Command size={24} />
        </div>
        
        <div className="flex flex-col gap-8 flex-grow">
          <Home size={22} className="text-slate-400 hover:text-emerald-500 cursor-pointer transition-all" onClick={() => navigate("/dashboard")} />
          
          <Calendar 
            size={22} 
            className={`${pinnedPanel === 'schedule' ? 'text-emerald-600 scale-125 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'text-slate-400'} hover:text-emerald-500 cursor-pointer transition-all`}
            onClick={() => setPinnedPanel(pinnedPanel === 'schedule' ? null : 'schedule')} 
          />

          <Download 
            size={22} 
            className={`${pinnedPanel === 'export' ? 'text-emerald-600 scale-125 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'text-slate-400'} hover:text-emerald-500 cursor-pointer transition-all`}
            onClick={() => setPinnedPanel(pinnedPanel === 'export' ? null : 'export')} 
          />

        </div>
      </aside>

      <main className="flex-grow ml-0 xl:ml-8 flex flex-col gap-6 relative z-10 h-full">
        <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 bg-white/70 backdrop-blur-lg border border-white rounded-[2.5rem] shadow-sm">
          <button onClick={() => navigate("/dashboard")} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-md">
            Dashboard
          </button>

          <div className="flex gap-4">
            <button onClick={handlePlagiarismCheck} disabled={isPlagLoading} className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all disabled:opacity-50">
              {isPlagLoading ? "Analyzing..." : "Check Originality"}
            </button>
            <button onClick={() => setShowDeleteModal(true)} className="bg-red-50 text-red-600 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
            <button onClick={() => setIsEditing(!isEditing)} className="bg-white border-2 border-emerald-500 text-emerald-600 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              {isEditing ? "Read Mode" : "Edit Mode"}
            </button>
            <button onClick={handleCommit} disabled={isSaving} className="bg-emerald-600 text-white px-10 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
              <Zap size={14} className="fill-white" /> Commit
            </button>
          </div>
        </div>

        <div className="min-h-[85vh] flex-grow overflow-y-auto pr-2 custom-scrollbar bg-white/95 backdrop-blur-3xl border-[3px] border-emerald-400/10 rounded-[5rem] relative transition-all duration-700 shadow-xl overflow-hidden">
          {pendingContent ? (
            <DiffViewer oldText={post.content} newText={pendingContent} onApply={applyNeuralChanges} onDiscard={() => setPendingContent(null)} />
          ) : (
            (!plagResult && !isPlagLoading) ? (
               <div className="p-10 lg:p-20 min-h-full ">
                  {isEditing ? (
                    <ContentEditor topic={editedTopic} setTopic={setEditedTopic} content={editedContent} setContent={setEditedContent} />
                  ) : (
                    <BlogPostView post={{...post, topic: editedTopic, content: editedContent}} />
                  )}
               </div>
            ) : (
              <PlagiarismChecker result={plagResult} loading={isPlagLoading} onClose={() => setPlagResult(null)} onHumanize={handleHumanize} />
            )
          )}
        </div>
      </main>

      {/* MODALS */}
      {pinnedPanel === 'schedule' && (
        <SchedulePicker 
          postId={id} 
          onClose={() => setPinnedPanel(null)} 
          onFinish={() => { 
            setSaveStatus('success'); 
            setPinnedPanel(null); 
            setTimeout(() => setSaveStatus(null), 3000); 
          }} 
        />
      )}

      {pinnedPanel === 'export' && (
        <ExportButton 
          postId={id} 
          content={editedContent}
          topic={editedTopic}
          onClose={() => setPinnedPanel(null)} 
        />
      )}

      {/* Delete modal  */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[700] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95">
            <Trash2 size={48} className="text-red-500 mb-6" />
            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2 ">Delete?</h3>
            <p className="text-slate-500 text-sm mb-8">This action is permanent.</p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-grow py-4 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600">No</button>
              <button onClick={handleConfirmDelete} className="flex-grow bg-red-500 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Delete</button>
            </div>
          </div>
        </div>
      )}

      {saveStatus && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-full font-black text-[10px] uppercase shadow-2xl animate-bounce z-[100]">
          {saveStatus === 'success' ? 'Sync Complete' : saveStatus === 'deleted' ? 'Deleted' : 'Error'}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; } 
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b98133; border-radius: 10px; }
      `}} />
    </div>
  );
}