import { Link } from 'react-router-dom';
import { Button } from './ui/button';
export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    window.location.href = '/login';
  };

  return (
    <div className="font-bold w-[18rem] h-screen flex flex-col items-center relative bg-[#B99470] text-white">
      <div className="mt-[5rem]">
        <Link className="p-2 mb-2 flex items-center gap-2" to="/">
          Dashboard
        </Link>

        <Link className="p-2 mb-2 flex items-center gap-2" to="/product/all">
          Product
        </Link>

        <Link className="p-2 mb-2 flex items-center gap-2" to="/stock">
          Stock
        </Link>

        <Link className="p-2 mb-2 flex items-center gap-2" to="/reports/all">
          Grocery Stock Reports
        </Link>
      </div>

      <Button
        onClick={handleLogout}
        className="bg-white text-black fixed bottom-5 w-[8rem]"
      >
        Logout
      </Button>
    </div>
  );
}
