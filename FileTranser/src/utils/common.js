import moment from "moment";
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
    if(str === '' || !str){
         return ''
    }
    return str.charAt(0).toUpperCase() + str.slice(1)
}


let DateFormate = (date) => {
    if(!date){
        return '';
    }
    return moment(date, moment.ISO_8601, true).utc().format('DD/MM/YYYY');
}

const TimeSchedule = (date, addedTime) => {
    // Parse the start time
    const startTime = moment(date);
    
    // Extract the number of minutes from the addedTime string
    const minutesToAdd = parseInt(addedTime.split(' ')[0], 10);
    
    // Add the extracted minutes to the start time
    const endTime = startTime.clone().add(minutesToAdd, 'minutes');
    
    // Format both times
    const formattedStartTime = startTime.format("h:mm a");
    const formattedEndTime = endTime.format("h:mm a");
    // Return the time range in the desired format
    return `${formattedStartTime} - ${formattedEndTime}`;
}

const DaysDiff = (from, to) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const diffTime = toDate - fromDate;
    // Calculate the difference in days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    // Return the difference in days
    return diffDays === 0 ? '0 days' : `${diffDays} days`;
};



export { getHumanReadableDate, truncateWithEllipsis , CamelCases  , DateFormate , TimeSchedule , DaysDiff}