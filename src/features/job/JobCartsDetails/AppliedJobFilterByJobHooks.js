import { useMemo } from "react";

export default function useGetCandidateAppliedJobById(paramsId = null, ReduxId = null, Data = []) {
    
    const filteredData = useMemo(() => {
        if (paramsId) {
            console.log(paramsId, "params Id this is Applied Params Id Data");

            let filterData = Data?.applied_jobs?.find((item) => item?.job_id === paramsId);

            console.log(filterData, "this is find Result here To be solve");

            return filterData;
        }

        if (ReduxId) {
            return Data?.applied_jobs?.filter((item) => item?.job_id === ReduxId);
        }

        return [];
    }, [paramsId, ReduxId, Data]);

    return filteredData;
}
