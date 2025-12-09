import React from 'react';
import Table from 'react-bootstrap/Table';
import EmpDropdown from './EmpDropdown';


const TeamTable = () => {
  return (
    <>
      <div className='emptable_wrap'>
        <Table className='emptable'>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Employee</th>
              <th>Type</th>
              <th>Check-In </th>
              <th>Check-Out </th>
              <th>Break Time</th>
              <th>Over Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'>
                  <a href='/candidate-profile'> Anshul Awasthi </a>
                </p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'> <a href='/candidate-profile'> Salini Shukla </a> </p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Tanmya B </a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-Contract</p></td>
              <td colSpan={4}>
                <div className="informed_leave">
                  <p>Leave (Request raised)</p>
                </div>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Anshul Awasthi </a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'>  Kunal A </a> </p>
                <span>Engineer</span>
              </td>
              <td><p>On-Contract</p></td>
              <td colSpan={4}>
                <div className="uninformed_leave">
                  <p>Absent (No intimation)</p>
                </div>
              </td>
              <td>
                <button>  <EmpDropdown /></button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Anshul Awasthi </a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Salini Shukla </a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Tanmya B</a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-Contract</p></td>
              <td colSpan={4}>
                <div className="informed_leave">
                  <p>Leave (Request raised)</p>
                </div>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Anshul Awasthi</a> </p>
                <span>Engineer</span>
              </td>
              <td><p>On-role</p></td>
              <td><p>10:00 am</p></td>
              <td>
                <p>19:00 pm</p>
              </td>
              <td>
                <p>1 hrs</p>
              </td>
              <td>
                <p>3 hrs</p>
              </td>
              <td>
                <button>  <EmpDropdown /> </button>
              </td>
            </tr>
            <tr>
              <td><p>EID100100</p></td>
              <td>
                <p className='empname'><a href='/candidate-profile'> Kunal A </a></p>
                <span>Engineer</span>
              </td>
              <td><p>On-Contract</p></td>
              <td colSpan={4}>
                <div className="uninformed_leave">
                  <p>Absent (No intimation)</p>
                </div>
              </td>
              <td>
                <EmpDropdown />
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TeamTable;
