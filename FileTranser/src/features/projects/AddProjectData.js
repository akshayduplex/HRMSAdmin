import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaInfoCircle } from "react-icons/fa";
import { CiCalendar } from "react-icons/ci";
import Button from 'react-bootstrap/Button';
import { showAlert } from '../alert/alertSlice';
import Loader from '../loader/Loader';
import { CiImageOn } from "react-icons/ci";


import GoBackButton from '../goBack/GoBackButton';
import AllHeaders from '../partials/AllHeaders';
import { getHumanReadableDate } from '../../utils/common';
import { addProject, updateProject, fetchProjectById } from '../slices/projectSlice';
import { fetchHolidayListByDateRange } from '../slices/holidaysSlice';
import { searchLocation } from '../slices/locationsSlice';
import Select from 'react-select';
import config from '../../config/config';
import { toast } from 'react-toastify';
import { DaysDiff } from '../../utils/common';


const AddProjectData = () => {
    
    const [id, setId] = useState('');
    const [title, setTitle] = useState('');
    const [projectStatus, setProjectStatus] = useState('Active');
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [managerName, setManagerName] = useState('');
    const [inChargeName, setInChargeName] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [selectedLocationOptions, setSelectedLocationOptions] = useState([]);
    const [duration, setDuration] = useState('');
    const [fromDate,setFromDate] = useState(null);
    const [toDate, setToDate] =  useState(null);
    const [loading, setLoading] =  useState( false );
    const [apiToken,setApiToken] = useState(''); 
    const [holidayList, setHolidayList] = useState([]);
    const [oldFileName, setOldFileName ] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate(); 

    const { error, status } = useSelector((state) => state.project );
    const { userLogin } = useSelector((state) => state.auth ); 

   

    //handle file data
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0]; 
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
        if (selectedFile && !allowedTypes.includes(selectedFile.type)) {  
          event.target.value = null;  
          return dispatch(showAlert({ message: 'Only JPG and PNG files are allowed.', type: 'error' })) ;
        }
        

        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };


    const handleSubmit = (e)=>{
        e.preventDefault(); 
        if( !title ){
            return toast.warning('Please Enter Project Title')
        }
        else if( !selectedLocationOptions ){
            return toast.warning('Please Select Location')
        }
        else if( !managerName ){
            return toast.warning('Please Enter Manager Name')
        }
        else if( !inChargeName ){
            return toast.warning('Please Enter inCharge Name')
        }
        else if( !duration ){
            return toast.warning('Please Enter Project Duration')
        }
        else if( !fromDate ){
            return toast.warning('Please Enter Project Start Date')

        }
        else if( !toDate ){
            return toast.warning('Please Enter Project End Date')
        }

        else{ 
            const formData = new FormData();
            formData.append('title', title ); 
            formData.append('manager_name', managerName );
            formData.append('incharge_name', inChargeName );
            formData.append('duration', duration );
            formData.append('start_date', fromDate );
            formData.append('end_date', toDate );
            formData.append('filename', file ); 
            formData.append('old_filename', oldFileName ); 
            formData.append('status', projectStatus );

            const collectLocationsData = []; 
            selectedLocationOptions.forEach(item => { 
                collectLocationsData.push({ 'id': item.value , 'name': item.label } ); 
            });
            formData.append('location', JSON.stringify( collectLocationsData) ); 
            if( id ){
                formData.append('_id', id ); 
                dispatch( updateProject( { formData, token: apiToken} ) )
                .then( (result)=>{
                    if (result.meta.requestStatus === 'fulfilled') { 
                        getEditRecord( id );
                        // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'success' })) ;
                        return toast.success(error?error:result.payload.message)
                    }else{
                    // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                      return toast.error(error?error:result.payload.message)
                    }
                });
            }
            else{
                
                dispatch( addProject( { formData, token: apiToken} ) )
                .then( (result)=>{
                    if (result.meta.requestStatus === 'fulfilled') {  
                        setTimeout( ()=> navigate('/projects'), 500 );
                        // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'success' })) ;
                        return toast.success(error?error:result.payload.message)
                    }else{
                    //    return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                       return toast.success(error?error:result.payload.message)
                    }
                });
            } 
        } 
    }
 

