import React, { useState } from 'react';
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { CiCalendar } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import AsyncSelect from 'react-select/async';
import { fetchAssetsRecords  , fetchEmployeeAssetsRecords } from '../../features/slices/AssetsSlice/assets';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderTokenMultiPart } from '../../config/api_header';



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

const ViewAssigned = (props) => {

    const { userData , onHide } = props;

    const [images, setImages] = useState([]);
    const [images1, setImages1] = useState(null);
    const [loading , isLoading] = useState(false);
    const loginUsers = JSON.parse(localStorage.getItem('admin_role_user')) || {}


    const [stateData, setStateData] = useState({
        assets_name: '',
        assets_type: '',
        assets_seriol_no: '',
        assets_image: [],
        assets_return_status: '',
        return_condition_desc: '',
        assets_signature: null,
        assets_assign_date: null
    })

    const [option, setOptions] = useState(null);
    const dispatch = useDispatch()

    /************************* Handle Fetch Records of Assets - *********************/
    // On Menu Open
    const OnMenuOpenAssets = async () => {
        const payloads = {
            page_no: 1,
            per_page_record: 10,
            filter_keyword: '',
            is_count: "no",
            assign_status: 'Unassigned',
            status: "Active",
            scope_fields: ['_id', 'asset_code', 'asset_name', 'asset_type', 'serial_no'],
        };
        let result = await dispatch(fetchAssetsRecords(payloads)).unwrap()
        setOptions(result?.map((item) => {
            let { _id, asset_name, ...other } = item;
            return {
                value: _id,
                label: asset_name,
                data: other
            }
        }))
    }
    // Assets Load Options 
    const loadOptions = async (inputValue) => {
        const payloads = {
            page_no: 1,
            per_page_record: 10,
            is_count: "no",
            assign_status: 'Unassigned',
            filter_keyword: inputValue,
            status: "Active",
            scope_fields: ['_id', 'asset_code', 'asset_name', 'asset_type', 'serial_no'],
        };
        let result = await dispatch(fetchAssetsRecords(payloads)).unwrap()
        return result?.map((item) => {
            let { _id, asset_name, ...other } = item;
            return {
                value: _id,
                label: asset_name,
                data: other
            }
        })
    }

    const handleAssetsChoose = (option) => {
        handleInputChange({
            assets_name: option,
            assets_type: option?.data?.asset_type,
            assets_seriol_no: option?.data?.serial_no,
        })
    }

    /**************************End Fetch Records of Aseets **************************/



    const handleInputChange = (obj) => {
        setStateData((prev) => ({
            ...prev,
            ...obj
        }))
    }

    // Handle file selection
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const previewImages = selectedFiles.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));
        setImages((prevImages) => [...prevImages, ...previewImages]);
    };

    // Handle file selection
    const handleFileChange1 = (event) => {
        const selectedFiles = event.target.files
        setImages1(selectedFiles);
    };

    // Handle image deletion
    const handleDelete = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        // Revoke object URLs to avoid memory leaks
        URL.revokeObjectURL(images[index].url);

        setImages(updatedImages);
    };

    // Handle submit Assets
    const handleAddAsserts = async () => {
        // handle and Check the Validation For it's
        if (!stateData.assets_name?.label) {
            return toast.warn('Please Select the Assets Name');
        }
        if (!stateData.assets_seriol_no) {
            return toast.warn('Please Enter the Assets Serial Number');
        }
        if (!stateData.assets_type) {
            return toast.warn('Please choose the Assets types');
        }
        if (!stateData.assets_assign_date) {
            return toast.warn('Please choose the Assign Date');
        }
        if (!stateData.assets_return_status) {
            return toast.warn('Please choose the Assign Status');
        }
        if (!stateData.return_condition_desc) {
            return toast.warn('Please Enter the Assets Assign Description');
        }
        if (images?.length <= 0) {
            return toast.warn('Please choose the Image')
        }
        if (!images1) {
            return toast.warn('Please choose the Signature');
        }

        const formData = new FormData();
        formData.append("asset_id", stateData.assets_name?.value);
        formData.append("employee_doc_id", userData?._id);

        images.forEach((item, index) => {
            formData.append(`assets_images`, item.file);
        });

        formData.append("declaration_file", images1[0]);
    
        formData.append("assign_date", stateData?.assets_assign_date);
        formData.append("assign_condition", stateData?.return_condition_desc);
        formData.append("assign_condition_status", stateData?.assets_return_status);
        formData.append("assign_by_name" , loginUsers?.name)
        formData.append("assign_by_id" , loginUsers?._id)
        formData.append("assign_by_designation" , loginUsers?.designation)
        formData.append("assign_by_mobile_no" , loginUsers?.mobile_no)
        formData.append("assign_by_email" , loginUsers?.email)

        isLoading(true)

        try {
            let response = await axios.post(`${config.API_URL}assignAssetToEmployee` , formData , apiHeaderTokenMultiPart(config.API_TOKEN));
            if(response.status === 200){
                toast.success(response.data?.message)
                handleInputChange({
                    assets_name: '',
                    assets_type: '',
                    assets_seriol_no: '',
                    assets_image: [],
                    assets_return_status: '',
                    return_condition_desc: '',
                })
                let payload = {
                    "employee_doc_id": userData?._id,
                    "page_no": "1",
                    "per_page_record": "1000",
                    "filter_keyword": "",
                    "is_count": "no"
                }
                dispatch(fetchEmployeeAssetsRecords(payload))
                setImages([]);
                setImages1(null)
                onHide();

            }else {
                toast.error(response.data?.message)
            }
        } catch (error) {
            toast.error(error.response.data.message || error.message || "Someting Went Wrong");
        }

        isLoading(false)

    }

    return (
        <Modal {...props} size="lg" className="jobtemp_modal offermodal">
            <Modal.Header className="" closeButton>
                <Modal.Title>
                    <h4>Assign Asset</h4>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex flex-column gap-3">
                    <div className="row">
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>
                                Asset Name
                            </Form.Label>
                            <AsyncSelect
                                cacheOptions
                                defaultOptions
                                defaultValue={option}
                                loadOptions={loadOptions}
                                value={stateData.assets_name}
                                onMenuOpen={OnMenuOpenAssets}
                                placeholder="Select Assets"
                                onChange={handleAssetsChoose}
                                classNamePrefix="react-select"
                                styles={customStyles}
                            />
                        </Form.Group>
                        <Form.Group className="col-lg-6" controlId="">
                            <Form.Label>
                                Device Serial Number*
                            </Form.Label>
                            <InputGroup>
                                <Form.Control placeholder="Enter serial number" aria-describedby="" readOnly value={stateData.assets_seriol_no} onChange={(e) => {
                                    handleInputChange({ assets_seriol_no: e.target.value });
                                }} />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="col-lg-6 mt-4" controlId="exampleForm.ControlInput1" >
                            <Form.Label>Asset/Device Type </Form.Label>
                            <Form.Control placeholder="Select Assets name" aria-describedby="" readOnly value={stateData.assets_type} onChange={(e) => {
                                handleInputChange({ assets_type: e.target.value });
                            }} />
                        </Form.Group>



                        <Form.Group className="col-lg-6 mt-4 position-relative" controlId="formGridEmail">
                            <Form.Label>Assign Date</Form.Label>
                            <Form.Control type="date" placeholder="dd/mm/yyyy" value={stateData.assets_assign_date} onChange={(e) => {
                                handleInputChange({ assets_assign_date: e.target.value })
                            }} />
                            <CiCalendar />
                        </Form.Group>

                        <Form.Group className="col-lg-12 mt-4" controlId="exampleForm.ControlInput1">
                            <Form.Label>Assign Status</Form.Label>
                            <Form.Select
                                value={stateData.assets_return_status}
                                onChange={(e) => handleInputChange({ assets_return_status: e.target.value })}
                            >
                                <option value="">Select Status</option>
                                <option value="Good">Good</option>
                                <option value="minor_damage">Minor Damage</option>
                                <option value="major_mamage">Major Damage</option>
                                <option value="faulty">Faulty</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label>Assign Condition or Fault</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    className="textareaa"
                                    as="textarea"
                                    placeholder="Describe condition or fault"
                                    rows={4}
                                    value={stateData.return_condition_desc}
                                    onChange={(e) => handleInputChange({ return_condition_desc: e.target.value })}
                                />
                            </InputGroup>
                        </Form.Group>


                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label className="text-start w-100">
                                Upload Asset Images <span>(jpg, png format)</span>
                            </Form.Label>
                            <div className="customfile_upload asstupload">
                                <input type="file" className="cstmfile" accept='.jpg , .png , .jpeg' multiple onChange={handleFileChange} />
                            </div>
                        </Form.Group>


                        <div className='assets_imgwrap'>
                            {images.map((image, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <img src={image.url} alt={`Preview ${index + 1}`} />
                                    <button onClick={() => handleDelete(index)} className='dlt_asstimg'> <RiDeleteBin6Line /> </button>
                                </div>
                            ))}
                        </div>


                        <Form.Group controlId="formFile" className="col-lg-12 mt-4">
                            <Form.Label className="text-start w-100">
                                Upload Signed Declaration Form <span>(docx, pdf format)</span>
                            </Form.Label>
                            <div className="customfile_upload asstupload">
                                <input type="file" className="cstmfile" accept='.docx , .pdf' onChange={handleFileChange1} />
                            </div>
                        </Form.Group>

                        {/* <div className='assets_imgwrap'>
                            {images1.map((image1, index1) => (
                                <div key={index1} style={{ position: "relative" }}>
                                    <img src={image1.url} alt={`Preview ${index1 + 1}`} />
                                    <button onClick={() => handleDelete1(index1)} className='dlt_asstimg'> <RiDeleteBin6Line /> </button>
                                </div>
                            ))}
                        </div> */}
                    </div>
                    <div className="mt-4">
                        <div className="priew-submit btn-center">
                            <button className="submitbtn px-5" disabled={loading} onClick={handleAddAsserts}>
                                <FaCheckCircle /> { loading ? 'Loading...' : 'Sumbit' }
                            </button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}
export default ViewAssigned;
