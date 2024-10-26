import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, getCommentsByNoteId } from '../redux/comments/commentActions';

const Comments = ({ note }) => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState({
        comment: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [unblurredComments, setUnblurredComments] = useState(new Set());

    const commentsById = useSelector((state) => state?.comment?.comments) || [];

    const handleChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await dispatch(createComment({ comment: comment.comment, noteId: note?._id }));
            setComment({ comment: '' });
            await dispatch(getCommentsByNoteId(note?._id));
        } catch (error) {
            console.error('Error posting comment:', error);
        }
        setIsLoading(false);
    };

    const toggleBlur = (commentId) => {
        setUnblurredComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                await dispatch(getCommentsByNoteId(note?._id));
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
            setIsLoading(false);
        };
        fetchComments();
    }, [dispatch, note]);

    return (
        <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <i className="fas fa-comments text-blue-500"></i>
                    Discussion
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                        <textarea
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 text-sm transition duration-200 min-h-[80px]"
                            placeholder="Share your thoughts and insights..."
                            rows="3"
                            required
                            name="comment"
                            value={comment.comment}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <button
                            className={`absolute bottom-2 right-2 ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white px-3 py-1.5 rounded-lg transition duration-200 flex items-center gap-2 shadow-sm text-sm`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane"></i>
                                    <span>Post</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg p-4 shadow border border-gray-100 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-3 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : commentsById.length === 0 ? (
                    <div className="text-center py-8">
                        <i className="far fa-comments text-4xl text-gray-300 mb-3"></i>
                        <h3 className="text-lg font-semibold text-gray-600">No comments yet</h3>
                        <p className="text-sm text-gray-400 mt-1">Be the first to start the discussion!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {Array.isArray(commentsById) &&
                            commentsById?.map((comment) => (
                                <div key={comment?._id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition duration-200 border border-gray-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                                            <span className="text-white text-sm font-semibold">
                                                {comment?.user?.username?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <h4 className="font-semibold text-sm text-gray-900">{comment?.user?.username}</h4>
                                                <span className="text-xs text-gray-500">
                                                    <i className="far fa-clock mr-1"></i>
                                                    {new Date(comment?.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${comment?.sentiment < 0 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} font-medium`}>
                                                    <i className={`fas fa-${comment?.sentiment < 0 ? 'frown' : 'smile'} mr-1`}></i>
                                                    {comment?.sentiment < 0 ? 'Negative' : 'Positive'} Comment
                                                </span>
                                            </div>
                                            <div className={`relative transition-all duration-300 ${comment?.sentiment < 0 && !unblurredComments.has(comment?._id) ? 'blur-sm' : ''}`}>
                                                <p className="text-sm text-gray-700 leading-relaxed break-words">{comment?.comment}</p>
                                            </div>
                                            {comment?.sentiment < 0 && (
                                                <button 
                                                    onClick={() => toggleBlur(comment?._id)}
                                                    className="text-xs text-blue-600 mt-1.5 hover:text-blue-700 hover:underline font-medium flex items-center gap-1"
                                                >
                                                    <i className={`fas fa-${unblurredComments.has(comment?._id) ? 'eye-slash' : 'eye'}`}></i>
                                                    {unblurredComments.has(comment?._id) ? 'Hide Comment' : 'Show Comment'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comments;