useEffect( ()=>{ 
        if (status === 'loading') {
            setLoading( true ); 
        } 
        if(userLogin){
            setApiToken( userLogin.token );
        } 
},[status, userLogin ]);
 

/*********  fetch location from database **************/ 
  const handleChange = (selected) => {
    setSelectedLocationOptions(selected); 
  };

  const handleInputSelectChange = (newValue) => { 

    if( newValue !== '' && newValue.length > 2 ){
    const apiPayload = {'keyword':newValue,'page_no':'1','per_page_record':'11','scope_fields':["_id","name"],'status':'Active' }   
    dispatch( searchLocation( { params: apiPayload, token: apiToken } ) ) 
    .then((result)=>{
        if (result.meta.requestStatus === 'fulfilled' && result.payload.status  ) { 
            setLocationOptions(result.payload.data.map(option => ({
                    value: option._id,
                    label: option.name
            })));
        }
     });  
    return newValue;
    }
  };

  const handleLocationCreate = (inputValue) => { 
    const newOption = { value: inputValue, label: inputValue }; 
    setLocationOptions(prevOptions => [...prevOptions, newOption]);
    setSelectedLocationOptions(prevSelected => [...prevSelected, newOption]);
  };

/*********fetch  holiday  list ***********/
const fetchHolidayListData = useCallback(() => {
    if( fromDate && toDate ){
        const apiPayload = {from_date: fromDate,to_date: toDate,scope_fields:['name','schedule_date','year']};
        dispatch( fetchHolidayListByDateRange({ params: apiPayload, token: apiToken } ))
        .then( (result)=>{ 
            if( result.meta.requestStatus === 'fulfilled' && result.payload.status ){
                setHolidayList( result.payload.data );
            }else{
                setHolidayList([]);
            }
        })
    }
}, [dispatch, setHolidayList,fromDate , toDate , apiToken ]);


useEffect( () => {  
    if(fromDate && toDate){
        fetchHolidayListData();
    } 
},[fromDate, toDate , fetchHolidayListData ]);

// update the date
useEffect(() => {
    if(fromDate && toDate){
        setDuration(DaysDiff(fromDate , toDate))
    }
} , [fromDate, toDate])
 

/* fetch old image from url and load in preview*/
const handleFetchImage = useCallback( async(imageUrl ) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      if ( ['image/jpeg', 'image/png', 'image/jpg' ].includes(blob.type)) { 

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(blob);
      }else{
        setPreview([]);
      }
    } catch (error) {
      
    }
  },[]);

/*fetch Single Record From API*/
const getEditRecord = useCallback( ()=>{
    const apiPayload = {'_id': id, scope_fields:['title','logo','location','manager_name','status','incharge_name','start_date','end_date','duration'] }
    dispatch( fetchProjectById({ params : apiPayload, token: apiToken }))
    .then((result)=>{ 
        if (result.meta.requestStatus === 'fulfilled' && result.payload.status  ) { 
            const newDataContainer = result.payload.data;
            setId( newDataContainer._id );
            setTitle( newDataContainer.title );
            setProjectStatus( newDataContainer.status );
            setManagerName( newDataContainer.manager_name );
            setInChargeName( newDataContainer.incharge_name );
            setDuration( newDataContainer.duration );
            setOldFileName( newDataContainer.logo );
            setFromDate( getHumanReadableDate( newDataContainer.start_date , null, 'YYYY-MM-DD'));
            setToDate( getHumanReadableDate( newDataContainer.end_date , null, 'YYYY-MM-DD') );
            if( newDataContainer.location ){
                setLocationOptions([]);
                setSelectedLocationOptions([]);
                newDataContainer.location.forEach( item =>{
                    const newOption = { value: item.id, label: item.name }; 
                    setLocationOptions(prevOptions => [...prevOptions, newOption]);
                    setSelectedLocationOptions(prevSelected => [...prevSelected, newOption]);
                });
            }
             
            if( newDataContainer.logo ){
                handleFetchImage( `${config.IMAGE_PATH}${newDataContainer.logo}` );
            }
           
        }
    });
}, [handleFetchImage,setId,setTitle,setProjectStatus,setManagerName,setInChargeName,setDuration,setOldFileName,setFromDate,setToDate,setLocationOptions,setSelectedLocationOptions,dispatch,apiToken,id  ]);

useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get('id');
    setId( docId );
    getEditRecord( docId );
}, [getEditRecord,setId]);


    return (
        <>
            <AllHeaders/>
            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='row'>
                        <div className='pagename'>
                            <h3>{ id ? 'View Project' : 'Add Project' }</h3>
                            <p>Current projects information and tracking</p>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='sitecard'>
                            <div className='projectcard'>
                                <div className='dflexbtwn'>
                                    <h4 className='mb-3'>Project details</h4>
                                </div>
                                <Form>
                                    <div className='row'>
                                        <div className='col-sm-12 mb-3'>
                                        <div className='d-flex position-relative'>
                                            <div className='imgbox'>
                                                <CiImageOn />
                                                <p>Choose File</p>
                                            </div>
                                            {preview && (
                                                <div className='uploadedimg'>
                                                <img src={preview} alt="Preview" />
                                                </div>
                                            )}
                                            <div className='cstm_upload_text'>
                                                <label>Upload Logo</label>
                                                <span>Max file size 25kb. JPG or PNG format.</span>
                                                <button onClick={() => document.querySelector('input[type="file"]').click()}> Upload</button>
                                            </div>            
                                            <div className='fileup_btnhide'>
                                                <input type="file" onChange={handleFileChange} accept=".jpg, .jpeg, .png" />
                                            </div>

                                        </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='mb-3'>
                                                <Form.Label>Project Title</Form.Label>
                                                <Form.Control type="text" onChange={ (e)=>setTitle(e.target.value)} value={title} placeholder="Enter project title" />
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project Location</Form.Label>
                                                <Select
                                                    isMulti
                                                    value={selectedLocationOptions}
                                                    onChange={handleChange}
                                                    options={locationOptions}
                                                    onCreateOption={handleLocationCreate}
                                                    onInputChange={handleInputSelectChange}
                                                    isClearable
                                                    isSearchable  
                                                /> 
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project Manager</Form.Label>
                                                <Form.Control type="text" onChange={(e)=>setManagerName(e.target.value)} value={managerName} placeholder="Project Manager" />
                                            </div>
                                            <div className='mb-3'>
                                                <Form.Label>Project In-charge</Form.Label>
                                                <Form.Control type="text" onChange={(e)=>setInChargeName(e.target.value)} value={inChargeName} placeholder="Project In-charge" />
                                            </div>


                                            <Row className="mb-3"> 
                                                <Form.Group as={Col} controlId="formGridEmail">
                                                    <Form.Label>From</Form.Label>
                                                    <Form.Control type="date" onChange={(e)=>{ setFromDate(e.target.value); setToDate(e.target.value); setHolidayList([]); }} value={fromDate} placeholder="dd/mm/yyyy" />
                                                    <CiCalendar />
                                                </Form.Group>
                                                <Form.Group as={Col} controlId="formGridPassword">
                                                    <Form.Label>To</Form.Label>
                                                    <Form.Control type="date" onChange={(e)=>{ setToDate(e.target.value); setHolidayList([]); }} min={fromDate} value={toDate} placeholder="dd/mm/yyyy" />
                                                    <CiCalendar />
                                                </Form.Group>
                                            </Row>

                                            <div className='mb-3'>
                                                <Form.Label>Project Duration</Form.Label>
                                                <Form.Control type="text" onChange={(e)=>setDuration(e.target.value)} value={duration} placeholder="Project Duration" />
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='holidaywrap'>
                                                <label className='form-label'>Listed Holidays in selected project duration <FaInfoCircle /> </label>
                                                <div className='holidaybox'>  
                                                    {holidayList && holidayList.map((element, index) => ( 
                                                        <label htmlFor={`ckb${element._id}`} >
                                                        <input type="checkbox" id={`ckb${element._id}`} checked={ id && true}/>
                                                        <span>{element.name}- {element.schedule_date}</span>
                                                        </label>
                                                    ))}                                                     
                                                </div>
                                                <p>*Check the dates you want to list as public holiday.</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-12 mb-3'>
                                            <Button onClick={handleSubmit} disabled={loading} className="sitebtn btnblue fullbtn" variant="primary" type="submit">
                                            { loading ? <Loader /> : 'Save Project' }
                                            </Button> 
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default AddProjectData;
