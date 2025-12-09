import React, { useState } from "react";
import Star from "./Start";

const StarRating = () => {
    const [rating, setRating] = useState(0);

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    selected={index < rating}
                    onClick={() => handleStarClick(index)}
                />
            ))}
        </div>
    );
};

export default StarRating;
