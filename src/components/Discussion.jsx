import React, { useState } from "react";

const DiscussionBoard = () => {
    const [comments, setComments] = useState([
        {
            id: 1,
            author: "Neil Shi",
            date: "07 Jun 24",
            text: "I don’t get why the diagnosis is this one",
            replies: [
                {
                    id: 1.1,
                    author: "Rohan Sagu",
                    date: "12 Sep 24",
                    text: "It’s in the answers bro",
                },
                {
                    id: 1.2,
                    author: "Rohan Sagu",
                    date: "12 Sep 24",
                    text: "It’s in the answers bro",
                },
            ],
        },
    ]);

    const [showComments, setShowComments] = useState(true);

    return (
        <div className="p-6 bg-gray-100  xl:w-[85%] 2xl:w-[90%] ">
            <div className="w-[700px] mx-auto bg-white  shadow rounded-lg py-5">
                <div
                    className="flex justify-between items-center gap-x-5 mb-2 p-4 cursor-pointer"
                    onClick={() => setShowComments(!showComments)}
                >
                    <div className="flex justify-between items-center gap-x-5">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-message-square"
                        >
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <h2 className="text-[16px] font-medium">Discussion Board</h2>
                    </div>

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`lucide lucide-chevron-${showComments ? "up" : "down"}`}
                    >
                        <path d="m18 15-6-6-6 6" />
                    </svg>
                </div>
                <hr className="mb-3" />
                {showComments && (
                    <>
                        {comments.map((comment) => (
                            <Comment key={comment.id} comment={comment} />
                        ))}

                        <div className="flex items-center justify-center gap-x-3 text-[#3F3F46]">
                            <p>Show More Replies (1)</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-chevron-down"
                            >
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </div>
                    </>
                )}

                {showComments && <div className=""> <hr className="mt-10" />
                    <div className="flex items-center justify-center my-5 ">
                        <input
                            type="text"
                            className="w-[90%] bg-[#F4F4F5] rounded-[4px] p-3 placeholder:text-[12px]"
                            placeholder="Write your comment here..."
                        />
                    </div>
                    </div>}
               
            </div>
        </div>

    );
};

const Comment = ({ comment }) => {
    return (
        <div className="p-8 mb-4">
            <div className="flex items-start text-[16px]">
                <div className="flex-1">
                    <div className="flex gap-x-5 items-center">
                        <h4 className="font-medium">{comment.author}</h4>
                        <span className="text-sm font-bold text-[#A1A1AA]">{comment.date}</span>
                    </div>
                    <p className="text-[#000000] mt-1">{comment.text}</p>
                    <div className="flex items-center mt-2 space-x-4">
                        <button className="flex items-center text-gray-500 rounded-[4px] bg-[#F4F4F5] py-2 px-8 hover:text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-thumbs-up"
                            >
                                <path d="M7 10v12" />
                                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
                            </svg>
                        </button>
                        <button className="flex items-center text-gray-500 rounded-[4px] bg-[#F4F4F5] py-2 px-8 hover:text-gray-700">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-thumbs-down"
                            >
                                <path d="M17 14V2" />
                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
                            </svg>
                        </button>
                        <button className="text-[#3CC8A1] font-medium hover:underline">Reply</button>
                    </div>
                </div>
            </div>
            {comment.replies && (
                <div className="ml-12 mt-4">
                    {comment.replies.map((reply) => (
                        <Comment key={reply.id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DiscussionBoard;
