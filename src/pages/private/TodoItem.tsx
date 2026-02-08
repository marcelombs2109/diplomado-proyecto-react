import { useState } from "react";

interface Task{
    id: number
    name: string
    done: boolean
}

interface TodoItemProps{
    task: Task;
    deleteTask: (id: number) => void;
    toggledone: (id: number) => void;
    editTask: (id: number, newText: string) => Promise<void>; 
}

const TodoItem = (props: TodoItemProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(props.task.name);

    const handleSave = async () => {
        if (!newText.trim()) return;

        await props.editTask(props.task.id, newText); 
        setIsEditing(false);
    };

    const handleCancel = () => {
        setNewText(props.task.name);
        setIsEditing(false);
    };

    const handleToggle = () => {
        props.toggledone(props.task.id);
    };

    return (
        <div className={`todo-item ${props.task.done ? "done" : ""}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

            <input
                type="checkbox"
                checked={props.task.done}
                onChange={handleToggle}
            />

            {isEditing ? (
                <input
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    style={{ flex: 1 }}
                />
            ) : (
                <p className={props.task.done ? "completed" : ""} style={{ flex: 1 }}>
                    {props.task.name}
                </p>
            )}

            {isEditing ? (
                <>
                    <button onClick={handleSave}>💾</button>
                    <button onClick={handleCancel}>❌</button>
                </>
            ) : (
                <button onClick={() => setIsEditing(true)}>✏️</button>
            )}

            <button onClick={() => props.deleteTask(props.task.id)}>🗑️</button>
        </div>
    );
}

export default TodoItem;
