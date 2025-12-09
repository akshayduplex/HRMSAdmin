import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import { IoIosSearch } from 'react-icons/io';
import { Box } from "@mui/material";


const CustomToolbar = () => (
  <GridToolbarContainer>
      <Box
          sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              padding: "8px 16px",
          }}
      >
          <IoIosSearch size={25} color="gray" />
          <GridToolbarQuickFilter
              placeholder="Search....."
              sx={{
                  flexGrow: 1,
                  "& input": {
                      padding: "8px",
                      fontSize: "14px",
                  },
              }}
          />
      </Box>
  </GridToolbarContainer>
);

export default CustomToolbar