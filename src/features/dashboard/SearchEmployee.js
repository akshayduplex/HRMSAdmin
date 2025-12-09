import React from 'react';
import Form from 'react-bootstrap/Form';
import { IoIosSearch } from "react-icons/io";

const SearchEmployee = () => {


    return (
        <>
            <div className="searchbar">
                <div className="srchbox">
                    <Form>
                        <Form.Group className="searchwrap" controlId="exampleForm.ControlInput1">
                            <IoIosSearch />
                            <Form.Control type="text" placeholder="Search" />
                        </Form.Group>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default SearchEmployee;
