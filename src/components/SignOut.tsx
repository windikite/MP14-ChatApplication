import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type SignOutProps = {
    socket: any;
    children?: React.ReactNode;
};

const SignOut: React.FC<SignOutProps> = ({ socket, children }) => {
    const navigate = useNavigate();

    const handleSignout = () => {
        const userName = sessionStorage.getItem("userName") || "Guest";
        socket.emit("signout", { userName }); 
        sessionStorage.removeItem("userName");
        navigate("/");
    };

    return (
        <Button onClick={handleSignout} className="mt-2">
            Sign Out
        </Button>
    );
};

export default SignOut;
