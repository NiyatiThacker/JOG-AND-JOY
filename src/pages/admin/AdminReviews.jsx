import React, { useState } from 'react';
import { Star, Check, X, Search, MessageSquare, AlertTriangle, ShieldBan, Image as ImageIcon } from 'lucide-react';
import { useReviewsList, useUpdateReview } from '../../queries/useReviews';

export default function AdminReviews() {
  const [activeTab, setActiveTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyText, setReplyText] = useState('');

  const filters = {};
  if (activeTab !== 'all') filters.status = activeTab;
  if (search) filters.search = search;
  
  const { data, isLoading } = useReviewsList(filters);
  const reviews = data?.data || [];
  
  const updateMut = useUpdateReview();

  const handleOpenDetail = (review) => {
    setSelectedReview(review);
    setReplyText(review.merchantReply?.body || '');
  };

  const handleStatusChange = (status) => {
    if (selectedReview) {
      updateMut.mutate({ id: selectedReview.id, patch: { status } }, {
        onSuccess: (updated) => setSelectedReview(updated)
      });
    }
  };

  const handleSaveReply = () => {
    if (selectedReview) {
      updateMut.mutate({ 
        id: selectedReview.id, 
        patch: { merchantReply: { body: replyText, repliedAt: new Date().toISOString() } } 
      }, {
        onSuccess: (updated) => setSelectedReview(updated)
      });
    }
  };

  return (
    <div className="w-full animate-in fade-in duration-300 pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="text-[10px] text-accent-green font-bold uppercase tracking-widest font-mono">Feedback</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-primary-dark mt-0.5">Reviews</h1>
          <p className="text-xs text-text-secondary mt-1">Moderation queue and replies</p>
        </div>
      </div>

      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col min-w-0 ${selectedReview ? 'hidden md:flex md:w-2/3 md:border-r border-border' : 'w-full'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center border-b border-border bg-zinc-50/50 p-4 gap-4">
            <div className="flex overflow-x-auto w-full hide-scrollbar gap-2">
              {[
                { id: 'pending', label: 'Pending Moderation' },
                { id: 'all', label: 'All Reviews' },
                { id: 'approved', label: 'Approved' },
                { id: 'rejected', label: 'Rejected' },
                { id: 'spam', label: 'Spam' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    activeTab === tab.id 
                      ? 'bg-white border border-border shadow-sm text-primary-dark' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-zinc-100/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto min-h-[400px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-zinc-400 font-semibold">Loading reviews...</div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-50/80 text-text-secondary font-semibold border-b border-border text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4">Review</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {reviews.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="p-12 text-center text-text-secondary">
                        <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
                        <p className="font-bold text-primary-dark">No reviews found.</p>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((review) => (
                      <tr 
                        key={review.id} 
                        onClick={() => handleOpenDetail(review)} 
                        className={`transition-colors cursor-pointer group ${selectedReview?.id === review.id ? 'bg-primary-dark/5' : 'hover:bg-zinc-50/50'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex text-accent-green">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-zinc-200'}`} />)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-primary-dark line-clamp-1">{review.title || 'Untitled Review'}</p>
                          <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">{review.body}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                            review.status === 'approved' ? 'bg-success/15 text-success-dark' : 
                            review.status === 'rejected' ? 'bg-error/10 text-error' : 
                            review.status === 'spam' ? 'bg-zinc-200 text-zinc-600' :
                            'bg-warning/15 text-warning-dark'
                          }`}>
                            {review.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail Sidebar */}
        {selectedReview && (
          <div className="w-full md:w-1/3 bg-zinc-50/50 flex flex-col h-full md:min-h-[600px] border-l border-border animate-in slide-in-from-right-8 duration-300">
            <div className="p-4 flex justify-between items-center border-b border-border bg-white">
              <h2 className="font-bold text-primary-dark">Review Details</h2>
              <button onClick={() => setSelectedReview(null)} className="p-2 text-zinc-400 hover:text-primary-dark rounded-lg hover:bg-zinc-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-accent-green">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < selectedReview.rating ? 'fill-current' : 'text-zinc-200'}`} />)}
                  </div>
                  <span className="font-bold text-sm text-primary-dark ml-2">{selectedReview.rating}/5</span>
                </div>
                <h3 className="text-lg font-bold text-primary-dark mb-2">{selectedReview.title || 'Untitled'}</h3>
                <p className="text-sm text-text-secondary leading-relaxed bg-white p-4 rounded-xl border border-border shadow-sm">
                  {selectedReview.body}
                </p>
                {selectedReview.media?.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {selectedReview.media.map((m, i) => (
                      <div key={i} className="w-16 h-16 bg-zinc-100 rounded-lg border border-border flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-zinc-400" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedReview.status === 'pending' && (
                <div className="p-4 bg-white border border-border rounded-xl shadow-sm space-y-3">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Moderation Actions</h4>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleStatusChange('approved')} className="flex items-center justify-center gap-2 w-full py-2 bg-success text-white rounded-lg font-bold text-sm hover:bg-success-dark">
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => handleStatusChange('rejected')} className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-error text-error rounded-lg font-bold text-sm hover:bg-error/5">
                      <X className="w-4 h-4" /> Reject
                    </button>
                    <button onClick={() => handleStatusChange('spam')} className="flex items-center justify-center gap-2 w-full py-2 bg-white border border-border text-zinc-600 rounded-lg font-bold text-sm hover:bg-zinc-50">
                      <ShieldBan className="w-4 h-4" /> Mark as Spam
                    </button>
                  </div>
                </div>
              )}

              {selectedReview.status === 'approved' && (
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Merchant Reply</h4>
                  <textarea 
                    rows="3"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Write a public reply..."
                    className="w-full p-3 border border-border rounded-xl text-sm focus:outline-none focus:border-accent-green"
                  ></textarea>
                  <button 
                    onClick={handleSaveReply}
                    disabled={updateMut.isPending || !replyText.trim()}
                    className="px-4 py-2 bg-primary-dark text-white rounded-lg font-bold text-sm hover:bg-primary-hover shadow-sm disabled:opacity-50 w-full"
                  >
                    Post Reply
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
