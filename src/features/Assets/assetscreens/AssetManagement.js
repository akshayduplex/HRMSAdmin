import React, { useState } from 'react';
import GoBackButton from './Goback';
import AssetsTabs from './AssetsTabs.js';
import AddAssetsModal from "./Modals/AddAssetsModal.js"



export default function AssetManagement() {
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <div className="maincontent">
                <div className="container" data-aos="fade-in" data-aos-duration="3000">
                    <GoBackButton />
                    <div class="dflexbtwn">
                        <div class="hrhdng">
                            <h2>Complete Assets Listings</h2>
                            <p>Total Available and Assigned Assets list</p>
                        </div>
                        <button className="bg_purplbtn" onClick={handleShow}>Add Asset</button>
                    </div>
                    <AssetsTabs />
                </div>
            </div>
            <AddAssetsModal show={show} onHide={() => setShow(false)} />

        </>
    );
}
