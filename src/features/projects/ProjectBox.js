import React, { useMemo, useState } from 'react';
import { IoLocationOutline, IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import Dropdown from "react-bootstrap/Dropdown";
import BudgetModal from "./BudgetModal";
import ExtendDurationModal from "./ExtendDurationModal";
import { truncateWithEllipsis } from '../../utils/common';
import config from '../../config/config';
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaCog } from 'react-icons/fa';
import axios from 'axios';
import { apiHeaderToken } from '../../config/api_header';
import { toast } from 'react-toastify';
import SendMprProject from './SendMprModal';



const ProjectBox = (props) => {

    const itemData = props.data;

    const [modalShow, setModalShow] = useState(false);
    const [modalShowOne, setModalShowOne] = useState(false);
    const [openSendMpr, setOpenSetMpr] = useState(false);
    const [openSendMprData, setOpenSetMprData] = useState(null);
    const [loading, setLoading] = useState(false);

    const locationString = itemData && Array.isArray(itemData.location)
        ? itemData.location.map(item => item.name).join(' | ')
        : itemData.location;
    const truncatedLocationString = truncateWithEllipsis(locationString, 25);

    const userDetails = useMemo(() => {
        return JSON.parse(localStorage.getItem('admin_role_user')) || {}
    }, [])



    const logoImage = itemData && itemData.logo ? `${config.IMAGE_PATH}${itemData.logo}` : '';

    function formatNumber(value) {
        let str = value?.toString();
        let lastThree = str?.slice(-3);
        let otherNumbers = str?.slice(0, -3);
        if (otherNumbers !== '') {
            lastThree = ',' + lastThree;
        }
        let result = otherNumbers?.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return result;
    }

    const handleSendMPR = async (e, data) => {
        e.preventDefault()
        setOpenSetMpr(true);
        setLoading(true);
        try {
            let Payloads = {
                "_id": data?._id,
                "scope_fields": ["manager_list", "in_charge_list"]
            }

            let response = await axios.post(`${config.API_URL}getProjectById`, Payloads, apiHeaderToken(config.API_TOKEN));
            if (response.status === 200) {
                setOpenSetMprData(response.data?.data)
                setLoading(false);
            } else {
                console.log('response', response.data)
                setLoading(false);
            }

        } catch (error) {
            console.log('response', error)
            setLoading(false);

        }
    }

    return (
        <>
            <div className='projectbox'>
                <div className='d-flex justify-content-between'>
                    <div className='projname_img'>
                        {logoImage ? (
                            <img
                                src={logoImage}
                                width={'70px'}
                                alt={itemData?.title || 'Project logo'}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}

                        <div className='fallback-icon' style={{ display: logoImage ? 'none' : 'flex' }}>
                            <svg className="project-icon" viewBox="0 0 24 24">
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#4A90E2" />
                                        <stop offset="100%" stopColor="#5E60CE" />
                                    </linearGradient>
                                </defs>
                                <path
                                    fill="url(#gradient)"
                                    d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                                />
                                <path
                                    fill="#ffffff"
                                    fillOpacity="0.8"
                                    d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                                    transform="translate(0 2)"
                                />
                            </svg>
                        </div>
                        <Link to={`/add-project?id=${itemData._id}`}>
                            <div className='projtxt'>
                                <h4>{itemData && itemData.title}</h4>
                                <div className='dflexbtwn'>
                                    <p> <IoLocationOutline />
                                        {truncatedLocationString && truncatedLocationString}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className='project_ddn addedMobile'>
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
                                <Dropdown.Item href={`/employee-list?project_id=${itemData._id}&project_name=${itemData?.title}`}>
                                    <div className="d-flex flex-row">
                                        <span>Employee List</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item onClick={(e) => handleSendMPR(e, itemData)}>
                                    <div className="d-flex flex-row align-items-center">
                                        <span>Send MPR</span>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item href={`/manpower-acquisition-list?project_id=${itemData._id}&project_name=${itemData?.title}`}>
                                    <div className="d-flex flex-row">
                                        <span>MPR List</span>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <span className={itemData.status === 'Active' ? 'text-success' : 'text-danger dangerTextClose'}>
                            {itemData.status}
                        </span>
                    </div>
                </div>
                <div className='dflexbtwn prj_time'>
                    <p> Project Duration </p>
                    <p> {itemData && itemData.duration} </p>
                </div>
                <div className='budgettypes'>
                    <div className='budgtbx'>
                        <p>{formatNumber(itemData?.project_budget?.sanctioned ? itemData?.project_budget?.sanctioned : 0)}</p>
                        <span>Sanctioned Budget</span>
                    </div>
                    <div className='budgtbx'>
                        <p>{formatNumber(itemData?.project_budget?.utilized ? itemData?.project_budget?.utilized : 0)}</p>
                        <span>Utilized Budget</span>
                    </div>
                    <div className='budgtbx'>
                        <p>{formatNumber(itemData?.project_budget?.available ? itemData?.project_budget?.available : 0)}</p>
                        <span>Available Budget</span>
                    </div>
                </div>
            </div>
            <BudgetModal show={modalShow} id={itemData._id} onHide={() => setModalShow(false)} />
            <ExtendDurationModal show={modalShowOne} id={itemData._id} onHide={() => setModalShowOne(false)} />
            <SendMprProject open={openSendMpr} setOpenClosed={setOpenSetMpr} Data={openSendMprData} loadingFetch={loading} />
        </>
    );
};

export default ProjectBox;
