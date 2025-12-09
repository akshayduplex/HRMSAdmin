import React, { useState, useEffect } from 'react';
import EmployeeBarChart from './EmployeeGradeCount';
import ProjectBudgetBarChart from './ProjectBudgetBar';
import ProjectVacancyChart from './VacancyChart';
import EmployeeDepartmentBarChart from './EmployeeDepartmentCount';
import HrHiringChart from './HrHiringChart';
import EmployeeTenureChart from './EmployeeTenureCount';
import EmployeeAgeChart from './EmployeeAgeCount';
import JobTypeChart from './JobTypeChart';
import TerminationProjectChart from './TerminationProjectChart';
import MapMarker from './Mapmarker';
import male from '../images/male.svg'
import female from '../images/female.svg'
import Form from 'react-bootstrap/Form';
import GoBackButton from '../employee/Goback';
import CountUp from 'react-countup';
import AllHeaders from '../features/partials/AllHeaders';
import { getCurrentDate } from '../employee/helper/My_Helper';
import { getProjectList, getEmployeeByGenderChart } from '../employee/helper/Api_Helper';
import AppraisalChart from './AppraisalChart';
import ContractClosureChart from './ContractClosureChart';
import RoleConsultantChart from './RoleConsultantChart';





const Analyticsdashboard = () => { 
    const [projects, setProjects] = useState([]);
    const [genderRatio, setGenderRatio] = useState({ Male: 0, Female: 0 }); // State to store gender ratio
    const [selectedProjectJobType, setSelectedProjectJobType] = useState(""); 
    const [selectedProjectTerminations , setSelectedProjectTerminations] = useState(""); 
    const [selectedProjectGeographic , setSelectedProjectGeographic] = useState(""); 
    const [selectedProjectContractClosure , setSelectedProjectContractClosure] = useState("");
    const [selectedProjectRoleConsultant , setSelectedProjectRoleConsultant] = useState("");
    
    useEffect(() => {
        const fetchProjects = async () => {
          try {
            const response = await getProjectList();
            if (response.status) {
              setProjects(response.data); // Store the project list in state
            } else {
              console.error('Failed to fetch projects', response.message);
            }
          } catch (error) {
            console.error('Error fetching project data', error);
          } 
        };
    
        fetchProjects(); // Call the function to fetch data when component mounts
      }, []);

      useEffect(() => {
        const fetchGenderRatio = async () => {
          try {
            const response = await getEmployeeByGenderChart();
            if (response.status) {
                const ratioData = response.data.reduce((acc, item) => {
                    acc[item.gender] = parseFloat(item.percentage);
                    return acc;
                }, {});
                setGenderRatio(ratioData); // Store the gender ratio in state
            } else {
              console.error('Failed to fetch projects', response.message);
            }
          } catch (error) {
            console.error('Error fetching project data', error);
          } 
        };
    
        fetchGenderRatio(); // Call the function to fetch data when component mounts
      }, []);

      const handleProjectChangeJobType = (e) => {
        const projectId = e.target.value;
        setSelectedProjectJobType(projectId); // Update the selected project state
      };
      const handleProjectChangeTerminations = (e) => {
        const projectId = e.target.value;
        setSelectedProjectTerminations(projectId); // Update the selected project state
      };

    const handleProjectGeographic = (e) => {
        const projectId = e.target.value;
        setSelectedProjectGeographic(projectId); // Update the selected project state
    };
    return (
        <>  
        {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='datewish my-4'>
                            <p>{getCurrentDate()}</p>
                            <h3>Analytics</h3>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-sm-12'>
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Project Budget Analysis Project wise</h5>
                               
                                    <ProjectBudgetBarChart />
                                
                            </div>
                        </div> 
                        
                        <div className='col-sm-12' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Project-wise Vacancy And Headcount</h5>
                                
                                <ProjectVacancyChart projects = { projects }/>
                            </div>
                        </div>
                        <div className='col-sm-12' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Employee Count Department Wise</h5>
                                <EmployeeDepartmentBarChart projects = { projects }/>
                            </div>
                        </div>
                        <div className='col-sm-12' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>HR Hiring Process Projectwise</h5>
                                <HrHiringChart projects = { projects }/>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='sitecard'>
                                <h5 style={{marginBottom: 80 + 'px'}} className='chart_hdng'>Employee Count Grade wise</h5>
                                <EmployeeBarChart />
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Employee Count By Tenure</h5>
                                
                                <EmployeeTenureChart projects = { projects }/>
                            </div> 
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5  className='chart_hdng'>Employee Count By Job Type</h5>
                                <div className="chart_selectbx">
                                    <Form.Select value={selectedProjectJobType} onChange={handleProjectChangeJobType}>
                                    <option value="">Choose Project</option>
                                    {projects.map((project) => (
                                        <option key={project._id} value={project._id}>
                                        {project.title}
                                        </option>
                                    ))}
                                    </Form.Select>
                                </div>
                                <div>
                                    <JobTypeChart projectId = {selectedProjectJobType}/>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Terminations By Project</h5>
                                <div className='chart_selectbx'>
                                    <Form.Select value={selectedProjectTerminations} onChange={handleProjectChangeTerminations}>
                                        <option value="">Choose Project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                            {project.title}
                                            </option>
                                        ))}
                                        </Form.Select>
                                </div>
                                <div>
                                    <TerminationProjectChart projectId = {selectedProjectTerminations} />
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard employee_ratio'>
                                <h5 className='chart_hdng'>Total Employee Ratio Men vs Women</h5>
                                <div className='ratiorow'>
                                    <img src={male} alt='male'/>
                                    <h2><CountUp end={genderRatio.Male} duration={6} />%</h2>
                                </div>
                                <div className='ratiorow'>
                                    <img src={female} alt='female'/>
                                    <h2><CountUp end={genderRatio.Female} duration={6} />%</h2>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Employee Count By Age</h5>
                                <EmployeeAgeChart />
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Appraisal Due Cycle</h5>
                                <div className='dash_dflexgap chart_selectbx'>
                                    <Form.Select defaultValue="Choose Project">
                                        <option>Appraisal Cycle</option>
                                        <option>April Cycle</option>
                                        <option>October Cycle</option>
                                    </Form.Select>
                                </div>
                                <AppraisalChart />
                            </div>
                        </div>
                        <div className='col-sm-6' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Contract Closure</h5>
                                <div className='chart_selectbx'>
                                    <Form.Select value={selectedProjectContractClosure} onChange={(e) => setSelectedProjectContractClosure(e.target.value)} >
                                        <option value="">Choose Project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                            {project.title}
                                            </option>
                                        ))}
                                        </Form.Select>
                                </div>
                                <div>
                                    <ContractClosureChart projectId={selectedProjectContractClosure}/>
                                </div>
                            </div>
                        </div>

                        <div className='col-sm-12' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>On role vs Consultant (In place)</h5>
                                <div className='chart_selectbx'>
                                    <Form.Select value={selectedProjectRoleConsultant} onChange={(e) => setSelectedProjectRoleConsultant(e.target.value)} >
                                        <option value="">Choose Project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                            {project.title}
                                            </option>
                                        ))}
                                        </Form.Select>
                                </div>
                                <div>
                                    <RoleConsultantChart projectId={selectedProjectRoleConsultant}/>
                                </div>
                            </div>
                        </div>
                        

                        <div className='col-sm-12' data-aos="fade-up" data-aos-duration="2500">
                            <div className='sitecard'>
                                <h5 className='chart_hdng'>Employee Geographic View Projectwise</h5>
                                <div className='chart_selectbx'>
                                        <Form.Select value={selectedProjectGeographic} onChange={handleProjectGeographic}>
                                        <option value="">Choose Project</option>
                                        {projects.map((project) => (
                                            <option key={project._id} value={project._id}>
                                            {project.title}
                                            </option>
                                        ))}
                                        </Form.Select>
                                </div>
                                <MapMarker projectId = {selectedProjectGeographic} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analyticsdashboard;
