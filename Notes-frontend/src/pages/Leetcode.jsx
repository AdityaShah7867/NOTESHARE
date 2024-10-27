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
  ArcElement,
  BarElement
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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
    const [weeklyStats, setWeeklyStats] = useState(null);
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

                // Get last 30 days of data
                const last30Days = [...new Set(sortedProblems
                    .filter(problem => {
                        const date = new Date(problem.date);
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        return date >= thirtyDaysAgo;
                    })
                    .map(problem => new Date(problem.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC'
                    })))];

                // Count problems per day for last 30 days
                const problemsPerDay = {};
                sortedProblems.forEach(problem => {
                    const date = new Date(problem.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC'
                    });
                    problemsPerDay[date] = (problemsPerDay[date] || 0) + 1;
                });

                // Calculate weekly stats
                const weeklyData = {};
                const now = new Date();
                for (let i = 0; i < 7; i++) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        timeZone: 'UTC'
                    });
                    weeklyData[dateStr] = 0;
                }

                sortedProblems.forEach(problem => {
                    const date = new Date(problem.date);
                    if ((now - date) / (1000 * 60 * 60 * 24) <= 7) {
                        const dayStr = date.toLocaleDateString('en-US', {
                            weekday: 'short',
                            timeZone: 'UTC'
                        });
                        weeklyData[dayStr]++;
                    }
                });

                setWeeklyStats({
                    labels: Object.keys(weeklyData).reverse(),
                    datasets: [{
                        label: 'Problems Solved',
                        data: Object.values(weeklyData).reverse(),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1
                    }]
                });

                // Convert to cumulative counts
                let cumulative = 0;
                const cumulativeCounts = last30Days.map(date => {
                    cumulative += (problemsPerDay[date] || 0);
                    return cumulative;
                });

                setCumulativeData({
                    labels: last30Days,
                    datasets: [{
                        label: 'Total Problems Solved',
                        data: cumulativeCounts,
                        fill: true,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.4
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
                        backgroundColor: ['rgba(74, 222, 128, 0.8)', 'rgba(250, 204, 21, 0.8)', 'rgba(248, 113, 113, 0.8)'],
                        borderColor: ['rgb(34, 197, 94)', 'rgb(234, 179, 8)', 'rgb(239, 68, 68)'],
                        borderWidth: 2
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
            // Scroll to top of the question list
            window.scrollTo({
                top: document.querySelector('.question-list-section').offsetTop,
                behavior: 'smooth'
            });
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
            <div className="py-6 px-4 lg:px-8 xl:px-12 bg-gray-100 min-h-screen">
        

                {/* Progress Graphs */}
                {cumulativeData && difficultyStats && weeklyStats && (
                    <div className="mb-8 bg-white p-8 rounded-2xl shadow-xl">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Your Progress</h2>
                            <button 
                                onClick={() => setShowGraph(!showGraph)}
                                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                {showGraph ? 'Hide Graphs' : 'Show Graphs'}
                            </button>
                        </div>
                        {showGraph && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="h-80 col-span-2 bg-gray-50 p-4 rounded-xl shadow-inner">
                                    <Line 
                                        data={cumulativeData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Progress Over Last 30 Days',
                                                    font: {
                                                        size: 20,
                                                        weight: 'bold',
                                                        family: "'Inter', sans-serif"
                                                    },
                                                    padding: 20
                                                },
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        padding: 20,
                                                        font: {
                                                            size: 14
                                                        }
                                                    }
                                                }
                                            },
                                            scales: {
                                                x: {
                                                    grid: {
                                                        display: false
                                                    },
                                                    ticks: {
                                                        maxRotation: 45,
                                                        minRotation: 45,
                                                        font: {
                                                            size: 12
                                                        }
                                                    }
                                                },
                                                y: {
                                                    beginAtZero: true,
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.05)'
                                                    },
                                                    ticks: {
                                                        font: {
                                                            size: 12
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="h-80 bg-gray-50 p-4 rounded-xl shadow-inner">
                                    <Doughnut 
                                        data={difficultyStats}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Problems by Difficulty',
                                                    font: {
                                                        size: 20,
                                                        weight: 'bold',
                                                        family: "'Inter', sans-serif"
                                                    },
                                                    padding: 20
                                                },
                                                legend: {
                                                    position: 'bottom',
                                                    labels: {
                                                        padding: 20,
                                                        font: {
                                                            size: 14
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                <div className="h-80 col-span-3 bg-gray-50 p-4 rounded-xl shadow-inner">
                                    <Bar
                                        data={weeklyStats}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                title: {
                                                    display: true,
                                                    text: 'Problems Solved This Week',
                                                    font: {
                                                        size: 20,
                                                        weight: 'bold',
                                                        family: "'Inter', sans-serif"
                                                    },
                                                    padding: 20
                                                },
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        stepSize: 1,
                                                        font: {
                                                            size: 12
                                                        }
                                                    },
                                                    grid: {
                                                        color: 'rgba(0, 0, 0, 0.05)'
                                                    }
                                                },
                                                x: {
                                                    grid: {
                                                        display: false
                                                    },
                                                    ticks: {
                                                        font: {
                                                            size: 12
                                                        }
                                                    }
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
                <div className="mb-8 w-full flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                    <input
                        type="text"
                        placeholder="Search by title or number..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="p-3 border rounded-xl shadow-md w-full md:w-1/2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />

                    <select
                        value={difficultyFilter}
                        onChange={(e) => setDifficultyFilter(e.target.value)}
                        className="p-3 border rounded-xl shadow-md w-full md:w-1/4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    <select
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        className="p-3 border rounded-xl shadow-md w-full md:w-1/4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                        <option value="">All Tags</option>
                        {Array.from(new Set(data.flatMap(q => q.topicTags.map(tag => tag.name)))).sort().map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                    </select>
                </div>

                {/* Question List Section */}
                <div className="question-list-section mb-8 overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-50 text-sm border-b">
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-center">No.</th>
                                <th className="p-4 text-left">Title</th>
                                <th className="p-4 text-center">Difficulty</th>
                                <th className="p-4 text-center">Acceptance</th>
                                <th className="p-4 text-left">Topics</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentQuestions.map((question) => (
                                <tr key={question.frontendQuestionId} className="border-b hover:bg-gray-50 transition duration-150">
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => handleToggleComplete(question.frontendQuestionId, question.title)}
                                            className="transition duration-200 hover:scale-110"
                                        >
                                            <BsCheck2Circle className={`text-2xl mx-auto ${completed.has(question.frontendQuestionId) ? 'text-green-500' : 'text-gray-200'}`} />
                                        </button>
                                    </td>
                                    <td className="p-4 text-center font-medium">{question.frontendQuestionId}</td>
                                    <td className="p-4">
                                        <a 
                                            href={`https://leetcode.com/problems/${question.titleSlug}/description/`} 
                                            target='_blank'
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            {question.title}
                                        </a>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium
                                            ${question.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                              question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                              'bg-red-100 text-red-700'}`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">{question.acRate.toFixed(1)}%</td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {question.topicTags.map((tag) => (
                                                <span
                                                    key={tag.id}
                                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                                                >
                                                    {tag.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-center items-center gap-3">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
                    >
                        Previous
                    </button>

                    <div className="flex gap-2">
                        {paginationRange().map((page, index) =>
                            page === '...' ? (
                                <span key={index} className="px-3 py-2">...</span>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-4 py-2 rounded-lg transition duration-200
                                        ${currentPage === page
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition duration-200"
                    >
                        Next
                    </button>
                </div>
            </div>
        </Alternate>
    );
};

export default Leetcode;
