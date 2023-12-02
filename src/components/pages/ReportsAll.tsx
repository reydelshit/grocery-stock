import { useEffect, useState } from 'react';
import PageHeader from '../PageHeader';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import axios from 'axios';

type ReportDetails = {
  type: string;
  quantity: number;
  product_name: string;
  product_id: number;
};

type ProductDetails = {
  product_name: string;
  description: string;
  stocks: number;
  expiration_date: string;
  product_image: string;
  supplier_id: number;
  product_id: number;
  supplier_name: string;
};

export default function ReportsAll() {
  const [reports, setReports] = useState<ReportDetails[]>([]);
  const [product, setProduct] = useState<ProductDetails[]>([]);

  const getReports = () => {
    axios
      .get(`${import.meta.env.VITE_GROCERY_STOCK}/reports.php`)
      .then((res) => {
        console.log(res.data);
        setReports(res.data);
      });
  };

  const getAllProducts = () => {
    axios
      .get(`${import.meta.env.VITE_GROCERY_STOCK}/product.php`)
      .then((res) => {
        console.log(res.data, 'prorduct');
        setProduct(res.data);
      });
  };

  useEffect(() => {
    getReports();
    getAllProducts();
  }, []);

  const CalculatePercentage = (product_id: number) => {
    return (
      ((reports
        .filter(
          (prod) => prod.type === 'Stock In' && prod.product_id === product_id,
        )
        .reduce((total, prod) => total + prod.quantity, 0) -
        reports
          .filter(
            (prod) =>
              prod.type === 'Stock Out' && prod.product_id === product_id,
          )
          .reduce((total, prod) => total + prod.quantity, 0)) /
        reports
          .filter(
            (prod) =>
              prod.type === 'Stock In' && prod.product_id === product_id,
          )
          .reduce((total, prod) => total + prod.quantity, 0)) *
      100
    );
  };

  return (
    <div>
      <h1 className="text-3xl text-center my-[2rem] font-bold">
        LIST OF ALL GROCERY REPORTS
      </h1>
      <div className="mt-[2rem] w-[100%]">
        <Table className="border-2 bg-white">
          <TableHeader className="bg-[#B99470] text-white">
            <TableRow>
              <TableHead className="text-white">e</TableHead>

              <TableHead className="text-white">Product Name</TableHead>
              <TableHead className="text-white">Supplier</TableHead>
              <TableHead className="text-white">Current Stocks</TableHead>
              <TableHead className="text-white">Reports</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    className="w-[5rem] rounded-lg h-[5rem] object-cover"
                    src={product.product_image}
                    alt={product.product_name}
                  />
                </TableCell>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.supplier_name}</TableCell>
                <TableCell>
                  {product.stocks} /{' '}
                  {reports
                    .filter(
                      (prod) =>
                        prod.type === 'Stock In' &&
                        prod.product_id === product.product_id,
                    )
                    .reduce((total, prod) => total + prod.quantity, 0)}
                </TableCell>
                <TableCell>
                  {Math.floor(CalculatePercentage(product.product_id))} % Stocks
                  Remaining
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
