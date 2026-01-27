import BlogPostCard from "./BlogPostCard";

export default function BlogPostList({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="text-6xl text-slate-200">📂</div>
        <p className="text-slate-400 font-bold text-xl">No projects found in this section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Heading with Classy Slate-to-Emerald Gradient */}
      <div className="flex items-center gap-6">
        <h2 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-emerald-600">
          Recent Posts
        </h2>
        <div className="h-[2px] flex-1 bg-gradient-to-r from-slate-100 via-emerald-100 to-transparent"></div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}