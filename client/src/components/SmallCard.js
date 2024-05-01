import { Link, useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const SmallCard = ({
  p,
  handleProductDelete = (f) => f,
  owner = false,
  showViewMoreButton = true,
}) => {
  const history = useNavigate();
  console.log(p);
  return (
    <>
      <div className="card me-2 p-5 h-100 w-100 flex-1">
        <div className="row no-gutters">
          <div className="col-md-4">
            {p.image && p.image.contentType ? (
              <img
                src={`http://localhost:8080/product/image/${p._id}`}
                alt="Product Image"
                className="card-image img img-fluid"
              />
            ) : (
              <img
                src="https://via.placeholder.com/900x500.png?text=PeakX"
                alt="Default Product Image"
                className="card=image img img-fluid"
              />
            )}
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">
                <>
                  <h3>{p.title} </h3>
                  <span className="float-right text-primary ">$0.00</span>
                </>
              </h3>

              <h6 className="alert alert-info">
                {p.description.length > 300
                  ? `${p.description.substring(0, 300)}...`
                  : p.description}
              </h6>

              <div className="d-flex justify-content-between h4">
                {showViewMoreButton && (
                  <button
                    onClick={() => history(`/product/${p._id}`)}
                    className="btn"
                    style={{
                      backgroundColor: "#12372A",
                      border: "none",
                      fontFamily: "Poppins",
                      color: "white",
                    }}
                  >
                    Show More
                  </button>
                )}
                {owner && (
                  <>
                    <Link to={`/product/edit/${p._id}`}>
                      <EditOutlined className="text-warning" />
                    </Link>
                    <DeleteOutlined
                      onClick={() => handleProductDelete(p._id)}
                      className="text-danger"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SmallCard;
