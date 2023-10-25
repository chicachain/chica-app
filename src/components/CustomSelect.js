import React from 'react';
import { Dropdown } from 'react-bootstrap';
import classNames from 'classnames';

function CustomSelect({
  options,
  onSelect,
  selectedValue,
  defaultText,
  widthAuto,
  placeholder = '선택',
  ...rest
}) {
  return (
    <Dropdown
      className={classNames('custom-select', {
        'w-100': !widthAuto,
      })}
      {...rest}
    >
      <Dropdown.Toggle as="div">
        {selectedValue?.label || placeholder}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options &&
          options.length > 0 &&
          options.map(item => {
            return (
              <Dropdown.Item
                key={item.value}
                eventKey={item.value}
                active={item.value === selectedValue?.value}
                onClick={e => onSelect(item, e)}
                hidden={item?.hidden}
              >
                {item.label}
              </Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default CustomSelect;
