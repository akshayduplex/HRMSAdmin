import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaCheck, FaClock, FaEnvelope, FaFileContract, FaUserCheck, FaHandshake } from 'react-icons/fa';
import './OfferTimelineStepper.css';
import moment from 'moment';

const OfferTimelineStepper = ({ candidateData, compact = false }) => {
  // Static data for demonstration - replace with actual data
  console.log(candidateData , 'this is candidate data');

  let timelineSteps = Array.isArray(candidateData?.progress_data) && candidateData?.progress_data.length && candidateData?.progress_data?.map((item , index) => {
      // robust parsing: try moment, then numeric timestamp, then Date.parse
      let m = moment(item.add_date);
      if (!m.isValid()) {
        const maybeNum = Number(item.add_date);
        if (!isNaN(maybeNum)) {
          m = moment(maybeNum);
        }
      }
      if (!m.isValid()) {
        const parsed = Date.parse(item.add_date);
        if (!isNaN(parsed)) m = moment(parsed);
      }

      const dateStr = m && m.isValid() ? m.format('DD/MM/YYYY') : '';
      const timeStr = m && m.isValid() ? m.format('hh:mm A') : '';

      return {
        id: index + 1,
        title: item.title,
        status: 'completed', // 'completed', 'in_progress', 'pending'
        // keep raw moment for reliable rendering
        momentDate: m,
        date: dateStr,
        time: timeStr,
        verifiedBy: item.add_by_name,
        icon: <FaCheck />,
        description: item.activity,
        details: item.status || 'N/A'
      }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#2e7d32';
      case 'in_progress': return '#ed6c02';
      case 'pending': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <FaCheck />;
      case 'in_progress': return <FaClock />;
      case 'pending': return <FaClock />;
      default: return <FaClock />;
    }
  };

  const renderTooltip = (step) => (
    <Tooltip id={`tooltip-${step.id}`} className="custom-tooltip">
      <div>
        <strong>{step.title}</strong>
        {step.date && (
          <>
            <br />
            <small>{step.date}</small>
          </>
        )}
        {step.verifiedBy && (
          <>
            <br />
            <small>By: {step.verifiedBy}</small>
          </>
        )}
      </div>
    </Tooltip>
  );

  return (
    <div className={`offer-timeline-stepper ${compact ? 'compact' : ''}`}>
      {!compact && <h6 className="mb-3">Approval Process Timeline</h6>}
      <div className="timeline-container">
        { timelineSteps && Array.isArray(timelineSteps) ? timelineSteps?.map((step, index) => (
          <OverlayTrigger
            key={step.id}
            placement="top"
            overlay={renderTooltip(step)}
          >
            <div className="timeline-step">
              <div 
                className={`step-indicator ${step.status}`}
                style={{ backgroundColor: getStatusColor(step.status) }}
              >
                <span className="step-icon">
                  {step.status === 'completed' ? getStatusIcon(step.status) : step.icon}
                </span>
              </div>
              
              {index < timelineSteps.length - 1 && (
                <div 
                  className={`step-connector ${
                    timelineSteps[index + 1].status === 'completed' ? 'completed' : ''
                  }`}
                />
              )}
              
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                <div className="step-description">Remark: {step.description}</div>
                <div className="step-description">Status: {step.details}</div>
                { (step.momentDate && step.momentDate.isValid()) ? (
                  <div className="step-date">
                    {step.momentDate.format('DD/MM/YYYY')} {step.momentDate.format('hh:mm A') && `at ${step.momentDate.format('hh:mm A')}`}
                  </div>
                ) : (step.date && (
                  <div className="step-date">
                    {step.date} {step.time && `at ${step.time}`}
                  </div>
                ))}
                {step.verifiedBy && (
                  <div className="step-verified-by">
                    <small>By: {step.verifiedBy}</small>
                  </div>
                )}
              </div>
            </div>
          </OverlayTrigger>
        )) : <p>No timeline data available</p>}
      </div>
    </div>
  );
};

export default OfferTimelineStepper;
