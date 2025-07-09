import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`https://ministry-new.onrender.com/api/admin/submitted-articles`);
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching submissions:', err);
    }
  };

  const handleApprove = async (id) => {
    await axios.patch(`https://ministry-new.onrender.com/api/admin/approve-article/${id}`);
    fetchSubmissions();
  };

  const handleReject = async (id) => {
    await axios.delete(`https://ministry-new.onrender.com/api/admin/reject-article/${id}`);
    fetchSubmissions();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">🛠️ Admin Panel: Review Submissions</h2>
      {/* ➕ Post New Article button */}
        <button
          onClick={() => navigate("/admin-form")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Post New Article
        </button>

      {articles.length === 0 ? (
        <div className="text-center text-gray-600 bg-yellow-50 p-6 border rounded">
          😴 No user-submitted articles at the moment.
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div key={article._id} className="border border-gray-200 p-4 rounded shadow-sm bg-white">
              <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
              <p className="text-sm text-gray-600">
                By {article.authorName || 'Anonymous'} from {article.location || 'Unknown'}
              </p>
              <p className="text-sm text-gray-500">
  📧 {article.authorEmail || 'No email'}
</p>
              <p className="mt-2 text-sm text-gray-700">{article.content.slice(0, 200)}...</p>
              <div className="flex flex-wrap gap-4 mt-4">
                <button
                  onClick={() => handleApprove(article._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(article._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reject
                </button>
                <Link
  to={`/admin/edit-submission/${article._id}`}
  className="text-blue-500 underline hover:text-blue-700"
>
  ✏️ Edit
</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
