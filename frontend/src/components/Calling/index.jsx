import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const Calling = ({ callerName }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(prev => false);
    const handleOpen = () => setShow(prev => true);

    return (
        <Modal className="profile-modal" show={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title
                    className="d-flex justify-content-center align-items-center w-100"
                    style={{ fontFamily: "Work Sans", fontSize: "40px" }}
                >
                    Incoming Call
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-secondary">
                <b className="px-1 fs-5">&quot;{callerName}&quot;</b>
                is calling you. Do you want to accept the call?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleClose}>
                    Answer
                </Button>
                <Button variant="danger" onClick={handleClose}>
                    Reject
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Calling;
