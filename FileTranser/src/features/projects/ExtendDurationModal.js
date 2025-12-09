import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CiCalendar } from "react-icons/ci";
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import { extendProjectDuration } from '../slices/projectSlice';
import { fetchProjects } from "../slices/projectSlice";
import Loader from '../loader/Loader';
import { getHumanReadableDate } from "../../utils/common";
import { toast } from "react-toastify";
import moment from "moment";

const ExtendDurationModal = (props) => {

    const dispatch = useDispatch();
    const { error, status, projects } = useSelector((state) => state.project );
    const { userLogin } = useSelector((state) => state.auth ); 

    const [ docId, setDocId ] = useState( props.id );
    const [ fromDate, setFromDate ] = useState('');
    const [ toDate, setToDate ] = useState('');
    const [ apiToken, setApiToken ] = useState(''); 
    const [ loading, setLoading ] =  useState( false );
    const [ extendedList, setExtendedList ] = useState([]);
    const [getDetails , setDetails] = useState([]);  

    console.log(props , 'this is Extended List data');


    const HandleFormSubmit = (e)=>{
        e.preventDefault(); 
        if( !fromDate ){
            return toast.warning('Please Select From Date');
        }
        if( !toDate ){
            return toast.warning('Please Select To Date');
        }     
        setLoading( true );
        const apiPayload = {'_id':docId ,'from_date': fromDate, 'to_date': toDate }
        dispatch( extendProjectDuration( { params: apiPayload, token: apiToken} ) )
        .then( (result)=>{
            setLoading( false );
            setFromDate('');
            setToDate('');
            if (result.meta.requestStatus === 'fulfilled') {
                // return dispatch(showAlert({ message: result.payload.message, type: 'success' })) ;
                dispatch( fetchProjects() )
                return toast.success(result.payload.message);
            }else{
                // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                return toast.warning(error?error:result.payload.message);
            }
        });
    }


useEffect( ()=>{ 
    if (status === 'loading') {
        setLoading( true ); 
    }
    if(userLogin){
        setApiToken( userLogin.token );
    }
    if( props.id ){
        setDocId( props.id );
    }
    if( projects && typeof projects !== 'undefined' ){
        const getSingleData = projects.find( (item) => item._id === docId  );  
        setDetails(getSingleData)
        if( typeof getSingleData.extend_date_list !== 'undefined' ){
            setExtendedList( getSingleData.extend_date_list );
        } 
    }

},[status, userLogin, props, setExtendedList, projects , docId ]);


useEffect(() => {
    if (extendedList && extendedList.length > 0) {
        const initialFromDate = moment(extendedList[0]?.from).format("YYYY-MM-DD"); 
        const initialToDate = moment(extendedList[0]?.to).format("YYYY-MM-DD");
        setFromDate(initialFromDate); 
        setToDate(initialToDate); 
    }else {
        let initialFromDate = moment(getDetails?.end_date).format("YYYY-MM-DD");
        setFromDate(initialFromDate)
    }
}, [extendedList , getDetails]);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Project Extension
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4 proj_extns">
                <div className="col-sm-12">
                    <Form className="proj_extn_row">
                        <Row className="">
                            <h6>Set Extension</h6>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>From</Form.Label>
                                <Form.Control type="date" onChange={ (e)=>{ setFromDate ( e.target.value ); setToDate(e.target.value); }} value={fromDate} placeholder="dd/mm/yyyy" />
                                <CiCalendar />
                            </Form.Group>
                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>To</Form.Label>
                                <Form.Control type="date" onChange={ (e)=>{ setToDate ( e.target.value )}} value={toDate} placeholder="dd/mm/yyyy" />
                                <CiCalendar />
                            </Form.Group>
                        </Row>
                        <div className="text-center">
                            <Button onClick={HandleFormSubmit} className="sitebtn mt-4 btn btn-primary ratebtn" variant="primary" type="submit">
                                 <span>Submit</span>
                            </Button> 
                        </div>
                    </Form>
                </div>
                <h6 className="mt-4"> Previous Extension</h6>
                <div className="modaltbl">
                    {extendedList && (
                    <Table  hover>
                        <thead>
                            <tr>
                                <th>Sno.</th>
                                <th>Extension From</th>
                                <th>Extension To</th>
                                <th>Updated on</th>
                            </tr>
                        </thead>
                        <tbody>
                        {extendedList && extendedList.length > 0 ? (
                            extendedList.map((item, index) => (
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{getHumanReadableDate(item.from, null, 'DD/MM/YYYY')}</td>
                            <td>{getHumanReadableDate(item.to, null, 'DD/MM/YYYY')}</td>
                            <td>{getHumanReadableDate(item.add_date, null, 'DD/MM/YYYY')}</td>
                            </tr>
                            ))
                            ) : (
                            <tr>
                            <td colSpan="4">No Record Found</td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                   )}
                </div>
            </Modal.Body>
        </Modal>
    );
}


export default ExtendDurationModal;
