import React from 'react'
import { Stack } from '@mui/material'
import { categories } from '../utils/constants'
import './SideBar.css'
const selectedCategory='New'
const SideBar = ({selectedCategory,setselectedCategory}) => (
   <Stack
   direction='row'
   sx={{overflowY:'auto',
   height:{sx:'auto',md:'95%'},
   flexDirection:{md:'column'}}}>
{categories.map((category)=>(
  <button
   className='category-btn'

   onClick={()=>setselectedCategory(category.name)}
   style={{
   background:category.name===selectedCategory&& '#fc1503',
   color:'#ffffff',
   display: 'flex',
      alignItems: 'center',}}
      key={category.name}>
      <span style={{ marginRight: '10px' ,
      color:category.name===selectedCategory?'white':'red'
   }}>{category.icon}</span>
      <span style={{opacity:category.name===selectedCategory?'1':'0.8'}}>{category.name}</span>

   </button>
))}
   </Stack>
)

export default SideBar