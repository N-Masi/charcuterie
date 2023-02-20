import {React, useState} from 'react';
import {CNavbar, CContainer, CNavbarBrand, CNavbarToggler, CCollapse, CNavbarNav, CNavLink, CNavItem} from "@coreui/react"
import "./Bar.css"

function Bar() {
    return (
    <CNavbar className="navigation">
        <CContainer fluid className='brand'>
            <CNavbarBrand href="#" className='link'>CC@B</CNavbarBrand>
        </CContainer>
        <CNavbarNav className="items">
            <CNavItem className='item'>
                <CNavLink href="https://listserv.brown.edu/?SUBED1=CHARCUTERIE" target="_blank" rel="noreferrer" className='link' active>
                    Mailing List
                </CNavLink>
            </CNavItem>
            <CNavItem className='item'>
                <CNavLink href="https://docs.google.com/document/d/130l8zOTL7OrqZNrzcdUyL8Sf6hlWuUrz_XvnYiCnUNc/edit?usp=sharing" target="_blank" rel="noreferrer" className='link' active>
                    Constitution
                </CNavLink>
            </CNavItem>
        </CNavbarNav>
    </CNavbar>
    )
}

export default Bar;