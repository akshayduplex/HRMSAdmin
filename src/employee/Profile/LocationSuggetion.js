import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { useDebounce } from 'use-debounce';
import { FetchProjectLocationDropDown } from '../../features/slices/ProjectListDropDown/ProjectListDropdownSlice';
import { useDispatch } from 'react-redux';

function TypeSuggestionSelect({ handleChanges, inDuctionLocation }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [debouncedInput] = useDebounce(inDuctionLocation, 300);
    const dispatch = useDispatch();

    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const data = await dispatch(FetchProjectLocationDropDown(query)).unwrap();
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
        if (newValue) {
            handleChanges({ location: newValue })
        }
    };



    return (
        <Autocomplete
            freeSolo
            options={options}
            loading={loading}
            onInputChange={(event, newInputValue) => handleChanges({ location: newInputValue })}
            onChange={LocationChanges}
            value={inDuctionLocation || ''}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select or Enter"
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

export default TypeSuggestionSelect;
