import React, { useState, useEffect } from "react";
import { IoMdStopwatch } from "react-icons/io";
import { AiOutlineClockCircle } from "react-icons/ai";
import Box from "@mui/material/Box";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { IoCloseSharp } from "react-icons/io5";
import { ImCalendar } from "react-icons/im";

export default function EditManualTime() {
    const [totalTime, setTotalTime] = useState("");

    const [difference, setDifference] = useState("");
    const [inMeal, setInMeal] = useState("");
    const [outMeal, setOutMeal] = useState("");
    const [differenceMeal, setDifferenceMeal] = useState("");

    const [inTime, setInTime] = useState("");
    const [outTime, setOutTime] = useState("");

    const handleInTimeChange = (event) => {
        setInTime(event.target.value);
    };

    const handleOutTimeChange = (event) => {
        setOutTime(event.target.value);
    };

    const handleInTimeChangeMeal = (event) => {
        setInMeal(event.target.value);
    };

    const handleOutTimeChangeMeal = (event) => {
        setOutMeal(event.target.value);
    };
    const toggleDrawer = (newOpen) => () => {
        //setOpen(newOpen);
    };
    //const [open, setOpen] = useState(false);
    useEffect(() => {
        setTotalTime("00:00:00");
        const calculateDifference = () => {
            if (inTime && outTime) {
                // Convert time strings to Date objects
                const [inHours, inMinutes] = inTime.split(":").map(Number);
                const [outHours, outMinutes] = outTime.split(":").map(Number);

                const inDate = new Date();
                inDate.setHours(inHours, inMinutes, 0, 0);

                const outDate = new Date();
                outDate.setHours(outHours, outMinutes, 0, 0);

                // Calculate the difference in milliseconds
                const diffMs = outDate - inDate;

                // Handle the case where "Out" time is earlier than "In" time (next day)
                if (diffMs < 0) {
                    outDate.setDate(outDate.getDate() + 1);
                }

                // Recalculate the difference in milliseconds
                const adjustedDiffMs = outDate - inDate;

                // Convert milliseconds to hours and minutes
                const diffHrs = Math.floor(adjustedDiffMs / (1000 * 60 * 60));
                const diffMins = Math.floor(
                    (adjustedDiffMs % (1000 * 60 * 60)) / (1000 * 60)
                );

                setDifference(`${diffHrs} hours and ${diffMins} minutes`);
            } else {
                setDifference("");
            }
        };

        calculateDifference();
    }, [inTime, outTime]);

    useEffect(() => {
        const calculateDifferenceMeal = () => {
            if (inMeal && outMeal) {
                // Convert time strings to Date objects
                const [inHours, inMinutes] = inMeal.split(":").map(Number);
                const [outHours, outMinutes] = outMeal.split(":").map(Number);

                const inDate = new Date();
                inDate.setHours(inHours, inMinutes, 0, 0);

                const outDate = new Date();
                outDate.setHours(outHours, outMinutes, 0, 0);

                // Calculate the difference in milliseconds
                const diffMs = outDate - inDate;

                // Handle the case where "Out" time is earlier than "In" time (next day)
                if (diffMs < 0) {
                    outDate.setDate(outDate.getDate() + 1);
                }

                // Recalculate the difference in milliseconds
                const adjustedDiffMs = outDate - inDate;

                // Convert milliseconds to hours and minutes
                const diffHrs = Math.floor(adjustedDiffMs / (1000 * 60 * 60));
                const diffMins = Math.floor(
                    (adjustedDiffMs % (1000 * 60 * 60)) / (1000 * 60)
                );

                setDifferenceMeal(`${diffHrs} hours and ${diffMins} minutes`);
            } else {
                setDifferenceMeal("");
            }
        };

        calculateDifferenceMeal();
    }, [inMeal, outMeal]);

    return (
        <>
            <Box className="manualtime_edit" sx={{ width: 500 }} role="presentation">
                <div className="purple-top py-2"></div>
                <div className="container ps-4">
                    <div className="d-flex justify-content-between mt-4 align-items-center">
                        <h5>Edit Manual Time</h5>
                        <IoCloseSharp size={20} onClick={toggleDrawer(false)} />
                    </div>
                    <div className="manual_daybx border-sec p-3 rounded-3 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                                <ImCalendar size={20} />
                                <div className="d-flex flex-column">
                                    <h6 className="mb-0 line-checker">Mon</h6>
                                    <span className="line-checker">
                                        1 April 2024
                                    </span>
                                </div>
                            </div>
                            <div className="status_leave">
                                <p className="tagapprove">Approved</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row mt-3 align-items-center">
                            <div className="col-lg-4">
                                <div className="d-flex timeperiod align-items-center">
                                    <AiOutlineClockCircle />
                                    <span>Regular Time</span>
                                </div>
                            </div>
                            <div className="col-lg-8 ps-0">
                                <div className="d-flex inout_time">
                                    <div className="timeinput">
                                        <input
                                            type="time"
                                            id="appt"
                                            name="appt"
                                            className="ps-text py-1"
                                            value={inTime}
                                            onChange={handleInTimeChange}
                                        />
                                        <div className="timetext1">
                                            <span>In</span>
                                        </div>
                                    </div>
                                    <div className="timeinput">
                                        <input
                                            type="time"
                                            id="end"
                                            name="end"
                                            className="ps-text py-1"
                                            value={outTime}
                                            onChange={handleOutTimeChange}
                                        />
                                        <div className="timetext1">
                                            <span>Out</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-4"></div>
                            <div className="col-lg-8 ps-0">
                                {difference && (
                                    <div className="loggedcolor">
                                        <p>{difference} hours will be logged</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="row mt-3 align-items-center">
                            <div className="col-lg-4">
                                <div className="d-flex timeperiod align-items-center">
                                    <AiOutlineClockCircle />
                                    <span className="fs-15">Meal Break</span>
                                </div>
                            </div>
                            <div className="col-lg-8 ps-0">
                                <div className="d-flex inout_time">
                                    <div className="timeinput">
                                        <input
                                            type="time"
                                            id="appt"
                                            name="appt"
                                            className="ps-text py-1"
                                            value={inMeal}
                                            onChange={handleInTimeChangeMeal}
                                        />
                                        <div className="timetext1">
                                            <span>In</span>
                                        </div>
                                    </div>
                                    <div className="timeinput">
                                        <input
                                            type="time"
                                            id="end"
                                            name="end"
                                            className="ps-text py-1"
                                            value={outMeal}
                                            onChange={handleOutTimeChangeMeal}
                                        />
                                        <div className="timetext1">
                                            <span>Out</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-lg-4"></div>
                            <div className="col-lg-8 ps-0">
                                {differenceMeal && (
                                    <div className="loggedcolor">
                                        <p>{differenceMeal} hours will be logged</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 notebox">
                        <Form.Label htmlFor="inputPassword5">Note</Form.Label>
                        <FloatingLabel controlId="floatingTextarea2" label="Write a note">
                            <Form.Control
                                as="textarea"
                                placeholder="Leave a comment here"
                                style={{ height: "150px" }}
                            />
                        </FloatingLabel>
                    </div>
                    <div className="my-5">
                        <div className="border-sec p-4 rounded-3 mt-3">
                            <div className="d-flex justify-content-between align-items-center total_workhrs">
                                <div className="d-flex flex-row gap-2 justify-content-center align-items-center">
                                    <IoMdStopwatch size={20} />
                                    <div className="d-flex flex-column">
                                        <span>Work hours</span>
                                        <h6>{totalTime}</h6>
                                    </div>
                                </div>
                                <div className="d-flex flex-row gap-4 align-items-center">
                                    <button className="cancelbtn" onClick={toggleDrawer(false)}>Cancel</button>
                                    <button className="btn savebtn">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Box>
        </>
    )
}