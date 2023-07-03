
import React, { useState, useEffect } from "react";
import axios from "axios";
import './Todo.css'
import { FaCheck } from 'react-icons/fa';

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState(null);
  const [updatedTodo, setUpdatedTodo] = useState("");
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    axios
      .get("https://648af4b017f1536d65ea03f1.mockapi.io/TodoList")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      const todo = {
        todo_name: newTodo,
        todo_desc: "",
        id: todos.length + 1
      };

      axios
        .post("https://648af4b017f1536d65ea03f1.mockapi.io/TodoList", todo)
        .then((response) => {
          setTodos([...todos, response.data]);
          setNewTodo("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const deleteTodo = (id) => {
    axios
      .delete(`https://648af4b017f1536d65ea03f1.mockapi.io/TodoList/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const editTodo = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    setEditingTodo(todoToUpdate);
    setUpdatedTodo(todoToUpdate.todo_name);
  };

  const updateTodo = () => {
    if (updatedTodo.trim() !== "") {
      const updatedTodoObj = { ...editingTodo, todo_name: updatedTodo };

      axios
        .put(
          `https://648af4b017f1536d65ea03f1.mockapi.io/TodoList/${editingTodo.id}`,
          updatedTodoObj
        )
        .then((response) => {
          setTodos(
            todos.map((todo) =>
              todo.id === editingTodo.id ? response.data : todo
            )
          );
          cancelEdit();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setUpdatedTodo("");
  };

  const addTodoCompleted = (id) => {
    const todo = todos.find((x) => x.id === id);
    setCompleted([...completed, todo]);

    axios
      .delete(`https://648af4b017f1536d65ea03f1.mockapi.io/TodoList/${id}`)
      .then(() => {
        setTodos(todos.filter((x) => x.id !== id));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <div className="container">
        <div className="td">
          <h2>Todo List</h2>
          <input type="text" className="taskbtn" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} />
          <button className="atd" onClick={addTodo}>Add</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {editingTodo && editingTodo.id === todo.id ? (
                  <>
                    <input type="text" value={updatedTodo} onChange={(e) => setUpdatedTodo(e.target.value)} />
                    <button className="savebutton" onClick={updateTodo}>Save</button>
                    <button className="cancelbutton" onClick={cancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <div className="ed">
                      {todo.todo_name} - {todo.todo_desc}
                      <div className="icontitle" key={todo.id}>
                        <p className="card_text">{todo.text}</p>
                        <FaCheck onClick={() => addTodoCompleted(todo.id)} className="icon-check-todo" />
                        <button className="deletebtn" onClick={() => deleteTodo(todo.id)}>Delete</button>
                      <button className="editbtn" onClick={() => editTodo(todo.id)}>Edit</button>
                      </div>
                    </div>

                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="Comp">
        <h3 className="title">Completed</h3>
        {completed.map((todo) => (
          <div className="completedcard" key={todo.id}>
            <p className="txt">{todo.todo_name}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Todo;
