import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import { FetchProjectListDropDown } from '../slices/ProjectListDropDown/ProjectListDropdownSlice';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';


const SelectComponent = ({ project }) => {
  const [option, setOption] = useState([]);
  const [loading , setLoading] = useState(false);
  const [cache , setCache] = useState({});

  const dispatch = useDispatch();

  const debouncedFetch = useCallback(
    debounce((input) => {
      dispatch(FetchProjectListDropDown(input))
        .unwrap()
        .then((res) => {
          setLoading(false);
          setOption(res);
          setCache((prev) => {
            return { ...prev, [input]: res }
          })
        })
        .catch((err) => {
          setOption([]);
        });
    }, 500), // Adjust the delay (in milliseconds) as needed
    []
  );

  // This function will be called by the Select component
  const handleInputChange = (input) => {
    if (input) {
      setLoading(true);
      if(cache[input]){
        setLoading(false)
        return  setOption(cache[input])
      }
      debouncedFetch(input);
    } else {
      setLoading(false);
      setOption([]);
    }
  };

  const handleChange = (option) => {
    project(option)
  }

  const handleMenuOpen = () => {
    setLoading(true);
    dispatch(FetchProjectListDropDown("")).unwrap()
      .then((res) => {
        setLoading(false);
        setOption(res)
      })
      .catch(err => {
        setLoading(false);
        setOption([])
      })
  }

  return (
    <Select className='select_project'
      options={option}
      placeholder="Select project"
      styles={{ container: (base) => ({ ...base, width: 250 }) }}
      // isSearchable
      isClearable
      onInputChange={handleInputChange}
      onChange={handleChange}
      onMenuOpen={handleMenuOpen}
      isLoading={loading}
    />
  );
};

export default SelectComponent;
