import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ConnectNav from "../components/navs/ConnectNav";
// import DashboardNav from "../components/navs/DashboardNav";
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  FormOutlined,
  FileJpgOutlined,
} from "@ant-design/icons";
import { createConnectAccount } from "../actions/stripe";
import { sellerProducts, deleteProduct } from "../actions/product";
import { toast } from "react-toastify";
import SellerCard from "../components/SellerCard";

const SellerDashboard = () => {
  const { auth } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSellersProducts();
  }, []);

  const loadSellersProducts = async () => {
    let res = await sellerProducts(auth.token);
    setProducts(res.data);
  };

  const handleClick = async () => {
    setLoading(true);
    try {
      let res = await createConnectAccount(auth.token);
      console.log(res);
      window.location.href = res.data;
    } catch (err) {
      toast.error("Stripe connect failed. Please try again.");
      setLoading(false);
    }
  };

  const handleProductDelete = async (productId) => {
    deleteProduct(auth.token, productId).then((res) => {
      toast.success("Product Successfully Deleted");
      loadSellersProducts();
    });
  };
  console.log(products);

  const connected = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-10">
          <h2>Your Products</h2>
        </div>
        <div className="col-md-2">
          {products.length !== 0 && (
            <Link to="/products/new" className="btn btn-primary">
              + Add New
            </Link>
          )}
        </div>
      </div>

      <div className="row">
        {products.map((p) => (
          <SellerCard
            key={p._id}
            p={p}
            owner
            showViewMoreButton={false}
            handleProductDelete={handleProductDelete}
          />
        ))}{" "}
        {products.length == 0 && (
          <div className="no-products">
            <FormOutlined className="h1" />
            <h3>Create your first product</h3>
            <p>Make learning hit home. Start by coming up with an idea.</p>
            <Link to="/products/new" className="btn btn-primary">
              + Add New
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  const notConnected = () => (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 offset-md-3 text-center">
          <div className="p-5 pointer">
            <ShoppingOutlined className="h1" />
            <h4>Setup payouts to post products</h4>
            <p className="lead">
              VaweSomE partners with stripe to transfer earnings to your bank
              account
            </p>
            <button
              disabled={loading}
              onClick={handleClick}
              className="btn btn-primary mb-3"
            >
              {loading ? "Processing..." : "Setup Payouts"}
            </button>
            <p className="text-muted">
              <small>
                You'll be redirected to Stripe to complete the onboarding
                process.
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <>
      <div className="container-fluid bg-seller p-5">
        <ConnectNav seller={true} />
      </div>

      <div className="container-fluid p-4">{/* <DashboardNav /> */}</div>

      {auth &&
      auth.user &&
      auth.user.stripe_seller &&
      auth.user.stripe_seller.charges_enabled
        ? connected()
        : notConnected()}
    </>
  );
};

export default SellerDashboard;
