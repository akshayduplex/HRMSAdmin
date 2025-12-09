import React, { useEffect } from "react";
import GoBackButton from "./GoBackButton";
import JobCards from "./JobCarts";
import JobPreview from "./JobPreviews";
import AllHeaders from "../../partials/AllHeaders";
import { useSelector, useDispatch } from "react-redux";
import { GetJobListById } from "../../slices/AtsSlices/getJobListSlice";
import { useParams } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
function JobDetails() {
  const dispatch = useDispatch();
  const getJobDetails = useSelector(
    (state) => state.getJobsList.getJobListById
  );
  const { id } = useParams();

  useEffect(() => {
    dispatch(GetJobListById(id));
  }, [dispatch, id]);

  return (
    <>
      {/* <AllHeaders /> */}
      <div className="maincontent">
        <div className="container" data-aos="fade-in" data-aos-duration="3000">
          <GoBackButton />
          <div className="job_details_page">
            <div className="row mt-4">
              <div className="col-lg-12">
                <div className="postedjobs">
                  <div className="d-flex flex-column gap-2 mt-1 scroller-content">
                    {getJobDetails.status === "loading" ? (
                      <div className="d-flex align-content-center justify-content-center">
                        <InfinitySpin
                          visible={true}
                          width="200"
                          color="#4fa94d"
                          ariaLabel="infinity-spin-loading"
                        />
                      </div>
                    ) : (
                      getJobDetails.status === "success" && (
                        <JobCards data={getJobDetails.data} />
                      )
                    )}
                    {/* <JobCards /> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="sitecard px-0 mt-3">
              {getJobDetails.status === "loading" ? (
                <div className="d-flex align-content-center justify-content-center">
                  <InfinitySpin
                    visible={true}
                    width="200"
                    color="#4fa94d"
                    ariaLabel="infinity-spin-loading"
                  />
                </div>
              ) : (
                getJobDetails.status === "success" && (
                  <JobPreview data={getJobDetails.data} />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobDetails;
