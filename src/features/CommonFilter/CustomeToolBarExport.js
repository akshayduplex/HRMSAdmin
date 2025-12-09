import { GridToolbarContainer, GridToolbarQuickFilter, GridToolbarExport } from '@mui/x-data-grid';
import { Button, Box } from "@mui/material";
import axios from 'axios';
import config from '../../config/config';
import { apiHeaderToken } from '../../config/api_header';
import { IoMdDownload } from 'react-icons/io';
import { useLocation } from 'react-router-dom';

const CustomToolbarExport = () => {
  const location = useLocation()

  let url = '';

  switch(location.pathname){
    case '/department':
        url = `getDepartmentList`;
        break;
    case '/add-designation':
        url = `getDesignationList`;
        break;
    case '/division':
    url = `getDivisionList`;
    break;
    case "/state":
        url = `getStateList`;
        break;
    default:
       url = ''
  }

  const exportAllData = async () => {
    try {
      const payload = {
        page_no: 1,
        per_page_record: 10000,
        status: '',
        filter_keyword: ''
      };

      const response = await axios.post(
        `${config.API_URL}${url}`,
        payload,
        apiHeaderToken(config.API_TOKEN)
      );

      const allRows = response.data?.data || [];
      if (allRows.length === 0) {
        alert('No data to export!');
        return;
      }

      // Convert data to CSV format
      const csvContent = [
        ['ID', 'Name', 'Priority', 'Status'],  // CSV headers
        ...allRows.map(row => [row.id, row.name, row.priority, row.status])
      ]
        .map(e => e.join(","))
        .join("\n");

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${url}-list.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting department data:', error);
      alert('Failed to export data.');
    }
  };

  return (
    <GridToolbarContainer>
      <Box display="flex" justifyContent="space-between" width="100%" p={1}>
        <GridToolbarQuickFilter />
        <Box display="flex" gap={1}>
            <Button 
            variant="outlined" 
            startIcon={<IoMdDownload />} 
            onClick={exportAllData}
            >
            Export
            </Button>
        </Box>
      </Box>
    </GridToolbarContainer>
  );
};

export default CustomToolbarExport;
