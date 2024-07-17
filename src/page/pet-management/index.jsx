import { TinyColor } from "@ctrl/tinycolor";
import {
  Button,
  ConfigProvider,
  Form,
  Image,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  Upload,
  message,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import "./index.scss"; // Đường dẫn đến file CSS từ file JSX
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
const colors2 = ["#fc6076", "#ff9a44", "#ef9d43", "#e75516"];

const { Title } = Typography;
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function PetManagement() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  const [addForm] = useForm();
  const [editForm] = useForm();

  const handleEditModal = (record) => {
    setEditingPet({ ...record });
    setIsEditing(true);
  };

  const getPresetFileList = () => {
    if (!editingPet || !editingPet.poster) return [];
    return Object.keys(editingPet.poster).map((key) => {
      return {
        uid: key,
        name: editingPet.petName,
        status: "done",
        url: editingPet.poster[key],
      };
    });
  };

  useEffect(() => {
    if (isEditing) {
      setFileList(getPresetFileList());
      editForm.setFieldsValue({
        petName: editingPet.petName,
        category: editingPet.category,
        desc: editingPet.desc,
        poster: getPresetFileList(),
      });
    }
  }, [isEditing, editForm, editingPet, getPresetFileList]);

  const handleUpdate = async (values) => {
    // Chỉ tải lên những file mới thêm và giữ lại URL của những ảnh đã có
    const newFileList = fileList.filter((file) => file.originFileObj);
    const oldFileList = fileList.filter((file) => !file.originFileObj);

    const newImages = await Promise.all(
      newFileList.map((file) => uploadFile(file.originFileObj))
    );
    const oldImages = oldFileList.map((file) => file.url);

    // Lấy tất cả ảnh mới nếu có, nếu không thì giữ lại ảnh cũ
    const updatedImages = [...newImages, ...oldImages].slice(0, 3); // Giả định rằng chỉ có tối đa 3 ảnh

    // Cập nhật thông tin pet với ảnh mới
    const updatedPet = {
      ...editingPet,
      ...values,
      poster: {
        poster1: updatedImages[0] || null,
        poster2: updatedImages[1] || null,
        poster3: updatedImages[2] || null,
      },
    };

    try {
      // Gọi API để cập nhật thông tin pet
      await axios.put(
        `https://662a755267df268010a405bf.mockapi.io/PetManagement/${editingPet.id}`,
        updatedPet
      );

      // Cập nhật thông tin trong state để hiện thị lên UI
      const newDataSource = dataSource.map((item) =>
        item.id === editingPet.id ? updatedPet : item
      );

      setDataSource(newDataSource);
      setIsEditing(false);
      setEditingPet(null);
      setFileList([]);
      message.success("Pet updated successfully!");
    } catch (error) {
      message.error("Failed to update pet. Error: " + error.message);
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => {
    const validFileList = Array.isArray(newFileList) ? newFileList : [];
    setFileList(validFileList);
  };
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const getHoverColors = (colors) =>
    colors.map((color) => new TinyColor(color).lighten(5).toString());

  const getActiveColors = (colors) =>
    colors.map((color) => new TinyColor(color).darken(5).toString());

  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal() {
    setFileList([]);
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  const columns = [
    {
      // Thêm cột số thứ tự
      title: "No.",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: "PetName",
      dataIndex: "petName",
      key: "petName",
      align: "center",
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      render: (values) =>
        values ? formatDistanceToNow(new Date(values)) : null,
    },
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      render: (poster) => <Image src={poster.poster1} width={200} />,
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (key, record) => (
        <div style={{ textAlign: "center" }}>
          <Button
            onClick={() => handleEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Update
          </Button>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={() => handleDelete(key)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const [dataSource, setDataSource] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchPet() {
    const reponse = await axios.get(
      "https://662a755267df268010a405bf.mockapi.io/PetManagement"
    );
    setDataSource(reponse.data);
  }

  useEffect(function () {
    fetchPet();
  }, []);

  function handleOk() {
    addForm.submit();
  }

  async function handleSubmit(values) {
    const posters = await Promise.all(
      fileList.map((file) => uploadFile(file.originFileObj))
    );

    values.poster = {
      poster1: posters[0],
      poster2: posters[1],
      poster3: posters[2],
    };

    values.createAt = new Date();

    try {
      const response = await axios.post(
        "https://662a755267df268010a405bf.mockapi.io/PetManagement",
        values
      );

      setDataSource([...dataSource, response.data]);
      handleCloseModal();
      addForm.resetFields();
      setFileList([]);
      message.success("Pet added successfully!");
    } catch (error) {
      message.error("Failed to add pet!");
    }
  }

  async function handleDelete(key) {
    try {
      await axios.delete(
        `https://662a755267df268010a405bf.mockapi.io/PetManagement/${key}`
      );
      console.log("Deleted successfully:", key);
      const listPet = dataSource.filter((item) => item.id !== key);
      setDataSource(listPet);
      message.success("Click on Yes");
    } catch (error) {
      console.error(
        "Error when deleting pet:",
        error.response || error.message
      );
    }
  }

  return (
    <div className="container">
      <Title>Quản Lí Thú Cưng</Title>
      <Space>
        <ConfigProvider
          theme={{
            components: {
              Button: {
                colorPrimary: `linear-gradient(90deg,  ${colors2.join(", ")})`,
                colorPrimaryHover: `linear-gradient(90deg, ${getHoverColors(
                  colors2
                ).join(", ")})`,
                colorPrimaryActive: `linear-gradient(90deg, ${getActiveColors(
                  colors2
                ).join(", ")})`,
                lineWidth: 0,
              },
            },
          }}
        >
          <Button type="primary" size="large" onClick={handleOpenModal}>
            Add Pet
          </Button>
          <Modal
            title="Pet Management"
            open={isOpen}
            onCancel={handleCloseModal}
            onOk={handleOk}
          >
            <Form form={addForm} onFinish={handleSubmit}>
              <Form.Item
                label={"PetName"}
                name={"petName"}
                rules={[
                  {
                    required: true,
                    message: "please input",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="desc" label="Description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item label="Poster" name="poster">
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onPreview={handlePreview}
                  onChange={handleChange}
                  beforeUpload={() => false}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Edit Pet Details"
            open={isEditing}
            onCancel={() => {
              setIsEditing(false);
              setEditingPet(null);
              editForm.resetFields();
            }}
            onOk={() => {
              editForm
                .validateFields()
                .then((values) => {
                  handleUpdate(values);
                })
                .catch((info) => {
                  console.log("Validate Failed:", info);
                });
            }}
          >
            <Form
              form={editForm}
              layout="vertical"
              initialValues={{
                petName: editingPet?.petName,
                category: editingPet?.category,
                desc: editingPet?.desc,
                poster: editingPet ? getPresetFileList() : [],
              }}
            >
              <Form.Item
                name="petName"
                label="PetName"
                rules={[
                  { required: true, message: "Please input the pet name!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="category"
                label="Category"
                rules={[
                  { required: true, message: "Please select a category!" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item name="desc" label="Description">
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="poster" label="Poster" valuePropName="fileList">
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  onPreview={handlePreview}
                  onChange={handleChange}
                >
                  {fileList.length >= 3 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Form>
          </Modal>
          {previewImage && (
            <Image
              wrapperStyle={{
                display: "none",
              }}
              preview={{
                visible: previewOpen,
                onVisibleChange: (visible) => setPreviewOpen(visible),
                afterOpenChange: (visible) => !visible && setPreviewImage(""),
              }}
              src={previewImage}
            />
          )}
        </ConfigProvider>
      </Space>
      <Table
        dataSource={dataSource}
        columns={columns}
        style={{ width: "80%", margin: "0 auto" }}
      />
    </div>
  );
}

export default PetManagement;
