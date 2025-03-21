import React from 'react'

function formatDateString(date) {
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('en-US', { month: 'short' });
    const day = dateObj.getDate();
    const year = dateObj.getFullYear();
    return `${month} ${day}, ${year}`;
}

// Function to determine if date is past or today
function getDateStatus(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);
    
    if (dateObj.getTime() < today.getTime()) return "Past";
    if (dateObj.getTime() === today.getTime()) return "Today";
    return null;
}

// Function to determine event type based on title or description
function getEventType(title, description) {
    const titleLower = title.toLowerCase();
    const descLower = description?.toLowerCase() || "";
    
    if (titleLower.includes("exam") || descLower.includes("exam")) return "Exam";
    if (titleLower.includes("present") || descLower.includes("present")) return "Presentation";
    if (titleLower.includes("assignment") || titleLower.includes("paper") || 
        descLower.includes("assignment") || descLower.includes("paper")) return "Assignment";
    return "Academic";
}

const ImpDatesCard = ({ imp }) => {
    const dateStatus = getDateStatus(imp?.date);
    const eventType = getEventType(imp?.title || "", imp?.description || "");
    
    // Set event type color
    const typeColorClass = {
        "Assignment": "bg-amber-900/70 text-amber-200",
        "Presentation": "bg-purple-900/70 text-purple-200",
        "Academic": "bg-blue-900/70 text-blue-200",
        "Exam": "bg-red-900/70 text-red-200"
    }[eventType] || "bg-indigo-900/70 text-indigo-200";
    
    // Set status color
    const statusColorClass = {
        "Past": "bg-gray-700 text-gray-400",
        "Today": "bg-green-800/70 text-green-200"
    }[dateStatus] || "";

    return (
        <div className="border-b border-[#334155] last:border-b-0">
            <div className="py-4 px-1 hover:bg-[#1e293b]/80 rounded-lg transition-colors">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-semibold text-white leading-tight">
                        {imp?.title}
                    </h3>
                    <span className={`text-xs px-3 py-1 rounded-full ${typeColorClass}`}>
                        {eventType}
                    </span>
                </div>
                
                <div className="text-gray-400 text-sm mb-2 flex items-center">
                    {formatDateString(imp?.date)}
                    {dateStatus && (
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${statusColorClass}`}>
                            {dateStatus}
                        </span>
                    )}
                </div>

                <p className="text-gray-300 text-sm">
                    {imp?.description}
                </p>
            </div>
        </div>
    )
}

export default ImpDatesCard