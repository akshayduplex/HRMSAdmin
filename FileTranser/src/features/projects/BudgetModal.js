import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { MdOutlineCurrencyRupee } from "react-icons/md";
import InputGroup from 'react-bootstrap/InputGroup';
//import BudgetFields from "./BudgetFields";

import Table from 'react-bootstrap/Table'; 
import Button from 'react-bootstrap/Button';

import { showAlert } from '../alert/alertSlice';
import Loader from '../loader/Loader';


import { fetchDesignationList } from '../slices/designationSlice';
import { saveProjectBudget } from '../slices/projectSlice';
import { toast } from "react-toastify";

 
const BudgetModal = (props) => {
    const dispatch = useDispatch();
    const { error, status, projects } = useSelector((state) => state.project);
    const { designations } = useSelector((state) => state.designation);
    const { userLogin } = useSelector((state) => state.auth ); 

    const [designationList, setDesignationList] = useState([]); 
    const [docId, setDocId] = useState(props.id);
    const [loading, setLoading] = useState(false);  
    const [finalSum, setFinalSum] = useState(0);
    const [ budgetList, setBudgetList ] = useState([]); 
    const [ apiToken, setApiToken ] = useState('');  



    /********** Load Designation List *******/
    const manageDesignationList = useCallback(() => { 
        if (designations.length === 0) { 
            const apiPayload = { 'per_page_record': 200 };
            dispatch(fetchDesignationList({ 'params': apiPayload }))
                .then((result) => {
                    if (result.meta.requestStatus === 'fulfilled' && result.payload.status) {  
                        return;
                    } else {
                        // return dispatch(showAlert({ message: error ? error : result.payload.message, type: 'error' }));
                        return toast.error(error ? error : result.payload.message)
                    }
                });
        }
    }, [dispatch, error, designations]);

    useEffect(() => { 
        manageDesignationList();
    }, [manageDesignationList]);

    
    
    const [rows, setRows] = useState([{ id: 0, designation: '', no_of_positions: '', ctc: '' }]);
    const handleAddRow = () => {
        setRows([...rows, { id: rows.length, designation: '', no_of_positions: '', ctc: '' }]);
    };

    const handleRemoveRow = (id) => {
        setRows(rows.filter(row => row.id !== id));
    };

    const handleInputChange = (id, name, value) => {
        setRows(rows.map(row => row.id === id ? { ...row, [name]: value } : row));
    };

    const calculateSum = useCallback((row) => {
        const no_of_positions = parseInt(row.no_of_positions, 10) || 0;
        const ctc = parseInt(row.ctc, 10) || 0;
        return no_of_positions * ctc;
    },[]);

    const calculateFinalSum = useCallback(() => {
        const total = rows.reduce((sum, row) => sum + calculateSum(row), 0);
        setFinalSum(total);
    }, [setFinalSum,rows,calculateSum] );
 

    useEffect( ()=>{
        if( designations ){
            setDesignationList( designations );
        }
        calculateFinalSum();
        if (status === 'loading') {
            setLoading( true ); 
        }
        if(userLogin){
            setApiToken( userLogin.token );
        }
        if( props.id ){
            setDocId( props.id );
        }

    },[designations, setDesignationList, calculateFinalSum, status , props, setLoading , userLogin, setApiToken ]);
  

    useEffect( ()=>{ 

        if( projects && typeof projects !== 'undefined' ){
            const getSingleData = projects.find( (item) => item._id === docId  );  
            if( typeof getSingleData.budget_estimate_list !== 'undefined' && getSingleData.budget_estimate_list.length > 0 ){
                const createNewPayload = getSingleData.budget_estimate_list.map((item, index)=>({
                    id: index,
                    designation : item.designation,
                    no_of_positions : item.no_of_positions,
                    ctc : item.ctc
                }));
                setRows( createNewPayload );
                setBudgetList( getSingleData.budget_estimate_list );
            }
        }

    },[setBudgetList,projects,docId,setRows]);
  


    //submit form code goes here 
    const HandleFormSubmit = (e)=>{
        e.preventDefault(); 
        const validationErrors = validateRows ( rows );
        const hasErrors = validationErrors.length > 0 ? validationErrors[0] : '';

        if (hasErrors) { 
            // return dispatch(showAlert({ message: hasErrors, type: 'error' })) ;
            return toast.error(hasErrors)
        }else{

            setLoading( true );
            const createNewPayload = rows.map((item, index)=>({ 
                designation : item.designation,
                no_of_positions : item.no_of_positions,
                ctc : item.ctc,
                total_ctc : calculateSum(item)
            }));
            
            const apiPayload = {'_id': docId , 'budget_list': createNewPayload, 'total_budget': finalSum }
            dispatch( saveProjectBudget( { params: apiPayload, token: apiToken} ) )
            .then( (result)=>{
                setLoading( false ); 
                if (result.meta.requestStatus === 'fulfilled') {
                    // return dispatch(showAlert({ message: result.payload.message, type: 'success' })) ;
                    return toast.success(result.payload.message)
                }else{
                    // return dispatch(showAlert({ message: error?error:result.payload.message, type: 'error' })) ;
                    return toast.error(error?error:result.payload.message)
                }
            });
        }
    }
    

    const validateRows = (rows) => {
        const errors = [];
    
        rows.forEach((row, index) => {
            const rowErrors = [];

            if (!row.designation) {
                rowErrors.push('Designation is required');
            }

            if (!row.no_of_positions) {
                rowErrors.push('Number of positions is required');
            } else if (isNaN(row.no_of_positions) || row.no_of_positions <= 0) {
                rowErrors.push('Number of positions must be a positive number');
            }
    
            if (!row.ctc) {
                rowErrors.push('Salary is required');
            } else if (isNaN(row.ctc) || row.ctc <= 0) {
                rowErrors.push('Salary must be a positive number');
            }             
    
            if (rowErrors.length > 0) {
                errors.push( rowErrors );
            }
        });
    
        return errors;
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Set Budget
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="py-4">
                <div className="col-sm-12">
                    <div className="totl_budget">
                        <h6>Total Estimated budget</h6>
                        <p className="budgetvalue"><MdOutlineCurrencyRupee />{finalSum}</p>
                    </div>
                    <Form>
                        <div className='budgetrow_btn'>
                        {rows.map(row => (
                            <div className={`d-flex align-items-center budgetfield_row mb-4 certificationblock-${row.id}`} key={row.id}>
                                <div className="desig_fld">
                                    <Form.Group controlId={`designation-${row.id}`}>
                                        <Form.Label>Select Designation</Form.Label>
                                        <Form.Select aria-label="Default select example" defaultValue={row.designation} onChange={(e) => handleInputChange(row.id, 'designation', e.target.value)}>
                                            <option value="">--Select--</option>
                                            {designationList && designationList.map((field, index) => (
                                               <option key={index} value={field.name}>
                                               {field.name}
                                               </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </div>
                                <div className="num_postn">
                                    <Form.Label>No. of Positions</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="1"
                                        value={row.no_of_positions}
                                        onChange={(e) => handleInputChange(row.id, 'no_of_positions', e.target.value)}
                                    />
                                </div>
                                <div className="ctc_fld">
                                    <Form.Label>Enter CTC</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text id=""><MdOutlineCurrencyRupee /></InputGroup.Text>
                                        <Form.Control
                                            placeholder="00"
                                            aria-describedby=""
                                            value={row.ctc}
                                            onChange={(e) => handleInputChange(row.id, 'ctc', e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                                <div className="ctc_brkup">
                                    <Form.Label>CTC Breakup</Form.Label>
                                    <Form.Control type="text" value={calculateSum(row)} disabled />
                                </div>
                                <Button className='subtbtn' type='button' onClick={() => handleRemoveRow(row.id)}>-</Button>
                            </div>
                        ))}
           
                        <Button className='addbtn' type='button' onClick={handleAddRow}>+</Button>
                        </div>
                        <div className="text-center">
                            <Button onClick={HandleFormSubmit}  className="sitebtn mt-4 btn btn-primary ratebtn" variant="primary" type="button">
                                <span>Submit</span>
                            </Button>
                        </div>
                    </Form>
                </div>
                <h6 className="mt-4"> Budget Estimate</h6>
                <div className="modaltbl">
                {budgetList && (
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Sno.</th>
                                <th>Designation</th>
                                <th>No. of Positions</th>
                                <th>CTC</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                        {budgetList && budgetList.length > 0 ? (
                            budgetList.map((item, index) => (
                            <tr key={index} >
                                <td>{index + 1}</td>
                                <td><td>{item.designation}</td></td>
                                <td>{item.no_of_positions}</td>
                                <td>{item.ctc}</td>
                                <td>{item.total_ctc}</td>
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


export default BudgetModal;
