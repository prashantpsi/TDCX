import { Avatar, Navbar } from "../style/style";

const Header = ({ user, navigate }) => {
    const logout = () => {
        localStorage.removeItem("userData");
        navigate('/login');
    }

    return (<Navbar className="shadow-sm p-3 mb-4" bg="light" expand="lg">
        <div className="content">
            <div className="profile">
                <Avatar src={user?.image} alt="profile" />
                <span>{user?.token?.name}</span>
            </div>
            <span className="link" onClick={logout}>Logout</span>
        </div>
    </Navbar>)
}

export default Header;