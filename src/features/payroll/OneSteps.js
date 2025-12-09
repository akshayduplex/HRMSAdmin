import React from 'react';
import Table from 'react-bootstrap/Table';

const StepOne = () => {
  return (
    <>
      <div className='steppr_content_wrap'>
        <h4>Pay Period & Employee</h4>
        <div className='payroll_tables'>
          <Table className='emptable'>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Total Days</th>
                <th>Overtime </th>
                <th>Payment Method </th>
                <th>Work Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                </td>
                <td>
                  <p>32 </p>
                </td>
                <td>--</td>
                <td><p>Digital Transfer</p></td>
                <td>
                  <p>On-role</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                </td>
                <td>
                  <p>32 </p>
                </td>
                <td>--</td>
                <td><p>Digital Transfer</p></td>
                <td>
                  <p>On-role</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                </td>
                <td>
                  <p>32 </p>
                </td>
                <td>--</td>
                <td><p>Digital Transfer</p></td>
                <td>
                  <p>On-role</p>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                </td>
                <td>
                  <p>32 </p>
                </td>
                <td>--</td>
                <td><p>Digital Transfer</p></td>
                <td>
                  <p>On-role</p>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default StepOne;
