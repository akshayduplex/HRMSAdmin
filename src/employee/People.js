import config from "../config/config";
import React, { useState, useEffect } from "react";
import PeopleKRA from "./PeopleKRA";
import PeopleFNF from "./PeopleFnf";
import ReportingManager from "./Reportingmanager";
import { FaLinkedin } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import GoBackButton from "./Goback";
import Emp_info from "./Profile/Employee-info";
import Emp_salary from "./Profile/Employee-salary";
import EmpAttendance from "./Profile/Employee-attendence";
import Emp_credit_history from "./Profile/Emp-credit-history";
import Emp_document from "./Profile/Emp-documents";
import { getEmployeeById, getCandidateByEmailName } from "./helper/Api_Helper";
import DEFAULT_AVATAR from ".././images/avator.png"
import moment from "moment";
import { calculateTenure } from "../utils/common";
import PeopleKPIKRA from "./PeopleKpiKra";
import EmployeeJourney from "./EmployeeJourney";
import { toast } from "react-toastify";
import { apiHeaderTokenMultiPart } from "../config/api_header";
import axios from "axios";
import EmployeeAssets from "./EmpAssets/EmployeeAssets";
import { useSearchParams } from "react-router-dom";
const IMAGE_PATH = config.IMAGE_PATH;

export default function People() {
  const [formData, setFormData] = useState([]);
  const [employeeDoc, setEmployeeDoc] = useState([]);
  const [employeePhoto, setEmployeePhoto] = useState();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) || {};
  const [activeTab, setActiveTab] = useState("first");

  // Fetch Candidate Details With Id
  const fetchCandidateData = async () => {
    try {
      const myId = localStorage.getItem("onBoardingId");
      const response = await getEmployeeById({ _id: myId, scope_fields: [] });
      const data = response.data;
      setFormData(data);
    } catch (error) {
      console.error("Error fetching candidate data", error);
    }
  };

  // useEffect Fetch Candidate Details ->>

  useEffect(() => {
    fetchCandidateData();
  }, []);

  // Fetch Candidate Images throw the Name

  useEffect(() => {
    if (formData.email) {
      // Check if formData.email is available
      const fetchEmployeeDoc = async () => {
        try {
          const response = await getCandidateByEmailName(formData.email);
          setEmployeePhoto(response.data.photo);
          if (response && response.data && Array.isArray(response.data.docs)) {
            setEmployeeDoc(response.data.docs);
          } else {
            setEmployeeDoc([]);
          }
        } catch (error) {
          console.error("Error fetching documents:", error);
          setEmployeeDoc([]);
        }
      };

      fetchEmployeeDoc();
    }
  }, [formData.email]);

  // Handle Parments Address and corrent Address ->

  const permanentAddressData =
    formData.permanent_address && typeof formData.permanent_address === "object"
      ? formData.permanent_address
      : {};

  const imagePath = (formData && formData?.docs?.find((item) => item?.doc_category === 'Profile_image')?.file_name) ? IMAGE_PATH + formData?.docs?.find((item) => item?.doc_category === 'Profile_image')?.file_name : DEFAULT_AVATAR;

  // Chane Profile Images
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true)
      handleUpload(file);
    }
  };

  // Handle Open Images to Uplods

  const handleButtonClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.onchange = handleImageChange;
    input.click();
  };
  // Handle Click To File Uplods
  const handleUpload = async (file) => {
    const formDatas = new FormData();

    if (!file) {
      setLoading(false)
      return toast.warn("Please Choose The File");
    }

    formDatas.append("filename", file);
    formDatas.append("_id", formData?._id);
    formDatas.append("doc_category", 'Profile_image');
    formDatas.append("sub_doc_category", "Profile_image");
    formDatas.append("doc_name", "Profile_image");
    formDatas.append("added_by", loginUsers?.name);

    try {
      let response = await axios.post(`${config.API_URL}uploadEmployeeKycDocs`, formDatas, apiHeaderTokenMultiPart(config.API_TOKEN))
      if (response.status === 200) {
        toast.success(response.data?.message)
        fetchCandidateData();
        setLoading(false)
      } else {
        toast.error(response.data?.message || "Something went wrong")
        setLoading(false)
      }
    } catch (error) {
      toast.error(error?.message || error?.response.data?.message || "Something went wrong")
      setLoading(false)
    }
  };

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab'));
    }
  }, [searchParams]);


  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div
          className="container ps-5"
          data-aos="fade-in"
          data-aos-duration="3000"
        >
          <GoBackButton />
          <div className="sitecard">
            <div className="cd_profilebox d-flex">
              <div className="cd_prfleft">

                <div className="d-flex flex-column align-items-center justify-content-center">
                  <img src={imagePath} alt="User" width={100} height={100} />
                  <button className="create-job btn" disabled={loading} onClick={handleButtonClick}> {loading ? 'Uploading...' : 'Upload Image'}</button>
                </div>

                <div className="dfx">
                  <h4 className="name">{formData?.name}</h4>
                  <p className="empcode">
                    Employee Code: {formData?.employee_code}
                  </p>
                  <p className="empcode">
                    Designation : {formData?.designation}
                  </p>
                  <p className="empcode">
                    Project : {formData?.project_name}
                  </p>
                  <p className="empcode">
                    Batch Id : {formData?.batch_id ? formData?.batch_id : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="cd_prfright d-flex">
                <div className="cnt_info">
                  <h6>Contact Information</h6>
                  <p>+91-{formData?.mobile_no}</p>
                  <p>{formData?.email}</p>
                  <p>
                    {permanentAddressData.city_district},{" "}{permanentAddressData.state_name},{" "}
                    {permanentAddressData.pin_code}
                  </p>
                  <ul className="social">
                    <li>
                      <a href="#">
                        <FaLinkedin />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <RiTwitterXFill />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <FaFacebook />
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <FaInstagram />
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="cnt_info prev_empinfo">
                  <h6>Employment Info</h6>
                  <p>Joining Date : {moment(formData.joining_date).format('DD/MM/YYYY')}</p>
                  <p>Appraisal Date : {moment(formData.appraisal_date).format('DD/MM/YYYY') ? moment(formData.appraisal_date).format('DD/MM/YYYY') : 'N/A'}</p>
                  <p>DOB : {moment(formData.date_of_birth).format('DD/MM/YYYY') ? moment(formData.date_of_birth).format('DD/MM/YYYY') : 'N/A'}</p>
                  <p>Contract End Date : {moment(formData.valid_till).format('DD/MM/YYYY') !== 'Invalid date' ? moment(formData.valid_till).format('DD/MM/YYYY') : 'N/A'}</p>
                  <p>Tenure : {calculateTenure(formData.joining_date) ? calculateTenure(formData.joining_date) : 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          <Tab.Container
            id="left-tabs-example"
            className="mt-3"
            defaultActiveKey={activeTab}
            activeKey={activeTab}
            onSelect={(key) => setActiveTab(key)}
          >
            <Nav
              variant="pills"
              className="flex-row postedjobs widthcomp border-full peoplstabss"
            >
              <Nav.Item>
                <Nav.Link eventKey="first">Employee Info</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Salary</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Attendance</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="four">KPI / KRA</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="six">JD</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="seven">Credit History</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="eight">Documents</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="nine">FnF</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="ten">Add Manager</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="five">Employee Journey</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="assets">Assets</Nav.Link>
              </Nav.Item>
              {/* <Nav.Item>
                <Nav.Link eventKey="assets">Assets</Nav.Link>
              </Nav.Item> */}
            </Nav>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Emp_info data={formData} getEmployeeListFun={fetchCandidateData} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Emp_salary data={formData} />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <EmpAttendance data={formData} />
              </Tab.Pane>
              <Tab.Pane eventKey="seven">
                <Emp_credit_history />
              </Tab.Pane>
              <Tab.Pane eventKey="eight">
                <Emp_document employeeDoc={formData} getEmployeeListFun={fetchCandidateData} />
              </Tab.Pane>
              <Tab.Pane eventKey="four">
                <PeopleKPIKRA data={formData} getEmployeeListFun={fetchCandidateData} />
              </Tab.Pane>
              <Tab.Pane eventKey="six">
                <PeopleKRA TabType={"jd"} userData={formData} />
              </Tab.Pane>
              <Tab.Pane eventKey="nine">
                <PeopleFNF userData={formData} />
              </Tab.Pane>
              <Tab.Pane eventKey="ten">
                <ReportingManager userData={formData} getEmployeeListFun={fetchCandidateData} />
              </Tab.Pane>
              <Tab.Pane eventKey="five">
                <EmployeeJourney userData={formData} />
              </Tab.Pane>
              <Tab.Pane eventKey="assets">
                <EmployeeAssets userData={formData} />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </>
  );
}
