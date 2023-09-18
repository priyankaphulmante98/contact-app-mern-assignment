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
  const [selecteData, setSelectedData] = useState(null);
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
        onClose();
      })
      .catch((error) => {
        console.error("Error adding contact:", error);
      });
  }

  // View the UserContact
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
  function handleEdit() {
    try {
      setIsEditing(true);
      axios
        .put(
          `https://contact-app-mern-backend.onrender.com/contacts/${updateId}`,
          data
        )
        .then((res) => {
          alert("Contact updated successfully");
          onClose();
          getData();
          setUpdateId(null);
          setData({
            name: "",
            email: "",
            phone: "",
          });
          setIsEditing(false);
        });
    } catch (error) {
      console.error("Error editing contact:", error);
    }
  }

  // Delete the UserContact
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

  // Search the UserContact by name
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

  // Generate and download PDF of table UserContact
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

  // Select all checkbox Select box functionality
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

  // For PDF format styles
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
              setSelectedData();
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
                <i className="fa-brands fa-instagram icon"></i>
                <i className="fa-solid fa-gear icon"></i>
                <i
                  className="fa-regular fa-pen-to-square icon"
                  onClick={() => {
                    setSelectedData();
                    onOpen();
                    setUpdateId(e._id);
                    setData({
                      name: e.name,
                      email: e.email,
                      phone: e.phone,
                    });
                    setIsEditing(true);
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

      {/* Modal Starts here   */}

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
                action=""
                onSubmit={(e) => {
                  e.preventDefault();
                  isEditing ? handleEdit() : handleSubmit(e);
                }}
              >
                <Box className="form-group">
                  <label htmlFor="name">Name:</label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    onChange={(e) => handleChage(e)}
                    value={data.name}
                    required
                  />
                </Box>
                <Box className="form-group">
                  <label htmlFor="phone">Phone Number:</label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="Your Phone Number"
                    onChange={(e) => handleChage(e)}
                    value={data.phone}
                    required
                  />
                </Box>
                <Box className="form-group">
                  <label htmlFor="email">Email:</label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Type Your email"
                    name="email"
                    onChange={(e) => handleChage(e)}
                    value={data.email}
                    required
                  />
                </Box>
                <Button
                  type="submit"
                  backgroundColor=" #007BFF"
                  color="white"
                  marginRight={"10px"}
                >
                  {isEditing ? "Update" : "Submit"}
                </Button>
                <Button
                  backgroundColor=" #007BFF"
                  color="white"
                  onClick={() => {
                    onClose();
                    setIsEditing(false);
                    setUpdateId(null);
                    setData({
                      name: "",
                      email: "",
                      phone: "",
                    });
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
