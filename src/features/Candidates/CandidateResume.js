import { React } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import { HiOutlineDocumentText } from "react-icons/hi";
import config from "../../config/config";



export default function CandidateResume({ resume }) {

    return (
        <>
            <div className="cand_resume">
                <h5 className="text-start">Submitted Resume</h5>
                <div className="sitecard pr-0 ps-0">
                    <div className="px-3">
                        <div className="d-flex justify-content-between w-100 ">
                            <div className="d-flex flex-row gap-2 contenter ">
                                <div className="resumer">
                                    <HiOutlineDocumentText />
                                </div>
                                <div>
                                    <h5 className="text-start mb-0">{resume && resume?.name}.pdf</h5>
                                    <span className="d-flex text-start text-secondary">
                                        350 KB
                                    </span>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column gap-2 align-items-center justify-content-center">
                                    <a href={`${config.IMAGE_PATH}${resume && resume?.resume_file}`} target="_blank" rel="noopener noreferrer" download={resume && resume?.resume_file}>
                                        <MdOutlineFileDownload className="fs-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}