import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { GetDesignationList } from '../slices/DesignationDropDown/designationDropDown';
import { useDispatch } from 'react-redux';

function TypeSuggestionSelectDesignation({ handleChanges, designationValue }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedInput] = useDebounce(designationValue, 300);
    const dispatch = useDispatch();


    console.log(designationValue , 'this is HR Designation Data');

    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const data = await dispatch(GetDesignationList(query)).unwrap();
            setOptions(data?.map((item) => item.label));
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (debouncedInput) {
            fetchSuggestions(debouncedInput);
        }
    }, [debouncedInput]);


    const LocationChanges = (event, newValue) => {
        console.log(newValue , 'this is Input change Data');
        if (newValue) {
            handleChanges({ default_hr_designation: newValue })
        }
    };



    return (
        <Autocomplete
            freeSolo
            options={options}
            loading={loading}
            onInputChange={(event, newInputValue) => handleChanges({ default_hr_designation: newInputValue })}
            onChange={LocationChanges}
            value={designationValue || ''}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Or Enter Designation"
                    variant="outlined"
                    sx={{
                        height: 44,
                        "& .MuiOutlinedInput-root": {
                            height: 44,
                            fontSize: "1rem"
                        },
                    }}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}

export default TypeSuggestionSelectDesignation;
