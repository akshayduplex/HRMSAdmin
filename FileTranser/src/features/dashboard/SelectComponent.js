import React from 'react';
import Select from 'react-select';

const SelectComponent = () => {
  const options = [
    { value: 'Project1', label: 'Project 1' },
    { value: 'Project2', label: 'Project 2' },
    { value: 'Project3', label: 'Project 3' },
  ];

  return (
    <Select className='select_project'
      options={options}
      placeholder="Select project"
      isSearchable
    />
  );
};

export default SelectComponent;
