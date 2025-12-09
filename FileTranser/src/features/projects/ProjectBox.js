import React, { useState } from 'react';
import { IoLocationOutline, IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Dropdown from "react-bootstrap/Dropdown";
import BudgetModal from "./BudgetModal";
import ExtendDurationModal from "./ExtendDurationModal";
import { truncateWithEllipsis } from '../../utils/common';
import config from '../../config/config';
import { IoMdCloseCircleOutline } from "react-icons/io";



const ProjectBox = (props) => {

    const itemData = props.data;

    const [modalShow, setModalShow] = useState(false);
    const [modalShowOne, setModalShowOne] = useState(false);

    const locationString = itemData && Array.isArray(itemData.location)
        ? itemData.location.map(item => item.name).join(' | ')
        : itemData.location;

    console.log(itemData, 'this is Project Data');

    const truncatedLocationString = truncateWithEllipsis(locationString, 25);

    const logoImage = itemData && itemData.logo ? `${config.IMAGE_PATH}${itemData.logo}` : '';

    return (
        <>
            <div className='projectbox'>
                <div className='d-flex justify-content-between'>
                    <div className='projname_img'>
                        <img src={logoImage} width={'70px'} alt={itemData && itemData.title} />
                        <Link to={`/add-project?id=${itemData._id}`}>
                            <div className='projtxt'>
                                <h4>{itemData && itemData.title}</h4>
                                <p> <IoLocationOutline />
                                    {truncatedLocationString && truncatedLocationString}
                                </p>
                                <span className={itemData.status === 'Active' ? 'text-success' : 'text-danger'}>
                                    {itemData.status}
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className='project_ddn'>
                        <Dropdown>
                            <Dropdown.Toggle id="dropdown-basic">
                                <IoSettingsOutline />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="py-2 prj_dropdown mt-2">
                                <Dropdown.Item>
                                    <div className="d-flex flex-row">
                                        <span onClick={() => setModalShowOne(true)}>Set Project Extension</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item>
                                    <div className="d-flex flex-row">
                                        <span onClick={() => setModalShow(true)}>Set Budget</span>
                                    </div>
                                </Dropdown.Item>
                                {/* <Dropdown.Item href={`/close-project?id=${itemData._id}`}>
                                    <div className="d-flex flex-row">
                                        <span>Close Project</span>
                                    </div>
                                </Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
                <div className='dflexbtwn prj_time'>
                    <p> Project Duration </p>
                    <p> {itemData && itemData.duration} </p>
                </div>
            </div>
            <BudgetModal show={modalShow} id={itemData._id} onHide={() => setModalShow(false)} />
            <ExtendDurationModal show={modalShowOne} id={itemData._id} onHide={() => setModalShowOne(false)} />
        </>
    );
};

export default ProjectBox;
