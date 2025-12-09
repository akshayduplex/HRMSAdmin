import React, { useEffect, useState } from 'react';
import GoBackButton from '../goBack/GoBackButton';
import CeoNavbarComponent from './CeoNavbar';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import CircularProgressWithLabel from '../job/JobCartsDetails/CirculProgressBar';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { InfinitySpin } from 'react-loader-spinner';
import SearchInput from './SearchBox';

const DeBouncingForSearch = (search) => {

    const [DebounceKey, setDeBounceKey] = useState('');

    useEffect(() => {

        let timer = setTimeout(() => {
            setDeBounceKey(search);

        }, 500);

        return () => {
            clearTimeout(timer);
        }

    }, [search])

    return DebounceKey
}

const ListOfInterviewedCandidateOfCeo = () => {

    const [candidate, setCandidate] = useState(null)
    const [searchParams] = useSearchParams()
    const [loader, setLoader] = useState(false)
    const [paginations, setPaginations] = useState(12);
    const [hasMoreStatus, setHasMoreStatus] = useState(false);
    const [search, setSearch] = useState('');
    const searchParamswithData = DeBouncingForSearch(search)


    useEffect(() => {

        if (searchParams.get('type')) {
            (async () => {

                try {
                    const type = searchParams.get('type')
                    const payloads = {
                        "keyword": searchParamswithData,
                        "page_no": "1",
                        "per_page_record": "1000",
                        "scope_fields": [],
                        "filter_type": type,
                        "job_id": ""
                    }

                    setLoader(true)

                    const response = await axios.post(`${config.API_URL}getApplyJobListCeo`, payloads, apiHeaderToken(config.API_TOKEN))

                    if (response.status === 200) {
                        setCandidate(response.data.data)
                    }

                } catch (error) {

                    console.log(error)

                }
                finally {
                    setLoader(false)
                }

            })()
        }

    }, [searchParams, paginations , searchParamswithData])



    const hasMore = () => {
        let increasePageSize = paginations + 9
        setPaginations(increasePageSize)
    }

    useEffect(() => {
        if (candidate?.length) {

            let total = candidate?.length

            if (paginations <= total) {
                setHasMoreStatus(true)
            } else {
                setHasMoreStatus(false)
            }
        }
    }, [candidate?.length])


    return (
        <>
            {/* <CeoNavbarComponent /> */}

            <div className="maincontent">
                <div className="container hrdashboard" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div className='dflexbtwn'>
                        <div className='pagename'>
                            <h3>List of Interview(s) Candidates</h3>
                            <p> Interview(s) Candidates {searchParams.get('type')} Feedback Lisitng  </p>
                        </div>

                        <div className='pb-3 cardsearch'>
                            <SearchInput
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onClear={() => setSearch('')}
                            />
                        </div>
                    </div>

                    <Row xs={1} md={2} lg={3} className="g-4">

                        {
                            loader ? <div className="d-flex align-content-center justify-content-center">
                                <InfinitySpin
                                    visible={true}
                                    width="200"
                                    color="#4fa94d"
                                    ariaLabel="infinity-spin-loading"
                                /> </div> :

                                candidate && candidate?.length > 0 ? candidate?.map((item, idx) => {
                                    return (
                                        <>
                                            <Col key={item._id || idx}>
                                                <Card className="h-100 mprcards">
                                                    <Card.Body>
                                                        <Card.Title className="mb-2 h6"> <span className='colorbluesite'>Applied for:</span> <span className='text-sitecolor'>{item?.job_title}</span> </Card.Title>
                                                        <div className='cardtxt'>
                                                            <p><strong>Candidate Name:</strong> <span>{item?.name}</span></p>
                                                            <p><strong>Email:</strong> <span>{item?.email}</span></p>
                                                            <p><strong>Mobile Number:</strong> <span>{item?.mobile_no}</span></p>
                                                            <p><strong>Applied Date:</strong> <span>{item?.add_date}</span></p>
                                                            <p><strong>Batch ID:</strong> <span>{item?.batch_id || "N/A"}</span></p>
                                                            <p><strong>Current Designation:</strong> <span>{item?.designation}</span></p>
                                                            <p><strong>Project Name:</strong> <span>{item?.project_name}</span></p>
                                                            {/* <p><strong>Experience:</strong> <span>{item?.total_experience}</span></p>
                                                            <p><strong>Location:</strong> <span>{item?.location}</span></p>
                                                            <p><strong>Current CTC:</strong> <span>{item?.current_ctc} LPA</span></p>
                                                            <p><strong>Expected CTC:</strong> <span>{item?.expected_ctc} LPA</span></p>
                                                            <p><strong>Notice Period:</strong> <span>{item?.notice_period} Days</span></p> */}
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        </>
                                    )
                                }) :
                                    (
                                        <Col>
                                            <Card className="h-100 mprcards">
                                                <Card.Body>
                                                    Records Not Found
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    )
                        }
                        {
                            hasMoreStatus && (

                                <Col sm={12} className='apprvloadmrbtn w-100 text-center mb-4'>
                                    <Button type='button' onClick={hasMore}>
                                        View More
                                    </Button>
                                </Col>
                            )
                        }
                    </Row>
                </div>
            </div>
        </>
    )
}


export default ListOfInterviewedCandidateOfCeo;
