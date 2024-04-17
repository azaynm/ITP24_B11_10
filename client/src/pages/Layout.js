import React from 'react'
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <>
            <nav>
                <div class="container-fluid">
                    <div className="row bg-primary">
                        <div className="col-sm">
                        <Link to="/"><div className='text-light'>Home</div></Link>
                        </div>
                        <div className="col-sm">
                        <Link to="/my-account"><div className='text-light'>My Account</div></Link>
                        </div>
                        <div className="col-sm">
                        <Link to="/login"><div className='text-light'>Login</div></Link>
                        </div>
                        <div className="col-sm">
                        <Link to="/register"><div className='text-light'>Register</div></Link>
                        </div>
                    </div>
                </div>
                

            </nav>

            <Outlet />
        </>
    )
}

export default Layout