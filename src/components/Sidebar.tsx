import { Link } from 'react-router-dom';
import { Button } from './ui/button';
export default function Sidebar() {
  const handleLogout = () => {
    localStorage.removeItem('isLogin');
    window.location.href = '/login';
  };

  return (
    <div className="font-bold w-[15rem] h-screen flex flex-col items-center border-r-2 relative">
      <div className="mt-[2rem]">
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

      <Button onClick={handleLogout} className="bg-[#B99470] fixed bottom-5">
        Logout
      </Button>
    </div>
  );
}
