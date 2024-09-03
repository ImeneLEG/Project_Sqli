import React ,{useState}  from 'react'
import { useNavigate } from 'react-router-dom'
import { Paper, IconButton, Stack } from '@mui/material'
import { Search } from '@mui/icons-material'

const SearchBar = () => {
  const [searchTerm, setsearchTerm] = useState('')
const navigate=useNavigate()
  const handleSubmit=(e)=>{
    e.preventDefault();
    if(searchTerm){
      navigate(`search/${searchTerm}`)

      setsearchTerm('');
    }
  }
  return (
    <Paper
      component='form'
      onSubmit={handleSubmit}
      sx={{
        borderRadius: 20,
        border: '1px solid #e3e3e3',
        pl: 2,
        boxShadow: 'none',
        mr: { md: 5 },
        maxWidth: { xs: '100%', sm: '300px', md: '500px' },
        margin: '0 auto',
        display: 'flex', // Ensure the container expands to full width
      }}
    >
      <input
        className='search-bar'
        placeholder='Search..'
        value={searchTerm}
        onChange={(e) => {setsearchTerm(e.target.value)}}
        sx={{
          flex: '1', // Allow the input to fill the remaining space
          fontSize: { xs: '14px', sm: '16px', md: '20px' },
          border: 'none', // Remove the border to prevent misalignment on xs devices
          outline: 'none', // Remove the outline on focus
          backgroundColor: 'transparent', // Ensure the background is transparent
        }}
      />
      <IconButton type='submit' sx={{ p: '10px', color: 'red' }}>
        <Search />
      </IconButton>
    </Paper>
  )
}

export default SearchBar;