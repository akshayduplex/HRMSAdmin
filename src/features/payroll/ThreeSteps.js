import React from 'react';
import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';

const StepThree = () => {
  return (
    <>
      <div className='steppr_content_wrap' data-aos="fade-in" data-aos-duration="3000">
        <h4>Time Off</h4>
        <div className='payroll_tables'>
          <Table className='emptable'>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Paid Time Off</th>
                <th>Paid Holiday </th>
                <th>Sick Leave </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                  <p>FTE - 3.6 L per annum</p>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                  <p>FTE - 3.6 L per annum</p>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                  <p>FTE - 3.6 L per annum</p>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <p>Anshul Awasthi</p>
                  <p>FTE - 3.6 L per annum</p>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                  <InputGroup>
                    <Form.Control aria-label="" />
                    <InputGroup.Text>Days</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default StepThree;
