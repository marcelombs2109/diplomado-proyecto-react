import { useState } from "react";
import TodoItem from "./TodoItem";
import { useEffect } from "react";
import {
  getTasks,
  createTask,
  deleteTaskApi,
  toggleTaskApi,
  editTaskApi
} from "./api/tasksApi";



interface Task{
    id: number
    name: string
    done: boolean
    editing?: boolean // solo para control local
}


const TodoList = () => {

    const [tasks,setTasks] = useState<Task[]>([])
    const [text, setText] = useState<string>("")

    useEffect(() => {
        async function loadTasks() {
            const response = await getTasks();

            // Si tu GET devuelve { data: [...] }
            setTasks(response.data.data);
        }

        loadTasks();
    }, []);


    async function addTask(name: string) {
        if (!name.trim()) return;

        const response = await createTask(name);

        const newTask = response.data.data ?? response.data;

        if (!newTask) {
            console.error("La tarea viene undefined");
            return;
        }

        setTasks(prev => [...prev, newTask]);
        setText("");
    }    

    async function deleteTask(id: number) {
        await deleteTaskApi(id);
        setTasks(tasks.filter(task => task.id !== id));
    }


    const toggledone = async (id: number): Promise< void> => {
         try {
            const task = tasks.find(t => t.id === id);
            if (!task) return;

            await toggleTaskApi(id, !task.done);

            setTasks(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, done: !t.done }
                        : t
                )
            );

        } catch (error) {
            console.error("Error al actualizar tarea:", error);
        }
    };


    const editTask = async (id: number, newName: string) => {
        if (!newName.trim()) return;

        try {
            await editTaskApi(id, newName); 

            setTasks(prev =>
                prev.map(task =>
                    task.id === id ? { ...task, name: newName } : task
                )
            );

        } catch (error) {
            console.error("Error al guardar tarea:", error);
        }
    };




    return(
        <>
            <div className="todo-list">

                <div className="form">
                    <input
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Nueva tarea..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                            addTask(text); // agrega la tarea al presionar Enter
                            }
                        }}
                    />
                    <button onClick={() => addTask(text)}>Adicionar Tarea</button>
                </div>

                {tasks.map(task => (
                    <TodoItem
                        key={task.id}
                        task={task}
                        deleteTask={deleteTask}
                        toggledone={toggledone}
                        editTask={editTask}
                    />
                ))}

            </div>

        </>
    )
}

export default TodoList;

