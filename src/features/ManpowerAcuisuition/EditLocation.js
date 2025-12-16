// LocationEditModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FetchProjectLocationStateVise } from "../slices/ProjectListDropDown/ProjectListDropdownSlice";

const customStylesLocation = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#fff',
        borderColor: state.isFocused ? '#D2C9FF' : state.isHovered ? '#80CBC4' : provided.borderColor,
        boxShadow: state.isFocused ? '0 0 0 1px #D2C9FF' : 'none',
        '&:hover': {
            borderColor: '#D2C9FF',
        },
        minHeight: '100px',
        paddingLeft: '10px',
        textAlign: 'left',
    }),
    menu: (provided) => ({
        ...provided,
        borderTop: 'none',
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
    multiValue: (provided) => ({
        ...provided,
        backgroundColor: '#29166F',
        borderRadius: '5px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 10px',
    }),
    multiValueLabel: (provided) => ({
        ...provided,
        color: '#fff',
        fontSize: '14px',
    }),
    multiValueRemove: (provided) => ({
        ...provided,
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4CAF50',
            color: '#fff',
        },
    }),
};

const LocationEditModal = ({
    open,
    setOpen,
    currentMprData,
    onSave
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [postingLocations, setPostingLocations] = useState([]);
    const [originalLocations, setOriginalLocations] = useState([]);

    // Initialize locations when modal opens
    useEffect(() => {
        if (open && currentMprData) {
            const locations = currentMprData?.place_of_posting?.map((item) => ({
                label: `${item.location_name}${item.state_name ? `, ${item.state_name}` : ''}`,
                value: item.location_id,
                state_id: item?.state_id,
                state_name: item?.state_name,
                location_name: item.location_name
            })) || [];

            setPostingLocations(locations);
            setOriginalLocations(locations);
        }
    }, [open, currentMprData]);

    // Load location options for the async select
    const loadLocationOptions = async (input) => {
        try {
            const result = await dispatch(FetchProjectLocationStateVise(input)).unwrap();
            return result?.map((item) => ({
                value: item?._id,
                label: `${item?.name}${item?.state ? `, ${item.state}` : ''}`,
                state_id: item?.state_id,
                state_name: item?.state,
                location_name: item?.name
            })) || [];
        } catch (error) {
            console.error('Error loading locations:', error);
            toast.error('Failed to load locations');
            return [];
        }
    };

    const handleSave = async () => {
        if (!currentMprData) {
            toast.error('No MPR data found');
            return;
        }

        setLoading(true);
        try {
            // Prepare the locations in the format your API expects
            const formattedLocations = postingLocations
                .filter(loc => loc && typeof loc === 'object')
                .map(loc => ({
                    location_name: loc.location_name,
                    location_id: loc.value,
                    state_id: loc.state_id,
                    state_name: loc.state_name
                }));
            // Call the onSave prop with updated data
            await onSave({
                ...currentMprData,
                place_of_posting: formattedLocations
            });

            toast.success('Locations updated successfully');
            setOpen(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update locations');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        // Reset to original locations
        setPostingLocations(originalLocations);
        setOpen(false);
    };

    return (
        <Modal
            show={open}
            onHide={handleCancel}
            size="lg"
            centered
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title className="text-purple">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    Edit Place of Posting
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="p-3">
                    <div className="mb-4">
                        <h6 className="text-muted mb-2">
                            MPR: <span className="text-dark">{currentMprData?.title || 'N/A'}</span>
                        </h6>
                        <p className="text-muted small mb-0">
                            Designation: {currentMprData?.designation_name}
                        </p>
                        <p className="text-muted small">
                            Project: {currentMprData?.project_name}
                        </p>
                    </div>

                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">
                                <i className="fas fa-location-dot me-2"></i>
                                Posting Locations
                                <span className="text-danger ms-1">*</span>
                            </Form.Label>

                            <div className="mb-3">
                                <AsyncSelect
                                    cacheOptions
                                    isMulti
                                    defaultOptions
                                    loadOptions={loadLocationOptions}
                                    value={postingLocations}
                                    placeholder="Search and select locations..."
                                    onChange={(selectedOptions) => setPostingLocations(selectedOptions || [])}
                                    classNamePrefix="react-select"
                                    styles={customStylesLocation}
                                    noOptionsMessage={({ inputValue }) =>
                                        inputValue ? 'No locations found' : 'Type to search locations'
                                    }
                                />
                            </div>

                            <div className="text-muted small">
                                <i className="fas fa-info-circle me-1"></i>
                                You can select multiple locations. Each location will be shown as a separate posting option.
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-between">
                <div>
                    <Button
                        variant="outline-secondary"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                    </Button>
                </div>

                <div className="d-flex gap-2">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={loading || postingLocations.length === 0}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save me-2"></i>
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default LocationEditModal;