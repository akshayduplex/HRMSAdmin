import React, { useState , useEffect , useCallback } from "react";

const JobFormat = ({formData , handleAllInputChange}) =>{
  const [activeFields, setActiveFields] = useState({});
  // const [jobActionFormate , setJobActionFormate] = useState([]);


  const handleFieldChange = useCallback(({label, action}) => {
    const updatedData = formData.form_personal_data.map(item =>
      item.label === label ? { ...item, action } : item
    );
  
    // If the label doesn't exist, add a new entry
    if (!updatedData.some(item => item.label === label)) {
      updatedData.push({ label, action });
    }
  
    handleAllInputChange({ form_personal_data: updatedData });
  });

  const handleProfileFieldChange = useCallback(({label , action}) => {
    const updatedData = formData.form_profile.map(item =>
      item.label === label ? { ...item, action } : item
    );
  
    // If the label doesn't exist, add a new entry
    if (!updatedData.some(item => item.label === label)) {
      updatedData.push({ label, action });
    }
  
    handleAllInputChange({ form_profile: updatedData });
  })

  const handleSocialMediasLinkOptions = useCallback(({label , action}) => {
    const updatedData = formData.form_social_links.map(item =>
      item.label === label ? { ...item, action } : item
    );
  
    // If the label doesn't exist, add a new entry
    if (!updatedData.some(item => item.label === label)) {
      updatedData.push({ label, action });
    }
  
    handleAllInputChange({ form_social_links: updatedData });
  })
  


  const handleOptionClick = (field, option) => {
    setActiveFields((prevActiveFields) => ({
      ...prevActiveFields,
      [field]: option,
    }));
  };


  const resetActiveState = (field) => {
    setActiveFields((prevActiveFields) => ({
      ...prevActiveFields,
      [field]: null,
    }));
  };

  useEffect(() => {
    // Define the fields and their default states
    const fields = [
      { label: 'Candidate Full name', defaultAction: 'Mandatory' },
      { label:'Email' , defaultAction:'Mandatory' },
      { label:'Phone' , defaultAction:'Mandatory' },
      { label:'Photo' , defaultAction:'Mandatory' },
      { label:'Address' , defaultAction:'Mandatory' },
      { label:'designation' , defaultAction:'Mandatory' },
      { label:'Experience' , defaultAction:'Mandatory' },
      { label:'Location' , defaultAction:'Optional' },
      { label:'Employer' , defaultAction:'Optional' },
      { label:'Current CTC' , defaultAction:'Optional' },
      { label:'Expected CTC' , defaultAction:'Mandatory' },
      { label:'Notice Period' , defaultAction:'Optional' },
      { label:'Last Working Day' , defaultAction:'Optional' },
      { label:'Applied From' , defaultAction:'Optional' },
      { label:'Reference Employee' , defaultAction:'Optional' }
      // Add other fields here
    ];

    fields.forEach(field => {
      const existingField = formData.form_personal_data.find(index => index?.label === field.label);
      if (existingField) {
        switch (existingField.action) {
          case 'Mandatory':
            resetActiveState(field.label);
            handleOptionClick(field.label, 0);
            break;
          case 'Optional':
            resetActiveState(field.label);
            handleOptionClick(field.label, 1);
            break;
          case 'off':
            resetActiveState(field.label);
            handleOptionClick(field.label, 2);
            break;
          default:
            break;
        }
      } else {
        // Set default action if no existing action is found
        resetActiveState(field.label);
        // handleOptionClick(field.label, field.defaultAction === 'Mandatory' ? 0 : field.defaultAction === 'Optional' ? 1 : 2);
        handleFieldChange({ label: field.label, action: field.defaultAction });
      }
    });
  }, [formData.form_personal_data, handleFieldChange]);

  useEffect(() => {
    // Define the fields and their default states
    const fields = [
      {label:'Education' , defaultAction:'Mandatory'},
      {label:'ProfileExperience' , defaultAction:'Optional'},
      {label:'Cover' , defaultAction:'Optional'},
      {label:'Resume' , defaultAction:'Optional'}    
        // Add other fields here
    ];

    fields.forEach(field => {
      const existingField = formData.form_profile.find(index => index?.label === field.label);
      if (existingField) {
        switch (existingField.action) {
          case 'Mandatory':
            resetActiveState(field.label);
            handleOptionClick(field.label, 0);
            break;
          case 'Optional':
            resetActiveState(field.label);
            handleOptionClick(field.label, 1);
            break;
          case 'off':
            resetActiveState(field.label);
            handleOptionClick(field.label, 2);
            break;
          default:
            break;
        }
      } else {
        // Set default action if no existing action is found
        resetActiveState(field.label);
        // handleOptionClick(field.label, field.defaultAction === 'Mandatory' ? 0 : field.defaultAction === 'Optional' ? 1 : 2);
        handleProfileFieldChange({ label: field.label, action: field.defaultAction });
      }
    });
  }, [formData.form_profile, handleProfileFieldChange]);

  useEffect(() => {
    // Define the fields and their default states
    const fields = [
      {label:'LinkedIn' , defaultAction:'Optional'},
      {label:'Instagram' , defaultAction:'Optional'},
      {label:'Website' , defaultAction:'Optional'},
      {label:'Portfolio' , defaultAction:'Optional'},
      {label:'Facebook' , defaultAction:'Optional'}    
        // Add other fields here
    ];

    fields.forEach(field => {
      const existingField = formData.form_social_links.find(index => index?.label === field.label);
      if (existingField) {
        switch (existingField.action) {
          case 'Mandatory':
            resetActiveState(field.label);
            handleOptionClick(field.label, 0);
            break;
          case 'Optional':
            resetActiveState(field.label);
            handleOptionClick(field.label, 1);
            break;
          case 'off':
            resetActiveState(field.label);
            handleOptionClick(field.label, 2);
            break;
          default:
            break;
        }
      } else {
        // Set default action if no existing action is found
        resetActiveState(field.label);
        // handleOptionClick(field.label, field.defaultAction === 'Mandatory' ? 0 : field.defaultAction === 'Optional' ? 1 : 2);
        handleSocialMediasLinkOptions({ label: field.label, action: field.defaultAction });
      }
    });
  }, [formData.form_social_links, handleSocialMediasLinkOptions]);




  return (
    <>

      <div className="row bor-bot px-3 format_wraps">
        <div className="col-3">
          <div className="d-flex flex-column gap-2 format_sidetext">
            <h6>Personal Information</h6>
            <span className="text-secondary">
              Adjust your candidate information settings for the
              application format.
            </span>
          </div>
        </div>
        <div className="col-9">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Candidate Full name</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div className={`position-relative width-third ${activeFields.candidateName === 0 || formData.form_personal_data.some(index =>index?.label === 'Candidate Full name' && index.action === 'Mandatory')? "active" : ""}`}
                      onClick={() => {
                        resetActiveState("candidateName");
                        handleOptionClick("candidateName", 0);
                        handleFieldChange( { label:'Candidate Full name' , action:'Mandatory' })
                      }}
                    >
                      <div>Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.candidateName === 1 || formData.form_personal_data.some(index => index?.label === 'Candidate Full name' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("candidateName");
                        handleOptionClick("candidateName", 1);
                        handleFieldChange( { label:'Candidate Full name' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.candidateName === 2 || formData.form_personal_data.some(index =>index?.label === 'Candidate Full name' && index.action === 'off')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("candidateName");
                        handleOptionClick("candidateName", 2);
                        handleFieldChange( { label:'Candidate Full name' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Email</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Email === 0 || formData.form_personal_data.some(index => index?.label === 'Email' && index.action === 'Mandatory')? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Email");
                        handleOptionClick("Email", 0);
                        handleFieldChange( { label:'Email' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Email === 1 || formData.form_personal_data.some(index => index?.label === 'Email' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Email");
                        handleOptionClick("Email", 1);
                        handleFieldChange( { label:'Email' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Email === 2 || formData.form_personal_data.some(index => index?.label === 'Email' && index.action === 'off')? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Email");
                        handleOptionClick("Email", 2);
                        handleFieldChange( { label:'Email' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Phone</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Phone === 0 || formData.form_personal_data.some(index =>index?.label === 'Phone' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Phone");
                        handleOptionClick("Phone", 0);
                        handleFieldChange( { label:'Phone' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Phone === 1 || formData.form_personal_data.some(index =>index?.label === 'Phone' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Phone");
                        handleOptionClick("Phone", 1);
                        handleFieldChange( { label:'Phone' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Phone === 2 || formData.form_personal_data.some(index =>index?.label === 'Phone' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Phone");
                        handleOptionClick("Phone", 2);
                        handleFieldChange( { label:'Phone' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Address</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Address === 0 || formData.form_personal_data.some(index =>index?.label === 'Address' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Address");
                        handleOptionClick("Address", 0);
                        handleFieldChange( { label:'Address' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Address === 1 || formData.form_personal_data.some(index =>index?.label === 'Address' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Address");
                        handleOptionClick("Address", 1);
                        handleFieldChange( { label:'Address' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Address === 2 || formData.form_personal_data.some(index =>index?.label === 'Address' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Address");
                        handleOptionClick("Address", 2);
                        handleFieldChange( { label:'Address' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Photo</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Photo === 0 || formData.form_personal_data.some(index =>index?.label === 'Photo' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Photo");
                        handleOptionClick("Photo", 0);
                        handleFieldChange( { label:'Photo' , action:'Mandatory' })

                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Photo === 1 || formData.form_personal_data.some(index =>index?.label === 'Photo' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Photo");
                        handleOptionClick("Photo", 1);
                        handleFieldChange( { label:'Photo' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Photo === 2 || formData.form_personal_data.some(index =>index?.label === 'Photo' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Photo");
                        handleOptionClick("Photo", 2);
                        handleFieldChange( { label:'Photo' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Current designation</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.designation === 0 || formData.form_personal_data.some(index =>index?.label === 'designation' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("designation");
                        handleOptionClick("designation", 0);
                        handleFieldChange( { label:'designation' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.designation === 1 || formData.form_personal_data.some(index =>index?.label === 'designation' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("designation");
                        handleOptionClick("designation", 1);
                        handleFieldChange( { label:'designation' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.designation === 2 || formData.form_personal_data.some(index =>index?.label === 'designation' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("designation");
                        handleOptionClick("designation", 2);
                        handleFieldChange( { label:'designation' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Experience</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 0 || formData.form_personal_data.some(index =>index?.label === 'Experience' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Experience");
                        handleOptionClick("Experience", 0);
                        handleFieldChange( { label:'Experience' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 1 || formData.form_personal_data.some(index =>index?.label === 'Experience' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Experience");
                        handleOptionClick("Experience", 1);
                        handleFieldChange( { label:'Experience' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 2 || formData.form_personal_data.some(index =>index?.label === 'Experience' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Experience");
                        handleOptionClick("Experience", 2);
                        handleFieldChange( { label:'Experience' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Location</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Location === 0 || formData.form_personal_data.some(index =>index?.label === 'Location' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Location");
                        handleOptionClick("Location", 0);
                        handleFieldChange( { label:'Location' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Location === 1 || formData.form_personal_data.some(index =>index?.label === 'Location' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Location");
                        handleOptionClick("Location", 1);
                        handleFieldChange( { label:'Location' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Location === 2 || formData.form_personal_data.some(index =>index?.label === 'Location' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Location");
                        handleOptionClick("Location", 2);
                        handleFieldChange( { label:'Location' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Current Employer</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Employer === 0 || formData.form_personal_data.some(index =>index?.label === 'Employer' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Employer");
                        handleOptionClick("Employer", 0);
                        handleFieldChange( { label:'Employer' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Employer === 1 || formData.form_personal_data.some(index =>index?.label === 'Employer' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Employer");
                        handleOptionClick("Employer", 1);
                        handleFieldChange( { label:'Employer' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Employer === 2 || formData.form_personal_data.some(index =>index?.label === 'Employer' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Employer");
                        handleOptionClick("Employer", 2);
                        handleFieldChange( { label:'Employer' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Current CTC</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.CTC === 0 || formData.form_personal_data.some(index =>index?.label === 'Current CTC' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("CTC");
                        handleOptionClick("CTC", 0);
                        handleFieldChange( { label:'Current CTC' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.CTC === 1 || formData.form_personal_data.some(index =>index?.label === 'Current CTC' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("CTC");
                        handleOptionClick("CTC", 1);
                        handleFieldChange( { label:'Current CTC' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.CTC === 2 || formData.form_personal_data.some(index =>index?.label === 'Current CTC' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("CTC");
                        handleOptionClick("CTC", 2);
                        handleFieldChange( { label:'Current CTC' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Expected CTC</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Expected === 0 || formData.form_personal_data.some(index =>index?.label === 'Expected CTC' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Expected");
                        handleOptionClick("Expected", 0);
                        handleFieldChange( { label:'Expected CTC' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Expected === 1 || formData.form_personal_data.some(index =>index?.label === 'Expected CTC' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Expected");
                        handleOptionClick("Expected", 1);
                        handleFieldChange( { label:'Expected CTC' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Expected === 2 || formData.form_personal_data.some(index =>index?.label === 'Expected CTC' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Expected");
                        handleOptionClick("Expected", 2);
                        handleFieldChange( { label:'Expected CTC' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Notice Period</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Notice === 0 || formData.form_personal_data.some(index =>index?.label === 'Notice Period' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Notice");
                        handleOptionClick("Notice", 0);
                        handleFieldChange( { label:'Notice Period' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Notice === 1 || formData.form_personal_data.some(index =>index?.label === 'Notice Period' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Notice");
                        handleOptionClick("Notice", 1);
                        handleFieldChange( { label:'Notice Period' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Notice === 2 || formData.form_personal_data.some(index =>index?.label === 'Notice Period' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Notice");
                        handleOptionClick("Notice", 2);
                        handleFieldChange( { label:'Notice Period' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Last Working Day</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Last === 0 || formData.form_personal_data.some(index =>index?.label === 'Last Working Day' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Last");
                        handleOptionClick("Last", 0);
                        handleFieldChange( { label:'Last Working Day' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Last === 1 || formData.form_personal_data.some(index =>index?.label === 'Last Working Day' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Last");
                        handleOptionClick("Last", 1);
                        handleFieldChange( { label:'Last Working Day' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Last === 2 || formData.form_personal_data.some(index =>index?.label === 'Last Working Day' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Last");
                        handleOptionClick("Last", 2);
                        handleFieldChange( { label:'Last Working Day' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Applied From</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Applied === 0 || formData.form_personal_data.some(index =>index?.label === 'Applied From' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Applied");
                        handleOptionClick("Applied", 0);
                        handleFieldChange( { label:'Applied From' , action:'Mandatory' })

                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Applied === 1 || formData.form_personal_data.some(index =>index?.label === 'Applied From' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Applied");
                        handleOptionClick("Applied", 1);
                        handleFieldChange( { label:'Applied From' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Applied === 2 || formData.form_personal_data.some(index =>index?.label === 'Applied From' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Applied");
                        handleOptionClick("Applied", 2);
                        handleFieldChange( { label:'Applied From' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center  pb-4">
              <h6>Reference Employee</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Reference === 0 || formData.form_personal_data.some(index =>index?.label === 'Reference Employee' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Reference");
                        handleOptionClick("Reference", 0);
                        handleFieldChange( { label:'Reference Employee' , action:'Mandatory' })
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Reference === 1 || formData.form_personal_data.some(index =>index?.label === 'Reference Employee' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Reference");
                        handleOptionClick("Reference", 1);
                        handleFieldChange( { label:'Reference Employee' , action:'Optional' })
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Reference === 2 || formData.form_personal_data.some(index =>index?.label === 'Reference Employee' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Reference");
                        handleOptionClick("Reference", 2);
                        handleFieldChange( { label:'Reference Employee' , action:'off' })
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row bor-bot px-3 mt-3 format_wraps">
        <div className="col-3">
          <div className="d-flex flex-column gap-2 format_sidetext">
            <h6>Profile</h6>
            <span className="text-secondary">
              Set your candidate personal information setting for the
              application format.
            </span>
          </div>
        </div>
        <div className="col-9">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Education</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between">
                    <div
                      className={`position-relative width-third ${activeFields.Education === 0 || formData.form_profile.some(index =>index?.label === 'Education' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Education");
                        handleOptionClick("Education", 0);
                        handleProfileFieldChange({label:'Education' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Education === 1 || formData.form_profile.some(index =>index?.label === 'Education' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Education");
                        handleOptionClick("Education", 1);
                        handleProfileFieldChange({label:'Education' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Education === 2 || formData.form_profile.some(index =>index?.label === 'Education' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Education");
                        handleOptionClick("Education", 2);
                        handleProfileFieldChange({label:'Education' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Experience</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 0 || formData.form_profile.some(index =>index?.label === 'Experience' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("ProfileExperience");
                        handleOptionClick("ProfileExperience", 0);
                        handleProfileFieldChange({label:'ProfileExperience' , action:'Mandatory'});
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 1 || formData.form_profile.some(index =>index?.label === 'Experience' && index.action === 'Optional')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("ProfileExperience");
                        handleOptionClick("ProfileExperience", 1);
                        handleProfileFieldChange({label:'ProfileExperience' , action:'Optional'});

                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Experience === 2 || formData.form_profile.some(index =>index?.label === 'Experience' && index.action === 'off')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("ProfileExperience");
                        handleOptionClick("ProfileExperience", 2);
                        handleProfileFieldChange({label:'ProfileExperience' , action:'off'});
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Resume</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Resume === 0 || formData.form_profile.some(index =>index?.label === 'Resume' && index.action === 'Mandatory')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Resume");
                        handleOptionClick("Resume", 0);
                        handleProfileFieldChange({label:'Resume' , action:'Mandatory'});
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Resume === 1 || formData.form_profile.some(index =>index?.label === 'Resume' && index.action === 'Optional')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Resume");
                        handleOptionClick("Resume", 1);
                        handleProfileFieldChange({label:'Resume' , action:'Optional'});
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Resume === 2 || formData.form_profile.some(index =>index?.label === 'Resume' && index.action === 'off')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Resume");
                        handleOptionClick("Resume", 2);
                        handleProfileFieldChange({label:'Resume' , action:'off'});
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center  pb-4">
              <h6>Cover letter</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Cover === 0 || formData.form_profile.some(index =>index?.label === 'Cover' && index.action === 'Mandatory')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Cover");
                        handleOptionClick("Cover", 0);
                        handleProfileFieldChange({label:'Cover' , action:'Mandatory'});
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Cover === 1 || formData.form_profile.some(index =>index?.label === 'Cover' && index.action === 'Optional')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Cover");
                        handleOptionClick("Cover", 1);
                        handleProfileFieldChange({label:'Cover' , action:'Optional'});
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Cover === 2 || formData.form_profile.some(index =>index?.label === 'Cover' && index.action === 'off')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Cover");
                        handleOptionClick("Cover", 2);
                        handleProfileFieldChange({label:'Cover' , action:'off'});
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row bor-bot px-3 mt-3 format_wraps">
        <div className="col-3">
          <div className="d-flex flex-column gap-2 format_sidetext">
            <h6>Social links</h6>
            <span className="text-secondary">
              Select which data of social media you want to collect.
            </span>
          </div>
        </div>
        <div className="col-9">
          <div className="d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>LinkedIn</h6>
              <div className="card width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.LinkedIn === 0 || formData.form_social_links.some(index =>index?.label === 'LinkedIn' && index.action === 'Mandatory')  ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("LinkedIn");
                        handleOptionClick("LinkedIn", 0);
                        handleSocialMediasLinkOptions({label:'LinkedIn' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.LinkedIn === 1 || formData.form_social_links.some(index =>index?.label === 'LinkedIn' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("LinkedIn");
                        handleOptionClick("LinkedIn", 1);
                        handleSocialMediasLinkOptions({label:'LinkedIn' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.LinkedIn === 2 || formData.form_social_links.some(index =>index?.label === 'LinkedIn' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("LinkedIn");
                        handleOptionClick("LinkedIn", 2);
                        handleSocialMediasLinkOptions({label:'LinkedIn' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Instagram</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Instagram === 0 || formData.form_social_links.some(index =>index?.label === 'Instagram' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Instagram");
                        handleOptionClick("Instagram", 0);
                        handleSocialMediasLinkOptions({label:'Instagram' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Instagram === 1 || formData.form_social_links.some(index =>index?.label === 'Instagram' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Instagram");
                        handleOptionClick("Instagram", 1);
                        handleSocialMediasLinkOptions({label:'Instagram' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Instagram === 2 || formData.form_social_links.some(index =>index?.label === 'Instagram' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Instagram");
                        handleOptionClick("Instagram", 2);
                        handleSocialMediasLinkOptions({label:'Instagram' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Portfolio link</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Portfolio === 0 || formData.form_social_links.some(index =>index?.label === 'Portfolio' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Portfolio");
                        handleOptionClick("Portfolio", 0);
                        handleSocialMediasLinkOptions({label:'Portfolio' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Portfolio === 1 || formData.form_social_links.some(index =>index?.label === 'Portfolio' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Portfolio");
                        handleOptionClick("Portfolio", 1);
                        handleSocialMediasLinkOptions({label:'Portfolio' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Portfolio === 2 || formData.form_social_links.some(index =>index?.label === 'Portfolio' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Portfolio");
                        handleOptionClick("Portfolio", 2);
                        handleSocialMediasLinkOptions({label:'Portfolio' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center bor-bot pb-3">
              <h6>Website</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Website === 0 || formData.form_social_links.some(index =>index?.label === 'Website' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Website");
                        handleOptionClick("Website", 0);
                        handleSocialMediasLinkOptions({label:'Website' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Website === 1 || formData.form_social_links.some(index =>index?.label === 'Website' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Website");
                        handleOptionClick("Website", 1);
                        handleSocialMediasLinkOptions({label:'Website' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Website === 2 || formData.form_social_links.some(index =>index?.label === 'Website' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Website");
                        handleOptionClick("Website", 2);
                        handleSocialMediasLinkOptions({label:'Website' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center pb-4">
              <h6>Facebook</h6>
              <div className="card   width-select selectwraps">
                <div className="card-body p-0">
                  <div className="d-flex justify-content-between ">
                    <div
                      className={`position-relative width-third ${activeFields.Facebook === 0 || formData.form_social_links.some(index =>index?.label === 'Facebook' && index.action === 'Mandatory') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Facebook");
                        handleOptionClick("Facebook", 0);
                        handleSocialMediasLinkOptions({label:'Facebook' , action:'Mandatory'})
                      }}
                    >
                      <div className="">Mandatory</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Facebook === 1 || formData.form_social_links.some(index =>index?.label === 'Facebook' && index.action === 'Optional') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Facebook");
                        handleOptionClick("Facebook", 1);
                        handleSocialMediasLinkOptions({label:'Facebook' , action:'Optional'})
                      }}
                    >
                      <div className="">Optional</div>
                    </div>
                    <div
                      className={`position-relative width-third ${activeFields.Facebook === 2 || formData.form_social_links.some(index =>index?.label === 'Facebook' && index.action === 'off') ? "active" : ""
                        }`}
                      onClick={() => {
                        resetActiveState("Facebook");
                        handleOptionClick("Facebook", 2);
                        handleSocialMediasLinkOptions({label:'Facebook' , action:'off'})
                      }}
                    >
                      <div className="">off</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
}

export default JobFormat;