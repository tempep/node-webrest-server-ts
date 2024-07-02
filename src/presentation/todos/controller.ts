import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto } from "../../domain/dtos";
import { UpdateTodoDto } from "../../domain/dtos/todos/update-todo.dto";

export class TodosController {

    constructor() { }

    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `TODO with id ${id} not found` });

    }

    public createTodo = async (req: Request, res: Response) => {
        const [error, data] = CreateTodoDto.create(req.body);

        if ( error ) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: data!
        });

        res.json(todo);

    }

    public updateTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;

        const [error, data] = UpdateTodoDto.create({ ...req.body, id });

        if ( error ) return res.status(400).json({ error });

        const todoToUpdate = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });

        if (!todoToUpdate) return res.status(404).json({ error: `Todo with id ${id} not found` });

        const updatedTodo = await prisma.todo.update({
            where: {
                id: id
            },
            data: data!.values
        });

        res.json(updatedTodo);
    }


    public deleteTodo = async (req: Request, res: Response) => {
        const id = +req.params.id;
        if (isNaN(id)) return res.status(400).json({ error: 'ID argument is not a number' });

        const todoToDelete = await prisma.todo.findUnique({
            where: { id: id }
        });

        if (!todoToDelete) return res.status(404).json({ error: `Todo with id ${id} not found` });

        await prisma.todo.delete({
            where: {
                id: id
            }
        });
        res.json({ message: 'Todo deleted' });
    }


}