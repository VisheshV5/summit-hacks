import React, { useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";

import "./service.css";
import CurrencyInput from "react-currency-input-field";
import { Progress } from "antd";
import { UploadOutlined, LeftCircleOutlined } from "@ant-design/icons";
import styled, { keyframes } from "styled-components";
import { bounceInRight } from "react-animations";

const bounceAnimation = keyframes`${bounceInRight}`;

const { Option } = Select;

const ServiceCreateForm = ({
  values,
  setValues,
  tags,
  setTags,
  handleChange,
  handleImageChange,
  handleSubmit,
  handleDelete,
  handleAddition,
  handleDrag,
  handleTagClick,
  preview,
  setPreview,
  review,
  setReview,
}) => {
  const { title, description, price, image } = values;
  const [page, setPage] = useState(1);
  const [perc, setPerc] = useState(0);

  const delimiters = [188, 13];
  console.log(price);

  return (
    // <form onSubmit={handleSubmit}>
    //   <div className="form-group">
    //     <label className="btn btn-outline-secondary btn-block m-2 text-left">
    //       Image
    //       <input
    //         type="file"
    //         name="image"
    //         onChange={handleImageChange}
    //         accept="image/*"
    //         hidden
    //       />
    //     </label>

    //     <input
    //       type="text"
    //       name="title"
    //       onChange={handleChange}
    //       placeholder="Name"
    //       className="form-control m-2"
    //       value={title}
    //     />

    //     <textarea
    //       name="description"
    //       onChange={handleChange}
    //       placeholder="Description"
    //       className="form-control m-2"
    //       value={description}
    //     />

    //     <CurrencyInput
    //       className="inputCurrency"
    //       placeholder="Fixed Rate /hr"
    //       decimalsLimit={2}
    //       prefix="$"
    //       onValueChange={(v) => setValues({ ...values, price: v })}
    //     />
    //   </div>

    //   <ReactTags
    //     tags={tags}
    //     // suggestions={suggestions}
    //     delimiters={delimiters}
    //     handleDelete={handleDelete}
    //     handleAddition={handleAddition}
    //     handleDrag={handleDrag}
    //     handleTagClick={handleTagClick}
    //     inputFieldPosition="bottom"
    //     autocomplete
    //   />

    //   <button className="btn btn-outline-primary m-2">Save</button>
    // </form>
    <div className="bg-white">
      <Progress percent={perc} showInfo={false} />
      {page > 1 && (
        <LeftCircleOutlined
          className="h1"
          onClick={() => {
            setPage(page - 1);
            setReview(false);
          }}
        />
      )}
      {page == 1 && (
        <BouncyDiv>
          <h1>Title</h1>
          <h5>
            Include a meaninful title. Something that will grasp someone's
            attention.
          </h5>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            placeholder="Name"
            className="form-control m-2"
            value={title}
          />

          <button
            className="btn btn-blue m-2"
            disabled={title == "" ? true : false}
            onClick={() => {
              setPage(2);
              setPerc(25);
            }}
          >
            Submit
          </button>
        </BouncyDiv>
      )}
      {page == 2 && (
        <BouncyDiv>
          <h1>Description</h1>
          <h5>
            A informative description can make the difference between geting a
            tutee and not.
          </h5>
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Description"
            className="form-control m-2"
            value={description}
          />

          <button
            className="btn btn-blue m-2"
            disabled={description == "" ? true : false}
            onClick={() => {
              setPage(3);
              setPerc(50);
            }}
          >
            Submit
          </button>
        </BouncyDiv>
      )}
      {page == 3 && (
        <BouncyDiv>
          <h1>Price</h1>
          <h5>
            Make sure to set a reasonable price for both you and the tutee.
          </h5>
          <CurrencyInput
            className="inputCurrency"
            placeholder="Fixed Rate /hr"
            decimalsLimit={2}
            prefix="$"
            onValueChange={(v) => setValues({ ...values, price: v })}
          />

          <button
            className="btn btn-blue m-2"
            disabled={price == undefined ? true : false}
            onClick={() => {
              setPage(4);
              setPerc(75);
            }}
          >
            Submit
          </button>
        </BouncyDiv>
      )}

      {page == 4 && (
        <BouncyDiv>
          <div className="d-flex">
            <h1>Upload an Image</h1>{" "}
            {/* {image !== "" && (
              <>
                <div className="col-md-2 ms-auto">
                  <img
                    src={preview}
                    alt="Preview"
                    className="img img-fluid m-2"
                  />
                </div>
              </>
            )} */}
          </div>
          <h5>An appealing image can draw tutees in, giving you the job.</h5>
          {image !== "" && (
            <label className="btn btn-outline-primary btn-block m-2 text-left btn-hover">
              <div className="d-flex">
                {" "}
                <h4 className="text-center mt-1">Change Image</h4>
                <UploadOutlined className="h1 ms-auto mb-1" />
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
            </label>
          )}

          {image == "" && (
            <label className="btn btn-outline-primary btn-block m-2 text-left btn-hover">
              <div className="d-flex">
                {" "}
                <h4 className="text-center mt-1">Select an Image</h4>
                <UploadOutlined className="h1 ms-auto" />
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
            </label>
          )}
          <button
            className="btn btn-blue ms-auto "
            disabled={image == "" ? true : false}
            onClick={() => {
              setPage(5);
              setPerc(100);
              setReview(true);
            }}
          >
            Submit
          </button>
        </BouncyDiv>
      )}
      {page == 5 && (
        <BouncyDiv>
          <h1>Review Service Details</h1>
          <div className="d-flex m-2">
            <h5 className="mt-2 ms-4">Title</h5>
            <input
              type="text"
              name="title"
              onChange={handleChange}
              placeholder="Name"
              className="form-control ms-5"
              value={title}
            />
          </div>

          <div className="d-flex m-2">
            <h5 className="mt-2 ">Description</h5>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="Description"
              className="form-control m-2"
              value={description}
            />
          </div>

          <div className="d-flex m-2">
            <h5 className="mt-2 ms-3">Price</h5>
            <CurrencyInput
              className="inputCurrency1"
              placeholder="Fixed Rate /hr"
              value={price}
              decimalsLimit={2}
              prefix="$"
              onValueChange={(v) => setValues({ ...values, price: v })}
            />
          </div>

          <div className="d-flex m-2">
            <label className="btn btn-outline-primary btn-block m-2 text-left btn-hover">
              <div className="d-flex">
                {" "}
                <h4 className="text-center mt-2">Change Image</h4>
                <UploadOutlined className="h1 ms-auto" />
              </div>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                hidden
              />
            </label>
            <img
              src={preview}
              alt="Preview"
              className="img image-class img-fluid m-2"
            />
          </div>
          <button className="btn btn-blue m-2" onClick={handleSubmit}>
            Submit
          </button>
        </BouncyDiv>
      )}
    </div>
  );
};

const BouncyDiv = styled.div`
  animation: 1s ${bounceAnimation};
`;

export default ServiceCreateForm;
