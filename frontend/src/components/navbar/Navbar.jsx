import React, { useEffect, useState } from 'react'
import "./Navbar.scss"
import { Link, useLocation, useNavigate } from 'react-router-dom';
import newRequest from '../../utils/newRequest';
import { categories } from "../../../data";


const Navbar = () => {
    const [active, setActive] = useState(false);
    const [open, setOpen] = useState(false);

    const { pathname } = useLocation();

    //create initial menuCollapse state using useState hook
    const [menuCollapse, setMenuCollapse] = useState(false)


    const isActive = () => {
        window.scrollY > 0 ? setActive(true) : setActive(false);
    };

    useEffect(() => {
        window.addEventListener("scroll", isActive);
        return () => {
            window.removeEventListener("scroll", isActive);
        };
    }, []);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await newRequest.post("/auth/logout");
            localStorage.setItem("currentUser", null);
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    const goToPage = (category) => {
        navigate(`/gigs?cat=${category}`)

        setMenuCollapse(false)
    }

    const register = (catgory) => {
        navigate(`/register`)
        setMenuCollapse(false)
    }

    const login = (category) => {
        navigate(`/login`)
        setMenuCollapse(false)
    }
    return (
        <>
            <div className={active || pathname !== "/" ? "navbar active" : "navbar"}>
                <div className="container">
                    <div className="logo">
                        <Link to="/" className='link'>
                            <span className="text">
                                <span className='headers'>Oshabz</span>
                                <span className='stereo'>Market Place</span>
                            </span>
                        </Link>
                    </div>
                    <div className="links">
                        <span>Explore</span>
                        <span>English</span>
                        {!currentUser?.isSeller && <span>Become a Seller</span>}
                        {currentUser ? (
                            <div className="user" onClick={() => setOpen(!open)}>
                                <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                                <span>{currentUser?.username}</span>
                                {open && (
                                    <div className="options">
                                        {currentUser.isSeller && (
                                            <>
                                                <Link className="link" to="/mygigs">
                                                    Gigs
                                                </Link>
                                                <Link className="link" to="/add">
                                                    Add New Gig
                                                </Link>
                                            </>
                                        )}
                                        <Link className="link" to="/orders">
                                            Orders
                                        </Link>
                                        <Link className="link" to="/messages">
                                            Messages
                                        </Link>
                                        <Link className="link" onClick={handleLogout}>
                                            Logout
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="link">Sign in</Link>
                                <Link className="link" to="/register">
                                    <button>Join</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {(active || pathname !== "/") && (
                    <>
                        <hr />
                        <div className="menu">
                            {
                                categories.map((category, index) =>
                                (
                                    <Link className="link menuLink" key={index} to={`/gigs?cat=${category.value}`}>
                                        {category.name}
                                    </Link>
                                )
                                )
                            }
                        </div>
                        <hr />
                    </>
                )}
            </div>
            <div className="navbar-mobile">
                <img src="/img/more.png" alt="" onClick={() => setMenuCollapse(true)} />
                <div className="logo">
                    <Link to="/" className='link'>
                        <span className="text">
                            <span className='headers'>Oshabz</span>
                            <span className='stereo'>Market Place</span>
                        </span>
                    </Link>
                </div>
                {currentUser ? (
                    <div className="user" onClick={() => setOpen(!open)}>
                        <img src={currentUser.img || "/img/noavatar.jpg"} alt="" />
                        <span>{currentUser?.username}</span>
                        {open && (
                            <div className="options">
                                {currentUser.isSeller && (
                                    <>
                                        <Link className="link" to="/mygigs">
                                            Gigs
                                        </Link>
                                        <Link className="link" to="/add">
                                            Add New Gig
                                        </Link>
                                    </>
                                )}
                                <Link className="link" to="/orders">
                                    Orders
                                </Link>
                                <Link className="link" to="/messages">
                                    Messages
                                </Link>
                                <Link className="link" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login" className="link">Sign in</Link>
                        <Link className="link" to="/register">
                            <button>Join</button>
                        </Link>
                    </>
                )}
            </div>

            <div id="side-bar" className={menuCollapse ? 'active' : 'de-active'}>
                <div className="container">
                    <img src="/img/close.png" alt="" onClick={() => setMenuCollapse(false)} />
                    <div className="content">
                        <button className="link" onClick={() => register()}>
                            <button>Join</button>
                        </button>
                        <div className="menu">
                            <button to="" onClick={() => login()} className='link'>Sign in</button>
                            {
                                categories.map((category, index) =>
                                (
                                    <button className="link menuLink" key={index} onClick={() => goToPage(category.value)}>
                                        {category.name}
                                    </button>
                                )
                                )
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Navbar