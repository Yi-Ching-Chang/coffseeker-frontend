import React, { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeaderDesktop(props) {
  const { navItems, currentRoute, navActions, isTop, isFullScreen } = props
  return (
    <>
      <div className="ed-navbar--desktop d-none d-lg-flex">
        <ul className="ed-navbar__items">
          <li className="ed-navbar__item">
            <Link
              className="ed-navbar__font ed-navbar__logo"
              href="http://localhost:3000/"
            >
              {!isTop || isFullScreen ? (
                <img src="/logo-white.png" alt="logo" />
              ) : (
                <img src="/logo-dark.png" alt="logo" />
              )}
            </Link>
          </li>
          {/* <button
                  className="navbar-toggler"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#navbarSupportedContent"
                  aria-controls="navbarSupportedContent"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div
                  className="collapse navbar-collapse"
                  id="navbarSupportedContent"
                > */}
          <ul className="ed-navbar__items">
            {navItems.map((item) => {
              if (!item.children) {
                return (
                  // 沒有下拉式選單的情況
                  <li className="ed-navbar__item ed-navbar__link" key={item.id}>
                    <a
                      className={`ed-navbar__font ${
                        navItems.find((here) => here.href === currentRoute)
                          ? 'active'
                          : ''
                      }`}
                      aria-current="page"
                      href={item.href}
                    >
                      {item.label}
                    </a>
                  </li>
                )
              }
              // 有下拉式選單 (children) 的情況
              return (
                <li className="nav-item dropdown" key={item.id}>
                  <a
                    className={`nav-link dropdown-toggle ed-navbar__font ${
                      item.children.find((child) => child.href === currentRoute)
                        ? 'active'
                        : ''
                    }`}
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    href="#"
                  >
                    {item.label}
                  </a>
                  <ul className="dropdown-menu">
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <a
                          className={`dropdown-item ${
                            currentRoute === child.href ? 'active' : ''
                          }`}
                          href={child.href}
                        >
                          {child.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </ul>
        <ul className="ed-navbar__actions">
          {navActions.map((action) => (
            <li className="ed-navbar__icon" key={action.id}>
              <Link href={action.href} className="ed-navbar__btn">
                {action.iconMobile}
                {action.tagDesktop}
              </Link>
            </li>
          ))}
          {/* {!isLogin ? null : (
                    <li className="ed-navbar__icon logout-icon">
                      <i
                        className="fas fa-sign-out-alt ed-navbar__font"
                        onClick={handleLogout}
                      ></i>
                    </li>
                  )} */}
        </ul>
      </div>
    </>
  )
}
