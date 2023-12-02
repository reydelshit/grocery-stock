import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import dumy from '@/assets/dumy.png';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

type ProductDetails = {
  product_name: string;
  description: string;
  stocks: number;
  expiration_date: string;
  product_image: string;
  supplier_id: number;
  product_id: number;
  supplier_name: string;
  racks: number;
};

type ProductDetailSpecific = {
  product_name: string;
  description: string;
  stocks: number;
  expiration_date: string;
  product_image: string;
  supplier_id: number;
  product_id: number;
  supplier_name: string;
  racks: string;
};

export default function ProductsAll() {
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetails[]>([]);
  const [searchProduct, setSearchProduct] = useState('' as string);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [productID, setProductID] = useState(0 as number);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);

  const [productDetails, setProductDetails] = useState({
    product_name: '',
    description: '',
    stocks: 0,
    expiration_date: '',
    product_image: '',
    supplier_name: '',
  });
  const [productSpecific, setProductSpecific] = useState<
    ProductDetailSpecific[]
  >([]);

  const getAllProducts = () => {
    axios.get('http://localhost/jed-inventory/product.php').then((res) => {
      console.log(res.data, 'prorduct');
      setProduct(res.data);
    });
  };

  const deleteProduct = (id: number) => {
    axios
      .delete('http://localhost/jed-inventory/product.php', {
        data: { product_id: id },
      })
      .then((res) => {
        console.log(res.data);
        getAllProducts();
      });
  };
  useEffect(() => {
    getAllProducts();
  }, []);

  const handleShowUpdateForm = (id: number) => {
    axios
      .get('http://localhost/jed-inventory/product.php', {
        params: {
          product_id: id,
        },
      })
      .then((res) => {
        setProductSpecific(res.data);
        setProductDetails(res.data[0]);
        console.log(res.data, 'spe prorduct');
      });

    setShowUpdateForm(true);
    setProductID(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProductDetails((values) => ({ ...values, [name]: value }));
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .put('http://localhost/jed-inventory/product.php', {
        product_id: productID,
        product_name: productDetails.product_name,
        description: productDetails.description,
        expiration_date: productDetails.expiration_date,
        supplier_name: productDetails.supplier_name,
      })
      .then((res) => {
        console.log(res.data);
        getAllProducts();
      });
  };

  const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const data = new FileReader();
    data.readAsDataURL(e.target.files![0]);

    data.onloadend = () => {
      const base64 = data.result;
      if (base64) {
        setImage(base64.toString());

        // console.log(base64.toString());
      }
    };
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    console.log('dsadas');
    e.preventDefault();
    axios
      .post('http://localhost/jed-inventory/product.php', {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        ...productDetails,
        product_image: image,
      })
      .then((res) => {
        console.log(res.data);

        if (res.data.status === 'success') {
          setShowProductModal(false);
          getAllProducts();
        }
      });
  };

  return (
    <div className="relative">
      {/* <PageHeader
        title="All Products"
        display="false"
        description="Welcome, your centralized hub displaying a comprehensive list of available products, their current stock levels, and essential details for streamlined inventory management."
      /> */}

      <h1 className="text-3xl text-center my-[2rem] font-bold">
        LIST OF ALL GROCERY ITEMS
      </h1>

      <div className="mt-[2rem]">
        <div className="flex justify-end">
          <Input
            onChange={(e) => setSearchProduct(e.target.value)}
            placeholder="Search product.."
            className="w-[20rem] border-[#618264] border-2 mb-2"
          />
          <div className="flex gap-2 mb-2 w-full items-end justify-end">
            <Button
              onClick={() => setShowProductModal(true)}
              className="bg-[#618264]"
            >
              Add Product
            </Button>
            <Button onClick={() => navigate('/stock')} className="bg-[#618264]">
              Add Stock
            </Button>
          </div>
        </div>
        <Table className="border-2 mt-[5rem]">
          <TableHeader className="bg-[#618264] text-white">
            <TableRow>
              <TableHead className="text-white"></TableHead>
              <TableHead className="text-white">Product Name</TableHead>
              <TableHead className="text-white">Supplier</TableHead>

              <TableHead className="text-white">Date Expiration</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Stocks</TableHead>

              <TableHead className="text-white w-[5rem]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {product
              .filter((prod) => prod.product_name.includes(searchProduct))
              .map((prod, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img
                      className="w-[5rem] rounded-lg h-[5rem] object-cover"
                      src={prod.product_image}
                      alt={prod.product_name}
                    />
                  </TableCell>
                  <TableCell>{prod.product_name}</TableCell>
                  <TableCell>{prod.supplier_name}</TableCell>

                  <TableCell>
                    {moment(prod.expiration_date).format('LL')}
                  </TableCell>
                  <TableCell>
                    {prod.stocks > 20 ? 'IN STOCK' : 'OUT OF STOCK'}
                  </TableCell>
                  <TableCell>{prod.stocks}</TableCell>

                  <TableCell className="flex gap-2 w-[20rem] ">
                    <Button
                      onClick={() => deleteProduct(prod.product_id)}
                      className="bg-[#618264]"
                    >
                      Delete
                    </Button>
                    <Button
                      onClick={() => handleShowUpdateForm(prod.product_id)}
                      className="bg-[#618264]"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={() => navigate('/stock')}
                      className="bg-[#618264]"
                    >
                      Add stocks
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {showUpdateForm && (
        <div className="absolute top-0 bg-[#f2f2f0] bg-opacity-75 w-full h-full flex justify-center items-center">
          <form
            onSubmit={handleUpdateProduct}
            className="w-[30rem] border-2 p-4 bg-white rounded-lg"
          >
            <div>
              <Label>Product Name</Label>
              <Input
                defaultValue={productDetails.product_name}
                onChange={handleInputChange}
                name="product_name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input
                defaultValue={productDetails.description}
                onChange={handleInputChange}
                name="description"
              />
            </div>
            <div>
              <Label>Expiration Date</Label>
              <Input
                type="date"
                defaultValue={productDetails.expiration_date}
                onChange={handleInputChange}
                name="expiration_date"
              />
            </div>

            <div>
              <Label>Supplier</Label>
              <Input
                defaultValue={productDetails.supplier_name}
                onChange={handleInputChange}
                name="product_supplier"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowUpdateForm(false)}
                type="submit"
                className="mt-2 bg-[#618264]"
              >
                Cancel
              </Button>

              <Button type="submit" className="mt-2 bg-[#618264]">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}

      {showProductModal && (
        <div className="absolute w-full h-full top-0 z-50 bg-[#f2f2f0] bg-opacity-80 flex justify-center items-center">
          <form
            className="bg-white w-[35rem] h-fit p-4 rounded-md border-[#618264] border-2 mt-[20rem]"
            onSubmit={handleSubmit}
          >
            <div className="mb-2">
              <img
                className="w-[40rem]  h-[25rem] object-cover rounded-lg mb-4"
                src={image! ? image! : dumy}
              />
              <Label>Product Image</Label>
              <Input
                required
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
                name="product_image"
              />
            </div>
            <div>
              <Label>Product Name</Label>
              <Input
                required
                onChange={handleInputChange}
                name="product_name"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Input required onChange={handleInputChange} name="description" />
            </div>

            <div>
              <Label>Starting Stocks</Label>
              <Input required onChange={handleInputChange} name="stocks" />
            </div>

            <div>
              <Label>Expiration</Label>
              <Input
                required
                type="date"
                onChange={handleInputChange}
                name="expiration_date"
              />
            </div>

            <div className="gap-2 flex">
              <Button
                onClick={() => setShowProductModal(false)}
                className="mt-2"
              >
                Cancel
              </Button>
              <Button type="submit" className="mt-2">
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
