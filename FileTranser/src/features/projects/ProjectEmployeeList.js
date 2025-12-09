import React from 'react';
import Table from 'react-bootstrap/Table';
import { Link } from 'react-router-dom';

const ProjectEmployeeList = () => {

    return (
        <>
            <div className='emptable_wrap'>
                <Table className='emptable'>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee</th>
                            <th>Type</th>
                            <th>Designation </th>
                            <th>Attendance </th>
                            <th>Payout</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">Anshul Awasthi </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#" >Omar S </Link>
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">K D Singh </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">Dhawal Tej </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">Neha Singh </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">Farhan S </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">Meeta Jaiswal </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                        <tr>
                            <td><p>EID100100</p></td>
                            <td>
                                <p className='empname'>
                                    <Link to="#">G K Joshi </Link> 
                                </p>
                            </td>
                            <td><p>On-role</p></td>
                            <td><p>Assistance Manager</p></td>
                            <td>
                                <p>26</p>
                            </td>
                            <td>
                                <p>66000.00</p>
                            </td>
                        </tr>
                    </tbody> */}
                    <tbody>
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>Data not available</td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        </>
    );
};

export default ProjectEmployeeList;
