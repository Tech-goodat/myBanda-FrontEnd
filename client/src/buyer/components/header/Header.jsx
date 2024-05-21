import '../header/header.css'
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Button from '@mui/material/Button';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { ClickAwayListener } from '@mui/base/ClickAwayListener';

import Select from '../selectDrop/select';
import Nav from '../nav/Nav'

import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {NavLink} from 'react-router-dom'
import axios from 'axios'


function Header(props){
    const {cartTotalQuantity} = useSelector(state => state.cart)

    //console.log("from header,",props)

    const [isOpenDropdown, setIsOpenDropdown] = useState(false)
    const headerRef = useRef()
    
    const [categories, setCategories] = useState([])

    useEffect(() => {
        if (props.data.length !== 0) {
            const uniqueCategories = Array.from(new Set(props.data.map(item => item.category)));
            setCategories(uniqueCategories);
        }
    }, [props.data]);

    const categoryImages = {
        homedecor: "/home-decor.png",
        appliances: "/appliances.png",
        toolsandhardware: "/tools.png",
        clothing: "/clothing.png",
        accessories: "/jewelry.png",
        beautyandskincare: "/skin-care.png",
        outdoorgear: "/outdoor-gear.png",
        electronics: "/electronics.png",
        healthandwellness: "/spa.png",
        toysandgames: "/toys.png",
        booksandstationary: "/stationary.png",
        foodandbeverages: "/fast-food.png",
    };


    const countryList = []

    useEffect(() => {
        getCountry('https://countriesnow.space/api/v0.1/countries/')
    },[])

    const getCountry = async(url) => {
        try{
            await axios.get(url).then((res) => {
                if(res !== null ){
                    //console.log(res.data.data)
                    res.data.data.map((item, index) => {
                        countryList.push(item.country)
                        //console.log(item.country)
                    })

                    
                }
            })

        }catch(error){
            console.log(error.message)
        }
    }

    useEffect(() => {
        window.addEventListener("scroll", () => {
            let position = window.pageYOffset;
            //console.log(position)
            if(position> 100){
                headerRef.current.classList.add('fixed')
            }else{
                headerRef.current.classList.remove('fixed')
            }
        })
    }, [])


    return(
        <>
        <div className="headerWrapper" ref={headerRef}>
            <header >
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-2">
                        {/*<img src="logo2.svg" alt="Logo" className='header-logo'/>*/}
                        <NavLink className='header-logo' to='/my_banda'><h1>MyBanda</h1></NavLink>
                        
                    </div>
                    {/* header Search starts here */}
                    <div className="col-sm-5 d-flex align-items-center">
                        {/*<div className="headerSearch d-flex align-items-center">
                            <Select data={categories} placeholder={'All Categories'} icon={false}/>*/}

                            <div className="productSearch d-flex align-items-center">
                                <input type="text" placeholder='Search for products...' />
                                <SearchIcon className='searchIcon cursor'/>
                            </div>
                        
                    </div>
                    {/* header Search ends here */}

                    <div className="col-sm-5 d-flex align-items-center">
                        {/*ml-auto changed to ms-auto bootstrap 5*/}
                        <div className="ms-auto d-flex align-items-center">
                            <div className="countryWrapper">
                                <Select data={countryList} placeholder={'Your Location'} 
                                icon = {<LocationOnOutlinedIcon style={{opacity:'0.5'}}/>}/>
                            </div>
                            <ClickAwayListener onClickAway={()=> setIsOpenDropdown(false)}>
                            <ul className='list list-inline mb-0 headerTabs '>
                                <li className='list-inline-item'>
                                <NavLink to="/my_banda/wishlist" className="nav-link">
                                    <span>
                                        <FavoriteBorderOutlinedIcon className='listIcon'/>
                                        <span className='badge'>6</span>
                                        Wishlist
                                    </span>
                                </NavLink>
                                </li>
                                <li className='list-inline-item'>
                                <NavLink to="/my_banda/cart" className="nav-link">
                                    <span>
                                        <ShoppingCartOutlinedIcon className='listIcon' />
                                        <span className='badge'>{cartTotalQuantity}</span>
                                        Cart
                                    </span>
                                </NavLink>
                                </li>
                                <li className='list-inline-item'>
                                    <span onClick={()=>setIsOpenDropdown(!isOpenDropdown)}>
                                        <PersonOutlineIcon className='listIcon'/>
                                        <span className='badge'>3</span>
                                        Account
                                    </span>
                                    {isOpenDropdown !== false &&
                                        <ul className='dropdownMenu'>
                                            <li><Button className='align-items-center'><PersonOutlineIcon/>My Account</Button></li>
                                            <li><Button><LocationOnOutlinedIcon/>Order Tracking</Button></li>
                                            <li><Button><FavoriteBorderOutlinedIcon/>My Wishlist</Button></li>
                                            <li><Button><TuneOutlinedIcon/>Setting</Button></li>
                                            <li><Button><LogoutOutlinedIcon/>Sign Out</Button></li>

                                        </ul>
                                    }


                                </li>
                            </ul>
                            </ClickAwayListener>
                        </div>
                                
                    </div>
                </div>
            </div>
            </header>

            <Nav categories={categories} categoryImages={categoryImages}/>
        </div>

        <div className="afterHeader">
            
        </div>
        </>
    )

}

export default Header 