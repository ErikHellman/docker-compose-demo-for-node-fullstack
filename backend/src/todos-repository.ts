import { TodoItem } from '@docker-demo/shared'
import {model, Schema} from 'mongoose'

const TodoSchema = new Schema({
    text: String,
    timeStamp: Date
})

const TodoModel = model<TodoItem>('TodoItem', TodoSchema)

export const loadAllTodoItems = async (): Promise<TodoItem[]> => {
    return TodoModel.find({}).exec()
}

export const loadTodoItem = async (todoId: string): Promise<TodoItem | null> => {
    return TodoModel.findById(todoId).exec()
}

export const saveTodoItem = async (todoItem: TodoItem): Promise<void> => {
    const newModel = new TodoModel(todoItem)
    newModel.save()
}

export const deleteTodoItem = async (id: string): Promise<void> => {
    TodoModel.deleteOne({_id: id}).exec()
}
