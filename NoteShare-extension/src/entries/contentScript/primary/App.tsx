import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

const App = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    scheduledTime: "",
    title: "",
  });

  useEffect(() => {
    const handleMessage = (message: any, sender: any, sendResponse: any) => {
      if (message.type === "SHOW_SNOOZE_COMPLETED") {
        setNotificationData(message.data);
        setShowNotification(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowNotification(false), 8000);
        sendResponse({ received: true });
        return true; // Keep the message channel open
      }
    };

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  if (!showNotification) return null;

  return (
    <div className="fixed top-5 right-5 max-w-sm w-96 z-[2147483647] animate-slideIn">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  Snoozed Tab Reopened
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This tab was snoozed until {notificationData.scheduledTime}
                </p>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
