import React from "react";

function Project_cards({projectData}) {
    return (
        <>
                <div className="card sideproject">
                    <div className="card-body">
                        <div className="dflexbtwn">
                            <span className="status active">{projectData?.status}</span>
                        </div>
                        <h5 className="project_name">{projectData?.designation}</h5>
                        <div className="designation">
                            <p>{projectData?.title}</p>
                        </div>
                        <div className="dflexbtwn positions">
                            <div className="postn">
                                <span>No. of Pos.</span>
                                <p className="color-dblue">{projectData?.no_of_positions ? projectData?.no_of_positions : 0 }</p>
                            </div>
                            <div className="postn">
                                <span>Hired</span>
                                <p className="color-green">{projectData?.hired ? projectData?.hired : 0 }</p>
                            </div>
                            <div className="postn">
                                <span>Available</span>
                                <p className="color-blue">{ parseInt(projectData?.available_vacancy) }</p>
                            </div>
                        </div>
                    </div>
                </div>
        </>
    );
}
export default Project_cards;