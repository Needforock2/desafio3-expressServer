import React from 'react'
import './button.css'
import { NavLink } from 'react-router-dom'

export const Button = ({text}) => {
  return (
    <NavLink className='btn btn-light bckg-color-primary' to={`/category/${text.toLowerCase()}`}>{text}</NavLink>
  )
}
