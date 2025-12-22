import moment from "moment";
import MomentTimeZone from 'moment-timezone'


const getHumanReadableDate = (isoDate, type = null, customFormat = null) => {
    const date = new Date(isoDate);

    // Define default options for toLocaleDateString and toLocaleTimeString
    const optionsDate = { year: 'numeric', month: 'long', day: 'numeric' };
    const optionsTime = { hour: 'numeric', minute: 'numeric', hour12: true };

    // Convert the date to a human-readable string using default options
    const humanReadableDate = date.toLocaleDateString(undefined, optionsDate);
    const humanReadableTime = date.toLocaleTimeString(undefined, optionsTime);

    // If customFormat is provided, use it to format the date manually
    if (customFormat) {
        return customFormat
            .replace('YYYY', date.getFullYear())
            .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
            .replace('DD', String(date.getDate()).padStart(2, '0'))
            .replace('hh', String(date.getHours()).padStart(2, '0'))
            .replace('mm', String(date.getMinutes()).padStart(2, '0'))
            .replace('ss', String(date.getSeconds()).padStart(2, '0'))
            .replace('TT', date.getHours() >= 12 ? 'PM' : 'AM');
    }

    // Default behavior based on the type parameter
    const dateFormat = type ? type.toString() : null;
    if (dateFormat === 'date') {
        return humanReadableDate;
    } else if (dateFormat === 'time') {
        return humanReadableTime;
    } else if (dateFormat === 'datetime') {
        return `${humanReadableDate}, ${humanReadableTime}`;
    } else {
        // Fallback to return full date and time if no type is specified
        return `${humanReadableDate}, ${humanReadableTime}`;
    }
};

const truncateWithEllipsis = (str, maxLength) => {
    if (str.length <= maxLength) {
        return str;
    }
    return str.slice(0, maxLength) + '...';
}

const CamelCases = (str) => {
    // return first letter in Upper case
    if (str === '' || !str) {
        return ''
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
}


let DateFormate = (date) => {
    if (!date) {
        return '';
    }
    return moment(date, moment.ISO_8601, true).utc().format('DD/MM/YYYY');
}

// const TimeSchedule = (date, addedTime) => {

//     if(!date && addedTime){

//     }
//     // Parse the start time
//     const startTime = moment(date);

//     // Extract the number of minutes from the addedTime string
//     const minutesToAdd = parseInt(addedTime.split(' ')[0], 10);

//     // Add the extracted minutes to the start time
//     const endTime = startTime.clone().add(minutesToAdd, 'minutes');

//     // Format both times
//     const formattedStartTime = startTime.format("h:mm a");
//     const formattedEndTime = endTime.format("h:mm a");
//     // Return the time range in the desired format
//     return `${formattedStartTime} - ${formattedEndTime}`;
// }

const TimeSchedule = (date, addedTime) => {
    // Validate inputs
    if (!date || !addedTime) {
        return "";
    }

    // Parse the start time
    const startTime = moment(date);
    if (!startTime.isValid()) {
        console.error("Invalid date format.");
        return "";
    }

    // Adjusted regex to match "minutes" or "min"
    const minutesMatch = addedTime.match(/^(\d+)\s*(min|minutes?)$/i);
    if (!minutesMatch) {
        return "";
    }

    // Extract the minutes value
    const minutesToAdd = parseInt(minutesMatch[1], 10);

    // Add the extracted minutes to the start time
    const endTime = startTime.clone().add(minutesToAdd, 'minutes');

    // Format both times
    const formattedStartTime = startTime.format("h:mm a");
    const formattedEndTime = endTime.format("h:mm a");

    // Return the time range in the desired format
    return `${formattedStartTime} - ${formattedEndTime}`;
};

const DaysDiff = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate - fromDate;
    // Calculate the difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    // Return the difference in days
    return diffDays === 0 ? '0 days' : `${diffDays} days`;
};

const HourDiff = (lastLoginTime) => {
    const currentTime = moment(); // Get the current time
    // Calculate the difference in minutes
    const diffInMinutes = currentTime.diff(lastLoginTime, 'minutes');
    // Convert minutes to hours and minutes
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    // Format the result
    const formattedDifference = `${hours} h ${minutes} min`;
    return formattedDifference;
}

const TimeZone = (lastDate) => {
    // return MomentTimeZone(lastDate).tz('Asia/Kolkata').format('h:mm A')
    var mdate = MomentTimeZone(lastDate).tz('Asia/Kolkata').format('hh:mm A');
    return mdate;
}

function dayDiff(startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);
    // return the 0 day if not selected data 
    if (!start.isValid() || !end.isValid()) {
        return 0; // Return 0 if any date is invalid
    }

    // Calculate the difference in days and add 1 to make it inclusive
    const diff = end.diff(start, 'days') + 1;

    return diff;
}

function getRemainingWorkingDays() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // 0-11 (0 = January, 11 = December)

    // Get the last day of the current month
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0); // Adding 1 month, and setting day to 0 gives last day of current month

    let remainingWorkingDays = 0;

    // Loop from today to the last day of the month
    for (let date = today; date <= lastDayOfMonth; date.setDate(date.getDate() + 1)) {
        const dayOfWeek = date.getDay();

        // Check if the day is a weekday (0 = Sunday, 6 = Saturday)
        if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            remainingWorkingDays++;
        }
    }

    return `${remainingWorkingDays} Days`;
}

