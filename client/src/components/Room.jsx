import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Carousel from "react-bootstrap/Carousel";
import { Link } from "react-router-dom";

function Room({ room, isLoggedIn, fromdate, todate   }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  if (!room) return null; // or a fallback UI

 

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imageurls && room.imageurls[0]} className="smalling" alt="img" />
      </div>
      <div className="col-md-7">
        <h1>{room.name || "No Name"}</h1>
        <b>
          <p>Max Count: {room.maxcount || "N/A"}</p>
          <p>Phone Number: {room.phonenumber || "N/A"}</p>
          <p>Type: {room.type || "N/A"}</p>
        </b>
        <div style={{ float: "right" }}>
          {(fromdate && todate) ? (
            isLoggedIn ? (
              <Link to={`/book/${room._id}/${encodeURIComponent(fromdate)}/${encodeURIComponent(todate)}`}> 
                <button className="btn btn-primary m-2">Book Now</button>
              </Link>
            ) : (
              <button className="btn btn-primary m-2" onClick={handleShow}>
                View Details
              </button>
            )
          ) : (
            <button className="btn btn-primary m-2" onClick={handleShow}>
              View Details
            </button>
          )}
        </div>
      </div>

      <Modal show={show} onHide={handleClose} dialogClassName="custom-modal" size="lg">
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel>
            {room.imageurls && room.imageurls.map((url, idx) => (
              <Carousel.Item key={idx}>
                <img
                  className="modal-carousel-img d-block w-100"
                  src={url}
                  alt={`slide ${idx}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
