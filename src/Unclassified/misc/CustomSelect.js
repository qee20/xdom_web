import React from 'react';
import Select from 'react-select';

const CustomSelect = ({ options, value, onChange }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 200,
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isSearchable={true}
      styles={customStyles}
      placeholder="Pilih"
    />
  );
};

export default CustomSelect;
