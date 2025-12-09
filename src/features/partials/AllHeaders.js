import React, { useMemo } from "react";
import TopHeader from "./TopHeader";

const AllHeaders = React.memo(() => {
  return (
    <>
      <TopHeader />
    </>
  );
});

export default AllHeaders;
