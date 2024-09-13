import React, { useEffect, useState } from 'react';
import leetcodeProblems from './Leetcode-problems.json';
import Alternate from '../components/Layout/HomeLay';
import axios from 'axios';
import { BsCheck2Circle } from "react-icons/bs";

const host = process.env.REACT_APP_API_HOST;


const Leetcode = () => {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [completed, setCompleted] = useState([]);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const questionsPerPage = 50;

    const updatesolvequestion = async (questionId) => {
        try {
            const response = await axios.post(`${host}/api/v1/solveProblem/addSolvedproblems`, {
                questionId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                },

            });

            const solvedData = await response.data;
            console.log(solvedData);
        } catch (error) {
            console.error("Error updating solved questions:", error);
        }
    };


    useEffect(() => {
        const fetchSolvedQuestions = async () => {
            try {
                setData(leetcodeProblems.data.problemsetQuestionList.questions);

                // alert('fetching solved questions');
                const response = await axios.get(`${host}/api/v1/solveProblem/getSolvedproblemsByUserId`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                    }
                });
                const solvedData = await response.data;
                const solvedQuestionIds = solvedData.solvedproblems;

                setCompleted(solvedQuestionIds)

                console.log(solvedQuestionIds);

    
            } catch (error) {
                console.error("Error fetching solved questions:", error);
            }
        };
        fetchSolvedQuestions();
    }, []);


    const handleToggleComplete = (questionId) => {


        updatesolvequestion(questionId);
        setCompleted((prev) => ({
            ...prev,
            [questionId]: !prev[questionId],
        }));
    };

    if (!data) {
        return <div className='pl-96 text-black'>Loading...</div>;
    }

    // Filtering Logic
    const filteredQuestions = data.filter((question) => {
        const matchesDifficulty = difficultyFilter === '' || question.difficulty === difficultyFilter;
        const matchesTag = tagFilter === '' || question.topicTags.some(tag => tag.name === tagFilter);
        const matchesSearchQuery = searchQuery === '' || question.title.toLowerCase().includes(searchQuery.toLowerCase()) || question.frontendQuestionId.toString().includes(searchQuery);

        return matchesDifficulty && matchesTag && matchesSearchQuery;
    });

    const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);


    const currentQuestions = filteredQuestions.slice(
        (currentPage - 1) * questionsPerPage,
        currentPage * questionsPerPage
    );


    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const paginationRange = () => {
        const range = [];
        range.push(1);

        if (currentPage > 4) {
            range.push('...');
        }

        for (let i = Math.max(2, currentPage - 3); i <= Math.min(totalPages - 1, currentPage + 3); i++) {
            range.push(i);
        }

        if (currentPage < totalPages - 5) {
            range.push('...');
        }

        if (totalPages > 1) {
            range.push(totalPages);
        }

        return range;
    };

    return (
        <Alternate>
            <div className="py-6 px-4 lg:-ml-12 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-6 text-center">Question List</h1>

                {/* Filter Section */}
                <div className="mb-6 w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search by title or number"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-2 border rounded-lg shadow-md w-full md:w-1/2"
                    />

                    {/* Filter by Difficulty */}
                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="p-2 border rounded-lg shadow-md w-full md:w-1/4"
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    {/* Filter by Tag */}
                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="p-2 border rounded-lg shadow-md w-full md:w-1/4"
                    >
                        <option value="">All Tags</option>
                        {Array.from(new Set(data.flatMap(q => q.topicTags.map(tag => tag.name)))).map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                {/* Question List as a table */}
                <div className="mb-6 overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-2xl table-auto">
                        <thead>
                            <tr className="bg-gray-200 text-sm">
                                <th className="p-2 text-center whitespace-nowrap">TODO</th>
                                <th className="p-2 text-center whitespace-nowrap">No.</th>
                                <th className="p-2 text-left whitespace-nowrap">Title</th>
                                <th className="p-2 text-center whitespace-nowrap">Difficulty</th>
                                <th className="p-2 whitespace-nowrap text-center">Acceptance Rate</th>
                                <th className="p-2 text-left whitespace-nowrap">Tags</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.map((question) => (
                                <tr key={question.frontendQuestionId} className="border-b text-sm">
                                    {/* TODO Column */}
                                    <td className="p-2 text-center cursor-pointer" onClick={() => handleToggleComplete(question.frontendQuestionId)}>
                                        {completed.includes(question.frontendQuestionId) ? (
                                            <BsCheck2Circle className="text-green-500 text-xl mx-auto" />
                                        ) : (
                                            <BsCheck2Circle className="text-gray-200 text-xl mx-auto" />
                                        )}
                                    </td>
                                    <td className="p-2 whitespace-nowrap mx-auto text-center">{question.frontendQuestionId}</td>
                                    <td className="p-2 whitespace-nowrap hover:text-blue-400">
                                        <a href={`https://leetcode.com/problems/${question.titleSlug}/description/`} target='_blank'>
                                            {question.title}
                                        </a>
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-center">
                                        <span
                                            className={`${question.difficulty === 'Easy'
                                                ? 'text-green-500'
                                                : question.difficulty === 'Medium'
                                                    ? 'text-yellow-500'
                                                    : 'text-red-500'
                                                }`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-2 whitespace-nowrap text-center">{question.acRate.toFixed(2)}%</td>
                                    <td className="p-2 whitespace-nowrap flex flex-wrap">
                                        {question.topicTags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="px-1 mt-1 py-1 mr-2 bg-blue-200 text-blue-800 rounded-md text-xs"
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Previous
                    </button>

                    {paginationRange().map((page, index) =>
                        page === '...' ? (
                            <span key={index} className="px-3 py-1">...</span>
                        ) : (
                            <button
                                key={index}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-1 rounded ${currentPage === page
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-300 text-black'
                                    }`}
                            >
                                {page}
                            </button>
                        )
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </Alternate>
    );
};

export default Leetcode;
