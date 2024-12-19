import React, { useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";

import c from "./AppHeaderLinks.module.css";

import {
    CContainer,
    CDropdown,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CHeader,
    CHeaderNav,
    CHeaderToggler,
    CNavLink,
    CNavItem,
    useColorModes,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
    cilBell,
    cilContrast,
    cilEnvelopeOpen,
    cilList,
    cilMenu,
    cilMoon,
    cilSun,
} from "@coreui/icons";

import { AppHeaderDropdown } from "./header/index";
import { Inertia } from "@inertiajs/inertia";
import PrimaryButton from "@/Components/PrimaryButton";
const AppHeader = () => {
    const headerRef = useRef();
    const { colorMode, setColorMode } = useColorModes(
        "coreui-free-react-admin-template-theme"
    );

    useEffect(() => {
        setColorMode("light");
        document.addEventListener("scroll", () => {
            headerRef.current &&
                headerRef.current.classList.toggle(
                    "shadow-sm",
                    document.documentElement.scrollTop > 0
                );
        });
    }, []);

    return (
        <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
            <CContainer className="border-bottom px-4" fluid>
                <CHeaderNav className="d-none d-md-flex">
                    <CNavItem>
                        <Link
                            className={c.head_link}
                            href={route('home')}
                            style={{ cursor: "pointer" }}
                        >
                            Вернуться на сайт
                        </Link>
                        <Link
                            className={c.head_link}
                            href={route('admin')}
                            style={{ cursor: "pointer" }}
                        >
                            Главная
                        </Link>
                    </CNavItem>
                </CHeaderNav>
                <CHeaderNav>
                    <li className="nav-item py-1">
                        <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                    </li>
                    <CDropdown variant="nav-item" placement="bottom-end">
                        <CDropdownToggle caret={false}>
                            {colorMode === "dark" ? (
                                <CIcon icon={cilMoon} size="lg" />
                            ) : colorMode === "auto" ? (
                                <CIcon icon={cilContrast} size="lg" />
                            ) : (
                                <CIcon icon={cilSun} size="lg" />
                            )}
                        </CDropdownToggle>
                        <CDropdownMenu>
                            <CDropdownItem
                                active={colorMode === "light"}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode("light")}
                            >
                                <CIcon
                                    className="me-2"
                                    icon={cilSun}
                                    size="lg"
                                />{" "}
                                Light
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === "dark"}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode("dark")}
                            >
                                <CIcon
                                    className="me-2"
                                    icon={cilMoon}
                                    size="lg"
                                />{" "}
                                Dark
                            </CDropdownItem>
                            <CDropdownItem
                                active={colorMode === "auto"}
                                className="d-flex align-items-center"
                                as="button"
                                type="button"
                                onClick={() => setColorMode("auto")}
                            >
                                <CIcon
                                    className="me-2"
                                    icon={cilContrast}
                                    size="lg"
                                />{" "}
                                Auto
                            </CDropdownItem>
                        </CDropdownMenu>
                    </CDropdown>
                    <li className="nav-item py-1">
                        <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
                    </li>
                    <AppHeaderDropdown />
                    <PrimaryButton
                        onClick={() => Inertia.post("/admin/logout")}
                    >
                        Выйти из админ панели
                    </PrimaryButton>
                </CHeaderNav>
            </CContainer>
        </CHeader>
    );
};

export default AppHeader;
