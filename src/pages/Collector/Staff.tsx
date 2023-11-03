import { Box, Button, Divider, List, ListItemButton, ListItemIcon, ListItemText, OutlinedInput } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import useDebounce from '../../hooks/useDebounce';
import axios from 'axios';
import { getLocation } from '../../APICalls/getLocation';

const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search?";

const Staff = () => {

  const [searchText, setSearchText] = useState<string>("");
  const [listPlace, setListPlace] = useState<any[]>([]);
  const debouncedSearchValue:string = useDebounce(searchText,1000)
  const handleSearchTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }
  useEffect(() => {
    if (debouncedSearchValue) {
      getLocation(debouncedSearchValue)
        .then((response) => {
          const result = response.data;
          setListPlace(result);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        })
    } else {
      setListPlace([]);
    }
  }, [debouncedSearchValue]);
   
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <OutlinedInput
        sx={{ width: '50%' }}
        value={searchText}
        onChange={handleSearchTextChange}
      />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
      
      {listPlace.map((item) => (
        <List key={item?.osm_id}>
          <ListItemButton>
            <ListItemIcon>{/* Add your icon component here */}</ListItemIcon>
            <ListItemText>{item?.display_name}</ListItemText>
          </ListItemButton>
          <Divider />
        </List>
      ))}
    </Box>
  </Box>
);
};

export default Staff