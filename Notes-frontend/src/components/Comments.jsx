import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createComment, getCommentsByNoteId } from '../redux/comments/commentActions';

const Comments = ({ note }) => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState({
        comment: '',
    });

    const commentsById = useSelector((state) => state?.comment?.comments) || [];

    const handleChange = (e) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(createComment({ comment: comment.comment, noteId: note?._id }));
        setComment({ comment: '' });
        await dispatch(getCommentsByNoteId(note?._id))
    };

    useEffect(() => {
        dispatch(getCommentsByNoteId(note?._id))
    }, [dispatch, note])

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Discussion</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <textarea
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-500 transition duration-200"
                            placeholder="Add to the discussion..."
                            rows="3"
                            required
                            name="comment"
                            value={comment.comment}
                            onChange={handleChange}
                        />
                        <button
                            className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition duration-200 flex items-center gap-2"
                            type="submit"
                        >
                            <i className="fas fa-paper-plane"></i>
                            Post
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg p-6 max-h-[500px] overflow-y-auto">
                {commentsById.length === 0 ? (
                    <div className="text-center py-8">
                        <i className="far fa-comments text-4xl text-gray-400 mb-3"></i>
                        <h3 className="text-xl font-semibold text-gray-600">No comments yet</h3>
                        <p className="text-gray-500">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {Array.isArray(commentsById) &&
                            commentsById?.map((comment) => (
                                <div key={comment?._id} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition duration-200">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold">
                                                        {comment?.user?.username?.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">{comment?.user?.username}</h4>
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(comment?.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                            <p className="text-gray-700">{comment?.comment}</p>
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