import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
});

export const Tabs = ({ defaultValue, children, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsList = ({ children, className = '' }) => {
  return (
    <div className={classNames('flex space-x-4 border-b', className)}>
      {children}
    </div>
  );
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsTrigger = ({ value, children, className = '' }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={classNames(
        'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        isActive 
          ? 'border-blue-500 text-blue-500' 
          : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300',
        className
      )}
    >
      {children}
    </button>
  );
};

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export const TabsContent = ({ value, children, className = '' }) => {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div className={classNames('mt-4', className)}>
      {children}
    </div>
  );
};

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};