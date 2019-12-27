import React, { Component } from "react";
import axios from "axios";
import {
  Input,
  FormGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Button
} from "reactstrap";

class App extends Component {
  state = {
    items: [],
    newItemData: {
      title: "",
      description: "",
      url: ""
    },
    editItemData: {
      id: "",
      title: "",
      description: "",
      url: ""
    }
  };

  componentDidMount() {
    this._refreshItems();
  }

  toggleNewItemModal() {
    this.setState({
      newItemModal: !this.state.newItemModal
    });
  }

  toggleEditItemModal() {
    this.setState({
      editItemModal: !this.state.editItemModal
    });
  }

  addItem() {
    axios.post("/api/add", this.state.newItemData).then(response => {
      let { items } = this.state;
      items.push(response.data);
      this.setState(
        {
          items,
          newItemModal: false,
          newItemData: {
            title: "",
            description: "",
            url: ""
          }
        },
        this._refreshItems()
      );
    });
  }

  updateItem() {
    let { id, title, description, url } = this.state.editItemData;
    console.log("id", id);
    axios
      .put("/api/" + id, {
        title,
        description,
        url
      })
      .then(response => {
        this._refreshItems();
        this.setState({
          editItemModal: false,
          editItemData: { id: "", title: "", description: "", url: "" }
        });
      });
  }

  editItem(id, title, description, url) {
    this.setState({
      editItemData: { id, title, description, url },
      editItemModal: !this.state.editItemModal
    });
  }

  deleteItem(id) {
    axios.delete(`/api/${id}`).then(response => {
      this._refreshItems();
    });
  }

  _refreshItems() {
    console.log("Mounted");
    axios.get("/api").then(data => this.setState(data.data));
  }

  render() {
    let items =
      this.state.items.length &&
      this.state.items.map(item => {
        return (
          <tr key={item.id}>
            <td>{item.title}</td>
            <td>{item.description}</td>
            <td>{item.url}</td>
            <td>
              <Button
                color="success"
                size="sm"
                className="mr-2"
                onClick={this.editItem.bind(
                  this,
                  item.id,
                  item.title,
                  item.description,
                  item.url
                )}
              >
                Edit
              </Button>

              <Button
                color="danger"
                size="sm"
                onClick={this.deleteItem.bind(this, item.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        );
      });
    return (
      <div className="App container">
        <h1>Project Items App</h1>

        <Button
          className="my-3"
          color="primary"
          onClick={this.toggleNewItemModal.bind(this)}
        >
          Add Item
        </Button>

        <Modal
          isOpen={this.state.newItemModal}
          toggle={this.toggleNewItemModal.bind(this)}
        >
          <ModalHeader toggle={this.toggleNewItemModal.bind(this)}>
            Add a new Item
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                id="title"
                value={this.state.newItemData.title}
                onChange={e => {
                  let { newItemData } = this.state;
                  console.log(`This here: ${this.state.newItemData.title}`);
                  newItemData.title = e.target.value;
                  this.setState({ newItemData });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                id="description"
                value={this.state.newItemData.description}
                onChange={e => {
                  let { newItemData } = this.state;
                  newItemData.description = e.target.value;
                  this.setState({ newItemData });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="url">url</Label>
              <Input
                id="url"
                value={this.state.newItemData.url}
                onChange={e => {
                  let { newItemData } = this.state;
                  newItemData.url = e.target.value;
                  this.setState({ newItemData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addItem.bind(this)}>
              Add Item
            </Button>{" "}
            <Button
              color="secondary"
              onClick={this.toggleNewItemModal.bind(this)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.editItemModal}
          toggle={this.toggleEditItemModal.bind(this)}
        >
          <ModalHeader toggle={this.toggleEditItemModal.bind(this)}>
            Edit a new item
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="title">Title</Label>
              <Input
                id="title"
                value={this.state.editItemData.title}
                onChange={e => {
                  let { editItemData } = this.state;
                  editItemData.title = e.target.value;
                  this.setState({ editItemData });
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                id="description"
                value={this.state.editItemData.description}
                onChange={e => {
                  let { editItemData } = this.state;
                  editItemData.description = e.target.value;
                  this.setState({ editItemData });
                }}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateItem.bind(this)}>
              Update Item
            </Button>{" "}
            <Button
              color="secondary"
              onClick={this.toggleEditItemModal.bind(this)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
        <Table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>url</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{items}</tbody>
        </Table>
      </div>
    );
  }
}

export default App;
