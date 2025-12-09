import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderTokenMultiPart, apiHeaderToken } from '../../config/api_header';
import { Link } from 'react-router-dom';



const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
    boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
    '&:hover': {
      borderColor: '#D2C9FF',
    },
    height: '44px',
  }),
  menu: (provided) => ({
    ...provided,
    borderTop: '1px solid #D2C9FF',
  }),
  option: (provided, state) => ({
    ...provided,
    borderBottom: '1px solid #D2C9FF',
    color: state.isSelected ? '#fff' : '#000',
    backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
  }),
};

const ManageAssessment = () => {
  const [assessmentType, setAssessmentType] = useState('');
  const [displayQuestions, setDisplayQuestions] = useState('');
  const [duration, setDuration] = useState('');
  const [markingPerQuestion, setMarkingPerQuestion] = useState('');
  const [minPassing, setMinPassing] = useState('');
  const [attempts, setAttempts] = useState('');
  const [readingDuration, setReadingDuration] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [img, setImg] = useState(null);
  const [status, setStatus] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!assessmentType) newErrors.assessmentType = 'Assessment Type is required';
    if (!displayQuestions || displayQuestions <= 0) newErrors.displayQuestions = 'Number of Display Questions is required';
    if (!duration || duration <= 0) newErrors.duration = 'Duration is required';
    if (!markingPerQuestion || markingPerQuestion <= 0) newErrors.markingPerQuestion = 'Marking Per Question is required';
    if (!minPassing || minPassing < 0) newErrors.minPassing = 'Minimum Passing Marks is required';
    if (!attempts || attempts <= 0) newErrors.attempts = 'Number of Attempts is required';
    if (!readingDuration || readingDuration <= 0) newErrors.readingDuration = 'Reading Duration is required';
    if (!selectedDepartment) newErrors.department = 'Department is required';
    if (!img) newErrors.img = 'xlsx is required';
    if (!status) newErrors.status = 'Status is required';
    if (!content) newErrors.content = 'Content is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append('content_type', assessmentType);
    formData.append('no_of_display_questions', displayQuestions);
    formData.append('duration', duration);
    formData.append('marking_per_question', markingPerQuestion);
    formData.append('min_passing', minPassing);
    formData.append('no_of_attempts', attempts);
    formData.append('reading_duration', readingDuration);
    formData.append('department', selectedDepartment.value);
    formData.append('filename', img);
    formData.append('status', status);
    formData.append('content', content);

    try {
      const response = await axios.post(
        `${config.API_URL}addAssessment`,
        formData,
        apiHeaderTokenMultiPart(config.API_TOKEN)
      );
      console.log(response.data);
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setAssessmentType('');
      setDisplayQuestions('');
      setDuration('');
      setMarkingPerQuestion('');
      setMinPassing('');
      setAttempts('');
      setReadingDuration('');
      setSelectedDepartment(null);
      setImg(null);
      setStatus('');
      setContent('');
      setErrors({});
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (fileExtension !== 'xlsx') {
        setErrors({ img: 'Only .xlsx files are allowed.' });
        setImg(null);
      } else {
        setErrors({});
        setImg(file);
      }
    }
  };

  const handleDownload = () => {
    const fileUrl = `/QuestionAnswerSheet.xlsx`;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = 'assessment_upload_format.xls.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDepartment = async () => {
    const payload = { status: 'Active' };
    try {
      let response = await axios.post(`${config.API_URL}getDepartmentList`, payload, apiHeaderToken(config.API_TOKEN));
      const options = response.data.data.map(dept => ({ value: dept.name, label: dept.name }));
      setDepartments(options);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="row">
            <div className="pagename">
              <h3>Manage Assessment</h3>
            </div>
          </div>
          <div className="row">
            <div className="sitecard">
              <div className="projectcard">
                <div className="dflexbtwn">
                  <h4 className="mb-3">Manage Assessment Details</h4>
                  {/* <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                        Submit
                      </Button> */}
                  <Link className='sitebtn btnblue text-center' to={'/assessment-list'}>
                    View List
                  </Link>
                </div>
                <Form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Assessment Type</Form.Label>
                        <Select
                          options={[
                            { value: 'MCQ', label: 'Employee Assessment Test' },
                            { value: 'Comprehensive', label: 'Organization MCQ' },
                          ]}
                          placeholder="Assessment Type"
                          value={assessmentType ? { value: assessmentType, label: assessmentType } : null}
                          onChange={(selectedOption) => setAssessmentType(selectedOption.value)}
                        />
                        {errors.assessmentType && <Form.Text className="text-danger">{errors.assessmentType}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Display Questions</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Number of Display Questions"
                          value={displayQuestions}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 3) {
                              setDisplayQuestions(value);
                            }
                          }}
                        />
                        {errors.displayQuestions && <Form.Text className="text-danger">{errors.displayQuestions}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Duration</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Duration"
                          value={duration}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 3) {
                              setDuration(value);
                            }
                          }}
                        />
                        {errors.duration && <Form.Text className="text-danger">{errors.duration}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Marking Per Question</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Marking Per Question"
                          value={markingPerQuestion}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 2) {
                              setMarkingPerQuestion(value);
                            }
                          }}
                        />
                        {errors.markingPerQuestion && <Form.Text className="text-danger">{errors.markingPerQuestion}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Min. Passing Marks</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Minimum Passing Marks"
                          value={minPassing}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 2) {
                              setMinPassing(value);
                            }
                          }}
                        />
                        {errors.minPassing && <Form.Text className="text-danger">{errors.minPassing}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>No. of Attempts</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Number of Attempts"
                          value={attempts}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 1) {
                              setAttempts(value);
                            }
                          }}
                        />
                        {errors.attempts && <Form.Text className="text-danger">{errors.attempts}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Reading Duration (in minutes)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter Reading Duration"
                          value={readingDuration}
                          onChange={(e) => {
                            const regex = /^\d*$/;
                            const value = e.target.value;
                            if (regex.test(value) && value.length <= 3) {
                              setReadingDuration(value);
                            }
                          }}
                        />
                        {errors.readingDuration && <Form.Text className="text-danger">{errors.readingDuration}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Department</Form.Label>
                        <Select
                          options={departments}
                          placeholder="Select Department"
                          value={selectedDepartment}
                          onChange={(selectedOption) => setSelectedDepartment(selectedOption)}
                          styles={customStyles}
                        />
                        {errors.department && <Form.Text className="text-danger">{errors.department}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Choose QA Sheet ,(<span style={{ cursor: 'pointer' }} onClick={handleDownload}>Download format</span>)</Form.Label>
                        <Form.Control
                          type="file"
                          accept=".xlsx"
                          onChange={handleFileChange}
                        />
                        {errors.img && <Form.Text className="text-danger">{errors.img}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <div className="d-flex">
                          <Form.Check
                            type="radio"
                            label="Active"
                            name="status"
                            value="Active"
                            id="statusActive"
                            className="me-3"
                            checked={status === 'Active'}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                          <Form.Check
                            type="radio"
                            label="Inactive"
                            name="status"
                            value="Inactive"
                            id="statusInactive"
                            checked={status === 'Inactive'}
                            onChange={(e) => setStatus(e.target.value)}
                          />
                        </div>
                        {errors.status && <Form.Text className="text-danger">{errors.status}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <div className="mb-3">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                          as="textarea"
                          placeholder="Write your content..."
                          style={{ height: '100px' }}
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                        />
                        {errors.content && <Form.Text className="text-danger">{errors.content}</Form.Text>}
                      </div>
                    </div>
                    <div className="col-sm-12 mb-3">
                      <Button className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                        Submit
                      </Button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ManageAssessment;