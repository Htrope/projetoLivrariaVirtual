import "./styles.css";
import carrinho from "../../assets/carrinho.png";
import icon from "../../assets/Icon.png";
import logo from "../../assets/Logo.png";
import { Link } from "react-router-dom"


export default function Header(){
    return(
        <>
            <header>
                   <div className="logo">
                <Link to='/home'> <img src={logo} alt="Logo" /> </Link>
            </div>
            <div className="links">
                <Link to='/'> <img src={icon} alt="Logo" /> </Link>
                <Link to='#'> <img src={carrinho} alt="Logo" /> </Link>
            </div>
            </header>
             
            
            
        </>
    )
}