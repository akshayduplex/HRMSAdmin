

export const DateFormate = (dateString) => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    // Extract date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getUTCDate()).padStart(2, '0');
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    
    // Determine AM/PM and adjust hours
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Construct formatted date string
    const formattedDate = `${day}/${month}/${year}  ${hours}:${minutes} ${ampm}`;

    return formattedDate;
};

// export const UpcomingData = (data) => {
//     const ElementArray = [];
//     console.log(data?.length, "4567890-");

//     data?.forEach((element) => {  
//         const dataObject = { 
//             _id: element?._id,
//             name: element?.name,
//             job_id: element?.job_id,
//             job_title: element?.job_title, 
//             project_name: element?.project_name, 
//         };

//         element?.applied_jobs?.forEach((applied) => { 
//             const interview = applied?.interviewer?.[0] || {};

//             const appliedData = {
//                 applied_recommendation: applied?.recommendation,
//                 applied_interview_status: applied?.interview_status,
//                 applied_job_id: applied?.job_id,
//                 applied_job_title: applied?.job_title,
//                 applied_job_type: applied?.job_type,
//                 applied_project_id: applied?.project_id,
//                 applied_project_name: applied?.project_name,
//                 applied_department: applied?.department,
//                 applied_form_status: applied?.form_status,
//                 applied_add_date: applied?.add_date,
//                 applied__id: applied?._id,
//                 applied_google_meet_link: applied?.google_meet_link,
//                 applied_interview_date: applied?.interview_date,
//                 applied_interview_duration: applied?.interview_duration,
//                 applied_interview_host: applied?.interview_host,
//                 applied_interview_type: applied?.interview_type,
//                 applied_stage: applied?.stage,
//                 interview_feedback_status: interview?.feedback_status,
//                 interview_total: interview?.total,
//                 interview_employee_name: interview?.employee_name,
//                 interview_employee_id: interview?.employee_id,
//                 interview_rating: interview?.rating,
//                 interview_status: interview?.status,
//                 interview_add_date: interview?.add_date,
//                 interview__id: interview?._id,
//                 interview_updated_on: interview?.updated_on,
//                 interview_comment: interview?.comment,
//                 interview_communication: interview?.communication,
//                 interview_feedback_date: interview?.feedback_date,
//                 interview_skills: interview?.skills
//             };

//             const finalObject = {
//                 ...dataObject,
//                 ...appliedData
//             };

//             ElementArray.push(finalObject);
//         });
//     });

//     return ElementArray;
// };





