import React, { useEffect, useState } from "react";
import VerticalEmpTabs from './VerticalEmpTabs';
import Project_cards from "./Projectcart";
import EmployeedetailsTable from './EmployeeDetailsTable';
import { useSelector } from "react-redux";
import { InfinitySpin } from 'react-loader-spinner'


export default function EmployeeChildTracker({id , projectListTitle}) {

    // const { getJobList } = useSelector((state) => state.getJobsList);
    const { projectDesignation  } = useSelector((state) => state.projectListDropdown);
    const [Tabs, setTabs] = useState([]);
    const [selectedIndex , setIndex] = useState(0);

    useEffect(() => {
        if(id === ''){
            setIndex(0)
        }
    } , [id , setIndex])

    useEffect(() => {
        if (projectDesignation?.status === 'success' && Array.isArray(projectDesignation?.data)) {
            const tabs = projectDesignation.data
            .filter((value) => value.title === projectListTitle?.title)
            .map((value) => {
                return {
                    title: <Project_cards projectData={value} />,
                    content: <EmployeedetailsTable ProjectEmployee={value} id={id}/>
                };
            });
            setTabs(tabs);
        }
    }, [projectDesignation, projectListTitle]);

    useEffect(() => {
        if (id && projectDesignation?.status === 'success') {
            const data = projectDesignation.data;
    
            // Ensure data is defined and is an array before proceeding
            if (Array.isArray(data) && data) {
                let FindIndex = data.filter((value) => value.title === projectListTitle?.title).findIndex(value => value.designation === projectListTitle?.designation);
                if (FindIndex === -1) {
                    FindIndex = 0;
                }
                setIndex(FindIndex);
            } else {
                console.error("getJobList.data is not an array or is undefined");
            }
        }
    }, [projectDesignation.data, projectDesignation?.status, id, setIndex, projectListTitle]);

    return (
        <>
            <div className="project_innerdata" data-aos="fade-in" data-aos-duration="3000">
                {
                    projectDesignation.status === 'loading' ?
                    <div className="d-flex align-content-center justify-content-center">
                        <InfinitySpin
                            visible={true}
                            width="200"
                            color="#4fa94d"
                            ariaLabel="infinity-spin-loading"
                        />
                    </div> :
                    Tabs.length > 0
                ? <VerticalEmpTabs tabs={Tabs} selectedIndexValue={selectedIndex}/>
                :null
                }
            </div>
        </>
    );
}
