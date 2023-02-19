/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import artikel from "../../assets/artikel.png";
import noData from "../../assets/No-data.png";
import { useQuery, useMutation } from "react-query";
import { API } from "../../config/api";
import { UserContext } from "../../context/userContext";
import DeleteData from "../modal/DeleteData";

export default function Article() {
  const [state] = useContext(UserContext);
  const [idDelete, setIdDelete] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Modal Confirm delete data
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let { data: articles, refetch } = useQuery("articlessCache", async () => {
    const response = await API.get("/articles");
    // console.log(response);
    return response.data.data;
  });
  // console.log(articles);

  // For get id article & show modal confirm delete data
  const handleDelete = (id) => {
    setIdDelete(id);
    handleShow();
  };

  // If confirm is true, execute delete data
  const deleteById = useMutation(async (id) => {
    try {
      const config = {
        method: "DELETE",
      };
      await API.delete(`/article/${id}`, config);
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (confirmDelete) {
      // Close modal confirm delete data
      handleClose();
      // execute delete data by id function
      deleteById.mutate(idDelete);
      setConfirmDelete(null);
    }
  }, [confirmDelete]);

  return (
    <>
      {articles?.length != 0 ? (
        <div>
          <h1
            className="text-center mt-3"
            style={{ height: "15vh", color: "#FF6185" }}
          >
            Today's Article
          </h1>
          <div className="row d-flex justify-content-start align-items-center m-2 p-2">
            {/* card map here.. */}
            {articles?.map((item, index) => (
              <div className="col-md-3" key={index}>
                <div className="card shadow p-2 mb-4" style={{ width: "auto" }}>
                  <img
                    src={item.image}
                    className="card-img-top img-size"
                    alt="Project image"
                  />
                  <div className="card-body">
                    <Link className="text-decoration-none text-dark" 
                      to={
                        state.user.listAs == "patient"
                          ? `/patient/detailarticle/${item.id}`
                          : state.user.listAs == "doctor"
                          ? `/doctor/detailarticle/${item.id}`
                          : `/detailarticle/${item.id}`
                      }
                    >
                      <h5 >{item.title}</h5>
                      <span className="desc card-text text-dark ">
                        {item.desc}
                      </span>
                      <div className="mt-2">
                      <span style={{ color: "#BFBFBF" }}
                      className="p-2 border rounded-pill">
                        {item.category}
                      </span>
                      </div>
                    </Link>
                  </div>
                  {state.user.listAs == "doctor" ? (
                    <div class="d-flex gap-1 justify-content-center align-items-center">
                      <Link
                        to={`/doctor/update-article/${item.id}`}
                        style={{ width: "100%" }}
                      >
                        <button
                          className="btn bg-black text-white"
                          style={{ width: "100%" }}
                        >
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          handleDelete(item.id);
                        }}
                        className="btn bg-black text-white"
                        style={{ width: "100%" }}
                      >
                        Delete
                      </button>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h1
            className="text-center mt-3"
            style={{ height: "15vh", color: "#FF6185" }}
          >
            Today's Article
          </h1>
          <div className="text-center">
            {/* <img
              src={noData}
              alt=""
              className="img-fluid"
              style={{ width: "30%" }} */}
            {/* /> */}
            {/* <div className="mb-5">No data article</div> */}
          </div>
        </div>
      )}
      <DeleteData
        setConfirmDelete={setConfirmDelete}
        show={show}
        handleClose={handleClose}
      />
    </>
  );
}
