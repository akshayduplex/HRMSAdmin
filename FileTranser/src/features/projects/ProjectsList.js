import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LuPlus } from "react-icons/lu";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ProjectBox from './ProjectBox';
import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import { Link } from 'react-router-dom';
import { fetchProjects, incrementPageNo } from '../slices/projectSlice';
import Button from 'react-bootstrap/esm/Button';
import Loader from '../loader/Loader';


const ProjectsList = () => {

const dispatch = useDispatch();
const { projects, hasMore, status } = useSelector( (state) => state.project ); 

useEffect(() => { 
     dispatch( fetchProjects() ); 
}, [dispatch]);

const handleViewMore = () => {
    dispatch( incrementPageNo() );
    dispatch( fetchProjects() ); 
};

  
return (
        <>
            <AllHeaders/>
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='dflexbtwn pgname_btns'>
                            <div className='pagename'>
                                <h3>Projects</h3>
                                <p>Current projects informations and tracking</p>
                            </div>
                            <div className='projctbtns'>
                            <Link to='/add-project'  className='lt_blue sitebtn'> <LuPlus /> Add Project </Link>
                            <Link to='/close-project'  className='tbtn sitebtn'> <IoMdCloseCircleOutline /> Close Project </Link>  
                            </div>
                        </div>
                    </div>
                    <div className='row'>
                        {projects && projects.map(( item ) => (
                            <div className='col-sm-4' key={item._id}>
                                <ProjectBox data={item} />
                            </div>
                        ))}
                        </div>
                    <div className='row'>
                        <div className='text-center'>
                            {hasMore && status === 'succeeded' && (
                            <Button onClick={handleViewMore} > 
                            { status === 'pending' ? <Loader /> : 'View More' }
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
