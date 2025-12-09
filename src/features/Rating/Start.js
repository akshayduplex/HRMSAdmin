import React from "react";
import StarRateRoundedIcon from '@mui/icons-material/StarRateRounded';

const Star = ({ selected = false, onClick = () => { } }) => (
    <span className={selected ? "star selected" : "star"} onClick={onClick}>
        <StarRateRoundedIcon />
    </span>
);

export default Star;