import React, { useEffect, useState, useRef } from "react";
import debounce from "lodash/debounce";

import axios from "axios";
import {
  Box,
  Input,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { saveAs } from "file-saver";

function DataTable() {
  const [tableData, setTableData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCapsule, setSelectedCapsule] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedItems, setSelectedItems] = useState([]);
  const [data, setData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  function handleChage(e) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  // Add the UserContact form
  function handleSubmit(e) {
    e.preventDefault();
    console.log(data);
    axios
      .post(`https://contact-app-mern-backend.onrender.com/contacts`, data)
      .then((res) => {
        alert("User added successfully");
        getData();
      });
  }

  // view the UserContact
  async function getData() {
    try {
      const res = await axios.get(
        `https://contact-app-mern-backend.onrender.com/contacts`
      );
      console.log(res.data, "all user data");
      setTableData(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  // Update the UserContact

  function handleEdit(id) {
    try {
      const contactToEdit = tableData.find((e) => e._id === id);
      onOpen();
      axios.put(
        `https://contact-app-mern-backend.onrender.com/contacts/${id}`,
        data
      );
      alert("Contact updated successfully");
      getData();
      onClose();
      setUpdateId(null);
      setData({
        name: contactToEdit.name,
        email: contactToEdit.email,
        phone: contactToEdit.phone,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing contact:", error);
    }
  }

  // delete the UserContact

  function handleDelete(id) {
    try {
      axios
        .delete(`https://contact-app-mern-backend.onrender.com/contacts/${id}`)
        .then((res) => {
          alert("Deleted");
          getData();
        });
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  }

  // search the UserContact by name
  const handleSearch = () => {
    const search = searchText.toLowerCase();
    if (search === "") {
      getData();
    } else {
      const filteredData = tableData.filter((e) => {
        const name = (e.name || "").toLowerCase();
        return name.includes(search);
      });
      console.log(filteredData, "search");
      setTableData(filteredData);
    }
  };
  const debouncedSearch = useRef(debounce(handleSearch, 200));

  // Sort the UserContact by name

  const toggleSortOrder = () => {
    setSortOrder((e) => (e === "asc" ? "desc" : "asc"));
  };

  const sortedTableData = [...tableData].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // generate and download pdf of table UserContact

  const generatePDFDocument = async () => {
    try {
      const blob = await pdf(
        <Document>
          <Page Size="A4">
            <View>
              <Text>Contacts</Text>
            </View>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={styles.tableCol}>
                  <Text>Name</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>Email</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text>Phone</Text>
                </View>
              </View>
              {tableData.map((item, i) => (
                <View style={styles.tableRow} key={i}>
                  <View style={styles.tableCol}>
                    <Text>{item.name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{item.email}</Text>
                  </View>
                  <View style={styles.tableCol}>
                    <Text>{item.phone}</Text>
                  </View>
                </View>
              ))}
            </View>
          </Page>
        </Document>
      ).toBlob();

      // Save the PDF file
      saveAs(blob, "UserContact.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  //select all checkbox Select box functionallity

  const toggleItemSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === tableData.length) {
      setSelectedItems([]);
    } else {
      const allItemIds = tableData.map((item) => item._id);
      setSelectedItems(allItemIds);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // for pdf format styles
  const styles = StyleSheet.create({
    table: {
      display: "table",
      width: "auto",
      borderStyle: "solid",
      borderWidth: 1,
      textAlign: "center",
      fontSize: "13px",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCol: {
      width: "100%",
      borderStyle: "solid",
      borderWidth: 1,
    },
  });

  return (
    <Box className="table-container">
      <div className="taskbar_table">
        <span>
          <h1>Contacts</h1>
        </span>
        <span>
          <input
            type="text"
            placeholder="Search by Name"
            style={{ textAlign: "center" }}
            onChange={(e) => {
              setSearchText(e.target.value);
              debouncedSearch.current(e.target.value);
            }}
          />
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={handleSearch}
            onKeyDown={handleSearch}
            style={{ fontSize: "20px", color: "#0056b3", marginLeft: "-40px" }}
          ></i>
          <i
            className="fa-solid fa-file-arrow-down "
            style={{ fontSize: "20px", color: "white", marginLeft: "40px" }}
            onClick={generatePDFDocument}
          ></i>
          <i
            className="fa-solid fa-user-plus"
            style={{ fontSize: "20px", color: "white", marginLeft: "20px" }}
            onClick={() => {
              setSelectedCapsule();
              onOpen();
            }}
          ></i>
        </span>
      </div>
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedItems.length === tableData.length}
                onChange={handleSelectAll}
                className="custom-checkbox"
              />
            </th>
            <th>PROFILE</th>
            <th>
              NAME{" "}
              <button onClick={toggleSortOrder}>
                {sortOrder === "asc" ? (
                  <i className="fa-solid fa-arrow-up heading_icon"></i>
                ) : (
                  <i className="fa-solid fa-arrow-down heading_icon"></i>
                )}
              </button>
            </th>
            <th>
              EMAIL &nbsp;&nbsp;
              <i className="fa-regular fa-envelope icon"></i>{" "}
            </th>
            <th>
              PHONE &nbsp;&nbsp;
              <i
                className="fa-solid fa-phone icon"
                style={{ color: "white", fontSize: "15px" }}
              ></i>
            </th>
            <th id="table_cra_heding">
              CRA
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </th>
          </tr>
        </thead>

        <tbody className="table-body">
          {sortedTableData.map((e, i) => (
            <tr key={i}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedItems.includes(e._id)}
                  onChange={() => toggleItemSelection(e._id)}
                  className="custom-checkbox"
                />
              </td>

              <td>
                <i
                  style={{
                    fontSize: "27px",
                    marginLeft: "10px",
                    alignItems: "center",
                  }}
                  className="fa-solid fa-circle-user"
                ></i>
              </td>

              <td>{e.name}</td>
              <td>{e.email}</td>
              <td>{e.phone}</td>
              <td style={{ textAlign: "right" }}>
                <i className="fa-regular fa-message icon"></i>
                <i class="fa-brands fa-instagram icon"></i>
                <i class="fa-solid fa-gear icon"></i>
                <i
                  className="fa-regular fa-pen-to-square icon"
                  onClick={() => {
                    onOpen(e.id);
                    handleEdit(e._id);
                  }}
                ></i>
                <i
                  className="fa-regular fa-trash-can icon"
                  onClick={() => handleDelete(e._id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Starts here  */}
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="17%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader backgroundColor="#007BFF" color="white">
            User Details
          </ModalHeader>
          <ModalCloseButton color={"white"} marginTop={"10px"} />
          <ModalBody>
            <Box className="container">
              <form
                action="#"
                method="post"
                onSubmit={(e) => (isEditing ? handleEdit(e) : handleSubmit(e))}
              >
                <Box className="form-group">
                  <label for="name">Name:</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    onChange={(e) => handleChage(e)}
                    required
                  />
                </Box>
                <Box className="form-group">
                  <label for="phone">Phone Number:</label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your Phone Number"
                    onChange={(e) => handleChage(e)}
                    required
                  />
                </Box>
                <Box className="form-group">
                  <label for="email">Email:</label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    onChange={(e) => handleChage(e)}
                    placeholder="Your Email Address"
                    required
                  />
                </Box>
                <Button
                  type="submit"
                  backgroundColor=" #007BFF"
                  color="white"
                  marginRight={"10px"}
                  onClick={onClose}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
                <Button
                  backgroundColor=" #007BFF"
                  color="white"
                  onClick={() => {
                    onClose();
                    setIsEditing(false);
                  }}
                >
                  Close
                </Button>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default DataTable;
