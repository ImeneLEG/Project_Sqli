import React from 'react';
import { Stack } from '@mui/material';
import { categories } from '../utils/constants';
import './SideBar.css';

const SideBar = ({ selectedCategory, setSelectedCategory, isAdmin }) => (
    <Stack
        direction='row'
        sx={{
            overflowY: 'auto',
            height: { sx: 'auto', md: '95%' },
            flexDirection: { md: 'column' }
        }}
    >
        {categories
            .filter(category => !category.adminOnly || isAdmin) // Filter for admin categories
            .map((category) => (
                <button
                    className='category-btn'
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                        background: category.name === selectedCategory ? '#fc1503' : 'transparent',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                    key={category.name}
                >
                    <span
                        style={{
                            marginRight: '10px',
                            color: category.name === selectedCategory ? 'white' : 'red'
                        }}
                    >
                        {category.icon}
                    </span>
                    <span style={{ opacity: category.name === selectedCategory ? '1' : '0.8' }}>
                        {category.name}
                    </span>
                </button>
            ))}
    </Stack>
);

export default SideBar;
