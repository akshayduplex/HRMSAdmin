const apiHeaderToken = () => {
  return {
    headers: {
      "Content-Type": "application/json",
      // hrms_secret_key: `Bearer ${getToken()}`,
      authorization: `Bearer ${getToken()}`,
    },
  };
};

const apiHeaderTokenMultiPart = (token) => {
  return {
    headers: {
      "Content-Type": "multipart/form-data",
      // hrms_secret_key: `Bearer ${getToken()}`,
      authorization: `Bearer ${getToken()}`,
    },
  };
};

const setSessiontData = (key, data) => {
  try {
    const jsonData = JSON.stringify(data);
    sessionStorage.setItem(key, jsonData);
  } catch (error) {
    console.error("Error setting session storage item", error);
  }
};

const getSessionData = (key) => {
  try {
    const jsonData = sessionStorage.getItem(key);
    return jsonData ? JSON.parse(jsonData) : null;
  } catch (error) {
    console.error("Error getting session storage item", error);
    return null;
  }
};

const getToken = () => {
  try {
    // Retrieve the JSON string from localStorage
    const jsonData = localStorage.getItem("admin_role_user");

    // Parse the JSON string into an object
    const dataObject = jsonData ? JSON.parse(jsonData) : null;

    // Access properties from the parsed object and return the token
    return dataObject ? dataObject.token : null;
  } catch (error) {
    console.error("Error getting session storage item", error);
    return null;
  }
};

const getCandidateId = () => {
  try {
    // Retrieve the JSON string from sessionStorage
    const jsonData = sessionStorage.getItem("loginData");

    // Parse the JSON string into an object
    const dataObject = jsonData ? JSON.parse(jsonData) : null;
    // Access properties from the parsed object
    return dataObject ? dataObject._id : null; // Returns the _id if available
  } catch (error) {
    console.error("Error getting session storage item", error);
    return null;
  }
};

const clearSessionData = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Error clearing session storage", error);
  }
};

const formatDate = (dateString) => {
  if (!dateString) {
    return ""; // Return an empty string if dateString is empty
  }

  const date = new Date(dateString);

  // Check if the date is invalid
  if (isNaN(date.getTime())) {
    return ""; // Return an empty string for invalid dates
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const lettersOnly = (name) => {
  const regex = /^[a-zA-Z]*$/;
  return regex.test(name);
};
// replace(/[^0-9]/g, '')
const numbersOnly = (mobileNo) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(mobileNo);
};

const formatCurrency = (value) => {
  if (value >= 10000000) {
    return (value / 10000000).toFixed(1) + " Cr"; // Converts to crores with 2 decimal places
  } else if (value >= 100000) {
    return (value / 100000).toFixed(1) + " L"; // Converts to lakhs with 2 decimal places
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + " K"; // Converts to thousands with 2 decimal places
  } else {
    return value.toString(); // Less than 1 thousand, no conversion
  }
};
// Function to get the current date in the desired format
const getCurrentDate = () => {
  const date = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  // Adding a comma after the weekday
  const parts = formattedDate.split(" ");
  return `${parts[0]}, ${parts.slice(1).join(" ")}`;
};

export {
  apiHeaderToken,
  apiHeaderTokenMultiPart,
  setSessiontData,
  getSessionData,
  clearSessionData,
  getCandidateId,
  formatDate,
  lettersOnly,
  numbersOnly,
  formatCurrency,
  getCurrentDate,
};
