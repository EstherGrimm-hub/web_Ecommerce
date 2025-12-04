import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { getSellerApi } from "../../unti/api.js";

const userColumns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'name', width: 200 },
    { field: 'email', headerName: 'Email', width: 220 },
    { field: 'phone', headerName: 'phone', width: 150 },
    { field: 'address', headerName: 'address', width: 150 },
    { field: 'role', headerName: 'role', width: 100 },
    { field: 'createdAt', headerName: 'createdAt', width: 200 },
];

export default function UserDataGridDemo() {


    const [rows, setRows] = useState([]);
  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const users = await getSellerApi(); 
      //console.log("Users:", users);

      setRows(users); 
    } catch (error) {
      console.log(error);
    }
  };

  fetchUsers();
}, []);

    return (
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
                rows={rows}  
                columns={userColumns}
                pageSizeOptions={[5]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 5 } },
                }}
                checkboxSelection
            />
        </Box>
    );
}
