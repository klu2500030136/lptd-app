import React, { useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Card, { CardContent, CardHeader, CardTitle } from '../components/Card';
import { AuthContext } from '../context/AuthContext';
import { Trophy, BookOpen, Target, TrendingUp, AlertCircle } from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    const [marks] = useState(() => {
        if (user) {
            const allMarks = JSON.parse(localStorage.getItem('marks') || '[]');
            return allMarks.filter(m => m.studentId === user.id);
        }
        return [];
    });

    // Calculate overall statistics
    const totalSubjects = marks.length;
    const overallCGPA = totalSubjects > 0
        ? (marks.reduce((acc, curr) => acc + Number(curr.cgpa), 0) / totalSubjects).toFixed(2)
        : 0;
    const totalScore = marks.reduce((acc, curr) => acc + Number(curr.score), 0);
    const averageScore = totalSubjects > 0 ? (totalScore / totalSubjects).toFixed(1) : 0;

    // Chart Data: Bar Chart (Subject vs Marks)
    const barChartData = {
        labels: marks.map(m => m.subject),
        datasets: [
            {
                label: 'Subject Marks',
                data: marks.map(m => m.marks),
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Primary blue
                borderColor: 'rgb(37, 99, 235)',
                borderWidth: 1,
                borderRadius: 6,
                barPercentage: 0.6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: { grid: { display: false } }
        },
    };

    // Chart Data: Line Chart (Performance Trend)
    // For the sake of the demo, we'll plot subjects chronologically as a trend
    const lineChartData = {
        labels: marks.map((m, i) => `Term ${i + 1}`),
        datasets: [
            {
                fill: true,
                label: 'CGPA Trend',
                data: marks.map(m => m.cgpa),
                borderColor: 'rgb(16, 185, 129)', // Emerald
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                pointBackgroundColor: 'rgb(16, 185, 129)',
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 0,
                max: 10,
                grid: { color: 'rgba(0, 0, 0, 0.05)' }
            },
            x: { grid: { display: false } }
        },
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <Navbar />

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Student Dashboard</h1>
                        <p className="text-gray-500 mt-2 flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                                ID: {user?.id}
                            </span>
                            Academic Performance Overview
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 glass px-6 py-3 rounded-2xl flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Overall CGPA</p>
                            <p className="text-3xl font-bold text-primary">{overallCGPA}</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Trophy className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                {totalSubjects === 0 ? (
                    <Card className="text-center py-16">
                        <CardContent>
                            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-900">No Marks Available</h3>
                            <p className="text-gray-500 mt-2 max-w-md mx-auto">
                                Your academic records have not been uploaded yet. Please contact your teacher or administrator.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <Card className="card-hover">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-xl bg-purple-50 text-purple-600">
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Enrolled Subjects</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalSubjects}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-hover">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600">
                                        <Target className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Average Score</p>
                                        <p className="text-2xl font-bold text-gray-900">{averageScore}%</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="card-hover">
                                <CardContent className="p-6 flex items-center gap-4">
                                    <div className="p-4 rounded-xl bg-orange-50 text-orange-600">
                                        <TrendingUp className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Total Marks</p>
                                        <p className="text-2xl font-bold text-gray-900">{totalScore}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subject Performance</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <Bar data={barChartData} options={barChartOptions} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>CGPA Trend</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-80">
                                        <Line data={lineChartData} options={lineChartOptions} />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Detailed Table */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Subject Details</CardTitle>
                            </CardHeader>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse text-sm">
                                    <thead>
                                        <tr className="border-y border-gray-100 bg-gray-50/50">
                                            <th className="px-6 py-4 font-semibold text-gray-600">Subject</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-center">Marks (out of 100)</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-center">Score Percentage</th>
                                            <th className="px-6 py-4 font-semibold text-gray-600 text-center">CGPA</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {marks.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-gray-900">{item.subject}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                                        {item.marks}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1 max-w-[200px] mx-auto">
                                                        <div
                                                            className={`h-2.5 rounded-full ${item.score >= 85 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-blue-500' : 'bg-red-500'}`}
                                                            style={{ width: `${item.score}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-gray-500">{item.score}%</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${item.cgpa >= 8.5 ? 'bg-emerald-100 text-emerald-800' :
                                                        item.cgpa >= 7.0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {item.cgpa}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;
