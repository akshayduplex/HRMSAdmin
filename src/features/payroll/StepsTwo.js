import React from 'react';
import Table from 'react-bootstrap/Table';
import { CiClock1 } from 'react-icons/ci';
import { CiEdit } from 'react-icons/ci';
import Form from 'react-bootstrap/Form';
// import Overtime_Dropdown from './Overtime-dropdown';
import TotalHoursDropdown from './TotalHoursDropDown';
// import Reimburse_Dropdown from './Add-reimbursement';
import ReimburseDropdown from './ReimburseDropDown';
import { IoAdd } from "react-icons/io5";

const StepTwo = () => {
  return (
    <>
      <div className='steppr_content_wrap' data-aos="fade-in" data-aos-duration="3000">
        <h4>Employee Work Detail</h4>
        <div className='payroll_tables'>
          <Table className='emptable'>
            <thead>
              <tr>
                <th>Employee Details</th>
                <th>Work Details,</th>
                <th>Reimbursement </th>
                <th>Total Pay </th>
                {/* <th>Payment Type</th> */}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p><strong>Name</strong>: Anshul Awasthi</p>
                  <p><strong>ID</strong>: 00123</p>
                </td>
                <td>
              
                  <p className='hours_count'>
                    <span><strong>P</strong>:20</span>|<span><strong>A</strong>:4</span>|<span><strong>L</strong>:4</span>
                  </p>
                  {/* <p className='hours_count'>
                    <span><strong>A</strong>: 4</span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>L</strong>: 4</span>
                  </p> */}
                    {/* <TotalHoursDropdown /> */}
                </td>
                <td>
                  <ReimburseDropdown />
                </td>
                <td> 35000.00</td>
                {/* <td>
                  <Form.Select className='payroll_selct' aria-label="Default select example">
                    <option value="1">Direct Deposit</option>
                    <option value="2">Cash</option>
                  </Form.Select>
                </td> */}
              </tr>
              <tr>
                <td>
                <p><strong>Name</strong>: Anshul Awasthi</p>
                <p><strong>ID</strong>: 00123</p>
                </td>
                <td>
                <p className='hours_count'>
                  <span><strong>P</strong>: 20 </span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>A</strong>: 4</span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>L</strong>: 4</span>
                  </p>

                </td>
                <td>
                  <ReimburseDropdown />
                </td>
                <td> 35000.00</td>
                {/* <td>
                  <Form.Select className='payroll_selct' aria-label="Default select example">
                    <option value="1">Direct Deposit</option>
                    <option value="2">Cash</option>
                  </Form.Select>
                </td> */}
              </tr>
              <tr>
                <td>
                <p><strong>Name</strong>: Anshul Awasthi</p>
                <p><strong>ID</strong>: 00123</p>
                </td>
                <td>
                <p className='hours_count'>
                  <span><strong>P</strong>: 20 </span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>A</strong>: 4</span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>L</strong>: 4</span>
                  </p>

                </td>
                <td>
                  <ReimburseDropdown />
                </td>
                <td> 35000.00</td>
                {/* <td>
                  <Form.Select className='payroll_selct' aria-label="Default select example">
                    <option value="1">Direct Deposit</option>
                    <option value="2">Cash</option>
                  </Form.Select>
                </td> */}
              </tr>
              <tr>
                <td>
                <p><strong>Name</strong>: Anshul Awasthi</p>
                <p><strong>ID</strong>: 00123</p>
                </td>
                <td>
                  <p className='hours_count'>
                  <span><strong>P</strong>: 20 </span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>A</strong>: 4</span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>L</strong>: 4</span>
                  </p>
                </td>
                <td>
                  <ReimburseDropdown />
                </td>
                <td> 35000.00</td>
                {/* <td>
                  <Form.Select className='payroll_selct' aria-label="Default select example">
                    <option value="1">Direct Deposit</option>
                    <option value="2">Cash</option>
                  </Form.Select>
                </td> */}
              </tr>
              <tr>
                <td>
                <p><strong>Name</strong>: Anshul Awasthi</p>
                <p><strong>ID</strong>: 00123</p>
                </td>
                <td>
                <p className='hours_count'>
                  <span><strong>P</strong>: 20 </span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>A</strong>: 4</span>
                  </p>
                  <p className='hours_count'>
                    <span><strong>L</strong>: 4</span>
                  </p>

                </td>
                <td>
                  <ReimburseDropdown />
                </td>
                <td> 35000.00</td>
                {/* <td>
                  <Form.Select className='payroll_selct' aria-label="Default select example">
                    <option value="1">Direct Deposit</option>
                    <option value="2">Cash</option>
                  </Form.Select>
                </td> */}
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default StepTwo;
