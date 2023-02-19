/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState } from "react";
// import artikel from "../../assets/artikel.png";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import { useParams } from "react-router-dom";
import moment from "moment";

export default function DetailArticle() {

  let { id } = useParams();
  let { data: article } = useQuery("articleeeeCache", async () => {
    const response = await API.get("/article/" + id);
    console.log(response);
    return response.data.data;
  });
  console.log("ini article", article);
  return (
    <div>
      <div
        className="container p-5"
        style={{ marginTop: "10vh", marginRight: "50px" }}
      >
        <h2 className="">{article?.title}</h2>
        <small className="text-muted">
          {moment(article?.createdAt).format("DD MMMM YYYY")}
        </small>
        <p className="mt-1">
          Author:{" "}
          <span style={{ color: "#FF6185" }}>Dr. {article?.user.fullname}</span>
        </p>
        <div className="col-md-12">
          <div className="card shadow p-2 mb-4" style={{ width: "1000px" }}>
            <img
              src={article?.image}
              className="card-img-top img-size-detail"
              alt="Project image"
            />
            <div className="d-flex ms-4">
            <p style={{ color: "#BFBFBF" }}
                      className="p-2 border rounded-pill">
                        {article?.category}
                      </p>
                  </div>
            <div className=" p-5 ">
              <span>{article?.desc}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
