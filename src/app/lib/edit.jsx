"use client";

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Pencil} from "lucide-react";
import ModelFirestore from "@/model/model";
import {Calendar28} from "@/app/lib/Calendar28";

const Model = new ModelFirestore();

export function EditTaskDialog({task, onSave}) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [date, setDate] = useState(task.date || null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await Model.updateTask(task.id, {title, date});
            onSave(task.id, {title, date});
            setOpen(false);
        } catch (err) {
            console.error("Error updating task:", err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary w-auto px-4"
                >
                    <Pencil className="w-4 h-4"/> Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Update your task on the way 🔁
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <Label htmlFor="title">Task</Label>
                    <Input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="update your task before it’s too late 😅"
                    />

                    <Calendar28 setDate={setDate} title="Due Date" date={date}/>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}