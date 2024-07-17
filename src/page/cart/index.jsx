import { Button, Card, Col, Image, Modal, Row } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import "./index.scss";

function Cart() {
  const [pets, setPets] = useState([]);
  const [detail, setDetail] = useState({});
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal(pet) {
    handleDetail(pet);
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  async function fetchPet() {
    try {
      const response = await axios.get(
        "https://662a755267df268010a405bf.mockapi.io/PetManagement"
      );
      setPets(response.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  }

  function handleDetail(pet) {
    setDetail(pet);
  }

  useEffect(() => {
    fetchPet();
  }, []);

  return (
    <Row gutter={16} style={{ padding: "40px 0px 20px 60px" }}>
      {pets.map((pet) => (
        <Col key={pet.id} className="gutter-row" span={6}>
          <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt={pet.name} src={pet.poster.poster1} />}
          >
            <h2 style={{ textAlign: "center" }}> {pet.petName}</h2>
            <div style={{ textAlign: "center" }}>
              <Button onClick={() => handleOpenModal(pet)}>Detail</Button>
            </div>
          </Card>
        </Col>
      ))}
      <Modal
        centered
        footer={null}
        open={isOpen}
        onCancel={handleCloseModal}
        className="custom"
      >
        <Row>
          <Col span={24}>
            <h2 style={{ textAlign: "center" }}>{detail.petName}</h2>
          </Col>
          <Col span={24}>
            <b>Category:</b> {detail.category}
          </Col>
          <Col span={24}>
            <b>Description:</b> {detail.desc}
          </Col>
          <Col span={24}>
            <Image width={200} src={detail.poster?.poster1} />
          </Col>
        </Row>
      </Modal>
    </Row>
  );
}

export default Cart;