/**
 * Calculates the tenure from the joining date to the current date.
 * 
 * @param {string} joiningDateString - The joining date in the format "MMMM D, YYYY, h:mm A".
 * @returns {string} The tenure in years, months, and days.
 */
function calculateTenure(joiningDateString) {
    // Parse the joining date
    const joiningDate = moment(joiningDateString, "MMMM D, YYYY, h:mm A");

    // Get the current date
    const currentDate = moment();

    // Calculate the tenure in years, months, and days
    const years = currentDate.diff(joiningDate, 'years');
    const months = currentDate.diff(joiningDate, 'months') % 12;
    const days = currentDate.diff(joiningDate, 'days') % 30;

    if (!years && !months && !days) {
        return false
    }

    // Return the tenure in a formatted string
    return `${years} years, ${months} months, ${days} days`;
}


const isJobExpired = (deadline) => {
    const currentDate = moment(); // Get the current date and time
    const jobDeadline = moment(deadline); // Convert the deadline string to a moment object

    return currentDate.isAfter(jobDeadline); // Return true if the current date is after the deadline
};


const changeJobTypeLabel = (data) => {

    switch (data) {
        case 'On Contract':
            return 'On Consultant'
        case 'OnContract':
            return 'On Consultant'
        case 'ONCONTRACT':
            return 'On Consultant'
        case 'onContract':
            return 'On Consultant'
        case 'OnRole':
            return 'On Role'
        case 'onRole':
            return 'On Role'
        case 'onrole':
            return 'On Role'
        default:
            return data
    }
}

const CustomChangesJobType = (data) => {
    if (!data) {
        return data
    }

    switch (data) {
        case 'On Contract':
            return 'Consultant'
        case 'OnContract':
            return 'Consultant'
        case 'onContract':
            return 'Consultant'
        case 'OnRole':
            return 'On Role'
        case 'onRole':
            return 'On Role'
        case 'onrole':
            return 'On Role'
        default:
            return data
    }

}

const addDaysAndFormatDate = (dateString, daysToAdd = 0) => {
    const originalDate = moment(dateString);
    const newDate = originalDate.add(daysToAdd, 'days');
    return newDate.format('YYYY-MM-DD');
};

function getDatesInRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Format date function (e.g., 19-Oct-2024)
    const formatDate = (date) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
    };

    // If the start date and end date are the same, return the start date only
    if (start.getTime() === end.getTime()) {
        return [formatDate(start)];
    }

    // Calculate the difference in days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If there is no gap (i.e., next day), return start and end date
    if (diffDays === 1) {
        return [formatDate(start), formatDate(end)];
    }

    // Generate the list of dates between the start and end dates
    const dateArray = [];
    let currentDate = start;

    while (currentDate <= end) {
        dateArray.push(formatDate(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
}

const getWeekOfMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = startOfMonth.getDay(); // Day of the week for the 1st of the month
    const adjustedDate = date.getDate() + dayOfWeek; // Offset the day to the week
    return Math.ceil(adjustedDate / 7); // Calculate the week number
};

const formatDateToWeekOf = (dateString) => {
    const date = new Date(dateString);
    const week = getWeekOfMonth(date);
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    // Handle ordinal suffix for the week number
    const ordinalSuffix = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };

    return `${ordinalSuffix(week)} week of ${month}, ${year}`;
};

const validateTheJobPortal = (str) => {
    if (!str) {
        return [];
    }

    let newArray = str?.split(',') || [];

    const formattedArray = newArray
        .filter(item => item === "Naukri" || item === "Devnet")
        .concat(newArray.filter(item => item !== "Naukri" && item !== "Devnet"))
        .slice(0, 2)
        .concat(newArray.length > 2 ? ["Others"] : []);
    return formattedArray;
};

function numberToWords(num) {
    if (num === 0) return "Zero";

    const belowTwenty = [
        "", "One", "Two", "Three", "Four", "Five", "Six", "Seven",
        "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen",
        "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const tens = [
        "", "", "Twenty", "Thirty", "Forty", "Fifty",
        "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const thousands = ["", "Thousand", "Million", "Billion"];

    function helper(n) {
        let word = "";

        if (n < 20) {
            word = belowTwenty[n];
        } else if (n < 100) {
            word = tens[Math.floor(n / 10)] + " " + belowTwenty[n % 10];
        } else if (n < 1000) {
            word = belowTwenty[Math.floor(n / 100)] + " Hundred " + helper(n % 100);
        }
        return word.trim();
    }

    let i = 0;
    let result = "";

    while (num > 0) {
        if (num % 1000 !== 0) {
            result = helper(num % 1000) + " " + thousands[i] + " " + result;
        }
        num = Math.floor(num / 1000);
        i++;
    }

    return result.trim();
}


const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate();
    const month = d.toLocaleString("en-US", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
};

// dd/mm/yyyy -> dd monthname year
export const formatDateDMY = (input) => {
    if (!input) return "";

    const [day, month, year] = input.split("/");
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
};



export { getHumanReadableDate, truncateWithEllipsis, CamelCases, DateFormate, TimeSchedule, DaysDiff, HourDiff, TimeZone, dayDiff, getRemainingWorkingDays, calculateTenure, isJobExpired, changeJobTypeLabel, addDaysAndFormatDate, getDatesInRange, formatDateToWeekOf, validateTheJobPortal, CustomChangesJobType, numberToWords, formatDate }