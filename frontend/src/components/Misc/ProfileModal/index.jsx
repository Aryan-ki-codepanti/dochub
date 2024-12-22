import React from "react";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import maleAvatar from "../../../assets/male.png";
import femaleAvatar from "../../../assets/female.png";
import { GrView } from "react-icons/gr";
import "./ProfileModal.css";

const ProfileModal = ({ user, children }) => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(prev => false);
    const handleOpen = () => setShow(prev => true);
    return (
        <>
            {children ? (
                <span onClick={handleOpen}>{children}</span>
            ) : (
                <GrView
                    className="viewIcon rounded"
                    style={{ cursor: "pointer" }}
                    onClick={handleOpen}
                />
            )}
            <Modal className="profile-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title
                        className="d-flex justify-content-center align-items-center w-100"
                        style={{ fontFamily: "Work Sans", fontSize: "40px" }}
                    >
                        {user.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body
                    className="d-flex flex-column align-items-center justify-content-between pb-5 gap-3"
                    style={{ height: "180px" }}
                >
                    <img
                        src={user.gender === "M" ? maleAvatar : femaleAvatar}
                        className="border border-black"
                        alt={user.name}
                        style={{
                            height: "116px",
                            borderRadius: "50%",
                            aspectRatio: "1",
                            objectFit: "cover"
                        }}
                    />
                    <span className="text-secondary">Email : {user.email}</span>
                </Modal.Body>
                <Modal.Footer className="mt-3">
                    <Button variant="danger" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileModal;

/*

    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>

*/
