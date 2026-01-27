import { useState } from "react";
import { getAuth } from "firebase/auth";

export default function TopicForm() {
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!topic || !keywords) {
      setError("Topic and keywords are required");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("User not authenticated");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/blog-posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          keywords,
          userId: user.uid,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create post");
      }

      setMessage(
        `Post created successfully! ID: ${data.postId} (Outline generation started)`
      );
      setTopic("");
      setKeywords("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-600">
        Create Blog Post
      </h2>

      <input
        type="text"
        placeholder="Enter topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        type="text"
        placeholder="Enter keywords (comma separated)"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        className="w-full border p-2 rounded"
      />

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-600">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-emerald-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Create Post"}
      </button>
    </form>
  );
}
