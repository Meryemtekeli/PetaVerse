import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getForumPosts, ForumPost } from "../../services/api/socialApi";

const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [category, setCategory] = useState<string>("");

  useEffect(() => {
    getForumPosts(category).then(setPosts);
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6">Topluluk</h2>
      <div className="mb-4 flex gap-2">
        <select value={category} onChange={e => setCategory(e.target.value)} className="input w-48">
          <option value="">Tüm Kategoriler</option>
          <option value="general">Genel</option>
          <option value="health">Sağlık</option>
          <option value="training">Eğitim</option>
          <option value="adoption">Sahiplendirme</option>
        </select>
        <Link to="/community/create-post" className="btn-primary ml-auto">Yeni Post</Link>
        <Link to="/community/pet-stories" className="btn-outline">PetStory</Link>
      </div>
      <div className="space-y-4">
        {posts.map(post => (
          <Link key={post.id} to={`/community/post/${post.id}`} className="block bg-white rounded shadow p-4 hover:shadow-lg transition">
            <div className="font-bold text-lg mb-2">{post.title}</div>
            <div className="text-sm text-gray-600 mb-2">{post.authorName} • {new Date(post.createdAt).toLocaleDateString()}</div>
            <div className="text-gray-700 mb-2">{post.content.slice(0, 150)}...</div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>❤️ {post.likes.length}</span>
              <span>💬 {post.comments.length}</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{post.category}</span>
            </div>
          </Link>
        ))}
        {posts.length === 0 && <div className="text-gray-500 text-center py-8">Henüz post yok.</div>}
      </div>
    </div>
  );
};

export default CommunityPage; 