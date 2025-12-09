import React, { useCallback, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { CiSearch } from "react-icons/ci";
import TotalAssetsTable from './assetscreens/TotalAssetsTable.js';
import AssignedAssetsTable from './assetscreens/AssignedAssetsTable.js';
import UnassignedAssetsTable from './assetscreens/UnassignedAssetsTable.js';
import { useSelector, useDispatch } from "react-redux";
import { fetchTotalAssets, fetchAssignAssets, fetchUnassignAssets, fetchAssetsRecords } from "../slices/AssetsSlice/assets.js";
import _ from "lodash";


export default function AssetsTabs() {
    const { totalCount, assignCount, unassignCount } = useSelector((state) => state.assets)
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState("first");
    const [searchTerm, setSearchTerm] = useState("");
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [assignedAssetsPagination, setAssignedAssetsPagination] = useState({ page: 0, pageSize: 10 });
    const [unassignedAssetsPagination, setUnassignedAssetsPagination] = useState({ page: 0, pageSize: 10 });

    const [searchTermAssign, setSearchTermAssign] = useState("");
    const [searchTermUnAssign, setSearchTermUnAssign] = useState("")



    const handleTabChange = (key) => {
        setActiveTab(key);
        switch (key) {
            case "first":
                // setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
                fetchRecords("" , "" , paginationModel); // No specific assign_status
                break;
            case "second":
                // setAssignedAssetsPagination({page:0 , pageSize:assignedAssetsPagination.pageSize})
                fetchRecords("Assigned" , "" , assignedAssetsPagination ); // Fetch Assigned records
                break;
            case "third":
                // setUnassignedAssetsPagination({page:0 , pageSize:unassignedAssetsPagination.pageSize})
                fetchRecords("Unassigned" , "" , unassignedAssetsPagination ); // Fetch Unassigned records
                break;
            default:
                break;
        }
    };


    const fetchRecords = useCallback(
        (status = "", value = '' , pageHandle) => {
            const payloads = {
                page_no: pageHandle?.page + 1,
                per_page_record: pageHandle?.pageSize,
                filter_keyword: value,
                is_count: "no",
                assign_status: status,
                status: "Active",
                scope_fields: [],
            };
            dispatch(fetchAssetsRecords(payloads));
        },
        [dispatch]
    );

    // serch changes ->   
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };
    // search Term Assign ->
    const handleAssignSearch = (e) => {
        const value = e.target.value;
        searchTermAssign(value)
        debouncedSearch(value);
    }
    // search Term UnAssign
    const handleSearchTermUnAssign = (e) => {
        const value = e.target.value;
        setSearchTermUnAssign(value)
        debouncedSearch(value);
    }

    // useDebousing for that 
    const debouncedSearch = useCallback(
        _.debounce((value) => {
            switch (activeTab) {
                case "first":
                    fetchRecords("", value , paginationModel); // No specific assign_status
                    break;
                case "second":
                    fetchRecords("Assigned", value , assignedAssetsPagination); // Fetch Assigned records
                    break;
                case "third":
                    fetchRecords("Unassigned", value , unassignedAssetsPagination); // Fetch Unassigned records
                    break;
                default:
                    break;
            }
        }, 300),
        [activeTab, fetchRecords , assignedAssetsPagination, unassignedAssetsPagination , paginationModel]
    );



    useEffect(() => {
        let total = {
            "page_no": "1",
            "per_page_record": "1000",
            "filter_keyword": searchTerm,
            "is_count": "yes",
            "assign_status": "",
            "status": "Active",
        }
        dispatch(fetchTotalAssets(total))
    }, [dispatch, searchTerm])


    useEffect(() => {
        let assign = {
            "page_no": "1",
            "per_page_record": "100000",
            "filter_keyword": searchTermAssign,
            "is_count": "yes",
            "assign_status": "Assigned",
            "status": "Active",
        }
        dispatch(fetchAssignAssets(assign))
    }, [dispatch, searchTermAssign])

    useEffect(() => {
        let unassign = {
            "page_no": "1",
            "per_page_record": "100000",
            "filter_keyword": searchTermUnAssign,
            "is_count": "yes",
            "assign_status": "Unassigned",
            "status": "Active",
        }
        dispatch(fetchUnassignAssets(unassign))
    }, [dispatch, searchTermUnAssign])

    useEffect(() => {
        switch (activeTab) {
            case "first":
                // setPaginationModel({ page: 0, pageSize: paginationModel.pageSize });
                fetchRecords("" , "" , paginationModel); // No specific assign_status
                break;
            case "second":
                // setAssignedAssetsPagination({page:0 , pageSize:assignedAssetsPagination.pageSize})
                fetchRecords("Assigned" , "" , assignedAssetsPagination ); // Fetch Assigned records
                break;
            case "third":
                // setUnassignedAssetsPagination({page:0 , pageSize:unassignedAssetsPagination.pageSize})
                fetchRecords("Unassigned" , "" , unassignedAssetsPagination ); // Fetch Unassigned records
                break;
            default:
                break;
        }
    } , [activeTab, assignedAssetsPagination, fetchRecords , paginationModel, unassignedAssetsPagination])

    return (
        <>
            <Tab.Container id="left-tabs-example" className="" defaultActiveKey="first" onSelect={handleTabChange}>
                <Nav variant="pills" className="flex-row postedjobs border-full mb-4 widthcomp widthfuller" style={{ width: '17% !important' }}>
                    <Nav.Item>
                        <Nav.Link eventKey="first">Total Assets ({totalCount?.status === 'success' ? totalCount?.total?.data : 0})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="second">Assigned Assets ({assignCount?.status === 'success' ? assignCount?.total?.data : 0})</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="third">Unassigned Assets ({unassignCount?.status === 'success' ? unassignCount?.total?.data : 0})</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content>
                    <Tab.Pane eventKey="first">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search....."
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <TotalAssetsTable paginationModel={paginationModel} setPaginationModel={setPaginationModel} />
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search....."
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={searchTermAssign}
                                        onChange={handleAssignSearch}

                                    />
                                </InputGroup>
                            </div>
                        </div>
                        <AssignedAssetsTable paginationModel={assignedAssetsPagination} setPaginationModel={setAssignedAssetsPagination} />
                        {/* <TotalAssetsTable paginationModel={paginationModel} setPaginationModel={setPaginationModel} /> */}
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">

                        <div className="d-flex justify-content-between align-items-end mb-4">
                            <div className="d-flex flex-row gap-3">
                                <InputGroup className="searchy-input">
                                    <InputGroup.Text id="basic-addon1" className="border-0">
                                        <CiSearch />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Search Candidate"
                                        aria-label="Username"
                                        aria-describedby="basic-addon1"
                                        value={searchTermUnAssign}
                                        onChange={handleSearchTermUnAssign}
                                    />
                                </InputGroup>
                            </div>
                        </div>

                        <UnassignedAssetsTable paginationModel={unassignedAssetsPagination} setPaginationModel={setUnassignedAssetsPagination} />

                    </Tab.Pane>

                </Tab.Content>
            </Tab.Container>
        </>

    )
}

