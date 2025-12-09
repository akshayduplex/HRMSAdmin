// import React, { useEffect, useRef } from "react";
// import $ from "jquery";
// import "datatables.net-dt/css/jquery.dataTables.css"; // DataTables styling
// import "datatables.net"; // Core DataTables library
// import axios from "axios";

// const DataTableServerSide = () => {
//   const tableRef = useRef();

//   useEffect(() => {
//     const fetchData = async (data, callback) => {
//       try {
//         // const response = await axios.post("https://your-backend-api.com/data", {
//         //   draw: data.draw,
//         //   start: data.start,
//         //   length: data.length,
//         //   search: data.search.value,
//         //   order: data.order[0]?.column || 0,
//         //   dir: data.order[0]?.dir || "asc",
//         // });

//         callback({
//           draw: response.data.draw,
//           recordsTotal: response.data.recordsTotal,
//           recordsFiltered: response.data.recordsFiltered,
//           data: response.data.data,
//         });
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         callback({
//           draw: data.draw,
//           recordsTotal: 0,
//           recordsFiltered: 0,
//           data: [],
//         });
//       }
//     };

//     $(tableRef.current).DataTable({
//       serverSide: true,
//       processing: true,
//       ajax: fetchData,
//       columns: [
//         { title: "ID", data: "id" },
//         { title: "Name", data: "name" },
//         { title: "Email", data: "email" },
//         { title: "Actions", data: "actions" },
//       ],
//     });

//     // Cleanup on component unmount
//     return () => {
//       $(tableRef.current).DataTable().destroy(true);
//     };
//   }, []);

//   return <table ref={tableRef} className="display"></table>;
// };

// export default DataTableServerSide;
