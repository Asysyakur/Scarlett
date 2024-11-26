import { createContext, useContext, useState, useEffect, useRef } from "react";
import axios from "axios";

// Create context
const ActivityContext = createContext();

// Provider component
export const ActivityProvider = ({ children, auth }) => {
  const [activityId, setActivityId] = useState(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Start activity
  const startActivity = async () => {
    try {
      const response = await axios.post("/activities/start", {
        user_id: auth.user.id, // Using user name from auth
        path: currentPath,
      });
      setActivityId(response.data.id); // Store activity ID
    } catch (error) {
      console.error("Error starting activity:", error);
    }
  };

  // Stop activity
  const stopActivity = async () => {
    try {
      await axios.post(`/activities/stop`,{
        path: currentPath,
      }); // Use currentPath as the path
    } catch (error) {
      console.error("Error stopping activity:", error);
    }
  };

  // Function to manually change path and update activity
  const changePath = (newPath) => {
    setCurrentPath(newPath); // Manually update the path
    window.history.pushState(null, "", newPath); // Update browser history
  };

  return (
    <ActivityContext.Provider
      value={{
        activityId,
        startActivity,
        stopActivity,
        currentPath,
        changePath, // Expose changePath function to use in other components
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};

// Custom hook to use the activity context
export const useActivity = () => {
  return useContext(ActivityContext);
};
