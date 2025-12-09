import React, { useState, useRef, useEffect } from 'react';

const VerticalEmpTabs = ({ tabs , selectedIndexValue }) => {

    const [activeTab, setActiveTab] = useState(0);
    const tabRefs = useRef([]);
    useEffect(() => {
        if (tabRefs.current[activeTab]) {
            tabRefs.current[activeTab].scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [activeTab]);
    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        // console.log(selectedIndexValue , 'this is Selected')
        if(selectedIndexValue === 0 || selectedIndexValue){
            setActiveTab(selectedIndexValue)
        }
    } , [selectedIndexValue])

    return (
        <div className="row vertical-tabs">
            <div className="col-sm-3">
                <div className="tab-list sideproject_cards">
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            ref={el => tabRefs.current[index] = el}
                            className={`tab ${index === activeTab ? 'active' : ''}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab.title}
                        </div>
                    ))}
                </div>
            </div>
            <div className="col-sm-9">
                <div className="tab-content detailstables">
                    {tabs[activeTab]?.content}
                </div>
            </div>
        </div>
    );
};

export default VerticalEmpTabs;
