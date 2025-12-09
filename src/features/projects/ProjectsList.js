import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuPlus } from "react-icons/lu";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ProjectBox from './ProjectBox';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import { fetchProjects, incrementPageNo } from '../slices/projectSlice';
import Button from 'react-bootstrap/esm/Button';
import { InfinitySpin } from 'react-loader-spinner';
import { useDebounce } from 'use-debounce';
import { Link } from 'react-router-dom';
import { Form, InputGroup } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';

const ProjectsList = () => {
    const dispatch = useDispatch();
    const { hasMore, status, projectList } = useSelector((state) => state.project);
    const [searchKeyWord, setProjectKeyword] = useState('')
    const [debouncedInput] = useDebounce(searchKeyWord, 500);

    console.log( hasMore , 'this is hasMore' )


    const [buttonLoading, setButtonLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        // Fetch data initially
        const fetchData = async () => {
            await dispatch(fetchProjects());
            setInitialLoad(false); // Set initial load to false after fetching
        };
        fetchData();
    }, [dispatch]);

    const handleViewMore = async () => {
        setButtonLoading(true); // Start button loader
        await dispatch(incrementPageNo());
        setButtonLoading(false); // Stop button loader when done
    };

    useEffect(() => {

        const fetchData = async () => {
            await dispatch(fetchProjects(debouncedInput));
        };
        fetchData();
    }, [debouncedInput, dispatch]);


    return (
        <>
            {/* <AllHeaders /> */}
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='dflexbtwn pgname_btns'>
                            <div className='pagename'>
                                <h3>Projects</h3>
                                <p>Current projects information and tracking</p>
                            </div>
                            <div className='row'>

                                <div className='col-sm-12 col-lg-4 col-md-4 mb-2'>

                                <Form.Group className="" controlId="alt_email">
                                    <InputGroup>
                                        <InputGroup.Text>
                                            <FiSearch />
                                        </InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            placeholder="Search By Project Name....."
                                            name="project_name"
                                            value={searchKeyWord}
                                            onChange={(e) => setProjectKeyword(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>

                                </div>


                                <div className='col-sm-12 col-lg-4 col-md-4 mb-2'>

                                  <Link to='/add-project' className='lt_blue sitebtn text-start w-100'> <LuPlus /> Add Project </Link>

                                </div>

                                <div className='col-sm-12 col-lg-4 col-md-4 mb-2'> 
                                   <Link to='/close-project' className='tbtn sitebtn text-start w-100'> <IoMdCloseCircleOutline /> Close Project </Link>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {initialLoad || status === 'loading' ? ( // Show loader if initial loading or status is loading
                            <div className="d-flex align-content-center justify-content-center">
                                <InfinitySpin
                                    visible={true}
                                    width="350"
                                    color="#29166F"
                                    ariaLabel="infinity-spin-loading"
                                />
                            </div>
                        ) : (
                            projectList && projectList?.data ? projectList.data.map((item) => (
                                <div className='col-sm-4' key={item._id}>
                                    <ProjectBox data={item} />
                                </div>
                            )) :
                            <div className="d-flex align-content-center justify-content-center">
                            <img
                               src='/pageNotFound.png'
                               alt='Project Not Found'
                               height={'300px'}
                               width={'300px'}
                            />
                        </div>
                        )}
                    </div>
                    <div className='row'>
                        <div className='text-center'>
                            {hasMore && status === 'succeeded' && (
                                <Button onClick={handleViewMore} disabled={buttonLoading}>
                                    {buttonLoading ? 'Loading...' : 'View More'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectsList;
