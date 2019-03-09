import React from 'react';
import cc from 'classcat';
import './dropdown.css';

export function Dropdown({label, items, selected, onClick, onSelect, isOpen, children}) {
  function handleSelect(event, item) {
    onSelect && onSelect(event, item);
  }
  const classNames = cc(['dropdown', {'show': !!isOpen}]);
  const classNamesMenu = cc(['dropdown-menu', {'show': !!isOpen}]);
  const classNamesButton = cc(['btn btn-secondary dropdown-toggle']);

  return (
    <div className={classNames}>
      <button
        className={classNamesButton}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={onClick}
      >
        {selected ? selected.label || selected.name : label || 'Select'}
      </button>
      <div className={classNamesMenu} aria-labelledby="dropdownMenuButton">
        {items && items.map((item, idx) => {
          return (
            <div key={idx} className="dropdown-item" onClick={event => { handleSelect(event, item); }}>
              {item.label || item.name}
            </div>
          );
        })}
        {children}
      </div>
    </div>
  );
}
