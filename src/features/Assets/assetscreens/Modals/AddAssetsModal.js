import React, { useEffect, useState } from 'react';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { getAssetsTypeList, addAsstsInAll, EditAsstsInAll, fetchAssetsRecords, fetchTotalAssets, fetchUnassignAssets } from '../../../slices/AssetsSlice/assets';
import { useDispatch, useSelector } from 'react-redux';
import AsyncSelect from 'react-select/async';


const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        height: '44px',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: '1px solid #D2C9FF',
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px solid #D2C9FF',
        color: state.isSelected ? '#fff' : '#000',
        backgroundColor: state.isSelected ? '#4CAF50' : state.isFocused ? '#80CBC4' : provided.backgroundColor,
        '&:hover': {
            backgroundColor: '#80CBC4',
            color: '#fff',
        },
    }),
};

const AddAssetsModal = (props) => {

    const { assetsData , onHide } = props;

    const { addAssets , editAssets } = useSelector((state) => state.assets)

    const [addAssetsState, setAddAssetsState] = useState({
        assets_name: '',
        device_serial_no: '',
        assets_type: null
    })
    const [option, setOption] = useState(null);
    const dispatch = useDispatch();
   // re-fill the Data
    useEffect(() => {

        if (assetsData) {
            handleAssetsChanges({
                assets_name: assetsData?.asset_name,
                device_serial_no: assetsData?.serial_no,
                assets_type: { label: assetsData?.asset_type, value: assetsData?.asset_type }
            })
        }

    }, [assetsData])

    // handle Assets Input changes
    const handleAssetsChanges = (obj) => {
        setAddAssetsState((prev) => (
            {
                ...prev,
                ...obj
            }
        ))
    }

    // Assets type Defualt Option ->
    const OnMenuOpenOption = async () => {
        let result = await dispatch(getAssetsTypeList('')).unwrap();
        setOption(result)
    }
    // Assets Load Option -> 
    const AssetsLoadOption = async (input) => {
        return await dispatch(getAssetsTypeList(input)).unwrap();
    }
    // handle Slice Changes =
    const AssetstypeChanges = (option) => {
        handleAssetsChanges({ assets_type: option })
    }

    const SubmitAssets = (event) => {
        // event.preventDefualt()
        if (!addAssetsState.assets_name) {
            toast.warn('Please Enter the Assets Name');
            return
        }
        if (!addAssetsState.device_serial_no) {
            return toast.warn("Please Enter the Device Serial No.")
        }
        if (!addAssetsState.assets_type) {
            return toast.warn("Please Choose the Asserts Type")
        }

        let paylods = {
            "asset_name": addAssetsState.assets_name,
            "serial_no": addAssetsState.device_serial_no,
            "asset_type": addAssetsState.assets_type?.value
        }
        dispatch(addAsstsInAll(paylods)).unwrap().then((res) => {
            if (res?.status) {
                handleAssetsChanges({
                    assets_name: '',
                    device_serial_no: "",
                    assets_type: '',
                })

                // Again Called the Records
                const payloads = {
                    page_no: 1,
                    per_page_record: 10,
                    filter_keyword: '',
                    is_count: "no",
                    assign_status: '',
                    status: "Active",
                    scope_fields: [],
                };
                dispatch(fetchAssetsRecords(payloads));
                let total = {
                    "page_no": "1",
                    "per_page_record": "1000",
                    "filter_keyword": '',
                    "is_count": "yes",
                    "assign_status": "",
                    "status": "Active",
                }
                dispatch(fetchTotalAssets(total))
                let unassign = {
                    "page_no": "1",
                    "per_page_record": "100000",
                    "filter_keyword": '',
                    "is_count": "yes",
                    "assign_status": "Unassigned",
                    "status": "Active",
                }
                dispatch(fetchUnassignAssets(unassign))
                onHide()
            }
        })
            .catch(err => {
                console.log(err, 'this is Error');
            })
    }
    const EditAssets = (event) => {
        // event.preventDefualt()
        if (!addAssetsState.assets_name) {
            toast.warn('Please Enter the Assets Name');
            return
        }
        if (!addAssetsState.device_serial_no) {
            return toast.warn("Please Enter the Device Serial No.")
        }
        if (!addAssetsState.assets_type) {
            return toast.warn("Please Choose the Asserts Type")
        }

        let paylods = {
            "asset_name": addAssetsState.assets_name,
            "serial_no": addAssetsState.device_serial_no,
            "asset_type": addAssetsState.assets_type?.value,
            "_id": assetsData?._id
        }
        dispatch(EditAsstsInAll(paylods)).unwrap().then((res) => {
            if (res?.status) {
                handleAssetsChanges({
                    assets_name: '',
                    device_serial_no: "",
                    assets_type: '',
                })
                // Again Called the Records
                const payloads = {
                    page_no: 1,
                    per_page_record: 10,
                    filter_keyword: '',
                    is_count: "no",
                    assign_status: '',
                    status: "Active",
                    scope_fields: [],
                };
                dispatch(fetchAssetsRecords(payloads));
                let total = {
                    "page_no": "1",
                    "per_page_record": "1000",
                    "filter_keyword": '',
                    "is_count": "yes",
                    "assign_status": "",
                    "status": "Active",
                }
                dispatch(fetchTotalAssets(total))
                onHide()
            }
        })
            .catch(err => {
                console.log(err, 'this is Error');
            })
    }

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>{assetsData ? 'Edit Assets' : "Add Asset"}</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-4" controlId="">
                            <Form.Label>
                                Asset Name
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter asset name" aria-describedby="" value={addAssetsState.assets_name} onChange={(e) => {
                                    handleAssetsChanges({ assets_name: e.target.value })
                                }} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-4" controlId="">
                            <Form.Label>
                                Device Serial Number
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter serial number" aria-describedby="" value={addAssetsState.device_serial_no} onChange={(e) => {
                                    handleAssetsChanges({ device_serial_no: e.target.value })
                                }} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-4" controlId="exampleForm.ControlInput1" >
                            <Form.Label>Asset/Device Type </Form.Label>
                            <AsyncSelect
                                placeholder="Asset/Device Type"
                                defaultOptions
                                defaultValue={option}
                                value={addAssetsState.assets_type}
                                loadOptions={AssetsLoadOption}
                                onMenuOpen={OnMenuOpenOption}
                                onChange={(option) => AssetstypeChanges(option)}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </Form.Group>
                    </div>
                    <div className="mt-4">
                        <div className="priew-submit btn-center">
                            <button className="submitbtn px-5" disabled={addAssets.status === 'loading' || editAssets.status === 'loading'} onClick={assetsData ? EditAssets : SubmitAssets}>
                                <FaCheckCircle /> {addAssets.status === 'loading' ? 'Loading...' : editAssets.status === 'loading' ? "Updating..." : assetsData ? 'Update' :  'Sumbit'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default AddAssetsModal;
