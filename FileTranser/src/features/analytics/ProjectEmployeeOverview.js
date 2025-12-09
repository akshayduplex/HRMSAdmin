import React from 'react';
import { Link } from 'react-router-dom';
import BootstrapProgressBar from './BootstrapProgressBar';

const ProjectEmployeeOverview = () => {

    return (
        <>
            <div className='tablelike_data'>
                <div className='tbl_head_fixed d-flex'>
                    <h4>Project</h4>
                    <h4>Total Employee</h4>
                    <h4>Due for Appraisal</h4>
                    <h4>Due for Retrenchend</h4>
                </div>
                <div className='project_data_wraps'>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={30} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={50} actualvalue={450} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={356} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={500} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Analytica</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={30} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={26} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Gail-Odisa</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={40} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Marq</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={56} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Vardhan</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={30} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={34} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={36} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Kaveri Yojna</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={39} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={23} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={46} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={40} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={56} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={30} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={34} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={36} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={39} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={23} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={46} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={40} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={56} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={30} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={60} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={34} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={36} actualvalue={122} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Salespush</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={39} actualvalue={150} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={33} actualvalue={130} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={20} actualvalue={160} />
                        </div>
                    </div>
                    <div className='proj_data_row d-flex'>
                        <div className='proj-name'>
                            <Link to="/#">Cloud Space</Link>
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={23} actualvalue={170} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={43} actualvalue={290} />
                        </div>
                        <div className='br_chart'>
                            <BootstrapProgressBar value={46} actualvalue={122} />
                        </div>
                    </div>

                </div>
            </div>
        </>
    );

};

export default ProjectEmployeeOverview;
