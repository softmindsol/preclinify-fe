import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import supabase from "../config/helper";

const DiscussionBoard = ({ mcqId ='d4d9f3a0-1a7b-4b8c-9e3f-8c2a1b7c4d5e', setIsAIExpanded }) => {
    const darkModeRedux = useSelector(state => state.darkMode.isDarkMode);
    const [comments, setComments] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const user = useSelector(state => state.user); // Assuming user data is stored in Redux
    
    // Fetch comments from Supabase
    const fetchComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('mcq_id', mcqId) // Filter by MCQ ID
            .order('created_at', { ascending: false });

        if (!error) {
            // Build comment tree
            const commentMap = {};
            data.forEach(comment => {
                comment.replies = [];
                commentMap[comment.id] = comment;
            });

            data.forEach(comment => {
                if (comment.parent_comment_id) {
                    const parent = commentMap[comment.parent_comment_id];
                    if (parent) parent.replies.push(comment);
                }
            });

            const rootComments = data.filter(comment => !comment.parent_comment_id);
            setComments(rootComments);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [mcqId]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
      const  mcqId= 'd4d9f3a0-1a7b-4b8c-9e3f-8c2a1b7c4d5e'
        const    userId= 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'// Assuming user ID is available
        const mcqIdNumber = Number(mcqId);
        const userIdNumber = Number(userId);

        const { error } = await supabase
            .from('comments')
            .insert([{
                mcq_id: mcqIdNumber, // नंबर भेजें
                user_id: userIdNumber, // नंबर भेजें
                comment_text: newComment,
                parent_comment_id: null,
                likes: 0,
                dislikes: 0
            }]);

      
        if (!error) {
            setNewComment("");
            await fetchComments();
        }
    };

    const handleAddReply = async (commentId) => {
        if (!replyText.trim()) return;

        const { error } = await supabase
            .from('comments')
            .insert([{
                mcq_id: mcqId,
                user_id: user.id, // Assuming user ID is available
                comment_text: replyText,
                parent_comment_id: commentId,
                likes: 0,
                dislikes: 0
            }]);

        if (!error) {
            setReplyText("");
            setReplyingTo(null);
            await fetchComments();
        }
    };

    const handleLike = async (commentId) => {
        const { error } = await supabase.rpc('increment_likes', {
            comment_id: commentId
        });

        if (!error) await fetchComments();
    };

    const handleDislike = async (commentId) => {
        const { error } = await supabase.rpc('increment_dislikes', {
            comment_id: commentId
        });

        if (!error) await fetchComments();
    };


      useEffect(() => {
        setIsAIExpanded(showComments);
        }, [showComments, setIsAIExpanded]);
    return (
        <div className="p-6">
            <div className="mx-auto bg-white shadow rounded-lg pt-3 pb-2 dark:bg-[#1E1E2A] text-black dark:border-[1px] dark:border-[#3A3A48]">
                <div
                    className="flex justify-between items-center gap-x-5 mb-2 p-4 cursor-pointer"
                    onClick={() => setShowComments(!showComments)}
                >
                    <div className="flex items-center gap-x-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="lucide lucide-message-square dark:text-white"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <h2 className="text-[16px] font-medium dark:text-white">Discussion Board</h2>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className={`lucide lucide-chevron-${showComments ? "up" : "down"} dark:text-white`}
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                </div>

                {showComments && (
                    <>
                        <hr className="mb-3" />
                        <div className="max-h-[600px] overflow-y-auto">
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    onReply={setReplyingTo}
                                    onLike={handleLike}
                                    onDislike={handleDislike}
                                    replyingTo={replyingTo}
                                    setReplyText={setReplyText}
                                    handleAddReply={handleAddReply}
                                />
                            ))}
                        </div>

                        <div className="p-4 border-t dark:border-[#3A3A48]">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    className="flex-1 bg-[#F4F4F5] rounded-[4px] p-3 placeholder:text-[12px] dark:bg-[#1E1E2A] dark:text-white dark:border"
                                    placeholder="Write your comment here..."
                                />
                                <button
                                    onClick={handleAddComment}
                                    className="px-4 py-2 bg-[#3CC8A1] text-white rounded hover:bg-[#35b38d] transition-colors"
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Comment = ({ comment, onReply, onLike, onDislike, replyingTo, setReplyText, handleAddReply }) => {
    const [showReplies, setShowReplies] = useState(true);
    const isReplying = replyingTo === comment.id;

    return (
        <div className="p-4 mb-4">
            <div className="flex items-start">
                <div className="flex-1">
                    <div className="flex gap-x-3 items-center">
                        <h4 className="font-medium dark:text-white">{comment.user_id}</h4>
                        <span className="text-sm text-[#A1A1AA] dark:text-gray-400">{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-[#000000] mt-1 py-2 dark:text-gray-300">{comment.comment_text}</p>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onLike(comment.id)}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                        >
                            <ThumbsUpIcon />
                            <span>{comment.likes}</span>
                        </button>
                        <button
                            onClick={() => onDislike(comment.id)}
                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                        >
                            <ThumbsDownIcon />
                            <span>{comment.dislikes}</span>
                        </button>
                        <button
                            onClick={() => onReply(comment.id)}
                            className="text-[#3CC8A1] hover:underline"
                        >
                            Reply
                        </button>
                    </div>

                    {isReplying && (
                        <div className="mt-4 flex gap-3">
                            <input
                                type="text"
                                onChange={(e) => setReplyText(e.target.value)}
                                className="flex-1 bg-[#F4F4F5] rounded p-2 text-sm dark:bg-[#1E1E2A] dark:text-white"
                                placeholder="Write your reply..."
                            />
                            <button
                                onClick={() => handleAddReply(comment.id)}
                                className="px-3 py-1 bg-[#3CC8A1] text-white rounded hover:bg-[#35b38d] text-sm"
                            >
                                Post
                            </button>
                        </div>
                    )}

                    {comment.replies?.length > 0 && (
                        <div className="mt-4 ml-8 border-l-2 border-[#D4D4D8] dark:border-[#3A3A48] pl-4">
                            <button
                                onClick={() => setShowReplies(!showReplies)}
                                className="text-sm text-[#3CC8A1] hover:underline mb-2"
                            >
                                {showReplies ? 'Hide replies' : `Show ${comment.replies.length} replies`}
                            </button>

                            {showReplies && comment.replies.map((reply) => (
                                <div key={reply.id} className="mt-4">
                                    <div className="flex gap-x-3 items-center">
                                        <h4 className="font-medium text-sm dark:text-white">{reply.user_id}</h4>
                                        <span className="text-xs text-[#A1A1AA] dark:text-gray-400">{new Date(reply.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[#000000] mt-1 text-sm dark:text-gray-300">{reply.comment_text}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <button
                                            onClick={() => onLike(reply.id)}
                                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                                        >
                                            <ThumbsUpIcon className="w-4 h-4" />
                                            <span className="text-sm">{reply.likes}</span>
                                        </button>
                                        <button
                                            onClick={() => onDislike(reply.id)}
                                            className="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                                        >
                                            <ThumbsDownIcon className="w-4 h-4" />
                                            <span className="text-sm">{reply.dislikes}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ThumbsUpIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`lucide lucide-thumbs-up ${className}`}
    >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
);

const ThumbsDownIcon = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={`lucide lucide-thumbs-down ${className}`}
    >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
);

export default DiscussionBoard;