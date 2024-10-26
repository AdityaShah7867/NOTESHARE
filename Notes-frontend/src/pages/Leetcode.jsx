import React, { useEffect, useState } from 'react';
import leetcodeProblems from './Leetcode-problems.json';
import Alternate from '../components/Layout/HomeLay';
import axios from 'axios';
import { BsCheck2Circle } from "react-icons/bs";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const host = process.env.REACT_APP_API_HOST;

const Leetcode = () => {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [completed, setCompleted] = useState(null);
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [progressData, setProgressData] = useState(null);
    const [showGraph, setShowGraph] = useState(true);
    const [cumulativeData, setCumulativeData] = useState(null);
    const [difficultyStats, setDifficultyStats] = useState(null);
    const questionsPerPage = 50;

    const updatesolvequestion = async (questionId, problem, date) => {
        try {
            await axios.post(`${host}/api/v1/solveProblem/addSolvedproblems`, {
                questionId,
                problem,
                date
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                },
            });
        } catch (error) {
            console.error("Error updating solved questions:", error);
        }
    };

    useEffect(() => {
        const fetchSolvedQuestions = async () => {
            try {
                setData(leetcodeProblems.data.problemsetQuestionList.questions);

                const response = await axios.get(`${host}/api/v1/solveProblem/getSolvedproblemsByUserId`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authtoken')}`
                    }
                });
                
                const solvedData = response.data;
                const solvedQuestionIds = new Set(solvedData.solvedproblems.map(problem => problem.questionId));
                setCompleted(solvedQuestionIds);

                // Prepare progress data using actual dates
                const sortedProblems = solvedData.solvedproblems.sort((a, b) => new Date(a.date) - new Date(b.date));
                
                // Get unique dates only for x-axis
                const uniqueDates = [...new Set(sortedProblems.map(problem => 
                    new Date(problem.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                    })
                ))];

                // Calculate cumulative totals
                let cumulative = 0;
                const cumulativeCounts = uniqueDates.map(() => {
                    cumulative++;
                    return cumulative;
                });

                setCumulativeData({
                    labels: uniqueDates,
                    datasets: [{
                        label: 'Total Problems Solved',
                        data: cumulativeCounts,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }]
                });

                // Calculate difficulty distribution
                const difficulties = {
                    Easy: 0,
                    Medium: 0,
                    Hard: 0
                };

                solvedData.solvedproblems.forEach(problem => {
                    const questionData = leetcodeProblems.data.problemsetQuestionList.questions
                        .find(q => q.frontendQuestionId === problem.questionId);
                    if (questionData) {
                        difficulties[questionData.difficulty]++;
                    }
                });

                setDifficultyStats({
                    labels: ['Easy', 'Medium', 'Hard'],
                    datasets: [{
                        data: [difficulties.Easy, difficulties.Medium, difficulties.Hard],
                        backgroundColor: ['#4ade80', '#facc15', '#f87171'],
                        borderColor: ['#22c55e', '#eab308', '#ef4444'],
                        borderWidth: 1
                    }]
                });

            } catch (error) {
                console.error("Error fetching solved questions:", error);
                setCompleted(new Set());
            }
        };
        fetchSolvedQuestions();
    }, []);

    const handleToggleComplete = (questionId, problem) => {
        const date = new Date().toISOString();
        setCompleted(prev => {
            const newCompleted = new Set(prev);
            if (newCompleted.has(questionId)) {
                newCompleted.delete(questionId);
            } else {
                newCompleted.add(questionId);
            }
            return newCompleted;
        });
        updatesolvequestion(questionId, problem, date);
    };

    if (!data || !completed) {
        return (
            <Alternate>
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </Alternate>
        );
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

                {/* Progress Graphs */}
                {cumulativeData && difficultyStats && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Your Progress</h2>
                            <button 
                                onClick={() => setShowGraph(!showGraph)}
                                className="text-blue-500 hover:text-blue-700"
                            >
                                {showGraph ? 'Hide Graphs' : 'Show Graphs'}
                            </button>
                        </div>
                        {showGraph && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="h-64">
                                    <Line 
                                        data={cumulativeData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Progress Over Time'
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    ticks: {
                                                        maxRotation: 45,
                                                        minRotation: 45
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="h-64">
                                    <Doughnut 
                                        data={difficultyStats}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Problems by Difficulty'
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

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
                                    <td className="p-2 text-center cursor-pointer" onClick={() => handleToggleComplete(question.frontendQuestionId, question.title)}>
                                        <BsCheck2Circle className={`text-xl mx-auto ${completed.has(question.frontendQuestionId) ? 'text-green-500' : 'text-gray-200'}`} />
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
